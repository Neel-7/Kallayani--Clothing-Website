import { configureStore, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { storefrontApi } from "./storefront-api";
import { adminApi } from "./admin-api";
import { customerApi } from "./customer-api";
import { customerAuthReducer } from "./customer-auth";

type ShopState = {
  wishlist: string[];
  bagCount: number;
  recentlyViewed: string[];
  cartLines: Array<{
    productId: string;
    variantId: string;
    quantity: number;
  }>;
};

function localShopState(): ShopState {
  if (typeof window === "undefined")
    return { wishlist: [], bagCount: 0, cartLines: [], recentlyViewed: [] };
  try {
    const stored = JSON.parse(window.localStorage.getItem("kallayani-shop") ?? "null") as
      | Partial<ShopState>
      | null;
    return {
      wishlist: stored?.wishlist ?? [],
      bagCount: stored?.bagCount ?? 0,
      cartLines: stored?.cartLines ?? [],
      recentlyViewed: stored?.recentlyViewed ?? [],
    };
  } catch {
    return { wishlist: [], bagCount: 0, cartLines: [], recentlyViewed: [] };
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
    setCartQuantity(
      state,
      action: PayloadAction<{ variantId: string; quantity: number }>,
    ) {
      const line = state.cartLines.find((entry) => entry.variantId === action.payload.variantId);
      if (!line) return;
      line.quantity = Math.max(1, action.payload.quantity);
      state.bagCount = state.cartLines.reduce((total, entry) => total + entry.quantity, 0);
    },
    removeCartLine(state, action: PayloadAction<string>) {
      state.cartLines = state.cartLines.filter((entry) => entry.variantId !== action.payload);
      state.bagCount = state.cartLines.reduce((total, entry) => total + entry.quantity, 0);
    },
    clearCart(state) {
      state.cartLines = [];
      state.bagCount = 0;
    },
    recordRecentlyViewed(state, action: PayloadAction<string>) {
      state.recentlyViewed = [
        action.payload,
        ...state.recentlyViewed.filter((id) => id !== action.payload),
      ].slice(0, 12);
    },
    hydrateShop(state, action: PayloadAction<ShopState>) {
      state.wishlist = action.payload.wishlist;
      state.cartLines = action.payload.cartLines;
      state.recentlyViewed = action.payload.recentlyViewed ?? state.recentlyViewed;
      state.bagCount = action.payload.cartLines.reduce(
        (total, entry) => total + entry.quantity,
        0,
      );
    },
  },
});

export const {
  toggleWishlist,
  addToBag,
  setCartQuantity,
  removeCartLine,
  clearCart,
  recordRecentlyViewed,
  hydrateShop,
} = shopSlice.actions;

export const store = configureStore({
  reducer: {
    shop: shopSlice.reducer,
    customerAuth: customerAuthReducer,
    [storefrontApi.reducerPath]: storefrontApi.reducer,
    [adminApi.reducerPath]: adminApi.reducer,
    [customerApi.reducerPath]: customerApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      storefrontApi.middleware,
      adminApi.middleware,
      customerApi.middleware,
    ),
});

store.subscribe(() => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem("kallayani-shop", JSON.stringify(store.getState().shop));
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type { ShopState };
