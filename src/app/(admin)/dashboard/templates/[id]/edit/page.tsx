import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import TemplateForm from "@/components/Dashboard/TemplateForm";
import { ChevronLeft } from "lucide-react";
import type { Template, TemplateImage, Category } from "@/lib/supabase/types";

type TemplateWithImages = Template & { template_images: TemplateImage[] };

export const metadata: Metadata = { title: "Edit Template" };

export default async function EditTemplatePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: templateRaw }, { data: categoriesRaw }] = await Promise.all([
    supabase
      .from("templates")
      .select("*, template_images(*)")
      .eq("id", id)
      .single(),
    supabase.from("categories").select("*").order("sort_order"),
  ]);

  if (!templateRaw) notFound();
  const template = templateRaw as unknown as TemplateWithImages;
  const categories = (categoriesRaw as unknown as Category[]) ?? [];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <Link
          href="/dashboard/templates"
          className="flex items-center gap-1 text-sm text-[#888888] hover:text-[#1A1A1A] transition-colors"
        >
          <ChevronLeft className="size-4" />
          Templates
        </Link>
        <span className="text-[#DDDDDD]">/</span>
        <span className="text-sm font-medium text-[#1A1A1A] truncate max-w-xs">{template.title}</span>
      </div>
      <h1 className="text-2xl font-semibold text-[#1A1A1A]">Edit Template</h1>
      <TemplateForm
        categories={categories}
        template={template}
        mode="edit"
      />
    </div>
  );
}
