import type { DocumentData, QueryDocumentSnapshot } from "firebase-admin/firestore";
import { firestore } from "../config/firebase.js";

function media(value: unknown) {
  const data = (value ?? {}) as DocumentData;
  return {
    src: data.src ?? "",
    alt: data.alt ?? "",
    ...(data.position ? { position: data.position } : {}),
    ...(data.label ? { label: data.label } : {}),
  };
}

function mapProductData(id: string, data: DocumentData) {
  const primary = data.primaryImage;
  return {
    id,
    slug: data.slug,
    name: data.title,
    craft: data.craft,
    region: data.region,
    price: Number(data.priceFrom ?? 0),
    listPrice: data.listPriceFrom ?? null,
    inStock: data.inStock ?? true,
    featured: data.featured ?? false,
    badges: data.badges ?? [],
    ratingAverage: data.ratingAverage ?? null,
    ratingCount: data.ratingCount ?? 0,
    image: {
      src: primary?.url ?? data.primaryImageUrl ?? "",
      alt: primary?.alt || data.imageAlt || data.title,
      position: primary?.position ?? data.imagePosition ?? undefined,
    },
    gallery: (data.gallery ?? []).map((asset: DocumentData) => ({
      src: asset.url ?? "",
      alt: asset.alt ?? "",
      position: asset.position ?? undefined,
      label: asset.label,
    })),
    sizes: data.sizes ?? [],
    variants: data.variants ?? [],
  };
}

function mapProduct(snapshot: QueryDocumentSnapshot) {
  const data = snapshot.data();
  return {
    ...mapProductData(snapshot.id, data),
    collectionSlug: data.collectionSlug,
    position: Number(data.position ?? 0),
  };
}

async function publishedCollections() {
  const snapshot = await firestore.collection("collections").where("status", "==", "published").get();
  return snapshot.docs
    .map((entry): DocumentData & { id: string } => ({ ...entry.data(), id: entry.id }))
    .sort((left, right) => Number(left.position ?? 0) - Number(right.position ?? 0));
}

async function publishedProducts() {
  const snapshot = await firestore.collection("products").where("status", "==", "published").get();
  return snapshot.docs.map(mapProduct);
}

function mapCollection(data: DocumentData, products: ReturnType<typeof mapProduct>[]) {
  return {
    slug: data.slug,
    name: data.name,
    headline: data.headline,
    description: data.description,
    hero: media(data.hero),
    categoryImage: media(data.categoryImage),
    subcategories: (data.subcategories ?? []).map((entry: DocumentData) => ({
      name: entry.name,
      image: media(entry.image),
    })),
    products: products.map(({ collectionSlug: _collectionSlug, position: _position, ...product }) => {
      void _collectionSlug;
      void _position;
      return product;
    }),
  };
}

export async function getCollections() {
  const [collections, products] = await Promise.all([publishedCollections(), publishedProducts()]);
  return collections.map((entry) =>
    mapCollection(
      entry,
      products
        .filter((product) => product.collectionSlug === entry.slug)
        .sort((left, right) => left.position - right.position),
    ),
  );
}

export async function getCollection(slug: string) {
  const snapshot = await firestore.doc(`collections/${slug}`).get();
  if (!snapshot.exists || snapshot.data()?.status !== "published") return null;
  const productSnapshot = await firestore
    .collection("products")
    .where("status", "==", "published")
    .where("collectionSlug", "==", slug)
    .get();
  return mapCollection(
    snapshot.data()!,
    productSnapshot.docs.map(mapProduct).sort((left, right) => left.position - right.position),
  );
}

export async function getProduct(productId: string) {
  const snapshot = await firestore.doc(`products/${productId}`).get();
  if (!snapshot.exists || snapshot.data()?.status !== "published") return null;
  const data = snapshot.data()!;
  const collection = await getCollection(data.collectionSlug);
  if (!collection) return null;
  const product = mapProductData(snapshot.id, data);
  return {
    product,
    collection,
    similarProducts: collection.products.filter((entry) => entry.id !== product.id),
  };
}

export async function getHomePage() {
  const [banners, categories, editorials, products] = await Promise.all([
    firestore
      .collection("banners")
      .where("status", "==", "published")
      .where("placement", "==", "HOME_HERO")
      .get(),
    firestore.collection("homeCategories").where("status", "==", "published").get(),
    firestore.collection("editorialFeatures").where("status", "==", "published").get(),
    firestore
      .collection("products")
      .where("status", "==", "published")
      .where("featured", "==", true)
      .get(),
  ]);

  return {
    heroSlides: banners.docs
      .map((entry) => {
        const data = entry.data();
        return {
          id: data.id ?? entry.id,
          title: data.title,
          description: data.subtitle,
          href: data.linkUrl,
          cta: data.ctaLabel,
          image: { src: data.imageUrl, alt: data.imageAlt, position: data.imagePosition },
          position: Number(data.position ?? 0),
        };
      })
      .sort((a, b) => a.position - b.position),
    categories: categories.docs
      .map((entry) => {
        const data = entry.data();
        return {
          id: data.id ?? entry.id,
          slug: data.slug,
          label: data.label,
          href: data.href,
          image: { src: data.imageUrl, alt: data.imageAlt, position: data.imagePosition },
          position: Number(data.position ?? 0),
        };
      })
      .sort((a, b) => a.position - b.position),
    featuredProducts: products.docs
      .map((entry) => ({
        product: mapProductData(entry.id, entry.data()),
        position: Number(entry.data().featuredOrder ?? 0),
      }))
      .sort((a, b) => a.position - b.position)
      .map(({ product }) => product),
    editorialFeatures: editorials.docs
      .map((entry) => {
        const data = entry.data();
        return {
          id: data.id ?? entry.id,
          title: data.title,
          description: data.description,
          href: data.href,
          image: { src: data.imageUrl, alt: data.imageAlt, position: data.imagePosition },
          position: Number(data.position ?? 0),
        };
      })
      .sort((a, b) => a.position - b.position),
  };
}

export async function getStorefrontInfo() {
  const snapshot = await firestore.doc("siteContent/store").get();
  if (!snapshot.exists || snapshot.data()?.status !== "published") return null;
  const data = snapshot.data()!;
  return {
    name: data.name,
    contactEmail: data.contactEmail,
    contactPhone: data.contactPhone ?? null,
    supportHours: data.supportHours ?? null,
    addressLine: data.addressLine,
    instagramUrl: data.instagramUrl ?? null,
    facebookUrl: data.facebookUrl ?? null,
    announcementBarText: data.announcementBarText,
    secondaryAnnouncementText: data.secondaryAnnouncementText ?? null,
    freeShippingThreshold: data.freeShippingThreshold,
  };
}
