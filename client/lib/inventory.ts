import { getProducts } from "@/lib/catalog";
import type { Size } from "@/data/products";

export type InventoryMap = Record<
  string,
  { bySize?: Record<string, number>; total?: number }
>;

export interface InventoryEvent {
  id: string;
  size?: Size;
  delta: number; // change applied
  qtyAfter: number; // resulting quantity
  reason?: string;
  at: string; // ISO timestamp
}

const KEY = "inventory";
const KEY_THRESH = "inventory_thresholds";
const KEY_HISTORY = "inventory_history";
const DEFAULT_STOCK = 10;
const DEFAULT_THRESHOLD = 3;

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

export function setStock(id: string, qty: number, size?: Size, reason?: string) {
  const inv = getInventory();
  const prev = getStock(id, size);
  const rec = inv[id] || {};
  const nextQty = Math.max(0, Math.floor(qty));
  if (size) {
    rec.bySize = rec.bySize || {};
    rec.bySize[size] = nextQty;
  } else {
    rec.total = nextQty;
  }
  inv[id] = rec;
  saveInventory(inv);
  logInventoryEvent({ id, size, delta: nextQty - prev, qtyAfter: nextQty, reason });
}

export function adjustStock(id: string, delta: number, size?: Size, reason?: string) {
  const current = getStock(id, size);
  setStock(id, current + delta, size, reason);
}

export function availableFor(id: string, requested: number, size?: Size) {
  const stock = getStock(id, size);
  return Math.max(0, Math.min(stock, requested));
}

export function getThresholds(): Record<string, number> {
  try {
    const raw = localStorage.getItem(KEY_THRESH);
    const parsed = raw ? (JSON.parse(raw) as Record<string, number>) : {};
    return parsed || {};
  } catch {
    return {};
  }
}
export function getThreshold(id: string): number {
  const map = getThresholds();
  return typeof map[id] === "number" ? map[id] : DEFAULT_THRESHOLD;
}
export function setThreshold(id: string, n: number) {
  const map = getThresholds();
  map[id] = Math.max(0, Math.floor(n));
  localStorage.setItem(KEY_THRESH, JSON.stringify(map));
}

export function logInventoryEvent(e: Omit<InventoryEvent, "at">) {
  const list = getInventoryHistory();
  const rec: InventoryEvent = { ...e, at: new Date().toISOString() };
  list.unshift(rec);
  localStorage.setItem(KEY_HISTORY, JSON.stringify(list.slice(0, 500)));
}
export function getInventoryHistory(): InventoryEvent[] {
  try {
    const raw = localStorage.getItem(KEY_HISTORY);
    const arr = raw ? (JSON.parse(raw) as InventoryEvent[]) : [];
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}
export function clearInventoryHistory() {
  localStorage.removeItem(KEY_HISTORY);
}
