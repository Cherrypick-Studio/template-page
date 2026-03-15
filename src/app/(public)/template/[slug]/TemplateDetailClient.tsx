"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import DetailStickyCard from "@/components/Card/DetailStickyCard";
import DetailMobileBottomBar from "@/components/Card/DetailMobileBottomBar";
import ImagePreview from "@/components/ImagePreview";
import { Button } from "@/components/ui/button";
import { IoArrowForward } from "react-icons/io5";
import TemplateCard from "@/components/Card/TemplateCard";
import type { Template } from "@/lib/supabase/types";
import type { TemplateListItem } from "@/lib/supabase/types";
import { useCart } from "@/contexts/CartContext";

type TemplateImagePartial = {
  id: string;
  image_url: string;
  alt_text: string | null;
  sort_order: number;
  is_primary: boolean;
};

interface TemplateDetailClientProps {
  template: Template;
  images: TemplateImagePartial[];
  category: { name: string; slug: string; icon_url: string | null } | null;
  relatedTemplates: TemplateListItem[];
}

export default function TemplateDetailClient({
  template,
  images,
  category,
  relatedTemplates,
}: TemplateDetailClientProps) {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const { addItem, isInCart, openCart } = useCart();

  const templateImages = images.map((img) => ({
    src: img.image_url,
    alt: img.alt_text ?? `${template.title} preview`,
  }));

  const primaryImage =
    images.find((i) => i.is_primary)?.image_url ??
    images[0]?.image_url ??
    "/assets/ic-zenith.svg";

  function handleAddToCart() {
    addItem({
      id: template.id,
      slug: template.slug,
      title: template.title,
      price: template.price,
      imageUrl: primaryImage,
      variantId: template.lemon_squeezy_variant_id ?? null,
    });
    openCart();
  }

  const addedToCart = isInCart(template.id);

  return (
    <div className="w-full">
      <nav aria-label="Breadcrumb" className="w-full mx-auto max-w-360 px-10 pt-6">
        <ol className="flex items-center gap-2 text-sm text-[#888888]">
          <li>
            <Link href="/" className="hover:text-[#1A1A1A] transition-colors">Home</Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link href="/template" className="hover:text-[#1A1A1A] transition-colors">Templates</Link>
          </li>
          <li aria-hidden="true">/</li>
          <li className="text-[#1A1A1A] font-medium truncate max-w-xs">{template.title}</li>
        </ol>
      </nav>

      <div className="w-full mx-auto max-w-360 p-10 flex flex-col lg:flex-row gap-10">
        {/* Left column */}
        <article className="flex flex-col gap-6 flex-1 min-w-0">
          <h1 className="text-[28px] lg:text-[36px] font-semibold text-[#1A1A1A]">
            {template.title}
          </h1>
          <div className="flex items-center gap-5">
            <span className="text-[#888888]">Templates category</span>
            {category && (
              <div className="flex gap-2 items-center py-0 px-4 bg-[#FEFEFE] border border-[#DDDDDD] rounded-full text-base text-[#1A1A1A]">
                {category.icon_url && (
                  <Image
                    src={category.icon_url}
                    width={14}
                    height={14}
                    alt={`${category.name} icon`}
                    className="w-3.5 aspect-square object-contain"
                  />
                )}
                <span>{category.name}</span>
              </div>
            )}
          </div>

          {/* Image gallery */}
          <div className="flex flex-col gap-3">
            {templateImages.length > 0 ? (
              <>
                <div
                  className="relative w-full cursor-pointer overflow-hidden rounded-2xl"
                  onClick={() => setPreviewOpen(true)}
                >
                  <Image
                    src={templateImages[activeImageIndex].src}
                    alt={templateImages[activeImageIndex].alt}
                    width={800}
                    height={500}
                    className="w-full rounded-2xl hover:scale-105 transition-transform duration-300"
                    priority
                  />
                </div>
                {templateImages.length > 1 && (
                  <div className="overflow-x-auto pb-1">
                    <div className="flex gap-4 lg:gap-8 w-fit mx-auto">
                      {templateImages.map((img, index) => (
                        <button
                          key={index}
                          onClick={() => setActiveImageIndex(index)}
                          aria-label={`View image ${index + 1}`}
                          className={`shrink-0 rounded-xl overflow-hidden border-2 transition-all ${
                            index === activeImageIndex
                              ? "border-[#007FFF] opacity-100"
                              : "border-transparent opacity-60 hover:opacity-100"
                          }`}
                        >
                          <Image
                            src={img.src}
                            alt={img.alt}
                            width={120}
                            height={80}
                            className="w-20 h-16 lg:w-40 lg:h-30 object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="w-full aspect-video bg-[#F5F5F5] rounded-2xl flex items-center justify-center">
                <span className="text-[#888888]">No images yet</span>
              </div>
            )}
          </div>

          {/* Description */}
          {template.description && (
            <div className="flex flex-col gap-4">
              <h2 className="text-xl font-semibold text-[#1A1A1A]">Description</h2>
              <p className="text-base text-[#4A4A4A] leading-7 whitespace-pre-wrap">
                {template.description}
              </p>
            </div>
          )}
        </article>

        {/* Right column — sticky card */}
        <div className="hidden lg:block w-full lg:w-90 shrink-0">
          <DetailStickyCard
            title={template.title}
            price={template.price}
            category={category?.name ?? undefined}
            categoryIcon={category?.icon_url ?? undefined}
            rating={template.rating}
            salesCount={template.sales_count}
            fileType={template.file_type ?? undefined}
            fileSize={template.file_size ?? undefined}
            productType={template.product_type ?? undefined}
            createdAt={template.created_at}
            variantId={template.lemon_squeezy_variant_id}
            templateId={template.id}
            onAddToCart={handleAddToCart}
            isAddedToCart={addedToCart}
          />
        </div>
      </div>

      <hr className="border-[#EEEEEE] mx-auto max-w-360" />

      {/* Related templates */}
      <section aria-label="Related Templates" className="w-full flex flex-col gap-14 mx-auto max-w-360 p-10">
        <div className="flex lg:flex-row flex-col w-full justify-between gap-6">
          <h2 className="text-[28px] lg:text-[32px] text-[#1A1A1A] font-semibold">
            More Templates
          </h2>
          <Link href="/template">
            <Button variant="outline" className="whitespace-nowrap">
              Explore all
              <IoArrowForward />
            </Button>
          </Link>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {relatedTemplates.map((t) => {
            const imgs = t.template_images as { image_url: string; is_primary: boolean }[] | null;
            const img = imgs?.find((i) => i.is_primary)?.image_url ?? imgs?.[0]?.image_url ?? "/assets/ic-zenith.svg";
            const cat = t.categories as { name: string; icon_url: string | null } | null;
            return (
              <TemplateCard
                key={t.id}
                id={t.id}
                slug={t.slug}
                img={img}
                is_checked
                price={t.price}
                template_icon={cat?.icon_url ?? "/assets/ic-figma.svg"}
                template_label={cat?.name ?? "Template"}
                title={t.title}
                is_new={t.is_new}
              />
            );
          })}
        </div>
      </section>

      {/* Image preview modal */}
      {templateImages.length > 0 && (
        <ImagePreview
          images={templateImages}
          activeIndex={activeImageIndex}
          onActiveIndexChange={setActiveImageIndex}
          open={previewOpen}
          onOpenChange={setPreviewOpen}
        />
      )}

      {/* Mobile bottom bar */}
      <DetailMobileBottomBar
        title={template.title}
        price={template.price}
        category={category?.name ?? undefined}
        categoryIcon={category?.icon_url ?? undefined}
        rating={template.rating}
        salesCount={template.sales_count}
        fileType={template.file_type ?? undefined}
        fileSize={template.file_size ?? undefined}
        productType={template.product_type ?? undefined}
        createdAt={template.created_at}
        variantId={template.lemon_squeezy_variant_id}
        templateId={template.id}
        onAddToCart={handleAddToCart}
        isAddedToCart={addedToCart}
      />
      <div className="h-24 lg:hidden" />
    </div>
  );
}
