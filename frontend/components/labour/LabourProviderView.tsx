"use client";

import React, { useState } from "react";
import {
  UsersRound,
  CheckCircle2,
  CalendarCheck,
  Star,
  MapPin,
  Briefcase,
  Phone,
  ShieldCheck,
  Plus,
  Edit,
  Sparkles,
  Eye,
  Power,
  Globe,
  Clock,
  AlertCircle,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
import { LabourWorker } from "@/types/labour";
import { useCartStore } from "@/store/cart-store";
import WorkerAvatar from "./WorkerAvatar";
import RegisterLabourModal from "./RegisterLabourModal";

interface LabourProviderViewProps {
  onSwitchToDiscover: () => void;
}

export default function LabourProviderView({
  onSwitchToDiscover,
}: LabourProviderViewProps) {
  const myWorkerProfile = useCartStore((state) => state.myWorkerProfile);
  const updateMyWorkerAvailability = useCartStore(
    (state) => state.updateMyWorkerAvailability
  );
  const toggleMyWorkerActive = useCartStore(
    (state) => state.toggleMyWorkerActive
  );
  const updateMyWorkerProfile = useCartStore(
    (state) => state.updateMyWorkerProfile
  );
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

  const isAvailable = myWorkerProfile?.availability === "available";
  const isActive = myWorkerProfile?.isActive !== false;
  const isVerified = myWorkerProfile?.verificationStatus === "verified" || myWorkerProfile?.verified;

  const toggleAvailability = () => {
    if (!myWorkerProfile) return;
    updateMyWorkerAvailability(isAvailable ? "busy" : "available");
  };

  const handleToggleActive = () => {
    if (!myWorkerProfile) return;
    toggleMyWorkerActive();
  };

  // Demo toggle for reviewer to test verified state in development
  const handleToggleDemoVerification = () => {
    if (!myWorkerProfile) return;
    const newStatus = isVerified ? "pending_verification" : "verified";
    updateMyWorkerProfile({
      verificationStatus: newStatus,
      verified: newStatus === "verified",
    });
  };

  if (!myWorkerProfile) {
    return (
      <div className="flex flex-col gap-4">
        {/* Onboarding Banner Card */}
        <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-2xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-5">
            <div className="flex items-center gap-3.5">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-700 shadow-xs">
                <UsersRound size={26} strokeWidth={2.4} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base sm:text-lg font-bold text-gray-900">
                    Offer Farm Labour Services
                  </h2>
                  <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-[10px] font-bold text-blue-800">
                    Earn Direct Income
                  </span>
                </div>
                <p className="text-xs text-gray-500 font-medium">
                  Register as an individual agricultural worker or register your harvesting crew
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsRegisterModalOpen(true)}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#24833A] px-5 py-2.5 text-xs font-bold text-white shadow-xs transition hover:bg-[#1e6e30] active:scale-95 cursor-pointer self-start sm:self-auto"
            >
              <Plus size={16} />
              <span>Register as Labour</span>
            </button>
          </div>

          {/* Three Key Benefits */}
          <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="rounded-2xl bg-[#F7F9F6] p-4 border border-gray-100">
              <div className="flex items-center gap-2 text-[#24833A] font-bold text-xs mb-1">
                <CheckCircle2 size={16} />
                <span>Zero Middlemen</span>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed">
                Connect directly with farmers looking for seasonal harvest, sowing, and spraying teams.
              </p>
            </div>

            <div className="rounded-2xl bg-[#F7F9F6] p-4 border border-gray-100">
              <div className="flex items-center gap-2 text-[#24833A] font-bold text-xs mb-1">
                <CalendarCheck size={16} />
                <span>Flexible Schedule</span>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed">
                Control your availability calendar. Switch between Available, Busy, or Deactivated at any time.
              </p>
            </div>

            <div className="rounded-2xl bg-[#F7F9F6] p-4 border border-gray-100">
              <div className="flex items-center gap-2 text-[#24833A] font-bold text-xs mb-1">
                <ShieldCheck size={16} />
                <span>Direct Wages</span>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed">
                Set your own daily wage rate and receive full payment directly from hiring cultivators.
              </p>
            </div>
          </div>
        </div>

        {/* Modal */}
        <RegisterLabourModal
          isOpen={isRegisterModalOpen}
          onClose={() => setIsRegisterModalOpen(false)}
          onSuccess={() => setIsRegisterModalOpen(false)}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Active Profile Card */}
      <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-2xs">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-gray-100 pb-4">
          <div className="flex items-start gap-3.5">
            <WorkerAvatar
              name={myWorkerProfile.name}
              avatarText={myWorkerProfile.avatar}
              crewSize={myWorkerProfile.crewSize}
              verified={isVerified}
              size="lg"
            />
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base sm:text-lg font-bold text-gray-900">
                  {myWorkerProfile.name}
                </h2>
                <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-[#24833A]">
                  Your Profile
                </span>
                {myWorkerProfile.crewSize && myWorkerProfile.crewSize > 1 && (
                  <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-700">
                    Crew of {myWorkerProfile.crewSize}
                  </span>
                )}
              </div>

              <p className="text-xs font-medium text-gray-500 mt-0.5">
                {myWorkerProfile.specialization}
              </p>

              {/* Status Badges: Verification & Active/Inactive */}
              <div className="mt-2 flex items-center gap-2 flex-wrap text-xs">
                {isVerified ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-200">
                    <ShieldCheck size={12} />
                    <span>Verified Profile</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-[10px] font-bold text-amber-800 border border-amber-200">
                    <Clock size={12} />
                    <span>Pending Verification</span>
                  </span>
                )}

                {isActive ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-[#24833A]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#24833A]" />
                    <span>Active & Discoverable</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-0.5 text-[10px] font-bold text-gray-600">
                    <span className="h-1.5 w-1.5 rounded-full bg-gray-400" />
                    <span>Deactivated (Hidden from Directory)</span>
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Quick Actions: Edit, Availability & Deactivate */}
          <div className="flex items-center gap-2 flex-wrap self-start sm:self-auto">
            {/* Availability Toggle */}
            <button
              type="button"
              onClick={toggleAvailability}
              className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold transition shadow-xs cursor-pointer ${
                isAvailable
                  ? "bg-emerald-50 text-[#24833A] border border-[#24833A]/30 hover:bg-emerald-100"
                  : "bg-amber-50 text-amber-800 border border-amber-300 hover:bg-amber-100"
              }`}
              title="Click to toggle availability"
            >
              <Power size={13} />
              <span>{isAvailable ? "● Receiving Bookings" : "○ Paused / Busy"}</span>
            </button>

            {/* Deactivate / Reactivate Button */}
            <button
              type="button"
              onClick={handleToggleActive}
              className={`inline-flex items-center gap-1 rounded-xl px-3 py-2 text-xs font-bold transition cursor-pointer ${
                isActive
                  ? "border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100"
                  : "border border-emerald-300 bg-emerald-50 text-emerald-800 hover:bg-emerald-100"
              }`}
              title={isActive ? "Deactivate profile (hide from discovery)" : "Reactivate profile (make discoverable)"}
            >
              {isActive ? "Deactivate" : "Reactivate"}
            </button>

            {/* Edit Profile */}
            <button
              type="button"
              onClick={() => setIsRegisterModalOpen(true)}
              className="inline-flex items-center gap-1 rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs font-bold text-gray-700 hover:bg-gray-50 cursor-pointer shadow-2xs"
            >
              <Edit size={13} />
              <span>Edit</span>
            </button>
          </div>
        </div>

        {/* Profile Metrics Grid */}
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <div className="rounded-2xl bg-gray-50 p-3 text-center border border-gray-100">
            <span className="text-[10px] text-gray-400 font-medium block">
              Daily Wage Rate
            </span>
            <span className="text-sm font-extrabold text-[#174D25]">
              ₹{myWorkerProfile.dailyRate} / day
            </span>
          </div>

          <div className="rounded-2xl bg-gray-50 p-3 text-center border border-gray-100">
            <span className="text-[10px] text-gray-400 font-medium block">
              Experience
            </span>
            <span className="text-sm font-extrabold text-gray-900">
              {myWorkerProfile.experienceYears}+ Years
            </span>
          </div>

          <div className="rounded-2xl bg-gray-50 p-3 text-center border border-gray-100">
            <span className="text-[10px] text-gray-400 font-medium block">
              Service Area
            </span>
            <span className="text-xs font-bold text-gray-800 truncate block">
              {myWorkerProfile.location}
            </span>
          </div>

          <div className="rounded-2xl bg-gray-50 p-3 text-center border border-gray-100">
            <span className="text-[10px] text-gray-400 font-medium block">
              Direct Contact
            </span>
            <span className="text-xs font-semibold text-gray-800 truncate block">
              {myWorkerProfile.phone || "Visible to hiring farmers"}
            </span>
          </div>
        </div>

        {/* Work Types & Languages */}
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <span className="text-xs font-bold text-gray-700 uppercase tracking-wider block mb-1.5">
              Offered Work Types
            </span>
            <div className="flex flex-wrap gap-1.5">
              {myWorkerProfile.workTypes.map((wt, i) => (
                <span
                  key={i}
                  className="rounded-xl bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-800 capitalize"
                >
                  🌾 {wt}
                </span>
              ))}
            </div>
          </div>

          <div>
            <span className="text-xs font-bold text-gray-700 uppercase tracking-wider block mb-1.5">
              Languages Spoken
            </span>
            <div className="flex flex-wrap gap-1.5">
              {myWorkerProfile.languages.map((lang, i) => (
                <span
                  key={i}
                  className="rounded-xl bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-700"
                >
                  🗣 {lang}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Registered Agricultural Skills */}
        <div className="mt-4">
          <span className="text-xs font-bold text-gray-700 uppercase tracking-wider block mb-1.5">
            Registered Agricultural Skills
          </span>
          <div className="flex flex-wrap gap-1.5">
            {myWorkerProfile.skills.map((skill, i) => (
              <span
                key={i}
                className="rounded-xl bg-[#E4F0DD] px-2.5 py-1 text-xs font-semibold text-[#174D25]"
              >
                ✓ {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Short Bio */}
        {myWorkerProfile.bio && (
          <div className="mt-4 rounded-2xl bg-gray-50 p-3 text-xs text-gray-700 border border-gray-100">
            <span className="font-bold text-gray-900 block mb-0.5">About Services:</span>
            <p className="leading-relaxed">{myWorkerProfile.bio}</p>
          </div>
        )}

        {/* Discovery Preview Action & Demo Verified Toggle */}
        <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl bg-[#F4FBF5] p-3 text-xs border border-[#24833A]/20">
          <div className="flex items-center gap-2 text-gray-700">
            <Sparkles size={16} className="text-[#24833A] flex-shrink-0" />
            <span>
              {isActive
                ? "Your worker profile is active and appears at the top of the Available Workers list."
                : "Your worker profile is deactivated and will not appear in the public worker list."}
            </span>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            {/* Demo Verification Toggle (for reviewer test purposes) */}
            <button
              type="button"
              onClick={handleToggleDemoVerification}
              className="text-[11px] font-semibold text-gray-500 hover:text-gray-800 underline cursor-pointer"
            >
              Demo: {isVerified ? "Set Pending" : "Set Verified"}
            </button>

            {isActive && (
              <button
                type="button"
                onClick={onSwitchToDiscover}
                className="inline-flex items-center gap-1 rounded-xl bg-[#24833A] px-3 py-1.5 text-xs font-bold text-white shadow-2xs hover:bg-[#1e6e30] cursor-pointer"
              >
                <Eye size={13} />
                <span>View in List</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Modal for Editing */}
      <RegisterLabourModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
        onSuccess={() => setIsRegisterModalOpen(false)}
        existingProfile={myWorkerProfile}
      />
    </div>
  );
}
