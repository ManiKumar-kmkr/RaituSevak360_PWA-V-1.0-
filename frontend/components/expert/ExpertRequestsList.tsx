"use client";

import React, { useState } from "react";
import {
  UsersRound,
  CheckCircle2,
  XCircle,
  Clock,
  Video,
  Mic,
  Calendar,
  MapPin,
  Eye,
  ShieldAlert,
  ArrowRight,
  Filter,
  Search,
} from "lucide-react";
import { FarmerConnectionRequest, RequestStatus } from "@/types/expert";

interface ExpertRequestsListProps {
  requests: FarmerConnectionRequest[];
  onSelectRequest: (request: FarmerConnectionRequest) => void;
  onAcceptRequest: (requestId: string) => void;
  onRejectRequest: (requestId: string) => void;
  onScheduleRequest: (request: FarmerConnectionRequest) => void;
}

export default function ExpertRequestsList({
  requests,
  onSelectRequest,
  onAcceptRequest,
  onRejectRequest,
  onScheduleRequest,
}: ExpertRequestsListProps) {
  const [statusFilter, setStatusFilter] = useState<RequestStatus | "all">("pending");
  const [searchQuery, setSearchQuery] = useState("");

  const pendingCount = requests.filter((r) => r.status === "pending").length;
  const acceptedCount = requests.filter((r) => r.status === "accepted").length;

  const filteredRequests = requests.filter((r) => {
    if (statusFilter !== "all" && r.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      return (
        r.farmerName.toLowerCase().includes(q) ||
        r.crop.toLowerCase().includes(q) ||
        r.problemTitle.toLowerCase().includes(q) ||
        r.village.toLowerCase().includes(q) ||
        r.id.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const getStatusBadge = (status: RequestStatus) => {
    switch (status) {
      case "accepted":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-[#24833A] border border-emerald-200">
            <CheckCircle2 size={11} />
            Accepted
          </span>
        );
      case "rejected":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2.5 py-0.5 text-[10px] font-bold text-rose-700 border border-rose-200">
            <XCircle size={11} />
            Declined
          </span>
        );
      case "pending":
      default:
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-[10px] font-bold text-amber-800 border border-amber-200">
            <Clock size={11} />
            Pending Review
          </span>
        );
    }
  };

  const getPriorityBadge = (priority: FarmerConnectionRequest["priority"]) => {
    if (priority === "high") {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2 py-0.2 text-[9px] font-bold text-rose-700 border border-rose-200">
          <ShieldAlert size={10} />
          High Urgency
        </span>
      );
    }
    return null;
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Subheader Filter Tabs & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-2xl bg-white p-3 border border-gray-200 shadow-2xs">
        {/* Status Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <button
            type="button"
            onClick={() => setStatusFilter("pending")}
            className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-bold transition flex-shrink-0 cursor-pointer ${
              statusFilter === "pending"
                ? "bg-[#24833A] text-white shadow-xs"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            <span>Pending Requests</span>
            {pendingCount > 0 && (
              <span
                className={`rounded-full px-1.5 py-0.2 text-[10px] font-extrabold ${
                  statusFilter === "pending" ? "bg-white text-[#24833A]" : "bg-amber-100 text-amber-800"
                }`}
              >
                {pendingCount}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setStatusFilter("accepted")}
            className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-bold transition flex-shrink-0 cursor-pointer ${
              statusFilter === "accepted"
                ? "bg-[#24833A] text-white shadow-xs"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            <span>Accepted</span>
            {acceptedCount > 0 && (
              <span
                className={`rounded-full px-1.5 py-0.2 text-[10px] font-extrabold ${
                  statusFilter === "accepted" ? "bg-white text-[#24833A]" : "bg-emerald-100 text-[#174D25]"
                }`}
              >
                {acceptedCount}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setStatusFilter("all")}
            className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition flex-shrink-0 cursor-pointer ${
              statusFilter === "all"
                ? "bg-[#24833A] text-white shadow-xs"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            All Requests ({requests.length})
          </button>
        </div>

        {/* Quick Search */}
        <div className="relative min-w-[200px]">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search crop, farmer, village..."
            className="h-9 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 pr-8 text-xs text-gray-800 focus:bg-white focus:outline-none focus:border-[#24833A]"
          />
        </div>
      </div>

      {/* Requests List or Empty State */}
      {filteredRequests.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-gray-300 bg-white p-10 sm:p-14 text-center shadow-2xs">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#E4F0DD] text-[#24833A] mb-3.5">
            <UsersRound size={32} />
          </div>
          <h3 className="text-base font-bold text-gray-900">
            {statusFilter === "pending"
              ? "No Pending Requests"
              : "No Requests Found"}
          </h3>
          <p className="mt-1 max-w-sm text-xs text-gray-500 leading-relaxed">
            {statusFilter === "pending"
              ? "All connection requests from local farmers have been reviewed. When new farmers request advisory, they will appear here."
              : "No farmer requests match your current search criteria. Clear search or select another filter."}
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filteredRequests.map((req) => (
            <div
              key={req.id}
              className="w-full h-auto min-h-0 flex flex-col justify-between rounded-2xl border border-gray-200 bg-white p-4 sm:p-5 shadow-2xs transition hover:border-[#24833A]/40 overflow-hidden"
            >
              {/* Header Row */}
              <div className="flex items-start justify-between gap-3 min-w-0">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-mono font-bold text-[#174D25] shrink-0">
                      {req.id}
                    </span>
                    <span className="text-gray-300 shrink-0">•</span>
                    <span className="text-[11px] text-gray-400 shrink-0">{req.requestDate}</span>
                    {getPriorityBadge(req.priority)}
                  </div>
                  <h3 className="text-sm font-bold text-gray-900 mt-1 break-words">
                    {req.farmerName}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5 flex-wrap">
                    <span className="inline-flex items-center gap-1 font-semibold text-gray-800">
                      🌾 {req.crop}
                    </span>
                    <span>•</span>
                    <span className="inline-flex items-center gap-1">
                      <MapPin size={12} className="text-[#24833A]" />
                      {req.village}, {req.mandal}
                    </span>
                    <span>•</span>
                    <span>{req.farmSizeAcres} Acres</span>
                  </div>
                </div>

                <div className="shrink-0 self-start">
                  {getStatusBadge(req.status)}
                </div>
              </div>

              {/* Problem Synopsis Box */}
              <div className="mt-3 rounded-xl bg-gray-50 p-3 text-xs border border-gray-100 min-w-0">
                <h4 className="font-bold text-gray-900 break-words">{req.problemTitle}</h4>
                <p className="mt-1 text-gray-600 line-clamp-2 leading-relaxed break-words">
                  {req.problemDescription}
                </p>
              </div>

              {/* Slot & Preferred Type */}
              <div className="mt-2.5 flex items-center justify-between text-[11px] text-gray-500 flex-wrap gap-2">
                <div className="flex items-center gap-1.5 font-medium text-gray-700">
                  <Clock size={12} className="text-[#24833A]" />
                  <span>
                    Requested: <strong>{req.preferredDate}</strong> ({req.preferredTimeSlot.split("-")[0]})
                  </span>
                </div>

                <div className="flex items-center gap-1 font-semibold text-[#174D25]">
                  {req.preferredType === "video" ? <Video size={13} /> : <Mic size={13} />}
                  <span className="capitalize">{req.preferredType} Consultation</span>
                </div>
              </div>

              {/* Bottom Actions Row */}
              <div className="mt-3.5 flex items-center justify-between border-t border-gray-100 pt-3 flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => onSelectRequest(req)}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3.5 py-1.5 text-xs font-bold text-gray-700 hover:bg-gray-50 active:scale-95 cursor-pointer shrink-0"
                >
                  <Eye size={13} />
                  <span>View Details</span>
                </button>

                <div className="flex items-center gap-2">
                  {req.status === "pending" && (
                    <>
                      <button
                        type="button"
                        onClick={() => onRejectRequest(req.id)}
                        className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-bold text-rose-700 hover:bg-rose-100 active:scale-95 cursor-pointer"
                      >
                        Decline
                      </button>

                      <button
                        type="button"
                        onClick={() => onAcceptRequest(req.id)}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-[#24833A] px-4 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-[#1e6e30] active:scale-95 cursor-pointer"
                      >
                        <CheckCircle2 size={13} />
                        <span>Accept</span>
                      </button>
                    </>
                  )}

                  {req.status === "accepted" && (
                    <button
                      type="button"
                      onClick={() => onScheduleRequest(req)}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-[#24833A] px-4 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-[#1e6e30] active:scale-95 cursor-pointer"
                    >
                      <Calendar size={13} />
                      <span>Schedule Session</span>
                      <ArrowRight size={12} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
