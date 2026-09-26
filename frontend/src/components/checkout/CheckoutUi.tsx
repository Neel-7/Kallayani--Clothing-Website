import { AlertTriangle, RefreshCw } from "lucide-react";
import { Link } from "react-router-dom";
import { dollars } from "@/components/commerce/catalog-utils";
import { Button } from "@/components/ui/button";
import type { CheckoutQuote } from "@/types/customer";

export function CheckoutPageSkeleton({ label }: { label: string }) {
  return (
    <div className="mt-10 grid animate-pulse grid-cols-[minmax(0,1fr)_340px] gap-14 tablet:grid-cols-1" aria-label={label}>
      <div>
        <div className="h-9 w-64 bg-soft" />
        <div className="mt-7 h-20 bg-soft" />
        <div className="mt-4 h-20 bg-soft" />
        <div className="mt-4 h-20 bg-soft" />
      </div>
      <div className="h-72 bg-soft" />
    </div>
  );
}

export function CheckoutErrorPanel({
  title = "Checkout needs your attention.",
  message,
  onRetry,
  inventoryChanged = false,
}: {
  title?: string;
  message: string;
  onRetry?: () => void;
  inventoryChanged?: boolean;
}) {
  return (
    <div className="mt-10 border border-red/30 bg-[#fff8f6] p-7" role="alert">
      <AlertTriangle className="text-red" size={22} />
      <h2 className="mt-4 font-editorial text-3xl font-medium">{title}</h2>
      <p className="mt-2 max-w-[56ch] text-sm leading-6 text-muted">{message}</p>
      <div className="mt-6 flex flex-wrap gap-3">
        {onRetry && (
          <Button type="button" onClick={onRetry}>
            <RefreshCw size={14} /> Try again
          </Button>
        )}
        {inventoryChanged && (
          <Button variant="outline" asChild>
            <Link to="/cart">Review bag</Link>
          </Button>
        )}
      </div>
    </div>
  );
}

export function CheckoutSummary({ quote }: { quote: CheckoutQuote }) {
  return (
    <aside className="self-start bg-soft p-7 phone:p-5">
      <h2 className="font-editorial text-3xl font-medium">Order summary</h2>
      <div className="mt-5 border-b border-line pb-4">
        {quote.lines.map((line) => (
          <div className="flex gap-3 py-3 first:pt-0" key={line.variantId}>
            {line.imageUrl ? (
              <img className="aspect-[3/4] w-14 bg-white object-cover" src={line.imageUrl} alt="" />
            ) : (
              <div className="aspect-[3/4] w-14 bg-white" />
            )}
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-medium">{line.title}</p>
              <p className="mt-1 text-[11px] text-muted">
                {line.optionSummary || `SKU ${line.sku}`} · Qty {line.quantity}
              </p>
            </div>
            <p className="text-xs font-medium tabular-nums">{dollars.format(line.lineTotal)}</p>
          </div>
        ))}
      </div>
      <dl className="mt-5 space-y-3 text-sm">
        <SummaryRow label="Subtotal" value={quote.subtotal} />
        <SummaryRow label="Delivery" value={quote.shippingTotal} complimentary />
        <SummaryRow label="Tax" value={quote.taxTotal} />
        <div className="flex justify-between gap-4 border-t border-line pt-4 text-base font-medium">
          <dt>Total</dt>
          <dd className="tabular-nums">{dollars.format(quote.total)}</dd>
        </div>
      </dl>
      <p className="mt-4 text-[11px] leading-5 text-muted">
        Prices and availability were verified by Kallayani when this summary loaded.
      </p>
    </aside>
  );
}

function SummaryRow({
  label,
  value,
  complimentary = false,
}: {
  label: string;
  value: number;
  complimentary?: boolean;
}) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-muted">{label}</dt>
      <dd className="tabular-nums">
        {complimentary && value === 0 ? "Complimentary" : dollars.format(value)}
      </dd>
    </div>
  );
}
