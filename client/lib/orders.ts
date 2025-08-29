import { type ManualPaymentData } from "@/components/site/PaymentMethods";
import { type CatalogProduct } from "@/data/products";

export type OrderStatus = "placed" | "processing" | "shipped" | "delivered" | "cancelled";
export interface OrderItem { product: CatalogProduct; qty: number; size?: string }
export interface Order {
  id: string;
  items: OrderItem[];
  totals: { subtotal: number; shipping: number; total: number };
  payment: ManualPaymentData;
  status: OrderStatus;
  paymentVerified: boolean;
  createdAt: string;
}

export function getOrders(): Order[] {
  try { return JSON.parse(localStorage.getItem("orders") || "[]"); } catch { return []; }
}
export function saveOrders(list: Order[]) {
  localStorage.setItem("orders", JSON.stringify(list));
}
export function upsertOrder(o: Order) {
  const list = getOrders();
  const idx = list.findIndex((x) => x.id === o.id);
  if (idx >= 0) list[idx] = o; else list.unshift(o);
  saveOrders(list.slice(0, 200));
}
