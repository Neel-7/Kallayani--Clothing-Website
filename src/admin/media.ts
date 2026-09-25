import { deleteObject, getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { adminStorage } from "@/lib/firebase-admin-client";
import type { ProductImage } from "@/types/admin";

const acceptedTypes = new Set(["image/jpeg", "image/png", "image/webp"]);
const maxImageBytes = 10 * 1024 * 1024;

function extensionFor(file: File) {
  if (file.type === "image/jpeg") return "jpg";
  if (file.type === "image/png") return "png";
  return "webp";
}

async function dimensionsFor(file: File) {
  const url = URL.createObjectURL(file);
  try {
    const image = new Image();
    image.src = url;
    await image.decode();
    return { width: image.naturalWidth, height: image.naturalHeight };
  } finally {
    URL.revokeObjectURL(url);
  }
}

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

  const id = crypto.randomUUID();
  const storagePath = `catalog/products/${productId}/original/${id}.${extensionFor(file)}`;
  const imageRef = ref(adminStorage, storagePath);
  const upload = uploadBytesResumable(imageRef, file, { contentType: file.type });
  const dimensions = await dimensionsFor(file);

  await new Promise<void>((resolvePromise, rejectPromise) => {
    upload.on(
      "state_changed",
      (snapshot) => onProgress(Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100)),
      rejectPromise,
      resolvePromise,
    );
  });

  return {
    id,
    storagePath,
    url: await getDownloadURL(upload.snapshot.ref),
    alt: alt.trim(),
    position: null,
    ...dimensions,
  };
}

export async function deleteProductImage(image: ProductImage) {
  if (!image.storagePath) return;
  await deleteObject(ref(adminStorage, image.storagePath));
}
