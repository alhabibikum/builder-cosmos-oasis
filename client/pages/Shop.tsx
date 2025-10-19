import ProductGrid from "@/components/site/ProductGrid";
import { getProducts } from "@/lib/catalog";
import { getStock } from "@/lib/inventory";
import { Slider } from "@/components/ui/slider";
import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";

const PAGE_SIZE = 12;

type SortKey =
  | "relevance"
  | "price-asc"
  | "price-desc"
  | "new"
  | "bestsellers"
  | "sale";

export default function Shop() {
  const { search } = useLocation();
  const navigate = useNavigate();
  const params = useMemo(() => new URLSearchParams(search), [search]);
  const q = (params.get("search") || "").toLowerCase();
  const pageParam = Math.max(1, parseInt(params.get("page") || "1") || 1);

  const all = useMemo(() => getProducts(), []);
  const categories = useMemo(
    () => Array.from(new Set(all.map((p) => p.category))),
    [all],
  );
  const minPrice = useMemo(() => Math.min(...all.map((p) => p.price)), [all]);
  const maxPrice = useMemo(() => Math.max(...all.map((p) => p.price)), [all]);

  const [category, setCategory] = useState<string>("all");
  const [price, setPrice] = useState<[number, number]>([minPrice, maxPrice]);
  const [inStock, setInStock] = useState(false);
  const [sort, setSort] = useState<SortKey>("relevance");

  useEffect(() => setPrice([minPrice, maxPrice]), [minPrice, maxPrice]);

  const available = (id: string, sizes?: string[]) => {
    if (sizes && sizes.length)
      return sizes.reduce((s, x) => s + getStock(id, x as any), 0);
    return getStock(id as any);
  };

  const filtered = useMemo(() => {
    return all.filter((p) => {
      if (category !== "all" && p.category !== category) return false;
      if (inStock && available(p.id, p.sizes) <= 0) return false;
      if (p.price < price[0] || p.price > price[1]) return false;
      if (!q) return true;
      return (
        p.title.toLowerCase().includes(q) ||
        (p.description || "").toLowerCase().includes(q) ||
        (p.tags || []).some((t) => t.toLowerCase().includes(q))
      );
    });
  }, [all, category, inStock, price, q]);

  const sorted = useMemo(() => {
    const list = filtered.slice();
    switch (sort) {
      case "price-asc":
        list.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        list.sort((a, b) => b.price - a.price);
        break;
      case "new":
        list.sort((a, b) => Number(b.isNew) - Number(a.isNew));
        break;
      case "bestsellers":
        list.sort((a, b) => Number(b.isBestSeller) - Number(a.isBestSeller));
        break;
      case "sale":
        list.sort((a, b) => Number(b.onSale) - Number(a.onSale));
        break;
      default:
        break;
    }
    return list;
  }, [filtered, sort]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const page = Math.min(totalPages, pageParam);
  const start = (page - 1) * PAGE_SIZE;
  const items = sorted.slice(start, start + PAGE_SIZE);

  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
      {/* Mobile Filters */}
      <details className="rounded-lg border md:hidden">
        <summary className="cursor-pointer select-none list-none rounded-lg px-4 py-3 text-sm font-semibold">Filters & Sort</summary>
        <div className="grid gap-6 border-t p-4">
          <FilterPanel />
        </div>
      </details>

      {/* Desktop Filters */}
      <aside className="hidden space-y-6 md:col-span-1 md:block">
        <FilterPanel />
      </aside>

      <section className="md:col-span-3">
        <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="font-['Playfair Display'] text-2xl font-extrabold tracking-tight md:text-3xl">
            {q ? `Search: ${q}` : "Shop"}
          </h1>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">Sort</span>
            <select
              className="h-9 rounded-md border px-2"
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
            >
              <option value="relevance">Relevance</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="new">New Arrivals</option>
              <option value="bestsellers">Best Sellers</option>
              <option value="sale">On Sale</option>
            </select>
          </div>
        </div>

        <ProductGrid items={items} />

        <div className="mt-6 flex items-center justify-between text-sm">
          <div className="text-muted-foreground">
            Showing {items.length} of {sorted.length}
          </div>
          <div className="inline-flex items-center gap-2">
            <button
              className="rounded-md border px-3 py-1 disabled:opacity-50"
              disabled={page <= 1}
              onClick={() =>
                navigate(
                  `/shop?search=${encodeURIComponent(q)}&page=${page - 1}`,
                )
              }
            >
              Prev
            </button>
            <span>
              Page {page} / {totalPages}
            </span>
            <button
              className="rounded-md border px-3 py-1 disabled:opacity-50"
              disabled={page >= totalPages}
              onClick={() =>
                navigate(
                  `/shop?search=${encodeURIComponent(q)}&page=${page + 1}`,
                )
              }
            >
              Next
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
