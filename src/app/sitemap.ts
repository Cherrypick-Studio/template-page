import type { MetadataRoute } from "next";
import { createClient } from "@/lib/supabase/server";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://cherrypick.design";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    { url: siteUrl, lastModified: new Date(), changeFrequency: "daily", priority: 1.0 },
    { url: `${siteUrl}/template`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${siteUrl}/feature`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
  ];

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key || url === "your-supabase-project-url") return staticPages;

  const supabase = await createClient();

  const { data: templatesRaw } = await supabase
    .from("templates")
    .select("slug, updated_at")
    .eq("status", "published")
    .order("updated_at", { ascending: false });

  const { data: categoriesRaw } = await supabase
    .from("categories")
    .select("slug")
    .eq("is_coming_soon", false);

  const templates = templatesRaw as unknown as { slug: string; updated_at: string }[] | null;
  const categories = categoriesRaw as unknown as { slug: string }[] | null;

  const categoryPages: MetadataRoute.Sitemap = (categories ?? []).map((cat) => ({
    url: `${siteUrl}/template?category=${cat.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  const templatePages: MetadataRoute.Sitemap = (templates ?? []).map((t) => ({
    url: `${siteUrl}/template/${t.slug}`,
    lastModified: new Date(t.updated_at),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [...staticPages, ...categoryPages, ...templatePages];
}
