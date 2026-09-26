import { FieldValue } from "firebase-admin/firestore";
import { firestore } from "../config/firebase.js";
import { toIsoString, uniqueStrings } from "../lib/firestore-values.js";

export async function upsertProfile(
  uid: string,
  identity: { email?: string; emailVerified?: boolean; name?: string },
  input: { firstName: string; lastName: string; marketingOptIn: boolean },
) {
  const reference = firestore.doc(`users/${uid}`);
  const exists = (await reference.get()).exists;
  await reference.set(
    {
      id: uid,
      email: identity.email ?? null,
      emailVerified: Boolean(identity.emailVerified),
      firstName: input.firstName,
      lastName: input.lastName,
      displayName: identity.name ?? `${input.firstName} ${input.lastName}`.trim(),
      marketingOptIn: input.marketingOptIn,
      roles: ["CUSTOMER"],
      updatedAt: FieldValue.serverTimestamp(),
      ...(!exists ? { createdAt: FieldValue.serverTimestamp() } : {}),
    },
    { merge: true },
  );
  return getProfile(uid);
}

export async function getProfile(uid: string) {
  const snapshot = await firestore.doc(`users/${uid}`).get();
  if (!snapshot.exists) return null;
  const data = snapshot.data()!;
  return {
    id: uid,
    email: data.email ?? null,
    emailVerified: Boolean(data.emailVerified),
    firstName: data.firstName ?? "",
    lastName: data.lastName ?? "",
    marketingOptIn: Boolean(data.marketingOptIn),
    createdAt: toIsoString(data.createdAt),
    updatedAt: toIsoString(data.updatedAt),
  };
}

export async function getCommerceState(uid: string) {
  const snapshot = await firestore.doc(`users/${uid}/commerce/state`).get();
  const data = snapshot.data();
  const cartLines = data?.cartLines ?? [];
  return {
    wishlist: data?.wishlist ?? [],
    cartLines,
    bagCount: cartLines.reduce(
      (total: number, line: { quantity?: number }) => total + Number(line.quantity ?? 0),
      0,
    ),
  };
}

export async function saveCommerceState(
  uid: string,
  input: {
    wishlist: string[];
    cartLines: Array<{ productId: string; variantId: string; quantity: number }>;
  },
) {
  await firestore.doc(`users/${uid}/commerce/state`).set(
    {
      wishlist: uniqueStrings(input.wishlist),
      cartLines: input.cartLines,
      updatedAt: FieldValue.serverTimestamp(),
    },
    { merge: true },
  );
}

export async function getAddresses(uid: string) {
  const snapshot = await firestore.doc(`users/${uid}/account/addresses`).get();
  return snapshot.data()?.addresses ?? [];
}

export async function saveAddresses(
  uid: string,
  addresses: Array<{
    id: string;
    label: string;
    fullName: string;
    line1: string;
    line2: string;
    city: string;
    region: string;
    postalCode: string;
    country: string;
    phone: string;
    isDefault: boolean;
  }>,
) {
  const defaultIndex = addresses.findIndex((address) => address.isDefault);
  const normalized = addresses.map((address, index) => ({
    ...address,
    isDefault: defaultIndex >= 0 ? index === defaultIndex : index === 0,
  }));
  await firestore.doc(`users/${uid}/account/addresses`).set({
    addresses: normalized,
    updatedAt: FieldValue.serverTimestamp(),
  });
  return normalized;
}
