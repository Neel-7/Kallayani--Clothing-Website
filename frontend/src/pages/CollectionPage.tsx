import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { CollectionBanner } from "@/components/catalog/CollectionBanner";
import { ProductRail } from "@/components/catalog/ProductRail";
import { SubcategoryShelf } from "@/components/catalog/SubcategoryShelf";
import { Newsletter } from "@/components/layout/Footer";
import { useGetCollectionQuery } from "@/store/storefront-api";
import { NotFoundPage } from "./NotFoundPage";

export function CollectionPage() {
  const { slug = "" } = useParams();
  const { data: collection, error, isLoading, refetch } = useGetCollectionQuery(slug);

  useEffect(() => {
    document.title = collection ? `${collection.name} — Kallayani` : "Not found — Kallayani";
  }, [collection]);

  if (isLoading) return <div className="min-h-[70vh] animate-pulse bg-soft" aria-label="Loading collection" />;
  if (error) {
    return (
      <section className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center px-gutter text-center">
        <h1 className="font-editorial text-5xl font-medium">This collection could not be loaded.</h1>
        <button className="mt-6 min-h-11 bg-ink px-6 text-sm text-white" onClick={refetch} type="button">Try again</button>
      </section>
    );
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
