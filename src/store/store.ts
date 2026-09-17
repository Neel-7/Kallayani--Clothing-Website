import { configureStore, createSlice, type PayloadAction } from "@reduxjs/toolkit";

type ShopState = {
  wishlist: string[];
  bagCount: number;
};

const initialState: ShopState = { wishlist: [], bagCount: 0 };

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
    addToBag(state) {
      state.bagCount += 1;
    },
  },
});

export const { toggleWishlist, addToBag } = shopSlice.actions;

export const store = configureStore({ reducer: { shop: shopSlice.reducer } });
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
