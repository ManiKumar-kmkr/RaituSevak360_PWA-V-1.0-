"use client";

import React from "react";
import { FileText, Download, FileSpreadsheet, ExternalLink } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";

export default function ResourcesPage() {
  const { t } = useTranslation();

  const resources = [
    {
      id: "DOC-1",
      title: "ICAR Crop Yield & Climate Resilience Dataset (2025-2026)",
      format: "PDF • 3.4 MB",
      date: "Aug 2026",
      category: "Research Paper",
    },
    {
      id: "DOC-2",
      title: "Regional Soil Microbiome & Nitrogen Fixation Study",
      format: "XLSX • 1.8 MB",
      date: "Jul 2026",
      category: "Field Dataset",
    },
    {
      id: "DOC-3",
      title: "AP Agricultural University Extension Guidelines",
      format: "PDF • 5.1 MB",
      date: "Jun 2026",
      category: "Extension Manual",
    },
  ];

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-3xl bg-white p-5 border border-gray-200 shadow-2xs">
        <div className="flex items-center gap-3.5">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#E4F0DD] text-[#24833A] shadow-xs">
            <FileText size={26} strokeWidth={2.4} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-bold text-gray-900">
                {t("nav.resources")} & Research Library
              </h1>
              <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-[#24833A]">
                Open Science
              </span>
            </div>
            <p className="text-xs text-gray-500 font-medium">
              Verified crop datasets, regional soil maps, and scientific studies
            </p>
          </div>
        </div>
      </div>

      {/* Resource Files */}
      <div className="flex flex-col gap-3">
        {resources.map((res) => (
          <div
            key={res.id}
            className="flex items-center justify-between rounded-2xl border border-gray-200 bg-white p-4 shadow-2xs transition hover:border-[#24833A]/40"
          >
            <div className="flex items-center gap-3.5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-50 text-[#24833A] border border-gray-100">
                <FileText size={20} />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase text-gray-400">
                  {res.category}
                </span>
                <h2 className="text-xs font-bold text-gray-900 leading-snug">
                  {res.title}
                </h2>
                <p className="text-[11px] text-gray-400 mt-0.5">
                  {res.format} • {res.date}
                </p>
              </div>
            </div>

            <button
              type="button"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-gray-200 text-gray-600 hover:border-[#24833A] hover:text-[#24833A] transition"
              title="Download Resource"
            >
              <Download size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
