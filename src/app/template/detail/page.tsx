"use client"

import { useState } from "react";
import Image from "next/image";
import DetailStickyCard from "@/components/Card/DetailStickyCard";
import DetailMobileBottomBar from "@/components/Card/DetailMobileBottomBar";
import ImagePreview from "@/components/ImagePreview";
import { Button } from "@/components/ui/button";
import { IoArrowForward } from "react-icons/io5";
import TemplateCard from "@/components/Card/TemplateCard";

const TEMPLATE_IMAGES = [
    { src: "/assets/ic-zenith.svg", alt: "Zenith - Main Preview" },
    { src: "/assets/ic-blockwave.svg", alt: "Zenith - Blockwave Section" },
    { src: "/assets/ic-paynexa.svg", alt: "Zenith - Paynexa Section" },
    { src: "/assets/ic-timber.svg", alt: "Zenith - Timber Section" },
    { src: "/assets/ic-spoty.svg", alt: "Zenith - Spoty Section" },
];

export default function TemplateDetailPage() {
    const [previewOpen, setPreviewOpen] = useState(false);
    const [activeImageIndex, setActiveImageIndex] = useState(0);

    return (
        <div className="w-full">
            <div className="w-full mx-auto max-w-360 p-10 flex flex-col lg:flex-row gap-10">
                {/* Left Column - Image & Description */}
                <div className="flex flex-col gap-6 flex-1 min-w-0">
                    {/* Title */}
                    <h1 className="text-[28px] lg:text-[36px] font-semibold text-[#1A1A1A]">
                        Zenith - Web3 Wallet Website
                    </h1>
                    <div className="flex items-center gap-5">
                        <span>Templates category</span>
                        <div className="flex gap-2 items-center py-0 px-4 bg-[#FEFEFE] border border-[#DDDDDD] rounded-full text-base text-[#1A1A1A]">
                            <Image src={'/assets/ic-figma.svg'} width={100} height={100} alt="img-icon" className="w-3.5 aspect-square object-contain" />
                            <span>UI Kit</span>
                        </div>
                    </div>

                    {/* Image Gallery */}
                    <div className="flex flex-col gap-3">
                        <div
                            className="relative w-full cursor-pointer overflow-hidden rounded-2xl"
                            onClick={() => setPreviewOpen(true)}
                        >
                            <Image
                                src={TEMPLATE_IMAGES[activeImageIndex].src}
                                alt={TEMPLATE_IMAGES[activeImageIndex].alt}
                                width={800}
                                height={500}
                                className="w-full rounded-2xl hover:scale-105 transition-transform duration-300"
                            />
                        </div>
                        {/* Thumbnail footnotes */}
                        <div className="overflow-x-auto pb-1">
                            <div className="flex gap-4 lg:gap-8 w-fit mx-auto">
                                {TEMPLATE_IMAGES.map((img, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setActiveImageIndex(index)}
                                        className={`shrink-0 rounded-xl overflow-hidden border-2 transition-all ${index === activeImageIndex
                                            ? "border-[#007FFF] opacity-100"
                                            : "border-transparent opacity-60 hover:opacity-100"
                                            }`}
                                    >
                                        <Image
                                            src={img.src}
                                            alt={img.alt}
                                            width={120}
                                            height={80}
                                            className="w-20 h-16 lg:w-40 lg:h-30 object-cover"
                                        />
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="flex flex-col gap-4">
                        <h3 className="text-xl font-semibold text-[#1A1A1A]">Description</h3>
                        <p className="text-base text-[#4A4A4A] leading-7">
                            Zenith is a modern, clean, and professional Web3 wallet website template
                            designed for cryptocurrency and blockchain projects. It features a sleek
                            user interface with intuitive navigation, responsive design, and
                            pixel-perfect components. Perfect for launching your next DeFi, NFT, or
                            blockchain-based product.
                        </p>
                        <p className="text-base text-[#4A4A4A] leading-7">
                            This template includes multiple pre-built pages, reusable components,
                            and a design system that makes customization effortless. Built with best
                            practices in mind, Zenith ensures a seamless experience across all
                            devices and screen sizes.
                        </p>
                    </div>
                </div>

                {/* Right Column - Sticky Card (hidden on mobile) */}
                <div className="hidden lg:block w-full lg:w-90 shrink-0">
                    <DetailStickyCard
                        title="Zenith - Web3 Wallet Website"
                        price={20}
                    />
                </div>
            </div>
            <hr className="border-[#EEEEEE] mx-auto max-w-360" />
            <div className="w-full flex flex-col gap-14 mx-auto max-w-360 p-10">
                <div className="flex lg:flex-row flex-col w-full justify-between gap-6">
                    <div className="flex gap-2 items-center w-full">
                        <h4 className="text-[28px] lg:text-[32px] text-[#1A1A1A] font-semibold">Latest Templates</h4>
                    </div>
                    <Button variant="outline" className="whitespace-nowrap">
                        Explore all latest
                        <IoArrowForward />
                    </Button>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {Array.from({ length: 3 }).map((_, index) => (
                        <TemplateCard
                            key={index}
                            img="/assets/ic-zenith.svg"
                            is_checked price={20}
                            template_icon='/assets/ic-figma.svg'
                            template_label="Figma"
                            title="Zenith - Web3 Wallet Website wkwkwkwkwkwkw" />
                    ))}
                </div>
            </div>
            {/* Image Preview Modal */}
            <ImagePreview
                images={TEMPLATE_IMAGES}
                activeIndex={activeImageIndex}
                onActiveIndexChange={setActiveImageIndex}
                open={previewOpen}
                onOpenChange={setPreviewOpen}
            />

            {/* Mobile Bottom Bar */}
            <DetailMobileBottomBar
                title="Zenith - Web3 Wallet Website"
                price={20}
            />
            <div className="h-20 lg:hidden" />
        </div>
    )
}
