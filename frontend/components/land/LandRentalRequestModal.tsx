"use client";

import React, { useState } from "react";
import {
  X,
  Trees,
  Calendar,
  Send,
  CheckCircle2,
  AlertCircle,
  FileText,
} from "lucide-react";
import { LandPlot, LandRentalRequest } from "@/types/land";
import { useCartStore } from "@/store/cart-store";

interface LandRentalRequestModalProps {
  land: LandPlot | null;
  isOpen: boolean;
  onClose: () => void;
  onRequestSuccess: (request: LandRentalRequest) => void;
}

export default function LandRentalRequestModal({
  land,
  isOpen,
  onClose,
  onRequestSuccess,
}: LandRentalRequestModalProps) {
  const addLandRequest = useCartStore((state) => state.addLandRequest);
  const deliveryAddress = useCartStore((state) => state.deliveryAddress);

  // Defaults
  const [season, setSeason] = useState<string>("Kharif 2026 (Monsoon Season)");
  const [duration, setDuration] = useState<string>("1 Year");
  const [startDate, setStartDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [intendedCrop, setIntendedCrop] = useState<string>(
    land?.suitableCrops[0] || "Paddy"
  );
  const [farmerName, setFarmerName] = useState<string>(
    deliveryAddress?.fullName || "Ramesh Kumar Reddy"
  );
  const [farmerPhone, setFarmerPhone] = useState<string>(
    deliveryAddress?.phone || "9876543210"
  );
  const [farmerNotes, setFarmerNotes] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !land) return null;

  // Calculate dynamic cost based on duration & acreage
  const calculateTotalCost = () => {
    const annualBase = land.pricePerAcrePerYear * land.acreage;
    const seasonBase =
      (land.pricePerSeason || land.pricePerAcrePerYear / 2) * land.acreage;

    switch (duration) {
      case "1 Season (6 Months)":
        return seasonBase;
      case "2 Years":
        return annualBase * 2;
      case "3 Years":
        return annualBase * 3;
      case "1 Year":
      default:
        return annualBase;
    }
  };

  const estimatedCost = calculateTotalCost();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const requestId = `RS360-LND-${Math.floor(10000 + Math.random() * 90000)}`;

    const newRequest: LandRentalRequest = {
      id: requestId,
      landId: land.id,
      landTitle: land.title,
      landLocation: `${land.location}, ${land.district}`,
      acreage: land.acreage,
      season,
      startDate,
      duration,
      intendedCrop,
      farmerName,
      farmerPhone,
      farmerNotes: farmerNotes.trim() || undefined,
      estimatedCost,
      status: "submitted",
      createdAt: new Date().toISOString(),
    };

    // Save to persistent Zustand store
    addLandRequest(newRequest);

    setTimeout(() => {
      setIsSubmitting(false);
      onRequestSuccess(newRequest);
    }, 400);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-in fade-in duration-150 overflow-y-auto"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="land-request-title"
    >
      <div
        className="w-full max-w-lg rounded-3xl border border-gray-200 bg-white p-6 shadow-xl animate-in zoom-in-95 duration-150 my-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 pb-3.5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E4F0DD] text-[#24833A]">
              <Trees size={22} />
            </div>
            <div>
              <h2
                id="land-request-title"
                className="text-sm sm:text-base font-bold text-gray-900"
              >
                Send Land Rental Request
              </h2>
              <p className="text-[11px] text-gray-500">
                {land.title} • {land.acreage} Acres
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-xl text-gray-400 hover:bg-gray-100 cursor-pointer"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Notice Banner: Request Submitted vs Rental Finalized */}
        <div className="mt-3.5 flex items-start gap-2.5 rounded-2xl bg-amber-50 p-3 text-xs text-amber-900 border border-amber-200/60">
          <AlertCircle size={16} className="text-amber-600 flex-shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            This request will be forwarded directly to the verified land owner. 
            Final lease agreement is signed after mutual field inspection.
          </p>
        </div>

        {/* Request Form */}
        <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-3.5">
          {/* Season & Duration Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Agricultural Season
              </label>
              <select
                value={season}
                onChange={(e) => setSeason(e.target.value)}
                className="h-10 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 text-xs text-gray-800 focus:bg-white focus:border-[#24833A] focus:outline-none"
              >
                <option value="Kharif 2026 (Monsoon Season)">
                  Kharif 2026 (Monsoon Season)
                </option>
                <option value="Rabi 2026-27 (Winter Season)">
                  Rabi 2026-27 (Winter Season)
                </option>
                <option value="Full Year (Annual Lease)">
                  Full Year (Annual Lease)
                </option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Lease Duration
              </label>
              <select
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="h-10 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 text-xs text-gray-800 focus:bg-white focus:border-[#24833A] focus:outline-none"
              >
                <option value="1 Season (6 Months)">1 Season (6 Months)</option>
                <option value="1 Year">1 Year</option>
                <option value="2 Years">2 Years</option>
                <option value="3 Years">3 Years</option>
              </select>
            </div>
          </div>

          {/* Intended Crop & Start Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Intended Crop Cultivation
              </label>
              <select
                value={intendedCrop}
                onChange={(e) => setIntendedCrop(e.target.value)}
                className="h-10 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 text-xs text-gray-800 focus:bg-white focus:border-[#24833A] focus:outline-none"
              >
                {land.suitableCrops.map((c, i) => (
                  <option key={i} value={c}>
                    {c} (Recommended)
                  </option>
                ))}
                <option value="Other Vegetables">Other Vegetables</option>
                <option value="Millets / Pulses">Millets / Pulses</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Proposed Start Date
              </label>
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

          {/* Farmer Contact Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Farmer Full Name
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
                Contact Mobile Number
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

          {/* Notes / Special Requests */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Farmer Proposal / Irrigation Requests (Optional)
            </label>
            <textarea
              value={farmerNotes}
              onChange={(e) => setFarmerNotes(e.target.value)}
              placeholder="e.g. Requesting canal water schedule confirmation and drip pipe connection"
              rows={2}
              className="w-full rounded-xl border border-gray-200 bg-gray-50 p-2.5 text-xs text-gray-800 focus:bg-white focus:border-[#24833A] focus:outline-none resize-none"
            />
          </div>

          {/* Dynamic Budget Summary Box */}
          <div className="rounded-2xl border border-[#24833A]/20 bg-[#F4FBF5] p-3.5 flex flex-col gap-1.5">
            <div className="flex items-center justify-between text-xs text-gray-600">
              <span>
                Base Rate: {land.acreage} Acres × ₹{land.pricePerAcrePerYear.toLocaleString("en-IN")}/acre
              </span>
              <span className="font-semibold text-gray-800">
                ₹{(land.pricePerAcrePerYear * land.acreage).toLocaleString("en-IN")}/yr
              </span>
            </div>

            <div className="flex items-center justify-between text-xs text-gray-600">
              <span>Selected Lease Period</span>
              <span className="font-semibold text-gray-800">{duration}</span>
            </div>

            <div className="border-t border-[#24833A]/20 pt-1.5 mt-1 flex items-center justify-between text-sm font-extrabold text-[#174D25]">
              <span>Estimated Rental Budget</span>
              <span className="text-base">
                ₹{estimatedCost.toLocaleString("en-IN")}
              </span>
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
              <Send size={14} />
              <span>{isSubmitting ? "Submitting..." : "Submit Rental Request"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
