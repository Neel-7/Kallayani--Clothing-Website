import { FieldValue, Timestamp, type DocumentData } from "firebase-admin/firestore";
import { firebaseAuth, firestore } from "../config/firebase.js";
import { AppError } from "../lib/app-error.js";
import { toIsoString } from "../lib/firestore-values.js";
import { getStoreSettings } from "./settings-service.js";

const paidStatuses = new Set(["paid", "partially_refunded", "refunded"]);

type SerializedOrder = Record<string, unknown> & {
  id: string;
  createdAt: string | null;
  updatedAt: string | null;
  paidAt: string | null;
  canceledAt: string | null;
  fulfilledAt: string | null;
  deliveredAt: string | null;
  reservationExpiresAt: string | null;
  refunds: Array<Record<string, unknown>>;
};

function serializeOrder(id: string, data: DocumentData): SerializedOrder {
  return {
    ...data,
    id,
    createdAt: toIsoString(data.createdAt),
    updatedAt: toIsoString(data.updatedAt),
    paidAt: toIsoString(data.paidAt),
    canceledAt: toIsoString(data.canceledAt),
    fulfilledAt: toIsoString(data.fulfilledAt),
    deliveredAt: toIsoString(data.deliveredAt),
    reservationExpiresAt: toIsoString(data.reservationExpiresAt),
    refunds: ((data.refunds ?? []) as Array<Record<string, unknown>>).map((refund) => ({
      ...refund,
      createdAt: toIsoString(refund.createdAt),
    })),
  };
}

async function orderDocuments(limit = 500) {
  const snapshot = await firestore
    .collection("orders")
    .orderBy("createdAt", "desc")
    .limit(limit)
    .get();
  return snapshot.docs.map((entry) => serializeOrder(entry.id, entry.data()));
}

export async function listAdminOrders(limit = 250) {
  return orderDocuments(Math.min(Math.max(limit, 1), 500));
}

export async function getAdminOrder(orderId: string) {
  const snapshot = await firestore.doc(`orders/${orderId}`).get();
  if (!snapshot.exists) {
    throw new AppError(404, "ORDER_NOT_FOUND", "This order could not be found.");
  }
  return serializeOrder(snapshot.id, snapshot.data()!);
}

export async function updateOrderFulfillment(
  orderId: string,
  input: {
    status: "unfulfilled" | "picking" | "packed" | "shipped" | "delivered";
    carrier: string;
    trackingNumber: string;
  },
  staffUid: string,
) {
  const reference = firestore.doc(`orders/${orderId}`);
  const snapshot = await reference.get();
  if (!snapshot.exists) {
    throw new AppError(404, "ORDER_NOT_FOUND", "This order could not be found.");
  }
  const order = snapshot.data()!;
  if (!paidStatuses.has(String(order.paymentStatus)) || order.paymentStatus === "refunded") {
    throw new AppError(
      409,
      "ORDER_NOT_FULFILLABLE",
      "Only paid orders with a remaining balance can be fulfilled.",
    );
  }
  if (order.status === "canceled") {
    throw new AppError(409, "ORDER_CANCELED", "A canceled order cannot be fulfilled.");
  }
  if (input.status === "shipped" && !input.trackingNumber) {
    throw new AppError(400, "TRACKING_REQUIRED", "Add a tracking number before marking the order shipped.");
  }

  const status =
    input.status === "delivered"
      ? "completed"
      : input.status === "unfulfilled"
        ? "confirmed"
        : "fulfilling";
  await reference.update({
    status,
    fulfillmentStatus: input.status,
    tracking: {
      carrier: input.carrier,
      trackingNumber: input.trackingNumber,
    },
    ...(input.status === "shipped" ? { fulfilledAt: FieldValue.serverTimestamp() } : {}),
    ...(input.status === "delivered" ? { deliveredAt: FieldValue.serverTimestamp() } : {}),
    updatedAt: FieldValue.serverTimestamp(),
    updatedBy: staffUid,
  });
  return getAdminOrder(orderId);
}

