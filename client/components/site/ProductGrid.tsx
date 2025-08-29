import ProductCard from "@/components/site/ProductCard";
import { getProducts } from "@/lib/catalog";
import type { CatalogProduct } from "@/data/products";

export default function ProductGrid({
  filter,
}: {
  filter?: (p: CatalogProduct) => boolean;
}) {
  const list = getProducts().filter((p) => (filter ? filter(p) : true));
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {list.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}
