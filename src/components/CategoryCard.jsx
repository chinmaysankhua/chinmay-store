
import { Link } from "react-router-dom";

export default function CategoryCard({ category }) {
  return (
    <Link
      to={`/category/${category.slug}`}
      className="group block overflow-hidden rounded-2xl bg-white"
    >
      <div className="aspect-[4/5] overflow-hidden rounded-2xl bg-stone-100">
        <img
          src={category.image}
          alt={category.name}
          loading="lazy"
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
      </div>

      <div className="flex items-center justify-between gap-3 py-4">
        <h3 className="font-semibold text-stone-800 transition group-hover:text-[#263E32]">
          {category.name}
        </h3>
        <span
          aria-hidden="true"
          className="text-lg text-[#263E32] transition group-hover:translate-x-1"
        >
          →
        </span>
      </div>
    </Link>
  );
}
