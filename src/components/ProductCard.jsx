
import { Link } from "react-router-dom";

export default function ProductCard({ product }) {
  const isOutOfStock = product.stockQuantity <= 0;

  return (
    <article className="group min-w-0">
      <Link
        to={`/product/${product.slug}`}
        className="block overflow-hidden rounded-xl bg-stone-100"
      >
        <div className="relative aspect-[4/5] overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />

          {isOutOfStock && (
            <span className="absolute left-3 top-3 rounded-full bg-stone-900/85 px-3 py-1.5 text-xs font-medium text-white">
              Out of stock
            </span>
          )}
        </div>
      </Link>

      <div className="pt-3">
        <Link to={`/product/${product.slug}`}>
          <h2 className="font-medium leading-6 text-stone-800 transition hover:text-[#263E32]">
            {product.name}
          </h2>
        </Link>

        <p className="mt-2 font-semibold text-[#263E32]">
          ₹{product.price.toLocaleString("en-IN")}
        </p>

        <p
          className={`mt-2 text-xs ${
            isOutOfStock ? "text-red-600" : "text-stone-500"
          }`}
        >
          {isOutOfStock
            ? "Currently unavailable"
            : `${product.stockQuantity} in stock`}
        </p>
      </div>
    </article>
  );
}
