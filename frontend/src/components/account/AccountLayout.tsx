import { Clock3, Home, LogOut, MapPin, Package, UserRound } from "lucide-react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { authRepository } from "@/data/auth";
import { signedOut } from "@/store/customer-auth";
import type { RootState } from "@/store/store";
import { customerApi } from "@/store/customer-api";

const accountLinks = [
  { to: "/account", label: "Overview", icon: Home, end: true },
  { to: "/account/profile", label: "Profile", icon: UserRound, end: false },
  { to: "/account/addresses", label: "Addresses", icon: MapPin, end: false },
  { to: "/account/orders", label: "Orders", icon: Package, end: false },
] as const;

export function AccountLayout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const authState = useSelector((state: RootState) => state.customerAuth);
  const user = authState.user;

  useEffect(() => {
    document.title = "My account | Kallayani";
  }, []);

  if (authState.status === "checking") {
    return <AccountPageSkeleton />;
  }

  if (authState.status !== "authenticated" || !user) {
    return <Navigate replace to={`/login?returnTo=${encodeURIComponent(location.pathname)}`} />;
  }

  const initials = `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase() || "K";

  return (
    <section className="mx-auto grid min-h-[70vh] max-w-[1280px] grid-cols-[260px_minmax(0,1fr)] gap-12 px-gutter pb-20 pt-10 tablet:grid-cols-1 tablet:gap-8 phone:pb-14 phone:pt-7">
      <aside className="self-start bg-soft p-6 tablet:p-4">
        <div className="flex items-center gap-4 tablet:hidden">
          <span className="grid size-12 place-items-center rounded-full bg-wine font-editorial text-xl text-white">
            {initials}
          </span>
          <span className="min-w-0">
            <span className="block truncate text-sm font-medium">
              {[user.firstName, user.lastName].filter(Boolean).join(" ") || "Kallayani customer"}
            </span>
            <span className="block truncate text-xs text-muted">{user.email}</span>
          </span>
        </div>
        <nav className="mt-8 flex flex-col tablet:mt-0 tablet:grid tablet:grid-cols-5 phone:flex phone:flex-row phone:overflow-x-auto" aria-label="Account navigation">
          {accountLinks.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              className={({ isActive }) =>
                `flex min-h-12 items-center gap-3 border-b border-line px-2 text-sm transition-colors tablet:justify-center tablet:border-b-0 tablet:px-3 phone:min-w-max ${
                  isActive ? "text-wine" : "text-muted hover:text-ink"
                }`
              }
              end={end}
              key={to}
              to={to}
            >
              <Icon size={17} /> {label}
            </NavLink>
          ))}
          <button
            className="mt-6 flex min-h-11 items-center gap-3 px-2 text-left text-sm text-muted hover:text-wine tablet:mt-0 tablet:justify-center phone:min-w-max"
            type="button"
            onClick={async () => {
              await authRepository.logout();
              dispatch(customerApi.util.resetApiState());
              dispatch(signedOut());
              navigate("/");
            }}
          >
            <LogOut size={17} /> Sign out
          </button>
        </nav>
      </aside>

      <div className="min-w-0">
        {!user.emailVerified && !location.pathname.endsWith("verify-email") && (
          <div className="mb-8 flex items-center justify-between gap-5 border border-wine/25 bg-[#f8f1ef] px-5 py-4 text-sm phone:items-start">
            <span className="flex items-start gap-3">
              <Clock3 className="mt-0.5 shrink-0 text-wine" size={17} />
              <span>
                <strong className="block font-medium">Verify your email address</strong>
                <span className="mt-1 block text-xs leading-5 text-muted">
                  Confirm your inbox to keep your account secure.
                </span>
              </span>
            </span>
            <NavLink className="shrink-0 text-xs font-medium text-wine underline underline-offset-4" to="/account/verify-email">
              Verify
            </NavLink>
          </div>
        )}
        <Outlet />
      </div>
    </section>
  );
}

export function AccountPageSkeleton() {
  return (
    <section className="mx-auto grid min-h-[70vh] max-w-[1280px] grid-cols-[260px_minmax(0,1fr)] gap-12 px-gutter py-10 tablet:grid-cols-1">
      <div className="min-h-[360px] animate-pulse bg-soft tablet:min-h-20" />
      <div className="animate-pulse">
        <div className="h-12 w-64 bg-soft" />
        <div className="mt-8 h-40 bg-soft" />
        <div className="mt-5 h-56 bg-soft" />
      </div>
    </section>
  );
}

export function AccountError({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="flex min-h-[360px] flex-col items-start justify-center bg-soft p-8">
      <h1 className="font-editorial text-4xl font-medium">We could not load this section.</h1>
      <p className="mt-3 max-w-[48ch] text-sm leading-6 text-muted">{message}</p>
      <button className="mt-6 min-h-11 border border-ink bg-ink px-5 text-xs font-medium uppercase tracking-[.06em] text-white" type="button" onClick={onRetry}>
        Try again
      </button>
    </div>
  );
}
