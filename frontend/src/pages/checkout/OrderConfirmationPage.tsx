import { CheckCircle2, Clock3, PackageCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useCheckout } from "@/components/checkout/CheckoutContext";
import { CheckoutErrorPanel } from "@/components/checkout/CheckoutUi";
import { Button } from "@/components/ui/button";
import { CheckoutApiError, checkoutApi } from "@/data/checkout-api";
import { customerApi } from "@/store/customer-api";
import { clearCart } from "@/store/store";

type ConfirmationState = "loading" | "paid" | "processing" | "error";

export function OrderConfirmationPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("orderId") ?? "";
  const redirectStatus = searchParams.get("redirect_status");
  const { reset } = useCheckout();
  const [status, setStatus] = useState<ConfirmationState>("loading");
  const [message, setMessage] = useState("");
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    document.title = "Order confirmation | Kallayani";
  }, []);

  useEffect(() => {
    if (!orderId) {
      setStatus("error");
      setMessage("The order reference is missing.");
      return;
    }
    if (redirectStatus === "failed") {
      navigate(`/checkout/payment-failed?orderId=${encodeURIComponent(orderId)}`, { replace: true });
      return;
    }
    let active = true;
    setStatus("loading");
    checkoutApi
      .finalize(orderId)
      .then((result) => {
        if (!active) return;
        setStatus(result.status);
        dispatch(clearCart());
        dispatch(customerApi.util.invalidateTags(["Orders", "Commerce"]));
        reset();
      })
      .catch((reason: unknown) => {
        if (!active) return;
        setStatus("error");
        setMessage(reason instanceof CheckoutApiError ? reason.message : "Payment could not be verified yet.");
      });
    return () => {
      active = false;
    };
  }, [attempt, dispatch, navigate, orderId, redirectStatus, reset]);

  if (status === "loading") {
    return (
      <div className="mt-12 flex min-h-[400px] flex-col items-center justify-center bg-soft px-6 text-center" aria-live="polite">
        <Clock3 className="text-wine" size={34} strokeWidth={1.5} />
        <span className="mt-5 h-px w-24 bg-wine" />
        <h2 className="mt-6 font-editorial text-4xl font-medium">Verifying your payment.</h2>
        <p className="mt-3 text-sm text-muted">Keep this page open while Express confirms the payment status with Stripe.</p>
      </div>
    );
  }

  if (status === "error") {
    return <CheckoutErrorPanel title="We could not confirm the order yet." message={message} onRetry={() => setAttempt((value) => value + 1)} />;
  }

  const processing = status === "processing";
  return (
    <div className="mx-auto mt-12 max-w-3xl border border-line px-8 py-12 text-center phone:px-5 phone:py-9">
      {processing ? <Clock3 className="mx-auto text-wine" size={34} strokeWidth={1.5} /> : <CheckCircle2 className="mx-auto text-wine" size={36} strokeWidth={1.5} />}
      <p className="mt-6 text-xs font-medium uppercase tracking-[.12em] text-muted">Order {orderId.slice(0, 8).toUpperCase()}</p>
      <h2 className="mt-3 font-editorial text-[clamp(40px,6vw,62px)] font-medium leading-none tracking-[-.03em]">
        {processing ? "Payment is processing." : "Your order is confirmed."}
      </h2>
      <p className="mx-auto mt-5 max-w-[54ch] text-sm leading-6 text-muted">
        {processing
          ? "Stripe is still processing the payment. Your pieces remain reserved, and the order will update automatically when payment completes."
          : "Thank you for choosing Kallayani. Your payment has been verified and your pieces are now being prepared."}
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button asChild><Link to={`/account/orders/${encodeURIComponent(orderId)}`}><PackageCheck size={15} /> View order</Link></Button>
        <Button variant="outline" asChild><Link to="/shop">Continue shopping</Link></Button>
      </div>
    </div>
  );
}
