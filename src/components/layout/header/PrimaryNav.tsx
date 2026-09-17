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
    <nav className="primary-nav desktop-only" aria-label="Primary navigation">
      <ul className="shell">
        {primaryNavItems.map((item, index) => {
          const isOpen = activeMenu === item.id;
          const isCurrent = currentPath === `/${item.id}`;
          return (
            <li key={item.id}>
              <Link
                ref={(element) => {
                  links.current[index] = element;
                }}
                className={`${isOpen ? "is-open" : ""} ${isCurrent ? "is-current" : ""}`}
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
