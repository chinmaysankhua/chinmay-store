
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useAuth } from "../context/AuthContext";
import { addData } from "../firebase/database";
import {
  clearCart,
  selectCartItems,
  selectCartTotal,
} from "../redux/cartSlice";

const initialForm = {
  fullName: "",
  phone: "",
  address: "",
  city: "",
  state: "",
  pinCode: "",
};

export default function Checkout() {
  const { user } = useAuth();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartItems = useSelector(selectCartItems);
  const cartTotal = useSelector(selectCartTotal);

  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (!user?.uid || !user?.idToken) {
      navigate("/login", { state: { from: "/checkout" } });
      return;
    }

    if (cartItems.length === 0) {
      setError("Your cart is empty.");
      return;
    }

    const phone = form.phone.replace(/\D/g, "");
    if (phone.length !== 10) {
      setError("Enter a valid 10-digit phone number.");
      return;
    }

    if (!/^\d{6}$/.test(form.pinCode.trim())) {
      setError("Enter a valid 6-digit PIN code.");
      return;
    }

    setLoading(true);

    try {
      const order = {
        userId: user.uid,
        customer: {
          fullName: form.fullName.trim(),
          email: user.email || "",
          phone,
          address: form.address.trim(),
          city: form.city.trim(),
          state: form.state.trim(),
          pinCode: form.pinCode.trim(),
        },
        items: cartItems.map((item) => ({
          productId: item.id,
          name: item.name,
          slug: item.slug,
          image: item.image,
          price: item.price,
          quantity: item.quantity,
          lineTotal: item.price * item.quantity,
        })),
        subtotal: cartTotal,
        deliveryCharge: 0,
        total: cartTotal,
        paymentMethod: "COD",
        paymentStatus: "Pending",
        orderStatus: "Pending",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const result = await addData(
        `customerOrders/${user.uid}`,
        order,
        user.idToken
      );

      if (!result?.name) {
        throw new Error("The order could not be confirmed. Please try again.");
      }

      dispatch(clearCart());

      navigate(`/order-confirmation/${result.name}`, {
        replace: true,
      });
    } catch (err) {
      setError(
        err.message || "Unable to place your order. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  if (!user) {
    return (
      <>
        <Header />
        <main className="mx-auto max-w-3xl px-4 py-20 text-center">
          <h1 className="text-2xl font-bold">Sign in to continue</h1>
          <p className="mt-3 text-gray-600">
            Please sign in before placing your order.
          </p>
          <Link
            to="/login"
            state={{ from: "/checkout" }}
            className="mt-6 inline-block rounded-lg bg-[#263E32] px-6 py-3 font-semibold text-white"
          >
            Sign in
          </Link>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />

      <main className="mx-auto max-w-7xl px-4 py-10">
        <h1 className="text-3xl font-bold">Checkout</h1>
        <p className="mt-2 text-gray-600">
          Enter your delivery details to place your order.
        </p>

        <div className="mt-8 grid items-start gap-8 lg:grid-cols-[1fr_360px]">
          <form
            onSubmit={handleSubmit}
            className="space-y-5 rounded-xl border border-gray-200 p-5 sm:p-8"
          >
            <h2 className="text-xl font-semibold">Delivery address</h2>

            <div>
              <label htmlFor="fullName" className="mb-2 block text-sm font-medium">
                Full name
              </label>
              <input
                id="fullName"
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                autoComplete="name"
                required
                maxLength={100}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-[#263E32]"
                placeholder="Your full name"
              />
            </div>

            <div>
              <label htmlFor="phone" className="mb-2 block text-sm font-medium">
                Phone number
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                inputMode="numeric"
                value={form.phone}
                onChange={handleChange}
                autoComplete="tel"
                required
                maxLength={15}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-[#263E32]"
                placeholder="10-digit mobile number"
              />
            </div>

            <div>
              <label htmlFor="address" className="mb-2 block text-sm font-medium">
                House number and street address
              </label>
              <textarea
                id="address"
                name="address"
                value={form.address}
                onChange={handleChange}
                autoComplete="street-address"
                required
                maxLength={300}
                rows={3}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-[#263E32]"
                placeholder="House, street, locality"
              />
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="city" className="mb-2 block text-sm font-medium">
                  City
                </label>
                <input
                  id="city"
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  autoComplete="address-level2"
                  required
                  maxLength={100}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-[#263E32]"
                />
              </div>

              <div>
                <label htmlFor="state" className="mb-2 block text-sm font-medium">
                  State
                </label>
                <input
                  id="state"
                  name="state"
                  value={form.state}
                  onChange={handleChange}
                  autoComplete="address-level1"
                  required
                  maxLength={100}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-[#263E32]"
                />
              </div>
            </div>

            <div>
              <label htmlFor="pinCode" className="mb-2 block text-sm font-medium">
                PIN code
              </label>
              <input
                id="pinCode"
                name="pinCode"
                value={form.pinCode}
                onChange={handleChange}
                inputMode="numeric"
                autoComplete="postal-code"
                required
                maxLength={6}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-[#263E32]"
                placeholder="6-digit PIN code"
              />
            </div>

            <div className="rounded-lg bg-[#F2EDE5] p-4">
              <p className="font-semibold">Payment method</p>
              <p className="mt-2 text-sm text-gray-700">
                Cash on Delivery (COD)
              </p>
              <p className="mt-1 text-sm text-gray-600">
                Pay when your furniture is delivered.
              </p>
            </div>

            {error && (
              <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading || cartItems.length === 0}
              className="w-full rounded-lg bg-[#263E32] px-6 py-3 font-semibold text-white hover:bg-[#1c3026] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Placing order..." : "Place order"}
            </button>

            <Link
              to="/cart"
              className="block text-center text-sm font-medium text-[#263E32] hover:underline"
            >
              Return to cart
            </Link>
          </form>

          <aside className="rounded-xl border border-gray-200 p-6">
            <h2 className="text-xl font-semibold">Order Summary</h2>

            <div className="mt-5 space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="flex justify-between gap-4 text-sm">
                  <span className="text-gray-600">
                    {item.name} × {item.quantity}
                  </span>
                  <span className="shrink-0 font-medium">
                    ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-5 flex justify-between border-t border-gray-200 pt-5 font-bold">
              <span>Total</span>
              <span>₹{cartTotal.toLocaleString("en-IN")}</span>
            </div>

            <p className="mt-3 text-xs text-gray-500">
              Delivery is currently shown as free. Update the delivery charge
              here when you implement your shipping policy.
            </p>
          </aside>
        </div>
      </main>

      <Footer />
    </>
  );
}
