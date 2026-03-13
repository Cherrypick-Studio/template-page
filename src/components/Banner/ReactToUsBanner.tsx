import { Button } from "@/components/ui/button";
import { IoArrowForward } from "react-icons/io5";

export default function ReactToUsBanner() {
    return (
        <div className="bg-neutral-100 rounded-3xl flex flex-col p-6 lg:p-20 gap-12 justify-center items-center w-full mx-auto max-w-360">
            <div className="flex flex-col gap-6">
                <span className="text-5xl text-[#1A1A1A] text-center font-semibold">
                    Reach Out to Us
                </span>
                <span className="text-center">
                    Get in touch with us today! Explore our customizable templates and <br />
                    start your project effortlessly.
                </span>
            </div>
            <Button>
                Contact Us
                <IoArrowForward />
            </Button>
        </div>
    )
}