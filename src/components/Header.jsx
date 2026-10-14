
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Header() {
  const { user, logout } = useAuth();
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  function handleSearch(event) {
    event.preventDefault();

    const query = search.trim();
    if (!query) return;

    navigate(`/search?q=${encodeURIComponent(query)}`);
  }

  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-4">
        {/* Logo */}
        <Link
          to="/"
          className="shrink-0 text-lg font-bold tracking-tight text-[#263E32] sm:text-2xl"
        >
          Chinmay Store
        </Link>

        {/* Search bar */}
        <form
          onSubmit={handleSearch}
          className="mx-auto flex min-w-0 max-w-xl flex-1 items-center rounded-lg border border-gray-300 bg-[#F2EDE5]/50 px-3"
        >
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search furniture..."
            aria-label="Search furniture"
            className="w-full min-w-0 bg-transparent py-2 text-sm outline-none sm:text-base"
          />
          <button
            type="submit"
            aria-label="Search"
            className="shrink-0 px-1 text-lg text-[#263E32]"
          >
            🔍
          </button>
        </form>

        {/* Login and Cart: visible on mobile and desktop */}
        <div className="flex shrink-0 items-center gap-2 sm:gap-4">
          {user ? (
            <button
              onClick={logout}
              className="text-sm font-medium text-[#263E32] sm:text-base"
            >
              Logout
            </button>
          ) : (
            <Link
              to="/login"
              className="rounded-lg bg-[#263E32] px-3 py-2 text-sm font-medium text-white sm:px-4 sm:text-base"
            >
              Login
            </Link>
          )}

          <Link
            to="/cart"
            aria-label="Shopping cart"
            className="flex items-center gap-1 text-sm font-medium text-[#263E32] sm:gap-2 sm:text-base"
          >
            <span aria-hidden="true">🛒</span>
            <span>Cart</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
