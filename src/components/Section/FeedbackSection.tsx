"use client";

import { useState } from "react";
import FeedbackCard from "@/components/Card/FeedbackCard";
import { cn } from "../../../lib/utils";
import type { Review } from "@/lib/supabase/types";

interface Props {
    reviews: Review[];
}

const CARDS_PER_PAGE = 5;

const fallbackReviews: Review[] = [
    { id: "1", template_id: null, author_name: "Sarah Johnson", author_role: "Product Designer", author_avatar: "https://i.pravatar.cc/150?img=1", rating: 5, content: "These templates saved me weeks of work. The design quality is outstanding!", created_at: "" },
    { id: "2", template_id: null, author_name: "Michael Chen", author_role: "Frontend Developer", author_avatar: "https://i.pravatar.cc/150?img=2", rating: 5, content: "Clean code, great structure, and beautiful designs.", created_at: "" },
    { id: "3", template_id: null, author_name: "Emily Davis", author_role: "Startup Founder", author_avatar: "https://i.pravatar.cc/150?img=3", rating: 4, content: "Launched our MVP in just 2 days using one of these templates.", created_at: "" },
    { id: "4", template_id: null, author_name: "James Wilson", author_role: "Creative Director", author_avatar: "https://i.pravatar.cc/150?img=4", rating: 5, content: "The best template collection I've come across. Worth every penny.", created_at: "" },
    { id: "5", template_id: null, author_name: "Olivia Martinez", author_role: "UX Researcher", author_avatar: "https://i.pravatar.cc/150?img=5", rating: 5, content: "Excellent templates with great usability and well-thought-out components.", created_at: "" },
];

export default function FeedbackSection({ reviews }: Props) {
    const feedbacks = reviews.length > 0 ? reviews : fallbackReviews;
    const totalPages = Math.ceil(feedbacks.length / CARDS_PER_PAGE);
    const [currentPage, setCurrentPage] = useState(0);

    return (
        <section aria-label="Customer Reviews" className="flex flex-col gap-10 w-full mx-auto max-w-360 py-10 px-3 lg:px-10">
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
                                .map((item) => (
                                    <FeedbackCard
                                        key={item.id}
                                        avatar={item.author_avatar ?? `https://i.pravatar.cc/150?u=${item.author_name}`}
                                        name={item.author_name}
                                        role={item.author_role ?? "Customer"}
                                        rating={item.rating}
                                        feedback={item.content}
                                    />
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
                        aria-label={`Go to page ${index + 1}`}
                        className={cn(
                            "w-3 h-3 rounded-full transition-colors duration-300 cursor-pointer",
                            currentPage === index ? "bg-[#C42026]" : "bg-[#DDDDDD]"
                        )}
                    />
                ))}
            </div>
        </section>
    );
}
