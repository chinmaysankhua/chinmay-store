
import { Link } from "react-router-dom";

export default function ProductCard({ product }) {
  return (
    <article className="overflow-hidden rounded-xl border border-gray-200 bg-white transition hover:shadow-md">
      <Link to={`/product/${product.slug}`}>
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className="h-56 w-full object-cover"
          />
        ) : (
          <div className="flex h-56 items-center justify-center bg-[#F2EDE5] text-gray-500">
            No image available
          </div>
        )}
      </Link>

      <div className="p-4">
        <Link
          to={`/product/${product.slug}`}
          className="font-semibold hover:text-[#263E32]"
        >
          {product.name}
        </Link>

        <p className="mt-3 text-lg font-bold">
          ₹{Number(product.price).toLocaleString("en-IN")}
        </p>

        <p
          className={`mt-2 text-sm ${
            product.stockQuantity > 0 ? "text-green-700" : "text-red-600"
          }`}
        >
          {product.stockQuantity > 0
            ? "In stock"
            : "Out of stock"}
        </p>

        <Link
          to={`/product/${product.slug}`}
          className="mt-4 block rounded-lg bg-[#263E32] px-4 py-2 text-center font-medium text-white hover:bg-[#1c3026]"
        >
          View Product
        </Link>
      </div>
    </article>
  );
}
