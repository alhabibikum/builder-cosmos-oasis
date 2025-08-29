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
    const next = upsertPost({
      ...editing,
      slug: editing.slug ? slugify(editing.slug) : undefined,
    });
    setPosts(next);
    const saved = next.find((p) => p.title === editing.title);
    setEditing(saved || null);
  };

  const onDelete = (id: string) => {
    if (!confirm("Delete this post?")) return;
    const next = deletePost(id);
    setPosts(next);
    if (editing?.id === id) setEditing(null);
  };

  const onPublishToggle = (p: Post) => {
    const next = p.status === "published" ? unpublishPost(p.id) : publishPost(p.id);
    setPosts(next);
    if (editing) setEditing(next.find((x) => x.id === p.id) || null);
  };

  return (
    <div className="grid gap-6 md:grid-cols-5">
      <div className="md:col-span-2 rounded-xl border">
        <div className="flex items-center gap-2 border-b p-3">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search posts..."
            className="h-9 flex-1 rounded-md border px-2 text-sm"
          />
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as any)}
            className="h-9 rounded-md border px-2 text-sm"
          >
            <option value="all">All</option>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
          <button className="rounded-md border px-3 py-2 text-sm" onClick={onNew}>
            New
          </button>
        </div>
        <div className="divide-y">
          {filtered.map((p) => (
            <button
              key={p.id}
              className={`w-full p-3 text-left text-sm ${
                editing?.id === p.id ? "bg-accent/10" : ""
              }`}
              onClick={() => setEditing(p)}
            >
              <div className="font-semibold">{p.title}</div>
              <div className="text-xs text-muted-foreground">
                {p.status.toUpperCase()} • {new Date(p.updatedAt).toLocaleString()}
              </div>
            </button>
          ))}
          {filtered.length === 0 && (
            <div className="p-4 text-center text-sm text-muted-foreground">No posts found.</div>
          )}
        </div>
      </div>

      <div className="md:col-span-3 rounded-xl border">
        <div className="border-b p-3 font-semibold">Post Editor</div>
        {!editing ? (
          <div className="p-4 text-sm text-muted-foreground">Select a post to edit or create a new one.</div>
        ) : (
          <div className="grid gap-3 p-4">
            <label className="grid gap-1 text-sm">
              <span className="text-xs">Title</span>
              <input
                className="h-10 rounded-md border px-2"
                value={editing.title}
                onChange={(e) => setEditing({ ...editing, title: e.target.value })}
              />
            </label>
            <label className="grid gap-1 text-sm">
              <span className="text-xs">Slug</span>
              <input
                className="h-10 rounded-md border px-2"
                value={editing.slug}
                onChange={(e) => setEditing({ ...editing, slug: e.target.value })}
                placeholder="auto from title"
              />
            </label>
            <label className="grid gap-1 text-sm">
              <span className="text-xs">Excerpt</span>
              <textarea
                className="min-h-[70px] rounded-md border p-2"
                value={editing.excerpt || ""}
                onChange={(e) => setEditing({ ...editing, excerpt: e.target.value })}
              />
            </label>
            <label className="grid gap-1 text-sm">
              <span className="text-xs">Cover Image URL</span>
              <input
                className="h-10 rounded-md border px-2"
                value={editing.coverImage || ""}
                onChange={(e) => setEditing({ ...editing, coverImage: e.target.value })}
                placeholder="https://..."
              />
            </label>
            <label className="grid gap-1 text-sm">
              <span className="text-xs">Tags (comma separated)</span>
              <input
                className="h-10 rounded-md border px-2"
                value={(editing.tags || []).join(", ")}
                onChange={(e) =>
                  setEditing({ ...editing, tags: e.target.value.split(",").map((t) => t.trim()).filter(Boolean) })
                }
              />
            </label>
            <label className="grid gap-1 text-sm">
              <span className="text-xs">Content (Markdown/plain)</span>
              <textarea
                className="min-h-[180px] rounded-md border p-2"
                value={editing.content}
                onChange={(e) => setEditing({ ...editing, content: e.target.value })}
              />
            </label>
            <div className="flex flex-wrap items-center gap-2 pt-2">
              <select
                className="h-10 rounded-md border px-2 text-sm"
                value={editing.status}
                onChange={(e) => setEditing({ ...editing, status: e.target.value as PostStatus })}
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
              <button className="rounded-md border px-3 py-2 text-sm" onClick={onSave}>
                Save
              </button>
              {editing.id && (
                <>
                  <button className="rounded-md border px-3 py-2 text-sm" onClick={() => onPublishToggle(editing)}>
                    {editing.status === "published" ? "Unpublish" : "Publish"}
                  </button>
                  <button className="rounded-md border px-3 py-2 text-sm text-red-600" onClick={() => onDelete(editing.id)}>
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
