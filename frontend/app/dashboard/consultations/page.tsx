"use client";

import React from "react";
import { GraduationCap, Calendar, Video, Clock, MessageSquare, CheckCircle2 } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";

export default function ConsultationsPage() {
  const { t } = useTranslation();

  const sessions = [
    {
      id: "CON-101",
      farmerName: "M. Venkat Reddy",
      topic: "Yellow Leaf Disease in Chilli",
      time: "Today, 3:00 PM",
      status: "Upcoming",
      type: "Video Call",
    },
    {
      id: "CON-102",
      farmerName: "K. Appa Rao",
      topic: "Soil Salinity & Micro-nutrient Deficiency",
      time: "Today, 4:30 PM",
      status: "Upcoming",
      type: "Audio Consultation",
    },
    {
      id: "CON-098",
      farmerName: "S. Lakshmi",
      topic: "Organic Pest Trap Implementation",
      time: "Completed Yesterday",
      status: "Completed",
      type: "Diagnostic Review",
    },
  ];

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-3xl bg-white p-5 border border-gray-200 shadow-2xs">
        <div className="flex items-center gap-3.5">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#E4F0DD] text-[#24833A] shadow-xs">
            <GraduationCap size={26} strokeWidth={2.4} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-bold text-gray-900">
                {t("nav.consultations")} Hub
              </h1>
              <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-[#24833A]">
                Expert Portal
              </span>
            </div>
            <p className="text-xs text-gray-500 font-medium">
              1-on-1 scheduled audio and video agronomy consultations
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-gray-50 px-3.5 py-1.5 text-center">
          <span className="text-[10px] uppercase font-bold text-gray-400">Scheduled Today</span>
          <p className="text-sm font-extrabold text-[#174D25]">2 Sessions</p>
        </div>
      </div>

      {/* Consultations List */}
      <div className="flex flex-col gap-3">
        {sessions.map((ses) => (
          <div
            key={ses.id}
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-gray-200 bg-white p-4 shadow-2xs transition hover:border-[#24833A]/40"
          >
            <div className="flex items-start gap-3.5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-[#24833A]">
                <Video size={20} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xs font-bold text-gray-900">
                    {ses.farmerName}
                  </h2>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                      ses.status === "Upcoming"
                        ? "bg-amber-50 text-amber-700"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {ses.status}
                  </span>
                </div>
                <p className="mt-1 text-xs text-gray-600 font-medium">
                  {ses.topic}
                </p>
                <div className="mt-1 flex items-center gap-3 text-[11px] text-gray-400">
                  <span className="inline-flex items-center gap-1">
                    <Clock size={12} /> {ses.time}
                  </span>
                  <span>•</span>
                  <span>{ses.type}</span>
                </div>
              </div>
            </div>

            {ses.status === "Upcoming" && (
              <button
                type="button"
                className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#24833A] px-3.5 py-2 text-xs font-semibold text-white shadow-xs transition hover:bg-[#1e6e30] active:scale-95"
              >
                <Video size={14} />
                <span>Join Session</span>
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
