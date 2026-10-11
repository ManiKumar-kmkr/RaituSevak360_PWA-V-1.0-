"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Sprout,
  AlertTriangle,
  CheckCircle2,
  Search,
  Filter,
  Download,
  MapPin,
  Clock,
  Eye,
  ShieldAlert,
  ArrowRight,
  TrendingUp,
  FileSpreadsheet,
  AlertOctagon,
  Activity,
  Layers,
  ChevronRight,
  BellRing,
} from "lucide-react";
import BackButton from "@/components/ui/BackButton";
import { useTranslation } from "@/hooks/useTranslation";

export type HealthStatusType =
  | "Healthy"
  | "Monitoring"
  | "Pest Alert"
  | "Disease Alert"
  | "Critical";

export interface CropMonitoringRecord {
  id: string;
  district: string;
  mandal: string;
  crop: string;
  variety: string;
  areaHa: number;
  healthStatus: HealthStatusType;
  detectedIssue: string;
  affectedAreaHa: number;
  lastObservation: string;
  lastUpdated: string;
  recommendedAction: string;
  advisoryIssued: boolean;
}

const INITIAL_RECORDS: CropMonitoringRecord[] = [
  {
    id: "CMR-01",
    district: "Guntur",
    mandal: "Mangalagiri",
    crop: "Chilli",
    variety: "Teja Variety",
    areaHa: 6850,
    healthStatus: "Pest Alert",
    detectedIssue: "Chilli Black Thrips & Yellow Mites curling upper terminal leaves",
    affectedAreaHa: 420,
    lastObservation: "Field trap counts exceeded 15 thrips per leaf in 4 cluster villages.",
    lastUpdated: "Today, 09:15 AM",
    recommendedAction: "Deploy Rythu Bharosa Kendra (RBK) mobile spray teams and issue bio-pesticide subsidy vouchers.",
    advisoryIssued: false,
  },
  {
    id: "CMR-02",
    district: "Guntur",
    mandal: "Tenali",
    crop: "Paddy",
    variety: "BPT 5204 (Samba Mahsuri)",
    areaHa: 18400,
    healthStatus: "Healthy",
    detectedIssue: "None - Vegetative canopy growth normal with optimal water depth",
    affectedAreaHa: 0,
    lastObservation: "Mandal officer inspected 12 field channels; zero incidence of stem borer.",
    lastUpdated: "Today, 08:30 AM",
    recommendedAction: "Maintain standard irrigation rotation and scheduled mid-season top dressing.",
    advisoryIssued: false,
  },
  {
    id: "CMR-03",
    district: "Kurnool",
    mandal: "Adoni",
    crop: "Cotton",
    variety: "Bt Hybrid BG-II",
    areaHa: 22100,
    healthStatus: "Critical",
    detectedIssue: "Pink Bollworm (PBW) rosette flowers observed; larval boreholes in early bolls",
    affectedAreaHa: 1840,
    lastObservation: "Trap threshold breached (28 moths/trap/night) across 8 gram panchayats.",
    lastUpdated: "Today, 07:45 AM",
    recommendedAction: "Sanction Section 13 emergency agricultural response; enforce pheromone mating disruption rope installation.",
    advisoryIssued: true,
  },
  {
    id: "CMR-04",
    district: "West Godavari",
    mandal: "Tanuku",
    crop: "Paddy",
    variety: "Swarna (MTU 7029)",
    areaHa: 34200,
    healthStatus: "Monitoring",
    detectedIssue: "Brown Plant Hopper (BPH) hopper-burn warning at field borders",
    affectedAreaHa: 680,
    lastObservation: "Light trap catches show adult hopper migration following continuous overcast skies.",
    lastUpdated: "Yesterday, 04:30 PM",
    recommendedAction: "Advise farmers to drain standing water for 48 hours and create alley ways (2 meters apart).",
    advisoryIssued: false,
  },
  {
    id: "CMR-05",
    district: "Krishna",
    mandal: "Gudivada",
    crop: "Sugarcane",
    variety: "Co 86032",
    areaHa: 12500,
    healthStatus: "Healthy",
    detectedIssue: "Optimal stalk elongation; zero red-rot signs reported",
    affectedAreaHa: 0,
    lastObservation: "Mill liaison agronomists recorded cane height index +8% over 3-year average.",
    lastUpdated: "Yesterday, 02:00 PM",
    recommendedAction: "Continue planned drip fertigation schedule and trash mulching verification.",
    advisoryIssued: false,
  },
  {
    id: "CMR-06",
    district: "Prakasam",
    mandal: "Ongole Rural",
    crop: "Groundnut",
    variety: "Kadiri-6 (K-6)",
    areaHa: 15800,
    healthStatus: "Disease Alert",
    detectedIssue: "Tikka Leaf Spot (Cercospora) lesions spreading after dew mornings",
    affectedAreaHa: 890,
    lastObservation: "Foliar defoliation measured at 12-18% in dryland sand-loam belts.",
    lastUpdated: "06 Oct 2026",
    recommendedAction: "Supply prophylactic Mancozeb + Carbendazim combos through primary cooperative societies.",
    advisoryIssued: false,
  },
  {
    id: "CMR-07",
    district: "Chittoor",
    mandal: "Madanapalle",
    crop: "Tomato",
    variety: "Arka Rakshak Hybrid",
    areaHa: 8400,
    healthStatus: "Monitoring",
    detectedIssue: "Early pinworm (Tuta absoluta) leaf mines detected in polyhouses",
    affectedAreaHa: 210,
    lastObservation: "Selective trap counts showing moderate adult activity in 3 horticulture clusters.",
    lastUpdated: "05 Oct 2026",
    recommendedAction: "Release Trichogramma parasitoid wasps and conduct community light trapping.",
    advisoryIssued: false,
  },
  {
    id: "CMR-08",
    district: "Anantapur",
    mandal: "Dharmavaram",
    crop: "Groundnut",
    variety: "TMV-2 Rainfed",
    areaHa: 28000,
    healthStatus: "Critical",
    detectedIssue: "Dry root rot combined with 21-day dry spell moisture deficit",
    affectedAreaHa: 3200,
    lastObservation: "Plant mortality reached 22% in rainfed red chalka soils.",
    lastUpdated: "04 Oct 2026",
    recommendedAction: "Mobilize district disaster drought mitigation taskforce; prepare crop insurance yield loss protocol.",
    advisoryIssued: true,
  },
  {
    id: "CMR-09",
    district: "Visakhapatnam",
    mandal: "Anakapalle",
    crop: "Sugarcane",
    variety: "Co 7219",
    areaHa: 14000,
    healthStatus: "Healthy",
    detectedIssue: "Normal tillering stage; inter-row weed suppression effective",
    affectedAreaHa: 0,
    lastObservation: "Regional agricultural research station reported zero fungal spores in air traps.",
    lastUpdated: "03 Oct 2026",
    recommendedAction: "Schedule pre-harvest brix sampling rounds with cooperative sugar mills.",
    advisoryIssued: false,
  },
];

