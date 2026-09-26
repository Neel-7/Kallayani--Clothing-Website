import { adminApi } from "@/store/admin-api";
import { apiErrorMessage } from "@/store/api-error";
import { store } from "@/store/store";
import type { ProductImage } from "@/types/admin";

const acceptedTypes = new Set(["image/jpeg", "image/png", "image/webp"]);
const maxImageBytes = 10 * 1024 * 1024;

export function validateImageFile(file: File) {
  if (!acceptedTypes.has(file.type)) throw new Error("Use a JPEG, PNG, or WebP image.");
  if (file.size > maxImageBytes) throw new Error("Images must be 10 MB or smaller.");
}

export async function uploadProductImage(
  productId: string,
  file: File,
  alt: string,
  onProgress: (percentage: number) => void,
): Promise<ProductImage> {
  validateImageFile(file);
  if (!alt.trim()) throw new Error("Add meaningful alt text before uploading.");
  onProgress(10);
  try {
    const image = await store
      .dispatch(adminApi.endpoints.uploadImage.initiate({ id: productId, file, alt }))
      .unwrap();
    onProgress(100);
    return image;
  } catch (reason) {
    onProgress(0);
    throw new Error(apiErrorMessage(reason, "The image could not be uploaded."));
  }
}

export async function deleteProductImage(productId: string, image: ProductImage) {
  const paths = [image.storagePath, image.thumbnailStoragePath].filter(Boolean) as string[];
  if (paths.length === 0) return;
  try {
    await store.dispatch(adminApi.endpoints.deleteImage.initiate({ id: productId, paths })).unwrap();
  } catch (reason) {
    throw new Error(apiErrorMessage(reason, "The image could not be deleted."));
  }
}
