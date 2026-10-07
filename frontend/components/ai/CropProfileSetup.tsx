"use client";

import React, { useState, useEffect } from "react";
import {
  Sprout,
  Layers,
  Maximize2,
  Calendar,
  Droplet,
  IndianRupee,
  Check,
  ArrowRight,
  Sparkles,
  AlertCircle,
} from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { FarmProfileInput } from "@/types/ai";

interface CropProfileSetupProps {
  initialProfile: FarmProfileInput;
  onGetRecommendations: (profile: FarmProfileInput) => void;
  isLoading?: boolean;
  error?: string | null;
}

const AVAILABLE_CROPS = [
  { id: "rice", labelKey: "aiAdvisor.cropAdvisor.cropsList.rice" },
  { id: "cotton", labelKey: "aiAdvisor.cropAdvisor.cropsList.cotton" },
  { id: "maize", labelKey: "aiAdvisor.cropAdvisor.cropsList.maize" },
  { id: "groundnut", labelKey: "aiAdvisor.cropAdvisor.cropsList.groundnut" },
  { id: "chilli", labelKey: "aiAdvisor.cropAdvisor.cropsList.chilli" },
  { id: "turmeric", labelKey: "aiAdvisor.cropAdvisor.cropsList.turmeric" },
  { id: "sugarcane", labelKey: "aiAdvisor.cropAdvisor.cropsList.sugarcane" },
];

