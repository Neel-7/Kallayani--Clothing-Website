import { getApps, initializeApp } from "firebase/app";
import { connectAuthEmulator, getAuth } from "firebase/auth";

export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const missingKeys = Object.entries(firebaseConfig)
  .filter(([, value]) => !value)
  .map(([key]) => key);

if (missingKeys.length > 0) {
  throw new Error(`Missing Firebase configuration: ${missingKeys.join(", ")}`);
}

export const firebaseApp = getApps()[0] ?? initializeApp(firebaseConfig);
export const auth = getAuth(firebaseApp);

export const firebaseEmulatorConfig = {
  enabled: import.meta.env.DEV && import.meta.env.VITE_USE_FIREBASE_EMULATORS === "true",
  host: import.meta.env.VITE_FIREBASE_EMULATOR_HOST || "127.0.0.1",
  authPort: Number(import.meta.env.VITE_FIREBASE_AUTH_EMULATOR_PORT || 9099),
};

if (firebaseEmulatorConfig.enabled) {
  connectAuthEmulator(
    auth,
    `http://${firebaseEmulatorConfig.host}:${firebaseEmulatorConfig.authPort}`,
    { disableWarnings: true },
  );
}
