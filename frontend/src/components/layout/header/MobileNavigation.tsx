import { Clock3, Heart, Menu, Search, ShoppingBag, UserRound } from "lucide-react";
import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { BrandMark } from "../BrandMark";
import { primaryNavItems } from "./mega-menu-data";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";

export function MobileNavigation() {
  const [open, setOpen] = useState(false);
  const isAuthenticated = useSelector(
    (state: RootState) => state.customerAuth.status === "authenticated",
  );
  return (
    <div className="hidden navCompact:block">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="relative" aria-label="Open navigation">
            <Menu size={21} />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="[&>a]:my-6 [&>a]:mb-9">
          <SheetTitle className="sr-only">Navigation</SheetTitle>
          <SheetDescription className="sr-only">Browse Kallayani collections</SheetDescription>
          <BrandMark />
          <nav className="flex flex-col" aria-label="Mobile navigation">
            {primaryNavItems.map((item) => (
              <NavLink
                key={item.id}
                to={item.viewAllHref === "/" ? "/#products" : item.viewAllHref}
                onClick={() => setOpen(false)}
                className="border-b border-line py-4 text-lg"
              >
                {item.label}
              </NavLink>
            ))}
            <div className="mt-6 grid grid-cols-2 gap-3 text-sm">
              <NavLink className="flex min-h-11 items-center gap-2 border border-line px-3" to="/shop" onClick={() => setOpen(false)}>
                <Search size={16} /> Shop all
              </NavLink>
              <NavLink className="flex min-h-11 items-center gap-2 border border-line px-3" to="/cart" onClick={() => setOpen(false)}>
                <ShoppingBag size={16} /> Bag
              </NavLink>
              <NavLink className="flex min-h-11 items-center gap-2 border border-line px-3" to="/wishlist" onClick={() => setOpen(false)}>
                <Heart size={16} /> Wishlist
              </NavLink>
              <NavLink className="flex min-h-11 items-center gap-2 border border-line px-3" to="/recently-viewed" onClick={() => setOpen(false)}>
                <Clock3 size={16} /> Recent
              </NavLink>
              <NavLink className="flex min-h-11 items-center gap-2 border border-line px-3" to={isAuthenticated ? "/account" : "/login"} onClick={() => setOpen(false)}>
                <UserRound size={16} /> {isAuthenticated ? "Account" : "Sign in"}
              </NavLink>
            </div>
          </nav>
        </SheetContent>
      </Sheet>
    </div>
  );
}
