"use client";

import React, { useState } from "react";
import {
  X,
  User,
  Phone,
  MapPin,
  Calendar,
  Clock,
  Video,
  Mic,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Sprout,
  ShieldAlert,
  ArrowRight,
  FileText,
} from "lucide-react";
import { FarmerConnectionRequest } from "@/types/expert";

interface RequestDetailsModalProps {
  request: FarmerConnectionRequest | null;
  isOpen: boolean;
  onClose: () => void;
  onAccept: (requestId: string) => void;
  onReject: (requestId: string, reason?: string) => void;
  onSchedule: (request: FarmerConnectionRequest) => void;
}

export default function RequestDetailsModal({
  request,
  isOpen,
  onClose,
  onAccept,
  onReject,
  onSchedule,
}: RequestDetailsModalProps) {
  const [isRejecting, setIsRejecting] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  if (!isOpen || !request) return null;

  const handleConfirmReject = () => {
    onReject(request.id, rejectReason.trim() || undefined);
    setIsRejecting(false);
    setRejectReason("");
  };

  const getPriorityBadge = (priority: FarmerConnectionRequest["priority"]) => {
    switch (priority) {
      case "high":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2.5 py-0.5 text-[10px] font-bold text-rose-700 border border-rose-200">
            <ShieldAlert size={11} />
            High Urgency
          </span>
        );
      case "medium":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-[10px] font-bold text-amber-700 border border-amber-200">
            Medium Priority
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-0.5 text-[10px] font-bold text-gray-700">
            Normal
          </span>
        );
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs animate-in fade-in duration-150 overflow-y-auto"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="request-details-title"
    >
      <div
        className="w-full max-w-lg rounded-2xl border border-gray-200 bg-white p-5 sm:p-6 shadow-2xl animate-in zoom-in-95 duration-150 my-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-gray-100 pb-3.5">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-[#174D25]">
                {request.id}
              </span>
              <span className="text-gray-300">•</span>
              <span className="text-[11px] text-gray-400">{request.requestDate}</span>
              {getPriorityBadge(request.priority)}
            </div>
            <h2
              id="request-details-title"
              className="text-base sm:text-lg font-bold text-gray-900 mt-1"
            >
              Farmer Connection Request
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
        <div className="mt-4 flex flex-col gap-4 text-xs text-gray-700 max-h-[70vh] overflow-y-auto pr-1">
          {/* Farmer Card */}
          <div className="rounded-2xl border border-gray-100 bg-[#F7F9F6] p-4 flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#E4F0DD] text-[#24833A] font-bold text-sm">
                {request.farmerName.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-900">{request.farmerName}</h3>
                <div className="flex items-center gap-2 text-gray-500 mt-0.5">
                  <MapPin size={12} className="text-[#24833A]" />
                  <span>
                    {request.village}, {request.mandal}, {request.district}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-gray-500 mt-0.5">
                  <Phone size={12} className="text-[#24833A]" />
                  <span>{request.farmerPhone}</span>
                  <span>•</span>
                  <span>{request.farmSizeAcres} Acres Farm</span>
                </div>
              </div>
            </div>

            <span
              className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold capitalize ${
                request.status === "accepted"
                  ? "bg-emerald-50 text-[#24833A] border border-emerald-200"
                  : request.status === "rejected"
                  ? "bg-rose-50 text-rose-700 border border-rose-200"
                  : "bg-amber-50 text-amber-800 border border-amber-200"
              }`}
            >
              {request.status}
            </span>
          </div>

          {/* Problem & Crop Section */}
          <div className="rounded-2xl border border-gray-200 p-4">
            <div className="flex items-center gap-2 text-xs font-bold text-gray-900 mb-1">
              <Sprout size={16} className="text-[#24833A]" />
              <span>
                {request.crop} ({request.cropStage})
              </span>
            </div>
            <h4 className="text-sm font-bold text-gray-900 mt-1">
              {request.problemTitle}
            </h4>
            <p className="mt-2 text-xs text-gray-600 leading-relaxed bg-gray-50 p-3 rounded-xl border border-gray-100">
              {request.problemDescription}
            </p>
          </div>

          {/* Preferred Consultation Details */}
          <div className="grid grid-cols-2 gap-2.5">
            <div className="rounded-2xl bg-gray-50 p-3 border border-gray-100">
              <span className="text-[10px] text-gray-400 font-medium block">
                Preferred Mode
              </span>
              <div className="flex items-center gap-1.5 font-bold text-gray-900 mt-0.5">
                {request.preferredType === "video" ? (
                  <Video size={14} className="text-[#24833A]" />
                ) : (
                  <Mic size={14} className="text-[#24833A]" />
                )}
                <span className="capitalize">{request.preferredType} Consultation</span>
              </div>
            </div>

            <div className="rounded-2xl bg-gray-50 p-3 border border-gray-100">
              <span className="text-[10px] text-gray-400 font-medium block">
                Requested Slot
              </span>
              <div className="flex items-center gap-1.5 font-bold text-gray-900 mt-0.5">
                <Clock size={14} className="text-[#24833A]" />
                <span>
                  {request.preferredDate}, {request.preferredTimeSlot.split("-")[0]}
                </span>
              </div>
            </div>
          </div>

          {/* Rejection notice if already rejected */}
          {request.status === "rejected" && request.rejectionReason && (
            <div className="rounded-xl bg-rose-50 p-3 text-rose-800 border border-rose-200 text-xs">
              <span className="font-bold block mb-0.5">Rejection Reason:</span>
              <p>{request.rejectionReason}</p>
            </div>
          )}

          {/* Rejection input prompt if active */}
          {isRejecting && (
            <div className="rounded-xl border border-rose-200 bg-rose-50/50 p-3 text-xs">
              <label className="block font-bold text-rose-900 mb-1">
                Reason for declining (optional):
              </label>
              <input
                type="text"
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="e.g. Outside mandal jurisdiction / slot booked"
                className="h-9 w-full rounded-lg border border-rose-300 bg-white px-2.5 text-xs text-gray-800 focus:outline-none"
              />
              <div className="mt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsRejecting(false)}
                  className="px-2.5 py-1 text-xs font-semibold text-gray-600 hover:text-gray-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmReject}
                  className="rounded-lg bg-rose-600 px-3 py-1 text-xs font-bold text-white shadow-2xs hover:bg-rose-700 cursor-pointer"
                >
                  Confirm Decline
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        {!isRejecting && (
          <div className="mt-5 flex items-center justify-end gap-2.5 pt-3.5 border-t border-gray-100 flex-wrap">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-gray-200 px-4 py-2.5 text-xs font-bold text-gray-700 hover:bg-gray-50 active:scale-95 cursor-pointer"
            >
              Close
            </button>

            {request.status === "pending" && (
              <>
                <button
                  type="button"
                  onClick={() => setIsRejecting(true)}
                  className="rounded-xl border border-rose-200 bg-rose-50/70 px-4 py-2.5 text-xs font-bold text-rose-700 hover:bg-rose-100 active:scale-95 cursor-pointer"
                >
                  Reject Request
                </button>

                <button
                  type="button"
                  onClick={() => onAccept(request.id)}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-[#24833A] px-5 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-[#1e6e30] active:scale-95 cursor-pointer"
                >
                  <CheckCircle2 size={14} />
                  <span>Accept Request</span>
                </button>
              </>
            )}

            {request.status === "accepted" && (
              <button
                type="button"
                onClick={() => onSchedule(request)}
                className="inline-flex items-center gap-1.5 rounded-xl bg-[#24833A] px-5 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-[#1e6e30] active:scale-95 cursor-pointer"
              >
                <Calendar size={14} />
                <span>Schedule Consultation</span>
                <ArrowRight size={13} />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
