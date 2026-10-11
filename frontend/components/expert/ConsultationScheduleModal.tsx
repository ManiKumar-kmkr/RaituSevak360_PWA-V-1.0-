"use client";

import React, { useState } from "react";
import {
  X,
  Calendar,
  Clock,
  Video,
  Mic,
  FileText,
  User,
  Sprout,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import { FarmerConnectionRequest, ConsultationType } from "@/types/expert";
import { ScheduleConsultationPayload } from "@/store/expert-store";

interface ConsultationScheduleModalProps {
  request: FarmerConnectionRequest | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirmSchedule: (payload: ScheduleConsultationPayload) => void;
}

const TIME_SLOTS = [
  "09:30 AM",
  "11:00 AM",
  "02:00 PM",
  "03:30 PM",
  "04:45 PM",
  "06:00 PM",
];

const DURATIONS = [15, 30, 45];

export default function ConsultationScheduleModal({
  request,
  isOpen,
  onClose,
  onConfirmSchedule,
}: ConsultationScheduleModalProps) {
  const [consultationType, setConsultationType] = useState<ConsultationType>(
    request?.preferredType || "video"
  );
  const defaultDate = request?.preferredDate || "Today";
  const [selectedDate, setSelectedDate] = useState<string>(defaultDate);
  const [customDate, setCustomDate] = useState<string>("");
  const [selectedSlot, setSelectedSlot] = useState<string>("03:30 PM");
  const [selectedDuration, setSelectedDuration] = useState<number>(30);
  const [agendaNotes, setAgendaNotes] = useState<string>(
    request?.problemTitle ? `Discussion on ${request.problemTitle}` : ""
  );

  if (!isOpen || !request) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const finalDate = customDate.trim() || selectedDate;
    if (!finalDate || !selectedSlot) return;

    const payload: ScheduleConsultationPayload = {
      requestId: request.id,
      farmerName: request.farmerName,
      farmerPhone: request.farmerPhone,
      village: request.village,
      mandal: request.mandal,
      district: request.district,
      crop: request.crop,
      topic: request.problemTitle,
      description: request.problemDescription,
      scheduledDate: finalDate,
      scheduledTimeSlot: selectedSlot,
      durationMinutes: selectedDuration,
      type: consultationType,
      notes: agendaNotes.trim() || undefined,
    };

    onConfirmSchedule(payload);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs animate-in fade-in duration-150 overflow-y-auto"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="schedule-modal-title"
    >
      <div
        className="w-full max-w-lg rounded-2xl border border-gray-200 bg-white p-5 sm:p-6 shadow-2xl animate-in zoom-in-95 duration-150 my-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 pb-3.5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E4F0DD] text-[#24833A]">
              <Calendar size={20} />
            </div>
            <div>
              <h2
                id="schedule-modal-title"
                className="text-base sm:text-lg font-bold text-gray-900"
              >
                Schedule Consultation
              </h2>
              <p className="text-xs text-gray-500">
                Book a dedicated 1-on-1 audio/video agronomy session
              </p>
            </div>
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

        {/* Selected Farmer Mini Card */}
        <div className="mt-4 rounded-2xl border border-gray-100 bg-[#F7F9F6] p-3.5 text-xs flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-[#24833A] font-bold shadow-2xs border border-gray-100">
              {request.farmerName.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <span className="font-bold text-gray-900 block">{request.farmerName}</span>
              <span className="text-[11px] text-gray-500">
                {request.crop} • {request.village}, {request.mandal}
              </span>
            </div>
          </div>

          <div className="text-right shrink-0">
            <span className="text-[10px] text-gray-400 uppercase font-bold block">Farmer&apos;s Preference</span>
            <span className="font-bold text-[#174D25] text-xs">
              {request.preferredDate} ({request.preferredTimeSlot.split("-")[0].trim()})
            </span>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-4 text-xs text-gray-700 max-h-[65vh] overflow-y-auto pr-1">
          {/* Consultation Mode Toggle */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">
              Consultation Mode
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setConsultationType("video")}
                className={`flex items-center justify-center gap-2 rounded-xl border p-2.5 font-bold transition cursor-pointer ${consultationType === "video"
                  ? "border-[#24833A] bg-[#F4FBF5] text-[#174D25] ring-2 ring-[#24833A]/20"
                  : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                  }`}
              >
                <Video size={16} className={consultationType === "video" ? "text-[#24833A]" : "text-gray-400"} />
                <span>Video Session</span>
              </button>

              <button
                type="button"
                onClick={() => setConsultationType("voice")}
                className={`flex items-center justify-center gap-2 rounded-xl border p-2.5 font-bold transition cursor-pointer ${consultationType === "voice"
                  ? "border-[#24833A] bg-[#F4FBF5] text-[#174D25] ring-2 ring-[#24833A]/20"
                  : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                  }`}
              >
                <Mic size={16} className={consultationType === "voice" ? "text-[#24833A]" : "text-gray-400"} />
                <span>Voice Consultation</span>
              </button>
            </div>
          </div>

          {/* Date Selector */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">
              Session Date
            </label>
            <div className="grid grid-cols-3 gap-2">
              {Array.from(new Set([request.preferredDate, "Today", "Tomorrow"])).map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => {
                    setSelectedDate(d);
                    setCustomDate("");
                  }}
                  className={`rounded-xl border py-2 text-center text-xs font-bold transition cursor-pointer truncate px-1 ${selectedDate === d && !customDate
                    ? "border-[#24833A] bg-[#24833A] text-white shadow-xs"
                    : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                    }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          {/* Time Slot Chips */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">
              Available Time Slot
            </label>
            <div className="grid grid-cols-3 gap-2">
              {TIME_SLOTS.map((slot) => {
                const isSelected = selectedSlot === slot;
                return (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setSelectedSlot(slot)}
                    className={`rounded-xl border py-2 text-center text-xs font-semibold transition cursor-pointer ${isSelected
                      ? "border-[#24833A] bg-emerald-50 text-[#174D25] ring-2 ring-[#24833A]/20 font-bold"
                      : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                      }`}
                  >
                    {slot}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Duration Selector */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">
              Expected Duration
            </label>
            <div className="flex items-center gap-2">
              {DURATIONS.map((dur) => (
                <button
                  key={dur}
                  type="button"
                  onClick={() => setSelectedDuration(dur)}
                  className={`flex-1 rounded-xl border py-2 text-center text-xs font-semibold transition cursor-pointer ${selectedDuration === dur
                    ? "border-[#24833A] bg-[#24833A] text-white font-bold shadow-xs"
                    : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                    }`}
                >
                  {dur} Minutes
                </button>
              ))}
            </div>
          </div>

          {/* Agenda Notes */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Agenda & Diagnosis Notes
            </label>
            <textarea
              rows={2}
              value={agendaNotes}
              onChange={(e) => setAgendaNotes(e.target.value)}
              placeholder="e.g. Inspect foliage for thrips damage and review pesticide schedule"
              className="w-full rounded-xl border border-gray-200 bg-white p-3 text-xs text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-[#24833A] focus:ring-2 focus:ring-[#24833A]/20 transition resize-none"
            />
          </div>

          {/* Action Row */}
          <div className="mt-2 flex items-center justify-end gap-2.5 pt-3 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-gray-200 px-4 py-2.5 text-xs font-bold text-gray-700 hover:bg-gray-50 active:scale-95 cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#24833A] px-5 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-[#1e6e30] active:scale-95 cursor-pointer"
            >
              <CheckCircle2 size={14} />
              <span>Confirm & Schedule</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
