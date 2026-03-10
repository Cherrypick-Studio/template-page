import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import CategoryManager from "./CategoryManager";
import type { Category } from "@/lib/supabase/types";

export const metadata: Metadata = { title: "Categories" };

export default async function CategoriesPage() {
  const supabase = await createClient();
  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .order("sort_order");

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-[#1A1A1A]">Categories</h1>
        <p className="text-sm text-[#888888] mt-1">
          Manage template categories shown on the public site.
        </p>
      </div>
      <CategoryManager initialCategories={(categories as Category[]) ?? []} />
    </div>
  );
}
