"use client";

import React, { useState } from "react";
import {
  UsersRound,
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Eye,
  X,
  Search,
} from "lucide-react";
import { LabourBooking } from "@/types/labour";
import { useCartStore } from "@/store/cart-store";

interface LabourBookingsViewProps {
  onFindWorkers: () => void;
}

export default function LabourBookingsView({
  onFindWorkers,
}: LabourBookingsViewProps) {
  const labourBookings = useCartStore((state) => state.labourBookings || []);
  const [selectedBooking, setSelectedBooking] = useState<LabourBooking | null>(
    null
  );

  const getStatusBadge = (status: LabourBooking["status"]) => {
    switch (status) {
      case "confirmed":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-[#24833A] shrink-0">
            <CheckCircle2 size={11} />
            Confirmed
          </span>
        );
      case "in_progress":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-0.5 text-[10px] font-bold text-blue-700 shrink-0">
            <Clock size={11} />
            In Progress
          </span>
        );
      case "completed":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-0.5 text-[10px] font-bold text-gray-700 shrink-0">
            <CheckCircle2 size={11} />
            Completed
          </span>
        );
      case "cancelled":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2.5 py-0.5 text-[10px] font-bold text-rose-700 shrink-0">
            <XCircle size={11} />
            Cancelled
          </span>
        );
      default:
        return null;
    }
  };

  if (labourBookings.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-gray-300 bg-white p-12 text-center shadow-2xs">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#E4F0DD] text-[#24833A] mb-4">
          <UsersRound size={32} />
        </div>
        <h3 className="text-base font-bold text-gray-900">
          No Labour Bookings Yet
        </h3>
        <p className="mt-1 max-w-sm text-xs text-gray-500 leading-relaxed">
          You haven&apos;t booked any agricultural crews yet. Discover verified harvest, sowing, and spraying teams in your area.
        </p>
        <button
          type="button"
          onClick={onFindWorkers}
          className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#24833A] px-5 py-2.5 text-xs font-bold text-white shadow-xs transition hover:bg-[#1e6e30] active:scale-95 cursor-pointer"
        >
          <Search size={14} />
          <span>Find Farm Workers</span>
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 w-full h-auto min-h-0">
      {labourBookings.map((booking) => (
        <div
          key={booking.id}
          className="w-full h-auto min-h-0 flex flex-col justify-between rounded-3xl border border-gray-200 bg-white p-4 sm:p-5 shadow-2xs transition hover:border-[#24833A]/40 overflow-hidden"
        >
          {/* Header Row: ID, Date, Name, Work Type, Status Badge */}
          <div className="flex items-start justify-between gap-3 min-w-0">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-extrabold text-[#174D25] shrink-0">
                  {booking.id}
                </span>
                <span className="text-gray-300 shrink-0">•</span>
                <span className="text-[11px] text-gray-400 shrink-0">
                  {new Date(booking.createdAt).toLocaleDateString("en-IN", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>
              <h3 className="text-sm font-bold text-gray-900 mt-1 break-words">
                {booking.workerName}
              </h3>
              {booking.farmerName && booking.farmerName !== booking.workerName && (
                <p className="text-[11px] font-medium text-gray-500 break-words">
                  Farmer: <span className="text-gray-700 font-semibold">{booking.farmerName}</span>
                </p>
              )}
              <p className="text-xs font-medium text-gray-500 break-words">
                {booking.workType}
              </p>
            </div>

            <div className="shrink-0 self-start">
              {getStatusBadge(booking.status)}
            </div>
          </div>

          {/* Schedule & Location */}
          <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 rounded-2xl bg-gray-50 p-3 text-xs text-gray-600 border border-gray-100 min-w-0">
            <div className="flex items-center gap-2 min-w-0">
              <Calendar size={14} className="text-[#24833A] flex-shrink-0" />
              <span className="break-words">
                Date: <strong>{booking.startDate}</strong> ({booking.durationDays} {booking.durationDays === 1 ? "day" : "days"})
              </span>
            </div>

            <div className="flex items-center gap-2 min-w-0">
              <MapPin size={14} className="text-[#24833A] flex-shrink-0" />
              <span className="truncate" title={booking.farmLocation}>
                {booking.farmLocation}
              </span>
            </div>
          </div>

          {/* Footer: Amount & View Action */}
          <div className="mt-3.5 flex items-center justify-between border-t border-gray-100 pt-3 flex-wrap gap-2">
            <div className="min-w-0">
              <span className="text-[10px] text-gray-400 font-medium block">
                Total Wage
              </span>
              <span className="text-sm font-extrabold text-[#174D25]">
                ₹{booking.totalAmount}
              </span>
            </div>

            <button
              type="button"
              onClick={() => setSelectedBooking(booking)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3.5 py-1.5 text-xs font-bold text-gray-700 hover:bg-gray-50 active:scale-95 cursor-pointer shrink-0"
            >
              <Eye size={13} />
              <span>View Details</span>
            </button>
          </div>
        </div>
      ))}

      {/* Booking Details Modal */}
      {selectedBooking && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs animate-in fade-in duration-150 overflow-y-auto"
          onClick={() => setSelectedBooking(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-5 sm:p-6 shadow-2xl animate-in zoom-in-95 duration-150 my-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-gray-900">
                  Labour Booking Details
                </h3>
                <span className="text-[11px] text-gray-400">
                  {selectedBooking.id}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedBooking(null)}
                className="flex h-9 w-9 items-center justify-center rounded-xl text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition cursor-pointer"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            <div className="mt-4 flex flex-col gap-3 text-xs text-gray-700">
              <div className="flex justify-between border-b border-gray-100 pb-2">
                <span className="text-gray-500">Worker / Crew</span>
                <span className="font-bold text-gray-900">
                  {selectedBooking.workerName}
                </span>
              </div>

              <div className="flex justify-between border-b border-gray-100 pb-2">
                <span className="text-gray-500">Operation</span>
                <span className="font-semibold text-gray-800">
                  {selectedBooking.workType}
                </span>
              </div>

              <div className="flex justify-between border-b border-gray-100 pb-2">
                <span className="text-gray-500">Start Date</span>
                <span className="font-semibold text-gray-800">
                  {selectedBooking.startDate}
                </span>
              </div>

              <div className="flex justify-between border-b border-gray-100 pb-2">
                <span className="text-gray-500">Duration</span>
                <span className="font-semibold text-gray-800">
                  {selectedBooking.durationDays} Days (₹{selectedBooking.dailyRate}/day)
                </span>
              </div>

              <div className="flex justify-between border-b border-gray-100 pb-2">
                <span className="text-gray-500">Farm Location</span>
                <span className="font-medium text-gray-800 text-right max-w-[200px]">
                  {selectedBooking.farmLocation}
                </span>
              </div>

              <div className="flex justify-between border-b border-gray-100 pb-2">
                <span className="text-gray-500">Farmer Contact</span>
                <span className="font-medium text-gray-800">
                  {selectedBooking.farmerName} ({selectedBooking.farmerPhone})
                </span>
              </div>

              {selectedBooking.specialNotes && (
                <div className="rounded-xl bg-gray-50 p-2.5 text-gray-600">
                  <span className="font-bold text-gray-700 block mb-0.5">
                    Instructions:
                  </span>
                  {selectedBooking.specialNotes}
                </div>
              )}

              <div className="flex justify-between pt-1 text-sm font-extrabold text-[#174D25]">
                <span>Total Wage Amount</span>
                <span>₹{selectedBooking.totalAmount}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setSelectedBooking(null)}
              className="mt-5 w-full rounded-xl bg-gray-100 py-2.5 text-xs font-bold text-gray-700 hover:bg-gray-200 cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
