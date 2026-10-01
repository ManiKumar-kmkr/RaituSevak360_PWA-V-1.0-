"use client";

import React, { useRef, useEffect, KeyboardEvent, ClipboardEvent } from "react";

interface OTPInputProps {
  length?: number;
  value: string;
  onChange: (otp: string) => void;
  disabled?: boolean;
  hasError?: boolean;
  autoFocus?: boolean;
}

export default function OTPInput({
  length = 6,
  value,
  onChange,
  disabled = false,
  hasError = false,
  autoFocus = true,
}: OTPInputProps) {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Split value into array of single characters
  const digits = Array.from({ length }, (_, i) => value[i] || "");

  useEffect(() => {
    if (autoFocus && inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, [autoFocus]);

  const handleChange = (index: number, char: string) => {
    const numericChar = char.replace(/\D/g, "");
    if (!numericChar) return;

    const newDigits = [...digits];
    // Take the last character typed
    newDigits[index] = numericChar[numericChar.length - 1];
    const newOtp = newDigits.join("");
    onChange(newOtp);

    // Auto-advance to next input
    if (index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      const newDigits = [...digits];
      if (newDigits[index]) {
        // Clear current box
        newDigits[index] = "";
        onChange(newDigits.join(""));
      } else if (index > 0) {
        // Move to previous box and clear
        newDigits[index - 1] = "";
        onChange(newDigits.join(""));
        inputRefs.current[index - 1]?.focus();
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      e.preventDefault();
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < length - 1) {
      e.preventDefault();
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, length);
    if (!pastedData) return;

    onChange(pastedData);
    const targetFocusIndex = Math.min(pastedData.length, length - 1);
    inputRefs.current[targetFocusIndex]?.focus();
  };

  return (
    <div className="flex w-full items-center justify-between gap-2 sm:gap-3">
      {digits.map((digit, idx) => {
        const isFilled = digit.length > 0;
        return (
          <input
            key={idx}
            ref={(el) => {
              inputRefs.current[idx] = el;
            }}
            type="text"
            inputMode="numeric"
            pattern="\d*"
            maxLength={1}
            disabled={disabled}
            value={digit}
            onChange={(e) => handleChange(idx, e.target.value)}
            onKeyDown={(e) => handleKeyDown(idx, e)}
            onPaste={handlePaste}
            onFocus={(e) => e.target.select()}
            aria-label={`Digit ${idx + 1} of OTP`}
            className={`
              h-13 w-12 sm:h-14 sm:w-13 rounded-xl border bg-white
              text-center text-xl font-bold text-gray-900 shadow-sm
              outline-none transition duration-150
              ${
                hasError
                  ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-200"
                  : isFilled
                  ? "border-[#24833A] bg-[#F4FBF5] text-[#174D25]"
                  : "border-gray-300 focus:border-[#24833A] focus:ring-2 focus:ring-[#24833A]/20"
              }
              ${disabled ? "cursor-not-allowed bg-gray-100 opacity-60" : ""}
            `}
          />
        );
      })}
    </div>
  );
}
