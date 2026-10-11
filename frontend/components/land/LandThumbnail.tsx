"use client";

import React from "react";
import { Trees, Droplets, Compass } from "lucide-react";
import { SoilType } from "@/types/land";

interface LandThumbnailProps {
  soilType?: SoilType;
  title?: string;
  className?: string;
}

export default function LandThumbnail({
  soilType = "black_cotton",
  title = "Farmland",
  className = "h-40 w-full",
}: LandThumbnailProps) {
  // Agricultural vector landscapes tailored by soil type
  const getTheme = () => {
    switch (soilType) {
      case "black_cotton":
        return {
          bg: "from-[#2A3B2F] via-[#3d5242] to-[#1c2920]",
          soilColor: "#2B2824",
          cropColor: "#48BB78",
          waterColor: "#63B3ED",
          badgeText: "Black Soil Plot",
        };
      case "red_loam":
        return {
          bg: "from-[#6B2D18] via-[#853c22] to-[#45190b]",
          soilColor: "#8D3A1B",
          cropColor: "#68D391",
          waterColor: "#4FD1C5",
          badgeText: "Red Loam Plot",
        };
      case "alluvial":
        return {
          bg: "from-[#1F4E38] via-[#2F6B4F] to-[#153828]",
          soilColor: "#4A5568",
          cropColor: "#9AE6B4",
          waterColor: "#3182CE",
          badgeText: "Alluvial Basin",
        };
      case "sandy_loam":
        return {
          bg: "from-[#59421A] via-[#755928] to-[#3B2B11]",
          soilColor: "#9C7938",
          cropColor: "#68D391",
          waterColor: "#63B3ED",
          badgeText: "Sandy Loam",
        };
      case "clay":
        return {
          bg: "from-[#2D3748] via-[#4A5568] to-[#1A202C]",
          soilColor: "#323F4B",
          cropColor: "#48BB78",
          waterColor: "#4299E1",
          badgeText: "Heavy Clay",
        };
      default:
        return {
          bg: "from-[#174D25] via-[#24833A] to-[#1e6e30]",
          soilColor: "#2D3748",
          cropColor: "#48BB78",
          waterColor: "#63B3ED",
          badgeText: "Fertile Farmland",
        };
    }
  };

  const theme = getTheme();

  return (
    <div
      className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${theme.bg} ${className} flex flex-col justify-between p-3.5 shadow-2xs select-none`}
    >
      {/* Decorative SVG Field Contours & Irrigation Lines */}
      <svg
        className="absolute inset-0 h-full w-full opacity-35"
        preserveAspectRatio="none"
        viewBox="0 0 400 200"
      >
        {/* Sky / Sun Ray */}
        <circle cx="360" cy="30" r="36" fill="#ECC94B" opacity="0.6" />

        {/* Terraced Agricultural Field Contours */}
        <path
          d="M0,110 Q100,80 200,105 T400,90 L400,200 L0,200 Z"
          fill={theme.soilColor}
          opacity="0.85"
        />
        <path
          d="M0,140 Q150,115 280,145 T400,135 L400,200 L0,200 Z"
          fill="#1A202C"
          opacity="0.5"
        />

        {/* Canal Water Stream */}
        <path
          d="M-20,165 Q160,145 280,175 T420,170"
          stroke={theme.waterColor}
          strokeWidth="10"
          fill="none"
          opacity="0.75"
        />

        {/* Crop Row Markers */}
        <g stroke={theme.cropColor} strokeWidth="2.5" strokeLinecap="round" opacity="0.7">
          <line x1="40" y1="120" x2="40" y2="132" />
          <line x1="70" y1="116" x2="70" y2="130" />
          <line x1="100" y1="118" x2="100" y2="134" />
          <line x1="140" y1="125" x2="140" y2="142" />
          <line x1="180" y1="130" x2="180" y2="148" />
          <line x1="220" y1="135" x2="220" y2="152" />
          <line x1="320" y1="125" x2="320" y2="145" />
          <line x1="360" y1="130" x2="360" y2="150" />
        </g>
      </svg>

      {/* Top Badges */}
      <div className="relative z-10 flex items-center justify-between">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-black/40 px-2.5 py-0.5 text-[10px] font-bold text-white backdrop-blur-xs">
          <Trees size={12} className="text-emerald-300" />
          <span>{theme.badgeText}</span>
        </span>

        <span className="inline-flex items-center gap-1 rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-bold text-white backdrop-blur-xs">
          <Droplets size={11} className="text-blue-300" />
          <span>Irrigated</span>
        </span>
      </div>

      {/* Bottom Title Overlay */}
      <div className="relative z-10">
        <h4 className="text-xs sm:text-sm font-extrabold text-white drop-shadow-sm truncate">
          {title}
        </h4>
      </div>
    </div>
  );
}
