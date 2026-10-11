"use client";

import React from "react";
import { TestTube, CheckCircle2, AlertCircle } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import BackButton from "@/components/ui/BackButton";

export default function SoilPage() {
  const { t } = useTranslation();

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-5 pb-16">
      {/* Top Contextual Back Navigation */}
      <div className="flex items-center justify-between">
        <BackButton
          id="btn-soil-back-dashboard"
          href="/dashboard"
          label={t("common.backToDashboard") || "Back to Dashboard"}
        />
      </div>
      <div className="flex items-center gap-3.5 rounded-3xl bg-white p-5 border border-gray-200 shadow-2xs">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#E4F0DD] text-[#24833A] shadow-xs">
          <TestTube size={26} strokeWidth={2.4} />
        </div>
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-gray-900">
            Soil Health Card & Diagnostics
          </h1>
          <p className="text-xs text-gray-500 font-medium">
            NPK fertility indices, organic carbon and pH laboratory results
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-2xs">
          <span className="text-[10px] font-bold uppercase text-gray-400">Soil pH (Reaction)</span>
          <div className="mt-1 flex items-center justify-between">
            <span className="text-xl font-extrabold text-[#174D25]">6.8</span>
            <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              Neutral • Ideal
            </span>
          </div>
          <p className="text-[11px] text-gray-500 mt-2">Optimal range for nutrient absorption (6.5 - 7.5)</p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-2xs">
          <span className="text-[10px] font-bold uppercase text-gray-400">Organic Carbon (OC)</span>
          <div className="mt-1 flex items-center justify-between">
            <span className="text-xl font-extrabold text-[#174D25]">0.68%</span>
            <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              Medium Organic
            </span>
          </div>
          <p className="text-[11px] text-gray-500 mt-2">Satisfactory microbial activity, incorporate FYM</p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-2xs">
          <span className="text-[10px] font-bold uppercase text-gray-400">Electrical Conductivity</span>
          <div className="mt-1 flex items-center justify-between">
            <span className="text-xl font-extrabold text-[#174D25]">0.42 dS/m</span>
            <span className="text-[10px] font-semibold text-[#24833A] bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              Non-Saline
            </span>
          </div>
          <p className="text-[11px] text-gray-500 mt-2">Safe for all standard field and horticultural crops</p>
        </div>
      </div>

      {/* Primary Nutrients (NPK) Grid */}
      <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-2xs">
        <h2 className="text-sm font-bold text-gray-900 mb-1">
          Primary Nutrients (NPK Indices)
        </h2>
        <p className="text-xs text-gray-500 mb-4">
          Available macro-nutrients evaluated per hectare
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="rounded-2xl bg-[#F7F9F6] p-3.5 border border-gray-100 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-700">Available Nitrogen (N)</span>
                <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                  Low
                </span>
              </div>
              <p className="text-lg font-extrabold text-gray-900 mt-1">210 kg/ha</p>
            </div>
            <p className="text-[11px] text-gray-500 mt-2">Standard requirement: 280-560 kg/ha</p>
          </div>

          <div className="rounded-2xl bg-[#F7F9F6] p-3.5 border border-gray-100 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-700">Available Phosphorus (P₂O₅)</span>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  Medium
                </span>
              </div>
              <p className="text-lg font-extrabold text-gray-900 mt-1">18.4 kg/ha</p>
            </div>
            <p className="text-[11px] text-gray-500 mt-2">Standard requirement: 10-25 kg/ha</p>
          </div>

          <div className="rounded-2xl bg-[#F7F9F6] p-3.5 border border-gray-100 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-700">Available Potassium (K₂O)</span>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  High
                </span>
              </div>
              <p className="text-lg font-extrabold text-gray-900 mt-1">320 kg/ha</p>
            </div>
            <p className="text-[11px] text-gray-500 mt-2">Standard requirement: 108-280 kg/ha</p>
          </div>
        </div>
      </div>

      {/* Expert Agronomy Advisory Card */}
      <div className="rounded-3xl border border-[#24833A]/30 bg-[#F4FBF5] p-5 shadow-2xs">
        <div className="flex items-center gap-2 mb-2">
          <CheckCircle2 size={18} className="text-[#24833A]" />
          <h2 className="text-sm font-bold text-[#174D25]">
            Agronomy Recommendation Summary
          </h2>
        </div>
        <p className="text-xs text-gray-700 leading-relaxed">
          1. Apply basal dose of 50 kg DAP + 25 kg Urea per acre at sowing.<br />
          2. Top-dress with 25 kg Urea in 2 split applications at tillering and panicle initiation.<br />
          3. Soil shows adequate Potassium (K); reduce MOP dosage by 20% to save input costs.<br />
          4. Zinc Sulphate @ 10 kg/acre recommended to address marginal micronutrient depletion.
        </p>
      </div>
    </div>
  );
}
