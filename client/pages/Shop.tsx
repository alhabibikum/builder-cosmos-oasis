import ProductGrid from "@/components/site/ProductGrid";
import { getProducts } from "@/lib/catalog";
import { useMemo } from "react";
import { useLocation, Link } from "react-router-dom";

export default function Shop() {
  const { search } = useLocation();
  const q = useMemo(
    () => new URLSearchParams(search).get("search")?.toLowerCase() || "",
    [search],
  );
  const filtered = useMemo(
    () =>
      q
        ? getProducts().filter(
            (p) =>
              p.title.toLowerCase().includes(q) ||
              p.tags?.some((t) => t.toLowerCase().includes(q)),
          )
        : getProducts(),
    [q],
  );

  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
      <aside className="space-y-6 md:col-span-1">
        <div>
          <div className="mb-2 text-sm font-semibold uppercase tracking-wide">
            Categories
          </div>
          <ul className="space-y-2 text-sm text-muted-foreground">
            {Array.from(new Set(getProducts().map((p) => p.category))).map(
              (c) => (
                <li key={c}>
                  <Link
                    to={`/shop?search=${encodeURIComponent(c)}`}
                    className="hover:text-foreground"
                  >
                    {c}
                  </Link>
                </li>
              ),
            )}
          </ul>
        </div>
        <div>
          <div className="mb-2 text-sm font-semibold uppercase tracking-wide">
            Quick links
          </div>
          <div className="grid gap-2 text-sm">
            <Link to="/new" className="hover:underline">
              New Arrivals
            </Link>
            <Link to="/bestsellers" className="hover:underline">
              Best Sellers
            </Link>
            <Link to="/sale" className="hover:underline">
              Sale
            </Link>
          </div>
        </div>
      </aside>
      <section className="md:col-span-3">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="font-['Playfair Display'] text-2xl font-extrabold tracking-tight md:text-3xl">
            {q ? `Search: ${q}` : "Shop"}
          </h1>
        </div>
        <ProductGrid filter={(p) => filtered.includes(p)} />
      </section>
    </div>
  );
}
