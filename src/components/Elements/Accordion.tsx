"use client";

import {
    Accordion as ShadcnAccordion,
    AccordionItem,
    AccordionTrigger,
    AccordionContent,
} from "@/components/ui/accordion";

interface IPropsAccordionItem {
    question: string;
    answer: string;
}

interface IPropsAccordion {
    items: IPropsAccordionItem[];
}

export default function Accordion({ items }: IPropsAccordion) {
    return (
        <ShadcnAccordion type="single" collapsible className="w-full">
            {items.map((item, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger>{item.question}</AccordionTrigger>
                    <AccordionContent>{item.answer}</AccordionContent>
                </AccordionItem>
            ))}
        </ShadcnAccordion>
    );
}
