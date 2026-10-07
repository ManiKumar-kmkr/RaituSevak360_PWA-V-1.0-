"use client";

import React, { useState, useEffect, useMemo, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Landmark,
  ArrowLeft,
  Search,
  X,
  Sparkles,
  Info,
  Building,
  CheckCircle2,
  Clock,
  RotateCcw,
  AlertCircle,
  HelpCircle,
} from "lucide-react";
import { GovernmentScheme, SchemeFilterType } from "@/types/government-scheme";
import { governmentSchemesService, VERIFIED_GOVERNMENT_SCHEMES } from "@/services/government-schemes";
import { useTranslation } from "@/hooks/useTranslation";
import SchemeCard from "@/components/schemes/SchemeCard";
import SchemeDetailView from "@/components/schemes/SchemeDetailView";
import BackButton from "@/components/ui/BackButton";

function SchemesContent() {
  const { t } = useTranslation();
  const router = useRouter();
  const searchParams = useSearchParams();
  const schemeIdParam = searchParams.get("id");

  const [schemes, setSchemes] = useState<GovernmentScheme[]>(VERIFIED_GOVERNMENT_SCHEMES);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);


  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<SchemeFilterType>("all");
  const [selectedScheme, setSelectedScheme] = useState<GovernmentScheme | null>(null);

  // Fetch schemes from verified service
  const loadSchemes = React.useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await governmentSchemesService.getSchemes({
        filter: activeFilter,
        search: searchQuery,
      });
      setSchemes(data);
    } catch (err) {
      setError(
        t("schemes.errorTitle") ||
          "Government scheme information is temporarily unavailable."
      );
    } finally {
      setIsLoading(false);
    }
  }, [activeFilter, searchQuery, t]);

  useEffect(() => {
    loadSchemes();
  }, [loadSchemes]);


  // Handle URL query parameter `?id=...` for direct or shared links
  useEffect(() => {
    if (schemeIdParam) {
      governmentSchemesService.getSchemeById(schemeIdParam).then((found) => {
        if (found) {
          setSelectedScheme(found);
        }
      });
    } else {
      setSelectedScheme(null);
    }
  }, [schemeIdParam]);

  const handleSelectScheme = (scheme: GovernmentScheme) => {
    setSelectedScheme(scheme);
    router.push(`/dashboard/schemes?id=${scheme.id}`);
  };

  const handleBackToList = () => {
    setSelectedScheme(null);
    router.push("/dashboard/schemes");
  };

  const clearFilters = () => {
    setSearchQuery("");
    setActiveFilter("all");
  };

  // Filter chips configuration matching Figma
  const FILTER_CHIPS: { id: SchemeFilterType; labelKey: string; fallback: string }[] = [
    { id: "all", labelKey: "schemes.filterAll", fallback: "All" },
    { id: "active", labelKey: "schemes.filterActive", fallback: "Active" },
    { id: "upcoming", labelKey: "schemes.filterUpcoming", fallback: "Upcoming" },
    { id: "central", labelKey: "schemes.filterCentral", fallback: "Central" },
    { id: "state", labelKey: "schemes.filterState", fallback: "State" },
  ];

  // If a scheme is selected, render Screen 2: Government Scheme Detail
  if (selectedScheme) {
    return (
      <SchemeDetailView
        scheme={selectedScheme}
        onBack={handleBackToList}
      />
    );
  }

  // Otherwise, render Screen 1: Government Schemes List
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-4 pb-20">
      {/* Top Back Navigation to Dashboard */}
      <div className="flex items-center justify-between">
        <BackButton
          href="/dashboard"
          label={t("schemes.backToDashboard") || "Back to Dashboard"}
        />
      </div>

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-3xl bg-white p-5 border border-gray-200 shadow-2xs">
        <div className="flex items-center gap-3.5">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#E4F0DD] text-[#24833A] shadow-xs">
            <Landmark size={26} strokeWidth={2.4} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-bold text-gray-900">
                {t("schemes.title") || "Government Schemes"}
              </h1>
              <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-[#24833A] border border-emerald-200">
                Verified Discovery
              </span>
            </div>
            <p className="text-xs text-gray-500 font-medium">
              {t("schemes.subtitle") ||
                "Discover verified central & state welfare schemes, agricultural subsidies, and investment support"}
            </p>
          </div>
        </div>
      </div>

      {/* Search Input Bar (Figma specification) */}
      <div className="relative w-full">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400">
          <Search size={18} />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={
            t("schemes.searchPlaceholder") || "Search schemes by ministry or crop..."
          }
          className="w-full rounded-2xl border border-gray-200 bg-white py-3.5 pl-10 pr-10 text-xs sm:text-sm text-gray-900 shadow-2xs placeholder:text-gray-400 focus:border-[#24833A] focus:outline-hidden focus:ring-1 focus:ring-[#24833A] transition"
          aria-label="Search schemes"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery("")}
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 transition cursor-pointer"
            aria-label={t("schemes.clearSearch") || "Clear search"}
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Filter Chips Bar (Figma: All, Active, Upcoming, Central, State) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full no-scrollbar">
        {FILTER_CHIPS.map((chip) => {
          const isSelected = activeFilter === chip.id;
          return (
            <button
              key={chip.id}
              type="button"
              onClick={() => setActiveFilter(chip.id)}
              className={`inline-flex shrink-0 items-center justify-center rounded-2xl px-4 py-2 text-xs font-bold transition-all duration-150 cursor-pointer ${
                isSelected
                  ? "bg-[#24833A] text-white shadow-2xs"
                  : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
              }`}
              data-testid={`filter-chip-${chip.id}`}
            >
              <span>{t(chip.labelKey) || chip.fallback}</span>
            </button>
          );
        })}
      </div>

      {/* Informational Eligibility Banner (Figma warning/information card) */}
      <div className="rounded-3xl border border-[#24833A]/25 bg-gradient-to-r from-[#F4F9F2] via-[#EAF4E8] to-[#F4F9F2] p-4.5 shadow-2xs">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#24833A] text-white shadow-2xs">
            <Sparkles size={18} />
          </div>
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-xs sm:text-sm font-extrabold text-[#174D25]">
                {t("schemes.eligibilityBannerTitle") ||
                  "3 schemes you may be eligible for."}
              </h2>
              <span className="rounded-full bg-white/80 px-2 py-0.5 text-[10px] font-bold text-[#24833A] border border-[#24833A]/20">
                Profile Match
              </span>
            </div>
            <p className="mt-0.5 text-xs text-gray-700 font-medium">
              {t("schemes.eligibilityBannerSubtitle") ||
                "Complete profiles to get automatic alerts."}
            </p>
            <p className="mt-1 text-[11px] text-gray-500 italic">
              {t("schemes.informationalNotice") ||
                "Informational helper based on profile criteria; not an official government determination."}
            </p>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="h-9 w-9 animate-spin rounded-full border-3 border-[#24833A] border-t-transparent" />
          <p className="mt-3 text-xs font-semibold text-gray-500">
            {t("schemes.loadingSchemes") || "Loading verified government schemes..."}
          </p>
        </div>
      )}

      {/* Error State */}
      {!isLoading && error && (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-red-200 bg-red-50/50 p-8 text-center">
          <AlertCircle size={32} className="text-red-500 mb-2" />
          <h2 className="text-sm font-bold text-gray-900">{error}</h2>
          <p className="text-xs text-gray-500 mt-1 max-w-sm">
            {t("schemes.errorDesc") ||
              "Unable to load scheme details at this moment. Please check your network and retry."}
          </p>
          <button
            type="button"
            onClick={loadSchemes}
            className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-[#24833A] px-4 py-2 text-xs font-bold text-white hover:bg-[#1e6f31] transition cursor-pointer"
          >
            <RotateCcw size={14} />
            <span>{t("schemes.retry") || "Retry"}</span>
          </button>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !error && schemes.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-gray-300 bg-white p-10 text-center shadow-2xs">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-gray-400 mb-3">
            <Landmark size={24} />
          </div>
          <h2 className="text-sm sm:text-base font-bold text-gray-900">
            {t("schemes.noSchemesFound") || "No schemes found"}
          </h2>
          <p className="mt-1 text-xs text-gray-500 max-w-sm">
            {t("schemes.noSchemesFoundDesc") ||
              "We couldn't find any schemes matching your search or filters. Try a different keyword or reset filters."}
          </p>
          <button
            type="button"
            onClick={clearFilters}
            className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-[#E4F0DD] px-4 py-2 text-xs font-bold text-[#174D25] hover:bg-[#d6e9cd] transition cursor-pointer"
          >
            <span>{t("schemes.clearSearch") || "Clear Search & Filters"}</span>
          </button>
        </div>
      )}

      {/* Schemes Grid / List */}
      {!isLoading && !error && schemes.length > 0 && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between text-xs text-gray-500 px-1">
            <span>
              Showing <strong>{schemes.length}</strong> verified government schemes
            </span>
            {searchQuery && (
              <button
                type="button"
                onClick={clearFilters}
                className="font-bold text-[#24833A] hover:underline cursor-pointer"
              >
                Reset
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {schemes.map((scheme) => (
              <SchemeCard
                key={scheme.id}
                scheme={scheme}
                onViewDetails={handleSelectScheme}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function SchemesPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[50vh] items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-3 border-[#24833A] border-t-transparent" />
        </div>
      }
    >
      <SchemesContent />
    </Suspense>
  );
}
