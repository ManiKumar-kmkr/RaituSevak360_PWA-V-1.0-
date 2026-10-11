"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Users,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  AlertOctagon,
  Clock,
  Search,
  Filter,
  Download,
  Eye,
  MapPin,
  Calendar,
  FileText,
  Phone,
  Sprout,
  Trees,
  Landmark,
  Check,
  X,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Sparkles,
  Info,
  Layers,
  ChevronRight,
  History,
  FileCheck,
  HelpCircle,
} from "lucide-react";
import BackButton from "@/components/ui/BackButton";
import { useTranslation } from "@/hooks/useTranslation";

export type FarmerVerificationStatus =
  | "pending"
  | "under_review"
  | "verified"
  | "clarification_required"
  | "rejected";

export type LandholdingCategory =
  | "Marginal (< 1 Ha)"
  | "Small (1-2 Ha)"
  | "Semi-Medium (2-4 Ha)"
  | "Medium (4-10 Ha)"
  | "Large (> 10 Ha)";

export type FarmerType =
  | "Small & Marginal Farmer"
  | "Medium Farmer"
  | "Large Cultivator"
  | "Tenant Farmer"
  | "Organic Certified Cultivator";

export interface FarmerCredentialDoc {
  id: string;
  category: "Identity Proof" | "Land / Cultivation Proof" | "Bank / Benefit Eligibility Proof" | "Farmer Registration Proof";
  name: string;
  maskedReference: string;
  submittedDate: string;
  status: "not_submitted" | "submitted" | "under_review" | "verified" | "clarification_required" | "rejected";
  fileType: string;
  fileSize: string;
  reviewerNote?: string;
  clarificationReason?: string;
  rejectionReason?: string;
}

export interface FarmerTimelineEvent {
  title: string;
  date: string;
  actor: string;
  note?: string;
}

export interface FarmerRecord {
  id: string;
  registrationId: string;
  farmerName: string;
  maskedMobile: string;
  rawMobileSearch: string;
  maskedAadhaar: string;
  gender: "Male" | "Female" | "Other";
  registrationDate: string;
  verificationStatus: FarmerVerificationStatus;
  farmerType: FarmerType;

  // Location
  state: string;
  district: string;
  mandal: string;
  village: string;

  // Agricultural Info
  landholdingCategory: LandholdingCategory;
  approxLandArea: string;
  primaryCrop: string;
  secondaryCrop: string;
  irrigationType: string;
  farmingType: string;

  // Government Registration Info
  registrationSource: string;
  lastUpdated: string;
  verifiedDate?: string;
  verifiedBy?: string;
  verificationReference?: string;
  clarificationReason?: string;
  rejectionReason?: string;
  reviewerNote?: string;

  // Documents
  documents: FarmerCredentialDoc[];

  // Activity Timeline & Status History
  timeline: FarmerTimelineEvent[];
  statusHistory: Array<{ status: FarmerVerificationStatus; timestamp: string }>;
}

