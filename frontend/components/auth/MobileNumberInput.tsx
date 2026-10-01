"use client";

import React, { forwardRef } from "react";
import { useTranslation } from "@/hooks/useTranslation";

export interface MobileNumberInputProps {
  id?: string;
  name?: string;
  value: string;
  onChange: (value: string) => void;
  label?: string;
  error?: string;
  placeholder?: string;
  disabled?: boolean;
}

const MobileNumberInput = forwardRef<HTMLInputElement, MobileNumberInputProps>(
  (
    {
      id = "mobile",
      name = "mobile",
      value,
      onChange,
      label,
      error,
      placeholder,
      disabled = false,
    },
    ref
  ) => {
    const { t } = useTranslation();
    const effectiveLabel = label !== undefined ? label : t("login.mobileLabel");
    const effectivePlaceholder = placeholder !== undefined ? placeholder : t("login.mobilePlaceholder");

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value.replace(/\D/g, "");
      if (raw.length <= 10) {
        onChange(raw);
      }
    };

    return (
      <div className="w-full">
        {effectiveLabel && (
          <label
            htmlFor={id}
            className="mb-1.5 block text-xs font-semibold text-[#174D25] sm:text-sm"
          >
            {effectiveLabel}
          </label>
        )}

        <div
          className={`
            flex h-12 w-full overflow-hidden rounded-xl border bg-white
            shadow-sm transition
            ${
              error
                ? "border-red-400 focus-within:border-red-500 focus-within:ring-2 focus-within:ring-red-200"
                : "border-gray-300 focus-within:border-[#24833A] focus-within:ring-2 focus-within:ring-[#24833A]/20"
            }
            ${disabled ? "bg-gray-100 opacity-70" : ""}
          `}
        >
          {/* Country Code Prefix */}
          <div className="flex items-center border-r border-gray-300 bg-gray-50 px-3 text-xs font-semibold text-gray-700 sm:text-sm">
            +91
          </div>

          {/* Number Input */}
          <input
            id={id}
            name={name}
            ref={ref}
            type="tel"
            inputMode="numeric"
            autoComplete="tel"
            maxLength={10}
            disabled={disabled}
            value={value}
            onChange={handleInputChange}
            placeholder={placeholder}
            className="
              min-w-0 flex-1 bg-white px-3 text-sm text-gray-900 outline-none
              caret-[#24833A] placeholder:text-gray-400
            "
          />
        </div>

        <div className="mt-1 flex items-center justify-between">
          {error ? (
            <p className="text-xs text-red-600 font-medium">{error}</p>
          ) : (
            <span />
          )}
          <span className="text-[11px] text-gray-400">
            {t("common.digitsCount", { count: value.length })}
          </span>
        </div>
      </div>
    );
  }
);

MobileNumberInput.displayName = "MobileNumberInput";

export default MobileNumberInput;
