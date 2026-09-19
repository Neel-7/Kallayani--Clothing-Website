import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Pause, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { heroSlides } from "@/data/catalog";

const AUTOPLAY_MS = 6000;

export function HeroCarousel() {
  const [api, setApi] = useState<CarouselApi>();
  const [paused, setPaused] = useState(false);
  const [stopped, setStopped] = useState(false);
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (!api) return;
    const onSelect = () => setActive(api.selectedScrollSnap());
    onSelect();
    api.on("select", onSelect);
    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  useEffect(() => {
    if (!api || paused || stopped || window.matchMedia("(prefers-reduced-motion: reduce)").matches)
      return;
    const timer = window.setInterval(() => api.scrollNext(), AUTOPLAY_MS);
    return () => window.clearInterval(timer);
  }, [api, paused, stopped]);

  return (
    <Carousel
      className="h-[min(50vw,calc(100svh-130px))] min-h-[420px] max-h-[1020px] overflow-hidden bg-soft tablet:h-[62vw] tablet:min-h-[460px] tablet:max-h-[620px] phone:h-[min(68svh,580px)] phone:min-h-[450px]"
      opts={{ loop: true }}
      setApi={setApi}
      aria-label="Kallayani campaign stories"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setPaused(false);
      }}
    >
      <CarouselContent className="h-full">
        {heroSlides.map((slide, index) => (
          <CarouselItem
            key={slide.id}
            className="relative h-full"
            inert={index !== active}
            aria-hidden={index !== active}
            aria-label={`${index + 1} of ${heroSlides.length}`}
          >
            <img
              className="h-full w-full object-cover desktop:!object-top"
              fetchPriority={index === 0 ? "high" : "auto"}
              src={slide.image.src}
              alt={slide.image.alt}
              style={{ objectPosition: slide.image.position }}
            />
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(transparent_42%,#17141208_58%,#17141299)] phone:bg-[linear-gradient(transparent_38%,#17141226_52%,#171412b3)]" />
            <div className="absolute bottom-[68px] left-1/2 z-[2] w-[min(88%,1100px)] -translate-x-1/2 text-center text-white phone:bottom-[62px] phone:w-[calc(100%-40px)]">
              {index === 0 ? (
                <h1 className="m-0 font-editorial text-[clamp(52px,5vw,76px)] font-medium leading-[1.02] tracking-[-.025em] [text-wrap:balance] shadow-none [text-shadow:0_2px_12px_#0003] tablet:text-[52px] phone:text-[clamp(36px,10vw,48px)]">
                  {slide.title}
                </h1>
              ) : (
                <h2 className="m-0 font-editorial text-[clamp(52px,5vw,76px)] font-medium leading-[1.02] tracking-[-.025em] [text-wrap:balance] [text-shadow:0_2px_12px_#0003] tablet:text-[52px] phone:text-[clamp(36px,10vw,48px)]">
                  {slide.title}
                </h2>
              )}
              <p className="mx-auto mb-[21px] mt-3 text-base leading-[1.4] [text-wrap:balance] phone:mb-[18px] phone:max-w-[300px] phone:text-sm">
                {slide.description}
              </p>
              <Button
                asChild
                className="min-w-[174px] border-white bg-white text-ink hover:border-wine hover:bg-wine hover:text-white"
              >
                <Link to={slide.href}>{slide.cta}</Link>
              </Button>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="!absolute left-4 desktop:left-6 top-1/2 z-[5] !h-14 !w-14 !min-h-14 !rounded-full !border-0 !bg-transparent !text-white -translate-y-1/2 !opacity-80 transition-all duration-300 ease-out hover:scale-110 hover:!bg-transparent hover:!text-white hover:!opacity-100 active:scale-90 [&_svg]:!size-10 [&_svg]:!stroke-[1.5] phone:left-3 phone:!h-10 phone:!w-10 phone:!min-h-10 phone:top-[38%] [&_svg]:phone:!size-7" />
      <CarouselNext className="!absolute right-4 desktop:right-6 top-1/2 z-[5] !h-14 !w-14 !min-h-14 !rounded-full !border-0 !bg-transparent !text-white -translate-y-1/2 !opacity-80 transition-all duration-300 ease-out hover:scale-110 hover:!bg-transparent hover:!text-white hover:!opacity-100 active:scale-90 [&_svg]:!size-10 [&_svg]:!stroke-[1.5] phone:right-3 phone:!h-10 phone:!w-10 phone:!min-h-10 phone:top-[38%] [&_svg]:phone:!size-7" />
      <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-2">
        {heroSlides.map((slide, index) => (
          <button
            key={slide.id}
            aria-label={`Show campaign ${index + 1}: ${slide.title}`}
            aria-current={index === active ? "true" : undefined}
            onClick={() => api?.scrollTo(index)}
            className="grid h-11 w-10 place-items-center border-0 bg-transparent p-0 text-white cursor-pointer"
          >
            <span
              className={`block h-[2px] w-8 transition-colors duration-200 ${index === active ? "bg-white" : "bg-white/40"}`}
            />
          </button>
        ))}
        <button
          className="ml-1 grid h-11 w-8 place-items-center border-0 bg-transparent p-0 text-white cursor-pointer"
          onClick={() => setStopped(!stopped)}
          aria-label={stopped ? "Play campaigns" : "Pause campaigns"}
        >
          {stopped ? <Play size={14} /> : <Pause size={14} />}
        </button>
      </div>
    </Carousel>
  );
}
