import Stripe from "stripe";
import { env } from "../config/env.js";
import { AppError } from "../lib/app-error.js";
import { logger } from "../config/logger.js";
import {
  attachPaymentIntent,
  finalizeOrderPayment,
  getOrderForPayment,
  listExpiredCheckoutReservations,
  markOrderProcessing,
  releaseOrderReservation,
  reserveCheckoutOrder,
  type CheckoutInput,
} from "./order-service.js";
import {
  getAdminOrder,
  markAdminOrderCanceled,
  recordAdminRefund,
} from "./admin-commerce-service.js";

let stripeClient: Stripe | null = null;

function stripe() {
  if (!env.stripeSecretKey) {
    throw new AppError(
      503,
      "PAYMENT_PROVIDER_UNAVAILABLE",
      "Secure payment is not configured yet. Please try again later.",
    );
  }
  stripeClient ??= new Stripe(env.stripeSecretKey);
  return stripeClient;
}

export async function createCheckoutPayment(
  uid: string,
  email: string | undefined,
  input: CheckoutInput,
) {
  const stripeApi = stripe();
  await reconcileExpiredCheckoutReservations(stripeApi);
  const reservation = await reserveCheckoutOrder(uid, input, email);
  let createdIntent: Stripe.PaymentIntent | null = null;
  try {
    const intent = await stripeApi.paymentIntents.create({
      amount: Math.round(reservation.total * 100),
      currency: reservation.currency.toLowerCase(),
      automatic_payment_methods: { enabled: true },
      receipt_email: email,
      description: `Kallayani order ${reservation.orderId}`,
      metadata: { orderId: reservation.orderId, userId: uid },
    });
    createdIntent = intent;
    if (!intent.client_secret) throw new Error("Stripe did not return a client secret.");
    await attachPaymentIntent(reservation.orderId, intent.id);
    return {
      orderId: reservation.orderId,
      clientSecret: intent.client_secret,
      total: reservation.total,
      currency: reservation.currency,
      reservationExpiresAt: reservation.reservationExpiresAt,
      quote: {
        currency: reservation.currency,
        lines: reservation.lines,
        deliveryMethods: reservation.deliveryMethods,
        deliveryMethod: reservation.deliveryMethod,
        subtotal: reservation.subtotal,
        shippingTotal: reservation.shippingTotal,
        taxTotal: reservation.taxTotal,
        total: reservation.total,
      },
    };
  } catch (error) {
    if (createdIntent && createdIntent.status !== "succeeded" && createdIntent.status !== "canceled") {
      await stripeApi.paymentIntents.cancel(createdIntent.id).catch(() => undefined);
    }
    await releaseOrderReservation(reservation.orderId, "provider_setup_failed");
    if (error instanceof AppError) throw error;
    throw new AppError(
      502,
      "PAYMENT_PROVIDER_ERROR",
      "Secure payment could not be started. Your card was not charged.",
    );
  }
}

export async function reconcileExpiredCheckoutReservations(
  stripeApi?: Stripe,
) {
  if (!env.stripeSecretKey && !stripeApi) return { checked: 0, reconciled: 0 };
  const client = stripeApi ?? stripe();
  const reservations = await listExpiredCheckoutReservations();
  let reconciled = 0;

  for (const reservation of reservations) {
    try {
      if (!reservation.paymentIntentId) {
        await releaseOrderReservation(reservation.orderId, "reservation_expired");
        reconciled += 1;
        continue;
      }

      const intent = await client.paymentIntents.retrieve(reservation.paymentIntentId);
      if (intent.status === "succeeded") {
        await finalizeOrderPayment(reservation.orderId, intent.id);
        reconciled += 1;
        continue;
      }
      if (intent.status === "processing") {
        await markOrderProcessing(reservation.orderId, intent.id);
        continue;
      }
      if (intent.status !== "canceled") {
        await client.paymentIntents.cancel(intent.id);
      }
      await releaseOrderReservation(reservation.orderId, "reservation_expired");
      reconciled += 1;
    } catch (error) {
      logger.warn(
        { error, orderId: reservation.orderId },
        "Could not reconcile an expired checkout reservation",
      );
    }
  }

  return { checked: reservations.length, reconciled };
}

