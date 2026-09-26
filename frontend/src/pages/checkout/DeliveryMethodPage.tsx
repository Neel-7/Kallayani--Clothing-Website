import { Check, PackageOpen, Truck } from "lucide-react";
import { useEffect } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useCheckout } from "@/components/checkout/CheckoutContext";
import {
  CheckoutErrorPanel,
  CheckoutPageSkeleton,
  CheckoutSummary,
} from "@/components/checkout/CheckoutUi";
import { useServerCheckoutQuote } from "@/components/checkout/useServerCheckoutQuote";
import { dollars } from "@/components/commerce/catalog-utils";
import { Button } from "@/components/ui/button";

export function DeliveryMethodPage() {
  const navigate = useNavigate();
  const { shippingAddress, deliveryMethodId, setDeliveryMethodId } = useCheckout();
  const { quote, isLoading, error, retry, lines } = useServerCheckoutQuote();

  useEffect(() => {
    document.title = "Delivery method | Kallayani";
  }, []);

  if (!shippingAddress) return <Navigate replace to="/checkout/shipping" />;
  if (lines.length === 0) {
    return (
      <CheckoutErrorPanel
        title="Your bag is empty."
        message="Add a piece before choosing a delivery method."
        inventoryChanged
      />
    );
  }
  if (isLoading && !quote) return <CheckoutPageSkeleton label="Loading delivery methods" />;
  if (error) {
    return (
      <CheckoutErrorPanel
        message={error.message}
        onRetry={retry}
        inventoryChanged={error.code === "INVENTORY_CHANGED"}
      />
    );
  }
  if (!quote) return <CheckoutPageSkeleton label="Loading delivery methods" />;

  return (
    <div className="mt-10 grid grid-cols-[minmax(0,1fr)_340px] gap-14 tablet:grid-cols-1">
      <div>
        <h2 className="font-editorial text-4xl font-medium">Choose your delivery.</h2>
        <div className="mt-8 space-y-3">
          {quote.deliveryMethods.map((method) => {
            const selected = method.id === deliveryMethodId;
            return (
              <button
                className={`flex min-h-24 w-full items-center gap-5 border p-5 text-left transition-colors ${
                  selected ? "border-wine bg-[#faf4f1]" : "border-line hover:border-ink"
                }`}
                key={method.id}
                type="button"
                aria-pressed={selected}
                onClick={() => setDeliveryMethodId(method.id)}
              >
                <span className={`grid size-6 shrink-0 place-items-center rounded-full border ${selected ? "border-wine bg-wine text-white" : "border-line"}`}>
                  {selected && <Check size={13} />}
                </span>
                <Truck className="shrink-0 text-wine" size={22} />
                <span className="min-w-0 flex-1">
                  <strong className="block text-sm font-medium">{method.name}</strong>
                  <span className="mt-1 block text-xs text-muted">{method.description}</span>
                </span>
                <strong className="text-sm font-medium tabular-nums">
                  {method.amount === 0 ? "Complimentary" : dollars.format(method.amount)}
                </strong>
              </button>
            );
          })}
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button type="button" onClick={() => navigate("/checkout/review")}>Continue to review</Button>
          <Button variant="outline" asChild><Link to="/checkout/shipping">Edit address</Link></Button>
        </div>
        <p className="mt-6 flex items-start gap-3 text-xs leading-5 text-muted">
          <PackageOpen className="mt-0.5 shrink-0" size={15} />
          Delivery fees are calculated by the server from the current order value. No browser-calculated total is used to create your order.
        </p>
      </div>
      <CheckoutSummary quote={quote} />
    </div>
  );
}
