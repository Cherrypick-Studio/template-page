import Image from "next/image";
import { BsFillPatchCheckFill } from "react-icons/bs";
import { cn } from "../../../lib/utils";

interface IPropsFeatureCard {
    img: string
    title: string
    is_checked: boolean
    template_icon: string
    template_label: string
    price: number
    showFeature?: boolean
    whiteContent?: boolean
}
export default function FeatureCard({
    img = '/assets/ic-zenith.svg',
    is_checked = true,
    price = 20,
    template_icon = '/assets/ic-figma.svg',
    template_label = 'Figma',
    title = 'Zenith - Web3 Wallet Website',
    showFeature,
    whiteContent = false
}: IPropsFeatureCard) {
    return (
        <div className="flex flex-col gap-4 w-full max-w-xs">
            <Image src={img} alt={`${title} template preview`} width={400} height={300} className="w-full rounded-2xl" />
            <div className="flex overflow-hidden">
                <span className={
                    cn(
                        "flex-1 min-w-0 truncate",
                        {
                            'text-[#FEFEFE]': whiteContent
                        }
                    )
                }>{title}</span>
                {is_checked && <BsFillPatchCheckFill size={20} color={
                    whiteContent ? '#FEFEFE' : "#249B00"
                } />}
            </div>
            {showFeature && 
            <div className="flex justify-between">
                <div className="flex gap-2 items-center py-2 px-4 bg-[#FEFEFE] border border-[#DDDDDD] rounded-full text-base text-[#1A1A1A]">
                    <Image src={template_icon} width={100} height={100} alt={`${template_label} icon`} className="w-3.5 aspect-square object-contain" />
                    <span>{template_label}</span>
                </div>
                <div className="py-2 px-4 bg-[#FEFEFE] border border-[#DDDDDD] rounded-full text-base text-[#1A1A1A] flex gap-2">
                    <span>$</span>
                    <span>{price}</span>
                </div>
                </div>}
        </div>
    )
}