import { ProductRail } from "@/components/catalog/ProductRail";
import { Newsletter } from "@/components/layout/Footer";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { EditorialImages } from "@/components/home/EditorialImages";
import { HeroCarousel } from "@/components/home/HeroCarousel";
import { BrandSignature } from "@/components/home/BrandSignature";
import { useGetHomePageQuery } from "@/store/storefront-api";

export function HomePage() {
  const { data, error, isLoading, refetch } = useGetHomePageQuery();

  if (isLoading) {
    return <div className="min-h-[calc(100svh-94px)] animate-pulse bg-soft" aria-label="Loading Kallayani" />;
  }

  if (error || !data) {
    return (
      <section className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center px-gutter text-center">
        <h1 className="font-editorial text-5xl font-medium">The collection is resting.</h1>
        <p className="mt-4 text-sm leading-6 text-muted">
          We could not reach the Kallayani catalogue. Please try again in a moment.
        </p>
        <button className="mt-6 min-h-11 bg-ink px-6 text-sm text-white" onClick={refetch} type="button">
          Try again
        </button>
      </section>
    );
  }

  return (
    <>
      <HeroCarousel slides={data.heroSlides} />
      <CategoryGrid categories={data.categories} />
      <ProductRail
        title="New & noteworthy"
        viewAllHref="/women#products"
        products={data.featuredProducts}
        showTopBorder={false}
      />
      <EditorialImages features={data.editorialFeatures} />
      <BrandSignature />
      <Newsletter showTopBorder={false} />
    </>
  );
}
