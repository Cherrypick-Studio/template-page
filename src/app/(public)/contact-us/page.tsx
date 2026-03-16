import { IoCallOutline, IoMailOutline } from "react-icons/io5";
import Accordion from "@/components/Elements/Accordion";
import { createClient } from "@/lib/supabase/server";
import type { Metadata } from "next";
import type { FAQ } from "@/lib/supabase/types";
import ContactForm from "./ContactForm";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Contact Us — CherryPick",
  description:
    "Get in touch with the CherryPick team. We're here to help with any questions about our templates and design assets.",
  alternates: { canonical: "/contact-us" },
  openGraph: {
    title: "Contact Us — CherryPick",
    description:
      "Get in touch with the CherryPick team. We're here to help with any questions about our templates and design assets.",
    url: "/contact-us",
  },
};

export default async function ContactUsPage() {
  const supabase = await createClient();

  const { data: faqsRaw } = await supabase
    .from("faqs")
    .select("*")
    .order("sort_order");

  const faqs = faqsRaw as unknown as FAQ[] | null;

  return (
    <div className="flex flex-col min-h-screen items-center">
      {/* CONTACT SECTION */}
      <section
        aria-label="Contact Us"
        className="flex w-full max-w-360 flex-col lg:flex-row gap-12 lg:gap-20 pt-20 px-3 lg:pt-30 lg:px-10"
      >
        {/* Left Column — Info */}
        <div className="flex flex-col gap-8 w-full lg:w-1/2">
          <div className="flex flex-col gap-4">
            <h1 className="text-[48px] lg:text-[40px] text-[#1A1A1A] font-semibold leading-12 lg:leading-16">
              Contact us
            </h1>
            <p className="text-lg text-[#666666]">
              Explore our thoughtfully designed collection of contact us website
              templates, tailored for seamless communication and user engagement.
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#FAFAFA] border border-[#EBEBEB]">
                <IoCallOutline size={20} color="#C42026" />
              </div>
              <span className="text-[#1A1A1A] font-medium">0822-1833-9682</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#FAFAFA] border border-[#EBEBEB]">
                <IoMailOutline size={20} color="#C42026" />
              </div>
              <span className="text-[#1A1A1A] font-medium">cherrypick.main@gmail.com</span>
            </div>
          </div>
        </div>

        {/* Right Column — Form */}
        <div className="w-full lg:w-1/2">
          <ContactForm />
        </div>
      </section>

      {/* WHY SECTION */}

      <div className="flex lg:flex-row flex-col w-full gap-16 mx-auto max-w-360 py-20 px-3 lg:px-10">
        <article className="flex flex-col relative justify-start items-center border border-[#EBEBEB] p-8 gap-4 w-full h-80 rounded-3xl hover:shadow-xl">
          <Image alt="Save time icon" width={100} height={100} className="w-10" src="/assets/ic-rocket.svg" />
          <h3 className="text-center text-2xl font-semibold text-[#1A1A1A]">Save Time, Ship Faster</h3>
          <p className="text-center text-base text-[#666666]">
            Skip repetitive setup work. Our templates help you launch projects in hours, not days.
          </p>
          <Image alt="Waving decoration" width={100} height={100} className="w-full absolute bottom-0" src="/assets/ic-waving.svg" />
        </article>
        <article className="flex flex-col relative justify-start items-center border border-[#EBEBEB] p-8 gap-4 w-full h-80 rounded-3xl hover:shadow-xl">
          <Image alt="Customization icon" width={100} height={100} className="w-10" src="/assets/ic-magic.svg" />
          <h3 className="text-center text-2xl font-semibold text-[#1A1A1A]">Easy to Customize</h3>
          <p className="text-center text-base text-[#666666]">
            Every component is built with clean structure. Swap colors, fonts, and layouts with ease.
          </p>
          <Image alt="Waving decoration" width={100} height={100} className="w-full absolute bottom-0" src="/assets/ic-waving.svg" />
        </article>
        <article className="flex flex-col relative justify-start items-center border border-[#EBEBEB] p-8 gap-4 w-full h-80 rounded-3xl hover:shadow-xl">
          <Image alt="Premium quality icon" width={100} height={100} className="w-10" src="/assets/ic-rocket.svg" />
          <h3 className="text-center text-2xl font-semibold text-[#1A1A1A]">Built for Scale</h3>
          <p className="text-center text-base text-[#666666]">
            Templates designed with scalability in mind. Start small, grow fast — without rework.
          </p>
          <Image alt="Waving decoration" width={100} height={100} className="w-full absolute bottom-0" src="/assets/ic-waving.svg" />
        </article>
      </div>
      {/* FAQ SECTION */}
      <section
        aria-label="Frequently Asked Questions"
        className="flex flex-col gap-10 w-full mx-auto max-w-360 py-20 px-3 lg:px-10"
      >
        <h2 className="text-[32px] text-[#1A1A1A] font-semibold">
          Frequently Asked Questions
        </h2>
        <Accordion
          items={
            faqs && faqs.length > 0
              ? faqs.map((f) => ({ question: f.question, answer: f.answer }))
              : [
                {
                  question: "What formats are the templates available in?",
                  answer:
                    "Our templates are available in multiple formats including Figma, Framer, and coded versions.",
                },
                {
                  question: "Can I use the templates for commercial projects?",
                  answer:
                    "Yes! All our templates come with a commercial license.",
                },
              ]
          }
        />
      </section>
    </div>
  );
}
