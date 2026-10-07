"use client";

import React, { useState, useEffect } from "react";
import {
  Sprout,
  TrendingUp,
  Coins,
  Scale,
  ArrowRight,
  ArrowLeft,
  X,
  Sparkles,
  Bot,
  Info,
  Calendar,
  Layers,
  Clock,
} from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { CropRecommendationItem } from "@/types/ai";

interface CropRecommendationsProps {
  recommendations: CropRecommendationItem[];
  onModifyProfile: () => void;
  onSwitchToChat: () => void;
}

export default function CropRecommendations({
  recommendations,
  onModifyProfile,
  onSwitchToChat,
}: CropRecommendationsProps) {
  const { t } = useTranslation();

  // Modal states
  const [selectedCropDetails, setSelectedCropDetails] = useState<CropRecommendationItem | null>(
    null
  );
  const [showPlanningModal, setShowPlanningModal] = useState(false);

  // Close modals on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedCropDetails(null);
        setShowPlanningModal(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="w-full flex flex-col gap-6">
      {/* 1. Header & Step Indicator */}
      <div className="rounded-3xl border border-[#DCE7DD] bg-white p-5 sm:p-7 shadow-2xs">
        <div className="flex flex-col gap-2 border-b border-[#DCE7DD] pb-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="inline-flex items-center gap-2">
              <span className="rounded-full bg-[#174D25] px-3 py-1 text-[11px] font-black uppercase tracking-wider text-white">
                {t("aiAdvisor.cropAdvisor.step2Indicator")}
              </span>
              <span className="text-xs font-bold text-[#5F6F64]">
                {t("aiAdvisor.cropAdvisor.step2Secondary")}
              </span>
            </div>

            <button
              id="btn-modify-profile-top"
              type="button"
              onClick={onModifyProfile}
              className="inline-flex items-center gap-1.5 rounded-full border border-[#DCE7DD] bg-[#F7F9F6] px-3.5 py-1 text-xs font-bold text-[#174D25] hover:bg-[#EAF7EE] hover:border-[#24833A] transition cursor-pointer"
            >
              <ArrowLeft size={13} />
              <span>{t("aiAdvisor.cropAdvisor.modifyProfile")}</span>
            </button>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-[#17321F]">
            {t("aiAdvisor.cropAdvisor.step2Heading")}
          </h2>
          <div className="inline-flex items-center gap-2 text-xs text-[#5F6F64] font-medium">
            <Info size={14} className="text-[#24833A] shrink-0" />
            <span>{t("aiAdvisor.cropAdvisor.mockDisclaimer")}</span>
          </div>
        </div>

        {/* 2. Recommendation Cards List */}
        <div className="mt-6 flex flex-col gap-5">
          {recommendations.map((crop) => (
            <div
              key={crop.id}
              className="group relative rounded-2xl border border-[#DCE7DD] bg-[#F7F9F6] p-4 sm:p-6 transition hover:border-[#24833A] hover:bg-white hover:shadow-sm"
            >
              {/* Card Top: Crop Title & Match Score Badge */}
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#EAF7EE] text-[#174D25] border border-[#86EFAC]/70">
                    <Sprout size={22} strokeWidth={2.4} />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-black text-[#17321F]">
                      {t(crop.cropNameKey)}
                    </h3>
                    {crop.cropSubName && (
                      <span className="text-[11px] font-medium italic text-[#5F6F64]">
                        {crop.cropSubName}
                      </span>
                    )}
                  </div>
                </div>

                <div className="inline-flex items-center gap-1 rounded-full bg-[#174D25] px-3.5 py-1 text-xs font-black text-white shadow-xs">
                  <Sparkles size={12} className="text-[#86EFAC]" />
                  <span>{crop.matchPercent}% {t("aiAdvisor.cropAdvisor.matchScore")}</span>
                </div>
              </div>

              {/* Description */}
              <p className="mt-3.5 text-xs text-[#17321F] font-medium leading-relaxed">
                {t(crop.descriptionKey)}
              </p>

              {/* Metrics Grid */}
              <div className="mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-3">
                {/* Metric 1: Expected Yield */}
                <div className="flex items-center gap-2.5 rounded-xl border border-[#DCE7DD] bg-white p-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#EAF7EE] text-[#24833A]">
                    <Scale size={16} />
                  </div>
                  <div>
                    <span className="block text-[10px] font-bold text-[#5F6F64]">
                      {t("aiAdvisor.cropAdvisor.expectedYieldLabel")}
                    </span>
                    <span className="text-xs font-black text-[#17321F]">
                      {crop.expectedYield}
                    </span>
                  </div>
                </div>

                {/* Metric 2: Market Demand */}
                <div className="flex items-center gap-2.5 rounded-xl border border-[#DCE7DD] bg-white p-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#EAF7EE] text-[#24833A]">
                    <TrendingUp size={16} />
                  </div>
                  <div>
                    <span className="block text-[10px] font-bold text-[#5F6F64]">
                      {t("aiAdvisor.cropAdvisor.marketDemandLabel")}
                    </span>
                    <span className="inline-block rounded-md bg-[#DCFCE7] px-1.5 py-0.5 text-xs font-black text-[#166534]">
                      {t(crop.marketDemandKey)}
                    </span>
                  </div>
                </div>

                {/* Metric 3: Est. Net Income */}
                <div className="flex items-center gap-2.5 rounded-xl border border-[#DCE7DD] bg-white p-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#EAF7EE] text-[#24833A]">
                    <Coins size={16} />
                  </div>
                  <div>
                    <span className="block text-[10px] font-bold text-[#5F6F64]">
                      {t("aiAdvisor.cropAdvisor.estNetIncomeLabel")}
                    </span>
                    <span className="text-xs font-black text-[#174D25]">
                      {crop.estNetIncome}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Link: View Soil & Variety Details → */}
              <div className="mt-4 flex items-center justify-end pt-3 border-t border-[#DCE7DD]">
                <button
                  id={`btn-view-details-${crop.id}`}
                  type="button"
                  onClick={() => setSelectedCropDetails(crop)}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#174D25] hover:text-[#24833A] transition cursor-pointer"
                >
                  <span>{t("aiAdvisor.cropAdvisor.viewDetails")}</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* 3. Bottom Action Bar */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-3 pt-5 border-t border-[#DCE7DD]">
          <button
            id="btn-modify-profile-bottom"
            type="button"
            onClick={onModifyProfile}
            className="flex h-12 w-full sm:w-auto items-center justify-center gap-2 rounded-2xl border border-[#DCE7DD] bg-[#F7F9F6] px-5 text-xs font-bold text-[#17321F] hover:bg-[#EAF7EE] hover:border-[#24833A] transition cursor-pointer"
          >
            <ArrowLeft size={16} />
            <span>{t("aiAdvisor.cropAdvisor.modifyProfile")}</span>
          </button>

          <button
            id="btn-start-crop-planning"
            type="button"
            onClick={() => setShowPlanningModal(true)}
            className="flex h-12 w-full sm:w-auto items-center justify-center gap-2 rounded-2xl bg-[#174D25] px-6 text-xs sm:text-sm font-black text-white shadow-md transition hover:bg-[#24833A] active:scale-[0.99] cursor-pointer"
          >
            <span>{t("aiAdvisor.cropAdvisor.startCropPlanning")}</span>
            <ArrowRight size={17} />
          </button>
        </div>
      </div>

      {/* 4. MODAL: SOIL & VARIETY DETAILS (zIndex 35 to keep desktop sidebar & header accessible) */}
      {selectedCropDetails && (
        <div
          id="modal-soil-details"
          style={{ zIndex: 35 }}
          className="fixed inset-0 z-30 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs animate-in fade-in duration-150"
          onClick={() => setSelectedCropDetails(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="w-full max-w-lg rounded-3xl border border-[#DCE7DD] bg-white p-6 shadow-xl animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-[#DCE7DD] pb-4">
              <div className="flex items-center gap-2.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EAF7EE] text-[#174D25]">
                  <Sprout size={20} />
                </div>
                <div>
                  <h4 className="text-base font-black text-[#17321F]">
                    {t(selectedCropDetails.cropNameKey)}
                  </h4>
                  <span className="text-[11px] font-bold text-[#5F6F64]">
                    {t("aiAdvisor.cropAdvisor.detailsModalTitle")}
                  </span>
                </div>
              </div>
              <button
                id="btn-close-details-x"
                type="button"
                onClick={() => setSelectedCropDetails(null)}
                className="flex h-8 w-8 items-center justify-center rounded-xl text-[#5F6F64] hover:bg-[#F7F9F6] hover:text-[#17321F] cursor-pointer"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="mt-4 flex flex-col gap-4 text-xs">
              {/* Soil Suitability */}
              <div className="rounded-2xl border border-[#DCE7DD] bg-[#F7F9F6] p-3.5">
                <div className="flex items-center gap-2 text-xs font-bold text-[#17321F] mb-1">
                  <Layers size={14} className="text-[#24833A]" />
                  <span>{t("aiAdvisor.cropAdvisor.soilSuitabilityTitle")}</span>
                </div>
                <p className="text-[#5F6F64] font-medium leading-relaxed">
                  {selectedCropDetails.soilSuitabilityKey
                    ? t(selectedCropDetails.soilSuitabilityKey)
                    : selectedCropDetails.soilSuitability}
                </p>
              </div>

              {/* Recommended Varieties */}
              <div className="rounded-2xl border border-[#DCE7DD] bg-[#F7F9F6] p-3.5">
                <div className="flex items-center gap-2 text-xs font-bold text-[#17321F] mb-1.5">
                  <Sprout size={14} className="text-[#24833A]" />
                  <span>{t("aiAdvisor.cropAdvisor.recommendedVarietiesTitle")}</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {selectedCropDetails.recommendedVarieties?.map((variety, idx) => (
                    <span
                      key={idx}
                      className="rounded-lg bg-white border border-[#DCE7DD] px-2.5 py-1 text-[11px] font-bold text-[#174D25]"
                    >
                      {variety}
                    </span>
                  ))}
                </div>
              </div>

              {/* Sowing Window & Duration */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="rounded-2xl border border-[#DCE7DD] bg-[#F7F9F6] p-3.5">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#17321F] mb-1">
                    <Calendar size={14} className="text-[#24833A]" />
                    <span>{t("aiAdvisor.cropAdvisor.sowingWindowTitle")}</span>
                  </div>
                  <p className="text-[#5F6F64] font-medium">
                    {selectedCropDetails.sowingWindowKey
                      ? t(selectedCropDetails.sowingWindowKey)
                      : "June – July (Kharif Season)"}
                  </p>
                </div>

                <div className="rounded-2xl border border-[#DCE7DD] bg-[#F7F9F6] p-3.5">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#17321F] mb-1">
                    <Clock size={14} className="text-[#24833A]" />
                    <span>{t("aiAdvisor.cropAdvisor.durationTitle")}</span>
                  </div>
                  <p className="text-[#5F6F64] font-medium">
                    {selectedCropDetails.durationDays || "120-140 Days"}
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="mt-5 flex items-center justify-end">
              <button
                id="btn-close-details-btn"
                type="button"
                onClick={() => setSelectedCropDetails(null)}
                className="rounded-xl bg-[#174D25] px-4 py-2 text-xs font-bold text-white hover:bg-[#24833A] transition cursor-pointer"
              >
                {t("aiAdvisor.cropAdvisor.closeDetails")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. MODAL: CROP PLANNING (zIndex 35 to keep desktop sidebar & header accessible) */}
      {showPlanningModal && (
        <div
          id="modal-crop-planning"
          style={{ zIndex: 35 }}
          className="fixed inset-0 z-30 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs animate-in fade-in duration-150"
          onClick={() => setShowPlanningModal(false)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="w-full max-w-md rounded-3xl border border-[#DCE7DD] bg-white p-6 shadow-xl animate-in zoom-in-95 duration-150 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EAF7EE] text-[#174D25] border border-[#86EFAC]/70 mb-4">
              <Calendar size={28} strokeWidth={2.2} />
            </div>

            <h4 className="text-base sm:text-lg font-black text-[#17321F]">
              {t("aiAdvisor.cropAdvisor.cropPlanningModalTitle")}
            </h4>

            <p className="mt-2 text-xs text-[#5F6F64] font-medium leading-relaxed">
              {t("aiAdvisor.cropAdvisor.cropPlanningModalMsg")}
            </p>

            <div className="mt-6 flex flex-col sm:flex-row gap-2.5">
              <button
                id="btn-close-planning-btn"
                type="button"
                onClick={() => setShowPlanningModal(false)}
                className="flex-1 rounded-2xl border border-[#DCE7DD] bg-[#F7F9F6] py-2.5 text-xs font-bold text-[#17321F] hover:bg-[#EAF7EE] cursor-pointer"
              >
                {t("aiAdvisor.cropAdvisor.closeDetails")}
              </button>

              <button
                id="btn-planning-talk-chat"
                type="button"
                onClick={() => {
                  setShowPlanningModal(false);
                  onSwitchToChat();
                }}
                className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-2xl bg-[#174D25] py-2.5 text-xs font-bold text-white hover:bg-[#24833A] cursor-pointer"
              >
                <Bot size={15} />
                <span>{t("aiAdvisor.cropAdvisor.talkToAdvisor")}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
