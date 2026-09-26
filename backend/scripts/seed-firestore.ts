import { applicationDefault, getApps, initializeApp } from "firebase-admin/app";
import { FieldValue, getFirestore, type WriteBatch } from "firebase-admin/firestore";
import { collections, editorialFeatures, featuredProducts, heroSlides } from "../../frontend/src/data/catalog";
import { homeCategorySeed, storefrontInfoSeed } from "../../frontend/src/data/home-seed";
import { sizesByCollection } from "../../frontend/src/components/product/product-config";
import type { Product } from "../../frontend/src/types/catalog";

const projectId = process.env.VITE_FIREBASE_PROJECT_ID;
const dryRun = process.argv.includes("--dry-run");

if (!projectId) {
  throw new Error("VITE_FIREBASE_PROJECT_ID is missing. Run the script with .env.local loaded.");
}

if (!process.env.FIRESTORE_EMULATOR_HOST && process.env.ALLOW_CLOUD_SEED !== "true") {
  throw new Error(
    "Cloud catalogue seeding is disabled now that Firestore is admin-managed. Use the emulator, or set ALLOW_CLOUD_SEED=true only for a reviewed recovery operation.",
  );
}

if (!projectId.includes("dev") && process.env.ALLOW_PRODUCTION_SEED !== "true") {
  throw new Error(
    `Refusing to seed non-development Firebase project ${projectId}. Set ALLOW_PRODUCTION_SEED=true only when intentional.`,
  );
}

const app =
  getApps()[0] ??
  initializeApp({
    ...(process.env.FIRESTORE_EMULATOR_HOST ? {} : { credential: applicationDefault() }),
    projectId,
  });
const db = getFirestore(app);

const featuredOrder = new Map(featuredProducts.map((product, index) => [product.id, index + 1]));

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function productDocument(product: Product, collectionSlug: string, position: number) {
  const sizes = product.sizes ?? sizesByCollection[collectionSlug] ?? ["One size"];
  const variants = sizes.map((size, variantIndex) => ({
    id: `${product.id}-${slugify(size)}`,
    sku: `${product.id.toUpperCase()}-${variantIndex + 1}`,
    optionSummary: `Size: ${size}`,
    size,
    price: product.price,
    listPrice: null,
    availableQuantity: 20,
    inStock: true,
  }));

  return {
    id: product.id,
    slug: product.id,
    title: product.name,
    description: `${product.name} is a considered Kallayani piece rooted in ${product.craft.toLowerCase()} and the textile traditions of ${product.region}.`,
    craft: product.craft,
    region: product.region,
    primaryCategorySlug: collectionSlug,
    collectionSlug,
    collectionSlugs: [collectionSlug],
    priceFrom: product.price,
    priceTo: product.price,
    listPriceFrom: null,
    currency: "USD",
    onSale: false,
    inStock: true,
    featured: featuredOrder.has(product.id),
    featuredOrder: featuredOrder.get(product.id) ?? 999,
    newArrival: position < 3,
    newArrivalOrder: position + 1,
    bestSeller: false,
    badges: [],
    ratingAverage: null,
    ratingCount: 0,
    primaryImageUrl: product.image.src,
    imageAlt: product.image.alt,
    imagePosition: product.image.position ?? null,
    primaryImage: {
      id: `${product.id}-primary`,
      storagePath: "",
      url: product.image.src,
      alt: product.image.alt,
      position: product.image.position ?? null,
      width: 0,
      height: 0,
    },
    gallery: (product.gallery ?? []).map((asset, index) => ({
      id: `${product.id}-gallery-${index + 1}`,
      storagePath: "",
      url: asset.src,
      alt: asset.alt,
      position: asset.position ?? null,
      width: 0,
      height: 0,
    })),
    sizes,
    variants,
    position,
    status: "published",
    seoTitle: product.name,
    seoDescription: `${product.name} by Kallayani. ${product.craft} from ${product.region}.`,
    createdAt: FieldValue.serverTimestamp(),
    createdBy: "development-seed",
    updatedAt: FieldValue.serverTimestamp(),
    updatedBy: "development-seed",
    publishedAt: FieldValue.serverTimestamp(),
  };
}

let writes = 0;
let batch: WriteBatch = db.batch();
const pendingBatches: WriteBatch[] = [];

function setDocument(path: string, value: Record<string, unknown>) {
  if (writes > 0 && writes % 450 === 0) {
    pendingBatches.push(batch);
    batch = db.batch();
  }
  batch.set(db.doc(path), value, { merge: true });
  writes += 1;
}

for (const [collectionPosition, catalogCollection] of collections.entries()) {
  setDocument(`collections/${catalogCollection.slug}`, {
    slug: catalogCollection.slug,
    name: catalogCollection.name,
    headline: catalogCollection.headline,
    description: catalogCollection.description,
    hero: catalogCollection.hero,
    categoryImage: catalogCollection.categoryImage,
    subcategories: catalogCollection.subcategories,
    position: collectionPosition + 1,
    status: "published",
    updatedAt: FieldValue.serverTimestamp(),
  });

  catalogCollection.products.forEach((product, productPosition) => {
    setDocument(
      `products/${product.id}`,
      productDocument(product, catalogCollection.slug, productPosition),
    );
  });
}

heroSlides.forEach((slide, index) => {
  setDocument(`banners/${slide.id}`, {
    id: slide.id,
    placement: "HOME_HERO",
    title: slide.title,
    subtitle: slide.description,
    imageUrl: slide.image.src,
    imageAlt: slide.image.alt,
    imagePosition: slide.image.position ?? null,
    linkUrl: slide.href,
    ctaLabel: slide.cta,
    position: index + 1,
    status: "published",
    updatedAt: FieldValue.serverTimestamp(),
  });
});

editorialFeatures.forEach((feature, index) => {
  const id = `editorial-${slugify(feature.title)}`;
  setDocument(`editorialFeatures/${id}`, {
    id,
    title: feature.title,
    description: feature.description,
    href: feature.href,
    imageUrl: feature.image.src,
    imageAlt: feature.image.alt,
    imagePosition: feature.image.position ?? null,
    position: index + 1,
    status: "published",
    updatedAt: FieldValue.serverTimestamp(),
  });
});

homeCategorySeed.forEach((category) => {
  setDocument(`homeCategories/${category.id}`, {
    id: category.id,
    slug: category.slug,
    label: category.label,
    href: category.href,
    imageUrl: category.image.src,
    imageAlt: category.image.alt,
    imagePosition: category.image.position ?? null,
    position: category.position,
    status: "published",
    updatedAt: FieldValue.serverTimestamp(),
  });
});

setDocument("siteContent/store", {
  ...storefrontInfoSeed,
  status: "published",
  updatedAt: FieldValue.serverTimestamp(),
});

setDocument("system/storefrontSeed", {
  schemaVersion: 1,
  source: "src/data/catalog.ts",
  productCount: collections.reduce((total, entry) => total + entry.products.length, 0),
  collectionCount: collections.length,
  bannerCount: heroSlides.length,
  updatedAt: FieldValue.serverTimestamp(),
});

setDocument("settings/store", {
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
  updatedAt: FieldValue.serverTimestamp(),
  updatedBy: "development-seed",
});

pendingBatches.push(batch);

if (dryRun) {
  console.log(`Dry run complete: ${writes} documents prepared for ${projectId}.`);
} else {
  for (const pendingBatch of pendingBatches) await pendingBatch.commit();
  console.log(`Seeded ${writes} documents into Firebase project ${projectId}.`);
}
