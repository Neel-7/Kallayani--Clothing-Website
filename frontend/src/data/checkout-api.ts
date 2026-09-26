import { auth } from "@/lib/firebase";
import type { CheckoutInput, CheckoutQuote, PaymentSession } from "@/types/customer";

type ErrorPayload = {
  error?: { code?: string; message?: string; details?: unknown; requestId?: string };
};

export class CheckoutApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly code: string,
    message: string,
    public readonly details?: unknown,
  ) {
    super(message);
    this.name = "CheckoutApiError";
  }
}

const baseUrl = import.meta.env.VITE_API_BASE_URL || "/api/v1";

async function checkoutRequest<T>(path: string, body: unknown): Promise<T> {
  const token = await auth.currentUser?.getIdToken();
  if (!token) throw new CheckoutApiError(401, "AUTH_REQUIRED", "Sign in to continue checkout.");
  const response = await fetch(`${baseUrl}${path}`, {
    method: "POST",
    headers: {
      authorization: `Bearer ${token}`,
      "content-type": "application/json",
    },
    body: JSON.stringify(body),
  });
  if (response.status === 204) return undefined as T;
  const payload = (await response.json().catch(() => ({}))) as ErrorPayload & { data?: T };
  if (!response.ok) {
    throw new CheckoutApiError(
      response.status,
      payload.error?.code ?? "CHECKOUT_ERROR",
      payload.error?.message ?? "Checkout could not be completed.",
      payload.error?.details,
    );
  }
  return payload.data as T;
}

export const checkoutApi = {
  quote: (input: CheckoutInput) =>
    checkoutRequest<CheckoutQuote>("/users/me/checkout/quote", input),
  createPaymentSession: (input: CheckoutInput & { email?: string }) =>
    checkoutRequest<PaymentSession>("/users/me/checkout/payment-intent", input),
  finalize: (orderId: string) =>
    checkoutRequest<{ status: "paid" | "processing" }>("/users/me/checkout/finalize", {
      orderId,
    }),
  cancel: (orderId: string) =>
    checkoutRequest<{ status: "canceled" | "paid" | "processing" }>(
      "/users/me/checkout/cancel",
      { orderId },
    ),
};
