import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type GovtSchemeStatus = "active" | "draft" | "closed";
export type GovtApplicationStatus =
  | "pending"
  | "under_verification"
  | "approved"
  | "rejected"
  | "disbursed";

export interface GovtSchemeItem {
  id: string;
  name: string;
  department: string;
  category: string;
  status: GovtSchemeStatus;
  applicationsCount: number;
  benefitAmount: string;
  deadline: string;
  lastUpdated: string;
  description: string;
  targetBeneficiaries: string;
  landRequirement: string;
  requiredDocuments: string[];
  startDate: string;
  endDate: string;
}

export interface ApplicationTimelineEvent {
  title: string;
  date: string;
  actor: string;
  note?: string;
}

export interface GovtApplicationItem {
  id: string;
  farmerName: string;
  farmerAadhaarLast4: string;
  farmerMobile: string;
  farmerLandholding: string;
  district: string;
  mandal: string;
  village: string;
  schemeId: string;
  schemeName: string;
  submittedDate: string;
  status: GovtApplicationStatus;
  benefitAmount: string;
  documentsSubmitted: { name: string; verified: boolean; url?: string }[];
  verificationNotes?: string;
  rejectionReason?: string;
  clarificationRequirements?: string;
  timeline: ApplicationTimelineEvent[];
}

