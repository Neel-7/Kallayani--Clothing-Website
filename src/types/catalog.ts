export type MediaAsset = {
  src: string;
  alt: string;
  position?: string;
};

export type Product = {
  id: string;
  name: string;
  craft: string;
  region: string;
  price: number;
  image: MediaAsset;
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
  title: string;
  description: string;
  href: string;
  image: MediaAsset;
};
