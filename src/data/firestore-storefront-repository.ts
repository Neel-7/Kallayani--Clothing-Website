import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  type DocumentData,
  type QueryDocumentSnapshot,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import type {
  Collection,
  EditorialFeature,
  HeroSlide,
  HomeCategory,
  HomePageData,
  MediaAsset,
  Product,
  ProductPageData,
  ProductVariant,
  StorefrontInfo,
  Subcategory,
} from "@/types/catalog";
import { StorefrontDataError, type StorefrontRepository } from "./storefront-repository";

type StoredProduct = {
  id: string;
  slug: string;
  title: string;
  craft: string;
  region: string;
  priceFrom: number;
  listPriceFrom?: number | null;
  inStock?: boolean;
  featured?: boolean;
  badges?: string[];
  ratingAverage?: number | null;
  ratingCount?: number;
  primaryImageUrl?: string;
  imageAlt?: string;
  imagePosition?: string;
  primaryImage?: {
    url: string;
    alt: string;
    position?: string | null;
  } | null;
  gallery?: Array<{ url: string; alt: string; position?: string | null; label?: string }>;
  sizes?: string[];
  variants?: ProductVariant[];
  collectionSlug: string;
  position?: number;
};

function asMedia(value: unknown): MediaAsset {
  const data = value as Partial<MediaAsset> | undefined;
  return {
    src: data?.src ?? "",
    alt: data?.alt ?? "",
    position: data?.position,
    label: data?.label,
  };
}

function mapProductData(data: StoredProduct): Product {
  const primaryImage = data.primaryImage;
  return {
    id: data.id,
    slug: data.slug,
    name: data.title,
    craft: data.craft,
    region: data.region,
    price: data.priceFrom,
    listPrice: data.listPriceFrom ?? null,
    inStock: data.inStock ?? true,
    featured: data.featured ?? false,
    badges: data.badges ?? [],
    ratingAverage: data.ratingAverage ?? null,
    ratingCount: data.ratingCount ?? 0,
    image: {
      src: primaryImage?.url ?? data.primaryImageUrl ?? "",
      alt: primaryImage?.alt || data.imageAlt || data.title,
      position: primaryImage?.position ?? data.imagePosition,
    },
    gallery: data.gallery?.map((asset) => ({
      src: asset.url,
      alt: asset.alt,
      position: asset.position ?? undefined,
      label: asset.label,
    })),
    sizes: data.sizes ?? [],
    variants: data.variants ?? [],
  };
}

function mapProduct(snapshot: QueryDocumentSnapshot<DocumentData>): Product & {
  collectionSlug: string;
  position: number;
} {
  const data = snapshot.data() as StoredProduct;
  return {
    ...mapProductData({ ...data, id: data.id || snapshot.id }),
    collectionSlug: data.collectionSlug,
    position: data.position ?? 0,
  };
}

function mapCollectionData(data: DocumentData, products: Product[]): Collection {
  return {
    slug: data.slug,
    name: data.name,
    headline: data.headline,
    description: data.description,
    hero: asMedia(data.hero),
    categoryImage: asMedia(data.categoryImage),
    subcategories: ((data.subcategories ?? []) as Array<{ name: string; image: MediaAsset }>).map(
      (subcategory): Subcategory => ({
        name: subcategory.name,
        image: asMedia(subcategory.image),
      }),
    ),
    products,
  };
}

async function getPublishedProducts() {
  const snapshot = await getDocs(
    query(collection(db, "products"), where("status", "==", "published")),
  );
  return snapshot.docs.map(mapProduct);
}

async function getPublishedCollections() {
  const snapshot = await getDocs(
    query(collection(db, "collections"), where("status", "==", "published")),
  );
  return snapshot.docs
    .map((entry) => {
      const data = entry.data() as DocumentData & { slug: string; position?: number };
      return { ...data, id: entry.id };
    })
    .sort((left, right) => Number(left.position ?? 0) - Number(right.position ?? 0));
}

