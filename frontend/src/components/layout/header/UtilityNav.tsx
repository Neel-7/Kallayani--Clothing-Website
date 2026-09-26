import { Heart, Search, ShoppingBag, UserRound } from "lucide-react";
import { useMemo, useState } from "react";
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
import type { RootState } from "@/store/store";
import { useGetCollectionsQuery } from "@/store/storefront-api";
import { flattenCatalog } from "@/components/commerce/catalog-utils";
import { CartContents } from "@/components/commerce/CartContents";

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
      className={`relative ${label === "Account" || label === "Wishlist" ? "navCompact:hidden" : ""} phone:w-10`}
      aria-label={label}
    >
      {children}
    </Button>
  );
}

export function DesktopUtilityNav() {
  return (
    <div className="shrink-0 navCompact:hidden">
      <SearchSheet
        trigger={
          <IconAction label="Search products">
            <Search size={21} />
          </IconAction>
        }
      />
    </div>
  );
}

export function UtilityNav() {
  const bagCount = useSelector((state: RootState) => state.shop.bagCount);
  const isAuthenticated = useSelector(
    (state: RootState) => state.customerAuth.status === "authenticated",
  );
  return (
    <div className="flex items-center justify-self-end gap-1 navCompact:gap-0">
      <span className="hidden navCompact:block">
        <SearchSheet
          trigger={
            <IconAction label="Search">
              <Search size={21} />
            </IconAction>
          }
        />
      </span>
      <Button
        asChild
        variant="ghost"
        size="icon"
        className="relative navCompact:hidden"
        aria-label="Account"
      >
        <Link to={isAuthenticated ? "/account" : "/login"}>
          <UserRound size={19} />
        </Link>
      </Button>
      <Button
        asChild
        variant="ghost"
        size="icon"
        className="relative navCompact:hidden"
        aria-label="Wishlist"
      >
        <Link to="/wishlist">
          <Heart size={19} />
        </Link>
      </Button>
      <CartSheet bagCount={bagCount} />
    </div>
  );
}

function CartSheet({ bagCount }: { bagCount: number }) {
  const [open, setOpen] = useState(false);
  const { data: collections = [], error, isLoading, refetch } = useGetCollectionsQuery(undefined, {
    skip: !open,
  });
  const products = useMemo(() => flattenCatalog(collections), [collections]);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <IconAction label={`Shopping bag with ${bagCount} ${bagCount === 1 ? "item" : "items"}`}>
          <ShoppingBag size={19} />
          {bagCount > 0 && (
            <span className="absolute right-px top-[2px] grid h-[17px] min-w-[17px] place-items-center rounded-full bg-wine px-[3px] text-[10px] text-white">
              {bagCount}
            </span>
          )}
        </IconAction>
      </SheetTrigger>
      <SheetContent side="right" className="flex flex-col">
        <SheetTitle className="font-editorial text-[38px] font-medium leading-none">Your bag</SheetTitle>
        <SheetDescription className="mt-2 text-sm text-muted">
          {bagCount} {bagCount === 1 ? "item" : "items"} selected
        </SheetDescription>
        <div className="mt-8 flex-1">
          {isLoading ? (
            <div className="space-y-5" aria-label="Loading bag" aria-busy="true">
              {[0, 1].map((item) => (
                <div className="grid animate-pulse grid-cols-[88px_1fr] gap-4" key={item}>
                  <div className="aspect-[3/4] bg-soft" />
                  <div className="pt-2">
                    <div className="h-4 w-3/4 bg-soft" />
                    <div className="mt-3 h-3 w-1/3 bg-soft" />
                    <div className="mt-6 h-10 w-28 bg-soft" />
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="flex min-h-[320px] flex-col items-center justify-center text-center">
              <p className="text-sm text-muted">Your bag could not be loaded.</p>
              <Button className="mt-5" type="button" onClick={refetch}>Try again</Button>
            </div>
          ) : (
            <CartContents products={products} compact onNavigate={() => setOpen(false)} />
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

function SearchSheet({ trigger }: { trigger: React.ReactElement }) {
  const [query, setQuery] = useState("");
  const { data: collections = [], error, isLoading, refetch } = useGetCollectionsQuery();
  const products = useMemo(() => flattenCatalog(collections), [collections]);
  const normalized = query.trim().toLowerCase();
  const results = normalized
    ? products.filter((product) =>
        `${product.name} ${product.craft} ${product.region} ${product.collectionName}`
          .toLowerCase()
          .includes(normalized),
      )
    : [];

  return (
    <Sheet>
      <SheetTrigger asChild>{trigger}</SheetTrigger>
      <SheetContent side="right">
        <SheetTitle className="mb-3 mt-10 font-editorial text-[36px] font-semibold leading-[1.05] tracking-[-.02em]">
          Search all pieces
        </SheetTitle>
        <SheetDescription className="mb-6 text-sm text-muted">
          Try a garment, weave, region, or technique.
        </SheetDescription>
        <label className="flex items-center gap-3 border-b border-ink py-3">
          <Search size={21} />
          <input
            className="min-h-7 w-full border-0 bg-transparent outline-none"
            aria-label="Search products"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Sarees, panjabis, jewellery"
          />
        </label>
        <div className="mt-7 flex flex-col">
          <span className="mb-3 text-xs uppercase tracking-[.05em] text-muted">
            {isLoading ? "Loading products" : normalized ? `${results.length} matches` : "Explore the collections"}
          </span>
          {error ? (
            <div className="py-8 text-center">
              <p className="text-sm text-muted">Search is temporarily unavailable.</p>
              <Button className="mt-5" type="button" onClick={refetch}>Try again</Button>
            </div>
          ) : normalized ? (
            <>
              {results.slice(0, 6).map((item) => (
                <SheetClose asChild key={item.id}>
                  <Link className="flex min-h-20 items-center gap-[18px] border-b border-line py-2.5" to={`/product/${item.id}`}>
                    <img className="size-16 object-cover" src={item.image.src} alt="" />
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-medium">{item.name}</span>
                      <span className="mt-1 block text-xs text-muted">{item.collectionName}</span>
                    </span>
                    <span className="ml-auto" aria-hidden="true">→</span>
                  </Link>
                </SheetClose>
              ))}
              {results.length > 0 && (
                <SheetClose asChild>
                  <Button className="mt-6 w-full" asChild>
                    <Link to={`/shop?q=${encodeURIComponent(query.trim())}`}>View all results</Link>
                  </Button>
                </SheetClose>
              )}
              {results.length === 0 && !isLoading && (
                <div className="py-10 text-center">
                  <p className="font-editorial text-3xl">No pieces found.</p>
                  <p className="mt-2 text-sm text-muted">Try “saree”, “cotton”, or “Bengal”.</p>
                </div>
              )}
            </>
          ) : (
            collections.map((item) => (
              <SheetClose asChild key={item.slug}>
                <Link className="flex min-h-20 items-center gap-[18px] border-b border-line py-2.5" to={`/${item.slug}`}>
                  <img className="size-16 object-cover" src={item.hero.src} alt="" />
                  <span>{item.name}</span>
                  <span className="ml-auto" aria-hidden="true">→</span>
                </Link>
              </SheetClose>
            ))
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
