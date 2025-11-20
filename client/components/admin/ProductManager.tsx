import { useEffect, useMemo, useState } from "react";
import {
  getProducts,
  upsertProduct,
  deleteProduct,
  listCategories,
  setHidden,
  slugifyId,
  type ManagedProduct,
  exportOverrides,
  importOverrides,
  clearOverrides,
} from "@/lib/catalog";
import type { CatalogProduct } from "@/data/products";
import {
  getStock,
  setStock,
  exportInventory,
  importInventory,
  resetInventory,
} from "@/lib/inventory";

type Editable = ManagedProduct;

const EMPTY: Editable = {
  id: "",
  title: "",
  price: 0,
  image: "",
  images: [],
  description: "",
  category: "Abayas",
  isNew: false,
  isBestSeller: false,
  onSale: false,
  badge: "",
  colors: [],
  sizes: [],
  tags: [],
  hidden: false,
};

export default function ProductManager() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("all");
  const [editing, setEditing] = useState<Editable | null>(null);
  const [version, setVersion] = useState(0);

  const all = useMemo(() => getProducts({ includeHidden: true }), [version]);
  const categories = useMemo(() => ["all", ...listCategories()], [version]);

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === "catalog_overrides") setVersion((v) => v + 1);
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return all.filter((p) => {
      if (category !== "all" && p.category !== category) return false;
      if (!q) return true;
      return (
        p.title.toLowerCase().includes(q) ||
        (p.description || "").toLowerCase().includes(q) ||
        (p.tags || []).some((t) => t.toLowerCase().includes(q))
      );
    });
  }, [all, query, category]);

  const startNew = () => setEditing({ ...EMPTY });
  const duplicate = (p: CatalogProduct) =>
    setEditing({ ...(p as Editable), id: "", title: `${p.title} Copy` });

  const persist = () => {
    if (!editing) return;
    const id = editing.id?.trim() || slugifyId(editing.title);
    if (!editing.title.trim()) return alert("Title is required");
    if (!editing.image.trim()) return alert("Main image URL is required");
    if (!editing.price || editing.price < 0) return alert("Price must be >= 0");
    const toSave: Editable = {
      ...editing,
      id,
      images: normalizeList(editing.images),
      colors: normalizeList(editing.colors),
      tags: normalizeList(editing.tags),
      sizes: normalizeList(editing.sizes) as any,
      badge: editing.badge || undefined,
    } as Editable;
    upsertProduct(toSave);
    setVersion((v) => v + 1);
    setEditing({ ...toSave });
  };

  const remove = (id: string) => {
    if (
      !confirm(
        "Delete this product override? (Static products remain unaffected)",
      )
    )
      return;
    deleteProduct(id);
    setVersion((v) => v + 1);
    if (editing?.id === id) setEditing(null);
  };

  const toggleHidden = (p: Editable) => {
    setHidden(p.id, !p.hidden);
    setVersion((v) => v + 1);
    if (editing?.id === p.id) setEditing({ ...p, hidden: !p.hidden });
  };

  return (
    <div className="grid gap-6 md:grid-cols-5">
      <div className="md:col-span-2 rounded-xl border bg-white overflow-hidden flex flex-col">
        <div className="flex flex-col gap-2 border-b p-4 md:gap-1">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products..."
            className="h-10 rounded-lg border px-3 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
          <div className="flex gap-2">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="h-10 flex-1 rounded-lg border px-3 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <button
              className="h-10 rounded-lg border px-4 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
              onClick={startNew}
            >
              New
            </button>
          </div>
        </div>
        <div className="flex flex-col gap-1 border-b p-4 text-xs md:gap-1">
          <div className="flex flex-wrap gap-1">
            <button
              className="h-9 rounded-lg border px-2 font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
              onClick={() => alert(JSON.stringify(exportOverrides(), null, 2))}
            >
              Export
            </button>
            <button
              className="h-9 rounded-lg border px-2 font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
              onClick={() => {
                const text = prompt("Paste products JSON overrides array");
                if (!text) return;
                try {
                  const data = JSON.parse(text);
                  importOverrides(data);
                  setVersion((v) => v + 1);
                } catch (e) {
                  alert("Invalid JSON");
                }
              }}
            >
              Import
            </button>
            <button
              className="h-9 rounded-lg border px-2 font-medium text-red-600 transition-colors hover:bg-red-50"
              onClick={() => {
                if (!confirm("Clear all product overrides?")) return;
                clearOverrides();
                setVersion((v) => v + 1);
              }}
            >
              Reset
            </button>
          </div>
          <div className="flex flex-wrap gap-1">
            <button
              className="h-9 rounded-lg border px-2 font-medium text-xs transition-colors hover:bg-accent hover:text-accent-foreground"
              onClick={() => alert(JSON.stringify(exportInventory(), null, 2))}
            >
              Export Stock
            </button>
            <button
              className="h-9 rounded-lg border px-2 font-medium text-xs transition-colors hover:bg-accent hover:text-accent-foreground"
              onClick={() => {
                const text = prompt("Paste inventory JSON map");
                if (!text) return;
                try {
                  const data = JSON.parse(text);
                  importInventory(data);
                  setVersion((v) => v + 1);
                } catch (e) {
                  alert("Invalid JSON");
                }
              }}
            >
              Import Stock
            </button>
            <button
              className="h-9 rounded-lg border px-2 font-medium text-xs text-red-600 transition-colors hover:bg-red-50"
              onClick={() => {
                if (!confirm("Reset inventory to defaults?")) return;
                resetInventory();
                setVersion((v) => v + 1);
              }}
            >
              Reset Stock
            </button>
          </div>
        </div>
        <div className="divide-y flex-1 overflow-y-auto max-h-[600px]">
          {filtered.map((p) => (
            <button
              key={p.id}
              className={`w-full p-4 text-left text-sm transition-all hover:bg-accent/10 ${
                editing?.id === p.id ? "bg-primary/5 border-l-2 border-primary" : ""
              }`}
              onClick={() => setEditing(p as Editable)}
            >
              <div className="font-semibold line-clamp-1 text-foreground mb-1">{p.title}</div>
              <div className="text-xs text-muted-foreground mb-1">{p.id}</div>
              <div className="text-xs text-muted-foreground font-medium mb-2">
                {stockSummary(p as any)}
              </div>
              <div className="flex flex-wrap gap-1">
                <button
                  className="h-7 rounded-md border text-xs px-2 transition-colors hover:bg-accent hover:text-accent-foreground"
                  onClick={(e) => { e.stopPropagation(); duplicate(p); }}
                >
                  Dup
                </button>
                <button
                  className="h-7 rounded-md border text-xs px-2 transition-colors hover:bg-accent hover:text-accent-foreground"
                  onClick={(e) => { e.stopPropagation(); toggleHidden(p as Editable); }}
                >
                  {(p as Editable).hidden ? "Show" : "Hide"}
                </button>
                <button
                  className="h-7 rounded-md border text-xs px-2 text-red-600 transition-colors hover:bg-red-50"
                  onClick={(e) => { e.stopPropagation(); remove(p.id); }}
                >
                  Del
                </button>
              </div>
            </button>
          ))}
          {filtered.length === 0 && (
            <div className="p-6 text-center text-sm text-muted-foreground">
              No products found.
            </div>
          )}
        </div>
      </div>

      <div className="md:col-span-3 rounded-xl border bg-white overflow-hidden flex flex-col">
        <div className="border-b p-4 font-semibold text-foreground">Product Editor</div>
        {!editing ? (
          <div className="flex-1 flex items-center justify-center p-8 text-sm text-muted-foreground">
            Select a product to edit or create a new one.
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto grid gap-3 p-4 md:p-6">
            <div className="grid gap-3 md:grid-cols-2">
              <Field
                label="ID (slug)"
                hint="Leave blank to auto-generate from title"
              >
                <input
                  className="h-10 w-full rounded-md border px-2"
                  value={editing.id}
                  onChange={(e) =>
                    setEditing({ ...editing, id: e.target.value })
                  }
                />
              </Field>
              <Field label="Title">
                <input
                  className="h-10 w-full rounded-md border px-2"
                  value={editing.title}
                  onChange={(e) =>
                    setEditing({ ...editing, title: e.target.value })
                  }
                />
              </Field>
              <Field label="Price">
                <input
                  type="number"
                  min={0}
                  className="h-10 w-full rounded-md border px-2"
                  value={editing.price}
                  onChange={(e) =>
                    setEditing({ ...editing, price: Number(e.target.value) })
                  }
                />
              </Field>
              <Field label="Category">
                <input
                  list="catalog-categories"
                  className="h-10 w-full rounded-md border px-2"
                  value={editing.category}
                  onChange={(e) =>
                    setEditing({ ...editing, category: e.target.value as any })
                  }
                />
                <datalist id="catalog-categories">
                  {categories
                    .filter((c) => c !== "all")
                    .map((c) => (
                      <option key={c} value={c} />
                    ))}
                </datalist>
              </Field>
            </div>
            <Field label="Main Image URL">
              <input
                className="h-10 w-full rounded-md border px-2"
                value={editing.image}
                onChange={(e) =>
                  setEditing({ ...editing, image: e.target.value })
                }
              />
            </Field>
            <Field label="Additional Images (comma separated URLs)">
              <input
                className="h-10 w-full rounded-md border px-2"
                value={(editing.images || []).join(", ")}
                onChange={(e) =>
                  setEditing({
                    ...editing,
                    images: e.target.value
                      .split(",")
                      .map((s) => s.trim())
                      .filter(Boolean),
                  })
                }
              />
            </Field>
            <Field label="Description">
              <textarea
                className="min-h-[120px] w-full rounded-md border p-2"
                value={editing.description}
                onChange={(e) =>
                  setEditing({ ...editing, description: e.target.value })
                }
              />
            </Field>
            <div className="grid gap-3 md:grid-cols-3">
              <Field label="Sizes (comma separated)">
                <input
                  className="h-10 w-full rounded-md border px-2"
                  value={(editing.sizes || []).join(", ")}
                  onChange={(e) =>
                    setEditing({
                      ...editing,
                      sizes: e.target.value
                        .split(",")
                        .map((s) => s.trim())
                        .filter(Boolean) as any,
                    })
                  }
                />
              </Field>
              <Field label="Colors (comma separated hex)">
                <input
                  className="h-10 w-full rounded-md border px-2"
                  value={(editing.colors || []).join(", ")}
                  onChange={(e) =>
                    setEditing({
                      ...editing,
                      colors: e.target.value
                        .split(",")
                        .map((s) => s.trim())
                        .filter(Boolean),
                    })
                  }
                />
              </Field>
              <Field label="Tags (comma separated)">
                <input
                  className="h-10 w-full rounded-md border px-2"
                  value={(editing.tags || []).join(", ")}
                  onChange={(e) =>
                    setEditing({
                      ...editing,
                      tags: e.target.value
                        .split(",")
                        .map((s) => s.trim())
                        .filter(Boolean),
                    })
                  }
                />
              </Field>
            </div>
            <div className="grid gap-3 md:grid-cols-4">
              <Toggle
                label="New"
                checked={!!editing.isNew}
                onChange={(v) => setEditing({ ...editing, isNew: v })}
              />
              <Toggle
                label="Best Seller"
                checked={!!editing.isBestSeller}
                onChange={(v) => setEditing({ ...editing, isBestSeller: v })}
              />
              <Toggle
                label="On Sale"
                checked={!!editing.onSale}
                onChange={(v) => setEditing({ ...editing, onSale: v })}
              />
              <Field label="Badge">
                <input
                  className="h-10 w-full rounded-md border px-2"
                  value={editing.badge || ""}
                  onChange={(e) =>
                    setEditing({ ...editing, badge: e.target.value })
                  }
                />
              </Field>
            </div>
            <div className="grid gap-2 border-t pt-3">
              <div className="text-sm font-medium">Inventory</div>
              {!editing.id ? (
                <div className="text-xs text-muted-foreground">
                  Set an ID and save to manage stock.
                </div>
              ) : editing.sizes && editing.sizes.length ? (
                <div className="flex flex-wrap gap-2">
                  {editing.sizes.map((s) => (
                    <label
                      key={s}
                      className="inline-flex items-center gap-2 rounded-md border px-2 py-1 text-sm"
                    >
                      <span>{s}</span>
                      <input
                        type="number"
                        defaultValue={getStock(editing.id, s as any)}
                        className="h-9 w-20 rounded-md border px-2"
                        onBlur={(e) =>
                          setStock(editing.id, Number(e.target.value), s as any)
                        }
                      />
                    </label>
                  ))}
                </div>
              ) : (
                <div className="inline-flex items-center gap-2 rounded-md border px-2 py-1 text-sm">
                  <span>Total</span>
                  <input
                    type="number"
                    defaultValue={editing.id ? getStock(editing.id as any) : 0}
                    className="h-9 w-24 rounded-md border px-2"
                    onBlur={(e) =>
                      editing.id &&
                      setStock(editing.id as any, Number(e.target.value))
                    }
                  />
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 border-t pt-3">
              <label className="inline-flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={!!editing.hidden}
                  onChange={(e) =>
                    setEditing({ ...editing, hidden: e.target.checked })
                  }
                />
                Hidden
              </label>
              <button
                className="rounded-md border px-3 py-2 text-sm"
                onClick={persist}
              >
                Save
              </button>
              {editing.id && (
                <button
                  className="rounded-md border px-3 py-2 text-sm text-red-600"
                  onClick={() => remove(editing.id)}
                >
                  Delete Override
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="grid gap-1 text-sm">
      <span className="text-xs">
        {label}
        {hint ? (
          <span className="ml-1 text-muted-foreground">({hint})</span>
        ) : null}
      </span>
      {children}
    </label>
  );
}

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="inline-flex items-center gap-2 text-sm">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      {label}
    </label>
  );
}

function stockSummary(p: CatalogProduct): string {
  if (p.sizes && p.sizes.length) {
    const parts = p.sizes.map((s) => `${s}:${getStock(p.id, s as any)}`);
    return `Stock ${parts.join(" ")}`;
  }
  return `Stock ${getStock(p.id)}`;
}

function normalizeList(input: any): string[] {
  if (!input) return [];
  if (Array.isArray(input))
    return input.map((s) => String(s).trim()).filter(Boolean);
  if (typeof input === "string")
    return input
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  return [];
}
