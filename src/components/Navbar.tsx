"use client";

import * as NavigationMenu from "@radix-ui/react-navigation-menu";
import { ShoppingCart, ChevronDown } from "lucide-react";
import Link from "next/link";

const templateItems = [
  { title: "Landing Page", href: "/templates/landing-page" },
  { title: "Portfolio", href: "/templates/portfolio" },
  { title: "E-Commerce", href: "/templates/e-commerce" },
  { title: "Dashboard", href: "/templates/dashboard" },
];

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200 bg-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link href="/" className="text-xl font-bold tracking-tight">
          CherryPick
        </Link>

        <NavigationMenu.Root className="relative">
          <NavigationMenu.List className="flex items-center gap-1">
            {/* Template Dropdown */}
            <NavigationMenu.Item>
              <NavigationMenu.Trigger className="flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100 hover:text-zinc-900">
                Template
                <ChevronDown
                  className="relative top-px size-3 transition-transform duration-200 [[data-state=open]>&]:rotate-180"
                  aria-hidden
                />
              </NavigationMenu.Trigger>
              <NavigationMenu.Content className="absolute left-0 top-full w-48 rounded-md border border-zinc-200 bg-white p-1 shadow-lg">
                <ul className="flex flex-col">
                  {templateItems.map((item) => (
                    <li key={item.href}>
                      <NavigationMenu.Link asChild>
                        <Link
                          href={item.href}
                          className="block rounded-sm px-3 py-2 text-sm text-zinc-700 transition-colors hover:bg-zinc-100"
                        >
                          {item.title}
                        </Link>
                      </NavigationMenu.Link>
                    </li>
                  ))}
                </ul>
              </NavigationMenu.Content>
            </NavigationMenu.Item>

            {/* Feature Kits */}
            <NavigationMenu.Item>
              <NavigationMenu.Link asChild>
                <Link
                  href="/feature-kits"
                  className="rounded-md px-3 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100 hover:text-zinc-900"
                >
                  Feature Kits
                </Link>
              </NavigationMenu.Link>
            </NavigationMenu.Item>

            {/* Work in Progress */}
            <NavigationMenu.Item>
              <NavigationMenu.Link asChild>
                <Link
                  href="/work-in-progress"
                  className="rounded-md px-3 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100 hover:text-zinc-900"
                >
                  Work in Progress
                </Link>
              </NavigationMenu.Link>
            </NavigationMenu.Item>

            {/* Blog & Article */}
            <NavigationMenu.Item>
              <NavigationMenu.Link asChild>
                <Link
                  href="/blog"
                  className="rounded-md px-3 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100 hover:text-zinc-900"
                >
                  Blog & Article
                </Link>
              </NavigationMenu.Link>
            </NavigationMenu.Item>

            {/* Cart */}
            <NavigationMenu.Item>
              <NavigationMenu.Link asChild>
                <Link
                  href="/cart"
                  className="relative ml-2 rounded-md p-2 text-zinc-700 transition-colors hover:bg-zinc-100 hover:text-zinc-900"
                >
                  <ShoppingCart className="size-5" />
                </Link>
              </NavigationMenu.Link>
            </NavigationMenu.Item>
          </NavigationMenu.List>

          <NavigationMenu.Viewport />
        </NavigationMenu.Root>
      </div>
    </header>
  );
}
