"use client";

import React from "react";
import {
  MapPin,
  Trees,
  Droplets,
  Layers,
  ArrowRight,
  ShieldCheck,
  Send,
} from "lucide-react";
import { LandPlot } from "@/types/land";
import LandThumbnail from "./LandThumbnail";

interface LandCardProps {
  land: LandPlot;
  onViewDetails: (land: LandPlot) => void;
  onRequest: (land: LandPlot) => void;
}

export default function LandCard({
  land,
  onViewDetails,
  onRequest,
}: LandCardProps) {
  const isAvailable = land.availability === "available";

  return (
    <div className="flex flex-col justify-between overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-2xs transition hover:border-[#24833A]/50 hover:shadow-xs">
      {/* Visual Thumbnail */}
      <div className="p-3 pb-0">
        <LandThumbnail soilType={land.soilType} title={land.title} className="h-36 w-full" />
      </div>

      {/* Card Content */}
      <div className="p-4 flex flex-col justify-between flex-1">
        <div>
          {/* Location & Title */}
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
                <MapPin size={13} className="text-[#24833A] flex-shrink-0" />
                <span className="truncate">{land.location}</span>
              </div>
              <h3 className="text-sm font-bold text-gray-900 mt-1 leading-snug line-clamp-1">
                {land.title}
              </h3>
            </div>

            {/* Availability Pill */}
            <div className="flex flex-col items-end gap-1 flex-shrink-0">
              <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-[#24833A]">
                For Lease
              </span>
              {land.isMyListing && (
                <span className="rounded-full bg-blue-50 px-2 py-0.2 text-[9px] font-extrabold text-blue-700 border border-blue-200">
                  Your Listing
                </span>
              )}
              {land.verificationStatus === "pending_verification" && (
                <span className="rounded-full bg-amber-50 px-2 py-0.2 text-[9px] font-bold text-amber-800 border border-amber-200">
                  Pending Verification
                </span>
              )}
            </div>
          </div>

          {/* Key Specs Pill Row */}
          <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center gap-1.5 rounded-xl bg-gray-50 p-2 border border-gray-100">
              <Layers size={14} className="text-[#24833A] flex-shrink-0" />
              <div className="truncate">
                <span className="text-[10px] text-gray-400 block font-medium">Acreage</span>
                <span className="font-extrabold text-gray-800 text-xs">
                  {land.acreage} Acres
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 rounded-xl bg-gray-50 p-2 border border-gray-100">
              <Trees size={14} className="text-[#24833A] flex-shrink-0" />
              <div className="truncate">
                <span className="text-[10px] text-gray-400 block font-medium">Soil Type</span>
                <span className="font-bold text-gray-800 text-xs truncate block">
                  {land.soilTypeName.split(" ")[0]} Soil
                </span>
              </div>
            </div>
          </div>

          {/* Irrigation & Water Source */}
          <div className="mt-2.5 flex items-center gap-1.5 text-[11px] text-gray-600 bg-[#F4FBF5] px-2.5 py-1.5 rounded-xl border border-[#24833A]/15">
            <Droplets size={13} className="text-[#24833A] flex-shrink-0" />
            <span className="truncate font-medium">{land.irrigation}</span>
          </div>

          {/* Suitable Crops Chips */}
          <div className="mt-2.5 flex items-center gap-1 text-[11px] text-gray-500 overflow-hidden">
            <span className="font-bold text-gray-700 flex-shrink-0">Crops:</span>
            <span className="truncate">{land.suitableCrops.join(", ")}</span>
          </div>
        </div>

        {/* Footer: Price & Actions */}
        <div className="mt-4 flex items-center justify-between gap-2 pt-3 border-t border-gray-100">
          <div>
            <span className="text-[10px] text-gray-400 font-medium uppercase tracking-wider block">
              Annual Rent
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-base font-extrabold text-[#174D25]">
                ₹{land.pricePerAcrePerYear.toLocaleString("en-IN")}
              </span>
              <span className="text-[10px] font-medium text-gray-500">/acre/yr</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => onViewDetails(land)}
              className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs font-bold text-gray-700 transition hover:bg-gray-50 active:scale-95 cursor-pointer"
              aria-label={`View details for ${land.title}`}
            >
              Details
            </button>

            <button
              type="button"
              disabled={!isAvailable}
              onClick={() => onRequest(land)}
              className="inline-flex items-center gap-1 rounded-xl bg-[#24833A] px-3 py-2 text-xs font-bold text-white shadow-xs transition hover:bg-[#1e6e30] active:scale-95 cursor-pointer"
              aria-label={`Send rental request for ${land.title}`}
            >
              <Send size={12} />
              <span>Request</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
