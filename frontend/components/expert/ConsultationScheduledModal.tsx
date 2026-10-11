"use client";

import React from "react";
import { CheckCircle2, Calendar, Clock, Video, Mic, ArrowRight } from "lucide-react";
import { ExpertConsultation } from "@/types/expert";

interface ConsultationScheduledModalProps {
  consultation: ExpertConsultation | null;
  isOpen: boolean;
  onClose: () => void;
  onViewConsultations: () => void;
}

export default function ConsultationScheduledModal({
  consultation,
  isOpen,
  onClose,
  onViewConsultations,
}: ConsultationScheduledModalProps) {
  if (!isOpen || !consultation) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs animate-in fade-in duration-150 overflow-y-auto"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-2xl animate-in zoom-in-95 duration-150 my-6 text-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Green Success Icon */}
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-[#24833A] mb-3.5">
          <CheckCircle2 size={38} strokeWidth={2.4} />
        </div>

        <span className="rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-bold text-[#174D25] border border-emerald-200">
          Booking Confirmed
        </span>

        <h2 className="text-lg sm:text-xl font-extrabold text-gray-900 mt-2">
          Consultation Scheduled!
        </h2>
        <p className="mt-1 text-xs text-gray-500 leading-relaxed max-w-xs mx-auto">
          The 1-on-1 agronomy session with <strong>{consultation.farmerName}</strong> has been confirmed. Both you and the farmer will receive join reminders.
        </p>

        {/* Schedule Details Card */}
        <div className="mt-4 rounded-2xl border border-gray-100 bg-[#F7F9F6] p-4 text-left text-xs flex flex-col gap-2.5">
          <div className="flex items-center justify-between pb-2 border-b border-gray-200/60">
            <span className="text-gray-500 font-medium">Session ID</span>
            <span className="font-mono font-bold text-[#174D25]">{consultation.id}</span>
          </div>

          <div className="flex items-center justify-between pb-2 border-b border-gray-200/60">
            <span className="text-gray-500 font-medium">Farmer</span>
            <span className="font-bold text-gray-900">{consultation.farmerName}</span>
          </div>

          <div className="flex items-center justify-between pb-2 border-b border-gray-200/60">
            <span className="text-gray-500 font-medium">Crop & Topic</span>
            <span className="font-semibold text-gray-800 truncate max-w-[200px]">
              {consultation.crop} • {consultation.topic}
            </span>
          </div>

          <div className="flex items-center justify-between pb-2 border-b border-gray-200/60">
            <span className="text-gray-500 font-medium">Date & Time</span>
            <span className="font-bold text-gray-900">
              {consultation.scheduledDate}, {consultation.scheduledTimeSlot} ({consultation.durationMinutes}m)
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-gray-500 font-medium">Session Type</span>
            <div className="flex items-center gap-1.5 font-bold text-[#24833A]">
              {consultation.type === "video" ? <Video size={14} /> : <Mic size={14} />}
              <span className="capitalize">{consultation.type} Consultation</span>
            </div>
          </div>
        </div>

        {/* Action CTAs */}
        <div className="mt-6 grid grid-cols-2 gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-gray-200 py-2.5 px-3 text-xs font-bold text-gray-700 hover:bg-gray-50 active:scale-95 cursor-pointer"
          >
            Close
          </button>

          <button
            type="button"
            onClick={onViewConsultations}
            className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#24833A] py-2.5 px-3 text-xs font-bold text-white shadow-xs hover:bg-[#1e6e30] active:scale-95 cursor-pointer"
          >
            <span>My Consultations</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