export async function verifyAndFinalizePayment(uid: string, orderId: string) {
  const order = await getOrderForPayment(uid, orderId);
  const paymentIntentId = String(order.paymentIntentId ?? "");
  if (!paymentIntentId) {
    throw new AppError(409, "PAYMENT_NOT_STARTED", "Payment has not been started for this order.");
  }
  const intent = await stripe().paymentIntents.retrieve(paymentIntentId);
  if (intent.metadata.orderId !== orderId || intent.metadata.userId !== uid) {
    throw new AppError(409, "PAYMENT_MISMATCH", "The payment does not belong to this order.");
  }
  if (intent.status === "succeeded") {
    await finalizeOrderPayment(orderId, intent.id);
    return { status: "paid" as const };
  }
  if (intent.status === "processing") {
    await markOrderProcessing(orderId, intent.id);
    return { status: "processing" as const };
  }
  throw new AppError(
    402,
    "PAYMENT_INCOMPLETE",
    "Payment has not completed. Choose another payment method or try again.",
  );
}

export async function cancelCheckoutPayment(uid: string, orderId: string) {
  const order = await getOrderForPayment(uid, orderId);
  const paymentIntentId = String(order.paymentIntentId ?? "");
  if (paymentIntentId) {
    const intent = await stripe().paymentIntents.retrieve(paymentIntentId);
    if (intent.status === "succeeded") {
      await finalizeOrderPayment(orderId, intent.id);
      return { status: "paid" as const };
    }
    if (intent.status === "processing") {
      await markOrderProcessing(orderId, intent.id);
      return { status: "processing" as const };
    }
    if (intent.status !== "succeeded" && intent.status !== "canceled") {
      await stripe().paymentIntents.cancel(paymentIntentId);
    }
  }
  await releaseOrderReservation(orderId, "checkout_canceled");
  return { status: "canceled" as const };
}

export async function refundAdminOrder(
  orderId: string,
  input: {
    amount: number;
    reason: string;
    restock: boolean;
    operationId: string;
  },
  staffUid: string,
) {
  const order = await getAdminOrder(orderId);
  const previousRefunds = (order.refunds ?? []) as Array<Record<string, unknown>>;
  if (previousRefunds.some((refund) => refund.operationId === input.operationId)) {
    return order;
  }
  const paymentIntentId = String(order.paymentIntentId ?? "");
  if (!paymentIntentId) {
    throw new AppError(409, "PAYMENT_NOT_STARTED", "This order does not have a payment to refund.");
  }
  if (!["paid", "partially_refunded"].includes(String(order.paymentStatus))) {
    throw new AppError(409, "ORDER_NOT_REFUNDABLE", "Only paid orders can be refunded.");
  }
  const total = Number(order.total ?? 0);
  const refundedAmount = Number(order.refundedAmount ?? 0);
  const remaining = Math.max(0, total - refundedAmount);
  const amount = Math.round(input.amount * 100) / 100;
  if (amount <= 0 || amount > remaining) {
    throw new AppError(
      400,
      "REFUND_AMOUNT_INVALID",
      `The refundable balance is ${remaining.toFixed(2)} ${String(order.currency ?? "USD")}.`,
    );
  }
  if (input.restock && amount !== remaining) {
    throw new AppError(
      400,
      "PARTIAL_RESTOCK_UNSUPPORTED",
      "Inventory can be restored only when refunding the full remaining balance.",
    );
  }

  const refund = await stripe().refunds.create(
    {
      payment_intent: paymentIntentId,
      amount: Math.round(amount * 100),
      reason: "requested_by_customer",
      metadata: {
        orderId,
        staffUid,
        operationId: input.operationId,
        note: input.reason.slice(0, 450),
      },
    },
    { idempotencyKey: `admin-refund-${orderId}-${input.operationId}` },
  );
  if (refund.status === "failed") {
    throw new AppError(502, "REFUND_FAILED", "Stripe could not complete this refund.");
  }
  await recordAdminRefund(orderId, {
    operationId: input.operationId,
    refundId: refund.id,
    amount,
    reason: input.reason,
    restock: input.restock,
    staffUid,
  });
  return getAdminOrder(orderId);
}

