import {
  FieldValue,
  Timestamp,
  type DocumentSnapshot,
  type Transaction,
} from "firebase-admin/firestore";
import { firestore } from "../config/firebase.js";
import { AppError } from "../lib/app-error.js";
import { toIsoString } from "../lib/firestore-values.js";
import type { StoreSettingsInput } from "../schemas/admin.js";
import { getStoreSettings } from "./settings-service.js";

export type CheckoutLineInput = {
  productId: string;
  variantId: string;
  quantity: number;
};
export type ShippingAddress = {
  name: string;
  line1: string;
  line2: string;
  city: string;
  region: string;
  postalCode: string;
  country: string;
  phone: string;
};
export type DeliveryMethodId = "standard" | "express";
export type CheckoutInput = {
  lines: CheckoutLineInput[];
  shippingAddress: ShippingAddress;
  deliveryMethodId: DeliveryMethodId;
};

const expiredReservationBatchSize = 20;
type StoreSettings = StoreSettingsInput;

function groupLines(lines: CheckoutLineInput[]) {
  const grouped = new Map<string, CheckoutLineInput[]>();
  for (const line of lines) {
    const entries = grouped.get(line.productId) ?? [];
    const duplicate = entries.find((entry) => entry.variantId === line.variantId);
    if (duplicate) duplicate.quantity += line.quantity;
    else entries.push({ ...line });
    grouped.set(line.productId, entries);
  }
  return grouped;
}

function deliveryMethods(subtotal: number, settings: StoreSettings) {
  return [
    {
      id: "standard" as const,
      name: "Standard delivery",
      description: "Delivered in 4 to 7 business days",
      amount:
        subtotal >= settings.standardShippingThreshold
          ? 0
          : settings.standardShippingFee,
    },
    {
      id: "express" as const,
      name: "Express delivery",
      description: "Delivered in 2 to 3 business days",
      amount: settings.expressShippingFee,
    },
  ];
}

function buildQuote(
  input: CheckoutInput,
  snapshots: Array<DocumentSnapshot>,
  settings: StoreSettings,
  transaction?: Transaction,
  orderId?: string,
) {
  const grouped = groupLines(input.lines);
  const orderLines: Array<Record<string, unknown> & { lineTotal: number }> = [];
  const inventoryIssues: Array<{
    productId: string;
    variantId: string;
    requestedQuantity: number;
    availableQuantity: number;
    message: string;
  }> = [];

  for (const snapshot of snapshots) {
    const product = snapshot.data();
    const requestedLines = grouped.get(snapshot.id) ?? [];
    if (!snapshot.exists || product?.status !== "published") {
      for (const line of requestedLines) {
        inventoryIssues.push({
          productId: line.productId,
          variantId: line.variantId,
          requestedQuantity: line.quantity,
          availableQuantity: 0,
          message: "This product is no longer available.",
        });
      }
      continue;
    }

    const nextVariants = ((product.variants ?? []) as Array<Record<string, unknown>>).map(
      (entry) => ({ ...entry }),
    );
    for (const line of requestedLines) {
      const variant = nextVariants.find((entry) => entry.id === line.variantId);
      const available = Number(variant?.availableQuantity ?? 0);
      if (!variant || !variant.inStock || available < line.quantity) {
        inventoryIssues.push({
          productId: line.productId,
          variantId: line.variantId,
          requestedQuantity: line.quantity,
          availableQuantity: available,
          message:
            available > 0
              ? `Only ${available} ${available === 1 ? "piece is" : "pieces are"} available.`
              : "This piece is no longer available.",
        });
        continue;
      }

      const unitPrice = Number(variant.price ?? product.priceFrom ?? 0);
      orderLines.push({
        productId: snapshot.id,
        variantId: line.variantId,
        title: product.title,
        sku: variant.sku,
        optionSummary: variant.optionSummary ?? "",
        imageUrl: product.primaryImage?.url ?? product.primaryImageUrl ?? "",
        quantity: line.quantity,
        unitPrice,
        lineTotal: unitPrice * line.quantity,
      });
      if (transaction && orderId) {
        variant.availableQuantity = available - line.quantity;
        variant.inStock = available - line.quantity > 0;
      }
    }

    if (transaction && orderId && requestedLines.length > 0) {
      transaction.update(snapshot.ref, {
        variants: nextVariants,
        inStock: nextVariants.some((entry) => entry.inStock),
        updatedAt: FieldValue.serverTimestamp(),
        updatedBy: `checkout:${orderId}`,
      });
    }
  }

  if (inventoryIssues.length > 0) {
    throw new AppError(
      409,
      "INVENTORY_CHANGED",
      "Availability changed while you were checking out. Review your bag and try again.",
      { issues: inventoryIssues },
    );
  }

  const subtotal = orderLines.reduce((total, line) => total + line.lineTotal, 0);
  const methods = deliveryMethods(subtotal, settings);
  const selectedMethod = methods.find((method) => method.id === input.deliveryMethodId);
  if (!selectedMethod) {
    throw new AppError(400, "DELIVERY_METHOD_INVALID", "Choose an available delivery method.");
  }
  const shippingTotal = selectedMethod.amount;
  const taxTotal = 0;
  const total = subtotal + shippingTotal + taxTotal;

  return {
    currency: "USD" as const,
    lines: orderLines,
    deliveryMethods: methods,
    deliveryMethod: selectedMethod,
    subtotal,
    shippingTotal,
    taxTotal,
    total,
  };
}

