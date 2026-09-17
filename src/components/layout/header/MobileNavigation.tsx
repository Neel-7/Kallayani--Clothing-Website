import { Menu } from "lucide-react";
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

export function MobileNavigation() {
  const [open, setOpen] = useState(false);
  return (
    <div className="mobile-only">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="icon-action" aria-label="Open navigation">
            <Menu size={21} />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="mobile-menu">
          <SheetTitle className="sr-only">Navigation</SheetTitle>
          <SheetDescription className="sr-only">Browse Kallayani collections</SheetDescription>
          <BrandMark />
          <nav className="mobile-nav" aria-label="Mobile navigation">
            {primaryNavItems.map((item) => (
              <NavLink
                key={item.id}
                to={item.viewAllHref === "/" ? "/#products" : item.viewAllHref}
                onClick={() => setOpen(false)}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </SheetContent>
      </Sheet>
    </div>
  );
}
