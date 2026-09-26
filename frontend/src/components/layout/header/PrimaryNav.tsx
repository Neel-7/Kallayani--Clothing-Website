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
      className="h-full w-max max-w-full justify-self-center navCompact:hidden"
      aria-label="Primary navigation"
    >
      <ul className="flex h-full list-none items-center justify-center gap-[clamp(10px,1.25vw,22px)] p-0">
        {primaryNavItems.map((item, index) => {
          const isOpen = activeMenu === item.id;
          const isCurrent = currentPath === `/${item.id}`;
          return (
            <li className="h-full" key={item.id}>
              <Link
                ref={(element) => {
                  links.current[index] = element;
                }}
                className={`group inline-flex h-full cursor-pointer items-center whitespace-nowrap p-0 font-nav text-[14px] font-medium uppercase leading-none tracking-[.07em] transition-colors duration-[180ms] hover:text-wine focus-visible:text-wine headerCompact:text-[13px] ${isOpen || isCurrent ? "text-wine" : ""}`}
                to={item.viewAllHref === "/" ? "/#products" : item.viewAllHref}
                aria-haspopup="true"
                aria-expanded={isOpen}
                aria-controls={`mega-menu-${item.id}`}
                onMouseEnter={() => onOpen(item.id)}
                onClick={onClose}
                onKeyDown={(event) => handleKeyDown(event, index, item.id)}
              >
                <span
                  className={`relative after:absolute after:inset-x-0 after:-bottom-1 after:h-px after:origin-left after:scale-x-0 after:bg-wine after:transition-transform after:duration-[180ms] group-hover:after:scale-x-100 group-focus-visible:after:scale-x-100 ${isOpen || isCurrent ? "after:scale-x-100" : ""}`}
                >
                  {item.label}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
