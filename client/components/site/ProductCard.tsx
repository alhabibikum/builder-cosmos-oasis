import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useCart } from "@/store/cart";
import { formatCurrency } from "@/lib/money";
import { toast } from "sonner";
import { getStock } from "@/lib/inventory";

export interface Product {
  id: string;
  title: string;
  price: number;
  image: string;
  badge?: string;
  sizes?: string[];
}

export default function ProductCard({ product }: { product: Product }) {
  const { add } = useCart();
  const hasSizes = (product as any).sizes?.length > 0;
  const stock = hasSizes ? undefined : getStock(product.id);
  const out = stock !== undefined && stock <= 0;
  return (
    <div className="group overflow-hidden rounded-xl border bg-card">
      <Link
        to={`/product/${product.id}`}
        className="relative block aspect-[4/5] w-full overflow-hidden"
      >
        {product.badge && (
          <span className="absolute left-3 top-3 z-10 rounded-full bg-accent px-2 py-1 text-xs font-semibold text-accent-foreground">
            {product.badge}
          </span>
        )}
        <img
          src={product.image}
          srcSet={buildSrcSet(product.image)}
          alt={product.title}
          loading="lazy"
          decoding="async"
          sizes="(min-width:1024px) 25vw, (min-width:640px) 33vw, 50vw"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </Link>
      <div className="space-y-2 p-4">
        <Link
          to={`/product/${product.id}`}
          className="line-clamp-1 text-sm font-medium hover:underline"
        >
          {product.title}
        </Link>
        <div className="flex items-center justify-between">
          <div className="text-base font-semibold">
            {formatCurrency(product.price)}
          </div>
          <div className="flex items-center gap-1 text-amber-500">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 .587l3.668 7.431 8.2 1.193-5.934 5.787 1.402 8.168L12 18.896l-7.336 3.87 1.402-8.168L.132 9.211l8.2-1.193z" />
            </svg>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 .587l3.668 7.431 8.2 1.193-5.934 5.787 1.402 8.168L12 18.896l-7.336 3.87 1.402-8.168L.132 9.211l8.2-1.193z" />
            </svg>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 .587l3.668 7.431 8.2 1.193-5.934 5.787 1.402 8.168L12 18.896l-7.336 3.87 1.402-8.168L.132 9.211l8.2-1.193z" />
            </svg>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 .587l3.668 7.431 8.2 1.193-5.934 5.787 1.402 8.168L12 18.896l-7.336 3.87 1.402-8.168L.132 9.211l8.2-1.193z" />
            </svg>
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="opacity-30"
            >
              <path d="M12 .587l3.668 7.431 8.2 1.193-5.934 5.787 1.402 8.168L12 18.896l-7.336 3.87 1.402-8.168L.132 9.211l8.2-1.193z" />
            </svg>
          </div>
        </div>
        {hasSizes ? (
          <Link
            to={`/product/${product.id}`}
            className="inline-flex w-full items-center justify-center rounded-md border px-4 py-2 text-sm font-semibold"
          >
            View Options
          </Link>
        ) : (
          <Button
            className="w-full"
            disabled={out}
            onClick={() => {
              add(product.id, 1);
              toast.success("Added to cart");
            }}
          >
            {out ? "Out of stock" : "Add to Cart"}
          </Button>
        )}
      </div>
    </div>
  );
}
