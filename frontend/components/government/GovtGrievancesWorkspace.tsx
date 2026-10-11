"use client";

import React, { useState, useMemo } from "react";
import {
  FileText,
  Search,
  Filter,
  Download,
  AlertCircle,
  CheckCircle2,
  Clock,
  UserCheck,
  Send,
  Eye,
  RotateCcw,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  MapPin,
  Calendar,
  User,
  HelpCircle,
  X,
  AlertTriangle,
  FolderLock,
  MessageSquare,
} from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { useAuthStore } from "@/store/auth-store";
import BackButton from "@/components/ui/BackButton";
import {
  useGrievanceStore,
  DEMO_OFFICERS_LIST,
} from "@/store/grievance-store";
import {
  GrievanceTicket,
  GrievanceStatus,
  GrievancePriority,
  GrievanceCategory,
} from "@/types/grievance";

const ALL_CATEGORIES: GrievanceCategory[] = [
  "Irrigation / Water Supply",
  "Crop Damage",
  "Pest or Disease",
  "Subsidy / Scheme",
  "Land Record Issue",
  "Equipment / Labour",
  "Other",
];

const ALL_STATUSES: GrievanceStatus[] = [
  "Open",
  "Awaiting Field Assignment",
  "Assigned",
  "In Progress",
  "Awaiting Farmer Information",
  "Resolved",
  "Closed",
];

const ALL_PRIORITIES: GrievancePriority[] = ["Normal", "High", "Critical"];

const PRIORITY_BADGES: Record<GrievancePriority, string> = {
  Normal: "bg-blue-50 text-blue-700 border-blue-200",
  High: "bg-amber-50 text-amber-800 border-amber-300 font-medium",
  Critical: "bg-rose-100 text-rose-800 border-rose-300 font-bold",
};

const STATUS_BADGES: Record<
  GrievanceStatus,
  { badgeClass: string; icon: React.ReactNode }
> = {
  Open: {
    badgeClass: "bg-slate-100 text-slate-700 border-slate-300",
    icon: <Clock size={12} className="text-slate-500" />,
  },
  "Awaiting Field Assignment": {
    badgeClass: "bg-purple-50 text-purple-700 border-purple-200",
    icon: <AlertCircle size={12} className="text-purple-600" />,
  },
  Assigned: {
    badgeClass: "bg-indigo-50 text-indigo-700 border-indigo-200",
    icon: <UserCheck size={12} className="text-indigo-600" />,
  },
  "In Progress": {
    badgeClass: "bg-blue-50 text-blue-700 border-blue-200",
    icon: <Clock size={12} className="text-blue-600 animate-pulse" />,
  },
  "Awaiting Farmer Information": {
    badgeClass: "bg-amber-50 text-amber-800 border-amber-200",
    icon: <HelpCircle size={12} className="text-amber-600" />,
  },
  Resolved: {
    badgeClass: "bg-emerald-50 text-emerald-800 border-emerald-200",
    icon: <CheckCircle2 size={12} className="text-emerald-600" />,
  },
  Closed: {
    badgeClass: "bg-gray-100 text-gray-600 border-gray-300",
    icon: <FolderLock size={12} className="text-gray-500" />,
  },
};

