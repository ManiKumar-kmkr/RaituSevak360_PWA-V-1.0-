"use client";

import React, { useState, useMemo } from "react";
import {
  FileSpreadsheet,
  Download,
  BarChart3,
  TrendingUp,
  AlertTriangle,
  Building2,
  Users,
  CheckCircle2,
  Clock,
  MapPin,
  Calendar,
  Filter,
  Search,
  ArrowRight,
  ShieldCheck,
  ChevronRight,
  Sprout,
  DollarSign,
  Layers,
} from "lucide-react";
import BackButton from "@/components/ui/BackButton";
import { useTranslation } from "@/hooks/useTranslation";

interface DistrictReportData {
  id: string;
  district: string;
  division: string;
  totalFarmers: number;
  activeApplications: number;
  approvedApplications: number;
  pendingVerification: number;
  totalBenefitsSanctioned: string;
  disbursedAmount: string;
  majorCrops: { name: string; acreage: string; status: "Healthy" | "Monitoring" | "Pest Alert" | "Critical" }[];
  cropHealthStatus: "Normal (92% Healthy)" | "Monitoring (Pest Watch)" | "Critical Alert in 2 Mandals";
  lastAuditDate: string;
}

const DISTRICT_REPORTS: DistrictReportData[] = [
  {
    id: "DIST-GNT",
    district: "Guntur",
    division: "Amaravati Capital Region",
    totalFarmers: 32450,
    activeApplications: 12400,
    approvedApplications: 10850,
    pendingVerification: 1120,
    totalBenefitsSanctioned: "₹16.8 Cr",
    disbursedAmount: "₹14.2 Cr",
    majorCrops: [
      { name: "Cotton (Bt)", acreage: "14,200 Acres", status: "Pest Alert" },
      { name: "Paddy (BPT 5204)", acreage: "26,400 Acres", status: "Healthy" },
      { name: "Chilli (Teja)", acreage: "8,900 Acres", status: "Monitoring" },
    ],
    cropHealthStatus: "Monitoring (Pest Watch)",
    lastAuditDate: "05 Oct 2026",
  },
  {
    id: "DIST-KRN",
    district: "Krishna",
    division: "Machilipatnam / Delta Zone",
    totalFarmers: 28120,
    activeApplications: 10890,
    approvedApplications: 9640,
    pendingVerification: 890,
    totalBenefitsSanctioned: "₹14.2 Cr",
    disbursedAmount: "₹12.0 Cr",
    majorCrops: [
      { name: "Paddy (MTU 1010)", acreage: "38,500 Acres", status: "Healthy" },
      { name: "Black Gram", acreage: "11,200 Acres", status: "Healthy" },
      { name: "Sugarcane", acreage: "6,400 Acres", status: "Healthy" },
    ],
    cropHealthStatus: "Normal (92% Healthy)",
    lastAuditDate: "04 Oct 2026",
  },
  {
    id: "DIST-WG",
    district: "West Godavari",
    division: "Eluru / Godavari Basin",
    totalFarmers: 25600,
    activeApplications: 9450,
    approvedApplications: 8200,
    pendingVerification: 910,
    totalBenefitsSanctioned: "₹12.6 Cr",
    disbursedAmount: "₹9.8 Cr",
    majorCrops: [
      { name: "Paddy (Swarna)", acreage: "42,000 Acres", status: "Monitoring" },
      { name: "Oil Palm", acreage: "9,800 Acres", status: "Healthy" },
      { name: "Maize", acreage: "7,300 Acres", status: "Healthy" },
    ],
    cropHealthStatus: "Monitoring (Pest Watch)",
    lastAuditDate: "02 Oct 2026",
  },
  {
    id: "DIST-KNL",
    district: "Kurnool",
    division: "Rayalaseema Dryland Zone",
    totalFarmers: 21800,
    activeApplications: 8200,
    approvedApplications: 6750,
    pendingVerification: 1100,
    totalBenefitsSanctioned: "₹10.4 Cr",
    disbursedAmount: "₹7.6 Cr",
    majorCrops: [
      { name: "Groundnut", acreage: "22,400 Acres", status: "Monitoring" },
      { name: "Maize (Hybrid)", acreage: "14,800 Acres", status: "Critical" },
      { name: "Cotton", acreage: "9,600 Acres", status: "Healthy" },
    ],
    cropHealthStatus: "Critical Alert in 2 Mandals",
    lastAuditDate: "06 Oct 2026",
  },
  {
    id: "DIST-PKM",
    district: "Prakasam",
    division: "Ongole Coastal Basin",
    totalFarmers: 19400,
    activeApplications: 7300,
    approvedApplications: 6100,
    pendingVerification: 880,
    totalBenefitsSanctioned: "₹9.1 Cr",
    disbursedAmount: "₹6.9 Cr",
    majorCrops: [
      { name: "Tobacco", acreage: "18,200 Acres", status: "Healthy" },
      { name: "Bengal Gram", acreage: "12,400 Acres", status: "Healthy" },
      { name: "Chilli", acreage: "6,800 Acres", status: "Monitoring" },
    ],
    cropHealthStatus: "Normal (92% Healthy)",
    lastAuditDate: "01 Oct 2026",
  },
];

