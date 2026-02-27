import Image from "next/image";
import { IoArrowForward, IoCheckmarkDone } from "react-icons/io5";
import { BsFillPatchCheckFill } from "react-icons/bs";
import FeatureCard from "@/components/Card/FeatureCard";
import LaunchBanner from "@/components/Banner/LaunchBanner";
import { Button } from "@/components/ui/button";
import Accordion from "@/components/Elements/Accordion";
import { cn } from "../../lib/utils";
import TemplateCard from "@/components/Card/TemplateCard";
import FeedbackSection from "@/components/Section/FeedbackSection";
import BuildingBanner from "@/components/Banner/BuildingBanner";

export default function Home() {
  const templateUI = [
    {
      img: '/assets/ic-figma.svg',
      title: 'UI Kit'
    },
    {
      img: '/assets/ic-framer.svg',
      title: 'Framer'
    },
    {
      img: '/assets/ic-code.svg',
      title: 'Code'
    },
    {
      img: '/assets/ic-library.svg',
      title: 'Bundling'
    },
    {
      img: '/assets/ic-ebook.svg',
      title: 'E-book'
    },
    {
      img: '/assets/ic-webflow.svg',
      title: 'Webflow',
      coming_soon: true
    }
  ]
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
            <Button variant="default">
              Browse Templates
              <IoArrowForward />
            </Button>
            <Button variant="outline">
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
            <Button variant="outline" className="whitespace-nowrap">
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
      {/* THIRD SECTION */}
      <div className="flex lg:flex-row flex-col relative gap-10 w-full mx-auto max-w-360 justify-between">
        <div className="sticky top-15 h-fit  w-full lg:w-155 shrink-0">
          <h1 className="text-[64px] text-[#1A1A1A] font-semibold leading-16">
            Everything <br /> You Need  <br /> to <span className="text-[#C42026]">Build Faster</span>
          </h1>
        </div>
        <div className="flex flex-col w-full gap-16 flex-1">
          <div className="flex flex-col relative justify-start items-center border border-[#EBEBEB] p-8 gap-4 w-full h-80 rounded-3xl hover:shadow-xl">
            <Image alt="ic-rocket" width={100} height={100} className="w-10" src="/assets/ic-rocket.svg" />
            <span className="text-center text-2xl font-semibold text-[#1A1A1A]">Save Time, Ship Faster</span>
            <p className="text-center text-base text-[#666666]">Skip repetitive setup work. <br />
              Our templates help you launch projects in hours, not days.</p>
            <Image alt="ic-rocket" width={100} height={100} className="w-full absolute bottom-0" src="/assets/ic-waving.svg" />
          </div>
          <div className="flex flex-col relative justify-start items-center border border-[#EBEBEB] p-8 gap-4 w-full h-80 rounded-3xl hover:shadow-xl">
            <Image alt="ic-rocket" width={100} height={100} className="w-10" src="/assets/ic-magic.svg" />
            <span className="text-center text-2xl font-semibold text-[#1A1A1A]">Easy to Customize</span>
            <p className="text-center text-base text-[#666666]">Skip repetitive setup work. <br />
              Our templates help you launch projects in hours, not days.</p>
            <Image alt="ic-rocket" width={100} height={100} className="w-full absolute bottom-0" src="/assets/ic-waving.svg" />
          </div>
          <div className="flex flex-col relative justify-start items-center border border-[#EBEBEB] p-8 gap-4 w-full h-80 rounded-3xl hover:shadow-xl">
            <Image alt="ic-rocket" width={100} height={100} className="w-10" src="/assets/ic-rocket.svg" />
            <span className="text-center text-2xl font-semibold text-[#1A1A1A]">Save Time, Ship Faster</span>
            <p className="text-center text-base text-[#666666]">Skip repetitive setup work. <br />
              Our templates help you launch projects in hours, not days.</p>
            <Image alt="ic-rocket" width={100} height={100} className="w-full absolute bottom-0" src="/assets/ic-waving.svg" />
          </div>
        </div>
      </div>
      {/* BANNER LAUNCH */}
      <div className="p-8 w-full">
        <LaunchBanner />
      </div>
      {/* Template Category */}
      <div className="flex flex-col relative gap-10 w-full mx-auto max-w-360">
        <h2 className="text-[32px] text-[#1A1A1A] font-semibold">Our Templates Category</h2>
        <div className="flex lg:flex-row flex-col w-full gap-10">
          {templateUI.map((list, index) => (
            <div key={index} className={
              cn(
                "flex flex-col gap-4 relative justify-center items-center py-8 px-4 bg-[#FEFEFE] border border-[#DDDDDD] rounded-3xl w-full",
                {
                  'bg-[#F5F5F5]': list.coming_soon
                }
              )
            }>
              {
                list.coming_soon && <span className="text-[#FEFEFE] text-[10px] py-1.5 px-3 bg-[#1A1A1A] rounded-full absolute -top-2">comming soon</span>
              }
              <Image alt={`ic-${list.title}`} width={100} height={100} className="w-20" src={list.img} />
              <span className={
                cn(
                  "text-xl text-[#1A1A1A] font-bold ",
                  {
                    "text-[#888888]": list.coming_soon
                  }
                )
              }>
                {list.title}
              </span>
            </div>
          ))}
        </div>
      </div>
      {/* TEMPLATE SECTION */}
      <div className="p-4 lg:p-10 w-full">
        <div className="w-full mx-auto max-w-360 bg-[#F5F5F5] p-10 rounded-3xl flex flex-col gap-14">
          <div className="flex lg:flex-row flex-col w-full justify-between gap-6">
            <div className="flex gap-2 items-center w-full">
              <h4 className="text-[28px] lg:text-[32px] text-[#1A1A1A] font-semibold">Latest Templates</h4>
            </div>
            <Button variant="outline" className="whitespace-nowrap">
              Explore all latest
              <IoArrowForward />
            </Button>
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
      </div>
      {/* FEEDBACk SECTION */}
      <FeedbackSection />

      {/* FAQ SECTION */}
      <div className="flex flex-col gap-10 w-full mx-auto max-w-360 py-10 px-4 lg:px-0">
        <h2 className="text-[32px] text-[#1A1A1A] font-semibold">Frequently Asked Questions</h2>
        <Accordion
          items={[
            {
              question: "What formats are the templates available in?",
              answer: "Our templates are available in multiple formats including Figma, Framer, and coded versions (HTML/CSS, React, Next.js). Each template listing specifies which formats are included.",
            },
            {
              question: "Can I use the templates for commercial projects?",
              answer: "Yes! All our templates come with a commercial license that allows you to use them in personal and commercial projects. You can build client websites, SaaS products, and more.",
            },
            {
              question: "Do I get free updates after purchasing?",
              answer: "Absolutely. Once you purchase a template, you receive all future updates for free. We regularly improve our templates with new features, bug fixes, and design enhancements.",
            },
            {
              question: "How do I customize the templates?",
              answer: "Our templates are built with clean, well-organized code and use popular frameworks like Tailwind CSS. You can easily customize colors, fonts, layouts, and components to match your brand.",
            },
            {
              question: "Is there a refund policy?",
              answer: "We offer a 14-day refund policy. If you're not satisfied with your purchase, contact our support team and we'll process your refund promptly.",
            },
          ]}
        />
      </div>

      {/* BUILDING SECTION */}
      <div className="p-3 lg:p-0 w-full">
        <BuildingBanner />
      </div>
    </div>
  );
}
