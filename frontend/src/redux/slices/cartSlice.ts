import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { Product } from "../../types/ProductType";

export interface CartItem extends Product {
  quantity: number;
}

type InitState = {
  cart: CartItem[];
  toogleShowCart: boolean;
};

const initialState: InitState = {
  cart: [],
  toogleShowCart: false,
};

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart(state, action: PayloadAction<Product>) {
      const product = action.payload;

      const existing = state.cart.find((item) => item.id === product.id);

      if (existing) {
        existing.quantity += 1;
      } else {
        state.cart.push({ ...product, quantity: 1 });
      }
    },
    removeFromCart(state, action: PayloadAction<Partial<Product>>) {
      state.cart = state.cart.filter(
        (item: Product) => item.id != action.payload.id,
      );
    },
    updateQuantity(state, action: PayloadAction<any>) {
      state.cart = state.cart.map((item: CartItem) => {
        if (item.id !== action.payload.id) return item;

        const safeQuantity = Math.max(
          1,
          Math.min(action.payload.quantity, item.stock),
        );

        return { ...item, quantity: safeQuantity };
      });
    },
    clearCart(state) {
      state.cart = [];
    },
    toogleShowCart(state, action: PayloadAction<boolean>) {
      state.toogleShowCart = action.payload;
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  toogleShowCart,
} = cartSlice.actions;
export default cartSlice.reducer;
