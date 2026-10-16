import { useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ProductCard from "../components/ProductCard";
import useStoreCatalog from "../hooks/useStoreCatalog";

export default function SearchResults() {
  const [searchParams] = useSearchParams();
  const query = (searchParams.get("q") || "").trim();
  const { products, categories, loading, error } = useStoreCatalog();

  const results = useMemo(() => {
    const normalized = query.toLowerCase();
    if (!normalized) return [];
    return products.filter((product) => {
      const category = categories.find(
        (item) => item.id === product.categoryId || item.slug === product.categorySlug
      );
      return [
        product.name,
        product.description,
        product.slug,
        category?.name,
        category?.slug,
      ].some((value) => String(value || "").toLowerCase().includes(normalized));
    });
  }, [query, products, categories]);

  return (
    <>
      <Header />
      <main className="mx-auto min-h-[60vh] max-w-7xl px-4 py-10">
        <p className="text-sm text-gray-500">
          <Link to="/" className="hover:text-[#263E32]">Home</Link> / Search
        </p>
        <h1 className="mt-3 text-3xl font-bold text-[#292820]">Search results</h1>
        <p className="mt-2 text-gray-600">
          {query ? <>Results for <strong>“{query}”</strong></> : "Search our furniture collection."}
        </p>

        {loading ? (
          <p className="py-16 text-center text-gray-600">Searching products...</p>
        ) : error ? (
          <p role="alert" className="py-12 text-center text-red-600">{error}</p>
        ) : !query ? (
          <div className="py-16 text-center">
            <p className="text-gray-600">Enter a product or category in the search bar.</p>
            <Link to="/" className="mt-4 inline-block font-semibold text-[#263E32] underline">Browse products</Link>
          </div>
        ) : results.length ? (
          <>
            <p className="mt-6 text-sm text-gray-500">{results.length} product(s) found</p>
            <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 lg:gap-6">
              {results.map((product) => <ProductCard key={product.id} product={product} />)}
            </div>
          </>
        ) : (
          <div className="py-16 text-center">
            <h2 className="text-xl font-semibold">No products found</h2>
            <p className="mt-2 text-gray-600">Try another product name or category.</p>
            <Link to="/" className="mt-4 inline-block font-semibold text-[#263E32] underline">Continue shopping</Link>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
