import React from "react";
import cn from "classnames";
export interface ButtonProps {
    type?: "button" | "reset" | "submit";
    fullWidth?: boolean;
    children?: React.ReactNode;
    onClick?: () => void;
    secondary?: boolean;
    danger?: boolean;
    disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({
    type,
    fullWidth,
    children,
    onClick,
    secondary,
    danger,
    disabled
}) => {
    return (
        <button
            type={type || "button"}
            onClick={onClick}
            disabled={disabled}
            className={cn(
                `flex justify-center rounded-md px-3 py-2 text-sm font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2`,
                disabled && "opacity-50 cursor-default",
                fullWidth && "w-full",
                secondary ? "text-gray-900" : "text-white",
                danger &&
                    "bg-rose-600 hover:bg-rose-400 focus-visible:outline-rose-400",
                !secondary &&
                    !danger &&
                    "bg-blue-600 hover:bg-blue-400 focus-visble:outline-blue-400"
            )}
        >
            {children}
        </button>
    );
};

export default Button;
