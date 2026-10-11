"use client";

import React from "react";
import { TrendingUp, TrendingDown, ChevronRight, Sprout, ShieldCheck } from "lucide-react";
import { MarketCrop } from "@/types/market";
import { useTranslation } from "@/hooks/useTranslation";

interface CropPriceCardProps {
  crop: MarketCrop;
  onSelectCrop: (crop: MarketCrop) => void;
}

export default function CropPriceCard({ crop, onSelectCrop }: CropPriceCardProps) {
  const { t } = useTranslation();

  const isAboveMsp = crop.currentPrice >= crop.govtMsp;
  const mspDiff = crop.currentPrice - crop.govtMsp;

  return (
    <div
      id={`crop-card-${crop.id}`}
      onClick={() => onSelectCrop(crop)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelectCrop(crop);
        }
      }}
      className="
        group relative flex flex-col justify-between rounded-2xl border border-[#DCE7DD] bg-white p-4 sm:p-5
        shadow-2xs transition-all duration-200 hover:-translate-y-0.5 hover:border-[#24833A] hover:shadow-md
        cursor-pointer text-left
      "
    >
      <div>
        {/* Top: Category Tag & Movement Badge */}
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <span className="inline-flex items-center gap-1 rounded-full bg-[#EAF7EE] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#174D25]">
            <Sprout size={11} className="text-[#24833A]" />
            <span>{t(`marketPrices.categories.${crop.category}`)}</span>
          </span>

          <div
            className={`
              inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold
              ${
                crop.isPositive
                  ? "bg-[#DCFCE7] text-[#166534]"
                  : "bg-[#FEE2E2] text-[#991B1B]"
              }
            `}
          >
            {crop.isPositive ? (
              <TrendingUp size={13} strokeWidth={2.5} />
            ) : (
              <TrendingDown size={13} strokeWidth={2.5} />
            )}
            <span>
              {crop.isPositive ? "+" : ""}
              {crop.priceChangePercent}%
            </span>
          </div>
        </div>

        {/* Title & Variety */}
        <div>
          <h3 className="text-base sm:text-lg font-bold text-gray-900 tracking-tight group-hover:text-[#24833A] transition">
            {crop.name}
          </h3>
          <p className="text-[11px] sm:text-xs font-medium text-[#5F6F64] mt-0.5 line-clamp-1">
            {crop.variety}
          </p>
        </div>

        {/* Price & Unit Display */}
        <div className="mt-3.5 flex items-baseline gap-1.5">
          <span className="text-2xl sm:text-3xl font-black text-[#174D25] tracking-tight">
            ₹{crop.currentPrice.toLocaleString("en-IN")}
          </span>
          <span className="text-xs font-bold text-[#5F6F64]">
            /{crop.unit}
          </span>
        </div>

        {/* Today's Range & MSP comparison */}
        <div className="mt-3 space-y-1.5 rounded-xl bg-[#F7F9F6] p-2.5 text-[11px]">
          <div className="flex items-center justify-between text-[#5F6F64]">
            <span className="font-semibold">{t("marketPrices.todayRange")}:</span>
            <span className="font-bold text-[#17321F]">
              ₹{crop.todayMin.toLocaleString("en-IN")} – ₹{crop.todayMax.toLocaleString("en-IN")}
            </span>
          </div>

          <div className="flex items-center justify-between text-[#5F6F64] pt-1 border-t border-[#E5ECE5]">
            <span className="flex items-center gap-1 font-semibold">
              <ShieldCheck size={12} className="text-[#24833A]" />
              MSP: ₹{crop.govtMsp.toLocaleString("en-IN")}
            </span>
            <span
              className={`font-bold ${
                isAboveMsp ? "text-[#166534]" : "text-[#991B1B]"
              }`}
            >
              {isAboveMsp ? `+₹${mspDiff}` : `-₹${Math.abs(mspDiff)}`} {isAboveMsp ? t("marketPrices.aboveMsp") : t("marketPrices.belowMsp")}
            </span>
          </div>
        </div>
      </div>

      {/* Action Footer: "View Price Details →" */}
      <div className="mt-4 flex items-center justify-between pt-3 border-t border-[#DCE7DD] text-xs font-bold text-[#174D25]">
        <span className="text-[11px] font-semibold text-[#5F6F64]">
          {crop.arrivals}
        </span>
        <button
          id={`btn-view-crop-${crop.id}`}
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onSelectCrop(crop);
          }}
          className="inline-flex items-center gap-1 group-hover:text-[#24833A] group-hover:translate-x-0.5 transition cursor-pointer"
        >
          <span>{t("marketPrices.viewDetails")}</span>
          <ChevronRight size={15} />
        </button>
      </div>
    </div>
  );
}
