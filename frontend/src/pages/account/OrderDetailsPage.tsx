import { ArrowLeft, MapPin, PackageCheck } from "lucide-react";
import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { AccountError } from "@/components/account/AccountLayout";
import { dollars } from "@/components/commerce/catalog-utils";
import { useGetOrderQuery } from "@/store/customer-api";

const dateFormat = new Intl.DateTimeFormat("en-US", {
  month: "long",
  day: "numeric",
  year: "numeric",
});

export function OrderDetailsPage() {
  const { orderId = "" } = useParams();
  const order = useGetOrderQuery(orderId, { skip: !orderId });

  useEffect(() => {
    document.title = "Order details | Kallayani";
  }, []);

  if (order.error) return <AccountError message="This order could not be loaded." onRetry={order.refetch} />;
  if (order.isLoading || !order.data) return <div className="min-h-[480px] animate-pulse bg-soft" aria-label="Loading order details" />;

  const data = order.data;
  const shipping = data.shippingAddress;

  return (
    <div>
      <Link className="inline-flex min-h-11 items-center gap-2 text-xs text-muted hover:text-wine" to="/account/orders"><ArrowLeft size={14} /> Back to orders</Link>
      <header className="mt-3">
        <p className="text-xs uppercase tracking-[.08em] text-muted">Order {data.id.slice(0, 8).toUpperCase()}</p>
        <h1 className="mt-3 font-editorial text-[clamp(42px,5vw,62px)] font-medium leading-none tracking-[-.03em]">Order details.</h1>
        <p className="mt-4 text-sm text-muted">{data.createdAt ? `Placed ${dateFormat.format(new Date(data.createdAt))}` : "Order date pending"}</p>
      </header>

      <div className="mt-9 flex items-start gap-4 bg-soft p-5">
        <PackageCheck className="mt-0.5 shrink-0 text-wine" size={20} />
        <span>
          <strong className="block text-sm font-medium capitalize">{data.fulfillmentStatus}</strong>
          <span className="mt-1 block text-xs leading-5 text-muted">Payment status: <span className="capitalize">{data.paymentStatus}</span></span>
        </span>
      </div>

      <section className="mt-10 border-t border-line pt-6">
        <h2 className="font-editorial text-3xl font-medium">Pieces in this order</h2>
        <div className="mt-5">
          {data.lines.map((line) => (
            <article className="grid grid-cols-[88px_1fr_auto] gap-5 border-b border-line py-5 first:pt-0 phone:grid-cols-[72px_1fr]" key={line.variantId}>
              {line.imageUrl ? <img className="aspect-[3/4] w-full bg-soft object-cover" src={line.imageUrl} alt="" /> : <div className="aspect-[3/4] bg-soft" />}
              <div>
                <h3 className="text-sm font-medium">{line.title}</h3>
                <p className="mt-1 text-xs text-muted">SKU {line.sku}</p>
                <p className="mt-2 text-xs text-muted">Quantity {line.quantity}</p>
              </div>
              <p className="text-sm font-medium tabular-nums phone:col-start-2">{dollars.format(line.lineTotal)}</p>
            </article>
          ))}
        </div>
      </section>

      <div className="mt-10 grid grid-cols-[1fr_320px] gap-12 tablet:grid-cols-1">
        <section>
          <h2 className="flex items-center gap-3 font-editorial text-3xl font-medium"><MapPin className="text-wine" size={20} /> Delivery address</h2>
          <address className="mt-5 text-sm not-italic leading-6 text-muted">
            {shipping.name && <span className="block text-ink">{shipping.name}</span>}
            <span className="block">{shipping.line1}</span>
            {shipping.line2 && <span className="block">{shipping.line2}</span>}
            <span className="block">{shipping.city}, {shipping.region} {shipping.postalCode}</span>
            <span className="block">{shipping.country}</span>
            {shipping.phone && <span className="mt-2 block">{shipping.phone}</span>}
          </address>
        </section>
        <section className="bg-soft p-6">
          <h2 className="font-editorial text-3xl font-medium">Summary</h2>
          <dl className="mt-5 space-y-3 text-sm">
            <SummaryRow label="Subtotal" value={data.subtotal} />
            <SummaryRow label="Delivery" value={data.shippingTotal} />
            <SummaryRow label="Tax" value={data.taxTotal} />
            <div className="flex justify-between gap-4 border-t border-line pt-4 text-base font-medium"><dt>Total</dt><dd>{dollars.format(data.total)}</dd></div>
          </dl>
        </section>
      </div>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: number }) {
  return <div className="flex justify-between gap-4"><dt className="text-muted">{label}</dt><dd>{value === 0 && label === "Delivery" ? "Complimentary" : dollars.format(value)}</dd></div>;
}
