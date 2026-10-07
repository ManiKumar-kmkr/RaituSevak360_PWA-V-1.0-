"use client";

import React, { forwardRef } from "react";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "danger"
  | "ghost";

export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  isLoading?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-[#24833A] text-white hover:bg-[#1e6e30] border border-transparent shadow-xs",
  secondary:
    "border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 shadow-2xs",
  outline:
    "border border-gray-200 bg-white text-[#174D25] hover:bg-[#E4F0DD] hover:border-[#24833A] shadow-2xs",
  danger:
    "bg-rose-600 text-white hover:bg-rose-700 border border-transparent shadow-xs",
  ghost:
    "bg-transparent text-gray-700 hover:bg-gray-100 border border-transparent",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "h-9 px-3 rounded-lg text-xs font-bold gap-1.5",
  md: "h-11 px-4 rounded-xl text-xs font-bold gap-2",
  lg: "h-12 px-5 rounded-xl text-sm font-bold gap-2.5",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = "primary",
      size = "md",
      fullWidth = false,
      leftIcon,
      rightIcon,
      isLoading = false,
      disabled = false,
      type = "button",
      className = "",
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || isLoading;

    return (
      <button
        ref={ref}
        type={type}
        disabled={isDisabled}
        className={`
          inline-flex items-center justify-center transition-all duration-150 select-none
          cursor-pointer
          disabled:cursor-not-allowed disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100
          active:scale-[0.98]
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#24833A]/40 focus-visible:ring-offset-1
          ${variantStyles[variant]}
          ${sizeStyles[size]}
          ${fullWidth ? "w-full" : ""}
          ${className}
        `.trim().replace(/\s+/g, " ")}
        {...props}
      >
        {isLoading && (
          <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent shrink-0" />
        )}
        {!isLoading && leftIcon && (
          <span className="inline-flex shrink-0 items-center justify-center">
            {leftIcon}
          </span>
        )}
        {children}
        {!isLoading && rightIcon && (
          <span className="inline-flex shrink-0 items-center justify-center">
            {rightIcon}
          </span>
        )}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;
