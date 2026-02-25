import Image from "next/image";

interface IPropsTemplateCard {
    img: string
    title: string
    is_checked: boolean
    template_icon: string
    template_label: string
    price: number
}
export default function TemplateCard({
    img = '/assets/ic-zenith.svg',
    price = 20,
    template_icon = '/assets/ic-figma.svg',
    template_label = 'Figma',
    title = 'Zenith - Web3 Wallet Website wkwkwkwkwkwkw'
}: IPropsTemplateCard) {
    return (
        <div className="flex flex-col gap-4">
            <Image src={img} alt="img-product" width={100} height={100} className="w-full rounded-2xl" />
            <div className="flex overflow-hidden">
                <span className="flex-1 min-w-0 truncate">{title}</span>
                <span className="py-1 px-3 bg-[#007FFF] text-white font-semibold rounded-full text-sm">NEW</span>
            </div>
            <div className="flex justify-between">
                <div className="flex gap-2 items-center py-2 px-4 bg-[#FEFEFE] border border-[#DDDDDD] rounded-full text-base text-[#1A1A1A]">
                    <Image src={template_icon} width={100} height={100} alt="img-icon" className="w-3.5 aspect-square object-contain" />
                    <span>{template_label}</span>
                </div>
                <div className="py-2 px-4 bg-white font-semibold border border-[#DDDDDD] rounded-full text-base text-[#1A1A1A] flex gap-2">
                    <span>$</span>
                    <span>{price}</span>
                </div>
            </div>
        </div>
    )
}