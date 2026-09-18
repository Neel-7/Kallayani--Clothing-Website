import { ProductRail } from "@/components/catalog/ProductRail";
import { Newsletter } from "@/components/layout/Footer";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { EditorialImages } from "@/components/home/EditorialImages";
import { HeroCarousel } from "@/components/home/HeroCarousel";
import { BrandSignature } from "@/components/home/BrandSignature";
import { featuredProducts } from "@/data/catalog";

export function HomePage() {
  return (
    <>
      <HeroCarousel />
      <CategoryGrid />
      <ProductRail
        title="New & noteworthy"
        viewAllHref="/women#products"
        products={featuredProducts}
        showTopBorder={false}
      />
      <EditorialImages />
      <BrandSignature />
      <Newsletter showTopBorder={false} />
    </>
  );
}
