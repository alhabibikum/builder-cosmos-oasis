import { useAuth } from "@/store/auth";
import { getOrders, saveOrders, type Order } from "@/lib/orders";
import { useMemo, useState } from "react";
import { formatCurrency } from "@/lib/money";
import { Navigate } from "react-router-dom";
import { getProducts } from "@/lib/catalog";
import { getStock, setStock } from "@/lib/inventory";
import ProductManager from "@/components/admin/ProductManager";
import PostManager from "@/components/admin/PostManager";
import ContentManager from "@/components/admin/ContentManager";
import CustomerManager from "@/components/admin/CustomerManager";
import InventoryManager from "@/components/admin/InventoryManager";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
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

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border p-4 transition-shadow hover:shadow-sm">
          <div className="text-sm text-muted-foreground">Total Revenue</div>
          <div className="text-2xl font-semibold">
            {formatCurrency(stats.total)}
          </div>
        </div>
        <div className="rounded-xl border p-4 transition-shadow hover:shadow-sm">
          <div className="text-sm text-muted-foreground">Orders</div>
          <div className="text-2xl font-semibold">{stats.placed}</div>
        </div>
        <div className="rounded-xl border p-4 transition-shadow hover:shadow-sm">
          <div className="text-sm text-muted-foreground">
            Pending Verification
          </div>
          <div className="text-2xl font-semibold">{stats.pendingVerify}</div>
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="mb-2 sticky top-16 z-10 bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/60 border rounded-lg shadow-sm">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="customers">Customers</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="content">Posts & Content</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <div className="rounded-xl border p-4 text-sm text-muted-foreground">
            Use the tabs to manage every part of the shop: products, inventory,
            orders, homepage content and blog posts.
          </div>
        </TabsContent>
        <TabsContent value="customers">
          <div className="rounded-xl border p-2 md:p-4">
            <CustomerManager />
          </div>
        </TabsContent>
        <TabsContent value="products">
          <div className="rounded-xl border p-2 md:p-4">
            <ProductManager />
          </div>
        </TabsContent>
        <TabsContent value="orders">
          <div className="rounded-xl border">
            <div className="flex flex-wrap items-center gap-2 border-b p-3">
              <input
                value={orderQuery}
                onChange={(e) => setOrderQuery(e.target.value)}
                placeholder="Search orders by ID, product or method..."
                className="h-9 flex-1 rounded-md border px-2 text-sm"
              />
              <select
                value={orderStatus}
                onChange={(e) => setOrderStatus(e.target.value as any)}
                className="h-9 rounded-md border px-2 text-sm"
              >
                <option value="all">All</option>
                <option value="placed">Placed</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <button
                className="rounded-md border px-3 py-2 text-sm"
                onClick={() => alert(JSON.stringify(filteredOrders, null, 2))}
              >
                Export JSON
              </button>
            </div>
            <div className="divide-y">
              {filteredOrders.map((o, idx) => (
                <div
                  key={o.id}
                  className="grid gap-3 p-4 md:grid-cols-7 md:items-center"
                >
                  <div className="md:col-span-2">
                    <div className="text-sm font-semibold">{o.id}</div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(o.createdAt).toLocaleString()}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {o.payment.method.toUpperCase()}
                    </div>
                  </div>
                  <div className="text-sm">
                    {o.items[0]?.product.title}{" "}
                    {o.items.length > 1 ? `+${o.items.length - 1} more` : ""}
                  </div>
                  <div className="text-sm font-semibold">
                    {formatCurrency(o.totals.total)}
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="text-xs">Verified</label>
                    <input
                      type="checkbox"
                      checked={o.paymentVerified}
                      onChange={(e) =>
                        update(idx, { paymentVerified: e.target.checked })
                      }
                    />
                  </div>
                  <div>
                    <select
                      className="h-10 rounded-md border px-2 text-sm"
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
                    <a
                      className="text-sm text-primary underline"
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        alert(JSON.stringify(o, null, 2));
                      }}
                    >
                      View
                    </a>
                  </div>
                </div>
              ))}
              {filteredOrders.length === 0 && (
                <div className="p-6 text-center text-sm text-muted-foreground">
                  No orders found.
                </div>
              )}
            </div>
          </div>
        </TabsContent>
        <TabsContent value="inventory">
          <div className="rounded-xl border p-2 md:p-4">
            <InventoryManager />
          </div>
        </TabsContent>
        <TabsContent value="content">
          <div className="grid gap-6">
            <div className="rounded-xl border p-2 md:p-4">
              <PostManager />
            </div>
            <div className="rounded-xl border p-2 md:p-4">
              <ContentManager />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </section>
  );
}
