import { ArrowRight, MapPin, Package, UserRound } from "lucide-react";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { AccountError } from "@/components/account/AccountLayout";
import { dollars } from "@/components/commerce/catalog-utils";
import type { RootState } from "@/store/store";
import {
  useGetAddressesQuery,
  useGetOrdersQuery,
  useGetProfileQuery,
} from "@/store/customer-api";

export function AccountDashboardPage() {
  const user = useSelector((state: RootState) => state.customerAuth.user)!;
  const profile = useGetProfileQuery();
  const addresses = useGetAddressesQuery();
  const orders = useGetOrdersQuery();

  useEffect(() => {
    document.title = "Account overview | Kallayani";
  }, []);

  if (profile.error || addresses.error || orders.error) {
    return (
      <AccountError
        message="Your account information is safe, but it could not be reached right now."
        onRetry={() => {
          void profile.refetch();
          void addresses.refetch();
          void orders.refetch();
        }}
      />
    );
  }

  const recentOrder = orders.data?.[0];
  const firstName = profile.data?.firstName || user.firstName || "there";

  return (
    <div>
      <header>
        <h1 className="font-editorial text-[clamp(44px,6vw,68px)] font-medium leading-none tracking-[-.03em]">
          Welcome back, {firstName}.
        </h1>
        <p className="mt-4 text-sm leading-6 text-muted">
          Review your orders, saved addresses, and account details.
        </p>
      </header>

      <div className="mt-10 grid grid-cols-[1.45fr_.85fr] gap-5 tablet:grid-cols-1">
        <section className="border-t border-line pt-6">
          <div className="flex items-center justify-between gap-5">
            <h2 className="font-editorial text-3xl font-medium">Recent order</h2>
            <Link className="text-xs text-wine underline underline-offset-4" to="/account/orders">View all</Link>
          </div>
          {orders.isLoading ? (
            <div className="mt-6 h-36 animate-pulse bg-soft" />
          ) : recentOrder ? (
            <Link className="mt-6 grid grid-cols-[1fr_auto] gap-6 bg-soft p-6 phone:grid-cols-1" to={`/account/orders/${recentOrder.id}`}>
              <span>
                <span className="block text-xs uppercase tracking-[.08em] text-muted">Order {recentOrder.id.slice(0, 8).toUpperCase()}</span>
                <span className="mt-3 block text-lg font-medium capitalize">{recentOrder.fulfillmentStatus}</span>
                <span className="mt-1 block text-sm text-muted">{recentOrder.lines.length} {recentOrder.lines.length === 1 ? "piece" : "pieces"}</span>
              </span>
              <span className="self-end text-right phone:text-left">
                <span className="block text-lg font-medium tabular-nums">{dollars.format(recentOrder.total)}</span>
                <span className="mt-3 inline-flex items-center gap-2 text-xs text-wine">Order details <ArrowRight size={14} /></span>
              </span>
            </Link>
          ) : (
            <div className="mt-6 bg-soft p-6">
              <Package className="text-wine" size={22} />
              <p className="mt-4 text-sm font-medium">No orders yet.</p>
              <Link className="mt-3 inline-flex items-center gap-2 text-xs text-wine underline underline-offset-4" to="/shop">Browse the collection</Link>
            </div>
          )}
        </section>

        <div className="grid gap-5">
          <AccountShortcut icon={UserRound} title="Profile" detail={profile.data?.email || user.email || "Add your details"} to="/account/profile" />
          <AccountShortcut icon={MapPin} title="Addresses" detail={`${addresses.data?.length ?? 0} saved ${addresses.data?.length === 1 ? "address" : "addresses"}`} to="/account/addresses" />
        </div>
      </div>
    </div>
  );
}

function AccountShortcut({ icon: Icon, title, detail, to }: { icon: typeof UserRound; title: string; detail: string; to: string }) {
  return (
    <Link className="flex min-h-28 items-center gap-4 border border-line p-5 transition-colors hover:border-wine" to={to}>
      <Icon className="shrink-0 text-wine" size={20} />
      <span className="min-w-0">
        <span className="block text-sm font-medium">{title}</span>
        <span className="mt-1 block truncate text-xs text-muted">{detail}</span>
      </span>
      <ArrowRight className="ml-auto shrink-0 text-muted" size={15} />
    </Link>
  );
}
