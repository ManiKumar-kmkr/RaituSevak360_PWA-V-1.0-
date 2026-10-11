"use client";

import React from "react";
import {
  X,
  User,
  Phone,
  MapPin,
  Calendar,
  Clock,
  Video,
  Mic,
  FileText,
  CheckCircle2,
  AlertCircle,
  Play,
  ArrowRight,
  Sprout,
  Award,
} from "lucide-react";
import { ExpertConsultation } from "@/types/expert";

interface ConsultationDetailsModalProps {
  consultation: ExpertConsultation | null;
  isOpen: boolean;
  onClose: () => void;
  onStartCall: (consultation: ExpertConsultation) => void;
  onViewSummary: (consultation: ExpertConsultation) => void;
}

export default function ConsultationDetailsModal({
  consultation,
  isOpen,
  onClose,
  onStartCall,
  onViewSummary,
}: ConsultationDetailsModalProps) {
  if (!isOpen || !consultation) return null;

  const isUpcoming =
    consultation.status === "upcoming" || consultation.status === "in_progress";

  const getStatusBadge = (status: ExpertConsultation["status"]) => {
    switch (status) {
      case "upcoming":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-[10px] font-bold text-amber-800 border border-amber-200">
            <Clock size={11} />
            Upcoming Session
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
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs animate-in fade-in duration-150 overflow-y-auto"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="consultation-details-title"
    >
      <div
        className="w-full max-w-lg rounded-2xl border border-gray-200 bg-white p-5 sm:p-6 shadow-2xl animate-in zoom-in-95 duration-150 my-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-gray-100 pb-3.5">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-mono font-bold text-[#174D25]">
                {consultation.id}
              </span>
              <span className="text-gray-300">•</span>
              {getStatusBadge(consultation.status)}
            </div>
            <h2
              id="consultation-details-title"
              className="text-base sm:text-lg font-bold text-gray-900 mt-1"
            >
              Consultation Details
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-xl text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition cursor-pointer"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content Body */}
        <div className="mt-4 flex flex-col gap-4 text-xs text-gray-700 max-h-[68vh] overflow-y-auto pr-1">
          {/* Farmer Info Card */}
          <div className="rounded-2xl border border-gray-100 bg-[#F7F9F6] p-4 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#E4F0DD] text-[#24833A] font-bold text-sm">
                {consultation.farmerName.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-900">
                  {consultation.farmerName}
                </h3>
                <div className="flex items-center gap-2 text-gray-500 mt-0.5">
                  <MapPin size={12} className="text-[#24833A]" />
                  <span>
                    {consultation.village}, {consultation.mandal}, {consultation.district}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-gray-500 mt-0.5">
                  <Phone size={12} className="text-[#24833A]" />
                  <span>{consultation.farmerPhone}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1.5 rounded-xl bg-white px-3 py-1.5 border border-gray-200 shadow-2xs text-[#174D25] font-bold">
              {consultation.type === "video" ? <Video size={14} /> : <Mic size={14} />}
              <span className="capitalize">{consultation.type}</span>
            </div>
          </div>

          {/* Topic & Problem Description */}
          <div className="rounded-2xl border border-gray-200 p-4">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#174D25] mb-1">
              <Sprout size={15} />
              <span>{consultation.crop}</span>
            </div>
            <h4 className="text-sm font-bold text-gray-900">{consultation.topic}</h4>
            <p className="mt-2 text-xs text-gray-600 leading-relaxed bg-gray-50 p-3 rounded-xl border border-gray-100">
              {consultation.description}
            </p>
          </div>

          {/* Schedule Info */}
          <div className="grid grid-cols-2 gap-2.5">
            <div className="rounded-2xl bg-gray-50 p-3 border border-gray-100">
              <span className="text-[10px] text-gray-400 font-medium block">
                Scheduled Slot
              </span>
              <div className="flex items-center gap-1.5 font-bold text-gray-900 mt-0.5">
                <Clock size={14} className="text-[#24833A]" />
                <span>
                  {consultation.scheduledDate}, {consultation.scheduledTimeSlot}
                </span>
              </div>
            </div>

            <div className="rounded-2xl bg-gray-50 p-3 border border-gray-100">
              <span className="text-[10px] text-gray-400 font-medium block">
                Duration & Protocol
              </span>
              <div className="flex items-center gap-1.5 font-bold text-gray-900 mt-0.5">
                <Calendar size={14} className="text-[#24833A]" />
                <span>{consultation.durationMinutes} Minutes Allotted</span>
              </div>
            </div>
          </div>

          {/* Pre-consultation Notes */}
          {consultation.notes && (
            <div className="rounded-2xl bg-blue-50/70 p-3.5 text-xs border border-blue-200/80 text-blue-900">
              <span className="font-bold block mb-0.5">Session Preparation Notes:</span>
              <p className="leading-relaxed text-blue-800">{consultation.notes}</p>
            </div>
          )}

          {/* Completed Summary Snapshot if available */}
          {consultation.summary && (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-[#174D25] flex items-center gap-1.5">
                  <CheckCircle2 size={14} />
                  <span>Agri Advisory Summary</span>
                </span>
                <span className="text-[10px] font-bold text-gray-500">
                  {consultation.summary.completedAt}
                </span>
              </div>
              <p className="text-xs text-gray-800 font-medium mb-2">
                <strong>Crop Assessment:</strong> {consultation.summary.issueDiagnosed}
              </p>
              <div className="text-[11px] text-gray-600 line-clamp-2">
                {consultation.summary.clinicalNotes}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="mt-5 flex items-center justify-end gap-2.5 pt-3.5 border-t border-gray-100 flex-wrap">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-gray-200 px-4 py-2.5 text-xs font-bold text-gray-700 hover:bg-gray-50 active:scale-95 cursor-pointer"
          >
            Close
          </button>

          {consultation.summary && (
            <button
              type="button"
              onClick={() => onViewSummary(consultation)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-[#24833A] bg-white px-4 py-2.5 text-xs font-bold text-[#174D25] hover:bg-[#E4F0DD]/50 active:scale-95 cursor-pointer"
            >
              <FileText size={14} />
              <span>View Full Summary</span>
            </button>
          )}

          {isUpcoming && (
            <button
              type="button"
              onClick={() => onStartCall(consultation)}
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#24833A] px-5 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-[#1e6e30] active:scale-95 cursor-pointer"
            >
              <Video size={14} />
              <span>Start Consultation Call</span>
              <ArrowRight size={13} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
