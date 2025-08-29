import { useAuth } from "@/store/auth";
import { getOrders, saveOrders, type Order } from "@/lib/orders";
import { useMemo, useState } from "react";
import { formatCurrency } from "@/lib/money";
import { Navigate } from "react-router-dom";
import { products } from "@/data/products";
import { getStock, setStock } from "@/lib/inventory";
import PostManager from "@/components/admin/PostManager";
import ContentManager from "@/components/admin/ContentManager";

export default function AdminDashboard() {
  const { role } = useAuth();
  const [orders, setOrders] = useState<Order[]>(getOrders());
  const stats = useMemo(() => {
    const total = orders.reduce((s, o) => s + o.totals.total, 0);
    const pendingVerify = orders.filter((o) => !o.paymentVerified).length;
    const placed = orders.length;
    return { total, pendingVerify, placed };
  }, [orders]);

  if (role !== "admin") return <Navigate to="/login" replace />;

  const update = (idx: number, patch: Partial<Order>) => {
    const next = orders.slice();
    next[idx] = { ...next[idx], ...patch };
    setOrders(next);
    saveOrders(next);
  };

  return (
    <section className="space-y-6">
      <h1 className="font-['Playfair Display'] text-3xl font-extrabold tracking-tight">
        Admin Dashboard
      </h1>

      <div className="rounded-xl border">
        <div className="border-b p-4 font-semibold">Posts & Content</div>
        <div className="grid gap-6 p-4">
          <PostManager />
          <ContentManager />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border p-4">
          <div className="text-sm text-muted-foreground">Total Revenue</div>
          <div className="text-2xl font-semibold">
            {formatCurrency(stats.total)}
          </div>
        </div>
        <div className="rounded-xl border p-4">
          <div className="text-sm text-muted-foreground">Orders</div>
          <div className="text-2xl font-semibold">{stats.placed}</div>
        </div>
        <div className="rounded-xl border p-4">
          <div className="text-sm text-muted-foreground">
            Pending Verification
          </div>
          <div className="text-2xl font-semibold">{stats.pendingVerify}</div>
        </div>
      </div>

      <div className="rounded-xl border">
        <div className="border-b p-4 font-semibold">Inventory</div>
        <div className="divide-y">
          {products.map((p) => (
            <div
              key={p.id}
              className="grid gap-3 p-4 md:grid-cols-6 md:items-center"
            >
              <div className="font-semibold">{p.title}</div>
              <div className="text-sm text-muted-foreground">{p.id}</div>
              <div className="md:col-span-3 flex flex-wrap items-center gap-2">
                {p.sizes && p.sizes.length ? (
                  p.sizes.map((s) => (
                    <label
                      key={s}
                      className="inline-flex items-center gap-2 rounded-md border px-2 py-1 text-sm"
                    >
                      <span>{s}</span>
                      <input
                        type="number"
                        defaultValue={getStock(p.id, s)}
                        className="h-9 w-20 rounded-md border px-2"
                        onBlur={(e) =>
                          setStock(p.id, Number(e.target.value), s)
                        }
                      />
                    </label>
                  ))
                ) : (
                  <input
                    type="number"
                    defaultValue={getStock(p.id)}
                    className="h-9 w-24 rounded-md border px-2"
                    onBlur={(e) => setStock(p.id, Number(e.target.value))}
                  />
                )}
              </div>
              <div className="text-right text-sm">
                <button
                  className="rounded-md border px-3 py-2"
                  onClick={() => location.reload()}
                >
                  Refresh
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl border">
        <div className="border-b p-4 font-semibold">Orders</div>
        <div className="divide-y">
          {orders.map((o, idx) => (
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
          {orders.length === 0 && (
            <div className="p-6 text-center text-sm text-muted-foreground">
              No orders yet.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
