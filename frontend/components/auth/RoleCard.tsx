"use client";

import React, { ReactNode } from "react";
import { UserRole } from "../../types";

interface RoleCardProps {
  id: UserRole;
  title: string;
  nativeTitle: string;
  description: string;
  icon: ReactNode;
  isSelected: boolean;
  onSelect: (id: UserRole) => void;
}

export default function RoleCard({
  id,
  title,
  nativeTitle,
  description,
  icon,
  isSelected,
  onSelect,
}: RoleCardProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(id)}
      className={`
        relative flex w-full items-start gap-3.5 rounded-2xl p-4 text-left
        transition duration-150 shadow-sm outline-none active:scale-[0.99]
        ${
          isSelected
            ? "border-2 border-[#24833A] bg-[#F4FBF5] ring-2 ring-[#24833A]/10"
            : "border border-gray-200 bg-white hover:border-[#24833A]/40"
        }
      `}
      aria-pressed={isSelected}
    >
      {/* Icon Badge */}
      <div
        className={`
          flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition
          ${
            isSelected
              ? "bg-[#E4F0DD] text-[#24833A]"
              : "bg-gray-100 text-gray-600"
          }
        `}
      >
        {icon}
      </div>

      {/* Role Title and Description */}
      <div className="flex-1 pr-6">
        <h3 className="text-sm font-bold text-gray-900 sm:text-base">
          {title}
        </h3>
        <p className="mt-1 text-xs leading-snug text-gray-500">
          {description}
        </p>
      </div>

      {/* Radio Indicator */}
      <div className="absolute right-4 top-4">
        <div
          className={`
            flex h-5 w-5 items-center justify-center rounded-full border-2 transition
            ${
              isSelected
                ? "border-[#24833A] bg-white"
                : "border-gray-300 bg-white"
            }
          `}
        >
          {isSelected && (
            <div className="h-2.5 w-2.5 rounded-full bg-[#24833A]" />
          )}
        </div>
      </div>
    </button>
  );
}