export async function cancelAdminOrder(
  orderId: string,
  input: { reason: string; operationId: string },
  staffUid: string,
) {
  let order = await getAdminOrder(orderId);
  if (order.status === "canceled") return order;
  if (["shipped", "delivered"].includes(String(order.fulfillmentStatus))) {
    throw new AppError(
      409,
      "ORDER_ALREADY_FULFILLED",
      "A shipped or delivered order cannot be canceled from the store console.",
    );
  }

  const refundable = Math.max(
    0,
    Number(order.total ?? 0) - Number(order.refundedAmount ?? 0),
  );
  if (["paid", "partially_refunded"].includes(String(order.paymentStatus)) && refundable > 0) {
    order = await refundAdminOrder(
      orderId,
      {
        amount: refundable,
        reason: input.reason,
        restock: true,
        operationId: input.operationId,
      },
      staffUid,
    );
  } else {
    const paymentIntentId = String(order.paymentIntentId ?? "");
    if (paymentIntentId) {
      const intent = await stripe().paymentIntents.retrieve(paymentIntentId);
      if (intent.status === "succeeded") {
        await finalizeOrderPayment(orderId, intent.id);
        order = await getAdminOrder(orderId);
        const amount = Math.max(
          0,
          Number(order.total ?? 0) - Number(order.refundedAmount ?? 0),
        );
        if (amount > 0) {
          await refundAdminOrder(
            orderId,
            {
              amount,
              reason: input.reason,
              restock: true,
              operationId: input.operationId,
            },
            staffUid,
          );
        }
      } else {
        if (intent.status !== "canceled") {
          await stripe().paymentIntents.cancel(intent.id);
        }
        await releaseOrderReservation(orderId, "admin_canceled");
      }
    } else {
      await releaseOrderReservation(orderId, "admin_canceled");
    }
  }
  await markAdminOrderCanceled(orderId, input.reason, staffUid);
  return getAdminOrder(orderId);
}

export async function handleStripeWebhook(body: Buffer, signature: string | undefined) {
  if (!env.stripeWebhookSecret || !signature) {
    throw new AppError(400, "WEBHOOK_NOT_CONFIGURED", "The payment webhook is not configured.");
  }
  let event: Stripe.Event;
  try {
    event = stripe().webhooks.constructEvent(body, signature, env.stripeWebhookSecret);
  } catch {
    throw new AppError(
      400,
      "WEBHOOK_SIGNATURE_INVALID",
      "The payment webhook signature is invalid.",
    );
  }

  if (!event.type.startsWith("payment_intent.")) return;
  const intent = event.data.object as Stripe.PaymentIntent;
  const orderId = intent.metadata.orderId;
  if (!orderId) return;

  if (event.type === "payment_intent.succeeded") {
    await finalizeOrderPayment(orderId, intent.id);
  } else if (event.type === "payment_intent.processing") {
    await markOrderProcessing(orderId, intent.id);
  } else if (event.type === "payment_intent.canceled") {
    await releaseOrderReservation(orderId, "payment_canceled");
  } else if (event.type === "payment_intent.payment_failed") {
    const currentIntent = await stripe().paymentIntents.retrieve(intent.id);
    if (currentIntent.status === "succeeded") {
      await finalizeOrderPayment(orderId, currentIntent.id);
      return;
    }
    if (currentIntent.status === "processing") {
      await markOrderProcessing(orderId, currentIntent.id);
      return;
    }
    const canceledIntent =
      currentIntent.status === "canceled"
        ? currentIntent
        : await stripe().paymentIntents.cancel(currentIntent.id);
    if (canceledIntent.status === "canceled") {
      await releaseOrderReservation(orderId, "payment_failed");
    }
  }
}