const INITIAL_FARMERS: FarmerRecord[] = [
  {
    id: "farmer-01",
    registrationId: "FAR-2026-001248",
    farmerName: "B. Venkata Ramana",
    maskedMobile: "+91 98480 •••••",
    rawMobileSearch: "9848021482",
    maskedAadhaar: "XXXX-XXXX-1248",
    gender: "Male",
    registrationDate: "02 Oct 2026",
    verificationStatus: "verified",
    farmerType: "Small & Marginal Farmer",
    state: "Andhra Pradesh",
    district: "Guntur",
    mandal: "Tenali",
    village: "Angalakuduru",
    landholdingCategory: "Small (1-2 Ha)",
    approxLandArea: "3.50 Acres",
    primaryCrop: "Paddy (BPT 5204)",
    secondaryCrop: "Black Gram",
    irrigationType: "Canal + Borewell",
    farmingType: "Conventional High Yield",
    registrationSource: "Rythu Bharosa Kendra (RBK) Portal",
    lastUpdated: "08 Oct 2026, 03:30 PM",
    verifiedDate: "08 Oct 2026",
    verifiedBy: "DAO Secretariat Verification Cell",
    verificationReference: "FVR-2026-004821",
    documents: [
      {
        id: "doc-1",
        category: "Identity Proof",
        name: "Aadhaar / Resident Card",
        maskedReference: "AADHAAR-XXXX-1248",
        submittedDate: "02 Oct 2026",
        status: "verified",
        fileType: "application/pdf",
        fileSize: "1.2 MB",
      },
      {
        id: "doc-2",
        category: "Land / Cultivation Proof",
        name: "1B Adangal Land Record",
        maskedReference: "ADANGAL-AP-2026-0912",
        submittedDate: "02 Oct 2026",
        status: "verified",
        fileType: "application/pdf",
        fileSize: "2.1 MB",
      },
      {
        id: "doc-3",
        category: "Bank / Benefit Eligibility Proof",
        name: "DBT Linked Bank Passbook",
        maskedReference: "SBIN000XXXX-4412",
        submittedDate: "02 Oct 2026",
        status: "verified",
        fileType: "application/pdf",
        fileSize: "0.9 MB",
      },
      {
        id: "doc-4",
        category: "Farmer Registration Proof",
        name: "RBK Enrollment Certificate",
        maskedReference: "RBK-ENR-2026-3011",
        submittedDate: "02 Oct 2026",
        status: "verified",
        fileType: "application/pdf",
        fileSize: "1.4 MB",
      },
    ],
    timeline: [
      {
        title: "Farmer Verified",
        date: "08 Oct 2026, 03:30 PM",
        actor: "District Agriculture Officer",
        note: "All 1B Adangal and Aadhaar records authenticated.",
      },
      {
        title: "Documents Received & Verified",
        date: "05 Oct 2026, 11:00 AM",
        actor: "Secretariat Verification Desk",
      },
      {
        title: "Farmer Registration Created",
        date: "02 Oct 2026, 09:15 AM",
        actor: "RBK Field Staff (Tenali)",
      },
    ],
    statusHistory: [
      { status: "pending", timestamp: "02 Oct 2026, 09:15 AM" },
      { status: "under_review", timestamp: "05 Oct 2026, 11:00 AM" },
      { status: "verified", timestamp: "08 Oct 2026, 03:30 PM" },
    ],
  },
  {
    id: "farmer-02",
    registrationId: "FAR-2026-002491",
    farmerName: "K. Lakshmi Devi",
    maskedMobile: "+91 94401 •••••",
    rawMobileSearch: "9440188921",
    maskedAadhaar: "XXXX-XXXX-4912",
    gender: "Female",
    registrationDate: "05 Oct 2026",
    verificationStatus: "under_review",
    farmerType: "Tenant Farmer",
    state: "Andhra Pradesh",
    district: "Krishna",
    mandal: "Gudivada",
    village: "Valivarthipadu",
    landholdingCategory: "Marginal (< 1 Ha)",
    approxLandArea: "1.80 Acres",
    primaryCrop: "Paddy (MTU 1061)",
    secondaryCrop: "Fodder Sorghum",
    irrigationType: "Krishna Delta Canal",
    farmingType: "Zero Budget Natural Farming (ZBNF)",
    registrationSource: "CCRC Tenant Portal (State Revenue)",
    lastUpdated: "Yesterday, 04:15 PM",
    reviewerNote: "Crop Cultivator Rights Certificate (CCRC) agreement undergoing land revenue verification.",
    documents: [
      {
        id: "doc-1",
        category: "Identity Proof",
        name: "Aadhaar Card",
        maskedReference: "AADHAAR-XXXX-4912",
        submittedDate: "05 Oct 2026",
        status: "verified",
        fileType: "application/pdf",
        fileSize: "1.0 MB",
      },
      {
        id: "doc-2",
        category: "Land / Cultivation Proof",
        name: "CCRC Tenant Lease Agreement",
        maskedReference: "CCRC-KRI-2026-781",
        submittedDate: "05 Oct 2026",
        status: "under_review",
        fileType: "application/pdf",
        fileSize: "1.7 MB",
      },
      {
        id: "doc-3",
        category: "Bank / Benefit Eligibility Proof",
        name: "Andhra Pragathi Grameena Bank",
        maskedReference: "APGBXXXX-9102",
        submittedDate: "05 Oct 2026",
        status: "verified",
        fileType: "application/pdf",
        fileSize: "0.8 MB",
      },
      {
        id: "doc-4",
        category: "Farmer Registration Proof",
        name: "Mandal RBK Token",
        maskedReference: "RBK-GUD-2026-192",
        submittedDate: "05 Oct 2026",
        status: "under_review",
        fileType: "application/pdf",
        fileSize: "1.1 MB",
      },
    ],
    timeline: [
      {
        title: "Verification Started",
        date: "07 Oct 2026, 04:15 PM",
        actor: "Mandal Revenue Inspector",
        note: "CCRC lease verified with landowner confirmation.",
      },
      {
        title: "Documents Submitted",
        date: "05 Oct 2026, 02:40 PM",
        actor: "K. Lakshmi Devi",
      },
      {
        title: "Farmer Registration Created",
        date: "05 Oct 2026, 11:20 AM",
        actor: "RBK Help Desk",
      },
    ],
    statusHistory: [
      { status: "pending", timestamp: "05 Oct 2026, 11:20 AM" },
      { status: "under_review", timestamp: "07 Oct 2026, 04:15 PM" },
    ],
  },
  {
    id: "farmer-03",
    registrationId: "FAR-2026-003810",
    farmerName: "M. Nageswara Rao",
    maskedMobile: "+91 97012 •••••",
    rawMobileSearch: "9701244091",
    maskedAadhaar: "XXXX-XXXX-8104",
    gender: "Male",
    registrationDate: "06 Oct 2026",
    verificationStatus: "clarification_required",
    farmerType: "Medium Farmer",
    state: "Andhra Pradesh",
    district: "Kurnool",
    mandal: "Nandyal",
    village: "Chapad",
    landholdingCategory: "Medium (4-10 Ha)",
    approxLandArea: "8.20 Acres",
    primaryCrop: "Cotton (Bt II)",
    secondaryCrop: "Bengal Gram / Chickpea",
    irrigationType: "Drip Irrigation + Borewell",
    farmingType: "Mechanized Cash Crop Cultivation",
    registrationSource: "Direct Farmer Registration Portal",
    lastUpdated: "08 Oct 2026, 06:10 PM",
    clarificationReason: "Page 2 of the Land Patta Passbook is missing revenue sub-registrar seal. Please upload a clear scanned copy.",
    reviewerNote: "Waiting for applicant to upload certified survey number sketch.",
    documents: [
      {
        id: "doc-1",
        category: "Identity Proof",
        name: "Voter Photo ID Card",
        maskedReference: "EPIC-AP-XXXX-8104",
        submittedDate: "06 Oct 2026",
        status: "verified",
        fileType: "application/pdf",
        fileSize: "1.1 MB",
      },
      {
        id: "doc-2",
        category: "Land / Cultivation Proof",
        name: "Pattadar Passbook (Missing Seal)",
        maskedReference: "PPB-KUR-2025-4190",
        submittedDate: "06 Oct 2026",
        status: "clarification_required",
        clarificationReason: "Missing sub-registrar verification seal on page 2.",
        fileType: "application/pdf",
        fileSize: "2.4 MB",
      },
      {
        id: "doc-3",
        category: "Bank / Benefit Eligibility Proof",
        name: "Union Bank of India Passbook",
        maskedReference: "UBIN05XXXX-3101",
        submittedDate: "06 Oct 2026",
        status: "verified",
        fileType: "application/pdf",
        fileSize: "0.7 MB",
      },
      {
        id: "doc-4",
        category: "Farmer Registration Proof",
        name: "Soil Health Card Acknowledgement",
        maskedReference: "SHC-AP-KUR-2026-90",
        submittedDate: "06 Oct 2026",
        status: "submitted",
        fileType: "application/pdf",
        fileSize: "1.0 MB",
      },
    ],
    timeline: [
      {
        title: "Clarification Requested",
        date: "08 Oct 2026, 06:10 PM",
        actor: "District Agriculture Officer",
        note: "Patta Passbook page 2 missing sub-registrar seal.",
      },
      {
        title: "Verification Started",
        date: "07 Oct 2026, 10:00 AM",
        actor: "Secretariat Desk",
      },
      {
        title: "Farmer Registration Created",
        date: "06 Oct 2026, 04:30 PM",
        actor: "Direct Portal Submission",
      },
    ],
    statusHistory: [
      { status: "pending", timestamp: "06 Oct 2026, 04:30 PM" },
      { status: "under_review", timestamp: "07 Oct 2026, 10:00 AM" },
      { status: "clarification_required", timestamp: "08 Oct 2026, 06:10 PM" },
    ],
  },
  {
    id: "farmer-04",
    registrationId: "FAR-2026-004192",
    farmerName: "T. Srinivasa Murthy",
    maskedMobile: "+91 99890 •••••",
    rawMobileSearch: "9989077211",
    maskedAadhaar: "XXXX-XXXX-9192",
    gender: "Male",
    registrationDate: "07 Oct 2026",
    verificationStatus: "rejected",
    farmerType: "Large Cultivator",
    state: "Andhra Pradesh",
    district: "Anantapur",
    mandal: "Dharmavaram",
    village: "Goturu",
    landholdingCategory: "Large (> 10 Ha)",
    approxLandArea: "14.50 Acres",
    primaryCrop: "Groundnut (Kadir 6)",
    secondaryCrop: "Sweet Orange / Horticulture",
    irrigationType: "Solar Drip Borewell",
    farmingType: "Dryland Horticulture",
    registrationSource: "Horticulture Cluster Desk",
    lastUpdated: "08 Oct 2026, 02:20 PM",
    rejectionReason: "Survey number listed (Sy 412/A) does not exist in Webland database and Aadhaar holder name does not match land title owner.",
    reviewerNote: "Suspected invalid documentation. Applicant advised to re-register with legitimate revenue patta.",
    documents: [
      {
        id: "doc-1",
        category: "Identity Proof",
        name: "Aadhaar Card",
        maskedReference: "AADHAAR-XXXX-9192",
        submittedDate: "07 Oct 2026",
        status: "verified",
        fileType: "application/pdf",
        fileSize: "0.9 MB",
      },
      {
        id: "doc-2",
        category: "Land / Cultivation Proof",
        name: "Webland Extract (Mismatched)",
        maskedReference: "WEBLAND-ANA-2024-00",
        submittedDate: "07 Oct 2026",
        status: "rejected",
        rejectionReason: "Survey number Sy 412/A not located in Webland database.",
        fileType: "application/pdf",
        fileSize: "1.5 MB",
      },
    ],
    timeline: [
      {
        title: "Verification Rejected",
        date: "08 Oct 2026, 02:20 PM",
        actor: "Joint Director of Agriculture",
        note: "Webland revenue mismatched.",
      },
      {
        title: "Verification Started",
        date: "07 Oct 2026, 03:00 PM",
        actor: "Secretariat Audit Desk",
      },
      {
        title: "Farmer Registration Created",
        date: "07 Oct 2026, 01:15 PM",
        actor: "Cluster Desk Staff",
      },
    ],
    statusHistory: [
      { status: "pending", timestamp: "07 Oct 2026, 01:15 PM" },
      { status: "under_review", timestamp: "07 Oct 2026, 03:00 PM" },
      { status: "rejected", timestamp: "08 Oct 2026, 02:20 PM" },
    ],
  },
  {
    id: "farmer-05",
    registrationId: "FAR-2026-005520",
    farmerName: "P. Satyanarayana Reddy",
    maskedMobile: "+91 94900 •••••",
    rawMobileSearch: "9490012890",
    maskedAadhaar: "XXXX-XXXX-5520",
    gender: "Male",
    registrationDate: "08 Oct 2026",
    verificationStatus: "pending",
    farmerType: "Organic Certified Cultivator",
    state: "Andhra Pradesh",
    district: "West Godavari",
    mandal: "Bhimavaram",
    village: "Losarigutlapadu",
    landholdingCategory: "Semi-Medium (2-4 Ha)",
    approxLandArea: "4.25 Acres",
    primaryCrop: "Organic Paddy (Indrayani)",
    secondaryCrop: "Fish-cum-Paddy Aquaculture",
    irrigationType: "Canal + Ground Aquifer",
    farmingType: "Organic Certified Cultivation",
    registrationSource: "Rythu Bharosa Kendra (RBK) Portal",
    lastUpdated: "08 Oct 2026, 10:00 AM",
    documents: [
      {
        id: "doc-1",
        category: "Identity Proof",
        name: "Aadhaar Card",
        maskedReference: "AADHAAR-XXXX-5520",
        submittedDate: "08 Oct 2026",
        status: "submitted",
        fileType: "application/pdf",
        fileSize: "1.1 MB",
      },
      {
        id: "doc-2",
        category: "Land / Cultivation Proof",
        name: "Electronic 1B Adangal Passbook",
        maskedReference: "1B-WGOD-2026-9921",
        submittedDate: "08 Oct 2026",
        status: "submitted",
        fileType: "application/pdf",
        fileSize: "2.0 MB",
      },
      {
        id: "doc-3",
        category: "Bank / Benefit Eligibility Proof",
        name: "Canara Bank DBT Account",
        maskedReference: "CNRB000XXXX-1120",
        submittedDate: "08 Oct 2026",
        status: "submitted",
        fileType: "application/pdf",
        fileSize: "0.9 MB",
      },
      {
        id: "doc-4",
        category: "Farmer Registration Proof",
        name: "AP Organic Certification Certificate",
        maskedReference: "APOC-ORG-2025-412",
        submittedDate: "08 Oct 2026",
        status: "submitted",
        fileType: "application/pdf",
        fileSize: "1.6 MB",
      },
    ],
    timeline: [
      {
        title: "Documents Submitted",
        date: "08 Oct 2026, 10:30 AM",
        actor: "P. Satyanarayana Reddy",
      },
      {
        title: "Farmer Registration Created",
        date: "08 Oct 2026, 10:00 AM",
        actor: "Bhimavaram RBK Officer",
      },
    ],
    statusHistory: [{ status: "pending", timestamp: "08 Oct 2026, 10:00 AM" }],
  },
  {
    id: "farmer-06",
    registrationId: "FAR-2026-006318",
    farmerName: "G. Kamala Bai",
    maskedMobile: "+91 91770 •••••",
    rawMobileSearch: "9177033182",
    maskedAadhaar: "XXXX-XXXX-6318",
    gender: "Female",
    registrationDate: "08 Oct 2026",
    verificationStatus: "verified",
    farmerType: "Small & Marginal Farmer",
    state: "Andhra Pradesh",
    district: "Chittoor",
    mandal: "Madanapalle",
    village: "Basinikonda",
    landholdingCategory: "Small (1-2 Ha)",
    approxLandArea: "2.75 Acres",
    primaryCrop: "Tomato (Hybrid)",
    secondaryCrop: "Mulberry / Sericulture",
    irrigationType: "Drip Irrigation",
    farmingType: "Precision Horticulture",
    registrationSource: "Madanapalle RBK Sub-division",
    lastUpdated: "Today, 09:30 AM",
    verifiedDate: "09 Oct 2026",
    verifiedBy: "Assistant Director of Horticulture",
    verificationReference: "FVR-2026-009941",
    documents: [
      {
        id: "doc-1",
        category: "Identity Proof",
        name: "Aadhaar Card",
        maskedReference: "AADHAAR-XXXX-6318",
        submittedDate: "08 Oct 2026",
        status: "verified",
        fileType: "application/pdf",
        fileSize: "1.0 MB",
      },
      {
        id: "doc-2",
        category: "Land / Cultivation Proof",
        name: "D-Pattadar Passbook",
        maskedReference: "DPPB-CHT-2025-110",
        submittedDate: "08 Oct 2026",
        status: "verified",
        fileType: "application/pdf",
        fileSize: "1.8 MB",
      },
      {
        id: "doc-3",
        category: "Bank / Benefit Eligibility Proof",
        name: "Bank of Baroda DBT Linked",
        maskedReference: "BARB0XXXX-7718",
        submittedDate: "08 Oct 2026",
        status: "verified",
        fileType: "application/pdf",
        fileSize: "0.8 MB",
      },
    ],
    timeline: [
      {
        title: "Farmer Verified",
        date: "09 Oct 2026, 09:30 AM",
        actor: "Assistant Director of Horticulture",
        note: "Sericulture and tomato cultivation plot authenticated.",
      },
      {
        title: "Documents Submitted",
        date: "08 Oct 2026, 03:00 PM",
        actor: "G. Kamala Bai",
      },
      {
        title: "Farmer Registration Created",
        date: "08 Oct 2026, 12:45 PM",
        actor: "RBK Madanapalle",
      },
    ],
    statusHistory: [
      { status: "pending", timestamp: "08 Oct 2026, 12:45 PM" },
      { status: "under_review", timestamp: "08 Oct 2026, 04:00 PM" },
      { status: "verified", timestamp: "09 Oct 2026, 09:30 AM" },
    ],
  },
];

