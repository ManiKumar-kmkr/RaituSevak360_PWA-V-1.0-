"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  Search,
  MapPin,
  TrendingUp,
  X,
  RefreshCw,
  AlertCircle,
  SlidersHorizontal,
} from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { MarketCrop, Mandi, CropCategory } from "@/types/market";
import marketPriceService, { AVAILABLE_MANDIS } from "@/services/market";
import CropPriceCard from "@/components/market/CropPriceCard";
import MandiSelectorModal from "@/components/market/MandiSelectorModal";
import MarketPriceDetail from "@/components/market/MarketPriceDetail";
import { BackButton } from "@/components/ui/BackButton";

const CATEGORIES: CropCategory[] = ["all", "grains", "vegetables", "fruits", "spices"];

export default function MarketPricesPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Active crop param for detail view
  const selectedCropId = searchParams.get("crop");

  // State management
  const [activeMandi, setActiveMandi] = useState<Mandi>(AVAILABLE_MANDIS[0]);
  const [activeCategory, setActiveCategory] = useState<CropCategory>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [crops, setCrops] = useState<MarketCrop[]>([]);
  const [selectedCrop, setSelectedCrop] = useState<MarketCrop | null>(null);
  const [isMandiModalOpen, setIsMandiModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Load crops when mandi, category, or search changes
  const fetchPrices = useCallback(async () => {
    setIsLoading(true);
    setHasError(false);
    try {
      const data = await marketPriceService.getMarketPrices(
        activeMandi.id,
        activeCategory,
        searchQuery
      );
      setCrops(data);

      // If viewing detail, update detail crop object as well
      if (selectedCropId) {
        const detail = await marketPriceService.getCropPriceDetail(
          selectedCropId,
          activeMandi.id
        );
        setSelectedCrop(detail);
      } else {
        setSelectedCrop(null);
      }
    } catch {
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  }, [activeMandi.id, activeCategory, searchQuery, selectedCropId]);

  useEffect(() => {
    fetchPrices();
  }, [fetchPrices]);

  // Handle crop card click -> updates URL to push new history entry
  const handleSelectCrop = (crop: MarketCrop) => {
    router.push(`/dashboard/market-prices?crop=${crop.id}`);
  };

  // Handle back to list -> updates URL
  const handleBackToList = () => {
    router.push("/dashboard/market-prices");
  };

  // Mandi change handler
  const handleSelectMandi = (mandi: Mandi) => {
    setActiveMandi(mandi);
    marketPriceService.setActiveMandi(mandi.id);
  };

  // If a crop is selected via URL, show the Detail screen
  if (selectedCropId && selectedCrop) {
    return (
      <MarketPriceDetail
        crop={selectedCrop}
        activeMandi={activeMandi}
        onBackToList={handleBackToList}
        onChangeMandiClick={() => setIsMandiModalOpen(true)}
      />
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-4 sm:gap-5 pb-20">
      {/* Top Back Navigation */}
      <div className="flex items-center justify-between">
        <BackButton
          id="btn-back-dashboard"
          href="/dashboard"
          label={t("marketPrices.backToDashboard") || t("common.backToDashboard") || "Back to Dashboard"}
        />
      </div>

      {/* 1. Header & Location Bar */}
      <div className="rounded-2xl border border-[#DCE7DD] bg-white p-5 sm:p-7 shadow-2xs">
        {/* Top: Title & Mandi Location */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#DCE7DD] pb-5">
          <div className="flex items-center gap-3.5">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#E4F0DD] text-[#24833A] shadow-xs">
              <TrendingUp size={24} strokeWidth={2.4} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
                  {t("marketPrices.title")}
                </h1>
                <span className="rounded-full bg-[#DCFCE7] px-2.5 py-0.5 text-[11px] font-bold text-[#166534]">
                  {t("dashboard.badgeLive")}
                </span>
              </div>
              <p className="text-xs text-[#5F6F64] font-medium">
                {t("marketPrices.subtitle")}
              </p>
            </div>
          </div>

          {/* Mandi Location Section */}
          <div className="flex items-center gap-2 rounded-xl border border-[#DCE7DD] bg-[#F7F9F6] p-2 pl-3">
            <div className="flex items-center gap-1.5 min-w-0">
              <MapPin size={16} className="text-[#24833A] shrink-0" />
              <span className="text-xs font-bold text-[#17321F] truncate max-w-[170px] sm:max-w-[200px]">
                {activeMandi.name.split(",")[0]}
              </span>
            </div>
            <button
              id="btn-open-mandi-modal"
              type="button"
              onClick={() => setIsMandiModalOpen(true)}
              className="rounded-xl bg-white border border-[#24833A]/30 px-3 py-1.5 text-xs font-bold text-[#174D25] shadow-2xs hover:bg-[#EAF7EE] transition active:scale-95 cursor-pointer"
            >
              {t("marketPrices.changeMandi")}
            </button>
          </div>
        </div>

        {/* 2. Search & Category Filters */}
        <div className="mt-5 flex flex-col gap-4">
          {/* Search Input */}
          <div className="relative w-full">
            <Search
              size={18}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              id="input-search-crops"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t("marketPrices.searchPlaceholder")}
              className="h-11 w-full rounded-xl border border-[#DCE7DD] bg-white pl-10 pr-10 text-xs sm:text-sm font-semibold text-[#17321F] placeholder-gray-400 focus:outline-none focus:border-[#24833A] focus:ring-2 focus:ring-[#24833A]/20 shadow-2xs transition"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 flex h-5 w-5 items-center justify-center rounded-full bg-gray-100 text-gray-400 hover:text-gray-700 transition cursor-pointer"
                aria-label={t("marketPrices.clearSearch")}
              >
                <X size={12} />
              </button>
            )}
          </div>

          {/* Category Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            <span className="hidden sm:flex items-center gap-1 text-xs font-bold text-[#5F6F64] mr-1">
              <SlidersHorizontal size={14} />
            </span>
            {CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat;
              return (
                <button
                  key={cat}
                  id={`filter-category-${cat}`}
                  type="button"
                  onClick={() => setActiveCategory(cat)}
                  className={`
                    shrink-0 rounded-full px-3.5 py-1.5 sm:px-4 text-xs font-bold transition active:scale-95 cursor-pointer
                    ${
                      isActive
                        ? "bg-[#24833A] text-white shadow-2xs"
                        : "border border-[#DCE7DD] bg-white text-gray-700 hover:bg-[#EAF7EE] hover:border-[#24833A]"
                    }
                  `}
                >
                  {t(`marketPrices.categories.${cat}`)}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 3. Crops Grid or States */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="h-56 animate-pulse rounded-2xl border border-[#DCE7DD] bg-white p-5 shadow-2xs"
            >
              <div className="h-4 w-24 bg-gray-200 rounded-full mb-3" />
              <div className="h-6 w-44 bg-gray-200 rounded-lg mb-2" />
              <div className="h-3 w-32 bg-gray-100 rounded mb-6" />
              <div className="h-8 w-28 bg-gray-200 rounded mb-4" />
              <div className="h-10 w-full bg-gray-100 rounded-xl" />
            </div>
          ))}
        </div>
      ) : hasError ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-[#DCE7DD] bg-white p-8 sm:p-12 text-center shadow-2xs">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-red-50 text-red-600 mb-3">
            <AlertCircle size={28} />
          </div>
          <h3 className="text-base sm:text-lg font-bold text-[#17321F]">
            {t("marketPrices.errorTitle")}
          </h3>
          <p className="text-xs text-[#5F6F64] mt-1 max-w-md">
            We could not fetch market prices right now. Please verify your connection and try again.
          </p>
          <button
            type="button"
            onClick={fetchPrices}
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#174D25] px-5 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-[#24833A] transition cursor-pointer"
          >
            <RefreshCw size={14} />
            <span>{t("marketPrices.retry")}</span>
          </button>
        </div>
      ) : crops.length === 0 ? (
        /* Empty State */
        <div className="flex flex-col items-center justify-center rounded-2xl border border-[#DCE7DD] bg-white p-8 sm:p-14 text-center shadow-2xs">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[#EAF7EE] text-[#174D25] mb-3">
            <Search size={26} className="text-[#24833A]" />
          </div>
          <h3 className="text-base sm:text-lg font-bold text-[#17321F]">
            {t("marketPrices.noCropsFound")}
          </h3>
          <p className="text-xs text-[#5F6F64] mt-1 max-w-sm">
            {t("marketPrices.noCropsFoundDesc")}
          </p>
          {(searchQuery || activeCategory !== "all") && (
            <button
              id="btn-clear-search"
              type="button"
              onClick={() => {
                setSearchQuery("");
                setActiveCategory("all");
              }}
              className="mt-5 rounded-xl border border-[#24833A] bg-white px-4 py-2 text-xs font-bold text-[#174D25] hover:bg-[#EAF7EE] transition cursor-pointer"
            >
              {t("marketPrices.clearSearch")}
            </button>
          )}
        </div>
      ) : (
        /* Render Crop Cards Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {crops.map((crop) => (
            <CropPriceCard
              key={crop.id}
              crop={crop}
              onSelectCrop={handleSelectCrop}
            />
          ))}
        </div>
      )}

      {/* 4. Mandi Selector Modal */}
      <MandiSelectorModal
        mandis={AVAILABLE_MANDIS}
        currentMandiId={activeMandi.id}
        isOpen={isMandiModalOpen}
        onClose={() => setIsMandiModalOpen(false)}
        onSelectMandi={handleSelectMandi}
      />
    </div>
  );
}
