"use client";

import React from "react";
import {
  X,
  MapPin,
  Trees,
  Droplets,
  Layers,
  Compass,
  ShieldCheck,
  Send,
  FileText,
  UserCheck,
} from "lucide-react";
import { LandPlot } from "@/types/land";
import LandThumbnail from "./LandThumbnail";

interface LandDetailsModalProps {
  land: LandPlot | null;
  isOpen: boolean;
  onClose: () => void;
  onRequest: (land: LandPlot) => void;
}

export default function LandDetailsModal({
  land,
  isOpen,
  onClose,
  onRequest,
}: LandDetailsModalProps) {
  if (!isOpen || !land) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs animate-in fade-in duration-150 overflow-y-auto"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="land-details-title"
    >
      <div
        className="w-full max-w-lg rounded-2xl border border-gray-200 bg-white p-5 sm:p-6 shadow-2xl animate-in zoom-in-95 duration-150 my-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Visual Banner */}
        <div className="relative">
          <LandThumbnail soilType={land.soilType} title={land.title} className="h-44 w-full rounded-xl" />
          <button
            type="button"
            onClick={onClose}
            className="absolute top-3 right-3 flex h-9 w-9 items-center justify-center rounded-xl bg-black/60 text-white hover:bg-black/80 transition cursor-pointer"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Title & Location Header */}
        <div className="mt-4 border-b border-gray-100 pb-3">
          <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
            <MapPin size={14} className="text-[#24833A]" />
            <span>
              {land.location}, {land.district}, {land.state}
            </span>
          </div>
          <h2
            id="land-details-title"
            className="text-base sm:text-lg font-bold text-gray-900 mt-1"
          >
            {land.title}
          </h2>
          <div className="mt-1 flex items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-[#24833A]">
              <ShieldCheck size={12} />
              Verified Agricultural Plot
            </span>
            <span className="text-[11px] text-gray-400">•</span>
            <span className="text-xs text-gray-600 font-medium">
              Landlord: {land.ownerName}
            </span>
          </div>
        </div>

        {/* Body Specifications */}
        <div className="mt-4 flex flex-col gap-4 text-xs text-gray-700 max-h-[50vh] overflow-y-auto pr-1">
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <div className="rounded-2xl border border-gray-100 bg-gray-50 p-2.5 text-center">
              <span className="text-[10px] text-gray-400 font-medium block">Acreage</span>
              <span className="text-xs font-extrabold text-gray-900">
                {land.acreage} Acres
              </span>
            </div>

            <div className="rounded-2xl border border-gray-100 bg-gray-50 p-2.5 text-center">
              <span className="text-[10px] text-gray-400 font-medium block">Soil Type</span>
              <span className="text-xs font-bold text-gray-900 truncate block">
                {land.soilTypeName}
              </span>
            </div>

            <div className="rounded-2xl border border-gray-100 bg-gray-50 p-2.5 text-center">
              <span className="text-[10px] text-gray-400 font-medium block">Fencing</span>
              <span className="text-xs font-bold text-gray-900">
                {land.fenced ? "Barbed Wire" : "Open Bunds"}
              </span>
            </div>

            <div className="rounded-2xl border border-gray-100 bg-gray-50 p-2.5 text-center">
              <span className="text-[10px] text-gray-400 font-medium block">Availability</span>
              <span className="text-xs font-bold text-[#24833A]">Available</span>
            </div>
          </div>

          {/* Irrigation & Water Source */}
          <div className="rounded-2xl border border-[#24833A]/20 bg-[#F4FBF5] p-3.5 flex flex-col gap-1">
            <div className="flex items-center gap-2 text-[#174D25] font-bold text-xs">
              <Droplets size={16} className="text-[#24833A]" />
              <span>Irrigation & Water Rights</span>
            </div>
            <p className="text-gray-700 leading-relaxed text-xs">
              {land.irrigation}
            </p>
            <p className="text-[11px] text-gray-500 mt-0.5">
              Source: {land.waterSource}
            </p>
          </div>

          {/* Road Access & Logistics */}
          <div>
            <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-1">
              Road Access & Connectivity
            </h3>
            <p className="text-gray-600 bg-gray-50 p-2.5 rounded-xl border border-gray-100">
              {land.roadAccess}
            </p>
          </div>

          {/* Suitable Crops */}
          <div>
            <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-1.5">
              Recommended / Suitable Crops
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {land.suitableCrops.map((crop, idx) => (
                <span
                  key={idx}
                  className="rounded-xl bg-[#E4F0DD] px-2.5 py-1 text-xs font-semibold text-[#174D25]"
                >
                  ✓ {crop}
                </span>
              ))}
            </div>
          </div>

          {/* Lease Terms & Conditions */}
          <div>
            <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-1">
              Lease Terms & Conditions
            </h3>
            <div className="rounded-xl bg-gray-50 p-2.5 text-gray-600 border border-gray-100 flex items-start gap-2">
              <FileText size={15} className="text-[#24833A] flex-shrink-0 mt-0.5" />
              <span>{land.leaseTerms}</span>
            </div>
          </div>
        </div>

        {/* Footer: Rental Rate & Action */}
        <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4">
          <div>
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">
              Rental Rate
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-lg font-extrabold text-[#174D25]">
                ₹{land.pricePerAcrePerYear.toLocaleString("en-IN")}
              </span>
              <span className="text-xs text-gray-500">/acre/yr</span>
              {land.pricePerSeason && (
                <span className="text-[11px] text-gray-400 ml-1">
                  (₹{land.pricePerSeason.toLocaleString("en-IN")}/season)
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-gray-200 px-3.5 py-2.5 text-xs font-bold text-gray-600 hover:bg-gray-50 cursor-pointer"
            >
              Back
            </button>

            <button
              type="button"
              onClick={() => {
                onClose();
                onRequest(land);
              }}
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#24833A] px-4.5 py-2.5 text-xs font-bold text-white shadow-xs transition hover:bg-[#1e6e30] active:scale-95 cursor-pointer"
            >
              <Send size={14} />
              <span>Send Rental Request</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
