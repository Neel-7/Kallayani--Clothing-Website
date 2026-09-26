import { Elements, PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { LockKeyhole, ShieldCheck } from "lucide-react";
import { FormEvent, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useCheckout } from "@/components/checkout/CheckoutContext";
import { CheckoutErrorPanel, CheckoutPageSkeleton, CheckoutSummary } from "@/components/checkout/CheckoutUi";
import { Button } from "@/components/ui/button";
import { CheckoutApiError, checkoutApi } from "@/data/checkout-api";
import type { RootState } from "@/store/store";

const publishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
const stripePromise = publishableKey ? loadStripe(publishableKey) : null;

export function PaymentPage() {
  const cartLines = useSelector((state: RootState) => state.shop.cartLines);
  const user = useSelector((state: RootState) => state.customerAuth.user);
  const { shippingAddress, deliveryMethodId, quote, setQuote, paymentSession, setPaymentSession } = useCheckout();
  const [error, setError] = useState<CheckoutApiError | null>(null);
  const [attempt, setAttempt] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    document.title = "Secure payment | Kallayani";
  }, []);

  useEffect(() => {
    if (!stripePromise || !shippingAddress || !quote || cartLines.length === 0 || paymentSession || started.current) return;
    started.current = true;
    setError(null);
    checkoutApi
      .createPaymentSession({
        lines: cartLines,
        shippingAddress,
        deliveryMethodId,
        email: user?.email ?? undefined,
      })
      .then((session) => {
        setQuote(session.quote);
        setPaymentSession(session);
      })
      .catch((reason: unknown) => {
        setError(reason instanceof CheckoutApiError ? reason : new CheckoutApiError(0, "NETWORK_ERROR", "Secure payment could not be loaded."));
      });
  }, [attempt, cartLines, deliveryMethodId, paymentSession, quote, setPaymentSession, setQuote, shippingAddress, user?.email]);

  if (!shippingAddress) return <Navigate replace to="/checkout/shipping" />;
  if (!quote) return <Navigate replace to="/checkout/review" />;
  if (!stripePromise) {
    return <CheckoutErrorPanel title="Secure payment is not configured." message="Add the Stripe publishable key to the frontend environment before accepting payments." />;
  }
  if (error) {
    return (
      <CheckoutErrorPanel
        message={error.message}
        inventoryChanged={error.code === "INVENTORY_CHANGED"}
        onRetry={() => {
          started.current = false;
          setAttempt((value) => value + 1);
        }}
      />
    );
  }
  if (!paymentSession) return <CheckoutPageSkeleton label="Preparing secure payment" />;

  return (
    <div className="mt-10 grid grid-cols-[minmax(0,1fr)_340px] gap-14 tablet:grid-cols-1">
      <div>
        <h2 className="font-editorial text-4xl font-medium">Pay securely.</h2>
        <div className="mt-6 flex items-start gap-3 border border-line bg-soft p-4 text-xs leading-5 text-muted">
          <ShieldCheck className="mt-0.5 shrink-0 text-wine" size={18} />
          <p>Payment details are sent directly to Stripe. Kallayani does not place card numbers, security codes, or payment form values in Redux or browser storage.</p>
        </div>
        <div className="mt-8 border-t border-line pt-7">
          <Elements
            stripe={stripePromise}
            options={{
              clientSecret: paymentSession.clientSecret,
              appearance: {
                theme: "stripe",
                variables: {
                  colorPrimary: "#4a1116",
                  colorText: "#171412",
                  colorBackground: "#ffffff",
                  borderRadius: "0px",
                  fontFamily: "Jost, Arial, sans-serif",
                },
              },
            }}
          >
            <PaymentForm orderId={paymentSession.orderId} />
          </Elements>
        </div>
        <p className="mt-5 text-xs leading-5 text-muted">
          Your pieces are reserved until {new Intl.DateTimeFormat("en-US", {
            hour: "numeric",
            minute: "2-digit",
          }).format(new Date(paymentSession.reservationExpiresAt))}. If payment is not completed, the reservation is released automatically.
        </p>
        <Link className="mt-6 inline-flex min-h-10 items-center text-xs text-muted underline underline-offset-4 hover:text-wine" to="/checkout/review">Back to review</Link>
      </div>
      <CheckoutSummary quote={paymentSession.quote} />
    </div>
  );
}

function PaymentForm({ orderId }: { orderId: string }) {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!stripe || !elements || isSubmitting) return;
    setIsSubmitting(true);
    setMessage("");

    const result = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/checkout/confirmation?orderId=${encodeURIComponent(orderId)}`,
      },
      redirect: "if_required",
    });

    if (result.error) {
      if (result.error.type === "validation_error") {
        setMessage(result.error.message ?? "Check your payment details and try again.");
        setIsSubmitting(false);
        return;
      }
      const cancellation = await checkoutApi.cancel(orderId).catch(() => undefined);
      if (cancellation?.status === "paid" || cancellation?.status === "processing") {
        navigate(`/checkout/confirmation?orderId=${encodeURIComponent(orderId)}`, {
          replace: true,
        });
        return;
      }
      navigate(`/checkout/payment-failed?orderId=${encodeURIComponent(orderId)}`, {
        replace: true,
        state: { message: result.error.message },
      });
      return;
    }

    try {
      await checkoutApi.finalize(orderId);
      navigate(`/checkout/confirmation?orderId=${encodeURIComponent(orderId)}`, { replace: true });
    } catch (reason) {
      navigate(`/checkout/confirmation?orderId=${encodeURIComponent(orderId)}`, {
        replace: true,
        state: { message: reason instanceof Error ? reason.message : "Payment is still being verified." },
      });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement options={{ layout: "accordion" }} />
      {message && <p className="mt-4 text-sm leading-6 text-red" role="alert">{message}</p>}
      <Button className="mt-7 w-full" type="submit" disabled={!stripe || !elements || isSubmitting}>
        <LockKeyhole size={15} /> {isSubmitting ? "Confirming payment" : "Pay and place order"}
      </Button>
    </form>
  );
}
