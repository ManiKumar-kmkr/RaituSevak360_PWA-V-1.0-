"use client";

import React from "react";
import { Trees, MapPin, Plus, Compass } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";

export default function FarmPage() {
  const { t } = useTranslation();

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-3xl bg-white p-5 border border-gray-200 shadow-2xs">
        <div className="flex items-center gap-3.5">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#E4F0DD] text-[#24833A] shadow-xs">
            <Trees size={26} strokeWidth={2.4} />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-gray-900">
              Farm Land & Plot Boundaries
            </h1>
            <p className="text-xs text-gray-500 font-medium">
              Geo-fenced plots, soil types, and water source tracking
            </p>
          </div>
        </div>

        <button
          type="button"
          className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#24833A] px-4 py-2.5 text-xs font-semibold text-white shadow-xs transition hover:bg-[#1e6e30] active:scale-95"
        >
          <Plus size={16} />
          <span>Add Farm Plot</span>
        </button>
      </div>

      <div className="rounded-3xl border border-[#24833A]/20 bg-[#F4FBF5] p-5 shadow-2xs">
        <div className="flex items-center gap-2 text-[#174D25] font-bold text-xs">
          <MapPin size={16} className="text-[#24833A]" />
          <span>Plot #1: South Canal Acreage (5.5 Acres)</span>
        </div>
        <p className="text-xs text-gray-600 mt-1 leading-relaxed">
          Black cotton soil • Borewell + Drip Irrigation • Current Crop: Paddy (Kharif)
        </p>
      </div>
    </div>
  );
}
