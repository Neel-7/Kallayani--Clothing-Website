import { ArrowRight, Package } from "lucide-react";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { AccountError } from "@/components/account/AccountLayout";
import { dollars } from "@/components/commerce/catalog-utils";
import { Button } from "@/components/ui/button";
import { useGetOrdersQuery } from "@/store/customer-api";

const dateFormat = new Intl.DateTimeFormat("en-US", {
  month: "long",
  day: "numeric",
  year: "numeric",
});

export function AccountOrdersPage() {
  const orders = useGetOrdersQuery();

  useEffect(() => {
    document.title = "Order history | Kallayani";
  }, []);

  if (orders.error) return <AccountError message="Your order history could not be loaded." onRetry={orders.refetch} />;
  if (orders.isLoading) return <div className="min-h-[440px] animate-pulse bg-soft" aria-label="Loading orders" />;

  return (
    <div>
      <header>
        <h1 className="font-editorial text-[clamp(42px,5vw,62px)] font-medium leading-none tracking-[-.03em]">Order history.</h1>
        <p className="mt-4 text-sm leading-6 text-muted">Follow current orders and revisit past purchases.</p>
      </header>

      {orders.data?.length ? (
        <div className="mt-10 border-t border-line">
          {orders.data.map((order) => (
            <article className="grid grid-cols-[1fr_auto] gap-8 border-b border-line py-6 phone:grid-cols-1 phone:gap-5" key={order.id}>
              <div className="flex min-w-0 gap-5">
                <div className="flex -space-x-7">
                  {order.lines.slice(0, 3).map((line) => (
                    line.imageUrl ? <img className="aspect-[3/4] w-16 border-2 border-white bg-soft object-cover" key={line.variantId} src={line.imageUrl} alt="" /> : <span className="aspect-[3/4] w-16 border-2 border-white bg-soft" key={line.variantId} />
                  ))}
                </div>
                <div className="min-w-0">
                  <p className="text-xs uppercase tracking-[.08em] text-muted">Order {order.id.slice(0, 8).toUpperCase()}</p>
                  <h2 className="mt-2 text-base font-medium capitalize">{order.fulfillmentStatus}</h2>
                  <p className="mt-1 text-xs text-muted">{order.createdAt ? dateFormat.format(new Date(order.createdAt)) : "Date pending"}</p>
                  <p className="mt-1 text-xs text-muted">{order.lines.length} {order.lines.length === 1 ? "piece" : "pieces"}</p>
                </div>
              </div>
              <div className="flex flex-col items-end justify-between phone:items-start">
                <p className="text-base font-medium tabular-nums">{dollars.format(order.total)}</p>
                <Link className="mt-5 inline-flex min-h-10 items-center gap-2 text-xs text-wine underline underline-offset-4" to={`/account/orders/${order.id}`}>View details <ArrowRight size={14} /></Link>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="mt-10 flex min-h-[340px] flex-col items-center justify-center bg-soft px-6 text-center">
          <Package className="text-wine" size={28} />
          <h2 className="mt-5 font-editorial text-4xl font-medium">No orders yet.</h2>
          <p className="mt-3 max-w-[38ch] text-sm leading-6 text-muted">When you place an order, its progress and details will appear here.</p>
          <Button className="mt-7" asChild><Link to="/shop">Browse the collection</Link></Button>
        </div>
      )}
    </div>
  );
}
