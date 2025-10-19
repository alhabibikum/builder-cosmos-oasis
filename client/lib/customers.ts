import { getOrders } from "@/lib/orders";

export type CustomerStatus = "lead" | "active" | "vip" | "inactive" | "banned";
export interface Interaction {
  id: string;
  type: "note" | "call" | "email" | "meeting";
  note?: string;
  at: string; // ISO
}
export interface CustomerProfile {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  status: CustomerStatus;
  tags?: string[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
  lastInteractionAt?: string;
  interactions?: Interaction[];
}

const KEY = "customers";

export function loadCustomers(): CustomerProfile[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [] as CustomerProfile[];
  }
}
export function saveCustomers(list: CustomerProfile[]) {
  localStorage.setItem(KEY, JSON.stringify(list));
}
export function upsertCustomer(
  input: Partial<CustomerProfile>,
): CustomerProfile[] {
  const list = loadCustomers();
  const now = new Date().toISOString();
  if (!input.id) {
    const rec: CustomerProfile = {
      id: `CUS-${Math.random().toString(36).slice(2, 10).toUpperCase()}`,
      name: input.name?.trim() || "Unnamed",
      email: input.email?.trim() || undefined,
      phone: input.phone?.trim() || undefined,
      status: (input.status as CustomerStatus) || "lead",
      tags: input.tags || [],
      notes: input.notes || "",
      createdAt: now,
      updatedAt: now,
      lastInteractionAt: undefined,
      interactions: [],
    };
    list.unshift(rec);
    saveCustomers(list);
    return list;
  }
  const idx = list.findIndex((c) => c.id === input.id);
  if (idx >= 0) {
    const prev = list[idx];
    const next: CustomerProfile = {
      ...prev,
      ...input,
      name: (input.name ?? prev.name).trim(),
      email: input.email?.trim() || prev.email,
      phone: input.phone?.trim() || prev.phone,
      updatedAt: now,
    } as CustomerProfile;
    list[idx] = next;
  }
  saveCustomers(list);
  return list;
}
export function deleteCustomer(id: string): CustomerProfile[] {
  const list = loadCustomers().filter((c) => c.id !== id);
  saveCustomers(list);
  return list;
}
export function addInteraction(
  customerId: string,
  inter: Omit<Interaction, "id" | "at"> & { note?: string },
) {
  const list = loadCustomers();
  const idx = list.findIndex((c) => c.id === customerId);
  if (idx < 0) return list;
  const now = new Date().toISOString();
  const full: Interaction = {
    id: `INT-${Math.random().toString(36).slice(2, 10)}`,
    at: now,
    ...inter,
  };
  const c = list[idx];
  const interactions = [full, ...(c.interactions || [])].slice(0, 100);
  list[idx] = { ...c, interactions, lastInteractionAt: now, updatedAt: now };
  saveCustomers(list);
  return list;
}

export interface PurchaseStats {
  orders: number;
  spent: number;
}
export function getPurchaseStats(): Record<string, PurchaseStats> {
  const stats: Record<string, PurchaseStats> = {};
  const orders = getOrders() as any[];
  orders.forEach((o: any) => {
    const email = o?.shippingAddress?.email?.toLowerCase?.();
    const phone = o?.shippingAddress?.phone?.toString?.();
    const key = email || phone;
    if (!key) return;
    if (!stats[key]) stats[key] = { orders: 0, spent: 0 };
    stats[key].orders += 1;
    stats[key].spent += o?.totals?.total || 0;
  });
  return stats;
}
