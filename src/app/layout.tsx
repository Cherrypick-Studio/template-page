import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import { Theme } from "@radix-ui/themes";
import "@radix-ui/themes/styles.css";
import "./globals.css";
import { CartProvider } from "@/contexts/CartContext";
import CartSheet from "@/components/Cart/CartSheet";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://cherrypick.design";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "CherryPick — Premium UI Templates for Figma & Webflow",
    template: "%s | CherryPick",
  },
  description:
    "A curated marketplace of premium UI templates and Figma kits crafted with precision, consistency, and scalability in mind. Launch faster with CherryPick.",
  keywords: [
    "UI kit",
    "Figma templates",
    "Webflow templates",
    "premium templates",
    "design system",
    "React components",
    "Framer templates",
    "website templates",
    "UI design",
    "frontend templates",
  ],
  authors: [{ name: "CherryPick" }],
  creator: "CherryPick",
  publisher: "CherryPick",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "CherryPick",
    title: "CherryPick — Premium UI Templates for Figma & Webflow",
    description:
      "A curated marketplace of premium UI templates and Figma kits crafted with precision, consistency, and scalability in mind.",
    images: [
      {
        url: "/og-default.png",
        width: 1200,
        height: 630,
        alt: "CherryPick — Premium UI Templates",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "CherryPick — Premium UI Templates for Figma & Webflow",
    description:
      "A curated marketplace of premium UI templates and Figma kits crafted with precision, consistency, and scalability in mind.",
    images: ["/og-default.png"],
  },
  alternates: {
    canonical: siteUrl,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${manrope.variable} antialiased`}>
        <CartProvider>
          <Theme>{children}</Theme>
          <CartSheet />
        </CartProvider>
      </body>
    </html>
  );
}
