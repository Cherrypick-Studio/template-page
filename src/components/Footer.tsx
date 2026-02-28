import Image from "next/image";
import HelpDeskCard from "./Card/HelpDeskCard";
import { FaInstagram, FaLinkedin, FaXTwitter } from "react-icons/fa6";
import Link from "next/link";

const SosmedWrapper = ({ link, icon }: { link: string; icon: React.ReactNode }) => (
  <Link href={link} target="_blank" rel="noopener noreferrer" className="bg-[#FEFEFE] flex items-center justify-center border border-[#DDDDDD] rounded-full w-12 h-12">
    {icon}
  </Link>
)

const LinkWrapper = ({ link, label }: { link: string; label: string }) => {
  return (
    <Link href={link} target="_blank" rel="noopener noreferrer" className="text-[#1A1A1A] text-base">
      {label}
    </Link>
  )
}
export default function Footer() {


  return (
    <footer className="border-t border-zinc-200 bg-white mt-10">
      <div className="mx-auto flex lg:flex-row flex-col py-10 max-w-360 items-stretch justify-between px-2 text-sm text-zinc-500">
        <div className="flex flex-col justify-between">
          <div className="flex flex-col gap-6">
            <Image alt="cherrypick-logo-footer" width={100} height={100} src={'/assets/ic-logo-cherrypick.svg'} className="w-1/2" />
            <p>&copy; {new Date().getFullYear()} CherryPick. All rights reserved.</p>
          </div>
          {/* sosmed section */}
          <div className="flex gap-6">
            <SosmedWrapper icon={<FaXTwitter size={20} color="#C52128" />} link="/" />
            <SosmedWrapper icon={<FaLinkedin size={20} color="#C52128" />} link="/" />
            <SosmedWrapper icon={<FaInstagram size={20} color="#C52128" />} link="/" />
          </div>
        </div>
        <div className="flex gap-16 lg:flex-row flex-col">
          <div className="flex gap-16">
            <div className="flex flex-col gap-8">
              <span className="text-base text-[#888888]">LINKS</span>
              <div className="flex flex-col gap-5">
                <LinkWrapper link="/" label="Home" />
                <LinkWrapper link="/" label="Roadmap" />
                <LinkWrapper link="/" label="Blog & Article" />
                <LinkWrapper link="/" label="Refund Policy" />
                <LinkWrapper link="/" label="Privacy Policy" />
                <LinkWrapper link="/" label="Terms & Conditions" />
              </div>
            </div>
            <div className="flex flex-col gap-8">
              <span className="text-base text-[#888888]">OUR TEMPLATES</span>
              <div className="flex flex-col gap-5">
                <LinkWrapper link="/" label="UI Kit Templates" />
                <LinkWrapper link="/" label="Framer Templates" />
                <LinkWrapper link="/" label="Code Templates" />
                <LinkWrapper link="/" label="Bundling Templates" />
                <LinkWrapper link="/" label="Featured Templates" />
                <LinkWrapper link="/" label="Latest Templates" />
              </div>
            </div>
          </div>

          {/* Banner Card */}
          <HelpDeskCard />
        </div>
      </div>
    </footer>
  );
}
