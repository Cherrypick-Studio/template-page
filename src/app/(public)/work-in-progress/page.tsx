import type { Metadata } from "next";
import BuildingBanner from "@/components/Banner/BuildingBanner";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import WIPProgress from "./WIPProgress";
import JsonLd from "@/components/JsonLd";

type WIPTemplateRow = {
  id: string;
  title: string;
  description: string | null;
  categories: { name: string; icon_url: string | null } | null;
  template_images: { image_url: string; is_primary: boolean }[] | null;
};

export const metadata: Metadata = {
  title: "Work in Progress",
  description: "Sneak peek at upcoming templates currently being crafted by the CherryPick team.",
  alternates: { canonical: "/work-in-progress" },
  robots: { index: false, follow: false },
  twitter: {
    card: "summary_large_image",
    title: "Work in Progress | CherryPick",
    description: "Sneak peek at upcoming templates currently being crafted by the CherryPick team.",
  },
};

export default async function WorkInProgressPage() {
  const supabase = await createClient();

  const { data: wipRaw } = await supabase
    .from("templates")
    .select("*, categories(name, slug, icon_url), template_images(image_url, is_primary)")
    .eq("status", "wip")
    .order("created_at", { ascending: false });
  const wipTemplates = wipRaw as unknown as WIPTemplateRow[] | null;

  const featured = wipTemplates?.[0] ?? null;
  const rest = wipTemplates?.slice(1) ?? [];

  const wipJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Work in Progress — CherryPick",
    url: `${process.env.NEXT_PUBLIC_SITE_URL || "https://store.cherrypick.studio"}/work-in-progress`,
    description: "Upcoming templates currently being crafted by the CherryPick team.",
    ...(wipTemplates && wipTemplates.length > 0 && {
      hasPart: wipTemplates.map((t) => ({
        "@type": "CreativeWork",
        name: t.title,
        description: t.description ?? "Coming soon.",
      })),
    }),
  };

  return (
    <>
      <JsonLd data={wipJsonLd} />
      <div className="w-full">
      <div className="w-full mx-auto max-w-360 p-4 lg:p-10 rounded-3xl flex flex-col gap-14">
        <div className="flex flex-col pt-4 lg:pt-20 gap-14">
          <h1 className="text-[32px] font-semibold text-[#1A1A1A]">Work In Progress</h1>

          {featured ? (
            <WIPCard template={featured} prominent />
          ) : (
            <div className="w-full border-2 border-[#007FFF] bg-[#FEFEFE] p-6 rounded-3xl flex items-center justify-center h-60">
              <p className="text-[#888888]">No templates in progress yet. Check back soon!</p>
            </div>
          )}
        </div>

        <div className="w-full h-px bg-[#DDDDDD]" />

        {rest.length > 0 && (
          <div>
            <h2 className="text-[32px] font-semibold text-[#1A1A1A]">Preparing New Line-Up</h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mt-14">
              {rest.map((t) => (
                <WIPCard key={t.id} template={t} />
              ))}
            </div>
          </div>
        )}

        <BuildingBanner />
      </div>
    </div>
    </>
  );
}

function WIPCard({
  template,
  prominent = false,
}: {
  template: WIPTemplateRow;
  prominent?: boolean;
}) {
  const imgs = template.template_images as { image_url: string; is_primary: boolean }[] | null;
  const primaryImg = imgs?.find((i) => i.is_primary)?.image_url ?? imgs?.[0]?.image_url ?? "/assets/ic-zenith.svg";
  const cat = template.categories as { name: string; icon_url: string | null } | null;

  if (prominent) {
    return (
      <div className="w-full border-2 border-[#007FFF] bg-[#FEFEFE] p-6 rounded-3xl gap-14 flex lg:flex-row flex-col">
        <div className="flex flex-col gap-4 justify-between">
          <div className="flex flex-col">
            <span className="text-[48px] text-[#1A1A1A] font-medium">{template.title}</span>
            {cat && (
              <div className="flex items-center gap-5">
                <span className="text-[#888888]">Category</span>
                <div className="flex gap-2 items-center py-0 px-4 bg-[#FEFEFE] border border-[#DDDDDD] rounded-full text-base text-[#1A1A1A]">
                  {cat.icon_url && (
                    <Image src={cat.icon_url} width={14} height={14} alt={`${cat.name} icon`} className="w-3.5 aspect-square object-contain" />
                  )}
                  <span>{cat.name}</span>
                </div>
              </div>
            )}
            <div className="w-full h-px bg-[#DDDDDD] mt-8" />
          </div>
          <p className="text-[#666666]">
            {template.description ?? "The product is currently being crafted. We will display the details when it is finished."}
          </p>
        </div>
        <div className="w-full max-w-147 h-100 flex items-center justify-center relative overflow-hidden rounded-2xl shrink-0">
          <Image src={primaryImg} width={400} height={300} alt={`${template.title} preview`} className="w-full absolute" />
          <div className="absolute w-full h-full bg-[#FEFEFE80] backdrop-blur-xl z-10" />
          <WIPProgress />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 justify-between bg-[#F5F5F5] border border-[#DDDDDD] p-6 rounded-3xl h-80">
      <div className="flex flex-col">
        <span className="text-[24px] text-[#1A1A1A] font-medium">{template.title}</span>
        {cat && (
          <div className="flex items-center gap-5 mt-2">
            <span className="text-[#888888] text-sm">Category</span>
            <div className="flex gap-2 items-center py-0 px-4 bg-[#FEFEFE] border border-[#DDDDDD] rounded-full text-base text-[#1A1A1A]">
              {cat.icon_url && (
                <Image src={cat.icon_url} width={14} height={14} alt={`${cat.name} icon`} className="w-3.5 aspect-square object-contain" />
              )}
              <span>{cat.name}</span>
            </div>
          </div>
        )}
        <div className="w-full h-px bg-[#DDDDDD] mt-8" />
      </div>
      <p className="text-[#666666]">
        {template.description ?? "The product is currently being crafted. We will display the details when it is finished."}
      </p>
    </div>
  );
}
