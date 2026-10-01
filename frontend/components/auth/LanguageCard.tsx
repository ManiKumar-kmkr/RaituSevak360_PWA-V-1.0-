"use client";

import React from "react";
import { Check } from "lucide-react";

interface LanguageCardProps {
  code: string;
  nativeName: string;
  englishLabel: string;
  isSelected: boolean;
  onSelect: (code: string) => void;
}

export default function LanguageCard({
  code,
  nativeName,
  englishLabel,
  isSelected,
  onSelect,
}: LanguageCardProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(code)}
      className={`
        relative flex flex-col items-center justify-center
        rounded-2xl p-4 text-center transition duration-150
        shadow-sm outline-none active:scale-[0.98]
        ${
          isSelected
            ? "border-2 border-[#24833A] bg-[#F4FBF5] text-[#174D25] ring-2 ring-[#24833A]/10"
            : "border border-gray-200 bg-white text-gray-800 hover:border-[#24833A]/40"
        }
      `}
      aria-pressed={isSelected}
    >
      {/* Top right radio / check indicator */}
      <div className="absolute right-3 top-3">
        <div
          className={`
            flex h-5 w-5 items-center justify-center rounded-full transition
            ${
              isSelected
                ? "bg-[#24833A] text-white"
                : "border border-gray-300 bg-white"
            }
          `}
        >
          {isSelected && <Check size={12} strokeWidth={3} />}
        </div>
      </div>

      {/* Language Native Name */}
      <span className="text-base font-bold sm:text-lg tracking-tight">
        {nativeName}
      </span>

      {/* English Label Subtext */}
      <span
        className={`mt-1 text-xs font-medium ${
          isSelected ? "text-[#24833A]" : "text-gray-400"
        }`}
      >
        {englishLabel}
      </span>
    </button>
  );
}
