import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import TemplateCard from "@/components/Card/TemplateCard";
import ReactToUsBanner from "@/components/Banner/ReactToUsBanner";
import JsonLd from "@/components/JsonLd";
import type { TemplateListItem } from "@/lib/supabase/types";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://store.cherrypick.studio";

export const metadata: Metadata = {
  title: "Featured Kits",
  description:
    "Explore our hand-picked collection of premium featured UI kits and templates. The best of CherryPick in one place.",
  alternates: { canonical: "/feature" },
  openGraph: {
    title: "Featured UI Kits | CherryPick",
    description: "Explore our hand-picked collection of premium featured UI kits and templates.",
    url: "/feature",
  },
  twitter: {
    card: "summary_large_image",
    title: "Featured UI Kits | CherryPick",
    description: "Explore our hand-picked collection of premium featured UI kits and templates.",
  },
};

export default async function FeatureKitPage() {
  const supabase = await createClient();

  const { data: templatesRaw } = await supabase
    .from("templates")
    .select("*, categories(name, slug, icon_url), template_images(image_url, is_primary)")
    .eq("status", "published")
    .eq("is_featured", true)
    .order("created_at", { ascending: false });
  const templates = templatesRaw as unknown as TemplateListItem[] | null;

  const collectionJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Featured UI Kits — CherryPick",
    url: `${siteUrl}/feature`,
    description: "Our hand-picked collection of premium featured UI kits and templates.",
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
      <JsonLd data={collectionJsonLd} />
      <div className="w-full">
      <div className="w-full mx-auto max-w-360 p-10 flex flex-col gap-10">
        <div className="flex flex-col gap-3">
          <h1 className="text-[28px] lg:text-[40px] text-[#1A1A1A] font-semibold">
            Featured Kits
          </h1>
          <p className="text-base text-[#666666]">
            {templates?.length ?? 0} hand-picked templates
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {!templates || templates.length === 0 ? (
            <p className="col-span-4 text-center py-16 text-[#888888]">
              No featured templates yet.
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
