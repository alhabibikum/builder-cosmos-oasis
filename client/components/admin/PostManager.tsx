import { useEffect, useMemo, useState } from "react";
import {
  loadPosts,
  savePosts,
  upsertPost,
  deletePost,
  publishPost,
  unpublishPost,
  type Post,
  type PostStatus,
  slugify,
} from "@/lib/cms";

export default function PostManager() {
  const [posts, setPosts] = useState<Post[]>(loadPosts());
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<PostStatus | "all">("all");
  const [editing, setEditing] = useState<Post | null>(null);

  useEffect(() => {
    // sync external changes (if any)
    const onStorage = (e: StorageEvent) => {
      if (e.key === "cms_posts") setPosts(loadPosts());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return posts.filter((p) => {
      if (status !== "all" && p.status !== status) return false;
      if (!q) return true;
      return (
        p.title.toLowerCase().includes(q) ||
        (p.excerpt || "").toLowerCase().includes(q) ||
        (p.tags || []).some((t) => t.toLowerCase().includes(q))
      );
    });
  }, [posts, query, status]);

  const onNew = () => {
    setEditing({
      id: "",
      slug: "",
      title: "",
      excerpt: "",
      content: "",
      coverImage: "",
      tags: [],
      status: "draft",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  };

  const onSave = () => {
    if (!editing) return;
    if (!editing.title.trim()) {
      alert("Title is required");
      return;
    }
    const expectedSlug = slugify(editing.slug || editing.title);
    const next = upsertPost({
      ...editing,
      slug: editing.slug ? expectedSlug : undefined,
    });
    setPosts(next);
    const saved = editing.id
      ? next.find((p) => p.id === editing.id)
      : next.find((p) => p.slug === expectedSlug);
    setEditing(saved || null);
  };

  const onDelete = (id: string) => {
    if (!confirm("Delete this post?")) return;
    const next = deletePost(id);
    setPosts(next);
    if (editing?.id === id) setEditing(null);
  };

  const onPublishToggle = (p: Post) => {
    const next =
      p.status === "published" ? unpublishPost(p.id) : publishPost(p.id);
    setPosts(next);
    if (editing) setEditing(next.find((x) => x.id === p.id) || null);
  };

  return (
    <div className="grid gap-6 md:grid-cols-5">
      <div className="md:col-span-2 rounded-xl border bg-white overflow-hidden flex flex-col">
        <div className="flex flex-col gap-2 border-b p-4 md:gap-1">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search posts..."
            className="h-10 rounded-lg border px-3 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
          <div className="flex gap-2">
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as any)}
              className="h-10 flex-1 rounded-lg border px-3 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="all">All</option>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
            <button
              className="h-10 rounded-lg border px-4 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
              onClick={onNew}
            >
              New
            </button>
          </div>
        </div>
        <div className="divide-y flex-1 overflow-y-auto max-h-[600px]">
          {filtered.map((p) => (
            <button
              key={p.id}
              className={`w-full p-4 text-left text-sm transition-all hover:bg-accent/10 ${
                editing?.id === p.id ? "bg-primary/5 border-l-2 border-primary" : ""
              }`}
              onClick={() => setEditing(p)}
            >
              <div className="font-semibold text-foreground">{p.title}</div>
              <div className="text-xs text-muted-foreground mt-1">
                <span className={`inline-block px-2 py-0.5 rounded-md text-xs font-medium mr-2 ${
                  p.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                }`}>
                  {p.status.toUpperCase()}
                </span>
                <span className="text-muted-foreground">
                  {new Date(p.updatedAt).toLocaleString()}
                </span>
              </div>
            </button>
          ))}
          {filtered.length === 0 && (
            <div className="p-6 text-center text-sm text-muted-foreground">
              No posts found.
            </div>
          )}
        </div>
      </div>

      <div className="md:col-span-3 rounded-xl border bg-white overflow-hidden flex flex-col">
        <div className="border-b p-4 font-semibold text-foreground">Post Editor</div>
        {!editing ? (
          <div className="p-4 text-sm text-muted-foreground">
            Select a post to edit or create a new one.
          </div>
        ) : (
          <div className="grid gap-3 p-4">
            <label className="grid gap-1 text-sm">
              <span className="text-xs">Title</span>
              <input
                className="h-10 rounded-md border px-2"
                value={editing.title}
                onChange={(e) =>
                  setEditing({ ...editing, title: e.target.value })
                }
              />
            </label>
            <label className="grid gap-1 text-sm">
              <span className="text-xs">Slug</span>
              <input
                className="h-10 rounded-md border px-2"
                value={editing.slug}
                onChange={(e) =>
                  setEditing({ ...editing, slug: e.target.value })
                }
                placeholder="auto from title"
              />
            </label>
            <label className="grid gap-1 text-sm">
              <span className="text-xs">Excerpt</span>
              <textarea
                className="min-h-[70px] rounded-md border p-2"
                value={editing.excerpt || ""}
                onChange={(e) =>
                  setEditing({ ...editing, excerpt: e.target.value })
                }
              />
            </label>
            <label className="grid gap-1 text-sm">
              <span className="text-xs">Cover Image URL</span>
              <input
                className="h-10 rounded-md border px-2"
                value={editing.coverImage || ""}
                onChange={(e) =>
                  setEditing({ ...editing, coverImage: e.target.value })
                }
                placeholder="https://..."
              />
            </label>
            <label className="grid gap-1 text-sm">
              <span className="text-xs">Tags (comma separated)</span>
              <input
                className="h-10 rounded-md border px-2"
                value={(editing.tags || []).join(", ")}
                onChange={(e) =>
                  setEditing({
                    ...editing,
                    tags: e.target.value
                      .split(",")
                      .map((t) => t.trim())
                      .filter(Boolean),
                  })
                }
              />
            </label>
            <label className="grid gap-1 text-sm">
              <span className="text-xs">Content (Markdown/plain)</span>
              <textarea
                className="min-h-[180px] rounded-md border p-2"
                value={editing.content}
                onChange={(e) =>
                  setEditing({ ...editing, content: e.target.value })
                }
              />
            </label>
            <div className="flex flex-wrap items-center gap-2 pt-2">
              <select
                className="h-10 rounded-md border px-2 text-sm"
                value={editing.status}
                onChange={(e) =>
                  setEditing({
                    ...editing,
                    status: e.target.value as PostStatus,
                  })
                }
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
              <button
                className="rounded-md border px-3 py-2 text-sm"
                onClick={onSave}
              >
                Save
              </button>
              {editing.id && (
                <>
                  <button
                    className="rounded-md border px-3 py-2 text-sm"
                    onClick={() => onPublishToggle(editing)}
                  >
                    {editing.status === "published" ? "Unpublish" : "Publish"}
                  </button>
                  <button
                    className="rounded-md border px-3 py-2 text-sm text-red-600"
                    onClick={() => onDelete(editing.id)}
                  >
                    Delete
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
