import { applicationDefault, cert, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";
import { env } from "./env.js";

if (env.useEmulators) {
  process.env.FIRESTORE_EMULATOR_HOST ??= "127.0.0.1:8080";
  process.env.FIREBASE_AUTH_EMULATOR_HOST ??= "127.0.0.1:9099";
  process.env.STORAGE_EMULATOR_HOST ??= "http://127.0.0.1:9199";
}

function credentials() {
  if (!env.FIREBASE_SERVICE_ACCOUNT_JSON) return applicationDefault();
  try {
    return cert(JSON.parse(env.FIREBASE_SERVICE_ACCOUNT_JSON));
  } catch {
    throw new Error("FIREBASE_SERVICE_ACCOUNT_JSON must contain valid service-account JSON.");
  }
}

export const firebaseAdminApp =
  getApps()[0] ??
  initializeApp({
    credential: credentials(),
    projectId: env.projectId,
    storageBucket: env.storageBucket,
  });

export const firebaseAuth = getAuth(firebaseAdminApp);
export const firestore = getFirestore(firebaseAdminApp);
export const storageBucket = getStorage(firebaseAdminApp).bucket();
