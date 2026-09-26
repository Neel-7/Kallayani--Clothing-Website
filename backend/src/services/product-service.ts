import { FieldValue, type DocumentData } from "firebase-admin/firestore";
import { firestore } from "../config/firebase.js";
import { AppError } from "../lib/app-error.js";
import { toIsoString, uniqueStrings } from "../lib/firestore-values.js";
import type { EditableProductInput } from "../schemas/product.js";

function legacyPrimary(id: string, data: DocumentData) {
  if (data.primaryImage) return data.primaryImage;
  if (!data.primaryImageUrl) return null;
  return {
    id: `${id}-legacy-primary`,
    storagePath: "",
    url: data.primaryImageUrl,
    alt: data.imageAlt ?? data.title ?? "",
    position: data.imagePosition ?? null,
    width: 0,
    height: 0,
  };
}

export function normalizeAdminProduct(id: string, data: DocumentData) {
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
    currency: "USD" as const,
    featured: Boolean(data.featured),
    inStock: Boolean(data.inStock),
    badges: data.badges ?? [],
    primaryImage: legacyPrimary(id, data),
    gallery: data.gallery ?? [],
    variants: data.variants ?? [],
    craft: data.craft ?? "",
    region: data.region ?? "",
    seoTitle: data.seoTitle ?? data.title ?? "",
    seoDescription: data.seoDescription ?? "",
    createdAt: toIsoString(data.createdAt),
    createdBy: data.createdBy ?? "",
    updatedAt: toIsoString(data.updatedAt),
    updatedBy: data.updatedBy ?? "",
    publishedAt: toIsoString(data.publishedAt),
  };
}

function writable(input: EditableProductInput, id: string) {
  const primaryCategorySlug = input.primaryCategorySlug || input.collectionSlug;
  return {
    ...input,
    id,
    primaryCategorySlug,
    collectionSlug: primaryCategorySlug,
    collectionSlugs: uniqueStrings([primaryCategorySlug, ...input.collectionSlugs]),
    primaryImageUrl: input.primaryImage?.url ?? "",
    imageAlt: input.primaryImage?.alt ?? "",
    imagePosition: input.primaryImage?.position ?? null,
  };
}

export async function listProducts() {
  const snapshot = await firestore.collection("products").get();
  return snapshot.docs
    .map((entry) => normalizeAdminProduct(entry.id, entry.data()))
    .sort(
      (left, right) =>
        Date.parse(right.updatedAt ?? "1970-01-01") - Date.parse(left.updatedAt ?? "1970-01-01") ||
        left.title.localeCompare(right.title),
    );
}

export async function getProduct(id: string) {
  const snapshot = await firestore.doc(`products/${id}`).get();
  if (!snapshot.exists) throw new AppError(404, "PRODUCT_NOT_FOUND", "Product not found.");
  return normalizeAdminProduct(snapshot.id, snapshot.data()!);
}

export async function slugExists(slug: string, exceptId?: string) {
  const snapshot = await firestore.collection("products").where("slug", "==", slug).limit(2).get();
  return snapshot.docs.some((entry) => entry.id !== exceptId);
}

export async function createProduct(input: EditableProductInput, actor: string) {
  if (input.slug && (await slugExists(input.slug))) {
    throw new AppError(409, "SLUG_EXISTS", "A product already uses this slug.");
  }
  const reference = firestore.collection("products").doc();
  await reference.set({
    ...writable({ ...input, status: "draft" }, reference.id),
    status: "draft",
    createdAt: FieldValue.serverTimestamp(),
    createdBy: actor,
    updatedAt: FieldValue.serverTimestamp(),
    updatedBy: actor,
    publishedAt: null,
  });
  return reference.id;
}

export async function updateProduct(id: string, input: EditableProductInput, actor: string) {
  const reference = firestore.doc(`products/${id}`);
  const snapshot = await reference.get();
  if (!snapshot.exists)
    throw new AppError(404, "PRODUCT_NOT_FOUND", "Product not found.");
  if (input.slug && (await slugExists(input.slug, id)))
    throw new AppError(409, "SLUG_EXISTS", "A product already uses this slug.");
  const current = normalizeAdminProduct(id, snapshot.data()!);
  const next = { ...current, ...writable(input, id), status: current.status };
  if (current.status === "published") {
    const errors = publicationErrors(next);
    if (errors.length) {
      throw new AppError(
        422,
        "PRODUCT_NOT_PUBLISHABLE",
        "A published product must remain complete.",
        errors,
      );
    }
  }
  await reference.update({
    ...writable(input, id),
    status: current.status,
    updatedAt: FieldValue.serverTimestamp(),
    updatedBy: actor,
  });
}

export async function updateProductMedia(
  id: string,
  input: Pick<EditableProductInput, "primaryImage" | "gallery">,
  actor: string,
) {
  await firestore.doc(`products/${id}`).update({
    ...input,
    primaryImageUrl: input.primaryImage?.url ?? "",
    imageAlt: input.primaryImage?.alt ?? "",
    imagePosition: input.primaryImage?.position ?? null,
    updatedAt: FieldValue.serverTimestamp(),
    updatedBy: actor,
  });
}

function publicationErrors(product: ReturnType<typeof normalizeAdminProduct>) {
  const errors: string[] = [];
  if (!product.title.trim()) errors.push("A title is required.");
  if (!product.slug.trim()) errors.push("A slug is required.");
  if (!product.primaryCategorySlug) errors.push("A primary collection is required.");
  if (product.priceFrom < 0) errors.push("The price cannot be negative.");
  if (!product.primaryImage?.url) errors.push("A primary product image is required.");
  if (!product.primaryImage?.alt?.trim()) errors.push("Primary image alt text is required.");
  if (product.variants.length === 0) errors.push("At least one product variant is required.");
  return errors;
}

export async function setProductStatus(
  id: string,
  status: "draft" | "published" | "archived",
  actor: string,
) {
  const product = await getProduct(id);
  if (status === "published") {
    const errors = publicationErrors(product);
    if (errors.length) {
      throw new AppError(422, "PRODUCT_NOT_PUBLISHABLE", "Complete the product before publishing.", errors);
    }
  }
  await firestore.doc(`products/${id}`).update({
    status,
    ...(status === "published" ? { publishedAt: FieldValue.serverTimestamp() } : {}),
    updatedAt: FieldValue.serverTimestamp(),
    updatedBy: actor,
  });
}

export async function duplicateProduct(id: string, actor: string) {
  const source = await getProduct(id);
  const { createdAt, createdBy, updatedAt, updatedBy, publishedAt, ...editable } = source;
  void createdAt;
  void createdBy;
  void updatedAt;
  void updatedBy;
  void publishedAt;
  return createProduct(
    {
      ...editable,
      id: "",
      title: `${source.title} copy`,
      slug: `${source.slug}-copy-${Date.now().toString().slice(-6)}`,
      status: "draft",
      featured: false,
    },
    actor,
  );
}
