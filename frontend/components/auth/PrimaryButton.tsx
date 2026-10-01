"use client";

import React, { ButtonHTMLAttributes, ReactNode } from "react";
import { Loader2 } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";

interface PrimaryButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  isLoading?: boolean;
  loadingText?: string;
  variant?: "solid" | "outline";
}

export default function PrimaryButton({
  children,
  isLoading = false,
  loadingText,
  disabled,
  className = "",
  type = "submit",
  variant = "solid",
  ...props
}: PrimaryButtonProps) {
  const { t } = useTranslation();
  const effectiveLoadingText = loadingText || t("common.loading");
  const isButtonDisabled = disabled || isLoading;

  if (variant === "outline") {
    return (
      <button
        type={type}
        disabled={isButtonDisabled}
        className={`
          flex h-11 w-full items-center justify-center
          rounded-xl border border-[#24833A] bg-transparent
          px-4 text-sm font-semibold text-[#24833A]
          transition duration-150
          hover:bg-[#EAF4E5] active:scale-[0.99]
          disabled:cursor-not-allowed disabled:opacity-50
          ${className}
        `}
        {...props}
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin text-[#24833A]" />
            <span>{effectiveLoadingText}</span>
          </span>
        ) : (
          children
        )}
      </button>
    );
  }

  return (
    <button
      type={type}
      disabled={isButtonDisabled}
      className={`
        flex h-12 w-full items-center justify-center
        rounded-xl bg-[#24833A] px-4 text-sm font-semibold
        text-white shadow-sm transition duration-150
        hover:bg-[#1D7031] active:scale-[0.99]
        disabled:cursor-not-allowed disabled:opacity-50
        ${className}
      `}
      {...props}
    >
      {isLoading ? (
        <span className="flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin text-white" />
          <span>{effectiveLoadingText}</span>
        </span>
      ) : (
        children
      )}
    </button>
  );
}
