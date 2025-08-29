import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { products, type CatalogProduct } from "@/data/products";

export interface CartItem {
  productId: string;
  qty: number;
  size?: string;
}

interface CartState {
  items: CartItem[];
  add: (id: string, qty?: number, size?: string) => void;
  remove: (id: string) => void;
  updateQty: (id: string, qty: number) => void;
  clear: () => void;
  total: number;
  count: number;
  detailed: (CartItem & { product: CatalogProduct })[];
}

const CartContext = createContext<CartState | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const raw = localStorage.getItem("cart");
      const parsed = raw ? (JSON.parse(raw) as CartItem[]) : [];
      if (!Array.isArray(parsed)) return [];
      // Filter out entries that don't match current catalog
      return parsed.filter((i) => !!products.find((p) => p.id === i.productId) && typeof i.qty === "number" && i.qty > 0);
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(items));
  }, [items]);

  const add = (id: string, qty = 1, size?: string) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.productId === id && i.size === size);
      if (existing) {
        return prev.map((i) => (i === existing ? { ...i, qty: i.qty + qty } : i));
      }
      return [...prev, { productId: id, qty, size }];
    });
  };
  const remove = (id: string) => setItems((p) => p.filter((i) => i.productId !== id));
  const updateQty = (id: string, qty: number) => setItems((p) => p.map((i) => (i.productId === id ? { ...i, qty } : i)));
  const clear = () => setItems([]);

  const detailed = useMemo(() => {
    return items
      .map((i) => {
        const product = products.find((p) => p.id === i.productId);
        return product ? { ...i, product } : null;
      })
      .filter(Boolean) as (CartItem & { product: CatalogProduct })[];
  }, [items]);

  const total = useMemo(() => detailed.reduce((sum, i) => sum + (i.product?.price || 0) * i.qty, 0), [detailed]);
  const count = useMemo(() => items.reduce((sum, i) => sum + i.qty, 0), [items]);

  const value: CartState = { items, add, remove, updateQty, clear, total, count, detailed };
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
