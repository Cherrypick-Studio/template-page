"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Loader2 } from "lucide-react";
import { FaRegFileArchive } from "react-icons/fa";
import { FaStar } from "react-icons/fa6";
import { ImAttachment } from "react-icons/im";
import { IoBagCheckOutline, IoCalendarOutline } from "react-icons/io5";
import { TbDeviceMobileMessage } from "react-icons/tb";

interface IPropsDetailStickyCard {
    title: string;
    price: number;
    category?: string;
    categoryIcon?: string;
    rating?: number;
    salesCount?: number;
    fileType?: string;
    fileSize?: string;
    productType?: string;
    createdAt?: string;
    variantId?: string | null;
    onAddToCart?: () => void;
    isAddedToCart?: boolean;
    templateId?: string;
}

export default function DetailStickyCard({
    title,
    price,
    category,
    categoryIcon,
    rating = 0,
    salesCount = 0,
    fileType,
    fileSize,
    productType,
    createdAt,
    variantId,
    onAddToCart,
    isAddedToCart = false,
    templateId,
}: IPropsDetailStickyCard) {
    const [checkoutLoading, setCheckoutLoading] = useState(false);

    const formattedDate = createdAt
        ? new Date(createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
        : null;

    async function handleBuyNow() {
        if (!variantId || !templateId) return;
        setCheckoutLoading(true);
        try {
            const res = await fetch("/api/checkout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ variantId, templateId }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error ?? "Checkout failed");
            window.location.href = data.url;
        } catch (err) {
            alert(err instanceof Error ? err.message : "Checkout failed. Please try again.");
            setCheckoutLoading(false);
        }
    }

    const isFree = price === 0;
    const canCheckout = Boolean(variantId) && !isFree;

    return (
        <div className="sticky top-20 flex flex-col gap-6 p-6 bg-white border border-[#DDDDDD] rounded-2xl">
            <h2 className="text-lg font-semibold text-[#1A1A1A]">{title}</h2>
            {category && (
                <div className="flex items-center gap-5 w-full justify-between">
                    <span className="text-[#888888]">Category</span>
                    <div className="flex gap-2 items-center py-0 px-4 bg-[#FEFEFE] border border-[#DDDDDD] rounded-full text-base text-[#1A1A1A]">
                        {categoryIcon && (
                            <Image src={categoryIcon} width={14} height={14} alt={`${category} icon`} className="w-3.5 aspect-square object-contain" />
                        )}
                        <span>{category}</span>
                    </div>
                </div>
            )}
            {rating > 0 && (
                <div className="flex w-full justify-between items-center">
                    <div className="flex gap-2 items-center">
                        <FaStar color="#FFCA00" size={23} />
                        <span className="text-[32px] text-[#1A1A1A] font-medium">
                            {rating.toFixed(1)} <span className="text-base text-[#888888]"> / 5.0</span>
                        </span>
                    </div>
                    {salesCount > 0 && (
                        <div className="flex gap-2 bg-[#EFF7FF] rounded-2xl p-4 items-center">
                            <IoBagCheckOutline />
                            <span className="text-[#0466C9] font-semibold text-base">{salesCount} sales</span>
                        </div>
                    )}
                </div>
            )}
            {(formattedDate || fileType || fileSize || productType) && (
                <div className="flex flex-col p-6 bg-[#F5F5F5] rounded-2xl gap-6">
                    <span className="text-[#1A1A1A] font-semibold text-2xl">Highlight</span>
                    {formattedDate && (
                        <div className="flex gap-3 items-center">
                            <IoCalendarOutline />
                            <span className="text-[#666666] text-base">
                                Created at: <span className="text-[#1A1A1A] font-medium">{formattedDate}</span>
                            </span>
                        </div>
                    )}
                    {fileType && (
                        <div className="flex gap-3 items-center">
                            <FaRegFileArchive />
                            <span className="text-[#666666] text-base">
                                File type: <span className="text-[#1A1A1A] font-medium">{fileType}</span>
                            </span>
                        </div>
                    )}
                    {fileSize && (
                        <div className="flex gap-3 items-center">
                            <ImAttachment />
                            <span className="text-[#666666] text-base">
                                File Size: <span className="text-[#1A1A1A] font-medium">{fileSize}</span>
                            </span>
                        </div>
                    )}
                    {productType && (
                        <div className="flex gap-3 items-center">
                            <TbDeviceMobileMessage />
                            <span className="text-[#666666] text-base">
                                Product Type: <span className="text-[#1A1A1A] font-medium">{productType}</span>
                            </span>
                        </div>
                    )}
                </div>
            )}
            <hr className="border-[#EEEEEE]" />
            <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                    <span className="text-sm text-[#6B6B6B]">Subtotal</span>
                    <span className="text-xl font-semibold text-[#1A1A1A]">
                        {isFree ? "Free" : `$${price}`}
                    </span>
                </div>
            </div>

            {/* Add to Cart */}
            {onAddToCart && (
                <Button
                    variant="outline"
                    onClick={onAddToCart}
                    disabled={isAddedToCart}
                >
                    {isAddedToCart ? "Added to Cart" : "Add to Cart"}
                </Button>
            )}

            {/* Buy Now */}
            {canCheckout ? (
                <Button onClick={handleBuyNow} disabled={checkoutLoading}>
                    {checkoutLoading ? (
                        <>
                            <Loader2 className="size-4 animate-spin" />
                            Redirecting...
                        </>
                    ) : (
                        "Buy Now"
                    )}
                </Button>
            ) : isFree ? (
                <Button disabled>Free — No checkout needed</Button>
            ) : (
                <Button disabled>Checkout Unavailable</Button>
            )}
        </div>
    );
}