export default function GovtFarmerRegistryWorkspace() {
  const router = useRouter();
  const { t } = useTranslation();

  // Core Farmer Registry state
  const [farmers, setFarmers] = useState<FarmerRecord[]>(INITIAL_FARMERS);
  const [selectedFarmer, setSelectedFarmer] = useState<FarmerRecord | null>(null);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [districtFilter, setDistrictFilter] = useState<string>("all");
  const [mandalFilter, setMandalFilter] = useState<string>("all");
  const [farmerTypeFilter, setFarmerTypeFilter] = useState<string>("all");
  const [landCategoryFilter, setLandCategoryFilter] = useState<string>("all");

  // Document Audit modal state
  const [activeDocReview, setActiveDocReview] = useState<FarmerCredentialDoc | null>(null);
  const [docReviewNote, setDocReviewNote] = useState("");
  const [docActionError, setDocActionError] = useState<string | null>(null);

  // Decision Modal state
  const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false);
  const [isClarificationModalOpen, setIsClarificationModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);

  // Decision form fields
  const [clarificationReasonInput, setClarificationReasonInput] = useState("");
  const [clarificationAffectedDoc, setClarificationAffectedDoc] = useState("");
  const [rejectionReasonInput, setRejectionReasonInput] = useState("");
  const [decisionReviewerNote, setDecisionReviewerNote] = useState("");
  const [modalValidationError, setModalValidationError] = useState<string | null>(null);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Metrics calculation
  const metrics = useMemo(() => {
    const total = farmers.length;
    const verified = farmers.filter((f) => f.verificationStatus === "verified").length;
    const pending = farmers.filter((f) => f.verificationStatus === "pending").length;
    const underReview = farmers.filter((f) => f.verificationStatus === "under_review").length;
    const clarification = farmers.filter((f) => f.verificationStatus === "clarification_required").length;
    const rejected = farmers.filter((f) => f.verificationStatus === "rejected").length;
    const active = farmers.filter((f) => f.verificationStatus !== "rejected").length;

    return { total, verified, pending, underReview, clarification, rejected, active };
  }, [farmers]);

  // Unique Districts for dropdown
  const availableDistricts = useMemo(() => {
    return Array.from(new Set(farmers.map((f) => f.district))).sort();
  }, [farmers]);

  // Mandals filtered by selected district
  const availableMandals = useMemo(() => {
    const pool = districtFilter === "all" ? farmers : farmers.filter((f) => f.district === districtFilter);
    return Array.from(new Set(pool.map((f) => f.mandal))).sort();
  }, [farmers, districtFilter]);

  // Filtered farmers list
  const filteredFarmers = useMemo(() => {
    return farmers.filter((farmer) => {
      if (statusFilter !== "all" && farmer.verificationStatus !== statusFilter) return false;
      if (districtFilter !== "all" && farmer.district !== districtFilter) return false;
      if (mandalFilter !== "all" && farmer.mandal !== mandalFilter) return false;
      if (farmerTypeFilter !== "all" && farmer.farmerType !== farmerTypeFilter) return false;
      if (landCategoryFilter !== "all" && farmer.landholdingCategory !== landCategoryFilter) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matches =
          farmer.farmerName.toLowerCase().includes(q) ||
          farmer.registrationId.toLowerCase().includes(q) ||
          farmer.rawMobileSearch.includes(q) ||
          farmer.maskedMobile.toLowerCase().includes(q) ||
          farmer.district.toLowerCase().includes(q) ||
          farmer.mandal.toLowerCase().includes(q) ||
          farmer.village.toLowerCase().includes(q) ||
          farmer.maskedAadhaar.toLowerCase().includes(q);

        if (!matches) return false;
      }

      return true;
    });
  }, [farmers, statusFilter, districtFilter, mandalFilter, farmerTypeFilter, landCategoryFilter, searchQuery]);

  // Status Badge Helper
  const renderStatusBadge = (status: FarmerVerificationStatus) => {
    switch (status) {
      case "verified":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-800 border border-emerald-300">
            <CheckCircle2 size={12} className="text-[#24833A]" /> Verified
          </span>
        );
      case "under_review":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-bold text-blue-900 border border-blue-300">
            <Clock size={12} className="text-blue-700" /> Under Review
          </span>
        );
      case "pending":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-bold text-amber-900 border border-amber-300">
            <Clock size={12} className="text-amber-700" /> Pending Verification
          </span>
        );
      case "clarification_required":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-orange-100 px-2.5 py-0.5 text-xs font-bold text-orange-900 border border-orange-300">
            <AlertTriangle size={12} className="text-orange-700" /> Clarification Required
          </span>
        );
      case "rejected":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-rose-100 px-2.5 py-0.5 text-xs font-bold text-rose-900 border border-rose-300">
            <AlertOctagon size={12} className="text-rose-700" /> Rejected
          </span>
        );
    }
  };

  // Client-side CSV Export (PART Q)
  const handleExportCsv = () => {
    if (filteredFarmers.length === 0) {
      showToast("No farmers match current filters to export.");
      return;
    }

    const headers = [
      "Registration ID",
      "Farmer Name",
      "Masked Mobile",
      "District",
      "Mandal",
      "Village",
      "Landholding Category",
      "Approx Land Area",
      "Primary Crop",
      "Farmer Type",
      "Registration Date",
      "Verification Status",
    ];

    const rows = filteredFarmers.map((f) => [
      f.registrationId,
      `"${f.farmerName}"`,
      `"${f.maskedMobile}"`,
      `"${f.district}"`,
      `"${f.mandal}"`,
      `"${f.village}"`,
      `"${f.landholdingCategory}"`,
      `"${f.approxLandArea}"`,
      `"${f.primaryCrop}"`,
      `"${f.farmerType}"`,
      f.registrationDate,
      f.verificationStatus,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Farmer_Registry_Export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast(`Exported ${filteredFarmers.length} farmer registry records.`);
  };

  // Action: Mark Under Review
  const handleMarkUnderReview = () => {
    if (!selectedFarmer) return;

    const today = new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
    const time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    const updatedTimeline: FarmerTimelineEvent = {
      title: "Verification Started",
      date: `${today}, ${time}`,
      actor: "Authorized Audit Reviewer",
      note: "Farmer credentials queued for departmental review.",
    };

    const updatedRecord: FarmerRecord = {
      ...selectedFarmer,
      verificationStatus: "under_review",
      lastUpdated: "Just now",
      timeline: [updatedTimeline, ...selectedFarmer.timeline],
      statusHistory: [...selectedFarmer.statusHistory, { status: "under_review", timestamp: `${today}, ${time}` }],
    };

    setSelectedFarmer(updatedRecord);
    setFarmers((prev) => prev.map((f) => (f.id === updatedRecord.id ? updatedRecord : f)));
    showToast(`Farmer ${selectedFarmer.registrationId} moved to Under Review.`);
  };

  // Action: Verify Farmer (PART K)
  const handleConfirmVerification = () => {
    if (!selectedFarmer) return;

    const today = new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
    const time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const genRef = `FVR-2026-${Math.floor(100000 + Math.random() * 900000)}`;

    const updatedTimeline: FarmerTimelineEvent = {
      title: "Farmer Verified",
      date: `${today}, ${time}`,
      actor: "DAO Secretariat Verification Cell",
      note: decisionReviewerNote.trim() || "Farmer landholding and identity records verified in registry workspace.",
    };

    const updatedDocs = selectedFarmer.documents.map((d) => ({
      ...d,
      status: "verified" as const,
    }));

    const updatedRecord: FarmerRecord = {
      ...selectedFarmer,
      verificationStatus: "verified",
      verifiedDate: today,
      verifiedBy: "DAO Secretariat Verification Cell",
      verificationReference: genRef,
      lastUpdated: "Just now",
      documents: updatedDocs,
      timeline: [updatedTimeline, ...selectedFarmer.timeline],
      statusHistory: [...selectedFarmer.statusHistory, { status: "verified", timestamp: `${today}, ${time}` }],
    };

    setSelectedFarmer(updatedRecord);
    setFarmers((prev) => prev.map((f) => (f.id === updatedRecord.id ? updatedRecord : f)));
    setIsVerifyModalOpen(false);
    setDecisionReviewerNote("");
    showToast(`Farmer ${selectedFarmer.farmerName} verified successfully (Ref: ${genRef}).`);
  };

  // Action: Request Clarification (PART L)
  const handleSubmitClarification = () => {
    if (!selectedFarmer) return;

    if (!clarificationReasonInput.trim()) {
      setModalValidationError("Clarification Reason is mandatory.");
      return;
    }

    const today = new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
    const time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    const updatedTimeline: FarmerTimelineEvent = {
      title: "Clarification Requested",
      date: `${today}, ${time}`,
      actor: "Government Verification Reviewer",
      note: `${clarificationReasonInput.trim()} ${clarificationAffectedDoc ? `(Item: ${clarificationAffectedDoc})` : ""}`,
    };

    const updatedRecord: FarmerRecord = {
      ...selectedFarmer,
      verificationStatus: "clarification_required",
      clarificationReason: clarificationReasonInput.trim(),
      reviewerNote: decisionReviewerNote.trim() || undefined,
      lastUpdated: "Just now",
      timeline: [updatedTimeline, ...selectedFarmer.timeline],
      statusHistory: [
        ...selectedFarmer.statusHistory,
        { status: "clarification_required", timestamp: `${today}, ${time}` },
      ],
    };

    setSelectedFarmer(updatedRecord);
    setFarmers((prev) => prev.map((f) => (f.id === updatedRecord.id ? updatedRecord : f)));
    setIsClarificationModalOpen(false);
    setClarificationReasonInput("");
    setClarificationAffectedDoc("");
    setDecisionReviewerNote("");
    setModalValidationError(null);
    showToast(`Clarification requested for ${selectedFarmer.farmerName}.`);
  };

  // Action: Reject Farmer Verification (PART M)
  const handleConfirmRejection = () => {
    if (!selectedFarmer) return;

    if (!rejectionReasonInput.trim()) {
      setModalValidationError("Rejection Reason is mandatory.");
      return;
    }

    const today = new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
    const time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    const updatedTimeline: FarmerTimelineEvent = {
      title: "Verification Rejected",
      date: `${today}, ${time}`,
      actor: "Joint Director of Agriculture",
      note: rejectionReasonInput.trim(),
    };

    const updatedRecord: FarmerRecord = {
      ...selectedFarmer,
      verificationStatus: "rejected",
      rejectionReason: rejectionReasonInput.trim(),
      reviewerNote: decisionReviewerNote.trim() || undefined,
      lastUpdated: "Just now",
      timeline: [updatedTimeline, ...selectedFarmer.timeline],
      statusHistory: [...selectedFarmer.statusHistory, { status: "rejected", timestamp: `${today}, ${time}` }],
    };

    setSelectedFarmer(updatedRecord);
    setFarmers((prev) => prev.map((f) => (f.id === updatedRecord.id ? updatedRecord : f)));
    setIsRejectModalOpen(false);
    setRejectionReasonInput("");
    setDecisionReviewerNote("");
    setModalValidationError(null);
    showToast(`Verification rejected for ${selectedFarmer.farmerName}.`);
  };

  // Action: Return to Review
  const handleReturnToReview = () => {
    if (!selectedFarmer) return;
    const today = new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
    const time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    const updatedTimeline: FarmerTimelineEvent = {
      title: "Returned to Review",
      date: `${today}, ${time}`,
      actor: "Secretariat Desk Reviewer",
      note: "Application reopened for secondary inspection.",
    };

    const updatedRecord: FarmerRecord = {
      ...selectedFarmer,
      verificationStatus: "under_review",
      lastUpdated: "Just now",
      timeline: [updatedTimeline, ...selectedFarmer.timeline],
      statusHistory: [...selectedFarmer.statusHistory, { status: "under_review", timestamp: `${today}, ${time}` }],
    };

    setSelectedFarmer(updatedRecord);
    setFarmers((prev) => prev.map((f) => (f.id === updatedRecord.id ? updatedRecord : f)));
    showToast(`Farmer ${selectedFarmer.registrationId} returned to review.`);
  };

  // Document status toggle inside modal
  const handleUpdateDocumentStatus = (status: "verified" | "clarification_required" | "rejected") => {
    if (!activeDocReview || !selectedFarmer) return;

    if ((status === "clarification_required" || status === "rejected") && !docReviewNote.trim()) {
      setDocActionError("A reason or reviewer note is mandatory.");
      return;
    }

    const updatedDocs = selectedFarmer.documents.map((d) => {
      if (d.id === activeDocReview.id) {
        return {
          ...d,
          status,
          reviewerNote: docReviewNote.trim() || undefined,
          clarificationReason: status === "clarification_required" ? docReviewNote.trim() : undefined,
          rejectionReason: status === "rejected" ? docReviewNote.trim() : undefined,
        };
      }
      return d;
    });

    const updatedRecord: FarmerRecord = {
      ...selectedFarmer,
      documents: updatedDocs,
      lastUpdated: "Just now",
    };

    setSelectedFarmer(updatedRecord);
    setFarmers((prev) => prev.map((f) => (f.id === updatedRecord.id ? updatedRecord : f)));
    setActiveDocReview(null);
    setDocReviewNote("");
    setDocActionError(null);
    showToast(`Document marked as ${status.replace("_", " ")}.`);
  };

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-5 pb-20">
      {/* Toast Banner */}
      {toastMessage && (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/95 p-3.5 text-xs font-bold text-[#174D25] shadow-xs flex items-center justify-between animate-fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={16} className="text-[#24833A] shrink-0" />
            <span>{toastMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            className="text-emerald-700 hover:text-emerald-900 text-xs px-2 cursor-pointer font-semibold"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* SINGLE VISIBLE BACK CONTROL HIERARCHY */}
      {selectedFarmer ? (
        <div className="flex items-center justify-between">
          <BackButton
            id="btn-back-to-farmer-registry"
            onClick={() => setSelectedFarmer(null)}
            label={t("govtFarmerRegistry.backToFarmerRegistry") || "Back to Farmer Registry"}
          />
        </div>
      ) : (
        <div className="flex items-center justify-between">
          <BackButton
            id="btn-registry-back-to-dashboard"
            href="/dashboard"
            label={t("common.backToDashboard") || "Back to Dashboard"}
          />
        </div>
      )}

      {/* =========================================================
          VIEW A: FARMER VERIFICATION DETAIL WORKSPACE
      ========================================================= */}
      {selectedFarmer ? (
        <div className="flex flex-col gap-5 animate-fade-in">
          {/* Header Card */}
          <div className="rounded-3xl border border-gray-200 bg-white p-5 sm:p-6 shadow-2xs">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#E4F0DD] text-[#24833A] shadow-xs">
                  <Users size={28} strokeWidth={2.4} />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs font-bold text-gray-500">
                      {selectedFarmer.registrationId}
                    </span>
                    {renderStatusBadge(selectedFarmer.verificationStatus)}
                    <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-[10px] font-bold text-gray-700">
                      {selectedFarmer.farmerType}
                    </span>
                  </div>
                  <h1 className="mt-1.5 text-xl sm:text-2xl font-bold text-gray-900 leading-snug">
                    {selectedFarmer.farmerName}
                  </h1>
                  <p className="text-xs sm:text-sm font-semibold text-[#174D25] mt-0.5">
                    {selectedFarmer.primaryCrop} • {selectedFarmer.approxLandArea} ({selectedFarmer.landholdingCategory})
                  </p>
                  <p className="text-xs text-gray-500 font-medium mt-1 flex flex-wrap items-center gap-2">
                    <span className="flex items-center gap-1">
                      <MapPin size={13} className="text-[#24833A]" />
                      {selectedFarmer.village}, {selectedFarmer.mandal}, {selectedFarmer.district}
                    </span>
                    <span className="text-gray-300">•</span>
                    <span className="flex items-center gap-1">
                      <Phone size={12} className="text-gray-400" />
                      {selectedFarmer.maskedMobile}
                    </span>
                    <span className="text-gray-300">•</span>
                    <span className="flex items-center gap-1">
                      <Calendar size={12} className="text-gray-400" />
                      Enrolled: {selectedFarmer.registrationDate}
                    </span>
                  </p>
                </div>
              </div>

              {/* Status progression pill */}
              <div className="flex flex-col items-start sm:items-end gap-1 shrink-0">
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                  Last Updated
                </span>
                <span className="text-xs font-semibold text-gray-800">{selectedFarmer.lastUpdated}</span>
              </div>
            </div>

            {/* Rejection / Clarification alerts if applicable */}
            {selectedFarmer.verificationStatus === "clarification_required" && selectedFarmer.clarificationReason && (
              <div className="mt-4 rounded-2xl border border-orange-300 bg-orange-50/80 p-3.5 text-xs text-orange-950 flex items-start gap-2.5">
                <AlertTriangle size={16} className="text-orange-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block">Clarification Requested by Reviewer:</span>
                  <p className="mt-0.5 text-orange-900 leading-relaxed">{selectedFarmer.clarificationReason}</p>
                </div>
              </div>
            )}

            {selectedFarmer.verificationStatus === "rejected" && selectedFarmer.rejectionReason && (
              <div className="mt-4 rounded-2xl border border-rose-300 bg-rose-50/80 p-3.5 text-xs text-rose-950 flex items-start gap-2.5">
                <AlertOctagon size={16} className="text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block">Verification Rejected Reason:</span>
                  <p className="mt-0.5 text-rose-900 leading-relaxed">{selectedFarmer.rejectionReason}</p>
                  {selectedFarmer.reviewerNote && (
                    <p className="mt-1 text-rose-800 text-[11px]">Note: {selectedFarmer.reviewerNote}</p>
                  )}
                </div>
              </div>
            )}

            {selectedFarmer.verificationStatus === "verified" && selectedFarmer.verificationReference && (
              <div className="mt-4 rounded-2xl border border-emerald-300 bg-emerald-50/80 p-3.5 text-xs text-emerald-950 flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-[#24833A] shrink-0" />
                  <span className="font-bold">Verified in State Farmer Registry</span>
                </div>
                <div className="flex items-center gap-3 text-[11px] text-gray-600">
                  <span>Reference: <strong className="font-mono text-gray-800">{selectedFarmer.verificationReference}</strong></span>
                  <span>Date: <strong>{selectedFarmer.verifiedDate}</strong></span>
                </div>
              </div>
            )}
          </div>

          {/* 4 Information Blocks */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* 1. Farmer Profile */}
            <div className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-5 shadow-2xs flex flex-col gap-3">
              <div className="flex items-center gap-2 border-b border-gray-100 pb-2">
                <Users size={16} className="text-[#24833A]" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-700">
                  1. Farmer Profile & Identity
                </h3>
              </div>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-[10px] uppercase font-bold text-gray-400">Full Name</span>
                  <p className="font-bold text-gray-900 mt-0.5">{selectedFarmer.farmerName}</p>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-gray-400">Registration ID</span>
                  <p className="font-mono font-bold text-[#174D25] mt-0.5">{selectedFarmer.registrationId}</p>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-gray-400">Mobile (Masked)</span>
                  <p className="font-medium text-gray-800 mt-0.5">{selectedFarmer.maskedMobile}</p>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-gray-400">Aadhaar (Masked)</span>
                  <p className="font-mono text-gray-700 mt-0.5">{selectedFarmer.maskedAadhaar}</p>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-gray-400">Gender</span>
                  <p className="font-semibold text-gray-800 mt-0.5">{selectedFarmer.gender}</p>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-gray-400">Farmer Category</span>
                  <p className="font-semibold text-gray-800 mt-0.5">{selectedFarmer.farmerType}</p>
                </div>
              </div>
            </div>

            {/* 2. Location */}
            <div className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-5 shadow-2xs flex flex-col gap-3">
              <div className="flex items-center gap-2 border-b border-gray-100 pb-2">
                <MapPin size={16} className="text-[#24833A]" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-700">
                  2. Residential & Revenue Location
                </h3>
              </div>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-[10px] uppercase font-bold text-gray-400">State</span>
                  <p className="font-semibold text-gray-900 mt-0.5">{selectedFarmer.state}</p>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-gray-400">District</span>
                  <p className="font-bold text-gray-900 mt-0.5">{selectedFarmer.district}</p>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-gray-400">Mandal / Tehsil</span>
                  <p className="font-semibold text-gray-800 mt-0.5">{selectedFarmer.mandal}</p>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-gray-400">Village / Revenue Circle</span>
                  <p className="font-semibold text-gray-800 mt-0.5">{selectedFarmer.village}</p>
                </div>
              </div>
            </div>

            {/* 3. Agricultural Information */}
            <div className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-5 shadow-2xs flex flex-col gap-3">
              <div className="flex items-center gap-2 border-b border-gray-100 pb-2">
                <Sprout size={16} className="text-[#24833A]" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-700">
                  3. Agricultural & Cultivation Records
                </h3>
              </div>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-[10px] uppercase font-bold text-gray-400">Landholding Category</span>
                  <p className="font-bold text-[#174D25] mt-0.5">{selectedFarmer.landholdingCategory}</p>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-gray-400">Total Cultivated Area</span>
                  <p className="font-bold text-gray-900 mt-0.5">{selectedFarmer.approxLandArea}</p>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-gray-400">Primary Standing Crop</span>
                  <p className="font-semibold text-gray-900 mt-0.5">{selectedFarmer.primaryCrop}</p>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-gray-400">Secondary / Relay Crop</span>
                  <p className="font-semibold text-gray-800 mt-0.5">{selectedFarmer.secondaryCrop || "None"}</p>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-gray-400">Irrigation Source</span>
                  <p className="font-medium text-gray-800 mt-0.5">{selectedFarmer.irrigationType}</p>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-gray-400">Cultivation Practice</span>
                  <p className="font-medium text-gray-800 mt-0.5">{selectedFarmer.farmingType}</p>
                </div>
              </div>
            </div>

            {/* 4. Government Registration Information */}
            <div className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-5 shadow-2xs flex flex-col gap-3">
              <div className="flex items-center gap-2 border-b border-gray-100 pb-2">
                <Landmark size={16} className="text-[#24833A]" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-700">
                  4. Government Enrollment Information
                </h3>
              </div>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-[10px] uppercase font-bold text-gray-400">Enrollment Source</span>
                  <p className="font-semibold text-gray-900 mt-0.5">{selectedFarmer.registrationSource}</p>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-gray-400">Registration Date</span>
                  <p className="font-semibold text-gray-800 mt-0.5">{selectedFarmer.registrationDate}</p>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-gray-400">Verification Status</span>
                  <div className="mt-1">{renderStatusBadge(selectedFarmer.verificationStatus)}</div>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-gray-400">Verification Cell</span>
                  <p className="font-semibold text-gray-800 mt-0.5">
                    {selectedFarmer.verifiedBy || "District Agriculture Secretariat"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Section I: Farmer Documents Audit */}
          <div className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-5 shadow-2xs flex flex-col gap-3">
            <div className="flex items-center justify-between border-b border-gray-100 pb-2.5">
              <div className="flex items-center gap-2">
                <FileCheck size={18} className="text-[#24833A]" />
                <h3 className="text-sm font-bold text-gray-900">
                  Farmer Verification Documents & Credentials ({selectedFarmer.documents.length})
                </h3>
              </div>
              <span className="text-[11px] text-gray-400">Frontend Demonstration Audit Mode</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {selectedFarmer.documents.map((doc) => (
                <div
                  key={doc.id}
                  className="rounded-xl border border-gray-200 bg-gray-50/60 p-3.5 flex flex-col justify-between gap-3"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-[#174D25] border border-emerald-200">
                        {doc.category}
                      </span>
                      {doc.status === "verified" ? (
                        <span className="text-[11px] font-bold text-emerald-700 flex items-center gap-1">
                          <CheckCircle2 size={12} /> Verified
                        </span>
                      ) : doc.status === "clarification_required" ? (
                        <span className="text-[11px] font-bold text-orange-700 flex items-center gap-1">
                          <AlertTriangle size={12} /> Clarify
                        </span>
                      ) : doc.status === "rejected" ? (
                        <span className="text-[11px] font-bold text-rose-700 flex items-center gap-1">
                          <AlertOctagon size={12} /> Rejected
                        </span>
                      ) : (
                        <span className="text-[11px] font-bold text-amber-700 flex items-center gap-1">
                          <Clock size={12} /> {doc.status.replace("_", " ")}
                        </span>
                      )}
                    </div>

                    <h4 className="mt-2 text-xs font-bold text-gray-900">{doc.name}</h4>
                    <p className="text-[11px] font-mono text-gray-500 mt-0.5">Ref: {doc.maskedReference}</p>

                    {doc.clarificationReason && (
                      <p className="mt-1 text-[11px] text-orange-800 bg-orange-100/60 p-1.5 rounded-lg">
                        <strong>Clarification:</strong> {doc.clarificationReason}
                      </p>
                    )}
                    {doc.rejectionReason && (
                      <p className="mt-1 text-[11px] text-rose-800 bg-rose-100/60 p-1.5 rounded-lg">
                        <strong>Rejected:</strong> {doc.rejectionReason}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center justify-between border-t border-gray-200 pt-2 text-[11px] text-gray-500">
                    <span>
                      {doc.fileSize} • Submitted: {doc.submittedDate}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setActiveDocReview(doc);
                        setDocReviewNote(doc.reviewerNote || doc.clarificationReason || doc.rejectionReason || "");
                        setDocActionError(null);
                      }}
                      className="rounded-lg bg-white border border-gray-200 px-2.5 py-1 text-xs font-bold text-[#174D25] hover:bg-gray-100 cursor-pointer shadow-2xs"
                    >
                      Audit Doc →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section N & O: Timeline and Status History */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Activity Timeline */}
            <div className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-5 shadow-2xs flex flex-col gap-3">
              <div className="flex items-center gap-2 border-b border-gray-100 pb-2">
                <History size={16} className="text-[#24833A]" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-700">
                  Verification Activity Timeline
                </h3>
              </div>
              <div className="flex flex-col gap-3">
                {selectedFarmer.timeline.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3 text-xs">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#E4F0DD] text-[#24833A] font-bold text-[10px]">
                      {idx + 1}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-gray-900">{item.title}</span>
                        <span className="text-[10px] text-gray-400">{item.date}</span>
                      </div>
                      <span className="text-[11px] text-gray-500 block">Actor: {item.actor}</span>
                      {item.note && <p className="mt-0.5 text-[11px] text-gray-600 italic">&ldquo;{item.note}&rdquo;</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Status History */}
            <div className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-5 shadow-2xs flex flex-col gap-3">
              <div className="flex items-center gap-2 border-b border-gray-100 pb-2">
                <Layers size={16} className="text-[#24833A]" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-700">
                  Verification Status Progression
                </h3>
              </div>
              <div className="flex items-center gap-2 flex-wrap py-2">
                {selectedFarmer.statusHistory.map((step, idx) => (
                  <React.Fragment key={idx}>
                    <div className="rounded-xl border border-gray-200 bg-gray-50 p-2 text-center">
                      <div className="scale-90">{renderStatusBadge(step.status)}</div>
                      <span className="text-[9px] text-gray-400 block mt-1">{step.timestamp}</span>
                    </div>
                    {idx < selectedFarmer.statusHistory.length - 1 && (
                      <ArrowRight size={14} className="text-gray-400 shrink-0" />
                    )}
                  </React.Fragment>
                ))}
              </div>
              <p className="text-[11px] text-gray-400">
                Live audit trail reflecting verified state decisions during this session.
              </p>
            </div>
          </div>

          {/* Decision Panel (PART J, K, L, M, P) */}
          <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-2xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h3 className="text-sm font-bold text-gray-900">Farmer Verification Decision</h3>
              <p className="text-xs text-gray-500">
                Official registration actions operate on local mock state. No real database or PII exposure.
              </p>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {selectedFarmer.verificationStatus === "rejected" ? (
                <button
                  type="button"
                  id="btn-return-to-review"
                  onClick={handleReturnToReview}
                  className="rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-xs font-bold text-gray-700 hover:bg-gray-50 cursor-pointer"
                >
                  Return to Review
                </button>
              ) : (
                <>
                  {selectedFarmer.verificationStatus !== "under_review" && (
                    <button
                      type="button"
                      id="btn-mark-under-review"
                      onClick={handleMarkUnderReview}
                      className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-2.5 text-xs font-bold text-blue-800 hover:bg-blue-100 cursor-pointer"
                    >
                      Mark Under Review
                    </button>
                  )}

                  <button
                    type="button"
                    id="btn-request-clarification"
                    onClick={() => {
                      setClarificationReasonInput("");
                      setClarificationAffectedDoc("");
                      setDecisionReviewerNote("");
                      setModalValidationError(null);
                      setIsClarificationModalOpen(true);
                    }}
                    className="rounded-xl border border-orange-300 bg-orange-50 px-4 py-2.5 text-xs font-bold text-orange-800 hover:bg-orange-100 cursor-pointer"
                  >
                    Request Clarification
                  </button>

                  <button
                    type="button"
                    id="btn-reject-verification"
                    onClick={() => {
                      setRejectionReasonInput("");
                      setDecisionReviewerNote("");
                      setModalValidationError(null);
                      setIsRejectModalOpen(true);
                    }}
                    className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-2.5 text-xs font-bold text-rose-800 hover:bg-rose-100 cursor-pointer"
                  >
                    Reject Verification
                  </button>

                  <button
                    type="button"
                    id="btn-verify-farmer"
                    onClick={() => {
                      setDecisionReviewerNote("");
                      setIsVerifyModalOpen(true);
                    }}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-[#24833A] px-5 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-[#174D25] cursor-pointer"
                  >
                    <CheckCircle2 size={15} />
                    <span>Verify Farmer</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* =========================================================
            VIEW B: MAIN FARMER REGISTRY DASHBOARD & LIST
        ========================================================= */
        <div className="flex flex-col gap-5 animate-fade-in">
          {/* Header Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-3xl bg-white p-5 border border-gray-200 shadow-2xs">
            <div className="flex items-center gap-3.5">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#E4F0DD] text-[#24833A] shadow-xs">
                <Users size={26} strokeWidth={2.4} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-lg sm:text-xl font-bold text-gray-900">
                    {t("govtFarmerRegistry.title") || "Farmer Registry"}
                  </h1>
                  <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-[#24833A] border border-emerald-200">
                    Administrative Desk
                  </span>
                </div>
                <p className="text-xs text-gray-500 font-medium">
                  {t("govtFarmerRegistry.subtitle") ||
                    "Manage registered farmers, verification status and agricultural records."}
                </p>
              </div>
            </div>

            {/* Export CSV Button (PART Q) */}
            <button
              type="button"
              id="btn-export-farmers-csv"
              onClick={handleExportCsv}
              className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-xs font-bold text-gray-700 hover:bg-gray-50 shadow-2xs cursor-pointer self-start sm:self-auto"
            >
              <Download size={14} className="text-[#24833A]" />
              <span>{t("govtFarmerRegistry.exportCsv") || "Export CSV"}</span>
            </button>
          </div>

          {/* Metric Summary Cards (PART D) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <div className="rounded-2xl border border-gray-200 bg-white p-3.5 shadow-2xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                {t("govtFarmerRegistry.totalFarmers") || "Total Registered Farmers"}
              </span>
              <p className="mt-1.5 text-xl font-bold text-gray-900">{metrics.total}</p>
              <span className="text-[10px] text-gray-500">Registry records</span>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-3.5 shadow-2xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">
                {t("govtFarmerRegistry.verifiedFarmers") || "Verified Farmers"}
              </span>
              <p className="mt-1.5 text-xl font-bold text-emerald-700">{metrics.verified}</p>
              <span className="text-[10px] text-gray-500">Authenticated</span>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-3.5 shadow-2xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600">
                {t("govtFarmerRegistry.pendingVerification") || "Pending Verification"}
              </span>
              <p className="mt-1.5 text-xl font-bold text-amber-800">{metrics.pending}</p>
              <span className="text-[10px] text-gray-500">Awaiting triage</span>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-3.5 shadow-2xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-orange-600">
                {t("govtFarmerRegistry.clarificationRequired") || "Clarification Required"}
              </span>
              <p className="mt-1.5 text-xl font-bold text-orange-800">{metrics.clarification}</p>
              <span className="text-[10px] text-gray-500">Action pending</span>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-3.5 shadow-2xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600">
                {t("govtFarmerRegistry.rejected") || "Rejected"}
              </span>
              <p className="mt-1.5 text-xl font-bold text-rose-700">{metrics.rejected}</p>
              <span className="text-[10px] text-gray-500">Invalid records</span>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-3.5 shadow-2xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600">
                {t("govtFarmerRegistry.activeFarmers") || "Active Farmers"}
              </span>
              <p className="mt-1.5 text-xl font-bold text-blue-900">{metrics.active}</p>
              <span className="text-[10px] text-gray-500">Operational standing</span>
            </div>
          </div>

          {/* Search & Filters Grid (PART E & F) */}
          <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-2xs flex flex-col gap-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {/* Search */}
              <div className="relative lg:col-span-1">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={
                    t("govtFarmerRegistry.searchPlaceholder") ||
                    "Search name, ID, mobile, district, village, or Aadhaar..."
                  }
                  className="h-11 w-full rounded-xl border border-gray-200 pl-9 pr-3 text-xs focus:border-[#24833A] focus:outline-none"
                />
              </div>

              {/* District Filter */}
              <div>
                <select
                  value={districtFilter}
                  onChange={(e) => {
                    setDistrictFilter(e.target.value);
                    setMandalFilter("all");
                  }}
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

              {/* Mandal Filter */}
              <div>
                <select
                  value={mandalFilter}
                  onChange={(e) => setMandalFilter(e.target.value)}
                  className="h-11 w-full rounded-xl border border-gray-200 px-3 text-xs font-medium text-gray-700 focus:border-[#24833A] focus:outline-none"
                >
                  <option value="all">All Mandals ({availableMandals.length})</option>
                  {availableMandals.map((m) => (
                    <option key={m} value={m}>
                      {m} Mandal
                    </option>
                  ))}
                </select>
              </div>

              {/* Landholding Category Filter */}
              <div>
                <select
                  value={landCategoryFilter}
                  onChange={(e) => setLandCategoryFilter(e.target.value)}
                  className="h-11 w-full rounded-xl border border-gray-200 px-3 text-xs font-medium text-gray-700 focus:border-[#24833A] focus:outline-none"
                >
                  <option value="all">All Landholdings</option>
                  <option value="Marginal (< 1 Ha)">Marginal (&lt; 1 Ha)</option>
                  <option value="Small (1-2 Ha)">Small (1-2 Ha)</option>
                  <option value="Semi-Medium (2-4 Ha)">Semi-Medium (2-4 Ha)</option>
                  <option value="Medium (4-10 Ha)">Medium (4-10 Ha)</option>
                  <option value="Large (> 10 Ha)">Large (&gt; 10 Ha)</option>
                </select>
              </div>
            </div>

            {/* Status Pills */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-gray-100">
              <span className="text-[11px] font-bold text-gray-400 mr-1">Status:</span>
              {(
                [
                  { id: "all", label: "All Farmers" },
                  { id: "pending", label: "Pending" },
                  { id: "under_review", label: "Under Review" },
                  { id: "verified", label: "Verified" },
                  { id: "clarification_required", label: "Clarification" },
                  { id: "rejected", label: "Rejected" },
                ] as const
              ).map((tab) => {
                const isActive = statusFilter === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setStatusFilter(tab.id)}
                    className={`rounded-full px-3 py-1 text-xs font-bold transition cursor-pointer ${
                      isActive
                        ? "bg-[#24833A] text-white shadow-2xs"
                        : "border border-gray-200 bg-gray-50 text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Desktop Table / Mobile Card Hybrid (PART G) */}
          <div className="rounded-2xl border border-gray-200 bg-white shadow-2xs overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <span className="text-xs font-bold text-gray-700">
                Registered Farmers ({filteredFarmers.length})
              </span>
              <span className="text-[11px] text-gray-400">Click Review to open farmer verification profile</span>
            </div>

            {filteredFarmers.length === 0 ? (
              <div className="p-8 text-center">
                <Users size={32} className="mx-auto text-gray-300" />
                <h4 className="mt-2 text-sm font-bold text-gray-700">No Farmers Found</h4>
                <p className="text-xs text-gray-400 mt-1">Try resetting search filters or search terms.</p>
              </div>
            ) : (
              <>
                {/* Desktop Table (hidden on small mobile screens) */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-gray-50 text-[11px] font-bold uppercase tracking-wider text-gray-500 border-b border-gray-100">
                      <tr>
                        <th className="px-4 py-3">Registration ID</th>
                        <th className="px-4 py-3">Farmer Name</th>
                        <th className="px-4 py-3">District</th>
                        <th className="px-4 py-3">Mandal</th>
                        <th className="px-4 py-3">Village</th>
                        <th className="px-4 py-3">Landholding</th>
                        <th className="px-4 py-3">Primary Crop</th>
                        <th className="px-4 py-3">Registration Date</th>
                        <th className="px-4 py-3">Verification Status</th>
                        <th className="px-4 py-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {filteredFarmers.map((farmer) => (
                        <tr key={farmer.id} className="hover:bg-gray-50/70 transition">
                          <td className="px-4 py-3.5 font-mono font-bold text-gray-900">{farmer.registrationId}</td>
                          <td className="px-4 py-3.5">
                            <span className="font-bold text-gray-900 block">{farmer.farmerName}</span>
                            <span className="text-[10px] text-gray-400">{farmer.maskedMobile}</span>
                          </td>
                          <td className="px-4 py-3.5 text-gray-700">{farmer.district}</td>
                          <td className="px-4 py-3.5 text-gray-700">{farmer.mandal}</td>
                          <td className="px-4 py-3.5 text-gray-600">{farmer.village}</td>
                          <td className="px-4 py-3.5 font-medium text-gray-800">
                            {farmer.approxLandArea}
                            <span className="text-[10px] text-gray-400 block">{farmer.landholdingCategory}</span>
                          </td>
                          <td className="px-4 py-3.5 font-semibold text-[#174D25]">{farmer.primaryCrop}</td>
                          <td className="px-4 py-3.5 text-gray-500">{farmer.registrationDate}</td>
                          <td className="px-4 py-3.5">{renderStatusBadge(farmer.verificationStatus)}</td>
                          <td className="px-4 py-3.5 text-right">
                            <button
                              type="button"
                              onClick={() => setSelectedFarmer(farmer)}
                              className="rounded-lg bg-[#24833A] px-3 py-1.5 text-xs font-bold text-white hover:bg-[#174D25] transition cursor-pointer shadow-2xs"
                            >
                              Review
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Stacked Cards (visible below md) */}
                <div className="md:hidden divide-y divide-gray-100">
                  {filteredFarmers.map((farmer) => (
                    <div key={farmer.id} className="p-4 flex flex-col gap-2.5">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className="font-mono text-[10px] font-bold text-gray-400">
                            {farmer.registrationId}
                          </span>
                          <h4 className="text-sm font-bold text-gray-900">{farmer.farmerName}</h4>
                          <span className="text-xs text-gray-500">
                            {farmer.village}, {farmer.mandal}, {farmer.district}
                          </span>
                        </div>
                        <div>{renderStatusBadge(farmer.verificationStatus)}</div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-gray-50 text-gray-600">
                        <div>
                          <span className="text-[10px] uppercase font-bold text-gray-400 block">Primary Crop</span>
                          <span className="font-semibold text-[#174D25]">{farmer.primaryCrop}</span>
                        </div>
                        <div>
                          <span className="text-[10px] uppercase font-bold text-gray-400 block">Landholding</span>
                          <span className="font-medium text-gray-800">{farmer.approxLandArea}</span>
                        </div>
                      </div>

                      <div className="pt-2 flex items-center justify-between border-t border-gray-100">
                        <span className="text-[10px] text-gray-400">Enrolled: {farmer.registrationDate}</span>
                        <button
                          type="button"
                          onClick={() => setSelectedFarmer(farmer)}
                          className="rounded-lg bg-[#24833A] px-4 py-2 text-xs font-bold text-white shadow-2xs hover:bg-[#174D25] transition cursor-pointer"
                        >
                          Review
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* =========================================================
          MODAL 1: VERIFY FARMER CONFIRMATION (PART K)
      ========================================================= */}
      {isVerifyModalOpen && selectedFarmer && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs"
          onClick={() => setIsVerifyModalOpen(false)}
        >
          <div
            className="w-full max-w-md rounded-3xl border border-gray-200 bg-white p-5 sm:p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 border-b border-gray-100 pb-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-[#24833A]">
                <ShieldCheck size={24} />
              </div>
              <div>
                <h3 className="text-base font-bold text-gray-900">Verify Farmer Registration?</h3>
                <span className="text-[10px] font-bold uppercase text-[#24833A]">State Farmer Registry Audit</span>
              </div>
            </div>

            <p className="my-4 text-xs text-gray-600 leading-relaxed">
              This will mark this farmer registration as verified in the Government registry workspace.
            </p>

            <div className="mb-4">
              <label className="text-xs font-bold text-gray-700 block mb-1">
                Reviewer Note / Gazette Remark (Optional)
              </label>
              <textarea
                value={decisionReviewerNote}
                onChange={(e) => setDecisionReviewerNote(e.target.value)}
                placeholder="e.g. 1B Adangal and biometric eKYC confirmed via mandal secretariat."
                rows={2}
                className="w-full rounded-xl border border-gray-200 p-2.5 text-xs focus:border-[#24833A] focus:outline-none"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setIsVerifyModalOpen(false)}
                className="rounded-xl border border-gray-200 px-4 py-2 text-xs font-bold text-gray-600 hover:bg-gray-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                id="btn-confirm-farmer-verification"
                onClick={handleConfirmVerification}
                className="rounded-xl bg-[#24833A] px-5 py-2 text-xs font-bold text-white shadow-xs hover:bg-[#174D25] cursor-pointer"
              >
                Confirm Verification
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================
          MODAL 2: REQUEST CLARIFICATION (PART L)
      ========================================================= */}
      {isClarificationModalOpen && selectedFarmer && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs"
          onClick={() => setIsClarificationModalOpen(false)}
        >
          <div
            className="w-full max-w-md rounded-3xl border border-gray-200 bg-white p-5 sm:p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 border-b border-gray-100 pb-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-orange-50 text-orange-700">
                <AlertTriangle size={22} />
              </div>
              <div>
                <h3 className="text-base font-bold text-gray-900">Request Farmer Clarification</h3>
                <span className="text-[10px] font-bold uppercase text-orange-700">Mandatory Reason Required</span>
              </div>
            </div>

            {modalValidationError && (
              <div className="mt-3 rounded-xl bg-rose-50 border border-rose-200 p-2 text-xs text-rose-700 font-semibold">
                {modalValidationError}
              </div>
            )}

            <div className="flex flex-col gap-3 my-4">
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">
                  Clarification Reason <span className="text-rose-500">*</span>
                </label>
                <textarea
                  value={clarificationReasonInput}
                  onChange={(e) => {
                    setClarificationReasonInput(e.target.value);
                    if (modalValidationError) setModalValidationError(null);
                  }}
                  placeholder="e.g. Please upload certified copy of Patta Passbook with revenue stamp."
                  rows={3}
                  className="w-full rounded-xl border border-gray-200 p-2.5 text-xs focus:border-orange-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">
                  Affected Information / Document
                </label>
                <select
                  value={clarificationAffectedDoc}
                  onChange={(e) => setClarificationAffectedDoc(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 p-2 text-xs font-medium text-gray-700 focus:border-orange-500 focus:outline-none"
                >
                  <option value="">Select affected item (or general profile)</option>
                  {selectedFarmer.documents.map((d) => (
                    <option key={d.id} value={d.name}>
                      {d.name} ({d.category})
                    </option>
                  ))}
                  <option value="Landholding Survey Sketch">Landholding Survey Sketch</option>
                  <option value="Aadhaar Biometric Discrepancy">Aadhaar Biometric Discrepancy</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Reviewer Note (Internal)</label>
                <input
                  type="text"
                  value={decisionReviewerNote}
                  onChange={(e) => setDecisionReviewerNote(e.target.value)}
                  placeholder="Internal audit remarks"
                  className="w-full rounded-xl border border-gray-200 p-2 text-xs focus:border-orange-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setIsClarificationModalOpen(false)}
                className="rounded-xl border border-gray-200 px-4 py-2 text-xs font-bold text-gray-600 hover:bg-gray-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                id="btn-submit-farmer-clarification"
                onClick={handleSubmitClarification}
                className="rounded-xl bg-orange-600 px-5 py-2 text-xs font-bold text-white shadow-xs hover:bg-orange-700 cursor-pointer"
              >
                Submit Clarification
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================
          MODAL 3: REJECT VERIFICATION (PART M)
      ========================================================= */}
      {isRejectModalOpen && selectedFarmer && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs"
          onClick={() => setIsRejectModalOpen(false)}
        >
          <div
            className="w-full max-w-md rounded-3xl border border-gray-200 bg-white p-5 sm:p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 border-b border-gray-100 pb-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-rose-50 text-rose-700">
                <AlertOctagon size={22} />
              </div>
              <div>
                <h3 className="text-base font-bold text-gray-900">Reject Farmer Verification</h3>
                <span className="text-[10px] font-bold uppercase text-rose-700">Audit Disqualification</span>
              </div>
            </div>

            {modalValidationError && (
              <div className="mt-3 rounded-xl bg-rose-50 border border-rose-200 p-2 text-xs text-rose-700 font-semibold">
                {modalValidationError}
              </div>
            )}

            <div className="flex flex-col gap-3 my-4">
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">
                  Rejection Reason <span className="text-rose-500">*</span>
                </label>
                <textarea
                  value={rejectionReasonInput}
                  onChange={(e) => {
                    setRejectionReasonInput(e.target.value);
                    if (modalValidationError) setModalValidationError(null);
                  }}
                  placeholder="e.g. Survey number does not exist in revenue records or fraudulent land document."
                  rows={3}
                  className="w-full rounded-xl border border-gray-200 p-2.5 text-xs focus:border-rose-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">
                  Reviewer Note <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={decisionReviewerNote}
                  onChange={(e) => setDecisionReviewerNote(e.target.value)}
                  placeholder="e.g. Verified by revenue inspector with negative report."
                  className="w-full rounded-xl border border-gray-200 p-2 text-xs focus:border-rose-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setIsRejectModalOpen(false)}
                className="rounded-xl border border-gray-200 px-4 py-2 text-xs font-bold text-gray-600 hover:bg-gray-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                id="btn-confirm-farmer-rejection"
                onClick={handleConfirmRejection}
                className="rounded-xl bg-rose-600 px-5 py-2 text-xs font-bold text-white shadow-xs hover:bg-rose-700 cursor-pointer"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================
          MODAL 4: DOCUMENT AUDIT MODAL (PART I)
      ========================================================= */}
      {activeDocReview && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs"
          onClick={() => setActiveDocReview(null)}
        >
          <div
            className="w-full max-w-lg rounded-3xl border border-gray-200 bg-white p-5 sm:p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-gray-900">{activeDocReview.name}</h3>
                <span className="text-[10px] font-bold uppercase text-[#24833A]">{activeDocReview.category}</span>
              </div>
              <button
                type="button"
                onClick={() => setActiveDocReview(null)}
                className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Document Details */}
            <div className="my-4 grid grid-cols-2 gap-2.5 rounded-2xl bg-gray-50 p-3 text-xs">
              <div>
                <span className="text-[10px] uppercase font-bold text-gray-400">Masked Reference</span>
                <p className="font-mono font-bold text-gray-900 mt-0.5">{activeDocReview.maskedReference}</p>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-gray-400">Submitted Date</span>
                <p className="font-semibold text-gray-800 mt-0.5">{activeDocReview.submittedDate}</p>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-gray-400">File Type & Size</span>
                <p className="text-gray-700 mt-0.5">
                  {activeDocReview.fileType} • {activeDocReview.fileSize}
                </p>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-gray-400">Current Status</span>
                <div className="mt-0.5">{renderStatusBadge(activeDocReview.status as any)}</div>
              </div>
            </div>

            {/* Mock Preview Box */}
            <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50/50 p-4 text-center my-3">
              <FileText size={28} className="mx-auto text-gray-400 mb-1" />
              <p className="text-xs font-bold text-gray-700">Digital Document Preview</p>
              <p className="text-[10px] text-gray-400 mt-0.5">
                Frontend demonstration view. No external government cloud download performed.
              </p>
            </div>

            {/* Review Note */}
            <div className="mb-4">
              <label className="text-xs font-bold text-gray-700 block mb-1">Reviewer Note / Decision Reason</label>
              <textarea
                value={docReviewNote}
                onChange={(e) => {
                  setDocReviewNote(e.target.value);
                  if (docActionError) setDocActionError(null);
                }}
                placeholder="Audit observation or reason (mandatory for clarification/rejection)..."
                rows={2}
                className="w-full rounded-xl border border-gray-200 p-2 text-xs focus:border-[#24833A] focus:outline-none"
              />
              {docActionError && <p className="text-[11px] text-rose-600 font-semibold mt-1">{docActionError}</p>}
            </div>

            {/* Document Actions */}
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100 flex-wrap">
              <button
                type="button"
                onClick={() => handleUpdateDocumentStatus("rejected")}
                className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-bold text-rose-700 hover:bg-rose-100 cursor-pointer"
              >
                Reject Doc
              </button>
              <button
                type="button"
                onClick={() => handleUpdateDocumentStatus("clarification_required")}
                className="rounded-xl border border-orange-200 bg-orange-50 px-3 py-1.5 text-xs font-bold text-orange-700 hover:bg-orange-100 cursor-pointer"
              >
                Request Clarification
              </button>
              <button
                type="button"
                onClick={() => handleUpdateDocumentStatus("verified")}
                className="rounded-xl bg-[#24833A] px-4 py-1.5 text-xs font-bold text-white hover:bg-[#174D25] cursor-pointer shadow-xs"
              >
                Mark Verified
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
