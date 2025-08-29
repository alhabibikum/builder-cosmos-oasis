import { useLocation, Link } from "react-router-dom";

export default function OrderConfirmation() {
  const params = new URLSearchParams(useLocation().search);
  const orderId = params.get("order") || "PB-ORDER";
  const last = (() => {
    try { return JSON.parse(localStorage.getItem("lastOrder") || "null"); } catch { return null; }
  })();
  const pay = last?.payment as { method?: string; mobile?: string; transactionId?: string; screenshotDataUrl?: string } | undefined;
  return (
    <section className="mx-auto max-w-xl py-16 text-center">
      <div className="font-['Playfair Display'] text-3xl font-extrabold tracking-tight">Thank you for your order</div>
      <p className="mt-2 text-muted-foreground">Your order <span className="font-semibold text-foreground">{orderId}</span> has been placed successfully. You will receive a confirmation email shortly.</p>
      {pay && (
        <div className="mx-auto mt-6 max-w-md rounded-md border p-4 text-left">
          <div className="mb-2 text-sm font-semibold">Payment</div>
          <div className="text-sm"><span className="text-muted-foreground">Method:</span> {pay.method?.toUpperCase()}</div>
          {pay.mobile && <div className="text-sm"><span className="text-muted-foreground">Mobile:</span> {pay.mobile}</div>}
          {pay.transactionId && <div className="text-sm"><span className="text-muted-foreground">Transaction ID:</span> {pay.transactionId}</div>}
          {pay.screenshotDataUrl && <img src={pay.screenshotDataUrl} className="mt-3 h-36 w-full rounded object-cover" />}
        </div>
      )}
      <div className="mt-6 flex justify-center gap-3">
        <Link to="/shop" className="rounded-md border px-5 py-2.5 text-sm font-semibold">Continue shopping</Link>
        <Link to="/account" className="rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground">View orders</Link>
      </div>
    </section>
  );
}
