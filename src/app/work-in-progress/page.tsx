"use client";

import BuildingBanner from "@/components/Banner/BuildingBanner";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function WorkInProgress() {
    const targetPercent = 60;
    const [percent, setPercent] = useState(0);
    const [dotCount, setDotCount] = useState(1);

    useEffect(() => {
        if (percent < targetPercent) {
            const timer = setTimeout(() => setPercent((p) => p + 1), 30);
            return () => clearTimeout(timer);
        }
    }, [percent]);

    useEffect(() => {
        const interval = setInterval(() => {
            setDotCount((d) => (d % 3) + 1);
        }, 500);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="w-full">
            <div className="w-full mx-auto max-w-360 p-4 lg;p-10 rounded-3xl flex flex-col gap-14">
                <div className="flex flex-col pt-4 lg:pt-20 gap-14">
                    <h1 className="text-[32px] font-semibold text-[#1A1A1A]">Work In Progress</h1>
                    <div className="w-full border-2 border-[#007FFF] bg-[#FEFEFE] p-6 rounded-3xl gap-14 flex lg:flex-row flex-col">
                        <div className="flex flex-col gap-4 justify-between">
                            <div className="flex flex-col">
                                <span className="text-[48px] text-[#1A1A1A] font-medium">Zenith - Web3 Wallet Website</span>
                                <div className="flex items-center gap-5">
                                    <span>Templates category</span>
                                    <div className="flex gap-2 items-center py-0 px-4 bg-[#FEFEFE] border border-[#DDDDDD] rounded-full text-base text-[#1A1A1A]">
                                        <Image src={'/assets/ic-figma.svg'} width={100} height={100} alt="img-icon" className="w-3.5 aspect-square object-contain" />
                                        <span>UI Kit</span>
                                    </div>
                                </div>

                                {/* divider */}
                                <div className="w-full h-px bg-[#DDDDDD] mt-8" />
                            </div>

                            {/* desc */}
                            <p>The product is currently being processed. We will display the details when the product is finished.</p>
                        </div>
                        {/* image detail  */}
                        <div className="w-full max-w-147 h-100 flex items-center justify-center relative overflow-hidden rounded-2xl">
                            <Image src={'/assets/ic-zenith.svg'} width={100} height={100} alt="img-icon" className="w-full absolute" />
                            <div className="absolute w-full h-full bg-[#FEFEFE80] backdrop-blur-xl z-10" />
                            <div className="bg-[#007FFF] flex flex-col justify-center items-center w-30 h-30 rounded-full z-10">
                                <span className="text-[24px] text-[#FEFEFE]">{percent}%</span>
                                <span className="text-xs text-[#FEFEFE]">Progress{'.'.repeat(dotCount)}</span>
                            </div>
                        </div>
                    </div>
                </div>
                {/* divider */}
                <div className="w-full h-px bg-[#DDDDDD] mt-8" />
                <div className="">
                    <span className="text-[32px] font-semibold text-[#1A1A1A]">Preparing New Line-Up</span>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mt-14">
                        {Array.from({ length: 3 }).map((_, index) => (
                            <div key={index} className="flex flex-col gap-4 justify-between bg-[#F5F5F5] border border-[#DDDDDD] p-6 rounded-3xl h-80">
                                <div className="flex flex-col">
                                    <span className="text-[24px] text-[#1A1A1A] font-medium">Zenith - Web3 Wallet Website</span>
                                    <div className="flex items-center gap-5">
                                        <span>Templates category</span>
                                        <div className="flex gap-2 items-center py-0 px-4 bg-[#FEFEFE] border border-[#DDDDDD] rounded-full text-base text-[#1A1A1A]">
                                            <Image src={'/assets/ic-figma.svg'} width={100} height={100} alt="img-icon" className="w-3.5 aspect-square object-contain" />
                                            <span>UI Kit</span>
                                        </div>
                                    </div>

                                    {/* divider */}
                                    <div className="w-full h-px bg-[#DDDDDD] mt-8" />
                                </div>

                                {/* desc */}
                                <p>The product is currently being processed. We will display the details when the product is finished.</p>
                            </div>
                        ))}
                    </div>
                </div>
                <BuildingBanner />
            </div>
        </div>
    )
}