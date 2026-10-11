"use client";

import React, { useState, useMemo } from "react";
import {
  Landmark,
  Search,
  Filter,
  Plus,
  FileText,
  Users,
  CheckCircle2,
  Clock,
  ChevronRight,
  Calendar,
  Building2,
  ShieldCheck,
  AlertCircle,
  Eye,
  Edit,
  Power,
  Layers,
  ArrowRight,
  TrendingUp,
} from "lucide-react";
import BackButton from "@/components/ui/BackButton";
import {
  GovtSchemeItem,
  GovtSchemeStatus,
  GovtApplicationItem,
  GovtApplicationStatus,
  useGovernmentStore,
} from "@/store/government-store";
import GovtApplicationDetailModal from "./GovtApplicationDetailModal";
import GovtSchemeFormModal from "./GovtSchemeFormModal";

type ViewMode = "registry" | "details" | "applications";

export default function GovtSchemesHub() {
  const { schemes, applications, toggleSchemeStatus } = useGovernmentStore();

  const [viewMode, setViewMode] = useState<ViewMode>("registry");
  const [selectedSchemeId, setSelectedSchemeId] = useState<string | null>(null);
  const [selectedApplication, setSelectedApplication] = useState<GovtApplicationItem | null>(null);

  // Filter & Search States for Schemes
  const [schemeSearch, setSchemeSearch] = useState("");
  const [schemeFilter, setSchemeFilter] = useState<"all" | GovtSchemeStatus>("all");

  // Filter & Search States for Applications
  const [appSearch, setAppSearch] = useState("");
  const [appFilter, setAppFilter] = useState<"all" | GovtApplicationStatus>("all");

  // Scheme Form Modal State
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [schemeToEdit, setSchemeToEdit] = useState<GovtSchemeItem | null>(null);

  // Selected scheme object
  const selectedScheme = useMemo(() => {
    return schemes.find((s) => s.id === selectedSchemeId) || null;
  }, [schemes, selectedSchemeId]);

  // Overall Statistics Calculation
  const activeSchemesCount = schemes.filter((s) => s.status === "active").length;
  const totalApplicationsCount = applications.length;
  const pendingVerificationCount = applications.filter(
    (a) => a.status === "pending" || a.status === "under_verification"
  ).length;
  const approvedBenefitedCount = applications.filter(
    (a) => a.status === "approved" || a.status === "disbursed"
  ).length;

  // Filtered Schemes List
  const filteredSchemes = useMemo(() => {
    return schemes.filter((s) => {
      const matchesFilter = schemeFilter === "all" || s.status === schemeFilter;
      const matchesSearch =
        schemeSearch.trim() === "" ||
        s.name.toLowerCase().includes(schemeSearch.toLowerCase()) ||
        s.department.toLowerCase().includes(schemeSearch.toLowerCase()) ||
        s.category.toLowerCase().includes(schemeSearch.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [schemes, schemeFilter, schemeSearch]);

  // Filtered Applications List
  const filteredApplications = useMemo(() => {
    return applications.filter((app) => {
      const matchesScheme = !selectedSchemeId || app.schemeId === selectedSchemeId;
      const matchesFilter = appFilter === "all" || app.status === appFilter;
      const matchesSearch =
        appSearch.trim() === "" ||
        app.farmerName.toLowerCase().includes(appSearch.toLowerCase()) ||
        app.id.toLowerCase().includes(appSearch.toLowerCase()) ||
        app.mandal.toLowerCase().includes(appSearch.toLowerCase()) ||
        app.district.toLowerCase().includes(appSearch.toLowerCase());
      return matchesScheme && matchesFilter && matchesSearch;
    });
  }, [applications, selectedSchemeId, appFilter, appSearch]);

  const getStatusBadge = (status: GovtSchemeStatus) => {
    switch (status) {
      case "active":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-[#174D25] border border-emerald-200">
            <CheckCircle2 size={11} /> Active
          </span>
        );
      case "draft":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-0.5 text-[10px] font-bold text-gray-700 border border-gray-200">
            <Clock size={11} /> Draft
          </span>
        );
      case "closed":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2.5 py-0.5 text-[10px] font-bold text-red-800 border border-red-200">
            Closed
          </span>
        );
    }
  };

  const getAppStatusBadge = (status: GovtApplicationStatus) => {
    switch (status) {
      case "approved":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-[#174D25] border border-emerald-200">
            <CheckCircle2 size={10} /> Approved
          </span>
        );
      case "disbursed":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-800 border border-blue-200">
            <CheckCircle2 size={10} /> Disbursed
          </span>
        );
      case "under_verification":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-purple-50 px-2 py-0.5 text-[10px] font-bold text-purple-800 border border-purple-200">
            <Clock size={10} /> Verifying
          </span>
        );
      case "rejected":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2 py-0.5 text-[10px] font-bold text-red-800 border border-red-200">
            Rejected
          </span>
        );
      case "pending":
      default:
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-800 border border-amber-200">
            <Clock size={10} /> Pending
          </span>
        );
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-5 pb-16">
      {/* Contextual Back Navigation */}
      <div className="flex items-center justify-between">
        {viewMode === "registry" ? (
          <BackButton href="/dashboard" label="Back to Dashboard" />
        ) : viewMode === "details" ? (
          <BackButton
            onClick={() => {
              setViewMode("registry");
              setSelectedSchemeId(null);
            }}
            label="Back to Schemes Registry"
          />
        ) : (
          <BackButton
            onClick={() => {
              if (selectedSchemeId) {
                setViewMode("details");
              } else {
                setViewMode("registry");
              }
            }}
            label={selectedSchemeId ? "Back to Scheme Details" : "Back to Schemes Registry"}
          />
        )}
      </div>

      {/* Main Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-3xl bg-white p-5 border border-gray-200 shadow-2xs">
        <div className="flex items-center gap-3.5">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#E4F0DD] text-[#24833A] shadow-xs">
            <Landmark size={26} strokeWidth={2.4} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-bold text-gray-900">
                Government Schemes & Welfare
              </h1>
              <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-[#24833A] border border-emerald-200">
                Administrative Desk
              </span>
            </div>
            <p className="text-xs text-gray-500 font-medium">
              Manage government schemes, subsidies, welfare programs and farmer applications.
            </p>
          </div>
        </div>

        {viewMode === "registry" && (
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              type="button"
              onClick={() => {
                setSelectedSchemeId(null);
                setViewMode("applications");
              }}
              className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-xs font-bold text-gray-700 hover:bg-gray-50 transition cursor-pointer"
            >
              <Users size={14} className="text-gray-500" />
              <span>Applications ({totalApplicationsCount})</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setSchemeToEdit(null);
                setIsFormModalOpen(true);
              }}
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#24833A] px-3.5 py-2 text-xs font-bold text-white hover:bg-[#174D25] transition shadow-xs cursor-pointer"
            >
              <Plus size={14} strokeWidth={2.4} />
              <span>Register Scheme</span>
            </button>
          </div>
        )}
      </div>

      {/* Scheme Registry Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-2xs">
          <span className="text-[11px] font-medium text-gray-500">Total Active Schemes</span>
          <div className="flex items-baseline gap-1.5 mt-1">
            <span className="text-xl font-extrabold text-[#174D25]">{activeSchemesCount}</span>
            <span className="text-[11px] text-gray-400 font-medium">/ {schemes.length} Total</span>
          </div>
          <span className="text-[10px] font-semibold text-emerald-700 mt-0.5 block">
            Open for enrollment
          </span>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-2xs">
          <span className="text-[11px] font-medium text-gray-500">Applications Received</span>
          <div className="flex items-baseline gap-1.5 mt-1">
            <span className="text-xl font-extrabold text-blue-900">{totalApplicationsCount}</span>
            <span className="text-[11px] text-gray-400 font-medium">Demo Records</span>
          </div>
          <span className="text-[10px] font-semibold text-blue-700 mt-0.5 block">
            Across notified mandals
          </span>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-2xs">
          <span className="text-[11px] font-medium text-gray-500">Pending Verification</span>
          <div className="flex items-baseline gap-1.5 mt-1">
            <span className="text-xl font-extrabold text-amber-700">
              {pendingVerificationCount}
            </span>
          </div>
          <span className="text-[10px] font-semibold text-amber-600 mt-0.5 block">
            Needs officer review
          </span>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-2xs">
          <span className="text-[11px] font-medium text-gray-500">Approved / Benefited</span>
          <div className="flex items-baseline gap-1.5 mt-1">
            <span className="text-xl font-extrabold text-[#24833A]">
              {approvedBenefitedCount}
            </span>
          </div>
          <span className="text-[10px] font-semibold text-emerald-700 mt-0.5 block">
            Welfare sanctioned
          </span>
        </div>
      </div>

      {/* ================= VIEW MODE: REGISTRY (SCHEMES LIST) ================= */}
      {viewMode === "registry" && (
        <div className="flex flex-col gap-4">
          {/* Search & Filter Bar */}
          <div className="flex flex-col sm:flex-row gap-2.5 sm:items-center justify-between">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              <button
                type="button"
                onClick={() => setSchemeFilter("all")}
                className={`rounded-xl px-3 py-1.5 text-xs font-bold transition cursor-pointer whitespace-nowrap ${
                  schemeFilter === "all"
                    ? "bg-[#24833A] text-white shadow-xs"
                    : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
                }`}
              >
                All Schemes ({schemes.length})
              </button>
              <button
                type="button"
                onClick={() => setSchemeFilter("active")}
                className={`rounded-xl px-3 py-1.5 text-xs font-bold transition cursor-pointer whitespace-nowrap ${
                  schemeFilter === "active"
                    ? "bg-[#24833A] text-white shadow-xs"
                    : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
                }`}
              >
                Active ({schemes.filter((s) => s.status === "active").length})
              </button>
              <button
                type="button"
                onClick={() => setSchemeFilter("draft")}
                className={`rounded-xl px-3 py-1.5 text-xs font-bold transition cursor-pointer whitespace-nowrap ${
                  schemeFilter === "draft"
                    ? "bg-[#24833A] text-white shadow-xs"
                    : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
                }`}
              >
                Draft ({schemes.filter((s) => s.status === "draft").length})
              </button>
              <button
                type="button"
                onClick={() => setSchemeFilter("closed")}
                className={`rounded-xl px-3 py-1.5 text-xs font-bold transition cursor-pointer whitespace-nowrap ${
                  schemeFilter === "closed"
                    ? "bg-[#24833A] text-white shadow-xs"
                    : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
                }`}
              >
                Closed ({schemes.filter((s) => s.status === "closed").length})
              </button>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                value={schemeSearch}
                onChange={(e) => setSchemeSearch(e.target.value)}
                placeholder="Search scheme name, department..."
                className="w-full sm:w-64 rounded-xl border border-gray-200 bg-white py-1.5 pl-8 pr-3 text-xs text-gray-800 placeholder-gray-400 focus:border-[#24833A] focus:outline-hidden"
              />
            </div>
          </div>

          {/* Schemes Grid */}
          <div className="flex flex-col gap-3">
            {filteredSchemes.map((scheme) => (
              <div
                key={scheme.id}
                className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-5 shadow-2xs transition hover:border-[#24833A]/50 flex flex-col gap-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F4FBF5] text-[#24833A] mt-0.5">
                      <Landmark size={20} />
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-[10px] font-bold text-gray-400">
                          {scheme.id}
                        </span>
                        {getStatusBadge(scheme.status)}
                        <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-[#174D25]">
                          {scheme.category}
                        </span>
                      </div>
                      <h2 className="text-sm sm:text-base font-bold text-gray-900 mt-1">
                        {scheme.name}
                      </h2>
                      <p className="text-xs font-semibold text-[#174D25]">
                        {scheme.department}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedSchemeId(scheme.id);
                        setViewMode("details");
                      }}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-[#24833A] px-3.5 py-1.5 text-xs font-bold text-white hover:bg-[#174D25] transition cursor-pointer shadow-xs"
                    >
                      <span>View Details</span>
                      <ChevronRight size={14} />
                    </button>
                  </div>
                </div>

                <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                  {scheme.description}
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-gray-100 text-xs">
                  <div>
                    <span className="text-[10px] font-medium text-gray-400 uppercase">
                      Benefit Scale
                    </span>
                    <p className="font-bold text-[#174D25]">{scheme.benefitAmount}</p>
                  </div>
                  <div>
                    <span className="text-[10px] font-medium text-gray-400 uppercase">
                      Deadline
                    </span>
                    <p className="font-semibold text-gray-700">{scheme.deadline}</p>
                  </div>
                  <div>
                    <span className="text-[10px] font-medium text-gray-400 uppercase">
                      Applications Count
                    </span>
                    <p className="font-bold text-blue-900">
                      {scheme.applicationsCount.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] font-medium text-gray-400 uppercase">
                      Last Updated
                    </span>
                    <p className="text-gray-500 font-medium">{scheme.lastUpdated}</p>
                  </div>
                </div>
              </div>
            ))}

            {filteredSchemes.length === 0 && (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-white p-8 text-center">
                <Landmark size={32} className="text-gray-300" />
                <p className="mt-2 text-sm font-bold text-gray-700">No Schemes Found</p>
                <p className="text-xs text-gray-500">
                  No schemes match the selected filter or search keyword.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ================= VIEW MODE: DETAILS ================= */}
      {viewMode === "details" && selectedScheme && (
        <div className="flex flex-col gap-4">
          {/* Detail Overview Card */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-2xs flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b border-gray-100 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-gray-400">
                    {selectedScheme.id}
                  </span>
                  {getStatusBadge(selectedScheme.status)}
                  <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-[#174D25]">
                    {selectedScheme.category}
                  </span>
                </div>
                <h2 className="text-lg sm:text-xl font-bold text-gray-900 mt-1">
                  {selectedScheme.name}
                </h2>
                <p className="text-xs font-bold text-[#174D25] mt-0.5">
                  {selectedScheme.department}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => setViewMode("applications")}
                  className="rounded-xl bg-[#24833A] px-3.5 py-1.5 text-xs font-bold text-white hover:bg-[#174D25] transition cursor-pointer shadow-xs"
                >
                  View Applications
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSchemeToEdit(selectedScheme);
                    setIsFormModalOpen(true);
                  }}
                  className="rounded-xl border border-gray-200 bg-white px-3 py-1.5 text-xs font-bold text-gray-700 hover:bg-gray-50 transition cursor-pointer"
                >
                  Edit Scheme
                </button>
                <button
                  type="button"
                  onClick={() => toggleSchemeStatus(selectedScheme.id)}
                  className={`rounded-xl px-3 py-1.5 text-xs font-bold transition cursor-pointer border ${
                    selectedScheme.status === "active"
                      ? "border-red-200 bg-red-50 text-red-700 hover:bg-red-100"
                      : "border-emerald-200 bg-emerald-50 text-emerald-800 hover:bg-emerald-100"
                  }`}
                >
                  {selectedScheme.status === "active" ? "Deactivate Scheme" : "Activate Scheme"}
                </button>
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">
                Scheme Overview
              </h3>
              <p className="text-xs text-gray-700 leading-relaxed">
                {selectedScheme.description}
              </p>
            </div>

            {/* Eligibility & Benefits Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="rounded-xl bg-[#FAFBF9] border border-gray-100 p-3.5 flex flex-col gap-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                  Target Beneficiaries
                </span>
                <p className="text-xs font-semibold text-gray-800">
                  {selectedScheme.targetBeneficiaries}
                </p>
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mt-2">
                  Landholding Criteria
                </span>
                <p className="text-xs font-bold text-emerald-800">
                  {selectedScheme.landRequirement}
                </p>
              </div>

              <div className="rounded-xl bg-[#FAFBF9] border border-gray-100 p-3.5 flex flex-col gap-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                  Financial Benefit
                </span>
                <p className="text-base font-extrabold text-[#174D25]">
                  {selectedScheme.benefitAmount}
                </p>
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mt-2">
                  Application Deadline
                </span>
                <p className="text-xs font-bold text-gray-700">{selectedScheme.deadline}</p>
              </div>
            </div>

            {/* Mandatory Documentation */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                Mandatory Supporting Documents
              </h3>
              <div className="flex flex-wrap gap-2">
                {selectedScheme.requiredDocuments.map((doc, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs font-medium text-gray-700"
                  >
                    <CheckCircle2 size={13} className="text-[#24833A]" />
                    <span>{doc}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= VIEW MODE: APPLICATIONS ================= */}
      {viewMode === "applications" && (
        <div className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-gray-900">
                {selectedScheme ? `Applications for: ${selectedScheme.name}` : "All Farmer Applications"}
              </h2>
              <p className="text-xs text-gray-500">
                Review cultivator credentials, inspect submitted documents, and approve benefits.
              </p>
            </div>
          </div>

          {/* Search & Status Filter Chips */}
          <div className="flex flex-col sm:flex-row gap-2.5 sm:items-center justify-between">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              <button
                type="button"
                onClick={() => setAppFilter("all")}
                className={`rounded-xl px-3 py-1.5 text-xs font-bold transition cursor-pointer whitespace-nowrap ${
                  appFilter === "all"
                    ? "bg-[#24833A] text-white shadow-xs"
                    : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
                }`}
              >
                All ({applications.length})
              </button>
              <button
                type="button"
                onClick={() => setAppFilter("pending")}
                className={`rounded-xl px-3 py-1.5 text-xs font-bold transition cursor-pointer whitespace-nowrap ${
                  appFilter === "pending"
                    ? "bg-amber-600 text-white shadow-xs"
                    : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
                }`}
              >
                Pending ({applications.filter((a) => a.status === "pending").length})
              </button>
              <button
                type="button"
                onClick={() => setAppFilter("under_verification")}
                className={`rounded-xl px-3 py-1.5 text-xs font-bold transition cursor-pointer whitespace-nowrap ${
                  appFilter === "under_verification"
                    ? "bg-purple-700 text-white shadow-xs"
                    : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
                }`}
              >
                Verifying ({applications.filter((a) => a.status === "under_verification").length})
              </button>
              <button
                type="button"
                onClick={() => setAppFilter("approved")}
                className={`rounded-xl px-3 py-1.5 text-xs font-bold transition cursor-pointer whitespace-nowrap ${
                  appFilter === "approved"
                    ? "bg-[#24833A] text-white shadow-xs"
                    : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
                }`}
              >
                Approved ({applications.filter((a) => a.status === "approved").length})
              </button>
              <button
                type="button"
                onClick={() => setAppFilter("rejected")}
                className={`rounded-xl px-3 py-1.5 text-xs font-bold transition cursor-pointer whitespace-nowrap ${
                  appFilter === "rejected"
                    ? "bg-red-600 text-white shadow-xs"
                    : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
                }`}
              >
                Rejected ({applications.filter((a) => a.status === "rejected").length})
              </button>
              <button
                type="button"
                onClick={() => setAppFilter("disbursed")}
                className={`rounded-xl px-3 py-1.5 text-xs font-bold transition cursor-pointer whitespace-nowrap ${
                  appFilter === "disbursed"
                    ? "bg-blue-600 text-white shadow-xs"
                    : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
                }`}
              >
                Disbursed ({applications.filter((a) => a.status === "disbursed").length})
              </button>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                value={appSearch}
                onChange={(e) => setAppSearch(e.target.value)}
                placeholder="Search farmer or App ID..."
                className="w-full sm:w-56 rounded-xl border border-gray-200 bg-white py-1.5 pl-8 pr-3 text-xs text-gray-800 placeholder-gray-400 focus:border-[#24833A] focus:outline-hidden"
              />
            </div>
          </div>

          {/* Applications Records Table / Cards */}
          <div className="flex flex-col gap-2.5">
            {filteredApplications.map((app) => (
              <div
                key={app.id}
                className="rounded-2xl border border-gray-200 bg-white p-4 shadow-2xs transition hover:border-[#24833A]/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-50 text-gray-700">
                    <FileText size={18} />
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-bold text-gray-800">
                        {app.id}
                      </span>
                      {getAppStatusBadge(app.status)}
                      <span className="text-[11px] text-gray-400 font-medium">
                        {app.submittedDate}
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-gray-900 mt-0.5">
                      {app.farmerName}
                    </h3>
                    <p className="text-xs text-gray-500">
                      {app.schemeName} • {app.village}, {app.mandal} ({app.farmerLandholding})
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-100">
                  <div className="text-left sm:text-right">
                    <span className="text-[10px] uppercase font-bold text-gray-400 block">
                      Benefit
                    </span>
                    <span className="text-xs font-extrabold text-[#174D25]">
                      {app.benefitAmount}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setSelectedApplication(app)}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-[#24833A] px-3 py-1.5 text-xs font-bold text-white hover:bg-[#174D25] transition cursor-pointer shadow-xs"
                  >
                    <span>Review Application</span>
                    <ArrowRight size={13} />
                  </button>
                </div>
              </div>
            ))}

            {filteredApplications.length === 0 && (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-white p-8 text-center">
                <FileText size={32} className="text-gray-300" />
                <p className="mt-2 text-sm font-bold text-gray-700">No Applications Found</p>
                <p className="text-xs text-gray-500">
                  No records match the selected filter criteria.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Application Detail Modal */}
      <GovtApplicationDetailModal
        application={selectedApplication}
        isOpen={Boolean(selectedApplication)}
        onClose={() => setSelectedApplication(null)}
      />

      {/* Scheme Create / Edit Form Modal */}
      <GovtSchemeFormModal
        schemeToEdit={schemeToEdit}
        isOpen={isFormModalOpen}
        onClose={() => {
          setIsFormModalOpen(false);
          setSchemeToEdit(null);
        }}
      />
    </div>
  );
}
