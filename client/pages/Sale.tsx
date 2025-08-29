import ProductGrid from "@/components/site/ProductGrid";

export default function Sale() {
  return (
    <section>
      <div className="mb-6 flex items-end justify-between">
        <h1 className="font-['Playfair Display'] text-2xl font-extrabold tracking-tight md:text-3xl">
          Sale
        </h1>
      </div>
      <ProductGrid filter={(p) => p.onSale === true} />
    </section>
  );
}
