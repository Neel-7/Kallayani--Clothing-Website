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
          ".primary-nav a[aria-expanded='true']",
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
      className="site-header"
      ref={headerRef}
      onMouseEnter={() => closeTimer.current && clearTimeout(closeTimer.current)}
      onMouseLeave={() => closeMenu()}
      onBlurCapture={(event) => {
        if (!headerRef.current?.contains(event.relatedTarget as Node | null)) closeMenu();
      }}
    >
      {showAnnouncement && (
        <div className="announcement">
          <span>Complimentary US shipping over $150</span>
          <span>New York appointments now open</span>
          <button
            type="button"
            className="announcement__close"
            aria-label="Dismiss announcement"
            onClick={() => setShowAnnouncement(false)}
          >
            <X size={14} aria-hidden="true" />
          </button>
        </div>
      )}
      <div className="header-main shell">
        <MobileNavigation />
        <BrandMark />
        <span className="header-tagline desktop-only">Heritage in every thread</span>
        <DesktopUtilityNav />
        <UtilityNav />
      </div>
      <PrimaryNav
        activeMenu={activeMenu}
        currentPath={location.pathname}
        onOpen={openMenu}
        onClose={() => closeMenu(true)}
      />
      {menuConfig && <MegaMenu config={menuConfig} onNavigate={() => closeMenu(true)} />}
    </header>
  );
}
