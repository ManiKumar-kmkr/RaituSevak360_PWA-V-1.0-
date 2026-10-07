"use client";

import React from "react";
import {
  Tractor,
  Star,
  MapPin,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Clock,
  UserCheck,
  Fuel,
} from "lucide-react";
import { EquipmentItem } from "@/types/marketplace";
import { Button } from "@/components/ui/Button";

interface MachineryCardProps {
  equipment: EquipmentItem;
  onBookNow: (equipment: EquipmentItem) => void;
}

export default function MachineryCard({ equipment, onBookNow }: MachineryCardProps) {
  const getCategoryColor = () => {
    switch (equipment.category) {
      case "tractor":
        return "bg-amber-50 text-amber-800 border-amber-200";
      case "harvester":
        return "bg-blue-50 text-blue-800 border-blue-200";
      case "sprayer":
        return "bg-emerald-50 text-emerald-800 border-emerald-200";
      default:
        return "bg-gray-50 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="flex flex-col justify-between rounded-3xl border border-gray-200/90 bg-white p-4 sm:p-5 shadow-2xs transition-all duration-200 hover:-translate-y-0.5 hover:border-[#24833A]/40 hover:shadow-md">
      <div>
        {/* Visual Header */}
        <div className="relative flex h-36 sm:h-40 w-full items-center justify-center rounded-2xl bg-gradient-to-br from-[#E4F0DD]/60 via-amber-50 to-[#F7F9F6] border border-gray-100 overflow-hidden">
          <div className="flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-2xl bg-white shadow-xs text-[#24833A]">
            <Tractor size={38} strokeWidth={2.2} />
          </div>

          {/* Availability pill */}
          <div className="absolute top-2.5 left-2.5 flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-0.5 text-[10px] font-bold shadow-2xs">
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                equipment.available ? "bg-emerald-500 animate-pulse" : "bg-gray-400"
              }`}
            />
            <span className={equipment.available ? "text-emerald-700" : "text-gray-500"}>
              {equipment.available ? "Available Now" : "Currently Booked"}
            </span>
          </div>

          {/* Rating */}
          <div className="absolute top-2.5 right-2.5 flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-0.5 text-[10px] font-bold text-amber-800 shadow-2xs">
            <Star size={11} className="fill-amber-400 text-amber-500" />
            <span>{equipment.rating}</span>
            <span className="text-gray-400 font-normal">({equipment.reviewCount})</span>
          </div>
        </div>

        {/* Category & distance */}
        <div className="mt-3 flex items-center justify-between text-[11px]">
          <span
            className={`rounded-full border px-2.5 py-0.5 font-bold uppercase text-[9px] ${getCategoryColor()}`}
          >
            {equipment.category}
          </span>
          <span className="flex items-center gap-1 text-gray-500 font-medium">
            <MapPin size={11} className="text-[#24833A]" />
            <span>{equipment.distanceKm} km away</span>
          </span>
        </div>

        {/* Equipment Name */}
        <h3 className="mt-2 text-sm sm:text-base font-bold text-gray-900 leading-snug">
          {equipment.name}
        </h3>

        {/* Owner */}
        <p className="mt-1 text-xs text-gray-500">
          Operated by <span className="font-semibold text-gray-700">{equipment.owner}</span>
        </p>

        {/* Key Features pills */}
        <div className="mt-2.5 flex flex-wrap gap-1.5 text-[10px]">
          {equipment.operatorIncluded && (
            <span className="inline-flex items-center gap-1 rounded-lg bg-emerald-50 px-2 py-0.5 font-semibold text-emerald-800">
              <UserCheck size={11} />
              <span>Operator Included</span>
            </span>
          )}
          {equipment.fuelIncluded && (
            <span className="inline-flex items-center gap-1 rounded-lg bg-blue-50 px-2 py-0.5 font-semibold text-blue-800">
              <Fuel size={11} />
              <span>Fuel Included</span>
            </span>
          )}
        </div>
      </div>

      {/* Pricing & CTA */}
      <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
        <div>
          <span className="text-base sm:text-lg font-extrabold text-[#174D25]">
            ₹{equipment.dailyRate.toLocaleString("en-IN")}
          </span>
          <span className="ml-1 text-[11px] text-gray-500 font-medium">/ day</span>
          {equipment.hourlyRate && (
            <p className="text-[10px] text-gray-400">
              or ₹{equipment.hourlyRate}/hr
            </p>
          )}
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => onBookNow(equipment)}
          disabled={!equipment.available}
        >
          Book Now
        </Button>
      </div>
    </div>
  );
}
