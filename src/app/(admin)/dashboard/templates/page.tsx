import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import TemplateActions from "./TemplateActions";

type TemplateRow = {
  id: string;
  title: string;
  slug: string;
  status: string;
  price: number;
  is_featured: boolean;
  is_new: boolean;
  sales_count: number;
  created_at: string;
  categories: { name: string } | null;
};

export const metadata: Metadata = { title: "Templates" };

const statusConfig = {
  published: { label: "Published", className: "bg-green-100 text-green-700" },
  draft: { label: "Draft", className: "bg-yellow-100 text-yellow-700" },
  wip: { label: "WIP", className: "bg-blue-100 text-blue-700" },
} as const;

export default async function TemplatesPage() {
  const supabase = await createClient();

  const { data: templatesRaw } = await supabase
    .from("templates")
    .select("id, title, slug, status, price, is_featured, is_new, sales_count, created_at, categories(name)")
    .order("created_at", { ascending: false });
  const templates = templatesRaw as unknown as TemplateRow[] | null;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[#1A1A1A]">Templates</h1>
          <p className="text-sm text-[#888888] mt-1">
            {templates?.length ?? 0} templates total
          </p>
        </div>
        <Link href="/dashboard/templates/new">
          <Button>
            <Plus className="size-4" />
            Add Template
          </Button>
        </Link>
      </div>

      <div className="rounded-2xl border border-[#EBEBEB] bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#EBEBEB] text-left bg-[#FAFAFA]">
                <th className="px-5 py-3 font-medium text-[#888888]">Title</th>
                <th className="px-5 py-3 font-medium text-[#888888]">Category</th>
                <th className="px-5 py-3 font-medium text-[#888888]">Status</th>
                <th className="px-5 py-3 font-medium text-[#888888]">Price</th>
                <th className="px-5 py-3 font-medium text-[#888888]">Sales</th>
                <th className="px-5 py-3 font-medium text-[#888888]">Badges</th>
                <th className="px-5 py-3 font-medium text-[#888888]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {!templates || templates.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-16 text-center text-[#888888]">
                    No templates yet.{" "}
                    <Link
                      href="/dashboard/templates/new"
                      className="font-medium text-[#1A1A1A] underline"
                    >
                      Create your first template
                    </Link>
                  </td>
                </tr>
              ) : (
                templates.map((t) => {
                  const status = t.status as keyof typeof statusConfig;
                  const cat = t.categories;
                  return (
                    <tr
                      key={t.id}
                      className="border-b border-[#EBEBEB] last:border-0 hover:bg-[#FAFAFA] transition-colors"
                    >
                      <td className="px-5 py-3 font-medium text-[#1A1A1A] max-w-xs">
                        <div className="truncate">{t.title}</div>
                        <div className="text-xs text-[#888888] truncate">/{t.slug}</div>
                      </td>
                      <td className="px-5 py-3 text-[#666666]">{cat?.name ?? "—"}</td>
                      <td className="px-5 py-3">
                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusConfig[status]?.className ?? "bg-gray-100 text-gray-600"}`}
                        >
                          {statusConfig[status]?.label ?? status}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-[#666666]">
                        {t.price === 0 ? "Free" : `$${t.price}`}
                      </td>
                      <td className="px-5 py-3 text-[#666666]">{t.sales_count}</td>
                      <td className="px-5 py-3">
                        <div className="flex gap-1">
                          {t.is_featured && (
                            <span className="text-[10px] bg-[#C42026]/10 text-[#C42026] rounded-full px-2 py-0.5 font-medium whitespace-nowrap">
                              Featured
                            </span>
                          )}
                          {t.is_new && (
                            <span className="text-[10px] bg-[#007FFF]/10 text-[#007FFF] rounded-full px-2 py-0.5 font-medium">
                              New
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <Link
                            href={`/dashboard/templates/${t.id}/edit`}
                            className="text-xs font-medium text-[#1A1A1A] hover:underline"
                          >
                            Edit
                          </Link>
                          <TemplateActions id={t.id} title={t.title} />
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
