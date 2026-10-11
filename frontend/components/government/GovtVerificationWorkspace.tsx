"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  ShieldCheck,
  Building2,
  UserCheck,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Upload,
  Eye,
  Edit3,
  X,
  ArrowRight,
  ArrowLeft,
  Clock,
  MapPin,
  Mail,
  Phone,
  Briefcase,
  AlertOctagon,
  RotateCcw,
  Sparkles,
  Check,
  Info,
  Calendar,
  Layers,
  Search,
  Filter,
  FileCheck,
  FileWarning,
  FileX,
  FileCode,
  Download,
  ExternalLink,
  History,
  CheckSquare,
} from "lucide-react";
import BackButton from "@/components/ui/BackButton";
import { useTranslation } from "@/hooks/useTranslation";
import { useGovernmentStore } from "@/store/government-store";

export type VerificationRequestStatus =
  | "submitted"
  | "under_review"
  | "verified"
  | "clarification_required"
  | "rejected";

export interface TimelineEvent {
  title: string;
  date: string;
  actor: string;
  note?: string;
}

export interface VerificationDocument {
  id: string;
  name: string;
  documentType: string;
  fileName: string;
  fileType: string;
  fileSize: string;
  submittedDate: string;
  status: "submitted" | "under_review" | "verified" | "clarification_required" | "rejected";
  clarificationReason?: string;
  rejectionReason?: string;
  reviewerNote?: string;
}

export interface VerificationRequestItem {
  id: string;
  referenceNumber: string;
  representativeName: string;
  designation: string;
  employeeOfficerId: string;
  officialEmail: string;
  officialPhone: string;
  officeLocation: string;
  yearsOfService: string;
  departmentRole: string;

  organizationType:
    | "Government Department"
    | "Government Agency"
    | "Local Government Body"
    | "NGO"
    | "Agricultural Development Organization";
  organizationName: string;
  departmentMinistry: string;
  state: string;
  district: string;
  mandal: string;
  officeAddress: string;
  officialWebsite?: string;
  registrationRefNumber: string;

  // NGO specific fields
  ngoRegistrationNumber?: string;
  ngoRegistrationAuthority?: string;
  ngoRegistrationDate?: string;
  ngoValidUntil?: string;

  submittedDate: string;
  lastUpdated: string;
  status: VerificationRequestStatus;
  verifiedDate?: string;
  rejectedDate?: string;
  rejectionReason?: string;
  reviewerNote?: string;
  clarificationReason?: string;

  documents: VerificationDocument[];
  timeline: TimelineEvent[];
}

