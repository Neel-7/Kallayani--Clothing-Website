export type MediaAsset = {
  src: string;
  alt: string;
  position?: string;
  label?: string;
};

export type Product = {
  id: string;
  slug?: string;
  name: string;
  craft: string;
  region: string;
  price: number;
  listPrice?: number | null;
  inStock?: boolean;
  featured?: boolean;
  badges?: string[];
  ratingAverage?: number | null;
  ratingCount?: number;
  image: MediaAsset;
  gallery?: MediaAsset[];
  sizes?: string[];
  variants?: ProductVariant[];
};

export type ProductVariant = {
  id: string;
  sku: string;
  optionSummary: string;
  size: string;
  price: number;
  listPrice?: number | null;
  availableQuantity: number;
  inStock: boolean;
};

export type Subcategory = {
  name: string;
  image: MediaAsset;
};

export type Collection = {
  slug: string;
  name: string;
  headline: string;
  description: string;
  hero: MediaAsset;
  categoryImage: MediaAsset;
  subcategories: Subcategory[];
  products: Product[];
};

export type HeroSlide = {
  id: string;
  title: string;
  description: string;
  href: string;
  cta: string;
  image: MediaAsset;
};

export type EditorialFeature = {
  id?: string;
  title: string;
  description: string;
  href: string;
  image: MediaAsset;
};

export type HomeCategory = {
  id: string;
  slug: string;
  label: string;
  href: string;
  image: MediaAsset;
  position: number;
};

export type StorefrontInfo = {
  name: string;
  contactEmail: string;
  contactPhone: string | null;
  supportHours: string | null;
  addressLine: string;
  instagramUrl: string | null;
  facebookUrl: string | null;
  announcementBarText: string;
  secondaryAnnouncementText: string | null;
  freeShippingThreshold: number;
};

export type HomePageData = {
  heroSlides: HeroSlide[];
  categories: HomeCategory[];
  featuredProducts: Product[];
  editorialFeatures: EditorialFeature[];
};

export type ProductPageData = {
  product: Product;
  collection: Collection;
  similarProducts: Product[];
};
