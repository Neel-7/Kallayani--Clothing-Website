import { Heart, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import type { Product } from "@/types/catalog";
import { addToBag, toggleWishlist, type RootState } from "@/store/store";

const dollars = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

function ProductCard({ item }: { item: Product }) {
  const dispatch = useDispatch();
  const wished = useSelector((state: RootState) => state.shop.wishlist.includes(item.id));
  return (
    <article className="group">
      <div className="relative aspect-[3/4] overflow-hidden bg-[#f0f1f2] tablet:aspect-auto">
        <img
          className="h-full w-full object-cover transition-transform duration-[450ms] group-hover:scale-[1.02] tablet:aspect-[3/4] tablet:h-auto"
          loading="lazy"
          src={item.image.src}
          alt={item.image.alt}
          style={{ objectPosition: item.image.position }}
        />
        <Button
          variant="ghost"
          size="icon"
          className={`absolute right-2 top-2 !h-9 !min-h-9 !w-9 !rounded-full !border !border-white/25 bg-white/30 backdrop-blur-md p-0 transition-all duration-300 ease-out hover:scale-105 hover:!bg-white/60 hover:!border-white/50 active:scale-95 phone:right-1 phone:top-1 [@media(hover:none)]:!min-h-11 [@media(hover:none)]:!w-11 [&_svg]:transition-transform [&_svg]:duration-300 hover:[&_svg]:scale-110 ${
            wished ? "!text-wine" : "text-ink/80 hover:!text-wine"
          }`}
          aria-pressed={wished}
          aria-label={wished ? `Remove ${item.name} from wishlist` : `Add ${item.name} to wishlist`}
          onClick={() => dispatch(toggleWishlist(item.id))}
        >
          <Heart size={18} fill={wished ? "currentColor" : "none"} />
        </Button>
        <Button
          className="absolute inset-x-0 bottom-0 w-full justify-between translate-y-full transition-[transform,background] duration-200 group-hover:translate-y-0 group-focus-within:translate-y-0 tablet:static tablet:translate-y-0 phone:min-h-11 phone:px-2.5 phone:text-[11px] phone:[&_svg]:w-[14px] [@media(hover:none)]:translate-y-0"
          onClick={() => dispatch(addToBag())}
        >
          Add to bag <Plus size={16} />
        </Button>
      </div>
      <div className="pt-3">
        <div className="flex items-baseline justify-between gap-3 tablet:block">
          <h3 className="font-display text-[17px] font-medium leading-[1.35] phone:text-[15px]">
            {item.name}
          </h3>
          <span className="whitespace-nowrap text-[15px] font-medium tablet:mt-[5px] tablet:block phone:text-[14px]">
            {dollars.format(item.price)}
          </span>
        </div>
        <p className="mt-[5px] text-[13px] leading-[1.4] text-muted phone:text-[12px]">
          {item.craft} · {item.region}
        </p>
      </div>
    </article>
  );
}

export function ProductRail({
  title,
  eyebrow,
  products,
  viewAllHref,
  showTopBorder = true,
}: {
  title: string;
  eyebrow?: string;
  products: Product[];
  viewAllHref?: string;
  showTopBorder?: boolean;
}) {
  return (
    <section
      className={`pb-10 pt-7 phone:pb-7 phone:pt-[22px] ${showTopBorder ? "border-t border-line" : ""}`}
      id="products"
      aria-labelledby={`rail-${title.replace(/\s/g, "-").toLowerCase()}`}
    >
      <Carousel
        className="mx-gutter"
        opts={{ align: "start", containScroll: "trimSnaps", slidesToScroll: "auto" }}
        aria-label={title}
      >
        <div className="relative mb-[22px] flex min-h-11 items-center justify-center text-center phone:mb-4 phone:justify-between phone:gap-3 phone:text-left">
          <div>
            {eyebrow && (
              <p className="mb-2.5 text-xs font-semibold uppercase tracking-[.12em] text-wine">
                {eyebrow}
              </p>
            )}
            <h2
              className="font-display text-[clamp(24px,2.15vw,34px)] font-semibold uppercase leading-[1.2] tracking-[-.015em] phone:text-[22px]"
              id={`rail-${title.replace(/\s/g, "-").toLowerCase()}`}
            >
              {title}
            </h2>
          </div>
          {viewAllHref && (
            <Link
              className="absolute right-0 inline-flex min-h-11 items-center text-sm underline underline-offset-[5px] hover:text-red phone:static phone:shrink-0 phone:text-[13px]"
              to={viewAllHref}
            >
              View all
            </Link>
          )}
        </div>
        <div className="relative group/carousel-controls">
          <CarouselContent className="gap-4 phone:gap-3">
            {products.map((item) => (
              <CarouselItem
                className="flex-[0_0_calc((100%-48px)/4)] tablet:flex-[0_0_calc((100%-32px)/3)] phone:flex-[0_0_calc((100%-12px)/2)]"
                key={item.id}
              >
                <ProductCard item={item} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="absolute -left-10 top-[40%] -translate-y-1/2 z-10 !h-12 !w-12 !min-h-12 !border-0 !bg-transparent p-0 transition-all duration-300 ease-out !opacity-100 disabled:!opacity-0 disabled:pointer-events-none text-ink/25 group-hover/carousel-controls:text-ink/55 hover:!text-wine hover:scale-110 active:scale-95 [&_svg]:!size-10 tablet:hidden" />
          <CarouselNext className="absolute -right-10 top-[40%] -translate-y-1/2 z-10 !h-12 !w-12 !min-h-12 !border-0 !bg-transparent p-0 transition-all duration-300 ease-out !opacity-100 disabled:!opacity-0 disabled:pointer-events-none text-ink/25 group-hover/carousel-controls:text-ink/55 hover:!text-wine hover:scale-110 active:scale-95 [&_svg]:!size-10 tablet:hidden" />
        </div>
      </Carousel>
    </section>
  );
}
