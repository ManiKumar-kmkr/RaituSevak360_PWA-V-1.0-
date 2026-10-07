"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";

export interface BackButtonProps {
  href?: string;
  onClick?: () => void;
  label?: string;
  className?: string;
  id?: string;
  "aria-label"?: string;
}

export const BackButton: React.FC<BackButtonProps> = ({
  href,
  onClick,
  label,
  className = "",
  id,
  "aria-label": ariaLabel,
}) => {
  const router = useRouter();
  const { t } = useTranslation();

  const displayLabel = label ?? t("common.backToDashboard");
  const effectiveAriaLabel = ariaLabel ?? displayLabel;

  const standardClasses = `inline-flex items-center gap-1.5 py-1 text-xs font-bold text-[#5F6F64] transition hover:text-[#174D25] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#24833A]/40 rounded-sm cursor-pointer select-none ${className}`;

  if (href) {
    return (
      <Link
        id={id}
        href={href}
        className={standardClasses}
        aria-label={effectiveAriaLabel}
      >
        <ArrowLeft size={16} className="shrink-0" />
        <span>{displayLabel}</span>
      </Link>
    );
  }

  const handleClick =
    onClick ??
    (() => {
      if (typeof window !== "undefined" && window.history.length > 1) {
        router.back();
      } else {
        router.push("/dashboard");
      }
    });

  return (
    <button
      id={id}
      type="button"
      onClick={handleClick}
      className={standardClasses}
      aria-label={effectiveAriaLabel}
    >
      <ArrowLeft size={16} className="shrink-0" />
      <span>{displayLabel}</span>
    </button>
  );
};

export default BackButton;