export const INITIAL_GOVT_SCHEMES: GovtSchemeItem[] = [
  {
    id: "SCH-001",
    name: "Rythu Bharosa Investment Support",
    department: "Dept. of Agriculture & Farmers Welfare, AP",
    category: "Direct Income Support",
    status: "active",
    applicationsCount: 14280,
    benefitAmount: "₹13,500 / year",
    deadline: "31 Dec 2026",
    lastUpdated: "05 Oct 2026",
    description:
      "Annual financial assistance provided in three phases to landowner farmers and tenant cultivators for agricultural inputs.",
    targetBeneficiaries: "All resident landholding farmers and verified tenant cultivators (CCRC cards).",
    landRequirement: "Up to 5 Acres (Small & Marginal cultivators prioritized).",
    requiredDocuments: [
      "Pattadar Passbook / CCRC Agreement",
      "Aadhaar Card (UIDAI Linked)",
      "Active Bank Account Passbook",
    ],
    startDate: "01 Jun 2026",
    endDate: "31 Dec 2026",
  },
  {
    id: "SCH-002",
    name: "PM-KISAN Samman Nidhi",
    department: "Ministry of Agriculture & Farmers Welfare, GoI",
    category: "Central Income Support",
    status: "active",
    applicationsCount: 18920,
    benefitAmount: "₹6,000 / year (₹2,000 x 3)",
    deadline: "Ongoing",
    lastUpdated: "01 Oct 2026",
    description:
      "Central sector scheme to supplement financial needs of landholding farmers' families in procuring agricultural inputs.",
    targetBeneficiaries: "Cultivable landowning farmer families whose names appear in land records.",
    landRequirement: "Any cultivable landholding (Non-institutional).",
    requiredDocuments: [
      "Record of Rights (1-B / ROR)",
      "Aadhaar Card with e-KYC Verification",
      "Bank Account Linked with NPCI Aadhaar Seeding",
    ],
    startDate: "01 Jan 2026",
    endDate: "31 Dec 2026",
  },
  {
    id: "SCH-003",
    name: "YSR Comprehensive Free Crop Insurance",
    department: "Directorate of Agricultural Insurance & Risk",
    category: "Crop Insurance & Relief",
    status: "active",
    applicationsCount: 8450,
    benefitAmount: "Full Sum Insured (100% Premium State-Subsidized)",
    deadline: "15 Nov 2026",
    lastUpdated: "28 Sep 2026",
    description:
      "State government covers farmer share of premium for notified crops based on e-Crop registration data.",
    targetBeneficiaries: "Registered cultivators who completed e-Crop field enumeration.",
    landRequirement: "All notified mandal crop acreages.",
    requiredDocuments: [
      "e-Crop Sowing Receipt (VAA Signed)",
      "Aadhaar Card",
      "Survey Settlement Land Document",
    ],
    startDate: "15 Jul 2026",
    endDate: "15 Nov 2026",
  },
  {
    id: "SCH-004",
    name: "Subsidized Micro-Irrigation & Drip Kit Subsidy",
    department: "AP Micro Irrigation Project (APMIP)",
    category: "Irrigation Assistance",
    status: "active",
    applicationsCount: 4120,
    benefitAmount: "90% Subsidy (Up to ₹45,000 value)",
    deadline: "30 Nov 2026",
    lastUpdated: "25 Sep 2026",
    description:
      "Drip irrigation systems and inline drip laterals installed for horticulture and commercial crops.",
    targetBeneficiaries: "Small and marginal farmers cultivating commercial or horticultural crops.",
    landRequirement: "Minimum 1.0 Acre, Maximum 5.0 Acres with confirmed water source.",
    requiredDocuments: [
      "Pattadar Passbook",
      "Borewell / Open Well Electricity Connection Proof",
      "Soil & Water Testing Certificate",
    ],
    startDate: "01 Aug 2026",
    endDate: "30 Nov 2026",
  },
  {
    id: "SCH-005",
    name: "Custom Hiring Center Farm Mechanization Scheme",
    department: "Agricultural Engineering Directorate",
    category: "Farm Mechanization Support",
    status: "active",
    applicationsCount: 2340,
    benefitAmount: "50% Subsidy on Implements (Max ₹2.5 Lakhs)",
    deadline: "20 Dec 2026",
    lastUpdated: "20 Sep 2026",
    description:
      "Subsidies on rotavators, power tillers, laser levelers and harvesters for farmer groups and FPOs.",
    targetBeneficiaries: "Individual progressive farmers, Rythu Mithra Groups, and Registered FPOs.",
    landRequirement: "Operational farming record of at least 3 seasons.",
    requiredDocuments: [
      "Group Resolution / Individual Land Proof",
      "Dealer Proforma Invoice (Approved Manufacturer)",
      "Bank Loan Sanction Letter (if co-financed)",
    ],
    startDate: "01 Sep 2026",
    endDate: "20 Dec 2026",
  },
  {
    id: "SCH-006",
    name: "Natural Farming Biological Inputs Subsidy",
    department: "AP Community Managed Natural Farming (APCNF)",
    category: "Organic & Sustainable Inputs",
    status: "draft",
    applicationsCount: 0,
    benefitAmount: "₹5,000 / Acre Input Grant",
    deadline: "Draft - Under Review",
    lastUpdated: "04 Oct 2026",
    description:
      "Incentive for bio-fertilizers, neem-based formulations and indigenous cattle maintenance.",
    targetBeneficiaries: "Registered natural farming practitioners transitioning from chemical fertilizers.",
    landRequirement: "Minimum 0.5 Acre dedicated organic plot.",
    requiredDocuments: [
      "APCNF Cluster Registration ID",
      "Pattadar Passbook",
      "Cluster Resource Person (CRP) Endorsement",
    ],
    startDate: "01 Nov 2026",
    endDate: "31 Mar 2027",
  },
  {
    id: "SCH-007",
    name: "Cyclone Michuang Disaster Input Subsidy",
    department: "State Disaster Management Authority (APSDMA)",
    category: "Emergency Relief",
    status: "closed",
    applicationsCount: 6800,
    benefitAmount: "₹10,000 / Hectare Direct Relief",
    deadline: "Closed (31 Aug 2026)",
    lastUpdated: "31 Aug 2026",
    description:
      "Ex-gratia input subsidy disbursed to cultivators suffering >33% inundation crop loss.",
    targetBeneficiaries: "Farmers in cyclone-notified mandals verified by joint enumeration teams.",
    landRequirement: "Loss-notified survey numbers only.",
    requiredDocuments: [
      "Joint Revenue & Agri Enumeration Form",
      "Aadhaar Card",
      "Bank Account IFSC Verification",
    ],
    startDate: "01 Jun 2026",
    endDate: "31 Aug 2026",
  },
];

