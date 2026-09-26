import type { ShopState } from "./store";

export function mergeCommerceStates(
  local: ShopState,
  remote?: Partial<ShopState>,
  combineQuantities = false,
): ShopState {
  const cartLines = (remote?.cartLines ?? []).map((line) => ({ ...line }));
  for (const localLine of local.cartLines) {
    const matching = cartLines.find((line) => line.variantId === localLine.variantId);
    if (matching) {
      matching.quantity = combineQuantities
        ? Math.min(20, matching.quantity + localLine.quantity)
        : Math.max(matching.quantity, localLine.quantity);
    } else {
      cartLines.push({ ...localLine });
    }
  }
  return {
    wishlist: [...new Set([...(remote?.wishlist ?? []), ...local.wishlist])],
    cartLines,
    bagCount: cartLines.reduce((total, line) => total + line.quantity, 0),
    recentlyViewed: local.recentlyViewed,
  };
}
