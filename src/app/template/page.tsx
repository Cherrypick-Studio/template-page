import ReactToUsBanner from "@/components/Banner/ReactToUsBanner";
import TemplateCard from "@/components/Card/TemplateCard";

export default function FeatureKitPage() {
    return (
        <div className="w-full" >
            <div className="w-full mx-auto max-w-360 p-10 rounded-3xl flex flex-col gap-14">
                <div className="flex lg:flex-row flex-col w-full justify-between gap-6">
                    <div className="flex gap-2 items-center w-full">
                        <h4 className="text-[28px] lg:text-[32px] text-[#1A1A1A] font-semibold">Our Templates</h4>
                    </div>
                    <span className="text-xl text-[#1A1A1A] whitespace-nowrap">12 items</span>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {Array.from({ length: 8 }).map((_, index) => (
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

            {/* BANNER LAUNCH */}
            <div className="p-8 w-full">
                <ReactToUsBanner />
            </div>
        </div >
    )
}