"use client";

import React from "react";
import { Sprout, CheckCircle2, AlertTriangle, Calendar, Plus } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";

export default function CropsPage() {
  const { t } = useTranslation();

  const crops = [
    {
      id: "CRP-1",
      name: "Paddy (BPT 5204)",
      stage: "Vegetative Growth (Day 42)",
      health: "Healthy",
      acreage: "3.5 Acres",
      statusColor: "text-emerald-700 bg-emerald-50",
    },
    {
      id: "CRP-2",
      name: "Cotton (Bt Hybrid)",
      stage: "Flowering & Boll Formation",
      health: "Mild Pest Watch",
      acreage: "2.0 Acres",
      statusColor: "text-amber-700 bg-amber-50",
    },
  ];

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-3xl bg-white p-5 border border-gray-200 shadow-2xs">
        <div className="flex items-center gap-3.5">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#E4F0DD] text-[#24833A] shadow-xs">
            <Sprout size={26} strokeWidth={2.4} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-bold text-gray-900">
                Crop Health & Monitoring
              </h1>
              <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-[#24833A]">
                Active Cycle
              </span>
            </div>
            <p className="text-xs text-gray-500 font-medium">
              Track growth stages, irrigation schedule and pest defense
            </p>
          </div>
        </div>

        <button
          type="button"
          className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#24833A] px-4 py-2.5 text-xs font-semibold text-white shadow-xs transition hover:bg-[#1e6e30] active:scale-95"
        >
          <Plus size={16} />
          <span>Add New Crop</span>
        </button>
      </div>

      {/* Crops List */}
      <div className="flex flex-col gap-3">
        {crops.map((crop) => (
          <div
            key={crop.id}
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-gray-200 bg-white p-4 shadow-2xs transition hover:border-[#24833A]/40"
          >
            <div className="flex items-start gap-3.5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#F4FBF5] text-[#24833A]">
                <Sprout size={22} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-sm font-bold text-gray-900">
                    {crop.name}
                  </h2>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${crop.statusColor}`}
                  >
                    {crop.health}
                  </span>
                </div>
                <p className="text-xs text-gray-600 mt-0.5">{crop.stage}</p>
                <span className="text-[11px] text-gray-400">Plot Size: {crop.acreage}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-center">
              <button
                type="button"
                className="rounded-xl border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-100 transition"
              >
                Log Advisory
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
