import { useEffect, useRef, useState } from "react";
import { AlertTriangle, Check, Heart, Minus, Plus, Ruler, Truck } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { addToBag, toggleWishlist, type RootState } from "@/store/store";
import type { Collection, Product } from "@/types/catalog";
import { ProductDisclosure } from "./ProductDisclosure";
import { dollars, productCopy, sizesByCollection } from "./product-config";

export function ProductPurchasePanel({
  product,
  collection,
}: {
  product: Product;
  collection: Collection;
}) {
  const dispatch = useDispatch();
  const wished = useSelector((state: RootState) => state.shop.wishlist.includes(product.id));
  const sizes = product.sizes ?? sizesByCollection[collection.slug] ?? [];
  const isHomeDecor = collection.slug === "home";
  const [selectedSize, setSelectedSize] = useState(sizes[0] ?? "");
  const [quantity, setQuantity] = useState(1);
  const [openSection, setOpenSection] = useState("Details");
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [added, setAdded] = useState(false);
  const resetTimer = useRef<number | null>(null);
  const selectedVariant = product.variants?.find((variant) => variant.size === selectedSize);
  const available = product.inStock === false
    ? 0
    : product.variants?.length
      ? selectedVariant?.inStock
        ? selectedVariant.availableQuantity
        : 0
      : 6;
  const stockError = available === 0
    ? "This size is currently out of stock. Choose another size to continue."
    : quantity > available
      ? `Only ${available} ${available === 1 ? "piece is" : "pieces are"} available in this size.`
      : "";

  useEffect(
    () => () => {
      if (resetTimer.current) window.clearTimeout(resetTimer.current);
    },
    [],
  );

  const handleAdd = () => {
    if (stockError) return;
    dispatch(
      addToBag({
        productId: product.id,
        variantId: selectedVariant?.id ?? `${product.id}-${selectedSize || "default"}`,
        quantity,
      }),
    );
    setAdded(true);
    resetTimer.current = window.setTimeout(() => setAdded(false), 1800);
  };

  return (
    <aside className="w-full max-w-[470px] justify-self-start tablet:justify-self-center">
      <div className="flex items-center justify-between gap-5 border-b border-line pb-3">
        <p className="text-[11px] font-semibold uppercase tracking-[.15em] text-wine">
          {collection.name} · {product.region}
        </p>
        <Button
          className={`!h-10 !min-h-10 !w-10 !rounded-full p-0 ${wished ? "!border-wine !text-wine" : ""}`}
          variant="outline"
          aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
          aria-pressed={wished}
          onClick={() => dispatch(toggleWishlist(product.id))}
        >
          <Heart size={17} fill={wished ? "currentColor" : "none"} />
        </Button>
      </div>

      <h1 className="mt-5 max-w-[12ch] text-balance font-editorial text-[clamp(40px,4vw,56px)] font-medium leading-[.95] tracking-[-.035em]">
        {product.name}
      </h1>
      <p className="mt-3 text-[17px] font-medium tabular-nums">{dollars.format(product.price)}</p>
      <p className="mt-4 max-w-[55ch] text-[14px] leading-6 text-muted">
        {productCopy[collection.slug]}
      </p>

      <div className="mt-5 border-t border-line pt-4">
        <div className="mb-2.5 flex min-h-8 items-center justify-between gap-6">
          <span className="text-[13px] font-semibold">Select size</span>
          <button
            className="inline-flex items-center gap-2 text-[12px] text-muted underline underline-offset-4 transition-colors hover:text-wine"
            type="button"
            aria-expanded={showSizeGuide}
            onClick={() => setShowSizeGuide((value) => !value)}
          >
            <Ruler size={14} /> Size guide
          </button>
        </div>
        <div
          className="grid grid-cols-5 gap-2 phone:grid-cols-4"
          role="group"
          aria-label="Available sizes"
        >
          {sizes.map((size) => {
            const variant = product.variants?.find((entry) => entry.size === size);
            const unavailable =
              product.inStock === false ||
              Boolean(
                product.variants?.length &&
                  (!variant?.inStock || variant.availableQuantity === 0),
              );
            return (
              <button
                className={`min-h-11 border px-1 text-[12px] font-medium transition-[background-color,border-color,color,transform] duration-200 active:scale-[.98] ${
                  selectedSize === size
                    ? "border-wine bg-wine text-white"
                    : "border-line bg-white text-ink hover:border-ink disabled:cursor-not-allowed disabled:opacity-35"
                }`}
                key={size}
                type="button"
                aria-pressed={selectedSize === size}
                disabled={unavailable}
                onClick={() => {
                  setSelectedSize(size);
                  setQuantity(1);
                }}
              >
                {size}
              </button>
            );
          })}
        </div>
        <div
          className={`grid transition-[grid-template-rows,opacity] duration-300 ${
            showSizeGuide ? "grid-rows-[1fr] pt-3 opacity-100" : "grid-rows-[0fr] opacity-0"
          }`}
        >
          <p className="overflow-hidden text-[12px] leading-5 text-muted">
            {sizes.length === 1 && sizes[0] === "One size"
              ? "This piece is offered in one standard size. Detailed garment measurements are available with your order confirmation."
              : isHomeDecor
              ? "Choose the size that matches your mattress. Kantha dimensions are listed by their closest bed size."
              : "Choose your usual size for a relaxed fit. Size up if you prefer more ease."}
          </p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-[104px_1fr] gap-3">
        <div
          className="flex min-h-[52px] items-center justify-between border border-line px-2"
          aria-label="Quantity"
        >
          <button
            className="grid size-9 place-items-center transition-transform active:scale-90 disabled:opacity-30"
            type="button"
            aria-label="Decrease quantity"
            disabled={quantity === 1}
            onClick={() => setQuantity((value) => Math.max(1, value - 1))}
          >
            <Minus size={14} />
          </button>
          <span className="text-[13px] tabular-nums">{quantity}</span>
          <button
            className="grid size-9 place-items-center transition-transform active:scale-90"
            type="button"
            aria-label="Increase quantity"
            disabled={available === 0 || quantity >= available}
            onClick={() => setQuantity((value) => Math.min(available, value + 1))}
          >
            <Plus size={14} />
          </button>
        </div>
        <Button className="min-h-[52px] active:scale-[.99]" type="button" onClick={handleAdd} disabled={Boolean(stockError)}>
          {added ? <Check size={16} /> : <Plus size={16} />}
          {added ? "Added to bag" : "Add to bag"}
        </Button>
      </div>
      {stockError && (
        <p className="mt-3 flex items-start gap-2 text-xs leading-5 text-red" role="alert">
          <AlertTriangle className="mt-0.5 shrink-0" size={14} /> {stockError}
        </p>
      )}

      <div className="mt-4 flex items-center gap-2.5 border-y border-line py-3 text-[12px] text-muted">
        <Truck size={16} /> Free US delivery over $150, with 14-day returns
      </div>

      <div>
        <ProductDisclosure
          title="Details & provenance"
          open={openSection === "Details"}
          onToggle={() => setOpenSection(openSection === "Details" ? "" : "Details")}
        >
          {product.craft}, made in {product.region}. Natural variations in weave and finish make
          every piece individual.
        </ProductDisclosure>
        <ProductDisclosure
          title="Care"
          open={openSection === "Care"}
          onToggle={() => setOpenSection(openSection === "Care" ? "" : "Care")}
        >
          {isHomeDecor
            ? "Air regularly and keep away from prolonged direct light. Use a gentle cold wash and dry flat; specialist cleaning is recommended for hand-quilted pieces."
            : "Air between wears and store away from direct light. Gentle specialist cleaning is recommended."}
        </ProductDisclosure>
        <ProductDisclosure
          title="Delivery & returns"
          open={openSection === "Delivery"}
          onToggle={() => setOpenSection(openSection === "Delivery" ? "" : "Delivery")}
        >
          Dispatches in 2-3 working days. Return unused pieces within 14 days in their original
          condition and packaging.
        </ProductDisclosure>
      </div>
    </aside>
  );
}