export const INITIAL_GOVT_APPLICATIONS: GovtApplicationItem[] = [
  {
    id: "APP-2026-8801",
    farmerName: "K. Venkata Ramana",
    farmerAadhaarLast4: "4921",
    farmerMobile: "9876543210",
    farmerLandholding: "3.2 Acres",
    district: "Guntur",
    mandal: "Mangalagiri",
    village: "Navuluru",
    schemeId: "SCH-001",
    schemeName: "Rythu Bharosa Investment Support",
    submittedDate: "06 Oct 2026",
    status: "pending",
    benefitAmount: "₹13,500",
    documentsSubmitted: [
      { name: "Pattadar Passbook (RoR 1-B)", verified: true },
      { name: "Aadhaar Card (UIDAI Linked)", verified: true },
      { name: "Bank Passbook Copy", verified: false },
    ],
    verificationNotes: "e-Crop registration cross-verified. Awaiting bank IFSC branch validation.",
    timeline: [
      {
        title: "Application Submitted via RBK Portal",
        date: "06 Oct 2026, 11:20 AM",
        actor: "Village Agriculture Assistant (VAA)",
      },
      {
        title: "Aadhaar e-KYC Verified",
        date: "06 Oct 2026, 11:45 AM",
        actor: "System Gateway",
      },
    ],
  },
  {
    id: "APP-2026-8802",
    farmerName: "M. Lakshmi Narayana",
    farmerAadhaarLast4: "8134",
    farmerMobile: "9848123456",
    farmerLandholding: "2.5 Acres",
    district: "Krishna",
    mandal: "Vijayawada Rural",
    village: "Nunna",
    schemeId: "SCH-002",
    schemeName: "PM-KISAN Samman Nidhi",
    submittedDate: "05 Oct 2026",
    status: "under_verification",
    benefitAmount: "₹6,000",
    documentsSubmitted: [
      { name: "Record of Rights (1-B)", verified: true },
      { name: "Aadhaar Card with e-KYC", verified: true },
      { name: "Bank Account Passbook", verified: true },
    ],
    verificationNotes: "Mandal revenue officer land ownership check in progress.",
    timeline: [
      {
        title: "Application Received",
        date: "05 Oct 2026, 09:10 AM",
        actor: "Farmer Self-Portal",
      },
      {
        title: "Marked Under Field Verification",
        date: "06 Oct 2026, 02:30 PM",
        actor: "Mandal Agricultural Officer",
      },
    ],
  },
  {
    id: "APP-2026-8803",
    farmerName: "B. Anjaneyulu",
    farmerAadhaarLast4: "6270",
    farmerMobile: "9440192837",
    farmerLandholding: "4.8 Acres",
    district: "Prakasam",
    mandal: "Ongole",
    village: "Karakambadi",
    schemeId: "SCH-003",
    schemeName: "YSR Comprehensive Free Crop Insurance",
    submittedDate: "03 Oct 2026",
    status: "approved",
    benefitAmount: "₹38,400 (Coverage)",
    documentsSubmitted: [
      { name: "e-Crop Sowing Receipt", verified: true },
      { name: "Aadhaar Card", verified: true },
      { name: "Survey Land Record", verified: true },
    ],
    verificationNotes: "All criteria verified. Premium subsidy granted and certificate issued.",
    timeline: [
      {
        title: "Application Submitted",
        date: "03 Oct 2026, 10:15 AM",
        actor: "VAA Karakambadi",
      },
      {
        title: "Field Inspection Verified",
        date: "04 Oct 2026, 03:00 PM",
        actor: "Agricultural Extension Officer",
      },
      {
        title: "Application Approved",
        date: "05 Oct 2026, 11:00 AM",
        actor: "District Agriculture Officer (DAO)",
      },
    ],
  },
  {
    id: "APP-2026-8804",
    farmerName: "Ch. Subba Rao",
    farmerAadhaarLast4: "1923",
    farmerMobile: "9988776655",
    farmerLandholding: "3.0 Acres",
    district: "Guntur",
    mandal: "Tenali",
    village: "Angalakuduru",
    schemeId: "SCH-004",
    schemeName: "Subsidized Micro-Irrigation & Drip Kit Subsidy",
    submittedDate: "28 Sep 2026",
    status: "disbursed",
    benefitAmount: "₹42,000 (Subsidy)",
    documentsSubmitted: [
      { name: "Pattadar Passbook", verified: true },
      { name: "Electricity Connection Proof", verified: true },
      { name: "Soil & Water Test Certificate", verified: true },
    ],
    verificationNotes: "Drip equipment installed and GPS geotagged. Subsidy credited to manufacturer.",
    timeline: [
      {
        title: "Application Submitted",
        date: "28 Sep 2026, 02:00 PM",
        actor: "Farmer via APMIP Portal",
      },
      {
        title: "Technical Feasibility Cleared",
        date: "30 Sep 2026, 11:30 AM",
        actor: "APMIP Field Engineer",
      },
      {
        title: "Subsidy Approved & Sanctioned",
        date: "02 Oct 2026, 04:15 PM",
        actor: "Project Director, APMIP",
      },
      {
        title: "Equipment Installed & Disbursed",
        date: "05 Oct 2026, 01:20 PM",
        actor: "Authorized Vendor (Jain Irrigation)",
      },
    ],
  },
  {
    id: "APP-2026-8805",
    farmerName: "P. Srinivasa Reddy",
    farmerAadhaarLast4: "5512",
    farmerMobile: "9701234567",
    farmerLandholding: "5.0 Acres",
    district: "Kurnool",
    mandal: "Nandyal",
    village: "Chowluru",
    schemeId: "SCH-005",
    schemeName: "Custom Hiring Center Farm Mechanization Scheme",
    submittedDate: "06 Oct 2026",
    status: "pending",
    benefitAmount: "₹1,25,000",
    documentsSubmitted: [
      { name: "Land Title Deeds", verified: true },
      { name: "Dealer Proforma Invoice", verified: true },
      { name: "Bank Sanction Letter", verified: false },
    ],
    verificationNotes: "Awaiting co-financing approval from primary agricultural society.",
    timeline: [
      {
        title: "Application Submitted",
        date: "06 Oct 2026, 04:45 PM",
        actor: "Farmer Self-Service",
      },
    ],
  },
  {
    id: "APP-2026-8806",
    farmerName: "K. Sambasiva Rao",
    farmerAadhaarLast4: "9041",
    farmerMobile: "9849556677",
    farmerLandholding: "1.8 Acres",
    district: "West Godavari",
    mandal: "Bhimavaram",
    village: "Rayalam",
    schemeId: "SCH-001",
    schemeName: "Rythu Bharosa Investment Support",
    submittedDate: "29 Sep 2026",
    status: "rejected",
    benefitAmount: "₹13,500",
    documentsSubmitted: [
      { name: "Pattadar Passbook", verified: false },
      { name: "Aadhaar Card", verified: true },
      { name: "Bank Passbook", verified: true },
    ],
    rejectionReason:
      "Mismatch between submitted Passbook survey numbers (Sy. No. 142/3) and digitized Webland revenue records. Land registered under institutional ownership.",
    timeline: [
      {
        title: "Application Submitted",
        date: "29 Sep 2026, 09:30 AM",
        actor: "RBK Bhimavaram",
      },
      {
        title: "Revenue Database Query Failed",
        date: "01 Oct 2026, 12:10 PM",
        actor: "Webland Validation Engine",
      },
      {
        title: "Application Rejected",
        date: "02 Oct 2026, 03:00 PM",
        actor: "Tahsildar / Mandal Revenue Officer",
      },
    ],
  },
  {
    id: "APP-2026-8807",
    farmerName: "S. Raghavaiah",
    farmerAadhaarLast4: "3389",
    farmerMobile: "9177889900",
    farmerLandholding: "2.1 Acres",
    district: "Nellore",
    mandal: "Kovur",
    village: "Padugupadu",
    schemeId: "SCH-003",
    schemeName: "YSR Comprehensive Free Crop Insurance",
    submittedDate: "04 Oct 2026",
    status: "under_verification",
    benefitAmount: "₹24,000",
    documentsSubmitted: [
      { name: "e-Crop Receipt", verified: true },
      { name: "Aadhaar Card", verified: true },
      { name: "Survey Record", verified: false },
    ],
    clarificationRequirements:
      "Provide updated CCRC tenant lease endorsement signed by Village Revenue Officer.",
    timeline: [
      {
        title: "Application Submitted",
        date: "04 Oct 2026, 01:10 PM",
        actor: "VAA Padugupadu",
      },
      {
        title: "Clarification Requested",
        date: "05 Oct 2026, 10:45 AM",
        actor: "Mandal Agricultural Officer",
      },
    ],
  },
  {
    id: "APP-2026-8808",
    farmerName: "T. Ramanamma",
    farmerAadhaarLast4: "7722",
    farmerMobile: "9441223344",
    farmerLandholding: "2.8 Acres",
    district: "Guntur",
    mandal: "Amaravati",
    village: "Dharanikota",
    schemeId: "SCH-004",
    schemeName: "Subsidized Micro-Irrigation & Drip Kit Subsidy",
    submittedDate: "02 Oct 2026",
    status: "approved",
    benefitAmount: "₹38,000 (Subsidy)",
    documentsSubmitted: [
      { name: "Pattadar Passbook", verified: true },
      { name: "Power Connection Bill", verified: true },
      { name: "Soil Health Card", verified: true },
    ],
    verificationNotes: "Approved by District Sanctioning Committee. Awaiting manufacturer dispatch slot.",
    timeline: [
      {
        title: "Application Submitted",
        date: "02 Oct 2026, 11:00 AM",
        actor: "Farmer Portal",
      },
      {
        title: "Field Visit Completed",
        date: "04 Oct 2026, 02:15 PM",
        actor: "Horticulture Officer, Amaravati",
      },
      {
        title: "Administrative Sanction Issued",
        date: "06 Oct 2026, 10:00 AM",
        actor: "District Collector / Chairman APMIP",
      },
    ],
  },
];

