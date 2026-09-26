import { useEffect, useRef } from "react";
import { onAuthStateChanged, signInAnonymously } from "firebase/auth";
import { useDispatch, useSelector } from "react-redux";
import { auth } from "@/lib/firebase";
import { customerApi } from "@/store/customer-api";
import { store, hydrateShop, type RootState, type ShopState } from "@/store/store";

function mergeShop(local: ShopState, remote?: Partial<ShopState>): ShopState {
  const cartLines = [...(remote?.cartLines ?? [])];
  for (const localLine of local.cartLines) {
    const matching = cartLines.find((line) => line.variantId === localLine.variantId);
    if (matching) matching.quantity = Math.max(matching.quantity, localLine.quantity);
    else cartLines.push(localLine);
  }
  return {
    wishlist: [...new Set([...(remote?.wishlist ?? []), ...local.wishlist])],
    cartLines,
    bagCount: cartLines.reduce((total, line) => total + line.quantity, 0),
  };
}

export function FirebaseShopSync() {
  const dispatch = useDispatch();
  const shop = useSelector((state: RootState) => state.shop);
  const shopRef = useRef(shop);
  const hydratedUser = useRef<string | null>(null);

  useEffect(() => {
    shopRef.current = shop;
  }, [shop]);

  useEffect(
    () =>
      onAuthStateChanged(auth, async (user) => {
        if (!user) {
          try {
            await signInAnonymously(auth);
          } catch (error) {
            console.error("Firebase anonymous authentication is not enabled.", error);
          }
          return;
        }
        if (hydratedUser.current === user.uid) return;
        hydratedUser.current = user.uid;
        try {
          const remote = await store
            .dispatch(
              customerApi.endpoints.getCommerce.initiate(undefined, {
                subscribe: false,
                forceRefetch: true,
              }),
            )
            .unwrap();
          dispatch(hydrateShop(mergeShop(shopRef.current, remote)));
        } catch (error) {
          console.error("Could not restore the cart and wishlist from the API.", error);
        }
      }),
    [dispatch],
  );

  useEffect(() => {
    const user = auth.currentUser;
    if (!user || hydratedUser.current !== user.uid) return;
    const timeout = window.setTimeout(() => {
      void store
        .dispatch(customerApi.endpoints.saveCommerce.initiate(shop))
        .unwrap()
        .catch((error) => console.error("Could not save the cart and wishlist.", error));
    }, 300);
    return () => window.clearTimeout(timeout);
  }, [shop]);

  return null;
}