export default function GovtGrievancesWorkspace() {
  const { t } = useTranslation();
  const user = useAuthStore((state) => state.user);

  const tickets = useGrievanceStore((state) => state.tickets);
  const assignOfficer = useGrievanceStore((state) => state.assignOfficer);
  const startInvestigation = useGrievanceStore(
    (state) => state.startInvestigation
  );
  const requestFarmerInfo = useGrievanceStore(
    (state) => state.requestFarmerInfo
  );
  const resolveTicket = useGrievanceStore((state) => state.resolveTicket);
  const closeTicket = useGrievanceStore((state) => state.closeTicket);
  const reopenTicket = useGrievanceStore((state) => state.reopenTicket);
  const changePriority = useGrievanceStore((state) => state.changePriority);

  // View state
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [districtFilter, setDistrictFilter] = useState<string>("all");

  // Modals state
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [isRequestInfoModalOpen, setIsRequestInfoModalOpen] = useState(false);
  const [isResolveModalOpen, setIsResolveModalOpen] = useState(false);
  const [isCloseModalOpen, setIsCloseModalOpen] = useState(false);
  const [isReopenModalOpen, setIsReopenModalOpen] = useState(false);
  const [isCriticalConfirmOpen, setIsCriticalConfirmOpen] = useState(false);

  // Modal input values
  const [selectedOfficer, setSelectedOfficer] = useState(DEMO_OFFICERS_LIST[0]);
  const [assignmentNote, setAssignmentNote] = useState("");
  const [assignError, setAssignError] = useState("");

  const [requestInfoReason, setRequestInfoReason] = useState("");
  const [requestInfoError, setRequestInfoError] = useState("");

  const [resolutionSummaryText, setResolutionSummaryText] = useState("");
  const [resolveError, setResolveError] = useState("");

  const [reopenReasonText, setReopenReasonText] = useState("");
  const [reopenError, setReopenError] = useState("");

  const [pendingPriority, setPendingPriority] =
    useState<GrievancePriority>("Normal");

  // Active Ticket
  const activeTicket = useMemo(() => {
    return tickets.find((t) => t.id === selectedTicketId) || null;
  }, [tickets, selectedTicketId]);

  // Derived Districts from Tickets
  const availableDistricts = useMemo(() => {
    const dSet = new Set<string>();
    tickets.forEach((t) => {
      if (t.district) dSet.add(t.district);
    });
    return Array.from(dSet);
  }, [tickets]);

  // Dynamic Summary Metrics
  const metrics = useMemo(() => {
    const total = tickets.length;
    const open = tickets.filter(
      (t) => t.status === "Open" || t.status === "Awaiting Field Assignment"
    ).length;
    const highPriority = tickets.filter(
      (t) => t.priority === "High" || t.priority === "Critical"
    ).length;
    const awaitingFieldAssignment = tickets.filter(
      (t) => t.status === "Awaiting Field Assignment"
    ).length;
    const inProgress = tickets.filter(
      (t) => t.status === "In Progress" || t.status === "Assigned"
    ).length;
    const resolved = tickets.filter(
      (t) => t.status === "Resolved" || t.status === "Closed"
    ).length;
    return {
      total,
      open,
      highPriority,
      awaitingFieldAssignment,
      inProgress,
      resolved,
    };
  }, [tickets]);

  // Filtered Tickets
  const filteredTickets = useMemo(() => {
    return tickets.filter((ticket) => {
      if (statusFilter !== "all" && ticket.status !== statusFilter) return false;
      if (priorityFilter !== "all" && ticket.priority !== priorityFilter)
        return false;
      if (categoryFilter !== "all" && ticket.category !== categoryFilter)
        return false;
      if (districtFilter !== "all" && ticket.district !== districtFilter)
        return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesId = ticket.id.toLowerCase().includes(q);
        const matchesFarmer = ticket.farmerName.toLowerCase().includes(q);
        const matchesDesc = ticket.description.toLowerCase().includes(q);
        const matchesCategory = ticket.category.toLowerCase().includes(q);
        const matchesDistrict = ticket.district.toLowerCase().includes(q);
        const matchesMandal = ticket.mandal.toLowerCase().includes(q);
        const matchesOfficer = (ticket.assignedOfficer || "")
          .toLowerCase()
          .includes(q);
        if (
          !matchesId &&
          !matchesFarmer &&
          !matchesDesc &&
          !matchesCategory &&
          !matchesDistrict &&
          !matchesMandal &&
          !matchesOfficer
        ) {
          return false;
        }
      }

      return true;
    });
  }, [
    tickets,
    statusFilter,
    priorityFilter,
    categoryFilter,
    districtFilter,
    searchQuery,
  ]);

  // Clear All Filters
  const handleClearFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
    setPriorityFilter("all");
    setCategoryFilter("all");
    setDistrictFilter("all");
  };

  // Helper for CSV escaping
  const escapeCsv = (val: string | number | undefined | null): string => {
    if (val === null || val === undefined) return '""';
    const str = String(val).replace(/"/g, '""');
    return `"${str}"`;
  };

  // Export Filtered Tickets to CSV
  const handleExportCsv = () => {
    const headers = [
      "Ticket ID",
      "Farmer Reference",
      "Category",
      "District",
      "Mandal",
      "Village",
      "Date Reported",
      "Priority",
      "Status",
      "Assigned Officer",
      "Description",
      "Resolution Notes",
    ];

    const rows = filteredTickets.map((t) => [
      escapeCsv(t.id),
      escapeCsv(t.farmerName),
      escapeCsv(t.category),
      escapeCsv(t.district),
      escapeCsv(t.mandal),
      escapeCsv(t.village),
      escapeCsv(t.dateReported),
      escapeCsv(t.priority),
      escapeCsv(t.status),
      escapeCsv(t.assignedOfficer || "Unassigned"),
      escapeCsv(t.description),
      escapeCsv(t.resolutionNotes || ""),
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `farmer_grievances_${new Date().toISOString().split("T")[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Handle Assign Officer Submission
  const handleConfirmAssign = () => {
    if (!activeTicket) return;
    if (!selectedOfficer) {
      setAssignError("Please select an officer from the list.");
      return;
    }
    assignOfficer(
      activeTicket.id,
      selectedOfficer,
      assignmentNote.trim() || undefined,
      user?.name ? `${user.name} (Officer)` : "District Grievance Cell"
    );
    setIsAssignModalOpen(false);
    setAssignmentNote("");
    setAssignError("");
  };

  // Handle Request Farmer Info Submission
  const handleConfirmRequestInfo = () => {
    if (!activeTicket) return;
    if (!requestInfoReason.trim()) {
      setRequestInfoError("Please specify the clarification or document required.");
      return;
    }
    requestFarmerInfo(
      activeTicket.id,
      requestInfoReason.trim(),
      user?.name ? `${user.name} (Officer)` : "Assigned Officer"
    );
    setIsRequestInfoModalOpen(false);
    setRequestInfoReason("");
    setRequestInfoError("");
  };

  // Handle Resolve Ticket Submission
  const handleConfirmResolve = () => {
    if (!activeTicket) return;
    if (!resolutionSummaryText.trim()) {
      setResolveError("Resolution summary is required before closing.");
      return;
    }
    resolveTicket(
      activeTicket.id,
      resolutionSummaryText.trim(),
      user?.name ? `${user.name} (Officer)` : "Assigned Officer"
    );
    setIsResolveModalOpen(false);
    setResolutionSummaryText("");
    setResolveError("");
  };

  // Handle Close Ticket Submission
  const handleConfirmClose = () => {
    if (!activeTicket) return;
    closeTicket(
      activeTicket.id,
      "Administrative resolution verified and signed off.",
      user?.name ? `${user.name} (Reviewer)` : "District Grievance Officer"
    );
    setIsCloseModalOpen(false);
  };

  // Handle Reopen Ticket Submission
  const handleConfirmReopen = () => {
    if (!activeTicket) return;
    if (!reopenReasonText.trim()) {
      setReopenError("Please provide a reason for reopening this grievance.");
      return;
    }
    reopenTicket(
      activeTicket.id,
      reopenReasonText.trim(),
      user?.name ? `${user.name} (Officer)` : "Grievance Officer"
    );
    setIsReopenModalOpen(false);
    setReopenReasonText("");
    setReopenError("");
  };

  // Handle Priority Selection
  const handlePrioritySelect = (newPriority: GrievancePriority) => {
    if (!activeTicket) return;
    if (newPriority === activeTicket.priority) return;

    if (newPriority === "Critical") {
      setPendingPriority("Critical");
      setIsCriticalConfirmOpen(true);
    } else {
      changePriority(
        activeTicket.id,
        newPriority,
        undefined,
        user?.name ? `${user.name} (Officer)` : "District Grievance Cell"
      );
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Detail View vs List View */}
      {activeTicket ? (
        /* ================= GRIEVANCE DETAIL VIEW ================= */
        <div className="flex flex-col gap-6">
          {/* Top Bar with Contextual Back Button */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <BackButton
              id="btn-back-to-grievances"
              onClick={() => setSelectedTicketId(null)}
              label={t("govtGrievances.backToGrievances") || "Back to Grievances"}
            />
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">
                Last updated: {activeTicket.lastUpdated}
              </span>
            </div>
          </div>

          {/* Ticket Header Banner */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-xs">
            <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-lg bg-gray-100 px-2.5 py-1 text-xs font-mono font-bold text-gray-800">
                    {activeTicket.id}
                  </span>
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${
                      STATUS_BADGES[activeTicket.status].badgeClass
                    }`}
                  >
                    {STATUS_BADGES[activeTicket.status].icon}
                    <span>{activeTicket.status}</span>
                  </span>
                  <span
                    className={`rounded-full border px-2.5 py-0.5 text-xs ${
                      PRIORITY_BADGES[activeTicket.priority]
                    }`}
                  >
                    Priority: {activeTicket.priority}
                  </span>
                  <span className="rounded-lg bg-[#E4F0DD] px-2.5 py-0.5 text-xs font-semibold text-[#174D25]">
                    {activeTicket.category}
                  </span>
                </div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                  {activeTicket.description}
                </h1>
              </div>

              {/* Priority Selector Pill */}
              <div className="shrink-0 flex items-center gap-1.5 bg-gray-50 p-2 rounded-xl border border-gray-200">
                <span className="text-xs font-semibold text-gray-600">
                  {t("govtGrievances.priority") || "Priority"}:
                </span>
                <select
                  id="select-ticket-priority"
                  value={activeTicket.priority}
                  onChange={(e) =>
                    handlePrioritySelect(e.target.value as GrievancePriority)
                  }
                  className="rounded-lg border border-gray-300 bg-white px-2 py-1 text-xs font-semibold text-gray-800 focus:border-[#24833A] focus:outline-hidden"
                >
                  {ALL_PRIORITIES.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Meta Grid */}
            <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 border-t border-gray-100 pt-4 text-xs text-gray-600">
              <div className="flex items-center gap-2">
                <User size={16} className="text-gray-400 shrink-0" />
                <span>
                  <strong className="text-gray-900">Farmer:</strong>{" "}
                  {activeTicket.farmerName}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin size={16} className="text-gray-400 shrink-0" />
                <span>
                  <strong className="text-gray-900">Location:</strong>{" "}
                  {activeTicket.village}, {activeTicket.mandal},{" "}
                  {activeTicket.district}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={16} className="text-gray-400 shrink-0" />
                <span>
                  <strong className="text-gray-900">Reported:</strong>{" "}
                  {activeTicket.dateReported}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <UserCheck size={16} className="text-gray-400 shrink-0" />
                <span>
                  <strong className="text-gray-900">Assigned Officer:</strong>{" "}
                  {activeTicket.assignedOfficer || "Unassigned"}
                </span>
              </div>
            </div>

            {/* Context-Sensitive Status Action Bar */}
            <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-gray-100 pt-4">
              {/* Action: Assign Officer */}
              {activeTicket.status !== "Resolved" &&
                activeTicket.status !== "Closed" && (
                  <button
                    id="btn-open-assign-modal"
                    type="button"
                    onClick={() => setIsAssignModalOpen(true)}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-indigo-200 bg-indigo-50 px-3.5 py-2 text-xs font-semibold text-indigo-700 hover:bg-indigo-100 active:scale-95 transition"
                  >
                    <UserCheck size={14} />
                    <span>
                      {activeTicket.assignedOfficer
                        ? "Reassign Officer"
                        : t("govtGrievances.assignOfficer") || "Assign Officer"}
                    </span>
                  </button>
                )}

              {/* Action: Start Investigation */}
              {(activeTicket.status === "Open" ||
                activeTicket.status === "Assigned") && (
                <button
                  id="btn-start-investigation"
                  type="button"
                  onClick={() =>
                    startInvestigation(
                      activeTicket.id,
                      undefined,
                      user?.name ? `${user.name} (Officer)` : "Assigned Officer"
                    )
                  }
                  className="inline-flex items-center gap-1.5 rounded-xl bg-[#24833A] px-3.5 py-2 text-xs font-semibold text-white hover:bg-[#1b6b2e] active:scale-95 transition"
                >
                  <Eye size={14} />
                  <span>
                    {t("govtGrievances.startInvestigation") ||
                      "Start Investigation"}
                  </span>
                </button>
              )}

              {/* Action: Request Farmer Information */}
              {activeTicket.status !== "Resolved" &&
                activeTicket.status !== "Closed" && (
                  <button
                    id="btn-open-request-info-modal"
                    type="button"
                    onClick={() => setIsRequestInfoModalOpen(true)}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-amber-300 bg-amber-50 px-3.5 py-2 text-xs font-semibold text-amber-900 hover:bg-amber-100 active:scale-95 transition"
                  >
                    <HelpCircle size={14} />
                    <span>
                      {t("govtGrievances.requestFarmerInfo") ||
                        "Request Farmer Information"}
                    </span>
                  </button>
                )}

              {/* Action: Mark Resolved */}
              {activeTicket.status !== "Resolved" &&
                activeTicket.status !== "Closed" && (
                  <button
                    id="btn-open-resolve-modal"
                    type="button"
                    onClick={() => setIsResolveModalOpen(true)}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-700 px-3.5 py-2 text-xs font-semibold text-white hover:bg-emerald-800 active:scale-95 transition"
                  >
                    <CheckCircle2 size={14} />
                    <span>
                      {t("govtGrievances.markResolved") || "Mark Resolved"}
                    </span>
                  </button>
                )}

              {/* Action: Close Ticket */}
              {activeTicket.status === "Resolved" && (
                <button
                  id="btn-open-close-modal"
                  type="button"
                  onClick={() => setIsCloseModalOpen(true)}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-gray-800 px-3.5 py-2 text-xs font-semibold text-white hover:bg-gray-900 active:scale-95 transition"
                >
                  <FolderLock size={14} />
                  <span>
                    {t("govtGrievances.closeTicket") || "Close Ticket"}
                  </span>
                </button>
              )}

              {/* Action: Reopen Ticket */}
              {(activeTicket.status === "Resolved" ||
                activeTicket.status === "Closed") && (
                <button
                  id="btn-open-reopen-modal"
                  type="button"
                  onClick={() => setIsReopenModalOpen(true)}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-gray-300 bg-white px-3.5 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 active:scale-95 transition"
                >
                  <RotateCcw size={14} />
                  <span>
                    {t("govtGrievances.reopenTicket") || "Reopen Ticket"}
                  </span>
                </button>
              )}
            </div>
          </div>

          {/* Alert Box for Requested Info */}
          {activeTicket.infoRequestReason && (
            <div className="rounded-2xl border border-amber-200 bg-amber-50/80 p-4 shadow-2xs">
              <div className="flex items-start gap-3">
                <HelpCircle size={20} className="text-amber-700 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-amber-900">
                    {t("govtGrievances.infoRequested") ||
                      "Information Requested from Farmer"}
                  </h4>
                  <p className="text-xs text-amber-800">
                    {activeTicket.infoRequestReason}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Resolution Notes Box */}
          {activeTicket.resolutionNotes && (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50/80 p-4 shadow-2xs">
              <div className="flex items-start gap-3">
                <CheckCircle2
                  size={20}
                  className="text-emerald-700 shrink-0 mt-0.5"
                />
                <div className="space-y-1">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-900">
                    {t("govtGrievances.resolutionNotes") || "Resolution Notes"}
                  </h4>
                  <p className="text-xs text-emerald-800">
                    {activeTicket.resolutionNotes}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Main Grid: Details on Left, Timeline on Right */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column: Complaint & Case Context (2 cols) */}
            <div className="lg:col-span-2 space-y-4">
              <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-2xs space-y-4">
                <h3 className="text-base font-bold text-gray-900">
                  {t("govtGrievances.complaintDescription") ||
                    "Grievance Complaint Details"}
                </h3>
                <p className="text-sm text-gray-700 leading-relaxed bg-gray-50/70 p-4 rounded-xl border border-gray-100">
                  {activeTicket.description}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-2">
                  <div className="rounded-xl border border-gray-100 bg-white p-3">
                    <span className="font-bold text-gray-500 block mb-1">
                      Farmer Profile Reference
                    </span>
                    <p className="font-semibold text-gray-800">
                      {activeTicket.farmerName}
                    </p>
                    <p className="text-gray-500 mt-0.5">
                      Contact: {activeTicket.farmerMobile || "Masked"}
                    </p>
                  </div>
                  <div className="rounded-xl border border-gray-100 bg-white p-3">
                    <span className="font-bold text-gray-500 block mb-1">
                      Administrative Officer In-Charge
                    </span>
                    <p className="font-semibold text-gray-800">
                      {activeTicket.assignedOfficer || "Pending Assignment"}
                    </p>
                    <p className="text-gray-500 mt-0.5">
                      Status: {activeTicket.status}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Activity Timeline (1 col) */}
            <div className="space-y-4">
              <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <Clock size={18} className="text-gray-500" />
                <span>
                  {t("govtGrievances.activityTimeline") || "Activity Timeline"}
                </span>
              </h3>

              <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-2xs space-y-4">
                {activeTicket.timeline.length === 0 ? (
                  <p className="text-xs text-gray-500">No events logged.</p>
                ) : (
                  <div className="relative pl-5 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-200 space-y-4">
                    {activeTicket.timeline.map((event, idx) => (
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
        /* ================= GRIEVANCES LIST VIEW ================= */
        <>
          {/* Header & Main Back Button */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <BackButton
                id="btn-back-to-dashboard"
                href="/dashboard"
                label={
                  t("govtGrievances.backToDashboard") || "Back to Dashboard"
                }
              />
              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                {t("govtGrievances.title") || "Farmer Grievances"}
              </h1>
              <p className="text-xs sm:text-sm text-gray-600">
                {t("govtGrievances.subtitle") ||
                  "Track complaints, assign follow-up actions and monitor resolution."}
              </p>
            </div>

            {/* Actions: Export CSV */}
            <div className="flex items-center gap-2">
              <button
                id="btn-export-grievances-csv"
                type="button"
                onClick={handleExportCsv}
                className="inline-flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-3.5 py-2 text-xs font-semibold text-gray-700 shadow-2xs hover:bg-gray-50 active:scale-95 transition"
              >
                <Download size={15} />
                <span>{t("govtGrievances.exportCsv") || "Export CSV"}</span>
              </button>
            </div>
          </div>

          {/* Dynamic Summary Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            <div className="rounded-2xl border border-gray-200 bg-white p-3.5 shadow-2xs">
              <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500">
                {t("govtGrievances.totalTickets") || "Total Tickets"}
              </span>
              <p className="mt-1 text-2xl font-black text-gray-900">
                {metrics.total}
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-3.5 shadow-2xs">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600">
                {t("govtGrievances.open") || "Open"}
              </span>
              <p className="mt-1 text-2xl font-black text-slate-800">
                {metrics.open}
              </p>
            </div>
            <div className="rounded-2xl border border-amber-200 bg-amber-50/60 p-3.5 shadow-2xs">
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700">
                {t("govtGrievances.highPriority") || "High Priority"}
              </span>
              <p className="mt-1 text-2xl font-black text-amber-800">
                {metrics.highPriority}
              </p>
            </div>
            <div className="rounded-2xl border border-purple-200 bg-purple-50/60 p-3.5 shadow-2xs">
              <span className="text-[11px] font-bold uppercase tracking-wider text-purple-700">
                {t("govtGrievances.awaitingFieldAssignment") || "Awaiting Assignment"}
              </span>
              <p className="mt-1 text-2xl font-black text-purple-800">
                {metrics.awaitingFieldAssignment}
              </p>
            </div>
            <div className="rounded-2xl border border-blue-200 bg-blue-50/60 p-3.5 shadow-2xs">
              <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700">
                {t("govtGrievances.inProgress") || "In Progress"}
              </span>
              <p className="mt-1 text-2xl font-black text-blue-800">
                {metrics.inProgress}
              </p>
            </div>
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-3.5 shadow-2xs">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">
                {t("govtGrievances.resolved") || "Resolved"}
              </span>
              <p className="mt-1 text-2xl font-black text-emerald-800">
                {metrics.resolved}
              </p>
            </div>
          </div>

          {/* Search & Multi-Filters Toolbar */}
          <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-2xs space-y-3">
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Search Bar */}
              <div className="relative flex-1">
                <Search
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  id="input-grievance-search"
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={
                    t("govtGrievances.searchPlaceholder") ||
                    "Search ticket ID, farmer name, category, district, mandal, or officer..."
                  }
                  className="w-full rounded-xl border border-gray-200 bg-gray-50/60 py-2 pl-9 pr-4 text-xs text-gray-900 placeholder:text-gray-400 focus:border-[#24833A] focus:bg-white focus:outline-hidden"
                />
              </div>

              {/* District Filter Dropdown */}
              <div className="sm:w-44 shrink-0">
                <select
                  id="select-grievance-district"
                  value={districtFilter}
                  onChange={(e) => setDistrictFilter(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50/60 py-2 px-3 text-xs text-gray-800 focus:border-[#24833A] focus:bg-white focus:outline-hidden"
                >
                  <option value="all">
                    {t("govtGrievances.allDistricts") || "All Districts"}
                  </option>
                  {availableDistricts.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              {/* Category Filter Dropdown */}
              <div className="sm:w-52 shrink-0">
                <select
                  id="select-grievance-category"
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50/60 py-2 px-3 text-xs text-gray-800 focus:border-[#24833A] focus:bg-white focus:outline-hidden"
                >
                  <option value="all">
                    {t("govtGrievances.allCategories") || "All Categories"}
                  </option>
                  {ALL_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Priority Filter Dropdown */}
              <div className="sm:w-40 shrink-0">
                <select
                  id="select-grievance-priority"
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50/60 py-2 px-3 text-xs text-gray-800 focus:border-[#24833A] focus:bg-white focus:outline-hidden"
                >
                  <option value="all">
                    {t("govtGrievances.allPriorities") || "All Priorities"}
                  </option>
                  {ALL_PRIORITIES.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Status Filter Chips + Clear Button */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-gray-100">
              <div className="flex flex-wrap items-center gap-1.5">
                {[
                  { id: "all", label: "All" },
                  { id: "Open", label: "Open" },
                  {
                    id: "Awaiting Field Assignment",
                    label: "Awaiting Assignment",
                  },
                  { id: "Assigned", label: "Assigned" },
                  { id: "In Progress", label: "In Progress" },
                  {
                    id: "Awaiting Farmer Information",
                    label: "Awaiting Info",
                  },
                  { id: "Resolved", label: "Resolved" },
                  { id: "Closed", label: "Closed" },
                ].map((chip) => {
                  const isActive = statusFilter === chip.id;
                  return (
                    <button
                      key={chip.id}
                      id={`grievance-chip-${chip.id.replace(/\s+/g, "-")}`}
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

              {(searchQuery ||
                statusFilter !== "all" ||
                priorityFilter !== "all" ||
                categoryFilter !== "all" ||
                districtFilter !== "all") && (
                <button
                  id="btn-clear-grievance-filters"
                  type="button"
                  onClick={handleClearFilters}
                  className="text-xs font-semibold text-[#24833A] hover:underline cursor-pointer"
                >
                  {t("govtGrievances.clearFilters") || "Clear Filters"}
                </button>
              )}
            </div>
          </div>

          {/* Grievance List: Responsive Table / Stacked Card Hybrid */}
          {filteredTickets.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-12 text-center">
              <FileText size={40} className="mx-auto text-gray-300 mb-2" />
              <p className="text-sm font-semibold text-gray-700">
                {t("govtGrievances.noTicketsFound") ||
                  "No grievance tickets found matching the selected filters."}
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
              {/* Desktop Table View (hidden on small mobile) */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left text-xs text-gray-600 border-collapse">
                  <thead className="border-b border-gray-200 bg-gray-50/75 text-[11px] font-bold uppercase tracking-wider text-gray-500">
                    <tr>
                      <th className="py-3.5 px-4">Ticket Reference</th>
                      <th className="py-3.5 px-4">Category</th>
                      <th className="py-3.5 px-4">Location</th>
                      <th className="py-3.5 px-4">Reported</th>
                      <th className="py-3.5 px-4">Priority</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-4">Assigned Officer</th>
                      <th className="py-3.5 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredTickets.map((ticket) => (
                      <tr
                        key={ticket.id}
                        id={`ticket-row-${ticket.id}`}
                        className="hover:bg-gray-50/60 transition group cursor-pointer"
                        onClick={() => setSelectedTicketId(ticket.id)}
                      >
                        <td className="py-3 px-4 font-mono font-bold text-gray-900">
                          {ticket.id}
                          <span className="block font-sans text-[11px] font-normal text-gray-500">
                            {ticket.farmerName}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="rounded-md bg-[#E4F0DD] px-2 py-0.5 text-[11px] font-semibold text-[#174D25]">
                            {ticket.category}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-gray-800">
                          {ticket.village}, {ticket.mandal}
                          <span className="block text-[11px] text-gray-500">
                            {ticket.district}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-gray-600">
                          {ticket.dateReported}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`rounded-full border px-2 py-0.5 text-[10px] ${
                              PRIORITY_BADGES[ticket.priority]
                            }`}
                          >
                            {ticket.priority}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-semibold ${
                              STATUS_BADGES[ticket.status].badgeClass
                            }`}
                          >
                            {STATUS_BADGES[ticket.status].icon}
                            <span>{ticket.status}</span>
                          </span>
                        </td>
                        <td className="py-3 px-4 text-gray-700 truncate max-w-[150px]">
                          {ticket.assignedOfficer || (
                            <span className="italic text-gray-400">
                              Unassigned
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            id={`btn-review-${ticket.id}`}
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedTicketId(ticket.id);
                            }}
                            className="inline-flex items-center gap-1 rounded-lg bg-[#24833A] px-2.5 py-1 text-xs font-semibold text-white hover:bg-[#1b6b2e] transition"
                          >
                            <span>{t("govtGrievances.review") || "Review"}</span>
                            <ArrowRight size={12} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Stacked Card View (hidden on desktop) */}
              <div className="md:hidden divide-y divide-gray-100">
                {filteredTickets.map((ticket) => (
                  <div
                    key={ticket.id}
                    id={`ticket-card-mobile-${ticket.id}`}
                    onClick={() => setSelectedTicketId(ticket.id)}
                    className="p-4 space-y-3 cursor-pointer hover:bg-gray-50/60 transition"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-xs text-gray-900 bg-gray-100 px-2 py-0.5 rounded">
                        {ticket.id}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`rounded-full border px-2 py-0.5 text-[10px] ${
                            PRIORITY_BADGES[ticket.priority]
                          }`}
                        >
                          {ticket.priority}
                        </span>
                        <span
                          className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold ${
                            STATUS_BADGES[ticket.status].badgeClass
                          }`}
                        >
                          {ticket.status}
                        </span>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-xs font-bold text-gray-900 line-clamp-2">
                        {ticket.description}
                      </h4>
                      <p className="mt-1 text-[11px] text-gray-500">
                        {ticket.farmerName} • {ticket.village}, {ticket.district}
                      </p>
                    </div>

                    <div className="flex items-center justify-between text-[11px] pt-1 border-t border-gray-50 text-gray-500">
                      <span>Reported: {ticket.dateReported}</span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedTicketId(ticket.id);
                        }}
                        className="font-bold text-[#24833A] flex items-center gap-1"
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

      {/* ================= MODAL: ASSIGN OFFICER ================= */}
      {isAssignModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4"
        >
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <UserCheck size={18} className="text-indigo-600" />
                <span>
                  {t("govtGrievances.assignOfficerModalTitle") ||
                    "Assign Officer to Grievance"}
                </span>
              </h3>
              <button
                type="button"
                onClick={() => setIsAssignModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-gray-700 block mb-1">
                  {t("govtGrievances.selectOfficer") || "Select Officer *"}
                </label>
                <select
                  id="select-officer-assignment"
                  value={selectedOfficer}
                  onChange={(e) => setSelectedOfficer(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 p-2.5 text-xs text-gray-900 focus:border-[#24833A] focus:outline-hidden"
                >
                  {DEMO_OFFICERS_LIST.map((officer) => (
                    <option key={officer} value={officer}>
                      {officer}
                    </option>
                  ))}
                </select>
                {assignError && (
                  <p className="text-[11px] text-red-600 mt-1">{assignError}</p>
                )}
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">
                  {t("govtGrievances.assignmentNote") ||
                    "Assignment Note (Optional)"}
                </label>
                <textarea
                  id="textarea-assignment-note"
                  rows={2}
                  value={assignmentNote}
                  onChange={(e) => setAssignmentNote(e.target.value)}
                  placeholder="e.g. Please conduct an urgent site inspection and verify canal damage extent."
                  className="w-full rounded-xl border border-gray-200 p-2.5 text-xs text-gray-900 focus:border-[#24833A] focus:outline-hidden"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 border-t border-gray-100 pt-3">
              <button
                type="button"
                onClick={() => setIsAssignModalOpen(false)}
                className="rounded-xl border border-gray-200 px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition"
              >
                {t("govtGrievances.cancel") || "Cancel"}
              </button>
              <button
                id="btn-confirm-assign-officer"
                type="button"
                onClick={handleConfirmAssign}
                className="rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-700 transition"
              >
                {t("govtGrievances.confirmAssignmentBtn") ||
                  "Confirm Assignment"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: REQUEST FARMER INFORMATION ================= */}
      {isRequestInfoModalOpen && (
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
                  {t("govtGrievances.requestInfoModalTitle") ||
                    "Request Farmer Information"}
                </span>
              </h3>
              <button
                type="button"
                onClick={() => setIsRequestInfoModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-gray-700 block mb-1">
                  {t("govtGrievances.requestInfoReason") ||
                    "Required Clarification / Document *"}
                </label>
                <textarea
                  id="textarea-request-info-reason"
                  rows={3}
                  value={requestInfoReason}
                  onChange={(e) => {
                    setRequestInfoReason(e.target.value);
                    if (e.target.value.trim()) setRequestInfoError("");
                  }}
                  placeholder="e.g. Please provide a copy of your active bank passbook showing NPCI Aadhaar seeding stamp."
                  className="w-full rounded-xl border border-gray-200 p-2.5 text-xs text-gray-900 focus:border-amber-600 focus:outline-hidden"
                />
                {requestInfoError && (
                  <p className="text-[11px] text-red-600 mt-1">
                    {requestInfoError}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 border-t border-gray-100 pt-3">
              <button
                type="button"
                onClick={() => setIsRequestInfoModalOpen(false)}
                className="rounded-xl border border-gray-200 px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition"
              >
                {t("govtGrievances.cancel") || "Cancel"}
              </button>
              <button
                id="btn-confirm-request-info"
                type="button"
                onClick={handleConfirmRequestInfo}
                className="rounded-xl bg-amber-600 px-4 py-2 text-xs font-semibold text-white hover:bg-amber-700 transition"
              >
                {t("govtGrievances.confirmRequestInfoBtn") ||
                  "Send Information Request"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: MARK RESOLVED ================= */}
      {isResolveModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4"
        >
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <CheckCircle2 size={18} className="text-emerald-600" />
                <span>
                  {t("govtGrievances.resolveModalTitle") ||
                    "Mark Grievance Resolved"}
                </span>
              </h3>
              <button
                type="button"
                onClick={() => setIsResolveModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-gray-700 block mb-1">
                  {t("govtGrievances.resolutionSummary") ||
                    "Resolution Summary *"}
                </label>
                <textarea
                  id="textarea-resolution-summary"
                  rows={3}
                  value={resolutionSummaryText}
                  onChange={(e) => {
                    setResolutionSummaryText(e.target.value);
                    if (e.target.value.trim()) setResolveError("");
                  }}
                  placeholder="Outline field action taken, replacement issued or scheme disbursement confirmed..."
                  className="w-full rounded-xl border border-gray-200 p-2.5 text-xs text-gray-900 focus:border-emerald-600 focus:outline-hidden"
                />
                {resolveError && (
                  <p className="text-[11px] text-red-600 mt-1">{resolveError}</p>
                )}
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 border-t border-gray-100 pt-3">
              <button
                type="button"
                onClick={() => setIsResolveModalOpen(false)}
                className="rounded-xl border border-gray-200 px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition"
              >
                {t("govtGrievances.cancel") || "Cancel"}
              </button>
              <button
                id="btn-confirm-resolve-ticket"
                type="button"
                onClick={handleConfirmResolve}
                className="rounded-xl bg-emerald-700 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-800 transition"
              >
                {t("govtGrievances.confirmResolveBtn") || "Confirm Resolution"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: CLOSE TICKET ================= */}
      {isCloseModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4"
        >
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl space-y-4">
            <div className="flex items-center gap-3 text-gray-800">
              <div className="rounded-full bg-gray-100 p-2">
                <FolderLock size={20} />
              </div>
              <h3 className="text-base font-bold text-gray-900">
                {t("govtGrievances.closeModalTitle") || "Close Grievance Ticket"}
              </h3>
            </div>
            <p className="text-xs text-gray-600">
              {t("govtGrievances.closeModalText") ||
                "Confirm that all field actions and farmer communications are concluded."}
            </p>
            <div className="flex items-center justify-end gap-2 border-t border-gray-100 pt-3">
              <button
                type="button"
                onClick={() => setIsCloseModalOpen(false)}
                className="rounded-xl border border-gray-200 px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition"
              >
                {t("govtGrievances.cancel") || "Cancel"}
              </button>
              <button
                id="btn-confirm-close-ticket"
                type="button"
                onClick={handleConfirmClose}
                className="rounded-xl bg-gray-800 px-4 py-2 text-xs font-semibold text-white hover:bg-gray-900 transition"
              >
                {t("govtGrievances.confirmCloseBtn") || "Close Ticket"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: REOPEN TICKET ================= */}
      {isReopenModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4"
        >
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <RotateCcw size={18} className="text-gray-700" />
                <span>
                  {t("govtGrievances.reopenModalTitle") ||
                    "Reopen Grievance Ticket"}
                </span>
              </h3>
              <button
                type="button"
                onClick={() => setIsReopenModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-gray-700 block mb-1">
                  {t("govtGrievances.reopenReason") || "Reason for Reopening *"}
                </label>
                <textarea
                  id="textarea-reopen-reason"
                  rows={3}
                  value={reopenReasonText}
                  onChange={(e) => {
                    setReopenReasonText(e.target.value);
                    if (e.target.value.trim()) setReopenError("");
                  }}
                  placeholder="State reason why ticket is being reopened..."
                  className="w-full rounded-xl border border-gray-200 p-2.5 text-xs text-gray-900 focus:border-[#24833A] focus:outline-hidden"
                />
                {reopenError && (
                  <p className="text-[11px] text-red-600 mt-1">{reopenError}</p>
                )}
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 border-t border-gray-100 pt-3">
              <button
                type="button"
                onClick={() => setIsReopenModalOpen(false)}
                className="rounded-xl border border-gray-200 px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition"
              >
                {t("govtGrievances.cancel") || "Cancel"}
              </button>
              <button
                id="btn-confirm-reopen-ticket"
                type="button"
                onClick={handleConfirmReopen}
                className="rounded-xl bg-[#24833A] px-4 py-2 text-xs font-semibold text-white hover:bg-[#1b6b2e] transition"
              >
                {t("govtGrievances.confirmReopenBtn") || "Reopen Ticket"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: CONFIRM CRITICAL PRIORITY ================= */}
      {isCriticalConfirmOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4"
        >
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl space-y-4">
            <div className="flex items-center gap-3 text-rose-700">
              <div className="rounded-full bg-rose-100 p-2">
                <AlertTriangle size={22} />
              </div>
              <h3 className="text-base font-bold text-gray-900">
                {t("govtGrievances.confirmCriticalTitle") ||
                  "Confirm Critical Priority Escalation"}
              </h3>
            </div>
            <p className="text-xs text-gray-600 leading-relaxed">
              {t("govtGrievances.confirmCriticalText") ||
                "Elevating this ticket to Critical priority signals immediate urgency to district administrative leadership."}
            </p>
            <div className="flex items-center justify-end gap-2 border-t border-gray-100 pt-3">
              <button
                type="button"
                onClick={() => setIsCriticalConfirmOpen(false)}
                className="rounded-xl border border-gray-200 px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition"
              >
                {t("govtGrievances.cancel") || "Cancel"}
              </button>
              <button
                id="btn-confirm-critical-priority"
                type="button"
                onClick={() => {
                  if (activeTicket) {
                    changePriority(
                      activeTicket.id,
                      "Critical",
                      "Priority escalated to Critical following administrative review.",
                      user?.name ? `${user.name} (Officer)` : "District Grievance Cell"
                    );
                  }
                  setIsCriticalConfirmOpen(false);
                }}
                className="rounded-xl bg-rose-700 px-4 py-2 text-xs font-semibold text-white hover:bg-rose-800 transition"
              >
                {t("govtGrievances.confirmCriticalBtn") ||
                  "Confirm Critical Escalation"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
