import { Button } from "@/components/ui/button";
import { IoArrowForward } from "react-icons/io5";

export default function LaunchBanner() {
    return (
        <div className="bg-neutral-100 rounded-3xl flex flex-col p-20 gap-12 justify-center items-center w-full mx-auto max-w-360">
            <div className="flex flex-col gap-6">
                <span className="text-5xl text-[#1A1A1A] text-center font-semibold">
                    Launch Your Website: <br />
                    Creative Designs and Expert Support!
                </span>
                <span className="text-center">
                    It`s not just about templates, we can also provide the best services for custom designs, <br />
                    even until your website launches.
                </span>
            </div>
            <Button variant="outline">
                Explore Our Services
                <IoArrowForward />
            </Button>
        </div>
    )
}