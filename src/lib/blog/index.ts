import fs from "fs";
import path from "path";
import matter from "gray-matter";

const BLOG_DIR = path.join(process.cwd(), "content/blog");

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  coverImage: string;
  author: string;
  publishedAt: string;
  tags: string[];
  seoTitle?: string;
  readingTime: number;
  content: string;
}

export type BlogPostMeta = Omit<BlogPost, "content">;

export function getAllPosts(): BlogPostMeta[] {
  if (!fs.existsSync(BLOG_DIR)) return [];

  const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith(".mdx"));

  const posts = files.map((filename) => {
    const slug = filename.replace(/\.mdx$/, "");
    const raw = fs.readFileSync(path.join(BLOG_DIR, filename), "utf-8");
    const { data } = matter(raw);

    return {
      slug,
      title: data.title ?? slug,
      excerpt: data.excerpt ?? "",
      coverImage: data.coverImage ?? "/blog/covers/default.svg",
      author: data.author ?? "CherryPick Team",
      publishedAt: data.publishedAt ?? "",
      tags: data.tags ?? [],
      seoTitle: data.seoTitle,
      readingTime: data.readingTime ?? 5,
    } as BlogPostMeta;
  });

  return posts.sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}

export function getPost(slug: string): BlogPost | null {
  const filePath = path.join(BLOG_DIR, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);

  return {
    slug,
    title: data.title ?? slug,
    excerpt: data.excerpt ?? "",
    coverImage: data.coverImage ?? "/blog/covers/default.svg",
    author: data.author ?? "CherryPick Team",
    publishedAt: data.publishedAt ?? "",
    tags: data.tags ?? [],
    seoTitle: data.seoTitle,
    readingTime: data.readingTime ?? 5,
    content,
  };
}

export function getAllSlugs(): string[] {
  if (!fs.existsSync(BLOG_DIR)) return [];
  return fs
    .readdirSync(BLOG_DIR)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => f.replace(/\.mdx$/, ""));
}
