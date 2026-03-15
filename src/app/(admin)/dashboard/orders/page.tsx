import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import type { Order } from "@/lib/supabase/types";

type OrderWithRelations = Order & {
  templates: { title: string; slug: string } | null;
  profiles: { full_name: string | null } | null;
};

export const metadata: Metadata = { title: "Orders" };

const statusConfig = {
  pending: { label: "Pending", className: "bg-yellow-100 text-yellow-700" },
  completed: { label: "Completed", className: "bg-green-100 text-green-700" },
  refunded: { label: "Refunded", className: "bg-gray-100 text-gray-600" },
  cancelled: { label: "Cancelled", className: "bg-red-100 text-red-700" },
} as const;

export default async function OrdersPage() {
  const supabase = await createClient();

  const { data: ordersRaw } = await supabase
    .from("orders")
    .select("*, templates(title, slug), profiles(full_name)")
    .order("created_at", { ascending: false });

  const orders = ordersRaw as OrderWithRelations[] | null;
  const total = orders?.length ?? 0;
  const completed = orders?.filter((o) => o.status === "completed").length ?? 0;
  const revenue = orders
    ?.filter((o) => o.status === "completed")
    .reduce((sum, o) => sum + Number(o.total_amount), 0) ?? 0;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-[#1A1A1A]">Orders</h1>
        <p className="text-sm text-[#888888] mt-1">{total} orders total</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-2xl border border-[#EBEBEB] bg-white p-5">
          <p className="text-sm text-[#888888]">Total Orders</p>
          <p className="text-2xl font-semibold text-[#1A1A1A] mt-1">{total}</p>
        </div>
        <div className="rounded-2xl border border-[#EBEBEB] bg-white p-5">
          <p className="text-sm text-[#888888]">Completed</p>
          <p className="text-2xl font-semibold text-[#1A1A1A] mt-1">{completed}</p>
        </div>
        <div className="rounded-2xl border border-[#EBEBEB] bg-white p-5">
          <p className="text-sm text-[#888888]">Revenue</p>
          <p className="text-2xl font-semibold text-[#1A1A1A] mt-1">${revenue.toFixed(2)}</p>
        </div>
      </div>

      <div className="rounded-2xl border border-[#EBEBEB] bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#EBEBEB] bg-[#FAFAFA] text-left">
                <th className="px-5 py-3 font-medium text-[#888888]">LS Order ID</th>
                <th className="px-5 py-3 font-medium text-[#888888]">Template</th>
                <th className="px-5 py-3 font-medium text-[#888888]">Customer</th>
                <th className="px-5 py-3 font-medium text-[#888888]">Status</th>
                <th className="px-5 py-3 font-medium text-[#888888]">Amount</th>
                <th className="px-5 py-3 font-medium text-[#888888]">Date</th>
              </tr>
            </thead>
            <tbody>
              {!orders || orders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-16 text-center text-[#888888]">
                    No orders yet. They will appear here once customers complete checkout via Lemon Squeezy.
                  </td>
                </tr>
              ) : (
                orders.map((order) => {
                  const status = order.status as keyof typeof statusConfig;
                  const template = order.templates;
                  const profile = order.profiles;
                  return (
                    <tr
                      key={order.id}
                      className="border-b border-[#EBEBEB] last:border-0 hover:bg-[#FAFAFA] transition-colors"
                    >
                      <td className="px-5 py-3 font-mono text-xs text-[#888888]">
                        {order.lemon_squeezy_order_id
                          ? `#${order.lemon_squeezy_order_id}`
                          : "—"}
                      </td>
                      <td className="px-5 py-3 font-medium text-[#1A1A1A] max-w-xs truncate">
                        {template?.title ?? "—"}
                      </td>
                      <td className="px-5 py-3 text-[#666666]">
                        {order.customer_email ?? profile?.full_name ?? "Guest"}
                      </td>
                      <td className="px-5 py-3">
                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusConfig[status]?.className ?? "bg-gray-100 text-gray-600"}`}
                        >
                          {statusConfig[status]?.label ?? status}
                        </span>
                      </td>
                      <td className="px-5 py-3 font-medium text-[#1A1A1A]">
                        ${Number(order.total_amount).toFixed(2)}
                      </td>
                      <td className="px-5 py-3 text-[#888888]">
                        {new Date(order.created_at).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
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
