import { MapPin, PackageCheck, Pencil, Truck } from "lucide-react";
import { useEffect } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useCheckout } from "@/components/checkout/CheckoutContext";
import {
  CheckoutErrorPanel,
  CheckoutPageSkeleton,
  CheckoutSummary,
} from "@/components/checkout/CheckoutUi";
import { useServerCheckoutQuote } from "@/components/checkout/useServerCheckoutQuote";
import { Button } from "@/components/ui/button";

export function OrderReviewPage() {
  const navigate = useNavigate();
  const { shippingAddress } = useCheckout();
  const { quote, isLoading, error, retry, lines } = useServerCheckoutQuote();

  useEffect(() => {
    document.title = "Review order | Kallayani";
  }, []);

  if (!shippingAddress) return <Navigate replace to="/checkout/shipping" />;
  if (lines.length === 0) {
    return <CheckoutErrorPanel title="Your bag is empty." message="Add a piece before reviewing your order." inventoryChanged />;
  }
  if (isLoading && !quote) return <CheckoutPageSkeleton label="Verifying order" />;
  if (error) {
    return <CheckoutErrorPanel message={error.message} onRetry={retry} inventoryChanged={error.code === "INVENTORY_CHANGED"} />;
  }
  if (!quote) return <CheckoutPageSkeleton label="Verifying order" />;

  return (
    <div className="mt-10 grid grid-cols-[minmax(0,1fr)_340px] gap-14 tablet:grid-cols-1">
      <div>
        <h2 className="font-editorial text-4xl font-medium">Review every detail.</h2>

        <section className="mt-8 border-t border-line pt-6">
          <div className="flex items-center justify-between gap-4">
            <h3 className="flex items-center gap-3 font-editorial text-2xl font-medium"><MapPin className="text-wine" size={19} /> Delivery address</h3>
            <Link className="inline-flex min-h-10 items-center gap-2 text-xs text-muted underline underline-offset-4 hover:text-wine" to="/checkout/shipping"><Pencil size={13} /> Edit</Link>
          </div>
          <address className="mt-4 text-sm not-italic leading-6 text-muted">
            <span className="block font-medium text-ink">{shippingAddress.name}</span>
            <span className="block">{shippingAddress.line1}</span>
            {shippingAddress.line2 && <span className="block">{shippingAddress.line2}</span>}
            <span className="block">{shippingAddress.city}, {shippingAddress.region} {shippingAddress.postalCode}</span>
            <span className="block">{shippingAddress.country}</span>
            <span className="mt-2 block">{shippingAddress.phone}</span>
          </address>
        </section>

        <section className="mt-8 border-t border-line pt-6">
          <div className="flex items-center justify-between gap-4">
            <h3 className="flex items-center gap-3 font-editorial text-2xl font-medium"><Truck className="text-wine" size={19} /> {quote.deliveryMethod.name}</h3>
            <Link className="inline-flex min-h-10 items-center gap-2 text-xs text-muted underline underline-offset-4 hover:text-wine" to="/checkout/delivery"><Pencil size={13} /> Edit</Link>
          </div>
          <p className="mt-3 text-sm text-muted">{quote.deliveryMethod.description}</p>
        </section>

        <section className="mt-8 border-t border-line pt-6">
          <h3 className="flex items-center gap-3 font-editorial text-2xl font-medium"><PackageCheck className="text-wine" size={19} /> Order contents</h3>
          <div className="mt-5">
            {quote.lines.map((line) => (
              <article className="grid grid-cols-[72px_1fr_auto] gap-4 border-b border-line py-4 first:pt-0 phone:grid-cols-[64px_1fr]" key={line.variantId}>
                {line.imageUrl ? <img className="aspect-[3/4] w-full bg-soft object-cover" src={line.imageUrl} alt="" /> : <div className="aspect-[3/4] bg-soft" />}
                <div>
                  <h4 className="text-sm font-medium">{line.title}</h4>
                  <p className="mt-1 text-xs text-muted">{line.optionSummary || `SKU ${line.sku}`}</p>
                  <p className="mt-2 text-xs text-muted">Quantity {line.quantity}</p>
                </div>
                <p className="text-sm font-medium tabular-nums phone:col-start-2">${line.lineTotal.toFixed(2)}</p>
              </article>
            ))}
          </div>
        </section>

        <Button className="mt-8 min-w-48" type="button" onClick={() => navigate("/checkout/payment")}>Continue to payment</Button>
      </div>
      <CheckoutSummary quote={quote} />
    </div>
  );
}
