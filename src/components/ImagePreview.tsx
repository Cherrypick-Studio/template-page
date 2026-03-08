"use client"

import Image from "next/image";
import {
    Dialog,
    DialogContent,
    DialogTitle,
} from "@/components/ui/dialog";

interface IPropsImagePreview {
    src: string
    alt: string
    open: boolean
    onOpenChange: (open: boolean) => void
}

export default function ImagePreview({ src, alt, open, onOpenChange }: IPropsImagePreview) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl p-2 bg-white">
                <DialogTitle className="sr-only">{alt}</DialogTitle>
                <Image
                    src={src}
                    alt={alt}
                    width={1200}
                    height={800}
                    className="w-full h-auto rounded-lg object-contain"
                />
            </DialogContent>
        </Dialog>
    )
}
