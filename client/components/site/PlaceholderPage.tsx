export default function PlaceholderPage({ title, description }: { title: string; description?: string }) {
  return (
    <section className="mx-auto max-w-2xl py-12 text-center">
      <h1 className="mb-3 font-['Playfair Display'] text-3xl font-extrabold tracking-tight text-foreground md:text-4xl">{title}</h1>
      <p className="text-muted-foreground">
        {description || "This page is coming next. Tell Fusion which sections and content you want here, and we'll build it out for you."}
      </p>
    </section>
  );
}
