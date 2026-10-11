"use client";

import React, { useState, useMemo } from "react";
import {
  ClipboardList,
  Search,
  Plus,
  Download,
  Filter,
  Calendar,
  MapPin,
  User,
  AlertCircle,
  CheckCircle2,
  Clock,
  Send,
  Eye,
  CheckCheck,
  RotateCcw,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  Sprout,
  Droplets,
  Bug,
  HelpCircle,
  X,
} from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { useAuthStore } from "@/store/auth-store";
import BackButton from "@/components/ui/BackButton";
import {
  useSurveyStore,
  INITIAL_DEMO_SURVEYS,
} from "@/store/survey-store";
import {
  SurveyItem,
  FieldEntry,
  SurveyStatus,
  SurveyType,
  SurveyPriority,
} from "@/types/survey";

const SURVEY_TYPES: SurveyType[] = [
  "Crop Health Assessment",
  "Soil and Irrigation Assessment",
  "Pest and Disease Inspection",
  "Scheme Beneficiary Field Visit",
  "General Agricultural Survey",
];

const SURVEY_PRIORITIES: SurveyPriority[] = ["Normal", "High", "Urgent"];

const CONDITION_COLORS: Record<FieldEntry["observedCondition"], string> = {
  Good: "bg-emerald-50 text-emerald-800 border-emerald-200",
  Moderate: "bg-amber-50 text-amber-800 border-amber-200",
  Stressed: "bg-orange-50 text-orange-800 border-orange-200",
  Damaged: "bg-red-50 text-red-800 border-red-200",
};

const STATUS_CONFIG: Record<
  SurveyStatus,
  { label: string; badgeClass: string; icon: React.ReactNode }
> = {
  draft: {
    label: "Draft",
    badgeClass: "bg-slate-100 text-slate-700 border-slate-300",
    icon: <Clock size={12} className="text-slate-500" />,
  },
  in_progress: {
    label: "In Progress",
    badgeClass: "bg-blue-50 text-blue-700 border-blue-200",
    icon: <Clock size={12} className="text-blue-600 animate-pulse" />,
  },
  submitted: {
    label: "Submitted",
    badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-200",
    icon: <Send size={12} className="text-emerald-600" />,
  },
  needs_review: {
    label: "Needs Review",
    badgeClass: "bg-purple-50 text-purple-700 border-purple-200",
    icon: <AlertCircle size={12} className="text-purple-600" />,
  },
  reviewed: {
    label: "Reviewed",
    badgeClass: "bg-teal-50 text-teal-700 border-teal-200",
    icon: <CheckCheck size={12} className="text-teal-600" />,
  },
};

const PRIORITY_BADGES: Record<SurveyPriority, string> = {
  Normal: "bg-slate-100 text-slate-700 border-slate-200",
  High: "bg-amber-100 text-amber-800 border-amber-300",
  Urgent: "bg-red-100 text-red-800 border-red-300 font-bold",
};

