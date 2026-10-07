"use client";

import React, { useState } from "react";
import {
  X,
  Calendar,
  Clock,
  MapPin,
  Phone,
  User,
  Plus,
  Minus,
  CheckCircle2,
  FileText,
} from "lucide-react";
import { LabourWorker, LabourBooking } from "@/types/labour";
import { useCartStore } from "@/store/cart-store";
import WorkerAvatar from "./WorkerAvatar";

interface LabourBookingModalProps {
  worker: LabourWorker | null;
  isOpen: boolean;
  onClose: () => void;
  onBookingSuccess: (booking: LabourBooking) => void;
}

export default function LabourBookingModal({
  worker,
  isOpen,
  onClose,
  onBookingSuccess,
}: LabourBookingModalProps) {
  const addLabourBooking = useCartStore((state) => state.addLabourBooking);
  const deliveryAddress = useCartStore((state) => state.deliveryAddress);

  // Tomorrow as default start date
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const defaultDateStr = tomorrow.toISOString().split("T")[0];

  const [workType, setWorkType] = useState<string>("Harvesting Crew");
  const [startDate, setStartDate] = useState<string>(defaultDateStr);
  const [durationDays, setDurationDays] = useState<number>(3);
  const [farmerName, setFarmerName] = useState<string>(
    deliveryAddress?.fullName || "Ramesh Kumar Reddy"
  );
  const [farmerPhone, setFarmerPhone] = useState<string>(
    deliveryAddress?.phone || "9876543210"
  );
  const [farmLocation, setFarmLocation] = useState<string>(
    deliveryAddress
      ? `${deliveryAddress.street}, ${deliveryAddress.village}, ${deliveryAddress.mandal}`
      : "Survey No. 42, Farm Gate Road, Madikonda, Kazipet"
  );
  const [specialNotes, setSpecialNotes] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !worker) return null;

  // Dynamic cost calculation
  const totalAmount = worker.dailyRate * durationDays;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const bookingId = `RS360-LAB-${Math.floor(10000 + Math.random() * 90000)}`;

    const newBooking: LabourBooking = {
      id: bookingId,
      workerId: worker.id,
      workerName: worker.name,
      workerAvatar: worker.avatar,
      workType,
      startDate,
      durationDays,
      dailyRate: worker.dailyRate,
      totalAmount,
      farmLocation,
      farmerName,
      farmerPhone,
      specialNotes: specialNotes.trim() || undefined,
      status: "confirmed",
      createdAt: new Date().toISOString(),
    };

    // Save to persistent Zustand store
    addLabourBooking(newBooking);

    setTimeout(() => {
      setIsSubmitting(false);
      onBookingSuccess(newBooking);
    }, 400);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-in fade-in duration-150 overflow-y-auto"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="labour-booking-title"
    >
      <div
        className="w-full max-w-lg rounded-3xl border border-gray-200 bg-white p-6 shadow-xl animate-in zoom-in-95 duration-150 my-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 pb-3.5">
          <div className="flex items-center gap-3">
            <WorkerAvatar
              name={worker.name}
              avatarText={worker.avatar}
              crewSize={worker.crewSize}
              verified={worker.verified}
              size="sm"
            />
            <div>
              <h2
                id="labour-booking-title"
                className="text-sm sm:text-base font-bold text-gray-900"
              >
                Book Farm Labour
              </h2>
              <p className="text-[11px] text-gray-500">
                {worker.name} • {worker.specialization}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-xl text-gray-400 hover:bg-gray-100 hover:text-gray-700 cursor-pointer"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Booking Form */}
        <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-3.5">
          {/* Work Specialization Select */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Work Specialization
            </label>
            <select
              value={workType}
              onChange={(e) => setWorkType(e.target.value)}
              className="h-10 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 text-xs text-gray-800 focus:bg-white focus:border-[#24833A] focus:outline-none"
            >
              <option value="Harvesting Crew">
                Harvesting & Post-Harvest Cutting
              </option>
              <option value="Transplanting & Sowing">
                Transplanting & Seed Sowing
              </option>
              <option value="Weeding & Spraying">
                Weeding & Protective Spraying
              </option>
              <option value="General Farm Support">
                General Farm Labour & Canal Work
              </option>
            </select>
          </div>

          {/* Dates & Duration Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Start Date
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={startDate}
                  min={new Date().toISOString().split("T")[0]}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="h-10 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 text-xs text-gray-800 focus:bg-white focus:border-[#24833A] focus:outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Duration (Days)
              </label>
              <div className="flex h-10 items-center justify-between rounded-xl border border-gray-200 bg-gray-50 px-2">
                <button
                  type="button"
                  onClick={() => setDurationDays((d) => Math.max(1, d - 1))}
                  className="flex h-7 w-7 items-center justify-center rounded-lg bg-white text-gray-700 shadow-2xs hover:bg-gray-100 cursor-pointer active:scale-90"
                  aria-label="Decrease days"
                >
                  <Minus size={14} />
                </button>
                <span className="text-xs font-extrabold text-gray-900">
                  {durationDays} {durationDays === 1 ? "Day" : "Days"}
                </span>
                <button
                  type="button"
                  onClick={() => setDurationDays((d) => Math.min(30, d + 1))}
                  className="flex h-7 w-7 items-center justify-center rounded-lg bg-white text-gray-700 shadow-2xs hover:bg-gray-100 cursor-pointer active:scale-90"
                  aria-label="Increase days"
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>
          </div>

          {/* Farmer Contact & Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Farmer Contact Name
              </label>
              <input
                type="text"
                value={farmerName}
                onChange={(e) => setFarmerName(e.target.value)}
                className="h-10 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 text-xs text-gray-800 focus:bg-white focus:border-[#24833A] focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Mobile Number
              </label>
              <input
                type="tel"
                value={farmerPhone}
                onChange={(e) => setFarmerPhone(e.target.value)}
                className="h-10 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 text-xs text-gray-800 focus:bg-white focus:border-[#24833A] focus:outline-none"
                required
              />
            </div>
          </div>

          {/* Farm Location */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Farm Location & Landmark
            </label>
            <input
              type="text"
              value={farmLocation}
              onChange={(e) => setFarmLocation(e.target.value)}
              className="h-10 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 text-xs text-gray-800 focus:bg-white focus:border-[#24833A] focus:outline-none"
              required
            />
          </div>

          {/* Special Notes (Optional) */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Special Instructions / Crop Details (Optional)
            </label>
            <textarea
              value={specialNotes}
              onChange={(e) => setSpecialNotes(e.target.value)}
              placeholder="e.g. Bring own sickles, reporting at 7:00 AM near North Gate"
              rows={2}
              className="w-full rounded-xl border border-gray-200 bg-gray-50 p-2.5 text-xs text-gray-800 focus:bg-white focus:border-[#24833A] focus:outline-none resize-none"
            />
          </div>

          {/* Dynamic Cost Summary Box */}
          <div className="rounded-2xl border border-[#24833A]/20 bg-[#F4FBF5] p-3.5 flex flex-col gap-1.5">
            <div className="flex items-center justify-between text-xs text-gray-600">
              <span>
                Daily Wage Rate: ₹{worker.dailyRate} × {durationDays} {durationDays === 1 ? "day" : "days"}
              </span>
              <span className="font-semibold text-gray-800">₹{totalAmount}</span>
            </div>
            <div className="flex items-center justify-between text-xs text-gray-600">
              <span>Platform Coordination & Insurance Fee</span>
              <span className="text-[#24833A] font-bold">FREE (Govt Subsidized)</span>
            </div>
            <div className="border-t border-[#24833A]/20 pt-1.5 mt-1 flex items-center justify-between text-sm font-extrabold text-[#174D25]">
              <span>Total Estimated Amount</span>
              <span className="text-base">₹{totalAmount}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-2 flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-gray-200 px-4 py-2.5 text-xs font-bold text-gray-600 hover:bg-gray-50 cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#24833A] px-5 py-2.5 text-xs font-bold text-white shadow-xs transition hover:bg-[#1e6e30] active:scale-95 cursor-pointer disabled:bg-gray-300"
            >
              <CheckCircle2 size={16} />
              <span>{isSubmitting ? "Confirming..." : "Confirm Booking"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
