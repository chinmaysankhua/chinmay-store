
import { Link, useParams } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ProductCard from "../components/ProductCard";
import { categories, products } from "../data/products";

export default function CategoryPage() {
  const { slug } = useParams();

  const category = categories.find((item) => item.slug === slug);

  const categoryProducts = products.filter(
    (product) => product.categorySlug === slug
  );

  if (!category) {
    return (
      <>
        <Header />
        <main className="mx-auto max-w-7xl px-5 py-20 text-center">
          <h1 className="text-2xl font-semibold text-stone-900">
            Category not found
          </h1>
          <p className="mt-3 text-stone-500">
            We couldn't find that furniture category.
          </p>
          <Link
            to="/"
            className="mt-6 inline-block rounded-full bg-[#263E32] px-6 py-3 text-white"
          >
            Back to Home
          </Link>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="mx-auto max-w-7xl px-5 py-10 sm:px-8 sm:py-14">
        <nav className="mb-6 text-sm text-stone-500">
          <Link to="/" className="hover:text-[#263E32]">
            Home
          </Link>
          <span className="mx-2">/</span>
          <span className="text-stone-800">{category.name}</span>
        </nav>

        <div className="mb-8 border-b border-stone-200 pb-6">
          <p className="text-xs font-semibold tracking-[0.2em] text-[#667B67]">
            FIND YOUR STYLE
          </p>

          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-stone-900 sm:text-4xl">
            {category.name}
          </h1>

          <p className="mt-3 text-sm text-stone-500">
            {categoryProducts.length}{" "}
            {categoryProducts.length === 1 ? "product" : "products"}
          </p>
        </div>

        {categoryProducts.length > 0 ? (
          <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4">
            {categoryProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="py-16 text-center">
            <h2 className="text-xl font-medium text-stone-800">
              No products available yet
            </h2>
            <p className="mt-2 text-sm text-stone-500">
              Please check back later for new arrivals.
            </p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
