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
    if (
      !api ||
      paused ||
      stopped ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;
    const timer = window.setInterval(() => api.scrollNext(), AUTOPLAY_MS);
    return () => window.clearInterval(timer);
  }, [api, paused, stopped]);

  return (
    <Carousel
      className="hero-carousel"
      opts={{ loop: true }}
      setApi={setApi}
      aria-label="Kallayani campaign stories"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget))
          setPaused(false);
      }}
    >
      <CarouselContent className="hero-carousel__content">
        {heroSlides.map((slide, index) => (
          <CarouselItem
            key={slide.id}
            className="hero-slide"
            inert={index !== active}
            aria-hidden={index !== active}
            aria-label={`${index + 1} of ${heroSlides.length}`}
          >
            <img
              className="hero-slide__image"
              fetchPriority={index === 0 ? "high" : "auto"}
              src={slide.image.src}
              alt={slide.image.alt}
              style={{ objectPosition: slide.image.position }}
            />
            <div className="hero-slide__shade" />
            <div className="hero-slide__copy">
              {index === 0 ? <h1>{slide.title}</h1> : <h2>{slide.title}</h2>}
              <p>{slide.description}</p>
              <Button asChild>
                <Link to={slide.href}>{slide.cta}</Link>
              </Button>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="hero-carousel__previous" />
      <CarouselNext className="hero-carousel__next" />
      <div className="hero-carousel__pagination">
        {heroSlides.map((slide, index) => (
          <button
            key={slide.id}
            aria-label={`Show campaign ${index + 1}: ${slide.title}`}
            aria-current={index === active ? "true" : undefined}
            onClick={() => api?.scrollTo(index)}
          >
            <span />
          </button>
        ))}
        <button
          className="hero-carousel__pause"
          onClick={() => setStopped(!stopped)}
          aria-label={stopped ? "Play campaigns" : "Pause campaigns"}
        >
          {stopped ? <Play size={14} /> : <Pause size={14} />}
        </button>
      </div>
    </Carousel>
  );
}
