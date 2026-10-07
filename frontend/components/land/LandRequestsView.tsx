"use client";

import React, { useState } from "react";
import {
  Trees,
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  XCircle,
  Eye,
  X,
  Search,
  AlertCircle,
} from "lucide-react";
import { LandRentalRequest } from "@/types/land";
import { useCartStore } from "@/store/cart-store";

interface LandRequestsViewProps {
  onBrowseLand: () => void;
}

export default function LandRequestsView({
  onBrowseLand,
}: LandRequestsViewProps) {
  const landRequests = useCartStore((state) => state.landRequests || []);
  const [selectedRequest, setSelectedRequest] =
    useState<LandRentalRequest | null>(null);

  const getStatusBadge = (status: LandRentalRequest["status"]) => {
    switch (status) {
      case "submitted":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-[10px] font-bold text-amber-800">
            <Clock size={11} />
            Pending Owner Review
          </span>
        );
      case "under_review":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-0.5 text-[10px] font-bold text-blue-700">
            <Clock size={11} />
            Inspection Scheduled
          </span>
        );
      case "approved":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-[#24833A]">
            <CheckCircle2 size={11} />
            Proposal Accepted
          </span>
        );
      case "rejected":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2.5 py-0.5 text-[10px] font-bold text-rose-700">
            <XCircle size={11} />
            Not Available
          </span>
        );
      default:
        return null;
    }
  };

  if (landRequests.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-gray-300 bg-white p-12 text-center shadow-2xs">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#E4F0DD] text-[#24833A] mb-4">
          <Trees size={32} />
        </div>
        <h3 className="text-base font-bold text-gray-900">
          No Land Rental Requests Yet
        </h3>
        <p className="mt-1 max-w-sm text-xs text-gray-500 leading-relaxed">
          You haven&apos;t submitted any land rental proposals yet. Browse verified agricultural plots with irrigation and fertile soil records.
        </p>
        <button
          type="button"
          onClick={onBrowseLand}
          className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#24833A] px-5 py-2.5 text-xs font-bold text-white shadow-xs transition hover:bg-[#1e6e30] active:scale-95 cursor-pointer"
        >
          <Search size={14} />
          <span>Browse Available Land</span>
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {landRequests.map((request) => (
        <div
          key={request.id}
          className="flex flex-col justify-between rounded-3xl border border-gray-200 bg-white p-4.5 shadow-2xs transition hover:border-[#24833A]/40"
        >
          {/* Header Row */}
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-extrabold text-[#174D25]">
                  {request.id}
                </span>
                <span className="text-gray-300">•</span>
                <span className="text-[11px] text-gray-400">
                  {new Date(request.createdAt).toLocaleDateString("en-IN", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>
              <h3 className="text-sm font-bold text-gray-900 mt-1">
                {request.landTitle}
              </h3>
              <p className="text-xs font-medium text-gray-500">
                {request.landLocation} ({request.acreage} Acres)
              </p>
            </div>

            {getStatusBadge(request.status)}
          </div>

          {/* Schedule & Crop Info */}
          <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 rounded-2xl bg-gray-50 p-3 text-xs text-gray-600 border border-gray-100">
            <div className="flex items-center gap-2">
              <Calendar size={14} className="text-[#24833A] flex-shrink-0" />
              <span>
                Season: <strong>{request.duration}</strong> ({request.season.split("(")[0]})
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Trees size={14} className="text-[#24833A] flex-shrink-0" />
              <span>
                Intended Crop: <strong>{request.intendedCrop}</strong>
              </span>
            </div>
          </div>

          {/* Footer: Budget & Action */}
          <div className="mt-3.5 flex items-center justify-between border-t border-gray-100 pt-3">
            <div>
              <span className="text-[10px] text-gray-400 font-medium block">
                Estimated Budget
              </span>
              <span className="text-sm font-extrabold text-[#174D25]">
                ₹{request.estimatedCost.toLocaleString("en-IN")}
              </span>
            </div>

            <button
              type="button"
              onClick={() => setSelectedRequest(request)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3.5 py-1.5 text-xs font-bold text-gray-700 hover:bg-gray-50 active:scale-95 cursor-pointer"
            >
              <Eye size={13} />
              <span>View Details</span>
            </button>
          </div>
        </div>
      ))}

      {/* Details Modal */}
      {selectedRequest && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-in fade-in duration-150"
          onClick={() => setSelectedRequest(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="w-full max-w-md rounded-3xl border border-gray-200 bg-white p-6 shadow-xl animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-gray-900">
                  Rental Proposal Details
                </h3>
                <span className="text-[11px] text-gray-400">
                  {selectedRequest.id}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedRequest(null)}
                className="flex h-8 w-8 items-center justify-center rounded-xl text-gray-400 hover:bg-gray-100 cursor-pointer"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            <div className="mt-4 flex flex-col gap-3 text-xs text-gray-700">
              <div className="flex justify-between border-b border-gray-100 pb-2">
                <span className="text-gray-500">Selected Plot</span>
                <span className="font-bold text-gray-900 text-right max-w-[200px]">
                  {selectedRequest.landTitle}
                </span>
              </div>

              <div className="flex justify-between border-b border-gray-100 pb-2">
                <span className="text-gray-500">Location</span>
                <span className="font-semibold text-gray-800">
                  {selectedRequest.landLocation}
                </span>
              </div>

              <div className="flex justify-between border-b border-gray-100 pb-2">
                <span className="text-gray-500">Acreage</span>
                <span className="font-semibold text-gray-800">
                  {selectedRequest.acreage} Acres
                </span>
              </div>

              <div className="flex justify-between border-b border-gray-100 pb-2">
                <span className="text-gray-500">Season</span>
                <span className="font-semibold text-gray-800">
                  {selectedRequest.season}
                </span>
              </div>

              <div className="flex justify-between border-b border-gray-100 pb-2">
                <span className="text-gray-500">Duration</span>
                <span className="font-semibold text-gray-800">
                  {selectedRequest.duration} (Start: {selectedRequest.startDate})
                </span>
              </div>

              <div className="flex justify-between border-b border-gray-100 pb-2">
                <span className="text-gray-500">Intended Crop</span>
                <span className="font-semibold text-gray-800">
                  {selectedRequest.intendedCrop}
                </span>
              </div>

              <div className="flex justify-between border-b border-gray-100 pb-2">
                <span className="text-gray-500">Farmer Contact</span>
                <span className="font-medium text-gray-800">
                  {selectedRequest.farmerName} ({selectedRequest.farmerPhone})
                </span>
              </div>

              {selectedRequest.farmerNotes && (
                <div className="rounded-xl bg-gray-50 p-2.5 text-gray-600">
                  <span className="font-bold text-gray-700 block mb-0.5">
                    Farmer Proposal Notes:
                  </span>
                  {selectedRequest.farmerNotes}
                </div>
              )}

              <div className="flex justify-between pt-1 text-sm font-extrabold text-[#174D25]">
                <span>Estimated Rental Budget</span>
                <span>₹{selectedRequest.estimatedCost.toLocaleString("en-IN")}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setSelectedRequest(null)}
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
