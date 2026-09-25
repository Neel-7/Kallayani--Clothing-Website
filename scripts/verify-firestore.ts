import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { applicationDefault, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

const projectId = process.env.VITE_FIREBASE_PROJECT_ID;
if (!projectId) throw new Error("VITE_FIREBASE_PROJECT_ID is missing.");

const app =
  getApps()[0] ??
  initializeApp({
    ...(process.env.FIRESTORE_EMULATOR_HOST ? {} : { credential: applicationDefault() }),
    projectId,
  });
const db = getFirestore(app);

const expectedCounts = {
  products: 41,
  collections: 6,
  banners: 4,
  homeCategories: 8,
  editorialFeatures: 3,
};

const actualCounts = Object.fromEntries(
  await Promise.all(
    Object.keys(expectedCounts).map(async (collectionName) => {
      const snapshot = await db.collection(collectionName).get();
      return [collectionName, snapshot.size];
    }),
  ),
);

for (const [collectionName, expected] of Object.entries(expectedCounts)) {
  const actual = actualCounts[collectionName];
  if (actual !== expected) {
    throw new Error(`${collectionName}: expected ${expected} documents, found ${actual}.`);
  }
}

const products = await db.collection("products").get();
for (const product of products.docs) {
  const data = product.data();
  for (const field of ["id", "slug", "title", "primaryImageUrl", "priceFrom", "collectionSlug"]) {
    if (data[field] === undefined || data[field] === null || data[field] === "") {
      throw new Error(`products/${product.id} is missing ${field}.`);
    }
  }
  if (String(data.primaryImageUrl).startsWith("/")) {
    const imagePath = resolve(process.cwd(), "public", String(data.primaryImageUrl).slice(1));
    if (!existsSync(imagePath)) throw new Error(`Missing local image for products/${product.id}: ${imagePath}`);
  }
  if (!Array.isArray(data.variants) || data.variants.length === 0) {
    throw new Error(`products/${product.id} has no purchasable variants.`);
  }
}

const store = await db.doc("siteContent/store").get();
if (!store.exists) throw new Error("siteContent/store is missing.");

console.log(
  JSON.stringify(
    {
      projectId,
      emulator: Boolean(process.env.FIRESTORE_EMULATOR_HOST),
      counts: actualCounts,
      storeContent: "ok",
      productImages: "ok",
      productVariants: "ok",
    },
    null,
    2,
  ),
);
