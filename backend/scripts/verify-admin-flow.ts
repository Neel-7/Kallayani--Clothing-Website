import assert from "node:assert/strict";
import { FieldValue } from "firebase-admin/firestore";
import { firebaseAuth, firestore } from "../src/config/firebase.js";

const apiBaseUrl = process.env.API_BASE_URL ?? "http://127.0.0.1:3001/api/v1";
const authHost = process.env.FIREBASE_AUTH_EMULATOR_HOST ?? "127.0.0.1:9099";
const firebaseApiKey = process.env.VITE_FIREBASE_API_KEY ?? "emulator-key";

async function authRequest(path: string, body: Record<string, unknown>) {
  const response = await fetch(
    `http://${authHost}/identitytoolkit.googleapis.com/v1/${path}?key=${encodeURIComponent(firebaseApiKey)}`,
    { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) },
  );
  const payload = (await response.json()) as { localId?: string; idToken?: string; error?: unknown };
  assert.equal(response.ok, true, `Auth emulator request failed: ${JSON.stringify(payload.error)}`);
  return payload;
}

async function api<T>(path: string, token: string, options: RequestInit = {}) {
  const headers = new Headers(options.headers);
  headers.set("authorization", `Bearer ${token}`);
  if (options.body) headers.set("content-type", "application/json");
  const response = await fetch(`${apiBaseUrl}${path}`, { ...options, headers });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(`${response.status}: ${JSON.stringify(payload)}`);
  return payload as T;
}

async function createIdentity(prefix: string) {
  const email = `${prefix}-${Date.now()}@example.test`;
  const password = "AdminFlow9!";
  const signedUp = await authRequest("accounts:signUp", { email, password, returnSecureToken: true });
  assert.ok(signedUp.localId);
  return { email, password, uid: signedUp.localId };
}

async function signIn(email: string, password: string) {
  const result = await authRequest("accounts:signInWithPassword", { email, password, returnSecureToken: true });
  assert.ok(result.idToken);
  return result.idToken;
}

async function main() {
  const admin = await createIdentity("admin-flow-staff");
  const customer = await createIdentity("admin-flow-customer");
  await firebaseAuth.setCustomUserClaims(admin.uid, { role: "admin" });
  const adminToken = await signIn(admin.email, admin.password);
  const customerToken = await signIn(customer.email, customer.password);
  const productSnapshot = await firestore.collection("products").limit(1).get();
  assert.equal(productSnapshot.empty, false, "Seeded products are required.");
  const productReference = productSnapshot.docs[0]!.ref;
  const originalProduct = productSnapshot.docs[0]!.data();
  const originalVariant = (originalProduct.variants as Array<Record<string, unknown>>)[0]!;
  const variantId = String(originalVariant.id);
  const originalSettingsResponse = await api<{ data: Record<string, unknown> }>("/admin/settings", adminToken);
  const settings = originalSettingsResponse.data;
  const fulfillmentOrder = firestore.collection("orders").doc();
  const cancellationOrder = firestore.collection("orders").doc();

  try {
    await firestore.doc(`users/${customer.uid}`).set({
      id: customer.uid,
      email: customer.email,
      firstName: "Anika",
      lastName: "Basu",
      marketingOptIn: true,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });
    const lowStockVariants = (originalProduct.variants as Array<Record<string, unknown>>).map(
      (variant, index) => index === 0 ? { ...variant, availableQuantity: 2, inStock: true } : variant,
    );
    await productReference.update({ variants: lowStockVariants });

    const line = {
      productId: productReference.id,
      variantId,
      title: originalProduct.title,
      sku: originalVariant.sku,
      optionSummary: originalVariant.optionSummary,
      imageUrl: originalProduct.primaryImage?.url ?? "",
      quantity: 1,
      unitPrice: Number(originalVariant.price),
      lineTotal: Number(originalVariant.price),
    };
    const orderBase = {
      userId: customer.uid,
      customerEmail: customer.email,
      currency: "USD",
      lines: [line],
      subtotal: line.lineTotal,
      shippingTotal: 0,
      taxTotal: 0,
      total: line.lineTotal,
      shippingAddress: { name: "Anika Basu", line1: "1 Test Lane", line2: "", city: "New York", region: "NY", postalCode: "10001", country: "US", phone: "2125550100" },
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    };
    await fulfillmentOrder.set({ ...orderBase, id: fulfillmentOrder.id, displayNumber: "KAL-VERIFY1", status: "confirmed", paymentStatus: "paid", fulfillmentStatus: "unfulfilled", reservationStatus: "consumed" });
    await cancellationOrder.set({ ...orderBase, id: cancellationOrder.id, displayNumber: "KAL-VERIFY2", status: "awaiting_payment", paymentStatus: "pending", fulfillmentStatus: "unfulfilled", reservationStatus: "reserved" });

    const dashboard = await api<{ data: { metrics: { orders: number } } }>("/admin/dashboard?days=30", adminToken);
    assert.ok(dashboard.data.metrics.orders >= 1);
    const orders = await api<{ data: Array<{ id: string }> }>("/admin/orders", adminToken);
    assert.ok(orders.data.some((order) => order.id === fulfillmentOrder.id));

    const fulfilled = await api<{ data: { fulfillmentStatus: string } }>(
      `/admin/orders/${fulfillmentOrder.id}/fulfillment`,
      adminToken,
      { method: "PATCH", body: JSON.stringify({ status: "packed", carrier: "", trackingNumber: "" }) },
    );
    assert.equal(fulfilled.data.fulfillmentStatus, "packed");

    const customers = await api<{ data: Array<{ id: string }> }>(`/admin/customers?query=${encodeURIComponent(customer.email)}`, adminToken);
    assert.equal(customers.data[0]?.id, customer.uid);
    const inventory = await api<{ data: Array<{ variantId: string }> }>("/admin/inventory/low-stock", adminToken);
    assert.ok(inventory.data.some((item) => item.variantId === variantId));

    const updatedSettings = { ...settings, standardShippingThreshold: 100000, standardShippingFee: 19 };
    await api("/admin/settings", adminToken, { method: "PUT", body: JSON.stringify(updatedSettings) });
    const quote = await api<{ data: { shippingTotal: number } }>(
      "/users/me/checkout/quote",
      customerToken,
      { method: "POST", body: JSON.stringify({ lines: [{ productId: productReference.id, variantId, quantity: 1 }], shippingAddress: orderBase.shippingAddress, deliveryMethodId: "standard" }) },
    );
    assert.equal(quote.data.shippingTotal, 19);

    const canceled = await api<{ data: { status: string; fulfillmentStatus: string } }>(
      `/admin/orders/${cancellationOrder.id}/cancel`,
      adminToken,
      { method: "POST", body: JSON.stringify({ reason: "Administration verification", operationId: crypto.randomUUID() }) },
    );
    assert.equal(canceled.data.status, "canceled");
    assert.equal(canceled.data.fulfillmentStatus, "canceled");

    console.log(JSON.stringify({ status: "ok", checks: ["dashboard reporting", "order listing and fulfillment", "customer lookup", "low-stock inventory", "settings-driven checkout pricing", "unpaid cancellation"] }));
  } finally {
    await firestore.doc("settings/store").set(settings, { merge: true });
    await productReference.set(originalProduct);
    await Promise.all([fulfillmentOrder.delete(), cancellationOrder.delete(), firestore.doc(`users/${customer.uid}`).delete()]);
    await Promise.all([firebaseAuth.deleteUser(admin.uid), firebaseAuth.deleteUser(customer.uid)]);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
