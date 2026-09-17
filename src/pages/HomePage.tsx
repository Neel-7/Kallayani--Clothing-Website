import { ProductRail } from "@/components/catalog/ProductRail";
import { Newsletter } from "@/components/layout/Footer";
import { CategoryBento } from "@/components/home/CategoryBento";
import { EditorialImages } from "@/components/home/EditorialImages";
import { HeroCarousel } from "@/components/home/HeroCarousel";
import { BrandSignature } from "@/components/home/BrandSignature";
import { featuredProducts } from "@/data/catalog";

export function HomePage() {
  return (
    <>
      <HeroCarousel />
      <CategoryBento />
      <ProductRail
        title="New & noteworthy"
        viewAllHref="/women#products"
        products={featuredProducts}
      />
      <EditorialImages />
      <BrandSignature />
      <Newsletter />
    </>
  );
}