export async function markAdminOrderCanceled(
  orderId: string,
  reason: string,
  staffUid: string,
) {
  const reference = firestore.doc(`orders/${orderId}`);
  const snapshot = await reference.get();
  if (!snapshot.exists) {
    throw new AppError(404, "ORDER_NOT_FOUND", "This order could not be found.");
  }
  await reference.update({
    status: "canceled",
    fulfillmentStatus: "canceled",
    cancellation: { reason, staffUid },
    canceledAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
    updatedBy: staffUid,
  });
}

export async function recordAdminRefund(
  orderId: string,
  input: {
    operationId: string;
    refundId: string;
    amount: number;
    reason: string;
    restock: boolean;
    staffUid: string;
  },
) {
  const orderReference = firestore.doc(`orders/${orderId}`);
  return firestore.runTransaction(async (transaction) => {
    const orderSnapshot = await transaction.get(orderReference);
    if (!orderSnapshot.exists) {
      throw new AppError(404, "ORDER_NOT_FOUND", "This order could not be found.");
    }
    const order = orderSnapshot.data()!;
    const refunds = (order.refunds ?? []) as Array<Record<string, unknown>>;
    if (refunds.some((refund) => refund.operationId === input.operationId)) {
      return serializeOrder(orderSnapshot.id, order);
    }

    const previousRefunded = Number(order.refundedAmount ?? 0);
    const nextRefunded = Math.min(Number(order.total ?? 0), previousRefunded + input.amount);
    const fullyRefunded = nextRefunded >= Number(order.total ?? 0);
    const shouldRestock = input.restock && fullyRefunded && !order.inventoryRestockedAt;

    if (input.restock && !fullyRefunded) {
      throw new AppError(
        400,
        "PARTIAL_RESTOCK_UNSUPPORTED",
        "Inventory can be restored only when the order is fully refunded.",
      );
    }

    if (shouldRestock) {
      const lines = (order.lines ?? []) as Array<{
        productId: string;
        variantId: string;
        quantity: number;
      }>;
      const grouped = new Map<string, typeof lines>();
      for (const line of lines) {
        const entries = grouped.get(line.productId) ?? [];
        entries.push(line);
        grouped.set(line.productId, entries);
      }
      const references = [...grouped.keys()].map((id) => firestore.doc(`products/${id}`));
      const products = await transaction.getAll(...references);
      for (const productSnapshot of products) {
        if (!productSnapshot.exists) continue;
        const product = productSnapshot.data()!;
        const variants = ((product.variants ?? []) as Array<Record<string, unknown>>).map(
          (variant) => ({ ...variant }),
        );
        for (const line of grouped.get(productSnapshot.id) ?? []) {
          const variant = variants.find((entry) => entry.id === line.variantId);
          if (!variant) continue;
          variant.availableQuantity = Number(variant.availableQuantity ?? 0) + line.quantity;
          variant.inStock = true;
        }
        transaction.update(productSnapshot.ref, {
          variants,
          inStock: variants.some((variant) => variant.inStock),
          updatedAt: FieldValue.serverTimestamp(),
          updatedBy: `refund:${orderId}`,
        });
      }
    }

    transaction.update(orderReference, {
      refundedAmount: nextRefunded,
      paymentStatus: fullyRefunded ? "refunded" : "partially_refunded",
      ...(fullyRefunded && order.status !== "canceled" ? { status: "refunded" } : {}),
      refunds: [
        ...refunds,
        {
          operationId: input.operationId,
          refundId: input.refundId,
          amount: input.amount,
          reason: input.reason,
          restocked: shouldRestock,
          staffUid: input.staffUid,
          createdAt: Timestamp.now(),
        },
      ],
      ...(shouldRestock ? { inventoryRestockedAt: FieldValue.serverTimestamp() } : {}),
      updatedAt: FieldValue.serverTimestamp(),
      updatedBy: input.staffUid,
    });
    return null;
  });
}

