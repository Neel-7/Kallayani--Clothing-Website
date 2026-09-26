import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { CollectionBanner } from "@/components/catalog/CollectionBanner";
import { ProductRail } from "@/components/catalog/ProductRail";
import { SubcategoryShelf } from "@/components/catalog/SubcategoryShelf";
import { Newsletter } from "@/components/layout/Footer";
import { useGetCollectionQuery } from "@/store/storefront-api";
import { NotFoundPage } from "./NotFoundPage";
import { ApiErrorState, CollectionPageSkeleton } from "@/components/commerce/CatalogStates";

export function CollectionPage() {
  const { slug = "" } = useParams();
  const { data: collection, error, isLoading, refetch } = useGetCollectionQuery(slug);

  useEffect(() => {
    document.title = collection ? `${collection.name} | Kallayani` : "Not found | Kallayani";
  }, [collection]);

  if (isLoading) return <CollectionPageSkeleton />;
  if (error) {
    return <ApiErrorState title="This collection could not be loaded." onRetry={refetch} />;
  }
  if (!collection) return <NotFoundPage />;

  return (
    <>
      <CollectionBanner collection={collection} />
      <SubcategoryShelf items={collection.subcategories} />
      <ProductRail key={collection.slug} title="Trending now" products={collection.products} />
      <Newsletter />
    </>
  );
}
