import Image from "next/image";
import { Button } from "@radix-ui/themes";
import { IoArrowForward, IoCheckmarkDone } from "react-icons/io5";
import { BsFillPatchCheckFill } from "react-icons/bs";
import FeatureCard from "@/components/Card/FeatureCard";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen items-center">
      <div className="flex w-full max-w-360 lg:flex-row flex-col items-center justify-between gap-20 pt-20 px-2 lg:pt-30 bg-white sm:items-start">
        <div className="flex flex-col gap-12">
          <div className="flex flex-col gap-6">
            <h1 className="text-[64px] text-[#1A1A1A] font-semibold leading-16">
              Launch Faster with <span className="text-[#C42026]">Premium Templates</span>
            </h1>
            <p className="text-lg text-[#666666]">A curated collection of modern website templates crafted with precision, consistency, and scalability in mind.</p>
            <div className="flex gap-4">
              <div className="flex gap-2 items-center bg-[#FAFAFA] py-1 px-2 rounded-full">
                <IoCheckmarkDone color="#C42026" />
                <span className="text-[#1A1A1A]">Easy to Customize</span>
              </div>
              <div className="flex gap-2 items-center bg-[#FAFAFA] py-1 px-2 rounded-full">
                <IoCheckmarkDone color="#C42026" />
                <span className="text-[#1A1A1A]">Responsive & Scalable</span>
              </div>
            </div>
          </div>
          <div className="flex gap-6">
            <Button size="3" className="flex bg-[#1A1A1A]! rounded-full!">
              Browse Templates
              <IoArrowForward />
            </Button>
            <Button size="3" className="flex border! border-[#999999]! text-[#1A1A1A]! bg-[#FEFEFE]! rounded-full!">
              Latest Templates
              <IoArrowForward />
            </Button>
          </div>
        </div>
        <Image
          src="/assets/ic-intro.svg"
          alt="Next.js logo"
          className="w-full"
          width={100}
          height={20}
          priority
        />
      </div>
      {/* SECOND SECTION */}
      <div className="p-4 lg:p-10 w-full">
        <div className="w-full mx-auto max-w-360 bg-[#F5F5F5] p-10 rounded-3xl flex flex-col gap-14">
          <div className="flex lg:flex-row flex-col w-full justify-between gap-6">
            <div className="flex gap-2 items-center w-full">
              <BsFillPatchCheckFill size={20} color="#249B00" />
              <h4 className="text-[28px] lg:text-[32px] text-[#1A1A1A] font-semibold">Featured Templates</h4>
            </div>
            <Button size="3" className="flex border! border-[#999999]! text-[#1A1A1A]! bg-[#FEFEFE]! rounded-full!">
              Explore all featured
              <IoArrowForward />
            </Button>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {Array.from({ length: 8 }).map((_, index) => (
              <FeatureCard
                key={index}
                img="/assets/ic-zenith.svg"
                is_checked price={20}
                template_icon='/assets/ic-figma.svg'
                template_label="Figma"
                title="Zenith - Web3 Wallet Website wkwkwkwkwkwkw" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
