"use client";

import React, { useState, forwardRef } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";

export interface PasswordInputProps {
  id?: string;
  name?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label?: string;
  error?: string;
  placeholder?: string;
  autoComplete?: string;
  disabled?: boolean;
}

const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  (
    {
      id = "password",
      name = "password",
      value,
      onChange,
      label,
      error,
      placeholder,
      autoComplete = "current-password",
      disabled = false,
    },
    ref
  ) => {
    const { t } = useTranslation();
    const effectiveLabel = label !== undefined ? label : t("login.passwordLabel");
    const effectivePlaceholder = placeholder !== undefined ? placeholder : t("login.passwordPlaceholder");
    const [showPassword, setShowPassword] = useState(false);

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
            flex h-12 w-full items-center rounded-xl border bg-white px-3.5
            shadow-sm transition
            ${
              error
                ? "border-red-400 focus-within:border-red-500 focus-within:ring-2 focus-within:ring-red-200"
                : "border-gray-300 focus-within:border-[#24833A] focus-within:ring-2 focus-within:ring-[#24833A]/20"
            }
            ${disabled ? "bg-gray-100 opacity-70" : ""}
          `}
        >
          <input
            id={id}
            name={name}
            ref={ref}
            type={showPassword ? "text" : "password"}
            autoComplete={autoComplete}
            disabled={disabled}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className="
              min-w-0 flex-1 bg-white text-sm text-gray-900 outline-none
              caret-[#24833A] placeholder:text-gray-400
            "
          />

          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="
              ml-2 flex h-8 w-8 shrink-0 items-center justify-center
              rounded-lg text-gray-400 transition hover:bg-gray-100 hover:text-[#24833A]
            "
            aria-label={showPassword ? "Hide password" : "Show password"}
            tabIndex={-1}
          >
            {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
          </button>
        </div>

        {error && (
          <p className="mt-1 text-xs text-red-600 font-medium">{error}</p>
        )}
      </div>
    );
  }
);

PasswordInput.displayName = "PasswordInput";

export default PasswordInput;
