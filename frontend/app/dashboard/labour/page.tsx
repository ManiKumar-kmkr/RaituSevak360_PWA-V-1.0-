"use client";

import React from "react";
import { UsersRound, HardHat, Calendar, Clock, MapPin, Plus, CheckCircle2 } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";

export default function LabourPage() {
  const { t } = useTranslation();

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-5">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-3xl bg-white p-5 border border-gray-200 shadow-2xs">
        <div className="flex items-center gap-3.5">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#E4F0DD] text-[#24833A] shadow-xs">
            <UsersRound size={26} strokeWidth={2.4} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-bold text-gray-900">
                {t("nav.labour")} Services
              </h1>
              <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-[#24833A]">
                On-Demand
              </span>
            </div>
            <p className="text-xs text-gray-500 font-medium">
              Book verified agricultural labour and seasonal harvest crews
            </p>
          </div>
        </div>

        <button
          type="button"
          className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#24833A] px-4 py-2.5 text-xs font-semibold text-white shadow-xs transition hover:bg-[#1e6e30] active:scale-95 self-start sm:self-auto"
        >
          <Plus size={16} />
          <span>Request Farm Crew</span>
        </button>
      </div>

      {/* Available Operations Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-2xs">
          <div className="flex items-center gap-2.5 text-[#24833A]">
            <HardHat size={20} />
            <h2 className="text-xs font-bold text-gray-900">Harvesting Crew</h2>
          </div>
          <p className="mt-1 text-xs text-gray-500">
            Paddy, cotton, chilli, & sugarcane cutting specialists.
          </p>
          <div className="mt-3 flex items-center justify-between text-[11px] font-semibold text-gray-600">
            <span>Avg Rate: ₹500/day</span>
            <span className="text-[#24833A]">Verified</span>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-2xs">
          <div className="flex items-center gap-2.5 text-[#24833A]">
            <Calendar size={20} />
            <h2 className="text-xs font-bold text-gray-900">Transplanting & Sowing</h2>
          </div>
          <p className="mt-1 text-xs text-gray-500">
            Fast nursery transplantation and seedling placement.
          </p>
          <div className="mt-3 flex items-center justify-between text-[11px] font-semibold text-gray-600">
            <span>Avg Rate: ₹450/day</span>
            <span className="text-[#24833A]">Verified</span>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-2xs">
          <div className="flex items-center gap-2.5 text-[#24833A]">
            <Clock size={20} />
            <h2 className="text-xs font-bold text-gray-900">Weeding & Spraying</h2>
          </div>
          <p className="mt-1 text-xs text-gray-500">
            Fertilizer distribution & protective crop spraying.
          </p>
          <div className="mt-3 flex items-center justify-between text-[11px] font-semibold text-gray-600">
            <span>Avg Rate: ₹400/day</span>
            <span className="text-[#24833A]">Verified</span>
          </div>
        </div>
      </div>

      {/* Booking Status Card */}
      <div className="rounded-3xl border border-[#24833A]/20 bg-[#F4FBF5] p-5 shadow-2xs">
        <div className="flex items-center gap-2 text-[#174D25] mb-2 font-bold text-sm">
          <CheckCircle2 size={18} className="text-[#24833A]" />
          <h3>Active Farm Labour Network</h3>
        </div>
        <p className="text-xs text-gray-600 leading-relaxed">
          Over 450+ verified farm workers are currently registered across your mandal. You can schedule teams 24 hours in advance with direct mobile coordination.
        </p>
        <div className="mt-3 flex items-center gap-2 text-xs font-medium text-gray-500">
          <MapPin size={14} className="text-[#24833A]" />
          <span>Local cluster: Guntur & Krishna Region</span>
        </div>
      </div>
    </div>
  );
}
