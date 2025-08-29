import { getProducts } from "@/lib/catalog";
import type { Size } from "@/data/products";

export type InventoryMap = Record<
  string,
  { bySize?: Record<string, number>; total?: number }
>;

const KEY = "inventory";
const DEFAULT_STOCK = 10;

function seed(): InventoryMap {
  const map: InventoryMap = {};
  getProducts({ includeHidden: true }).forEach((p) => {
    if (p.sizes && p.sizes.length) {
      const bySize: Record<string, number> = {};
      p.sizes.forEach((s) => (bySize[s] = DEFAULT_STOCK));
      map[p.id] = { bySize };
    } else {
      map[p.id] = { total: DEFAULT_STOCK };
    }
  });
  return map;
}

export function getInventory(): InventoryMap {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return seed();
    const parsed = JSON.parse(raw) as InventoryMap;
    return { ...seed(), ...parsed };
  } catch {
    return seed();
  }
}

export function saveInventory(inv: InventoryMap) {
  localStorage.setItem(KEY, JSON.stringify(inv));
}

export function exportInventory(): InventoryMap {
  return getInventory();
}

export function importInventory(input: unknown) {
  const obj = (
    input && typeof input === "object" ? (input as InventoryMap) : {}
  ) as InventoryMap;
  const allowed = new Set(
    getProducts({ includeHidden: true }).map((p) => p.id),
  );
  const next: InventoryMap = {};
  Object.entries(obj).forEach(([id, rec]) => {
    if (!allowed.has(id)) return;
    const bySize =
      rec?.bySize && typeof rec.bySize === "object" ? rec.bySize : undefined;
    const total = typeof rec?.total === "number" ? rec.total : undefined;
    next[id] = {
      ...(bySize ? { bySize } : {}),
      ...(total !== undefined ? { total } : {}),
    };
  });
  saveInventory(next);
}

export function resetInventory() {
  localStorage.removeItem(KEY);
}

export function getStock(id: string, size?: Size): number {
  const inv = getInventory();
  const rec = inv[id];
  if (!rec) return 0;
  if (size && rec.bySize) return rec.bySize[size] ?? 0;
  return rec.total ?? 0;
}

export function setStock(id: string, qty: number, size?: Size) {
  const inv = getInventory();
  const rec = inv[id] || {};
  if (size) {
    rec.bySize = rec.bySize || {};
    rec.bySize[size] = Math.max(0, Math.floor(qty));
  } else {
    rec.total = Math.max(0, Math.floor(qty));
  }
  inv[id] = rec;
  saveInventory(inv);
}

export function adjustStock(id: string, delta: number, size?: Size) {
  const current = getStock(id, size);
  setStock(id, current + delta, size);
}

export function availableFor(id: string, requested: number, size?: Size) {
  const stock = getStock(id, size);
  return Math.max(0, Math.min(stock, requested));
}
