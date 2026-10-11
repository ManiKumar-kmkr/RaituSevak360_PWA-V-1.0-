"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  GraduationCap,
  ShieldCheck,
  CheckCircle2,
  UsersRound,
  FileText,
  Calendar,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Upload,
  Clock,
  Check,
  Sprout,
  HelpCircle,
  Briefcase,
  Languages,
  MapPin,
  Mail,
  Phone,
  User,
  Award,
} from "lucide-react";
import { useExpertStore } from "@/store/expert-store";
import { EXPERT_SPECIALIZATIONS } from "@/services/expert";
import BackButton from "@/components/ui/BackButton";

const ALL_LANGUAGES = ["Telugu", "English", "Hindi", "Kannada", "Marathi", "Tamil"];

export default function ExpertOnboardingWizard() {
  const router = useRouter();
  const onboarding = useExpertStore((state) => state.onboarding);
  const setOnboardingStep = useExpertStore((state) => state.setOnboardingStep);
  const updateOnboardingData = useExpertStore((state) => state.updateOnboardingData);
  const submitOnboarding = useExpertStore((state) => state.submitOnboarding);
  const resetOnboarding = useExpertStore((state) => state.resetOnboarding);

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const step = onboarding.step || 1;

  const handleNext = () => {
    setFormErrors({});
    if (step === 2) {
      const errors: Record<string, string> = {};
      if (!onboarding.fullName?.trim()) errors.fullName = "Full name is required";
      if (!onboarding.mobile?.trim() || onboarding.mobile.length < 10)
        errors.mobile = "Valid 10-digit mobile number is required";
      if (!onboarding.qualification?.trim()) errors.qualification = "Qualification is required";
      if (!onboarding.location?.trim()) errors.location = "Location / Institution is required";
      if (Object.keys(errors).length > 0) {
        setFormErrors(errors);
        return;
      }
    }

    if (step === 3) {
      if (!onboarding.expertiseAreas || onboarding.expertiseAreas.length === 0) {
        setFormErrors({ expertise: "Select at least 1 agricultural expertise area" });
        return;
      }
    }

    if (step === 4) {
      if (!onboarding.agreeToTerms) {
        setFormErrors({ terms: "Please accept the code of conduct and verification terms" });
        return;
      }
      submitOnboarding();
      return;
    }

    setOnboardingStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) {
      setOnboardingStep(step - 1);
    }
  };

  const toggleSpecialization = (spec: string) => {
    const current = onboarding.expertiseAreas || [];
    if (current.includes(spec)) {
      updateOnboardingData({ expertiseAreas: current.filter((s) => s !== spec) });
    } else {
      updateOnboardingData({ expertiseAreas: [...current, spec] });
    }
  };

  const toggleLanguage = (lang: string) => {
    const current = onboarding.languages || [];
    if (current.includes(lang)) {
      updateOnboardingData({ languages: current.filter((l) => l !== lang) });
    } else {
      updateOnboardingData({ languages: [...current, lang] });
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-5 pb-20">
      {/* Top Header Navigation */}
      <div className="flex items-center justify-between">
        {step > 1 && step < 5 ? (
          <BackButton onClick={handleBack} label="Previous Step" />
        ) : (
          <BackButton href="/dashboard" label="Back to Dashboard" />
        )}
        <span className="text-xs font-semibold text-gray-500">
          Step {step} of 5
        </span>
      </div>

      {/* Progress Stepper Bar */}
      <div className="rounded-2xl border border-gray-200 bg-white p-3.5 shadow-2xs">
        <div className="flex items-center justify-between gap-1">
          {[
            { num: 1, label: "Intro" },
            { num: 2, label: "Profile" },
            { num: 3, label: "Expertise" },
            { num: 4, label: "Verify" },
            { num: 5, label: "Complete" },
          ].map((s, idx) => {
            const isCompleted = step > s.num;
            const isCurrent = step === s.num;
            return (
              <React.Fragment key={s.num}>
                <div className="flex flex-col items-center gap-1">
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-all ${
                      isCompleted
                        ? "bg-[#24833A] text-white"
                        : isCurrent
                        ? "bg-[#174D25] text-white ring-4 ring-[#E4F0DD]"
                        : "bg-gray-100 text-gray-400"
                    }`}
                  >
                    {isCompleted ? <Check size={14} strokeWidth={2.8} /> : s.num}
                  </div>
                  <span
                    className={`text-[10px] font-medium hidden sm:block ${
                      isCurrent ? "font-bold text-[#174D25]" : "text-gray-400"
                    }`}
                  >
                    {s.label}
                  </span>
                </div>
                {idx < 4 && (
                  <div
                    className={`h-1 flex-1 rounded-full transition-all ${
                      step > s.num ? "bg-[#24833A]" : "bg-gray-100"
                    }`}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* ========================================================= */}
      {/* STEP 1: JOIN AS AGRI EXPERT (INTRO & BENEFITS) */}
      {/* ========================================================= */}
      {step === 1 && (
        <div className="flex flex-col gap-4">
          {/* Main Hero Card */}
          <div className="rounded-3xl border border-gray-200 bg-white p-6 sm:p-8 shadow-2xs">
            <div className="flex items-center gap-3.5 mb-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#E4F0DD] text-[#24833A] shadow-xs">
                <GraduationCap size={32} strokeWidth={2.4} />
              </div>
              <div>
                <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-[#174D25] border border-emerald-200">
                  RaituSevak360 Agronomist Network
                </span>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mt-1">
                  Join as Agriculture Expert
                </h1>
                <p className="text-xs sm:text-sm text-gray-500 font-medium">
                  Connect 1-on-1 with regional cultivators and provide scientific diagnostic advice
                </p>
              </div>
            </div>

            {/* Visual Imagery Banner Area */}
            <div className="relative overflow-hidden rounded-2xl border border-emerald-200/80 bg-gradient-to-br from-[#E4F0DD] via-[#F4FBF5] to-emerald-100/60 p-5 sm:p-6 mb-6">
              <div className="relative z-10 max-w-md">
                <div className="inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-[#174D25] shadow-2xs mb-2">
                  <Sparkles size={13} className="text-[#24833A]" />
                  <span>State Agriculture University Approved Portal</span>
                </div>
                <h2 className="text-base sm:text-lg font-bold text-gray-900 leading-snug">
                  Deliver Live Video Diagnoses, Pest Schedules & Soil Solutions
                </h2>
                <p className="mt-1 text-xs text-gray-600 leading-relaxed">
                  Join over 450+ verified KVK scientists, retired joint directors of agriculture, and university research fellows serving Telangana & Andhra Pradesh farmers.
                </p>
              </div>
            </div>

            {/* Key Benefits Grid */}
            <h2 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">
              Why Consult on RaituSevak360
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
              <div className="rounded-2xl border border-gray-100 bg-[#F7F9F6] p-4">
                <div className="flex items-center gap-2 text-[#24833A] font-bold text-xs mb-1.5">
                  <UsersRound size={16} />
                  <span>Direct Farmer Impact</span>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Assist farmers fighting seasonal bollworm, chilli leaf curl, and salinity at the exact critical crop stage.
                </p>
              </div>

              <div className="rounded-2xl border border-gray-100 bg-[#F7F9F6] p-4">
                <div className="flex items-center gap-2 text-[#24833A] font-bold text-xs mb-1.5">
                  <Calendar size={16} />
                  <span>Flexible Scheduling</span>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Review connection requests and set your own daily availability for 15 or 30-minute video and voice sessions.
                </p>
              </div>

              <div className="rounded-2xl border border-gray-100 bg-[#F7F9F6] p-4">
                <div className="flex items-center gap-2 text-[#24833A] font-bold text-xs mb-1.5">
                  <ShieldCheck size={16} />
                  <span>Verified Credentials</span>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Earn verified agronomist badge displayed to thousands of local cultivators in your district network.
                </p>
              </div>
            </div>

            {/* Primary Action Button */}
            <div className="flex justify-end pt-3 border-t border-gray-100">
              <button
                type="button"
                onClick={handleNext}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#24833A] px-6 py-3 text-xs sm:text-sm font-bold text-white shadow-xs transition hover:bg-[#1e6e30] active:scale-95 cursor-pointer w-full sm:w-auto"
              >
                <span>Start Expert Onboarding</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* STEP 2: PROFESSIONAL INFORMATION */}
      {/* ========================================================= */}
      {step === 2 && (
        <div className="rounded-3xl border border-gray-200 bg-white p-5 sm:p-7 shadow-2xs">
          <div className="flex items-center gap-3 pb-4 border-b border-gray-100 mb-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E4F0DD] text-[#24833A]">
              <User size={20} />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-gray-900">
                Professional Information
              </h2>
              <p className="text-xs text-gray-500">
                Provide your contact details, qualification, and agricultural research background
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Full Name (with title) *
              </label>
              <input
                type="text"
                value={onboarding.fullName || ""}
                onChange={(e) => updateOnboardingData({ fullName: e.target.value })}
                placeholder="e.g. Dr. P. Radhakrishna"
                className={`h-11 w-full rounded-xl border px-3.5 text-xs sm:text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#24833A]/20 transition ${
                  formErrors.fullName ? "border-rose-400 bg-rose-50/50" : "border-gray-200 bg-white"
                }`}
              />
              {formErrors.fullName && (
                <p className="mt-1 text-[11px] text-rose-600">{formErrors.fullName}</p>
              )}
            </div>

            {/* Mobile Number */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Contact Mobile Number *
              </label>
              <input
                type="tel"
                value={onboarding.mobile || ""}
                onChange={(e) => updateOnboardingData({ mobile: e.target.value })}
                placeholder="10-digit mobile number"
                className={`h-11 w-full rounded-xl border px-3.5 text-xs sm:text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#24833A]/20 transition ${
                  formErrors.mobile ? "border-rose-400 bg-rose-50/50" : "border-gray-200 bg-white"
                }`}
              />
              {formErrors.mobile && (
                <p className="mt-1 text-[11px] text-rose-600">{formErrors.mobile}</p>
              )}
            </div>

            {/* Email Address */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Official Email Address
              </label>
              <input
                type="email"
                value={onboarding.email || ""}
                onChange={(e) => updateOnboardingData({ email: e.target.value })}
                placeholder="e.g. expert@raitusevak.in"
                className="h-11 w-full rounded-xl border border-gray-200 bg-white px-3.5 text-xs sm:text-sm text-gray-900 focus:outline-none focus:border-[#24833A] focus:ring-2 focus:ring-[#24833A]/20 transition"
              />
            </div>

            {/* Qualification */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Highest Agricultural Qualification *
              </label>
              <input
                type="text"
                value={onboarding.qualification || ""}
                onChange={(e) => updateOnboardingData({ qualification: e.target.value })}
                placeholder="e.g. Ph.D. in Agronomy / M.Sc. Agriculture"
                className={`h-11 w-full rounded-xl border px-3.5 text-xs sm:text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#24833A]/20 transition ${
                  formErrors.qualification ? "border-rose-400 bg-rose-50/50" : "border-gray-200 bg-white"
                }`}
              />
              {formErrors.qualification && (
                <p className="mt-1 text-[11px] text-rose-600">{formErrors.qualification}</p>
              )}
            </div>

            {/* Primary Specialization */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Primary Agronomy Domain
              </label>
              <select
                value={onboarding.primarySpecialization || EXPERT_SPECIALIZATIONS[0]}
                onChange={(e) => updateOnboardingData({ primarySpecialization: e.target.value })}
                className="h-11 w-full rounded-xl border border-gray-200 bg-white px-3.5 text-xs sm:text-sm text-gray-900 focus:outline-none focus:border-[#24833A] focus:ring-2 focus:ring-[#24833A]/20 transition"
              >
                {EXPERT_SPECIALIZATIONS.map((spec) => (
                  <option key={spec} value={spec}>
                    {spec}
                  </option>
                ))}
              </select>
            </div>

            {/* Experience Years */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Field Experience (Years)
              </label>
              <select
                value={onboarding.experienceYears || 5}
                onChange={(e) =>
                  updateOnboardingData({ experienceYears: parseInt(e.target.value, 10) })
                }
                className="h-11 w-full rounded-xl border border-gray-200 bg-white px-3.5 text-xs sm:text-sm text-gray-900 focus:outline-none focus:border-[#24833A] focus:ring-2 focus:ring-[#24833A]/20 transition"
              >
                {[2, 3, 5, 8, 10, 12, 15, 20, 25].map((y) => (
                  <option key={y} value={y}>
                    {y}+ Years of Experience
                  </option>
                ))}
              </select>
            </div>

            {/* Location / Institution */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Research Center / University / Location *
              </label>
              <input
                type="text"
                value={onboarding.location || ""}
                onChange={(e) => updateOnboardingData({ location: e.target.value })}
                placeholder="e.g. Warangal Agricultural Research Station, Hanamkonda"
                className={`h-11 w-full rounded-xl border px-3.5 text-xs sm:text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#24833A]/20 transition ${
                  formErrors.location ? "border-rose-400 bg-rose-50/50" : "border-gray-200 bg-white"
                }`}
              />
              {formErrors.location && (
                <p className="mt-1 text-[11px] text-rose-600">{formErrors.location}</p>
              )}
            </div>
          </div>

          {/* Languages Spoken */}
          <div className="mt-5 pt-4 border-t border-gray-100">
            <label className="block text-xs font-bold text-gray-700 mb-1.5">
              Consultation Languages Spoken
            </label>
            <div className="flex flex-wrap gap-2">
              {ALL_LANGUAGES.map((lang) => {
                const isSelected = onboarding.languages?.includes(lang);
                return (
                  <button
                    key={lang}
                    type="button"
                    onClick={() => toggleLanguage(lang)}
                    className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition cursor-pointer active:scale-95 ${
                      isSelected
                        ? "bg-[#24833A] text-white shadow-2xs"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200/70"
                    }`}
                  >
                    {isSelected && <Check size={12} />}
                    <span>{lang}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Action Row */}
          <div className="mt-7 flex items-center justify-between pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={handleBack}
              className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 px-4 py-2.5 text-xs font-bold text-gray-700 hover:bg-gray-50 active:scale-95 cursor-pointer"
            >
              <ArrowLeft size={14} />
              <span>Back</span>
            </button>

            <button
              type="button"
              onClick={handleNext}
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#24833A] px-5 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-[#1e6e30] active:scale-95 cursor-pointer"
            >
              <span>Continue to Expertise</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* STEP 3: EXPERT DETAILS (EXPERTISE CHIPS & DOMAINS) */}
      {/* ========================================================= */}
      {step === 3 && (
        <div className="rounded-3xl border border-gray-200 bg-white p-5 sm:p-7 shadow-2xs">
          <div className="flex items-center gap-3 pb-4 border-b border-gray-100 mb-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E4F0DD] text-[#24833A]">
              <Sprout size={20} />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-gray-900">
                Agronomy Expertise & Domains
              </h2>
              <p className="text-xs text-gray-500">
                Select the agricultural topics and field practices you are certified to advise on
              </p>
            </div>
          </div>

          <p className="text-xs font-medium text-gray-600 mb-3">
            Select all areas where you can diagnose and prescribe solutions for cultivators:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {EXPERT_SPECIALIZATIONS.map((spec) => {
              const isSelected = onboarding.expertiseAreas?.includes(spec);
              return (
                <div
                  key={spec}
                  onClick={() => toggleSpecialization(spec)}
                  className={`flex items-start gap-3 rounded-2xl border p-3.5 transition cursor-pointer active:scale-98 ${
                    isSelected
                      ? "border-[#24833A] bg-[#F4FBF5] ring-2 ring-[#24833A]/20"
                      : "border-gray-200 bg-white hover:border-gray-300"
                  }`}
                >
                  <div
                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border mt-0.5 transition ${
                      isSelected
                        ? "border-[#24833A] bg-[#24833A] text-white"
                        : "border-gray-300 bg-white"
                    }`}
                  >
                    {isSelected && <Check size={12} strokeWidth={3} />}
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-gray-900">{spec}</h3>
                    <p className="text-[11px] text-gray-500 mt-0.5">
                      Diagnostics, field thresholds, and chemical/biological management.
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {formErrors.expertise && (
            <p className="mt-3 text-xs text-rose-600 font-semibold">{formErrors.expertise}</p>
          )}

          {/* Action Row */}
          <div className="mt-7 flex items-center justify-between pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={handleBack}
              className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 px-4 py-2.5 text-xs font-bold text-gray-700 hover:bg-gray-50 active:scale-95 cursor-pointer"
            >
              <ArrowLeft size={14} />
              <span>Back</span>
            </button>

            <button
              type="button"
              onClick={handleNext}
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#24833A] px-5 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-[#1e6e30] active:scale-95 cursor-pointer"
            >
              <span>Review & Verification</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* STEP 4: VERIFICATION & AGREEMENT REVIEW */}
      {/* ========================================================= */}
      {step === 4 && (
        <div className="rounded-3xl border border-gray-200 bg-white p-5 sm:p-7 shadow-2xs">
          <div className="flex items-center gap-3 pb-4 border-b border-gray-100 mb-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E4F0DD] text-[#24833A]">
              <ShieldCheck size={20} />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-gray-900">
                Verification & Application Review
              </h2>
              <p className="text-xs text-gray-500">
                Review your professional profile and confirm your agronomy advisory commitment
              </p>
            </div>
          </div>

          {/* Summary Review Card */}
          <div className="rounded-2xl border border-gray-100 bg-[#F7F9F6] p-4 flex flex-col gap-3 text-xs mb-5">
            <div className="flex items-center justify-between pb-2 border-b border-gray-200/60">
              <span className="text-gray-500 font-medium">Expert Name</span>
              <span className="font-bold text-gray-900">{onboarding.fullName}</span>
            </div>

            <div className="flex items-center justify-between pb-2 border-b border-gray-200/60">
              <span className="text-gray-500 font-medium">Qualification</span>
              <span className="font-semibold text-gray-800">{onboarding.qualification}</span>
            </div>

            <div className="flex items-center justify-between pb-2 border-b border-gray-200/60">
              <span className="text-gray-500 font-medium">Research Institution</span>
              <span className="font-semibold text-gray-800">{onboarding.location}</span>
            </div>

            <div className="flex items-center justify-between pb-2 border-b border-gray-200/60">
              <span className="text-gray-500 font-medium">Selected Domains</span>
              <span className="font-bold text-[#174D25]">
                {onboarding.expertiseAreas?.length || 0} Specializations
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-500 font-medium">Languages</span>
              <span className="font-semibold text-gray-800">
                {onboarding.languages?.join(", ") || "Telugu, English"}
              </span>
            </div>
          </div>

          {/* Verification Document Info */}
          <div className="rounded-2xl border border-emerald-200/80 bg-emerald-50/60 p-4 mb-5">
            <div className="flex items-start gap-3">
              <Award size={20} className="text-[#24833A] mt-0.5 shrink-0" />
              <div>
                <h3 className="text-xs font-bold text-gray-900">
                  Accreditation & Identity Verification
                </h3>
                <p className="text-[11px] text-gray-600 mt-0.5 leading-relaxed">
                  Your university or departmental identification ({onboarding.idProofType || "Aadhaar / Department ID"}) will be verified by the RaituSevak360 Agricultural Verification Directorate within 24-48 business hours.
                </p>
              </div>
            </div>
          </div>

          {/* Code of Conduct Agreement Checkbox */}
          <div className="rounded-2xl border border-gray-200 p-4 mb-4">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={Boolean(onboarding.agreeToTerms)}
                onChange={(e) => updateOnboardingData({ agreeToTerms: e.target.checked })}
                className="mt-0.5 h-4 w-4 rounded border-gray-300 text-[#24833A] focus:ring-[#24833A]"
              />
              <span className="text-xs text-gray-700 leading-relaxed">
                I hereby declare that all professional qualifications and experience provided are true. I agree to provide scientifically sound, ethical agricultural advisory complying with State Agricultural Directorate pest management guidelines and CIB&RC approved pesticide dosages.
              </span>
            </label>
            {formErrors.terms && (
              <p className="mt-2 text-xs text-rose-600 font-semibold">{formErrors.terms}</p>
            )}
          </div>

          {/* Action Row */}
          <div className="mt-7 flex items-center justify-between pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={handleBack}
              className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 px-4 py-2.5 text-xs font-bold text-gray-700 hover:bg-gray-50 active:scale-95 cursor-pointer"
            >
              <ArrowLeft size={14} />
              <span>Back</span>
            </button>

            <button
              type="button"
              onClick={handleNext}
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#24833A] px-6 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-[#1e6e30] active:scale-95 cursor-pointer"
            >
              <CheckCircle2 size={15} />
              <span>Submit Expert Application</span>
            </button>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* STEP 5: APPLICATION SUBMITTED (SUCCESS STATE) */}
      {/* ========================================================= */}
      {step === 5 && (
        <div className="rounded-3xl border border-gray-200 bg-white p-6 sm:p-10 shadow-2xs text-center">
          {/* Green Success Icon */}
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-[#24833A] mb-4">
            <CheckCircle2 size={44} strokeWidth={2.4} />
          </div>

          <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-[#174D25] border border-emerald-200">
            Application Received
          </span>

          <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 mt-3">
            Expert Application Submitted!
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-gray-500 max-w-md mx-auto leading-relaxed">
            Thank you for applying to the RaituSevak360 Agricultural Advisory Council. Your application is under review by the Agricultural Verification Cell.
          </p>

          {/* Details Card */}
          <div className="mt-6 max-w-md mx-auto rounded-2xl border border-gray-100 bg-[#F7F9F6] p-4 text-left text-xs flex flex-col gap-2.5">
            <div className="flex items-center justify-between pb-2 border-b border-gray-200/60">
              <span className="text-gray-500 font-medium">Application ID</span>
              <span className="font-extrabold text-[#174D25]">
                {onboarding.applicationId || "RS360-EXP-772910"}
              </span>
            </div>

            <div className="flex items-center justify-between pb-2 border-b border-gray-200/60">
              <span className="text-gray-500 font-medium">Submission Date</span>
              <span className="font-semibold text-gray-800">
                {onboarding.submittedAt || "Today"}
              </span>
            </div>

            <div className="flex items-center justify-between pb-2 border-b border-gray-200/60">
              <span className="text-gray-500 font-medium">Verification Status</span>
              <span className="inline-flex items-center gap-1 font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
                <Clock size={11} />
                <span>Pending Verification (24-48 hrs)</span>
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-500 font-medium">Registered Domain</span>
              <span className="font-semibold text-gray-800 truncate max-w-[200px]">
                {onboarding.primarySpecialization || "Crop Advisory"}
              </span>
            </div>
          </div>

          {/* Guidance note */}
          <div className="mt-5 max-w-md mx-auto flex items-center justify-center gap-2 text-xs text-gray-500">
            <ShieldCheck size={16} className="text-[#24833A]" />
            <span>You can already preview incoming requests and practice simulated calls.</span>
          </div>

          {/* Action CTAs */}
          <div className="mt-7 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/dashboard/consultations"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#24833A] px-6 py-3 text-xs sm:text-sm font-bold text-white shadow-xs hover:bg-[#1e6e30] transition active:scale-95 cursor-pointer w-full sm:w-auto"
            >
              <span>Go to Consultations Hub</span>
              <ArrowRight size={15} />
            </Link>

            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center rounded-xl border border-gray-200 bg-white px-5 py-3 text-xs sm:text-sm font-bold text-gray-700 hover:bg-gray-50 transition active:scale-95 cursor-pointer w-full sm:w-auto"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
