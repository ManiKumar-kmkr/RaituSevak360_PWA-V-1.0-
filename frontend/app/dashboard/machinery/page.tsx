"use client";

import React from "react";
import { Tractor, Wrench, Calendar, Plus } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";

export default function MachineryPage() {
  const { t } = useTranslation();

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-3xl bg-white p-5 border border-gray-200 shadow-2xs">
        <div className="flex items-center gap-3.5">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#E4F0DD] text-[#24833A] shadow-xs">
            <Tractor size={26} strokeWidth={2.4} />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-gray-900">
              Farm Machinery & Implement Hub
            </h1>
            <p className="text-xs text-gray-500 font-medium">
              Tractor rentals, harvesters, drone sprayers and implement sharing
            </p>
          </div>
        </div>

        <button
          type="button"
          className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#24833A] px-4 py-2.5 text-xs font-semibold text-white shadow-xs transition hover:bg-[#1e6e30] active:scale-95"
        >
          <Plus size={16} />
          <span>Rent Implement</span>
        </button>
      </div>

      <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
            <Wrench size={20} />
          </div>
          <div>
            <h2 className="text-xs font-bold text-gray-900">Custom Hiring Centers (CHC)</h2>
            <p className="text-[11px] text-gray-500">Government subsidized machinery rental clusters near your village.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
