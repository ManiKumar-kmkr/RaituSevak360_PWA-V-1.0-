"use client";

import React from "react";
import {
  X,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  FileCheck,
  ExternalLink,
  Info,
} from "lucide-react";
import { GovernmentScheme, SchemeEligibilityEvaluation } from "@/types/government-scheme";
import { useTranslation } from "@/hooks/useTranslation";

interface EligibilityHelperModalProps {
  scheme: GovernmentScheme;
  evaluation: SchemeEligibilityEvaluation | null;
  isOpen: boolean;
  onClose: () => void;
  onApplyExternal: () => void;
}

export default function EligibilityHelperModal({
  scheme,
  evaluation,
  isOpen,
  onClose,
  onApplyExternal,
}: EligibilityHelperModalProps) {
  const { t } = useTranslation();

  if (!isOpen || !evaluation) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-in fade-in duration-150 overflow-y-auto"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="eligibility-modal-title"
    >
      <div
        className="w-full max-w-lg rounded-3xl border border-gray-200 bg-white p-6 shadow-2xl animate-in zoom-in-95 duration-150 my-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-gray-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#E4F0DD] text-[#24833A] shadow-2xs">
              <ShieldCheck size={24} strokeWidth={2.4} />
            </div>
            <div>
              <h2
                id="eligibility-modal-title"
                className="text-base sm:text-lg font-bold text-gray-900"
              >
                {t("schemes.eligibilityModalTitle") || "Profile Eligibility Check"}
              </h2>
              <p className="text-xs text-gray-500 font-medium">
                {scheme.shortName || scheme.name}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition cursor-pointer"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Evaluation Summary Banner */}
        <div className="mt-4 rounded-2xl bg-[#F4F9F2] p-4 border border-[#24833A]/20">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-[#E4F0DD] px-2.5 py-0.5 text-xs font-bold text-[#174D25]">
              <CheckCircle2 size={13} className="text-[#24833A]" />
              <span>{t("schemes.potentiallyEligible") || "Potentially eligible"}</span>
            </span>
          </div>
          <p className="mt-2 text-xs font-medium text-gray-800 leading-relaxed">
            {evaluation.summary}
          </p>
        </div>

        {/* Matched Criteria List */}
        <div className="mt-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
            {t("schemes.matchedCriteria") || "Criteria Met in Profile"}
          </h3>
          <ul className="space-y-2">
            {evaluation.matchedCriteria.map((item, idx) => (
              <li
                key={idx}
                className="flex items-start gap-2.5 rounded-xl bg-gray-50 p-2.5 text-xs text-gray-700"
              >
                <CheckCircle2 size={15} className="text-[#24833A] shrink-0 mt-0.5" />
                <span className="leading-snug">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Pending Official Review Criteria */}
        {evaluation.pendingReviewCriteria.length > 0 && (
          <div className="mt-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
              {t("schemes.pendingReview") || "Pending Official Verification"}
            </h3>
            <ul className="space-y-2">
              {evaluation.pendingReviewCriteria.map((item, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-2.5 rounded-xl bg-amber-50/70 p-2.5 text-xs text-amber-900 border border-amber-200/60"
                >
                  <Info size={15} className="text-amber-700 shrink-0 mt-0.5" />
                  <span className="leading-snug">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Official Non-Government Legal Disclaimer Notice */}
        <div className="mt-5 rounded-2xl bg-gray-50 p-3.5 border border-gray-200 text-[11px] text-gray-600 leading-relaxed">
          <div className="flex items-center gap-1.5 font-bold text-gray-800 mb-1">
            <AlertTriangle size={13} className="text-amber-600 shrink-0" />
            <span>Important Information Notice</span>
          </div>
          <p>{evaluation.disclaimer}</p>
        </div>

        {/* Modal Actions */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-end gap-3 pt-4 border-t border-gray-100">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto rounded-xl border border-gray-300 px-4 py-2.5 text-xs font-bold text-gray-700 hover:bg-gray-100 transition cursor-pointer"
          >
            {t("schemes.close") || "Close"}
          </button>

          <button
            type="button"
            onClick={() => {
              onClose();
              onApplyExternal();
            }}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-[#24833A] px-5 py-2.5 text-xs font-bold text-white hover:bg-[#1e6f31] transition shadow-xs cursor-pointer active:scale-95"
          >
            <span>{t("schemes.applyNow") || "Apply on Official Portal"}</span>
            <ExternalLink size={13} />
          </button>
        </div>
      </div>
    </div>
  );
}
