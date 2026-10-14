import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  function handleChange(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  
async function handleSubmit(event) {
  event.preventDefault();
  setError("");
  setLoading(true);

  try {
    await login({
      email: form.email.trim(),
      password: form.password,
    });

    navigate("/");
  } catch (err) {
    setError(err.message || "Unable to log in. Please try again.");
  } finally {
    setLoading(false);
  }
}


  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F2EDE5] px-4 py-10">
      <section className="grid w-full max-w-5xl overflow-hidden rounded-2xl bg-white shadow-xl md:grid-cols-2">
        <div className="hidden min-h-[600px] flex-col justify-between bg-[#263E32] p-10 text-white md:flex">
          <Link to="/" className="text-2xl font-bold tracking-wide">
            CHINMAY STORE
          </Link>

          <div>
            <p className="mb-4 text-sm uppercase tracking-[0.25em] text-[#D8C9A7]">
              Welcome back
            </p>
            <h1 className="text-4xl font-semibold leading-tight">
              Make yourself at home.
            </h1>
            <p className="mt-5 max-w-sm leading-7 text-white/75">
              Thoughtful furniture, timeless comfort, and spaces that feel like
              you.
            </p>
          </div>

          <p className="text-sm text-white/60">
            Furniture for the way you live.
          </p>
        </div>

        <div className="flex items-center px-6 py-12 sm:px-12">
          <div className="mx-auto w-full max-w-md">
            <Link
              to="/"
              className="text-sm font-semibold text-[#263E32] md:hidden"
            >
              ← Chinmay Store
            </Link>

            <p className="mt-5 text-sm font-medium uppercase tracking-widest text-[#8A806F]">
              Your account
            </p>
            <h2 className="mt-2 text-3xl font-bold text-[#292820]">Sign in</h2>
            <p className="mt-3 text-sm leading-6 text-gray-500">
              Welcome back! Enter your details to continue.
            </p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <div>
                <label
                  htmlFor="login-email"
                  className="mb-2 block text-sm font-medium"
                >
                  Email address
                </label>
                <input
                  id="login-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-[#263E32] focus:ring-2 focus:ring-[#263E32]/10"
                />
              </div>

              <div>
                <label
                  htmlFor="login-password"
                  className="mb-2 block text-sm font-medium"
                >
                  Password
                </label>

                <div className="relative">
                  <input
                    id="login-password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    value={form.password}
                    onChange={handleChange}
                    required
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 pr-12 outline-none transition focus:border-[#263E32] focus:ring-2 focus:ring-[#263E32]/10"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    className="absolute inset-y-0 right-0 flex items-center px-4 text-gray-500 hover:text-[#263E32]"
                  >
                    {showPassword ? "🙈" : "👁️"}
                  </button>
                </div>
              </div>

              {error && (
                <p
                  role="alert"
                  className="rounded-lg bg-red-50 p-3 text-sm text-red-700"
                >
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-[#263E32] px-4 py-3 font-semibold text-white transition hover:bg-[#1D3027] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Signing in..." : "Sign in"}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-gray-600">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="font-semibold text-[#263E32] underline underline-offset-4"
              >
                Create account
              </Link>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
