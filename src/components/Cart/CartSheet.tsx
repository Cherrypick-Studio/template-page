"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { X, ShoppingCart, Trash2, Loader2 } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";

export default function CartSheet() {
  const { items, removeItem, isOpen, closeCart } = useCart();
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const total = items.reduce((sum, item) => sum + item.price, 0);

  async function handleCheckout(item: typeof items[0]) {
    if (!item.variantId) return;
    setLoadingId(item.id);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ variantId: item.variantId, templateId: item.id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Checkout failed");
      window.location.href = data.url;
    } catch (err) {
      alert(err instanceof Error ? err.message : "Checkout failed. Please try again.");
      setLoadingId(null);
    }
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-black/50 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={closeCart}
      />

      {/* Cart panel */}
      <div
        className={`fixed inset-y-0 right-0 z-50 flex w-full max-w-sm flex-col bg-white shadow-xl transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#EBEBEB] px-5 py-4">
          <div className="flex items-center gap-2">
            <ShoppingCart className="size-5 text-[#1A1A1A]" />
            <h2 className="text-base font-semibold text-[#1A1A1A]">
              Cart{items.length > 0 && ` (${items.length})`}
            </h2>
          </div>
          <button
            onClick={closeCart}
            className="rounded-md p-1.5 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 transition-colors"
            aria-label="Close cart"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
              <ShoppingCart className="size-12 text-[#DDDDDD]" />
              <p className="text-sm text-[#888888]">Your cart is empty.</p>
              <Link href="/template" onClick={closeCart}>
                <Button variant="outline" size="sm">
                  Browse Templates
                </Button>
              </Link>
            </div>
          ) : (
            <ul className="flex flex-col gap-4">
              {items.map((item) => (
                <li
                  key={item.id}
                  className="flex gap-3 rounded-xl border border-[#EBEBEB] p-3"
                >
                  {/* Image */}
                  <Link href={`/template/${item.slug}`} onClick={closeCart} className="shrink-0">
                    <Image
                      src={item.imageUrl}
                      alt={item.title}
                      width={80}
                      height={60}
                      className="w-20 h-14 rounded-lg object-cover"
                    />
                  </Link>

                  {/* Info */}
                  <div className="flex flex-1 min-w-0 flex-col gap-1">
                    <Link
                      href={`/template/${item.slug}`}
                      onClick={closeCart}
                      className="text-sm font-medium text-[#1A1A1A] truncate hover:underline"
                    >
                      {item.title}
                    </Link>
                    <span className="text-sm font-semibold text-[#1A1A1A]">
                      {item.price === 0 ? "Free" : `$${item.price}`}
                    </span>

                    {/* Actions */}
                    <div className="flex items-center gap-2 mt-1">
                      {item.variantId ? (
                        <Button
                          size="sm"
                          className="h-7 text-xs px-3"
                          disabled={loadingId === item.id}
                          onClick={() => handleCheckout(item)}
                        >
                          {loadingId === item.id ? (
                            <Loader2 className="size-3 animate-spin" />
                          ) : (
                            "Buy Now"
                          )}
                        </Button>
                      ) : (
                        <span className="text-xs text-[#888888] bg-[#F5F5F5] rounded-full px-2 py-1">
                          Checkout unavailable
                        </span>
                      )}
                      <button
                        onClick={() => removeItem(item.id)}
                        className="rounded-md p-1 text-[#888888] hover:text-red-500 hover:bg-red-50 transition-colors"
                        aria-label={`Remove ${item.title}`}
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-[#EBEBEB] px-5 py-4 flex flex-col gap-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-[#666666]">Total</span>
              <span className="text-base font-semibold text-[#1A1A1A]">
                ${total.toFixed(2)}
              </span>
            </div>
            <p className="text-xs text-[#888888]">
              Each item is purchased separately via Lemon Squeezy secure checkout.
            </p>
          </div>
        )}
      </div>
    </>
  );
}
