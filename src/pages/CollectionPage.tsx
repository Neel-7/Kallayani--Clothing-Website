import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { CollectionBanner } from "@/components/catalog/CollectionBanner";
import { ProductRail } from "@/components/catalog/ProductRail";
import { SubcategoryShelf } from "@/components/catalog/SubcategoryShelf";
import { Newsletter } from "@/components/layout/Footer";
import { collectionBySlug } from "@/data/catalog";
import { NotFoundPage } from "./NotFoundPage";

export function CollectionPage() {
  const { slug = "" } = useParams();
  const collection = collectionBySlug[slug];

  useEffect(() => {
    document.title = collection ? `${collection.name} — Kallayani` : "Not found — Kallayani";
  }, [collection]);

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
