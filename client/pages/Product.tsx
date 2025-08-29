import { useParams, Link } from "react-router-dom";
import { products } from "@/data/products";
import { useState } from "react";
import { useCart } from "@/store/cart";
import { formatCurrency } from "@/lib/money";

export default function Product() {
  const { id } = useParams();
  const product = products.find((p) => p.id === id);
  const { add } = useCart();
  const [qty, setQty] = useState(1);
  const [size, setSize] = useState<string | undefined>(product?.sizes?.[0]);

  if (!product) {
    return (
      <div className="py-16 text-center">
        <div className="text-2xl font-semibold">Product not found</div>
        <Link to="/shop" className="mt-3 inline-block text-primary underline-offset-4 hover:underline">Back to Shop</Link>
      </div>
    );
  }

  return (
    <div className="grid gap-8 md:grid-cols-2">
      <div className="grid gap-3">
        <img src={product.image} alt={product.title} className="aspect-[4/5] w-full rounded-xl border object-cover" />
        {product.images?.slice(1).map((src) => (
          <img key={src} src={src} alt={product.title} className="aspect-[4/5] w-full rounded-xl border object-cover" />
        ))}
      </div>
      <div className="space-y-6">
        <div>
          <h1 className="font-['Playfair Display'] text-3xl font-extrabold tracking-tight md:text-4xl">{product.title}</h1>
          <div className="mt-2 text-2xl font-semibold">{formatCurrency(product.price)}</div>
        </div>
        <p className="text-muted-foreground">{product.description}</p>
        {product.sizes && (
          <div>
            <div className="mb-2 text-sm font-medium">Size</div>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((s) => (
                <button key={s} onClick={() => setSize(s)} className={`rounded-md border px-3 py-2 text-sm ${size === s ? "border-primary" : ""}`}>{s}</button>
              ))}
            </div>
          </div>
        )}
        <div>
          <div className="mb-2 text-sm font-medium">Quantity</div>
          <div className="inline-flex items-center gap-2 rounded-md border px-2 py-1">
            <button onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Decrease" className="px-2 py-1">-</button>
            <span className="min-w-6 text-center">{qty}</span>
            <button onClick={() => setQty((q) => q + 1)} aria-label="Increase" className="px-2 py-1">+</button>
          </div>
        </div>
        <div className="flex gap-3">
          <button onClick={() => add(product.id, qty, size)} className="inline-flex flex-1 items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground">Add to Cart</button>
          <Link to="/checkout" className="inline-flex items-center justify-center rounded-md border px-6 py-3 text-sm font-semibold">Buy Now (COD/Manual)</Link>
        </div>
        <div className="text-sm text-muted-foreground">Free express shipping on orders over $150 • 30-day returns</div>
      </div>
    </div>
  );
}
