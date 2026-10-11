"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Building2,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertTriangle,
  XCircle,
  HelpCircle,
  RotateCcw,
  ShieldCheck,
  ChevronRight,
  ArrowRight,
  FileText,
  Mail,
  Phone,
  MapPin,
  Globe,
  User,
  Calendar,
  AlertCircle,
  FileCheck,
  History,
  Info,
  X,
  ExternalLink,
} from "lucide-react";
import BackButton from "@/components/ui/BackButton";
import { useTranslation } from "@/hooks/useTranslation";
import { useNgoStore } from "@/store/ngo-store";
import {
  NgoOrganizationItem,
  NgoType,
  NgoVerificationStatus,
  NgoFilterState,
} from "@/types/ngo";

const ALL_ORGANIZATION_TYPES: NgoType[] = [
  "Agricultural NGO",
  "Rural Development Organization",
  "Farmer Welfare Organization",
  "Agricultural Development Organization",
];

const ALL_DISTRICTS = ["Guntur", "Krishna", "West Godavari", "Kurnool", "Prakasam"];

const STATUS_CONFIG: Record<
  NgoVerificationStatus,
  { label: string; badgeClass: string; icon: React.ReactNode }
> = {
  draft: {
    label: "Draft",
    badgeClass: "bg-slate-100 text-slate-700 border-slate-300",
    icon: <Clock size={12} className="text-slate-500" />,
  },
  submitted: {
    label: "Submitted",
    badgeClass: "bg-blue-50 text-blue-700 border-blue-200",
    icon: <Clock size={12} className="text-blue-600" />,
  },
  under_review: {
    label: "Under Review",
    badgeClass: "bg-purple-50 text-purple-700 border-purple-200",
    icon: <Clock size={12} className="text-purple-600 animate-pulse" />,
  },
  clarification_required: {
    label: "Clarification Required",
    badgeClass: "bg-amber-50 text-amber-800 border-amber-300 font-medium",
    icon: <HelpCircle size={12} className="text-amber-600" />,
  },
  verified: {
    label: "Verified",
    badgeClass: "bg-emerald-50 text-emerald-800 border-emerald-200 font-semibold",
    icon: <CheckCircle2 size={12} className="text-emerald-600" />,
  },
  rejected: {
    label: "Rejected",
    badgeClass: "bg-rose-50 text-rose-800 border-rose-300 font-medium",
    icon: <XCircle size={12} className="text-rose-600" />,
  },
};

