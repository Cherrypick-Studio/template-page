"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  LayoutTemplate,
  Tag,
  ShoppingBag,
  LogOut,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Overview", href: "/dashboard", icon: LayoutDashboard, exact: true },
  { label: "Templates", href: "/dashboard/templates", icon: LayoutTemplate },
  { label: "Categories", href: "/dashboard/categories", icon: Tag },
  { label: "Orders", href: "/dashboard/orders", icon: ShoppingBag },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <aside className="flex h-screen w-60 flex-col border-r border-[#EBEBEB] bg-white fixed left-0 top-0">
      <div className="flex h-16 items-center border-b border-[#EBEBEB] px-5">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/assets/ic-logo-cherrypick.svg"
            alt="CherryPick logo"
            width={120}
            height={30}
            className="h-7 w-auto"
          />
        </Link>
      </div>

      <nav className="flex flex-1 flex-col gap-1 p-3">
        {navItems.map((item) => {
          const isActive = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-[#1A1A1A] text-white"
                  : "text-[#666666] hover:bg-[#F5F5F5] hover:text-[#1A1A1A]"
              )}
            >
              <item.icon className="size-4 shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-[#EBEBEB] p-3">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-[#666666] transition-colors hover:bg-red-50 hover:text-red-600"
        >
          <LogOut className="size-4 shrink-0" />
          Sign out
        </button>
      </div>
    </aside>
  );
}