export default function GovtReportsHub() {
  const { t } = useTranslation();
  const [selectedDistrict, setSelectedDistrict] = useState<string>("all");
  const [selectedMandal, setSelectedMandal] = useState<string>("all");
  const [selectedPeriod, setSelectedPeriod] = useState<string>("kharif_2026");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const [selectedDistrictReport, setSelectedDistrictReport] = useState<DistrictReportData | null>(
    null
  );
  const [downloadNotice, setDownloadNotice] = useState<string | null>(null);

  // Filtered reports
  const filteredDistrictReports = useMemo(() => {
    return DISTRICT_REPORTS.filter((item) => {
      const matchesDistrict = selectedDistrict === "all" || item.district === selectedDistrict;
      const matchesSearch =
        searchQuery.trim() === "" ||
        item.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.division.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesDistrict && matchesSearch;
    });
  }, [selectedDistrict, searchQuery]);

  // Client-side export function
  const handleExportSummary = (districtName?: string) => {
    const target = districtName
      ? DISTRICT_REPORTS.filter((d) => d.district === districtName)
      : DISTRICT_REPORTS;

    let csvContent = "District,Division,TotalFarmers,ActiveApplications,ApprovedApplications,PendingVerification,TotalBenefits,DisbursedAmount,HealthStatus,AuditDate\n";
    target.forEach((row) => {
      csvContent += `"${row.district}","${row.division}",${row.totalFarmers},${row.activeApplications},${row.approvedApplications},${row.pendingVerification},"${row.totalBenefitsSanctioned}","${row.disbursedAmount}","${row.cropHealthStatus}","${row.lastAuditDate}"\n`;
    });

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute(
      "download",
      districtName
        ? `${districtName}-Agricultural-Audit-2026.csv`
        : "State-Agricultural-Reports-Summary-2026.csv"
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setDownloadNotice(
      `Audit export downloaded successfully for ${districtName || "all districts"}.`
    );
    setTimeout(() => setDownloadNotice(null), 3500);
  };

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-5 pb-16">
      {/* Contextual Single Back Navigation */}
      <div className="flex items-center justify-between">
        {selectedDistrictReport ? (
          <BackButton
            id="btn-report-back-to-reports"
            onClick={() => setSelectedDistrictReport(null)}
            label={t("govtReports.backToReports") || "Back to Reports"}
          />
        ) : (
          <BackButton
            id="btn-report-back-to-dashboard"
            href="/dashboard"
            label={t("common.backToDashboard") || "Back to Dashboard"}
          />
        )}
      </div>

      {downloadNotice && (
        <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-3.5 text-xs font-bold text-[#174D25] flex items-center gap-2">
          <CheckCircle2 size={16} className="text-[#24833A]" />
          <span>{downloadNotice}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-3xl bg-white p-5 border border-gray-200 shadow-2xs">
        <div className="flex items-center gap-3.5">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#E4F0DD] text-[#24833A] shadow-xs">
            <FileSpreadsheet size={26} strokeWidth={2.4} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-bold text-gray-900">
                {t("govtReports.title") || "Government Reports & Analytics"}
              </h1>
              <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-[#24833A] border border-emerald-200">
                Official Census
              </span>
            </div>
            <p className="text-xs text-gray-500 font-medium">
              {t("govtReports.subtitle") ||
                "Monitor scheme performance, farmer coverage, crop activity and district-level agricultural indicators."}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => handleExportSummary()}
            className="inline-flex items-center gap-1.5 rounded-xl border border-[#24833A]/30 bg-[#F4FBF5] px-3.5 py-2 text-xs font-bold text-[#174D25] hover:bg-[#E4F0DD] transition cursor-pointer"
          >
            <Download size={14} />
            <span>Export State Audit</span>
          </button>
        </div>
      </div>

      {/* Executive Summary Statistics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-2xs">
          <span className="text-[11px] font-medium text-gray-500">Total Registered Farmers</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-xl font-extrabold text-[#174D25]">1,48,250</span>
          </div>
          <span className="text-[10px] font-semibold text-emerald-700 mt-0.5 block">
            e-KYC Verified in Webland
          </span>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-2xs">
          <span className="text-[11px] font-medium text-gray-500">Active Scheme Applications</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-xl font-extrabold text-blue-900">54,890</span>
          </div>
          <span className="text-[10px] font-semibold text-blue-700 mt-0.5 block">
            Kharif 2026 Cycle
          </span>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-2xs">
          <span className="text-[11px] font-medium text-gray-500">Approved Benefits</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-xl font-extrabold text-[#24833A]">₹68.4 Cr</span>
          </div>
          <span className="text-[10px] font-semibold text-emerald-700 mt-0.5 block">
            Direct DBT Sanctions
          </span>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-2xs">
          <span className="text-[11px] font-medium text-gray-500">Districts Covered</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-xl font-extrabold text-gray-900">26 Districts</span>
          </div>
          <span className="text-[10px] font-semibold text-gray-500 mt-0.5 block">
            679 Mandals Active
          </span>
        </div>
      </div>

      {/* ================= IF VIEWING DETAILED DISTRICT REPORT ================= */}
      {selectedDistrictReport ? (
        <div className="flex flex-col gap-5">
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-2xs flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-gray-400">
                    {selectedDistrictReport.id}
                  </span>
                  <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-[#174D25] border border-emerald-200">
                    District Census Audit
                  </span>
                </div>
                <h2 className="text-xl font-bold text-gray-900 mt-1">
                  {selectedDistrictReport.district} District Comprehensive Audit
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  Administrative Division: <strong>{selectedDistrictReport.division}</strong> • Last
                  Enumerated: {selectedDistrictReport.lastAuditDate}
                </p>
              </div>

              <button
                type="button"
                onClick={() => handleExportSummary(selectedDistrictReport.district)}
                className="inline-flex items-center gap-1.5 rounded-xl bg-[#24833A] px-3.5 py-2 text-xs font-bold text-white hover:bg-[#174D25] transition cursor-pointer shadow-xs self-start sm:self-auto"
              >
                <Download size={14} />
                <span>Download District Dossier</span>
              </button>
            </div>

            {/* Key District Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="rounded-xl bg-[#FAFBF9] p-3 border border-gray-100">
                <span className="text-[10px] font-medium text-gray-400 uppercase">
                  Registered Farmers
                </span>
                <p className="text-base font-extrabold text-[#174D25] mt-0.5">
                  {selectedDistrictReport.totalFarmers.toLocaleString()}
                </p>
              </div>
              <div className="rounded-xl bg-[#FAFBF9] p-3 border border-gray-100">
                <span className="text-[10px] font-medium text-gray-400 uppercase">
                  Active Applications
                </span>
                <p className="text-base font-extrabold text-blue-900 mt-0.5">
                  {selectedDistrictReport.activeApplications.toLocaleString()}
                </p>
              </div>
              <div className="rounded-xl bg-[#FAFBF9] p-3 border border-gray-100">
                <span className="text-[10px] font-medium text-gray-400 uppercase">
                  Approved Benefit Volume
                </span>
                <p className="text-base font-extrabold text-[#24833A] mt-0.5">
                  {selectedDistrictReport.totalBenefitsSanctioned}
                </p>
              </div>
              <div className="rounded-xl bg-[#FAFBF9] p-3 border border-gray-100">
                <span className="text-[10px] font-medium text-gray-400 uppercase">
                  Pending Verification
                </span>
                <p className="text-base font-extrabold text-amber-700 mt-0.5">
                  {selectedDistrictReport.pendingVerification.toLocaleString()}
                </p>
              </div>
            </div>

            {/* Major Crops & Acreage Census */}
            <div className="flex flex-col gap-2 pt-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-700">
                Major Cultivated Crops & Health Surveillance
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {selectedDistrictReport.majorCrops.map((crop, idx) => (
                  <div
                    key={idx}
                    className="rounded-xl border border-gray-200 bg-white p-3 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-gray-900 text-xs">{crop.name}</span>
                        <span
                          className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                            crop.status === "Healthy"
                              ? "bg-emerald-50 text-[#174D25]"
                              : crop.status === "Pest Alert"
                              ? "bg-amber-50 text-amber-800"
                              : crop.status === "Critical"
                              ? "bg-red-50 text-red-800"
                              : "bg-blue-50 text-blue-800"
                          }`}
                        >
                          {crop.status}
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-500 mt-1">Acreage: {crop.acreage}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* General Health Status */}
            <div className="rounded-xl border border-gray-200 bg-[#FAFBF9] p-3.5 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                  Regional Crop Health Status
                </span>
                <p className="text-xs font-bold text-gray-800 mt-0.5">
                  {selectedDistrictReport.cropHealthStatus}
                </p>
              </div>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold text-[#174D25]">
                <ShieldCheck size={12} /> Joint Inspection Completed
              </span>
            </div>
          </div>
        </div>
      ) : (
        /* ================= MAIN REPORTS WORKSPACE ================= */
        <div className="flex flex-col gap-5">
          {/* Filters Bar: District, Mandal, Period, Category */}
          <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-2xs flex flex-col gap-3">
            <div className="flex items-center gap-2 text-xs font-bold text-gray-800">
              <Filter size={15} className="text-[#24833A]" />
              <span>Administrative Report Filters</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5 text-xs">
              <div>
                <label className="block text-[11px] font-medium text-gray-500 mb-1">
                  District
                </label>
                <select
                  value={selectedDistrict}
                  onChange={(e) => setSelectedDistrict(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 p-2 text-xs text-gray-800 focus:border-[#24833A] focus:outline-hidden"
                >
                  <option value="all">All Districts (26)</option>
                  <option value="Guntur">Guntur</option>
                  <option value="Krishna">Krishna</option>
                  <option value="West Godavari">West Godavari</option>
                  <option value="Kurnool">Kurnool</option>
                  <option value="Prakasam">Prakasam</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-gray-500 mb-1">
                  Mandal Zone
                </label>
                <select
                  value={selectedMandal}
                  onChange={(e) => setSelectedMandal(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 p-2 text-xs text-gray-800 focus:border-[#24833A] focus:outline-hidden"
                >
                  <option value="all">All Mandals (State-wide)</option>
                  <option value="Mangalagiri">Mangalagiri</option>
                  <option value="Tenali">Tenali</option>
                  <option value="Vijayawada Rural">Vijayawada Rural</option>
                  <option value="Bhimavaram">Bhimavaram</option>
                  <option value="Nandyal">Nandyal</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-gray-500 mb-1">
                  Reporting Period
                </label>
                <select
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 p-2 text-xs text-gray-800 focus:border-[#24833A] focus:outline-hidden"
                >
                  <option value="kharif_2026">Kharif Season 2026</option>
                  <option value="rabi_2025">Rabi Season 2025-26</option>
                  <option value="annual_2026">Financial Year 2026-27</option>
                  <option value="last_30">Last 30 Days (Real-time)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-gray-500 mb-1">
                  Report Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 p-2 text-xs text-gray-800 focus:border-[#24833A] focus:outline-hidden"
                >
                  <option value="all">All Categories</option>
                  <option value="scheme">Scheme Performance</option>
                  <option value="farmer">Farmer Coverage</option>
                  <option value="crop">Crop Health Surveillance</option>
                  <option value="welfare">Welfare Distribution</option>
                </select>
              </div>
            </div>
          </div>

          {/* Visualizations Section (Clean CSS-based data bars & progress breakdowns) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* 1. Scheme Application Overview */}
            <div className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-5 shadow-2xs flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-800">
                  Scheme Application Overview
                </h3>
                <span className="text-[10px] font-semibold text-gray-400">54,890 Total</span>
              </div>

              {/* Multi-segment progress bar */}
              <div className="h-3 w-full rounded-full bg-gray-100 flex overflow-hidden">
                <div style={{ width: "80.7%" }} className="bg-[#24833A]" title="Approved (80.7%)" />
                <div style={{ width: "11.4%" }} className="bg-purple-600" title="Verifying (11.4%)" />
                <div style={{ width: "7.9%" }} className="bg-red-500" title="Rejected (7.9%)" />
              </div>

              <div className="grid grid-cols-3 gap-2 pt-1 text-xs">
                <div>
                  <div className="flex items-center gap-1.5 text-[11px] text-gray-500">
                    <span className="h-2 w-2 rounded-full bg-[#24833A]" /> Approved
                  </div>
                  <span className="font-bold text-gray-900 mt-0.5 block">44,280 (80.7%)</span>
                </div>
                <div>
                  <div className="flex items-center gap-1.5 text-[11px] text-gray-500">
                    <span className="h-2 w-2 rounded-full bg-purple-600" /> Verifying
                  </div>
                  <span className="font-bold text-gray-900 mt-0.5 block">6,240 (11.4%)</span>
                </div>
                <div>
                  <div className="flex items-center gap-1.5 text-[11px] text-gray-500">
                    <span className="h-2 w-2 rounded-full bg-red-500" /> Rejected
                  </div>
                  <span className="font-bold text-gray-900 mt-0.5 block">4,370 (7.9%)</span>
                </div>
              </div>
            </div>

            {/* 2. Benefit Distribution */}
            <div className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-5 shadow-2xs flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-800">
                  DBT Welfare Sanction Distribution
                </h3>
                <span className="text-[10px] font-bold text-emerald-700">₹68.4 Cr Total</span>
              </div>

              <div className="h-3 w-full rounded-full bg-gray-100 flex overflow-hidden">
                <div style={{ width: "76.2%" }} className="bg-emerald-600" title="Disbursed (76.2%)" />
                <div style={{ width: "23.8%" }} className="bg-amber-500" title="Processing (23.8%)" />
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1 text-xs">
                <div>
                  <div className="flex items-center gap-1.5 text-[11px] text-gray-500">
                    <span className="h-2 w-2 rounded-full bg-emerald-600" /> Disbursed to Bank Accounts
                  </div>
                  <span className="font-bold text-[#174D25] mt-0.5 block">
                    ₹52.1 Cr (33,740 Beneficiaries)
                  </span>
                </div>
                <div>
                  <div className="flex items-center gap-1.5 text-[11px] text-gray-500">
                    <span className="h-2 w-2 rounded-full bg-amber-500" /> Treasury Queue
                  </div>
                  <span className="font-bold text-amber-700 mt-0.5 block">
                    ₹16.3 Cr (10,540 Sanctions)
                  </span>
                </div>
              </div>
            </div>

            {/* 3. District Coverage & Uptake */}
            <div className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-5 shadow-2xs flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-800">
                  District Coverage & Uptake
                </h3>
                <span className="text-[10px] font-semibold text-gray-400">Top 5 Districts</span>
              </div>

              <div className="flex flex-col gap-2 text-xs">
                <div>
                  <div className="flex justify-between text-[11px] mb-0.5">
                    <span className="font-semibold text-gray-700">Guntur (32,450 Farmers)</span>
                    <span className="font-bold text-[#174D25]">92% Uptake</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-gray-100 overflow-hidden">
                    <div style={{ width: "92%" }} className="h-full bg-[#24833A]" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] mb-0.5">
                    <span className="font-semibold text-gray-700">Krishna (28,120 Farmers)</span>
                    <span className="font-bold text-[#174D25]">88% Uptake</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-gray-100 overflow-hidden">
                    <div style={{ width: "88%" }} className="h-full bg-[#24833A]" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] mb-0.5">
                    <span className="font-semibold text-gray-700">West Godavari (25,600 Farmers)</span>
                    <span className="font-bold text-[#174D25]">85% Uptake</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-gray-100 overflow-hidden">
                    <div style={{ width: "85%" }} className="h-full bg-[#24833A]" />
                  </div>
                </div>
              </div>
            </div>

            {/* 4. Crop Health Overview */}
            <div className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-5 shadow-2xs flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-800">
                  State Crop Health Overview
                </h3>
                <span className="text-[10px] font-bold text-emerald-700">8.4 Lakh Acres</span>
              </div>

              <div className="h-3 w-full rounded-full bg-gray-100 flex overflow-hidden">
                <div style={{ width: "68%" }} className="bg-[#24833A]" title="Healthy (68%)" />
                <div style={{ width: "18%" }} className="bg-blue-600" title="Monitoring (18%)" />
                <div style={{ width: "9%" }} className="bg-amber-500" title="Pest Watch (9%)" />
                <div style={{ width: "5%" }} className="bg-red-600" title="Critical (5%)" />
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1 text-xs">
                <div className="flex items-center gap-1.5 text-[11px]">
                  <span className="h-2 w-2 rounded-full bg-[#24833A]" /> Healthy: <strong>68% (5.7L Ac)</strong>
                </div>
                <div className="flex items-center gap-1.5 text-[11px]">
                  <span className="h-2 w-2 rounded-full bg-blue-600" /> Monitoring: <strong>18% (1.5L Ac)</strong>
                </div>
                <div className="flex items-center gap-1.5 text-[11px]">
                  <span className="h-2 w-2 rounded-full bg-amber-500" /> Pest Watch: <strong>9% (75k Ac)</strong>
                </div>
                <div className="flex items-center gap-1.5 text-[11px]">
                  <span className="h-2 w-2 rounded-full bg-red-600" /> Critical Alert: <strong>5% (42k Ac)</strong>
                </div>
              </div>
            </div>
          </div>

          {/* Report Cards Section */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold uppercase tracking-wider text-gray-800">
                Official Analytical Reports & Audit Dossiers
              </h2>
              <span className="text-xs text-gray-500">
                {filteredDistrictReports.length} District Records
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {filteredDistrictReports.map((dist) => (
                <div
                  key={dist.id}
                  className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-5 shadow-2xs hover:border-[#24833A]/50 transition flex flex-col justify-between gap-3"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <MapPin size={15} className="text-[#24833A]" />
                        <h3 className="text-base font-bold text-gray-900">{dist.district}</h3>
                      </div>
                      <span className="text-[10px] font-semibold text-gray-400">
                        {dist.lastAuditDate}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">{dist.division}</p>

                    <div className="grid grid-cols-2 gap-2 mt-3 p-2.5 rounded-xl bg-gray-50 text-xs">
                      <div>
                        <span className="text-[10px] text-gray-400 font-medium">Farmers</span>
                        <p className="font-bold text-gray-800">
                          {dist.totalFarmers.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <span className="text-[10px] text-gray-400 font-medium">
                          Benefits Sanctioned
                        </span>
                        <p className="font-bold text-[#174D25]">{dist.totalBenefitsSanctioned}</p>
                      </div>
                      <div>
                        <span className="text-[10px] text-gray-400 font-medium">
                          Active Applications
                        </span>
                        <p className="font-bold text-blue-900">
                          {dist.activeApplications.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <span className="text-[10px] text-gray-400 font-medium">Health Status</span>
                        <p className="font-semibold text-gray-700 truncate">
                          {dist.cropHealthStatus}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                    <button
                      type="button"
                      onClick={() => handleExportSummary(dist.district)}
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-gray-500 hover:text-gray-800 transition cursor-pointer"
                    >
                      <Download size={13} />
                      <span>Download CSV</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedDistrictReport(dist)}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-[#24833A] px-3.5 py-1.5 text-xs font-bold text-white hover:bg-[#174D25] transition cursor-pointer shadow-xs"
                    >
                      <span>View Report</span>
                      <ArrowRight size={13} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
