import { z } from "zod";

export const fulfillmentUpdateSchema = z.object({
  status: z.enum(["unfulfilled", "picking", "packed", "shipped", "delivered"]),
  carrier: z.string().trim().max(120).default(""),
  trackingNumber: z.string().trim().max(180).default(""),
});

export const refundOrderSchema = z.object({
  amount: z.number().positive().max(1_000_000),
  reason: z.string().trim().min(3).max(500),
  restock: z.boolean().default(false),
  operationId: z.string().uuid(),
});

export const cancelOrderSchema = z.object({
  reason: z.string().trim().min(3).max(500),
  operationId: z.string().uuid(),
});

export const storeSettingsSchema = z.object({
  storeName: z.string().trim().min(2).max(120),
  supportEmail: z.string().trim().email().max(254),
  supportPhone: z.string().trim().max(40),
  currency: z.literal("USD"),
  lowStockThreshold: z.number().int().min(0).max(10_000),
  standardShippingThreshold: z.number().min(0).max(1_000_000),
  standardShippingFee: z.number().min(0).max(100_000),
  expressShippingFee: z.number().min(0).max(100_000),
  reservationMinutes: z.number().int().min(5).max(240),
  orderPrefix: z.string().trim().min(2).max(12).regex(/^[A-Z0-9]+$/),
});

export type StoreSettingsInput = z.infer<typeof storeSettingsSchema>;
