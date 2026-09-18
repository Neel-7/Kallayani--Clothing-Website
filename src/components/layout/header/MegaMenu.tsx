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
      className="absolute left-0 top-full max-h-[calc(100dvh-113px)] w-full overflow-y-auto border-t border-line bg-white shadow-[0_12px_22px_#17141214] animate-menuIn"
      id={`mega-menu-${config.id}`}
    >
      <div className="mx-gutter grid grid-cols-[minmax(0,1fr)_260px] gap-12 py-6 compact:grid-cols-[minmax(0,1fr)_220px] compact:gap-6">
        <div
          className="grid content-start grid-cols-3 gap-x-8 gap-y-5 compact:gap-x-5"
          style={{
            gridTemplateColumns: `repeat(${config.columns.length}, minmax(0, 1fr))`,
          }}
          aria-label={`${config.label} categories`}
        >
          {config.columns.map((column) => (
            <section className="flex flex-col items-start gap-[9px]" key={column.heading}>
              <h3 className="mb-[2px] text-sm font-semibold">{column.heading}</h3>
              {column.links.map((link) => (
                <Link
                  className="text-sm leading-[1.35] text-muted hover:text-wine hover:underline hover:underline-offset-4"
                  key={link.label}
                  to={link.href}
                  onClick={onNavigate}
                >
                  {link.label}
                </Link>
              ))}
            </section>
          ))}
          <Link
            className="col-span-full flex items-center gap-2.5 border-t border-line pt-[14px] text-sm font-medium"
            to={config.viewAllHref === "/" ? "/#products" : config.viewAllHref}
            onClick={onNavigate}
          >
            Explore {config.label.toLowerCase()} <ArrowRight size={15} />
          </Link>
        </div>
        <Link
          className="group relative h-[245px] overflow-hidden bg-soft"
          to={config.promo.href}
          onClick={onNavigate}
        >
          <img
            className="h-full w-full object-cover transition-transform duration-[400ms] group-hover:scale-[1.025]"
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