export default function GovtCropMonitoringView() {
  const router = useRouter();
  const { t } = useTranslation();

  // Local state for dynamic updates
  const [records, setRecords] = useState<CropMonitoringRecord[]>(INITIAL_RECORDS);
  const [selectedRecord, setSelectedRecord] = useState<CropMonitoringRecord | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [districtFilter, setDistrictFilter] = useState("all");
  const [cropFilter, setCropFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // User feedback notice
  const [feedbackNotice, setFeedbackNotice] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setFeedbackNotice(msg);
    setTimeout(() => {
      setFeedbackNotice(null);
    }, 4000);
  };

  // Distinct lists for dropdowns
  const availableDistricts = useMemo(() => {
    return Array.from(new Set(records.map((r) => r.district))).sort();
  }, [records]);

  const availableCrops = useMemo(() => {
    return Array.from(new Set(records.map((r) => r.crop))).sort();
  }, [records]);

  // Filtered records
  const filteredRecords = useMemo(() => {
    return records.filter((rec) => {
      if (districtFilter !== "all" && rec.district !== districtFilter) return false;
      if (cropFilter !== "all" && rec.crop !== cropFilter) return false;
      if (statusFilter !== "all" && rec.healthStatus !== statusFilter) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesQuery =
          rec.district.toLowerCase().includes(q) ||
          rec.mandal.toLowerCase().includes(q) ||
          rec.crop.toLowerCase().includes(q) ||
          rec.variety.toLowerCase().includes(q) ||
          rec.detectedIssue.toLowerCase().includes(q);
        if (!matchesQuery) return false;
      }

      return true;
    });
  }, [records, districtFilter, cropFilter, statusFilter, searchQuery]);

  // Summary Metrics
  const summaryMetrics = useMemo(() => {
    const totalArea = records.reduce((acc, r) => acc + r.areaHa, 0);
    const affectedArea = records.reduce((acc, r) => acc + r.affectedAreaHa, 0);
    const healthyCount = records.filter((r) => r.healthStatus === "Healthy").length;
    const alertCount = records.filter(
      (r) => r.healthStatus === "Pest Alert" || r.healthStatus === "Disease Alert"
    ).length;
    const criticalCount = records.filter((r) => r.healthStatus === "Critical").length;

    return {
      totalArea,
      affectedArea,
      healthyPercent: Math.round((healthyCount / records.length) * 100),
      alertCount,
      criticalCount,
    };
  }, [records]);

  // Actions
  const handleMarkForMonitoring = (id: string) => {
    setRecords((prev) =>
      prev.map((r) => {
        if (r.id === id) {
          const updated: CropMonitoringRecord = {
            ...r,
            healthStatus: "Monitoring",
            lastUpdated: "Just now",
          };
          if (selectedRecord?.id === id) setSelectedRecord(updated);
          return updated;
        }
        return r;
      })
    );
    showNotification(`Record marked for high-frequency field monitoring.`);
  };

  const handleCreateAdvisoryAlert = (id: string) => {
    setRecords((prev) =>
      prev.map((r) => {
        if (r.id === id) {
          const updated: CropMonitoringRecord = {
            ...r,
            advisoryIssued: true,
            lastUpdated: "Just now",
          };
          if (selectedRecord?.id === id) setSelectedRecord(updated);
          return updated;
        }
        return r;
      })
    );
    showNotification(`District Agricultural Advisory Alert broadcasted to Rythu Bharosa Kendras!`);
  };

  const handleExportCSV = () => {
    const headers = [
      "Record ID",
      "District",
      "Mandal",
      "Crop",
      "Variety",
      "Cultivated Area (Ha)",
      "Health Status",
      "Detected Issue",
      "Affected Area (Ha)",
      "Last Observation",
      "Last Updated",
    ];

    const rows = filteredRecords.map((r) => [
      `"${r.id}"`,
      `"${r.district}"`,
      `"${r.mandal}"`,
      `"${r.crop}"`,
      `"${r.variety}"`,
      r.areaHa,
      `"${r.healthStatus}"`,
      `"${r.detectedIssue.replace(/"/g, '""')}"`,
      r.affectedAreaHa,
      `"${r.lastObservation.replace(/"/g, '""')}"`,
      `"${r.lastUpdated}"`,
    ]);

    const csvContent = [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `District_Crop_Surveillance_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showNotification("District Crop Surveillance CSV downloaded successfully.");
  };

  // Status Badge styling helper
  const renderStatusBadge = (status: HealthStatusType) => {
    switch (status) {
      case "Healthy":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700 border border-emerald-200">
            <CheckCircle2 size={12} className="text-[#24833A]" />
            Healthy
          </span>
        );
      case "Monitoring":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-0.5 text-[11px] font-bold text-blue-700 border border-blue-200">
            <Activity size={12} className="text-blue-600" />
            Monitoring
          </span>
        );
      case "Pest Alert":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-[11px] font-bold text-amber-800 border border-amber-200">
            <AlertTriangle size={12} className="text-amber-600" />
            Pest Alert
          </span>
        );
      case "Disease Alert":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-orange-50 px-2.5 py-0.5 text-[11px] font-bold text-orange-800 border border-orange-200">
            <AlertOctagon size={12} className="text-orange-600" />
            Disease Alert
          </span>
        );
      case "Critical":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2.5 py-0.5 text-[11px] font-bold text-rose-800 border border-rose-200">
            <ShieldAlert size={12} className="text-rose-600" />
            Critical
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-5 pb-20">
      {/* Dynamic Feedback Banner */}
      {feedbackNotice && (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/95 p-3.5 text-xs font-bold text-[#174D25] shadow-xs flex items-center justify-between animate-fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={16} className="text-[#24833A] shrink-0" />
            <span>{feedbackNotice}</span>
          </div>
          <button
            type="button"
            onClick={() => setFeedbackNotice(null)}
            className="text-emerald-700 hover:text-emerald-900 text-xs px-2 cursor-pointer font-semibold"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* SINGLE VISIBLE BACK CONTROL HIERARCHY */}
      {selectedRecord ? (
        <div className="flex items-center justify-between">
          <BackButton
            id="btn-crop-back-to-crops"
            onClick={() => setSelectedRecord(null)}
            label={t("govtCrops.backToCropHealth") || "Back to Crop Health"}
          />
        </div>
      ) : (
        <div className="flex items-center justify-between">
          <BackButton
            id="btn-crop-back-to-dashboard"
            href="/dashboard"
            label={t("common.backToDashboard") || "Back to Dashboard"}
          />
        </div>
      )}

      {/* =========================================================
          VIEW A: DETAILED CROP HEALTH RECORD
      ========================================================= */}
      {selectedRecord ? (
        <div className="flex flex-col gap-5 animate-fade-in">
          {/* Header Card */}
          <div className="rounded-3xl border border-gray-200 bg-white p-5 sm:p-6 shadow-2xs">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#E4F0DD] text-[#24833A] shadow-xs">
                  <Sprout size={28} strokeWidth={2.4} />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                      {selectedRecord.crop} ({selectedRecord.variety})
                    </h1>
                    {renderStatusBadge(selectedRecord.healthStatus)}
                    {selectedRecord.advisoryIssued && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2.5 py-0.5 text-[10px] font-bold text-blue-800">
                        <BellRing size={11} /> Advisory Active
                      </span>
                    )}
                  </div>
                  <p className="text-xs sm:text-sm text-gray-500 font-medium mt-1 flex items-center gap-2">
                    <MapPin size={14} className="text-[#24833A]" />
                    <span>
                      {selectedRecord.mandal} Mandal, {selectedRecord.district} District
                    </span>
                    <span className="text-gray-300">•</span>
                    <Clock size={14} className="text-gray-400" />
                    <span>Updated {selectedRecord.lastUpdated}</span>
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleMarkForMonitoring(selectedRecord.id)}
                  disabled={selectedRecord.healthStatus === "Monitoring"}
                  className="rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2 text-xs font-bold text-gray-700 hover:bg-gray-100 transition disabled:opacity-50 cursor-pointer"
                >
                  Mark for Monitoring
                </button>
                <button
                  type="button"
                  onClick={() => handleCreateAdvisoryAlert(selectedRecord.id)}
                  className="rounded-xl bg-amber-600 px-3.5 py-2 text-xs font-bold text-white hover:bg-amber-700 transition cursor-pointer shadow-xs"
                >
                  Create Advisory Alert
                </button>
                <button
                  type="button"
                  onClick={() => router.push(`/dashboard/reports`)}
                  className="inline-flex items-center gap-1 rounded-xl bg-[#24833A] px-3.5 py-2 text-xs font-bold text-white hover:bg-[#174D25] transition cursor-pointer shadow-xs"
                >
                  <span>View District Report</span>
                  <ArrowRight size={13} />
                </button>
              </div>
            </div>
          </div>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-2xs">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wide">
                Cultivated Area
              </span>
              <p className="mt-1 text-lg sm:text-xl font-bold text-gray-900">
                {selectedRecord.areaHa.toLocaleString()} Ha
              </p>
              <span className="text-[10px] text-gray-500 font-medium">Under regional census</span>
            </div>
            <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-2xs">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wide">
                Affected Area
              </span>
              <p className="mt-1 text-lg sm:text-xl font-bold text-rose-700">
                {selectedRecord.affectedAreaHa > 0
                  ? `${selectedRecord.affectedAreaHa.toLocaleString()} Ha`
                  : "0 Ha (None)"}
              </p>
              <span className="text-[10px] text-gray-500 font-medium">
                {selectedRecord.areaHa > 0
                  ? `${((selectedRecord.affectedAreaHa / selectedRecord.areaHa) * 100).toFixed(1)}% of acreage`
                  : "Normal"}
              </span>
            </div>
            <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-2xs">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wide">
                Health Status
              </span>
              <p className="mt-1 text-base sm:text-lg font-bold text-gray-900">
                {selectedRecord.healthStatus}
              </p>
              <span className="text-[10px] text-gray-500 font-medium">Biosecurity classification</span>
            </div>
            <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-2xs">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wide">
                Surveillance ID
              </span>
              <p className="mt-1 text-base sm:text-lg font-bold text-blue-900">
                {selectedRecord.id}
              </p>
              <span className="text-[10px] text-gray-500 font-medium">Verified field record</span>
            </div>
          </div>

          {/* Observations and Government Action Plan */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Detected Issue & Field Observation */}
            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-2xs flex flex-col gap-3">
              <div className="flex items-center gap-2 border-b border-gray-100 pb-2.5">
                <AlertTriangle size={18} className="text-amber-600" />
                <h2 className="text-sm font-bold text-gray-900">Detected Issue & Agronomy Assessment</h2>
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase text-gray-400">Diagnosis:</span>
                <p className="text-xs sm:text-sm font-semibold text-gray-800 mt-0.5 leading-relaxed">
                  {selectedRecord.detectedIssue}
                </p>
              </div>
              <div className="rounded-xl bg-gray-50 p-3 border border-gray-100">
                <span className="text-[10px] font-bold uppercase text-gray-500 block mb-1">
                  Last Field Observation Record:
                </span>
                <p className="text-xs text-gray-700 leading-relaxed font-medium">
                  {selectedRecord.lastObservation}
                </p>
              </div>
            </div>

            {/* Recommended Government Action */}
            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-2xs flex flex-col gap-3">
              <div className="flex items-center gap-2 border-b border-gray-100 pb-2.5">
                <ShieldAlert size={18} className="text-[#24833A]" />
                <h2 className="text-sm font-bold text-gray-900">Recommended Government Action</h2>
              </div>
              <div className="rounded-xl bg-[#F4F8EE] p-3.5 border border-[#24833A]/20">
                <span className="text-[10px] font-bold uppercase text-[#174D25] block mb-1">
                  Administrative Directive:
                </span>
                <p className="text-xs sm:text-sm font-semibold text-gray-900 leading-relaxed">
                  {selectedRecord.recommendedAction}
                </p>
              </div>
              <div className="flex items-center justify-between text-[11px] text-gray-500 pt-1">
                <span>Directives synced to RBK Portal</span>
                <span className="font-bold text-[#24833A]">Authority: District Collectorate (Agri)</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* =========================================================
            VIEW B: MAIN ADMINISTRATIVE CROP MONITORING LIST
        ========================================================= */
        <div className="flex flex-col gap-5 animate-fade-in">
          {/* Header Card */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-3xl bg-white p-5 border border-gray-200 shadow-2xs">
            <div className="flex items-center gap-3.5">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#E4F0DD] text-[#24833A] shadow-xs">
                <Sprout size={26} strokeWidth={2.4} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-lg sm:text-xl font-bold text-gray-900">
                    {t("govtCrops.title") || "District Crop Health Monitoring"}
                  </h1>
                  <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-[#24833A] border border-emerald-200">
                    Administrative View
                  </span>
                </div>
                <p className="text-xs text-gray-500 font-medium">
                  {t("govtCrops.subtitle") ||
                    "Statewide surveillance of Kharif/Rabi standing crops, biosecurity alerts, and affected acreage"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-center">
              <button
                type="button"
                id="btn-export-crop-summary"
                onClick={handleExportCSV}
                className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-xs font-bold text-gray-700 shadow-2xs hover:border-[#24833A] hover:text-[#24833A] transition cursor-pointer"
                title="Download CSV"
              >
                <Download size={15} />
                <span>Download Summary</span>
              </button>
            </div>
          </div>

          {/* Metric Cards Banner */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-2xs">
              <div className="flex items-center justify-between text-gray-400">
                <span className="text-[11px] font-bold uppercase tracking-wider">
                  Surveillance Area
                </span>
                <Layers size={16} className="text-[#24833A]" />
              </div>
              <p className="mt-2 text-xl font-bold text-gray-900">
                {summaryMetrics.totalArea.toLocaleString()} Ha
              </p>
              <p className="mt-0.5 text-[11px] font-medium text-gray-500">
                Across 26 Districts
              </p>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-2xs">
              <div className="flex items-center justify-between text-gray-400">
                <span className="text-[11px] font-bold uppercase tracking-wider">
                  Normal Standing Crops
                </span>
                <CheckCircle2 size={16} className="text-emerald-600" />
              </div>
              <p className="mt-2 text-xl font-bold text-emerald-700">
                {summaryMetrics.healthyPercent}% Healthy
              </p>
              <p className="mt-0.5 text-[11px] font-medium text-gray-500">
                Zero biosecurity risk
              </p>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-2xs">
              <div className="flex items-center justify-between text-gray-400">
                <span className="text-[11px] font-bold uppercase tracking-wider">
                  Active Pest/Disease Alerts
                </span>
                <AlertTriangle size={16} className="text-amber-600" />
              </div>
              <p className="mt-2 text-xl font-bold text-amber-800">
                {summaryMetrics.alertCount} Clusters
              </p>
              <p className="mt-0.5 text-[11px] font-medium text-gray-500">
                Thrips & Tikka warning
              </p>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-2xs">
              <div className="flex items-center justify-between text-gray-400">
                <span className="text-[11px] font-bold uppercase tracking-wider">
                  Critical Intervention
                </span>
                <ShieldAlert size={16} className="text-rose-600" />
              </div>
              <p className="mt-2 text-xl font-bold text-rose-700">
                {summaryMetrics.criticalCount} Mandals
              </p>
              <p className="mt-0.5 text-[11px] font-medium text-gray-500">
                {summaryMetrics.affectedArea.toLocaleString()} Ha affected
              </p>
            </div>
          </div>

          {/* Interactive Filters Area */}
          <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-2xs">
            <div className="flex flex-col gap-3">
              {/* Row 1: Search and Dropdowns */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Search */}
                <div className="relative">
                  <Search
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search district, mandal, or crop..."
                    className="h-11 w-full rounded-xl border border-gray-200 pl-9 pr-3 text-xs focus:border-[#24833A] focus:outline-none"
                  />
                </div>

                {/* District Filter */}
                <div className="relative">
                  <select
                    value={districtFilter}
                    onChange={(e) => setDistrictFilter(e.target.value)}
                    className="h-11 w-full rounded-xl border border-gray-200 px-3 text-xs font-medium text-gray-700 focus:border-[#24833A] focus:outline-none"
                  >
                    <option value="all">All Districts ({availableDistricts.length})</option>
                    {availableDistricts.map((d) => (
                      <option key={d} value={d}>
                        {d} District
                      </option>
                    ))}
                  </select>
                </div>

                {/* Crop Filter */}
                <div className="relative">
                  <select
                    value={cropFilter}
                    onChange={(e) => setCropFilter(e.target.value)}
                    className="h-11 w-full rounded-xl border border-gray-200 px-3 text-xs font-medium text-gray-700 focus:border-[#24833A] focus:outline-none"
                  >
                    <option value="all">All Crops ({availableCrops.length})</option>
                    {availableCrops.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Row 2: Status Pills */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <span className="text-[11px] font-bold text-gray-400 mr-1">Status:</span>
                {(
                  [
                    "all",
                    "Healthy",
                    "Monitoring",
                    "Pest Alert",
                    "Disease Alert",
                    "Critical",
                  ] as const
                ).map((status) => {
                  const isActive = statusFilter === status;
                  return (
                    <button
                      key={status}
                      type="button"
                      onClick={() => setStatusFilter(status)}
                      className={`rounded-full px-3 py-1 text-xs font-bold transition cursor-pointer ${
                        isActive
                          ? "bg-[#24833A] text-white shadow-2xs"
                          : "border border-gray-200 bg-gray-50 text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      {status === "all" ? "All Statuses" : status}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Crop Records List / Table */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-bold text-gray-600">
                Surveillance Records ({filteredRecords.length})
              </span>
              <span className="text-[11px] text-gray-400">
                Click any record to inspect biosecurity details
              </span>
            </div>

            {filteredRecords.length === 0 ? (
              <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center shadow-2xs">
                <Sprout size={32} className="mx-auto text-gray-300" />
                <p className="mt-2 text-sm font-bold text-gray-700">No crop surveillance records match your filters.</p>
                <p className="text-xs text-gray-400 mt-1">Try resetting the district or health status filter.</p>
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    setDistrictFilter("all");
                    setCropFilter("all");
                    setStatusFilter("all");
                  }}
                  className="mt-3 rounded-xl bg-[#24833A] px-3.5 py-1.5 text-xs font-bold text-white hover:bg-[#174D25]"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3">
                {filteredRecords.map((record) => (
                  <div
                    key={record.id}
                    onClick={() => setSelectedRecord(record)}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 rounded-2xl border border-gray-200 bg-white p-4 shadow-2xs transition hover:border-[#24833A]/50 hover:shadow-xs cursor-pointer group"
                  >
                    <div className="flex items-start gap-3.5">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#F4FBF5] text-[#24833A] group-hover:scale-105 transition">
                        <Sprout size={22} />
                      </div>
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h2 className="text-sm font-bold text-gray-900 group-hover:text-[#24833A] transition">
                            {record.crop} ({record.variety})
                          </h2>
                          {renderStatusBadge(record.healthStatus)}
                          {record.advisoryIssued && (
                            <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-700 border border-blue-200">
                              Advisory Active
                            </span>
                          )}
                        </div>

                        <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-gray-500 font-medium">
                          <span className="text-gray-900 font-semibold">
                            {record.district} District
                          </span>
                          <span className="text-gray-300">•</span>
                          <span>{record.mandal} Mandal</span>
                          <span className="text-gray-300">•</span>
                          <span>Area: {record.areaHa.toLocaleString()} Ha</span>
                          {record.affectedAreaHa > 0 && (
                            <>
                              <span className="text-gray-300">•</span>
                              <span className="text-rose-600 font-semibold">
                                Affected: {record.affectedAreaHa.toLocaleString()} Ha
                              </span>
                            </>
                          )}
                        </div>

                        <p className="mt-1 text-xs text-gray-600 line-clamp-1">
                          <span className="font-semibold text-gray-700">Observation:</span> {record.detectedIssue}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-100">
                      <div className="text-left sm:text-right">
                        <span className="text-[10px] text-gray-400 block font-medium">Last Updated</span>
                        <span className="text-xs font-semibold text-gray-700">{record.lastUpdated}</span>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedRecord(record);
                        }}
                        className="flex h-9 w-9 items-center justify-center rounded-xl bg-gray-50 text-gray-500 group-hover:bg-[#E4F0DD] group-hover:text-[#24833A] transition"
                        title="View Details"
                      >
                        <ChevronRight size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
