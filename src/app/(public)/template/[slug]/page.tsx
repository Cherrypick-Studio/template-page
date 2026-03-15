import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import TemplateDetailClient from "./TemplateDetailClient";
import JsonLd from "@/components/JsonLd";
import type { TemplateWithDetails, TemplateListItem } from "@/lib/supabase/types";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://store.cherrypick.studio";

export const dynamicParams = true;

export async function generateStaticParams() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key || url === "your-supabase-project-url") return [];

  try {
    const { createBrowserClient } = await import("@supabase/ssr");
    const supabase = createBrowserClient(url, key);
    const { data } = await supabase
      .from("templates")
      .select("slug")
      .eq("status", "published");
    return ((data as unknown as { slug: string }[]) ?? []).map((t) => ({ slug: t.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: templateRaw } = await supabase
    .from("templates")
    .select("title, description, template_images(image_url, is_primary), categories(name)")
    .eq("slug", slug)
    .single();

  if (!templateRaw) {
    return { title: "Template Not Found" };
  }

  const template = templateRaw as unknown as {
    title: string;
    description: string | null;
    template_images: { image_url: string; is_primary: boolean }[];
    categories: { name: string } | null;
  };

  const imgs = template.template_images;
  const primaryImg = imgs?.find((i) => i.is_primary)?.image_url ?? imgs?.[0]?.image_url;
  const cat = template.categories;
  const canonicalUrl = `/template/${slug}`;

  return {
    title: template.title,
    description:
      template.description?.slice(0, 160) ??
      `Download ${template.title} — a premium ${cat?.name ?? "UI"} template from CherryPick.`,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title: `${template.title} | CherryPick`,
      description:
        template.description?.slice(0, 160) ??
        `Download ${template.title} — a premium ${cat?.name ?? "UI"} template.`,
      url: canonicalUrl,
      images: primaryImg
        ? [{ url: primaryImg, width: 1200, height: 630, alt: template.title }]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: `${template.title} | CherryPick`,
      images: primaryImg ? [primaryImg] : undefined,
    },
  };
}

export default async function TemplateDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();

  const [{ data: templateRaw }, { data: relatedRaw }] = await Promise.all([
    supabase
      .from("templates")
      .select("*, categories(name, slug, icon_url), template_images(*)")
      .eq("slug", slug)
      .single(),
    supabase
      .from("templates")
      .select("*, categories(name, slug, icon_url), template_images(image_url, is_primary)")
      .eq("status", "published")
      .neq("slug", slug)
      .limit(3),
  ]);

  if (!templateRaw) notFound();
  const template = templateRaw as unknown as TemplateWithDetails & {
    categories: { name: string; slug: string; icon_url: string | null } | null;
  };
  const relatedTemplates = relatedRaw as unknown as TemplateListItem[] | null;

  type ImgPartial = { id: string; image_url: string; alt_text: string | null; is_primary: boolean; sort_order: number };
  const imgs = template.template_images as unknown as ImgPartial[] | null;
  const sortedImages = [...(imgs ?? [])].sort((a, b) => a.sort_order - b.sort_order);
  const cat = template.categories as { name: string; slug: string; icon_url: string | null } | null;

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: template.title,
    description: template.description,
    image: sortedImages.map((i) => i.image_url),
    url: `${siteUrl}/template/${slug}`,
    offers: {
      "@type": "Offer",
      price: template.price,
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
      seller: { "@type": "Organization", name: "CherryPick" },
    },
    ...(template.rating > 0 && {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: template.rating,
        bestRating: 5,
        ratingCount: template.sales_count || 1,
      },
    }),
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
      { "@type": "ListItem", position: 2, name: "Templates", item: `${siteUrl}/template` },
      { "@type": "ListItem", position: 3, name: template.title, item: `${siteUrl}/template/${slug}` },
    ],
  };

  return (
    <>
      <JsonLd data={productJsonLd} />
      <JsonLd data={breadcrumbJsonLd} />
      <TemplateDetailClient
        template={template}
        images={sortedImages}
        category={cat}
        relatedTemplates={relatedTemplates ?? []}
      />
    </>
  );
}
