"use client";

import React from "react";
import { Sprout, Wheat, ShieldCheck, Wrench, Droplet, Tractor, Award } from "lucide-react";
import { MarketplaceProduct } from "@/types/marketplace";

interface ProductThumbnailProps {
  product: MarketplaceProduct;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export default function ProductThumbnail({
  product,
  size = "md",
  className = "",
}: ProductThumbnailProps) {
  const getTheme = () => {
    switch (product.category) {
      case "seeds":
        return {
          bg: "from-amber-50 to-emerald-100",
          accent: "text-emerald-700",
          badgeBg: "bg-emerald-600 text-white",
          icon: <Wheat className="h-10 w-10 text-amber-600 drop-shadow-sm" />,
          illustrationText: "SEEDS",
        };
      case "fertilizer":
        return {
          bg: "from-emerald-50 to-teal-100",
          accent: "text-emerald-800",
          badgeBg: "bg-teal-700 text-white",
          icon: <Sprout className="h-10 w-10 text-emerald-600 drop-shadow-sm" />,
          illustrationText: "NPK BIO",
        };
      case "tools":
        return {
          bg: "from-blue-50 to-slate-100",
          accent: "text-blue-700",
          badgeBg: "bg-blue-600 text-white",
          icon: <Wrench className="h-10 w-10 text-blue-600 drop-shadow-sm" />,
          illustrationText: "EQUIP",
        };
      case "pesticides":
        return {
          bg: "from-green-50 to-lime-100",
          accent: "text-green-700",
          badgeBg: "bg-lime-700 text-white",
          icon: <Droplet className="h-10 w-10 text-lime-600 drop-shadow-sm" />,
          illustrationText: "BIO-CARE",
        };
      case "machinery":
        return {
          bg: "from-amber-100/60 to-orange-100",
          accent: "text-amber-800",
          badgeBg: "bg-amber-600 text-white",
          icon: <Tractor className="h-10 w-10 text-amber-700 drop-shadow-sm" />,
          illustrationText: "RENTAL",
        };
      default:
        return {
          bg: "from-gray-50 to-emerald-50",
          accent: "text-[#24833A]",
          badgeBg: "bg-[#24833A] text-white",
          icon: <Sprout className="h-10 w-10 text-[#24833A]" />,
          illustrationText: "AGRI",
        };
    }
  };

  const theme = getTheme();

  const heightClass =
    size === "sm" ? "h-20" : size === "lg" ? "h-56 sm:h-72" : "h-36 sm:h-44";

  return (
    <div
      className={`relative w-full overflow-hidden rounded-xl bg-gradient-to-br ${theme.bg} flex items-center justify-center p-3 select-none ${heightClass} ${className}`}
    >
      {/* Subtle background pattern ring */}
      <div className="absolute -right-6 -bottom-6 h-28 w-28 rounded-full bg-white/40 blur-xs" />
      <div className="absolute -left-6 -top-6 h-24 w-24 rounded-full bg-white/30 blur-xs" />

      {/* Main product visual illustration */}
      <div className="relative z-10 flex flex-col items-center gap-1.5 transition-transform duration-300 group-hover:scale-105">
        <div className="flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-xl bg-white/90 shadow-sm border border-white/60">
          {theme.icon}
        </div>
        <span className="rounded-full bg-white/80 px-2 py-0.5 text-[9px] font-extrabold tracking-wider text-gray-700 uppercase shadow-2xs backdrop-blur-xs">
          {theme.illustrationText}
        </span>
      </div>

      {/* Quality Badge watermark */}
      <div className="absolute top-2.5 right-2.5 z-10 flex items-center gap-1 rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-bold text-[#174D25] shadow-2xs">
        <ShieldCheck size={11} className="text-[#24833A]" />
        <span>Verified</span>
      </div>
    </div>
  );
}
