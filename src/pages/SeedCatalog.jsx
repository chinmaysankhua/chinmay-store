
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { seedCatalog } from "../utils/seedCatalog";

export default function SeedCatalog() {
  const { user } = useAuth();
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSeed() {
    try {
      setLoading(true);
      setMessage("");

      const result = await seedCatalog(user?.idToken);

      setMessage(
        `Success! Uploaded ${result.categories} categories and ${result.products} products.`
      );
    } catch (error) {
      setMessage(error.message || "Unable to seed catalog.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto max-w-xl p-8">
      <h1 className="mb-4 text-2xl font-bold">
        Initialize Store Catalog
      </h1>

      <p className="mb-4">
        Upload the existing sample categories and products to Firebase.
      </p>

      <button
        onClick={handleSeed}
        disabled={loading || !user?.idToken}
        className="rounded bg-green-800 px-5 py-3 text-white disabled:opacity-50"
      >
        {loading ? "Uploading..." : "Seed Firebase"}
      </button>

      {message && <p className="mt-4">{message}</p>}
    </main>
  );
}
