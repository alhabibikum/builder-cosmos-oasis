import { useAuth } from "@/store/auth";
import { getOrders, saveOrders, type Order } from "@/lib/orders";
import { Link, Navigate } from "react-router-dom";
import { formatCurrency } from "@/lib/money";

export default function UserDashboard() {
  const { role, user } = useAuth();
  if (role === "guest") return <Navigate to="/login" replace />;
  const orders = getOrders();

  const cancel = (id: string) => {
    const list = getOrders();
    const idx = list.findIndex((o) => o.id === id);
    if (idx >= 0 && ["placed", "processing"].includes(list[idx].status)) {
      list[idx].status = "cancelled";
      saveOrders(list);
      location.reload();
    } else {
      alert("Order can no longer be cancelled.");
    }
  };

  return (
    <section className="space-y-6">
      <h1 className="font-['Playfair Display'] text-3xl font-extrabold tracking-tight">
        Welcome, {user?.name || "Customer"}
      </h1>
      <div className="rounded-xl border">
        <div className="border-b p-4 font-semibold">Recent Orders</div>
        <div className="divide-y">
          {orders.map((o) => (
            <div
              key={o.id}
              className="grid gap-3 p-4 md:grid-cols-6 md:items-center"
            >
              <div className="text-sm font-semibold">{o.id}</div>
              <div className="text-sm">
                {new Date(o.createdAt).toLocaleDateString()}
              </div>
              <div className="text-sm">{o.status}</div>
              <div className="text-sm">
                {o.payment.method.toUpperCase()}{" "}
                {o.paymentVerified ? "✓" : "• pending"}
              </div>
              <div className="text-sm font-semibold">
                {formatCurrency(o.totals.total)}
              </div>
              <div className="text-right">
                {["placed", "processing"].includes(o.status) && (
                  <button
                    onClick={() => cancel(o.id)}
                    className="rounded-md border px-3 py-2 text-sm"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          ))}
          {orders.length === 0 && (
            <div className="p-6 text-center text-sm text-muted-foreground">
              No orders yet.{" "}
              <Link to="/shop" className="underline">
                Shop now
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
