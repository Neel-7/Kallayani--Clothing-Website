import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import type { NavItemConfig } from "./types";

type MegaMenuProps = {
  config: NavItemConfig;
  onNavigate: () => void;
};

export function MegaMenu({ config, onNavigate }: MegaMenuProps) {
  return (
    <div className="mega-menu" id={`mega-menu-${config.id}`}>
      <div className="mega-menu__body shell">
        <div
          className="mega-menu__columns"
          style={{
            gridTemplateColumns: `repeat(${config.columns.length}, minmax(0, 1fr))`,
          }}
          aria-label={`${config.label} categories`}
        >
          {config.columns.map((column) => (
            <section className="mega-menu__column" key={column.heading}>
              <h3>{column.heading}</h3>
              {column.links.map((link) => (
                <Link key={link.label} to={link.href} onClick={onNavigate}>
                  {link.label}
                </Link>
              ))}
            </section>
          ))}
          <Link
            className="mega-menu__view-all"
            to={config.viewAllHref === "/" ? "/#products" : config.viewAllHref}
            onClick={onNavigate}
          >
            Explore {config.label.toLowerCase()} <ArrowRight size={15} />
          </Link>
        </div>
        <Link className="mega-menu__promo" to={config.promo.href} onClick={onNavigate}>
          <img src={config.promo.image} alt={config.promo.alt} />
          <span>
            {config.promo.caption}
            <ArrowRight size={15} />
          </span>
        </Link>
      </div>
    </div>
  );
}
