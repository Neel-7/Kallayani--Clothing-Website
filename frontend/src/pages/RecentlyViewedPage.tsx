import { useEffect, useMemo } from "react";
import { Clock3 } from "lucide-react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { ProductGrid } from "@/components/commerce/ProductGridCard";
import { ApiErrorState, PageSkeleton } from "@/components/commerce/CatalogStates";
import { flattenCatalog } from "@/components/commerce/catalog-utils";
import { Button } from "@/components/ui/button";
import type { RootState } from "@/store/store";
import { useGetCollectionsQuery } from "@/store/storefront-api";

export function RecentlyViewedPage() {
  const recentIds = useSelector((state: RootState) => state.shop.recentlyViewed);
  const { data: collections = [], error, isLoading, refetch } = useGetCollectionsQuery();
  const recentProducts = useMemo(() => {
    const productMap = new Map(flattenCatalog(collections).map((product) => [product.id, product]));
    return recentIds.flatMap((id) => {
      const product = productMap.get(id);
      return product ? [product] : [];
    });
  }, [collections, recentIds]);

  useEffect(() => {
    document.title = "Recently viewed | Kallayani";
  }, []);

  if (isLoading) return <PageSkeleton titleWidth="w-72" />;
  if (error) return <ApiErrorState title="Your recent pieces could not be loaded." onRetry={refetch} />;

  return (
    <section className="mx-auto min-h-[65vh] max-w-[1400px] px-gutter pb-20 pt-10 phone:pb-14 phone:pt-7">
      <h1 className="font-editorial text-[clamp(44px,6vw,68px)] font-medium leading-none tracking-[-.03em]">
        Recently viewed.
      </h1>
      <p className="mt-4 text-sm text-muted">Your last 12 viewed pieces stay here on this device.</p>
      <div className="mt-10">
        {recentProducts.length ? (
          <ProductGrid products={recentProducts} />
        ) : (
          <div className="flex min-h-[380px] flex-col items-center justify-center bg-soft px-6 text-center">
            <Clock3 className="text-wine" size={30} strokeWidth={1.4} />
            <h2 className="mt-5 font-editorial text-4xl font-medium">No recent pieces.</h2>
            <p className="mt-3 max-w-[38ch] text-sm leading-6 text-muted">
              Products you open will appear here, ready for a second look.
            </p>
            <Button className="mt-7" asChild>
              <Link to="/shop">Start browsing</Link>
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
