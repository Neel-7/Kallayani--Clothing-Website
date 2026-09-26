import { ProductRail } from "@/components/catalog/ProductRail";
import { Newsletter } from "@/components/layout/Footer";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { EditorialImages } from "@/components/home/EditorialImages";
import { HeroCarousel } from "@/components/home/HeroCarousel";
import { BrandSignature } from "@/components/home/BrandSignature";
import { useGetHomePageQuery } from "@/store/storefront-api";
import { ApiErrorState, HomePageSkeleton } from "@/components/commerce/CatalogStates";

export function HomePage() {
  const { data, error, isLoading, refetch } = useGetHomePageQuery();

  if (isLoading) {
    return <HomePageSkeleton />;
  }

  if (error || !data) {
    return <ApiErrorState title="The collection is resting." message="We could not reach the Kallayani catalogue. Please try again in a moment." onRetry={refetch} />;
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
