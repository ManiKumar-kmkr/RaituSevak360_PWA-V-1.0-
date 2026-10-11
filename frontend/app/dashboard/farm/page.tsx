"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Trees,
  MapPin,
  ArrowLeft,
  Search,
  X,
  RotateCcw,
  Plus,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { LandPlot, LandRentalRequest, SoilType } from "@/types/land";
import { landService } from "@/services/land";
import { useCartStore } from "@/store/cart-store";
import LandCard from "@/components/land/LandCard";
import LandDetailsModal from "@/components/land/LandDetailsModal";
import LandRentalRequestModal from "@/components/land/LandRentalRequestModal";
import LandRequestSuccessModal from "@/components/land/LandRequestSuccessModal";
import LandRequestsView from "@/components/land/LandRequestsView";
import LandProviderView from "@/components/land/LandProviderView";
import ListLandModal from "@/components/land/ListLandModal";
import BackButton from "@/components/ui/BackButton";

function FarmContent() {
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");
  const initialTab =
    tabParam === "requests"
      ? "requests"
      : tabParam === "provider"
      ? "provider"
      : tabParam === "myplots"
      ? "myplots"
      : "rent";

  const [activeTab, setActiveTab] = useState<
    "rent" | "requests" | "provider" | "myplots"
  >(initialTab);
  const [landPlots, setLandPlots] = useState<LandPlot[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSoilType, setSelectedSoilType] = useState<SoilType>("all");

  // Modals state
  const [selectedLandForDetails, setSelectedLandForDetails] =
    useState<LandPlot | null>(null);
  const [selectedLandForRequest, setSelectedLandForRequest] =
    useState<LandPlot | null>(null);
  const [latestRequest, setLatestRequest] = useState<LandRentalRequest | null>(
    null
  );
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isListModalOpen, setIsListModalOpen] = useState(false);

  // Persistent Zustand store: requests & landlord listings
  const landRequests = useCartStore((state) => state.landRequests || []);
  const myLandListings = useCartStore((state) => state.myLandListings || []);

  // Fetch land listings from service layer, seamlessly combining active landlord listings
  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    landService
      .getLandListings({
        soilType: selectedSoilType,
        search: searchQuery,
        userListings: myLandListings,
      })
      .then((data) => {
        if (isMounted) {
          setLandPlots(data);
          setIsLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [selectedSoilType, searchQuery, myLandListings]);

  const handleOpenRequest = (land: LandPlot) => {
    setSelectedLandForDetails(null);
    setSelectedLandForRequest(land);
  };

  const handleRequestSuccess = (request: LandRentalRequest) => {
    setSelectedLandForRequest(null);
    setLatestRequest(request);
    setIsSuccessModalOpen(true);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedSoilType("all");
  };

  const SOIL_TYPE_TABS: { id: SoilType; label: string }[] = [
    { id: "all", label: "All Soils" },
    { id: "black_cotton", label: "🌱 Black Cotton" },
    { id: "red_loam", label: "🌾 Red Loam" },
    { id: "alluvial", label: "💧 Alluvial Basin" },
    { id: "sandy_loam", label: "🌿 Sandy Loam" },
    { id: "clay", label: "🌾 Heavy Clay" },
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
            <Trees size={26} strokeWidth={2.4} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                Agricultural Land Ecosystem
              </h1>
              <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-[#174D25] border border-emerald-200/80">
                Two-Sided Hub
              </span>
            </div>
            <p className="text-xs text-gray-500 font-medium">
              Browse plots for rent • Or list your farmland to verified local cultivators
            </p>
          </div>
        </div>

        {/* View Switch: Land for Rent / My Requests / List Your Land / My Farm Plots */}
        <div className="flex items-center rounded-2xl bg-gray-100 p-1 self-start sm:self-auto border border-gray-200/60 overflow-x-auto max-w-full">
          <button
            type="button"
            onClick={() => setActiveTab("rent")}
            className={`rounded-xl px-3 py-1.5 text-xs font-bold transition flex-shrink-0 cursor-pointer ${
              activeTab === "rent"
                ? "bg-white text-gray-900 shadow-2xs"
                : "text-gray-500 hover:text-gray-900"
            }`}
          >
            Land for Rent
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("requests")}
            className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition flex-shrink-0 cursor-pointer ${
              activeTab === "requests"
                ? "bg-white text-gray-900 shadow-2xs"
                : "text-gray-500 hover:text-gray-900"
            }`}
          >
            <span>My Requests</span>
            {landRequests.length > 0 && (
              <span className="rounded-full bg-[#24833A] px-1.5 py-0.2 text-[10px] font-extrabold text-white">
                {landRequests.length}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("provider")}
            className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition flex-shrink-0 cursor-pointer ${
              activeTab === "provider"
                ? "bg-white text-gray-900 shadow-2xs"
                : "text-gray-500 hover:text-gray-900"
            }`}
          >
            <span>{myLandListings.length > 0 ? "My Land Listings" : "List Your Land"}</span>
            {myLandListings.length > 0 ? (
              <span className="rounded-full bg-blue-100 px-1.5 py-0.2 text-[10px] font-bold text-blue-800">
                {myLandListings.length}
              </span>
            ) : (
              <span className="rounded-full bg-emerald-100 px-1.5 py-0.2 text-[10px] font-bold text-[#174D25]">
                New
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("myplots")}
            className={`rounded-xl px-3 py-1.5 text-xs font-bold transition flex-shrink-0 cursor-pointer ${
              activeTab === "myplots"
                ? "bg-white text-gray-900 shadow-2xs"
                : "text-gray-500 hover:text-gray-900"
            }`}
          >
            My Farm Plots
          </button>
        </div>
      </div>

      {activeTab === "rent" && (
        <>
          {/* Provider Callout Bar (Secondary Entry Point to List Your Land) */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 rounded-2xl border border-blue-200/80 bg-blue-50/70 p-3 text-xs text-blue-900">
            <div className="flex items-center gap-2">
              <Trees size={16} className="text-blue-700 flex-shrink-0" />
              <div>
                <span className="font-bold">Have agricultural land available?</span>
                <p className="text-[11px] text-blue-800/80">
                  Rent out your agricultural land to other farmers and earn stable lease income.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                if (myLandListings.length > 0) {
                  setActiveTab("provider");
                } else {
                  setIsListModalOpen(true);
                }
              }}
              className="inline-flex items-center justify-center gap-1 rounded-xl bg-blue-700 px-3.5 py-1.5 text-xs font-bold text-white shadow-2xs hover:bg-blue-800 cursor-pointer flex-shrink-0 self-start sm:self-auto"
            >
              <Plus size={13} />
              <span>{myLandListings.length > 0 ? "My Land Listings" : "List Your Land"}</span>
            </button>
          </div>

          {/* Search & Soil Filter Bar */}
          <div className="flex flex-col gap-2.5 rounded-2xl bg-white p-4 border border-gray-200 shadow-2xs">
            {/* Search Input */}
            <div className="relative flex items-center w-full">
              <Search
                size={18}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by location, soil, or crop (e.g. Tenali, black soil, paddy, Warangal)..."
                className="h-11 w-full rounded-xl border border-gray-200 bg-white pl-10 pr-10 text-xs sm:text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#24833A] focus:ring-2 focus:ring-[#24833A]/20 transition"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 flex h-5 w-5 items-center justify-center rounded-full bg-gray-100 text-gray-400 hover:text-gray-700 cursor-pointer"
                  aria-label="Clear search query"
                >
                  <X size={12} />
                </button>
              )}
            </div>

            {/* Soil Filter Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1">
              {SOIL_TYPE_TABS.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setSelectedSoilType(tab.id)}
                  className={`rounded-full px-3.5 py-1.5 text-xs font-bold transition flex-shrink-0 cursor-pointer active:scale-95 ${
                    selectedSoilType === tab.id
                      ? "bg-[#24833A] text-white shadow-xs"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200/70"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Regional Land Inventory Pill */}
          <div className="flex items-center justify-between rounded-2xl border border-[#24833A]/20 bg-[#F4FBF5] px-4 py-2.5 text-xs text-gray-600">
            <div className="flex items-center gap-2">
              <MapPin size={14} className="text-[#24833A]" />
              <span className="font-medium">
                Verified Listings: <strong>Telangana & Andhra Pradesh Agricultural Zones</strong>
              </span>
            </div>
            <span className="text-[11px] font-bold text-[#24833A]">
              {landPlots.length} Plots Available
            </span>
          </div>

          {/* Land Cards Grid or Empty State */}
          {isLoading ? (
            <div className="flex flex-col items-center justify-center p-12 text-center">
              <div className="h-8 w-8 animate-spin rounded-full border-3 border-[#24833A] border-t-transparent mb-3" />
              <p className="text-xs text-gray-500 font-medium">
                Loading verified agricultural land listings...
              </p>
            </div>
          ) : landPlots.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center shadow-2xs">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gray-100 text-gray-400 mb-3">
                <Trees size={28} />
              </div>
              <h3 className="text-sm font-bold text-gray-900">No Rental Land Found</h3>
              <p className="mt-1 max-w-xs text-xs text-gray-500">
                No agricultural plots match your current search query or soil filter.
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
              {landPlots.map((land) => (
                <LandCard
                  key={land.id}
                  land={land}
                  onViewDetails={(l) => setSelectedLandForDetails(l)}
                  onRequest={(l) => handleOpenRequest(l)}
                />
              ))}
            </div>
          )}
        </>
      )}

      {activeTab === "requests" && (
        /* Consumer Land Rental Requests View */
        <LandRequestsView onBrowseLand={() => setActiveTab("rent")} />
      )}

      {activeTab === "provider" && (
        /* Landlord Provider View */
        <LandProviderView onSwitchToRent={() => setActiveTab("rent")} />
      )}

      {activeTab === "myplots" && (
        /* Existing Registered Farm Plot Records */
        <div className="flex flex-col gap-3">
          <div className="rounded-2xl border border-[#24833A]/20 bg-[#F4FBF5] p-5 shadow-2xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-[#174D25] font-bold text-sm">
                <MapPin size={18} className="text-[#24833A]" />
                <span>Plot #1: South Canal Acreage (5.5 Acres)</span>
              </div>
              <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold text-[#174D25]">
                Active Cultivation
              </span>
            </div>
            <p className="text-xs text-gray-600 mt-2 leading-relaxed">
              Black cotton soil • Borewell + Drip Irrigation • Current Crop: Paddy (Kharif)
            </p>
            <div className="mt-3 flex items-center gap-4 text-[11px] text-gray-500 border-t border-[#24833A]/15 pt-2">
              <span>Geo-fenced Survey No: 42/B</span>
              <span>•</span>
              <span>Soil Health: NPK Optimal</span>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-2xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-gray-900 font-bold text-sm">
                <MapPin size={18} className="text-gray-400" />
                <span>Plot #2: East Highway Orchard (2.0 Acres)</span>
              </div>
              <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-[10px] font-bold text-blue-700">
                Fallow / Soil Prep
              </span>
            </div>
            <p className="text-xs text-gray-600 mt-2 leading-relaxed">
              Red sandy loam • Sub-surface Drip • Prepared for Chilli Season
            </p>
            <div className="mt-3 flex items-center gap-4 text-[11px] text-gray-500 border-t border-gray-100 pt-2">
              <span>Geo-fenced Survey No: 43/A</span>
              <span>•</span>
              <span>Organic Carbon: 0.62%</span>
            </div>
          </div>
        </div>
      )}

      {/* Land Details Modal */}
      <LandDetailsModal
        land={selectedLandForDetails}
        isOpen={Boolean(selectedLandForDetails)}
        onClose={() => setSelectedLandForDetails(null)}
        onRequest={(l) => handleOpenRequest(l)}
      />

      {/* Land Rental Request Modal */}
      <LandRentalRequestModal
        land={selectedLandForRequest}
        isOpen={Boolean(selectedLandForRequest)}
        onClose={() => setSelectedLandForRequest(null)}
        onRequestSuccess={handleRequestSuccess}
      />

      {/* Request Success Modal */}
      <LandRequestSuccessModal
        request={latestRequest}
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        onViewRequests={() => {
          setIsSuccessModalOpen(false);
          setActiveTab("requests");
        }}
      />

      {/* List Land Modal (Quick action from discovery) */}
      <ListLandModal
        isOpen={isListModalOpen}
        onClose={() => setIsListModalOpen(false)}
        onSuccess={() => {
          setIsListModalOpen(false);
          setActiveTab("provider");
        }}
      />
    </div>
  );
}

export default function FarmPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-3 border-[#24833A] border-t-transparent" />
        </div>
      }
    >
      <FarmContent />
    </Suspense>
  );
}
