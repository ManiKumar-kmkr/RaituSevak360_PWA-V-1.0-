"use client";

import React, { useState } from "react";
import {
  GraduationCap,
  Calendar,
  Clock,
  Video,
  Mic,
  CheckCircle2,
  Eye,
  FileText,
  MapPin,
  Play,
  ArrowRight,
  Filter,
  Search,
} from "lucide-react";
import { ExpertConsultation, ConsultationStatus } from "@/types/expert";

interface ConsultationsListProps {
  consultations: ExpertConsultation[];
  onSelectConsultation: (consultation: ExpertConsultation) => void;
  onStartCall: (consultation: ExpertConsultation) => void;
  onViewSummary: (consultation: ExpertConsultation) => void;
  onScheduleNew?: () => void;
}

export default function ConsultationsList({
  consultations,
  onSelectConsultation,
  onStartCall,
  onViewSummary,
  onScheduleNew,
}: ConsultationsListProps) {
  const [statusFilter, setStatusFilter] = useState<ConsultationStatus | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");

  const upcomingCount = consultations.filter(
    (c) => c.status === "upcoming" || c.status === "in_progress"
  ).length;

  const filteredConsultations = consultations.filter((c) => {
    if (statusFilter !== "all" && c.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      return (
        c.farmerName.toLowerCase().includes(q) ||
        c.crop.toLowerCase().includes(q) ||
        c.topic.toLowerCase().includes(q) ||
        c.id.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const getStatusBadge = (status: ConsultationStatus) => {
    switch (status) {
      case "upcoming":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-[10px] font-bold text-amber-800 border border-amber-200">
            <Clock size={11} />
            Upcoming
          </span>
        );
      case "in_progress":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-[#24833A] border border-emerald-200 animate-pulse">
            <span className="h-1.5 w-1.5 rounded-full bg-[#24833A]" />
            Live Now
          </span>
        );
      case "completed":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-0.5 text-[10px] font-bold text-gray-700">
            <CheckCircle2 size={11} />
            Completed
          </span>
        );
      case "cancelled":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2.5 py-0.5 text-[10px] font-bold text-rose-700">
            Cancelled
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Subheader Filter Bar & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-2xl bg-white p-3 border border-gray-200 shadow-2xs">
        {/* Status Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <button
            type="button"
            onClick={() => setStatusFilter("all")}
            className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition flex-shrink-0 cursor-pointer ${
              statusFilter === "all"
                ? "bg-[#24833A] text-white shadow-xs"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            All Sessions ({consultations.length})
          </button>

          <button
            type="button"
            onClick={() => setStatusFilter("upcoming")}
            className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-bold transition flex-shrink-0 cursor-pointer ${
              statusFilter === "upcoming"
                ? "bg-[#24833A] text-white shadow-xs"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            <span>Upcoming</span>
            {upcomingCount > 0 && (
              <span
                className={`rounded-full px-1.5 py-0.2 text-[10px] font-extrabold ${
                  statusFilter === "upcoming"
                    ? "bg-white text-[#24833A]"
                    : "bg-amber-100 text-amber-800"
                }`}
              >
                {upcomingCount}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setStatusFilter("completed")}
            className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition flex-shrink-0 cursor-pointer ${
              statusFilter === "completed"
                ? "bg-[#24833A] text-white shadow-xs"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            Completed
          </button>
        </div>

        {/* Quick Search */}
        <div className="relative min-w-[200px]">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search topic, farmer, crop..."
            className="h-9 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 pr-8 text-xs text-gray-800 focus:bg-white focus:outline-none focus:border-[#24833A]"
          />
        </div>
      </div>

      {/* Consultations List or Empty State */}
      {filteredConsultations.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-gray-300 bg-white p-10 sm:p-14 text-center shadow-2xs">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#E4F0DD] text-[#24833A] mb-3.5">
            <GraduationCap size={32} />
          </div>
          <h3 className="text-base font-bold text-gray-900">No Consultations Found</h3>
          <p className="mt-1 max-w-sm text-xs text-gray-500 leading-relaxed">
            {statusFilter === "upcoming"
              ? "You have no upcoming consultations scheduled. Accept farmer connection requests to schedule advisory sessions."
              : "No sessions match your search criteria. Try a different query or filter."}
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filteredConsultations.map((ses) => {
            const isLiveOrUpcoming =
              ses.status === "upcoming" || ses.status === "in_progress";

            return (
              <div
                key={ses.id}
                className="w-full h-auto min-h-0 flex flex-col justify-between rounded-2xl border border-gray-200 bg-white p-4 sm:p-5 shadow-2xs transition hover:border-[#24833A]/40 overflow-hidden"
              >
                {/* Header Row */}
                <div className="flex items-start justify-between gap-3 min-w-0">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-mono font-bold text-[#174D25] shrink-0">
                        {ses.id}
                      </span>
                      <span className="text-gray-300 shrink-0">•</span>
                      <span className="text-[11px] text-gray-400 shrink-0 font-medium">
                        🌾 {ses.crop}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-gray-900 mt-1 break-words">
                      {ses.farmerName}
                    </h3>
                    <p className="text-xs font-medium text-gray-600 mt-0.5 break-words">
                      {ses.topic}
                    </p>
                  </div>

                  <div className="shrink-0 self-start">
                    {getStatusBadge(ses.status)}
                  </div>
                </div>

                {/* Schedule & Mode Grid */}
                <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 rounded-xl bg-gray-50 p-2.5 text-xs text-gray-600 border border-gray-100 min-w-0">
                  <div className="flex items-center gap-2 min-w-0">
                    <Calendar size={13} className="text-[#24833A] shrink-0" />
                    <span className="truncate">
                      Date: <strong>{ses.scheduledDate}</strong> at {ses.scheduledTimeSlot}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 min-w-0">
                    {ses.type === "video" ? (
                      <Video size={13} className="text-[#24833A] shrink-0" />
                    ) : (
                      <Mic size={13} className="text-[#24833A] shrink-0" />
                    )}
                    <span className="capitalize truncate">
                      {ses.type} Consultation • {ses.durationMinutes}m
                    </span>
                  </div>
                </div>

                {/* Footer Action Row */}
                <div className="mt-3.5 flex items-center justify-between border-t border-gray-100 pt-3 flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => onSelectConsultation(ses)}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3.5 py-1.5 text-xs font-bold text-gray-700 hover:bg-gray-50 active:scale-95 cursor-pointer shrink-0"
                  >
                    <Eye size={13} />
                    <span>View Details</span>
                  </button>

                  <div className="flex items-center gap-2">
                    {ses.summary && (
                      <button
                        type="button"
                        onClick={() => onViewSummary(ses)}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-[#24833A]/30 bg-emerald-50 px-3.5 py-1.5 text-xs font-bold text-[#174D25] hover:bg-emerald-100 active:scale-95 cursor-pointer"
                      >
                        <FileText size={13} />
                        <span>View Summary</span>
                      </button>
                    )}

                    {isLiveOrUpcoming && (
                      <button
                        type="button"
                        onClick={() => onStartCall(ses)}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-[#24833A] px-4 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-[#1e6e30] active:scale-95 cursor-pointer"
                      >
                        <Video size={13} />
                        <span>Join Session</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
