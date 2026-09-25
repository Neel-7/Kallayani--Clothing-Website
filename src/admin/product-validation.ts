import { productSlugExists } from "./admin-repository";
import type { EditableProduct } from "@/types/admin";

export async function validateForPublishing(product: EditableProduct, productId?: string) {
  const errors: string[] = [];
  if (!product.slug.trim()) errors.push("Add a unique slug.");
  else if (await productSlugExists(product.slug.trim(), productId))
    errors.push("The slug is already in use.");
  if (!product.title.trim()) errors.push("Add a product title.");
  if (!product.description.trim()) errors.push("Add a product description.");
  if (!product.primaryCategorySlug) errors.push("Choose a primary category.");
  if (!Number.isFinite(product.priceFrom) || product.priceFrom <= 0)
    errors.push("Enter a valid USD price.");
  if (product.variants.length === 0) errors.push("Add at least one variant.");
  if (!product.variants.some((variant) => variant.inStock && variant.availableQuantity > 0))
    errors.push("At least one variant must be in stock.");
  if (!product.primaryImage) errors.push("Add a primary image.");
  if (product.primaryImage && !product.primaryImage.alt.trim())
    errors.push("Add alt text to the primary image.");
  return errors;
}
