import { ChevronDown } from "lucide-react";
import type { ReactNode } from "react";

export function ProductDisclosure({
  title,
  children,
  open,
  onToggle,
}: {
  title: string;
  children: ReactNode;
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="border-b border-line">
      <button
        className="flex min-h-12 w-full items-center justify-between gap-6 py-2 text-left text-[13px] font-semibold"
        type="button"
        aria-expanded={open}
        onClick={onToggle}
      >
        {title}
        <ChevronDown
          className={`shrink-0 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
          size={16}
        />
      </button>
      <div
        className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out ${
          open ? "grid-rows-[1fr] pb-4 opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden text-[13px] leading-6 text-muted">{children}</div>
      </div>
    </div>
  );
}
