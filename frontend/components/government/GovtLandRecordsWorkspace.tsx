"use client";

import React, { useState, useMemo } from "react";
import {
  Trees,
  Search,
  Filter,
  Download,
  AlertCircle,
  CheckCircle2,
  Clock,
  Eye,
  MapPin,
  Calendar,
  User,
  HelpCircle,
  X,
  AlertTriangle,
  RotateCcw,
  FileText,
  FileCheck,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  Layers,
  Compass,
  Info,
} from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { useAuthStore } from "@/store/auth-store";
import BackButton from "@/components/ui/BackButton";
import {
  useLandRecordStore,
  INITIAL_DEMO_LAND_RECORDS,
} from "@/store/land-record-store";
import {
  GovernmentLandRecord,
  LandRecordStatus,
  LandholdingCategory,
  IrrigationType,
} from "@/types/land-record";

const ALL_CATEGORIES: LandholdingCategory[] = [
  "Marginal (< 1 Ha)",
  "Small (1-2 Ha)",
  "Semi-Medium (2-4 Ha)",
  "Medium (4-10 Ha)",
  "Large (> 10 Ha)",
];

const ALL_STATUSES: { id: LandRecordStatus; label: string }[] = [
  { id: "pending_review", label: "Pending Review" },
  { id: "under_review", label: "Under Review" },
  { id: "verified", label: "Verified" },
  { id: "clarification_required", label: "Clarification Required" },
  { id: "rejected", label: "Rejected" },
];

const STATUS_CONFIG: Record<
  LandRecordStatus,
  { label: string; badgeClass: string; icon: React.ReactNode }
> = {
  pending_review: {
    label: "Pending Review",
    badgeClass: "bg-slate-100 text-slate-700 border-slate-300",
    icon: <Clock size={12} className="text-slate-500" />,
  },
  under_review: {
    label: "Under Review",
    badgeClass: "bg-blue-50 text-blue-700 border-blue-200",
    icon: <Clock size={12} className="text-blue-600 animate-pulse" />,
  },
  verified: {
    label: "Verified",
    badgeClass: "bg-emerald-50 text-emerald-800 border-emerald-200 font-semibold",
    icon: <CheckCircle2 size={12} className="text-emerald-600" />,
  },
  clarification_required: {
    label: "Clarification Required",
    badgeClass: "bg-amber-50 text-amber-800 border-amber-300 font-medium",
    icon: <HelpCircle size={12} className="text-amber-600" />,
  },
  rejected: {
    label: "Rejected",
    badgeClass: "bg-rose-50 text-rose-800 border-rose-300 font-medium",
    icon: <AlertCircle size={12} className="text-rose-600" />,
  },
};