export async function listLowStockInventory(threshold?: number) {
  const settings = await getStoreSettings();
  const activeThreshold = threshold ?? settings.lowStockThreshold;
  const snapshot = await firestore.collection("products").get();
  return snapshot.docs
    .flatMap((entry) => {
      const product = entry.data();
      if (product.status === "archived") return [];
      return ((product.variants ?? []) as Array<Record<string, unknown>>).flatMap((variant) => {
        const availableQuantity = Number(variant.availableQuantity ?? 0);
        if (availableQuantity > activeThreshold) return [];
        return [{
          productId: entry.id,
          productTitle: String(product.title ?? "Untitled product"),
          productStatus: String(product.status ?? "draft"),
          imageUrl: String(product.primaryImage?.url ?? product.primaryImageUrl ?? ""),
          variantId: String(variant.id ?? ""),
          sku: String(variant.sku ?? ""),
          optionSummary: String(variant.optionSummary ?? variant.size ?? "Default"),
          availableQuantity,
          threshold: activeThreshold,
        }];
      });
    })
    .sort((left, right) => left.availableQuantity - right.availableQuantity);
}

export async function getAdminDashboard(days: number) {
  const normalizedDays = Math.min(Math.max(days, 7), 90);
  const since = Date.now() - normalizedDays * 86_400_000;
  const [orders, productSnapshot, users, settings] = await Promise.all([
    orderDocuments(1_000),
    firestore.collection("products").get(),
    firebaseAuth.listUsers(1_000),
    getStoreSettings(),
  ]);
  const placedOrders = orders.filter(
    (order) => paidStatuses.has(String(order.paymentStatus)) && order.reservationStatus !== "released",
  );
  const rangeOrders = placedOrders.filter((order) => Date.parse(String(order.createdAt ?? 0)) >= since);
  const grossSales = rangeOrders.reduce((total, order) => total + Number(order.total ?? 0), 0);
  const refunds = rangeOrders.reduce((total, order) => total + Number(order.refundedAmount ?? 0), 0);
  const netSales = grossSales - refunds;
  const unitsSold = rangeOrders.reduce(
    (total, order) =>
      total +
      ((order.lines ?? []) as Array<{ quantity?: number }>).reduce(
        (lineTotal, line) => lineTotal + Number(line.quantity ?? 0),
        0,
      ),
    0,
  );
  const daily = new Map<string, { date: string; orders: number; netSales: number }>();
  for (let offset = normalizedDays - 1; offset >= 0; offset -= 1) {
    const date = new Date(Date.now() - offset * 86_400_000).toISOString().slice(0, 10);
    daily.set(date, { date, orders: 0, netSales: 0 });
  }
  for (const order of rangeOrders) {
    const date = String(order.createdAt).slice(0, 10);
    const bucket = daily.get(date);
    if (!bucket) continue;
    bucket.orders += 1;
    bucket.netSales += Number(order.total ?? 0) - Number(order.refundedAmount ?? 0);
  }
  const lowStockCount = productSnapshot.docs.reduce((total, entry) => {
    const product = entry.data();
    if (product.status === "archived") return total;
    return (
      total +
      ((product.variants ?? []) as Array<Record<string, unknown>>).filter(
        (variant) =>
          Number(variant.availableQuantity ?? 0) <= settings.lowStockThreshold,
      ).length
    );
  }, 0);
  const customers = users.users.filter(
    (user) => !user.customClaims?.role && user.email && !user.disabled,
  );
  const newCustomers = customers.filter(
    (user) => Date.parse(user.metadata.creationTime) >= since,
  ).length;
  const fulfillmentQueue = rangeOrders.filter(
    (order) => !["delivered", "canceled"].includes(String(order.fulfillmentStatus)),
  ).length;

  return {
    rangeDays: normalizedDays,
    metrics: {
      netSales,
      grossSales,
      refunds,
      orders: rangeOrders.length,
      averageOrderValue: rangeOrders.length ? netSales / rangeOrders.length : 0,
      unitsSold,
      customers: customers.length,
      newCustomers,
      fulfillmentQueue,
      lowStockCount,
    },
    daily: [...daily.values()],
    recentOrders: orders.slice(0, 6),
    fulfillment: {
      unfulfilled: placedOrders.filter((order) => order.fulfillmentStatus === "unfulfilled").length,
      picking: placedOrders.filter((order) => order.fulfillmentStatus === "picking").length,
      packed: placedOrders.filter((order) => order.fulfillmentStatus === "packed").length,
      shipped: placedOrders.filter((order) => order.fulfillmentStatus === "shipped").length,
    },
  };
}

