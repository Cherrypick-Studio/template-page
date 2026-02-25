import { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "outline";
type ButtonSize = "sm" | "md" | "lg";

interface IPropsButton extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    size?: ButtonSize;
    children: ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
    primary: "bg-[#1A1A1A] text-white",
    outline: "bg-[#FEFEFE] border border-[#999999] text-[#1A1A1A]",
};

const sizeStyles: Record<ButtonSize, string> = {
    sm: "px-4 py-1.5 text-sm",
    md: "px-5 py-2 text-base",
    lg: "px-6 py-2.5 text-base",
};

export default function Button({
    variant = "primary",
    size = "lg",
    children,
    className = "",
    ...props
}: IPropsButton) {
    return (
        <button
            className={`flex items-center gap-2 rounded-full font-medium cursor-pointer ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
}