export default function CropProfileSetup({
  initialProfile,
  onGetRecommendations,
  isLoading = false,
  error = null,
}: CropProfileSetupProps) {
  const { t } = useTranslation();

  // Form states initialized with incoming or preserved profile
  const [soilType, setSoilType] = useState(initialProfile.soilType || "black");
  const [landArea, setLandArea] = useState<number | string>(initialProfile.landArea || 5.5);
  const [farmingSeason, setFarmingSeason] = useState(initialProfile.farmingSeason || "kharif");
  const [waterAvailability, setWaterAvailability] = useState(initialProfile.waterAvailability || "both");
  const [budgetMax, setBudgetMax] = useState<number>(initialProfile.budgetMax || 25000);
  const [budgetMin] = useState<number>(initialProfile.budgetMin || 15000);
  const [selectedCrops, setSelectedCrops] = useState<string[]>(
    initialProfile.cropPreferences || ["rice", "cotton"]
  );
  const [validationError, setValidationError] = useState<string | null>(null);

  // Sync if initialProfile changes from parent
  useEffect(() => {
    setSoilType(initialProfile.soilType);
    setLandArea(initialProfile.landArea);
    setFarmingSeason(initialProfile.farmingSeason);
    setWaterAvailability(initialProfile.waterAvailability);
    setBudgetMax(initialProfile.budgetMax);
    setSelectedCrops(initialProfile.cropPreferences);
  }, [initialProfile]);

  const toggleCropPreference = (cropId: string) => {
    setSelectedCrops((prev) =>
      prev.includes(cropId) ? prev.filter((id) => id !== cropId) : [...prev, cropId]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    const numericArea = Number(landArea);
    if (!numericArea || numericArea <= 0) {
      setValidationError("Please enter a valid land area greater than 0 acres.");
      return;
    }

    onGetRecommendations({
      soilType,
      landArea: numericArea,
      farmingSeason,
      waterAvailability,
      budgetMin,
      budgetMax,
      cropPreferences: selectedCrops,
    });
  };

  return (
    <div className="w-full rounded-3xl border border-[#DCE7DD] bg-white p-5 sm:p-7 shadow-2xs">
      {/* Header & Step Indicator */}
      <div className="mb-6 flex flex-col gap-2 border-b border-[#DCE7DD] pb-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="inline-flex items-center gap-2">
            <span className="rounded-full bg-[#174D25] px-3 py-1 text-[11px] font-black uppercase tracking-wider text-white">
              {t("aiAdvisor.cropAdvisor.step1Indicator")}
            </span>
            <span className="text-xs font-bold text-[#5F6F64]">
              {t("aiAdvisor.cropAdvisor.step1Secondary")}
            </span>
          </div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-[#EAF7EE] border border-[#86EFAC]/70 px-3 py-1 text-xs font-bold text-[#16803A]">
            <Sparkles size={13} />
            <span>Figma AI Crop Engine</span>
          </div>
        </div>

        <h2 className="text-xl sm:text-2xl font-black text-[#17321F]">
          {t("aiAdvisor.cropAdvisor.step1Heading")}
        </h2>
        <p className="text-xs text-[#5F6F64] font-medium leading-relaxed">
          Provide your land and resource parameters to receive agronomy-verified crop suggestions.
        </p>
      </div>

      {/* Validation Alert */}
      {(validationError || error) && (
        <div className="mb-4 flex items-center gap-2 rounded-2xl bg-red-50 border border-red-200 p-3.5 text-xs font-bold text-red-700">
          <AlertCircle size={16} className="shrink-0 text-red-600" />
          <span>{validationError || error}</span>
        </div>
      )}

      {/* Profile Setup Form */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {/* 1. SOIL TYPE */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="soil-type-select"
              className="flex items-center gap-2 text-xs font-bold text-[#17321F]"
            >
              <Layers size={14} className="text-[#24833A]" />
              <span>{t("aiAdvisor.cropAdvisor.soilTypeLabel")}</span>
            </label>
            <select
              id="soil-type-select"
              value={soilType}
              onChange={(e) => setSoilType(e.target.value)}
              className="h-12 w-full rounded-2xl border border-[#DCE7DD] bg-[#F7F9F6] px-4 text-xs font-semibold text-[#17321F] focus:border-[#24833A] focus:bg-white focus:outline-hidden transition"
            >
              <option value="black">{t("aiAdvisor.cropAdvisor.soilTypes.black")}</option>
              <option value="red">{t("aiAdvisor.cropAdvisor.soilTypes.red")}</option>
              <option value="alluvial">{t("aiAdvisor.cropAdvisor.soilTypes.alluvial")}</option>
              <option value="sandyLoam">{t("aiAdvisor.cropAdvisor.soilTypes.sandyLoam")}</option>
              <option value="clay">{t("aiAdvisor.cropAdvisor.soilTypes.clay")}</option>
            </select>
          </div>

          {/* 2. LAND AREA (ACRES) */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="land-area-input"
              className="flex items-center gap-2 text-xs font-bold text-[#17321F]"
            >
              <Maximize2 size={14} className="text-[#24833A]" />
              <span>{t("aiAdvisor.cropAdvisor.landAreaLabel")}</span>
            </label>
            <div className="relative flex items-center">
              <input
                id="land-area-input"
                type="number"
                step="any"
                min="0.1"
                max="500"
                value={landArea}
                onChange={(e) => {
                  setLandArea(e.target.value);
                  if (validationError) setValidationError(null);
                }}
                placeholder="e.g. 5.5"
                required
                className="h-12 w-full rounded-2xl border border-[#DCE7DD] bg-[#F7F9F6] px-4 pr-16 text-xs font-semibold text-[#17321F] focus:border-[#24833A] focus:bg-white focus:outline-hidden transition"
              />
              <span className="absolute right-4 text-xs font-bold text-[#5F6F64]">
                {t("aiAdvisor.cropAdvisor.acres")}
              </span>
            </div>
          </div>

          {/* 3. FARMING SEASON */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="farming-season-select"
              className="flex items-center gap-2 text-xs font-bold text-[#17321F]"
            >
              <Calendar size={14} className="text-[#24833A]" />
              <span>{t("aiAdvisor.cropAdvisor.farmingSeasonLabel")}</span>
            </label>
            <select
              id="farming-season-select"
              value={farmingSeason}
              onChange={(e) => setFarmingSeason(e.target.value)}
              className="h-12 w-full rounded-2xl border border-[#DCE7DD] bg-[#F7F9F6] px-4 text-xs font-semibold text-[#17321F] focus:border-[#24833A] focus:bg-white focus:outline-hidden transition"
            >
              <option value="kharif">{t("aiAdvisor.cropAdvisor.seasons.kharif")}</option>
              <option value="rabi">{t("aiAdvisor.cropAdvisor.seasons.rabi")}</option>
              <option value="zaid">{t("aiAdvisor.cropAdvisor.seasons.zaid")}</option>
            </select>
          </div>

          {/* 4. WATER AVAILABILITY */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="water-availability-select"
              className="flex items-center gap-2 text-xs font-bold text-[#17321F]"
            >
              <Droplet size={14} className="text-[#24833A]" />
              <span>{t("aiAdvisor.cropAdvisor.waterAvailabilityLabel")}</span>
            </label>
            <select
              id="water-availability-select"
              value={waterAvailability}
              onChange={(e) => setWaterAvailability(e.target.value)}
              className="h-12 w-full rounded-2xl border border-[#DCE7DD] bg-[#F7F9F6] px-4 text-xs font-semibold text-[#17321F] focus:border-[#24833A] focus:bg-white focus:outline-hidden transition"
            >
              <option value="both">{t("aiAdvisor.cropAdvisor.waterSources.both")}</option>
              <option value="canal">{t("aiAdvisor.cropAdvisor.waterSources.canal")}</option>
              <option value="borewell">{t("aiAdvisor.cropAdvisor.waterSources.borewell")}</option>
              <option value="rainfed">{t("aiAdvisor.cropAdvisor.waterSources.rainfed")}</option>
            </select>
          </div>
        </div>

        {/* 5. BUDGET RANGE (PER ACRE) - FIGMA SLIDER */}
        <div className="flex flex-col gap-2 rounded-2xl border border-[#DCE7DD] bg-[#F7F9F6] p-4 sm:p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-[#17321F]">
              <IndianRupee size={15} className="text-[#24833A]" />
              <span>{t("aiAdvisor.cropAdvisor.budgetRangeLabel")}</span>
            </div>
            <span className="rounded-xl bg-[#EAF7EE] border border-[#86EFAC]/70 px-3 py-1 text-xs font-black text-[#174D25]">
              ₹15,000 - ₹{budgetMax.toLocaleString("en-IN")}
            </span>
          </div>

          <div className="mt-2 flex flex-col gap-1.5">
            <input
              id="budget-range-slider"
              type="range"
              min="15000"
              max="50000"
              step="2500"
              value={budgetMax}
              onChange={(e) => setBudgetMax(Number(e.target.value))}
              className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-[#DCE7DD] accent-[#174D25]"
            />
            <div className="flex justify-between text-[11px] font-bold text-[#5F6F64]">
              <span>₹15,000 (Low Input)</span>
              <span>₹30,000 (Medium)</span>
              <span>₹50,000 (Intensive)</span>
            </div>
          </div>
        </div>

        {/* 6. CROP PREFERENCE (OPTIONAL) - SELECTABLE CHIPS */}
        <div className="flex flex-col gap-2.5">
          <label className="flex items-center gap-2 text-xs font-bold text-[#17321F]">
            <Sprout size={14} className="text-[#24833A]" />
            <span>{t("aiAdvisor.cropAdvisor.cropPreferenceLabel")}</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {AVAILABLE_CROPS.map((crop) => {
              const isSelected = selectedCrops.includes(crop.id);
              return (
                <button
                  key={crop.id}
                  id={`crop-chip-${crop.id}`}
                  type="button"
                  onClick={() => toggleCropPreference(crop.id)}
                  className={`inline-flex items-center gap-1.5 rounded-2xl px-4 py-2 text-xs font-bold transition active:scale-95 cursor-pointer ${
                    isSelected
                      ? "border border-[#174D25] bg-[#174D25] text-white shadow-xs"
                      : "border border-[#DCE7DD] bg-white text-[#17321F] hover:bg-[#F7F9F6] hover:border-[#24833A]"
                  }`}
                >
                  {isSelected && <Check size={13} strokeWidth={3} />}
                  <span>{t(crop.labelKey)}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 7. PRIMARY CTA: GET RECOMMENDATIONS */}
        <div className="mt-2 pt-4 border-t border-[#DCE7DD]">
          <button
            id="btn-get-recommendations"
            type="submit"
            disabled={isLoading}
            className="flex h-13 w-full items-center justify-center gap-2 rounded-2xl bg-[#174D25] px-6 text-sm font-black text-white shadow-md transition hover:bg-[#24833A] active:scale-[0.99] disabled:opacity-50 cursor-pointer"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                <span>{t("aiAdvisor.cropAdvisor.calculating") || "Analyzing..."}</span>
              </div>
            ) : (
              <>
                <span>{t("aiAdvisor.cropAdvisor.getRecommendations")}</span>
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
