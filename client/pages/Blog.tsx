import { Link } from "react-router-dom";
import { loadPosts } from "@/lib/cms";

export default function Blog() {
  const posts = loadPosts().filter((p) => p.status === "published");
  return (
    <section className="space-y-6">
      <h1 className="font-['Playfair Display'] text-3xl font-extrabold tracking-tight">
        Blog
      </h1>
      <div className="grid gap-6 md:grid-cols-3">
        {posts.map((p) => (
          <Link
            key={p.id}
            to={`/blog/${p.slug}`}
            className="group overflow-hidden rounded-xl border"
          >
            {p.coverImage && (
              <div className="aspect-[16/9] w-full">
                <img
                  src={p.coverImage}
                  alt={p.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
            )}
            <div className="p-4">
              <div className="text-xs text-muted-foreground">
                {p.publishedAt
                  ? new Date(p.publishedAt).toLocaleDateString()
                  : ""}
              </div>
              <div className="mt-1 text-lg font-semibold">{p.title}</div>
              {p.excerpt && (
                <p className="mt-1 line-clamp-3 text-sm text-muted-foreground">
                  {p.excerpt}
                </p>
              )}
              {p.tags && p.tags.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {p.tags.map((t) => (
                    <span
                      key={t}
                      className="rounded-md bg-accent px-2 py-0.5 text-xs text-accent-foreground"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </Link>
        ))}
        {posts.length === 0 && (
          <div className="rounded-xl border p-6 text-center text-sm text-muted-foreground">
            No posts published yet.
          </div>
        )}
      </div>
    </section>
  );
}
