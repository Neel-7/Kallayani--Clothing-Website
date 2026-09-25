import { configureStore, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { storefrontApi } from "./storefront-api";

type ShopState = {
  wishlist: string[];
  bagCount: number;
  cartLines: Array<{
    productId: string;
    variantId: string;
    quantity: number;
  }>;
};

function localShopState(): ShopState {
  if (typeof window === "undefined") return { wishlist: [], bagCount: 0, cartLines: [] };
  try {
    const stored = JSON.parse(window.localStorage.getItem("kallayani-shop") ?? "null") as
      | Partial<ShopState>
      | null;
    return {
      wishlist: stored?.wishlist ?? [],
      bagCount: stored?.bagCount ?? 0,
      cartLines: stored?.cartLines ?? [],
    };
  } catch {
    return { wishlist: [], bagCount: 0, cartLines: [] };
  }
}

const initialState: ShopState = localShopState();

const shopSlice = createSlice({
  name: "shop",
  initialState,
  reducers: {
    toggleWishlist(state, action: PayloadAction<string>) {
      const index = state.wishlist.indexOf(action.payload);
      if (index >= 0) {
        state.wishlist.splice(index, 1);
      } else {
        state.wishlist.push(action.payload);
      }
    },
    addToBag(
      state,
      action: PayloadAction<{ productId: string; variantId: string; quantity?: number }>,
    ) {
      const quantity = action.payload.quantity ?? 1;
      const line = state.cartLines.find(
        (entry) => entry.variantId === action.payload.variantId,
      );
      if (line) line.quantity += quantity;
      else state.cartLines.push({ ...action.payload, quantity });
      state.bagCount += quantity;
    },
    hydrateShop(state, action: PayloadAction<ShopState>) {
      state.wishlist = action.payload.wishlist;
      state.cartLines = action.payload.cartLines;
      state.bagCount = action.payload.cartLines.reduce(
        (total, entry) => total + entry.quantity,
        0,
      );
    },
  },
});

export const { toggleWishlist, addToBag, hydrateShop } = shopSlice.actions;

export const store = configureStore({
  reducer: {
    shop: shopSlice.reducer,
    [storefrontApi.reducerPath]: storefrontApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(storefrontApi.middleware),
});

store.subscribe(() => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem("kallayani-shop", JSON.stringify(store.getState().shop));
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type { ShopState };
