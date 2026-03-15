import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getPost, getAllSlugs } from "@/lib/blog";
import JsonLd from "@/components/JsonLd";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://cherrypick.design";

export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};

  const title = post.seoTitle ?? post.title;
  const description = post.excerpt;
  const ogImage = post.coverImage.startsWith("http")
    ? post.coverImage
    : `${siteUrl}${post.coverImage}`;

  return {
    title,
    description,
    alternates: { canonical: `/blog/${slug}` },
    openGraph: {
      type: "article",
      title,
      description,
      url: `/blog/${slug}`,
      publishedTime: post.publishedAt,
      authors: [post.author],
      images: [{ url: ogImage, width: 1200, height: 630, alt: post.title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    image: post.coverImage.startsWith("http")
      ? post.coverImage
      : `${siteUrl}${post.coverImage}`,
    author: { "@type": "Organization", name: post.author },
    publisher: {
      "@type": "Organization",
      name: "CherryPick",
      logo: { "@type": "ImageObject", url: `${siteUrl}/assets/ic-logo-cherrypick.svg` },
    },
    datePublished: post.publishedAt,
    dateModified: post.publishedAt,
    mainEntityOfPage: { "@type": "WebPage", "@id": `${siteUrl}/blog/${slug}` },
    keywords: post.tags.join(", "),
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
      { "@type": "ListItem", position: 2, name: "Blog", item: `${siteUrl}/blog` },
      { "@type": "ListItem", position: 3, name: post.title, item: `${siteUrl}/blog/${slug}` },
    ],
  };

  return (
    <>
      <JsonLd data={articleJsonLd} />
      <JsonLd data={breadcrumbJsonLd} />

      <div className="w-full mx-auto max-w-360 px-4 lg:px-10 py-10 lg:py-20">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-[#888888] mb-10">
          <Link href="/" className="hover:text-[#1A1A1A] transition-colors">Home</Link>
          <span>/</span>
          <Link href="/blog" className="hover:text-[#1A1A1A] transition-colors">Blog</Link>
          <span>/</span>
          <span className="text-[#1A1A1A] truncate max-w-[200px]">{post.title}</span>
        </nav>

        <div className="max-w-3xl mx-auto">
          {/* Tags */}
          <div className="flex gap-2 flex-wrap mb-6">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="text-[10px] py-1 px-2.5 bg-[#F5F5F5] text-[#888888] rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Title */}
          <h1 className="text-[32px] lg:text-[48px] font-semibold text-[#1A1A1A] leading-tight mb-6">
            {post.title}
          </h1>

          {/* Meta */}
          <div className="flex items-center gap-3 text-sm text-[#999999] mb-10">
            <span>{post.author}</span>
            <span>·</span>
            <span>
              {new Date(post.publishedAt).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </span>
            <span>·</span>
            <span>{post.readingTime} min read</span>
          </div>

          {/* Cover Image */}
          <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden mb-12">
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* MDX Content */}
          <article className="prose prose-lg max-w-none prose-headings:text-[#1A1A1A] prose-headings:font-semibold prose-p:text-[#444444] prose-a:text-[#C42026] prose-a:no-underline hover:prose-a:underline prose-strong:text-[#1A1A1A] prose-li:text-[#444444]">
            <MDXRemote source={post.content} />
          </article>

          {/* Back to Blog */}
          <div className="mt-16 pt-8 border-t border-[#DDDDDD]">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-sm font-medium text-[#888888] hover:text-[#1A1A1A] transition-colors"
            >
              ← Back to Blog
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
