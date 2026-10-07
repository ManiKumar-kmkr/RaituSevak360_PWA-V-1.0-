"use client";

import React from "react";
import {
  X,
  Star,
  MapPin,
  Briefcase,
  Languages,
  CheckCircle2,
  CalendarCheck,
  Phone,
  Award,
  Clock,
} from "lucide-react";
import { LabourWorker } from "@/types/labour";
import WorkerAvatar from "./WorkerAvatar";

interface WorkerProfileModalProps {
  worker: LabourWorker | null;
  isOpen: boolean;
  onClose: () => void;
  onBook: (worker: LabourWorker) => void;
}

export default function WorkerProfileModal({
  worker,
  isOpen,
  onClose,
  onBook,
}: WorkerProfileModalProps) {
  if (!isOpen || !worker) return null;

  const isAvailable = worker.availability === "available";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-in fade-in duration-150 overflow-y-auto"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="worker-profile-title"
    >
      <div
        className="w-full max-w-lg rounded-3xl border border-gray-200 bg-white p-6 shadow-xl animate-in zoom-in-95 duration-150 my-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="flex items-start justify-between border-b border-gray-100 pb-4">
          <div className="flex items-center gap-3.5">
            <WorkerAvatar
              name={worker.name}
              avatarText={worker.avatar}
              crewSize={worker.crewSize}
              verified={worker.verified}
              size="lg"
            />
            <div>
              <div className="flex items-center gap-2">
                <h2
                  id="worker-profile-title"
                  className="text-base sm:text-lg font-bold text-gray-900"
                >
                  {worker.name}
                </h2>
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                    isAvailable
                      ? "bg-emerald-50 text-[#24833A]"
                      : "bg-amber-50 text-amber-700"
                  }`}
                >
                  {isAvailable ? "Available" : "Busy"}
                </span>
              </div>
              <p className="text-xs font-medium text-gray-500 mt-0.5">
                {worker.specialization}
              </p>
              <div className="flex items-center gap-2 mt-1 text-[11px] text-gray-500">
                <span className="flex items-center gap-1 font-bold text-gray-800">
                  <Star size={13} className="fill-amber-400 text-amber-400" />
                  {worker.rating.toFixed(1)} ({worker.reviewCount} reviews)
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <MapPin size={12} className="text-[#24833A]" />
                  {worker.location}, {worker.district} ({worker.distanceKm} km)
                </span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-xl text-gray-400 hover:bg-gray-100 hover:text-gray-700 cursor-pointer"
            aria-label="Close profile"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content Body */}
        <div className="mt-4 flex flex-col gap-4 text-xs text-gray-700 max-h-[60vh] overflow-y-auto pr-1">
          {/* Bio */}
          <div>
            <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-1.5">
              About Worker / Crew
            </h3>
            <p className="text-gray-600 leading-relaxed bg-[#F7F9F6] p-3 rounded-2xl border border-gray-100">
              {worker.bio}
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-3 gap-2.5">
            <div className="rounded-2xl border border-gray-100 bg-white p-3 text-center shadow-2xs">
              <div className="flex items-center justify-center text-[#24833A] mb-1">
                <Briefcase size={18} />
              </div>
              <span className="text-[10px] text-gray-400 font-medium block">
                Experience
              </span>
              <span className="text-xs font-extrabold text-gray-800">
                {worker.experienceYears}+ Years
              </span>
            </div>

            <div className="rounded-2xl border border-gray-100 bg-white p-3 text-center shadow-2xs">
              <div className="flex items-center justify-center text-[#24833A] mb-1">
                <Award size={18} />
              </div>
              <span className="text-[10px] text-gray-400 font-medium block">
                Completed Jobs
              </span>
              <span className="text-xs font-extrabold text-gray-800">
                {worker.completedJobs} Farms
              </span>
            </div>

            <div className="rounded-2xl border border-gray-100 bg-white p-3 text-center shadow-2xs">
              <div className="flex items-center justify-center text-[#24833A] mb-1">
                <Clock size={18} />
              </div>
              <span className="text-[10px] text-gray-400 font-medium block">
                Response Time
              </span>
              <span className="text-xs font-extrabold text-gray-800">
                &lt; 2 Hours
              </span>
            </div>
          </div>

          {/* Skills & Expertise */}
          <div>
            <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-1.5">
              Agricultural Skills & Operations
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {worker.skills.map((skill, i) => (
                <span
                  key={i}
                  className="rounded-xl bg-[#E4F0DD] px-2.5 py-1 text-xs font-semibold text-[#174D25]"
                >
                  ✓ {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Spoken Languages & Verified Status */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 rounded-2xl bg-gray-50 p-3 border border-gray-100">
            <div className="flex items-center gap-2">
              <Languages size={16} className="text-[#24833A]" />
              <span className="font-medium text-gray-600">
                Languages: {worker.languages.join(", ")}
              </span>
            </div>

            {worker.verified && (
              <div className="flex items-center gap-1.5 text-[#24833A] font-bold">
                <CheckCircle2 size={15} />
                <span>Verified by Mandal Agriculture Office</span>
              </div>
            )}
          </div>
        </div>

        {/* Footer: Wage & Book Action */}
        <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-4">
          <div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
              Daily Wage Rate
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-extrabold text-[#174D25]">
                ₹{worker.dailyRate}
              </span>
              <span className="text-xs text-gray-500">/ day</span>
              {worker.hourlyRate && (
                <span className="text-[11px] text-gray-400 ml-1">
                  (₹{worker.hourlyRate}/hr)
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-gray-200 px-4 py-2.5 text-xs font-bold text-gray-600 hover:bg-gray-50 cursor-pointer"
            >
              Back
            </button>

            <button
              type="button"
              disabled={!isAvailable}
              onClick={() => {
                onClose();
                onBook(worker);
              }}
              className={`inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-bold text-white shadow-xs transition active:scale-95 cursor-pointer ${
                isAvailable
                  ? "bg-[#24833A] hover:bg-[#1e6e30]"
                  : "bg-gray-300 cursor-not-allowed"
              }`}
            >
              <CalendarCheck size={16} />
              <span>Book Worker</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
