export type StaffRole = "admin" | "manager";
export type CatalogStatus = "draft" | "published" | "archived";

export type ProductImage = {
  id: string;
  storagePath: string;
  url: string;
  thumbnailStoragePath?: string;
  thumbnailUrl?: string;
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
  createdAt: string | null;
  createdBy: string;
  updatedAt: string | null;
  updatedBy: string;
  publishedAt: string | null;
};

export type EditableProduct = Omit<
  ProductDocument,
  "createdAt" | "createdBy" | "updatedAt" | "updatedBy" | "publishedAt"
>;

export type AdminCollectionOption = { slug: string; name: string };

export type AdminCollectionDocument = {
  id: string;
  slug: string;
  name: string;
  headline: string;
  description: string;
  hero: import("./catalog").MediaAsset;
  categoryImage: import("./catalog").MediaAsset;
  subcategories: import("./catalog").Subcategory[];
  position: number;
  status: CatalogStatus;
  updatedAt: string | null;
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
  updatedAt: string | null;
};
