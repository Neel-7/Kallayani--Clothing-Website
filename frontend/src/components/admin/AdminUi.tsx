import { CircleAlert, RefreshCw } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";

export function AdminPageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <header className="flex flex-wrap items-end justify-between gap-5">
      <div>
        <h1 className="font-editorial text-5xl leading-none tracking-[-.035em] sm:text-6xl">
          {title}
        </h1>
        <p className="mt-3 max-w-[62ch] text-sm leading-6 text-muted">{description}</p>
      </div>
      {action}
    </header>
  );
}

export function AdminLoading({ label = "Loading" }: { label?: string }) {
  return (
    <div className="mt-9 space-y-3" aria-label={label} aria-busy="true">
      <div className="h-24 animate-pulse bg-white" />
      <div className="h-16 animate-pulse bg-white" />
      <div className="h-16 animate-pulse bg-white" />
      <div className="h-16 animate-pulse bg-white" />
    </div>
  );
}

export function AdminError({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="mt-9 border border-red/30 bg-red/5 p-6 text-sm text-red" role="alert">
      <div className="flex items-start gap-3">
        <CircleAlert className="mt-0.5 shrink-0" size={18} />
        <div>
          <p>{message}</p>
          <Button className="mt-5" variant="outline" type="button" onClick={onRetry}>
            <RefreshCw size={15} /> Try again
          </Button>
        </div>
      </div>
    </div>
  );
}

const statusTone: Record<string, string> = {
  paid: "bg-[#e5eee5] text-[#285536]",
  confirmed: "bg-[#e5eee5] text-[#285536]",
  completed: "bg-[#e5eee5] text-[#285536]",
  delivered: "bg-[#e5eee5] text-[#285536]",
  shipped: "bg-[#e7edf2] text-[#315267]",
  packed: "bg-[#eee9f3] text-[#58436b]",
  picking: "bg-[#f3ecdc] text-[#755d2b]",
  pending: "bg-[#f3ecdc] text-[#755d2b]",
  awaiting_payment: "bg-[#f3ecdc] text-[#755d2b]",
  partially_refunded: "bg-[#f3ecdc] text-[#755d2b]",
  refunded: "bg-[#ece8e4] text-[#655a52]",
  canceled: "bg-red/10 text-red",
  failed: "bg-red/10 text-red",
  payment_failed: "bg-red/10 text-red",
  "out of stock": "bg-red/10 text-red",
  "low stock": "bg-[#f3ecdc] text-[#755d2b]",
};

export function AdminStatus({ value }: { value: string }) {
  return (
    <span className={`inline-flex min-h-7 items-center px-2.5 text-[11px] font-medium capitalize ${statusTone[value] ?? "bg-[#ece8e4] text-[#655a52]"}`}>
      {value.replaceAll("_", " ")}
    </span>
  );
}
