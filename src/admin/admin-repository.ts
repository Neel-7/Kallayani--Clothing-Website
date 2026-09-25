import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
  type DocumentData,
  type Timestamp,
} from "firebase/firestore";
import { adminAuth, adminDb } from "@/lib/firebase-admin-client";
import type { CatalogStatus, EditableProduct, ProductDocument, ProductImage } from "@/types/admin";

export type AdminCollectionOption = { slug: string; name: string };

function actorId() {
  const uid = adminAuth.currentUser?.uid;
  if (!uid) throw new Error("Your staff session has expired. Sign in again.");
  return uid;
}

function imageFromLegacy(data: DocumentData): ProductImage | null {
  if (data.primaryImage) return data.primaryImage as ProductImage;
  if (!data.primaryImageUrl) return null;
  return {
    id: `${data.id ?? "product"}-legacy-primary`,
    storagePath: "",
    url: data.primaryImageUrl,
    alt: data.imageAlt ?? data.title ?? "",
    position: data.imagePosition ?? null,
    width: 0,
    height: 0,
  };
}

function normalizeProduct(id: string, data: DocumentData): ProductDocument {
  const gallery = ((data.gallery ?? []) as DocumentData[]).map((image, index) => ({
    id: image.id ?? `${id}-gallery-${index + 1}`,
    storagePath: image.storagePath ?? "",
    url: image.url ?? "",
    alt: image.alt ?? data.title ?? "",
    position: image.position ?? null,
    width: Number(image.width ?? 0),
    height: Number(image.height ?? 0),
  }));
  return {
    id,
    slug: data.slug ?? id,
    title: data.title ?? "",
    description: data.description ?? "",
    status: data.status ?? "draft",
    primaryCategorySlug: data.primaryCategorySlug ?? data.collectionSlug ?? "",
    collectionSlug: data.collectionSlug ?? data.primaryCategorySlug ?? "",
    collectionSlugs: data.collectionSlugs ?? [data.collectionSlug].filter(Boolean),
    priceFrom: Number(data.priceFrom ?? 0),
    priceTo: Number(data.priceTo ?? data.priceFrom ?? 0),
    listPriceFrom: data.listPriceFrom == null ? null : Number(data.listPriceFrom),
    currency: "USD",
    featured: Boolean(data.featured),
    inStock: Boolean(data.inStock),
    badges: data.badges ?? [],
    primaryImage: imageFromLegacy(data),
    gallery,
    variants: data.variants ?? [],
    craft: data.craft ?? "",
    region: data.region ?? "",
    seoTitle: data.seoTitle ?? data.title ?? "",
    seoDescription: data.seoDescription ?? "",
    createdAt: (data.createdAt as Timestamp | null) ?? null,
    createdBy: data.createdBy ?? "",
    updatedAt: (data.updatedAt as Timestamp | null) ?? null,
    updatedBy: data.updatedBy ?? "",
    publishedAt: (data.publishedAt as Timestamp | null) ?? null,
  };
}

function writableProduct(input: EditableProduct) {
  return {
    ...input,
    collectionSlug: input.primaryCategorySlug,
    collectionSlugs: [...new Set([input.primaryCategorySlug, ...input.collectionSlugs])].filter(
      Boolean,
    ),
    primaryImageUrl: input.primaryImage?.url ?? "",
    imageAlt: input.primaryImage?.alt ?? "",
    imagePosition: input.primaryImage?.position ?? null,
  };
}

export async function listAdminProducts() {
  const snapshot = await getDocs(collection(adminDb, "products"));
  return snapshot.docs
    .map((entry) => normalizeProduct(entry.id, entry.data()))
    .sort(
      (left, right) =>
        (right.updatedAt?.toMillis() ?? 0) - (left.updatedAt?.toMillis() ?? 0) ||
        left.title.localeCompare(right.title),
    );
}

export async function getAdminProduct(productId: string) {
  const snapshot = await getDoc(doc(adminDb, "products", productId));
  return snapshot.exists() ? normalizeProduct(snapshot.id, snapshot.data()) : null;
}

export async function listAdminCollections(): Promise<AdminCollectionOption[]> {
  const snapshot = await getDocs(collection(adminDb, "collections"));
  return snapshot.docs
    .map((entry) => ({ slug: entry.data().slug ?? entry.id, name: entry.data().name ?? entry.id }))
    .sort((left, right) => left.name.localeCompare(right.name));
}

export async function createProductDraft(input: EditableProduct) {
  const actor = actorId();
  const productRef = doc(collection(adminDb, "products"));
  await setDoc(productRef, {
    ...writableProduct({ ...input, id: productRef.id, status: "draft" }),
    id: productRef.id,
    status: "draft",
    createdAt: serverTimestamp(),
    createdBy: actor,
    updatedAt: serverTimestamp(),
    updatedBy: actor,
    publishedAt: null,
  });
  return productRef.id;
}

export async function saveAdminProduct(productId: string, input: EditableProduct) {
  await updateDoc(doc(adminDb, "products", productId), {
    ...writableProduct({ ...input, id: productId }),
    id: productId,
    updatedAt: serverTimestamp(),
    updatedBy: actorId(),
  });
}

export async function saveProductMedia(
  productId: string,
  primaryImage: ProductImage | null,
  gallery: ProductImage[],
) {
  await updateDoc(doc(adminDb, "products", productId), {
    primaryImage,
    primaryImageUrl: primaryImage?.url ?? "",
    imageAlt: primaryImage?.alt ?? "",
    imagePosition: primaryImage?.position ?? null,
    gallery,
    updatedAt: serverTimestamp(),
    updatedBy: actorId(),
  });
}

export async function setProductStatus(productId: string, status: CatalogStatus) {
  await updateDoc(doc(adminDb, "products", productId), {
    status,
    ...(status === "published" ? { publishedAt: serverTimestamp() } : {}),
    updatedAt: serverTimestamp(),
    updatedBy: actorId(),
  });
}

export async function duplicateProduct(productId: string) {
  const source = await getAdminProduct(productId);
  if (!source) throw new Error("The product no longer exists.");
  const { createdAt, createdBy, updatedAt, updatedBy, publishedAt, ...editable } = source;
  void createdAt;
  void createdBy;
  void updatedAt;
  void updatedBy;
  void publishedAt;
  return createProductDraft({
    ...editable,
    id: "",
    title: `${source.title} copy`,
    slug: `${source.slug}-copy-${Date.now().toString().slice(-5)}`,
    status: "draft",
    featured: false,
  });
}

export async function productSlugExists(slug: string, exceptId?: string) {
  const snapshot = await getDocs(
    query(collection(adminDb, "products"), where("slug", "==", slug), limit(2)),
  );
  return snapshot.docs.some((entry) => entry.id !== exceptId);
}