export default function GovtSurveysWorkspace() {
  const { t } = useTranslation();
  const user = useAuthStore((state) => state.user);

  const surveys = useSurveyStore((state) => state.surveys);
  const addSurvey = useSurveyStore((state) => state.addSurvey);
  const addFieldEntry = useSurveyStore((state) => state.addFieldEntry);
  const transitionStatus = useSurveyStore((state) => state.transitionStatus);
  const requestCorrection = useSurveyStore((state) => state.requestCorrection);
  const markReviewed = useSurveyStore((state) => state.markReviewed);

  // View state
  const [selectedSurveyId, setSelectedSurveyId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [districtFilter, setDistrictFilter] = useState<string>("all");

  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isRecordEntryModalOpen, setIsRecordEntryModalOpen] = useState(false);
  const [isSubmitConfirmOpen, setIsSubmitConfirmOpen] = useState(false);
  const [isCorrectionModalOpen, setIsCorrectionModalOpen] = useState(false);
  const [isMarkReviewedModalOpen, setIsMarkReviewedModalOpen] = useState(false);

  // Review & Correction inputs
  const [correctionReasonText, setCorrectionReasonText] = useState("");
  const [reviewerNotesText, setReviewerNotesText] = useState("");
  const [correctionError, setCorrectionError] = useState("");

  // Create Survey Form State
  const [formData, setFormData] = useState({
    title: "",
    type: "Crop Health Assessment" as SurveyType,
    district: "Guntur",
    mandal: "",
    village: "",
    surveyDate: new Date().toISOString().split("T")[0],
    assignedOfficer: user?.name ? `${user.name} (Officer)` : "Dr. K. S. Rao (ADO)",
    description: "",
    targetFarms: 10,
    priority: "Normal" as SurveyPriority,
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Record Field Entry Form State
  const [entryFormData, setEntryFormData] = useState({
    farmerName: "",
    farmerId: "",
    village: "",
    crop: "",
    observedCondition: "Good" as FieldEntry["observedCondition"],
    irrigationStatus: "Borewell / Drip" as FieldEntry["irrigationStatus"],
    pestObservations: "",
    recommendedFollowUp: "",
    visitDate: new Date().toISOString().split("T")[0],
    notes: "",
  });
  const [entryErrors, setEntryErrors] = useState<Record<string, string>>({});

  // Active survey object
  const activeSurvey = useMemo(() => {
    return surveys.find((s) => s.id === selectedSurveyId) || null;
  }, [surveys, selectedSurveyId]);

  // Derived Districts from available surveys
  const availableDistricts = useMemo(() => {
    const set = new Set<string>();
    surveys.forEach((s) => {
      if (s.district) set.add(s.district);
    });
    return Array.from(set);
  }, [surveys]);

  // Filtered Surveys
  const filteredSurveys = useMemo(() => {
    return surveys.filter((s) => {
      if (statusFilter !== "all" && s.status !== statusFilter) return false;
      if (districtFilter !== "all" && s.district !== districtFilter) return false;

      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = s.title.toLowerCase().includes(query);
        const matchesId = s.id.toLowerCase().includes(query);
        const matchesDistrict = s.district.toLowerCase().includes(query);
        const matchesMandal = s.mandal.toLowerCase().includes(query);
        const matchesOfficer = s.assignedOfficer.toLowerCase().includes(query);
        if (!matchesTitle && !matchesId && !matchesDistrict && !matchesMandal && !matchesOfficer) {
          return false;
        }
      }
      return true;
    });
  }, [surveys, statusFilter, districtFilter, searchQuery]);

  // Metrics
  const metrics = useMemo(() => {
    const total = surveys.length;
    const drafts = surveys.filter((s) => s.status === "draft").length;
    const inProgress = surveys.filter((s) => s.status === "in_progress").length;
    const submitted = surveys.filter((s) => s.status === "submitted").length;
    const needsReview = surveys.filter((s) => s.status === "needs_review").length;
    const reviewed = surveys.filter((s) => s.status === "reviewed").length;
    return { total, drafts, inProgress, submitted, needsReview, reviewed };
  }, [surveys]);

  // Helper for CSV Escaping
  const escapeCsvCell = (val: string | number | undefined | null): string => {
    if (val === null || val === undefined) return '""';
    const str = String(val).replace(/"/g, '""');
    return `"${str}"`;
  };

  // Export Filtered Surveys to CSV
  const handleExportSurveysCsv = () => {
    const headers = [
      "Survey ID",
      "Title",
      "Type",
      "District",
      "Mandal",
      "Village",
      "Planned Date",
      "Assigned Officer",
      "Target Farms",
      "Recorded Farms",
      "Priority",
      "Status",
    ];

    const rows = filteredSurveys.map((s) => [
      escapeCsvCell(s.id),
      escapeCsvCell(s.title),
      escapeCsvCell(s.type),
      escapeCsvCell(s.district),
      escapeCsvCell(s.mandal),
      escapeCsvCell(s.village),
      escapeCsvCell(s.surveyDate),
      escapeCsvCell(s.assignedOfficer),
      escapeCsvCell(s.targetFarms),
      escapeCsvCell(s.fieldEntries.length),
      escapeCsvCell(s.priority),
      escapeCsvCell(s.status),
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `digital_field_surveys_${new Date().toISOString().split("T")[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export Selected Survey Entries to CSV
  const handleExportEntriesCsv = () => {
    if (!activeSurvey) return;

    const headers = [
      "Survey ID",
      "Entry ID",
      "Farmer Reference",
      "Village",
      "Crop",
      "Observed Condition",
      "Irrigation Status",
      "Pest & Disease Observations",
      "Recommended Follow-up",
      "Visit Date",
      "Notes",
    ];

    const rows = activeSurvey.fieldEntries.map((e) => [
      escapeCsvCell(activeSurvey.id),
      escapeCsvCell(e.id),
      escapeCsvCell(e.farmerName),
      escapeCsvCell(e.village),
      escapeCsvCell(e.crop),
      escapeCsvCell(e.observedCondition),
      escapeCsvCell(e.irrigationStatus),
      escapeCsvCell(e.pestObservations),
      escapeCsvCell(e.recommendedFollowUp),
      escapeCsvCell(e.visitDate),
      escapeCsvCell(e.notes || ""),
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `field_entries_${activeSurvey.id}_${new Date().toISOString().split("T")[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Validate Create Survey Form
  const validateCreateForm = () => {
    const errs: Record<string, string> = {};
    if (!formData.title.trim()) errs.title = "Survey title is required.";
    if (!formData.district.trim()) errs.district = "District is required.";
    if (!formData.mandal.trim()) errs.mandal = "Mandal is required.";
    if (!formData.village.trim()) errs.village = "Village is required.";
    if (!formData.assignedOfficer.trim())
      errs.assignedOfficer = "Assigned officer is required.";
    if (!formData.description.trim())
      errs.description = "Survey description is required.";
    if (!formData.targetFarms || formData.targetFarms < 1)
      errs.targetFarms = "Target farms must be at least 1.";
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Handle Create Survey (Draft or In Progress)
  const handleSaveSurvey = (statusToSet: "draft" | "in_progress") => {
    if (!validateCreateForm()) return;

    const created = addSurvey({
      title: formData.title.trim(),
      type: formData.type,
      district: formData.district.trim(),
      mandal: formData.mandal.trim(),
      village: formData.village.trim(),
      surveyDate: formData.surveyDate,
      assignedOfficer: formData.assignedOfficer.trim(),
      description: formData.description.trim(),
      targetFarms: Number(formData.targetFarms),
      priority: formData.priority,
      status: statusToSet,
    });

    setIsCreateModalOpen(false);
    // Reset Form
    setFormData({
      title: "",
      type: "Crop Health Assessment",
      district: "Guntur",
      mandal: "",
      village: "",
      surveyDate: new Date().toISOString().split("T")[0],
      assignedOfficer: user?.name ? `${user.name} (Officer)` : "Dr. K. S. Rao (ADO)",
      description: "",
      targetFarms: 10,
      priority: "Normal",
    });
    setFormErrors({});

    // Open detail of newly created survey
    setSelectedSurveyId(created.id);
  };

  // Validate Record Field Visit Form
  const validateEntryForm = () => {
    const errs: Record<string, string> = {};
    if (!entryFormData.farmerName.trim())
      errs.farmerName = "Farmer Name or Demo ID is required.";
    if (!entryFormData.village.trim()) errs.village = "Village is required.";
    if (!entryFormData.crop.trim()) errs.crop = "Crop is required.";
    if (!entryFormData.pestObservations.trim())
      errs.pestObservations = "Observations are required.";
    if (!entryFormData.recommendedFollowUp.trim())
      errs.recommendedFollowUp = "Recommended follow-up is required.";
    setEntryErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Handle Save Field Visit
  const handleSaveFieldVisit = () => {
    if (!activeSurvey) return;
    if (!validateEntryForm()) return;

    addFieldEntry(
      activeSurvey.id,
      {
        farmerName: entryFormData.farmerName.trim(),
        farmerId: entryFormData.farmerId.trim() || `FAR-${Math.floor(1000 + Math.random() * 9000)}`,
        village: entryFormData.village.trim(),
        crop: entryFormData.crop.trim(),
        observedCondition: entryFormData.observedCondition,
        irrigationStatus: entryFormData.irrigationStatus,
        pestObservations: entryFormData.pestObservations.trim(),
        recommendedFollowUp: entryFormData.recommendedFollowUp.trim(),
        visitDate: entryFormData.visitDate,
        notes: entryFormData.notes.trim() || undefined,
      },
      user?.name ? `${user.name} (Officer)` : activeSurvey.assignedOfficer
    );

    setIsRecordEntryModalOpen(false);
    // Reset Entry Form
    setEntryFormData({
      farmerName: "",
      farmerId: "",
      village: activeSurvey.village,
      crop: "",
      observedCondition: "Good",
      irrigationStatus: "Borewell / Drip",
      pestObservations: "",
      recommendedFollowUp: "",
      visitDate: new Date().toISOString().split("T")[0],
      notes: "",
    });
    setEntryErrors({});
  };

  // Handle Submit Survey
  const handleConfirmSubmit = () => {
    if (!activeSurvey) return;
    transitionStatus(
      activeSurvey.id,
      "submitted",
      "Field assessment completed and forwarded for administrative verification.",
      user?.name ? `${user.name} (Officer)` : activeSurvey.assignedOfficer
    );
    setIsSubmitConfirmOpen(false);
  };

  // Handle Request Correction
  const handleConfirmCorrection = () => {
    if (!activeSurvey) return;
    if (!correctionReasonText.trim()) {
      setCorrectionError("Please provide a reason for the correction request.");
      return;
    }
    requestCorrection(
      activeSurvey.id,
      correctionReasonText.trim(),
      user?.name ? `${user.name} (Reviewer)` : "District Reviewer Cell"
    );
    setIsCorrectionModalOpen(false);
    setCorrectionReasonText("");
    setCorrectionError("");
  };

  // Handle Mark Reviewed
  const handleConfirmMarkReviewed = () => {
    if (!activeSurvey) return;
    markReviewed(
      activeSurvey.id,
      reviewerNotesText.trim() || "All field entries and observations verified and approved.",
      user?.name ? `${user.name} (Reviewer)` : "District Reviewer Cell"
    );
    setIsMarkReviewedModalOpen(false);
    setReviewerNotesText("");
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Detail View vs Main List View */}
      {activeSurvey ? (
        /* ================= SURVEY DETAIL VIEW ================= */
        <div className="flex flex-col gap-6">
          {/* Top Bar with Contextual Back Button */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <BackButton
              id="btn-back-to-surveys"
              onClick={() => setSelectedSurveyId(null)}
              label={t("govtSurveys.backToSurveys") || "Back to Surveys"}
            />
            <div className="flex flex-wrap items-center gap-2">
              <button
                id="btn-export-survey-entries-csv"
                type="button"
                onClick={handleExportEntriesCsv}
                className="inline-flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-3 py-2 text-xs font-semibold text-gray-700 shadow-2xs hover:bg-gray-50 active:scale-95 transition"
              >
                <Download size={15} />
                <span>{t("govtSurveys.exportCsv") || "Export CSV"}</span>
              </button>
            </div>
          </div>

          {/* Survey Header Banner */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-xs">
            <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-lg bg-gray-100 px-2.5 py-1 text-xs font-mono font-bold text-gray-800">
                    {activeSurvey.id}
                  </span>
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${
                      STATUS_CONFIG[activeSurvey.status].badgeClass
                    }`}
                  >
                    {STATUS_CONFIG[activeSurvey.status].icon}
                    <span>{STATUS_CONFIG[activeSurvey.status].label}</span>
                  </span>
                  <span
                    className={`rounded-full border px-2.5 py-0.5 text-xs ${
                      PRIORITY_BADGES[activeSurvey.priority]
                    }`}
                  >
                    Priority: {activeSurvey.priority}
                  </span>
                  <span className="rounded-lg bg-[#E4F0DD] px-2.5 py-0.5 text-xs font-semibold text-[#174D25]">
                    {activeSurvey.type}
                  </span>
                </div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                  {activeSurvey.title}
                </h1>
                <p className="text-sm text-gray-600">{activeSurvey.description}</p>
              </div>

              {/* Progress Box */}
              <div className="shrink-0 rounded-xl border border-[#24833A]/20 bg-[#F4FBF5] p-3 sm:min-w-[200px]">
                <div className="flex items-center justify-between text-xs font-semibold text-[#174D25] mb-1">
                  <span>Farm Coverage</span>
                  <span>
                    {activeSurvey.fieldEntries.length} / {activeSurvey.targetFarms}
                  </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-[#E4F0DD]">
                  <div
                    className="h-full bg-[#24833A] transition-all duration-300"
                    style={{
                      width: `${Math.min(
                        100,
                        Math.round(
                          (activeSurvey.fieldEntries.length /
                            activeSurvey.targetFarms) *
                            100
                        )
                      )}%`,
                    }}
                  />
                </div>
                <p className="mt-1 text-[11px] text-gray-500 text-right">
                  {Math.round(
                    (activeSurvey.fieldEntries.length / activeSurvey.targetFarms) *
                      100
                  )}
                  % recorded
                </p>
              </div>
            </div>

            {/* Meta Grid */}
            <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 border-t border-gray-100 pt-4 text-xs text-gray-600">
              <div className="flex items-center gap-2">
                <MapPin size={16} className="text-gray-400 shrink-0" />
                <span>
                  <strong className="text-gray-900">Location:</strong>{" "}
                  {activeSurvey.village}, {activeSurvey.mandal}, {activeSurvey.district}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <User size={16} className="text-gray-400 shrink-0" />
                <span>
                  <strong className="text-gray-900">Officer:</strong>{" "}
                  {activeSurvey.assignedOfficer}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={16} className="text-gray-400 shrink-0" />
                <span>
                  <strong className="text-gray-900">Date:</strong>{" "}
                  {activeSurvey.surveyDate}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={16} className="text-gray-400 shrink-0" />
                <span>
                  <strong className="text-gray-900">Target Farms:</strong>{" "}
                  {activeSurvey.targetFarms} Plots
                </span>
              </div>
            </div>

            {/* Dynamic Lifecycle Actions Bar */}
            <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-gray-100 pt-4">
              {activeSurvey.status === "draft" && (
                <>
                  <button
                    id="btn-start-survey"
                    type="button"
                    onClick={() =>
                      transitionStatus(
                        activeSurvey.id,
                        "in_progress",
                        "Officer initiated field visits."
                      )
                    }
                    className="inline-flex items-center gap-2 rounded-xl bg-[#24833A] px-4 py-2 text-xs font-semibold text-white shadow-2xs hover:bg-[#1b6b2e] active:scale-95 transition"
                  >
                    <Plus size={15} />
                    <span>{t("govtSurveys.startSurvey") || "Start Survey"}</span>
                  </button>
                  <span className="text-xs text-gray-500 italic">
                    Draft survey can be started when officer departs for field visits.
                  </span>
                </>
              )}

              {activeSurvey.status === "in_progress" && (
                <>
                  <button
                    id="btn-record-field-visit"
                    type="button"
                    onClick={() => {
                      setEntryFormData((prev) => ({
                        ...prev,
                        village: activeSurvey.village,
                      }));
                      setIsRecordEntryModalOpen(true);
                    }}
                    className="inline-flex items-center gap-2 rounded-xl bg-[#24833A] px-4 py-2 text-xs font-semibold text-white shadow-2xs hover:bg-[#1b6b2e] active:scale-95 transition"
                  >
                    <Plus size={15} />
                    <span>
                      {t("govtSurveys.recordFieldVisit") || "Record Field Visit"}
                    </span>
                  </button>
                  <button
                    id="btn-submit-survey-confirm"
                    type="button"
                    onClick={() => setIsSubmitConfirmOpen(true)}
                    className="inline-flex items-center gap-2 rounded-xl border border-emerald-600 bg-emerald-50 px-4 py-2 text-xs font-semibold text-emerald-800 shadow-2xs hover:bg-emerald-100 active:scale-95 transition"
                  >
                    <Send size={15} />
                    <span>{t("govtSurveys.submitSurvey") || "Submit Survey"}</span>
                  </button>
                </>
              )}

              {activeSurvey.status === "submitted" && (
                <>
                  <button
                    id="btn-mark-needs-review"
                    type="button"
                    onClick={() =>
                      transitionStatus(
                        activeSurvey.id,
                        "needs_review",
                        "Marked for administrative review and spot audit."
                      )
                    }
                    className="inline-flex items-center gap-2 rounded-xl border border-purple-600 bg-purple-50 px-4 py-2 text-xs font-semibold text-purple-800 shadow-2xs hover:bg-purple-100 active:scale-95 transition"
                  >
                    <AlertCircle size={15} />
                    <span>
                      {t("govtSurveys.markNeedsReview") || "Mark Needs Review"}
                    </span>
                  </button>
                  <span className="text-xs text-gray-500">
                    Survey submitted and awaiting administrative review.
                  </span>
                </>
              )}

              {activeSurvey.status === "needs_review" && (
                <>
                  <button
                    id="btn-mark-reviewed-open"
                    type="button"
                    onClick={() => setIsMarkReviewedModalOpen(true)}
                    className="inline-flex items-center gap-2 rounded-xl bg-teal-700 px-4 py-2 text-xs font-semibold text-white shadow-2xs hover:bg-teal-800 active:scale-95 transition"
                  >
                    <CheckCheck size={15} />
                    <span>{t("govtSurveys.markReviewed") || "Mark Reviewed"}</span>
                  </button>
                  <button
                    id="btn-request-correction-open"
                    type="button"
                    onClick={() => setIsCorrectionModalOpen(true)}
                    className="inline-flex items-center gap-2 rounded-xl border border-amber-600 bg-amber-50 px-4 py-2 text-xs font-semibold text-amber-900 shadow-2xs hover:bg-amber-100 active:scale-95 transition"
                  >
                    <RotateCcw size={15} />
                    <span>
                      {t("govtSurveys.requestCorrection") || "Request Correction"}
                    </span>
                  </button>
                </>
              )}

              {activeSurvey.status === "reviewed" && (
                <div className="inline-flex items-center gap-2 text-xs font-semibold text-teal-800">
                  <CheckCircle2 size={16} className="text-teal-600" />
                  <span>
                    Survey verified and signed off by administrative reviewer.
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Review Alert Box if Needs Review or Correction Requested */}
          {activeSurvey.correctionReason && (
            <div className="rounded-2xl border border-amber-200 bg-amber-50/80 p-4 shadow-2xs">
              <div className="flex items-start gap-3">
                <AlertCircle size={20} className="text-amber-700 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-amber-900">
                    Correction Requested by Reviewer
                  </h4>
                  <p className="text-xs text-amber-800">{activeSurvey.correctionReason}</p>
                </div>
              </div>
            </div>
          )}

          {activeSurvey.reviewerNotes && (
            <div className="rounded-2xl border border-teal-200 bg-teal-50/80 p-4 shadow-2xs">
              <div className="flex items-start gap-3">
                <CheckCircle2 size={20} className="text-teal-700 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-teal-900">
                    Official Reviewer Notes
                  </h4>
                  <p className="text-xs text-teal-800">{activeSurvey.reviewerNotes}</p>
                </div>
              </div>
            </div>
          )}

          {/* Main Grid: Field Entries on Left, Timeline on Right */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Field Entries List (2 cols) */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                  <Sprout size={18} className="text-[#24833A]" />
                  <span>
                    {t("govtSurveys.fieldEntries") || "Recorded Field Entries"} (
                    {activeSurvey.fieldEntries.length})
                  </span>
                </h3>
                {activeSurvey.status === "in_progress" && (
                  <button
                    id="btn-record-field-visit-inline"
                    type="button"
                    onClick={() => {
                      setEntryFormData((prev) => ({
                        ...prev,
                        village: activeSurvey.village,
                      }));
                      setIsRecordEntryModalOpen(true);
                    }}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-[#24833A] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#1b6b2e] transition"
                  >
                    <Plus size={14} />
                    <span>Add Entry</span>
                  </button>
                )}
              </div>

              {activeSurvey.fieldEntries.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-8 text-center">
                  <ClipboardList size={36} className="mx-auto text-gray-300 mb-2" />
                  <p className="text-sm font-semibold text-gray-700">
                    {t("govtSurveys.noEntriesYet") ||
                      "No field entries recorded yet."}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Click &quot;Record Field Visit&quot; when evaluating plots.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {activeSurvey.fieldEntries.map((entry, idx) => (
                    <div
                      key={entry.id || idx}
                      className="rounded-2xl border border-gray-200 bg-white p-4 shadow-2xs transition hover:shadow-xs"
                    >
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-gray-900 text-sm">
                              {entry.farmerName}
                            </span>
                            <span className="rounded-md bg-gray-100 px-2 py-0.5 text-[10px] font-mono text-gray-600">
                              {entry.id}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500">
                            {entry.village} • Crop:{" "}
                            <strong className="text-gray-800">{entry.crop}</strong>
                          </p>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            className={`rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${
                              CONDITION_COLORS[entry.observedCondition]
                            }`}
                          >
                            Condition: {entry.observedCondition}
                          </span>
                          <span className="rounded-full bg-blue-50 border border-blue-200 px-2.5 py-0.5 text-[11px] text-blue-700 font-medium">
                            {entry.irrigationStatus}
                          </span>
                        </div>
                      </div>

                      <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs bg-gray-50/70 rounded-xl p-2.5 border border-gray-100">
                        <div>
                          <span className="font-semibold text-gray-700 block">
                            Pest & Observations:
                          </span>
                          <p className="text-gray-600">{entry.pestObservations}</p>
                        </div>
                        <div>
                          <span className="font-semibold text-gray-700 block">
                            Recommended Follow-up:
                          </span>
                          <p className="text-[#174D25] font-medium">
                            {entry.recommendedFollowUp}
                          </p>
                        </div>
                      </div>

                      {entry.notes && (
                        <p className="mt-2 text-[11px] text-gray-500 italic">
                          Notes: {entry.notes}
                        </p>
                      )}

                      <div className="mt-2 text-right text-[10px] text-gray-400">
                        Recorded on: {entry.visitDate}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Activity Timeline (1 col) */}
            <div className="space-y-4">
              <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <Clock size={18} className="text-gray-500" />
                <span>
                  {t("govtSurveys.activityTimeline") || "Activity Timeline"}
                </span>
              </h3>

              <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-2xs space-y-4">
                {activeSurvey.timeline.length === 0 ? (
                  <p className="text-xs text-gray-500">No events logged.</p>
                ) : (
                  <div className="relative pl-5 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-200 space-y-4">
                    {activeSurvey.timeline.map((event, idx) => (
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
        /* ================= SURVEYS LIST / DASHBOARD VIEW ================= */
        <>
          {/* Header & Main Back Button */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <BackButton
                id="btn-back-to-dashboard"
                href="/dashboard"
                label={t("govtSurveys.backToDashboard") || "Back to Dashboard"}
              />
              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                {t("govtSurveys.title") || "Digital Field Surveys"}
              </h1>
              <p className="text-xs sm:text-sm text-gray-600">
                {t("govtSurveys.subtitle") ||
                  "Plan field visits, collect agricultural assessments and track survey completion."}
              </p>
            </div>

            {/* Actions: Create Survey & Export CSV */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                id="btn-export-surveys-csv"
                type="button"
                onClick={handleExportSurveysCsv}
                className="inline-flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-3.5 py-2 text-xs font-semibold text-gray-700 shadow-2xs hover:bg-gray-50 active:scale-95 transition"
              >
                <Download size={15} />
                <span>{t("govtSurveys.exportCsv") || "Export CSV"}</span>
              </button>

              <button
                id="btn-open-create-survey-modal"
                type="button"
                onClick={() => setIsCreateModalOpen(true)}
                className="inline-flex items-center gap-2 rounded-xl bg-[#24833A] px-4 py-2 text-xs font-semibold text-white shadow-2xs hover:bg-[#1b6b2e] active:scale-95 transition"
              >
                <Plus size={16} />
                <span>{t("govtSurveys.createSurvey") || "Create Survey"}</span>
              </button>
            </div>
          </div>

          {/* Dynamic Summary Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            <div className="rounded-2xl border border-gray-200 bg-white p-3.5 shadow-2xs">
              <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500">
                {t("govtSurveys.totalSurveys") || "Total Surveys"}
              </span>
              <p className="mt-1 text-2xl font-black text-gray-900">{metrics.total}</p>
            </div>
            <div className="rounded-2xl border border-gray-200 bg-white p-3.5 shadow-2xs">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                {t("govtSurveys.drafts") || "Drafts"}
              </span>
              <p className="mt-1 text-2xl font-black text-slate-700">
                {metrics.drafts}
              </p>
            </div>
            <div className="rounded-2xl border border-blue-100 bg-blue-50/60 p-3.5 shadow-2xs">
              <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700">
                {t("govtSurveys.inProgress") || "In Progress"}
              </span>
              <p className="mt-1 text-2xl font-black text-blue-800">
                {metrics.inProgress}
              </p>
            </div>
            <div className="rounded-2xl border border-emerald-100 bg-emerald-50/60 p-3.5 shadow-2xs">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">
                {t("govtSurveys.submitted") || "Submitted"}
              </span>
              <p className="mt-1 text-2xl font-black text-emerald-800">
                {metrics.submitted}
              </p>
            </div>
            <div className="rounded-2xl border border-purple-100 bg-purple-50/60 p-3.5 shadow-2xs col-span-2 sm:col-span-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-purple-700">
                {t("govtSurveys.needsReview") || "Needs Review"}
              </span>
              <p className="mt-1 text-2xl font-black text-purple-800">
                {metrics.needsReview}
              </p>
            </div>
          </div>

          {/* Search & Filter Toolbar */}
          <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-2xs space-y-3">
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Search Bar */}
              <div className="relative flex-1">
                <Search
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  id="input-survey-search"
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={
                    t("govtSurveys.searchPlaceholder") ||
                    "Search by title, reference, district, mandal, or officer..."
                  }
                  className="w-full rounded-xl border border-gray-200 bg-gray-50/60 py-2 pl-9 pr-4 text-xs text-gray-900 placeholder:text-gray-400 focus:border-[#24833A] focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-[#24833A]"
                />
              </div>

              {/* District Filter Dropdown */}
              <div className="sm:w-56 shrink-0">
                <select
                  id="select-survey-district-filter"
                  value={districtFilter}
                  onChange={(e) => setDistrictFilter(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50/60 py-2 px-3 text-xs text-gray-800 focus:border-[#24833A] focus:bg-white focus:outline-hidden"
                >
                  <option value="all">
                    {t("govtSurveys.allDistricts") || "All Districts"}
                  </option>
                  {availableDistricts.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Status Filter Chips */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-gray-100">
              {[
                { id: "all", label: t("govtSurveys.filterAll") || "All" },
                { id: "draft", label: t("govtSurveys.filterDraft") || "Draft" },
                {
                  id: "in_progress",
                  label: t("govtSurveys.filterInProgress") || "In Progress",
                },
                {
                  id: "submitted",
                  label: t("govtSurveys.filterSubmitted") || "Submitted",
                },
                {
                  id: "needs_review",
                  label: t("govtSurveys.filterNeedsReview") || "Needs Review",
                },
                {
                  id: "reviewed",
                  label: t("govtSurveys.filterReviewed") || "Reviewed",
                },
              ].map((chip) => {
                const isActive = statusFilter === chip.id;
                return (
                  <button
                    key={chip.id}
                    id={`filter-chip-${chip.id}`}
                    type="button"
                    onClick={() => setStatusFilter(chip.id)}
                    className={`rounded-full px-3 py-1 text-xs font-semibold transition cursor-pointer ${
                      isActive
                        ? "bg-[#24833A] text-white shadow-2xs"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {chip.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Survey Cards Grid */}
          {filteredSurveys.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-12 text-center">
              <ClipboardList size={40} className="mx-auto text-gray-300 mb-2" />
              <p className="text-sm font-semibold text-gray-700">
                {t("govtSurveys.noSurveysFound") || "No field surveys found."}
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setStatusFilter("all");
                  setDistrictFilter("all");
                }}
                className="mt-3 text-xs font-semibold text-[#24833A] hover:underline"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredSurveys.map((survey) => (
                <div
                  key={survey.id}
                  id={`survey-card-${survey.id}`}
                  onClick={() => setSelectedSurveyId(survey.id)}
                  className="flex flex-col justify-between rounded-2xl border border-gray-200 bg-white p-5 shadow-2xs transition hover:border-[#24833A]/40 hover:shadow-xs cursor-pointer group"
                >
                  <div>
                    {/* Top Badges */}
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-gray-700 bg-gray-100 px-2 py-0.5 rounded-md">
                          {survey.id}
                        </span>
                        <span
                          className={`rounded-full border px-2 py-0.5 text-[10px] ${
                            PRIORITY_BADGES[survey.priority]
                          }`}
                        >
                          {survey.priority}
                        </span>
                      </div>
                      <span
                        className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${
                          STATUS_CONFIG[survey.status].badgeClass
                        }`}
                      >
                        {STATUS_CONFIG[survey.status].icon}
                        <span>{STATUS_CONFIG[survey.status].label}</span>
                      </span>
                    </div>

                    {/* Title & Type */}
                    <div className="mt-3">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[#174D25]">
                        {survey.type}
                      </span>
                      <h3 className="text-base font-bold text-gray-900 group-hover:text-[#24833A] transition">
                        {survey.title}
                      </h3>
                      <p className="mt-1 text-xs text-gray-500 line-clamp-2">
                        {survey.description}
                      </p>
                    </div>

                    {/* Location & Officer */}
                    <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-gray-600 bg-gray-50/70 p-2.5 rounded-xl border border-gray-100">
                      <div className="flex items-center gap-1.5">
                        <MapPin size={14} className="text-gray-400 shrink-0" />
                        <span className="truncate">
                          {survey.mandal}, {survey.district}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <User size={14} className="text-gray-400 shrink-0" />
                        <span className="truncate">{survey.assignedOfficer}</span>
                      </div>
                    </div>
                  </div>

                  {/* Progress & Bottom Bar */}
                  <div className="mt-4 pt-3 border-t border-gray-100">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-medium text-gray-600">
                        {survey.fieldEntries.length} of {survey.targetFarms} Farms
                        Recorded
                      </span>
                      <span className="font-bold text-[#174D25]">
                        {Math.round(
                          (survey.fieldEntries.length / survey.targetFarms) * 100
                        )}
                        %
                      </span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
                      <div
                        className="h-full bg-[#24833A]"
                        style={{
                          width: `${Math.min(
                            100,
                            Math.round(
                              (survey.fieldEntries.length / survey.targetFarms) * 100
                            )
                          )}%`,
                        }}
                      />
                    </div>

                    <div className="mt-3 flex items-center justify-between text-xs text-gray-400">
                      <span>Date: {survey.surveyDate}</span>
                      <span className="font-semibold text-[#24833A] flex items-center gap-1 group-hover:translate-x-1 transition">
                        View Details <ArrowRight size={13} />
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* ================= MODAL: CREATE SURVEY ================= */}
      {isCreateModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto"
        >
          <div className="relative w-full max-w-xl rounded-2xl bg-white p-6 shadow-xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <ClipboardList size={20} className="text-[#24833A]" />
                <span>{t("govtSurveys.createSurvey") || "Create Survey"}</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              {/* Title */}
              <div>
                <label className="font-bold text-gray-700 block mb-1">
                  Survey Title *
                </label>
                <input
                  id="input-create-survey-title"
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="e.g. Tenali Chilli Thrips Incidence & Wilt Assessment"
                  className="w-full rounded-xl border border-gray-200 p-2.5 text-xs text-gray-900 focus:border-[#24833A] focus:outline-hidden"
                />
                {formErrors.title && (
                  <p className="text-[11px] text-red-600 mt-0.5">{formErrors.title}</p>
                )}
              </div>

              {/* Type & Priority */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">
                    Survey Type *
                  </label>
                  <select
                    id="select-create-survey-type"
                    value={formData.type}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        type: e.target.value as SurveyType,
                      })
                    }
                    className="w-full rounded-xl border border-gray-200 p-2.5 text-xs text-gray-900 focus:border-[#24833A] focus:outline-hidden"
                  >
                    {SURVEY_TYPES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-bold text-gray-700 block mb-1">
                    Priority
                  </label>
                  <select
                    id="select-create-survey-priority"
                    value={formData.priority}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        priority: e.target.value as SurveyPriority,
                      })
                    }
                    className="w-full rounded-xl border border-gray-200 p-2.5 text-xs text-gray-900 focus:border-[#24833A] focus:outline-hidden"
                  >
                    {SURVEY_PRIORITIES.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Location: District, Mandal, Village */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">
                    District *
                  </label>
                  <input
                    id="input-create-survey-district"
                    type="text"
                    value={formData.district}
                    onChange={(e) =>
                      setFormData({ ...formData, district: e.target.value })
                    }
                    placeholder="e.g. Guntur"
                    className="w-full rounded-xl border border-gray-200 p-2.5 text-xs text-gray-900 focus:border-[#24833A] focus:outline-hidden"
                  />
                  {formErrors.district && (
                    <p className="text-[11px] text-red-600 mt-0.5">
                      {formErrors.district}
                    </p>
                  )}
                </div>
                <div>
                  <label className="font-bold text-gray-700 block mb-1">
                    Mandal *
                  </label>
                  <input
                    id="input-create-survey-mandal"
                    type="text"
                    value={formData.mandal}
                    onChange={(e) =>
                      setFormData({ ...formData, mandal: e.target.value })
                    }
                    placeholder="e.g. Tenali"
                    className="w-full rounded-xl border border-gray-200 p-2.5 text-xs text-gray-900 focus:border-[#24833A] focus:outline-hidden"
                  />
                  {formErrors.mandal && (
                    <p className="text-[11px] text-red-600 mt-0.5">
                      {formErrors.mandal}
                    </p>
                  )}
                </div>
                <div>
                  <label className="font-bold text-gray-700 block mb-1">
                    Village *
                  </label>
                  <input
                    id="input-create-survey-village"
                    type="text"
                    value={formData.village}
                    onChange={(e) =>
                      setFormData({ ...formData, village: e.target.value })
                    }
                    placeholder="e.g. Angalakuduru"
                    className="w-full rounded-xl border border-gray-200 p-2.5 text-xs text-gray-900 focus:border-[#24833A] focus:outline-hidden"
                  />
                  {formErrors.village && (
                    <p className="text-[11px] text-red-600 mt-0.5">
                      {formErrors.village}
                    </p>
                  )}
                </div>
              </div>

              {/* Date, Officer, Target Farms */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">
                    Survey Date *
                  </label>
                  <input
                    id="input-create-survey-date"
                    type="date"
                    value={formData.surveyDate}
                    onChange={(e) =>
                      setFormData({ ...formData, surveyDate: e.target.value })
                    }
                    className="w-full rounded-xl border border-gray-200 p-2.5 text-xs text-gray-900 focus:border-[#24833A] focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="font-bold text-gray-700 block mb-1">
                    Assigned Officer *
                  </label>
                  <input
                    id="input-create-survey-officer"
                    type="text"
                    value={formData.assignedOfficer}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        assignedOfficer: e.target.value,
                      })
                    }
                    className="w-full rounded-xl border border-gray-200 p-2.5 text-xs text-gray-900 focus:border-[#24833A] focus:outline-hidden"
                  />
                  {formErrors.assignedOfficer && (
                    <p className="text-[11px] text-red-600 mt-0.5">
                      {formErrors.assignedOfficer}
                    </p>
                  )}
                </div>
                <div>
                  <label className="font-bold text-gray-700 block mb-1">
                    Target Farms *
                  </label>
                  <input
                    id="input-create-survey-target"
                    type="number"
                    min="1"
                    value={formData.targetFarms}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        targetFarms: parseInt(e.target.value) || 1,
                      })
                    }
                    className="w-full rounded-xl border border-gray-200 p-2.5 text-xs text-gray-900 focus:border-[#24833A] focus:outline-hidden"
                  />
                  {formErrors.targetFarms && (
                    <p className="text-[11px] text-red-600 mt-0.5">
                      {formErrors.targetFarms}
                    </p>
                  )}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="font-bold text-gray-700 block mb-1">
                  Description *
                </label>
                <textarea
                  id="textarea-create-survey-desc"
                  rows={3}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Outline assessment goals, key focal crops and inspection methodology..."
                  className="w-full rounded-xl border border-gray-200 p-2.5 text-xs text-gray-900 focus:border-[#24833A] focus:outline-hidden"
                />
                {formErrors.description && (
                  <p className="text-[11px] text-red-600 mt-0.5">
                    {formErrors.description}
                  </p>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center justify-end gap-2 border-t border-gray-100 pt-4">
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="rounded-xl border border-gray-200 px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition"
              >
                {t("govtSurveys.cancel") || "Cancel"}
              </button>
              <button
                id="btn-save-survey-draft"
                type="button"
                onClick={() => handleSaveSurvey("draft")}
                className="rounded-xl border border-gray-300 bg-white px-4 py-2 text-xs font-semibold text-gray-800 hover:bg-gray-50 transition"
              >
                {t("govtSurveys.saveDraft") || "Save Draft"}
              </button>
              <button
                id="btn-save-survey-in-progress"
                type="button"
                onClick={() => handleSaveSurvey("in_progress")}
                className="rounded-xl bg-[#24833A] px-4 py-2 text-xs font-semibold text-white hover:bg-[#1b6b2e] shadow-2xs transition"
              >
                {t("govtSurveys.startSurvey") || "Start Survey"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: RECORD FIELD VISIT ================= */}
      {isRecordEntryModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto"
        >
          <div className="relative w-full max-w-xl rounded-2xl bg-white p-6 shadow-xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Sprout size={20} className="text-[#24833A]" />
                <span>
                  {t("govtSurveys.recordFieldVisit") || "Record Field Visit"}
                </span>
              </h3>
              <button
                type="button"
                onClick={() => setIsRecordEntryModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              {/* Farmer Name & Village */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">
                    Farmer Name / Registration ID *
                  </label>
                  <input
                    id="input-entry-farmer-name"
                    type="text"
                    value={entryFormData.farmerName}
                    onChange={(e) =>
                      setEntryFormData({
                        ...entryFormData,
                        farmerName: e.target.value,
                      })
                    }
                    placeholder="e.g. S. Malleswara Rao (ID: FAR-4925)"
                    className="w-full rounded-xl border border-gray-200 p-2.5 text-xs text-gray-900 focus:border-[#24833A] focus:outline-hidden"
                  />
                  {entryErrors.farmerName && (
                    <p className="text-[11px] text-red-600 mt-0.5">
                      {entryErrors.farmerName}
                    </p>
                  )}
                </div>
                <div>
                  <label className="font-bold text-gray-700 block mb-1">
                    Village *
                  </label>
                  <input
                    id="input-entry-village"
                    type="text"
                    value={entryFormData.village}
                    onChange={(e) =>
                      setEntryFormData({
                        ...entryFormData,
                        village: e.target.value,
                      })
                    }
                    placeholder="e.g. Angalakuduru"
                    className="w-full rounded-xl border border-gray-200 p-2.5 text-xs text-gray-900 focus:border-[#24833A] focus:outline-hidden"
                  />
                  {entryErrors.village && (
                    <p className="text-[11px] text-red-600 mt-0.5">
                      {entryErrors.village}
                    </p>
                  )}
                </div>
              </div>

              {/* Crop & Observed Condition */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">
                    Crop & Variety *
                  </label>
                  <input
                    id="input-entry-crop"
                    type="text"
                    value={entryFormData.crop}
                    onChange={(e) =>
                      setEntryFormData({ ...entryFormData, crop: e.target.value })
                    }
                    placeholder="e.g. Teja Chilli / BPT Paddy"
                    className="w-full rounded-xl border border-gray-200 p-2.5 text-xs text-gray-900 focus:border-[#24833A] focus:outline-hidden"
                  />
                  {entryErrors.crop && (
                    <p className="text-[11px] text-red-600 mt-0.5">
                      {entryErrors.crop}
                    </p>
                  )}
                </div>
                <div>
                  <label className="font-bold text-gray-700 block mb-1">
                    Observed Condition *
                  </label>
                  <select
                    id="select-entry-condition"
                    value={entryFormData.observedCondition}
                    onChange={(e) =>
                      setEntryFormData({
                        ...entryFormData,
                        observedCondition: e.target.value as FieldEntry["observedCondition"],
                      })
                    }
                    className="w-full rounded-xl border border-gray-200 p-2.5 text-xs text-gray-900 focus:border-[#24833A] focus:outline-hidden"
                  >
                    <option value="Good">Good (Healthy Growth)</option>
                    <option value="Moderate">Moderate (Minor Symptoms)</option>
                    <option value="Stressed">Stressed (Water/Nutrient Stress)</option>
                    <option value="Damaged">Damaged (Severe Pest/Flood Loss)</option>
                  </select>
                </div>
              </div>

              {/* Irrigation & Date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">
                    Irrigation Status *
                  </label>
                  <select
                    id="select-entry-irrigation"
                    value={entryFormData.irrigationStatus}
                    onChange={(e) =>
                      setEntryFormData({
                        ...entryFormData,
                        irrigationStatus: e.target.value as FieldEntry["irrigationStatus"],
                      })
                    }
                    className="w-full rounded-xl border border-gray-200 p-2.5 text-xs text-gray-900 focus:border-[#24833A] focus:outline-hidden"
                  >
                    <option value="Borewell / Drip">Borewell / Drip</option>
                    <option value="Canal / Flood">Canal / Flood</option>
                    <option value="Rainfed">Rainfed</option>
                    <option value="Dry / Critical">Dry / Critical</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-gray-700 block mb-1">
                    Visit Date
                  </label>
                  <input
                    id="input-entry-date"
                    type="date"
                    value={entryFormData.visitDate}
                    onChange={(e) =>
                      setEntryFormData({
                        ...entryFormData,
                        visitDate: e.target.value,
                      })
                    }
                    className="w-full rounded-xl border border-gray-200 p-2.5 text-xs text-gray-900 focus:border-[#24833A] focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Pest & Disease Observations */}
              <div>
                <label className="font-bold text-gray-700 block mb-1">
                  Pest & Disease Observations *
                </label>
                <textarea
                  id="textarea-entry-pest-obs"
                  rows={2}
                  value={entryFormData.pestObservations}
                  onChange={(e) =>
                    setEntryFormData({
                      ...entryFormData,
                      pestObservations: e.target.value,
                    })
                  }
                  placeholder="Record symptoms: e.g. leaf curl, sucking pests, fungal spots..."
                  className="w-full rounded-xl border border-gray-200 p-2.5 text-xs text-gray-900 focus:border-[#24833A] focus:outline-hidden"
                />
                {entryErrors.pestObservations && (
                  <p className="text-[11px] text-red-600 mt-0.5">
                    {entryErrors.pestObservations}
                  </p>
                )}
              </div>

              {/* Recommended Follow-up */}
              <div>
                <label className="font-bold text-gray-700 block mb-1">
                  Recommended Follow-up *
                </label>
                <input
                  id="input-entry-followup"
                  type="text"
                  value={entryFormData.recommendedFollowUp}
                  onChange={(e) =>
                    setEntryFormData({
                      ...entryFormData,
                      recommendedFollowUp: e.target.value,
                    })
                  }
                  placeholder="e.g. Spray Spinetoram 11.7 SC; improve canal drainage"
                  className="w-full rounded-xl border border-gray-200 p-2.5 text-xs text-gray-900 focus:border-[#24833A] focus:outline-hidden"
                />
                {entryErrors.recommendedFollowUp && (
                  <p className="text-[11px] text-red-600 mt-0.5">
                    {entryErrors.recommendedFollowUp}
                  </p>
                )}
              </div>

              {/* Optional Notes */}
              <div>
                <label className="font-bold text-gray-700 block mb-1">
                  Optional Notes
                </label>
                <input
                  id="input-entry-notes"
                  type="text"
                  value={entryFormData.notes}
                  onChange={(e) =>
                    setEntryFormData({ ...entryFormData, notes: e.target.value })
                  }
                  placeholder="Any additional remarks..."
                  className="w-full rounded-xl border border-gray-200 p-2.5 text-xs text-gray-900 focus:border-[#24833A] focus:outline-hidden"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 border-t border-gray-100 pt-4">
              <button
                type="button"
                onClick={() => setIsRecordEntryModalOpen(false)}
                className="rounded-xl border border-gray-200 px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition"
              >
                {t("govtSurveys.cancel") || "Cancel"}
              </button>
              <button
                id="btn-save-field-entry"
                type="button"
                onClick={handleSaveFieldVisit}
                className="rounded-xl bg-[#24833A] px-4 py-2 text-xs font-semibold text-white hover:bg-[#1b6b2e] shadow-2xs transition"
              >
                Save Field Entry
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: SUBMIT CONFIRMATION ================= */}
      {isSubmitConfirmOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4"
        >
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl space-y-4">
            <div className="flex items-center gap-3 text-emerald-700">
              <div className="rounded-full bg-emerald-100 p-2">
                <Send size={22} />
              </div>
              <h3 className="text-base font-bold text-gray-900">
                {t("govtSurveys.submitConfirmationTitle") ||
                  "Submit Field Survey"}
              </h3>
            </div>
            <p className="text-xs text-gray-600">
              {t("govtSurveys.submitConfirmationText") ||
                "Once submitted, this survey will be forwarded for administrative verification and cannot be edited silently."}
            </p>
            <div className="rounded-xl bg-gray-50 p-3 text-xs text-gray-700 border border-gray-100">
              <strong>Recorded:</strong> {activeSurvey?.fieldEntries.length} plots
              out of {activeSurvey?.targetFarms} target farms.
            </div>
            <div className="flex items-center justify-end gap-2 border-t border-gray-100 pt-3">
              <button
                type="button"
                onClick={() => setIsSubmitConfirmOpen(false)}
                className="rounded-xl border border-gray-200 px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition"
              >
                {t("govtSurveys.cancel") || "Cancel"}
              </button>
              <button
                id="btn-confirm-survey-submission"
                type="button"
                onClick={handleConfirmSubmit}
                className="rounded-xl bg-emerald-700 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-800 transition"
              >
                {t("govtSurveys.confirm") || "Confirm Submission"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: REQUEST CORRECTION ================= */}
      {isCorrectionModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4"
        >
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl space-y-4">
            <div className="flex items-center gap-3 text-amber-700">
              <div className="rounded-full bg-amber-100 p-2">
                <RotateCcw size={22} />
              </div>
              <h3 className="text-base font-bold text-gray-900">
                {t("govtSurveys.correctionPromptTitle") ||
                  "Request Survey Correction"}
              </h3>
            </div>
            <p className="text-xs text-gray-600">
              {t("govtSurveys.correctionPromptText") ||
                "Please specify the missing information or corrections required by the field officer:"}
            </p>
            <div>
              <textarea
                id="textarea-correction-reason"
                rows={3}
                value={correctionReasonText}
                onChange={(e) => {
                  setCorrectionReasonText(e.target.value);
                  if (e.target.value.trim()) setCorrectionError("");
                }}
                placeholder="e.g. Please provide soil moisture depth measurements and farmer IDs for plots 4 and 5."
                className="w-full rounded-xl border border-gray-200 p-2.5 text-xs text-gray-900 focus:border-amber-600 focus:outline-hidden"
              />
              {correctionError && (
                <p className="text-[11px] text-red-600 mt-1">{correctionError}</p>
              )}
            </div>
            <div className="flex items-center justify-end gap-2 border-t border-gray-100 pt-3">
              <button
                type="button"
                onClick={() => {
                  setIsCorrectionModalOpen(false);
                  setCorrectionReasonText("");
                  setCorrectionError("");
                }}
                className="rounded-xl border border-gray-200 px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition"
              >
                {t("govtSurveys.cancel") || "Cancel"}
              </button>
              <button
                id="btn-submit-correction-request"
                type="button"
                onClick={handleConfirmCorrection}
                className="rounded-xl bg-amber-600 px-4 py-2 text-xs font-semibold text-white hover:bg-amber-700 transition"
              >
                Submit Correction Request
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: MARK REVIEWED ================= */}
      {isMarkReviewedModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4"
        >
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl space-y-4">
            <div className="flex items-center gap-3 text-teal-700">
              <div className="rounded-full bg-teal-100 p-2">
                <CheckCheck size={22} />
              </div>
              <h3 className="text-base font-bold text-gray-900">
                {t("govtSurveys.markReviewedPromptTitle") ||
                  "Mark Survey Reviewed"}
              </h3>
            </div>
            <p className="text-xs text-gray-600">
              {t("govtSurveys.markReviewedPromptText") ||
                "Confirm that all field entries and observations have been verified."}
            </p>
            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">
                Reviewer Verification Notes
              </label>
              <textarea
                id="textarea-reviewer-notes"
                rows={3}
                value={reviewerNotesText}
                onChange={(e) => setReviewerNotesText(e.target.value)}
                placeholder={
                  t("govtSurveys.reviewNotesPlaceholder") ||
                  "Enter official reviewer verification notes..."
                }
                className="w-full rounded-xl border border-gray-200 p-2.5 text-xs text-gray-900 focus:border-teal-600 focus:outline-hidden"
              />
            </div>
            <div className="flex items-center justify-end gap-2 border-t border-gray-100 pt-3">
              <button
                type="button"
                onClick={() => {
                  setIsMarkReviewedModalOpen(false);
                  setReviewerNotesText("");
                }}
                className="rounded-xl border border-gray-200 px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition"
              >
                {t("govtSurveys.cancel") || "Cancel"}
              </button>
              <button
                id="btn-confirm-mark-reviewed"
                type="button"
                onClick={handleConfirmMarkReviewed}
                className="rounded-xl bg-teal-700 px-4 py-2 text-xs font-semibold text-white hover:bg-teal-800 transition"
              >
                Confirm Review & Approve
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