export type GovtVerificationStatus =
  | "not_started"
  | "draft"
  | "submitted"
  | "under_review"
  | "clarification_required"
  | "rejected"
  | "verified";

export type GovtOrganizationType =
  | "Government Department"
  | "Government Agency"
  | "Local Government Body"
  | "NGO"
  | "Agricultural Development Organization";

export type GovtDepartmentRole =
  | "Agriculture Officer"
  | "District Agriculture Officer"
  | "Mandal Agriculture Officer"
  | "Government Program Coordinator"
  | "NGO Program Manager"
  | "Field Coordinator"
  | "Other";

export type GovtDocumentStatus =
  | "not_submitted"
  | "submitted"
  | "under_review"
  | "verified"
  | "rejected"
  | "clarification_required";

export interface GovtCredentialDoc {
  id: string;
  name: string;
  fileName?: string;
  fileType?: string;
  fileSize?: string;
  status: GovtDocumentStatus;
  uploadedAt?: string;
}

export interface GovtOnboardingData {
  organizationType: GovtOrganizationType;
  organizationName: string;
  departmentMinistry: string;
  state: string;
  district: string;
  mandal: string;
  officeAddress: string;
  officialWebsite?: string;
  registrationRefNumber: string;

  fullName: string;
  designation: string;
  customDesignation?: string;
  employeeOfficerId: string;
  officialEmail: string;
  officialPhone: string;
  officeLocation: string;
  yearsOfService: string;
  departmentRole: GovtDepartmentRole;

