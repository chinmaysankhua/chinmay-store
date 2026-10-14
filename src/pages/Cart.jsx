import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Header from "../components/Header";
import Footer from "../components/Footer";
import {
  selectCartItems,
  selectCartTotal,
  updateQuantity,
  removeFromCart,
} from "../redux/cartSlice";

export default function Cart() {
  const dispatch = useDispatch();
  const cartItems = useSelector(selectCartItems);
  const cartTotal = useSelector(selectCartTotal);

  return (
    <>
      <Header />

      <main className="mx-auto min-h-[60vh] max-w-7xl px-4 py-10">
        <h1 className="text-3xl font-bold">Your Shopping Cart</h1>

        {cartItems.length === 0 ? (
          <div className="py-20 text-center">
            <h2 className="text-2xl font-semibold">Your cart is empty</h2>
            <p className="mt-3 text-gray-600">
              Discover furniture that makes your space feel like home.
            </p>

            <Link
              to="/"
              className="mt-6 inline-block rounded-lg bg-[#263E32] px-6 py-3 font-semibold text-white hover:bg-[#1c3026]"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="mt-8 grid items-start gap-8 lg:grid-cols-[1fr_340px]">
            <div className="space-y-5">
              {cartItems.map((item) => (
                <article
                  key={item.id}
                  className="flex flex-col gap-4 rounded-xl border border-gray-200 p-4 sm:flex-row"
                >
                  <Link to={`/product/${item.slug}`}>
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-36 w-full rounded-lg object-cover sm:w-36"
                    />
                  </Link>

                  <div className="flex flex-1 flex-col justify-between gap-4">
                    <div>
                      <Link
                        to={`/product/${item.slug}`}
                        className="text-lg font-semibold hover:text-[#263E32]"
                      >
                        {item.name}
                      </Link>

                      <p className="mt-2 text-gray-600">
                        ₹{item.price.toLocaleString("en-IN")} each
                      </p>

                      <p className="mt-1 font-semibold">
                        Item total: ₹
                        {(item.price * item.quantity).toLocaleString("en-IN")}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-4">
                      <div className="flex items-center rounded-lg border border-gray-300">
                        <button
                          type="button"
                          disabled={item.quantity <= 1}
                          onClick={() =>
                            dispatch(
                              updateQuantity({
                                productId: item.id,
                                quantity: item.quantity - 1,
                              })
                            )
                          }
                          className="px-3 py-2 disabled:opacity-40"
                          aria-label={`Decrease quantity of ${item.name}`}
                        >
                          −
                        </button>

                        <span className="min-w-10 text-center">
                          {item.quantity}
                        </span>

                        <button
                          type="button"
                          disabled={item.quantity >= item.stockQuantity}
                          onClick={() =>
                            dispatch(
                              updateQuantity({
                                productId: item.id,
                                quantity: item.quantity + 1,
                              })
                            )
                          }
                          className="px-3 py-2 disabled:opacity-40"
                          aria-label={`Increase quantity of ${item.name}`}
                        >
                          +
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => dispatch(removeFromCart(item.id))}
                        className="text-sm font-medium text-red-600 hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <aside className="rounded-xl border border-gray-200 p-6">
              <h2 className="text-xl font-semibold">Order Summary</h2>

              <div className="mt-5 flex justify-between gap-4 text-gray-600">
                <span>Subtotal</span>
                <span>₹{cartTotal.toLocaleString("en-IN")}</span>
              </div>

              <div className="mt-3 flex justify-between gap-4 text-gray-600">
                <span>Delivery</span>
                <span>Calculated at checkout</span>
              </div>

              <div className="mt-5 border-t border-gray-200 pt-5">
                <div className="flex justify-between gap-4 text-lg font-bold">
                  <span>Total</span>
                  <span>₹{cartTotal.toLocaleString("en-IN")}</span>
                </div>

                <p className="mt-2 text-xs text-gray-500">
                  Delivery charges, if any, will be confirmed at checkout.
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  alert("Checkout will be implemented in the next step.")
                }
                className="mt-6 w-full rounded-lg bg-[#263E32] px-6 py-3 font-semibold text-white hover:bg-[#1c3026]"
              >
                Proceed to Checkout
              </button>

              <Link
                to="/"
                className="mt-4 block text-center text-sm font-medium text-[#263E32] hover:underline"
              >
                Continue Shopping
              </Link>
            </aside>
          </div>
        )}
      </main>

      <Footer />
    </>
  );
}