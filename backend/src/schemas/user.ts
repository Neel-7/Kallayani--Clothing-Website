import { z } from "zod";

export const profileSchema = z.object({
  firstName: z.string().trim().max(100).default(""),
  lastName: z.string().trim().max(100).default(""),
  marketingOptIn: z.boolean().default(false),
});

const cartLineSchema = z.object({
  productId: z.string().min(1).max(160),
  variantId: z.string().min(1).max(160),
  quantity: z.number().int().min(1).max(20),
});

export const commerceStateSchema = z.object({
  wishlist: z.array(z.string().min(1).max(160)).max(500),
  cartLines: z.array(cartLineSchema).max(100),
  bagCount: z.number().int().nonnegative().optional(),
});

export const createOrderSchema = z.object({
  lines: z.array(cartLineSchema).min(1).max(100),
  shippingAddress: z.object({
    name: z.string().trim().min(2).max(180),
    line1: z.string().trim().min(3).max(240),
    line2: z.string().trim().max(240).optional(),
    city: z.string().trim().min(2).max(120),
    region: z.string().trim().max(120),
    postalCode: z.string().trim().min(2).max(40),
    country: z.string().trim().length(2).transform((value) => value.toUpperCase()),
    phone: z.string().trim().min(6).max(40),
  }),
});
