"use client"

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
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
    title: string
    price: number
}

export default function DetailMobileBottomBar({ title, price }: IPropsDetailMobileBottomBar) {
    const [open, setOpen] = useState(false);

    return (
        <div className="fixed bottom-0 left-0 right-0 z-40 lg:hidden">
            <Drawer open={open} onOpenChange={setOpen}>
                <DrawerTrigger asChild>
                    <div className="flex flex-col items-center justify-between bg-white border-t border-[#DDDDDD] px-6 py-4 shadow-[0_-4px_12px_rgba(0,0,0,0.08)]">
                        <div className="flex w-full justify-between gap-1 mb-6">
                            <span className="text-xl text-[#1A1A1A]">Subtotal</span>
                            <span className="text-xl font-semibold text-[#1A1A1A]">${price}</span>
                        </div>
                        <Button className="w-full">
                            Add to Cart
                        </Button>
                    </div>
                </DrawerTrigger>
                <DrawerContent>
                    <DrawerHeader>
                        <DrawerTitle className="text-lg font-semibold text-[#1A1A1A]">{title}</DrawerTitle>
                    </DrawerHeader>
                    <div className="flex flex-col gap-6 px-6 pb-8">
                        <div className="flex items-center gap-5 w-full justify-between">
                            <span>Templates category</span>
                            <div className="flex gap-2 items-center py-0 px-4 bg-[#FEFEFE] border border-[#DDDDDD] rounded-full text-base text-[#1A1A1A]">
                                <Image src={'/assets/ic-figma.svg'} width={100} height={100} alt="img-icon" className="w-3.5 aspect-square object-contain" />
                                <span>UI Kit</span>
                            </div>
                        </div>
                        {/* Review section */}
                        <div className="flex w-full justify-between items-center">
                            <div className="flex gap-2 items-center">
                                <FaStar color="#FFCA00" size={23} />
                                <span className="text-[28px] text-[#1A1A1A] font-medium">4.9 <span className="text-base text-[#888888]"> / 5.0</span></span>
                            </div>
                            <div className="flex gap-2 bg-[#EFF7FF] rounded-2xl p-4 items-center">
                                <IoBagCheckOutline />
                                <span className="text-[#0466C9] font-semibold text-base">19 sales</span>
                            </div>
                        </div>
                        {/* Highlight section */}
                        <div className="flex flex-col p-6 bg-[#F5F5F5] rounded-2xl gap-4">
                            <span className="text-[#1A1A1A] font-semibold text-xl">Highlight</span>
                            <div className="flex gap-3 items-center">
                                <IoCalendarOutline />
                                <span className="text-[#666666] text-base">
                                    Created at: <span className="text-[#1A1A1A] font-medium">January 27, 2026</span>
                                </span>
                            </div>
                            <div className="flex gap-3 items-center">
                                <FaRegFileArchive />
                                <span className="text-[#666666] text-base">
                                    File type: <span className="text-[#1A1A1A] font-medium">Figma(.Fig)</span>
                                </span>
                            </div>
                            <div className="flex gap-3 items-center">
                                <ImAttachment />
                                <span className="text-[#666666] text-base">
                                    File Size: <span className="text-[#1A1A1A] font-medium">200GB</span>
                                </span>
                            </div>
                            <div className="flex gap-3 items-center">
                                <TbDeviceMobileMessage />
                                <span className="text-[#666666] text-base">
                                    Product Type: <span className="text-[#1A1A1A] font-medium">Responsive</span>
                                </span>
                            </div>
                        </div>
                        <hr className="border-[#EEEEEE]" />
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-[#6B6B6B]">Subtotal</span>
                            <span className="text-xl font-semibold text-[#1A1A1A]">${price}</span>
                        </div>
                        <Button className="w-full">
                            Add to Cart
                        </Button>
                    </div>
                </DrawerContent>
            </Drawer>
        </div>
    )
}
