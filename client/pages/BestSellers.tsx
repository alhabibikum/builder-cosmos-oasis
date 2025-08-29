import ProductGrid from "@/components/site/ProductGrid";

export default function BestSellers() {
  return (
    <section>
      <div className="mb-6 flex items-end justify-between">
        <h1 className="font-['Playfair Display'] text-2xl font-extrabold tracking-tight md:text-3xl">
          Best Sellers
        </h1>
      </div>
      <ProductGrid filter={(p) => p.isBestSeller === true} />
    </section>
  );
}
