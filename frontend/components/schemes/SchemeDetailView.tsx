"use client";

import React, { useState } from "react";
import {
  ArrowLeft,
  Building,
  Landmark,
  Calendar,
  CheckCircle2,
  Clock,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  FileText,
  Phone,
  AlertCircle,
  HelpCircle,
  Share2,
  Check,
} from "lucide-react";
import { GovernmentScheme, SchemeEligibilityEvaluation } from "@/types/government-scheme";
import { governmentSchemesService } from "@/services/government-schemes";
import { useTranslation } from "@/hooks/useTranslation";
import { useAuthStore } from "@/store/auth-store";
import EligibilityHelperModal from "./EligibilityHelperModal";
import BackButton from "@/components/ui/BackButton";

interface SchemeDetailViewProps {
  scheme: GovernmentScheme;
  onBack: () => void;
}

export default function SchemeDetailView({ scheme, onBack }: SchemeDetailViewProps) {
  const { t } = useTranslation();
  const user = useAuthStore((state) => state.user);

  const [isEligibilityModalOpen, setIsEligibilityModalOpen] = useState(false);
  const [eligibilityEvaluation, setEligibilityEvaluation] =
    useState<SchemeEligibilityEvaluation | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  const isCentral = scheme.governmentLevel === "central";
  const isActive = scheme.status === "active";

  const handleCheckEligibility = async () => {
    const evaluation = await governmentSchemesService.checkEligibility(scheme.id, {
      hasLand: true,
      state: "Telangana",
      isFarmer: true,
    });
    setEligibilityEvaluation(evaluation);
    setIsEligibilityModalOpen(true);
  };

  const handleApplyExternal = () => {
    if (scheme.officialApplicationUrl && scheme.officialApplicationUrl.startsWith("http")) {
      window.open(scheme.officialApplicationUrl, "_blank", "noopener,noreferrer");
    }
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-5 pb-28">
      {/* Top Header & Navigation */}
      <div className="flex items-center justify-between">
        <BackButton
          onClick={onBack}
          label={t("schemes.backToSchemes") || "Back to Schemes"}
        />

        <button
          type="button"
          onClick={handleShare}
          className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-gray-600 border border-gray-200 hover:bg-gray-50 transition cursor-pointer"
          aria-label="Share scheme link"
        >
          {copiedLink ? (
            <>
              <Check size={14} className="text-[#24833A]" />
              <span className="text-[#24833A] font-bold">Link Copied</span>
            </>
          ) : (
            <>
              <Share2 size={13} />
              <span>Share</span>
            </>
          )}
        </button>
      </div>

      {/* Ministry & Level Banner */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-2xs">
        <div className="flex flex-col gap-3">
          {/* Top Badges */}
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                isCentral
                  ? "bg-blue-50 text-blue-700 border border-blue-200"
                  : "bg-emerald-50 text-[#174D25] border border-emerald-200"
              }`}
            >
              {isCentral ? <Building size={12} /> : <Landmark size={12} />}
              <span>
                {isCentral
                  ? t("schemes.centralScheme") || "Central Scheme"
                  : scheme.stateName
                  ? `${scheme.stateName} State Scheme`
                  : t("schemes.stateScheme") || "State Scheme"}
              </span>
            </span>

            <span
              className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                isActive
                  ? "bg-emerald-50 text-[#24833A] border border-emerald-200"
                  : "bg-amber-50 text-amber-800 border border-amber-200"
              }`}
            >
              {isActive ? (
                <>
                  <span className="h-1.5 w-1.5 rounded-full bg-[#24833A] animate-pulse" />
                  <span>{t("schemes.activeScheme") || "Active Scheme"}</span>
                </>
              ) : (
                <>
                  <Clock size={11} />
                  <span>{t("schemes.upcomingScheme") || "Upcoming Scheme"}</span>
                </>
              )}
            </span>

            {scheme.isPotentiallyEligible && (
              <span
                className="inline-flex items-center gap-1 rounded-full bg-[#E4F0DD] px-2.5 py-0.5 text-[11px] font-bold text-[#174D25] border border-[#24833A]/20"
                title="Informational helper indication based on local profile data"
              >
                <Sparkles size={12} className="text-[#24833A]" />
                <span>{t("schemes.potentiallyEligible") || "Potentially eligible"}</span>
              </span>
            )}
          </div>

          {/* Ministry / Department Hierarchy */}
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-gray-500">
              {scheme.ministry}
            </p>
            {scheme.department && (
              <p className="text-[11px] font-medium text-gray-400">
                {scheme.department}
              </p>
            )}
          </div>

          {/* Scheme Title */}
          <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 leading-tight">
            {scheme.name}
          </h1>

          {/* Detailed Summary */}
          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
            {scheme.shortDescription}
          </p>

          {/* Source Verification Badge */}
          <div className="flex items-center gap-2 pt-2 border-t border-gray-100 text-[11px] text-gray-500">
            <ShieldCheck size={14} className="text-[#24833A]" />
            <span>
              {t("schemes.verifiedSource") || "Verified Official Source"}:{" "}
              <strong className="text-gray-700">{scheme.source.name}</strong> (
              {t("schemes.lastVerified") || "Verified"}: {scheme.lastVerified})
            </span>
          </div>
        </div>
      </div>

      {/* Verified Financial Benefit Block */}
      <div className="rounded-2xl border border-[#24833A]/25 bg-gradient-to-br from-[#F4F9F2] to-[#E9F5E6] p-5 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <span className="text-[11px] font-bold text-[#174D25] uppercase tracking-wider">
              {t("schemes.financialBenefit") || "Financial Benefit"}
            </span>
            <h2 className="text-base sm:text-lg font-extrabold text-[#174D25] mt-0.5">
              {scheme.benefit.headline}
            </h2>
          </div>
          <div className="self-start sm:self-auto rounded-xl bg-white px-3.5 py-1.5 border border-[#24833A]/20 shadow-2xs">
            <span className="text-sm sm:text-base font-black text-[#174D25]">
              {scheme.benefit.amountOrSubsidy}
            </span>
          </div>
        </div>

        <p className="mt-2.5 text-xs text-gray-700 leading-relaxed">
          {scheme.benefit.description}
        </p>

        <div className="mt-3 flex items-center gap-2 text-xs font-semibold text-[#174D25]">
          <Clock size={13} />
          <span>Payment Schedule: {scheme.benefit.paymentFrequency}</span>
        </div>
      </div>

      {/* Official Eligibility Criteria */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-2xs">
        <h2 className="text-sm sm:text-base font-bold text-gray-900 border-b border-gray-100 pb-3 flex items-center gap-2">
          <CheckCircle2 size={18} className="text-[#24833A]" />
          <span>{t("schemes.eligibilityCriteria") || "Eligibility Criteria"}</span>
        </h2>

        <div className="mt-4 space-y-4">
          <div>
            <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wide">
              Target Beneficiaries
            </h3>
            <ul className="mt-2 space-y-1.5">
              {scheme.eligibility.targetBeneficiaries.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs text-gray-700">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#24833A] mt-1.5 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wide">
              Landholding Requirement
            </h3>
            <p className="mt-1 text-xs text-gray-700 leading-relaxed">
              {scheme.eligibility.landholdingRequirement}
            </p>
          </div>

          <div>
            <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wide">
              State & Territorial Scope
            </h3>
            <p className="mt-1 text-xs text-gray-700 leading-relaxed">
              {scheme.eligibility.locationState}
            </p>
          </div>

          {scheme.eligibility.incomeOrExclusions.length > 0 && (
            <div>
              <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wide">
                Exclusions & Ineligible Categories
              </h3>
              <ul className="mt-2 space-y-1.5">
                {scheme.eligibility.incomeOrExclusions.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs text-gray-700">
                    <span className="h-1.5 w-1.5 rounded-full bg-red-400 mt-1.5 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {scheme.eligibility.otherConditions.length > 0 && (
            <div>
              <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wide">
                Mandatory Operational Conditions
              </h3>
              <ul className="mt-2 space-y-1.5">
                {scheme.eligibility.otherConditions.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs text-gray-700">
                    <span className="h-1.5 w-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Required Documents */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-2xs">
        <h2 className="text-sm sm:text-base font-bold text-gray-900 border-b border-gray-100 pb-3 flex items-center gap-2">
          <FileText size={18} className="text-[#24833A]" />
          <span>{t("schemes.requiredDocuments") || "Required Documents"}</span>
        </h2>

        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {scheme.documents.map((doc, idx) => (
            <div
              key={idx}
              className="rounded-xl border border-gray-100 bg-gray-50/70 p-3.5 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-xs font-bold text-gray-900">{doc.name}</h3>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[9px] font-bold ${
                      doc.mandatory
                        ? "bg-red-50 text-red-700 border border-red-200"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {doc.mandatory ? "Mandatory" : "Optional"}
                  </span>
                </div>
                {doc.description && (
                  <p className="mt-1 text-[11px] text-gray-500 leading-normal">
                    {doc.description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Important Dates */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-2xs">
        <h2 className="text-sm sm:text-base font-bold text-gray-900 border-b border-gray-100 pb-3 flex items-center gap-2">
          <Calendar size={18} className="text-[#24833A]" />
          <span>{t("schemes.importantDates") || "Important Dates"}</span>
        </h2>

        <div className="mt-3.5 space-y-2 text-xs text-gray-700">
          <div className="flex items-center gap-2">
            <span className="font-bold text-gray-900 w-36">Application Deadline:</span>
            <span>{scheme.importantDates.applicationDeadline}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-gray-900 w-36">Scheme Period:</span>
            <span>{scheme.importantDates.schemePeriod}</span>
          </div>
          {scheme.importantDates.details && (
            <p className="mt-2 text-[11px] text-gray-500 leading-normal">
              {scheme.importantDates.details}
            </p>
          )}
        </div>
      </div>

      {/* How to Apply Section (Strictly directs to Official Government Portal) */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-2xs">
        <h2 className="text-sm sm:text-base font-bold text-gray-900 border-b border-gray-100 pb-3 flex items-center gap-2">
          <Landmark size={18} className="text-[#24833A]" />
          <span>{t("schemes.howToApply") || "How to Apply"}</span>
        </h2>

        <div className="mt-4">
          <p className="text-xs text-gray-700 leading-relaxed font-medium">
            {scheme.howToApply.summary}
          </p>

          <ol className="mt-3 space-y-2">
            {scheme.howToApply.steps.map((step, idx) => (
              <li
                key={idx}
                className="flex items-start gap-2.5 rounded-xl bg-gray-50 p-2.5 text-xs text-gray-800"
              >
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#E4F0DD] text-[10px] font-bold text-[#174D25]">
                  {idx + 1}
                </span>
                <span className="leading-snug">{step}</span>
              </li>
            ))}
          </ol>

          {/* Safety & Compliance Notice: No Fake Forms */}
          <div className="mt-4 rounded-xl bg-amber-50/70 p-3.5 border border-amber-200/80 text-[11px] text-amber-900 leading-relaxed flex items-start gap-2">
            <AlertCircle size={15} className="text-amber-700 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Official Government Submission: </span>
              <span>
                {scheme.howToApply.note ||
                  "RaituSevak360 assists farmers with discovery and navigation. Government applications are submitted strictly through the official department portal."}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Official Helpline */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-2xs">
        <h2 className="text-sm sm:text-base font-bold text-gray-900 border-b border-gray-100 pb-3 flex items-center gap-2">
          <Phone size={18} className="text-[#24833A]" />
          <span>{t("schemes.helpline") || "Official Helpline"}</span>
        </h2>

        <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <a
              href={`tel:${scheme.helpline.number}`}
              className="text-base sm:text-lg font-black text-[#174D25] hover:underline"
            >
              📞 {scheme.helpline.number}
            </a>
            <p className="text-xs text-gray-600 mt-0.5">{scheme.helpline.label}</p>
            {scheme.helpline.hours && (
              <p className="text-[11px] text-gray-400 mt-0.5">{scheme.helpline.hours}</p>
            )}
          </div>

          <a
            href={`tel:${scheme.helpline.number}`}
            className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-[#24833A]/30 bg-[#E4F0DD] px-4 py-2 text-xs font-bold text-[#174D25] hover:bg-[#d6e9cd] transition"
          >
            <Phone size={13} />
            <span>Call Helpline</span>
          </a>
        </div>
      </div>

      {/* Non-Affiliation Legal Disclaimer */}
      <div className="rounded-2xl bg-gray-50 p-4 border border-gray-200 text-[11px] text-gray-500 leading-relaxed">
        <p>
          {t("schemes.officialDisclaimer") ||
            "RaituSevak360 is not affiliated with the Government of India or State Governments. RaituSevak360 assists farmers in discovering schemes; all applications and verifications occur exclusively on official government portals."}
        </p>
      </div>

      {/* Sticky Bottom Action Bar */}
      <div className="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-gray-200 px-4 py-3 shadow-lg">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-3">
          {/* Check Eligibility Button */}
          <button
            type="button"
            onClick={handleCheckEligibility}
            className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl border border-gray-300 bg-white px-4 py-3 text-xs font-bold text-gray-800 hover:bg-gray-50 active:scale-95 transition cursor-pointer shadow-2xs"
            aria-label="Check your profile eligibility informationally"
          >
            <ShieldCheck size={16} className="text-[#24833A]" />
            <span>{t("schemes.checkEligibility") || "Check Eligibility"}</span>
          </button>

          {/* Apply Now Button: Verified Safe External Link */}
          {scheme.officialApplicationUrl && scheme.officialApplicationUrl.startsWith("http") ? (
            <button
              type="button"
              onClick={handleApplyExternal}
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-[#24833A] px-5 py-3 text-xs font-bold text-white hover:bg-[#1e6f31] active:scale-95 transition shadow-sm cursor-pointer"
              aria-label={`Apply on official portal for ${scheme.name}`}
            >
              <span>{t("schemes.applyNow") || "Apply Now"}</span>
              <ExternalLink size={14} />
            </button>
          ) : (
            <button
              type="button"
              disabled
              className="flex-1 inline-flex items-center justify-center gap-1 rounded-xl bg-gray-200 px-4 py-3 text-xs font-bold text-gray-500 cursor-not-allowed"
              title={
                t("schemes.applyUnavailable") ||
                "Official application link unavailable. Please visit the scheme's official portal."
              }
            >
              <span>{t("schemes.applyNow") || "Apply Now"}</span>
            </button>
          )}
        </div>
      </div>

      {/* Eligibility Helper Modal */}
      <EligibilityHelperModal
        scheme={scheme}
        evaluation={eligibilityEvaluation}
        isOpen={isEligibilityModalOpen}
        onClose={() => setIsEligibilityModalOpen(false)}
        onApplyExternal={handleApplyExternal}
      />
    </div>
  );
}
