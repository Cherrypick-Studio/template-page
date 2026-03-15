"use client"

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer";
import { FaStar } from "react-icons/fa6";
import { FaRegFileArchive } from "react-icons/fa";
import { IoBagCheckOutline, IoCalendarOutline } from "react-icons/io5";
import { ImAttachment } from "react-icons/im";
import { TbDeviceMobileMessage } from "react-icons/tb";

interface IPropsDetailMobileBottomBar {
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

export default function DetailMobileBottomBar({
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
}: IPropsDetailMobileBottomBar) {
    const [open, setOpen] = useState(false);
    const [checkoutLoading, setCheckoutLoading] = useState(false);

    const formattedDate = createdAt
        ? new Date(createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
        : null;

    const isFree = price === 0;
    const canCheckout = Boolean(variantId) && !isFree;

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

    return (
        <div className="fixed bottom-0 left-0 right-0 z-40 lg:hidden">
            <Drawer open={open} onOpenChange={setOpen}>
                <DrawerTrigger asChild>
                    <div className="flex flex-col items-center justify-between bg-white border-t border-[#DDDDDD] px-6 py-4 shadow-[0_-4px_12px_rgba(0,0,0,0.08)]">
                        <div className="flex w-full justify-between gap-1 mb-3">
                            <span className="text-xl text-[#1A1A1A]">Subtotal</span>
                            <span className="text-xl font-semibold text-[#1A1A1A]">
                                {isFree ? "Free" : `$${price}`}
                            </span>
                        </div>
                        <div className="flex w-full gap-2">
                            {onAddToCart && (
                                <Button
                                    variant="outline"
                                    className="flex-1"
                                    onClick={(e) => { e.stopPropagation(); onAddToCart(); }}
                                    disabled={isAddedToCart}
                                >
                                    {isAddedToCart ? "Added" : "Add to Cart"}
                                </Button>
                            )}
                            {canCheckout ? (
                                <Button
                                    className="flex-1"
                                    onClick={(e) => { e.stopPropagation(); handleBuyNow(); }}
                                    disabled={checkoutLoading}
                                >
                                    {checkoutLoading ? (
                                        <Loader2 className="size-4 animate-spin" />
                                    ) : (
                                        "Buy Now"
                                    )}
                                </Button>
                            ) : (
                                <Button className="flex-1" disabled>
                                    {isFree ? "Free" : "Unavailable"}
                                </Button>
                            )}
                        </div>
                    </div>
                </DrawerTrigger>
                <DrawerContent>
                    <DrawerHeader>
                        <DrawerTitle className="text-lg font-semibold text-[#1A1A1A]">{title}</DrawerTitle>
                    </DrawerHeader>
                    <div className="flex flex-col gap-6 px-6 pb-8">
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
                                    <span className="text-[28px] text-[#1A1A1A] font-medium">
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
                            <div className="flex flex-col p-6 bg-[#F5F5F5] rounded-2xl gap-4">
                                <span className="text-[#1A1A1A] font-semibold text-xl">Highlight</span>
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
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-[#6B6B6B]">Subtotal</span>
                            <span className="text-xl font-semibold text-[#1A1A1A]">
                                {isFree ? "Free" : `$${price}`}
                            </span>
                        </div>
                        <div className="flex flex-col gap-2">
                            {onAddToCart && (
                                <Button
                                    variant="outline"
                                    className="w-full"
                                    onClick={onAddToCart}
                                    disabled={isAddedToCart}
                                >
                                    {isAddedToCart ? "Added to Cart" : "Add to Cart"}
                                </Button>
                            )}
                            {canCheckout ? (
                                <Button className="w-full" onClick={handleBuyNow} disabled={checkoutLoading}>
                                    {checkoutLoading ? (
                                        <>
                                            <Loader2 className="size-4 animate-spin" />
                                            Redirecting...
                                        </>
                                    ) : (
                                        "Buy Now"
                                    )}
                                </Button>
                            ) : (
                                <Button className="w-full" disabled>
                                    {isFree ? "Free — No checkout needed" : "Checkout Unavailable"}
                                </Button>
                            )}
                        </div>
                    </div>
                </DrawerContent>
            </Drawer>
        </div>
    );
}
