import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, Search, TriangleAlert } from "lucide-react";
import { Link } from "react-router-dom";
import { AdminError, AdminLoading, AdminPageHeader, AdminStatus } from "@/components/admin/AdminUi";
import { useGetSettingsQuery, useListLowStockQuery } from "@/store/admin-api";

export function AdminInventoryPage() {
  const settings = useGetSettingsQuery();
  const inventory = useListLowStockQuery();
  const [query, setQuery] = useState("");
  const [state, setState] = useState("all");

  useEffect(() => {
    document.title = "Low stock | Kallayani administration";
  }, []);

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return (inventory.data ?? []).filter((item) => {
      const matchesState = state === "all" || (state === "out" ? item.availableQuantity === 0 : item.availableQuantity > 0);
      const searchable = `${item.productTitle} ${item.sku} ${item.optionSummary}`.toLowerCase();
      return matchesState && (!normalized || searchable.includes(normalized));
    });
  }, [inventory.data, query, state]);

  return (
    <div className="mx-auto max-w-7xl">
      <AdminPageHeader title="Low-stock inventory" description={`Variants at or below the store threshold${settings.data ? ` of ${settings.data.lowStockThreshold}` : ""}. Open a product to update quantities.`} />
      <div className="mt-8 grid gap-3 border-y border-[#d8d1c7] py-5 md:grid-cols-[1fr_220px]">
        <label className="flex min-h-11 items-center gap-3 border border-[#cfc7bd] bg-white px-4"><Search size={16} /><span className="sr-only">Search low-stock inventory</span><input className="min-w-0 flex-1 bg-transparent text-sm outline-none" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Product, SKU, or variant" /></label>
        <label className="grid gap-1.5 text-[11px] font-medium text-muted">Stock state<select className="admin-input" value={state} onChange={(event) => setState(event.target.value)}><option value="all">All low stock</option><option value="low">Low stock</option><option value="out">Out of stock</option></select></label>
      </div>

      {inventory.isLoading && <AdminLoading label="Loading low-stock inventory" />}
      {inventory.error && <AdminError message="Inventory could not be loaded." onRetry={inventory.refetch} />}
      {inventory.data && (
        filtered.length ? (
          <section className="mt-8 border border-[#d8d1c7] bg-white">
            <p className="px-5 py-4 text-xs text-muted">{filtered.length} variants require attention</p>
            <div className="overflow-x-auto"><table className="w-full min-w-[800px] text-left text-sm"><thead className="border-t border-[#e4ddd4] bg-[#f5f2ed] text-[11px] text-muted"><tr><th className="px-5 py-3 font-medium">Product</th><th className="px-5 py-3 font-medium">Variant</th><th className="px-5 py-3 font-medium">SKU</th><th className="px-5 py-3 font-medium">Status</th><th className="px-5 py-3 text-right font-medium">Available</th><th className="px-5 py-3 text-right font-medium">Action</th></tr></thead><tbody>{filtered.map((item) => <tr className="border-t border-[#e4ddd4]" key={item.variantId}><td className="px-5 py-4"><div className="flex items-center gap-3">{item.imageUrl ? <img className="size-12 bg-[#f3f0ea] object-cover" src={item.imageUrl} alt="" /> : <div className="size-12 bg-[#f3f0ea]" />}<span className="font-medium">{item.productTitle}</span></div></td><td className="px-5 py-4 text-muted">{item.optionSummary}</td><td className="px-5 py-4 font-mono text-xs">{item.sku}</td><td className="px-5 py-4"><AdminStatus value={item.availableQuantity === 0 ? "out of stock" : "low stock"} /></td><td className={`px-5 py-4 text-right font-mono text-base ${item.availableQuantity === 0 ? "text-red" : "text-ink"}`}>{item.availableQuantity}</td><td className="px-5 py-4 text-right"><Link className="text-xs text-wine underline underline-offset-4" to={`/admin/products/${item.productId}`}>Edit product</Link></td></tr>)}</tbody></table></div>
          </section>
        ) : (
          <div className="mt-8 flex min-h-[360px] flex-col items-center justify-center border border-[#d8d1c7] bg-white px-6 text-center">{inventory.data.length === 0 ? <CheckCircle2 className="text-[#285536]" size={30} /> : <TriangleAlert className="text-wine" size={30} />}<h2 className="mt-5 font-editorial text-4xl">{inventory.data.length === 0 ? "Stock levels look healthy." : "No variants match."}</h2><p className="mt-3 max-w-[44ch] text-sm leading-6 text-muted">{inventory.data.length === 0 ? "No active product variants are at or below the current threshold." : "Change the search or stock-state filter to see more variants."}</p></div>
        )
      )}
    </div>
  );
}
