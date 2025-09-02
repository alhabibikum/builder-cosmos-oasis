import { useParams, Link } from "react-router-dom";
import { getPostBySlug } from "@/lib/cms";

export default function BlogPost() {
  const { slug = "" } = useParams();
  const post = getPostBySlug(slug);
  if (!post || post.status !== "published") {
    return (
      <div className="space-y-4">
        <div className="text-sm text-muted-foreground">Post not found.</div>
        <Link to="/blog" className="text-sm text-primary underline">
          Back to Blog
        </Link>
      </div>
    );
  }
  return (
    <article className="mx-auto max-w-3xl space-y-6">
      {post.coverImage && (
        <div className="overflow-hidden rounded-xl">
          <img src={post.coverImage} alt={post.title} loading="lazy" decoding="async" sizes="100vw" className="w-full" />
        </div>
      )}
      <div className="text-xs text-muted-foreground">
        {post.publishedAt ? new Date(post.publishedAt).toLocaleString() : ""}
      </div>
      <h1 className="font-['Playfair Display'] text-3xl font-extrabold tracking-tight">
        {post.title}
      </h1>
      {post.excerpt && <p className="text-muted-foreground">{post.excerpt}</p>}
      <div className="prose max-w-none whitespace-pre-wrap">{post.content}</div>
      {post.tags && post.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-4">
          {post.tags.map((t) => (
            <span
              key={t}
              className="rounded-md bg-accent px-2 py-0.5 text-xs text-accent-foreground"
            >
              {t}
            </span>
          ))}
        </div>
      )}
      <div className="pt-6">
        <Link to="/blog" className="text-sm text-primary underline">
          Back to Blog
        </Link>
      </div>
    </article>
  );
}
