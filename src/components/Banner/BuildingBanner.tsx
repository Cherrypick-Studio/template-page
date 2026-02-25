import Button from "@/components/Elements/Button";
import MarqueeCarousel from "@/components/Elements/MarqueeCarousel";
import { IoArrowForward } from "react-icons/io5";
import FeatureCard from "../Card/FeatureCard";

export default function BuildingBanner() {
    return (
        <div className="bg-[#1a1a1af7] relative overflow-hidden rounded-3xl flex p-6 lg:p-20 gap-12 justify-start items-start w-full mx-auto max-w-360">
            <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-6">
                    <span className="text-4xl lg:text-5xl text-[#FEFEFE] text-center lg:text-left font-semibold">
                        Start Building with<br />
                        Ready-Made Templates
                    </span>
                    <span className="text-center lg:text-left text-[#DDDDDD]">
                        Skip the setup. Choose a template, customize it, andlaunch your next project faster.
                    </span>
                </div>
                <Button variant="outline" className="w-fit max-lg:mx-auto">
                    Browse Templates
                    <IoArrowForward />
                </Button>
            </div>
            <MarqueeCarousel
                direction="down"
                speed={30}
                gap={12}
                pauseOnHover
                className="absolute top-0 right-20 h-full hidden lg:block"
            >
                {Array.from({ length: 8 }).map((_, index) => (
                    <FeatureCard
                        key={index}
                        img="/assets/ic-zenith.svg"
                        is_checked price={20}
                        template_icon='/assets/ic-figma.svg'
                        template_label="Figma"
                        title="Zenith - Web3 Wallet Website wkwkwkwkwkwkw"
                        showFeature={false}
                        whiteContent />
                ))}
            </MarqueeCarousel>
        </div>
    )
}
