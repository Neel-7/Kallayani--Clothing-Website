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
          </nav>
        </SheetContent>
      </Sheet>
    </div>
  );
}
