"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  BarChart3,
  TrendingUp,
  Users,
  CheckCircle2,
  Clock,
  MapPin,
  Download,
  Filter,
  Search,
  RotateCcw,
  Building2,
  Calendar,
  Layers,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  Info,
  ChevronRight,
  ExternalLink,
  DollarSign,
  FileSpreadsheet,
  X,
  Sparkles,
} from "lucide-react";
import BackButton from "@/components/ui/BackButton";
import { useTranslation } from "@/hooks/useTranslation";
import {
  WelfareProgrammeReport,
  WelfareFilterState,
  WelfareApplicationStatus,
} from "@/types/welfare-report";
import {
  DEMO_WELFARE_PROGRAMMES,
  DISTRICT_MANDALS_MAP,
  ALL_DISTRICTS,
  REPORTING_PERIODS,
  formatIndianRupees,
  formatExactRupees,
  calculateWelfareMetrics,
  filterWelfareProgrammes,
} from "@/services/welfare-reports-data";
import {
  generateWelfareReportsCsv,
  generateMandalBreakdownCsv,
  triggerCsvDownload,
} from "@/utils/welfare-csv-export";

export default function GovtWelfareReportsWorkspace() {
  const { t } = useTranslation();

  // Filters state
  const [filters, setFilters] = useState<WelfareFilterState>({
    searchQuery: "",
    selectedDistrict: "all",
    selectedMandal: "all",
    selectedProgramme: "all",
    selectedPeriod: "all",
    selectedStatus: "all",
  });

  // Selected programme for detail drilldown view
  const [selectedProgramme, setSelectedProgramme] =
    useState<WelfareProgrammeReport | null>(null);

  // Selected district for district impact modal
  const [selectedDistrictModal, setSelectedDistrictModal] = useState<string | null>(
    null
  );

  // Feedback toast for CSV download
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Available mandals dependent on selected district
  const availableMandals = useMemo(() => {
    if (filters.selectedDistrict === "all") {
      const set = new Set<string>();
      Object.values(DISTRICT_MANDALS_MAP).forEach((arr) =>
        arr.forEach((m) => set.add(m))
      );
      return Array.from(set).sort();
    }
    return DISTRICT_MANDALS_MAP[filters.selectedDistrict] || [];
  }, [filters.selectedDistrict]);

  // Reset mandal if district changes and current mandal is invalid
  const handleDistrictChange = (district: string) => {
    setFilters((prev) => ({
      ...prev,
      selectedDistrict: district,
      selectedMandal: "all",
    }));
  };

  // Clear all filters
  const handleClearFilters = () => {
    setFilters({
      searchQuery: "",
      selectedDistrict: "all",
      selectedMandal: "all",
      selectedProgramme: "all",
      selectedPeriod: "all",
      selectedStatus: "all",
    });
  };

  // Filtered programmes
  const filteredProgrammes = useMemo(() => {
    return filterWelfareProgrammes(DEMO_WELFARE_PROGRAMMES, filters);
  }, [filters]);

  // Metrics calculated from the filtered dataset
  const metrics = useMemo(() => {
    return calculateWelfareMetrics(filteredProgrammes);
  }, [filteredProgrammes]);

  // Overall baseline metrics across all demo records (for comparison)
  const baselineMetrics = useMemo(() => {
    return calculateWelfareMetrics(DEMO_WELFARE_PROGRAMMES);
  }, []);

  // District summary aggregated from all programmes
  const districtSummaries = useMemo(() => {
    return ALL_DISTRICTS.map((dist) => {
      let regCount = 0;
      let appCount = 0;
      let distCount = 0;
      let pendCount = 0;
      let progCount = 0;

      DEMO_WELFARE_PROGRAMMES.forEach((p) => {
        if (p.districtsCovered.includes(dist)) {
          progCount++;
          p.mandalBreakdown.forEach((m) => {
            if (m.district === dist) {
              regCount += m.registeredCount;
              appCount += m.approvedCount;
              distCount += m.distributedCount;
              pendCount += m.pendingCount;
            }
          });
        }
      });

      return {
        district: dist,
        programmesCount: progCount,
        registeredCount: regCount,
        approvedCount: appCount,
        distributedCount: distCount,
        pendingCount: pendCount,
        distributionRatio: appCount > 0 ? Math.round((distCount / appCount) * 100) : 0,
      };
    });
  }, []);

  // Export filtered programmes as CSV
  const handleExportFilteredCsv = () => {
    if (filteredProgrammes.length === 0) return;
    const csvContent = generateWelfareReportsCsv(filteredProgrammes);
    const fileName = `Welfare_Impact_Report_${new Date().toISOString().slice(0, 10)}.csv`;
    triggerCsvDownload(csvContent, fileName);
    showToast(t("govtWelfareReports.exportSuccess"));
  };

  // Export single programme mandal breakdown as CSV
  const handleExportMandalCsv = (programme: WelfareProgrammeReport) => {
    const csvContent = generateMandalBreakdownCsv(programme);
    const fileName = `${programme.shortCode}_Mandal_Breakdown_${new Date().toISOString().slice(0, 10)}.csv`;
    triggerCsvDownload(csvContent, fileName);
    showToast(t("govtWelfareReports.exportSuccess"));
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-16">
      {/* Toast Notification */}
      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-medium text-white shadow-xl transition-all"
        >
          <CheckCircle2 size={18} className="text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Container */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              {selectedProgramme ? (
                <button
                  id="btn-back-to-reports"
                  onClick={() => setSelectedProgramme(null)}
                  className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 min-h-[44px]"
                >
                  <ArrowRight size={16} className="rotate-180" />
                  <span>{t("govtWelfareReports.backToReports")}</span>
                </button>
              ) : (
                <BackButton
                  href="/dashboard"
                  label={t("govtWelfareReports.backToDashboard")}
                />
              )}
              <div className="h-6 w-px bg-slate-200" />
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
                    {t("govtWelfareReports.title")}
                  </h1>
                  <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-800">
                    Live Demo
                  </span>
                </div>
                <p className="text-xs text-slate-500 sm:text-sm">
                  {t("govtWelfareReports.subtitle")}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                id="btn-export-csv"
                onClick={handleExportFilteredCsv}
                disabled={filteredProgrammes.length === 0}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#24833A] px-4 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-[#1d6b2f] disabled:cursor-not-allowed disabled:opacity-50 min-h-[44px] transition-colors"
                title="Export currently filtered records to CSV"
              >
                <Download size={16} />
                <span>{t("govtWelfareReports.exportCsv")}</span>
              </button>
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
                {t("govtWelfareReports.demoDisclaimer")}
              </p>
              <p className="text-amber-800">
                {t("govtWelfareReports.demoDisclaimerSecondary")} {t("govtWelfareReports.distVsApprNotice")}
              </p>
            </div>
          </div>
        </div>

        {/* If Programme Detail View is Active */}
        {selectedProgramme ? (
          <div className="space-y-6">
            {/* Detail View Header Card */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs sm:p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-md bg-blue-100 px-2 py-0.5 text-xs font-bold text-blue-800">
                      {selectedProgramme.id}
                    </span>
                    <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700">
                      {selectedProgramme.categoryLabel}
                    </span>
                    <span className="rounded-md bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-800">
                      {selectedProgramme.reportingPeriod}
                    </span>
                  </div>
                  <h2 className="mt-2 text-xl font-bold text-slate-900 sm:text-2xl">
                    {selectedProgramme.name}
                  </h2>
                  <p className="mt-1 text-sm text-slate-600 max-w-3xl">
                    {selectedProgramme.description}
                  </p>
                  <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <Clock size={14} className="text-slate-400" />
                      {t("govtWelfareReports.lastUpdated")}: {selectedProgramme.lastUpdated}
                    </span>
                    <span className="flex items-center gap-1">
                      <ShieldCheck size={14} className="text-emerald-600" />
                      {t("govtWelfareReports.dataSource")}: {selectedProgramme.dataSource}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 sm:flex-col sm:items-end">
                  <button
                    id="btn-export-mandal-csv"
                    onClick={() => handleExportMandalCsv(selectedProgramme)}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 min-h-[44px]"
                  >
                    <Download size={14} />
                    <span>Export Breakdown CSV</span>
                  </button>
                  <Link
                    href="/dashboard/schemes"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#24833A] hover:underline py-2 min-h-[44px]"
                  >
                    <ExternalLink size={14} />
                    <span>{t("govtWelfareReports.linkToSchemes")}</span>
                  </Link>
                </div>
              </div>

              {/* Budget & Execution Indicators */}
              <div className="mt-6 grid grid-cols-2 gap-4 border-t border-slate-100 pt-5 sm:grid-cols-4">
                <div className="rounded-xl bg-slate-50 p-3.5">
                  <p className="text-xs text-slate-500">{t("govtWelfareReports.totalAllocatedBudget")}</p>
                  <p className="mt-1 text-base font-bold text-slate-900 sm:text-lg">
                    {formatIndianRupees(selectedProgramme.allocatedBudgetRupees)}
                  </p>
                  <p className="text-[11px] text-slate-400">Total Sanctioned Outlay</p>
                </div>
                <div className="rounded-xl bg-blue-50/70 p-3.5">
                  <p className="text-xs text-blue-700">Approved Benefit Value</p>
                  <p className="mt-1 text-base font-bold text-blue-900 sm:text-lg">
                    {formatIndianRupees(selectedProgramme.approvedBudgetRupees)}
                  </p>
                  <p className="text-[11px] text-blue-600">
                    {Math.round((selectedProgramme.approvedBudgetRupees / selectedProgramme.allocatedBudgetRupees) * 100)}% of Outlay
                  </p>
                </div>
                <div className="rounded-xl bg-emerald-50/70 p-3.5">
                  <p className="text-xs text-emerald-700">{t("govtWelfareReports.totalDisbursedBudget")}</p>
                  <p className="mt-1 text-base font-bold text-emerald-900 sm:text-lg">
                    {formatIndianRupees(selectedProgramme.disbursedBudgetRupees)}
                  </p>
                  <p className="text-[11px] text-emerald-700">
                    {Math.round((selectedProgramme.disbursedBudgetRupees / selectedProgramme.approvedBudgetRupees) * 100)}% of Approved
                  </p>
                </div>
                <div className="rounded-xl bg-amber-50/70 p-3.5">
                  <p className="text-xs text-amber-700">{t("govtWelfareReports.pendingApplications")}</p>
                  <p className="mt-1 text-base font-bold text-amber-900 sm:text-lg">
                    {selectedProgramme.pendingApplications.toLocaleString("en-IN")}
                  </p>
                  <p className="text-[11px] text-amber-700">Awaiting Verification</p>
                </div>
              </div>
            </div>

            {/* District & Mandal Breakdown Table */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs sm:p-6 space-y-4">
              <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900 sm:text-lg">
                    {t("govtWelfareReports.mandalBreakdownTitle")}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Mandal-level targets, registered coverage, approvals and verified dispatches.
                  </p>
                </div>
                <span className="text-xs text-slate-500">
                  {selectedProgramme.mandalBreakdown.length} Mandals Monitored
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="border-b border-slate-200 bg-slate-50 text-slate-600 font-semibold">
                    <tr>
                      <th className="py-3 px-3">District</th>
                      <th className="py-3 px-3">Mandal</th>
                      <th className="py-3 px-3 text-right">Target</th>
                      <th className="py-3 px-3 text-right">Registered</th>
                      <th className="py-3 px-3 text-right">Approved</th>
                      <th className="py-3 px-3 text-right">Distributed</th>
                      <th className="py-3 px-3 text-right">Pending</th>
                      <th className="py-3 px-3 text-center">Fulfillment Rate</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {selectedProgramme.mandalBreakdown.map((m, idx) => {
                      const rate = m.approvedCount > 0 ? Math.round((m.distributedCount / m.approvedCount) * 100) : 0;
                      return (
                        <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                          <td className="py-3 px-3 font-medium text-slate-900">{m.district}</td>
                          <td className="py-3 px-3 text-slate-700">{m.mandal}</td>
                          <td className="py-3 px-3 text-right text-slate-600">{m.targetCount.toLocaleString("en-IN")}</td>
                          <td className="py-3 px-3 text-right text-slate-600">{m.registeredCount.toLocaleString("en-IN")}</td>
                          <td className="py-3 px-3 text-right font-medium text-blue-700">{m.approvedCount.toLocaleString("en-IN")}</td>
                          <td className="py-3 px-3 text-right font-semibold text-emerald-700">{m.distributedCount.toLocaleString("en-IN")}</td>
                          <td className="py-3 px-3 text-right text-amber-700">{m.pendingCount.toLocaleString("en-IN")}</td>
                          <td className="py-3 px-3 text-center">
                            <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700 border border-emerald-200">
                              {rate}%
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Demonstration Beneficiary Roster */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs sm:p-6 space-y-4">
              <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900 sm:text-lg">
                    {t("govtWelfareReports.sampleBeneficiariesTitle")}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Illustrative sample with masked references. No real Aadhaar or bank credentials.
                  </p>
                </div>
                <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">
                  {selectedProgramme.sampleBeneficiaries.length} Demonstration Records
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="border-b border-slate-200 bg-slate-50 text-slate-600 font-semibold">
                    <tr>
                      <th className="py-3 px-3">{t("govtWelfareReports.beneficiaryReference")}</th>
                      <th className="py-3 px-3">{t("govtWelfareReports.farmerAlias")}</th>
                      <th className="py-3 px-3">Location</th>
                      <th className="py-3 px-3">{t("govtWelfareReports.benefitType")}</th>
                      <th className="py-3 px-3 text-right">{t("govtWelfareReports.sanctionedAmount")}</th>
                      <th className="py-3 px-3 text-right">{t("govtWelfareReports.disbursedAmount")}</th>
                      <th className="py-3 px-3 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {selectedProgramme.sampleBeneficiaries.map((b) => (
                      <tr key={b.referenceId} className="hover:bg-slate-50/70">
                        <td className="py-3 px-3 font-mono text-xs font-semibold text-slate-800">
                          {b.referenceId}
                        </td>
                        <td className="py-3 px-3 font-medium text-slate-900">{b.farmerAlias}</td>
                        <td className="py-3 px-3 text-slate-600">
                          {b.district}, {b.mandal}
                        </td>
                        <td className="py-3 px-3 text-slate-700">{b.benefitType}</td>
                        <td className="py-3 px-3 text-right text-slate-800">
                          {formatExactRupees(b.sanctionedAmountRupees)}
                        </td>
                        <td className="py-3 px-3 text-right font-medium text-emerald-700">
                          {formatExactRupees(b.disbursedAmountRupees)}
                        </td>
                        <td className="py-3 px-3 text-center">
                          {b.status === "distributed" && (
                            <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-800">
                              {t("govtWelfareReports.statusDistributed")}
                            </span>
                          )}
                          {b.status === "approved" && (
                            <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-800">
                              {t("govtWelfareReports.statusApproved")}
                            </span>
                          )}
                          {b.status === "pending" && (
                            <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-800">
                              {t("govtWelfareReports.statusPending")}
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : (
          /* Main Overview Dashboard View */
          <>
            {/* 6 Key Analytics Metric Cards */}
            <section
              aria-label="Welfare Analytics Summary Metrics"
              className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-6"
            >
              {/* 1. Registered Beneficiaries */}
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-500">
                    {t("govtWelfareReports.registeredBeneficiaries")}
                  </span>
                  <div className="rounded-lg bg-emerald-50 p-1.5 text-emerald-700">
                    <Users size={16} />
                  </div>
                </div>
                <p className="mt-2 text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
                  {metrics.registeredBeneficiaries.toLocaleString("en-IN")}
                </p>
                <div className="mt-1 flex items-center gap-1 text-[11px] text-slate-500">
                  <span>Across monitored schemes</span>
                </div>
              </div>

              {/* 2. Benefits Approved */}
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-500">
                    {t("govtWelfareReports.benefitsApproved")}
                  </span>
                  <div className="rounded-lg bg-blue-50 p-1.5 text-blue-700">
                    <CheckCircle2 size={16} />
                  </div>
                </div>
                <p className="mt-2 text-xl font-bold tracking-tight text-blue-900 sm:text-2xl">
                  {metrics.benefitsApproved.toLocaleString("en-IN")}
                </p>
                <div className="mt-1 flex items-center gap-1 text-[11px] text-blue-600">
                  <span>Eligibility verified</span>
                </div>
              </div>

              {/* 3. Benefits Distributed */}
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-500">
                    {t("govtWelfareReports.benefitsDistributed")}
                  </span>
                  <div className="rounded-lg bg-emerald-50 p-1.5 text-[#24833A]">
                    <TrendingUp size={16} />
                  </div>
                </div>
                <p className="mt-2 text-xl font-bold tracking-tight text-emerald-800 sm:text-2xl">
                  {metrics.benefitsDistributed.toLocaleString("en-IN")}
                </p>
                <div className="mt-1 flex items-center gap-1 text-[11px] text-emerald-700">
                  <span>
                    {metrics.benefitsApproved > 0
                      ? `${Math.round((metrics.benefitsDistributed / metrics.benefitsApproved) * 100)}% distributed`
                      : "0%"}
                  </span>
                </div>
              </div>

              {/* 4. Pending Applications */}
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-500">
                    {t("govtWelfareReports.pendingApplications")}
                  </span>
                  <div className="rounded-lg bg-amber-50 p-1.5 text-amber-700">
                    <Clock size={16} />
                  </div>
                </div>
                <p className="mt-2 text-xl font-bold tracking-tight text-amber-900 sm:text-2xl">
                  {metrics.pendingApplications.toLocaleString("en-IN")}
                </p>
                <div className="mt-1 flex items-center gap-1 text-[11px] text-amber-700">
                  <span>In verification queue</span>
                </div>
              </div>

              {/* 5. Districts Covered */}
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-500">
                    {t("govtWelfareReports.districtsCovered")}
                  </span>
                  <div className="rounded-lg bg-purple-50 p-1.5 text-purple-700">
                    <MapPin size={16} />
                  </div>
                </div>
                <p className="mt-2 text-xl font-bold tracking-tight text-purple-900 sm:text-2xl">
                  {metrics.districtsCovered}
                </p>
                <div className="mt-1 flex items-center gap-1 text-[11px] text-purple-600">
                  <span>State districts active</span>
                </div>
              </div>

              {/* 6. Programmes Monitored */}
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-500">
                    {t("govtWelfareReports.programmesMonitored")}
                  </span>
                  <div className="rounded-lg bg-indigo-50 p-1.5 text-indigo-700">
                    <Building2 size={16} />
                  </div>
                </div>
                <p className="mt-2 text-xl font-bold tracking-tight text-indigo-900 sm:text-2xl">
                  {metrics.programmesMonitored}
                </p>
                <div className="mt-1 flex items-center gap-1 text-[11px] text-indigo-600">
                  <span>Welfare categories</span>
                </div>
              </div>
            </section>

            {/* Outcome Indicators & Budget Progress Card */}
            <section
              aria-label="Welfare Outcome Indicators"
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs sm:p-6"
            >
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-4">
                <div>
                  <h2 className="text-base font-bold text-slate-900 sm:text-lg">
                    {t("govtWelfareReports.outcomeIndicatorsTitle")}
                  </h2>
                  <p className="text-xs text-slate-500">
                    Simulated velocity and coverage analysis across current active welfare streams.
                  </p>
                </div>
                <div className="flex items-center gap-3 text-xs">
                  <span className="flex items-center gap-1 text-slate-600">
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                    Distributed
                  </span>
                  <span className="flex items-center gap-1 text-slate-600">
                    <span className="h-2.5 w-2.5 rounded-full bg-blue-500" />
                    Approved Pending Dispatch
                  </span>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-1 gap-6 md:grid-cols-3">
                {/* Outlay Disbursement Progress */}
                <div className="space-y-2 rounded-xl bg-slate-50 p-4">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-slate-600">Disbursed Outlay</span>
                    <span className="font-bold text-slate-900">
                      {formatIndianRupees(metrics.totalDisbursedBudget)} / {formatIndianRupees(metrics.totalApprovedBudget)}
                    </span>
                  </div>
                  <div className="h-3 w-full overflow-hidden rounded-full bg-slate-200">
                    <div
                      className="h-full bg-emerald-600 transition-all duration-500"
                      style={{
                        width: `${metrics.totalApprovedBudget > 0 ? Math.min(100, Math.round((metrics.totalDisbursedBudget / metrics.totalApprovedBudget) * 100)) : 0}%`,
                      }}
                    />
                  </div>
                  <div className="flex justify-between text-[11px] text-slate-500">
                    <span>Disbursement Velocity</span>
                    <span className="font-semibold text-emerald-700">
                      {metrics.totalApprovedBudget > 0 ? Math.round((metrics.totalDisbursedBudget / metrics.totalApprovedBudget) * 100) : 0}%
                    </span>
                  </div>
                </div>

                {/* Farmer Application Processing Rate */}
                <div className="space-y-2 rounded-xl bg-slate-50 p-4">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-slate-600">Applications Approved</span>
                    <span className="font-bold text-slate-900">
                      {metrics.benefitsApproved.toLocaleString("en-IN")} / {metrics.registeredBeneficiaries.toLocaleString("en-IN")}
                    </span>
                  </div>
                  <div className="h-3 w-full overflow-hidden rounded-full bg-slate-200">
                    <div
                      className="h-full bg-blue-600 transition-all duration-500"
                      style={{
                        width: `${metrics.registeredBeneficiaries > 0 ? Math.min(100, Math.round((metrics.benefitsApproved / metrics.registeredBeneficiaries) * 100)) : 0}%`,
                      }}
                    />
                  </div>
                  <div className="flex justify-between text-[11px] text-slate-500">
                    <span>Approval Ratio</span>
                    <span className="font-semibold text-blue-700">
                      {metrics.registeredBeneficiaries > 0 ? Math.round((metrics.benefitsApproved / metrics.registeredBeneficiaries) * 100) : 0}%
                    </span>
                  </div>
                </div>

                {/* Benefits Distributed vs Approved */}
                <div className="space-y-2 rounded-xl bg-slate-50 p-4">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-slate-600">Distribution Fulfillment</span>
                    <span className="font-bold text-slate-900">
                      {metrics.benefitsDistributed.toLocaleString("en-IN")} / {metrics.benefitsApproved.toLocaleString("en-IN")}
                    </span>
                  </div>
                  <div className="h-3 w-full overflow-hidden rounded-full bg-slate-200">
                    <div
                      className="h-full bg-[#24833A] transition-all duration-500"
                      style={{
                        width: `${metrics.benefitsApproved > 0 ? Math.min(100, Math.round((metrics.benefitsDistributed / metrics.benefitsApproved) * 100)) : 0}%`,
                      }}
                    />
                  </div>
                  <div className="flex justify-between text-[11px] text-slate-500">
                    <span>Fulfillment Ratio</span>
                    <span className="font-semibold text-[#24833A]">
                      {metrics.benefitsApproved > 0 ? Math.round((metrics.benefitsDistributed / metrics.benefitsApproved) * 100) : 0}%
                    </span>
                  </div>
                </div>
              </div>
            </section>

            {/* Filter and Search Bar Section */}
            <section
              aria-label="Welfare Programme Filters"
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs sm:p-6 space-y-4"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="relative flex-1">
                  <Search
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    id="input-welfare-search"
                    type="text"
                    value={filters.searchQuery}
                    onChange={(e) =>
                      setFilters((prev) => ({ ...prev, searchQuery: e.target.value }))
                    }
                    placeholder={t("govtWelfareReports.searchPlaceholder")}
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
                    <span>{t("govtWelfareReports.clearFilters")}</span>
                  </button>
                </div>
              </div>

              {/* Filter Controls Row */}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
                {/* District Filter */}
                <div>
                  <label htmlFor="select-district" className="block text-xs font-medium text-slate-700 mb-1">
                    {t("govtWelfareReports.filterDistrict")}
                  </label>
                  <select
                    id="select-district"
                    value={filters.selectedDistrict}
                    onChange={(e) => handleDistrictChange(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs sm:text-sm text-slate-800 focus:border-[#24833A] focus:outline-hidden min-h-[44px]"
                  >
                    <option value="all">{t("govtWelfareReports.allDistricts")}</option>
                    {ALL_DISTRICTS.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Mandal Filter */}
                <div>
                  <label htmlFor="select-mandal" className="block text-xs font-medium text-slate-700 mb-1">
                    {t("govtWelfareReports.filterMandal")}
                  </label>
                  <select
                    id="select-mandal"
                    value={filters.selectedMandal}
                    onChange={(e) =>
                      setFilters((prev) => ({ ...prev, selectedMandal: e.target.value }))
                    }
                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs sm:text-sm text-slate-800 focus:border-[#24833A] focus:outline-hidden min-h-[44px]"
                  >
                    <option value="all">{t("govtWelfareReports.allMandals")}</option>
                    {availableMandals.map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Programme Filter */}
                <div>
                  <label htmlFor="select-programme" className="block text-xs font-medium text-slate-700 mb-1">
                    {t("govtWelfareReports.filterProgramme")}
                  </label>
                  <select
                    id="select-programme"
                    value={filters.selectedProgramme}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        selectedProgramme: e.target.value,
                      }))
                    }
                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs sm:text-sm text-slate-800 focus:border-[#24833A] focus:outline-hidden min-h-[44px]"
                  >
                    <option value="all">{t("govtWelfareReports.allProgrammes")}</option>
                    {DEMO_WELFARE_PROGRAMMES.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Reporting Period Filter */}
                <div>
                  <label htmlFor="select-period" className="block text-xs font-medium text-slate-700 mb-1">
                    {t("govtWelfareReports.filterPeriod")}
                  </label>
                  <select
                    id="select-period"
                    value={filters.selectedPeriod}
                    onChange={(e) =>
                      setFilters((prev) => ({ ...prev, selectedPeriod: e.target.value }))
                    }
                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs sm:text-sm text-slate-800 focus:border-[#24833A] focus:outline-hidden min-h-[44px]"
                  >
                    {REPORTING_PERIODS.map((rp) => (
                      <option key={rp.id} value={rp.id}>
                        {rp.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Application Status Filter */}
                <div>
                  <label htmlFor="select-status" className="block text-xs font-medium text-slate-700 mb-1">
                    {t("govtWelfareReports.filterStatus")}
                  </label>
                  <select
                    id="select-status"
                    value={filters.selectedStatus}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        selectedStatus: e.target.value as WelfareApplicationStatus,
                      }))
                    }
                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs sm:text-sm text-slate-800 focus:border-[#24833A] focus:outline-hidden min-h-[44px]"
                  >
                    <option value="all">{t("govtWelfareReports.allStatuses")}</option>
                    <option value="approved">{t("govtWelfareReports.statusApproved")}</option>
                    <option value="distributed">{t("govtWelfareReports.statusDistributed")}</option>
                    <option value="pending">{t("govtWelfareReports.statusPending")}</option>
                    <option value="under_review">{t("govtWelfareReports.statusUnderReview")}</option>
                  </select>
                </div>
              </div>
            </section>

            {/* Programme Cards Section */}
            <section aria-label="Welfare Programmes Overview" className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-slate-900 sm:text-lg">
                  Welfare Programme Outcome Reports ({filteredProgrammes.length})
                </h2>
                <span className="text-xs text-slate-500">
                  Showing {filteredProgrammes.length} of {DEMO_WELFARE_PROGRAMMES.length}
                </span>
              </div>

              {filteredProgrammes.length === 0 ? (
                /* Empty state */
                <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center space-y-3">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                    <FileSpreadsheet size={24} />
                  </div>
                  <h3 className="text-sm font-bold text-slate-800 sm:text-base">
                    {t("govtWelfareReports.noReportsFound")}
                  </h3>
                  <p className="text-xs text-slate-500 max-w-md mx-auto">
                    {t("govtWelfareReports.clearFiltersPrompt")}
                  </p>
                  <div>
                    <button
                      id="btn-empty-clear-filters"
                      onClick={handleClearFilters}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-[#24833A] px-4 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-[#1d6b2f] min-h-[44px]"
                    >
                      <RotateCcw size={14} />
                      <span>{t("govtWelfareReports.clearFilters")}</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
                  {filteredProgrammes.map((p) => {
                    const approvalPct =
                      p.targetBeneficiaries > 0
                        ? Math.min(100, Math.round((p.approvedApplications / p.targetBeneficiaries) * 100))
                        : 0;
                    const distributedPct =
                      p.approvedApplications > 0
                        ? Math.min(100, Math.round((p.benefitsDistributed / p.approvedApplications) * 100))
                        : 0;

                    return (
                      <div
                        key={p.id}
                        className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs hover:shadow-md transition-shadow"
                      >
                        <div className="space-y-4">
                          {/* Header info */}
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <span className="rounded-md bg-emerald-50 px-2 py-0.5 font-mono text-[11px] font-bold text-emerald-800 border border-emerald-200">
                                {p.id}
                              </span>
                              <h3 className="mt-2 text-base font-bold text-slate-900 leading-snug">
                                {p.name}
                              </h3>
                              <p className="text-xs text-slate-500 line-clamp-2 mt-1">
                                {p.description}
                              </p>
                            </div>
                            <span className="shrink-0 rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-semibold text-slate-700">
                              {p.reportingPeriod}
                            </span>
                          </div>

                          {/* Metric figures */}
                          <div className="grid grid-cols-3 gap-2 rounded-xl bg-slate-50 p-3 text-center">
                            <div>
                              <span className="block text-[11px] text-slate-500">Target</span>
                              <span className="text-xs font-bold text-slate-900">
                                {p.targetBeneficiaries.toLocaleString("en-IN")}
                              </span>
                            </div>
                            <div>
                              <span className="block text-[11px] text-blue-700">Approved</span>
                              <span className="text-xs font-bold text-blue-900">
                                {p.approvedApplications.toLocaleString("en-IN")}
                              </span>
                            </div>
                            <div>
                              <span className="block text-[11px] text-emerald-700">Distributed</span>
                              <span className="text-xs font-bold text-emerald-900">
                                {p.benefitsDistributed.toLocaleString("en-IN")}
                              </span>
                            </div>
                          </div>

                          {/* Progress indicators */}
                          <div className="space-y-2 text-xs">
                            <div className="space-y-1">
                              <div className="flex justify-between text-[11px]">
                                <span className="text-slate-500">Beneficiary Target Progress</span>
                                <span className="font-semibold text-slate-700">{approvalPct}%</span>
                              </div>
                              <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                                <div
                                  className="h-full bg-blue-600 rounded-full"
                                  style={{ width: `${approvalPct}%` }}
                                />
                              </div>
                            </div>

                            <div className="space-y-1">
                              <div className="flex justify-between text-[11px]">
                                <span className="text-slate-500">Benefits Distributed of Approved</span>
                                <span className="font-semibold text-emerald-700">{distributedPct}%</span>
                              </div>
                              <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                                <div
                                  className="h-full bg-[#24833A] rounded-full"
                                  style={{ width: `${distributedPct}%` }}
                                />
                              </div>
                            </div>
                          </div>

                          {/* District coverage tags */}
                          <div className="flex flex-wrap items-center gap-1.5 pt-1">
                            <span className="text-[11px] text-slate-400">Districts:</span>
                            {p.districtsCovered.map((d) => (
                              <span
                                key={d}
                                className="rounded-md bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-600"
                              >
                                {d}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Card Footer Actions */}
                        <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-3">
                          <button
                            id={`btn-open-programme-${p.id}`}
                            onClick={() => setSelectedProgramme(p)}
                            className="inline-flex items-center gap-1 rounded-lg bg-emerald-50 px-3 py-2 text-xs font-semibold text-[#24833A] hover:bg-emerald-100 min-h-[44px] transition-colors"
                          >
                            <span>{t("govtWelfareReports.openProgramme")}</span>
                            <ChevronRight size={14} />
                          </button>

                          <Link
                            href="/dashboard/schemes"
                            className="text-[11px] font-medium text-slate-500 hover:text-slate-800 py-2 px-1 min-h-[44px] flex items-center"
                          >
                            Scheme Rules &rarr;
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>

            {/* District Impact Aggregate Summary Section */}
            <section
              aria-label="District Impact Summary Table"
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs sm:p-6 space-y-4"
            >
              <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-base font-bold text-slate-900 sm:text-lg">
                    District Welfare Reach Summary
                  </h2>
                  <p className="text-xs text-slate-500">
                    Aggregated coverage across all active welfare programmes by administrative district.
                  </p>
                </div>
                <span className="text-xs text-slate-500">
                  {districtSummaries.length} Districts Analyzed
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="border-b border-slate-200 bg-slate-50 text-slate-600 font-semibold">
                    <tr>
                      <th className="py-3 px-3">District</th>
                      <th className="py-3 px-3 text-center">Active Programmes</th>
                      <th className="py-3 px-3 text-right">Registered</th>
                      <th className="py-3 px-3 text-right">Approved</th>
                      <th className="py-3 px-3 text-right">Distributed</th>
                      <th className="py-3 px-3 text-right">Pending</th>
                      <th className="py-3 px-3 text-center">Fulfillment</th>
                      <th className="py-3 px-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {districtSummaries.map((ds) => (
                      <tr key={ds.district} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3 px-3 font-semibold text-slate-900">{ds.district}</td>
                        <td className="py-3 px-3 text-center">
                          <span className="rounded-md bg-purple-50 px-2 py-0.5 font-medium text-purple-700">
                            {ds.programmesCount}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right text-slate-600">
                          {ds.registeredCount.toLocaleString("en-IN")}
                        </td>
                        <td className="py-3 px-3 text-right font-medium text-blue-700">
                          {ds.approvedCount.toLocaleString("en-IN")}
                        </td>
                        <td className="py-3 px-3 text-right font-bold text-emerald-700">
                          {ds.distributedCount.toLocaleString("en-IN")}
                        </td>
                        <td className="py-3 px-3 text-right text-amber-700">
                          {ds.pendingCount.toLocaleString("en-IN")}
                        </td>
                        <td className="py-3 px-3 text-center">
                          <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-800 border border-emerald-200">
                            {ds.distributionRatio}%
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right">
                          <button
                            id={`btn-open-district-${ds.district.toLowerCase().replace(/\s+/g, "-")}`}
                            onClick={() => setSelectedDistrictModal(ds.district)}
                            className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 min-h-[44px]"
                          >
                            <span>{t("govtWelfareReports.openDistrictReport")}</span>
                            <ChevronRight size={12} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </>
        )}
      </main>

      {/* District Detail Modal */}
      {selectedDistrictModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs"
        >
          <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl max-h-[90vh] overflow-y-auto space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-xs font-semibold text-purple-700 uppercase tracking-wider">
                  District Detail Report
                </span>
                <h3 className="text-xl font-bold text-slate-900">
                  {selectedDistrictModal} District Welfare Overview
                </h3>
              </div>
              <button
                id="btn-close-district-modal"
                onClick={() => setSelectedDistrictModal(null)}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 min-h-[44px] min-w-[44px] flex items-center justify-center"
                title="Close modal"
              >
                <X size={18} />
              </button>
            </div>

            <div className="text-xs text-amber-800 bg-amber-50 rounded-xl p-3 border border-amber-200">
              {t("govtWelfareReports.demoDisclaimer")}
            </div>

            {/* Filter shortcut for this district */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase text-slate-500">
                Mandals in {selectedDistrictModal}
              </h4>
              <div className="flex flex-wrap gap-2">
                {(DISTRICT_MANDALS_MAP[selectedDistrictModal] || []).map((m) => (
                  <span
                    key={m}
                    className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-700"
                  >
                    {m}
                  </span>
                ))}
              </div>
            </div>

            {/* Active Programmes in this district */}
            <div className="space-y-3 border-t border-slate-100 pt-3">
              <h4 className="text-xs font-bold uppercase text-slate-500">
                Operating Welfare Programmes
              </h4>
              <div className="space-y-2">
                {DEMO_WELFARE_PROGRAMMES.filter((p) =>
                  p.districtsCovered.includes(selectedDistrictModal)
                ).map((p) => (
                  <div
                    key={p.id}
                    className="flex items-center justify-between rounded-xl border border-slate-100 p-3 bg-slate-50 text-xs"
                  >
                    <div>
                      <p className="font-bold text-slate-900">{p.name}</p>
                      <p className="text-slate-500 font-mono text-[11px]">{p.id} • {p.reportingPeriod}</p>
                    </div>
                    <button
                      id={`btn-modal-drilldown-${p.id}`}
                      onClick={() => {
                        setSelectedDistrictModal(null);
                        setSelectedProgramme(p);
                      }}
                      className="rounded-lg bg-[#24833A] px-3 py-1.5 font-semibold text-white hover:bg-[#1d6b2f] min-h-[44px] flex items-center"
                    >
                      View Report
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex justify-end gap-2 border-t border-slate-100 pt-4">
              <button
                id="btn-cancel-district-modal"
                onClick={() => setSelectedDistrictModal(null)}
                className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 min-h-[44px]"
              >
                {t("govtWelfareReports.close")}
              </button>
              <button
                id="btn-apply-filter-district-modal"
                onClick={() => {
                  handleDistrictChange(selectedDistrictModal);
                  setSelectedDistrictModal(null);
                }}
                className="rounded-xl bg-[#24833A] px-4 py-2 text-xs font-semibold text-white hover:bg-[#1d6b2f] min-h-[44px]"
              >
                Filter Workspace by {selectedDistrictModal}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