  documents: {
    govtId: GovtCredentialDoc;
    appointmentLetter: GovtCredentialDoc;
    orgRegistrationProof: GovtCredentialDoc;
    ngoCertificate?: GovtCredentialDoc;
  };

  verificationStatus: GovtVerificationStatus;
  referenceNumber?: string;
  submissionDate?: string;
  verifiedDate?: string;
  rejectedDate?: string;
  rejectionReason?: string;
  reviewerNote?: string;
  clarificationReason?: string;
  currentStep: number;
}

export const INITIAL_GOVT_ONBOARDING: GovtOnboardingData = {
  organizationType: "Government Department",
  organizationName: "Department of Agriculture & Farmers Welfare",
  departmentMinistry: "Ministry of Agriculture, Govt. of Andhra Pradesh",
  state: "Andhra Pradesh",
  district: "Guntur",
  mandal: "Guntur Urban",
  officeAddress: "Collectorate Complex, Nagarampalem, Guntur - 522004",
  officialWebsite: "https://apagrisnet.gov.in",
  registrationRefNumber: "AP-AGRI-DEPT-2024/9182",

  fullName: "Dr. K. V. Ramanjaneyulu",
  designation: "District Agriculture Officer (DAO)",
  customDesignation: "",
  employeeOfficerId: "AP-GOV-AGRI-8472",
  officialEmail: "dao.guntur@ap.gov.in",
  officialPhone: "+91 94401 28472",
  officeLocation: "District Headquarters, Guntur",
  yearsOfService: "14",
  departmentRole: "District Agriculture Officer",

  documents: {
    govtId: {
      id: "doc-1",
      name: "Government / Organization ID",
      fileName: "AP_Officer_ID_Card.pdf",
      fileType: "application/pdf",
      fileSize: "1.4 MB",
      status: "submitted",
      uploadedAt: "08 Oct 2026",
    },
    appointmentLetter: {
      id: "doc-2",
      name: "Official Appointment / Authorization Letter",
      fileName: "Gazetted_Appointment_Order_2020.pdf",
      fileType: "application/pdf",
      fileSize: "2.1 MB",
      status: "submitted",
      uploadedAt: "08 Oct 2026",
    },
    orgRegistrationProof: {
      id: "doc-3",
      name: "Department / Organization Registration Proof",
      fileName: "Departmental_Gazette_Notification.pdf",
      fileType: "application/pdf",
      fileSize: "3.2 MB",
      status: "submitted",
      uploadedAt: "08 Oct 2026",
    },
    ngoCertificate: {
      id: "doc-4",
      name: "NGO Registration Certificate",
      fileName: "",
      fileType: "",
      fileSize: "",
      status: "not_submitted",
    },
  },

  verificationStatus: "under_review",
  referenceNumber: "GOV-VER-2026-8419",
  submissionDate: "08 Oct 2026",
  verifiedDate: undefined,
  rejectedDate: undefined,
  rejectionReason: undefined,
  reviewerNote: undefined,
  clarificationReason: undefined,
  currentStep: 4,
};

