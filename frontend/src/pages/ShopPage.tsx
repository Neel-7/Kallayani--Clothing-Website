import { useEffect, useMemo } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { ProductGrid } from "@/components/commerce/ProductGridCard";
import { ApiErrorState, ProductGridSkeleton } from "@/components/commerce/CatalogStates";
import { flattenCatalog } from "@/components/commerce/catalog-utils";
import { Button } from "@/components/ui/button";
import { useGetCollectionsQuery } from "@/store/storefront-api";

type PriceFilter = "all" | "under-150" | "150-249" | "250-plus";

function matchesPrice(price: number, filter: PriceFilter) {
  if (filter === "under-150") return price < 150;
  if (filter === "150-249") return price >= 150 && price < 250;
  if (filter === "250-plus") return price >= 250;
  return true;
}

export function ShopPage() {
  const [params, setParams] = useSearchParams();
  const { data: collections = [], error, isLoading, refetch } = useGetCollectionsQuery();
  const products = useMemo(() => flattenCatalog(collections), [collections]);
  const query = params.get("q") ?? "";
  const collection = params.get("collection") ?? "all";
  const craft = params.get("craft") ?? "all";
  const price = (params.get("price") ?? "all") as PriceFilter;
  const stock = params.get("stock") ?? "all";
  const sort = params.get("sort") ?? "featured";
  const craftOptions = useMemo(
    () => [...new Set(products.map((product) => product.craft))].sort(),
    [products],
  );

  const filteredProducts = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    const next = products.filter((product) => {
      const searchable = `${product.name} ${product.craft} ${product.region} ${product.collectionName}`.toLowerCase();
      return (
        (!normalized || searchable.includes(normalized)) &&
        (collection === "all" || product.collectionSlug === collection) &&
        (craft === "all" || product.craft === craft) &&
        matchesPrice(product.price, price) &&
        (stock === "all" || product.inStock !== false)
      );
    });
    if (sort === "price-low") next.sort((a, b) => a.price - b.price);
    if (sort === "price-high") next.sort((a, b) => b.price - a.price);
    if (sort === "name") next.sort((a, b) => a.name.localeCompare(b.name));
    return next;
  }, [collection, craft, price, products, query, sort, stock]);

  const updateParam = (key: string, value: string, defaultValue = "all") => {
    const next = new URLSearchParams(params);
    if (!value || value === defaultValue) next.delete(key);
    else next.set(key, value);
    setParams(next, { replace: true });
  };

  useEffect(() => {
    document.title = query ? `Search: ${query} | Kallayani` : "Shop all | Kallayani";
  }, [query]);

  if (error) {
    return (
      <ApiErrorState
        title="The shop could not be loaded."
        message="We could not reach the product catalogue. Try again to continue browsing."
        onRetry={refetch}
      />
    );
  }

  const hasFilters = Boolean(query || collection !== "all" || craft !== "all" || price !== "all" || stock !== "all" || sort !== "featured");

  return (
    <section className="mx-auto min-h-[70vh] max-w-[1400px] px-gutter pb-20 pt-10 phone:pb-14 phone:pt-7">
      <header className="max-w-2xl">
        <h1 className="font-editorial text-[clamp(44px,6vw,72px)] font-medium leading-none tracking-[-.03em]">
          Find your piece.
        </h1>
        <p className="mt-4 max-w-[52ch] text-sm leading-6 text-muted">
          Search by garment, craft, or region. Refine the collection by price and availability.
        </p>
      </header>

      <div className="mt-9 border-y border-line py-5">
        <label className="flex items-center gap-3 border-b border-ink pb-3">
          <Search size={20} />
          <span className="sr-only">Search products</span>
          <input
            className="min-h-8 w-full border-0 bg-transparent text-base outline-none placeholder:text-muted"
            type="search"
            value={query}
            onChange={(event) => updateParam("q", event.target.value, "")}
            placeholder="Search sarees, handloom cotton, Bengal"
          />
          {query && (
            <button type="button" className="grid size-10 place-items-center" onClick={() => updateParam("q", "", "")} aria-label="Clear search">
              <X size={17} />
            </button>
          )}
        </label>

        <div className="mt-4 grid grid-cols-[auto_repeat(5,minmax(130px,1fr))] items-end gap-3 tablet:grid-cols-3 phone:grid-cols-2">
          <div className="flex min-h-11 items-center gap-2 text-xs font-semibold uppercase tracking-[.08em] text-muted tablet:col-span-3 phone:col-span-2">
            <SlidersHorizontal size={16} /> Refine
          </div>
          <FilterSelect label="Collection" value={collection} onChange={(value) => updateParam("collection", value)}>
            <option value="all">All collections</option>
            {collections.map((item) => <option value={item.slug} key={item.slug}>{item.name}</option>)}
          </FilterSelect>
          <FilterSelect label="Craft" value={craft} onChange={(value) => updateParam("craft", value)}>
            <option value="all">All crafts</option>
            {craftOptions.map((item) => <option value={item} key={item}>{item}</option>)}
          </FilterSelect>
          <FilterSelect label="Price" value={price} onChange={(value) => updateParam("price", value)}>
            <option value="all">All prices</option>
            <option value="under-150">Under $150</option>
            <option value="150-249">$150 to $249</option>
            <option value="250-plus">$250 and over</option>
          </FilterSelect>
          <FilterSelect label="Availability" value={stock} onChange={(value) => updateParam("stock", value)}>
            <option value="all">All availability</option>
            <option value="in">In stock</option>
          </FilterSelect>
          <FilterSelect label="Sort" value={sort} onChange={(value) => updateParam("sort", value, "featured")}>
            <option value="featured">Featured</option>
            <option value="price-low">Price: low to high</option>
            <option value="price-high">Price: high to low</option>
            <option value="name">Name: A to Z</option>
          </FilterSelect>
        </div>
      </div>

      <div className="mb-5 mt-7 flex items-center justify-between gap-4 text-sm">
        <p aria-live="polite">
          {isLoading ? "Loading pieces" : `${filteredProducts.length} ${filteredProducts.length === 1 ? "piece" : "pieces"}`}
        </p>
        {hasFilters && (
          <button className="min-h-11 text-xs text-muted underline underline-offset-4 hover:text-wine" type="button" onClick={() => setParams({}, { replace: true })}>
            Clear filters
          </button>
        )}
      </div>

      {isLoading ? (
        <ProductGridSkeleton />
      ) : filteredProducts.length ? (
        <ProductGrid products={filteredProducts} />
      ) : (
        <div className="flex min-h-[380px] flex-col items-center justify-center bg-soft px-6 text-center">
          <Search className="text-wine" size={28} strokeWidth={1.4} />
          <h2 className="mt-5 font-editorial text-4xl font-medium">No pieces match.</h2>
          <p className="mt-3 max-w-[38ch] text-sm leading-6 text-muted">
            Try a broader search, remove a filter, or explore the full collection.
          </p>
          <Button className="mt-7" type="button" onClick={() => setParams({}, { replace: true })}>
            Show all pieces
          </Button>
        </div>
      )}
    </section>
  );
}

function FilterSelect({
  label,
  value,
  onChange,
  children,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  children: React.ReactNode;
}) {
  return (
    <label className="grid gap-1.5 text-[11px] font-medium text-muted">
      {label}
      <select className="min-h-11 w-full border border-line bg-white px-3 text-[13px] text-ink" value={value} onChange={(event) => onChange(event.target.value)}>
        {children}
      </select>
    </label>
  );
}
