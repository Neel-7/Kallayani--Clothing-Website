import { useEffect, useRef } from "react";
import { onAuthStateChanged, signInAnonymously } from "firebase/auth";
import { useDispatch, useSelector } from "react-redux";
import { auth } from "@/lib/firebase";
import { customerApi } from "@/store/customer-api";
import { store, hydrateShop, type RootState } from "@/store/store";
import {
  authAnonymous,
  authAuthenticated,
  authFailed,
} from "@/store/customer-auth";
import { mapFirebaseUser } from "@/data/firebase-auth-repository";
import { mergeCommerceStates } from "@/store/commerce-merge";

export function FirebaseShopSync() {
  const dispatch = useDispatch();
  const shop = useSelector((state: RootState) => state.shop);
  const shopRef = useRef(shop);
  const hydratedUser = useRef<string | null>(null);
  const previousIdentity = useRef<{ uid: string; isAnonymous: boolean } | null>(null);

  useEffect(() => {
    shopRef.current = shop;
  }, [shop]);

  useEffect(
    () =>
      onAuthStateChanged(auth, async (user) => {
        if (!user) {
          if (previousIdentity.current && !previousIdentity.current.isAnonymous) {
            dispatch(customerApi.util.resetApiState());
          }
          previousIdentity.current = null;
          dispatch(authAnonymous());
          try {
            await signInAnonymously(auth);
          } catch (error) {
            dispatch(authFailed("Anonymous shopping is temporarily unavailable."));
            console.error("Firebase anonymous authentication is not enabled.", error);
          }
          return;
        }
        const previous = previousIdentity.current;
        if (previous && previous.uid !== user.uid && !previous.isAnonymous) {
          dispatch(customerApi.util.resetApiState());
        }
        previousIdentity.current = { uid: user.uid, isAnonymous: user.isAnonymous };
        if (user.isAnonymous) dispatch(authAnonymous());
        else dispatch(authAuthenticated(mapFirebaseUser(user)));
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
          const isAnonymousLoginMerge = Boolean(
            previous?.isAnonymous && !user.isAnonymous && previous.uid !== user.uid,
          );
          dispatch(
            hydrateShop(
              mergeCommerceStates(shopRef.current, remote, isAnonymousLoginMerge),
            ),
          );
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
