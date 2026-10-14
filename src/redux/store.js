import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./cartSlice";

function loadCart() {
  try {
    const savedCart = localStorage.getItem("chinmay-store-cart");

    if (!savedCart) {
      return { items: [] };
    }

    const parsedCart = JSON.parse(savedCart);

    return {
      items: Array.isArray(parsedCart) ? parsedCart : [],
    };
  } catch {
    return { items: [] };
  }
}

const store = configureStore({
  reducer: {
    cart: cartReducer,
  },
  preloadedState: {
    cart: loadCart(),
  },
});

store.subscribe(() => {
  try {
    localStorage.setItem(
      "chinmay-store-cart",
      JSON.stringify(store.getState().cart.items)
    );
  } catch {
    // Storage might be unavailable; Redux still works in memory.
  }
});

export default store;