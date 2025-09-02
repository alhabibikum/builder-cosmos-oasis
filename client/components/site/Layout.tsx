import { Outlet, Link, NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useCart } from "@/store/cart";
import { useAuth } from "@/store/auth";

function Header() {
  const { count } = useCart();
  const { role, user, signOut } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const nav = [
    { to: "/", label: "Home" },
    { to: "/shop", label: "Shop" },
    { to: "/new", label: "New Arrivals" },
    { to: "/bestsellers", label: "Best Sellers" },
    { to: "/sale", label: "Sale" },
  ];
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:py-4">
        <div className="flex items-center gap-6">
          <button
            className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-md border text-foreground"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M3 6h18M3 12h18M3 18h18" />
            </svg>
          </button>
          <Link to="/" className="group flex items-baseline gap-2">
            <span className="text-2xl font-extrabold tracking-tight leading-none font-[\'Playfair Display\'] text-primary">
              PoshaBaya
            </span>
            <span className="hidden text-xs font-medium uppercase text-muted-foreground md:inline-block">
              Luxury Abayas
            </span>
          </Link>
        </div>

        <div className="hidden flex-1 items-center justify-center md:flex">
          <nav className="flex items-center gap-6">
            {nav.map((n) => (
              <NavLink
                key={n.to}
                to={n.to}
                className={({ isActive }) =>
                  cn(
                    "text-sm font-medium transition-colors hover:text-foreground",
                    isActive ? "text-foreground" : "text-muted-foreground",
                  )
                }
              >
                {n.label}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative hidden md:block">
            <input
              placeholder="Search abayas, kaftans..."
              className="h-10 w-56 rounded-md border bg-background px-3 pr-9 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  const q = (e.target as HTMLInputElement).value.trim();
                  navigate(
                    q ? `/shop?search=${encodeURIComponent(q)}` : "/shop",
                  );
                }
              }}
            />
            <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.3-4.3" />
              </svg>
            </span>
          </div>

          <div className="hidden md:inline-flex items-center gap-2">
            {role === "guest" ? (
              <Link to="/login" className="rounded-md border px-3 py-2 text-sm">
                Sign in
              </Link>
            ) : (
              <>
                {role === "admin" && (
                  <Link
                    to="/admin"
                    className="rounded-md border px-3 py-2 text-sm"
                  >
                    Admin
                  </Link>
                )}
                <Link
                  to="/dashboard"
                  className="rounded-md border px-3 py-2 text-sm"
                >
                  {user?.name || "Account"}
                </Link>
                <button
                  onClick={signOut}
                  className="rounded-md border px-3 py-2 text-sm"
                >
                  Sign out
                </button>
              </>
            )}
          </div>

          <NavLink
            to="/cart"
            className="relative inline-flex h-10 w-10 items-center justify-center rounded-md border"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 12.39a2 2 0 0 0 2 1.61h7.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
            <span className="absolute -right-1 -top-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1 text-xs font-semibold text-accent-foreground">
              {count}
            </span>
          </NavLink>
        </div>
      </div>

      {open && (
        <div className="border-t bg-background md:hidden">
          <nav className="mx-auto grid max-w-7xl gap-3 p-4">
            <div className="relative">
              <input
                placeholder="Search abayas, kaftans..."
                className="h-10 w-full rounded-md border bg-background px-3 pr-9 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
                onKeyDown={(e) => {
                  if ((e as any).key === "Enter") {
                    const q = (e.target as HTMLInputElement).value.trim();
                    navigate(q ? `/shop?search=${encodeURIComponent(q)}` : "/shop");
                    setOpen(false);
                  }
                }}
              />
              <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8" />
                  <path d="M21 21l-4.3-4.3" />
                </svg>
              </span>
            </div>
            {nav.map((n) => (
              <NavLink
                key={n.to}
                to={n.to}
                className={({ isActive }) =>
                  cn(
                    "rounded-md px-3 py-2 text-sm font-medium",
                    isActive
                      ? "bg-secondary text-foreground"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                  )
                }
                onClick={() => setOpen(false)}
              >
                {n.label}
              </NavLink>
            ))}
            <div className="mt-2 grid grid-cols-2 gap-2">
              <Link
                to="/account"
                className="rounded-md border px-3 py-2 text-sm"
              >
                Account
              </Link>
              <Link to="/cart" className="rounded-md border px-3 py-2 text-sm">
                Cart
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

function Footer() {
  return (
    <footer className="border-t bg-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 md:grid-cols-4">
        <div>
          <div className="mb-3 text-2xl font-extrabold font-['Playfair Display'] text-primary">
            PoshaBaya
          </div>
          <p className="text-sm text-muted-foreground">
            Exquisite abayas and modest fashion with a royal touch. Crafted for
            elegance, designed for comfort.
          </p>
          <div className="mt-4 flex gap-3">
            <a
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border"
              href="#"
              aria-label="Instagram"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <rect x="2" y="2" width="20" height="20" rx="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.5" y2="6.5" />
              </svg>
            </a>
            <a
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border"
              href="#"
              aria-label="TikTok"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M21 8.5a6.5 6.5 0 0 1-5-2.4V16a5 5 0 1 1-5-5c.35 0 .69.04 1 .12V8.18A8.5 8.5 0 1 0 20.88 9c.04-.17.08-.34.12-.5z" />
              </svg>
            </a>
          </div>
        </div>
        <div>
          <div className="mb-3 text-sm font-semibold uppercase tracking-wide text-foreground">
            Shop
          </div>
          <ul className="grid gap-2 text-sm text-muted-foreground">
            <li>
              <Link to="/shop">All Products</Link>
            </li>
            <li>
              <Link to="/new">New Arrivals</Link>
            </li>
            <li>
              <Link to="/bestsellers">Best Sellers</Link>
            </li>
            <li>
              <Link to="/sale">Sale</Link>
            </li>
          </ul>
        </div>
        <div>
          <div className="mb-3 text-sm font-semibold uppercase tracking-wide text-foreground">
            Company
          </div>
          <ul className="grid gap-2 text-sm text-muted-foreground">
            <li>
              <Link to="/about">About</Link>
            </li>
            <li>
              <Link to="/contact">Contact</Link>
            </li>
            <li>
              <Link to="/blog">Blog</Link>
            </li>
            <li>
              <Link to="/policies">Policies</Link>
            </li>
          </ul>
        </div>
        <div>
          <div className="mb-3 text-sm font-semibold uppercase tracking-wide text-foreground">
            Newsletter
          </div>
          <p className="text-sm text-muted-foreground">
            Join to receive exclusive offers and early access.
          </p>
          <form
            className="mt-3 flex gap-2"
            onSubmit={(e) => e.preventDefault()}
          >
            <input
              type="email"
              required
              placeholder="you@example.com"
              className="h-10 flex-1 rounded-md border bg-background px-3 text-sm"
            />
            <Button
              type="submit"
              className="bg-accent text-accent-foreground hover:bg-accent/90"
            >
              Subscribe
            </Button>
          </form>
        </div>
      </div>
      <div className="border-t py-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} PoshaBaya. All rights reserved.
      </div>
    </footer>
  );
}

export default function Layout() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="bg-gradient-to-r from-primary/10 via-transparent to-accent/10">
        <div className="mx-auto max-w-7xl px-4 py-2 text-center text-xs text-muted-foreground">
          Free express shipping on orders over ৳15,000 • 30-day returns •
          Premium packaging
        </div>
      </div>
      <Header />
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 md:py-12">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
