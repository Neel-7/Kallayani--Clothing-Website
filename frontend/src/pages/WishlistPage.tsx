import { useEffect, useMemo } from "react";
import { Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { ProductGrid } from "@/components/commerce/ProductGridCard";
import { ApiErrorState, PageSkeleton } from "@/components/commerce/CatalogStates";
import { flattenCatalog } from "@/components/commerce/catalog-utils";
import { Button } from "@/components/ui/button";
import type { RootState } from "@/store/store";
import { useGetCollectionsQuery } from "@/store/storefront-api";

export function WishlistPage() {
  const wishedIds = useSelector((state: RootState) => state.shop.wishlist);
  const { data: collections = [], error, isLoading, refetch } = useGetCollectionsQuery();
  const wishedProducts = useMemo(() => {
    const productMap = new Map(flattenCatalog(collections).map((product) => [product.id, product]));
    return wishedIds.flatMap((id) => {
      const product = productMap.get(id);
      return product ? [product] : [];
    });
  }, [collections, wishedIds]);

  useEffect(() => {
    document.title = "Wishlist | Kallayani";
  }, []);

  if (isLoading) return <PageSkeleton />;
  if (error) return <ApiErrorState title="Your wishlist could not be loaded." onRetry={refetch} />;

  return (
    <section className="mx-auto min-h-[65vh] max-w-[1400px] px-gutter pb-20 pt-10 phone:pb-14 phone:pt-7">
      <h1 className="font-editorial text-[clamp(44px,6vw,68px)] font-medium leading-none tracking-[-.03em]">
        Saved pieces.
      </h1>
      <p className="mt-4 text-sm text-muted">
        {wishedProducts.length} {wishedProducts.length === 1 ? "piece" : "pieces"} kept for later.
      </p>
      <div className="mt-10">
        {wishedProducts.length ? (
          <ProductGrid products={wishedProducts} />
        ) : (
          <div className="flex min-h-[380px] flex-col items-center justify-center bg-soft px-6 text-center">
            <Heart className="text-wine" size={30} strokeWidth={1.4} />
            <h2 className="mt-5 font-editorial text-4xl font-medium">Nothing saved yet.</h2>
            <p className="mt-3 max-w-[38ch] text-sm leading-6 text-muted">
              Use the heart on any product to keep it here while you decide.
            </p>
            <Button className="mt-7" asChild>
              <Link to="/shop">Explore the collection</Link>
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
