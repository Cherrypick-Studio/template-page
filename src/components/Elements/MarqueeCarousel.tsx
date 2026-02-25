"use client";

import { ReactNode, CSSProperties } from "react";
import { cn } from "../../../lib/utils";

type MarqueeDirection = "up" | "down";

interface IPropsMarqueeCarousel {
    children: ReactNode;
    /** Scroll direction */
    direction?: MarqueeDirection;
    /** Animation duration in seconds (lower = faster) */
    speed?: number;
    /** Gap between items in pixels */
    gap?: number;
    /** Pause animation on hover */
    pauseOnHover?: boolean;
    /** Additional class for the outer container */
    className?: string;
}

export default function MarqueeCarousel({
    children,
    direction = "up",
    speed = 20,
    gap = 12,
    pauseOnHover = false,
    className,
}: IPropsMarqueeCarousel) {
    const animationDirection = direction === "up" ? "normal" : "reverse";

    const trackStyle: CSSProperties = {
        "--marquee-speed": `${speed}s`,
        "--marquee-direction": animationDirection,
        "--marquee-gap": `${gap}px`,
    } as CSSProperties;

    return (
        <div
            className={cn(
                "overflow-hidden",
                pauseOnHover && "group",
                className,
            )}
        >
            <div
                className="flex flex-col animate-[marquee-vertical_var(--marquee-speed)_linear_infinite_var(--marquee-direction)] group-hover:[animation-play-state:paused]"
                style={{
                    ...trackStyle,
                    gap: `${gap}px`,
                }}
            >
                <div className="flex flex-col" style={{ gap: `${gap}px` }}>
                    {children}
                </div>
                <div className="flex flex-col" style={{ gap: `${gap}px` }} aria-hidden>
                    {children}
                </div>
            </div>
        </div>
    );
}
