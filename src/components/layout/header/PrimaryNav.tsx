import { useRef } from "react";
import { ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import { primaryNavItems } from "./mega-menu-data";

type PrimaryNavProps = {
  activeMenu: string | null;
  currentPath: string;
  onOpen: (id: string, focusFirst?: boolean) => void;
  onClose: () => void;
};

export function PrimaryNav({ activeMenu, currentPath, onOpen, onClose }: PrimaryNavProps) {
  const links = useRef<Array<HTMLAnchorElement | null>>([]);

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLAnchorElement>,
    index: number,
    id: string,
  ) => {
    if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
      event.preventDefault();
      const step = event.key === "ArrowRight" ? 1 : -1;
      links.current[(index + step + primaryNavItems.length) % primaryNavItems.length]?.focus();
    }
    if (event.key === "ArrowDown") {
      event.preventDefault();
      onOpen(id, true);
    }
    if (event.key === "Escape") onClose();
  };

  return (
    <nav data-primary-nav className="h-9 tablet:hidden" aria-label="Primary navigation">
      <ul className="mx-gutter flex h-full list-none items-center gap-[clamp(24px,3vw,48px)] p-0">
        {primaryNavItems.map((item, index) => {
          const isOpen = activeMenu === item.id;
          const isCurrent = currentPath === `/${item.id}`;
          return (
            <li key={item.id}>
              <Link
                ref={(element) => {
                  links.current[index] = element;
                }}
                className={`relative inline-flex h-9 items-center gap-[5px] p-0 text-[clamp(12px,.76vw,14px)] font-medium uppercase tracking-[.025em] cursor-pointer after:absolute after:inset-x-0 after:bottom-0 after:h-[2px] after:origin-left after:scale-x-0 after:bg-wine after:transition-transform after:duration-[180ms] hover:after:scale-x-100 [&_svg]:w-3 [&_svg]:transition-transform [&_svg]:duration-[180ms] ${isOpen || isCurrent ? "after:scale-x-100" : ""} ${isOpen ? "[&_svg]:rotate-180" : ""}`}
                to={item.viewAllHref === "/" ? "/#products" : item.viewAllHref}
                aria-haspopup="true"
                aria-expanded={isOpen}
                aria-controls={`mega-menu-${item.id}`}
                onMouseEnter={() => onOpen(item.id)}
                onClick={onClose}
                onKeyDown={(event) => handleKeyDown(event, index, item.id)}
              >
                {item.label}
                <ChevronDown size={12} aria-hidden="true" />
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
