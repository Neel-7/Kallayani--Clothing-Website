import type { Timestamp } from "firebase/firestore";

export type StaffRole = "admin" | "manager";
export type CatalogStatus = "draft" | "published" | "archived";

export type ProductImage = {
  id: string;
  storagePath: string;
  url: string;
  alt: string;
  position: string | null;
  width: number;
  height: number;
};

export type ProductVariantDocument = {
  id: string;
  sku: string;
  optionSummary: string;
  size: string;
  price: number;
  listPrice: number | null;
  availableQuantity: number;
  inStock: boolean;
};

export type ProductDocument = {
  id: string;
  slug: string;
  title: string;
  description: string;
  status: CatalogStatus;
  primaryCategorySlug: string;
  collectionSlug: string;
  collectionSlugs: string[];
  priceFrom: number;
  priceTo: number;
  listPriceFrom: number | null;
  currency: "USD";
  featured: boolean;
  inStock: boolean;
  badges: string[];
  primaryImage: ProductImage | null;
  gallery: ProductImage[];
  variants: ProductVariantDocument[];
  craft: string;
  region: string;
  seoTitle: string;
  seoDescription: string;
  createdAt: Timestamp | null;
  createdBy: string;
  updatedAt: Timestamp | null;
  updatedBy: string;
  publishedAt: Timestamp | null;
};

export type EditableProduct = Omit<
  ProductDocument,
  "createdAt" | "createdBy" | "updatedAt" | "updatedBy" | "publishedAt"
>;
