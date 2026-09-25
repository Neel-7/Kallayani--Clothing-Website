import { spawn } from "node:child_process";
import { setTimeout as delay } from "node:timers/promises";
import {
  emulatorArguments,
  firebaseBin,
  firebaseProcessEnvironment,
  projectRoot,
  viteBin,
} from "./firebase-process.mjs";

const emulatorHubUrl = "http://127.0.0.1:4400/emulators";
const children = new Set();
let shuttingDown = false;

function start(command, argumentsList, options = {}) {
  const child = spawn(command, argumentsList, {
    cwd: projectRoot,
    stdio: "inherit",
    ...options,
  });
  children.add(child);
  child.once("exit", () => children.delete(child));
  return child;
}

async function emulatorIsReady() {
  try {
    const response = await fetch(emulatorHubUrl);
    if (!response.ok) return false;
    const emulators = await response.json();
    return Boolean(emulators.firestore && emulators.auth);
  } catch {
    return false;
  }
}

async function waitForEmulators(timeoutMs = 60_000) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    if (await emulatorIsReady()) return;
    await delay(500);
  }
  throw new Error("Firebase emulators did not become ready within 60 seconds.");
}

function waitForExit(child, label) {
  return new Promise((resolvePromise, rejectPromise) => {
    child.once("error", rejectPromise);
    child.once("exit", (code, signal) => {
      if (code === 0) resolvePromise();
      else rejectPromise(new Error(`${label} exited with ${signal ?? `code ${code}`}.`));
    });
  });
}

function stopChildren(signal = "SIGTERM") {
  if (shuttingDown) return;
  shuttingDown = true;
  for (const child of children) {
    if (!child.killed) child.kill(signal);
  }
}

process.once("SIGINT", () => stopChildren("SIGINT"));
process.once("SIGTERM", () => stopChildren("SIGTERM"));
process.once("exit", () => stopChildren());

try {
  let emulator;
  if (!(await emulatorIsReady())) {
    console.log("Starting the local Firebase Auth and Firestore emulators...");
    emulator = start(firebaseBin, emulatorArguments, {
      env: firebaseProcessEnvironment(),
    });
    emulator.once("exit", (code) => {
      if (!shuttingDown && code !== 0) {
        console.error(`Firebase emulators stopped unexpectedly (code ${code}).`);
      }
    });
  } else {
    console.log("Using the Firebase emulators already running on this computer.");
  }

  await waitForEmulators();

  console.log("Restoring the Kallayani catalogue in local Firestore...");
  const seed = start(
    process.execPath,
    ["--env-file=.env.local", "--import", "tsx", "scripts/seed-firestore.ts"],
    {
      env: firebaseProcessEnvironment({
        FIRESTORE_EMULATOR_HOST: "127.0.0.1:8080",
      }),
    },
  );
  await waitForExit(seed, "Catalogue seed");

  console.log("Starting Kallayani at http://localhost:5173 ...");
  const vite = start(viteBin, ["--host", "0.0.0.0", "--port", "5173", "--strictPort"], {
    env: {
      ...process.env,
      VITE_USE_FIREBASE_EMULATORS: "true",
    },
  });
  await waitForExit(vite, "Vite");
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
} finally {
  stopChildren();
}
