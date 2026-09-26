import { AlertTriangle, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import {
  removeCartLine,
  setCartQuantity,
  type RootState,
} from "@/store/store";
import type { CatalogProduct } from "./catalog-utils";
import {
  availableQuantity,
  dollars,
  getCartProducts,
  linePrice,
  variantLabel,
} from "./catalog-utils";

export function CartContents({
  products,
  compact = false,
  onNavigate,
}: {
  products: CatalogProduct[];
  compact?: boolean;
  onNavigate?: () => void;
}) {
  const dispatch = useDispatch();
  const shop = useSelector((state: RootState) => state.shop);
  const entries = getCartProducts(shop, products);
  const subtotal = entries.reduce(
    (total, { line, product }) =>
      total + (product ? linePrice(product, line.variantId) * line.quantity : 0),
    0,
  );
  const shipping = subtotal >= 150 || subtotal === 0 ? 0 : 12;
  const hasStockError = entries.some(({ line, product }) => {
    if (!product) return true;
    return line.quantity > availableQuantity(product, line.variantId);
  });

  if (entries.length === 0) {
    return (
      <div className="flex min-h-[360px] flex-col items-center justify-center text-center">
        <ShoppingBag className="text-wine" size={30} strokeWidth={1.4} />
        <h2 className="mt-5 font-editorial text-4xl font-medium">Your bag is empty.</h2>
        <p className="mt-3 max-w-[34ch] text-sm leading-6 text-muted">
          Explore the collection and add something made to stay with you.
        </p>
        <Button className="mt-7" asChild onClick={onNavigate}>
          <Link to="/shop">Browse all pieces</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className={compact ? "flex flex-col" : "grid grid-cols-[minmax(0,1fr)_360px] gap-16 tablet:grid-cols-1 tablet:gap-10"}>
      <div>
        {entries.map(({ line, product }) => {
          const available = product ? availableQuantity(product, line.variantId) : 0;
          const stockError = !product || line.quantity > available;
          return (
            <article
              className={`grid gap-4 border-b border-line py-5 first:pt-0 ${
                compact ? "grid-cols-[88px_1fr]" : "grid-cols-[120px_1fr_auto] phone:grid-cols-[88px_1fr]"
              }`}
              key={line.variantId}
            >
              {product ? (
                <Link to={`/product/${product.id}`} onClick={onNavigate}>
                  <img
                    className="aspect-[3/4] h-full w-full bg-soft object-cover"
                    src={product.image.src}
                    alt={product.image.alt}
                    style={{ objectPosition: product.image.position }}
                  />
                </Link>
              ) : (
                <div className="aspect-[3/4] bg-soft" aria-hidden="true" />
              )}
              <div className="min-w-0">
                <h3 className="text-[15px] font-medium leading-5">
                  {product ? (
                    <Link className="hover:text-wine" to={`/product/${product.id}`} onClick={onNavigate}>
                      {product.name}
                    </Link>
                  ) : (
                    "Unavailable product"
                  )}
                </h3>
                {product && (
                  <>
                    <p className="mt-1 text-xs text-muted">
                      {variantLabel(product, line.variantId)}
                    </p>
                    <p className="mt-2 text-sm font-medium tabular-nums">
                      {dollars.format(linePrice(product, line.variantId))}
                    </p>
                  </>
                )}
                <div className="mt-3 inline-flex min-h-10 items-center border border-line">
                  <button
                    className="grid size-10 place-items-center disabled:opacity-30"
                    type="button"
                    aria-label={`Decrease ${product?.name ?? "item"} quantity`}
                    disabled={line.quantity <= 1}
                    onClick={() =>
                      dispatch(
                        setCartQuantity({
                          variantId: line.variantId,
                          quantity: line.quantity - 1,
                        }),
                      )
                    }
                  >
                    <Minus size={14} />
                  </button>
                  <span className="min-w-8 text-center text-sm tabular-nums">{line.quantity}</span>
                  <button
                    className="grid size-10 place-items-center disabled:opacity-30"
                    type="button"
                    aria-label={`Increase ${product?.name ?? "item"} quantity`}
                    disabled={!product || line.quantity >= available}
                    onClick={() =>
                      dispatch(
                        setCartQuantity({
                          variantId: line.variantId,
                          quantity: line.quantity + 1,
                        }),
                      )
                    }
                  >
                    <Plus size={14} />
                  </button>
                </div>
                {stockError && (
                  <p className="mt-3 flex items-start gap-2 text-xs leading-5 text-red" role="alert">
                    <AlertTriangle className="mt-0.5 shrink-0" size={14} />
                    {available === 0
                      ? "This piece is no longer available. Remove it to continue."
                      : `Only ${available} ${available === 1 ? "piece is" : "pieces are"} available. Reduce the quantity to continue.`}
                  </p>
                )}
              </div>
              <div className={`${compact ? "col-start-2" : "phone:col-start-2"} flex items-start justify-end`}>
                <button
                  className="inline-flex min-h-10 items-center gap-2 text-xs text-muted underline underline-offset-4 hover:text-wine"
                  type="button"
                  onClick={() => dispatch(removeCartLine(line.variantId))}
                >
                  <Trash2 size={14} /> Remove
                </button>
              </div>
            </article>
          );
        })}
      </div>

      <aside className={`${compact ? "mt-7" : "self-start bg-soft p-7 phone:p-5"}`}>
        <h2 className="font-editorial text-3xl font-medium">Order summary</h2>
        <dl className="mt-5 space-y-3 text-sm">
          <div className="flex justify-between gap-4">
            <dt className="text-muted">Subtotal</dt>
            <dd className="font-medium tabular-nums">{dollars.format(subtotal)}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-muted">Delivery</dt>
            <dd className="font-medium">{shipping === 0 ? "Complimentary" : dollars.format(shipping)}</dd>
          </div>
          <div className="flex justify-between gap-4 border-t border-line pt-4 text-base">
            <dt>Total</dt>
            <dd className="font-medium tabular-nums">{dollars.format(subtotal + shipping)}</dd>
          </div>
        </dl>
        {subtotal < 150 && (
          <p className="mt-4 text-xs leading-5 text-muted">
            Add {dollars.format(150 - subtotal)} more for complimentary US delivery.
          </p>
        )}
        {compact ? (
          <Button className="mt-6 w-full" asChild onClick={onNavigate}>
            <Link to="/cart">Review bag</Link>
          </Button>
        ) : (
          hasStockError ? (
            <Button className="mt-6 w-full" type="button" disabled>
              Resolve stock issue
            </Button>
          ) : (
            <Button className="mt-6 w-full" asChild>
              <Link to="/checkout/shipping">Continue to checkout</Link>
            </Button>
          )
        )}
        <p className="mt-3 text-center text-[11px] leading-5 text-muted">
          Taxes are calculated at checkout.
        </p>
      </aside>
    </div>
  );
}