export async function quoteCheckout(input: CheckoutInput) {
  const settings = await getStoreSettings();
  const grouped = groupLines(input.lines);
  const references = [...grouped.keys()].map((productId) =>
    firestore.doc(`products/${productId}`),
  );
  const snapshots = await firestore.getAll(...references);
  return buildQuote(input, snapshots, settings);
}

export async function reserveCheckoutOrder(
  uid: string,
  input: CheckoutInput,
  customerEmail?: string,
) {
  const settings = await getStoreSettings();
  const orderReference = firestore.collection("orders").doc();
  return firestore.runTransaction(async (transaction) => {
    const grouped = groupLines(input.lines);
    const references = [...grouped.keys()].map((productId) =>
      firestore.doc(`products/${productId}`),
    );
    const snapshots = await transaction.getAll(...references);
    const quote = buildQuote(input, snapshots, settings, transaction, orderReference.id);
    const reservationExpiresAt = Timestamp.fromDate(
      new Date(Date.now() + settings.reservationMinutes * 60_000),
    );

    transaction.create(orderReference, {
      id: orderReference.id,
      displayNumber: `${settings.orderPrefix}-${orderReference.id.slice(0, 8).toUpperCase()}`,
      userId: uid,
      customerEmail: customerEmail ?? null,
      status: "awaiting_payment",
      paymentStatus: "pending",
      fulfillmentStatus: "unfulfilled",
      reservationStatus: "reserved",
      reservationExpiresAt,
      currency: quote.currency,
      lines: quote.lines,
      subtotal: quote.subtotal,
      shippingTotal: quote.shippingTotal,
      taxTotal: quote.taxTotal,
      total: quote.total,
      deliveryMethod: quote.deliveryMethod,
      shippingAddress: input.shippingAddress,
      paymentProvider: "stripe",
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });

    return {
      orderId: orderReference.id,
      reservationExpiresAt: reservationExpiresAt.toDate().toISOString(),
      ...quote,
    };
  });
}

export async function attachPaymentIntent(orderId: string, paymentIntentId: string) {
  await firestore.doc(`orders/${orderId}`).update({
    paymentIntentId,
    updatedAt: FieldValue.serverTimestamp(),
  });
}

export async function finalizeOrderPayment(orderId: string, paymentIntentId: string) {
  const reference = firestore.doc(`orders/${orderId}`);
  await firestore.runTransaction(async (transaction) => {
    const snapshot = await transaction.get(reference);
    if (!snapshot.exists) {
      throw new AppError(404, "ORDER_NOT_FOUND", "This order could not be found.");
    }
    const order = snapshot.data()!;
    if (order.paymentIntentId && order.paymentIntentId !== paymentIntentId) {
      throw new AppError(409, "PAYMENT_MISMATCH", "The payment does not belong to this order.");
    }
    if (order.paymentStatus === "paid") return;
    if (order.reservationStatus !== "reserved") {
      throw new AppError(409, "RESERVATION_RELEASED", "This order reservation is no longer active.");
    }
    transaction.update(reference, {
      status: "confirmed",
      paymentStatus: "paid",
      reservationStatus: "consumed",
      paidAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });
  });
}