interface GovtState {
  schemes: GovtSchemeItem[];
  applications: GovtApplicationItem[];
  onboardingData: GovtOnboardingData;
  addScheme: (scheme: Omit<GovtSchemeItem, "id" | "applicationsCount" | "lastUpdated">) => void;
  updateScheme: (id: string, updates: Partial<GovtSchemeItem>) => void;
  toggleSchemeStatus: (id: string) => void;
  approveApplication: (appId: string) => void;
  rejectApplication: (appId: string, reason: string) => void;
  requestClarification: (appId: string, requirements: string) => void;
  markForVerification: (appId: string) => void;
  updateOnboardingData: (updates: Partial<GovtOnboardingData>) => void;
  updateOnboardingDocument: (
    docKey: keyof GovtOnboardingData["documents"],
    updates: Partial<GovtCredentialDoc>
  ) => void;
  submitOnboardingForVerification: () => void;
  setVerificationStatus: (
    status: GovtVerificationStatus,
    extra?: {
      rejectionReason?: string;
      reviewerNote?: string;
      clarificationReason?: string;
      verifiedDate?: string;
    }
  ) => void;
  resetOnboarding: () => void;
}

export const useGovernmentStore = create<GovtState>()(
  persist(
    (set) => ({
      schemes: INITIAL_GOVT_SCHEMES,
      applications: INITIAL_GOVT_APPLICATIONS,
      onboardingData: INITIAL_GOVT_ONBOARDING,

      addScheme: (data) =>
        set((state) => {
          const newScheme: GovtSchemeItem = {
            ...data,
            id: `SCH-${String(state.schemes.length + 1).padStart(3, "0")}`,
            applicationsCount: 0,
            lastUpdated: new Date().toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            }),
          };
          return { schemes: [newScheme, ...state.schemes] };
        }),

      updateScheme: (id, updates) =>
        set((state) => ({
          schemes: state.schemes.map((s) =>
            s.id === id
              ? {
                  ...s,
                  ...updates,
                  lastUpdated: new Date().toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  }),
                }
              : s
          ),
        })),

      toggleSchemeStatus: (id) =>
        set((state) => ({
          schemes: state.schemes.map((s) => {
            if (s.id !== id) return s;
            const newStatus: GovtSchemeStatus =
              s.status === "active" ? "closed" : "active";
            return {
              ...s,
              status: newStatus,
              lastUpdated: new Date().toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              }),
            };
          }),
        })),

      approveApplication: (appId) =>
        set((state) => ({
          applications: state.applications.map((app) => {
            if (app.id !== appId) return app;
            return {
              ...app,
              status: "approved" as GovtApplicationStatus,
              verificationNotes: "Approved by Government / NGO Verification Officer.",
              timeline: [
                ...app.timeline,
                {
                  title: "Application Approved",
                  date: new Date().toLocaleString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  }),
                  actor: "Government / NGO Representative",
                  note: "All mandatory credentials verified and found in order.",
                },
              ],
            };
          }),
        })),

      rejectApplication: (appId, reason) =>
        set((state) => ({
          applications: state.applications.map((app) => {
            if (app.id !== appId) return app;
            return {
              ...app,
              status: "rejected" as GovtApplicationStatus,
              rejectionReason: reason,
              timeline: [
                ...app.timeline,
                {
                  title: "Application Rejected",
                  date: new Date().toLocaleString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  }),
                  actor: "Government / NGO Representative",
                  note: reason,
                },
              ],
            };
          }),
        })),

      requestClarification: (appId, requirements) =>
        set((state) => ({
          applications: state.applications.map((app) => {
            if (app.id !== appId) return app;
            return {
              ...app,
              status: "under_verification" as GovtApplicationStatus,
              clarificationRequirements: requirements,
              timeline: [
                ...app.timeline,
                {
                  title: "Clarification Requested",
                  date: new Date().toLocaleString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  }),
                  actor: "Government / NGO Representative",
                  note: requirements,
                },
              ],
            };
          }),
        })),

      markForVerification: (appId) =>
        set((state) => ({
          applications: state.applications.map((app) => {
            if (app.id !== appId) return app;
            return {
              ...app,
              status: "under_verification" as GovtApplicationStatus,
              timeline: [
                ...app.timeline,
                {
                  title: "Marked Under Active Field Verification",
                  date: new Date().toLocaleString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  }),
                  actor: "Government / NGO Representative",
                },
              ],
            };
          }),
        })),

      updateOnboardingData: (updates) =>
        set((state) => ({
          onboardingData: {
            ...state.onboardingData,
            ...updates,
          },
        })),

      updateOnboardingDocument: (docKey, updates) =>
        set((state) => ({
          onboardingData: {
            ...state.onboardingData,
            documents: {
              ...state.onboardingData.documents,
              [docKey]: {
                ...state.onboardingData.documents[docKey],
                ...updates,
              },
            },
          },
        })),

      submitOnboardingForVerification: () =>
        set((state) => {
          const randNum = Math.floor(1000 + Math.random() * 9000);
          const refNumber = `GOV-VER-2026-${randNum}`;
          const today = new Date().toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          });

          return {
            onboardingData: {
              ...state.onboardingData,
              verificationStatus: "under_review",
              referenceNumber: refNumber,
              submissionDate: today,
              rejectionReason: undefined,
              reviewerNote: undefined,
              clarificationReason: undefined,
            },
          };
        }),

      setVerificationStatus: (status, extra) =>
        set((state) => {
          const today = new Date().toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          });

          return {
            onboardingData: {
              ...state.onboardingData,
              verificationStatus: status,
              rejectionReason: extra?.rejectionReason ?? state.onboardingData.rejectionReason,
              reviewerNote: extra?.reviewerNote ?? state.onboardingData.reviewerNote,
              clarificationReason: extra?.clarificationReason ?? state.onboardingData.clarificationReason,
              verifiedDate: status === "verified" ? (extra?.verifiedDate || today) : state.onboardingData.verifiedDate,
              rejectedDate: status === "rejected" ? today : state.onboardingData.rejectedDate,
            },
          };
        }),

      resetOnboarding: () =>
        set(() => ({
          onboardingData: {
            ...INITIAL_GOVT_ONBOARDING,
            verificationStatus: "draft",
            referenceNumber: undefined,
            submissionDate: undefined,
            currentStep: 1,
          },
        })),
    }),
    {
      name: "raitusevak-government-store",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
