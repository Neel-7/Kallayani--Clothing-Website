import { useRef } from "react";
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
    <nav
      data-primary-nav
      className="ml-[clamp(20px,2.25vw,42px)] h-full min-w-0 flex-1 tablet:hidden"
      aria-label="Primary navigation"
    >
      <ul className="flex h-full list-none items-center justify-between gap-3 p-0 headerCompact:gap-2">
        {primaryNavItems.map((item, index) => {
          const isOpen = activeMenu === item.id;
          const isCurrent = currentPath === `/${item.id}`;
          return (
            <li key={item.id}>
              <Link
                ref={(element) => {
                  links.current[index] = element;
                }}
                className={`relative inline-flex h-full items-center whitespace-nowrap p-0 text-sm font-medium uppercase tracking-[.025em] transition-colors duration-[180ms] cursor-pointer hover:text-wine focus-visible:text-wine after:absolute after:inset-x-0 after:bottom-[21px] after:h-px after:origin-left after:scale-x-0 after:bg-wine after:transition-transform after:duration-[180ms] hover:after:scale-x-100 focus-visible:after:scale-x-100 ${isOpen || isCurrent ? "text-wine after:scale-x-100" : ""}`}
                to={item.viewAllHref === "/" ? "/#products" : item.viewAllHref}
                aria-haspopup="true"
                aria-expanded={isOpen}
                aria-controls={`mega-menu-${item.id}`}
                onMouseEnter={() => onOpen(item.id)}
                onClick={onClose}
                onKeyDown={(event) => handleKeyDown(event, index, item.id)}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
