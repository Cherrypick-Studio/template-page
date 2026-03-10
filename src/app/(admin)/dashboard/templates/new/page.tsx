import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import TemplateForm from "@/components/Dashboard/TemplateForm";
import { ChevronLeft } from "lucide-react";
import type { Category } from "@/lib/supabase/types";

export const metadata: Metadata = { title: "New Template" };

export default async function NewTemplatePage() {
  const supabase = await createClient();
  const { data: categoriesRaw } = await supabase
    .from("categories")
    .select("*")
    .order("sort_order");
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
        <span className="text-sm font-medium text-[#1A1A1A]">New Template</span>
      </div>
      <h1 className="text-2xl font-semibold text-[#1A1A1A]">Create Template</h1>
      <TemplateForm categories={categories} mode="create" />
    </div>
  );
}
