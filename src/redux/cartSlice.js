import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const { product, quantity = 1 } = action.payload;

      if (
        !product ||
        !Number.isInteger(quantity) ||
        quantity < 1 ||
        !Number.isFinite(product.stockQuantity) ||
        product.stockQuantity < 1
      ) {
        return;
      }

      const existingItem = state.items.find(
        (item) => item.id === product.id
      );

      const existingQuantity = existingItem
        ? existingItem.quantity
        : 0;

      if (existingQuantity + quantity > product.stockQuantity) {
        return;
      }

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        state.items.push({
          id: product.id,
          name: product.name,
          slug: product.slug,
          price: product.price,
          image: product.image,
          stockQuantity: product.stockQuantity,
          quantity,
        });
      }
    },

    updateQuantity: (state, action) => {
      const { productId, quantity } = action.payload;

      const item = state.items.find(
        (item) => item.id === productId
      );

      if (
        !item ||
        !Number.isInteger(quantity) ||
        quantity < 1 ||
        quantity > item.stockQuantity
      ) {
        return;
      }

      item.quantity = quantity;
    },

    removeFromCart: (state, action) => {
      state.items = state.items.filter(
        (item) => item.id !== action.payload
      );
    },

    clearCart: (state) => {
      state.items = [];
    },
  },
});

export const {
  addToCart,
  updateQuantity,
  removeFromCart,
  clearCart,
} = cartSlice.actions;

export const selectCartItems = (state) => state.cart.items;

export const selectCartCount = (state) =>
  state.cart.items.reduce(
    (total, item) => total + item.quantity,
    0
  );

export const selectCartTotal = (state) =>
  state.cart.items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

export default cartSlice.reducer;