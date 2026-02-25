import Image from "next/image";
import { IoStar } from "react-icons/io5";

interface IPropsFeedbackCard {
    avatar: string;
    name: string;
    role: string;
    rating: number;
    feedback: string;
}

export default function FeedbackCard({
    avatar,
    name,
    role,
    rating,
    feedback,
}: IPropsFeedbackCard) {
    return (
        <div className="flex flex-col gap-4 p-6 bg-[#FEFEFE] border border-[#EBEBEB] rounded-2xl w-full shrink-0">
            <div className="flex items-center gap-3">
                <Image
                    src={avatar}
                    alt={name}
                    width={48}
                    height={48}
                    className="w-12 h-12 rounded-full object-cover"
                />
                <div className="flex flex-col">
                    <span className="text-base font-semibold text-[#1A1A1A]">{name}</span>
                    <span className="text-sm text-[#666666]">{role}</span>
                </div>
            </div>
            <div className="flex gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                    <IoStar key={i} size={16} color={i < rating ? "#F5A623" : "#DDDDDD"} />
                ))}
            </div>
            <p className="text-sm text-[#666666] leading-relaxed">{feedback}</p>
        </div>
    );
}
