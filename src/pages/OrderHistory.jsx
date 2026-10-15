
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useAuth } from "../context/AuthContext";
import { readData } from "../firebase/database";

export default function OrderHistory() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadOrders = useCallback(async () => {
    if (!user?.uid || !user?.idToken) {
      setOrders([]);
      setLoading(false);
      setError("Please sign in to view your orders.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const data = await readData(
        `customerOrders/${user.uid}`,
        user.idToken
      );

      const list = data
        ? Object.entries(data).map(([id, order]) => ({ ...order, id }))
        : [];

      list.sort(
        (a, b) =>
          new Date(b.createdAt || 0).getTime() -
          new Date(a.createdAt || 0).getTime()
      );

      setOrders(list);
    } catch (err) {
      setError(err.message || "Unable to load your orders.");
    } finally {
      setLoading(false);
    }
  }, [user?.uid, user?.idToken]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  return (
    <>
      <Header />
      <main className="mx-auto min-h-[60vh] max-w-5xl px-4 py-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">My Orders</h1>
            <p className="mt-2 text-gray-600">
              Track your Chinmay Store purchases.
            </p>
          </div>
          <button
            type="button"
            onClick={loadOrders}
            disabled={loading}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium disabled:opacity-50"
          >
            Refresh
          </button>
        </div>

        {loading ? (
          <p className="py-16 text-center text-gray-600">Loading orders...</p>
        ) : error ? (
          <div className="py-16 text-center">
            <p role="alert" className="text-red-600">{error}</p>
            {!user && (
              <Link to="/login" className="mt-4 inline-block text-[#263E32] underline">
                Sign in
              </Link>
            )}
          </div>
        ) : orders.length === 0 ? (
          <div className="py-16 text-center">
            <h2 className="text-xl font-semibold">No orders yet</h2>
            <p className="mt-2 text-gray-600">
              Your placed orders will appear here.
            </p>
            <Link
              to="/"
              className="mt-5 inline-block rounded-lg bg-[#263E32] px-5 py-3 font-semibold text-white"
            >
              Explore furniture
            </Link>
          </div>
        ) : (
          <div className="mt-8 space-y-5">
            {orders.map((order) => (
              <article key={order.id} className="rounded-xl border border-gray-200 p-5">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Order ID</p>
                    <p className="break-all font-semibold">{order.id}</p>
                    <p className="mt-2 text-sm text-gray-600">
                      {order.createdAt
                        ? new Date(order.createdAt).toLocaleString("en-IN")
                        : "Date unavailable"}
                    </p>
                  </div>
                  <span className="rounded-full bg-[#F2EDE5] px-3 py-1 text-sm font-medium">
                    {order.orderStatus || "Pending"}
                  </span>
                </div>

                <div className="mt-4 border-t border-gray-200 pt-4">
                  <p className="text-sm text-gray-600">
                    {order.items?.length || 0} product type(s) ·{" "}
                    {order.paymentMethod === "COD" ? "Cash on Delivery" : order.paymentMethod}
                  </p>
                  <p className="mt-2 text-lg font-bold">
                    ₹{Number(order.total || 0).toLocaleString("en-IN")}
                  </p>
                  <Link
                    to={`/order-confirmation/${order.id}`}
                    className="mt-3 inline-block text-sm font-semibold text-[#263E32] underline underline-offset-4"
                  >
                    View order details
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
