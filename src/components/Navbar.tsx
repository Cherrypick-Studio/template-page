"use client";

import { useState } from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { ShoppingCart, ChevronDown, Menu, X } from "lucide-react";
import Link from "next/link";

const templateItems = [
  { title: "Landing Page", href: "/templates/landing-page" },
  { title: "Portfolio", href: "/templates/portfolio" },
  { title: "E-Commerce", href: "/templates/e-commerce" },
  { title: "Dashboard", href: "/templates/dashboard" },
];

const navLinks = [
  { title: "Feature Kits", href: "/feature-kits" },
  { title: "Work in Progress", href: "/work-in-progress" },
  { title: "Blog & Article", href: "/blog" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200 bg-white">
      <div className="mx-auto flex h-16 max-w-360 items-center justify-between px-2">
        <Link href="/" className="text-xl font-bold tracking-tight">
          CherryPick
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex">
          <TemplateDropdown />

          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-md px-3 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100 hover:text-zinc-900"
            >
              {link.title}
            </Link>
          ))}

          <Link
            href="/cart"
            className="relative ml-2 rounded-md p-2 text-zinc-700 transition-colors hover:bg-zinc-100 hover:text-zinc-900"
          >
            <ShoppingCart className="size-5" />
          </Link>
        </nav>

        {/* Mobile icons */}
        <div className="flex items-center gap-2 md:hidden">
          <Link
            href="/cart"
            className="rounded-md p-2 text-zinc-700 transition-colors hover:bg-zinc-100 hover:text-zinc-900"
          >
            <ShoppingCart className="size-5" />
          </Link>
          <button
            onClick={() => setMobileOpen((prev) => !prev)}
            className="rounded-md p-2 text-zinc-700 transition-colors hover:bg-zinc-100 hover:text-zinc-900"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <nav className="border-t border-zinc-200 bg-white px-6 pb-4 md:hidden">
          <MobileTemplateDropdown />

          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="block rounded-md px-3 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100 hover:text-zinc-900"
            >
              {link.title}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}

function TemplateDropdown() {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button className="flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100 hover:text-zinc-900 data-[state=open]:bg-zinc-100">
          Template
          <ChevronDown
            className="relative top-px size-3 transition-transform duration-200 [[data-state=open]>&]:rotate-180"
            aria-hidden
          />
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          sideOffset={8}
          className="z-50 w-48 rounded-md border border-zinc-200 bg-white p-1 shadow-lg"
        >
          {templateItems.map((item) => (
            <DropdownMenu.Item key={item.href} asChild>
              <Link
                href={item.href}
                className="block rounded-sm px-3 py-2 text-sm text-zinc-700 outline-none transition-colors hover:bg-zinc-100 data-highlighted:bg-zinc-100"
              >
                {item.title}
              </Link>
            </DropdownMenu.Item>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}

function MobileTemplateDropdown() {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button className="flex w-full items-center gap-1 rounded-md px-3 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100 hover:text-zinc-900 data-[state=open]:bg-zinc-100">
          Template
          <ChevronDown
            className="relative top-px size-3 transition-transform duration-200 [[data-state=open]>&]:rotate-180"
            aria-hidden
          />
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          sideOffset={4}
          align="start"
          className="z-50 w-48 rounded-md border border-zinc-200 bg-white p-1 shadow-lg"
        >
          {templateItems.map((item) => (
            <DropdownMenu.Item key={item.href} asChild>
              <Link
                href={item.href}
                className="block rounded-sm px-3 py-2 text-sm text-zinc-700 outline-none transition-colors hover:bg-zinc-100 data-highlighted:bg-zinc-100"
              >
                {item.title}
              </Link>
            </DropdownMenu.Item>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
