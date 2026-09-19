import { useEffect, useMemo, useRef, useState } from "react";
import { X } from "lucide-react";
import { useLocation } from "react-router-dom";
import { BrandMark } from "../BrandMark";
import { MegaMenu } from "./MegaMenu";
import { MobileNavigation } from "./MobileNavigation";
import { PrimaryNav } from "./PrimaryNav";
import { primaryNavItems } from "./mega-menu-data";
import { DesktopUtilityNav, UtilityNav } from "./UtilityNav";

const OPEN_DELAY = 70;
const CLOSE_DELAY = 160;

export function Header() {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [showAnnouncement, setShowAnnouncement] = useState(true);
  const openTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const headerRef = useRef<HTMLElement>(null);
  const focusMenu = useRef(false);
  const location = useLocation();
  const menuConfig = useMemo(
    () => primaryNavItems.find((item) => item.id === activeMenu),
    [activeMenu],
  );

  const clearTimers = () => {
    if (openTimer.current) clearTimeout(openTimer.current);
    if (closeTimer.current) clearTimeout(closeTimer.current);
  };

  const openMenu = (id: string, focusFirst = false) => {
    focusMenu.current = focusFirst;
    if (focusFirst) {
      clearTimers();
      if (activeMenu === id) {
        headerRef.current?.querySelector<HTMLAnchorElement>(`#mega-menu-${id} a`)?.focus();
        focusMenu.current = false;
        return;
      }
      setActiveMenu(id);
      return;
    }
    if (closeTimer.current) clearTimeout(closeTimer.current);
    if (activeMenu === id) return;
    if (openTimer.current) clearTimeout(openTimer.current);
    openTimer.current = setTimeout(() => setActiveMenu(id), OPEN_DELAY);
  };

  const closeMenu = (immediate = false) => {
    if (openTimer.current) clearTimeout(openTimer.current);
    if (closeTimer.current) clearTimeout(closeTimer.current);
    if (immediate) setActiveMenu(null);
    else closeTimer.current = setTimeout(() => setActiveMenu(null), CLOSE_DELAY);
  };

  useEffect(() => {
    if (activeMenu && focusMenu.current) {
      headerRef.current?.querySelector<HTMLAnchorElement>(`#mega-menu-${activeMenu} a`)?.focus();
      focusMenu.current = false;
    }
  }, [activeMenu]);

  useEffect(() => {
    clearTimers();
    setActiveMenu(null);
  }, [location.pathname, location.hash]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        const openButton = headerRef.current?.querySelector<HTMLAnchorElement>(
          "[data-primary-nav] a[aria-expanded='true']",
        );
        closeMenu(true);
        openButton?.focus();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      clearTimers();
      window.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  return (
    <header
      className="sticky top-0 z-50 border-b border-line bg-white"
      ref={headerRef}
      onMouseEnter={() => closeTimer.current && clearTimeout(closeTimer.current)}
      onMouseLeave={() => closeMenu()}
      onBlurCapture={(event) => {
        if (!headerRef.current?.contains(event.relatedTarget as Node | null)) closeMenu();
      }}
    >
      {showAnnouncement && (
        <div className="relative flex h-[22px] items-center justify-center gap-[clamp(48px,12vw,192px)] bg-ink text-[10px] tracking-[.035em] text-white phone:h-[26px]">
          <span>Complimentary US shipping over $150</span>
          <span className="text-[#d9b491] tablet:hidden">New York appointments now open</span>
          <button
            type="button"
            className="absolute right-gutter top-0 grid size-[22px] place-items-center bg-transparent p-0 text-white opacity-[.78] hover:opacity-100 focus-visible:outline-white focus-visible:outline-offset-[-2px] phone:h-[26px]"
            aria-label="Dismiss announcement"
            onClick={() => setShowAnnouncement(false)}
          >
            <X size={14} aria-hidden="true" />
          </button>
        </div>
      )}
      <div className="grid h-[72px] w-full grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center px-[clamp(12px,1.25vw,24px)] headerCompact:[&>a_span]:text-[30px] navCompact:h-[68px] navCompact:grid-cols-[76px_1fr_88px] phone:h-16 phone:grid-cols-[52px_1fr_80px] [&>a]:navCompact:justify-self-center phone:[&>a_span]:text-[29px] phone:[&>a_svg]:h-[23px] phone:[&>a_svg]:w-[29px]">
        <MobileNavigation />
        <BrandMark />
        <PrimaryNav
          activeMenu={activeMenu}
          currentPath={location.pathname}
          onOpen={openMenu}
          onClose={() => closeMenu(true)}
        />
        <div className="flex items-center justify-self-end gap-[clamp(8px,1vw,16px)] tablet:gap-0">
          <DesktopUtilityNav />
          <UtilityNav />
        </div>
      </div>
      {menuConfig && <MegaMenu config={menuConfig} onNavigate={() => closeMenu(true)} />}
    </header>
  );
}
