"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  UsersRound,
  HardHat,
  Calendar,
  Clock,
  MapPin,
  ArrowLeft,
  Search,
  X,
  CheckCircle2,
  CalendarCheck,
  RotateCcw,
  Sparkles,
  Plus,
  Briefcase,
} from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { LabourWorker, LabourBooking, LabourWorkType } from "@/types/labour";
import { labourService } from "@/services/labour";
import { useCartStore } from "@/store/cart-store";
import LabourCard from "@/components/labour/LabourCard";
import WorkerProfileModal from "@/components/labour/WorkerProfileModal";
import LabourBookingModal from "@/components/labour/LabourBookingModal";
import LabourBookingSuccessModal from "@/components/labour/LabourBookingSuccessModal";
import LabourBookingsView from "@/components/labour/LabourBookingsView";
import LabourProviderView from "@/components/labour/LabourProviderView";
import RegisterLabourModal from "@/components/labour/RegisterLabourModal";
import BackButton from "@/components/ui/BackButton";

function LabourContent() {
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");
  const initialTab =
    tabParam === "bookings" ? "bookings" : tabParam === "provider" ? "provider" : "discover";

  const [activeTab, setActiveTab] = useState<"discover" | "bookings" | "provider">(initialTab);
  const [workers, setWorkers] = useState<LabourWorker[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedWorkType, setSelectedWorkType] = useState<LabourWorkType>("all");
  const [availabilityFilter, setAvailabilityFilter] = useState<string>("all");

  // Modals state
  const [selectedWorkerForProfile, setSelectedWorkerForProfile] =
    useState<LabourWorker | null>(null);
  const [selectedWorkerForBooking, setSelectedWorkerForBooking] =
    useState<LabourWorker | null>(null);
  const [latestBooking, setLatestBooking] = useState<LabourBooking | null>(null);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

  // Zustand persistent store: bookings and provider profile
  const labourBookings = useCartStore((state) => state.labourBookings || []);
  const myWorkerProfile = useCartStore((state) => state.myWorkerProfile);

  // Fetch workers from service layer, seamlessly combining active provider profile
  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    labourService
      .getWorkers({
        workType: selectedWorkType,
        search: searchQuery,
        availability: availabilityFilter,
        userProfile: myWorkerProfile,
      })
      .then((data) => {
        if (isMounted) {
          setWorkers(data);
          setIsLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [selectedWorkType, searchQuery, availabilityFilter, myWorkerProfile]);

  const handleOpenBooking = (worker: LabourWorker) => {
    setSelectedWorkerForProfile(null);
    setSelectedWorkerForBooking(worker);
  };

  const handleBookingSuccess = (booking: LabourBooking) => {
    setSelectedWorkerForBooking(null);
    setLatestBooking(booking);
    setIsSuccessModalOpen(true);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedWorkType("all");
    setAvailabilityFilter("all");
  };

  const WORK_TYPE_TABS: { id: LabourWorkType; label: string }[] = [
    { id: "all", label: "All Crews" },
    { id: "harvesting", label: "🌾 Harvesting" },
    { id: "sowing", label: "🌱 Sowing" },
    { id: "weeding", label: "🌿 Weeding" },
    { id: "spraying", label: "💨 Spraying" },
    { id: "general", label: "🚜 General" },
  ];

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-4 pb-20">
      {/* Top Breadcrumb Back Navigation */}
      <div className="flex items-center justify-between">
        <BackButton href="/dashboard" label={t("common.backToDashboard") || "Back to Dashboard"} />
      </div>

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-3xl bg-white p-5 border border-gray-200 shadow-2xs">
        <div className="flex items-center gap-3.5">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#E4F0DD] text-[#24833A] shadow-xs">
            <UsersRound size={26} strokeWidth={2.4} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-bold text-gray-900">
                {t("nav.labour") || "Farm Labour"} Ecosystem
              </h1>
              <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-[#24833A]">
                Two-Sided Hub
              </span>
            </div>
            <p className="text-xs text-gray-500 font-medium">
              Find and hire verified agricultural teams • Or register to offer your farm labour services
            </p>
          </div>
        </div>

        {/* View Switch: Find Workers / My Bookings / Offer Labour */}
        <div className="flex items-center rounded-2xl bg-gray-100 p-1 self-start sm:self-auto border border-gray-200/60 overflow-x-auto max-w-full">
          <button
            type="button"
            onClick={() => setActiveTab("discover")}
            className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition flex-shrink-0 cursor-pointer ${
              activeTab === "discover"
                ? "bg-white text-gray-900 shadow-2xs"
                : "text-gray-500 hover:text-gray-900"
            }`}
          >
            Find Workers
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("bookings")}
            className={`flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-bold transition flex-shrink-0 cursor-pointer ${
              activeTab === "bookings"
                ? "bg-white text-gray-900 shadow-2xs"
                : "text-gray-500 hover:text-gray-900"
            }`}
          >
            <span>My Bookings</span>
            {labourBookings.length > 0 && (
              <span className="rounded-full bg-[#24833A] px-1.5 py-0.2 text-[10px] font-extrabold text-white">
                {labourBookings.length}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("provider")}
            className={`flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-bold transition flex-shrink-0 cursor-pointer ${
              activeTab === "provider"
                ? "bg-white text-gray-900 shadow-2xs"
                : "text-gray-500 hover:text-gray-900"
            }`}
          >
            <span>{myWorkerProfile ? "My Labour Profile" : "Register as Labour"}</span>
            {myWorkerProfile ? (
              <span className="rounded-full bg-blue-100 px-1.5 py-0.2 text-[10px] font-bold text-blue-800">
                {myWorkerProfile.isActive !== false ? "Live" : "Paused"}
              </span>
            ) : (
              <span className="rounded-full bg-emerald-100 px-1.5 py-0.2 text-[10px] font-bold text-[#174D25]">
                New
              </span>
            )}
          </button>
        </div>
      </div>

      {activeTab === "discover" && (
        <>
          {/* Provider Callout Bar (Secondary Entry Point to Register as Labour) */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 rounded-2xl border border-blue-200/80 bg-blue-50/70 p-3 text-xs text-blue-900">
            <div className="flex items-center gap-2">
              <Briefcase size={16} className="text-blue-700 flex-shrink-0" />
              <div>
                <span className="font-bold">Want to work as agricultural labour?</span>
                <p className="text-[11px] text-blue-800/80">
                  Offer your agricultural skills and become discoverable to nearby farmers in your mandal.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                if (myWorkerProfile) {
                  setActiveTab("provider");
                } else {
                  setIsRegisterModalOpen(true);
                }
              }}
              className="inline-flex items-center justify-center gap-1 rounded-xl bg-blue-700 px-3.5 py-1.5 text-xs font-bold text-white shadow-2xs hover:bg-blue-800 cursor-pointer flex-shrink-0 self-start sm:self-auto"
            >
              <Plus size={13} />
              <span>{myWorkerProfile ? "My Labour Profile" : "Register as Labour"}</span>
            </button>
          </div>

          {/* Quick Operation Cards: Harvesting, Sowing, Spraying */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div
              onClick={() => setSelectedWorkType("harvesting")}
              className={`rounded-2xl border p-3.5 shadow-2xs transition cursor-pointer ${
                selectedWorkType === "harvesting"
                  ? "border-[#24833A] bg-[#F4FBF5] ring-2 ring-[#24833A]/20"
                  : "border-gray-200 bg-white hover:border-[#24833A]/50"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-[#24833A]">
                  <HardHat size={18} />
                  <h3 className="text-xs font-bold text-gray-900">Harvesting Crew</h3>
                </div>
                <span className="text-[10px] font-bold text-[#24833A]">₹500/day</span>
              </div>
              <p className="mt-1 text-[11px] text-gray-500">
                Paddy, cotton & chilli cutting teams
              </p>
            </div>

            <div
              onClick={() => setSelectedWorkType("sowing")}
              className={`rounded-2xl border p-3.5 shadow-2xs transition cursor-pointer ${
                selectedWorkType === "sowing"
                  ? "border-[#24833A] bg-[#F4FBF5] ring-2 ring-[#24833A]/20"
                  : "border-gray-200 bg-white hover:border-[#24833A]/50"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-[#24833A]">
                  <Calendar size={18} />
                  <h3 className="text-xs font-bold text-gray-900">Sowing & Nursery</h3>
                </div>
                <span className="text-[10px] font-bold text-[#24833A]">₹450/day</span>
              </div>
              <p className="mt-1 text-[11px] text-gray-500">
                Line sowing & nursery transplantation
              </p>
            </div>

            <div
              onClick={() => setSelectedWorkType("spraying")}
              className={`rounded-2xl border p-3.5 shadow-2xs transition cursor-pointer ${
                selectedWorkType === "spraying"
                  ? "border-[#24833A] bg-[#F4FBF5] ring-2 ring-[#24833A]/20"
                  : "border-gray-200 bg-white hover:border-[#24833A]/50"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-[#24833A]">
                  <Clock size={18} />
                  <h3 className="text-xs font-bold text-gray-900">Spraying & Weeding</h3>
                </div>
                <span className="text-[10px] font-bold text-[#24833A]">₹400/day</span>
              </div>
              <p className="mt-1 text-[11px] text-gray-500">
                Battery backpack & chemical protection
              </p>
            </div>
          </div>

          {/* Search & Work Type Filter Bar */}
          <div className="flex flex-col gap-2.5 rounded-3xl bg-white p-4 border border-gray-200 shadow-2xs">
            {/* Search Input */}
            <div className="relative flex items-center">
              <Search
                size={16}
                className="absolute left-3.5 text-gray-400 pointer-events-none"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search workers by skill, crop, location (e.g. harvesting, Tenali, spraying)..."
                className="h-10 w-full rounded-2xl border border-gray-200 bg-gray-50 pl-10 pr-9 text-xs text-gray-900 placeholder:text-gray-400 focus:bg-white focus:border-[#24833A] focus:outline-none transition"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 text-gray-400 hover:text-gray-700 cursor-pointer"
                  aria-label="Clear search query"
                >
                  <X size={15} />
                </button>
              )}
            </div>

            {/* Filter Chips Bar */}
            <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1 pt-1">
              <div className="flex items-center gap-1.5 flex-wrap sm:flex-nowrap">
                {WORK_TYPE_TABS.map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setSelectedWorkType(tab.id)}
                    className={`rounded-xl px-3 py-1.5 text-xs font-bold transition flex-shrink-0 cursor-pointer active:scale-95 ${
                      selectedWorkType === tab.id
                        ? "bg-[#24833A] text-white shadow-xs"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200/70"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Availability Filter Toggle */}
              <button
                type="button"
                onClick={() =>
                  setAvailabilityFilter((prev) =>
                    prev === "all" ? "available" : "all"
                  )
                }
                className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold flex-shrink-0 cursor-pointer ${
                  availabilityFilter === "available"
                    ? "border-[#24833A] bg-emerald-50 text-[#24833A]"
                    : "border-gray-200 bg-gray-50 text-gray-600 hover:bg-gray-100"
                }`}
              >
                <CheckCircle2 size={13} />
                <span>Available Only</span>
              </button>
            </div>
          </div>

          {/* Regional Network Status */}
          <div className="flex items-center justify-between rounded-2xl border border-[#24833A]/20 bg-[#F4FBF5] px-4 py-2.5 text-xs text-gray-600">
            <div className="flex items-center gap-2">
              <MapPin size={14} className="text-[#24833A]" />
              <span className="font-medium">
                Active Cluster: <strong>Guntur & Warangal Mandal Network</strong>
              </span>
            </div>
            <span className="text-[11px] font-bold text-[#24833A]">
              {workers.length} Available Nearby
            </span>
          </div>

          {/* Worker Cards Grid or Empty State */}
          {isLoading ? (
            <div className="flex flex-col items-center justify-center p-12 text-center">
              <div className="h-8 w-8 animate-spin rounded-full border-3 border-[#24833A] border-t-transparent mb-3" />
              <p className="text-xs text-gray-500 font-medium">
                Loading verified agricultural workers...
              </p>
            </div>
          ) : workers.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-gray-300 bg-white p-10 text-center shadow-2xs">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100 text-gray-400 mb-3">
                <UsersRound size={28} />
              </div>
              <h3 className="text-sm font-bold text-gray-900">No Workers Found</h3>
              <p className="mt-1 max-w-xs text-xs text-gray-500">
                No agricultural teams match your current search or filters.
              </p>
              <button
                type="button"
                onClick={clearFilters}
                className="mt-4 inline-flex items-center gap-1.5 rounded-xl border border-gray-200 bg-gray-50 px-4 py-2 text-xs font-bold text-gray-700 hover:bg-gray-100 cursor-pointer"
              >
                <RotateCcw size={13} />
                <span>Clear Filters & Search</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {workers.map((worker) => (
                <LabourCard
                  key={worker.id}
                  worker={worker}
                  onViewProfile={(w) => setSelectedWorkerForProfile(w)}
                  onBook={(w) => handleOpenBooking(w)}
                />
              ))}
            </div>
          )}
        </>
      )}

      {activeTab === "bookings" && (
        /* Consumer Labour Bookings View */
        <LabourBookingsView onFindWorkers={() => setActiveTab("discover")} />
      )}

      {activeTab === "provider" && (
        /* Provider Labour Profile & Dashboard View */
        <LabourProviderView onSwitchToDiscover={() => setActiveTab("discover")} />
      )}

      {/* Worker Profile Modal */}
      <WorkerProfileModal
        worker={selectedWorkerForProfile}
        isOpen={Boolean(selectedWorkerForProfile)}
        onClose={() => setSelectedWorkerForProfile(null)}
        onBook={(w) => handleOpenBooking(w)}
      />

      {/* Labour Booking Modal */}
      <LabourBookingModal
        worker={selectedWorkerForBooking}
        isOpen={Boolean(selectedWorkerForBooking)}
        onClose={() => setSelectedWorkerForBooking(null)}
        onBookingSuccess={handleBookingSuccess}
      />

      {/* Booking Success Modal */}
      <LabourBookingSuccessModal
        booking={latestBooking}
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        onViewBookings={() => {
          setIsSuccessModalOpen(false);
          setActiveTab("bookings");
        }}
      />

      {/* Register Labour Modal (Quick action from discovery) */}
      <RegisterLabourModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
        onSuccess={() => {
          setIsRegisterModalOpen(false);
          setActiveTab("provider");
        }}
      />
    </div>
  );
}

export default function LabourPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-3 border-[#24833A] border-t-transparent" />
        </div>
      }
    >
      <LabourContent />
    </Suspense>
  );
}
