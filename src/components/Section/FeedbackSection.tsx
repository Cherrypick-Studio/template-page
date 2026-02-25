"use client";

import { useState } from "react";
import FeedbackCard from "@/components/Card/FeedbackCard";
import { cn } from "../../../lib/utils";

const feedbacks = [
    {
        avatar: "https://i.pravatar.cc/150?img=1",
        name: "Sarah Johnson",
        role: "Product Designer",
        rating: 5,
        feedback: "These templates saved me weeks of work. The design quality is outstanding and everything is easy to customize. Highly recommended!",
    },
    {
        avatar: "https://i.pravatar.cc/150?img=2",
        name: "Michael Chen",
        role: "Frontend Developer",
        rating: 5,
        feedback: "Clean code, great structure, and beautiful designs. I've purchased multiple templates and they've all been top quality.",
    },
    {
        avatar: "https://i.pravatar.cc/150?img=3",
        name: "Emily Davis",
        role: "Startup Founder",
        rating: 4,
        feedback: "Launched our MVP in just 2 days using one of these templates. The responsiveness and attention to detail is impressive.",
    },
    {
        avatar: "https://i.pravatar.cc/150?img=4",
        name: "James Wilson",
        role: "Creative Director",
        rating: 5,
        feedback: "The best template collection I've come across. Modern designs that actually look premium. Worth every penny.",
    },
    {
        avatar: "https://i.pravatar.cc/150?img=5",
        name: "Olivia Martinez",
        role: "UX Researcher",
        rating: 5,
        feedback: "Excellent templates with great usability. The components are well-thought-out and the documentation is clear.",
    },
    {
        avatar: "https://i.pravatar.cc/150?img=6",
        name: "Daniel Kim",
        role: "Full Stack Developer",
        rating: 4,
        feedback: "Solid codebase and beautiful UI. Integration was seamless and the support team is very responsive.",
    },
    {
        avatar: "https://i.pravatar.cc/150?img=7",
        name: "Sophia Brown",
        role: "Marketing Manager",
        rating: 5,
        feedback: "Our conversion rate improved significantly after switching to one of these templates. Great investment for any business.",
    },
    {
        avatar: "https://i.pravatar.cc/150?img=8",
        name: "Liam Anderson",
        role: "Freelance Designer",
        rating: 5,
        feedback: "I use these templates as a starting point for client projects. They always impress and cut my delivery time in half.",
    },
    {
        avatar: "https://i.pravatar.cc/150?img=9",
        name: "Ava Thomas",
        role: "Tech Lead",
        rating: 4,
        feedback: "Well-structured components and clean architecture. Makes it easy to extend and build upon for larger projects.",
    },
    {
        avatar: "https://i.pravatar.cc/150?img=10",
        name: "Noah Garcia",
        role: "Indie Hacker",
        rating: 5,
        feedback: "Shipped 3 products using these templates. The quality and speed you get is unmatched. A must-have for solo builders.",
    },
];

const CARDS_PER_PAGE = 5;
const totalPages = Math.ceil(feedbacks.length / CARDS_PER_PAGE);

export default function FeedbackSection() {
    const [currentPage, setCurrentPage] = useState(0);

    return (
        <div className="flex flex-col gap-10 w-full mx-auto max-w-360 py-10">
            <h2 className="text-[32px] text-[#1A1A1A] font-semibold">What Our Customers Say</h2>
            <div className="overflow-hidden">
                <div
                    className="flex transition-transform duration-500 ease-in-out"
                    style={{ transform: `translateX(-${currentPage * 100}%)` }}
                >
                    {Array.from({ length: totalPages }).map((_, pageIndex) => (
                        <div
                            key={pageIndex}
                            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 w-full shrink-0"
                        >
                            {feedbacks
                                .slice(pageIndex * CARDS_PER_PAGE, (pageIndex + 1) * CARDS_PER_PAGE)
                                .map((item, cardIndex) => (
                                    <FeedbackCard key={cardIndex} {...item} />
                                ))}
                        </div>
                    ))}
                </div>
            </div>
            <div className="flex justify-center gap-2">
                {Array.from({ length: totalPages }).map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentPage(index)}
                        className={cn(
                            "w-3 h-3 rounded-full transition-colors duration-300 cursor-pointer",
                            currentPage === index ? "bg-[#C42026]" : "bg-[#DDDDDD]"
                        )}
                    />
                ))}
            </div>
        </div>
    );
}
