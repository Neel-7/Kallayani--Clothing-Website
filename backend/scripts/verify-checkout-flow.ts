import assert from "node:assert/strict";
import Stripe from "stripe";
import { FieldValue, Timestamp } from "firebase-admin/firestore";
import { firestore } from "../src/config/firebase.js";
import { reconcileExpiredCheckoutReservations } from "../src/services/payment-service.js";

const apiBaseUrl = process.env.API_BASE_URL ?? "http://127.0.0.1:3001/api/v1";
const authHost = process.env.FIREBASE_AUTH_EMULATOR_HOST ?? "127.0.0.1:9099";
const firebaseApiKey = process.env.VITE_FIREBASE_API_KEY ?? "emulator-key";

type ApiError = Error & { status?: number; payload?: unknown };

async function request<T>(
  path: string,
  options: RequestInit = {},
  token?: string,
) {
  const headers = new Headers(options.headers);
  if (options.body) headers.set("content-type", "application/json");
  if (token) headers.set("authorization", `Bearer ${token}`);
  const response = await fetch(`${apiBaseUrl}${path}`, { ...options, headers });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(`Request failed with ${response.status}.`) as ApiError;
    error.status = response.status;
    error.payload = payload;
    throw error;
  }
  return payload as T;
}

async function createEmulatorCustomer() {
  const response = await fetch(
    `http://${authHost}/identitytoolkit.googleapis.com/v1/accounts:signUp?key=${encodeURIComponent(firebaseApiKey)}`,
    {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        email: `checkout-${Date.now()}@example.test`,
        password: "CheckoutTest9!",
        returnSecureToken: true,
      }),
    },
  );
  const payload = (await response.json()) as { idToken?: string; error?: unknown };
  assert.equal(response.ok, true, `Auth emulator sign-up failed: ${JSON.stringify(payload.error)}`);
  assert.ok(payload.idToken, "Auth emulator did not return an ID token.");
  return payload.idToken;
}

type CatalogVariant = {
  id: string;
  price: number;
  availableQuantity: number;
  inStock: boolean;
};
type CatalogProduct = { id: string; variants?: CatalogVariant[] };
type CatalogCollection = { products?: CatalogProduct[] };

async function verifyExpiredReservationReconciliation(
  productId: string,
  variantId: string,
) {
  const productReference = firestore.doc(`products/${productId}`);
  const orderReference = firestore.collection("orders").doc();
  let quantityBefore = 0;

  await firestore.runTransaction(async (transaction) => {
    const productSnapshot = await transaction.get(productReference);
    assert.ok(productSnapshot.exists, "The checkout test product must exist.");
    const product = productSnapshot.data()!;
    const variants = (product.variants as Array<Record<string, unknown>>).map((variant) => ({
      ...variant,
    }));
    const variant = variants.find((entry) => entry.id === variantId);
    assert.ok(variant, "The checkout test variant must exist.");
    quantityBefore = Number(variant.availableQuantity ?? 0);
    assert.ok(quantityBefore > 0, "The checkout test variant must have inventory.");
    variant.availableQuantity = quantityBefore - 1;

    transaction.update(productReference, { variants });
    transaction.create(orderReference, {
      id: orderReference.id,
      userId: "checkout-verification-user",
      status: "awaiting_payment",
      paymentStatus: "pending",
      fulfillmentStatus: "unfulfilled",
      reservationStatus: "reserved",
      reservationExpiresAt: Timestamp.fromMillis(Date.now() - 60_000),
      lines: [{ productId, variantId, quantity: 1 }],
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });
  });

  await reconcileExpiredCheckoutReservations({} as Stripe);
  const [productSnapshot, orderSnapshot] = await firestore.getAll(
    productReference,
    orderReference,
  );
  const restoredVariant = (
    productSnapshot.data()?.variants as Array<Record<string, unknown>>
  ).find((entry) => entry.id === variantId);
  assert.equal(Number(restoredVariant?.availableQuantity ?? 0), quantityBefore);
  assert.equal(orderSnapshot.data()?.reservationStatus, "released");
  assert.equal(orderSnapshot.data()?.failureReason, "reservation_expired");
  await orderReference.delete();
}

