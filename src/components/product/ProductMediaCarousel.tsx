import { useCallback, useEffect, useState } from "react";
import type { CarouselApi } from "@/components/ui/carousel";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import type { Product } from "@/types/catalog";

const views = [
  { label: "Full view", position: "50% 50%", scale: "scale-100" },
  { label: "Textile detail", position: "50% 34%", scale: "scale-[1.42]" },
  { label: "Drape detail", position: "50% 68%", scale: "scale-[1.28]" },
];

export function ProductMediaCarousel({ product }: { product: Product }) {
  const [api, setApi] = useState<CarouselApi>();
  const [active, setActive] = useState(0);

  const updateActive = useCallback((carouselApi: NonNullable<CarouselApi>) => {
    setActive(carouselApi.selectedScrollSnap());
  }, []);

  useEffect(() => {
    if (!api) return;
    updateActive(api);
    api.on("select", updateActive);
    return () => {
      api.off("select", updateActive);
    };
  }, [api, updateActive]);

  return (
    <div className="w-full max-w-[470px] justify-self-end tablet:justify-self-center">
      <Carousel
        className="group/media"
        opts={{ align: "start", loop: true }}
        setApi={setApi}
        aria-label={`${product.name} product views`}
      >
        <CarouselContent>
          {views.map((view, index) => (
            <CarouselItem key={view.label}>
              <figure className="aspect-[4/5] overflow-hidden bg-soft">
                <img
                  className={`h-full w-full object-cover transition-transform duration-700 ease-out ${view.scale}`}
                  src={product.image.src}
                  alt={index === 0 ? product.image.alt : `${view.label} of ${product.name}`}
                  style={{ objectPosition: index === 0 ? product.image.position : view.position }}
                  fetchPriority={index === 0 ? "high" : "auto"}
                />
              </figure>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="!absolute !left-3 !top-1/2 !h-10 !min-h-10 !w-10 !-translate-y-1/2 !rounded-full !border-white/60 !bg-white/80 !text-ink opacity-0 shadow-[0_8px_24px_rgba(55,42,34,.12)] backdrop-blur-sm transition-opacity group-hover/media:opacity-100 focus-visible:opacity-100 tablet:opacity-100" />
        <CarouselNext className="!absolute !right-3 !top-1/2 !h-10 !min-h-10 !w-10 !-translate-y-1/2 !rounded-full !border-white/60 !bg-white/80 !text-ink opacity-0 shadow-[0_8px_24px_rgba(55,42,34,.12)] backdrop-blur-sm transition-opacity group-hover/media:opacity-100 focus-visible:opacity-100 tablet:opacity-100" />
      </Carousel>

      <div className="mt-3 flex items-center justify-between text-[11px] text-muted">
        <span>{views[active].label}</span>
        <div
          className="flex items-center gap-2"
          aria-label={`View ${active + 1} of ${views.length}`}
        >
          {views.map((view, index) => (
            <button
              className={`h-1.5 transition-[width,background-color] duration-300 ${
                index === active ? "w-7 bg-wine" : "w-1.5 bg-line hover:bg-muted"
              }`}
              type="button"
              key={view.label}
              aria-label={`Show ${view.label.toLowerCase()}`}
              aria-current={index === active ? "true" : undefined}
              onClick={() => api?.scrollTo(index)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
