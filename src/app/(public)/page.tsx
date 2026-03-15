import Image from "next/image";
import Link from "next/link";
import { IoArrowForward, IoCheckmarkDone } from "react-icons/io5";
import { BsFillPatchCheckFill } from "react-icons/bs";
import FeatureCard from "@/components/Card/FeatureCard";
import LaunchBanner from "@/components/Banner/LaunchBanner";
import { Button } from "@/components/ui/button";
import Accordion from "@/components/Elements/Accordion";
import { cn } from "@/lib/utils";
import TemplateCard from "@/components/Card/TemplateCard";
import FeedbackSection from "@/components/Section/FeedbackSection";
import BuildingBanner from "@/components/Banner/BuildingBanner";
import { createClient } from "@/lib/supabase/server";
import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import type { TemplateListItem, Category, Review, FAQ } from "@/lib/supabase/types";

export const metadata: Metadata = {
  title: "CherryPick — Premium UI Kits, Templates & Design Assets",
  description:
    "Browse our curated collection of premium UI templates, Figma kits, Framer templates, and code components. Build faster with CherryPick.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "CherryPick — Premium UI Kits, Templates & Design Assets",
    description:
      "Browse our curated collection of premium UI templates, Figma kits, Framer templates, and code components.",
    url: "/",
  },
};

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://cherrypick.design";