async function main() {
  const token = await createEmulatorCustomer();
  const catalog = await request<{ data: CatalogCollection[] }>("/storefront/collections");
  const products = catalog.data.flatMap((collection) => collection.products ?? []);
  const candidate = products
    .flatMap((product) =>
      (product.variants ?? []).map((variant) => ({ product, variant })),
    )
    .find(({ variant }) => variant.inStock && variant.availableQuantity > 0);
  assert.ok(candidate, "The seeded catalog needs one in-stock variant.");

  const shippingAddress = {
    name: "Checkout Test Customer",
    line1: "120 Test Street",
    line2: "",
    city: "Brooklyn",
    region: "NY",
    postalCode: "11201",
    country: "US",
    phone: "+12125550199",
  };
  const line = {
    productId: candidate.product.id,
    variantId: candidate.variant.id,
    quantity: 1,
  };

  const quoteResponse = await request<{
    data: {
      subtotal: number;
      shippingTotal: number;
      taxTotal: number;
      total: number;
      lines: Array<{ unitPrice: number; quantity: number }>;
    };
  }>(
    "/users/me/checkout/quote",
    {
      method: "POST",
      body: JSON.stringify({
        lines: [line],
        shippingAddress,
        deliveryMethodId: "standard",
      }),
    },
    token,
  );

  const quote = quoteResponse.data;
  assert.equal(quote.lines[0]?.unitPrice, candidate.variant.price);
  assert.equal(quote.subtotal, candidate.variant.price);
  assert.equal(quote.shippingTotal, quote.subtotal >= 150 ? 0 : 12);
  assert.equal(quote.taxTotal, 0);
  assert.equal(quote.total, quote.subtotal + quote.shippingTotal + quote.taxTotal);

  let inventoryError: ApiError | null = null;
  try {
    await request(
      "/users/me/checkout/quote",
      {
        method: "POST",
        body: JSON.stringify({
          lines: [{ productId: "checkout-missing-product", variantId: "missing", quantity: 1 }],
          shippingAddress,
          deliveryMethodId: "standard",
        }),
      },
      token,
    );
  } catch (error) {
    inventoryError = error as ApiError;
  }
  assert.equal(inventoryError?.status, 409);
  assert.equal(
    (inventoryError?.payload as { error?: { code?: string } })?.error?.code,
    "INVENTORY_CHANGED",
  );

  await verifyExpiredReservationReconciliation(
    candidate.product.id,
    candidate.variant.id,
  );

  if (!process.env.STRIPE_SECRET_KEY) {
    let providerError: ApiError | null = null;
    try {
      await request(
        "/users/me/checkout/payment-intent",
        {
          method: "POST",
          body: JSON.stringify({
            lines: [line],
            shippingAddress,
            deliveryMethodId: "standard",
          }),
        },
        token,
      );
    } catch (error) {
      providerError = error as ApiError;
    }
    assert.equal(providerError?.status, 503);
    assert.equal(
      (providerError?.payload as { error?: { code?: string } })?.error?.code,
      "PAYMENT_PROVIDER_UNAVAILABLE",
    );

    const orders = await request<{ data: unknown[] }>("/users/me/orders", {}, token);
    assert.equal(
      orders.data.length,
      0,
      "Provider setup failure must not create or reserve an order.",
    );
  }

  console.log(
    JSON.stringify({
      status: "ok",
      checks: [
        "authenticated checkout quote",
        "server price and delivery totals",
        "structured inventory conflict",
        "expired reservation inventory restoration",
        ...(process.env.STRIPE_SECRET_KEY
          ? ["provider failure check skipped because Stripe is configured"]
          : ["provider unavailable without order creation"]),
      ],
    }),
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
