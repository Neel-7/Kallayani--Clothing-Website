import { useEffect, useState } from "react";
import { AlertTriangle, ArrowRight, PackagePlus } from "lucide-react";
import { Link } from "react-router-dom";
import {
  AdminError,
  AdminLoading,
  AdminPageHeader,
  AdminStatus,
} from "@/components/admin/AdminUi";
import { adminDate, adminMoney } from "@/components/admin/admin-format";
import { useGetDashboardQuery } from "@/store/admin-api";

export function AdminDashboardPage() {
  const [days, setDays] = useState(30);
  const report = useGetDashboardQuery(days);

  useEffect(() => {
    document.title = "Store overview | Kallayani";
  }, []);

  const data = report.data;

  return (
    <div className="mx-auto max-w-7xl">
      <AdminPageHeader
        title="Store overview"
        description="Sales, customers, fulfillment, and stock signals from the live store."
        action={
          <div className="flex flex-wrap gap-3">
            <label className="grid gap-1.5 text-[11px] font-medium text-muted">
              Reporting period
              <select
                className="min-h-11 border border-[#cfc7bd] bg-white px-3 text-sm text-ink"
                value={days}
                onChange={(event) => setDays(Number(event.target.value))}
              >
                <option value={7}>Last 7 days</option>
                <option value={30}>Last 30 days</option>
                <option value={90}>Last 90 days</option>
              </select>
            </label>
            <Link
              className="mt-auto inline-flex min-h-11 items-center gap-2 bg-ink px-5 text-xs font-medium text-white hover:bg-wine"
              to="/admin/products/new"
            >
              <PackagePlus size={16} /> New product
            </Link>
          </div>
        }
      />

      {report.isLoading && <AdminLoading label="Loading store report" />}
      {report.error && (
        <AdminError message="The store report could not be loaded." onRetry={report.refetch} />
      )}

      {data && (
        <>
          <section className="mt-10 grid gap-px bg-[#d8d1c7] sm:grid-cols-2 xl:grid-cols-4">
            <Metric label="Net sales" value={adminMoney.format(data.metrics.netSales)} detail={`${adminMoney.format(data.metrics.refunds)} refunded`} />
            <Metric label="Orders" value={String(data.metrics.orders)} detail={`${data.metrics.unitsSold} units sold`} />
            <Metric label="Average order" value={adminMoney.format(data.metrics.averageOrderValue)} detail={`${data.metrics.newCustomers} new customers`} />
            <Metric label="Fulfillment queue" value={String(data.metrics.fulfillmentQueue)} detail={`${data.metrics.lowStockCount} low-stock variants`} />
          </section>

          <div className="mt-10 grid gap-8 xl:grid-cols-[minmax(0,1.35fr)_minmax(300px,.65fr)]">
            <section className="border border-[#d8d1c7] bg-white">
              <div className="flex items-center justify-between border-b border-[#d8d1c7] px-6 py-5">
                <div>
                  <h2 className="font-editorial text-3xl">Daily performance</h2>
                  <p className="mt-1 text-xs text-muted">Most recent ten days in this period</p>
                </div>
                <Link className="text-xs text-wine underline underline-offset-4" to="/admin/orders">All orders</Link>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[540px] text-left text-sm">
                  <thead className="bg-[#f5f2ed] text-[11px] text-muted">
                    <tr><th className="px-6 py-3 font-medium">Date</th><th className="px-6 py-3 font-medium">Orders</th><th className="px-6 py-3 text-right font-medium">Net sales</th></tr>
                  </thead>
                  <tbody>
                    {data.daily.slice(-10).map((day) => (
                      <tr className="border-t border-[#e4ddd4]" key={day.date}>
                        <td className="px-6 py-3.5">{adminDate.format(new Date(`${day.date}T12:00:00Z`))}</td>
                        <td className="px-6 py-3.5 tabular-nums">{day.orders}</td>
                        <td className="px-6 py-3.5 text-right font-medium tabular-nums">{adminMoney.format(day.netSales)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section className="border border-[#d8d1c7] bg-white p-6">
              <h2 className="font-editorial text-3xl">Fulfillment</h2>
              <dl className="mt-6 space-y-4 text-sm">
                {Object.entries(data.fulfillment).map(([label, value]) => (
                  <div className="flex items-center justify-between gap-5" key={label}>
                    <dt className="capitalize text-muted">{label}</dt>
                    <dd className="font-medium tabular-nums">{value}</dd>
                  </div>
                ))}
              </dl>
              {data.metrics.lowStockCount > 0 && (
                <Link className="mt-7 flex items-center gap-3 border-t border-[#e4ddd4] pt-5 text-sm text-red" to="/admin/inventory">
                  <AlertTriangle size={17} /> {data.metrics.lowStockCount} variants need stock attention
                </Link>
              )}
            </section>
          </div>

          <section className="mt-10 border border-[#d8d1c7] bg-white">
            <div className="flex items-center justify-between px-6 py-5">
              <h2 className="font-editorial text-3xl">Recent orders</h2>
              <Link className="inline-flex items-center gap-2 text-xs text-wine underline underline-offset-4" to="/admin/orders">View all <ArrowRight size={14} /></Link>
            </div>
            {data.recentOrders.length ? (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[720px] text-left text-sm">
                  <tbody>
                    {data.recentOrders.map((order) => (
                      <tr className="border-t border-[#e4ddd4]" key={order.id}>
                        <td className="px-6 py-4"><Link className="font-medium hover:text-wine" to={`/admin/orders/${order.id}`}>{order.displayNumber ?? order.id.slice(0, 8).toUpperCase()}</Link></td>
                        <td className="px-6 py-4 text-muted">{order.customerEmail ?? order.shippingAddress?.name ?? "Customer"}</td>
                        <td className="px-6 py-4"><AdminStatus value={order.fulfillmentStatus} /></td>
                        <td className="px-6 py-4 text-right font-medium tabular-nums">{adminMoney.format(order.total)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="border-t border-[#e4ddd4] px-6 py-10 text-sm text-muted">No orders have been placed yet.</p>
            )}
          </section>
        </>
      )}
    </div>
  );
}

function Metric({ label, value, detail }: { label: string; value: string; detail: string }) {
  return (
    <article className="bg-[#faf8f4] p-6">
      <p className="text-[11px] font-medium text-muted">{label}</p>
      <p className="mt-5 font-editorial text-5xl leading-none tabular-nums">{value}</p>
      <p className="mt-3 text-xs text-muted">{detail}</p>
    </article>
  );
}
