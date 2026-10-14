
import Header from "../components/Header";
import HeroSlider from "../components/HeroSlider";
import CategoryCard from "../components/CategoryCard";
import Footer from "../components/Footer";

const categories = [
  {
    name: "1-Door Wardrobes",
    slug: "1-door-wardrobes",
    image:
      "https://images.unsplash.com/photo-1631679706909-1844bbd07221?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "2-Door Wardrobes",
    slug: "2-door-wardrobes",
    image:
      "https://images.unsplash.com/photo-1616486029423-aaa4789e8c9a?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Sliding Wardrobes",
    slug: "sliding-wardrobes",
    image:
      "https://images.unsplash.com/photo-1615874694520-474822394e73?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Beds",
    slug: "beds",
    image:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main>
        <HeroSlider />

        <section className="mx-auto max-w-7xl px-5 py-14 sm:px-8 sm:py-20">
          <div className="mb-8 flex items-end justify-between gap-4 sm:mb-10">
            <div>
              <p className="mb-2 text-xs font-semibold tracking-[0.2em] text-[#667B67]">
                FIND YOUR STYLE
              </p>
              <h2 className="text-3xl font-semibold tracking-tight text-stone-900 sm:text-4xl">
                Shop by Category
              </h2>
              <p className="mt-3 max-w-xl text-sm leading-6 text-stone-500 sm:text-base">
                Explore furniture designed for the spaces you call home.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-x-4 gap-y-2 sm:gap-x-6 lg:grid-cols-4">
            {categories.map((category) => (
              <CategoryCard key={category.slug} category={category} />
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
