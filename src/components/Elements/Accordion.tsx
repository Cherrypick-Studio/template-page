"use client";

import { useState } from "react";
import { IoChevronDown } from "react-icons/io5";
import { cn } from "../../../lib/utils";

interface IPropsAccordionItem {
    question: string;
    answer: string;
}

interface IPropsAccordion {
    items: IPropsAccordionItem[];
}

export default function Accordion({ items }: IPropsAccordion) {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const toggle = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div className="flex flex-col w-full">
            {items.map((item, index) => (
                <div
                    key={index}
                    className="border-b border-[#EBEBEB]"
                >
                    <button
                        onClick={() => toggle(index)}
                        className="flex items-center justify-between w-full py-5 text-left cursor-pointer"
                    >
                        <span className="text-lg font-medium text-[#1A1A1A]">{item.question}</span>
                        <IoChevronDown
                            size={20}
                            className={cn(
                                "text-[#666666] transition-transform duration-300 shrink-0 ml-4",
                                { "rotate-180": openIndex === index }
                            )}
                        />
                    </button>
                    <div
                        className={cn(
                            "overflow-hidden transition-all duration-300",
                            openIndex === index ? "max-h-96 pb-5" : "max-h-0"
                        )}
                    >
                        <p className="text-base text-[#666666] leading-relaxed">{item.answer}</p>
                    </div>
                </div>
            ))}
        </div>
    );
}
