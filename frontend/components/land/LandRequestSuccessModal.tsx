"use client";

import React from "react";
import { CheckCircle2, Trees, Calendar, ArrowRight, ShieldCheck, Clock } from "lucide-react";
import { LandRentalRequest } from "@/types/land";

interface LandRequestSuccessModalProps {
  request: LandRentalRequest | null;
  isOpen: boolean;
  onClose: () => void;
  onViewRequests: () => void;
}

export default function LandRequestSuccessModal({
  request,
  isOpen,
  onClose,
  onViewRequests,
}: LandRequestSuccessModalProps) {
  if (!isOpen || !request) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs animate-in fade-in duration-150 overflow-y-auto"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="land-success-title"
    >
      <div
        className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-5 sm:p-6 shadow-2xl animate-in zoom-in-95 duration-150 my-6 text-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Success Icon */}
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-[#24833A] mb-3">
          <CheckCircle2 size={36} strokeWidth={2.4} />
        </div>

        {/* Clear Request Submitted vs Confirmed distinction */}
        <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1 text-[11px] font-bold text-amber-800">
          <Clock size={12} />
          <span>REQUEST SUBMITTED • PENDING REVIEW</span>
        </span>

        <h2
          id="land-success-title"
          className="text-lg font-extrabold text-gray-900 mt-2"
        >
          Land Rental Proposal Sent!
        </h2>
        <p className="text-xs text-gray-500 mt-0.5">
          Request ID: <strong className="text-gray-800">{request.id}</strong>
        </p>

        {/* Request Details Card */}
        <div className="mt-4 rounded-2xl border border-gray-100 bg-[#F7F9F6] p-4 text-left text-xs flex flex-col gap-2.5">
          <div className="flex items-center justify-between border-b border-gray-200/60 pb-2">
            <span className="text-gray-500 font-medium">Selected Plot</span>
            <span className="font-bold text-gray-900 truncate max-w-[200px]">
              {request.landTitle}
            </span>
          </div>

          <div className="flex items-center justify-between border-b border-gray-200/60 pb-2">
            <span className="text-gray-500 font-medium">Acreage</span>
            <span className="font-semibold text-gray-800">
              {request.acreage} Acres
            </span>
          </div>

          <div className="flex items-center justify-between border-b border-gray-200/60 pb-2">
            <span className="text-gray-500 font-medium">Season & Duration</span>
            <span className="font-semibold text-gray-800">
              {request.duration} ({request.season.split("(")[0]})
            </span>
          </div>

          <div className="flex items-center justify-between border-b border-gray-200/60 pb-2">
            <span className="text-gray-500 font-medium">Intended Crop</span>
            <span className="font-semibold text-gray-800">
              {request.intendedCrop}
            </span>
          </div>

          <div className="flex items-center justify-between pt-0.5 font-extrabold text-[#174D25] text-sm">
            <span>Estimated Lease Budget</span>
            <span className="text-base">
              ₹{request.estimatedCost.toLocaleString("en-IN")}
            </span>
          </div>
        </div>

        {/* Information note */}
        <div className="mt-3 flex items-center justify-center gap-1.5 text-[11px] text-gray-500 font-medium text-left px-2">
          <ShieldCheck size={14} className="text-[#24833A] flex-shrink-0" />
          <span>The verified land owner will review your crop proposal and contact you for field inspection.</span>
        </div>

        {/* Action Buttons */}
        <div className="mt-5 grid grid-cols-2 gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-gray-200 py-2.5 px-3 text-xs font-bold text-gray-700 hover:bg-gray-50 active:scale-95 cursor-pointer"
          >
            Browse More Land
          </button>

          <button
            type="button"
            onClick={onViewRequests}
            className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#24833A] py-2.5 px-3 text-xs font-bold text-white shadow-xs hover:bg-[#1e6e30] active:scale-95 cursor-pointer"
          >
            <span>My Requests</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
