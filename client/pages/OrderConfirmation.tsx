import { useLocation, Link } from "react-router-dom";

export default function OrderConfirmation() {
  const params = new URLSearchParams(useLocation().search);
  const order = params.get("order") || "PB-ORDER";
  return (
    <section className="mx-auto max-w-xl py-16 text-center">
      <div className="font-['Playfair Display'] text-3xl font-extrabold tracking-tight">Thank you for your order</div>
      <p className="mt-2 text-muted-foreground">Your order <span className="font-semibold text-foreground">{order}</span> has been placed successfully. You will receive a confirmation email shortly.</p>
      <div className="mt-6 flex justify-center gap-3">
        <Link to="/shop" className="rounded-md border px-5 py-2.5 text-sm font-semibold">Continue shopping</Link>
        <Link to="/account" className="rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground">View orders</Link>
      </div>
    </section>
  );
}
