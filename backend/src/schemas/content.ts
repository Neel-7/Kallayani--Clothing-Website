import { z } from "zod";
import { statusSchema } from "./product.js";

const mediaSchema = z.object({
  src: z.string().max(2_000),
  alt: z.string().trim().max(240),
  position: z.string().max(100).optional(),
  label: z.string().max(120).optional(),
});

export const createCollectionSchema = z.object({
  slug: z.string().trim().min(1).max(160).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  name: z.string().trim().min(1).max(180),
});

export const collectionSchema = z.object({
  id: z.string().min(1).max(160),
  slug: z.string().min(1).max(160),
  name: z.string().trim().min(1).max(180),
  headline: z.string().trim().max(300),
  description: z.string().trim().max(5_000),
  hero: mediaSchema,
  categoryImage: mediaSchema,
  subcategories: z
    .array(z.object({ name: z.string().trim().min(1).max(180), image: mediaSchema }))
    .max(40),
  position: z.number().int().nonnegative(),
  status: statusSchema,
  updatedAt: z.unknown().nullable().optional(),
  updatedBy: z.string().optional(),
});

export const homepageEntrySchema = z.object({
  id: z.string().min(1).max(180),
  kind: z.enum(["banner", "category", "editorial"]),
  title: z.string().trim().max(240),
  description: z.string().trim().max(5_000),
  imageUrl: z.string().max(2_000),
  imageAlt: z.string().trim().max(240),
  imagePosition: z.string().max(100),
  linkUrl: z.string().max(1_000),
  ctaLabel: z.string().trim().max(120),
  position: z.number().int().nonnegative(),
  status: statusSchema,
  updatedAt: z.unknown().nullable().optional(),
});
