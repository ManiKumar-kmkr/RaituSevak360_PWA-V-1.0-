"use client";

import React from "react";
import { AlertCircle, X } from "lucide-react";

interface ErrorMessageProps {
  message?: string | null;
  onDismiss?: () => void;
}

export default function ErrorMessage({ message, onDismiss }: ErrorMessageProps) {
  if (!message) return null;

  return (
    <div
      role="alert"
      className="mb-4 flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-800 animate-fadeIn"
    >
      <AlertCircle className="h-4 w-4 shrink-0 text-red-600 mt-0.5" />
      <div className="flex-1 font-medium">{message}</div>
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          className="text-red-500 hover:text-red-700"
          aria-label="Dismiss error"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
}
