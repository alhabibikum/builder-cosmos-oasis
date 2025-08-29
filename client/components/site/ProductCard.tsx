import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useCart } from "@/store/cart";

export interface Product {
  id: string;
  title: string;
  price: number;
  image: string;
  badge?: string;
}

export default function ProductCard({ product }: { product: Product }) {
  const { add } = useCart();
  return (
    <div className="group overflow-hidden rounded-xl border bg-card">
      <Link to={`/product/${product.id}`} className="relative block aspect-[4/5] w-full overflow-hidden">
        {product.badge && (
          <span className="absolute left-3 top-3 z-10 rounded-full bg-accent px-2 py-1 text-xs font-semibold text-accent-foreground">
            {product.badge}
          </span>
        )}
        <img
          src={product.image}
          alt={product.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </Link>
      <div className="space-y-2 p-4">
        <Link to={`/product/${product.id}`} className="line-clamp-1 text-sm font-medium hover:underline">{product.title}</Link>
        <div className="flex items-center justify-between">
          <div className="text-base font-semibold">${product.price.toFixed(2)}</div>
          <div className="flex items-center gap-1 text-amber-500">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 .587l3.668 7.431 8.2 1.193-5.934 5.787 1.402 8.168L12 18.896l-7.336 3.87 1.402-8.168L.132 9.211l8.2-1.193z"/></svg>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 .587l3.668 7.431 8.2 1.193-5.934 5.787 1.402 8.168L12 18.896l-7.336 3.87 1.402-8.168L.132 9.211l8.2-1.193z"/></svg>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 .587l3.668 7.431 8.2 1.193-5.934 5.787 1.402 8.168L12 18.896l-7.336 3.87 1.402-8.168L.132 9.211l8.2-1.193z"/></svg>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 .587l3.668 7.431 8.2 1.193-5.934 5.787 1.402 8.168L12 18.896l-7.336 3.87 1.402-8.168L.132 9.211l8.2-1.193z"/></svg>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="opacity-30"><path d="M12 .587l3.668 7.431 8.2 1.193-5.934 5.787 1.402 8.168L12 18.896l-7.336 3.87 1.402-8.168L.132 9.211l8.2-1.193z"/></svg>
          </div>
        </div>
        <Button className="w-full" onClick={() => add(product.id, 1)}>Add to Cart</Button>
      </div>
    </div>
  );
}
