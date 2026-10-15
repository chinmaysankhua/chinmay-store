
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useAuth } from "../context/AuthContext";
import { readData } from "../firebase/database";

export default function OrderConfirmation() {
  const { orderId } = useParams();
  const { user } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadOrder() {
      if (!user?.uid || !user?.idToken || !orderId) {
        setLoading(false);
        setError("Please sign in to view this order.");
        return;
      }

      try {
        const result = await readData(
          `customerOrders/${user.uid}/${orderId}`,
          user.idToken
        );

        if (!result) {
          throw new Error("Order not found.");
        }

        if (!cancelled) setOrder(result);
      } catch (err) {
        if (!cancelled) {
          setError(err.message || "Unable to load your order.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadOrder();

    return () => {
      cancelled = true;
    };
  }, [user?.uid, user?.idToken, orderId]);

  return (
    <>
      <Header />
      <main className="mx-auto min-h-[60vh] max-w-3xl px-4 py-16">
        {loading ? (
          <p className="text-center text-gray-600">Loading your order...</p>
        ) : error ? (
          <div className="text-center">
            <h1 className="text-2xl font-bold">Unable to display order</h1>
            <p role="alert" className="mt-3 text-red-600">{error}</p>
            <Link to="/orders" className="mt-6 inline-block text-[#263E32] underline">
              View my orders
            </Link>
          </div>
        ) : (
          <div className="rounded-2xl border border-gray-200 p-6 sm:p-10">
            <div className="text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-3xl text-green-800">
                ✓
              </div>
              <h1 className="mt-5 text-3xl font-bold">Order placed successfully!</h1>
              <p className="mt-3 text-gray-600">
                Thanks for shopping with Chinmay Store.
              </p>
              <p className="mt-4 text-sm text-gray-500">Order ID</p>
              <p className="break-all font-semibold">{orderId}</p>
            </div>

            <div className="mt-8 border-t border-gray-200 pt-6">
              <h2 className="text-lg font-semibold">Order details</h2>
              <div className="mt-4 space-y-4">
                {order.items?.map((item, index) => (
                  <div
                    key={`${item.productId}-${index}`}
                    className="flex items-start justify-between gap-4"
                  >
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-gray-500">
                        Quantity: {item.quantity}
                      </p>
                    </div>
                    <p className="shrink-0 font-medium">
                      ₹{Number(item.lineTotal).toLocaleString("en-IN")}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex justify-between border-t border-gray-200 pt-5 text-lg font-bold">
                <span>Total</span>
                <span>₹{Number(order.total).toLocaleString("en-IN")}</span>
              </div>
              <div className="mt-4 flex justify-between gap-4 text-sm">
                <span className="text-gray-600">Payment</span>
                <span>{order.paymentMethod === "COD" ? "Cash on Delivery" : order.paymentMethod}</span>
              </div>
              <div className="mt-3 flex justify-between gap-4 text-sm">
                <span className="text-gray-600">Order status</span>
                <span>{order.orderStatus || "Pending"}</span>
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/orders"
                className="flex-1 rounded-lg border border-[#263E32] px-5 py-3 text-center font-semibold text-[#263E32]"
              >
                View my orders
              </Link>
              <Link
                to="/"
                className="flex-1 rounded-lg bg-[#263E32] px-5 py-3 text-center font-semibold text-white"
              >
                Continue shopping
              </Link>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
