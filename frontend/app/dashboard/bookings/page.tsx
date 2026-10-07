"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Tractor,
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  ShieldCheck,
  CheckCircle2,
  Phone,
  Eye,
  X,
  ArrowRight,
  UserCheck,
  Fuel,
  Info,
} from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { useCartStore } from "@/store/cart-store";
import { EquipmentBooking } from "@/types/marketplace";
import BackButton from "@/components/ui/BackButton";

export default function BookingsPage() {
  const { t } = useTranslation();
  const router = useRouter();

  const bookings = useCartStore((state) => state.bookings);
  const [selectedBooking, setSelectedBooking] = useState<EquipmentBooking | null>(null);

  const getStatusBadge = (status: EquipmentBooking["status"]) => {
    switch (status) {
      case "confirmed":
        return {
          label: "Booking Confirmed",
          color: "bg-emerald-50 text-[#24833A] border-emerald-200",
          icon: <CheckCircle2 size={12} />,
        };
      case "completed":
        return {
          label: "Completed",
          color: "bg-teal-50 text-teal-700 border-teal-200",
          icon: <ShieldCheck size={12} />,
        };
      case "cancelled":
        return {
          label: "Cancelled",
          color: "bg-red-50 text-red-700 border-red-200",
          icon: <X size={12} />,
        };
      default:
        return {
          label: "Confirmed",
          color: "bg-emerald-50 text-[#24833A] border-emerald-200",
          icon: <CheckCircle2 size={12} />,
        };
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-5 pb-24">
      {/* Top Breadcrumb Navigation */}
      <div className="flex items-center justify-between">
        <BackButton
          id="bookings-back-link"
          href="/dashboard/profile"
          label="Back to Profile"
        />

        <Link
          href="/dashboard/machinery"
          className="text-xs font-bold text-[#24833A] hover:underline cursor-pointer"
        >
          Equipment Catalog →
        </Link>
      </div>

      {/* Screen Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-3xl bg-white p-5 border border-gray-200 shadow-2xs">
        <div className="flex items-center gap-3.5">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#E4F0DD] text-[#24833A] shadow-xs">
            <Tractor size={26} strokeWidth={2.4} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-bold text-gray-900">
                My Equipment Bookings
              </h1>
              <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-[#24833A]">
                CHC Rentals
              </span>
            </div>
            <p className="text-xs text-gray-500 font-medium">
              Manage your tractor rentals, harvesters, drone sprayers & implements
            </p>
          </div>
        </div>

        {/* Total Bookings Metric Badge */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="rounded-2xl border border-gray-200 bg-gray-50 px-3.5 py-1.5 text-center">
            <span className="text-[10px] uppercase font-bold text-gray-400">Total Bookings</span>
            <p className="text-sm font-extrabold text-[#174D25]">{bookings.length}</p>
          </div>
        </div>
      </div>

      {/* Bookings List or Empty State */}
      {bookings.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-4 rounded-3xl border border-gray-200/90 bg-white p-10 text-center shadow-2xs">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#E4F0DD] text-[#24833A]">
            <Tractor size={32} />
          </div>
          <div className="max-w-xs">
            <h2 className="text-base font-bold text-gray-900">No equipment bookings yet</h2>
            <p className="mt-1 text-xs text-gray-500">
              You haven&apos;t booked any farm machinery or tractors yet. Explore custom hiring
              centers (CHC) and equipment sharing nearby.
            </p>
          </div>
          <Link
            href="/dashboard/machinery"
            className="mt-2 inline-flex items-center gap-2 rounded-2xl bg-[#24833A] px-5 py-3 text-xs font-bold text-white shadow-xs hover:bg-[#1e6e30] transition active:scale-95 cursor-pointer"
          >
            <span>Browse Equipment</span>
            <ArrowRight size={15} />
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-3.5">
          {bookings.map((booking) => {
            const statusMeta = getStatusBadge(booking.status);
            const createdFormatted = new Date(booking.createdAt).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
              year: "numeric",
            });

            return (
              <div
                key={booking.id}
                className="flex flex-col justify-between rounded-3xl border border-gray-200/90 bg-white p-4 sm:p-5 shadow-2xs transition-all hover:border-[#24833A]/40"
              >
                {/* Header Row */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 pb-3">
                  <div>
                    <span className="font-mono text-xs font-extrabold text-gray-900">
                      {booking.id}
                    </span>
                    <span className="text-[11px] text-gray-400 ml-2">
                      Booked on {createdFormatted}
                    </span>
                  </div>

                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-bold ${statusMeta.color}`}
                  >
                    {statusMeta.icon}
                    <span>{statusMeta.label}</span>
                  </span>
                </div>

                {/* Equipment & Schedule Details */}
                <div className="mt-3 flex flex-col gap-2">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#E4F0DD] text-[#24833A]">
                      <Tractor size={20} />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-gray-900">
                        {booking.equipmentName}
                      </h3>
                      <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-600">
                        <span className="inline-flex items-center gap-1">
                          <Calendar size={13} className="text-[#24833A]" />
                          <span>
                            Start: {booking.startDate} ({booking.durationDays} Day
                            {booking.durationDays > 1 ? "s" : ""})
                          </span>
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <MapPin size={13} className="text-[#24833A]" />
                          <span>{booking.farmLocation}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer Row: Estimated Amount & View Booking CTA */}
                <div className="mt-4 pt-3 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] text-gray-400 uppercase font-bold">
                      Estimated Rental Total
                    </span>
                    <p className="text-base font-extrabold text-[#174D25]">
                      ₹{booking.totalEstimatedAmount.toLocaleString("en-IN")}
                      <span className="text-[11px] font-normal text-gray-500 ml-1.5">
                        (Pay on Arrival)
                      </span>
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setSelectedBooking(booking)}
                    className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-gray-200 bg-white px-4 py-2 text-xs font-bold text-gray-700 shadow-2xs hover:border-[#24833A] hover:bg-[#E4F0DD] hover:text-[#174D25] transition active:scale-95 cursor-pointer"
                  >
                    <Eye size={13} />
                    <span>View Booking Details</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Booking Details Modal */}
      {selectedBooking && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs animate-in fade-in duration-150"
          onClick={() => setSelectedBooking(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="w-full max-w-md rounded-3xl border border-gray-200 bg-white p-6 shadow-xl animate-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-gray-900">Equipment Booking Details</h3>
                <span className="font-mono text-xs font-bold text-[#24833A]">
                  {selectedBooking.id}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedBooking(null)}
                className="flex h-8 w-8 items-center justify-center rounded-xl text-gray-400 hover:bg-gray-100 cursor-pointer"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            <div className="mt-4 flex flex-col gap-3.5 text-xs text-gray-700">
              {/* Equipment Banner */}
              <div className="rounded-2xl bg-[#E4F0DD]/40 border border-emerald-100 p-3.5 flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-[#24833A] shadow-xs">
                  <Tractor size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-sm">
                    {selectedBooking.equipmentName}
                  </h4>
                  <p className="text-[11px] text-gray-600">
                    Government Subsidized Custom Hiring Center Unit
                  </p>
                </div>
              </div>

              {/* Booking Specifications Card */}
              <div className="rounded-2xl bg-gray-50 p-3.5 flex flex-col gap-2">
                <div className="flex justify-between">
                  <span className="text-gray-500">Rental Start Date:</span>
                  <span className="font-bold text-gray-900">{selectedBooking.startDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Rental Duration:</span>
                  <span className="font-bold text-gray-900">
                    {selectedBooking.durationDays} Day
                    {selectedBooking.durationDays > 1 ? "s" : ""} (Full Shift)
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Farmer / Hirer:</span>
                  <span className="font-bold text-gray-900">{selectedBooking.farmerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Contact Number:</span>
                  <span className="font-bold text-gray-900">
                    +91 {selectedBooking.contactMobile}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Farm Location:</span>
                  <span className="font-bold text-gray-900 text-right max-w-[200px]">
                    {selectedBooking.farmLocation}
                  </span>
                </div>
              </div>

              {/* Financial Breakdown */}
              <div className="rounded-2xl border border-gray-100 p-3.5 flex flex-col gap-1.5">
                <div className="flex justify-between">
                  <span className="text-gray-500">Estimated Rate:</span>
                  <span className="font-semibold text-gray-800">
                    ₹{(selectedBooking.totalEstimatedAmount / selectedBooking.durationDays).toLocaleString("en-IN")} / day
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Operator:</span>
                  <span className="font-semibold text-emerald-800">Included (Certified)</span>
                </div>
                <div className="pt-2 border-t border-gray-200 flex justify-between font-extrabold text-sm text-[#174D25]">
                  <span>Total Estimated Cost:</span>
                  <span>₹{selectedBooking.totalEstimatedAmount.toLocaleString("en-IN")}</span>
                </div>
              </div>

              {/* Arrival notice */}
              <div className="flex items-start gap-2 rounded-xl bg-blue-50/70 p-3 text-[11px] text-blue-800 border border-blue-100">
                <Info size={16} className="shrink-0 text-blue-600 mt-0.5" />
                <span>
                  The machinery operator will arrive at your specified farm survey plot on the
                  scheduled morning. Please ensure field access is clear.
                </span>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-gray-100 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedBooking(null)}
                className="rounded-xl bg-[#24833A] px-5 py-2 text-xs font-bold text-white hover:bg-[#1e6e30] cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
