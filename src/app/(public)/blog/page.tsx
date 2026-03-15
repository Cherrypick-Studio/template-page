import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getAllPosts } from "@/lib/blog";
import JsonLd from "@/components/JsonLd";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://store.cherrypick.studio";

export const metadata: Metadata = {
  title: "Blog & Articles — UI Design, Templates & SaaS Resources",
  description:
    "In-depth guides, comparisons, and tutorials on UI design, Figma templates, SaaS landing pages, and admin dashboards. Written for founders and designers.",
  alternates: { canonical: "/blog" },
  openGraph: {
    title: "Blog & Articles | CherryPick",
    description:
      "In-depth guides, comparisons, and tutorials on UI design, Figma templates, SaaS landing pages, and admin dashboards.",
    url: "/blog",
  },
};

export default function BlogPage() {
  const posts = getAllPosts();

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
      { "@type": "ListItem", position: 2, name: "Blog", item: `${siteUrl}/blog` },
    ],
  };

  return (
    <>
      <JsonLd data={breadcrumbJsonLd} />
      <div className="w-full mx-auto max-w-360 px-4 lg:px-10 py-10 lg:py-20">
        <div className="flex flex-col gap-4 mb-14">
          <h1 className="text-[40px] lg:text-[56px] font-semibold text-[#1A1A1A] leading-tight">
            Blog & Articles
          </h1>
          <p className="text-lg text-[#666666] max-w-xl">
            Guides, tutorials, and resources for founders, designers, and developers building faster with UI templates.
          </p>
        </div>

        {posts.length === 0 ? (
          <div className="flex items-center justify-center h-60 border border-[#DDDDDD] rounded-3xl">
            <p className="text-[#888888]">Articles coming soon. Check back shortly!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="group flex flex-col gap-4">
                <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden bg-[#F5F5F5]">
                  <Image
                    src={post.coverImage}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <div className="flex gap-2 flex-wrap">
                    {post.tags.slice(0, 2).map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] py-1 px-2.5 bg-[#F5F5F5] text-[#888888] rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <h2 className="text-lg font-semibold text-[#1A1A1A] group-hover:text-[#C42026] transition-colors leading-snug">
                    {post.title}
                  </h2>
                  <p className="text-sm text-[#666666] line-clamp-2">{post.excerpt}</p>
                  <div className="flex items-center gap-3 text-xs text-[#999999] mt-1">
                    <span>{post.author}</span>
                    <span>·</span>
                    <span>
                      {new Date(post.publishedAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                    <span>·</span>
                    <span>{post.readingTime} min read</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
