export type PostStatus = "draft" | "published";

export interface Post {
  id: string;
  slug: string;
  title: string;
  excerpt?: string;
  content: string;
  coverImage?: string;
  tags?: string[];
  status: PostStatus;
  publishedAt?: string; // ISO
  createdAt: string; // ISO
  updatedAt: string; // ISO
}

export type ContentMap = Record<string, string>;

const POSTS_KEY = "cms_posts";
const CONTENT_KEY = "cms_content";

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function loadPosts(): Post[] {
  try {
    const raw = localStorage.getItem(POSTS_KEY);
    const arr = raw ? (JSON.parse(raw) as Post[]) : [];
    if (!Array.isArray(arr)) return [];
    return arr
      .map((p) => ({
        ...p,
        tags: p.tags || [],
        status: p.status || "draft",
      }))
      .sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
      );
  } catch {
    return [];
  }
}

export function savePosts(posts: Post[]): void {
  localStorage.setItem(POSTS_KEY, JSON.stringify(posts));
}

export function upsertPost(
  input: Partial<Post> & { title: string; content?: string },
): Post[] {
  const posts = loadPosts();
  const now = new Date().toISOString();
  if (input.id) {
    const idx = posts.findIndex((p) => p.id === input.id);
    if (idx >= 0) {
      const next = { ...posts[idx], ...input, updatedAt: now } as Post;
      // ensure slug uniqueness
      next.slug = ensureUniqueSlug(
        posts,
        input.slug || posts[idx].slug || slugify(next.title),
        next.id,
      );
      posts[idx] = next;
      savePosts(posts);
      return posts;
    }
  }
  const id = crypto.randomUUID();
  const slug = ensureUniqueSlug(posts, input.slug || slugify(input.title));
  const post: Post = {
    id,
    slug,
    title: input.title,
    excerpt: input.excerpt || "",
    content: input.content || "",
    coverImage: input.coverImage || "",
    tags: input.tags || [],
    status: (input.status as PostStatus) || "draft",
    publishedAt: input.publishedAt,
    createdAt: now,
    updatedAt: now,
  };
  const next = [post, ...posts];
  savePosts(next);
  return next;
}

export function deletePost(id: string): Post[] {
  const posts = loadPosts();
  const next = posts.filter((p) => p.id !== id);
  savePosts(next);
  return next;
}

export function publishPost(id: string): Post[] {
  const posts = loadPosts();
  const now = new Date().toISOString();
  const next = posts.map((p) =>
    p.id === id
      ? {
          ...p,
          status: "published" as PostStatus,
          publishedAt: now,
          updatedAt: now,
        }
      : p,
  );
  savePosts(next);
  return next;
}

export function unpublishPost(id: string): Post[] {
  const posts = loadPosts();
  const now = new Date().toISOString();
  const next = posts.map((p) =>
    p.id === id ? { ...p, status: "draft" as PostStatus, updatedAt: now } : p,
  );
  savePosts(next);
  return next;
}

export function getPostBySlug(slug: string): Post | undefined {
  return loadPosts().find((p) => p.slug === slug);
}

export function searchPosts(
  query: string,
  opts?: { status?: PostStatus },
): Post[] {
  const q = query.toLowerCase();
  return loadPosts().filter((p) => {
    if (opts?.status && p.status !== opts.status) return false;
    return (
      p.title.toLowerCase().includes(q) ||
      (p.excerpt || "").toLowerCase().includes(q) ||
      (p.tags || []).some((t) => t.toLowerCase().includes(q))
    );
  });
}

export function loadContent(): ContentMap {
  try {
    const raw = localStorage.getItem(CONTENT_KEY);
    const obj = raw ? (JSON.parse(raw) as ContentMap) : {};
    return obj && typeof obj === "object" ? obj : {};
  } catch {
    return {};
  }
}

export function saveContent(content: ContentMap): void {
  localStorage.setItem(CONTENT_KEY, JSON.stringify(content));
}

export function getContent(key: string, fallback = ""): string {
  const map = loadContent();
  return map[key] ?? fallback;
}

function ensureUniqueSlug(existing: Post[], base: string, id?: string): string {
  let slug = slugify(base || "post");
  const taken = new Set(existing.filter((p) => p.id !== id).map((p) => p.slug));
  if (!taken.has(slug)) return slug;
  let n = 2;
  while (taken.has(`${slug}-${n}`)) n++;
  return `${slug}-${n}`;
}
