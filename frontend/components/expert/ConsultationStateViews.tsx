"use client";

import React from "react";
import { AlertCircle, RefreshCw, GraduationCap, Video, ArrowLeft } from "lucide-react";

interface ConsultationLoadingViewProps {
  message?: string;
}

export function ConsultationLoadingView({
  message = "Connecting to Agronomy Room & Securing Media Pipeline...",
}: ConsultationLoadingViewProps) {
  return (
    <div className="flex min-h-[360px] flex-col items-center justify-center rounded-3xl border border-gray-200 bg-white p-8 sm:p-12 text-center shadow-2xs">
      <div className="relative mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#E4F0DD] text-[#24833A] shadow-xs">
        <GraduationCap size={32} strokeWidth={2.4} />
        <span className="absolute -inset-1 rounded-2xl border-2 border-[#24833A]/40 animate-ping" />
      </div>

      <div className="h-8 w-8 animate-spin rounded-full border-3 border-[#24833A] border-t-transparent mb-3" />

      <h3 className="text-sm sm:text-base font-bold text-gray-900">
        Preparing Consultation Session
      </h3>
      <p className="mt-1 max-w-sm text-xs text-gray-500 leading-relaxed">
        {message}
      </p>
    </div>
  );
}

interface ConsultationErrorViewProps {
  errorMessage?: string;
  onRetry: () => void;
  onBack: () => void;
}

export function ConsultationErrorView({
  errorMessage = "Could not establish secure media connection with the farmer's field session.",
  onRetry,
  onBack,
}: ConsultationErrorViewProps) {
  return (
    <div className="flex min-h-[360px] flex-col items-center justify-center rounded-3xl border border-rose-200 bg-white p-8 sm:p-12 text-center shadow-2xs">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 border border-rose-200 shadow-xs">
        <AlertCircle size={32} strokeWidth={2.4} />
      </div>

      <span className="rounded-full bg-rose-50 px-3 py-1 text-[11px] font-bold text-rose-700 border border-rose-200">
        Connection Error
      </span>

      <h3 className="text-base sm:text-lg font-bold text-gray-900 mt-2">
        Unable to Connect to Room
      </h3>
      <p className="mt-1 max-w-sm text-xs text-gray-500 leading-relaxed">
        {errorMessage} Please verify network stability and try reconnecting.
      </p>

      <div className="mt-6 flex items-center justify-center gap-3">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 px-4 py-2.5 text-xs font-bold text-gray-700 hover:bg-gray-50 active:scale-95 cursor-pointer"
        >
          <ArrowLeft size={14} />
          <span>Back to Hub</span>
        </button>

        <button
          type="button"
          onClick={onRetry}
          className="inline-flex items-center gap-1.5 rounded-xl bg-[#24833A] px-5 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-[#1e6e30] active:scale-95 cursor-pointer"
        >
          <RefreshCw size={14} />
          <span>Retry Connection</span>
        </button>
      </div>
    </div>
  );
}