export default function GovtNgosWorkspace() {
  const { t } = useTranslation();

  const organizations = useNgoStore((state) => state.organizations);
  const markUnderReview = useNgoStore((state) => state.markUnderReview);
  const requestClarification = useNgoStore((state) => state.requestClarification);
  const verifyOrganization = useNgoStore((state) => state.verifyOrganization);
  const rejectOrganization = useNgoStore((state) => state.rejectOrganization);

  // Filters state
  const [filters, setFilters] = useState<NgoFilterState>({
    searchQuery: "",
    selectedType: "all",
    selectedDistrict: "all",
    selectedStatus: "all",
  });

  // Selected organization for detail drilldown view
  const [selectedOrgId, setSelectedOrgId] = useState<string | null>(null);

  // Active modal state
  const [clarificationModalOrg, setClarificationModalOrg] = useState<NgoOrganizationItem | null>(null);
  const [clarificationReason, setClarificationReason] = useState("");
  const [clarificationError, setClarificationError] = useState<string | null>(null);

  const [verifyModalOrg, setVerifyModalOrg] = useState<NgoOrganizationItem | null>(null);
  const [verifyNotes, setVerifyNotes] = useState("");

  const [rejectModalOrg, setRejectModalOrg] = useState<NgoOrganizationItem | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [rejectionError, setRejectionError] = useState<string | null>(null);

  // Currently selected organization object (live from store)
  const currentOrg = useMemo(() => {
    if (!selectedOrgId) return null;
    return organizations.find((o) => o.id === selectedOrgId) || null;
  }, [selectedOrgId, organizations]);

  // Filtered organizations
  const filteredOrganizations = useMemo(() => {
    const q = filters.searchQuery.trim().toLowerCase();
    return organizations.filter((org) => {
      if (filters.selectedType !== "all" && org.organizationType !== filters.selectedType) {
        return false;
      }
      if (filters.selectedDistrict !== "all" && org.district !== filters.selectedDistrict) {
        return false;
      }
      if (filters.selectedStatus !== "all" && org.status !== filters.selectedStatus) {
        return false;
      }
      if (q) {
        const matchName = org.name.toLowerCase().includes(q);
        const matchRef = org.id.toLowerCase().includes(q);
        const matchDistrict = org.district.toLowerCase().includes(q);
        const matchReg = org.registrationRef.toLowerCase().includes(q);
        if (!matchName && !matchRef && !matchDistrict && !matchReg) {
          return false;
        }
      }
      return true;
    });
  }, [organizations, filters]);

  // Overall metrics across all organizations
  const metrics = useMemo(() => {
    const total = organizations.length;
    const registered = organizations.filter((o) => o.status === "verified").length;
    const pendingReview = organizations.filter(
      (o) => o.status === "submitted" || o.status === "under_review"
    ).length;
    const clarificationRequired = organizations.filter(
      (o) => o.status === "clarification_required"
    ).length;
    const rejected = organizations.filter((o) => o.status === "rejected").length;

    return {
      total,
      registered,
      pendingReview,
      clarificationRequired,
      rejected,
    };
  }, [organizations]);

  const handleClearFilters = () => {
    setFilters({
      searchQuery: "",
      selectedType: "all",
      selectedDistrict: "all",
      selectedStatus: "all",
    });
  };

  // Review workflow handlers
  const handleMarkUnderReview = (org: NgoOrganizationItem) => {
    markUnderReview(org.id, "Application dossier taken up for accreditation review.", "District Agriculture Officer");
  };

  const handleOpenClarificationModal = (org: NgoOrganizationItem) => {
    setClarificationModalOrg(org);
    setClarificationReason("");
    setClarificationError(null);
  };

  const handleSubmitClarification = () => {
    if (!clarificationReason.trim()) {
      setClarificationError("A specific clarification reason is mandatory.");
      return;
    }
    if (clarificationModalOrg) {
      requestClarification(clarificationModalOrg.id, clarificationReason.trim(), "Senior Verification Officer");
      setClarificationModalOrg(null);
    }
  };

  const handleOpenVerifyModal = (org: NgoOrganizationItem) => {
    setVerifyModalOrg(org);
    setVerifyNotes("");
  };

  const handleConfirmVerify = () => {
    if (verifyModalOrg) {
      verifyOrganization(verifyModalOrg.id, verifyNotes.trim(), "District Agriculture Officer (Reviewing Authority)");
      setVerifyModalOrg(null);
    }
  };

  const handleOpenRejectModal = (org: NgoOrganizationItem) => {
    setRejectModalOrg(org);
    setRejectionReason("");
    setRejectionError(null);
  };

  const handleConfirmReject = () => {
    if (!rejectionReason.trim()) {
      setRejectionError("A specific rejection reason is mandatory.");
      return;
    }
    if (rejectModalOrg) {
      rejectOrganization(rejectModalOrg.id, rejectionReason.trim(), "District Agriculture Officer (Reviewing Authority)");
      setRejectModalOrg(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-16">
      {/* Header Container */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              {currentOrg ? (
                <button
                  id="btn-back-to-ngo-directory"
                  onClick={() => setSelectedOrgId(null)}
                  className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 min-h-[44px]"
                >
                  <ArrowRight size={16} className="rotate-180" />
                  <span>{t("govtNgos.backToDirectory")}</span>
                </button>
              ) : (
                <BackButton
                  href="/dashboard"
                  label={t("govtNgos.backToDashboard")}
                />
              )}
              <div className="h-6 w-px bg-slate-200" />
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
                    {t("govtNgos.directoryTitle")}
                  </h1>
                  <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-800">
                    Live Partner Portal
                  </span>
                </div>
                <p className="text-xs text-slate-500 sm:text-sm">
                  {t("govtNgos.subtitle")}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Link
                href="/dashboard/government/verification"
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 min-h-[44px]"
              >
                <ShieldCheck size={16} className="text-[#24833A]" />
                <span>Officer Credentials Desk</span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8 space-y-6">
        {/* Prominent Demo Notice Disclaimer */}
        <div className="rounded-xl border border-amber-200 bg-amber-50/90 p-4 text-amber-900 shadow-2xs">
          <div className="flex items-start gap-3">
            <AlertTriangle size={18} className="mt-0.5 shrink-0 text-amber-600" />
            <div className="text-xs sm:text-sm leading-relaxed space-y-1">
              <p className="font-semibold text-amber-950">
                {t("govtNgos.demoDisclaimer")}
              </p>
              <p className="text-amber-800">
                Accreditation actions update local demonstration state only. No real state authority or statutory certificate is granted.
              </p>
            </div>
          </div>
        </div>

        {/* If Organization Detail View is Active */}
        {currentOrg ? (
          <div className="space-y-6">
            {/* Detail View Header Card */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs sm:p-6 space-y-4">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-md bg-purple-100 px-2 py-0.5 font-mono text-xs font-bold text-purple-800">
                      {currentOrg.id}
                    </span>
                    <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700">
                      {currentOrg.organizationType}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold border ${
                        STATUS_CONFIG[currentOrg.status].badgeClass
                      }`}
                    >
                      {STATUS_CONFIG[currentOrg.status].icon}
                      {STATUS_CONFIG[currentOrg.status].label}
                    </span>
                  </div>

                  <h2 className="mt-2 text-xl font-bold text-slate-900 sm:text-2xl">
                    {currentOrg.name}
                  </h2>
                  <p className="text-xs text-slate-500 font-mono mt-0.5">
                    Reg Ref: {currentOrg.registrationRef} • {currentOrg.registrationAuthority}
                  </p>

                  <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <Calendar size={14} className="text-slate-400" />
                      Submitted: {currentOrg.submissionDate}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={14} className="text-slate-400" />
                      Last Updated: {currentOrg.lastUpdated}
                    </span>
                    {currentOrg.verifiedDate && (
                      <span className="flex items-center gap-1 text-emerald-700 font-medium">
                        <CheckCircle2 size={14} />
                        Verified: {currentOrg.verifiedDate}
                      </span>
                    )}
                  </div>
                </div>

                {/* Context-Sensitive Review Actions */}
                <div className="flex flex-wrap items-center gap-2">
                  {(currentOrg.status === "submitted" || currentOrg.status === "clarification_required") && (
                    <button
                      id="btn-action-mark-under-review"
                      onClick={() => handleMarkUnderReview(currentOrg)}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-purple-200 bg-purple-50 px-3.5 py-2 text-xs font-semibold text-purple-700 hover:bg-purple-100 min-h-[44px]"
                    >
                      <Clock size={14} />
                      <span>{t("govtNgos.markUnderReview")}</span>
                    </button>
                  )}

                  {currentOrg.status !== "verified" && currentOrg.status !== "rejected" && (
                    <button
                      id="btn-action-request-clarification"
                      onClick={() => handleOpenClarificationModal(currentOrg)}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-amber-200 bg-amber-50 px-3.5 py-2 text-xs font-semibold text-amber-800 hover:bg-amber-100 min-h-[44px]"
                    >
                      <HelpCircle size={14} />
                      <span>{t("govtNgos.requestClarification")}</span>
                    </button>
                  )}

                  {currentOrg.status !== "verified" && (
                    <button
                      id="btn-action-verify-org"
                      onClick={() => handleOpenVerifyModal(currentOrg)}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-[#24833A] px-4 py-2 text-xs font-semibold text-white hover:bg-[#1d6b2f] shadow-xs min-h-[44px]"
                    >
                      <CheckCircle2 size={14} />
                      <span>{t("govtNgos.verifyOrganization")}</span>
                    </button>
                  )}

                  {currentOrg.status !== "rejected" && (
                    <button
                      id="btn-action-reject-org"
                      onClick={() => handleOpenRejectModal(currentOrg)}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-2 text-xs font-semibold text-rose-700 hover:bg-rose-100 min-h-[44px]"
                    >
                      <XCircle size={14} />
                      <span>{t("govtNgos.rejectRegistration")}</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Status Specific Notice Boxes */}
              {currentOrg.status === "clarification_required" && currentOrg.clarificationReason && (
                <div className="rounded-xl border border-amber-300 bg-amber-50 p-4 text-xs text-amber-900 space-y-1">
                  <p className="font-bold flex items-center gap-1.5 text-amber-950">
                    <HelpCircle size={14} />
                    Clarification Pending from Organization:
                  </p>
                  <p className="text-amber-800">{currentOrg.clarificationReason}</p>
                </div>
              )}

              {currentOrg.status === "rejected" && currentOrg.rejectionReason && (
                <div className="rounded-xl border border-rose-300 bg-rose-50 p-4 text-xs text-rose-900 space-y-1">
                  <p className="font-bold flex items-center gap-1.5 text-rose-950">
                    <AlertCircle size={14} />
                    Grounds for Registration Rejection:
                  </p>
                  <p className="text-rose-800">{currentOrg.rejectionReason}</p>
                </div>
              )}

              {currentOrg.reviewerNotes && currentOrg.status === "verified" && (
                <div className="rounded-xl border border-emerald-300 bg-emerald-50 p-4 text-xs text-emerald-900 space-y-1">
                  <p className="font-bold flex items-center gap-1.5 text-emerald-950">
                    <CheckCircle2 size={14} />
                    Accreditation Verification Notes:
                  </p>
                  <p className="text-emerald-800">{currentOrg.reviewerNotes}</p>
                </div>
              )}
            </div>

            {/* Two-Column Layout: Organization & Contact Info vs Submitted Documents */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {/* Left Column: Organization & Representative Details */}
              <div className="space-y-6">
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs sm:p-6 space-y-4">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100 pb-2">
                    Organization Details
                  </h3>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 text-xs">
                    <div>
                      <span className="text-slate-400">Organization Type</span>
                      <p className="font-semibold text-slate-800">{currentOrg.organizationType}</p>
                    </div>
                    <div>
                      <span className="text-slate-400">Registration Reference</span>
                      <p className="font-mono font-semibold text-slate-800">{currentOrg.registrationRef}</p>
                    </div>
                    <div>
                      <span className="text-slate-400">Jurisdiction District</span>
                      <p className="font-semibold text-slate-800">{currentOrg.district}</p>
                    </div>
                    <div>
                      <span className="text-slate-400">Operating Mandal</span>
                      <p className="font-semibold text-slate-800">{currentOrg.mandal}</p>
                    </div>
                    <div className="sm:col-span-2">
                      <span className="text-slate-400">Office Address</span>
                      <p className="font-medium text-slate-700">{currentOrg.officeAddress}</p>
                    </div>
                    {currentOrg.officialWebsite && (
                      <div className="sm:col-span-2">
                        <span className="text-slate-400">Official Portal</span>
                        <p className="font-medium text-[#24833A]">
                          <a href={currentOrg.officialWebsite} target="_blank" rel="noreferrer" className="hover:underline flex items-center gap-1">
                            {currentOrg.officialWebsite}
                            <ExternalLink size={12} />
                          </a>
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="border-t border-slate-100 pt-3">
                    <span className="text-xs text-slate-400 block mb-1.5">{t("govtNgos.focusAreas")}</span>
                    <div className="flex flex-wrap gap-1.5">
                      {currentOrg.focusAreas.map((f) => (
                        <span key={f} className="rounded-md bg-slate-100 px-2 py-0.5 text-xs text-slate-700 font-medium">
                          {f}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Contact Info Card */}
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs sm:p-6 space-y-4">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100 pb-2">
                    {t("govtNgos.contactInformation")}
                  </h3>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 text-xs">
                    <div>
                      <span className="text-slate-400">Authorized Representative</span>
                      <p className="font-semibold text-slate-800">{currentOrg.representativeName}</p>
                    </div>
                    <div>
                      <span className="text-slate-400">Designation / Role</span>
                      <p className="font-semibold text-slate-800">{currentOrg.representativeRole}</p>
                    </div>
                    <div>
                      <span className="text-slate-400">Official Email</span>
                      <p className="font-mono text-slate-700">{currentOrg.officialEmail}</p>
                    </div>
                    <div>
                      <span className="text-slate-400">Official Phone</span>
                      <p className="font-mono text-slate-700">{currentOrg.officialPhone}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Submitted Document References & Activity Timeline */}
              <div className="space-y-6">
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs sm:p-6 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">
                      {t("govtNgos.submittedDocuments")}
                    </h3>
                    <span className="text-xs text-slate-400">{currentOrg.documents.length} Proofs</span>
                  </div>

                  <div className="space-y-3">
                    {currentOrg.documents.map((doc) => (
                      <div
                        key={doc.id}
                        className="rounded-xl border border-slate-200 bg-slate-50 p-3.5 space-y-2 text-xs"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="font-bold text-slate-900">{doc.name}</p>
                            <p className="text-slate-500 text-[11px]">{doc.documentType}</p>
                          </div>
                          <span
                            className={`rounded-full px-2 py-0.5 text-[11px] font-semibold border ${
                              doc.status === "verified"
                                ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                                : doc.status === "rejected"
                                ? "bg-rose-50 text-rose-800 border-rose-200"
                                : doc.status === "clarification_required"
                                ? "bg-amber-50 text-amber-800 border-amber-200"
                                : "bg-blue-50 text-blue-800 border-blue-200"
                            }`}
                          >
                            {doc.status.replace("_", " ").toUpperCase()}
                          </span>
                        </div>

                        <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-200/60 font-mono">
                          <span>Ref: {doc.referenceId}</span>
                          <span>{doc.fileName} ({doc.fileSize})</span>
                        </div>

                        {doc.note && (
                          <p className="text-[11px] text-slate-600 bg-white p-2 rounded-lg border border-slate-200">
                            {doc.note}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Activity Timeline Card */}
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs sm:p-6 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">
                      {t("govtNgos.activityTimeline")}
                    </h3>
                    <History size={16} className="text-slate-400" />
                  </div>

                  <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                    {currentOrg.timeline.map((event, idx) => (
                      <div key={idx} className="relative">
                        <div className="absolute -left-6 top-1 h-2.5 w-2.5 rounded-full border-2 border-white bg-slate-400 ring-2 ring-slate-100" />
                        <p className="text-xs font-bold text-slate-800">{event.title}</p>
                        <p className="text-[11px] text-slate-400">{event.date} • {event.actor}</p>
                        {event.note && (
                          <p className="mt-1 text-xs text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-100">
                            {event.note}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Directory Overview View */
          <>
            {/* 5 Summary Metric Cards */}
            <section
              aria-label="NGO Directory Summary Metrics"
              className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-5"
            >
              {/* 1. Total Organizations */}
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-500">
                    {t("govtNgos.totalOrganizations")}
                  </span>
                  <div className="rounded-lg bg-slate-100 p-1.5 text-slate-700">
                    <Building2 size={16} />
                  </div>
                </div>
                <p className="mt-2 text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
                  {metrics.total}
                </p>
                <div className="mt-1 flex items-center gap-1 text-[11px] text-slate-500">
                  <span>In state directory</span>
                </div>
              </div>

              {/* 2. Registered / Verified */}
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-500">
                    {t("govtNgos.registered")}
                  </span>
                  <div className="rounded-lg bg-emerald-50 p-1.5 text-emerald-700">
                    <CheckCircle2 size={16} />
                  </div>
                </div>
                <p className="mt-2 text-xl font-bold tracking-tight text-emerald-900 sm:text-2xl">
                  {metrics.registered}
                </p>
                <div className="mt-1 flex items-center gap-1 text-[11px] text-emerald-600">
                  <span>Accreditation active</span>
                </div>
              </div>

              {/* 3. Pending Review */}
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-500">
                    {t("govtNgos.pendingReview")}
                  </span>
                  <div className="rounded-lg bg-purple-50 p-1.5 text-purple-700">
                    <Clock size={16} />
                  </div>
                </div>
                <p className="mt-2 text-xl font-bold tracking-tight text-purple-900 sm:text-2xl">
                  {metrics.pendingReview}
                </p>
                <div className="mt-1 flex items-center gap-1 text-[11px] text-purple-600">
                  <span>Awaiting audit action</span>
                </div>
              </div>

              {/* 4. Clarification Required */}
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-500">
                    {t("govtNgos.clarificationRequired")}
                  </span>
                  <div className="rounded-lg bg-amber-50 p-1.5 text-amber-700">
                    <HelpCircle size={16} />
                  </div>
                </div>
                <p className="mt-2 text-xl font-bold tracking-tight text-amber-900 sm:text-2xl">
                  {metrics.clarificationRequired}
                </p>
                <div className="mt-1 flex items-center gap-1 text-[11px] text-amber-700">
                  <span>Awaiting applicant reply</span>
                </div>
              </div>

              {/* 5. Rejected */}
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-500">
                    {t("govtNgos.rejected")}
                  </span>
                  <div className="rounded-lg bg-rose-50 p-1.5 text-rose-700">
                    <XCircle size={16} />
                  </div>
                </div>
                <p className="mt-2 text-xl font-bold tracking-tight text-rose-900 sm:text-2xl">
                  {metrics.rejected}
                </p>
                <div className="mt-1 flex items-center gap-1 text-[11px] text-rose-600">
                  <span>Registration refused</span>
                </div>
              </div>
            </section>

            {/* Filter and Search Bar Section */}
            <section
              aria-label="NGO Directory Filters"
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs sm:p-6 space-y-4"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="relative flex-1">
                  <Search
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    id="input-ngo-search"
                    type="text"
                    value={filters.searchQuery}
                    onChange={(e) =>
                      setFilters((prev) => ({ ...prev, searchQuery: e.target.value }))
                    }
                    placeholder={t("govtNgos.searchPlaceholder")}
                    className="w-full rounded-xl border border-slate-300 bg-white py-2.5 pl-9 pr-3 text-xs sm:text-sm placeholder-slate-400 focus:border-[#24833A] focus:outline-hidden min-h-[44px]"
                  />
                  {filters.searchQuery && (
                    <button
                      id="btn-clear-search-query"
                      onClick={() =>
                        setFilters((prev) => ({ ...prev, searchQuery: "" }))
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 min-h-[44px] flex items-center justify-center"
                      title="Clear search"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    id="btn-clear-all-filters"
                    onClick={handleClearFilters}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 min-h-[44px] transition-colors"
                  >
                    <RotateCcw size={14} />
                    <span>{t("govtNgos.clearFilters")}</span>
                  </button>
                </div>
              </div>

              {/* Filter Controls Row */}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                {/* Organization Type Filter */}
                <div>
                  <label htmlFor="select-org-type" className="block text-xs font-medium text-slate-700 mb-1">
                    {t("govtNgos.filterType")}
                  </label>
                  <select
                    id="select-org-type"
                    value={filters.selectedType}
                    onChange={(e) =>
                      setFilters((prev) => ({ ...prev, selectedType: e.target.value }))
                    }
                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs sm:text-sm text-slate-800 focus:border-[#24833A] focus:outline-hidden min-h-[44px]"
                  >
                    <option value="all">{t("govtNgos.allTypes")}</option>
                    {ALL_ORGANIZATION_TYPES.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                {/* District Filter */}
                <div>
                  <label htmlFor="select-district" className="block text-xs font-medium text-slate-700 mb-1">
                    {t("govtNgos.filterDistrict")}
                  </label>
                  <select
                    id="select-district"
                    value={filters.selectedDistrict}
                    onChange={(e) =>
                      setFilters((prev) => ({ ...prev, selectedDistrict: e.target.value }))
                    }
                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs sm:text-sm text-slate-800 focus:border-[#24833A] focus:outline-hidden min-h-[44px]"
                  >
                    <option value="all">{t("govtNgos.allDistricts")}</option>
                    {ALL_DISTRICTS.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Verification Status Filter */}
                <div>
                  <label htmlFor="select-status" className="block text-xs font-medium text-slate-700 mb-1">
                    {t("govtNgos.filterStatus")}
                  </label>
                  <select
                    id="select-status"
                    value={filters.selectedStatus}
                    onChange={(e) =>
                      setFilters((prev) => ({ ...prev, selectedStatus: e.target.value }))
                    }
                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs sm:text-sm text-slate-800 focus:border-[#24833A] focus:outline-hidden min-h-[44px]"
                  >
                    <option value="all">{t("govtNgos.allStatuses")}</option>
                    <option value="verified">{t("govtNgos.statusVerified")}</option>
                    <option value="under_review">{t("govtNgos.statusUnderReview")}</option>
                    <option value="submitted">{t("govtNgos.statusSubmitted")}</option>
                    <option value="clarification_required">{t("govtNgos.statusClarificationRequired")}</option>
                    <option value="rejected">{t("govtNgos.statusRejected")}</option>
                    <option value="draft">{t("govtNgos.statusDraft")}</option>
                  </select>
                </div>
              </div>
            </section>

            {/* Organizations Table / Directory Section */}
            <section
              aria-label="NGO Directory Records"
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs sm:p-6 space-y-4"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-slate-900 sm:text-lg">
                  Registered Organizations ({filteredOrganizations.length})
                </h2>
                <span className="text-xs text-slate-500">
                  Showing {filteredOrganizations.length} of {organizations.length}
                </span>
              </div>

              {filteredOrganizations.length === 0 ? (
                /* Empty state */
                <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center space-y-3">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                    <Building2 size={24} />
                  </div>
                  <h3 className="text-sm font-bold text-slate-800 sm:text-base">
                    {t("govtNgos.noOrganizationsFound")}
                  </h3>
                  <p className="text-xs text-slate-500 max-w-md mx-auto">
                    {t("govtNgos.clearFiltersPrompt")}
                  </p>
                  <div>
                    <button
                      id="btn-empty-clear-filters"
                      onClick={handleClearFilters}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-[#24833A] px-4 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-[#1d6b2f] min-h-[44px]"
                    >
                      <RotateCcw size={14} />
                      <span>{t("govtNgos.clearFilters")}</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs sm:text-sm">
                    <thead className="border-b border-slate-200 bg-slate-50 text-slate-600 font-semibold">
                      <tr>
                        <th className="py-3 px-3">{t("govtNgos.orgReference")}</th>
                        <th className="py-3 px-3">{t("govtNgos.orgName")}</th>
                        <th className="py-3 px-3">{t("govtNgos.orgType")}</th>
                        <th className="py-3 px-3">{t("govtNgos.district")}</th>
                        <th className="py-3 px-3">{t("govtNgos.registrationRef")}</th>
                        <th className="py-3 px-3">{t("govtNgos.submissionDate")}</th>
                        <th className="py-3 px-3 text-center">{t("govtNgos.verificationStatus")}</th>
                        <th className="py-3 px-3 text-right">{t("govtNgos.action")}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredOrganizations.map((org) => {
                        const config = STATUS_CONFIG[org.status];
                        return (
                          <tr key={org.id} className="hover:bg-slate-50/70 transition-colors">
                            <td className="py-3 px-3 font-mono text-xs font-bold text-purple-800">
                              {org.id}
                            </td>
                            <td className="py-3 px-3 font-semibold text-slate-900">
                              {org.name}
                            </td>
                            <td className="py-3 px-3 text-slate-600">
                              {org.organizationType}
                            </td>
                            <td className="py-3 px-3 text-slate-700">
                              {org.district}
                            </td>
                            <td className="py-3 px-3 font-mono text-xs text-slate-600">
                              {org.registrationRef}
                            </td>
                            <td className="py-3 px-3 text-slate-500 whitespace-nowrap">
                              {org.submissionDate}
                            </td>
                            <td className="py-3 px-3 text-center">
                              <span
                                className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold border ${config.badgeClass}`}
                              >
                                {config.icon}
                                {config.label}
                              </span>
                            </td>
                            <td className="py-3 px-3 text-right">
                              <button
                                id={`btn-review-org-${org.id.toLowerCase().replace(/\s+/g, "-")}`}
                                onClick={() => setSelectedOrgId(org.id)}
                                className="inline-flex items-center gap-1 rounded-lg bg-emerald-50 px-2.5 py-1.5 text-xs font-semibold text-[#24833A] hover:bg-emerald-100 min-h-[44px] transition-colors"
                              >
                                <span>{t("govtNgos.reviewOrganization")}</span>
                                <ChevronRight size={14} />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          </>
        )}
      </main>

      {/* Clarification Request Modal */}
      {clarificationModalOrg && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs"
        >
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">
                {t("govtNgos.clarificationModalTitle")}
              </h3>
              <button
                id="btn-close-clarification-modal"
                onClick={() => setClarificationModalOrg(null)}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 min-h-[44px] min-w-[44px] flex items-center justify-center"
              >
                <X size={18} />
              </button>
            </div>

            <p className="text-xs text-slate-600">
              Organization: <strong className="text-slate-900">{clarificationModalOrg.name}</strong> ({clarificationModalOrg.id})
            </p>

            <div className="space-y-1">
              <label htmlFor="input-clarification-reason" className="block text-xs font-semibold text-slate-700">
                {t("govtNgos.clarificationReasonLabel")}
              </label>
              <textarea
                id="input-clarification-reason"
                rows={4}
                value={clarificationReason}
                onChange={(e) => {
                  setClarificationReason(e.target.value);
                  if (clarificationError) setClarificationError(null);
                }}
                placeholder={t("govtNgos.clarificationPlaceholder")}
                className="w-full rounded-xl border border-slate-300 p-3 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:border-[#24833A] focus:outline-hidden"
              />
              {clarificationError && (
                <p className="text-xs text-rose-600 font-medium">{clarificationError}</p>
              )}
            </div>

            <div className="flex justify-end gap-2 border-t border-slate-100 pt-3">
              <button
                id="btn-cancel-clarification"
                onClick={() => setClarificationModalOrg(null)}
                className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 min-h-[44px]"
              >
                {t("govtNgos.cancel")}
              </button>
              <button
                id="btn-submit-clarification"
                onClick={handleSubmitClarification}
                className="rounded-xl bg-amber-600 px-4 py-2 text-xs font-semibold text-white hover:bg-amber-700 min-h-[44px]"
              >
                {t("govtNgos.submitClarificationBtn")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Verification Confirmation Modal */}
      {verifyModalOrg && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs"
        >
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <CheckCircle2 size={18} className="text-[#24833A]" />
                {t("govtNgos.confirmVerificationTitle")}
              </h3>
              <button
                id="btn-close-verify-modal"
                onClick={() => setVerifyModalOrg(null)}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 min-h-[44px] min-w-[44px] flex items-center justify-center"
              >
                <X size={18} />
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              {t("govtNgos.confirmVerificationText")}
            </p>

            <div className="rounded-xl bg-emerald-50 p-3 text-xs text-emerald-900 border border-emerald-200">
              <p className="font-bold">{verifyModalOrg.name}</p>
              <p className="font-mono text-[11px] text-emerald-700">Reference: {verifyModalOrg.id} • {verifyModalOrg.registrationRef}</p>
            </div>

            <div className="space-y-1">
              <label htmlFor="input-verify-notes" className="block text-xs font-semibold text-slate-700">
                Accreditation Review Notes (Optional)
              </label>
              <textarea
                id="input-verify-notes"
                rows={3}
                value={verifyNotes}
                onChange={(e) => setVerifyNotes(e.target.value)}
                placeholder="Audit notes or verification resolution details..."
                className="w-full rounded-xl border border-slate-300 p-3 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:border-[#24833A] focus:outline-hidden"
              />
            </div>

            <div className="flex justify-end gap-2 border-t border-slate-100 pt-3">
              <button
                id="btn-cancel-verify"
                onClick={() => setVerifyModalOrg(null)}
                className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 min-h-[44px]"
              >
                {t("govtNgos.cancel")}
              </button>
              <button
                id="btn-confirm-verify"
                onClick={handleConfirmVerify}
                className="rounded-xl bg-[#24833A] px-4 py-2 text-xs font-semibold text-white hover:bg-[#1d6b2f] min-h-[44px]"
              >
                {t("govtNgos.confirmVerifyBtn")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Rejection Modal */}
      {rejectModalOrg && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs"
        >
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-rose-900 flex items-center gap-2">
                <AlertCircle size={18} className="text-rose-600" />
                {t("govtNgos.rejectionModalTitle")}
              </h3>
              <button
                id="btn-close-reject-modal"
                onClick={() => setRejectModalOrg(null)}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 min-h-[44px] min-w-[44px] flex items-center justify-center"
              >
                <X size={18} />
              </button>
            </div>

            <p className="text-xs text-slate-600">
              Confirm rejection of organization registration for <strong className="text-slate-900">{rejectModalOrg.name}</strong> ({rejectModalOrg.id}).
            </p>

            <div className="space-y-1">
              <label htmlFor="input-rejection-reason" className="block text-xs font-semibold text-slate-700">
                {t("govtNgos.rejectionReasonLabel")}
              </label>
              <textarea
                id="input-rejection-reason"
                rows={4}
                value={rejectionReason}
                onChange={(e) => {
                  setRejectionReason(e.target.value);
                  if (rejectionError) setRejectionError(null);
                }}
                placeholder={t("govtNgos.rejectionPlaceholder")}
                className="w-full rounded-xl border border-slate-300 p-3 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:border-rose-500 focus:outline-hidden"
              />
              {rejectionError && (
                <p className="text-xs text-rose-600 font-medium">{rejectionError}</p>
              )}
            </div>

            <div className="flex justify-end gap-2 border-t border-slate-100 pt-3">
              <button
                id="btn-cancel-reject"
                onClick={() => setRejectModalOrg(null)}
                className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 min-h-[44px]"
              >
                {t("govtNgos.cancel")}
              </button>
              <button
                id="btn-confirm-reject"
                onClick={handleConfirmReject}
                className="rounded-xl bg-rose-600 px-4 py-2 text-xs font-semibold text-white hover:bg-rose-700 min-h-[44px]"
              >
                {t("govtNgos.confirmRejectionBtn")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
