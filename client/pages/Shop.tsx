import ProductCard, { type Product } from "@/components/site/ProductCard";

const products: Product[] = [
  { id: "1", title: "Silk Embellished Abaya - Noir", price: 289, image: "https://images.unsplash.com/photo-1542000540985-5c8ca4b1c2ad?w=1200&q=80&auto=format&fit=crop", badge: "New" },
  { id: "2", title: "Classic Open Abaya - Midnight", price: 199, image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1200&q=80&auto=format&fit=crop" },
  { id: "3", title: "Chiffon Kaftan - Desert Gold", price: 179, image: "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=1200&q=80&auto=format&fit=crop" },
  { id: "4", title: "Embroidered Abaya - Royal Plum", price: 249, image: "https://images.unsplash.com/photo-1544441892-3b2f7d3f5953?w=1200&q=80&auto=format&fit=crop" },
  { id: "5", title: "Belted Abaya - Pearl", price: 219, image: "https://images.unsplash.com/photo-1551133988-b9632a4d5801?w=1200&q=80&auto=format&fit=crop" },
  { id: "6", title: "Kimono Abaya - Sapphire", price: 209, image: "https://images.unsplash.com/photo-1551717743-49959800b1f3?w=1200&q=80&auto=format&fit=crop" },
  { id: "7", title: "Pleated Abaya - Charcoal", price: 189, image: "https://images.unsplash.com/photo-1520975922401-b09c3163a791?w=1200&q=80&auto=format&fit=crop" },
  { id: "8", title: "Luxe Satin Abaya - Mocha", price: 229, image: "https://images.unsplash.com/photo-1520975654408-0c0df7e594ef?w=1200&q=80&auto=format&fit=crop" },
];

export default function Shop() {
  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
      <aside className="space-y-6 md:col-span-1">
        <div>
          <div className="mb-2 text-sm font-semibold uppercase tracking-wide">Categories</div>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><a href="#" className="hover:text-foreground">Abayas</a></li>
            <li><a href="#" className="hover:text-foreground">Kaftans</a></li>
            <li><a href="#" className="hover:text-foreground">Modest Dresses</a></li>
            <li><a href="#" className="hover:text-foreground">Prayer Sets</a></li>
          </ul>
        </div>
        <div>
          <div className="mb-2 text-sm font-semibold uppercase tracking-wide">Filters</div>
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full border px-3 py-1 text-xs">XS</span>
            <span className="rounded-full border px-3 py-1 text-xs">S</span>
            <span className="rounded-full border px-3 py-1 text-xs">M</span>
            <span className="rounded-full border px-3 py-1 text-xs">L</span>
            <span className="rounded-full border px-3 py-1 text-xs">XL</span>
          </div>
        </div>
      </aside>
      <section className="md:col-span-3">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="font-['Playfair Display'] text-2xl font-extrabold tracking-tight md:text-3xl">Shop</h1>
          <select className="h-10 rounded-md border bg-background px-3 text-sm">
            <option>Featured</option>
            <option>Price: Low to High</option>
            <option>Price: High to Low</option>
            <option>Newest</option>
          </select>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
    </div>
  );
}
