"use client";

import React from "react";
import { CheckCircle2, Calendar, MapPin, Phone, ArrowRight, ShieldCheck } from "lucide-react";
import { LabourBooking } from "@/types/labour";

interface LabourBookingSuccessModalProps {
  booking: LabourBooking | null;
  isOpen: boolean;
  onClose: () => void;
  onViewBookings: () => void;
}

export default function LabourBookingSuccessModal({
  booking,
  isOpen,
  onClose,
  onViewBookings,
}: LabourBookingSuccessModalProps) {
  if (!isOpen || !booking) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs animate-in fade-in duration-150 overflow-y-auto"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="labour-success-title"
    >
      <div
        className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-5 sm:p-6 shadow-2xl animate-in zoom-in-95 duration-150 my-6 text-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Success Icon */}
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-[#24833A] mb-3">
          <CheckCircle2 size={36} strokeWidth={2.4} />
        </div>

        <span className="rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-bold text-[#24833A]">
          Booking Confirmed
        </span>

        <h2
          id="labour-success-title"
          className="text-lg font-extrabold text-gray-900 mt-2"
        >
          Farm Labour Scheduled!
        </h2>
        <p className="text-xs text-gray-500 mt-0.5">
          Booking ID: <strong className="text-gray-800">{booking.id}</strong>
        </p>

        {/* Booking Details Card */}
        <div className="mt-4 rounded-2xl border border-gray-100 bg-[#F7F9F6] p-4 text-left text-xs flex flex-col gap-2.5">
          <div className="flex items-center justify-between border-b border-gray-200/60 pb-2">
            <span className="text-gray-500 font-medium">Assigned Worker</span>
            <span className="font-bold text-gray-900">{booking.workerName}</span>
          </div>

          <div className="flex items-center justify-between border-b border-gray-200/60 pb-2">
            <span className="text-gray-500 font-medium">Work Specialization</span>
            <span className="font-semibold text-gray-800">{booking.workType}</span>
          </div>

          <div className="flex items-center justify-between border-b border-gray-200/60 pb-2">
            <span className="text-gray-500 font-medium">Schedule</span>
            <span className="font-semibold text-gray-800">
              {booking.startDate} ({booking.durationDays} {booking.durationDays === 1 ? "Day" : "Days"})
            </span>
          </div>

          <div className="flex items-center justify-between border-b border-gray-200/60 pb-2">
            <span className="text-gray-500 font-medium">Farm Location</span>
            <span className="font-medium text-gray-700 truncate max-w-[180px]">
              {booking.farmLocation}
            </span>
          </div>

          <div className="flex items-center justify-between pt-0.5 font-extrabold text-[#174D25] text-sm">
            <span>Total Wage Payable</span>
            <span className="text-base">₹{booking.totalAmount}</span>
          </div>
        </div>

        {/* Protection Pill */}
        <div className="mt-3 flex items-center justify-center gap-1.5 text-[11px] text-gray-500 font-medium">
          <ShieldCheck size={14} className="text-[#24833A]" />
          <span>Payment settled directly to worker after field inspection</span>
        </div>

        {/* Action Buttons */}
        <div className="mt-5 grid grid-cols-2 gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-gray-200 py-2.5 px-3 text-xs font-bold text-gray-700 hover:bg-gray-50 active:scale-95 cursor-pointer"
          >
            Back to Labour
          </button>

          <button
            type="button"
            onClick={onViewBookings}
            className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#24833A] py-2.5 px-3 text-xs font-bold text-white shadow-xs hover:bg-[#1e6e30] active:scale-95 cursor-pointer"
          >
            <span>My Bookings</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