export default async function Home() {
  const supabase = await createClient();

  const [
    { data: featuredRaw },
    { data: latestRaw },
    { data: categoriesRaw },
    { data: faqsRaw },
    { data: reviewsRaw },
  ] = await Promise.all([
    supabase
      .from("templates")
      .select("*, categories(name, slug, icon_url), template_images(image_url, is_primary)")
      .eq("status", "published")
      .eq("is_featured", true)
      .order("created_at", { ascending: false })
      .limit(8),
    supabase
      .from("templates")
      .select("*, categories(name, slug, icon_url), template_images(image_url, is_primary)")
      .eq("status", "published")
      .order("created_at", { ascending: false })
      .limit(8),
    supabase.from("categories").select("*").order("sort_order"),
    supabase.from("faqs").select("*").order("sort_order"),
    supabase.from("reviews").select("*").order("created_at", { ascending: false }).limit(10),
  ]);

  const featuredTemplates = featuredRaw as unknown as TemplateListItem[] | null;
  const latestTemplates = latestRaw as unknown as TemplateListItem[] | null;
  const categories = categoriesRaw as unknown as Category[] | null;
  const faqs = faqsRaw as unknown as FAQ[] | null;
  const reviews = reviewsRaw as unknown as Review[] | null;

  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "CherryPick",
    url: siteUrl,
    logo: `${siteUrl}/assets/ic-logo-cherrypick.svg`,
    description: "A curated marketplace of premium UI templates for Figma, Framer, React, and more.",
    sameAs: [
      "https://twitter.com",
      "https://linkedin.com",
      "https://instagram.com",
    ],
  };

  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "CherryPick",
    url: siteUrl,
    potentialAction: {
      "@type": "SearchAction",
      target: { "@type": "EntryPoint", urlTemplate: `${siteUrl}/template?q={search_term_string}` },
      "query-input": "required name=search_term_string",
    },
  };

  const faqJsonLd = faqs && faqs.length > 0
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: { "@type": "Answer", text: faq.answer },
        })),
      }
    : null;

  return (
    <>
      <JsonLd data={organizationJsonLd} />
      <JsonLd data={websiteJsonLd} />
      {faqJsonLd && <JsonLd data={faqJsonLd} />}

      <div className="flex flex-col min-h-screen items-center">
        {/* HERO */}
        <section aria-label="Hero" className="flex w-full max-w-360 xl:flex-row flex-col items-center justify-between gap-20 pt-20 px-2 lg:pt-30 lg:px-10 bg-white sm:items-start">
          <div className="flex flex-col gap-12">
            <div className="flex flex-col gap-6">
              <h1 className="text-[64px] text-[#1A1A1A] font-semibold leading-16">
                Launch Faster with <span className="text-[#C42026]">Premium Templates</span>
              </h1>
              <p className="text-lg text-[#666666]">
                A curated collection of modern website templates crafted with precision, consistency, and scalability in mind.
              </p>
              <div className="flex gap-4">
                <div className="flex gap-2 items-center bg-[#FAFAFA] py-1 px-2 rounded-full">
                  <IoCheckmarkDone color="#C42026" />
                  <span className="text-[#1A1A1A]">Easy to Customize</span>
                </div>
                <div className="flex gap-2 items-center bg-[#FAFAFA] py-1 px-2 rounded-full">
                  <IoCheckmarkDone color="#C42026" />
                  <span className="text-[#1A1A1A]">Responsive &amp; Scalable</span>
                </div>
              </div>
            </div>
            <div className="flex gap-6">
              <Link href="/template">
                <Button variant="default">
                  Browse Templates
                  <IoArrowForward />
                </Button>
              </Link>
              <Link href="/template#latest">
                <Button variant="outline">
                  Latest Templates
                  <IoArrowForward />
                </Button>
              </Link>
            </div>
          </div>
          <Image
            src="/assets/ic-intro.svg"
            alt="CherryPick premium UI template marketplace illustration"
            className="w-full"
            width={100}
            height={20}
            priority
          />
        </section>

        {/* FEATURED TEMPLATES */}
        <section aria-label="Featured Templates" className="p-4 lg:p-10 w-full">
          <div className="w-full mx-auto max-w-360 bg-[#F5F5F5] p-10 rounded-3xl flex flex-col gap-14">
            <div className="flex lg:flex-row flex-col w-full justify-between gap-6">
              <div className="flex gap-2 items-center w-full">
                <BsFillPatchCheckFill size={20} color="#249B00" />
                <h2 className="text-[28px] lg:text-[32px] text-[#1A1A1A] font-semibold">Featured Templates</h2>
              </div>
              <Link href="/feature">
                <Button variant="outline" className="whitespace-nowrap">
                  Explore all featured
                  <IoArrowForward />
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {featuredTemplates && featuredTemplates.length > 0
                ? featuredTemplates.map((t) => {
                    const imgs = t.template_images as { image_url: string; is_primary: boolean }[] | null;
                    const primaryImg = imgs?.find((i) => i.is_primary)?.image_url ?? imgs?.[0]?.image_url ?? "/assets/ic-zenith.svg";
                    const cat = t.categories as { name: string; icon_url: string | null } | null;
                    return (
                      <Link key={t.id} href={`/template/${t.slug}`}>
                        <FeatureCard
                          img={primaryImg}
                          is_checked
                          price={t.price}
                          template_icon={cat?.icon_url ?? "/assets/ic-figma.svg"}
                          template_label={cat?.name ?? "Template"}
                          title={t.title}
                          showFeature
                        />
                      </Link>
                    );
                  })
                : Array.from({ length: 4 }).map((_, index) => (
                    <FeatureCard
                      key={index}
                      img="/assets/ic-zenith.svg"
                      is_checked
                      price={20}
                      template_icon="/assets/ic-figma.svg"
                      template_label="Figma"
                      title="Zenith - Web3 Wallet Website"
                      showFeature
                    />
                  ))}
            </div>
          </div>
        </section>

        {/* WHY CHERRYPICK */}
        <section aria-label="Why CherryPick" className="flex lg:flex-row flex-col px-3 lg:px-10 relative gap-10 w-full mx-auto max-w-360 justify-between">
          <div className="lg:sticky lg:top-15 h-fit w-full lg:w-155 shrink-0">
            <h2 className="text-[64px] text-[#1A1A1A] font-semibold leading-16">
              Everything <br /> You Need <br /> to <span className="text-[#C42026]">Build Faster</span>
            </h2>
          </div>
          <div className="flex flex-col w-full gap-16 flex-1">
            <article className="flex flex-col relative justify-start items-center border border-[#EBEBEB] p-8 gap-4 w-full h-80 rounded-3xl hover:shadow-xl">
              <Image alt="Save time icon" width={100} height={100} className="w-10" src="/assets/ic-rocket.svg" />
              <h3 className="text-center text-2xl font-semibold text-[#1A1A1A]">Save Time, Ship Faster</h3>
              <p className="text-center text-base text-[#666666]">
                Skip repetitive setup work. Our templates help you launch projects in hours, not days.
              </p>
              <Image alt="Waving decoration" width={100} height={100} className="w-full absolute bottom-0" src="/assets/ic-waving.svg" />
            </article>
            <article className="flex flex-col relative justify-start items-center border border-[#EBEBEB] p-8 gap-4 w-full h-80 rounded-3xl hover:shadow-xl">
              <Image alt="Customization icon" width={100} height={100} className="w-10" src="/assets/ic-magic.svg" />
              <h3 className="text-center text-2xl font-semibold text-[#1A1A1A]">Easy to Customize</h3>
              <p className="text-center text-base text-[#666666]">
                Every component is built with clean structure. Swap colors, fonts, and layouts with ease.
              </p>
              <Image alt="Waving decoration" width={100} height={100} className="w-full absolute bottom-0" src="/assets/ic-waving.svg" />
            </article>
            <article className="flex flex-col relative justify-start items-center border border-[#EBEBEB] p-8 gap-4 w-full h-80 rounded-3xl hover:shadow-xl">
              <Image alt="Premium quality icon" width={100} height={100} className="w-10" src="/assets/ic-rocket.svg" />
              <h3 className="text-center text-2xl font-semibold text-[#1A1A1A]">Built for Scale</h3>
              <p className="text-center text-base text-[#666666]">
                Templates designed with scalability in mind. Start small, grow fast — without rework.
              </p>
              <Image alt="Waving decoration" width={100} height={100} className="w-full absolute bottom-0" src="/assets/ic-waving.svg" />
            </article>
          </div>
        </section>

        {/* BANNER LAUNCH */}
        <div className="p-8 w-full">
          <LaunchBanner />
        </div>

        {/* TEMPLATE CATEGORIES */}
        <section aria-label="Template Categories" className="flex flex-col relative gap-10 w-full mx-auto max-w-360 px-3 lg:px-10">
          <h2 className="text-[32px] text-[#1A1A1A] font-semibold">Our Templates Category</h2>
          <div className="flex lg:flex-row flex-col w-full gap-10">
            {(categories && categories.length > 0 ? categories : [
              { id: "1", name: "UI Kit", slug: "ui-kit", icon_url: "/assets/ic-figma.svg", is_coming_soon: false, sort_order: 1, created_at: "" },
              { id: "2", name: "Framer", slug: "framer", icon_url: "/assets/ic-framer.svg", is_coming_soon: false, sort_order: 2, created_at: "" },
              { id: "3", name: "Code", slug: "code", icon_url: "/assets/ic-code.svg", is_coming_soon: false, sort_order: 3, created_at: "" },
              { id: "4", name: "Bundling", slug: "bundling", icon_url: "/assets/ic-library.svg", is_coming_soon: false, sort_order: 4, created_at: "" },
              { id: "5", name: "E-book", slug: "ebook", icon_url: "/assets/ic-ebook.svg", is_coming_soon: false, sort_order: 5, created_at: "" },
              { id: "6", name: "Webflow", slug: "webflow", icon_url: "/assets/ic-webflow.svg", is_coming_soon: true, sort_order: 6, created_at: "" },
            ]).map((cat) => (
              <Link
                key={cat.id}
                href={cat.is_coming_soon ? "#" : `/template?category=${cat.slug}`}
                className={cn(
                  "flex flex-col gap-4 relative justify-center items-center py-8 px-4 bg-[#FEFEFE] border border-[#DDDDDD] rounded-3xl w-full transition-shadow hover:shadow-md",
                  { "bg-[#F5F5F5] pointer-events-none": cat.is_coming_soon }
                )}
              >
                {cat.is_coming_soon && (
                  <span className="text-[#FEFEFE] text-[10px] py-1.5 px-3 bg-[#1A1A1A] rounded-full absolute -top-2">
                    Coming soon
                  </span>
                )}
                {cat.icon_url && (
                  <Image
                    alt={`${cat.name} templates icon`}
                    width={80}
                    height={80}
                    className="w-20"
                    src={cat.icon_url}
                  />
                )}
                <span className={cn("text-xl text-[#1A1A1A] font-bold", { "text-[#888888]": cat.is_coming_soon })}>
                  {cat.name}
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* LATEST TEMPLATES */}
        <section id="latest" aria-label="Latest Templates" className="p-4 lg:p-10 w-full">
          <div className="w-full mx-auto max-w-360 bg-[#F5F5F5] p-10 rounded-3xl flex flex-col gap-14">
            <div className="flex lg:flex-row flex-col w-full justify-between gap-6">
              <h2 className="text-[28px] lg:text-[32px] text-[#1A1A1A] font-semibold">Latest Templates</h2>
              <Link href="/template">
                <Button variant="outline" className="whitespace-nowrap">
                  Explore all latest
                  <IoArrowForward />
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {latestTemplates && latestTemplates.length > 0
                ? latestTemplates.map((t) => {
                    const imgs = t.template_images as { image_url: string; is_primary: boolean }[] | null;
                    const primaryImg = imgs?.find((i) => i.is_primary)?.image_url ?? imgs?.[0]?.image_url ?? "/assets/ic-zenith.svg";
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
                : Array.from({ length: 4 }).map((_, index) => (
                    <TemplateCard
                      key={index}
                      id={`placeholder-${index}`}
                      slug="zenith-web3-wallet"
                      img="/assets/ic-zenith.svg"
                      is_checked
                      price={20}
                      template_icon="/assets/ic-figma.svg"
                      template_label="Figma"
                      title="Zenith - Web3 Wallet Website"
                      is_new
                    />
                  ))}
            </div>
          </div>
        </section>

        {/* FEEDBACK SECTION */}
        <FeedbackSection reviews={reviews ?? []} />

        {/* FAQ SECTION */}
        <section aria-label="Frequently Asked Questions" className="flex flex-col gap-10 w-full mx-auto max-w-360 py-10 px-3 lg:px-10">
          <h2 className="text-[32px] text-[#1A1A1A] font-semibold">Frequently Asked Questions</h2>
          <Accordion
            items={
              faqs && faqs.length > 0
                ? faqs.map((f) => ({ question: f.question, answer: f.answer }))
                : [
                    {
                      question: "What formats are the templates available in?",
                      answer: "Our templates are available in multiple formats including Figma, Framer, and coded versions.",
                    },
                    {
                      question: "Can I use the templates for commercial projects?",
                      answer: "Yes! All our templates come with a commercial license.",
                    },
                  ]
            }
          />
        </section>

        {/* BUILDING SECTION */}
        <div className="p-3 lg:px-10 w-full">
          <BuildingBanner />
        </div>
      </div>
    </>
  );
}
