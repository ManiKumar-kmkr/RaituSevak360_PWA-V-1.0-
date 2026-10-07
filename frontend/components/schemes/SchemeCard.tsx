"use client";

import React from "react";
import {
  Landmark,
  Calendar,
  CheckCircle2,
  Clock,
  ChevronRight,
  Sparkles,
  ShieldCheck,
  Building,
} from "lucide-react";
import { GovernmentScheme } from "@/types/government-scheme";
import { useTranslation } from "@/hooks/useTranslation";

interface SchemeCardProps {
  scheme: GovernmentScheme;
  onViewDetails: (scheme: GovernmentScheme) => void;
}

export default function SchemeCard({ scheme, onViewDetails }: SchemeCardProps) {
  const { t } = useTranslation();

  const isCentral = scheme.governmentLevel === "central";
  const isActive = scheme.status === "active";

  return (
    <div
      className="flex flex-col justify-between rounded-3xl border border-gray-200 bg-white p-5 shadow-2xs transition-all duration-200 hover:border-[#24833A]/40 hover:shadow-xs"
      data-testid={`scheme-card-${scheme.id}`}
    >
      <div>
        {/* Top Ministry & Badges Row */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 pb-3">
          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                isCentral
                  ? "bg-blue-50 text-blue-700 border border-blue-200"
                  : "bg-emerald-50 text-[#174D25] border border-emerald-200"
              }`}
            >
              {isCentral ? <Building size={11} /> : <Landmark size={11} />}
              <span>
                {isCentral
                  ? t("schemes.centralScheme") || "Central Scheme"
                  : scheme.stateName
                  ? `${scheme.stateName} State`
                  : t("schemes.stateScheme") || "State Scheme"}
              </span>
            </span>

            <span
              className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                isActive
                  ? "bg-emerald-50 text-[#24833A] border border-emerald-200"
                  : "bg-amber-50 text-amber-800 border border-amber-200"
              }`}
            >
              {isActive ? (
                <>
                  <span className="h-1.5 w-1.5 rounded-full bg-[#24833A] animate-pulse" />
                  <span>{t("schemes.activeScheme") || "Active Scheme"}</span>
                </>
              ) : (
                <>
                  <Clock size={10} />
                  <span>{t("schemes.upcomingScheme") || "Upcoming"}</span>
                </>
              )}
            </span>
          </div>

          {scheme.isPotentiallyEligible && (
            <span
              className="inline-flex items-center gap-1 rounded-full bg-[#E4F0DD] px-2.5 py-0.5 text-[10px] font-bold text-[#174D25] border border-[#24833A]/20"
              title="Informational helper indication based on local profile data"
            >
              <Sparkles size={11} className="text-[#24833A]" />
              <span>{t("schemes.potentiallyEligible") || "Potentially eligible"}</span>
            </span>
          )}
        </div>

        {/* Ministry Sub-header */}
        <p className="mt-2.5 text-[11px] font-semibold text-gray-500 uppercase tracking-wider line-clamp-1">
          {scheme.ministry}
        </p>

        {/* Scheme Name */}
        <h2 className="mt-1 text-base sm:text-lg font-bold text-gray-900 leading-snug hover:text-[#174D25] transition cursor-pointer"
          onClick={() => onViewDetails(scheme)}
        >
          {scheme.name}
        </h2>

        {/* Short Description */}
        <p className="mt-1.5 text-xs text-gray-600 line-clamp-2 leading-relaxed">
          {scheme.shortDescription}
        </p>

        {/* Verified Financial Benefit Highlight Box */}
        <div className="mt-3.5 rounded-2xl bg-[#F4F9F2] p-3 border border-[#24833A]/15">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[11px] font-bold text-[#174D25] uppercase tracking-wide">
              {t("schemes.financialBenefit") || "Financial Benefit"}
            </span>
            <span className="text-xs font-black text-[#174D25] bg-white px-2 py-0.5 rounded-lg border border-[#24833A]/20">
              {scheme.benefit.amountOrSubsidy}
            </span>
          </div>
          <p className="mt-1 text-[11px] font-medium text-gray-700 leading-tight">
            {scheme.benefit.headline}
          </p>
        </div>

        {/* Important Date / Deadline Badge */}
        <div className="mt-3 flex items-center gap-1.5 text-[11px] text-gray-500">
          <Calendar size={13} className="text-gray-400 shrink-0" />
          <span className="font-semibold text-gray-700">
            {t("schemes.importantDates") || "Deadline"}:
          </span>
          <span className="truncate">{scheme.importantDates.applicationDeadline}</span>
        </div>
      </div>

      {/* Card Action Footer */}
      <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
        <span className="text-[10px] font-semibold text-gray-400">
          {t("schemes.verifiedSource") || "Verified Official Source"}
        </span>

        <button
          type="button"
          onClick={() => onViewDetails(scheme)}
          className="inline-flex items-center justify-center gap-1 rounded-xl bg-[#E4F0DD] px-3.5 py-1.5 text-xs font-bold text-[#174D25] hover:bg-[#d6e9cd] active:scale-95 transition cursor-pointer shadow-2xs"
          aria-label={`View details for ${scheme.name}`}
        >
          <span>{t("schemes.viewDetails") || "View Details"}</span>
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}
