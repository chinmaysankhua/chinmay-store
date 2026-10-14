
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-[#263E32] text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-12 sm:grid-cols-2 lg:grid-cols-4 lg:px-8">
        <div>
          <Link to="/" className="text-xl font-extrabold tracking-tight">
            CHINMAY STORE
          </Link>
          <p className="mt-4 max-w-xs text-sm leading-6 text-white/70">
            Furniture for the way you live. Find pieces that make your space
            feel like home.
          </p>
        </div>

        <div>
          <h3 className="font-semibold">Shop</h3>
          <ul className="mt-4 space-y-3 text-sm text-white/70">
            <li><Link className="hover:text-white" to="/category/wardrobes">Wardrobes</Link></li>
            <li><Link className="hover:text-white" to="/category/beds">Beds</Link></li>
            <li><Link className="hover:text-white" to="/category/sofas">Sofas</Link></li>
            <li><Link className="hover:text-white" to="/category/storage">Storage</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold">Your Account</h3>
          <ul className="mt-4 space-y-3 text-sm text-white/70">
            <li><Link className="hover:text-white" to="/login">Login</Link></li>
            <li><Link className="hover:text-white" to="/register">Create Account</Link></li>
            <li><Link className="hover:text-white" to="/orders">My Orders</Link></li>
            <li><Link className="hover:text-white" to="/cart">Shopping Cart</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold">Customer Care</h3>
          <p className="mt-4 text-sm leading-6 text-white/70">
            Need help with your order? Contact our customer support team.
          </p>
          <p className="mt-3 text-sm text-white/70">
            Support details will be added before launch.
          </p>
        </div>
      </div>

      <div className="border-t border-white/15 px-6 py-5 text-center text-xs text-white/60">
        © {new Date().getFullYear()} Chinmay Store. All rights reserved.
      </div>
    </footer>
  );
}
