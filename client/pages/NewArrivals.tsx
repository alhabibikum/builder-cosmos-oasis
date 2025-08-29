import ProductGrid from "@/components/site/ProductGrid";

export default function NewArrivals() {
  return (
    <section>
      <div className="mb-6 flex items-end justify-between">
        <h1 className="font-['Playfair Display'] text-2xl font-extrabold tracking-tight md:text-3xl">
          New Arrivals
        </h1>
      </div>
      <ProductGrid filter={(p) => p.isNew === true} />
    </section>
  );
}
