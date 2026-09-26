import { FieldValue } from "firebase-admin/firestore";
import { firestore } from "../config/firebase.js";
import { AppError } from "../lib/app-error.js";
import { toIsoString } from "../lib/firestore-values.js";

type OrderInput = {
  lines: Array<{ productId: string; variantId: string; quantity: number }>;
  shippingAddress: Record<string, string | undefined>;
};

export async function createOrder(uid: string, input: OrderInput) {
  const orderReference = firestore.collection("orders").doc();
  await firestore.runTransaction(async (transaction) => {
    const groupedLines = new Map<string, typeof input.lines>();
    for (const line of input.lines) {
      const lines = groupedLines.get(line.productId) ?? [];
      const duplicate = lines.find((entry) => entry.variantId === line.variantId);
      if (duplicate) duplicate.quantity += line.quantity;
      else lines.push({ ...line });
      groupedLines.set(line.productId, lines);
    }
    const productReferences = [...groupedLines.keys()].map((productId) =>
      firestore.doc(`products/${productId}`),
    );
    const productSnapshots = await transaction.getAll(...productReferences);
    const orderLines: Array<Record<string, unknown> & { lineTotal: number }> = [];
    productSnapshots.forEach((snapshot) => {
      const product = snapshot?.data();
      if (!snapshot?.exists || product?.status !== "published")
        throw new AppError(409, "PRODUCT_UNAVAILABLE", "A product in your bag is no longer available.");
      const requestedLines = groupedLines.get(snapshot.id) ?? [];
      const nextVariants = ((product.variants ?? []) as Array<Record<string, unknown>>).map((entry) => ({ ...entry }));
      for (const line of requestedLines) {
        const variant = nextVariants.find((entry) => entry.id === line.variantId);
        const available = Number(variant?.availableQuantity ?? 0);
        if (!variant || !variant.inStock || available < line.quantity)
          throw new AppError(409, "INSUFFICIENT_STOCK", `${product.title} does not have enough stock.`);
        const unitPrice = Number(variant.price ?? product.priceFrom ?? 0);
        variant.availableQuantity = available - line.quantity;
        variant.inStock = available - line.quantity > 0;
        orderLines.push({
          productId: snapshot.id,
          variantId: line.variantId,
          title: product.title,
          sku: variant.sku,
          imageUrl: product.primaryImage?.url ?? product.primaryImageUrl ?? "",
          quantity: line.quantity,
          unitPrice,
          lineTotal: unitPrice * line.quantity,
        });
      }
      transaction.update(snapshot.ref, {
        variants: nextVariants,
        inStock: nextVariants.some((entry) => entry.inStock),
        updatedAt: FieldValue.serverTimestamp(),
        updatedBy: `order:${orderReference.id}`,
      });
    });
    const subtotal = orderLines.reduce((total, line) => total + line.lineTotal, 0);
    transaction.create(orderReference, {
      id: orderReference.id,
      userId: uid,
      status: "pending",
      paymentStatus: "unpaid",
      fulfillmentStatus: "unfulfilled",
      currency: "USD",
      lines: orderLines,
      subtotal,
      shippingTotal: 0,
      taxTotal: 0,
      total: subtotal,
      shippingAddress: input.shippingAddress,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });
  });
  return orderReference.id;
}

export async function listOrders(uid: string) {
  const snapshot = await firestore.collection("orders").where("userId", "==", uid).get();
  return snapshot.docs
    .map((entry) => {
      const data = entry.data();
      return { ...data, id: entry.id, createdAt: toIsoString(data.createdAt), updatedAt: toIsoString(data.updatedAt) };
    })
    .sort((a, b) => Date.parse(b.createdAt ?? "1970-01-01") - Date.parse(a.createdAt ?? "1970-01-01"));
}
