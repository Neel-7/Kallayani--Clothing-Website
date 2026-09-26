import { getApps, initializeApp } from "firebase/app";
import { connectAuthEmulator, getAuth } from "firebase/auth";
import { firebaseConfig, firebaseEmulatorConfig } from "./firebase";

const adminAppName = "kallayani-catalogue-admin";
export const adminFirebaseApp =
  getApps().find((app) => app.name === adminAppName) ?? initializeApp(firebaseConfig, adminAppName);
export const adminAuth = getAuth(adminFirebaseApp);

if (firebaseEmulatorConfig.enabled) {
  connectAuthEmulator(
    adminAuth,
    `http://${firebaseEmulatorConfig.host}:${firebaseEmulatorConfig.authPort}`,
    { disableWarnings: true },
  );
}
