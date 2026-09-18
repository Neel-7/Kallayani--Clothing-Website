import { Heart, Search, ShoppingBag, UserRound } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { collections } from "@/data/catalog";
import type { RootState } from "@/store/store";

function IconAction({
  label,
  children,
  ...props
}: React.ComponentProps<typeof Button> & { label: string }) {
  return (
    <Button
      {...props}
      variant="ghost"
      size="icon"
      className={`relative ${label === "Account" || label === "Wishlist" ? "tablet:hidden" : ""} phone:w-10`}
      aria-label={label}
    >
      {children}
    </Button>
  );
}

export function DesktopUtilityNav() {
  return (
    <div className="w-[clamp(170px,15vw,220px)] shrink-0 headerCompact:w-10 tablet:hidden">
      <SearchSheet
        trigger={
          <Button
            variant="ghost"
            className="w-full justify-start !border-x-0 !border-t-0 border-b border-ink px-0 pl-1 text-[13px] font-normal normal-case tracking-normal hover:border-b-wine headerCompact:size-10 headerCompact:justify-center headerCompact:border-b-0 headerCompact:pl-0"
            aria-label="Search collections"
          >
            <Search size={20} />
            <span className="headerCompact:hidden">Search the collection</span>
          </Button>
        }
      />
    </div>
  );
}

export function UtilityNav() {
  const bagCount = useSelector((state: RootState) => state.shop.bagCount);
  return (
    <div className="flex items-center justify-self-end gap-1 tablet:gap-0">
      <span className="mr-2 text-xs headerCompact:hidden">USD</span>
      <span className="hidden tablet:block">
        <SearchSheet
          trigger={
            <IconAction label="Search">
              <Search size={21} />
            </IconAction>
          }
        />
      </span>
      <IconAction label="Account">
        <UserRound size={19} />
      </IconAction>
      <IconAction label="Wishlist">
        <Heart size={19} />
      </IconAction>
      <IconAction label={`Shopping bag with ${bagCount} ${bagCount === 1 ? "item" : "items"}`}>
        <ShoppingBag size={19} />
        {bagCount > 0 && (
          <span className="absolute right-px top-[2px] grid h-[17px] min-w-[17px] place-items-center rounded-full bg-wine px-[3px] text-[10px] text-white">
            {bagCount}
          </span>
        )}
      </IconAction>
    </div>
  );
}

function SearchSheet({ trigger }: { trigger: React.ReactElement }) {
  const [query, setQuery] = useState("");
  const results = collections.filter((collection) =>
    `${collection.name} ${collection.subcategories.map((item) => item.name).join(" ")} ${collection.products.map((item) => `${item.name} ${item.craft} ${item.region}`).join(" ")}`
      .toLowerCase()
      .includes(query.trim().toLowerCase()),
  );
  return (
    <Sheet>
      <SheetTrigger asChild>{trigger}</SheetTrigger>
      <SheetContent side="right">
        <SheetTitle className="mb-3 mt-10 font-serif text-[32px] leading-[1.1]">
          Search the collection
        </SheetTitle>
        <SheetDescription className="mb-6 text-sm text-muted">
          Try a garment, weave, region, or technique.
        </SheetDescription>
        <label className="flex items-center gap-3 border-b border-ink py-3">
          <Search size={21} />
          <input
            className="min-h-7 w-full border-0"
            aria-label="Search collections"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Sarees, panjabis, jewellery…"
          />
        </label>
        <div className="mt-7 flex flex-col">
          <span className="mb-3 text-xs uppercase tracking-[.05em] text-muted">
            {query ? "Matching collections" : "Explore the collections"}
          </span>
          {results.map((item) => (
            <SheetClose asChild key={item.slug}>
              <Link
                className="flex min-h-20 items-center gap-[18px] border-b border-line py-2.5"
                to={`/${item.slug}`}
              >
                <img className="size-16 object-cover" src={item.hero.src} alt="" />
                <span>{item.name}</span>
                <span className="ml-auto" aria-hidden="true">
                  →
                </span>
              </Link>
            </SheetClose>
          ))}
          {results.length === 0 && (
            <p role="status">No collections found. Try “saree”, “cotton”, or “home”.</p>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
