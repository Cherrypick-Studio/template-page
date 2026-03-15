"use client";

import { useState, useRef } from "react";
import { ShoppingCart, ChevronDown, Menu, X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import HelpDeskCard from "./Card/HelpDeskCard";
import { useCart } from "@/contexts/CartContext";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "./ui/popover";

const templateItems = [
  {
    title: "Figma UI Kit",
    desc: "Sleek designs and easy customization. Perfect for your next project!",
    href: "/template?category=ui-kit",
    icon: "/assets/ic-figma.svg"
  },
  {
    title: "Bundling Templates",
    desc: "Save more with our curated template bundles!",
    href: "/template?category=bundling",
    icon: "/assets/ic-library.svg"
  },
  {
    title: "Framer Templates",
    desc: "Awesome no-code Framer templates for your next project!",
    href: "/template?category=framer",
    icon: "/assets/ic-framer.svg"
  },
  {
    title: "E-book",
    desc: "In-depth design and development guides to level up your skills.",
    href: "/template?category=ebook",
    icon: "/assets/ic-ebook.svg"
  },
  {
    title: "Code Templates",
    desc: "Production-ready components in HTML, React, and Tailwind CSS.",
    href: "/template?category=code",
    icon: "/assets/ic-code.svg"
  },
  {
    title: "Webflow Templates",
    desc: "Stunning Webflow templates to boost your website.",
    href: "/coming-soon",
    icon: "/assets/ic-webflow-color.svg",
    coming_soon: true
  },
];

const navLinks = [
  { title: "Feature Kits", href: "/feature" },
  { title: "Work in Progress", href: "/work-in-progress" },
  { title: "Blog & Article", href: "/blog" },
];

const TemplateWrapper = ({ icon, title, desc, coming_soon }: { icon: string, title: string, desc: string, coming_soon?: boolean }) => (
  <div className="flex gap-2 p-4 rounded-xl hover:bg-[#F5F5F5] items-start">
    <Image alt={`${title} icon`} width={40} height={40} src={icon} />
    <div className="flex flex-col gap-2 items-start">
      <span className="text-[#1A1A1A] text-base">{title}</span>
      <p className="text-xs text-[#999999]">{desc}</p>
      {coming_soon && <span className="bg-[#E4EFFF] py-1.5 px-3 w-fit rounded-full text-[10px] text-[#146EF5]">
        Coming soon
      </span>}
    </div>
  </div >
)

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { items, openCart } = useCart();

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200 bg-white">
      <div className="mx-auto flex h-16 max-w-360 items-center justify-between px-2">
        <Link href="/" className="text-xl font-bold tracking-tight">
          <Image alt="CherryPick logo" width={100} height={100} src={'/assets/ic-logo-cherrypick.svg'} className="w-full" />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex">
          <TemplatePopover />

          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-md px-3 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100 hover:text-zinc-900"
            >
              {link.title}
            </Link>
          ))}

          <button
            onClick={openCart}
            aria-label={`Cart (${items.length} items)`}
            className="relative ml-2 rounded-md p-2 text-zinc-700 transition-colors hover:bg-zinc-100 hover:text-zinc-900"
          >
            <ShoppingCart className="size-5" />
            {items.length > 0 && (
              <span className="absolute -top-0.5 -right-0.5 flex size-4 items-center justify-center rounded-full bg-[#C42026] text-[10px] font-bold text-white">
                {items.length > 9 ? "9+" : items.length}
              </span>
            )}
          </button>
        </nav>

        {/* Mobile icons */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            onClick={openCart}
            aria-label={`Cart (${items.length} items)`}
            className="relative rounded-md p-2 text-zinc-700 transition-colors hover:bg-zinc-100 hover:text-zinc-900"
          >
            <ShoppingCart className="size-5" />
            {items.length > 0 && (
              <span className="absolute -top-0.5 -right-0.5 flex size-4 items-center justify-center rounded-full bg-[#C42026] text-[10px] font-bold text-white">
                {items.length > 9 ? "9+" : items.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setMobileOpen(true)}
            className="rounded-md p-2 text-zinc-700 transition-colors hover:bg-zinc-100 hover:text-zinc-900"
            aria-label="Open menu"
          >
            <Menu className="size-5" />
          </button>
        </div>
      </div>

      {/* Mobile drawer – full height */}
      <div
        className={`fixed inset-0 z-40 bg-black/50 transition-opacity duration-300 md:hidden ${mobileOpen ? "opacity-100" : "pointer-events-none opacity-0"}`}
        onClick={() => setMobileOpen(false)}
      />
      <div
        className={`fixed inset-y-0 right-0 z-50 flex w-full flex-col bg-white transition-transform duration-300 md:hidden ${mobileOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex h-16 items-center justify-between border-b border-zinc-200 px-4">
          <Link href="/" onClick={() => setMobileOpen(false)} className="text-xl font-bold tracking-tight">
            <Image alt="CherryPick logo" width={100} height={100} src={'/assets/ic-logo-cherrypick.svg'} className="w-full" />
          </Link>
          <button
            onClick={() => setMobileOpen(false)}
            className="rounded-md p-2 text-zinc-700 transition-colors hover:bg-zinc-100 hover:text-zinc-900"
            aria-label="Close menu"
          >
            <X className="size-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-4 py-4 flex flex-col justify-between">
          <div className="flex flex-col">
            <MobileTemplateAccordion onClose={() => setMobileOpen(false)} />

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
          </div>

          <HelpDeskCard />
        </nav>
      </div>
    </header>
  );
}

/* ── Desktop: hover popover, click navigates to /template ── */
function TemplatePopover() {
  const [open, setOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const show = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setOpen(true);
  };

  const hide = () => {
    timeoutRef.current = setTimeout(() => setOpen(false), 150);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <div onMouseEnter={show} onMouseLeave={hide}>
        <PopoverTrigger asChild>
          <Link
            href="/template"
            onClick={(e) => {
              e.stopPropagation();
            }}
            className="flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100 hover:text-zinc-900"
          >
            Template
            <ChevronDown
              className={`relative top-px size-3 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
              aria-hidden
            />
          </Link>
        </PopoverTrigger>

        <PopoverContent
          sideOffset={20}
          align="start"
          onMouseEnter={show}
          onMouseLeave={hide}
          onOpenAutoFocus={(e) => e.preventDefault()}
          className="flex w-fit max-w-294 items-start gap-2 rounded-md border border-zinc-200 bg-white p-6 shadow-lg"
        >
          <div className="grid grid-cols-2 gap-x-10 gap-y-2">
            {templateItems.map((item) => (
              <Link key={item.title} href={item.href} className="outline-none">
                <TemplateWrapper
                  icon={item.icon}
                  desc={item.desc}
                  title={item.title}
                  coming_soon={item.coming_soon}
                />
              </Link>
            ))}
          </div>
          <HelpDeskCard />
        </PopoverContent>
      </div>
    </Popover>
  );
}

/* ── Mobile: accordion showing all template items ── */
function MobileTemplateAccordion({ onClose }: { onClose: () => void }) {
  return (
    <Accordion type="single" collapsible className="border-b-0">
      <AccordionItem value="template" className="border-b-0">
        <AccordionTrigger className="px-3 py-2 text-sm font-medium text-zinc-700 hover:no-underline">
          Template
        </AccordionTrigger>
        <AccordionContent className="pb-0">
          <div className="flex flex-col gap-1">
            {templateItems.map((item) => (
              <Link key={item.title} href={item.href} onClick={onClose} className="outline-none">
                <TemplateWrapper
                  icon={item.icon}
                  desc={item.desc}
                  title={item.title}
                  coming_soon={item.coming_soon}
                />
              </Link>
            ))}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
