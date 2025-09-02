import { Link } from "react-router-dom";
import { formatCurrency } from "@/lib/money";

interface OrderItem {
  product: { id: string; title: string; image: string; price: number };
  qty: number;
  size?: string;
}
interface Order {
  id: string;
  items: OrderItem[];
  totals: { subtotal: number; shipping: number; total: number };
  createdAt: string;
  payment?: any;
}

export default function Account() {
  const orders: Order[] = (() => {
    try {
      return JSON.parse(localStorage.getItem("orders") || "[]");
    } catch {
      return [];
    }
  })();

  if (orders.length === 0) {
    return (
      <section className="py-16 text-center">
        <div className="text-2xl font-semibold">No orders yet</div>
        <Link
          to="/shop"
          className="mt-3 inline-block text-primary underline-offset-4 hover:underline"
        >
          Start shopping
        </Link>
      </section>
    );
  }

  return (
    <section className="space-y-6">
      <h1 className="font-['Playfair Display'] text-3xl font-extrabold tracking-tight">
        Your Orders
      </h1>
      <div className="space-y-4">
        {orders.map((o) => (
          <div key={o.id} className="rounded-xl border p-4">
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">Order</div>
              <div className="text-sm font-semibold">{o.id}</div>
            </div>
            <div className="mt-3 grid gap-3">
              {o.items.map((i, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between text-sm"
                >
                  <div className="flex items-center gap-2">
                    <img
                      src={i.product.image}
                      loading="lazy"
                      decoding="async"
                      sizes="(max-width:640px) 20vw, 64px"
                      className="h-12 w-10 rounded object-cover"
                    />
                    <div>
                      <div className="line-clamp-1">{i.product.title}</div>
                      <div className="text-muted-foreground">
                        {i.qty} × {formatCurrency(i.product.price)}
                        {i.size ? ` • Size ${i.size}` : ""}
                      </div>
                    </div>
                  </div>
                  <div>{formatCurrency(i.product.price * i.qty)}</div>
                </div>
              ))}
            </div>
            <div className="mt-3 flex justify-end gap-6 text-sm">
              <div>
                Subtotal:{" "}
                <span className="font-semibold">
                  {formatCurrency(o.totals.subtotal)}
                </span>
              </div>
              <div>
                Shipping:{" "}
                <span className="font-semibold">
                  {o.totals.shipping === 0
                    ? "Free"
                    : formatCurrency(o.totals.shipping)}
                </span>
              </div>
              <div>
                Total:{" "}
                <span className="font-semibold">
                  {formatCurrency(o.totals.total)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
