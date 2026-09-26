import type { Collection, Product, ProductVariant } from "@/types/catalog";
import type { ShopState } from "@/store/store";

export type CatalogProduct = Product & {
  collectionSlug: string;
  collectionName: string;
};

export function flattenCatalog(collections: Collection[]): CatalogProduct[] {
  return collections.flatMap((collection) =>
    collection.products.map((product) => ({
      ...product,
      collectionSlug: collection.slug,
      collectionName: collection.name,
    })),
  );
}

export function resolveVariant(product: Product, variantId: string): ProductVariant | undefined {
  return product.variants?.find((variant) => variant.id === variantId);
}

export function availableQuantity(product: Product, variantId: string) {
  if (product.inStock === false) return 0;
  const variant = resolveVariant(product, variantId);
  if (product.variants?.length) return variant?.inStock ? variant.availableQuantity : 0;
  return 6;
}

export function variantLabel(product: Product, variantId: string) {
  const variant = resolveVariant(product, variantId);
  if (variant) return variant.optionSummary || variant.size;
  return product.sizes?.[0] || "Standard";
}

export function linePrice(product: Product, variantId: string) {
  return resolveVariant(product, variantId)?.price ?? product.price;
}

export function getCartProducts(shop: ShopState, products: CatalogProduct[]) {
  const productMap = new Map(products.map((product) => [product.id, product]));
  return shop.cartLines.map((line) => ({
    line,
    product: productMap.get(line.productId),
  }));
}

export const dollars = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});