// Schematic Plot Illustrator Component
function SchematicPlotPreview({ record }: { record: GovernmentLandRecord }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-2xs space-y-3">
      <div className="flex items-center justify-between border-b border-gray-100 pb-2">
        <div className="flex items-center gap-2">
          <Compass size={16} className="text-[#24833A]" />
          <h4 className="text-xs font-bold text-gray-900">
            Cadastral Plot Schematic (Survey #{record.surveyNumber})
          </h4>
        </div>
        <span className="text-[10px] font-semibold text-gray-400 bg-gray-100 px-2 py-0.5 rounded">
          {record.areaUnit}: {record.recordedArea}
        </span>
      </div>

      {/* SVG Plot Representation */}
      <div className="relative flex items-center justify-center rounded-xl bg-[#F7FAF4] border border-[#24833A]/20 p-4">
        {/* Compass Cardinal Indicators */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 text-[9px] font-bold text-gray-400">
          N (Access Canal / Road)
        </div>
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[9px] font-bold text-gray-400">
          S (Adjacent Parcel)
        </div>
        <div className="absolute left-2 top-1/2 -translate-y-1/2 text-[9px] font-bold text-gray-400">
          W
        </div>
        <div className="absolute right-2 top-1/2 -translate-y-1/2 text-[9px] font-bold text-gray-400">
          E
        </div>

        <svg
          viewBox="0 0 280 180"
          className="w-full max-w-[280px] h-[160px] drop-shadow-2xs select-none"
        >
          {/* Outer Cadastral Grid Boundary */}
          <rect
            x="20"
            y="20"
            width="240"
            height="140"
            rx="6"
            fill="none"
            stroke="#CBD5E1"
            strokeWidth="1"
            strokeDasharray="4 4"
          />

          {/* Cultivated Plot Shape */}
          <polygon
            points={
              record.plotShape === "trapezoid"
                ? "40,40 220,35 240,145 50,150"
                : record.plotShape === "corner_plot"
                ? "40,40 230,40 230,120 160,150 40,150"
                : record.plotShape === "irregular"
                ? "50,45 210,35 240,135 180,155 45,140"
                : "40,35 235,35 235,145 40,145" // rectangular default
            }
            fill="#E8F4E1"
            stroke="#24833A"
            strokeWidth="2.5"
          />

          {/* Canal Buffer Line on North Boundary */}
          <line
            x1="30"
            y1="28"
            x2="250"
            y2="28"
            stroke="#38BDF8"
            strokeWidth="3"
            strokeDasharray="6 2"
          />

          {/* Internal Subdivision Marker */}
          <line
            x1="130"
            y1="40"
            x2="135"
            y2="145"
            stroke="#24833A"
            strokeWidth="1.2"
            strokeDasharray="3 3"
          />

          {/* Plot Centroid Label */}
          <text
            x="140"
            y="85"
            textAnchor="middle"
            fill="#174D25"
            fontSize="11"
            fontWeight="bold"
          >
            Sy #{record.surveyNumber}
          </text>
          <text
            x="140"
            y="102"
            textAnchor="middle"
            fill="#52795D"
            fontSize="9"
          >
            {record.recordedArea} {record.areaUnit} • {record.primaryCrop}
          </text>
          <text
            x="140"
            y="118"
            textAnchor="middle"
            fill="#64748B"
            fontSize="8"
          >
            {record.subDivision || "Main Parcel"}
          </text>
        </svg>
      </div>

      {/* Mandatory Disclaimer */}
      <p className="text-[11px] text-gray-500 text-center italic bg-gray-50 py-1.5 px-2 rounded-lg border border-gray-100">
        Illustrative plot preview — not an official cadastral map.
      </p>
    </div>
  );
}

export default function GovtLandRecordsWorkspace() {
  const { t } = useTranslation();
  const user = useAuthStore((state) => state.user);

  const records = useLandRecordStore((state) => state.records);
  const markUnderReview = useLandRecordStore((state) => state.markUnderReview);
  const verifyRecord = useLandRecordStore((state) => state.verifyRecord);
  const requestClarification = useLandRecordStore(
    (state) => state.requestClarification
  );
  const rejectRecord = useLandRecordStore((state) => state.rejectRecord);

  // View state
  const [selectedRecordId, setSelectedRecordId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [districtFilter, setDistrictFilter] = useState<string>("all");
  const [mandalFilter, setMandalFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [irrigationFilter, setIrrigationFilter] = useState<string>("all");
  const [cropFilter, setCropFilter] = useState<string>("all");

  // Modals state
  const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false);
  const [isClarificationModalOpen, setIsClarificationModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);

  // Modal inputs
  const [verificationNote, setVerificationNote] = useState("");
  const [clarificationReasonText, setClarificationReasonText] = useState("");
  const [clarificationError, setClarificationError] = useState("");
  const [rejectionReasonText, setRejectionReasonText] = useState("");
  const [rejectionError, setRejectionError] = useState("");

  // Selected Record Object
  const activeRecord = useMemo(() => {
    return records.find((r) => r.id === selectedRecordId) || null;
  }, [records, selectedRecordId]);

  // Available Districts
  const availableDistricts = useMemo(() => {
    const set = new Set<string>();
    records.forEach((r) => {
      if (r.district) set.add(r.district);
    });
    return Array.from(set);
  }, [records]);

  // Cascading Mandals based on selected District
  const availableMandals = useMemo(() => {
    const set = new Set<string>();
    records.forEach((r) => {
      if (districtFilter === "all" || r.district === districtFilter) {
        if (r.mandal) set.add(r.mandal);
      }
    });
    return Array.from(set);
  }, [records, districtFilter]);

  // Available Crops
  const availableCrops = useMemo(() => {
    const set = new Set<string>();
    records.forEach((r) => {
      if (r.primaryCrop) set.add(r.primaryCrop);
    });
    return Array.from(set);
  }, [records]);

  // Available Irrigation Types
  const availableIrrigationTypes = useMemo(() => {
    const set = new Set<string>();
    records.forEach((r) => {
      if (r.irrigationType) set.add(r.irrigationType);
    });
    return Array.from(set);
  }, [records]);

  // Filtered Records
  const filteredRecords = useMemo(() => {
    return records.filter((r) => {
      if (districtFilter !== "all" && r.district !== districtFilter) return false;
      if (mandalFilter !== "all" && r.mandal !== mandalFilter) return false;
      if (statusFilter !== "all" && r.status !== statusFilter) return false;
      if (categoryFilter !== "all" && r.landholdingCategory !== categoryFilter)
        return false;
      if (irrigationFilter !== "all" && r.irrigationType !== irrigationFilter)
        return false;
      if (cropFilter !== "all" && r.primaryCrop !== cropFilter) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesId = r.id.toLowerCase().includes(q);
        const matchesFarmer = r.farmerRef.toLowerCase().includes(q);
        const matchesReg = r.farmerRegistrationId.toLowerCase().includes(q);
        const matchesDistrict = r.district.toLowerCase().includes(q);
        const matchesMandal = r.mandal.toLowerCase().includes(q);
        const matchesVillage = r.village.toLowerCase().includes(q);
        const matchesSurvey = r.surveyNumber.toLowerCase().includes(q);
        if (
          !matchesId &&
          !matchesFarmer &&
          !matchesReg &&
          !matchesDistrict &&
          !matchesMandal &&
          !matchesVillage &&
          !matchesSurvey
        ) {
          return false;
        }
      }

      return true;
    });
  }, [
    records,
    districtFilter,
    mandalFilter,
    statusFilter,
    categoryFilter,
    irrigationFilter,
    cropFilter,
    searchQuery,
  ]);

  // Demo Metrics
  const metrics = useMemo(() => {
    const totalRecords = records.length;
    const recordsVerified = records.filter((r) => r.status === "verified").length;
    const pendingReview = records.filter(
      (r) => r.status === "pending_review" || r.status === "under_review"
    ).length;
    const clarificationRequired = records.filter(
      (r) => r.status === "clarification_required"
    ).length;
    const totalArea = records.reduce((acc, curr) => acc + curr.recordedArea, 0);

    return {
      totalRecords,
      recordsVerified,
      pendingReview,
      clarificationRequired,
      totalAreaFormatted: `${totalArea.toFixed(1)} Acres`,
    };
  }, [records]);

  // Clear all filters
  const handleClearFilters = () => {
    setSearchQuery("");
    setDistrictFilter("all");
    setMandalFilter("all");
    setStatusFilter("all");
    setCategoryFilter("all");
    setIrrigationFilter("all");
    setCropFilter("all");
  };

  // Helper for CSV escaping
  const escapeCsv = (val: string | number | undefined | null): string => {
    if (val === null || val === undefined) return '""';
    const str = String(val).replace(/"/g, '""');
    return `"${str}"`;
  };

  // Client-Side CSV Export
  const handleExportCsv = () => {
    const headers = [
      "Land Record Reference",
      "Farmer Reference",
      "Registration ID",
      "District",
      "Mandal",
      "Village",
      "Survey Number",
      "Sub-Division",
      "Recorded Area (Acres)",
      "Landholding Category",
      "Primary Crop",
      "Irrigation Type",
      "Cultivation Type",
      "Verification Status",
      "Record Source",
      "Date",
    ];

    const rows = filteredRecords.map((r) => [
      escapeCsv(r.id),
      escapeCsv(r.farmerRef),
      escapeCsv(r.farmerRegistrationId),
      escapeCsv(r.district),
      escapeCsv(r.mandal),
      escapeCsv(r.village),
      escapeCsv(r.surveyNumber),
      escapeCsv(r.subDivision || "-"),
      escapeCsv(r.recordedArea),
      escapeCsv(r.landholdingCategory),
      escapeCsv(r.primaryCrop),
      escapeCsv(r.irrigationType),
      escapeCsv(r.cultivationType),
      escapeCsv(r.status),
      escapeCsv(r.recordSource),
      escapeCsv(r.recordDate),
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `land_records_${new Date().toISOString().split("T")[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Handle Verify Confirmation
  const handleConfirmVerify = () => {
    if (!activeRecord) return;
    verifyRecord(
      activeRecord.id,
      verificationNote.trim() || undefined,
      user?.name ? `${user.name} (Reviewer)` : "District Land Verification Cell"
    );
    setIsVerifyModalOpen(false);
    setVerificationNote("");
  };

  // Handle Clarification Confirmation
  const handleConfirmClarification = () => {
    if (!activeRecord) return;
    if (!clarificationReasonText.trim()) {
      setClarificationError("Please provide a reason for clarification.");
      return;
    }
    requestClarification(
      activeRecord.id,
      clarificationReasonText.trim(),
      user?.name ? `${user.name} (Reviewer)` : "District Land Verification Cell"
    );
    setIsClarificationModalOpen(false);
    setClarificationReasonText("");
    setClarificationError("");
  };

  // Handle Rejection Confirmation
  const handleConfirmRejection = () => {
    if (!activeRecord) return;
    if (!rejectionReasonText.trim()) {
      setRejectionError("Please provide a valid reason for rejecting this record.");
      return;
    }
    rejectRecord(
      activeRecord.id,
      rejectionReasonText.trim(),
      user?.name ? `${user.name} (Reviewer)` : "District Land Verification Cell"
    );
    setIsRejectModalOpen(false);
    setRejectionReasonText("");
    setRejectionError("");
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Detail View vs List View */}
      {activeRecord ? (
        /* ================= LAND RECORD DETAIL VIEW ================= */
        <div className="flex flex-col gap-6">
          {/* Top Bar with Contextual Back Button */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <BackButton
              id="btn-back-to-land-records"
              onClick={() => setSelectedRecordId(null)}
              label={
                t("govtLandRecords.backToLandRecords") || "Back to Land Records"
              }
            />
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">
                Last updated: {activeRecord.lastUpdated}
              </span>
            </div>
          </div>

          {/* Record Header Banner */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-xs">
            <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-lg bg-gray-100 px-2.5 py-1 text-xs font-mono font-bold text-gray-800">
                    {activeRecord.id}
                  </span>
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${
                      STATUS_CONFIG[activeRecord.status].badgeClass
                    }`}
                  >
                    {STATUS_CONFIG[activeRecord.status].icon}
                    <span>{STATUS_CONFIG[activeRecord.status].label}</span>
                  </span>
                  <span className="rounded-full bg-[#E4F0DD] px-2.5 py-0.5 text-xs font-bold text-[#174D25]">
                    {activeRecord.landholdingCategory}
                  </span>
                  <span className="rounded-lg bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
                    Source: {activeRecord.recordSource}
                  </span>
                </div>

                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                  Survey #{activeRecord.surveyNumber} • {activeRecord.village}
                </h1>
                <p className="text-sm text-gray-600">
                  Farmer: <strong className="text-gray-900">{activeRecord.farmerRef}</strong>{" "}
                  (Reg ID: {activeRecord.farmerRegistrationId})
                </p>
              </div>

              {/* Area Pill */}
              <div className="shrink-0 rounded-xl border border-[#24833A]/20 bg-[#F4FBF5] p-3 text-center sm:min-w-[160px]">
                <span className="text-[11px] font-bold text-[#174D25] block uppercase">
                  Recorded Area
                </span>
                <span className="text-xl font-black text-[#24833A]">
                  {activeRecord.recordedArea} {activeRecord.areaUnit}
                </span>
              </div>
            </div>

            {/* Meta Grid */}
            <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 border-t border-gray-100 pt-4 text-xs text-gray-600">
              <div className="flex items-center gap-2">
                <MapPin size={16} className="text-gray-400 shrink-0" />
                <span>
                  <strong className="text-gray-900">Location:</strong>{" "}
                  {activeRecord.village}, {activeRecord.mandal},{" "}
                  {activeRecord.district}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Layers size={16} className="text-gray-400 shrink-0" />
                <span>
                  <strong className="text-gray-900">Primary Crop:</strong>{" "}
                  {activeRecord.primaryCrop}
                  {activeRecord.secondaryCrop
                    ? ` / ${activeRecord.secondaryCrop}`
                    : ""}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={16} className="text-gray-400 shrink-0" />
                <span>
                  <strong className="text-gray-900">Record Date:</strong>{" "}
                  {activeRecord.recordDate}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <FileCheck size={16} className="text-gray-400 shrink-0" />
                <span>
                  <strong className="text-gray-900">Cultivation:</strong>{" "}
                  {activeRecord.cultivationType}
                </span>
              </div>
            </div>

            {/* Verification Actions Bar */}
            <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-gray-100 pt-4">
              {activeRecord.status === "pending_review" && (
                <button
                  id="btn-mark-under-review"
                  type="button"
                  onClick={() =>
                    markUnderReview(
                      activeRecord.id,
                      undefined,
                      user?.name ? `${user.name} (Officer)` : "Reviewing Officer"
                    )
                  }
                  className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-3.5 py-2 text-xs font-semibold text-white hover:bg-blue-700 active:scale-95 transition"
                >
                  <Eye size={14} />
                  <span>
                    {t("govtLandRecords.markUnderReview") || "Mark Under Review"}
                  </span>
                </button>
              )}

              {activeRecord.status !== "verified" && (
                <button
                  id="btn-open-verify-modal"
                  type="button"
                  onClick={() => setIsVerifyModalOpen(true)}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-[#24833A] px-3.5 py-2 text-xs font-semibold text-white hover:bg-[#1b6b2e] active:scale-95 transition"
                >
                  <CheckCircle2 size={14} />
                  <span>
                    {t("govtLandRecords.verifyRecord") || "Verify Record"}
                  </span>
                </button>
              )}

              {activeRecord.status !== "verified" && (
                <button
                  id="btn-open-clarification-modal"
                  type="button"
                  onClick={() => setIsClarificationModalOpen(true)}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-amber-300 bg-amber-50 px-3.5 py-2 text-xs font-semibold text-amber-900 hover:bg-amber-100 active:scale-95 transition"
                >
                  <HelpCircle size={14} />
                  <span>
                    {t("govtLandRecords.requestClarification") ||
                      "Request Clarification"}
                  </span>
                </button>
              )}

              {activeRecord.status !== "rejected" && activeRecord.status !== "verified" && (
                <button
                  id="btn-open-reject-modal"
                  type="button"
                  onClick={() => setIsRejectModalOpen(true)}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-rose-300 bg-rose-50 px-3.5 py-2 text-xs font-semibold text-rose-900 hover:bg-rose-100 active:scale-95 transition"
                >
                  <AlertCircle size={14} />
                  <span>
                    {t("govtLandRecords.rejectRecord") || "Reject Record"}
                  </span>
                </button>
              )}

              {activeRecord.status === "verified" && (
                <div className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-800">
                  <ShieldCheck size={16} className="text-emerald-600" />
                  <span>
                    Officially confirmed and verified by revenue administration.
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Clarification Alert Box */}
          {activeRecord.clarificationReason && (
            <div className="rounded-2xl border border-amber-200 bg-amber-50/80 p-4 shadow-2xs">
              <div className="flex items-start gap-3">
                <HelpCircle size={20} className="text-amber-700 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-amber-900">
                    Clarification Required on Record
                  </h4>
                  <p className="text-xs text-amber-800">
                    {activeRecord.clarificationReason}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Rejection Alert Box */}
          {activeRecord.rejectionReason && (
            <div className="rounded-2xl border border-rose-200 bg-rose-50/80 p-4 shadow-2xs">
              <div className="flex items-start gap-3">
                <AlertCircle size={20} className="text-rose-700 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-rose-900">
                    Record Rejected by Revenue Auditor
                  </h4>
                  <p className="text-xs text-rose-800">
                    {activeRecord.rejectionReason}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Verification Notes Box */}
          {activeRecord.verificationNotes && (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50/80 p-4 shadow-2xs">
              <div className="flex items-start gap-3">
                <CheckCircle2
                  size={20}
                  className="text-emerald-700 shrink-0 mt-0.5"
                />
                <div className="space-y-1">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-900">
                    Official Verification Notes
                  </h4>
                  <p className="text-xs text-emerald-800">
                    {activeRecord.verificationNotes}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Main Grid: Schematic Plot + Documents (Left), Timeline (Right) */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left 2 Cols: Schematic Plot & Document References */}
            <div className="lg:col-span-2 space-y-4">
              {/* Illustrative Schematic Plot */}
              <SchematicPlotPreview record={activeRecord} />

              {/* Document Proofs Reference Box */}
              <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-2xs space-y-3">
                <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                  <FileText size={18} className="text-[#24833A]" />
                  <span>
                    {t("govtLandRecords.documentReferencesTitle") ||
                      "Supporting Document Proofs"}
                  </span>
                </h3>

                <div className="divide-y divide-gray-100">
                  {activeRecord.documents.map((doc, idx) => (
                    <div
                      key={idx}
                      className="py-3 flex items-center justify-between text-xs"
                    >
                      <div>
                        <span className="font-bold text-gray-900 block">
                          {doc.name}
                        </span>
                        <span className="font-mono text-[11px] text-gray-500">
                          Ref: {doc.refId} ({doc.type})
                        </span>
                      </div>
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${
                          doc.verified
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {doc.verified
                          ? t("govtLandRecords.verifiedDoc") || "Verified"
                          : t("govtLandRecords.unverifiedDoc") || "Pending Check"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right 1 Col: Activity Timeline */}
            <div className="space-y-4">
              <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <Clock size={18} className="text-gray-500" />
                <span>
                  {t("govtLandRecords.activityTimeline") || "Activity History"}
                </span>
              </h3>

              <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-2xs space-y-4">
                {activeRecord.timeline.length === 0 ? (
                  <p className="text-xs text-gray-500">No events logged.</p>
                ) : (
                  <div className="relative pl-5 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-200 space-y-4">
                    {activeRecord.timeline.map((event, idx) => (
                      <div key={idx} className="relative text-xs">
                        <span className="absolute -left-5 top-1 h-2.5 w-2.5 rounded-full border-2 border-white bg-[#24833A]" />
                        <div className="font-bold text-gray-900">{event.title}</div>
                        <div className="text-[11px] text-gray-400 flex items-center gap-1 mt-0.5">
                          <span>{event.date}</span>
                          <span>•</span>
                          <span>{event.actor}</span>
                        </div>
                        {event.note && (
                          <p className="mt-1 text-gray-600 bg-gray-50 p-2 rounded-lg border border-gray-100">
                            {event.note}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* ================= LAND RECORDS LIST VIEW ================= */
        <>
          {/* Header & Main Back Button */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <BackButton
                id="btn-back-to-dashboard"
                href="/dashboard"
                label={
                  t("govtLandRecords.backToDashboard") || "Back to Dashboard"
                }
              />
              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                {t("govtLandRecords.title") || "Land Records"}
              </h1>
              <p className="text-xs sm:text-sm text-gray-600">
                {t("govtLandRecords.subtitle") ||
                  "Review farmer landholding references and associated cultivation records."}
              </p>
            </div>

            {/* Actions: Export CSV */}
            <div className="flex items-center gap-2">
              <button
                id="btn-export-land-records-csv"
                type="button"
                onClick={handleExportCsv}
                className="inline-flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-3.5 py-2 text-xs font-semibold text-gray-700 shadow-2xs hover:bg-gray-50 active:scale-95 transition"
              >
                <Download size={15} />
                <span>{t("govtLandRecords.exportCsv") || "Export CSV"}</span>
              </button>
            </div>
          </div>

          {/* Demo Disclaimer Banner */}
          <div className="rounded-xl border border-blue-200 bg-blue-50/70 p-3 text-xs text-blue-900 flex items-center gap-2">
            <Info size={16} className="text-blue-700 shrink-0" />
            <span>
              {t("govtLandRecords.demoDisclaimer") ||
                "Demonstration records — not an official state cadastral registry."}
            </span>
          </div>

          {/* Dynamic Summary Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            <div className="rounded-2xl border border-gray-200 bg-white p-3.5 shadow-2xs">
              <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500">
                {t("govtLandRecords.totalRecords") || "Total Records"}
              </span>
              <p className="mt-1 text-2xl font-black text-gray-900">
                {metrics.totalRecords}
              </p>
            </div>
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-3.5 shadow-2xs">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">
                {t("govtLandRecords.recordsVerified") || "Verified"}
              </span>
              <p className="mt-1 text-2xl font-black text-emerald-800">
                {metrics.recordsVerified}
              </p>
            </div>
            <div className="rounded-2xl border border-blue-200 bg-blue-50/60 p-3.5 shadow-2xs">
              <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700">
                {t("govtLandRecords.pendingReview") || "Pending Review"}
              </span>
              <p className="mt-1 text-2xl font-black text-blue-800">
                {metrics.pendingReview}
              </p>
            </div>
            <div className="rounded-2xl border border-amber-200 bg-amber-50/60 p-3.5 shadow-2xs">
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700">
                {t("govtLandRecords.clarificationRequired") || "Clarification"}
              </span>
              <p className="mt-1 text-2xl font-black text-amber-800">
                {metrics.clarificationRequired}
              </p>
            </div>
            <div className="rounded-2xl border border-[#24833A]/20 bg-[#F4FBF5] p-3.5 shadow-2xs col-span-2 sm:col-span-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#174D25]">
                {t("govtLandRecords.totalRecordedArea") || "Total Area"}
              </span>
              <p className="mt-1 text-2xl font-black text-[#24833A]">
                {metrics.totalAreaFormatted}
              </p>
            </div>
          </div>

          {/* Search & Cascading Multi-Filters Toolbar */}
          <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-2xs space-y-3">
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Search Bar */}
              <div className="relative flex-1">
                <Search
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  id="input-land-record-search"
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={
                    t("govtLandRecords.searchPlaceholder") ||
                    "Search record reference, farmer name, survey number, village..."
                  }
                  className="w-full rounded-xl border border-gray-200 bg-gray-50/60 py-2 pl-9 pr-4 text-xs text-gray-900 placeholder:text-gray-400 focus:border-[#24833A] focus:bg-white focus:outline-hidden"
                />
              </div>

              {/* District Filter Dropdown */}
              <div className="sm:w-44 shrink-0">
                <select
                  id="select-land-district"
                  value={districtFilter}
                  onChange={(e) => {
                    setDistrictFilter(e.target.value);
                    setMandalFilter("all"); // reset mandal on district change
                  }}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50/60 py-2 px-3 text-xs text-gray-800 focus:border-[#24833A] focus:bg-white focus:outline-hidden"
                >
                  <option value="all">
                    {t("govtLandRecords.allDistricts") || "All Districts"}
                  </option>
                  {availableDistricts.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              {/* Cascading Mandal Filter Dropdown */}
              <div className="sm:w-44 shrink-0">
                <select
                  id="select-land-mandal"
                  value={mandalFilter}
                  onChange={(e) => setMandalFilter(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50/60 py-2 px-3 text-xs text-gray-800 focus:border-[#24833A] focus:bg-white focus:outline-hidden"
                >
                  <option value="all">
                    {t("govtLandRecords.allMandals") || "All Mandals"}
                  </option>
                  {availableMandals.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Secondary Filter Row: Category, Irrigation, Crop, Status */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 border-t border-gray-100">
              {/* Category */}
              <div>
                <select
                  id="select-land-category"
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50/60 py-1.5 px-2.5 text-xs text-gray-800 focus:border-[#24833A] focus:outline-hidden"
                >
                  <option value="all">
                    {t("govtLandRecords.allCategories") || "All Categories"}
                  </option>
                  {ALL_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Status */}
              <div>
                <select
                  id="select-land-status"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50/60 py-1.5 px-2.5 text-xs text-gray-800 focus:border-[#24833A] focus:outline-hidden"
                >
                  <option value="all">
                    {t("govtLandRecords.allStatuses") || "All Statuses"}
                  </option>
                  {ALL_STATUSES.map((st) => (
                    <option key={st.id} value={st.id}>
                      {st.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Irrigation */}
              <div>
                <select
                  id="select-land-irrigation"
                  value={irrigationFilter}
                  onChange={(e) => setIrrigationFilter(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50/60 py-1.5 px-2.5 text-xs text-gray-800 focus:border-[#24833A] focus:outline-hidden"
                >
                  <option value="all">
                    {t("govtLandRecords.allIrrigationTypes") || "All Irrigation"}
                  </option>
                  {availableIrrigationTypes.map((irr) => (
                    <option key={irr} value={irr}>
                      {irr}
                    </option>
                  ))}
                </select>
              </div>

              {/* Crop */}
              <div>
                <select
                  id="select-land-crop"
                  value={cropFilter}
                  onChange={(e) => setCropFilter(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50/60 py-1.5 px-2.5 text-xs text-gray-800 focus:border-[#24833A] focus:outline-hidden"
                >
                  <option value="all">
                    {t("govtLandRecords.allCrops") || "All Crops"}
                  </option>
                  {availableCrops.map((cr) => (
                    <option key={cr} value={cr}>
                      {cr}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Clear Filters Reset */}
            {(searchQuery ||
              districtFilter !== "all" ||
              mandalFilter !== "all" ||
              statusFilter !== "all" ||
              categoryFilter !== "all" ||
              irrigationFilter !== "all" ||
              cropFilter !== "all") && (
              <div className="text-right pt-1">
                <button
                  id="btn-clear-land-filters"
                  type="button"
                  onClick={handleClearFilters}
                  className="text-xs font-semibold text-[#24833A] hover:underline cursor-pointer"
                >
                  {t("govtLandRecords.clearFilters") || "Clear Filters"}
                </button>
              </div>
            )}
          </div>

          {/* Record List: Desktop Table / Mobile Stacked Cards */}
          {filteredRecords.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-12 text-center">
              <Trees size={40} className="mx-auto text-gray-300 mb-2" />
              <p className="text-sm font-semibold text-gray-700">
                {t("govtLandRecords.noRecordsFound") ||
                  "No land records found matching the selected filters."}
              </p>
              <button
                type="button"
                onClick={handleClearFilters}
                className="mt-3 text-xs font-semibold text-[#24833A] hover:underline"
              >
                Reset filters
              </button>
            </div>
          ) : (
            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xs">
              {/* Desktop Table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left text-xs text-gray-600 border-collapse">
                  <thead className="border-b border-gray-200 bg-gray-50/75 text-[11px] font-bold uppercase tracking-wider text-gray-500">
                    <tr>
                      <th className="py-3.5 px-4">Record Reference</th>
                      <th className="py-3.5 px-4">Farmer Reference</th>
                      <th className="py-3.5 px-4">District</th>
                      <th className="py-3.5 px-4">Mandal / Village</th>
                      <th className="py-3.5 px-4">Survey Number</th>
                      <th className="py-3.5 px-4">Recorded Area</th>
                      <th className="py-3.5 px-4">Category</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredRecords.map((record) => (
                      <tr
                        key={record.id}
                        id={`land-row-${record.id}`}
                        onClick={() => setSelectedRecordId(record.id)}
                        className="hover:bg-gray-50/60 transition group cursor-pointer"
                      >
                        <td className="py-3 px-4 font-mono font-bold text-gray-900">
                          {record.id}
                        </td>
                        <td className="py-3 px-4 text-gray-800">
                          {record.farmerRef}
                          <span className="block font-mono text-[10px] text-gray-400">
                            {record.farmerRegistrationId}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-gray-800">
                          {record.district}
                        </td>
                        <td className="py-3 px-4 text-gray-700">
                          {record.mandal}, {record.village}
                        </td>
                        <td className="py-3 px-4 font-mono font-semibold text-gray-900">
                          {record.surveyNumber}
                        </td>
                        <td className="py-3 px-4 font-semibold text-[#174D25]">
                          {record.recordedArea} {record.areaUnit}
                        </td>
                        <td className="py-3 px-4 text-gray-600">
                          <span className="rounded-md bg-gray-100 px-2 py-0.5 text-[10px] font-medium">
                            {record.landholdingCategory}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${
                              STATUS_CONFIG[record.status].badgeClass
                            }`}
                          >
                            {STATUS_CONFIG[record.status].icon}
                            <span>{STATUS_CONFIG[record.status].label}</span>
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            id={`btn-review-land-${record.id}`}
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedRecordId(record.id);
                            }}
                            className="inline-flex items-center gap-1 rounded-lg bg-[#24833A] px-2.5 py-1 text-xs font-semibold text-white hover:bg-[#1b6b2e] transition"
                          >
                            <span>{t("govtLandRecords.review") || "Review"}</span>
                            <ArrowRight size={12} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Stacked Cards */}
              <div className="md:hidden divide-y divide-gray-100">
                {filteredRecords.map((record) => (
                  <div
                    key={record.id}
                    id={`land-card-mobile-${record.id}`}
                    onClick={() => setSelectedRecordId(record.id)}
                    className="p-4 space-y-2.5 cursor-pointer hover:bg-gray-50/60 transition"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-xs text-gray-900 bg-gray-100 px-2 py-0.5 rounded">
                        {record.id}
                      </span>
                      <span
                        className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold ${
                          STATUS_CONFIG[record.status].badgeClass
                        }`}
                      >
                        {STATUS_CONFIG[record.status].label}
                      </span>
                    </div>

                    <div>
                      <h4 className="text-xs font-bold text-gray-900">
                        Survey #{record.surveyNumber} • {record.recordedArea}{" "}
                        {record.areaUnit}
                      </h4>
                      <p className="mt-0.5 text-[11px] text-gray-500">
                        {record.farmerRef} • {record.village}, {record.district}
                      </p>
                      <p className="text-[11px] text-[#174D25] font-medium">
                        Crop: {record.primaryCrop} ({record.irrigationType})
                      </p>
                    </div>

                    <div className="flex items-center justify-between text-[11px] pt-1 border-t border-gray-50 text-gray-500">
                      <span>Source: {record.recordSource}</span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedRecordId(record.id);
                        }}
                        className="font-bold text-[#24833A] flex items-center gap-1 min-h-[44px] min-w-[44px] justify-end"
                      >
                        Review <ArrowRight size={12} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* ================= MODAL: VERIFY RECORD ================= */}
      {isVerifyModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4"
        >
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl space-y-4">
            <div className="flex items-center gap-3 text-emerald-700">
              <div className="rounded-full bg-emerald-100 p-2">
                <CheckCircle2 size={22} />
              </div>
              <h3 className="text-base font-bold text-gray-900">
                {t("govtLandRecords.confirmVerificationTitle") ||
                  "Confirm Land Record Verification"}
              </h3>
            </div>
            <p className="text-xs text-gray-600 leading-relaxed">
              {t("govtLandRecords.confirmVerificationText") ||
                "Confirm that all survey numbers, areas, and document proofs have been cross-checked with available revenue records."}
            </p>
            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">
                {t("govtLandRecords.verificationNotesLabel") ||
                  "Verification Notes (Optional)"}
              </label>
              <textarea
                id="textarea-verify-notes"
                rows={2}
                value={verificationNote}
                onChange={(e) => setVerificationNote(e.target.value)}
                placeholder="e.g. FMB cadastral boundaries confirmed; title aligned with Webland 1B records."
                className="w-full rounded-xl border border-gray-200 p-2.5 text-xs text-gray-900 focus:border-[#24833A] focus:outline-hidden"
              />
            </div>
            <div className="flex items-center justify-end gap-2 border-t border-gray-100 pt-3">
              <button
                type="button"
                onClick={() => setIsVerifyModalOpen(false)}
                className="rounded-xl border border-gray-200 px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 min-h-[44px] transition"
              >
                {t("govtLandRecords.cancel") || "Cancel"}
              </button>
              <button
                id="btn-confirm-verify-land"
                type="button"
                onClick={handleConfirmVerify}
                className="rounded-xl bg-[#24833A] px-4 py-2 text-xs font-semibold text-white hover:bg-[#1b6b2e] min-h-[44px] transition"
              >
                {t("govtLandRecords.confirmVerifyBtn") || "Confirm & Verify"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: REQUEST CLARIFICATION ================= */}
      {isClarificationModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4"
        >
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <HelpCircle size={18} className="text-amber-600" />
                <span>
                  {t("govtLandRecords.clarificationModalTitle") ||
                    "Request Land Record Clarification"}
                </span>
              </h3>
              <button
                type="button"
                onClick={() => setIsClarificationModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-gray-700 block mb-1">
                  {t("govtLandRecords.clarificationReasonLabel") ||
                    "Clarification Reason *"}
                </label>
                <textarea
                  id="textarea-clarification-reason"
                  rows={3}
                  value={clarificationReasonText}
                  onChange={(e) => {
                    setClarificationReasonText(e.target.value);
                    if (e.target.value.trim()) setClarificationError("");
                  }}
                  placeholder={
                    t("govtLandRecords.clarificationPlaceholder") ||
                    "Specify the discrepancy, missing sub-division sketch, or document required..."
                  }
                  className="w-full rounded-xl border border-gray-200 p-2.5 text-xs text-gray-900 focus:border-amber-600 focus:outline-hidden"
                />
                {clarificationError && (
                  <p className="text-[11px] text-red-600 mt-1">
                    {clarificationError}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 border-t border-gray-100 pt-3">
              <button
                type="button"
                onClick={() => {
                  setIsClarificationModalOpen(false);
                  setClarificationReasonText("");
                  setClarificationError("");
                }}
                className="rounded-xl border border-gray-200 px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 min-h-[44px] transition"
              >
                {t("govtLandRecords.cancel") || "Cancel"}
              </button>
              <button
                id="btn-submit-clarification-land"
                type="button"
                onClick={handleConfirmClarification}
                className="rounded-xl bg-amber-600 px-4 py-2 text-xs font-semibold text-white hover:bg-amber-700 min-h-[44px] transition"
              >
                {t("govtLandRecords.submitClarificationBtn") ||
                  "Submit Clarification"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: REJECT RECORD ================= */}
      {isRejectModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4"
        >
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl space-y-4">
            <div className="flex items-center gap-3 text-rose-700">
              <div className="rounded-full bg-rose-100 p-2">
                <AlertCircle size={22} />
              </div>
              <h3 className="text-base font-bold text-gray-900">
                {t("govtLandRecords.rejectionModalTitle") ||
                  "Reject Land Record"}
              </h3>
            </div>
            <p className="text-xs text-gray-600 leading-relaxed">
              State the grounds for rejection (e.g. government watercourse reservation, boundary conflict).
            </p>
            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">
                {t("govtLandRecords.rejectionReasonLabel") ||
                  "Rejection Reason *"}
              </label>
              <textarea
                id="textarea-rejection-reason"
                rows={3}
                value={rejectionReasonText}
                onChange={(e) => {
                  setRejectionReasonText(e.target.value);
                  if (e.target.value.trim()) setRejectionError("");
                }}
                placeholder={
                  t("govtLandRecords.rejectionPlaceholder") ||
                  "State the grounds for rejection..."
                }
                className="w-full rounded-xl border border-gray-200 p-2.5 text-xs text-gray-900 focus:border-rose-600 focus:outline-hidden"
              />
              {rejectionError && (
                <p className="text-[11px] text-red-600 mt-1">
                  {rejectionError}
                </p>
              )}
            </div>
            <div className="flex items-center justify-end gap-2 border-t border-gray-100 pt-3">
              <button
                type="button"
                onClick={() => {
                  setIsRejectModalOpen(false);
                  setRejectionReasonText("");
                  setRejectionError("");
                }}
                className="rounded-xl border border-gray-200 px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 min-h-[44px] transition"
              >
                {t("govtLandRecords.cancel") || "Cancel"}
              </button>
              <button
                id="btn-confirm-rejection-land"
                type="button"
                onClick={handleConfirmRejection}
                className="rounded-xl bg-rose-700 px-4 py-2 text-xs font-semibold text-white hover:bg-rose-800 min-h-[44px] transition"
              >
                {t("govtLandRecords.confirmRejectionBtn") ||
                  "Confirm Rejection"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
