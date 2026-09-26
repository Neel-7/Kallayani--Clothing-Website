import {
  Archive,
  Images,
  LayoutDashboard,
  LayoutTemplate,
  LibraryBig,
  LogOut,
  Package,
  Store,
} from "lucide-react";
import { NavLink, Outlet } from "react-router-dom";
import { BrandMark } from "@/components/layout/BrandMark";
import { useAdminAuth } from "./AdminAuthContext";

const navigation = [
  { to: "/admin", label: "Overview", icon: LayoutDashboard, end: true },
  { to: "/admin/products", label: "Products", icon: Package, end: false },
  { to: "/admin/collections", label: "Collections", icon: LibraryBig, end: false },
  { to: "/admin/homepage", label: "Homepage", icon: LayoutTemplate, end: false },
  { to: "/admin/media", label: "Media", icon: Images, end: false },
];

export function AdminLayout() {
  const { role, user, signOut } = useAdminAuth();

  return (
    <div className="min-h-screen bg-[#f3f0ea] text-ink lg:grid lg:grid-cols-[250px_1fr]">
      <aside className="border-b border-[#d8d1c7] bg-[#211d1a] px-5 py-5 text-white lg:sticky lg:top-0 lg:h-screen lg:border-b-0 lg:border-r lg:px-6 lg:py-8">
        <div className="flex items-center justify-between lg:block">
          <BrandMark light />
          <p className="text-[10px] font-semibold uppercase tracking-[.2em] text-[#cbbcaf] lg:mt-3">
            Catalogue studio
          </p>
        </div>

        <nav
          className="mt-6 flex gap-2 overflow-x-auto lg:mt-12 lg:block lg:space-y-1 lg:overflow-visible"
          aria-label="Administration"
        >
          {navigation.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 text-sm transition-colors ${
                  isActive
                    ? "bg-white text-ink"
                    : "text-[#d9d0c8] hover:bg-white/10 hover:text-white"
                }`
              }
              end={end}
              key={to}
              to={to}
            >
              <Icon size={17} /> {label}
            </NavLink>
          ))}
        </nav>

        <div className="mt-6 border-t border-white/15 pt-5 lg:absolute lg:inset-x-6 lg:bottom-7">
          <p className="truncate text-xs text-[#d9d0c8]">{user?.email}</p>
          <p className="mt-1 text-[10px] uppercase tracking-[.16em] text-[#9f9389]">{role}</p>
          <div className="mt-4 flex gap-4 text-xs text-[#d9d0c8]">
            <a className="flex items-center gap-1.5 hover:text-white" href="/">
              <Store size={14} /> Storefront
            </a>
            <button
              className="flex items-center gap-1.5 hover:text-white"
              onClick={() => void signOut()}
            >
              <LogOut size={14} /> Sign out
            </button>
          </div>
        </div>
      </aside>

      <main className="min-w-0 px-4 py-7 sm:px-7 lg:px-10 lg:py-10 xl:px-14">
        <Outlet />
      </main>
    </div>
  );
}

export function AdminNotFound() {
  return (
    <section className="grid min-h-[70vh] place-items-center text-center">
      <div>
        <Archive className="mx-auto text-wine" />
        <h1 className="mt-5 font-editorial text-5xl">Nothing here yet.</h1>
        <NavLink className="mt-5 inline-block text-sm underline" to="/admin/products">
          Return to products
        </NavLink>
      </div>
    </section>
  );
}
