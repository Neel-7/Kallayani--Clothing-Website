import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { Link } from "react-router-dom";
import {
  AdminError,
  AdminLoading,
  AdminPageHeader,
  AdminStatus,
} from "@/components/admin/AdminUi";
import { adminDate, adminMoney } from "@/components/admin/admin-format";
import { useListOrdersQuery } from "@/store/admin-api";

export function AdminOrdersPage() {
  const orders = useListOrdersQuery();
  const [query, setQuery] = useState("");
  const [payment, setPayment] = useState("all");
  const [fulfillment, setFulfillment] = useState("all");

  useEffect(() => {
    document.title = "Orders | Kallayani administration";
  }, []);

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return (orders.data ?? []).filter((order) => {
      const searchable = `${order.id} ${order.displayNumber ?? ""} ${order.customerEmail ?? ""} ${order.shippingAddress?.name ?? ""}`.toLowerCase();
      return (
        (!normalized || searchable.includes(normalized)) &&
        (payment === "all" || order.paymentStatus === payment) &&
        (fulfillment === "all" || order.fulfillmentStatus === fulfillment)
      );
    });
  }, [fulfillment, orders.data, payment, query]);

  return (
    <div className="mx-auto max-w-7xl">
      <AdminPageHeader
        title="Orders"
        description="Review payment state, move paid orders through fulfillment, and resolve cancellations or refunds."
      />

      <div className="mt-8 grid gap-3 border-y border-[#d8d1c7] py-5 md:grid-cols-[minmax(260px,1fr)_220px_220px]">
        <label className="flex min-h-11 items-center gap-3 border border-[#cfc7bd] bg-white px-4">
          <Search size={16} />
          <span className="sr-only">Search orders</span>
          <input className="min-w-0 flex-1 bg-transparent text-sm outline-none" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Order, customer, or email" />
        </label>
        <Filter label="Payment" value={payment} onChange={setPayment} options={["all", "paid", "pending", "processing", "partially_refunded", "refunded", "failed"]} />
        <Filter label="Fulfillment" value={fulfillment} onChange={setFulfillment} options={["all", "unfulfilled", "picking", "packed", "shipped", "delivered", "canceled"]} />
      </div>

      {orders.isLoading && <AdminLoading label="Loading orders" />}
      {orders.error && <AdminError message="Orders could not be loaded." onRetry={orders.refetch} />}

      {orders.data && (
        <section className="mt-7 border border-[#d8d1c7] bg-white">
          <div className="flex items-center justify-between gap-4 px-5 py-4 text-xs text-muted">
            <p>{filtered.length} {filtered.length === 1 ? "order" : "orders"}</p>
            {(query || payment !== "all" || fulfillment !== "all") && (
              <button className="min-h-9 underline underline-offset-4 hover:text-wine" type="button" onClick={() => { setQuery(""); setPayment("all"); setFulfillment("all"); }}>Clear filters</button>
            )}
          </div>
          {filtered.length ? (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[920px] text-left text-sm">
                <thead className="border-t border-[#e4ddd4] bg-[#f5f2ed] text-[11px] text-muted">
                  <tr><th className="px-5 py-3 font-medium">Order</th><th className="px-5 py-3 font-medium">Customer</th><th className="px-5 py-3 font-medium">Placed</th><th className="px-5 py-3 font-medium">Payment</th><th className="px-5 py-3 font-medium">Fulfillment</th><th className="px-5 py-3 text-right font-medium">Total</th></tr>
                </thead>
                <tbody>
                  {filtered.map((order) => (
                    <tr className="border-t border-[#e4ddd4]" key={order.id}>
                      <td className="px-5 py-4"><Link className="font-medium text-wine underline-offset-4 hover:underline" to={`/admin/orders/${order.id}`}>{order.displayNumber ?? order.id.slice(0, 8).toUpperCase()}</Link><p className="mt-1 text-[11px] text-muted">{order.lines.length} {order.lines.length === 1 ? "line" : "lines"}</p></td>
                      <td className="px-5 py-4"><p>{order.shippingAddress?.name ?? "Customer"}</p><p className="mt-1 text-xs text-muted">{order.customerEmail ?? order.userId.slice(0, 12)}</p></td>
                      <td className="px-5 py-4 text-muted">{order.createdAt ? adminDate.format(new Date(order.createdAt)) : "Pending"}</td>
                      <td className="px-5 py-4"><AdminStatus value={order.paymentStatus} /></td>
                      <td className="px-5 py-4"><AdminStatus value={order.fulfillmentStatus} /></td>
                      <td className="px-5 py-4 text-right font-medium tabular-nums">{adminMoney.format(order.total)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="border-t border-[#e4ddd4] px-6 py-16 text-center">
              <h2 className="font-editorial text-3xl">No matching orders.</h2>
              <p className="mt-2 text-sm text-muted">Change the search or status filters to see more results.</p>
            </div>
          )}
        </section>
      )}
    </div>
  );
}

function Filter({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (value: string) => void }) {
  return (
    <label className="grid gap-1.5 text-[11px] font-medium text-muted">
      {label}
      <select className="min-h-11 border border-[#cfc7bd] bg-white px-3 text-sm capitalize text-ink" value={value} onChange={(event) => onChange(event.target.value)}>
        {options.map((option) => <option value={option} key={option}>{option.replaceAll("_", " ")}</option>)}
      </select>
    </label>
  );
}
