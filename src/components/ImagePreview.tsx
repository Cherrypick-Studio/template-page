"use client"

import Image from "next/image";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";
import {
    Dialog,
    DialogContent,
    DialogTitle,
} from "@/components/ui/dialog";

interface IPropsImagePreview {
    images: { src: string; alt: string }[]
    activeIndex: number
    onActiveIndexChange: (index: number) => void
    open: boolean
    onOpenChange: (open: boolean) => void
}

export default function ImagePreview({ images, activeIndex, onActiveIndexChange, open, onOpenChange }: IPropsImagePreview) {
    const current = images[activeIndex];

    const goPrev = () => {
        onActiveIndexChange(activeIndex === 0 ? images.length - 1 : activeIndex - 1);
    };

    const goNext = () => {
        onActiveIndexChange(activeIndex === images.length - 1 ? 0 : activeIndex + 1);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-5xl p-4 bg-white gap-4">
                <DialogTitle className="sr-only">{current.alt}</DialogTitle>

                {/* Main preview image with navigation */}
                <div className="relative flex items-center justify-center">
                    {images.length > 1 && (
                        <button
                            onClick={goPrev}
                            className="absolute left-2 z-10 flex items-center justify-center w-10 h-10 rounded-full bg-white/80 hover:bg-white border border-[#DDDDDD] shadow-sm transition-colors"
                        >
                            <IoChevronBack size={20} />
                        </button>
                    )}
                    <Image
                        src={current.src}
                        alt={current.alt}
                        width={1200}
                        height={800}
                        className="w-full h-auto rounded-lg object-contain max-h-[70vh]"
                    />
                    {images.length > 1 && (
                        <button
                            onClick={goNext}
                            className="absolute right-2 z-10 flex items-center justify-center w-10 h-10 rounded-full bg-white/80 hover:bg-white border border-[#DDDDDD] shadow-sm transition-colors"
                        >
                            <IoChevronForward size={20} />
                        </button>
                    )}
                </div>

                {/* Thumbnail strip */}
                {images.length > 1 && (
                    <div className="flex gap-2 overflow-x-auto pb-1 justify-center">
                        {images.map((img, index) => (
                            <button
                                key={index}
                                onClick={() => onActiveIndexChange(index)}
                                className={`shrink-0 rounded-lg overflow-hidden border-2 transition-all ${index === activeIndex
                                    ? "border-[#007FFF] opacity-100"
                                    : "border-transparent opacity-60 hover:opacity-100"
                                    }`}
                            >
                                <Image
                                    src={img.src}
                                    alt={img.alt}
                                    width={80}
                                    height={56}
                                    className="w-16 h-12 object-cover"
                                />
                            </button>
                        ))}
                    </div>
                )}
            </DialogContent>
        </Dialog>
    )
}
