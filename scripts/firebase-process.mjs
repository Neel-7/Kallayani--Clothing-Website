import { existsSync } from "node:fs";
import { resolve } from "node:path";

export const projectRoot = resolve(import.meta.dirname, "..");
export const firebaseBin = resolve(
  projectRoot,
  "node_modules",
  ".bin",
  process.platform === "win32" ? "firebase.cmd" : "firebase",
);
export const viteBin = resolve(
  projectRoot,
  "node_modules",
  ".bin",
  process.platform === "win32" ? "vite.cmd" : "vite",
);

export function firebaseProcessEnvironment(overrides = {}) {
  const environment = { ...process.env, ...overrides };
  const androidStudioJava = "/opt/android-studio/jbr";

  // Firebase Emulator Suite requires Java 21+. Android Studio already bundles
  // a compatible runtime on the current development machine.
  if (existsSync(resolve(androidStudioJava, "bin", "java"))) {
    environment.JAVA_HOME = androidStudioJava;
    environment.PATH = `${resolve(androidStudioJava, "bin")}:${environment.PATH ?? ""}`;
  }

  return environment;
}

export const emulatorArguments = [
  "emulators:start",
  "--only",
  "auth,firestore",
  "--project",
  process.env.VITE_FIREBASE_PROJECT_ID || "kallayani-storefront-dev",
];
