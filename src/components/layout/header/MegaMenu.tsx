import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import type { NavItemConfig } from "./types";

type MegaMenuProps = {
  config: NavItemConfig;
  onNavigate: () => void;
};

export function MegaMenu({ config, onNavigate }: MegaMenuProps) {
  return (
    <div
      className="absolute left-0 top-full max-h-[calc(100dvh-96px)] w-full overflow-y-auto bg-white shadow-[0_12px_22px_#17141214] animate-menuIn"
      id={`mega-menu-${config.id}`}
    >
      <div className="mx-auto grid min-h-[330px] max-w-[1520px] grid-cols-[minmax(0,1fr)_minmax(220px,280px)] gap-6 px-gutter py-7 compact:grid-cols-1 compact:gap-0">
        <div
          className="grid min-w-0 grid-rows-[1fr_auto]"
          aria-label={`${config.label} categories`}
        >
          <div
            className="grid min-w-0"
            style={{ gridTemplateColumns: `repeat(${config.columns.length}, minmax(0, 1fr))` }}
          >
            {config.columns.map((column, index) => (
              <section
                className={`flex min-w-0 flex-col items-start gap-[10px] border-r border-line pr-3 ${index === 0 ? "" : "pl-[clamp(12px,1.5vw,24px)]"}`}
                key={column.heading}
              >
                <h3 className="mb-1 text-sm font-semibold uppercase tracking-[.025em]">
                  {column.heading}
                </h3>
                {column.links.map((link) => (
                  <Link
                    className="text-sm leading-[1.4] text-muted hover:text-wine hover:underline hover:underline-offset-4"
                    key={link.label}
                    to={link.href}
                    onClick={onNavigate}
                  >
                    {link.label}
                  </Link>
                ))}
              </section>
            ))}
          </div>
          <Link
            className="mt-6 flex items-center gap-2.5  pt-[14px] text-sm font-medium"
            to={config.viewAllHref === "/" ? "/#products" : config.viewAllHref}
            onClick={onNavigate}
          >
            Explore {config.label.toLowerCase()} <ArrowRight size={15} />
          </Link>
        </div>
        <Link
          className="group relative min-h-[266px] overflow-hidden bg-soft compact:hidden"
          to={config.promo.href}
          onClick={onNavigate}
        >
          <img
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-[400ms] group-hover:scale-[1.025]"
            src={config.promo.image}
            alt={config.promo.alt}
          />
          <span className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-white/95 px-[11px] py-[9px] text-xs font-medium">
            {config.promo.caption}
            <ArrowRight size={15} />
          </span>
        </Link>
      </div>
    </div>
  );
}
