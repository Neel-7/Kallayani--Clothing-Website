import { useEffect, useMemo } from "react";
import { CartContents } from "@/components/commerce/CartContents";
import { ApiErrorState, PageSkeleton } from "@/components/commerce/CatalogStates";
import { flattenCatalog } from "@/components/commerce/catalog-utils";
import { useGetCollectionsQuery } from "@/store/storefront-api";

export function CartPage() {
  const { data: collections = [], error, isLoading, refetch } = useGetCollectionsQuery();
  const products = useMemo(() => flattenCatalog(collections), [collections]);

  useEffect(() => {
    document.title = "Shopping bag | Kallayani";
  }, []);

  if (isLoading) return <PageSkeleton titleWidth="w-64" />;
  if (error) return <ApiErrorState title="Your bag could not be loaded." onRetry={refetch} />;

  return (
    <section className="mx-auto min-h-[65vh] max-w-[1200px] px-gutter pb-20 pt-10 phone:pb-14 phone:pt-7">
      <h1 className="font-editorial text-[clamp(44px,6vw,68px)] font-medium leading-none tracking-[-.03em]">
        Your shopping bag.
      </h1>
      <div className="mt-10">
        <CartContents products={products} />
      </div>
    </section>
  );
}