async function getHomePage(): Promise<HomePageData> {
  try {
    const [bannerSnapshot, categorySnapshot, editorialSnapshot, productSnapshot] =
      await Promise.all([
        getDocs(
          query(
            collection(db, "banners"),
            where("status", "==", "published"),
            where("placement", "==", "HOME_HERO"),
          ),
        ),
        getDocs(query(collection(db, "homeCategories"), where("status", "==", "published"))),
        getDocs(query(collection(db, "editorialFeatures"), where("status", "==", "published"))),
        getDocs(
          query(
            collection(db, "products"),
            where("status", "==", "published"),
            where("featured", "==", true),
          ),
        ),
      ]);

    const heroSlides = bannerSnapshot.docs
      .map((entry): HeroSlide & { position: number } => {
        const data = entry.data();
        return {
          id: data.id ?? entry.id,
          title: data.title,
          description: data.subtitle,
          href: data.linkUrl,
          cta: data.ctaLabel,
          image: {
            src: data.imageUrl,
            alt: data.imageAlt,
            position: data.imagePosition,
          },
          position: data.position ?? 0,
        };
      })
      .sort((left, right) => left.position - right.position);

    const categories = categorySnapshot.docs
      .map((entry): HomeCategory => {
        const data = entry.data();
        return {
          id: data.id ?? entry.id,
          slug: data.slug,
          label: data.label,
          href: data.href,
          image: {
            src: data.imageUrl,
            alt: data.imageAlt,
            position: data.imagePosition,
          },
          position: data.position ?? 0,
        };
      })
      .sort((left, right) => left.position - right.position);

    const editorialFeatures = editorialSnapshot.docs
      .map((entry): EditorialFeature & { position: number } => {
        const data = entry.data();
        return {
          id: data.id ?? entry.id,
          title: data.title,
          description: data.description,
          href: data.href,
          image: {
            src: data.imageUrl,
            alt: data.imageAlt,
            position: data.imagePosition,
          },
          position: data.position ?? 0,
        };
      })
      .sort((left, right) => left.position - right.position);

    const featuredProducts = productSnapshot.docs
      .map((entry) => {
        const data = entry.data() as StoredProduct & { featuredOrder?: number };
        return {
          product: mapProductData({ ...data, id: data.id || entry.id }),
          position: data.featuredOrder ?? 0,
        };
      })
      .sort((left, right) => left.position - right.position)
      .map(({ product }) => product);

    return { heroSlides, categories, featuredProducts, editorialFeatures };
  } catch (error) {
    throw new StorefrontDataError("Could not load the Kallayani homepage from Firestore.", {
      cause: error,
    });
  }
}

async function getCollections(): Promise<Collection[]> {
  try {
    const [storedCollections, storedProducts] = await Promise.all([
      getPublishedCollections(),
      getPublishedProducts(),
    ]);

    return storedCollections.map((storedCollection) => {
      const products = storedProducts
        .filter((product) => product.collectionSlug === storedCollection.slug)
        .sort((left, right) => left.position - right.position)
        .map((product): Product => product);
      return mapCollectionData(storedCollection, products);
    });
  } catch (error) {
    throw new StorefrontDataError("Could not load collections from Firestore.", { cause: error });
  }
}

async function getCollection(slug: string): Promise<Collection | null> {
  try {
    const collectionSnapshot = await getDoc(doc(db, "collections", slug));
    if (!collectionSnapshot.exists() || collectionSnapshot.data().status !== "published")
      return null;

    const productSnapshot = await getDocs(
      query(
        collection(db, "products"),
        where("status", "==", "published"),
        where("collectionSlug", "==", slug),
      ),
    );
    const products = productSnapshot.docs
      .map(mapProduct)
      .sort((left, right) => left.position - right.position)
      .map((product): Product => product);

    return mapCollectionData(collectionSnapshot.data(), products);
  } catch (error) {
    throw new StorefrontDataError(`Could not load the ${slug} collection from Firestore.`, {
      cause: error,
    });
  }
}

async function getProduct(productId: string): Promise<ProductPageData | null> {
  try {
    const productSnapshot = await getDoc(doc(db, "products", productId));
    if (!productSnapshot.exists() || productSnapshot.data().status !== "published") return null;

    const storedProduct = productSnapshot.data() as StoredProduct;
    const collectionData = await getCollection(storedProduct.collectionSlug);
    if (!collectionData) return null;

    const product = mapProductData({
      ...storedProduct,
      id: storedProduct.id || productSnapshot.id,
    });
    return {
      product,
      collection: collectionData,
      similarProducts: collectionData.products.filter((entry) => entry.id !== product.id),
    };
  } catch (error) {
    throw new StorefrontDataError(`Could not load product ${productId} from Firestore.`, {
      cause: error,
    });
  }
}

async function getStorefrontInfo(): Promise<StorefrontInfo | null> {
  try {
    const snapshot = await getDoc(doc(db, "siteContent", "store"));
    if (!snapshot.exists() || snapshot.data().status !== "published") return null;
    const data = snapshot.data();
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
  } catch (error) {
    throw new StorefrontDataError("Could not load store information from Firestore.", {
      cause: error,
    });
  }
}

export const firestoreStorefrontRepository: StorefrontRepository = {
  getHomePage,
  getCollections,
  getCollection,
  getProduct,
  getStorefrontInfo,
};
