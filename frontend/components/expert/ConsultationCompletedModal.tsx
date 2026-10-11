"use client";

import React from "react";
import { CheckCircle2, Star, FileText, ArrowRight, X } from "lucide-react";
import { ConsultationSummary } from "@/types/expert";

interface ConsultationCompletedModalProps {
  summary: ConsultationSummary | null;
  isOpen: boolean;
  onClose: () => void;
  onViewConsultations: () => void;
}

export default function ConsultationCompletedModal({
  summary,
  isOpen,
  onClose,
  onViewConsultations,
}: ConsultationCompletedModalProps) {
  if (!isOpen || !summary) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs animate-in fade-in duration-150 overflow-y-auto"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-2xl animate-in zoom-in-95 duration-150 my-6 text-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Green Success Icon */}
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-[#24833A] mb-3.5">
          <CheckCircle2 size={38} strokeWidth={2.4} />
        </div>

        <span className="rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-bold text-[#174D25] border border-emerald-200">
          Case Resolved
        </span>

        <h2 className="text-lg sm:text-xl font-extrabold text-gray-900 mt-2">
          Consultation Completed!
        </h2>
        <p className="mt-1 text-xs text-gray-500 leading-relaxed max-w-xs mx-auto">
          Advisory summary and recommended treatment delivered to <strong>{summary.farmerName}</strong>.
        </p>

        {/* Diagnostic Snapshot Card */}
        <div className="mt-4 rounded-2xl border border-gray-100 bg-[#F7F9F6] p-4 text-left text-xs flex flex-col gap-2">
          <div className="flex items-center justify-between pb-1.5 border-b border-gray-200/60">
            <span className="text-gray-500 font-medium">Farmer</span>
            <span className="font-bold text-gray-900">{summary.farmerName}</span>
          </div>

          <div className="flex items-center justify-between pb-1.5 border-b border-gray-200/60">
            <span className="text-gray-500 font-medium">Issue</span>
            <span className="font-semibold text-gray-800">{summary.issueDiagnosed}</span>
          </div>

          <div className="flex items-center justify-between pb-1.5 border-b border-gray-200/60">
            <span className="text-gray-500 font-medium">Treatment & Control</span>
            <span className="font-bold text-[#174D25]">
              {summary.recommendations.length} Recommendations Sent
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-gray-500 font-medium">Cultivator Rating</span>
            <div className="flex items-center gap-1 text-amber-500 font-bold">
              <Star size={13} className="fill-amber-400 text-amber-400" />
              <span>5.0 (Satisfied)</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 grid grid-cols-2 gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-gray-200 py-2.5 px-3 text-xs font-bold text-gray-700 hover:bg-gray-50 active:scale-95 cursor-pointer"
          >
            Close
          </button>

          <button
            type="button"
            onClick={onViewConsultations}
            className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#24833A] py-2.5 px-3 text-xs font-bold text-white shadow-xs hover:bg-[#1e6e30] active:scale-95 cursor-pointer"
          >
            <span>My Consultations</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
