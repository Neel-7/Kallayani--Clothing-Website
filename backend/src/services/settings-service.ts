import { FieldValue } from "firebase-admin/firestore";
import { firestore } from "../config/firebase.js";
import type { StoreSettingsInput } from "../schemas/admin.js";

export const defaultStoreSettings: StoreSettingsInput = {
  storeName: "Kallayani",
  supportEmail: "support@kallayani.com",
  supportPhone: "",
  currency: "USD",
  lowStockThreshold: 5,
  standardShippingThreshold: 150,
  standardShippingFee: 12,
  expressShippingFee: 28,
  reservationMinutes: 30,
  orderPrefix: "KAL",
};

export async function getStoreSettings() {
  const snapshot = await firestore.doc("settings/store").get();
  return { ...defaultStoreSettings, ...(snapshot.data() ?? {}) } as StoreSettingsInput;
}

export async function saveStoreSettings(input: StoreSettingsInput, staffUid: string) {
  await firestore.doc("settings/store").set(
    {
      ...input,
      updatedAt: FieldValue.serverTimestamp(),
      updatedBy: staffUid,
    },
    { merge: true },
  );
  return input;
}
