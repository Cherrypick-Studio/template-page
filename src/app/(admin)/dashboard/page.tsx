import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { LayoutTemplate, CheckCircle, FileEdit, Hammer, ShoppingBag, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

type RecentTemplate = {
  id: string;
  title: string;
  slug: string;
  status: string;
  price: number;
  is_featured: boolean;
  created_at: string;
  categories: { name: string } | null;
};

export const metadata: Metadata = { title: "Overview" };

async function getDashboardStats() {
  const supabase = await createClient();

  const [
    { count: total },
    { count: published },
    { count: draft },
    { count: wip },
    { count: orders },
    { data: recentTemplatesRaw },
  ] = await Promise.all([
    supabase.from("templates").select("*", { count: "exact", head: true }),
    supabase.from("templates").select("*", { count: "exact", head: true }).eq("status", "published"),
    supabase.from("templates").select("*", { count: "exact", head: true }).eq("status", "draft"),
    supabase.from("templates").select("*", { count: "exact", head: true }).eq("status", "wip"),
    supabase.from("orders").select("*", { count: "exact", head: true }),
    supabase
      .from("templates")
      .select("id, title, slug, status, price, is_featured, created_at, categories(name)")
      .order("created_at", { ascending: false })
      .limit(8),
  ]);

  return {
    total: total ?? 0,
    published: published ?? 0,
    draft: draft ?? 0,
    wip: wip ?? 0,
    orders: orders ?? 0,
    recentTemplates: (recentTemplatesRaw as unknown as RecentTemplate[]) ?? [],
  };
}

const statusConfig = {
  published: { label: "Published", className: "bg-green-100 text-green-700" },
  draft: { label: "Draft", className: "bg-yellow-100 text-yellow-700" },
  wip: { label: "WIP", className: "bg-blue-100 text-blue-700" },
} as const;

export default async function DashboardPage() {
  const stats = await getDashboardStats();

  const statCards = [
    {
      label: "Total Templates",
      value: stats.total,
      icon: LayoutTemplate,
      color: "text-[#1A1A1A]",
      bg: "bg-[#F5F5F5]",
    },
    {
      label: "Published",
      value: stats.published,
      icon: CheckCircle,
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      label: "Draft",
      value: stats.draft,
      icon: FileEdit,
      color: "text-yellow-600",
      bg: "bg-yellow-50",
    },
    {
      label: "Work in Progress",
      value: stats.wip,
      icon: Hammer,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "Total Orders",
      value: stats.orders,
      icon: ShoppingBag,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
  ];

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[#1A1A1A]">Overview</h1>
          <p className="text-sm text-[#888888] mt-1">
            Welcome back. Here&apos;s what&apos;s happening.
          </p>
        </div>
        <Link href="/dashboard/templates/new">
          <Button>
            <Plus className="size-4" />
            Add Template
          </Button>
        </Link>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        {statCards.map((card) => (
          <div
            key={card.label}
            className="flex flex-col gap-3 rounded-2xl border border-[#EBEBEB] bg-white p-5"
          >
            <div className={`w-fit rounded-xl p-2.5 ${card.bg}`}>
              <card.icon className={`size-5 ${card.color}`} />
            </div>
            <div>
              <p className="text-sm text-[#888888]">{card.label}</p>
              <p className="text-3xl font-semibold text-[#1A1A1A]">{card.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Recent templates table */}
      <div className="rounded-2xl border border-[#EBEBEB] bg-white">
        <div className="flex items-center justify-between border-b border-[#EBEBEB] p-5">
          <h2 className="font-semibold text-[#1A1A1A]">Recent Templates</h2>
          <Link
            href="/dashboard/templates"
            className="text-sm font-medium text-[#888888] hover:text-[#1A1A1A] transition-colors"
          >
            View all →
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#EBEBEB] text-left">
                <th className="px-5 py-3 font-medium text-[#888888]">Title</th>
                <th className="px-5 py-3 font-medium text-[#888888]">Category</th>
                <th className="px-5 py-3 font-medium text-[#888888]">Status</th>
                <th className="px-5 py-3 font-medium text-[#888888]">Price</th>
                <th className="px-5 py-3 font-medium text-[#888888]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentTemplates.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-10 text-center text-[#888888]">
                    No templates yet.{" "}
                    <Link href="/dashboard/templates/new" className="font-medium text-[#1A1A1A] underline">
                      Create your first template
                    </Link>
                  </td>
                </tr>
              ) : (
                stats.recentTemplates.map((t) => {
                  const status = t.status as keyof typeof statusConfig;
                  const cat = t.categories;
                  return (
                    <tr
                      key={t.id}
                      className="border-b border-[#EBEBEB] last:border-0 hover:bg-[#FAFAFA] transition-colors"
                    >
                      <td className="px-5 py-3 font-medium text-[#1A1A1A] max-w-xs truncate">
                        {t.title}
                        {t.is_featured && (
                          <span className="ml-2 text-[10px] bg-[#C42026]/10 text-[#C42026] rounded-full px-2 py-0.5 font-medium">
                            Featured
                          </span>
                        )}
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
                      <td className="px-5 py-3">
                        <Link
                          href={`/dashboard/templates/${t.id}/edit`}
                          className="text-xs font-medium text-[#1A1A1A] hover:underline"
                        >
                          Edit
                        </Link>
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
