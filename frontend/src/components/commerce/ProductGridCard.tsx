import { Heart, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { addToBag, toggleWishlist, type RootState } from "@/store/store";
import type { CatalogProduct } from "./catalog-utils";
import { availableQuantity, dollars } from "./catalog-utils";

export function ProductGridCard({ product }: { product: CatalogProduct }) {
  const dispatch = useDispatch();
  const wished = useSelector((state: RootState) => state.shop.wishlist.includes(product.id));
  const variantId = product.variants?.[0]?.id ?? `${product.id}-default`;
  const available = availableQuantity(product, variantId);

  return (
    <article className="group min-w-0">
      <div className="relative aspect-[3/4] overflow-hidden bg-soft">
        <Link
          className="block h-full focus-visible:outline-offset-[-3px]"
          to={`/product/${product.id}`}
          aria-label={`View ${product.name}`}
        >
          <img
            className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.025]"
            loading="lazy"
            src={product.image.src}
            alt={product.image.alt}
            style={{ objectPosition: product.image.position }}
          />
        </Link>
        <Button
          variant="ghost"
          size="icon"
          className={`absolute right-2 top-2 !h-10 !min-h-10 !w-10 !rounded-full !border !border-white/50 bg-white/75 p-0 backdrop-blur-sm ${
            wished ? "!text-wine" : "text-ink"
          }`}
          aria-pressed={wished}
          aria-label={wished ? `Remove ${product.name} from wishlist` : `Save ${product.name}`}
          onClick={() => dispatch(toggleWishlist(product.id))}
        >
          <Heart size={18} fill={wished ? "currentColor" : "none"} />
        </Button>
        <Button
          className="absolute inset-x-0 bottom-0 w-full justify-between translate-y-full group-hover:translate-y-0 group-focus-within:translate-y-0 tablet:translate-y-0"
          disabled={available === 0}
          onClick={() => dispatch(addToBag({ productId: product.id, variantId }))}
        >
          {available === 0 ? "Out of stock" : "Add to bag"}
          {available > 0 && <Plus size={16} />}
        </Button>
      </div>
      <div className="pt-3">
        <p className="text-[11px] uppercase tracking-[.08em] text-muted">
          {product.collectionName}
        </p>
        <div className="mt-1 flex items-start justify-between gap-3 phone:block">
          <h2 className="min-w-0 text-[16px] font-medium leading-snug">
            <Link className="transition-colors hover:text-wine" to={`/product/${product.id}`}>
              {product.name}
            </Link>
          </h2>
          <span className="shrink-0 text-sm font-medium tabular-nums phone:mt-1 phone:block">
            {dollars.format(product.price)}
          </span>
        </div>
        <p className="mt-1 text-[12px] leading-5 text-muted">{product.craft}</p>
      </div>
    </article>
  );
}

export function ProductGrid({ products }: { products: CatalogProduct[] }) {
  return (
    <div className="grid grid-cols-4 gap-x-4 gap-y-11 tablet:grid-cols-3 phone:grid-cols-2 phone:gap-x-3 phone:gap-y-8">
      {products.map((product) => (
        <ProductGridCard key={product.id} product={product} />
      ))}
    </div>
  );
}
