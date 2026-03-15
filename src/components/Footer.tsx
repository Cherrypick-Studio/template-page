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
    <Link href={link} className="text-[#1A1A1A] text-base hover:text-[#C42026] transition-colors">
      {label}
    </Link>
  )
}
export default function Footer() {
  return (
    <footer className="border-t border-zinc-200 bg-white mt-10">
      <div className="mx-auto flex lg:flex-row flex-col py-10 max-w-360 items-stretch justify-between px-2 text-sm text-zinc-500">
        <div className="flex flex-col justify-between gap-8">
          <div className="flex flex-col gap-6">
            <Link href="/">
              <Image alt="CherryPick — Premium UI Templates" width={120} height={30} src={'/assets/ic-logo-cherrypick.svg'} className="w-1/2" />
            </Link>
            <p>&copy; {new Date().getFullYear()} CherryPick. All rights reserved.</p>
          </div>
          <div className="flex gap-6">
            <SosmedWrapper icon={<FaXTwitter size={20} color="#C52128" />} link="https://twitter.com" />
            <SosmedWrapper icon={<FaLinkedin size={20} color="#C52128" />} link="https://linkedin.com" />
            <SosmedWrapper icon={<FaInstagram size={20} color="#C52128" />} link="https://instagram.com" />
          </div>
        </div>
        <div className="flex gap-16 lg:flex-row flex-col">
          <div className="flex gap-16">
            <div className="flex flex-col gap-8">
              <span className="text-base text-[#888888] font-semibold">LINKS</span>
              <nav aria-label="Footer links" className="flex flex-col gap-5">
                <LinkWrapper link="/" label="Home" />
                <LinkWrapper link="/work-in-progress" label="Roadmap" />
                <LinkWrapper link="/blog" label="Blog & Article" />
                <LinkWrapper link="/coming-soon" label="Refund Policy" />
                <LinkWrapper link="/coming-soon" label="Privacy Policy" />
                <LinkWrapper link="/coming-soon" label="Terms & Conditions" />
              </nav>
            </div>
            <div className="flex flex-col gap-8">
              <span className="text-base text-[#888888] font-semibold">OUR TEMPLATES</span>
              <nav aria-label="Template categories" className="flex flex-col gap-5">
                <LinkWrapper link="/template?category=ui-kit" label="UI Kit Templates" />
                <LinkWrapper link="/template?category=framer" label="Framer Templates" />
                <LinkWrapper link="/template?category=code" label="Code Templates" />
                <LinkWrapper link="/template?category=bundling" label="Bundling Templates" />
                <LinkWrapper link="/feature" label="Featured Templates" />
                <LinkWrapper link="/template" label="Latest Templates" />
              </nav>
            </div>
          </div>

          <HelpDeskCard />
        </div>
      </div>
    </footer>
  );
}
