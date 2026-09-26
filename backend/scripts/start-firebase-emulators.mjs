import { spawn } from "node:child_process";
import {
  emulatorArguments,
  firebaseBin,
  firebaseProcessEnvironment,
  projectRoot,
} from "./firebase-process.mjs";

const emulator = spawn(firebaseBin, emulatorArguments, {
  cwd: projectRoot,
  env: firebaseProcessEnvironment(),
  stdio: "inherit",
});

emulator.on("error", (error) => {
  console.error("Could not start the Firebase emulators.", error);
  process.exitCode = 1;
});

emulator.on("exit", (code, signal) => {
  if (signal) process.kill(process.pid, signal);
  else process.exitCode = code ?? 1;
});
