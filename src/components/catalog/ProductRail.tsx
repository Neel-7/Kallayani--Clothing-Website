import { Heart, Plus } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import type { Product } from "@/types/catalog";
import { addToBag, toggleWishlist, type RootState } from "@/store/store";

const dollars = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

function ProductCard({ item }: { item: Product }) {
  const dispatch = useDispatch();
  const wished = useSelector((state: RootState) => state.shop.wishlist.includes(item.id));
  return (
    <article className="product-card">
      <div className="product-card__media">
        <img src={item.image.src} alt={item.image.alt} style={{ objectPosition: item.image.position }} />
        <Button variant="inverse" size="icon" className={`product-card__heart ${wished ? "is-active" : ""}`} aria-label={wished ? `Remove ${item.name} from wishlist` : `Add ${item.name} to wishlist`} onClick={() => dispatch(toggleWishlist(item.id))}>
          <Heart size={19} fill={wished ? "currentColor" : "none"} />
        </Button>
        <Button className="product-card__add" onClick={() => dispatch(addToBag())}>Add to bag <Plus size={16} /></Button>
      </div>
      <div className="product-card__details">
        <div><h3>{item.name}</h3><span>{dollars.format(item.price)}</span></div>
        <p>{item.craft} · {item.region}</p>
      </div>
    </article>
  );
}

export function ProductRail({ title, eyebrow, products }: { title: string; eyebrow?: string; products: Product[] }) {
  return (
    <section className="product-section" id="products" aria-labelledby={`rail-${title.replace(/\s/g, "-").toLowerCase()}`}>
      <Carousel className="product-carousel" opts={{ align: "start", containScroll: "trimSnaps" }}>
        <div className="product-section__head shell">
          <div>{eyebrow && <p className="section-kicker">{eyebrow}</p>}<h2 id={`rail-${title.replace(/\s/g, "-").toLowerCase()}`}>{title}</h2></div>
          <div className="product-carousel__controls"><CarouselPrevious /><CarouselNext /></div>
        </div>
        <CarouselContent className="product-rail">
          {products.map((item) => <CarouselItem className="product-rail__item" key={item.id}><ProductCard item={item} /></CarouselItem>)}
        </CarouselContent>
      </Carousel>
    </section>
  );
}
