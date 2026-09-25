import { getApps, initializeApp } from "firebase/app";
import { connectAuthEmulator, getAuth } from "firebase/auth";
import { connectFirestoreEmulator, getFirestore } from "firebase/firestore";
import { connectStorageEmulator, getStorage } from "firebase/storage";
import { firebaseConfig, firebaseEmulatorConfig } from "./firebase";

const adminAppName = "kallayani-catalogue-admin";
export const adminFirebaseApp =
  getApps().find((app) => app.name === adminAppName) ?? initializeApp(firebaseConfig, adminAppName);
export const adminDb = getFirestore(adminFirebaseApp);
export const adminAuth = getAuth(adminFirebaseApp);
export const adminStorage = getStorage(adminFirebaseApp);

if (firebaseEmulatorConfig.enabled) {
  connectFirestoreEmulator(
    adminDb,
    firebaseEmulatorConfig.host,
    firebaseEmulatorConfig.firestorePort,
  );
  connectAuthEmulator(
    adminAuth,
    `http://${firebaseEmulatorConfig.host}:${firebaseEmulatorConfig.authPort}`,
    { disableWarnings: true },
  );
  connectStorageEmulator(
    adminStorage,
    firebaseEmulatorConfig.host,
    firebaseEmulatorConfig.storagePort,
  );
}
