"use client";

import React from "react";
import { Star, MapPin, Briefcase, CalendarCheck } from "lucide-react";
import { LabourWorker } from "@/types/labour";
import WorkerAvatar from "./WorkerAvatar";

interface LabourCardProps {
  worker: LabourWorker;
  onViewProfile: (worker: LabourWorker) => void;
  onBook: (worker: LabourWorker) => void;
}

export default function LabourCard({
  worker,
  onViewProfile,
  onBook,
}: LabourCardProps) {
  const isAvailable = worker.availability === "available";

  return (
    <div className="flex flex-col justify-between rounded-2xl border border-gray-200 bg-white p-4 sm:p-4.5 shadow-2xs transition hover:border-[#24833A]/50 hover:shadow-xs">
      {/* Top Section: Avatar, Name, Rating & Status */}
      <div>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <WorkerAvatar
              name={worker.name}
              avatarText={worker.avatar}
              crewSize={worker.crewSize}
              verified={worker.verified}
              size="md"
            />
            <div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <h3 className="text-sm font-bold text-gray-900 leading-snug">
                  {worker.name}
                </h3>
                {worker.crewSize && worker.crewSize > 1 && (
                  <span className="rounded-full bg-blue-50 px-2 py-0.2 text-[10px] font-bold text-blue-700">
                    Crew of {worker.crewSize}
                  </span>
                )}
                {worker.isMyProfile && (
                  <span className="rounded-full bg-emerald-100 px-2 py-0.2 text-[10px] font-extrabold text-[#174D25] border border-emerald-300">
                    Your Profile
                  </span>
                )}
                {worker.verificationStatus === "pending_verification" && (
                  <span className="rounded-full bg-amber-50 px-2 py-0.2 text-[10px] font-bold text-amber-800 border border-amber-200">
                    Pending Verification
                  </span>
                )}
              </div>
              <p className="text-[11px] font-medium text-gray-500 mt-0.5 line-clamp-1">
                {worker.specialization}
              </p>
            </div>
          </div>

          {/* Availability Pill */}
          <span
            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold flex-shrink-0 ${
              isAvailable
                ? "bg-emerald-50 text-[#24833A]"
                : "bg-amber-50 text-amber-700"
            }`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                isAvailable ? "bg-[#24833A]" : "bg-amber-500"
              }`}
            />
            {isAvailable ? "Available" : "Busy"}
          </span>
        </div>

        {/* Mid Stats Row: Rating, Exp, Distance */}
        <div className="mt-3 flex items-center gap-3 text-xs text-gray-500 border-y border-gray-100 py-2">
          <div className="flex items-center gap-1 font-bold text-gray-800">
            <Star size={13} className="fill-amber-400 text-amber-400" />
            <span>{worker.rating.toFixed(1)}</span>
            <span className="text-[10px] font-normal text-gray-400">
              ({worker.reviewCount})
            </span>
          </div>

          <span className="text-gray-300">•</span>

          <div className="flex items-center gap-1 text-[11px] font-medium text-gray-600">
            <Briefcase size={12} className="text-[#24833A]" />
            <span>{worker.experienceYears}+ yrs exp</span>
          </div>

          <span className="text-gray-300">•</span>

          <div className="flex items-center gap-1 text-[11px] font-medium text-gray-600 truncate">
            <MapPin size={12} className="text-[#24833A] flex-shrink-0" />
            <span className="truncate">
              {worker.location} ({worker.distanceKm} km)
            </span>
          </div>
        </div>

        {/* Skills Tags */}
        <div className="mt-2.5 flex flex-wrap gap-1.5">
          {worker.skills.slice(0, 3).map((skill, idx) => (
            <span
              key={idx}
              className="rounded-lg bg-gray-50 px-2 py-0.5 text-[10px] font-semibold text-gray-600 border border-gray-100"
            >
              {skill}
            </span>
          ))}
          {worker.skills.length > 3 && (
            <span className="rounded-lg bg-gray-50 px-1.5 py-0.5 text-[10px] font-medium text-gray-400">
              +{worker.skills.length - 3}
            </span>
          )}
        </div>
      </div>

      {/* Bottom Section: Rate & Actions */}
      <div className="mt-4 flex items-center justify-between gap-3 pt-3 border-t border-gray-100">
        <div>
          <span className="text-[10px] font-medium text-gray-400 uppercase tracking-wider block">
            Daily Wage
          </span>
          <div className="flex items-baseline gap-1">
            <span className="text-base font-extrabold text-[#174D25]">
              ₹{worker.dailyRate}
            </span>
            <span className="text-[11px] font-medium text-gray-500">/ day</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onViewProfile(worker)}
            className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs font-bold text-gray-700 transition hover:bg-gray-50 hover:border-gray-300 active:scale-95 cursor-pointer"
            aria-label={`View profile for ${worker.name}`}
          >
            Profile
          </button>

          <button
            type="button"
            disabled={!isAvailable}
            onClick={() => onBook(worker)}
            className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold transition shadow-xs active:scale-95 cursor-pointer ${
              isAvailable
                ? "bg-[#24833A] text-white hover:bg-[#1e6e30]"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
            }`}
            aria-label={`Book worker ${worker.name}`}
          >
            <CalendarCheck size={14} />
            <span>Book</span>
          </button>
        </div>
      </div>
    </div>
  );
}
