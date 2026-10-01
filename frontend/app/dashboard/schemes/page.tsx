"use client";

import React from "react";
import { Landmark, CheckCircle2, Clock, Users, ArrowUpRight } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";

export default function SchemesPage() {
  const { t } = useTranslation();

  const schemes = [
    {
      id: "SCH-1",
      title: "Rythu Bharosa Direct Benefit Transfer (2026)",
      beneficiaries: "48,200 Farmers",
      budget: "₹65.2 Cr Allocated",
      status: "Active & Disbursing",
      badge: "State Scheme",
    },
    {
      id: "SCH-2",
      title: "Micro-Irrigation & Drip Subsidy Program",
      beneficiaries: "12,450 Verified",
      budget: "90% Subsidy",
      status: "Application Open",
      badge: "Central / State",
    },
    {
      id: "SCH-3",
      title: "Pradhan Mantri Fasal Bima Yojana (Crop Insurance)",
      beneficiaries: "35,100 Covered",
      budget: "Kharif 2026",
      status: "Claims Processing",
      badge: "National",
    },
  ];

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-3xl bg-white p-5 border border-gray-200 shadow-2xs">
        <div className="flex items-center gap-3.5">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#E4F0DD] text-[#24833A] shadow-xs">
            <Landmark size={26} strokeWidth={2.4} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-bold text-gray-900">
                {t("nav.schemes")} Portal
              </h1>
              <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-[#24833A]">
                Welfare Desk
              </span>
            </div>
            <p className="text-xs text-gray-500 font-medium">
              Monitor agricultural subsidies, welfare eligibility and direct benefit transfers
            </p>
          </div>
        </div>
      </div>

      {/* Schemes List */}
      <div className="flex flex-col gap-3">
        {schemes.map((sch) => (
          <div
            key={sch.id}
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-gray-200 bg-white p-4 shadow-2xs transition hover:border-[#24833A]/40"
          >
            <div>
              <div className="flex items-center gap-2">
                <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-[#24833A]">
                  {sch.badge}
                </span>
                <span className="text-[11px] font-semibold text-emerald-700">
                  {sch.status}
                </span>
              </div>
              <h2 className="mt-1 text-xs font-bold text-gray-900 leading-snug">
                {sch.title}
              </h2>
              <div className="mt-1 flex items-center gap-3 text-[11px] text-gray-500">
                <span>{sch.beneficiaries}</span>
                <span>•</span>
                <span className="font-semibold text-gray-700">{sch.budget}</span>
              </div>
            </div>

            <button
              type="button"
              className="inline-flex items-center justify-center gap-1 rounded-xl bg-[#E4F0DD] px-3 py-1.5 text-xs font-bold text-[#174D25] hover:bg-[#d6e9cd] transition"
            >
              <span>Manage Scheme</span>
              <ArrowUpRight size={13} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
