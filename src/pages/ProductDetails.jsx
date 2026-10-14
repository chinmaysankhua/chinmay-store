import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { products } from "../data/products";
import { addToCart, selectCartItems } from "../redux/cartSlice";

export default function ProductDetails() {
  const { slug } = useParams();
  const dispatch = useDispatch();
  const cartItems = useSelector(selectCartItems);

  const product = products.find((item) => item.slug === slug);

  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState("");

  if (!product) {
    return (
      <>
        <Header />
        <main className="mx-auto max-w-7xl px-4 py-16">
          <h1 className="text-2xl font-bold">Product not found</h1>
          <Link to="/" className="mt-4 inline-block text-[#263E32] underline">
            Back to home
          </Link>
        </main>
        <Footer />
      </>
    );
  }

  const existingItem = cartItems.find(
    (item) => item.id === product.id
  );

  const quantityInCart = existingItem ? existingItem.quantity : 0;
  const availableToAdd = product.stockQuantity - quantityInCart;

  function handleAddToCart() {
    setMessage("");

    if (product.stockQuantity <= 0) {
      setMessage("Sorry, this product is out of stock.");
      return;
    }

    if (quantity > availableToAdd) {
      setMessage(
        availableToAdd <= 0
          ? "You have already added all available stock."
          : `You can add only ${availableToAdd} more item(s).`
      );
      return;
    }

    dispatch(addToCart({ product, quantity }));
    setMessage("Product added to your cart!");
  }

  return (
    <>
      <Header />

      <main className="mx-auto max-w-7xl px-4 py-10">
        <Link to="/" className="text-sm text-gray-600 hover:text-[#263E32]">
          Home
        </Link>

        <div className="mt-6 grid gap-10 md:grid-cols-2">
          <div className="overflow-hidden rounded-xl bg-[#F2EDE5]">
            <img
              src={product.image}
              alt={product.name}
              className="h-full max-h-[560px] min-h-80 w-full object-cover"
            />
          </div>

          <div className="flex flex-col items-start">
            <p className="text-sm font-medium uppercase tracking-wider text-[#263E32]">
              Chinmay Store Furniture
            </p>

            <h1 className="mt-3 text-3xl font-bold md:text-4xl">
              {product.name}
            </h1>

            <p className="mt-5 text-3xl font-semibold">
              ₹{product.price.toLocaleString("en-IN")}
            </p>

            <p className="mt-6 leading-7 text-gray-600">
              {product.description}
            </p>

            <p className="mt-5 text-sm">
              {product.stockQuantity > 0 ? (
                <span className="font-medium text-green-700">
                  In stock ({product.stockQuantity} available)
                </span>
              ) : (
                <span className="font-medium text-red-600">
                  Out of stock
                </span>
              )}
            </p>

            <div className="mt-6 flex items-center gap-4">
              <span className="font-medium">Quantity</span>

              <div className="flex items-center rounded-lg border border-gray-300">
                <button
                  type="button"
                  disabled={quantity <= 1}
                  onClick={() =>
                    setQuantity((current) => Math.max(1, current - 1))
                  }
                  className="px-4 py-2 disabled:opacity-40"
                  aria-label="Decrease quantity"
                >
                  −
                </button>

                <span className="min-w-10 text-center">{quantity}</span>

                <button
                  type="button"
                  disabled={quantity >= availableToAdd || product.stockQuantity <= 0}
                  onClick={() =>
                    setQuantity((current) =>
                      Math.min(availableToAdd, current + 1)
                    )
                  }
                  className="px-4 py-2 disabled:opacity-40"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={handleAddToCart}
              disabled={product.stockQuantity <= 0}
              className="mt-7 w-full rounded-lg bg-[#263E32] px-6 py-3 font-semibold text-white transition hover:bg-[#1c3026] disabled:cursor-not-allowed disabled:bg-gray-400 sm:w-auto"
            >
              {product.stockQuantity <= 0 ? "Out of Stock" : "Add to Cart"}
            </button>

            {message && (
              <p role="status" className="mt-4 text-sm text-[#263E32]">
                {message}
              </p>
            )}

            <Link to="/cart" className="mt-4 font-medium underline">
              View Cart
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}