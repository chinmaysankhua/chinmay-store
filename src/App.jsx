import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";

import store from "./redux/store";
import { AuthProvider } from "./context/AuthContext";

import Home from "./pages/Home";
import CategoryPage from "./pages/CategoryPage";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";

function ComingSoon() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-16 text-center">
      <h1 className="text-3xl font-bold">Page coming soon!</h1>
      <p className="mt-3 text-gray-600">
        We're working on this page. Please check back soon.
      </p>
    </main>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/category/:slug" element={<CategoryPage />} />
            <Route path="/product/:slug" element={<ProductDetails />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="*" element={<ComingSoon />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </Provider>
  );
}