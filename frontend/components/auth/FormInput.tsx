"use client";

import React, { InputHTMLAttributes, forwardRef } from "react";

export interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  ({ label, error, helperText, id, className = "", ...props }, ref) => {
    const inputId = id || props.name;

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="mb-1.5 block text-xs font-semibold text-[#174D25] sm:text-sm"
          >
            {label}
          </label>
        )}

        <div className="relative">
          <input
            id={inputId}
            ref={ref}
            className={`
              h-12 w-full rounded-xl border bg-white px-3.5 text-sm
              text-gray-900 outline-none transition
              caret-[#24833A] placeholder:text-gray-400
              ${
                error
                  ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-200"
                  : "border-gray-300 focus:border-[#24833A] focus:ring-2 focus:ring-[#24833A]/20"
              }
              ${className}
            `}
            {...props}
          />
        </div>

        {error ? (
          <p className="mt-1 text-xs text-red-600 font-medium">{error}</p>
        ) : helperText ? (
          <p className="mt-1 text-xs text-gray-400">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

FormInput.displayName = "FormInput";

export default FormInput;
