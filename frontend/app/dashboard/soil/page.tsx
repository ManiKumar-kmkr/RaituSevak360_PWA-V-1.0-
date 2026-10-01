"use client";

import React from "react";
import { TestTube, CheckCircle2, AlertCircle } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";

export default function SoilPage() {
  const { t } = useTranslation();

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-5">
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
          <span className="text-[10px] font-bold uppercase text-gray-400">Soil pH</span>
          <div className="mt-1 flex items-center gap-2">
            <span className="text-xl font-extrabold text-[#174D25]">6.8</span>
            <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-md">
              Neutral • Ideal
            </span>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-2xs">
          <span className="text-[10px] font-bold uppercase text-gray-400">Organic Carbon</span>
          <div className="mt-1 flex items-center gap-2">
            <span className="text-xl font-extrabold text-[#174D25]">0.68%</span>
            <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-md">
              Medium
            </span>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-2xs">
          <span className="text-[10px] font-bold uppercase text-gray-400">NPK Balance</span>
          <div className="mt-1 flex items-center gap-2">
            <span className="text-xl font-extrabold text-[#174D25]">Optimal</span>
            <span className="text-[10px] font-semibold text-[#24833A] bg-emerald-50 px-1.5 py-0.5 rounded-md">
              High Zinc
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
