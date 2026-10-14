
import { Link, useParams } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ProductCard from "../components/ProductCard";
import useStoreCatalog from "../hooks/useStoreCatalog";

export default function CategoryPage() {
  const { slug } = useParams();
  const { categories, products, loading, error } = useStoreCatalog();

  const category = categories.find((item) => item.slug === slug);

  const categoryProducts = products.filter(
    (product) => product.categorySlug === slug
  );

  return (
    <>
      <Header />

      <main className="mx-auto min-h-[60vh] max-w-7xl px-4 py-10">
        <Link to="/" className="text-sm text-gray-500 hover:text-[#263E32]">
          Home
        </Link>

        <h1 className="mt-4 text-3xl font-bold">
          {category?.name || "Category"}
        </h1>

        {loading ? (
          <p role="status" className="py-12 text-gray-600">
            Loading products...
          </p>
        ) : error ? (
          <p role="alert" className="py-12 text-red-600">
            {error}
          </p>
        ) : !category ? (
          <div className="py-12">
            <p className="text-gray-600">Category not found.</p>
            <Link to="/" className="mt-4 inline-block underline">
              Browse categories
            </Link>
          </div>
        ) : categoryProducts.length === 0 ? (
          <p className="py-12 text-gray-600">
            No products are available in this category yet.
          </p>
        ) : (
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {categoryProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </>
  );
}
