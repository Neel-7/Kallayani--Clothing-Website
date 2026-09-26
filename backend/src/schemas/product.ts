import { z } from "zod";

export const statusSchema = z.enum(["draft", "published", "archived"]);

const productImageSchema = z.object({
  id: z.string().min(1).max(120),
  storagePath: z.string().max(500),
  url: z.string().min(1).max(2_000),
  thumbnailStoragePath: z.string().max(500).optional(),
  thumbnailUrl: z.string().max(2_000).optional(),
  alt: z.string().trim().min(1).max(240),
  position: z.string().max(100).nullable(),
  width: z.number().int().nonnegative(),
  height: z.number().int().nonnegative(),
});

const variantSchema = z.object({
  id: z.string().trim().min(1).max(120),
  sku: z.string().trim().min(1).max(120),
  optionSummary: z.string().trim().max(240),
  size: z.string().trim().max(80),
  price: z.number().nonnegative(),
  listPrice: z.number().nonnegative().nullable(),
  availableQuantity: z.number().int().nonnegative(),
  inStock: z.boolean(),
});

export const editableProductSchema = z.object({
  id: z.string().max(128).default(""),
  slug: z
    .string()
    .trim()
    .max(160)
    .refine((value) => !value || /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value), "Use a URL-safe slug."),
  title: z.string().trim().max(180),
  description: z.string().trim().max(10_000),
  status: statusSchema,
  primaryCategorySlug: z.string().trim().max(160),
  collectionSlug: z.string().trim().max(160),
  collectionSlugs: z.array(z.string().trim().max(160)).max(30),
  priceFrom: z.number().nonnegative(),
  priceTo: z.number().nonnegative(),
  listPriceFrom: z.number().nonnegative().nullable(),
  currency: z.literal("USD"),
  featured: z.boolean(),
  inStock: z.boolean(),
  badges: z.array(z.string().trim().max(80)).max(20),
  primaryImage: productImageSchema.nullable(),
  gallery: z.array(productImageSchema).max(30),
  variants: z.array(variantSchema).max(200),
  craft: z.string().trim().max(180),
  region: z.string().trim().max(180),
  seoTitle: z.string().trim().max(180),
  seoDescription: z.string().trim().max(320),
});

export const productMediaSchema = z.object({
  primaryImage: productImageSchema.nullable(),
  gallery: z.array(productImageSchema).max(30),
});

export const productStatusSchema = z.object({ status: statusSchema });
export type EditableProductInput = z.infer<typeof editableProductSchema>;
