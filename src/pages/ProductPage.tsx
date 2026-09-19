import { useEffect, useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { ProductRail } from "@/components/catalog/ProductRail";
import { Newsletter } from "@/components/layout/Footer";
import { ProductMediaCarousel } from "@/components/product/ProductMediaCarousel";
import { ProductPurchasePanel } from "@/components/product/ProductPurchasePanel";
import { productById, productCollectionById } from "@/data/catalog";
import { NotFoundPage } from "./NotFoundPage";

export function ProductPage() {
  const { productId = "" } = useParams();
  const product = productById[productId];
  const collection = productCollectionById[productId];
  const similarProducts = useMemo(
    () => collection?.products.filter((entry) => entry.id !== productId) ?? [],
    [collection, productId],
  );

  useEffect(() => {
    if (product) document.title = `${product.name} — Kallayani`;
  }, [product]);

  if (!product || !collection) return <NotFoundPage />;

  return (
    <div className="w-full max-w-full overflow-x-hidden">
      <nav
        className="mx-auto flex min-h-11 w-full max-w-[1200px] items-center gap-2 overflow-hidden px-gutter text-[12px] text-muted"
        aria-label="Breadcrumb"
      >
        <Link className="shrink-0 transition-colors hover:text-wine" to="/">
          Home
        </Link>
        <span aria-hidden="true">/</span>
        <span className="shrink-0">{collection.name}</span>
        <span aria-hidden="true">/</span>
        <span className="truncate text-ink" aria-current="page">
          {product.name}
        </span>
      </nav>

      <section className="mx-auto grid w-full max-w-[1200px] grid-cols-2 items-start gap-[clamp(44px,6vw,88px)] px-gutter pb-16 pt-1 tablet:max-w-[600px] tablet:grid-cols-1 tablet:gap-9 tablet:pb-14 phone:gap-7">
        <ProductMediaCarousel product={product} />
        <ProductPurchasePanel key={product.id} product={product} collection={collection} />
      </section>

      <ProductRail title="Similar products" products={similarProducts} />
      <Newsletter />
    </div>
  );
}
