import {
  collection,
  doc,
  getDoc,
  getDocs,
  serverTimestamp,
  setDoc,
  updateDoc,
  type DocumentData,
  type Timestamp,
} from "firebase/firestore";
import { adminAuth, adminDb } from "@/lib/firebase-admin-client";
import type { CatalogStatus } from "@/types/admin";
import type { MediaAsset, Subcategory } from "@/types/catalog";

export type AdminCollectionDocument = {
  id: string;
  slug: string;
  name: string;
  headline: string;
  description: string;
  hero: MediaAsset;
  categoryImage: MediaAsset;
  subcategories: Subcategory[];
  position: number;
  status: CatalogStatus;
  updatedAt: Timestamp | null;
  updatedBy: string;
};

export type HomepageContentKind = "banner" | "category" | "editorial";

export type HomepageContentEntry = {
  id: string;
  kind: HomepageContentKind;
  title: string;
  description: string;
  imageUrl: string;
  imageAlt: string;
  imagePosition: string;
  linkUrl: string;
  ctaLabel: string;
  position: number;
  status: CatalogStatus;
  updatedAt: Timestamp | null;
};

function actorId() {
  const uid = adminAuth.currentUser?.uid;
  if (!uid) throw new Error("Your staff session has expired. Sign in again.");
  return uid;
}

function media(value: unknown): MediaAsset {
  const data = (value ?? {}) as Partial<MediaAsset>;
  return { src: data.src ?? "", alt: data.alt ?? "", position: data.position };
}

export async function listAdminCollectionDocuments(): Promise<AdminCollectionDocument[]> {
  const snapshot = await getDocs(collection(adminDb, "collections"));
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
        subcategories: (data.subcategories ?? []) as Subcategory[],
        position: Number(data.position ?? 0),
        status: data.status ?? "draft",
        updatedAt: (data.updatedAt as Timestamp | null) ?? null,
        updatedBy: data.updatedBy ?? "",
      } satisfies AdminCollectionDocument;
    })
    .sort((left, right) => left.position - right.position || left.name.localeCompare(right.name));
}

export async function createAdminCollection(slug: string, name: string) {
  const normalizedSlug = slug.trim();
  if (!normalizedSlug) throw new Error("A collection slug is required.");
  const collectionRef = doc(adminDb, "collections", normalizedSlug);
  if ((await getDoc(collectionRef)).exists())
    throw new Error("That collection slug already exists.");
  await setDoc(collectionRef, {
    slug: normalizedSlug,
    name: name.trim() || normalizedSlug,
    headline: "",
    description: "",
    hero: { src: "", alt: "" },
    categoryImage: { src: "", alt: "" },
    subcategories: [],
    position: 999,
    status: "draft",
    createdAt: serverTimestamp(),
    createdBy: actorId(),
    updatedAt: serverTimestamp(),
    updatedBy: actorId(),
  });
  return normalizedSlug;
}

export async function saveAdminCollection(input: AdminCollectionDocument) {
  await updateDoc(doc(adminDb, "collections", input.id), {
    slug: input.slug,
    name: input.name,
    headline: input.headline,
    description: input.description,
    hero: input.hero,
    categoryImage: input.categoryImage,
    subcategories: input.subcategories,
    position: input.position,
    status: input.status,
    updatedAt: serverTimestamp(),
    updatedBy: actorId(),
  });
}

function homepageEntry(kind: HomepageContentKind, id: string, data: DocumentData) {
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
    updatedAt: (data.updatedAt as Timestamp | null) ?? null,
  } satisfies HomepageContentEntry;
}

export async function listHomepageContent() {
  const [banners, categories, editorial] = await Promise.all([
    getDocs(collection(adminDb, "banners")),
    getDocs(collection(adminDb, "homeCategories")),
    getDocs(collection(adminDb, "editorialFeatures")),
  ]);
  return [
    ...banners.docs.map((entry) => homepageEntry("banner", entry.id, entry.data())),
    ...categories.docs.map((entry) => homepageEntry("category", entry.id, entry.data())),
    ...editorial.docs.map((entry) => homepageEntry("editorial", entry.id, entry.data())),
  ].sort(
    (left, right) =>
      left.kind.localeCompare(right.kind) ||
      left.position - right.position ||
      left.title.localeCompare(right.title),
  );
}

export async function saveHomepageContent(input: HomepageContentEntry) {
  const collectionName =
    input.kind === "banner"
      ? "banners"
      : input.kind === "category"
        ? "homeCategories"
        : "editorialFeatures";
  const base = {
    status: input.status,
    position: input.position,
    imageUrl: input.imageUrl,
    imageAlt: input.imageAlt,
    imagePosition: input.imagePosition || null,
    updatedAt: serverTimestamp(),
    updatedBy: actorId(),
  };
  const fields =
    input.kind === "banner"
      ? {
          ...base,
          title: input.title,
          subtitle: input.description,
          linkUrl: input.linkUrl,
          ctaLabel: input.ctaLabel,
          placement: "HOME_HERO",
        }
      : input.kind === "category"
        ? {
            ...base,
            label: input.title,
            href: input.linkUrl,
            slug: input.linkUrl.replace(/^\//, ""),
          }
        : {
            ...base,
            title: input.title,
            description: input.description,
            href: input.linkUrl,
          };
  await updateDoc(doc(adminDb, collectionName, input.id), fields);
}
