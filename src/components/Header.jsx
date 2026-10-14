import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectCartCount } from "../redux/cartSlice";

export default function Header() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const cartCount = useSelector(selectCartCount);

  function handleSearch(event) {
    event.preventDefault();

    const trimmedQuery = query.trim();

    if (!trimmedQuery) return;

    navigate(`/search?q=${encodeURIComponent(trimmedQuery)}`);
  }

  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-4">
        <Link to="/" className="text-2xl font-bold text-[#263E32]">
          Chinmay Store
        </Link>

        <form
          onSubmit={handleSearch}
          className="order-3 flex w-full overflow-hidden rounded-lg border border-gray-300 md:order-none md:w-auto md:flex-1 md:max-w-xl"
        >
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search furniture..."
            aria-label="Search furniture"
            className="min-w-0 flex-1 px-4 py-2 outline-none"
          />

          <button
            type="submit"
            className="bg-[#263E32] px-5 py-2 text-white hover:bg-[#1c3026]"
          >
            Search
          </button>
        </form>

        <nav className="flex items-center gap-4 text-sm font-medium">
          <Link to="/login" className="hidden hover:text-[#263E32] sm:block">
            Login
          </Link>

          <Link
            to="/register"
            className="hidden hover:text-[#263E32] sm:block"
          >
            Register
          </Link>

          <Link
            to="/cart"
            className="flex items-center gap-2 hover:text-[#263E32]"
            aria-label={`Shopping cart, ${cartCount} items`}
          >
            <span>Cart</span>
            <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-[#263E32] px-2 text-xs text-white">
              {cartCount}
            </span>
          </Link>
        </nav>
      </div>
    </header>
  );
}