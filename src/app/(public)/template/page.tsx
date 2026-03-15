import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import TemplateCard from "@/components/Card/TemplateCard";
import ReactToUsBanner from "@/components/Banner/ReactToUsBanner";
import JsonLd from "@/components/JsonLd";
import type { TemplateListItem, Category } from "@/lib/supabase/types";

export const metadata: Metadata = {
  title: "Browse Templates",
  description:
    "Explore our full collection of premium UI templates, Figma kits, Framer templates, and code components. Find the perfect template for your next project.",
  alternates: { canonical: "/template" },
  openGraph: {
    title: "Browse All Templates | CherryPick",
    description: "Explore our full collection of premium UI templates for Figma, Webflow, Framer, and more.",
    url: "/template",
  },
};

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://store.cherrypick.studio";

export default async function TemplatePage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; q?: string }>;
}) {
  const { category, q } = await searchParams;
  const supabase = await createClient();

  let query = supabase
    .from("templates")
    .select("*, categories(name, slug, icon_url), template_images(image_url, is_primary)")
    .eq("status", "published")
    .order("created_at", { ascending: false });

  if (category) {
    query = query.eq("categories.slug", category);
  }

  if (q) {
    query = query.ilike("title", `%${q}%`);
  }

  const { data: templatesRaw } = await query;
  const templates = templatesRaw as unknown as TemplateListItem[] | null;

  const { data: categoriesRaw } = await supabase
    .from("categories")
    .select("id, name, slug")
    .order("sort_order");
  const categories = categoriesRaw as unknown as Pick<Category, "id" | "name" | "slug">[] | null;

  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "CherryPick Templates",
    url: `${siteUrl}/template`,
    description: "Premium UI templates for Figma, Webflow, Framer, and more.",
    hasPart: (templates ?? []).slice(0, 10).map((t) => ({
      "@type": "Product",
      name: t.title,
      url: `${siteUrl}/template/${t.slug}`,
      offers: {
        "@type": "Offer",
        price: t.price,
        priceCurrency: "USD",
        availability: "https://schema.org/InStock",
      },
    })),
  };

  return (
    <>
      <JsonLd data={itemListJsonLd} />
      <div className="w-full">
        <div className="w-full mx-auto max-w-360 p-10 flex flex-col gap-10">
          <div className="flex flex-col gap-3">
            <h1 className="text-[28px] lg:text-[40px] text-[#1A1A1A] font-semibold">
              {q ? `Search: "${q}"` : category ? `${category.replace("-", " ")} Templates` : "All Templates"}
            </h1>
            <p className="text-base text-[#666666]">
              {templates?.length ?? 0} templates available
            </p>
          </div>

          {/* Category filter */}
          {categories && categories.length > 0 && (
            <div className="flex flex-wrap gap-2">
              <Link
                href="/template"
                className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors border ${
                  !category
                    ? "bg-[#1A1A1A] text-white border-[#1A1A1A]"
                    : "bg-white text-[#666666] border-[#DDDDDD] hover:border-[#1A1A1A] hover:text-[#1A1A1A]"
                }`}
              >
                All
              </Link>
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/template?category=${cat.slug}`}
                  className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors border ${
                    category === cat.slug
                      ? "bg-[#1A1A1A] text-white border-[#1A1A1A]"
                      : "bg-white text-[#666666] border-[#DDDDDD] hover:border-[#1A1A1A] hover:text-[#1A1A1A]"
                  }`}
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {!templates || templates.length === 0 ? (
              <p className="col-span-4 text-center py-16 text-[#888888]">
                No templates found.
              </p>
            ) : (
              templates.map((t) => {
                const imgs = t.template_images as { image_url: string; is_primary: boolean }[] | null;
                const primaryImg =
                  imgs?.find((i) => i.is_primary)?.image_url ??
                  imgs?.[0]?.image_url ??
                  "/assets/ic-zenith.svg";
                const cat = t.categories as { name: string; icon_url: string | null } | null;
                return (
                  <TemplateCard
                    key={t.id}
                    id={t.id}
                    slug={t.slug}
                    img={primaryImg}
                    is_checked
                    price={t.price}
                    template_icon={cat?.icon_url ?? "/assets/ic-figma.svg"}
                    template_label={cat?.name ?? "Template"}
                    title={t.title}
                    is_new={t.is_new}
                  />
                );
              })
            )}
          </div>
        </div>

        <div className="p-8 w-full">
          <ReactToUsBanner />
        </div>
      </div>
    </>
  );
}
