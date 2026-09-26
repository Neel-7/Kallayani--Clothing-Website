import { AlertTriangle, ArrowLeft, ShoppingBag } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useCheckout } from "@/components/checkout/CheckoutContext";
import { Button } from "@/components/ui/button";
import { checkoutApi } from "@/data/checkout-api";

export function PaymentFailedPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("orderId") ?? "";
  const { setPaymentSession } = useCheckout();
  const state = location.state as { message?: string } | null;
  const [resolution, setResolution] = useState<"checking" | "canceled" | "unknown">(
    orderId ? "checking" : "unknown",
  );

  useEffect(() => {
    document.title = "Payment unsuccessful | Kallayani";
    setPaymentSession(null);
    if (!orderId) return;
    let active = true;
    checkoutApi
      .cancel(orderId)
      .then((result) => {
        if (!active) return;
        if (result.status === "paid" || result.status === "processing") {
          navigate(`/checkout/confirmation?orderId=${encodeURIComponent(orderId)}`, {
            replace: true,
          });
          return;
        }
        setResolution("canceled");
      })
      .catch(() => {
        if (active) setResolution("unknown");
      });
    return () => {
      active = false;
    };
  }, [navigate, orderId, setPaymentSession]);

  const heading =
    resolution === "checking"
      ? "Checking this payment attempt."
      : resolution === "canceled"
        ? "Payment was not completed."
        : "We could not verify this attempt.";
  const detail =
    resolution === "checking"
      ? "We are confirming the final payment status before releasing the reserved pieces."
      : resolution === "canceled"
        ? "The provider did not complete this attempt. Reserved inventory has been released so your bag stays accurate."
        : "Review your order before trying again. If you see a charge, contact support with the attempt reference below.";

  return (
    <div className="mx-auto mt-12 max-w-3xl border border-red/25 bg-[#fff8f6] px-8 py-12 text-center phone:px-5 phone:py-9">
      <AlertTriangle className="mx-auto text-red" size={34} strokeWidth={1.5} />
      <p className="mt-6 text-xs font-medium uppercase tracking-[.12em] text-muted">Payment not completed</p>
      <h2 className="mt-3 font-editorial text-[clamp(40px,6vw,62px)] font-medium leading-none tracking-[-.03em]">{heading}</h2>
      <p className="mx-auto mt-5 max-w-[54ch] text-sm leading-6 text-muted">
        {state?.message || detail}
      </p>
      {orderId && <p className="mt-4 text-xs text-muted">Attempt {orderId.slice(0, 8).toUpperCase()}</p>}
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button asChild><Link to="/checkout/review"><ArrowLeft size={15} /> Review and try again</Link></Button>
        <Button variant="outline" asChild><Link to="/cart"><ShoppingBag size={15} /> Return to bag</Link></Button>
      </div>
    </div>
  );
}
