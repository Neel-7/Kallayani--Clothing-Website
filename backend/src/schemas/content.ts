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
  description: z.string().trim().max(5_000).optional().default(""),
  imageUrl: z.string().max(2_000).optional().default(""),
  imageAlt: z.string().trim().max(240).optional().default(""),
  imagePosition: z.string().max(100).optional().default(""),
  linkUrl: z.string().max(1_000).optional().default(""),
  ctaLabel: z.string().trim().max(120).optional().default(""),
  position: z.number().int().nonnegative().optional().default(0),
  status: statusSchema,
  updatedAt: z.unknown().nullable().optional(),
});

export const createHomepageEntrySchema = z.object({
  id: z.string().trim().min(1).max(180).optional(),
  kind: z.enum(["banner", "category", "editorial"]),
  title: z.string().trim().min(1, "Title is required").max(240),
  description: z.string().trim().max(5_000).optional().default(""),
  imageUrl: z.string().max(2_000).optional().default(""),
  imageAlt: z.string().trim().max(240).optional().default(""),
  imagePosition: z.string().max(100).optional().default(""),
  linkUrl: z.string().max(1_000).optional().default(""),
  ctaLabel: z.string().trim().max(120).optional().default(""),
  position: z.number().int().nonnegative().optional().default(0),
  status: statusSchema.optional().default("draft"),
});
