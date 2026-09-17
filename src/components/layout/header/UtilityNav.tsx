import { Heart, Search, ShoppingBag, UserRound } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { collections } from "@/data/catalog";
import type { RootState } from "@/store/store";

function IconAction({ label, children, ...props }: React.ComponentProps<typeof Button> & { label: string }) {
  return <Button {...props} variant="ghost" size="icon" className="icon-action" aria-label={label}>{children}</Button>;
}

export function DesktopUtilityNav() {
  return (
    <div className="header-main__side header-main__side--left desktop-only">
      <SearchSheet trigger={<Button variant="ghost" className="header-search"><Search size={20} /><span>Search the collection</span></Button>} />
    </div>
  );
}

export function UtilityNav() {
  const bagCount = useSelector((state: RootState) => state.shop.bagCount);
  return (
    <div className="header-main__side header-main__side--right">
      <span className="header-currency desktop-only">USD</span>
      <span className="mobile-only"><SearchSheet trigger={<IconAction label="Search"><Search size={21} /></IconAction>} /></span>
      <IconAction label="Account"><UserRound size={19} /></IconAction>
      <IconAction label="Wishlist"><Heart size={19} /></IconAction>
      <IconAction label={`Shopping bag with ${bagCount} ${bagCount === 1 ? "item" : "items"}`}><ShoppingBag size={19} />{bagCount > 0 && <span className="bag-count">{bagCount}</span>}</IconAction>
    </div>
  );
}

function SearchSheet({ trigger }: { trigger: React.ReactElement }) {
  const [query, setQuery] = useState("");
  const results = collections.filter((collection) => `${collection.name} ${collection.subcategories.map((item) => item.name).join(" ")} ${collection.products.map((item) => `${item.name} ${item.craft} ${item.region}`).join(" ")}`.toLowerCase().includes(query.trim().toLowerCase()));
  return (
    <Sheet>
      <SheetTrigger asChild>{trigger}</SheetTrigger>
      <SheetContent side="right" className="search-sheet">
        <SheetTitle>Search the collection</SheetTitle>
        <SheetDescription>Try a garment, weave, region, or technique.</SheetDescription>
        <label className="search-field"><Search size={21} /><input aria-label="Search collections" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Sarees, panjabis, jewellery…" /></label>
        <div className="search-suggestions">
          <span>{query ? "Matching collections" : "Explore the collections"}</span>
          {results.map((item) => <SheetClose asChild key={item.slug}><Link className="search-result" to={`/${item.slug}`}><img src={item.hero.src} alt="" /><span>{item.name}</span><span aria-hidden="true">→</span></Link></SheetClose>)}
          {results.length === 0 && <p role="status">No collections found. Try “saree”, “cotton”, or “home”.</p>}
        </div>
      </SheetContent>
    </Sheet>
  );
}
