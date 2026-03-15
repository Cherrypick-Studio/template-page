"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Loader2, X, Upload, GripVertical } from "lucide-react";
import type { Category, Template, TemplateImage } from "@/lib/supabase/types";

interface TemplateFormProps {
  categories: Category[];
  template?: Template & { template_images?: TemplateImage[] };
  mode: "create" | "edit";
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

interface ImageItem {
  id?: string;
  url: string;
  alt: string;
  is_primary: boolean;
  file?: File;
  uploading?: boolean;
}

export default function TemplateForm({ categories, template, mode }: TemplateFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [slugEdited, setSlugEdited] = useState(false);

  const [title, setTitle] = useState(template?.title ?? "");
  const [slug, setSlug] = useState(template?.slug ?? "");
  const [description, setDescription] = useState(template?.description ?? "");
  const [price, setPrice] = useState(String(template?.price ?? "0"));
  const [categoryId, setCategoryId] = useState(template?.category_id ?? "");
  const [isFeatured, setIsFeatured] = useState(template?.is_featured ?? false);
  const [isNew, setIsNew] = useState(template?.is_new ?? true);
  const [status, setStatus] = useState<"published" | "draft" | "wip">(template?.status ?? "draft");
  const [fileType, setFileType] = useState(template?.file_type ?? "");
  const [fileSize, setFileSize] = useState(template?.file_size ?? "");
  const [productType, setProductType] = useState(template?.product_type ?? "");
  const [lsVariantId, setLsVariantId] = useState(template?.lemon_squeezy_variant_id ?? "");

  const [images, setImages] = useState<ImageItem[]>(
    template?.template_images?.map((img) => ({
      id: img.id,
      url: img.image_url,
      alt: img.alt_text ?? "",
      is_primary: img.is_primary,
    })) ?? []
  );

  function handleTitleChange(val: string) {
    setTitle(val);
    if (!slugEdited) {
      setSlug(slugify(val));
    }
  }

  function handleSlugChange(val: string) {
    setSlugEdited(true);
    setSlug(slugify(val));
  }

  const handleImageFiles = useCallback((files: FileList | null) => {
    if (!files) return;
    const newItems: ImageItem[] = Array.from(files).map((file) => ({
      url: URL.createObjectURL(file),
      alt: file.name.replace(/\.[^.]+$/, ""),
      is_primary: false,
      file,
    }));
    setImages((prev) => {
      const combined = [...prev, ...newItems];
      if (combined.length > 0 && !combined.some((i) => i.is_primary)) {
        combined[0].is_primary = true;
      }
      return combined;
    });
  }, []);

  function setPrimary(idx: number) {
    setImages((prev) =>
      prev.map((img, i) => ({ ...img, is_primary: i === idx }))
    );
  }

  function removeImage(idx: number) {
    setImages((prev) => {
      const updated = prev.filter((_, i) => i !== idx);
      if (updated.length > 0 && !updated.some((i) => i.is_primary)) {
        updated[0].is_primary = true;
      }
      return updated;
    });
  }

  async function uploadImage(file: File, templateId: string): Promise<string> {
    const supabase = createClient();
    const ext = file.name.split(".").pop();
    const path = `${templateId}/${Date.now()}.${ext}`;
    const { error } = await supabase.storage
      .from("template-images")
      .upload(path, file, { upsert: true });
    if (error) throw new Error(error.message);

    const { data } = supabase.storage.from("template-images").getPublicUrl(path);
    return data.publicUrl;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();

    try {
      const payload = {
        title: title.trim(),
        slug: slug.trim(),
        description: description.trim() || null,
        price: parseFloat(price) || 0,
        category_id: categoryId || null,
        is_featured: isFeatured,
        is_new: isNew,
        status,
        file_type: fileType.trim() || null,
        file_size: fileSize.trim() || null,
        product_type: productType.trim() || null,
        lemon_squeezy_variant_id: lsVariantId.trim() || null,
        updated_at: new Date().toISOString(),
      };

      let templateId = template?.id;

      if (mode === "create") {
        const { data, error: createError } = await supabase
          .from("templates")
          .insert(payload)
          .select("id")
          .single();
        if (createError) throw new Error(createError.message);
        templateId = data.id;
      } else {
        const { error: updateError } = await supabase
          .from("templates")
          .update(payload)
          .eq("id", templateId!);
        if (updateError) throw new Error(updateError.message);
        // Delete existing images before re-inserting
        await supabase.from("template_images").delete().eq("template_id", templateId!);
      }

      // Upload new image files and insert all image records
      if (images.length > 0) {
        const imageInserts = await Promise.all(
          images.map(async (img, idx) => {
            let imageUrl = img.url;
            if (img.file) {
              imageUrl = await uploadImage(img.file, templateId!);
            }
            return {
              template_id: templateId!,
              image_url: imageUrl,
              alt_text: img.alt || null,
              sort_order: idx,
              is_primary: img.is_primary,
            };
          })
        );
        const { error: imgError } = await supabase.from("template_images").insert(imageInserts);
        if (imgError) throw new Error(imgError.message);
      }

      router.push("/dashboard/templates");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      {error && (
        <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Main fields */}
        <div className="lg:col-span-2 flex flex-col gap-5 rounded-2xl border border-[#EBEBEB] bg-white p-6">
          <h2 className="font-semibold text-[#1A1A1A]">Template Details</h2>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-[#1A1A1A]">Title *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="Zenith - Web3 Wallet Website"
              className="h-10 rounded-lg border border-[#DDDDDD] bg-white px-3 text-sm text-[#1A1A1A] outline-none placeholder:text-[#AAAAAA] focus:border-[#1A1A1A] focus:ring-2 focus:ring-[#1A1A1A]/10"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-[#1A1A1A]">Slug *</label>
            <div className="flex items-center rounded-lg border border-[#DDDDDD] bg-[#F9F9F9] overflow-hidden focus-within:border-[#1A1A1A] focus-within:ring-2 focus-within:ring-[#1A1A1A]/10">
              <span className="px-3 text-sm text-[#888888] shrink-0">/template/</span>
              <input
                type="text"
                required
                value={slug}
                onChange={(e) => handleSlugChange(e.target.value)}
                placeholder="zenith-web3-wallet"
                className="flex-1 h-10 bg-transparent text-sm text-[#1A1A1A] outline-none pr-3 placeholder:text-[#AAAAAA]"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-[#1A1A1A]">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what's included in this template..."
              rows={5}
              className="rounded-lg border border-[#DDDDDD] bg-white px-3 py-2.5 text-sm text-[#1A1A1A] outline-none resize-none placeholder:text-[#AAAAAA] focus:border-[#1A1A1A] focus:ring-2 focus:ring-[#1A1A1A]/10"
            />
          </div>

          {/* Lemon Squeezy */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-[#1A1A1A]">
              Lemon Squeezy Variant ID
            </label>
            <input
              type="text"
              value={lsVariantId}
              onChange={(e) => setLsVariantId(e.target.value)}
              placeholder="e.g. 123456"
              className="h-10 rounded-lg border border-[#DDDDDD] bg-white px-3 text-sm text-[#1A1A1A] outline-none placeholder:text-[#AAAAAA] focus:border-[#1A1A1A] focus:ring-2 focus:ring-[#1A1A1A]/10"
            />
            <p className="text-xs text-[#888888]">
              Found in your Lemon Squeezy dashboard under the product variant. Required for checkout.
            </p>
          </div>

          {/* File Metadata */}
          <div className="grid grid-cols-3 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-[#1A1A1A]">File Type</label>
              <input
                type="text"
                value={fileType}
                onChange={(e) => setFileType(e.target.value)}
                placeholder="Figma (.fig)"
                className="h-10 rounded-lg border border-[#DDDDDD] bg-white px-3 text-sm text-[#1A1A1A] outline-none placeholder:text-[#AAAAAA] focus:border-[#1A1A1A] focus:ring-2 focus:ring-[#1A1A1A]/10"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-[#1A1A1A]">File Size</label>
              <input
                type="text"
                value={fileSize}
                onChange={(e) => setFileSize(e.target.value)}
                placeholder="45 MB"
                className="h-10 rounded-lg border border-[#DDDDDD] bg-white px-3 text-sm text-[#1A1A1A] outline-none placeholder:text-[#AAAAAA] focus:border-[#1A1A1A] focus:ring-2 focus:ring-[#1A1A1A]/10"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-[#1A1A1A]">Product Type</label>
              <input
                type="text"
                value={productType}
                onChange={(e) => setProductType(e.target.value)}
                placeholder="Responsive"
                className="h-10 rounded-lg border border-[#DDDDDD] bg-white px-3 text-sm text-[#1A1A1A] outline-none placeholder:text-[#AAAAAA] focus:border-[#1A1A1A] focus:ring-2 focus:ring-[#1A1A1A]/10"
              />
            </div>
          </div>
        </div>

        {/* Sidebar fields */}
        <div className="flex flex-col gap-5">
          {/* Publish settings */}
          <div className="rounded-2xl border border-[#EBEBEB] bg-white p-5 flex flex-col gap-4">
            <h2 className="font-semibold text-[#1A1A1A]">Publish</h2>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-[#1A1A1A]">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as typeof status)}
                className="h-10 rounded-lg border border-[#DDDDDD] bg-white px-3 text-sm text-[#1A1A1A] outline-none focus:border-[#1A1A1A]"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="wip">Work in Progress</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-[#1A1A1A]">Price (USD)</label>
              <div className="flex items-center rounded-lg border border-[#DDDDDD] bg-white overflow-hidden focus-within:border-[#1A1A1A] focus-within:ring-2 focus-within:ring-[#1A1A1A]/10">
                <span className="px-3 text-sm text-[#888888]">$</span>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="flex-1 h-10 bg-transparent text-sm text-[#1A1A1A] outline-none pr-3"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-[#1A1A1A]">Category</label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="h-10 rounded-lg border border-[#DDDDDD] bg-white px-3 text-sm text-[#1A1A1A] outline-none focus:border-[#1A1A1A]"
              >
                <option value="">— No category —</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="rounded border-[#DDDDDD] w-4 h-4 accent-[#C42026]"
                />
                <span className="text-sm text-[#1A1A1A]">Featured template</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isNew}
                  onChange={(e) => setIsNew(e.target.checked)}
                  className="rounded border-[#DDDDDD] w-4 h-4 accent-[#007FFF]"
                />
                <span className="text-sm text-[#1A1A1A]">Show &quot;New&quot; badge</span>
              </label>
            </div>

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Saving...
                </>
              ) : mode === "create" ? (
                "Create Template"
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Image upload section */}
      <div className="rounded-2xl border border-[#EBEBEB] bg-white p-6 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-[#1A1A1A]">Images</h2>
          <span className="text-xs text-[#888888]">
            {images.length} image{images.length !== 1 ? "s" : ""} — click to set primary
          </span>
        </div>

        {/* Drop zone */}
        <label className="flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-[#DDDDDD] p-8 cursor-pointer hover:border-[#1A1A1A] hover:bg-[#FAFAFA] transition-colors">
          <Upload className="size-8 text-[#888888]" />
          <div className="text-center">
            <p className="text-sm font-medium text-[#1A1A1A]">Click to upload images</p>
            <p className="text-xs text-[#888888] mt-1">PNG, JPG, WEBP up to 10MB each</p>
          </div>
          <input
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => handleImageFiles(e.target.files)}
          />
        </label>

        {/* Image previews */}
        {images.length > 0 && (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6">
            {images.map((img, idx) => (
              <div
                key={idx}
                className={`relative rounded-xl overflow-hidden border-2 cursor-pointer transition-all ${
                  img.is_primary
                    ? "border-[#C42026] ring-2 ring-[#C42026]/20"
                    : "border-[#DDDDDD] hover:border-[#888888]"
                }`}
                onClick={() => setPrimary(idx)}
              >
                <div className="aspect-video w-full bg-[#F5F5F5] relative">
                  <Image
                    src={img.url}
                    alt={img.alt || "Template preview"}
                    fill
                    className="object-cover"
                    unoptimized={img.url.startsWith("blob:")}
                  />
                </div>
                {img.is_primary && (
                  <div className="absolute bottom-1 left-1 right-1">
                    <span className="block text-center text-[9px] font-semibold bg-[#C42026] text-white rounded-full px-2 py-0.5">
                      Primary
                    </span>
                  </div>
                )}
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); removeImage(idx); }}
                  className="absolute top-1 right-1 rounded-full bg-black/60 p-0.5 text-white hover:bg-black transition-colors"
                >
                  <X className="size-3" />
                </button>
                <div className="absolute top-1 left-1 cursor-grab">
                  <GripVertical className="size-3.5 text-white drop-shadow" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </form>
  );
}
