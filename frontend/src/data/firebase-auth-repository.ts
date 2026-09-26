import {
  EmailAuthProvider,
  GoogleAuthProvider,
  browserLocalPersistence,
  createUserWithEmailAndPassword,
  linkWithCredential,
  sendEmailVerification,
  sendPasswordResetEmail,
  setPersistence,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
  type User,
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import { customerApi } from "@/store/customer-api";
import { store } from "@/store/store";
import type { AuthRepository, AuthUser, RegisterInput } from "./auth-repository";

function splitName(user: User) {
  const parts = user.displayName?.trim().split(/\s+/) ?? [];
  return { firstName: parts[0] ?? "", lastName: parts.slice(1).join(" ") };
}

function mapUser(user: User): AuthUser {
  const name = splitName(user);
  return {
    id: user.uid,
    email: user.email,
    firstName: name.firstName,
    lastName: name.lastName,
    emailVerified: user.emailVerified,
  };
}

async function persistProfile(user: User, firstName?: string, lastName?: string) {
  const fallbackName = splitName(user);
  await store
    .dispatch(
      customerApi.endpoints.upsertProfile.initiate({
        firstName: firstName ?? fallbackName.firstName,
        lastName: lastName ?? fallbackName.lastName,
        marketingOptIn: false,
      }),
    )
    .unwrap();
}

async function login(email: string, password: string) {
  await setPersistence(auth, browserLocalPersistence);
  const credential = await signInWithEmailAndPassword(auth, email, password);
  await persistProfile(credential.user);
  return mapUser(credential.user);
}

async function register(input: RegisterInput) {
  await setPersistence(auth, browserLocalPersistence);
  const emailCredential = EmailAuthProvider.credential(input.email, input.password);
  const credential = auth.currentUser?.isAnonymous
    ? await linkWithCredential(auth.currentUser, emailCredential)
    : await createUserWithEmailAndPassword(auth, input.email, input.password);

  await updateProfile(credential.user, {
    displayName: `${input.firstName} ${input.lastName}`.trim(),
  });
  await persistProfile(credential.user, input.firstName, input.lastName);
  if (!credential.user.emailVerified) await sendEmailVerification(credential.user);
  return mapUser(credential.user);
}

async function loginWithGoogle() {
  await setPersistence(auth, browserLocalPersistence);
  const credential = await signInWithPopup(auth, new GoogleAuthProvider());
  await persistProfile(credential.user);
  return mapUser(credential.user);
}

export const firebaseAuthRepository: AuthRepository = {
  login,
  register,
  loginWithGoogle,
  sendPasswordReset: (email) => sendPasswordResetEmail(auth, email),
  logout: () => signOut(auth),
};
