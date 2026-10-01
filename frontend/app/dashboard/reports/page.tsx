"use client";

import React from "react";
import { FileSpreadsheet, Download, BarChart3, TrendingUp, AlertTriangle } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";

export default function ReportsPage() {
  const { t } = useTranslation();

  const reports = [
    {
      id: "REP-1",
      title: "Monthly Mandal Crop Acreage & Sowing Census",
      coverage: "Kharif 2026 Season",
      status: "Published",
      date: "Sep 2026",
    },
    {
      id: "REP-2",
      title: "Groundwater Table & Borewell Yield Assessment",
      coverage: "Krishna & Godavari Basins",
      status: "Quarterly Audit",
      date: "Aug 2026",
    },
    {
      id: "REP-3",
      title: "Pest Attack Early Warning & Relief Distribution Audit",
      coverage: "District Emergency Response",
      status: "Verified",
      date: "Jul 2026",
    },
  ];

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-3xl bg-white p-5 border border-gray-200 shadow-2xs">
        <div className="flex items-center gap-3.5">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#E4F0DD] text-[#24833A] shadow-xs">
            <FileSpreadsheet size={26} strokeWidth={2.4} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-bold text-gray-900">
                {t("nav.reports")} & Analytics
              </h1>
              <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-[#24833A]">
                Official Records
              </span>
            </div>
            <p className="text-xs text-gray-500 font-medium">
              Regional agricultural census, disaster management and crop insurance audits
            </p>
          </div>
        </div>
      </div>

      {/* Reports List */}
      <div className="flex flex-col gap-3">
        {reports.map((rep) => (
          <div
            key={rep.id}
            className="flex items-center justify-between rounded-2xl border border-gray-200 bg-white p-4 shadow-2xs transition hover:border-[#24833A]/40"
          >
            <div className="flex items-center gap-3.5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-50 text-purple-700">
                <BarChart3 size={20} />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase text-gray-400">
                  {rep.status}
                </span>
                <h2 className="text-xs font-bold text-gray-900 leading-snug">
                  {rep.title}
                </h2>
                <p className="text-[11px] text-gray-500 mt-0.5">
                  {rep.coverage} • {rep.date}
                </p>
              </div>
            </div>

            <button
              type="button"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-gray-200 text-gray-600 hover:border-[#24833A] hover:text-[#24833A] transition"
              title="Download Report"
            >
              <Download size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
