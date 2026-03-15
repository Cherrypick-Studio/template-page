import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = { title: "Order Successful" };

export default function OrderSuccessPage() {
  return (
    <main className="flex min-h-[70vh] flex-col items-center justify-center px-4 py-20">
      <div className="flex flex-col items-center gap-6 text-center max-w-md">
        <CheckCircle className="size-16 text-green-500" />
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-semibold text-[#1A1A1A]">Payment Successful!</h1>
          <p className="text-[#666666]">
            Thank you for your purchase. You should receive a download link and receipt
            at your email shortly from Lemon Squeezy.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 mt-2">
          <Link href="/template">
            <Button variant="outline">Browse More Templates</Button>
          </Link>
          <Link href="/">
            <Button>Back to Home</Button>
          </Link>
        </div>
        <p className="text-xs text-[#888888] mt-2">
          If you have questions about your order, contact us or check your Lemon Squeezy
          order confirmation email.
        </p>
      </div>
    </main>
  );
}
