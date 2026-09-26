import { useEffect } from "react";
import { ArrowLeft, Mail, MapPin, ShoppingBag } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { AdminError, AdminLoading, AdminStatus } from "@/components/admin/AdminUi";
import { adminDate, adminMoney } from "@/components/admin/admin-format";
import { useGetCustomerQuery } from "@/store/admin-api";

export function AdminCustomerDetailsPage() {
  const { customerId = "" } = useParams();
  const customer = useGetCustomerQuery(customerId, { skip: !customerId });

  useEffect(() => {
    document.title = "Customer details | Kallayani administration";
  }, []);

  if (customer.isLoading) return <AdminLoading label="Loading customer" />;
  if (customer.error || !customer.data) return <AdminError message="This customer could not be loaded." onRetry={customer.refetch} />;
  const data = customer.data;
  const name = [data.firstName, data.lastName].filter(Boolean).join(" ") || "Customer account";

  return (
    <div className="mx-auto max-w-6xl">
      <Link className="inline-flex min-h-10 items-center gap-2 text-xs text-muted hover:text-wine" to="/admin/customers"><ArrowLeft size={14} /> Back to customers</Link>
      <header className="mt-4"><p className="text-xs text-muted">Customer since {adminDate.format(new Date(data.createdAt))}</p><h1 className="mt-2 font-editorial text-5xl leading-none tracking-[-.035em] sm:text-6xl">{name}</h1><p className="mt-3 flex items-center gap-2 text-sm text-muted"><Mail size={15} /> {data.email} {data.emailVerified ? "(verified)" : "(not verified)"}</p></header>

      <section className="mt-9 grid gap-px bg-[#d8d1c7] sm:grid-cols-2 lg:grid-cols-4"><Metric label="Net spend" value={adminMoney.format(data.totalSpent)} /><Metric label="Orders" value={String(data.orders.length)} /><Metric label="Cart items" value={String(data.cartCount)} /><Metric label="Wishlist" value={String(data.wishlistCount)} /></section>

      <div className="mt-9 grid gap-8 xl:grid-cols-[minmax(0,1fr)_360px]">
        <section className="border border-[#d8d1c7] bg-white">
          <h2 className="px-6 py-5 font-editorial text-3xl">Order history</h2>
          {data.orders.length ? data.orders.map((order) => (
            <article className="grid gap-4 border-t border-[#e4ddd4] px-6 py-5 sm:grid-cols-[1fr_auto_auto] sm:items-center" key={order.id}><div><Link className="font-medium text-wine hover:underline" to={`/admin/orders/${order.id}`}>{order.displayNumber ?? order.id.slice(0, 8).toUpperCase()}</Link><p className="mt-1 text-xs text-muted">{order.createdAt ? adminDate.format(new Date(order.createdAt)) : "Date pending"}</p></div><AdminStatus value={order.fulfillmentStatus} /><p className="font-medium tabular-nums">{adminMoney.format(order.total)}</p></article>
          )) : <div className="border-t border-[#e4ddd4] px-6 py-12 text-center"><ShoppingBag className="mx-auto text-wine" size={24} /><p className="mt-4 text-sm text-muted">This customer has no orders yet.</p></div>}
        </section>

        <aside className="space-y-8">
          <section className="border border-[#d8d1c7] bg-white p-6"><h2 className="font-editorial text-3xl">Account</h2><dl className="mt-5 space-y-3 text-sm"><Row label="Email marketing" value={data.marketingOptIn ? "Subscribed" : "Not subscribed"} /><Row label="Last sign-in" value={data.lastSignInAt ? adminDate.format(new Date(data.lastSignInAt)) : "Never"} /><Row label="Account state" value={data.disabled ? "Disabled" : "Active"} /></dl></section>
          <section className="border border-[#d8d1c7] bg-white p-6"><h2 className="flex items-center gap-3 font-editorial text-3xl"><MapPin className="text-wine" size={20} /> Addresses</h2>{data.addresses.length ? <div className="mt-5 space-y-5">{data.addresses.map((address) => <address className="border-t border-[#e4ddd4] pt-4 text-sm not-italic leading-6 text-muted first:border-t-0 first:pt-0" key={address.id}><span className="block font-medium text-ink">{address.label}{address.isDefault ? " (default)" : ""}</span><span className="block">{address.fullName}</span><span className="block">{address.line1}</span>{address.line2 && <span className="block">{address.line2}</span>}<span className="block">{address.city}, {address.region} {address.postalCode}</span><span className="block">{address.country}</span></address>)}</div> : <p className="mt-4 text-sm text-muted">No saved addresses.</p>}</section>
        </aside>
      </div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) { return <div className="bg-[#faf8f4] p-6"><p className="text-xs text-muted">{label}</p><p className="mt-4 font-editorial text-4xl tabular-nums">{value}</p></div>; }
function Row({ label, value }: { label: string; value: string }) { return <div className="flex justify-between gap-4"><dt className="text-muted">{label}</dt><dd className="text-right font-medium">{value}</dd></div>; }
