import { Check, LockKeyhole } from "lucide-react";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import type { RootState } from "@/store/store";
import { CheckoutProvider } from "./CheckoutContext";

const steps = [
  { path: "/checkout/shipping", label: "Address" },
  { path: "/checkout/delivery", label: "Delivery" },
  { path: "/checkout/review", label: "Review" },
  { path: "/checkout/payment", label: "Payment" },
] as const;

export function CheckoutLayout() {
  const location = useLocation();
  const authState = useSelector((state: RootState) => state.customerAuth);

  useEffect(() => {
    document.title = "Secure checkout | Kallayani";
  }, []);

  if (authState.status === "checking") return <CheckoutLayoutSkeleton />;
  if (authState.status !== "authenticated" || !authState.user) {
    return <Navigate replace to={`/login?returnTo=${encodeURIComponent(location.pathname)}`} />;
  }

  const matchedStep = steps.findIndex((step) => location.pathname === step.path);
  const activeIndex = matchedStep < 0 ? steps.length - 1 : matchedStep;

  return (
    <CheckoutProvider>
      <section className="mx-auto min-h-[70vh] max-w-[1180px] px-gutter pb-24 pt-10 phone:pb-16 phone:pt-7">
        <header className="border-b border-line pb-7">
          <div className="flex items-center justify-between gap-6">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[.12em] text-wine">
                Kallayani checkout
              </p>
              <h1 className="mt-2 font-editorial text-[clamp(36px,5vw,54px)] font-medium leading-none tracking-[-.03em]">
                Complete your order.
              </h1>
            </div>
            <span className="flex items-center gap-2 text-xs text-muted phone:hidden">
              <LockKeyhole size={15} /> Secure payment
            </span>
          </div>
          <ol className="mt-8 grid grid-cols-4 gap-3 phone:gap-1" aria-label="Checkout progress">
            {steps.map((step, index) => {
              const isComplete = index < activeIndex;
              const isActive = index === activeIndex;
              return (
                <li
                  className={`border-t-2 pt-3 text-xs ${
                    isActive || isComplete ? "border-wine text-ink" : "border-line text-muted"
                  }`}
                  key={step.path}
                  aria-current={isActive ? "step" : undefined}
                >
                  <span className="flex items-center gap-2">
                    <span className="grid size-5 shrink-0 place-items-center rounded-full border border-current text-[10px]">
                      {isComplete ? <Check size={11} /> : index + 1}
                    </span>
                    <span className="phone:hidden">{step.label}</span>
                  </span>
                </li>
              );
            })}
          </ol>
        </header>
        <Outlet />
      </section>
    </CheckoutProvider>
  );
}

function CheckoutLayoutSkeleton() {
  return (
    <section className="mx-auto min-h-[70vh] max-w-[1180px] animate-pulse px-gutter py-10">
      <div className="h-12 w-80 max-w-full bg-soft" />
      <div className="mt-8 h-10 bg-soft" />
      <div className="mt-12 grid grid-cols-[minmax(0,1fr)_340px] gap-12 tablet:grid-cols-1">
        <div className="h-[460px] bg-soft" />
        <div className="h-72 bg-soft" />
      </div>
    </section>
  );
}
