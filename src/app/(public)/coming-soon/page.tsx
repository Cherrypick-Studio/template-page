import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Coming Soon",
  alternates: { canonical: "/coming-soon" },
  robots: { index: false, follow: false },
};

export default function ComingSoonPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 px-4">
      <div className="text-6xl">🔧</div>
      <h1 className="text-3xl font-semibold text-[#1A1A1A] text-center">
        Coming Soon
      </h1>
      <p className="text-[#666666] text-center max-w-md">
        We&apos;re working hard to bring this feature to you. Check back soon!
      </p>
      <Link href="/">
        <Button variant="outline">Back to Home</Button>
      </Link>
    </div>
  );
}
