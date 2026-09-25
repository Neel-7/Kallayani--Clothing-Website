import type {
  Collection,
  HomePageData,
  ProductPageData,
  StorefrontInfo,
} from "@/types/catalog";

export interface StorefrontRepository {
  getHomePage(): Promise<HomePageData>;
  getCollections(): Promise<Collection[]>;
  getCollection(slug: string): Promise<Collection | null>;
  getProduct(productId: string): Promise<ProductPageData | null>;
  getStorefrontInfo(): Promise<StorefrontInfo | null>;
}

export class StorefrontDataError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
    this.name = "StorefrontDataError";
  }
}