const INITIAL_REQUESTS: VerificationRequestItem[] = [
  {
    id: "VR-2026-001",
    referenceNumber: "GOV-VER-2026-8419",
    representativeName: "Dr. K. V. Ramanjaneyulu",
    designation: "District Agriculture Officer (DAO)",
    employeeOfficerId: "AP-GOV-AGRI-8472",
    officialEmail: "dao.guntur@ap.gov.in",
    officialPhone: "+91 94401 28472",
    officeLocation: "District Headquarters, Guntur",
    yearsOfService: "14 Years",
    departmentRole: "District Agriculture Officer",

    organizationType: "Government Department",
    organizationName: "Department of Agriculture & Farmers Welfare",
    departmentMinistry: "Ministry of Agriculture, Govt. of Andhra Pradesh",
    state: "Andhra Pradesh",
    district: "Guntur",
    mandal: "Guntur Urban",
    officeAddress: "Collectorate Complex, Nagarampalem, Guntur - 522004",
    officialWebsite: "https://apagrisnet.gov.in",
    registrationRefNumber: "AP-AGRI-DEPT-2024/9182",

    submittedDate: "08 Oct 2026",
    lastUpdated: "Today, 10:30 AM",
    status: "under_review",
    documents: [
      {
        id: "doc-1",
        name: "Government / Organization ID",
        documentType: "Gazetted Officer Identification",
        fileName: "AP_Officer_ID_Card.pdf",
        fileType: "application/pdf",
        fileSize: "1.4 MB",
        submittedDate: "08 Oct 2026",
        status: "verified",
        reviewerNote: "Officer identity authenticated via State Government HRMS database.",
      },
      {
        id: "doc-2",
        name: "Official Appointment / Authorization Letter",
        documentType: "Cadre Appointment Decree",
        fileName: "Gazetted_Appointment_Order_2020.pdf",
        fileType: "application/pdf",
        fileSize: "2.1 MB",
        submittedDate: "08 Oct 2026",
        status: "submitted",
      },
      {
        id: "doc-3",
        name: "Department / Organization Registration Proof",
        documentType: "Statutory Department Charter",
        fileName: "Departmental_Gazette_Notification.pdf",
        fileType: "application/pdf",
        fileSize: "3.2 MB",
        submittedDate: "08 Oct 2026",
        status: "submitted",
      },
    ],
    timeline: [
      {
        title: "Application Submitted",
        date: "08 Oct 2026, 09:30 AM",
        actor: "Dr. K. V. Ramanjaneyulu (Applicant)",
        note: "Initial verification request submitted for District Agriculture Officer credentials.",
      },
      {
        title: "Documents Received & Audit Initiated",
        date: "08 Oct 2026, 11:00 AM",
        actor: "State Verification Secretariat",
      },
      {
        title: "Officer ID Verified",
        date: "08 Oct 2026, 02:15 PM",
        actor: "Senior Verification Officer (Audit Desk)",
        note: "AP_Officer_ID_Card.pdf authenticated.",
      },
    ],
  },
  {
    id: "VR-2026-002",
    referenceNumber: "GOV-VER-2026-9214",
    representativeName: "Smt. P. Annapurna Devi",
    designation: "NGO Program Director",
    employeeOfficerId: "NGO-KRISHI-4109",
    officialEmail: "director@krishivikasngo.org",
    officialPhone: "+91 98480 34109",
    officeLocation: "Rural Development Center, Machilipatnam",
    yearsOfService: "9 Years",
    departmentRole: "NGO Program Manager",

    organizationType: "NGO",
    organizationName: "Krishi Vikas Rural Development Foundation",
    departmentMinistry: "Rural Livelihoods & Farmer Producer Organization Support",
    state: "Andhra Pradesh",
    district: "Krishna",
    mandal: "Machilipatnam",
    officeAddress: "Plot 14, Rythu Mitra Bhavan, Near Bus Stand, Machilipatnam - 521001",
    officialWebsite: "https://krishivikasngo.org",
    registrationRefNumber: "NGO-SOC-2018/884",

    ngoRegistrationNumber: "NGO/DARPAN/AP/2018/004812",
    ngoRegistrationAuthority: "Registrar of Societies, Andhra Pradesh & NITI Aayog DARPAN",
    ngoRegistrationDate: "14 Jun 2018",
    ngoValidUntil: "31 Mar 2028",

    submittedDate: "07 Oct 2026",
    lastUpdated: "Yesterday, 04:00 PM",
    status: "clarification_required",
    clarificationReason:
      "Please upload a complete, high-resolution copy of page 3 of the Board Authorization Resolution with governing body signatures.",
    documents: [
      {
        id: "doc-1",
        name: "NGO Representative Photo ID",
        documentType: "Aadhaar / Voter Identity Proof",
        fileName: "Representative_Photo_ID.pdf",
        fileType: "application/pdf",
        fileSize: "1.1 MB",
        submittedDate: "07 Oct 2026",
        status: "verified",
      },
      {
        id: "doc-2",
        name: "NGO Board Authorization Resolution",
        documentType: "Governing Body Authorization",
        fileName: "Board_Resolution_Authorizing_Rep.pdf",
        fileType: "application/pdf",
        fileSize: "1.8 MB",
        submittedDate: "07 Oct 2026",
        status: "clarification_required",
        clarificationReason: "Page 3 missing executive council secretary seal.",
      },
      {
        id: "doc-3",
        name: "NGO Registration Certificate",
        documentType: "Societies Act Certificate",
        fileName: "Societies_Registration_Certificate.pdf",
        fileType: "application/pdf",
        fileSize: "2.4 MB",
        submittedDate: "07 Oct 2026",
        status: "verified",
      },
      {
        id: "doc-4",
        name: "DARPAN NITI Aayog Unique ID Certificate",
        documentType: "NITI Aayog Portal Registration",
        fileName: "DARPAN_Unique_ID_Cert.pdf",
        fileType: "application/pdf",
        fileSize: "1.5 MB",
        submittedDate: "07 Oct 2026",
        status: "verified",
      },
    ],
    timeline: [
      {
        title: "Application Submitted",
        date: "07 Oct 2026, 10:15 AM",
        actor: "Smt. P. Annapurna Devi",
      },
      {
        title: "Audit Review Initiated",
        date: "07 Oct 2026, 01:30 PM",
        actor: "NGO Accreditation Desk",
      },
      {
        title: "Clarification Requested",
        date: "07 Oct 2026, 04:00 PM",
        actor: "State Verification Officer",
        note: "Clarification requested on governing body resolution seal.",
      },
    ],
  },
  {
    id: "VR-2026-003",
    referenceNumber: "GOV-VER-2026-7831",
    representativeName: "Sri M. Chidananda Reddy",
    designation: "Mandal Agriculture Officer (MAO)",
    employeeOfficerId: "AP-GOV-MAO-1904",
    officialEmail: "mao.tanuku@ap.gov.in",
    officialPhone: "+91 94403 11904",
    officeLocation: "Rythu Bharosa Kendra, Tanuku",
    yearsOfService: "8 Years",
    departmentRole: "Mandal Agriculture Officer",

    organizationType: "Government Agency",
    organizationName: "AP Rythu Bharosa Kendra Directorate",
    departmentMinistry: "Village & Ward Secretariat Agriculture Services",
    state: "Andhra Pradesh",
    district: "West Godavari",
    mandal: "Tanuku",
    officeAddress: "Main Road, RBK Hub Tanuku - 534211",
    officialWebsite: "https://karshak.ap.gov.in",
    registrationRefNumber: "AP-RBK-MAO-2022/4410",

    submittedDate: "06 Oct 2026",
    lastUpdated: "08 Oct 2026",
    status: "verified",
    verifiedDate: "08 Oct 2026",
    documents: [
      {
        id: "doc-1",
        name: "Government Officer ID Card",
        documentType: "MAO Employee Badge",
        fileName: "AP_MAO_ID_Card.pdf",
        fileType: "application/pdf",
        fileSize: "1.2 MB",
        submittedDate: "06 Oct 2026",
        status: "verified",
      },
      {
        id: "doc-2",
        name: "MAO Cadre Appointment Letter",
        documentType: "APPSC Gazetted Order",
        fileName: "MAO_Service_Commission_Order.pdf",
        fileType: "application/pdf",
        fileSize: "2.6 MB",
        submittedDate: "06 Oct 2026",
        status: "verified",
      },
      {
        id: "doc-3",
        name: "RBK Mandal Jurisdiction Order",
        documentType: "District Collectorate Posting",
        fileName: "Collectorate_Posting_Order_Tanuku.pdf",
        fileType: "application/pdf",
        fileSize: "1.7 MB",
        submittedDate: "06 Oct 2026",
        status: "verified",
      },
    ],
    timeline: [
      {
        title: "Application Submitted",
        date: "06 Oct 2026, 08:45 AM",
        actor: "Sri M. Chidananda Reddy",
      },
      {
        title: "Credentials Audit Completed",
        date: "07 Oct 2026, 03:00 PM",
        actor: "District Agriculture Verification Wing",
      },
      {
        title: "Verification Approved",
        date: "08 Oct 2026, 11:20 AM",
        actor: "District Collectorate (Agri Review Cell)",
        note: "Representative authorized with verified status.",
      },
    ],
  },
  {
    id: "VR-2026-004",
    referenceNumber: "GOV-VER-2026-6102",
    representativeName: "Sri B. Suresh Kumar",
    designation: "Field Operations Lead",
    employeeOfficerId: "AGRI-FPO-7721",
    officialEmail: "suresh@rayalaseemafpo.org",
    officialPhone: "+91 99890 57721",
    officeLocation: "Agricultural Market Yard, Adoni",
    yearsOfService: "4 Years",
    departmentRole: "Field Coordinator",

    organizationType: "Agricultural Development Organization",
    organizationName: "Rayalaseema Dryland Farmer Producer Society",
    departmentMinistry: "Cooperative Marketing & Dryland Farming Promotion",
    state: "Andhra Pradesh",
    district: "Kurnool",
    mandal: "Adoni",
    officeAddress: "Plot 8, AMC Complex, Adoni - 518301",
    registrationRefNumber: "AP-COOP-FPO-2019/312",

    submittedDate: "05 Oct 2026",
    lastUpdated: "07 Oct 2026",
    status: "rejected",
    rejectedDate: "07 Oct 2026",
    rejectionReason:
      "Statutory audit report and cooperative societies registration renewal expired on 31 Dec 2024. Society does not hold active legal standing.",
    reviewerNote:
      "Please renew certificate with District Registrar of Cooperatives before re-applying.",
    documents: [
      {
        id: "doc-1",
        name: "Society Representative ID",
        documentType: "Society Membership Card",
        fileName: "FPO_Representative_Card.pdf",
        fileType: "application/pdf",
        fileSize: "0.9 MB",
        submittedDate: "05 Oct 2026",
        status: "verified",
      },
      {
        id: "doc-2",
        name: "Society Registration Certificate (Expired)",
        documentType: "Cooperative Registration",
        fileName: "Cooperative_Certificate_2019.pdf",
        fileType: "application/pdf",
        fileSize: "2.0 MB",
        submittedDate: "05 Oct 2026",
        status: "rejected",
        rejectionReason: "Lapsed on 31 Dec 2024 without renewal endorsement.",
      },
    ],
    timeline: [
      {
        title: "Application Submitted",
        date: "05 Oct 2026, 02:20 PM",
        actor: "Sri B. Suresh Kumar",
      },
      {
        title: "Legal Registry Audit Performed",
        date: "06 Oct 2026, 11:30 AM",
        actor: "Cooperative Societies Audit Desk",
      },
      {
        title: "Verification Rejected",
        date: "07 Oct 2026, 02:45 PM",
        actor: "Joint Director of Agriculture (Audit)",
        note: "Statutory registration lapsed.",
      },
    ],
  },
  {
    id: "VR-2026-005",
    referenceNumber: "GOV-VER-2026-5389",
    representativeName: "Smt. K. Lalitha Kumari",
    designation: "Assistant Director of Horticulture",
    employeeOfficerId: "AP-HORT-ADH-3390",
    officialEmail: "adh.ongole@ap.gov.in",
    officialPhone: "+91 94405 83390",
    officeLocation: "District Horticulture Office, Ongole",
    yearsOfService: "11 Years",
    departmentRole: "Government Program Coordinator",

    organizationType: "Government Department",
    organizationName: "Department of Horticulture, Govt. of AP",
    departmentMinistry: "Ministry of Agriculture & Horticulture",
    state: "Andhra Pradesh",
    district: "Prakasam",
    mandal: "Ongole",
    officeAddress: "Opposite ZP Office, Ongole - 523001",
    officialWebsite: "https://horticulture.ap.gov.in",
    registrationRefNumber: "AP-HORT-2025/1108",

    submittedDate: "09 Oct 2026",
    lastUpdated: "Today, 08:00 AM",
    status: "submitted",
    documents: [
      {
        id: "doc-1",
        name: "Horticulture Department Officer ID",
        documentType: "Gazetted Officer Identification",
        fileName: "AP_ADH_ID_Proof.pdf",
        fileType: "application/pdf",
        fileSize: "1.3 MB",
        submittedDate: "09 Oct 2026",
        status: "submitted",
      },
      {
        id: "doc-2",
        name: "ADH Cadre Gazette Order",
        documentType: "Appointment Notification",
        fileName: "Gazette_ADH_Promotion_2023.pdf",
        fileType: "application/pdf",
        fileSize: "2.3 MB",
        submittedDate: "09 Oct 2026",
        status: "submitted",
      },
      {
        id: "doc-3",
        name: "District Jurisdiction Order",
        documentType: "Collectorate Order",
        fileName: "Prakasam_Horticulture_Jurisdiction.pdf",
        fileType: "application/pdf",
        fileSize: "1.9 MB",
        submittedDate: "09 Oct 2026",
        status: "submitted",
      },
    ],
    timeline: [
      {
        title: "Application Submitted",
        date: "09 Oct 2026, 08:00 AM",
        actor: "Smt. K. Lalitha Kumari",
        note: "New verification request logged.",
      },
    ],
  },
];

