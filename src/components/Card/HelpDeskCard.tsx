import Image from "next/image";
import { Button } from "../ui/button";

export default function HelpDeskCard() {
    return (
        <div className="flex flex-col p-4 rounded-3xl bg-[#FEFEFE] border border-[#DDDDDD] gap-6">
            <Image alt="CherryPick helpdesk illustration" src={'/assets/ic-cherrypick-desk.svg'} width={100} height={100} className="w-full" />
            <div className="flex gap-4">
                <div className="flex flex-col gap-1">
                    <span className="text-[#1A1A1A] text-base font-semibold">Need Help ?</span>
                    <p className="text-xs text-[#999999]">Our team is ready to assist you anytime.</p>
                </div>
                <Button>Contact Us</Button>
            </div>
        </div>
    )
}