import { spawn } from "node:child_process";
import { resolve } from "node:path";

const vite = resolve(
  import.meta.dirname,
  "../../node_modules/.bin",
  process.platform === "win32" ? "vite.cmd" : "vite",
);

const child = spawn(vite, ["--host", "0.0.0.0", "--port", "5173", "--strictPort"], {
  cwd: resolve(import.meta.dirname, ".."),
  env: { ...process.env, VITE_USE_FIREBASE_EMULATORS: "true" },
  stdio: "inherit",
});

child.once("error", (error) => {
  console.error("Could not start the frontend.", error);
  process.exitCode = 1;
});
child.once("exit", (code, signal) => {
  if (signal) process.kill(process.pid, signal);
  else process.exitCode = code ?? 1;
});
