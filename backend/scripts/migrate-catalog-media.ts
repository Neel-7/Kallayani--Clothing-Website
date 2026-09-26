import { randomUUID } from "node:crypto";
import { readFile } from "node:fs/promises";
import { extname, resolve } from "node:path";
import { applicationDefault, getApps, initializeApp } from "firebase-admin/app";
import { FieldValue, getFirestore } from "firebase-admin/firestore";
import { getDownloadURL, getStorage } from "firebase-admin/storage";

type LegacyImage = {
  url: string;
  alt?: string;
  position?: string | null;
};

type ProductImage = {
  id: string;
  storagePath: string;
  url: string;
  alt: string;
  position: string | null;
  width: number;
  height: number;
};

const projectId = process.env.VITE_FIREBASE_PROJECT_ID;
const storageBucket = process.env.VITE_FIREBASE_STORAGE_BUCKET;
const apply = process.argv.includes("--apply");
const workspaceRoot = resolve(import.meta.dirname, "../..");

if (!projectId || !storageBucket) {
  throw new Error("VITE_FIREBASE_PROJECT_ID and VITE_FIREBASE_STORAGE_BUCKET are required.");
}

if (!projectId.includes("dev") && !projectId.includes("staging")) {
  throw new Error(`Refusing to migrate unapproved project '${projectId}'.`);
}

const app =
  getApps()[0] ??
  initializeApp({
    ...(process.env.FIRESTORE_EMULATOR_HOST || process.env.FIREBASE_STORAGE_EMULATOR_HOST
      ? {}
      : { credential: applicationDefault() }),
    projectId,
    storageBucket,
  });
const db = getFirestore(app);
const bucket = getStorage(app).bucket();

function localImagePath(url: string) {
  if (!url.startsWith("/images/")) return null;
  const absolutePath = resolve(workspaceRoot, "frontend/public", url.slice(1));
  const publicRoot = resolve(workspaceRoot, "frontend/public");
  if (!absolutePath.startsWith(`${publicRoot}/`)) throw new Error(`Unsafe image path: ${url}`);
  return absolutePath;
}

function contentTypeFor(path: string) {
  const extension = extname(path).toLowerCase();
  if (extension === ".jpg" || extension === ".jpeg") return "image/jpeg";
  if (extension === ".png") return "image/png";
  if (extension === ".webp") return "image/webp";
  throw new Error(`Unsupported image type: ${extension}`);
}

function imageDimensions(buffer: Buffer, contentType: string) {
  if (contentType === "image/png" && buffer.length >= 24) {
    return { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) };
  }

  if (contentType === "image/webp" && buffer.length >= 30) {
    const format = buffer.toString("ascii", 12, 16);
    if (format === "VP8X") {
      return {
        width: 1 + buffer.readUIntLE(24, 3),
        height: 1 + buffer.readUIntLE(27, 3),
      };
    }
    if (format === "VP8 " && buffer.toString("hex", 23, 26) === "9d012a") {
      return {
        width: buffer.readUInt16LE(26) & 0x3fff,
        height: buffer.readUInt16LE(28) & 0x3fff,
      };
    }
    if (format === "VP8L" && buffer[20] === 0x2f) {
      const bits = buffer.readUInt32LE(21);
      return { width: (bits & 0x3fff) + 1, height: ((bits >> 14) & 0x3fff) + 1 };
    }
  }

  if (contentType === "image/jpeg") {
    let offset = 2;
    while (offset + 9 < buffer.length) {
      if (buffer[offset] !== 0xff) break;
      const marker = buffer[offset + 1];
      const length = buffer.readUInt16BE(offset + 2);
      if (marker >= 0xc0 && marker <= 0xc3) {
        return { width: buffer.readUInt16BE(offset + 7), height: buffer.readUInt16BE(offset + 5) };
      }
      offset += 2 + length;
    }
  }

  return { width: 0, height: 0 };
}

async function uploadImage(productId: string, image: LegacyImage): Promise<ProductImage> {
  const sourcePath = localImagePath(image.url);
  if (!sourcePath) throw new Error(`Image is not a local catalogue asset: ${image.url}`);

  const bytes = await readFile(sourcePath);
  const contentType = contentTypeFor(sourcePath);
  const id = randomUUID();
  const downloadToken = randomUUID();
  const storagePath = `catalog/products/${productId}/original/${id}${extname(sourcePath).toLowerCase()}`;
  const file = bucket.file(storagePath);
  await file.save(bytes, {
    resumable: false,
    metadata: {
      contentType,
      metadata: { firebaseStorageDownloadTokens: downloadToken },
    },
  });
  const url = await getDownloadURL(file);
  return {
    id,
    storagePath,
    url,
    alt: image.alt?.trim() || productId,
    position: image.position ?? null,
    ...imageDimensions(bytes, contentType),
  };
}

const productSnapshot = await db.collection("products").get();
let productCount = 0;
let imageCount = 0;

for (const productEntry of productSnapshot.docs) {
  const data = productEntry.data();
  const primaryUrl = data.primaryImage?.url ?? data.primaryImageUrl;
  const legacyGallery = (data.gallery ?? []) as LegacyImage[];
  const images = [primaryUrl, ...legacyGallery.map((image) => image.url)].filter(
    (url): url is string => typeof url === "string" && url.startsWith("/images/"),
  );
  if (images.length === 0) continue;

  productCount += 1;
  imageCount += images.length;
  console.log(
    `${apply ? "Migrating" : "Would migrate"} ${productEntry.id}: ${images.length} image(s)`,
  );
  if (!apply) continue;

  const uploadedPaths: string[] = [];
  try {
    const primaryImage = await uploadImage(productEntry.id, {
      url: primaryUrl,
      alt: data.primaryImage?.alt ?? data.imageAlt ?? data.title,
      position: data.primaryImage?.position ?? data.imagePosition ?? null,
    });
    uploadedPaths.push(primaryImage.storagePath);

    const gallery: ProductImage[] = [];
    for (const image of legacyGallery) {
      if (!image.url.startsWith("/images/")) {
        gallery.push(image as ProductImage);
        continue;
      }
      const uploaded = await uploadImage(productEntry.id, image);
      uploadedPaths.push(uploaded.storagePath);
      gallery.push(uploaded);
    }

    await productEntry.ref.update({
      primaryImage,
      primaryImageUrl: primaryImage.url,
      imageAlt: primaryImage.alt,
      imagePosition: primaryImage.position,
      gallery,
      updatedAt: FieldValue.serverTimestamp(),
      updatedBy: "catalog-media-migration",
    });
  } catch (error) {
    await Promise.allSettled(uploadedPaths.map((path) => bucket.file(path).delete()));
    throw error;
  }
}

console.log(
  apply
    ? `Migrated ${imageCount} image(s) across ${productCount} product(s).`
    : `Dry run: ${imageCount} image(s) across ${productCount} product(s) require migration. Re-run with --apply to write.`,
);
