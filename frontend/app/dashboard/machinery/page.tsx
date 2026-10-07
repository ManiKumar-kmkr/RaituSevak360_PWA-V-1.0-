"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Tractor,
  Wrench,
  Search,
  ArrowLeft,
  X,
  CheckCircle2,
  Calendar,
  Clock,
  MapPin,
  ShieldCheck,
  Phone,
  RefreshCw,
} from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { EquipmentItem, EquipmentCategory, EquipmentBooking } from "@/types/marketplace";
import marketplaceService from "@/services/marketplace";
import MachineryCard from "@/components/machinery/MachineryCard";
import { useCartStore } from "@/store/cart-store";
import { Button } from "@/components/ui/Button";
import BackButton from "@/components/ui/BackButton";

export default function MachineryPage() {
  const { t } = useTranslation();
  const addBooking = useCartStore((state) => state.addBooking);

  const [equipmentList, setEquipmentList] = useState<EquipmentItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<EquipmentCategory>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Booking Modal State
  const [bookingEquipment, setBookingEquipment] = useState<EquipmentItem | null>(null);
  const [bookingDate, setBookingDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split("T")[0];
  });
  const [durationDays, setDurationDays] = useState(1);
  const [farmerName, setFarmerName] = useState("Ramesh Kumar");
  const [contactMobile, setContactMobile] = useState("9876543210");
  const [farmLocation, setFarmLocation] = useState("Plot 14, Madikonda, Hanamkonda");
  const [confirmedBooking, setConfirmedBooking] = useState<EquipmentBooking | null>(null);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const data = await marketplaceService.getEquipment(activeCategory, searchQuery);
        setEquipmentList(data);
      } catch (err) {
        console.error("Failed to load machinery", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [activeCategory, searchQuery]);

  const categories: { id: EquipmentCategory; label: string }[] = [
    { id: "all", label: "All Equipment" },
    { id: "tractor", label: "Tractors" },
    { id: "harvester", label: "Harvesters" },
    { id: "sprayer", label: "Drone Sprayers" },
    { id: "implement", label: "Implements" },
  ];

  const handleConfirmBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingEquipment) return;

    const totalEst = bookingEquipment.dailyRate * durationDays;
    const booking = await marketplaceService.bookEquipment({
      equipmentId: bookingEquipment.id,
      equipmentName: bookingEquipment.name,
      startDate: bookingDate,
      durationDays,
      totalEstimatedAmount: totalEst,
      farmerName,
      contactMobile,
      farmLocation,
    });

    addBooking(booking);
    setConfirmedBooking(booking);
  };

  const handleCloseModal = () => {
    setBookingEquipment(null);
    setConfirmedBooking(null);
    setDurationDays(1);
  };

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-5 pb-24">
      {/* Top Breadcrumb Navigation */}
      <div className="flex items-center justify-between">
        <BackButton href="/dashboard" label={t("common.backToDashboard") || "Back to Dashboard"} />

        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/bookings"
            className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3 py-1.5 text-xs font-bold text-[#174D25] shadow-2xs hover:border-[#24833A] hover:bg-[#E4F0DD] transition cursor-pointer"
          >
            <Calendar size={13} className="text-[#24833A]" />
            <span>My Bookings</span>
          </Link>

          <Link
            href="/dashboard/marketplace"
            className="text-xs font-bold text-[#24833A] hover:underline cursor-pointer"
          >
            Marketplace →
          </Link>
        </div>
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
                Equipment & Machinery Booking
              </h1>
              <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-[#24833A]">
                CHC Hub
              </span>
            </div>
            <p className="text-xs text-gray-500 font-medium">
              Rent high-capacity tractors, combine harvesters, drone sprayers and implements
            </p>
          </div>
        </div>
      </div>

      {/* Custom Hiring Centers (CHC) Govt Hub Card */}
      <div className="rounded-3xl border border-gray-200/90 bg-gradient-to-r from-amber-50/70 via-white to-emerald-50/40 p-4 sm:p-5 shadow-2xs">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-800">
            <Wrench size={20} />
          </div>
          <div>
            <h2 className="text-xs font-bold text-gray-900">
              Government Custom Hiring Centers (CHC)
            </h2>
            <p className="text-[11px] text-gray-600 mt-0.5 leading-relaxed">
              Subsidized rental clusters operated with certified drivers. Rates conform to
              standard district agricultural machinery guidelines.
            </p>
          </div>
        </div>
      </div>

      {/* Search and Category Filters */}
      <div className="flex flex-col gap-3">
        <div className="relative w-full">
          <Search size={18} className="absolute left-3.5 top-3 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tractor, harvester, drone sprayer, rotavator..."
            className="w-full rounded-2xl border border-gray-200 bg-white py-2.5 pl-10 pr-10 text-xs font-medium text-gray-800 placeholder-gray-400 focus:border-[#24833A] focus:outline-hidden shadow-2xs"
            aria-label="Search machinery"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-2.5 flex h-5 w-5 items-center justify-center rounded-full bg-gray-100 text-gray-400 hover:text-gray-700 cursor-pointer"
            >
              <X size={12} />
            </button>
          )}
        </div>

        {/* Category Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {categories.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id)}
                className={`rounded-xl px-3.5 py-2 text-xs font-bold whitespace-nowrap transition active:scale-95 cursor-pointer ${
                  isActive
                    ? "bg-[#24833A] text-white shadow-2xs"
                    : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Equipment Cards Grid */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-3 border-[#24833A] border-t-transparent" />
          <p className="mt-3 text-xs font-semibold text-gray-500">
            Finding available machinery nearby...
          </p>
        </div>
      ) : equipmentList.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 rounded-3xl border border-gray-200 bg-white p-10 text-center shadow-2xs">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
            <Tractor size={28} />
          </div>
          <h2 className="text-sm font-bold text-gray-900">No machinery found</h2>
          <p className="text-xs text-gray-500 max-w-xs">
            No equipment matches your search query in this category.
          </p>
          <button
            type="button"
            onClick={() => {
              setActiveCategory("all");
              setSearchQuery("");
            }}
            className="mt-2 inline-flex items-center gap-1.5 rounded-xl bg-[#24833A] px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-[#1e6e30] transition active:scale-95 cursor-pointer"
          >
            <RefreshCw size={13} />
            <span>Reset Filters</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {equipmentList.map((eq) => (
            <MachineryCard
              key={eq.id}
              equipment={eq}
              onBookNow={(item) => setBookingEquipment(item)}
            />
          ))}
        </div>
      )}

      {/* Book Now Modal */}
      {bookingEquipment && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs animate-in fade-in duration-150"
          onClick={handleCloseModal}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="w-full max-w-md rounded-3xl border border-gray-200 bg-white p-6 shadow-xl animate-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-gray-900">Book Equipment Rental</h3>
                <span className="text-[11px] text-[#24833A] font-semibold">
                  {bookingEquipment.name}
                </span>
              </div>
              <button
                type="button"
                onClick={handleCloseModal}
                className="flex h-8 w-8 items-center justify-center rounded-xl text-gray-400 hover:bg-gray-100 cursor-pointer"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            {confirmedBooking ? (
              <div className="py-6 text-center flex flex-col items-center gap-3">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-[#24833A]">
                  <CheckCircle2 size={32} />
                </div>
                <div>
                  <h4 className="text-base font-extrabold text-gray-900">
                    Rental Booking Confirmed!
                  </h4>
                  <p className="text-xs text-gray-500 mt-1">
                    Booking Reference: <span className="font-mono font-bold text-gray-800">{confirmedBooking.id}</span>
                  </p>
                </div>

                <div className="w-full rounded-2xl bg-gray-50 p-3.5 text-left text-xs text-gray-700 flex flex-col gap-1.5">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Equipment:</span>
                    <span className="font-bold">{confirmedBooking.equipmentName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Date & Duration:</span>
                    <span className="font-bold">
                      {confirmedBooking.startDate} ({confirmedBooking.durationDays} Day{confirmedBooking.durationDays > 1 ? "s" : ""})
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Farm Location:</span>
                    <span className="font-bold">{confirmedBooking.farmLocation}</span>
                  </div>
                  <div className="pt-2 border-t border-gray-200 flex justify-between font-extrabold text-[#174D25]">
                    <span>Estimated Total:</span>
                    <span>₹{confirmedBooking.totalEstimatedAmount.toLocaleString("en-IN")}</span>
                  </div>
                </div>

                <p className="text-[11px] text-gray-500">
                  The operator will arrive at your farm gate on the scheduled morning.
                </p>

                <div className="mt-3 grid grid-cols-2 gap-2 w-full">
                  <Button
                    variant="secondary"
                    size="md"
                    onClick={handleCloseModal}
                  >
                    Done
                  </Button>
                  <Link
                    href="/dashboard/bookings"
                    className="inline-flex items-center justify-center w-full rounded-xl bg-[#24833A] py-2.5 text-xs font-bold text-white shadow-xs hover:bg-[#1e6e30] cursor-pointer"
                  >
                    View in My Bookings
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handleConfirmBooking} className="mt-4 flex flex-col gap-3">
                {/* Rate card summary */}
                <div className="rounded-2xl bg-emerald-50/60 border border-emerald-100 p-3 text-xs flex justify-between items-center">
                  <span className="font-bold text-emerald-900">Rental Rate:</span>
                  <span className="font-extrabold text-[#174D25]">
                    ₹{bookingEquipment.dailyRate.toLocaleString("en-IN")} / day
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Rental Start Date
                  </label>
                  <input
                    type="date"
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    required
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 p-2.5 text-xs text-gray-800 focus:outline-hidden focus:border-[#24833A]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Duration (Days)
                  </label>
                  <select
                    value={durationDays}
                    onChange={(e) => setDurationDays(Number(e.target.value))}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 p-2.5 text-xs text-gray-800 focus:outline-hidden focus:border-[#24833A]"
                  >
                    <option value={1}>1 Day (Full shift)</option>
                    <option value={2}>2 Days</option>
                    <option value={3}>3 Days</option>
                    <option value={5}>5 Days (Weekly rate)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Farmer Name
                  </label>
                  <input
                    type="text"
                    value={farmerName}
                    onChange={(e) => setFarmerName(e.target.value)}
                    required
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 p-2.5 text-xs text-gray-800 focus:outline-hidden focus:border-[#24833A]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Contact Mobile Number
                  </label>
                  <input
                    type="tel"
                    maxLength={10}
                    value={contactMobile}
                    onChange={(e) => setContactMobile(e.target.value)}
                    required
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 p-2.5 text-xs text-gray-800 focus:outline-hidden focus:border-[#24833A]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Farm Gate / Survey Location
                  </label>
                  <input
                    type="text"
                    value={farmLocation}
                    onChange={(e) => setFarmLocation(e.target.value)}
                    required
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 p-2.5 text-xs text-gray-800 focus:outline-hidden focus:border-[#24833A]"
                  />
                </div>

                {/* Estimated total */}
                <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-xs font-bold">
                  <span className="text-gray-600">Estimated Rental Total:</span>
                  <span className="text-sm font-extrabold text-[#174D25]">
                    ₹{(bookingEquipment.dailyRate * durationDays).toLocaleString("en-IN")}
                  </span>
                </div>

                <div className="mt-2 flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={handleCloseModal}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    size="sm"
                  >
                    Confirm Booking
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