export async function listAdminCustomers(query: string, limit = 100) {
  const [users, profileSnapshot, orders] = await Promise.all([
    firebaseAuth.listUsers(500),
    firestore.collection("users").limit(500).get(),
    orderDocuments(1_000),
  ]);
  const profiles = new Map(profileSnapshot.docs.map((entry) => [entry.id, entry.data()]));
  const aggregates = new Map<string, { orders: number; totalSpent: number }>();
  for (const order of orders) {
    if (!paidStatuses.has(String(order.paymentStatus))) continue;
    const uid = String(order.userId ?? "");
    const current = aggregates.get(uid) ?? { orders: 0, totalSpent: 0 };
    current.orders += 1;
    current.totalSpent += Number(order.total ?? 0) - Number(order.refundedAmount ?? 0);
    aggregates.set(uid, current);
  }
  const normalized = query.trim().toLowerCase();
  return users.users
    .filter((user) => !user.customClaims?.role && user.email)
    .map((user) => {
      const profile = profiles.get(user.uid) ?? {};
      const firstName = String(profile.firstName ?? "");
      const lastName = String(profile.lastName ?? "");
      return {
        id: user.uid,
        email: user.email ?? null,
        emailVerified: user.emailVerified,
        disabled: user.disabled,
        firstName,
        lastName,
        marketingOptIn: Boolean(profile.marketingOptIn),
        createdAt: user.metadata.creationTime,
        lastSignInAt: user.metadata.lastSignInTime ?? null,
        ...(aggregates.get(user.uid) ?? { orders: 0, totalSpent: 0 }),
      };
    })
    .filter((customer) =>
      !normalized ||
      `${customer.firstName} ${customer.lastName} ${customer.email} ${customer.id}`
        .toLowerCase()
        .includes(normalized),
    )
    .sort((left, right) => Date.parse(right.createdAt) - Date.parse(left.createdAt))
    .slice(0, Math.min(Math.max(limit, 1), 250));
}

export async function getAdminCustomer(uid: string) {
  let user;
  try {
    user = await firebaseAuth.getUser(uid);
  } catch {
    throw new AppError(404, "CUSTOMER_NOT_FOUND", "This customer could not be found.");
  }
  if (user.customClaims?.role) {
    throw new AppError(404, "CUSTOMER_NOT_FOUND", "This customer could not be found.");
  }
  const [profileSnapshot, addressSnapshot, commerceSnapshot, orderSnapshot] = await Promise.all([
    firestore.doc(`users/${uid}`).get(),
    firestore.doc(`users/${uid}/account/addresses`).get(),
    firestore.doc(`users/${uid}/commerce/state`).get(),
    firestore.collection("orders").where("userId", "==", uid).get(),
  ]);
  const profile = profileSnapshot.data() ?? {};
  const commerce = commerceSnapshot.data() ?? {};
  const orders = orderSnapshot.docs
    .map((entry) => serializeOrder(entry.id, entry.data()))
    .sort((left, right) => Date.parse(String(right.createdAt ?? 0)) - Date.parse(String(left.createdAt ?? 0)));
  return {
    id: uid,
    email: user.email ?? null,
    emailVerified: user.emailVerified,
    disabled: user.disabled,
    firstName: String(profile.firstName ?? ""),
    lastName: String(profile.lastName ?? ""),
    marketingOptIn: Boolean(profile.marketingOptIn),
    createdAt: user.metadata.creationTime,
    lastSignInAt: user.metadata.lastSignInTime ?? null,
    addresses: addressSnapshot.data()?.addresses ?? [],
    cartCount: ((commerce.cartLines ?? []) as Array<{ quantity?: number }>).reduce(
      (total, line) => total + Number(line.quantity ?? 0),
      0,
    ),
    wishlistCount: ((commerce.wishlist ?? []) as unknown[]).length,
    orders,
    totalSpent: orders
      .filter((order) => paidStatuses.has(String(order.paymentStatus)))
      .reduce(
        (total, order) => total + Number(order.total ?? 0) - Number(order.refundedAmount ?? 0),
        0,
      ),
  };
}
