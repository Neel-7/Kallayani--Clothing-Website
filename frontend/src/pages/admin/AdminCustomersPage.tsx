import { FormEvent, useEffect, useState } from "react";
import { Search } from "lucide-react";
import { Link } from "react-router-dom";
import {
  AdminError,
  AdminLoading,
  AdminPageHeader,
} from "@/components/admin/AdminUi";
import { adminDate, adminMoney } from "@/components/admin/admin-format";
import { Button } from "@/components/ui/button";
import { useListCustomersQuery } from "@/store/admin-api";

export function AdminCustomersPage() {
  const [input, setInput] = useState("");
  const [query, setQuery] = useState("");
  const customers = useListCustomersQuery(query);

  useEffect(() => {
    document.title = "Customers | Kallayani administration";
  }, []);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    setQuery(input.trim());
  };

  return (
    <div className="mx-auto max-w-7xl">
      <AdminPageHeader title="Customers" description="Find customers by name, email, or account ID and review their order relationship." />
      <form className="mt-8 flex max-w-2xl gap-3" onSubmit={submit}>
        <label className="flex min-h-11 flex-1 items-center gap-3 border border-[#cfc7bd] bg-white px-4"><Search size={16} /><span className="sr-only">Search customers</span><input className="min-w-0 flex-1 bg-transparent text-sm outline-none" value={input} onChange={(event) => setInput(event.target.value)} placeholder="Name, email, or customer ID" /></label>
        <Button type="submit">Search</Button>
      </form>

      {customers.isLoading && <AdminLoading label="Loading customers" />}
      {customers.error && <AdminError message="Customers could not be loaded." onRetry={customers.refetch} />}
      {customers.data && (
        <section className="mt-8 border border-[#d8d1c7] bg-white">
          <p className="px-5 py-4 text-xs text-muted">{customers.data.length} {customers.data.length === 1 ? "customer" : "customers"}{query ? ` matching “${query}”` : ""}</p>
          {customers.data.length ? (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px] text-left text-sm">
                <thead className="border-t border-[#e4ddd4] bg-[#f5f2ed] text-[11px] text-muted"><tr><th className="px-5 py-3 font-medium">Customer</th><th className="px-5 py-3 font-medium">Joined</th><th className="px-5 py-3 font-medium">Email</th><th className="px-5 py-3 text-right font-medium">Orders</th><th className="px-5 py-3 text-right font-medium">Net spend</th></tr></thead>
                <tbody>
                  {customers.data.map((customer) => (
                    <tr className="border-t border-[#e4ddd4]" key={customer.id}>
                      <td className="px-5 py-4"><Link className="font-medium text-wine underline-offset-4 hover:underline" to={`/admin/customers/${customer.id}`}>{[customer.firstName, customer.lastName].filter(Boolean).join(" ") || "Customer account"}</Link><p className="mt-1 text-[11px] text-muted">{customer.id.slice(0, 16)}</p></td>
                      <td className="px-5 py-4 text-muted">{adminDate.format(new Date(customer.createdAt))}</td>
                      <td className="px-5 py-4"><p>{customer.email}</p><p className="mt-1 text-[11px] text-muted">{customer.emailVerified ? "Verified" : "Not verified"}</p></td>
                      <td className="px-5 py-4 text-right tabular-nums">{customer.orders}</td>
                      <td className="px-5 py-4 text-right font-medium tabular-nums">{adminMoney.format(customer.totalSpent)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="border-t border-[#e4ddd4] px-6 py-16 text-center"><h2 className="font-editorial text-3xl">No customers found.</h2><p className="mt-2 text-sm text-muted">Try a different name, email, or account ID.</p></div>
          )}
        </section>
      )}
    </div>
  );
}
