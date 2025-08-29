import { Link } from "react-router-dom";
import { useCart } from "@/store/cart";
import { formatCurrency } from "@/lib/money";

export default function Cart() {
  const { detailed, updateQty, remove, total } = useCart();
  if (detailed.length === 0)
    return (
      <div className="py-16 text-center">
        <div className="text-2xl font-semibold">Your cart is empty</div>
        <Link to="/shop" className="mt-3 inline-block text-primary underline-offset-4 hover:underline">Continue shopping</Link>
      </div>
    );

  return (
    <div className="grid gap-8 md:grid-cols-3">
      <section className="space-y-4 md:col-span-2">
        {detailed.map((i) => (
          <div key={i.productId} className="flex items-center gap-4 rounded-xl border p-3">
            <img src={i.product.image} alt={i.product.title} className="h-24 w-20 rounded-md object-cover" />
            <div className="flex-1">
              <div className="font-medium">{i.product.title}</div>
              <div className="text-sm text-muted-foreground">{i.size ? `Size ${i.size} • ` : ""}{i.qty} × {formatCurrency(i.product.price)}</div>
              <button onClick={() => remove(i.productId)} className="mt-1 text-sm text-destructive underline-offset-4 hover:underline">Remove</button>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => updateQty(i.productId, Math.max(1, i.qty - 1))} className="rounded-md border px-2 py-1">-</button>
              <span className="w-6 text-center">{i.qty}</span>
              <button onClick={() => updateQty(i.productId, i.qty + 1)} className="rounded-md border px-2 py-1">+</button>
            </div>
            <div className="w-28 text-right font-semibold">{formatCurrency(i.product.price * i.qty)}</div>
          </div>
        ))}
      </section>
      <aside className="rounded-xl border p-4">
        <div className="mb-2 text-lg font-semibold">Order Summary</div>
        <div className="flex justify-between text-sm"><span>Subtotal</span><span>{formatCurrency(total)}</span></div>
        <div className="flex justify-between text-sm text-muted-foreground"><span>Shipping</span><span>{total >= 15000 ? "Free" : formatCurrency(150)}</span></div>
        <div className="mt-2 flex justify-between border-t pt-2 font-semibold"><span>Total</span><span>{formatCurrency(total + (total >= 15000 ? 0 : 150))}</span></div>
        <Link to="/checkout" className="mt-4 inline-flex w-full items-center justify-center rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground">Checkout</Link>
        <Link to="/shop" className="mt-2 inline-flex w-full items-center justify-center rounded-md border px-5 py-2.5 text-sm font-semibold">Continue shopping</Link>
      </aside>
    </div>
  );
}
