import {
  EmailAuthProvider,
  GoogleAuthProvider,
  browserLocalPersistence,
  createUserWithEmailAndPassword,
  linkWithCredential,
  sendEmailVerification,
  sendPasswordResetEmail,
  reload,
  setPersistence,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
  type User,
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import { customerApi } from "@/store/customer-api";
import { hydrateShop, store, type ShopState } from "@/store/store";
import { mergeCommerceStates } from "@/store/commerce-merge";
import type { AuthRepository, AuthUser, RegisterInput } from "./auth-repository";

function splitName(user: User) {
  const parts = user.displayName?.trim().split(/\s+/) ?? [];
  return { firstName: parts[0] ?? "", lastName: parts.slice(1).join(" ") };
}

export function mapFirebaseUser(user: User): AuthUser {
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
  let marketingOptIn = false;
  try {
    const existing = await store
      .dispatch(
        customerApi.endpoints.getProfile.initiate(undefined, {
          subscribe: false,
          forceRefetch: true,
        }),
      )
      .unwrap();
    marketingOptIn = existing?.marketingOptIn ?? false;
  } catch {
    marketingOptIn = false;
  }
  await store
    .dispatch(
      customerApi.endpoints.upsertProfile.initiate({
        firstName: firstName ?? fallbackName.firstName,
        lastName: lastName ?? fallbackName.lastName,
        marketingOptIn,
      }),
    )
    .unwrap();
}

async function mergeAnonymousCommerce(anonymousShop: ShopState | null) {
  if (!anonymousShop) return;
  try {
    const remote = await store
      .dispatch(
        customerApi.endpoints.getCommerce.initiate(undefined, {
          subscribe: false,
          forceRefetch: true,
        }),
      )
      .unwrap();
    const merged = mergeCommerceStates(anonymousShop, remote, true);
    store.dispatch(hydrateShop(merged));
    await store.dispatch(customerApi.endpoints.saveCommerce.initiate(merged)).unwrap();
  } catch (error) {
    console.error("The anonymous cart could not be merged after sign-in.", error);
  }
}

async function login(email: string, password: string) {
  const anonymousShop = auth.currentUser?.isAnonymous ? store.getState().shop : null;
  await setPersistence(auth, browserLocalPersistence);
  const credential = await signInWithEmailAndPassword(auth, email, password);
  await mergeAnonymousCommerce(anonymousShop);
  await persistProfile(credential.user);
  return mapFirebaseUser(credential.user);
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
  return mapFirebaseUser(credential.user);
}

async function loginWithGoogle() {
  const anonymousShop = auth.currentUser?.isAnonymous ? store.getState().shop : null;
  await setPersistence(auth, browserLocalPersistence);
  const credential = await signInWithPopup(auth, new GoogleAuthProvider());
  await mergeAnonymousCommerce(anonymousShop);
  await persistProfile(credential.user);
  return mapFirebaseUser(credential.user);
}

async function resendEmailVerification() {
  const user = auth.currentUser;
  if (!user || user.isAnonymous) throw new Error("Sign in to verify your email address.");
  await sendEmailVerification(user);
}

async function refreshUser() {
  const user = auth.currentUser;
  if (!user || user.isAnonymous) throw new Error("Sign in to continue.");
  await reload(user);
  await user.getIdToken(true);
  return mapFirebaseUser(user);
}

async function updateName(firstName: string, lastName: string) {
  const user = auth.currentUser;
  if (!user || user.isAnonymous) throw new Error("Sign in to continue.");
  await updateProfile(user, { displayName: `${firstName} ${lastName}`.trim() });
  return mapFirebaseUser(user);
}

export const firebaseAuthRepository: AuthRepository = {
  login,
  register,
  loginWithGoogle,
  sendPasswordReset: (email) => sendPasswordResetEmail(auth, email),
  sendEmailVerification: resendEmailVerification,
  refreshUser,
  updateName,
  logout: () => signOut(auth),
};
