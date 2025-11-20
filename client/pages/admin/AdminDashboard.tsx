import { useAuth } from "@/store/auth";
import { getOrders, saveOrders, type Order } from "@/lib/orders";
import { useMemo, useState } from "react";
import { formatCurrency } from "@/lib/money";
import { Navigate } from "react-router-dom";
import ProductManager from "@/components/admin/ProductManager";
import PostManager from "@/components/admin/PostManager";
import ContentManager from "@/components/admin/ContentManager";
import CustomerManager from "@/components/admin/CustomerManager";
import InventoryManager from "@/components/admin/InventoryManager";
import SidebarNav from "@/components/admin/SidebarNav";
import AdminSidebarLayout from "@/components/admin/AdminSidebarLayout";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import DashboardHeader from "@/components/admin/DashboardHeader";

export default function AdminDashboard() {
  const { role } = useAuth();
  const [orders, setOrders] = useState<Order[]>(getOrders());
  const [orderQuery, setOrderQuery] = useState("");
  const [orderStatus, setOrderStatus] = useState<
    "all" | "placed" | "processing" | "shipped" | "delivered" | "cancelled"
  >("all");
  const stats = useMemo(() => {
    const total = orders.reduce((s, o) => s + o.totals.total, 0);
    const pendingVerify = orders.filter((o) => !o.paymentVerified).length;
    const placed = orders.length;
    return { total, pendingVerify, placed };
  }, [orders]);
  const filteredOrders = useMemo(() => {
    const q = orderQuery.toLowerCase();
    return orders.filter((o) => {
      if (orderStatus !== "all" && o.status !== orderStatus) return false;
      if (!q) return true;
      return (
        o.id.toLowerCase().includes(q) ||
        o.items.some((i) => i.product.title.toLowerCase().includes(q)) ||
        o.payment.method.toLowerCase().includes(q)
      );
    });
  }, [orders, orderQuery, orderStatus]);

  if (role !== "admin") return <Navigate to="/login" replace />;

  const update = (idx: number, patch: Partial<Order>) => {
    const next = orders.slice();
    next[idx] = { ...next[idx], ...patch };
    setOrders(next);
    saveOrders(next);
  };

  return (
    <section className="space-y-6">
      <DashboardHeader
        title="Admin Dashboard"
        subtitle="Manage customers, products, orders, inventory, posts and site content."
      />

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-xl border bg-white p-5 md:p-6 transition-all hover:shadow-md hover:border-primary/20">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-muted-foreground mb-2">
                Total Revenue
              </p>
              <h3 className="text-2xl md:text-3xl font-bold text-foreground">
                {formatCurrency(stats.total)}
              </h3>
            </div>
            <div className="rounded-lg bg-primary/10 p-3">
              <svg
                className="w-6 h-6 text-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="rounded-xl border bg-white p-5 md:p-6 transition-all hover:shadow-md hover:border-primary/20">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-muted-foreground mb-2">
                Total Orders
              </p>
              <h3 className="text-2xl md:text-3xl font-bold text-foreground">
                {stats.placed}
              </h3>
            </div>
            <div className="rounded-lg bg-blue-100 p-3">
              <svg
                className="w-6 h-6 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="rounded-xl border bg-white p-5 md:p-6 transition-all hover:shadow-md hover:border-primary/20">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-muted-foreground mb-2">
                Pending Verification
              </p>
              <h3 className="text-2xl md:text-3xl font-bold text-orange-600">
                {stats.pendingVerify}
              </h3>
            </div>
            <div className="rounded-lg bg-orange-100 p-3">
              <svg
                className="w-6 h-6 text-orange-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <AdminSidebarLayout
        overview={
          <div className="rounded-xl border p-4 text-sm text-muted-foreground">
            Use the sidebar to manage every part of the shop: products,
            inventory, orders, homepage content and blog posts.
          </div>
        }
        customers={
          <div className="rounded-xl border p-2 md:p-4">
            <CustomerManager />
          </div>
        }
        products={
          <div className="rounded-xl border p-2 md:p-4">
            <ProductManager />
          </div>
        }
        orders={
          <div className="rounded-xl border bg-white overflow-hidden">
            <div className="flex flex-col gap-3 border-b p-4 md:flex-row md:items-center md:gap-2">
              <input
                value={orderQuery}
                onChange={(e) => setOrderQuery(e.target.value)}
                placeholder="Search orders by ID, product or method..."
                className="h-10 flex-1 rounded-lg border px-3 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
              <select
                value={orderStatus}
                onChange={(e) => setOrderStatus(e.target.value as any)}
                className="h-10 rounded-lg border px-3 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="all">All Status</option>
                <option value="placed">Placed</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <button
                className="rounded-lg border px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
                onClick={() => alert(JSON.stringify(filteredOrders, null, 2))}
              >
                Export
              </button>
            </div>
            <div className="divide-y">
              {filteredOrders.map((o, idx) => (
                <div
                  key={o.id}
                  className="grid gap-3 p-4 md:grid-cols-7 md:items-center"
                >
                  <div className="md:col-span-2">
                    <div className="text-sm font-semibold text-foreground">
                      {o.id}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(o.createdAt).toLocaleString()}
                    </div>
                    <div className="text-xs text-muted-foreground font-medium">
                      {o.payment.method.toUpperCase()}
                    </div>
                  </div>
                  <div className="text-sm text-foreground">
                    {o.items[0]?.product.title}{" "}
                    {o.items.length > 1 ? `+${o.items.length - 1} more` : ""}
                  </div>
                  <div className="text-sm font-semibold text-foreground">
                    {formatCurrency(o.totals.total)}
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="text-xs text-muted-foreground">
                      Verified
                    </label>
                    <input
                      type="checkbox"
                      checked={o.paymentVerified}
                      onChange={(e) =>
                        update(idx, { paymentVerified: e.target.checked })
                      }
                      className="h-4 w-4"
                    />
                  </div>
                  <div>
                    <select
                      className="h-9 rounded-lg border px-2 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20"
                      value={o.status}
                      onChange={(e) =>
                        update(idx, { status: e.target.value as any })
                      }
                    >
                      <option value="placed">Placed</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                  <div className="text-right">
                    <button
                      className="text-sm text-primary font-medium hover:underline"
                      onClick={(e) => {
                        e.preventDefault();
                        alert(JSON.stringify(o, null, 2));
                      }}
                    >
                      View
                    </button>
                  </div>
                </div>
              ))}
              {filteredOrders.length === 0 && (
                <div className="p-8 text-center text-sm text-muted-foreground">
                  No orders found.
                </div>
              )}
            </div>
          </div>
        }
        inventory={
          <div className="rounded-xl border p-2 md:p-4">
            <InventoryManager />
          </div>
        }
        content={
          <div className="grid gap-6">
            <div className="rounded-xl border p-2 md:p-4">
              <PostManager />
            </div>
            <div className="rounded-xl border p-2 md:p-4">
              <ContentManager />
            </div>
          </div>
        }
      />
    </section>
  );
}
