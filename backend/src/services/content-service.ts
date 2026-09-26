import { FieldValue, type DocumentData } from "firebase-admin/firestore";
import { firestore } from "../config/firebase.js";
import { AppError } from "../lib/app-error.js";
import { toIsoString } from "../lib/firestore-values.js";

function media(value: unknown) {
  const data = (value ?? {}) as DocumentData;
  return { src: data.src ?? "", alt: data.alt ?? "", ...(data.position ? { position: data.position } : {}) };
}

export async function listCollections() {
  const snapshot = await firestore.collection("collections").get();
  return snapshot.docs
    .map((entry) => {
      const data = entry.data();
      return {
        id: entry.id,
        slug: data.slug ?? entry.id,
        name: data.name ?? "",
        headline: data.headline ?? "",
        description: data.description ?? "",
        hero: media(data.hero),
        categoryImage: media(data.categoryImage),
        subcategories: data.subcategories ?? [],
        position: Number(data.position ?? 0),
        status: data.status ?? "draft",
        updatedAt: toIsoString(data.updatedAt),
        updatedBy: data.updatedBy ?? "",
      };
    })
    .sort((a, b) => a.position - b.position || a.name.localeCompare(b.name));
}

export async function createCollection(slug: string, name: string, actor: string) {
  const reference = firestore.doc(`collections/${slug}`);
  if ((await reference.get()).exists)
    throw new AppError(409, "COLLECTION_EXISTS", "That collection slug already exists.");
  await reference.set({
    slug,
    name,
    headline: "",
    description: "",
    hero: { src: "", alt: "" },
    categoryImage: { src: "", alt: "" },
    subcategories: [],
    position: 999,
    status: "draft",
    createdAt: FieldValue.serverTimestamp(),
    createdBy: actor,
    updatedAt: FieldValue.serverTimestamp(),
    updatedBy: actor,
  });
  return slug;
}

export async function updateCollection(id: string, input: DocumentData, actor: string) {
  const reference = firestore.doc(`collections/${id}`);
  if (!(await reference.get()).exists)
    throw new AppError(404, "COLLECTION_NOT_FOUND", "Collection not found.");
  const { updatedAt: _updatedAt, updatedBy: _updatedBy, ...writable } = input;
  void _updatedAt;
  void _updatedBy;
  await reference.update({
    ...writable,
    id: FieldValue.delete(),
    updatedAt: FieldValue.serverTimestamp(),
    updatedBy: actor,
  });
}

type HomepageKind = "banner" | "category" | "editorial";

function homepageEntry(kind: HomepageKind, id: string, data: DocumentData) {
  return {
    id,
    kind,
    title: data.title ?? data.label ?? "",
    description: data.subtitle ?? data.description ?? "",
    imageUrl: data.imageUrl ?? "",
    imageAlt: data.imageAlt ?? "",
    imagePosition: data.imagePosition ?? "",
    linkUrl: data.linkUrl ?? data.href ?? "",
    ctaLabel: data.ctaLabel ?? "",
    position: Number(data.position ?? 0),
    status: data.status ?? "draft",
    updatedAt: toIsoString(data.updatedAt),
  };
}

export async function listHomepageContent() {
  const [banners, categories, editorials] = await Promise.all([
    firestore.collection("banners").get(),
    firestore.collection("homeCategories").get(),
    firestore.collection("editorialFeatures").get(),
  ]);
  return [
    ...banners.docs.map((entry) => homepageEntry("banner", entry.id, entry.data())),
    ...categories.docs.map((entry) => homepageEntry("category", entry.id, entry.data())),
    ...editorials.docs.map((entry) => homepageEntry("editorial", entry.id, entry.data())),
  ].sort((a, b) => a.kind.localeCompare(b.kind) || a.position - b.position || a.title.localeCompare(b.title));
}

export async function updateHomepageContent(input: DocumentData, actor: string) {
  const collectionName =
    input.kind === "banner" ? "banners" : input.kind === "category" ? "homeCategories" : "editorialFeatures";
  const base = {
    status: input.status,
    position: input.position,
    imageUrl: input.imageUrl,
    imageAlt: input.imageAlt,
    imagePosition: input.imagePosition || null,
    updatedAt: FieldValue.serverTimestamp(),
    updatedBy: actor,
  };
  const fields =
    input.kind === "banner"
      ? { ...base, title: input.title, subtitle: input.description, linkUrl: input.linkUrl, ctaLabel: input.ctaLabel, placement: "HOME_HERO" }
      : input.kind === "category"
        ? { ...base, label: input.title, href: input.linkUrl, slug: input.linkUrl.replace(/^\//, "") }
        : { ...base, title: input.title, description: input.description, href: input.linkUrl };
  await firestore.doc(`${collectionName}/${input.id}`).update(fields);
}