export default function GovtVerificationWorkspace() {
  const router = useRouter();
  const { t } = useTranslation();

  // Connect to applicant store so updates to GOV-VER-2026-8419 sync seamlessly
  const setVerificationStatusInStore = useGovernmentStore(
    (state) => state.setVerificationStatus
  );
  const onboardingData = useGovernmentStore((state) => state.onboardingData);

  // Core Request State
  const [requests, setRequests] = useState<VerificationRequestItem[]>(INITIAL_REQUESTS);
  const [selectedRequest, setSelectedRequest] = useState<VerificationRequestItem | null>(null);

  // Synchronize applicant-submitted onboardingData into verification workspace requests
  React.useEffect(() => {
    if (!onboardingData || !onboardingData.referenceNumber) return;
    setRequests((prev) =>
      prev.map((r) => {
        if (r.referenceNumber === onboardingData.referenceNumber) {
          return {
            ...r,
            representativeName: onboardingData.fullName || r.representativeName,
            designation: onboardingData.designation || r.designation,
            organizationName: onboardingData.organizationName || r.organizationName,
            status: (onboardingData.verificationStatus === "draft" || onboardingData.verificationStatus === "not_started"
              ? "submitted"
              : onboardingData.verificationStatus) as any,
            clarificationReason: onboardingData.clarificationReason || r.clarificationReason,
            rejectionReason: onboardingData.rejectionReason || r.rejectionReason,
            reviewerNote: onboardingData.reviewerNote || r.reviewerNote,
            verifiedDate: onboardingData.verifiedDate || r.verifiedDate,
          };
        }
        return r;
      })
    );
  }, [onboardingData]);

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [orgTypeFilter, setOrgTypeFilter] = useState<string>("all");
  const [districtFilter, setDistrictFilter] = useState<string>("all");

  // Document Audit Modal
  const [activeDocReview, setActiveDocReview] = useState<VerificationDocument | null>(null);
  const [docReviewNote, setDocReviewNote] = useState("");
  const [docActionError, setDocActionError] = useState<string | null>(null);

  // Decision Modals
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
  const [isClarificationModalOpen, setIsClarificationModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);

  // Decision Form Fields
  const [decisionReason, setDecisionReason] = useState("");
  const [decisionReviewerNote, setDecisionReviewerNote] = useState("");
  const [decisionAffectedDoc, setDecisionAffectedDoc] = useState("");
  const [decisionError, setDecisionError] = useState<string | null>(null);

  // Toast Banner
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Summary Metrics
  const summaryMetrics = useMemo(() => {
    const total = requests.length;
    const pending = requests.filter((r) => r.status === "submitted").length;
    const underReview = requests.filter((r) => r.status === "under_review").length;
    const verified = requests.filter((r) => r.status === "verified").length;
    const clarification = requests.filter((r) => r.status === "clarification_required").length;
    const rejected = requests.filter((r) => r.status === "rejected").length;

    return { total, pending, underReview, verified, clarification, rejected };
  }, [requests]);

  // Unique Districts for dropdown
  const availableDistricts = useMemo(() => {
    return Array.from(new Set(requests.map((r) => r.district))).sort();
  }, [requests]);

  // Filtered Request List
  const filteredRequests = useMemo(() => {
    return requests.filter((req) => {
      if (statusFilter !== "all" && req.status !== statusFilter) return false;
      if (orgTypeFilter !== "all" && req.organizationType !== orgTypeFilter) return false;
      if (districtFilter !== "all" && req.district !== districtFilter) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matches =
          req.referenceNumber.toLowerCase().includes(q) ||
          req.representativeName.toLowerCase().includes(q) ||
          req.organizationName.toLowerCase().includes(q) ||
          req.departmentMinistry.toLowerCase().includes(q) ||
          req.district.toLowerCase().includes(q) ||
          req.employeeOfficerId.toLowerCase().includes(q);
        if (!matches) return false;
      }

      return true;
    });
  }, [requests, statusFilter, orgTypeFilter, districtFilter, searchQuery]);

  // Are all documents verified?
  const allDocumentsVerified = useMemo(() => {
    if (!selectedRequest) return false;
    return selectedRequest.documents.length > 0 && selectedRequest.documents.every((d) => d.status === "verified");
  }, [selectedRequest]);

  // Status Badge Helper
  const renderStatusBadge = (status: VerificationRequestStatus) => {
    switch (status) {
      case "verified":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-[11px] font-bold text-emerald-800 border border-emerald-300">
            <CheckCircle2 size={12} className="text-[#24833A]" /> Verified
          </span>
        );
      case "under_review":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-[11px] font-bold text-amber-900 border border-amber-300">
            <Clock size={12} className="text-amber-700" /> Under Review
          </span>
        );
      case "submitted":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2.5 py-0.5 text-[11px] font-bold text-blue-900 border border-blue-300">
            <FileText size={12} className="text-blue-700" /> Submitted
          </span>
        );
      case "clarification_required":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-orange-100 px-2.5 py-0.5 text-[11px] font-bold text-orange-900 border border-orange-300">
            <AlertTriangle size={12} className="text-orange-700" /> Clarification Required
          </span>
        );
      case "rejected":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-rose-100 px-2.5 py-0.5 text-[11px] font-bold text-rose-900 border border-rose-300">
            <AlertOctagon size={12} className="text-rose-700" /> Rejected
          </span>
        );
      default:
        return null;
    }
  };

  const renderDocBadge = (status: VerificationDocument["status"]) => {
    switch (status) {
      case "verified":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-200">
            <CheckCircle2 size={11} className="text-[#24833A]" /> Verified
          </span>
        );
      case "clarification_required":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-orange-50 px-2 py-0.5 text-[10px] font-bold text-orange-800 border border-orange-200">
            <AlertTriangle size={11} className="text-orange-600" /> Clarification Req
          </span>
        );
      case "rejected":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2 py-0.5 text-[10px] font-bold text-rose-800 border border-rose-200">
            <AlertOctagon size={11} className="text-rose-600" /> Rejected
          </span>
        );
      case "under_review":
      case "submitted":
      default:
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-700 border border-gray-200">
            <Clock size={11} className="text-gray-500" /> Pending Review
          </span>
        );
    }
  };

  // Open Document Audit Modal
  const handleOpenDocReview = (doc: VerificationDocument) => {
    setActiveDocReview(doc);
    setDocReviewNote(doc.reviewerNote || doc.clarificationReason || doc.rejectionReason || "");
    setDocActionError(null);
  };

  // Update Individual Document Status
  const handleUpdateDocumentStatus = (
    newStatus: "verified" | "clarification_required" | "rejected"
  ) => {
    if (!activeDocReview || !selectedRequest) return;

    if (newStatus === "clarification_required" && !docReviewNote.trim()) {
      setDocActionError("Clarification reason is mandatory.");
      return;
    }
    if (newStatus === "rejected" && !docReviewNote.trim()) {
      setDocActionError("Rejection reason is mandatory.");
      return;
    }

    const today = new Date().toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
    const timeNow = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    const updatedDocuments = selectedRequest.documents.map((d) => {
      if (d.id === activeDocReview.id) {
        return {
          ...d,
          status: newStatus,
          clarificationReason: newStatus === "clarification_required" ? docReviewNote.trim() : undefined,
          rejectionReason: newStatus === "rejected" ? docReviewNote.trim() : undefined,
          reviewerNote: docReviewNote.trim() || undefined,
        };
      }
      return d;
    });

    const timelineEvent: TimelineEvent = {
      title:
        newStatus === "verified"
          ? `Document Verified: ${activeDocReview.name}`
          : newStatus === "clarification_required"
          ? `Clarification Requested for ${activeDocReview.name}`
          : `Document Rejected: ${activeDocReview.name}`,
      date: `${today}, ${timeNow}`,
      actor: "Authorized Audit Reviewer",
      note: docReviewNote.trim() || undefined,
    };

    const updatedRequest: VerificationRequestItem = {
      ...selectedRequest,
      documents: updatedDocuments,
      status: "under_review",
      lastUpdated: "Just now",
      timeline: [timelineEvent, ...selectedRequest.timeline],
    };

    setSelectedRequest(updatedRequest);
    setRequests((prev) => prev.map((r) => (r.id === updatedRequest.id ? updatedRequest : r)));
    setActiveDocReview(null);

    // Sync store if this is the applicant's record
    if (selectedRequest.referenceNumber === "GOV-VER-2026-8419") {
      setVerificationStatusInStore("under_review");
    }

    showToast(`Document "${activeDocReview.name}" marked as ${newStatus.replace("_", " ")}.`);
  };

  // Overall Decision: Approve Representative
  const handleConfirmApproval = () => {
    if (!selectedRequest) return;
    const today = new Date().toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
    const timeNow = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    const timelineEvent: TimelineEvent = {
      title: "Verification Approved",
      date: `${today}, ${timeNow}`,
      actor: "District Collectorate Verification Authority",
      note: "All required credentials and organizational charter validated.",
    };

    const updatedRequest: VerificationRequestItem = {
      ...selectedRequest,
      status: "verified",
      verifiedDate: today,
      lastUpdated: "Just now",
      timeline: [timelineEvent, ...selectedRequest.timeline],
    };

    setSelectedRequest(updatedRequest);
    setRequests((prev) => prev.map((r) => (r.id === updatedRequest.id ? updatedRequest : r)));
    setIsApproveModalOpen(false);

    if (selectedRequest.referenceNumber === "GOV-VER-2026-8419") {
      setVerificationStatusInStore("verified", { verifiedDate: today });
    }

    showToast(`Representative "${selectedRequest.representativeName}" verified successfully.`);
  };

  // Overall Decision: Request Clarification
  const handleSubmitClarification = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRequest) return;
    if (!decisionReason.trim()) {
      setDecisionError("Clarification reason is mandatory.");
      return;
    }

    const today = new Date().toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
    const timeNow = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    const timelineEvent: TimelineEvent = {
      title: "Clarification Requested",
      date: `${today}, ${timeNow}`,
      actor: "State Verification Desk",
      note: `${decisionReason.trim()} ${decisionAffectedDoc ? `(Affected Document: ${decisionAffectedDoc})` : ""}`,
    };

    const updatedRequest: VerificationRequestItem = {
      ...selectedRequest,
      status: "clarification_required",
      clarificationReason: decisionReason.trim(),
      reviewerNote: decisionReviewerNote.trim() || undefined,
      lastUpdated: "Just now",
      timeline: [timelineEvent, ...selectedRequest.timeline],
    };

    setSelectedRequest(updatedRequest);
    setRequests((prev) => prev.map((r) => (r.id === updatedRequest.id ? updatedRequest : r)));
    setIsClarificationModalOpen(false);

    if (selectedRequest.referenceNumber === "GOV-VER-2026-8419") {
      setVerificationStatusInStore("clarification_required", {
        clarificationReason: decisionReason.trim(),
        reviewerNote: decisionReviewerNote.trim() || undefined,
      });
    }

    setDecisionReason("");
    setDecisionReviewerNote("");
    setDecisionAffectedDoc("");
    setDecisionError(null);
    showToast(`Clarification request dispatched to ${selectedRequest.representativeName}.`);
  };

  // Overall Decision: Reject Verification
  const handleSubmitRejection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRequest) return;
    if (!decisionReason.trim()) {
      setDecisionError("Rejection reason is mandatory.");
      return;
    }

    const today = new Date().toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
    const timeNow = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    const timelineEvent: TimelineEvent = {
      title: "Verification Rejected",
      date: `${today}, ${timeNow}`,
      actor: "State Agricultural Review Cell",
      note: decisionReason.trim(),
    };

    const updatedRequest: VerificationRequestItem = {
      ...selectedRequest,
      status: "rejected",
      rejectedDate: today,
      rejectionReason: decisionReason.trim(),
      reviewerNote: decisionReviewerNote.trim() || undefined,
      lastUpdated: "Just now",
      timeline: [timelineEvent, ...selectedRequest.timeline],
    };

    setSelectedRequest(updatedRequest);
    setRequests((prev) => prev.map((r) => (r.id === updatedRequest.id ? updatedRequest : r)));
    setIsRejectModalOpen(false);

    if (selectedRequest.referenceNumber === "GOV-VER-2026-8419") {
      setVerificationStatusInStore("rejected", {
        rejectionReason: decisionReason.trim(),
        reviewerNote: decisionReviewerNote.trim() || undefined,
      });
    }

    setDecisionReason("");
    setDecisionReviewerNote("");
    setDecisionError(null);
    showToast(`Verification request ${selectedRequest.referenceNumber} rejected.`);
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
      {selectedRequest ? (
        <div className="flex items-center justify-between">
          <BackButton
            id="btn-verification-back-to-list"
            onClick={() => setSelectedRequest(null)}
            label={t("govtVerification.backToVerification") || "Back to Verification"}
          />
        </div>
      ) : (
        <div className="flex items-center justify-between">
          <BackButton
            id="btn-verification-back-to-dashboard"
            href="/dashboard"
            label={t("common.backToDashboard") || "Back to Dashboard"}
          />
        </div>
      )}

      {/* =========================================================
          VIEW A: VERIFICATION DETAIL VIEW
      ========================================================= */}
      {selectedRequest ? (
        <div className="flex flex-col gap-5 animate-fade-in">
          {/* Header Card */}
          <div className="rounded-3xl border border-gray-200 bg-white p-5 sm:p-6 shadow-2xs">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#E4F0DD] text-[#24833A] shadow-xs">
                  <ShieldCheck size={28} strokeWidth={2.4} />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs font-bold text-gray-500">
                      {selectedRequest.referenceNumber}
                    </span>
                    {renderStatusBadge(selectedRequest.status)}
                    <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-[10px] font-bold text-gray-700">
                      {selectedRequest.organizationType}
                    </span>
                  </div>
                  <h1 className="mt-1.5 text-xl sm:text-2xl font-bold text-gray-900 leading-snug">
                    {selectedRequest.representativeName}
                  </h1>
                  <p className="text-xs sm:text-sm font-semibold text-[#174D25] mt-0.5">
                    {selectedRequest.designation} • {selectedRequest.organizationName}
                  </p>
                  <p className="text-xs text-gray-500 font-medium mt-1 flex items-center gap-2">
                    <MapPin size={13} className="text-[#24833A]" />
                    <span>
                      {selectedRequest.mandal}, {selectedRequest.district} District
                    </span>
                    <span className="text-gray-300">•</span>
                    <Clock size={13} className="text-gray-400" />
                    <span>Submitted: {selectedRequest.submittedDate}</span>
                  </p>
                </div>
              </div>

              {/* Status Header Badge Info */}
              <div className="rounded-2xl bg-gray-50 p-3 border border-gray-100 text-xs flex flex-col gap-1 self-start sm:self-auto">
                <span className="text-[10px] uppercase font-bold text-gray-400">Audit Status</span>
                <p className="font-bold text-gray-900">
                  {selectedRequest.status === "verified"
                    ? `Verified (${selectedRequest.verifiedDate})`
                    : selectedRequest.status === "rejected"
                    ? `Rejected (${selectedRequest.rejectedDate})`
                    : selectedRequest.status === "clarification_required"
                    ? "Pending Clarification"
                    : "In Active Review"}
                </p>
                <span className="text-[11px] text-gray-500">Updated: {selectedRequest.lastUpdated}</span>
              </div>
            </div>
          </div>

          {/* Section B & C: Organization & Representative Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Organization Info */}
            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-2xs flex flex-col gap-3">
              <div className="flex items-center gap-2 border-b border-gray-100 pb-2.5">
                <Building2 size={18} className="text-[#24833A]" />
                <h2 className="text-sm font-bold text-gray-900">B. Organization Information</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-[10px] uppercase font-bold text-gray-400">Organization Name</span>
                  <p className="font-bold text-gray-900">{selectedRequest.organizationName}</p>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-gray-400">Department / Ministry</span>
                  <p className="font-semibold text-gray-800">{selectedRequest.departmentMinistry}</p>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-gray-400">Organization Type</span>
                  <p className="font-semibold text-gray-800">{selectedRequest.organizationType}</p>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-gray-400">Registration Ref No</span>
                  <p className="font-mono font-bold text-gray-900">{selectedRequest.registrationRefNumber}</p>
                </div>
                <div className="sm:col-span-2">
                  <span className="text-[10px] uppercase font-bold text-gray-400">Office Address</span>
                  <p className="text-gray-700 leading-relaxed font-medium">{selectedRequest.officeAddress}</p>
                </div>
                {selectedRequest.officialWebsite && (
                  <div className="sm:col-span-2">
                    <span className="text-[10px] uppercase font-bold text-gray-400">Official Website</span>
                    <a
                      href={selectedRequest.officialWebsite}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-[#24833A] hover:underline flex items-center gap-1 mt-0.5"
                    >
                      <span>{selectedRequest.officialWebsite}</span>
                      <ExternalLink size={12} />
                    </a>
                  </div>
                )}
              </div>

              {/* NGO Specific Fields (Part 14) */}
              {selectedRequest.organizationType === "NGO" && (
                <div className="mt-2 rounded-xl bg-purple-50/70 border border-purple-200 p-3 text-xs flex flex-col gap-1.5">
                  <span className="text-[10px] font-bold uppercase text-purple-800 block">
                    NGO Statutory Registry Details:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-gray-800">
                    <div>
                      <span className="text-gray-500 block">DARPAN Unique ID:</span>
                      <strong>{selectedRequest.ngoRegistrationNumber || "NGO/DARPAN/AP/2018/004812"}</strong>
                    </div>
                    <div>
                      <span className="text-gray-500 block">Registration Authority:</span>
                      <strong>{selectedRequest.ngoRegistrationAuthority || "Registrar of Societies & NITI Aayog"}</strong>
                    </div>
                    <div>
                      <span className="text-gray-500 block">Registration Date:</span>
                      <strong>{selectedRequest.ngoRegistrationDate || "14 Jun 2018"}</strong>
                    </div>
                    <div>
                      <span className="text-gray-500 block">Valid Until:</span>
                      <strong>{selectedRequest.ngoValidUntil || "31 Mar 2028"}</strong>
                    </div>
                  </div>
                </div>
              )}

              {/* Government Organization Official Verification (Part 15) */}
              {selectedRequest.organizationType !== "NGO" && (
                <div className="mt-2 rounded-xl bg-[#F4F8EE] border border-[#24833A]/20 p-3 text-xs flex flex-col gap-1.5">
                  <span className="text-[10px] font-bold uppercase text-[#174D25] block">
                    Official Organization Verification:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-gray-800">
                    <div>
                      <span className="text-gray-500 block">Department:</span>
                      <strong>{selectedRequest.departmentMinistry}</strong>
                    </div>
                    <div>
                      <span className="text-gray-500 block">Govt Reference Number:</span>
                      <strong className="font-mono">{selectedRequest.registrationRefNumber}</strong>
                    </div>
                    <div>
                      <span className="text-gray-500 block">Office Location:</span>
                      <strong>{selectedRequest.officeLocation}</strong>
                    </div>
                    <div>
                      <span className="text-gray-500 block">Authorized Officer ID:</span>
                      <strong className="font-mono">{selectedRequest.employeeOfficerId}</strong>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Representative Info */}
            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-2xs flex flex-col gap-3">
              <div className="flex items-center gap-2 border-b border-gray-100 pb-2.5">
                <UserCheck size={18} className="text-[#24833A]" />
                <h2 className="text-sm font-bold text-gray-900">C. Representative Information</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-[10px] uppercase font-bold text-gray-400">Full Name</span>
                  <p className="font-bold text-gray-900">{selectedRequest.representativeName}</p>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-gray-400">Official Designation</span>
                  <p className="font-bold text-[#174D25]">{selectedRequest.designation}</p>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-gray-400">Employee / Officer ID</span>
                  <p className="font-mono font-bold text-gray-900">{selectedRequest.employeeOfficerId}</p>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-gray-400">Department Role</span>
                  <p className="font-semibold text-gray-800">{selectedRequest.departmentRole}</p>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-gray-400">Official Email</span>
                  <p className="font-medium text-gray-800">{selectedRequest.officialEmail}</p>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-gray-400">Official Phone</span>
                  <p className="font-medium text-gray-800">{selectedRequest.officialPhone}</p>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-gray-400">Office Location</span>
                  <p className="font-medium text-gray-800">{selectedRequest.officeLocation}</p>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-gray-400">Years of Service</span>
                  <p className="font-semibold text-gray-900">{selectedRequest.yearsOfService}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Section D: Submitted Credentials (Document Audit) */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-2xs flex flex-col gap-3">
            <div className="flex items-center justify-between border-b border-gray-100 pb-2.5">
              <div className="flex items-center gap-2">
                <FileText size={18} className="text-[#24833A]" />
                <h2 className="text-sm font-bold text-gray-900">D. Submitted Credential Documents</h2>
              </div>
              <span className="text-xs text-gray-500 font-medium">
                {selectedRequest.documents.filter((d) => d.status === "verified").length} of{" "}
                {selectedRequest.documents.length} Documents Verified
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
              {selectedRequest.documents.map((doc) => (
                <div
                  key={doc.id}
                  className="rounded-2xl border border-gray-200 bg-white p-4 shadow-2xs flex flex-col justify-between gap-3 hover:border-[#24833A]/40 transition"
                >
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-bold text-xs text-gray-900 leading-snug">{doc.name}</span>
                      {renderDocBadge(doc.status)}
                    </div>
                    <span className="text-[10px] text-gray-400 font-medium">{doc.documentType}</span>
                    <div className="rounded-xl bg-gray-50 p-2 border border-gray-100 text-[11px] text-gray-600 flex flex-col gap-0.5 mt-1">
                      <span className="font-mono truncate">{doc.fileName}</span>
                      <span className="text-[10px] text-gray-400">
                        {doc.fileSize} • Submitted: {doc.submittedDate}
                      </span>
                    </div>

                    {doc.clarificationReason && (
                      <div className="rounded-lg bg-orange-50 border border-orange-200 p-2 text-[10px] text-orange-900">
                        <strong>Clarification:</strong> {doc.clarificationReason}
                      </div>
                    )}
                    {doc.rejectionReason && (
                      <div className="rounded-lg bg-rose-50 border border-rose-200 p-2 text-[10px] text-rose-900">
                        <strong>Rejected:</strong> {doc.rejectionReason}
                      </div>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => handleOpenDocReview(doc)}
                    className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs font-bold text-gray-700 hover:border-[#24833A] hover:text-[#24833A] transition cursor-pointer shadow-2xs"
                  >
                    <Eye size={13} />
                    <span>Review Document</span>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Section E: Activity Timeline */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-2xs flex flex-col gap-3">
            <div className="flex items-center gap-2 border-b border-gray-100 pb-2.5">
              <History size={18} className="text-[#24833A]" />
              <h2 className="text-sm font-bold text-gray-900">Verification Activity Timeline</h2>
            </div>
            <div className="flex flex-col gap-3 pt-2">
              {selectedRequest.timeline.map((event, idx) => (
                <div key={idx} className="flex items-start gap-3 text-xs">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#E4F0DD] text-[#24833A] font-bold text-[10px]">
                    {idx + 1}
                  </div>
                  <div className="flex flex-col">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-bold text-gray-900">{event.title}</span>
                      <span className="text-gray-400">•</span>
                      <span className="text-gray-500 font-medium">{event.date}</span>
                      <span className="text-gray-400">•</span>
                      <span className="text-[#174D25] font-semibold">by {event.actor}</span>
                    </div>
                    {event.note && <p className="text-gray-600 mt-0.5 leading-relaxed">{event.note}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section F: Overall Verification Decision Panel (Part 8) */}
          <div className="rounded-3xl border border-gray-200 bg-white p-5 sm:p-6 shadow-2xs flex flex-col gap-3.5">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <h3 className="text-sm sm:text-base font-bold text-gray-900">Verification Decision</h3>
                <p className="text-xs text-gray-500 font-medium">
                  Authoritative approval, clarification request, or rejection decision.
                </p>
              </div>
              {renderStatusBadge(selectedRequest.status)}
            </div>

            {!allDocumentsVerified && selectedRequest.status !== "verified" && (
              <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-3 text-xs text-amber-900 flex items-center gap-2 font-medium">
                <AlertTriangle size={15} className="shrink-0 text-amber-700" />
                <span>Verification cannot be approved yet. Complete all required document reviews.</span>
              </div>
            )}

            <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
              <div className="text-xs text-gray-500 font-medium">
                Decision will update official representative authorization and RBK broadcast access.
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  id="btn-open-clarification-decision"
                  onClick={() => {
                    setDecisionReason("");
                    setDecisionReviewerNote("");
                    setDecisionAffectedDoc("");
                    setDecisionError(null);
                    setIsClarificationModalOpen(true);
                  }}
                  className="rounded-xl border border-orange-300 bg-orange-50 px-3.5 py-2 text-xs font-bold text-orange-800 hover:bg-orange-100 transition cursor-pointer"
                >
                  Request Clarification
                </button>

                <button
                  type="button"
                  id="btn-open-reject-decision"
                  onClick={() => {
                    setDecisionReason("");
                    setDecisionReviewerNote("");
                    setDecisionError(null);
                    setIsRejectModalOpen(true);
                  }}
                  className="rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-2 text-xs font-bold text-rose-700 hover:bg-rose-100 transition cursor-pointer"
                >
                  Reject Verification
                </button>

                <button
                  type="button"
                  id="btn-open-approve-decision"
                  onClick={() => setIsApproveModalOpen(true)}
                  disabled={!allDocumentsVerified || selectedRequest.status === "verified"}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-[#24833A] px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-[#174D25] disabled:opacity-50 cursor-pointer transition"
                >
                  <CheckSquare size={14} />
                  <span>Approve Representative</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* =========================================================
            VIEW B: MAIN VERIFICATION DASHBOARD & REQUESTS LIST
        ========================================================= */
        <div className="flex flex-col gap-5 animate-fade-in">
          {/* Header Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-3xl bg-white p-5 border border-gray-200 shadow-2xs">
            <div className="flex items-center gap-3.5">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#E4F0DD] text-[#24833A] shadow-xs">
                <ShieldCheck size={26} strokeWidth={2.4} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-lg sm:text-xl font-bold text-gray-900">
                    {t("govtVerification.title") || "Government & NGO Verification"}
                  </h1>
                  <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-[#24833A] border border-emerald-200">
                    Review Desk
                  </span>
                </div>
                <p className="text-xs text-gray-500 font-medium">
                  {t("govtVerification.subtitle") ||
                    "Review representative credentials, organization documents and verification requests."}
                </p>
              </div>
            </div>
          </div>

          {/* Metric Summary Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-6 gap-3">
            <div className="rounded-2xl border border-gray-200 bg-white p-3.5 shadow-2xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                {t("govtVerification.totalRequests") || "Total Requests"}
              </span>
              <p className="mt-1.5 text-xl font-bold text-gray-900">{summaryMetrics.total}</p>
              <span className="text-[10px] text-gray-500">All submissions</span>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-3.5 shadow-2xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600">
                {t("govtVerification.pendingReview") || "Pending Review"}
              </span>
              <p className="mt-1.5 text-xl font-bold text-blue-900">{summaryMetrics.pending}</p>
              <span className="text-[10px] text-gray-500">New submissions</span>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-3.5 shadow-2xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600">
                {t("govtVerification.underReview") || "Under Review"}
              </span>
              <p className="mt-1.5 text-xl font-bold text-amber-800">{summaryMetrics.underReview}</p>
              <span className="text-[10px] text-gray-500">Active audits</span>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-3.5 shadow-2xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">
                {t("govtVerification.verified") || "Verified"}
              </span>
              <p className="mt-1.5 text-xl font-bold text-emerald-700">{summaryMetrics.verified}</p>
              <span className="text-[10px] text-gray-500">Authorized reps</span>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-3.5 shadow-2xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-orange-600">
                {t("govtVerification.clarificationRequired") || "Clarification Required"}
              </span>
              <p className="mt-1.5 text-xl font-bold text-orange-800">{summaryMetrics.clarification}</p>
              <span className="text-[10px] text-gray-500">Action pending</span>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-3.5 shadow-2xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600">
                {t("govtVerification.rejected") || "Rejected"}
              </span>
              <p className="mt-1.5 text-xl font-bold text-rose-700">{summaryMetrics.rejected}</p>
              <span className="text-[10px] text-gray-500">Invalid records</span>
            </div>
          </div>

          {/* Search & Responsive Filters */}
          <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-2xs flex flex-col gap-3">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Search */}
              <div className="relative sm:col-span-1">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search ref no, name, org, or officer ID..."
                  className="h-11 w-full rounded-xl border border-gray-200 pl-9 pr-3 text-xs focus:border-[#24833A] focus:outline-none"
                />
              </div>

              {/* Organization Type Filter */}
              <div>
                <select
                  value={orgTypeFilter}
                  onChange={(e) => setOrgTypeFilter(e.target.value)}
                  className="h-11 w-full rounded-xl border border-gray-200 px-3 text-xs font-medium text-gray-700 focus:border-[#24833A] focus:outline-none"
                >
                  <option value="all">All Organization Types</option>
                  <option value="Government Department">Government Department</option>
                  <option value="Government Agency">Government Agency</option>
                  <option value="Local Government Body">Local Government Body</option>
                  <option value="NGO">Non-Governmental Organization (NGO)</option>
                  <option value="Agricultural Development Organization">Agricultural Development Organization</option>
                </select>
              </div>

              {/* District Filter */}
              <div>
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
            </div>

            {/* Status Pills */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-[11px] font-bold text-gray-400 mr-1">Status:</span>
              {(
                [
                  { id: "all", label: "All Requests" },
                  { id: "submitted", label: "Submitted" },
                  { id: "under_review", label: "Under Review" },
                  { id: "verified", label: "Verified" },
                  { id: "clarification_required", label: "Clarification Required" },
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

          {/* Desktop Table / Mobile Card Hybrid (Part 4) */}
          <div className="rounded-2xl border border-gray-200 bg-white shadow-2xs overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <span className="text-xs font-bold text-gray-700">
                Verification Submissions ({filteredRequests.length})
              </span>
              <span className="text-[11px] text-gray-400">Click Review to inspect credentials and audit documents</span>
            </div>

            {filteredRequests.length === 0 ? (
              <div className="p-12 text-center">
                <ShieldCheck size={32} className="mx-auto text-gray-300" />
                <p className="mt-2 text-sm font-bold text-gray-700">No verification requests match your filters.</p>
                <p className="text-xs text-gray-400 mt-1">Try resetting the status or district filter.</p>
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    setStatusFilter("all");
                    setOrgTypeFilter("all");
                    setDistrictFilter("all");
                  }}
                  className="mt-3 rounded-xl bg-[#24833A] px-3.5 py-1.5 text-xs font-bold text-white hover:bg-[#174D25]"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <>
                {/* Desktop Table (Hidden on Mobile) */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-gray-50/80 text-[10px] uppercase font-bold text-gray-500 border-b border-gray-100">
                      <tr>
                        <th className="py-3 px-4">Ref Number</th>
                        <th className="py-3 px-4">Representative</th>
                        <th className="py-3 px-4">Organization</th>
                        <th className="py-3 px-4">Designation</th>
                        <th className="py-3 px-4">District</th>
                        <th className="py-3 px-4">Submitted</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {filteredRequests.map((req) => (
                        <tr key={req.id} className="hover:bg-gray-50/50 transition">
                          <td className="py-3 px-4 font-mono font-bold text-gray-900">{req.referenceNumber}</td>
                          <td className="py-3 px-4 font-semibold text-gray-900">{req.representativeName}</td>
                          <td className="py-3 px-4 text-gray-600 max-w-[200px] truncate">{req.organizationName}</td>
                          <td className="py-3 px-4 text-gray-700">{req.designation}</td>
                          <td className="py-3 px-4 text-gray-600">{req.district}</td>
                          <td className="py-3 px-4 text-gray-500 whitespace-nowrap">{req.submittedDate}</td>
                          <td className="py-3 px-4">{renderStatusBadge(req.status)}</td>
                          <td className="py-3 px-4 text-right">
                            <button
                              type="button"
                              onClick={() => setSelectedRequest(req)}
                              className="inline-flex items-center gap-1 rounded-xl bg-[#24833A] px-3 py-1.5 text-xs font-bold text-white hover:bg-[#174D25] transition cursor-pointer shadow-xs"
                            >
                              <span>Review</span>
                              <ArrowRight size={12} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Stacked Cards (Visible on Mobile) */}
                <div className="md:hidden divide-y divide-gray-100">
                  {filteredRequests.map((req) => (
                    <div key={req.id} className="p-4 flex flex-col gap-3">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className="font-mono text-xs font-bold text-gray-900">{req.referenceNumber}</span>
                          <h3 className="text-sm font-bold text-gray-900 mt-0.5">{req.representativeName}</h3>
                          <p className="text-xs text-gray-600 font-medium">{req.designation}</p>
                        </div>
                        {renderStatusBadge(req.status)}
                      </div>

                      <div className="rounded-xl bg-gray-50 p-2.5 text-xs text-gray-600 flex flex-col gap-1">
                        <div>
                          <span className="text-[10px] uppercase font-bold text-gray-400 block">Organization</span>
                          <span className="font-semibold text-gray-800">{req.organizationName}</span>
                        </div>
                        <div className="flex items-center justify-between text-[11px] text-gray-500 pt-1 border-t border-gray-200/50">
                          <span>{req.district} District</span>
                          <span>Submitted: {req.submittedDate}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-end pt-1">
                        <button
                          type="button"
                          onClick={() => setSelectedRequest(req)}
                          className="w-full inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#24833A] py-2.5 text-xs font-bold text-white hover:bg-[#174D25] transition cursor-pointer shadow-xs"
                        >
                          <span>Review Application</span>
                          <ArrowRight size={14} />
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
          MODAL 1: DOCUMENT REVIEW & AUDIT MODAL (Part 7)
      ========================================================= */}
      {activeDocReview && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs"
          onClick={() => setActiveDocReview(null)}
        >
          <div
            className="w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl border border-gray-200 bg-white p-5 sm:p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-gray-900">{activeDocReview.name}</h3>
                <p className="text-xs text-gray-500">{activeDocReview.documentType}</p>
              </div>
              <button
                type="button"
                onClick={() => setActiveDocReview(null)}
                className="text-gray-400 hover:text-gray-600 p-1 cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {/* Error banner */}
            {docActionError && (
              <div className="mt-3 rounded-xl bg-rose-50 border border-rose-200 p-3 text-xs font-bold text-rose-800 flex items-center gap-2">
                <AlertTriangle size={15} className="shrink-0" />
                <span>{docActionError}</span>
              </div>
            )}

            {/* Document Metadata Bar */}
            <div className="my-3 rounded-2xl bg-gray-50 p-3.5 border border-gray-100 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div>
                <span className="text-[10px] uppercase font-bold text-gray-400 block">File Name</span>
                <span className="font-mono text-gray-900 truncate block">{activeDocReview.fileName}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-gray-400 block">File Size</span>
                <span className="font-semibold text-gray-800">{activeDocReview.fileSize}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-gray-400 block">Submitted</span>
                <span className="font-semibold text-gray-800">{activeDocReview.submittedDate}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-gray-400 block">Status</span>
                {renderDocBadge(activeDocReview.status)}
              </div>
            </div>

            {/* Mock Document Preview Area */}
            <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50/80 p-8 text-center flex flex-col items-center justify-center gap-2">
              <FileCode size={36} className="text-[#24833A]" />
              <p className="text-xs font-bold text-gray-800">Mock Document Preview Panel</p>
              <p className="text-[11px] text-gray-500 max-w-sm leading-relaxed">
                Rendered preview of <strong>{activeDocReview.fileName}</strong> ({activeDocReview.fileType}). Verified
                against statutory gazette registry format.
              </p>
              <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-[#24833A] border border-emerald-200 mt-1">
                Official Document Checksum Valid
              </span>
            </div>

            {/* Reviewer Note / Reason Input */}
            <div className="mt-4">
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Reviewer Observation / Clarification / Rejection Reason
              </label>
              <textarea
                rows={3}
                value={docReviewNote}
                onChange={(e) => setDocReviewNote(e.target.value)}
                placeholder="Enter audit remarks (required if requesting clarification or rejecting)..."
                className="w-full rounded-xl border border-gray-200 p-3 text-xs focus:border-[#24833A] focus:outline-none resize-none leading-relaxed"
              />
            </div>

            {/* Modal Actions */}
            <div className="mt-4 flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setActiveDocReview(null)}
                className="rounded-xl border border-gray-200 px-3.5 py-2 text-xs font-bold text-gray-600 hover:bg-gray-50 cursor-pointer"
              >
                Cancel
              </button>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  id="btn-reject-document-action"
                  onClick={() => handleUpdateDocumentStatus("rejected")}
                  className="rounded-xl border border-rose-300 bg-rose-50 px-3.5 py-2 text-xs font-bold text-rose-700 hover:bg-rose-100 cursor-pointer"
                >
                  Reject Document
                </button>
                <button
                  type="button"
                  id="btn-clarify-document-action"
                  onClick={() => handleUpdateDocumentStatus("clarification_required")}
                  className="rounded-xl border border-orange-300 bg-orange-50 px-3.5 py-2 text-xs font-bold text-orange-800 hover:bg-orange-100 cursor-pointer"
                >
                  Request Clarification
                </button>
                <button
                  type="button"
                  id="btn-verify-document-action"
                  onClick={() => handleUpdateDocumentStatus("verified")}
                  className="rounded-xl bg-[#24833A] px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-[#174D25] cursor-pointer"
                >
                  Mark as Verified
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================
          MODAL 2: APPROVAL CONFIRMATION MODAL (Part 9)
      ========================================================= */}
      {isApproveModalOpen && selectedRequest && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs"
          onClick={() => setIsApproveModalOpen(false)}
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
                <h3 className="text-base font-bold text-gray-900">Approve Verification?</h3>
                <span className="text-[10px] font-bold uppercase text-[#24833A]">Official State Authorization</span>
              </div>
            </div>

            <p className="my-4 text-xs text-gray-600 leading-relaxed">
              This will mark the Government / NGO representative as verified in this frontend verification workspace.
              Representative <strong>{selectedRequest.representativeName}</strong> ({selectedRequest.referenceNumber})
              will receive verified administrative authorization credentials.
            </p>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsApproveModalOpen(false)}
                className="rounded-xl border border-gray-200 px-4 py-2 text-xs font-bold text-gray-600 hover:bg-gray-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                id="btn-confirm-approve-representative"
                onClick={handleConfirmApproval}
                className="rounded-xl bg-[#24833A] px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-[#174D25] cursor-pointer"
              >
                Confirm Approval
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================
          MODAL 3: CLARIFICATION MODAL (Part 10)
      ========================================================= */}
      {isClarificationModalOpen && selectedRequest && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs"
          onClick={() => setIsClarificationModalOpen(false)}
        >
          <div
            className="w-full max-w-lg rounded-3xl border border-orange-200 bg-white p-5 sm:p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 border-b border-orange-100 pb-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-100 text-orange-700">
                <AlertTriangle size={20} />
              </div>
              <div>
                <h3 className="text-base font-bold text-gray-900">Request Credential Clarification</h3>
                <p className="text-xs text-orange-700 font-semibold">{selectedRequest.referenceNumber}</p>
              </div>
            </div>

            {decisionError && (
              <div className="mt-3 rounded-xl bg-rose-50 border border-rose-200 p-2.5 text-xs font-bold text-rose-800">
                {decisionError}
              </div>
            )}

            <form onSubmit={handleSubmitClarification} className="mt-4 flex flex-col gap-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Clarification Reason <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={3}
                  required
                  value={decisionReason}
                  onChange={(e) => setDecisionReason(e.target.value)}
                  placeholder="Specify clear requirements (e.g. upload legible appointment order, obtain signed president seal)..."
                  className="w-full rounded-xl border border-gray-200 p-3 text-xs focus:border-orange-600 focus:outline-none resize-none leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Affected Document (Optional)</label>
                <select
                  value={decisionAffectedDoc}
                  onChange={(e) => setDecisionAffectedDoc(e.target.value)}
                  className="w-full h-11 rounded-xl border border-gray-200 px-3 text-xs font-medium focus:border-orange-600 focus:outline-none"
                >
                  <option value="">General Application Clarification</option>
                  {selectedRequest.documents.map((d) => (
                    <option key={d.id} value={d.name}>
                      {d.name} ({d.fileName})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Reviewer Note / Internal Log</label>
                <input
                  type="text"
                  value={decisionReviewerNote}
                  onChange={(e) => setDecisionReviewerNote(e.target.value)}
                  placeholder="e.g. Logged under Section 4 Verification Manual"
                  className="w-full h-11 rounded-xl border border-gray-200 px-3 text-xs focus:border-orange-600 focus:outline-none"
                />
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
                  type="submit"
                  id="btn-submit-clarification-request"
                  className="rounded-xl bg-orange-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-orange-700 cursor-pointer"
                >
                  Submit Clarification Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================
          MODAL 4: REJECTION MODAL (Part 11)
      ========================================================= */}
      {isRejectModalOpen && selectedRequest && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs"
          onClick={() => setIsRejectModalOpen(false)}
        >
          <div
            className="w-full max-w-lg rounded-3xl border border-rose-300 bg-white p-5 sm:p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 border-b border-rose-100 pb-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-100 text-rose-700">
                <AlertOctagon size={20} />
              </div>
              <div>
                <h3 className="text-base font-bold text-gray-900">Reject Verification Request</h3>
                <p className="text-xs text-rose-700 font-semibold">{selectedRequest.referenceNumber}</p>
              </div>
            </div>

            {decisionError && (
              <div className="mt-3 rounded-xl bg-rose-50 border border-rose-200 p-2.5 text-xs font-bold text-rose-800">
                {decisionError}
              </div>
            )}

            <form onSubmit={handleSubmitRejection} className="mt-4 flex flex-col gap-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Rejection Reason <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={3}
                  required
                  value={decisionReason}
                  onChange={(e) => setDecisionReason(e.target.value)}
                  placeholder="Specify statutory grounds for rejection (e.g. lapsed NGO registration, unverifiable credentials)..."
                  className="w-full rounded-xl border border-gray-200 p-3 text-xs focus:border-rose-600 focus:outline-none resize-none leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Reviewer Note</label>
                <input
                  type="text"
                  value={decisionReviewerNote}
                  onChange={(e) => setDecisionReviewerNote(e.target.value)}
                  placeholder="Internal audit remarks"
                  className="w-full h-11 rounded-xl border border-gray-200 px-3 text-xs focus:border-rose-600 focus:outline-none"
                />
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
                  type="submit"
                  id="btn-confirm-rejection-decision"
                  className="rounded-xl bg-rose-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-rose-700 cursor-pointer"
                >
                  Confirm Rejection
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
