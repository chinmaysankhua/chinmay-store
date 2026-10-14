
import Header from "../components/Header";
import HeroSlider from "../components/HeroSlider";
import CategoryCard from "../components/CategoryCard";
import Footer from "../components/Footer";
import useStoreCatalog from "../hooks/useStoreCatalog";

export default function Home() {
  const { categories, loading, error } = useStoreCatalog();

  return (
    <>
      <Header />
      <HeroSlider />

      <main className="mx-auto max-w-7xl px-4 py-12">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-widest text-[#263E32]">
            Find your style
          </p>
          <h1 className="mt-2 text-3xl font-bold text-[#292820] md:text-4xl">
            Shop by Category
          </h1>
          <p className="mt-3 max-w-2xl text-gray-600">
            Discover furniture designed for the way you live.
          </p>
        </div>

        {loading ? (
          <p role="status" className="py-10 text-gray-600">
            Loading categories...
          </p>
        ) : error ? (
          <p role="alert" className="py-10 text-red-600">
            {error}
          </p>
        ) : categories.length === 0 ? (
          <p className="py-10 text-gray-600">
            No categories are available yet.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
            {categories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </>
  );
}