export async function markOrderProcessing(orderId: string, paymentIntentId: string) {
  const reference = firestore.doc(`orders/${orderId}`);
  const snapshot = await reference.get();
  if (!snapshot.exists || snapshot.data()?.paymentIntentId !== paymentIntentId) return;
  await reference.update({
    status: "payment_processing",
    paymentStatus: "processing",
    updatedAt: FieldValue.serverTimestamp(),
  });
}

export async function releaseOrderReservation(
  orderId: string,
  reason = "payment_failed",
) {
  const reference = firestore.doc(`orders/${orderId}`);
  await firestore.runTransaction(async (transaction) => {
    const orderSnapshot = await transaction.get(reference);
    if (!orderSnapshot.exists) return;
    const order = orderSnapshot.data()!;
    if (order.reservationStatus !== "reserved") return;

    const lines = (order.lines ?? []) as CheckoutLineInput[];
    const grouped = groupLines(lines);
    const productReferences = [...grouped.keys()].map((productId) =>
      firestore.doc(`products/${productId}`),
    );
    const productSnapshots = await transaction.getAll(...productReferences);
    for (const productSnapshot of productSnapshots) {
      if (!productSnapshot.exists) continue;
      const product = productSnapshot.data()!;
      const requestedLines = grouped.get(productSnapshot.id) ?? [];
      const nextVariants = ((product.variants ?? []) as Array<Record<string, unknown>>).map(
        (entry) => ({ ...entry }),
      );
      for (const line of requestedLines) {
        const variant = nextVariants.find((entry) => entry.id === line.variantId);
        if (!variant) continue;
        variant.availableQuantity = Number(variant.availableQuantity ?? 0) + line.quantity;
        variant.inStock = true;
      }
      transaction.update(productSnapshot.ref, {
        variants: nextVariants,
        inStock: nextVariants.some((entry) => entry.inStock),
        updatedAt: FieldValue.serverTimestamp(),
        updatedBy: `checkout-release:${orderId}`,
      });
    }
    transaction.update(reference, {
      status: "payment_failed",
      paymentStatus: "failed",
      reservationStatus: "released",
      failureReason: reason,
      updatedAt: FieldValue.serverTimestamp(),
    });
  });
}

export async function getOrderForPayment(uid: string, orderId: string) {
  const snapshot = await firestore.doc(`orders/${orderId}`).get();
  if (!snapshot.exists || snapshot.data()?.userId !== uid) {
    throw new AppError(404, "ORDER_NOT_FOUND", "This order could not be found.");
  }
  return snapshot.data()!;
}

export async function listExpiredCheckoutReservations(
  limit = expiredReservationBatchSize,
) {
  const snapshot = await firestore
    .collection("orders")
    .where("reservationExpiresAt", "<=", Timestamp.now())
    .limit(limit)
    .get();

  return snapshot.docs.flatMap((entry) => {
    const data = entry.data();
    if (data.reservationStatus !== "reserved") return [];
    return [
      {
        orderId: entry.id,
        paymentIntentId:
          typeof data.paymentIntentId === "string" ? data.paymentIntentId : null,
      },
    ];
  });
}

export async function listOrders(uid: string) {
  const snapshot = await firestore.collection("orders").where("userId", "==", uid).get();
  return snapshot.docs
    .filter((entry) => entry.data().reservationStatus !== "released")
    .map((entry) => {
      const data = entry.data();
      return {
        ...data,
        id: entry.id,
        createdAt: toIsoString(data.createdAt),
        updatedAt: toIsoString(data.updatedAt),
      };
    })
    .sort(
      (a, b) =>
        Date.parse(b.createdAt ?? "1970-01-01") -
        Date.parse(a.createdAt ?? "1970-01-01"),
    );
}

export async function getOrder(uid: string, orderId: string) {
  const snapshot = await firestore.doc(`orders/${orderId}`).get();
  if (!snapshot.exists || snapshot.data()?.userId !== uid) {
    throw new AppError(404, "ORDER_NOT_FOUND", "This order could not be found.");
  }
  const data = snapshot.data()!;
  return {
    ...data,
    id: snapshot.id,
    createdAt: toIsoString(data.createdAt),
    updatedAt: toIsoString(data.updatedAt),
    paidAt: toIsoString(data.paidAt),
    reservationExpiresAt: toIsoString(data.reservationExpiresAt),
  };
}
