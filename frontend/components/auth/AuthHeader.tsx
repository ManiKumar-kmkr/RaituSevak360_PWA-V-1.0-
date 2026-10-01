"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Sprout } from "lucide-react";
import Link from "next/link";

interface AuthHeaderProps {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  backHref?: string;
  onBack?: () => void;
  showBrand?: boolean;
  brandText?: string;
}

export default function AuthHeader({
  title,
  subtitle,
  showBack = true,
  backHref,
  onBack,
  showBrand = false,
  brandText = "RaituSevak360",
}: AuthHeaderProps) {
  const router = useRouter();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else if (backHref) {
      router.push(backHref);
    } else {
      router.back();
    }
  };

  return (
    <div className="mb-6 w-full">
      {/* Top bar with back navigation and optional brand */}
      <div className="mb-3 flex items-center justify-between">
        {showBack ? (
          backHref ? (
            <Link
              href={backHref}
              className="flex h-10 w-10 items-center justify-center rounded-full text-[#174D25] transition hover:bg-[#E4F0DD] active:scale-95"
              aria-label="Go back"
            >
              <ArrowLeft size={22} strokeWidth={2.2} />
            </Link>
          ) : (
            <button
              type="button"
              onClick={handleBack}
              className="flex h-10 w-10 items-center justify-center rounded-full text-[#174D25] transition hover:bg-[#E4F0DD] active:scale-95"
              aria-label="Go back"
            >
              <ArrowLeft size={22} strokeWidth={2.2} />
            </button>
          )
        ) : (
          <div className="h-10 w-10" />
        )}

        {showBrand && (
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#E4F0DD]">
              <Sprout size={18} strokeWidth={2.2} className="text-[#24833A]" />
            </div>
            <span className="text-sm font-bold tracking-tight text-[#24833A]">
              {brandText}
            </span>
          </div>
        )}
      </div>

      {/* Main Title and Regional Subtitle */}
      <div>
        <h1 className="text-xl font-bold tracking-tight text-[#174D25] sm:text-2xl">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-1 text-xs text-gray-500 font-medium sm:text-sm">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}
