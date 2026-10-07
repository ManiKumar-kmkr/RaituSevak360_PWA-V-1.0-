"use client";

import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  MapPin,
  TrendingUp,
  TrendingDown,
  ShieldCheck,
  Calendar,
  Clock,
  Package,
  Bell,
  CheckCircle2,
  Sparkles,
  Building2,
  Sprout,
  Plus,
  Minus,
} from "lucide-react";
import { MarketCrop, Mandi } from "@/types/market";
import { useTranslation } from "@/hooks/useTranslation";
import marketPriceService from "@/services/market";
import BackButton from "@/components/ui/BackButton";

interface MarketPriceDetailProps {
  crop: MarketCrop;
  activeMandi: Mandi;
  onBackToList: () => void;
  onChangeMandiClick: () => void;
}

export default function MarketPriceDetail({
  crop,
  activeMandi,
  onBackToList,
  onChangeMandiClick,
}: MarketPriceDetailProps) {
  const { t } = useTranslation();

  // Price Alert local state
  const [alertConfig, setAlertConfig] = useState(() => {
    return (
      marketPriceService.getPriceAlert(crop.id) || {
        cropId: crop.id,
        cropName: crop.name,
        targetPrice: Math.round((crop.currentPrice * 1.05) / 50) * 50,
        enabled: false,
        mandiId: activeMandi.id,
      }
    );
  });

  const handleToggleAlert = () => {
    const updated = {
      ...alertConfig,
      enabled: !alertConfig.enabled,
      mandiId: activeMandi.id,
    };
    setAlertConfig(updated);
    marketPriceService.savePriceAlert(updated);
  };

  const adjustTargetPrice = (delta: number) => {
    const updated = {
      ...alertConfig,
      targetPrice: Math.max(100, alertConfig.targetPrice + delta),
    };
    setAlertConfig(updated);
    marketPriceService.savePriceAlert(updated);
  };

  // Scroll to top upon opening detail
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [crop.id]);

  // Calculations for MSP comparison
  const isAboveMsp = crop.currentPrice >= crop.govtMsp;
  const mspDiff = crop.currentPrice - crop.govtMsp;
  const mspPercent = Math.abs(Math.round((mspDiff / crop.govtMsp) * 1000) / 10);

  // 30-Day Trend metrics
  const prices = crop.trend30Days.map((p) => p.price);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const avgPrice = Math.round(prices.reduce((a, b) => a + b, 0) / prices.length);
  const firstPrice = prices[0];
  const net30DayDiff = crop.currentPrice - firstPrice;
  const net30DayPercent = Math.abs(Math.round((net30DayDiff / firstPrice) * 1000) / 10);

  // SVG Chart Dimensions & Points
  const chartWidth = 560;
  const chartHeight = 160;
  const paddingX = 20;
  const paddingY = 25;
  const usableWidth = chartWidth - paddingX * 2;
  const usableHeight = chartHeight - paddingY * 2;
  const priceRange = maxPrice - minPrice || 1;

  const points = crop.trend30Days.map((p, idx) => {
    const x = paddingX + (idx / (crop.trend30Days.length - 1)) * usableWidth;
    const y =
      paddingY + usableHeight - ((p.price - minPrice) / priceRange) * usableHeight;
    return { x, y, ...p };
  });

  const pathD = points.reduce((acc, pt, idx) => {
    return idx === 0 ? `M ${pt.x},${pt.y}` : `${acc} L ${pt.x},${pt.y}`;
  }, "");

  const areaD = `${pathD} L ${points[points.length - 1].x},${
    chartHeight - 8
  } L ${points[0].x},${chartHeight - 8} Z`;

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-5 sm:gap-6 pb-20">
      {/* Top Header Navigation */}
      <div className="flex items-center justify-between">
        <BackButton
          id="btn-back-to-prices"
          onClick={onBackToList}
          label={t("marketPrices.backToPrices") || "Back to Market Prices"}
        />
      </div>

      {/* 1. Title Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-3xl border border-[#DCE7DD] bg-white p-4 sm:p-5 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-base sm:text-xl font-black text-[#17321F] tracking-tight">
                {crop.name}
              </h1>
              <span className="rounded-full bg-[#EAF7EE] px-2.5 py-0.5 text-[10px] font-black uppercase text-[#174D25]">
                {t(`marketPrices.categories.${crop.category}`)}
              </span>
            </div>
            <p className="text-xs text-[#5F6F64] font-medium truncate">
              {crop.variety}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto text-[11px] font-semibold text-[#5F6F64]">
          <Clock size={13} className="text-[#24833A]" />
          <span>{t("marketPrices.lastUpdated")}: {crop.lastUpdated}</span>
        </div>
      </div>

      {/* 2. Main Mandi Price Card */}
      <div className="rounded-3xl border border-[#DCE7DD] bg-white p-5 sm:p-7 shadow-2xs">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#DCE7DD] pb-4">
          <div className="flex items-center gap-2 text-xs font-bold text-[#174D25]">
            <MapPin size={16} className="text-[#24833A]" />
            <span>{activeMandi.name}</span>
          </div>

          <button
            id="btn-detail-change-mandi"
            type="button"
            onClick={onChangeMandiClick}
            className="rounded-xl border border-[#24833A]/30 bg-[#EAF7EE] px-3 py-1.5 text-xs font-bold text-[#174D25] hover:bg-[#24833A] hover:text-white transition active:scale-95 cursor-pointer"
          >
            {t("marketPrices.changeMandi")}
          </button>
        </div>

        <div className="mt-5 flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-4">
          <div>
            <span className="block text-xs font-bold uppercase tracking-wider text-[#5F6F64]">
              {t("marketPrices.currentMandi")} Rate
            </span>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-black text-[#174D25] tracking-tight">
                ₹{crop.currentPrice.toLocaleString("en-IN")}
              </span>
              <span className="text-sm font-bold text-[#5F6F64]">
                /{crop.unit}
              </span>
            </div>
          </div>

          {/* Movement Pill */}
          <div
            className={`
              inline-flex items-center gap-1.5 self-start sm:self-auto rounded-2xl px-3.5 py-1.5 text-xs sm:text-sm font-black
              ${
                crop.isPositive
                  ? "bg-[#DCFCE7] text-[#166534]"
                  : "bg-[#FEE2E2] text-[#991B1B]"
              }
            `}
          >
            {crop.isPositive ? (
              <TrendingUp size={16} strokeWidth={2.6} />
            ) : (
              <TrendingDown size={16} strokeWidth={2.6} />
            )}
            <span>
              {crop.isPositive ? "+" : ""}
              ₹{Math.abs(crop.priceChange)} ({crop.isPositive ? "+" : ""}
              {crop.priceChangePercent}%)
            </span>
          </div>
        </div>

        {/* Today's Range Visual Bar & Info */}
        <div className="mt-6 rounded-2xl bg-[#F7F9F6] p-4 sm:p-5 border border-[#DCE7DD]">
          <div className="flex items-center justify-between text-xs font-bold text-[#17321F] mb-2">
            <span>{t("marketPrices.todayRange")}</span>
            <span>
              ₹{crop.todayMin.toLocaleString("en-IN")} – ₹{crop.todayMax.toLocaleString("en-IN")}
            </span>
          </div>

          {/* Visual Range bar */}
          <div className="relative h-2.5 w-full rounded-full bg-gray-200 overflow-hidden">
            <div
              className="absolute h-full rounded-full bg-[#24833A]"
              style={{
                left: "0%",
                width: `${Math.min(
                  100,
                  Math.max(
                    15,
                    ((crop.currentPrice - crop.todayMin) /
                      (crop.todayMax - crop.todayMin || 1)) *
                      100
                  )
                )}%`,
              }}
            />
          </div>

          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-[#E5ECE5] text-xs">
            <div className="flex items-center gap-2 text-[#5F6F64]">
              <Package size={14} className="text-[#24833A]" />
              <span className="font-semibold">{t("marketPrices.arrivals")}:</span>
              <span className="font-bold text-[#17321F]">{crop.arrivals}</span>
            </div>
            <div className="flex items-center gap-2 text-[#5F6F64]">
              <Clock size={14} className="text-[#24833A]" />
              <span className="font-semibold">{t("marketPrices.tradingHours")}:</span>
              <span className="font-bold text-[#17321F]">{crop.tradingWindow}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Government MSP Card */}
      <div className="rounded-3xl border border-[#DCE7DD] bg-white p-5 sm:p-6 shadow-2xs">
        <div className="flex items-center gap-2 text-sm font-black text-[#17321F] mb-3">
          <ShieldCheck size={20} className="text-[#24833A]" />
          <span>{t("marketPrices.govtMsp")}</span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-2xl bg-[#EAF7EE]/60 p-4 border border-[#86EFAC]/60">
          <div>
            <span className="text-xs text-[#5F6F64] font-semibold">
              Official MSP (FAQ Standard)
            </span>
            <div className="text-xl sm:text-2xl font-black text-[#174D25]">
              ₹{crop.govtMsp.toLocaleString("en-IN")} <span className="text-xs font-bold text-[#5F6F64]">/{crop.unit}</span>
            </div>
          </div>

          <div
            className={`
              inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-black
              ${isAboveMsp ? "bg-[#DCFCE7] text-[#166534]" : "bg-[#FEE2E2] text-[#991B1B]"}
            `}
          >
            {isAboveMsp ? (
              <TrendingUp size={14} strokeWidth={2.4} />
            ) : (
              <TrendingDown size={14} strokeWidth={2.4} />
            )}
            <span>
              {isAboveMsp ? `+₹${mspDiff}` : `-₹${Math.abs(mspDiff)}`} ({mspPercent}% {isAboveMsp ? t("marketPrices.aboveMsp") : t("marketPrices.belowMsp")})
            </span>
          </div>
        </div>

        <p className="mt-3 text-[11px] text-[#5F6F64] font-medium leading-relaxed">
          Government Minimum Support Price (MSP) ensures price assurance under designated government procurement schemes.
        </p>
      </div>

      {/* 4. 30-Day Trend Chart & Insight */}
      <div className="rounded-3xl border border-[#DCE7DD] bg-white p-5 sm:p-7 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-[#DCE7DD] pb-4">
          <div>
            <h3 className="text-base sm:text-lg font-black text-[#17321F]">
              {t("marketPrices.trendTitle")}
            </h3>
            <p className="text-xs text-[#5F6F64] font-medium">
              {t("marketPrices.dailyClose")} at {activeMandi.name}
            </p>
          </div>

          <div
            className={`
              inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold self-start sm:self-auto
              ${net30DayDiff >= 0 ? "bg-[#DCFCE7] text-[#166534]" : "bg-[#FEE2E2] text-[#991B1B]"}
            `}
          >
            {net30DayDiff >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            <span>
              {net30DayDiff >= 0 ? "+" : ""}{net30DayPercent}% in 30 Days
            </span>
          </div>
        </div>

        {/* 30-Day Key Metric Pills */}
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <div className="rounded-2xl border border-[#DCE7DD] bg-[#F7F9F6] p-3 text-center">
            <span className="block text-[10px] font-bold text-[#5F6F64] uppercase tracking-wider">
              30-Day Low
            </span>
            <span className="text-sm font-black text-[#17321F]">
              ₹{minPrice.toLocaleString("en-IN")}
            </span>
          </div>
          <div className="rounded-2xl border border-[#DCE7DD] bg-[#F7F9F6] p-3 text-center">
            <span className="block text-[10px] font-bold text-[#5F6F64] uppercase tracking-wider">
              30-Day High
            </span>
            <span className="text-sm font-black text-[#17321F]">
              ₹{maxPrice.toLocaleString("en-IN")}
            </span>
          </div>
          <div className="rounded-2xl border border-[#DCE7DD] bg-[#F7F9F6] p-3 text-center">
            <span className="block text-[10px] font-bold text-[#5F6F64] uppercase tracking-wider">
              30-Day Avg
            </span>
            <span className="text-sm font-black text-[#17321F]">
              ₹{avgPrice.toLocaleString("en-IN")}
            </span>
          </div>
          <div className="rounded-2xl border border-[#DCE7DD] bg-[#F7F9F6] p-3 text-center">
            <span className="block text-[10px] font-bold text-[#5F6F64] uppercase tracking-wider">
              Net Change
            </span>
            <span
              className={`text-sm font-black ${
                net30DayDiff >= 0 ? "text-[#166534]" : "text-[#991B1B]"
              }`}
            >
              {net30DayDiff >= 0 ? `+₹${net30DayDiff}` : `-₹${Math.abs(net30DayDiff)}`}
            </span>
          </div>
        </div>

        {/* Responsive Clean SVG Trend Chart */}
        <div className="mt-5 w-full overflow-hidden rounded-2xl bg-[#F7F9F6] p-2 sm:p-4 border border-[#DCE7DD]">
          <svg
            viewBox={`0 0 ${chartWidth} ${chartHeight}`}
            className="w-full h-44 sm:h-52 overflow-visible"
            aria-label="30-day commodity price chart"
          >
            <defs>
              <linearGradient id="priceTrendGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#24833A" stopOpacity="0.28" />
                <stop offset="100%" stopColor="#24833A" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Grid horizontal guidelines */}
            <line
              x1={paddingX}
              y1={paddingY}
              x2={chartWidth - paddingX}
              y2={paddingY}
              stroke="#DCE7DD"
              strokeDasharray="3 3"
            />
            <line
              x1={paddingX}
              y1={paddingY + usableHeight / 2}
              x2={chartWidth - paddingX}
              y2={paddingY + usableHeight / 2}
              stroke="#DCE7DD"
              strokeDasharray="3 3"
            />
            <line
              x1={paddingX}
              y1={chartHeight - 8}
              x2={chartWidth - paddingX}
              y2={chartHeight - 8}
              stroke="#DCE7DD"
            />

            {/* Area Fill */}
            <path d={areaD} fill="url(#priceTrendGrad)" />

            {/* Trend Line */}
            <path
              d={pathD}
              fill="none"
              stroke="#24833A"
              strokeWidth="2.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* End Point (Current Price) */}
            <circle
              cx={points[points.length - 1].x}
              cy={points[points.length - 1].y}
              r="5"
              fill="#174D25"
              stroke="#FFFFFF"
              strokeWidth="2"
            />

            {/* Price labels at start and end */}
            <text
              x={points[0].x}
              y={chartHeight - 12}
              fontSize="10"
              fontWeight="bold"
              fill="#5F6F64"
            >
              {points[0].date} (₹{points[0].price})
            </text>
            <text
              x={points[points.length - 1].x}
              y={chartHeight - 12}
              textAnchor="end"
              fontSize="10"
              fontWeight="bold"
              fill="#174D25"
            >
              Today (₹{crop.currentPrice})
            </text>
          </svg>
        </div>

        {/* Trend Interpretation Insight */}
        <div className="mt-4 rounded-2xl bg-[#EAF7EE]/60 p-4 border border-[#86EFAC]/70">
          <div className="flex items-center gap-2 text-xs font-black text-[#174D25] mb-1">
            <Sparkles size={14} className="text-[#24833A]" />
            <span>{t("marketPrices.trendInterpretation")}</span>
          </div>
          <p className="text-xs text-[#17321F] font-medium leading-relaxed">
            {crop.trendSummary}
          </p>
        </div>
      </div>

      {/* 5. Sell Recommendation Card */}
      <div className="rounded-3xl border border-[#DCE7DD] bg-white p-5 sm:p-6 shadow-2xs">
        <div className="flex items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2 text-sm font-black text-[#17321F]">
            <Sprout size={18} className="text-[#24833A]" />
            <span>{t("marketPrices.recommendation")}</span>
          </div>

          <span className="rounded-full bg-[#174D25] px-3 py-1 text-xs font-black text-white">
            {crop.recommendationTitle}
          </span>
        </div>

        <p className="text-xs text-[#5F6F64] font-medium leading-relaxed">
          {crop.recommendationDesc}
        </p>
      </div>

      {/* 6. Nearby Mandis Comparison */}
      <div className="rounded-3xl border border-[#DCE7DD] bg-white p-5 sm:p-6 shadow-2xs">
        <div className="flex items-center justify-between gap-2 border-b border-[#DCE7DD] pb-4 mb-4">
          <div className="flex items-center gap-2 text-sm sm:text-base font-black text-[#17321F]">
            <Building2 size={18} className="text-[#24833A]" />
            <span>{t("marketPrices.nearbyMandis")}</span>
          </div>
          <span className="text-xs font-semibold text-[#5F6F64]">
            Compared with {activeMandi.name.split(",")[0]}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {crop.nearbyMandis.map((nm) => {
            const isHigher = nm.priceDiff > 0;
            return (
              <div
                key={nm.mandiId}
                className="flex flex-col justify-between rounded-2xl border border-[#DCE7DD] bg-[#F7F9F6] p-4 text-left"
              >
                <div>
                  <h4 className="text-xs font-bold text-[#17321F]">
                    {nm.mandiName}
                  </h4>
                  <p className="text-[11px] text-[#5F6F64] mt-0.5">
                    {nm.distanceKm} km {t("marketPrices.away")}
                  </p>
                </div>

                <div className="mt-3 flex items-baseline justify-between pt-2 border-t border-[#E5ECE5]">
                  <span className="text-base font-black text-[#174D25]">
                    ₹{nm.price.toLocaleString("en-IN")}
                  </span>
                  <span
                    className={`text-[11px] font-bold ${
                      isHigher ? "text-[#166534]" : "text-[#991B1B]"
                    }`}
                  >
                    {isHigher ? `+₹${nm.priceDiff}` : `-₹${Math.abs(nm.priceDiff)}`}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 7. Price Alert Section */}
      <div className="rounded-3xl border border-[#DCE7DD] bg-white p-5 sm:p-6 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#EAF7EE] text-[#174D25]">
              <Bell size={20} className="text-[#24833A]" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#17321F]">
                {t("marketPrices.priceAlert")}
              </h3>
              <p className="text-xs text-[#5F6F64] font-medium">
                {t("marketPrices.priceAlertDesc")} ₹{alertConfig.targetPrice.toLocaleString("en-IN")}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Target price quick adjustments */}
            <div className="flex items-center rounded-xl border border-[#DCE7DD] bg-[#F7F9F6] p-1">
              <button
                type="button"
                onClick={() => adjustTargetPrice(-50)}
                className="flex h-7 w-7 items-center justify-center rounded-lg hover:bg-white text-[#174D25] cursor-pointer"
                title="Decrease alert price"
              >
                <Minus size={14} />
              </button>
              <span className="px-2 text-xs font-bold text-[#17321F]">
                ₹{alertConfig.targetPrice}
              </span>
              <button
                type="button"
                onClick={() => adjustTargetPrice(50)}
                className="flex h-7 w-7 items-center justify-center rounded-lg hover:bg-white text-[#174D25] cursor-pointer"
                title="Increase alert price"
              >
                <Plus size={14} />
              </button>
            </div>

            {/* Accessible Toggle Button */}
            <button
              id="btn-toggle-price-alert"
              type="button"
              role="switch"
              aria-checked={alertConfig.enabled}
              onClick={handleToggleAlert}
              className={`
                relative inline-flex h-8 w-14 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none
                ${alertConfig.enabled ? "bg-[#24833A]" : "bg-gray-300"}
              `}
              title={t("marketPrices.toggleAlert")}
            >
              <span
                className={`
                  pointer-events-none inline-block h-7 w-7 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out
                  ${alertConfig.enabled ? "translate-x-6" : "translate-x-0"}
                `}
              />
            </button>
          </div>
        </div>

        {alertConfig.enabled && (
          <div className="mt-4 flex items-center gap-2 rounded-2xl bg-[#DCFCE7] p-3 text-xs font-bold text-[#166534] animate-in fade-in duration-200">
            <CheckCircle2 size={16} />
            <span>
              {t("marketPrices.alertActive")}: ₹{alertConfig.targetPrice.toLocaleString("en-IN")} at {activeMandi.name}
            </span>
          </div>
        )}
      </div>

      {/* 8. Bottom Action Bar */}
      <div className="flex justify-between items-center pt-2">
        <BackButton
          onClick={onBackToList}
          label={t("marketPrices.backToPrices") || "Back to Market Prices"}
        />
      </div>
    </div>
  );
}
