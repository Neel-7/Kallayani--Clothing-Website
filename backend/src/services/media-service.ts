import { randomUUID } from "node:crypto";
import sharp from "sharp";
import { env } from "../config/env.js";
import { firestore, storageBucket } from "../config/firebase.js";
import { AppError } from "../lib/app-error.js";

const allowedMimeTypes = new Set(["image/jpeg", "image/png", "image/webp"]);

function downloadUrl(path: string, token: string) {
  const encodedPath = encodeURIComponent(path);
  if (env.useEmulators) {
    return `http://127.0.0.1:9199/v0/b/${storageBucket.name}/o/${encodedPath}?alt=media&token=${token}`;
  }
  return `https://firebasestorage.googleapis.com/v0/b/${storageBucket.name}/o/${encodedPath}?alt=media&token=${token}`;
}

async function saveImage(path: string, buffer: Buffer, token: string) {
  await storageBucket.file(path).save(buffer, {
    resumable: false,
    metadata: {
      contentType: "image/webp",
      cacheControl: "public,max-age=31536000,immutable",
      metadata: { firebaseStorageDownloadTokens: token },
    },
  });
}

export async function uploadProductImage(productId: string, file: Express.Multer.File, alt: string) {
  if (!allowedMimeTypes.has(file.mimetype))
    throw new AppError(415, "INVALID_IMAGE_TYPE", "Use a JPEG, PNG, or WebP image.");
  if (!alt.trim()) throw new AppError(400, "ALT_TEXT_REQUIRED", "Image alt text is required.");

  const id = randomUUID();
  const originalPath = `catalog/products/${productId}/original/${id}.webp`;
  const thumbnailPath = `catalog/products/${productId}/thumbnail/${id}.webp`;
  const originalToken = randomUUID();
  const thumbnailToken = randomUUID();

  let original: Buffer;
  let thumbnail: Buffer;
  let metadata: sharp.Metadata;
  try {
    const image = sharp(file.buffer, { failOn: "error" }).rotate();
    metadata = await image.metadata();
    original = await image
      .clone()
      .resize({ width: 2400, height: 3000, fit: "inside", withoutEnlargement: true })
      .webp({ quality: 88 })
      .toBuffer();
    thumbnail = await image
      .clone()
      .resize({ width: 640, height: 800, fit: "inside", withoutEnlargement: true })
      .webp({ quality: 80 })
      .toBuffer();
  } catch {
    throw new AppError(400, "INVALID_IMAGE", "The uploaded file is not a valid image.");
  }

  try {
    await Promise.all([
      saveImage(originalPath, original, originalToken),
      saveImage(thumbnailPath, thumbnail, thumbnailToken),
    ]);
  } catch (error) {
    await Promise.allSettled([
      storageBucket.file(originalPath).delete({ ignoreNotFound: true }),
      storageBucket.file(thumbnailPath).delete({ ignoreNotFound: true }),
    ]);
    throw error;
  }

  return {
    id,
    storagePath: originalPath,
    url: downloadUrl(originalPath, originalToken),
    thumbnailStoragePath: thumbnailPath,
    thumbnailUrl: downloadUrl(thumbnailPath, thumbnailToken),
    alt: alt.trim(),
    position: null,
    width: metadata.width ?? 0,
    height: metadata.height ?? 0,
  };
}

export async function deleteProductImage(productId: string, paths: string[]) {
  const prefix = `catalog/products/${productId}/`;
  const safePaths = paths.filter((path) => path.startsWith(prefix));
  if (safePaths.length !== paths.length)
    throw new AppError(400, "INVALID_STORAGE_PATH", "The media path does not belong to this product.");
  const snapshot = await firestore.doc(`products/${productId}`).get();
  if (snapshot.exists) {
    const data = snapshot.data()!;
    const referencedPaths = new Set<string>([
      data.primaryImage?.storagePath,
      data.primaryImage?.thumbnailStoragePath,
      ...(data.gallery ?? []).flatMap((image: Record<string, unknown>) => [
        image.storagePath,
        image.thumbnailStoragePath,
      ]),
    ].filter((path): path is string => typeof path === "string" && path.length > 0));
    if (safePaths.some((path) => referencedPaths.has(path))) {
      throw new AppError(
        409,
        "MEDIA_STILL_REFERENCED",
        "Remove the image from the product before deleting its stored files.",
      );
    }
  }
  await Promise.all(
    safePaths.map((path) => storageBucket.file(path).delete({ ignoreNotFound: true })),
  );
}
