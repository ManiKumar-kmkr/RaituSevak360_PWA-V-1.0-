import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import {
  NgoOrganizationItem,
  NgoType,
  NgoVerificationStatus,
} from "@/types/ngo";

export const INITIAL_DEMO_NGOS: NgoOrganizationItem[] = [
  {
    id: "NGO-AP-2026-001",
    name: "Krishi Vikas Rural Development Foundation",
    organizationType: "Rural Development Organization",
    registrationRef: "DARPAN-AP-2018-04812",
    registrationAuthority: "Registrar of Societies & NITI Aayog DARPAN",
    state: "Andhra Pradesh",
    district: "Krishna",
    mandal: "Machilipatnam",
    officeAddress: "Plot 14, Rythu Mitra Bhavan, Near Old Bus Stand, Machilipatnam - 521001",
    officialWebsite: "https://krishivikasngo.org",
    representativeName: "Smt. P. Annapurna Devi (Demo)",
    representativeRole: "Program Director",
    officialEmail: "director.demo@krishivikasngo.org",
    officialPhone: "+91 98480 34109",
    status: "verified",
    submissionDate: "2026-09-15",
    lastUpdated: "2026-10-04",
    verifiedDate: "2026-10-04",
    reviewerNotes: "Statutory societies registration and NITI Aayog DARPAN credentials verified against state database.",
    focusAreas: ["Farmer Producer Organizations", "Water Conservation", "Organic Seed Supply"],
    documents: [
      {
        id: "doc-1",
        name: "NGO Registration Certificate",
        documentType: "Societies Registration Act XXI of 1860",
        fileName: "Krishi_Vikas_Societies_Cert.pdf",
        fileSize: "2.4 MB",
        referenceId: "SOC-AP-2018-884",
        status: "verified",
        note: "Verified against State Registrar of Societies ledger.",
      },
      {
        id: "doc-2",
        name: "Organization Identity / Statutory Charter",
        documentType: "NITI Aayog DARPAN Unique Identification",
        fileName: "DARPAN_Unique_ID_Cert.pdf",
        fileSize: "1.5 MB",
        referenceId: "DARPAN-AP-2018-04812",
        status: "verified",
        note: "DARPAN active registration status confirmed.",
      },
      {
        id: "doc-3",
        name: "Official Representative Authorization",
        documentType: "Governing Board Resolution & Executive Mandate",
        fileName: "Board_Resolution_Authorizing_Rep.pdf",
        fileSize: "1.8 MB",
        referenceId: "RES-KVRDF-2026-02",
        status: "verified",
        note: "Board quorum and executive secretary signatures validated.",
      },
    ],
    timeline: [
      {
        title: "Registration Application Submitted",
        date: "2026-09-15 10:15 AM",
        actor: "Smt. P. Annapurna Devi (Applicant)",
        note: "Initial registration dossier submitted with statutory charter.",
      },
      {
        title: "Audit Review Initiated",
        date: "2026-09-20 02:30 PM",
        actor: "Secretariat Review Desk",
        note: "Assigned to Senior Verification Officer.",
      },
      {
        title: "Organization Verified",
        date: "2026-10-04 11:45 AM",
        actor: "District Agriculture Officer (Reviewing Authority)",
        note: "Statutory societies registration and NITI Aayog DARPAN credentials verified against state database.",
      },
    ],
  },
  {
    id: "NGO-AP-2026-002",
    name: "Haritha Rythu Welfare Samithi",
    organizationType: "Farmer Welfare Organization",
    registrationRef: "SOC-REG-2020-9182",
    registrationAuthority: "Registrar of Co-operative Societies, AP",
    state: "Andhra Pradesh",
    district: "Guntur",
    mandal: "Tenali",
    officeAddress: "D.No 4-12-8, Market Road, Near Rythu Bazaar, Tenali - 522201",
    officialWebsite: "https://haritharythu.org",
    representativeName: "Sri K. Sambasiva Rao (Demo)",
    representativeRole: "General Secretary",
    officialEmail: "contact.demo@haritharythu.org",
    officialPhone: "+91 94401 58219",
    status: "under_review",
    submissionDate: "2026-10-01",
    lastUpdated: "2026-10-07",
    focusAreas: ["Integrated Pest Management", "Smallholder Credit", "Farm Mechanization Pools"],
    documents: [
      {
        id: "doc-1",
        name: "NGO Registration Certificate",
        documentType: "Cooperative Societies Act Charter",
        fileName: "Haritha_Rythu_Coop_Cert.pdf",
        fileSize: "3.1 MB",
        referenceId: "COOP-GNT-2020-9182",
        status: "verified",
      },
      {
        id: "doc-2",
        name: "Organization Identity / Statutory Charter",
        documentType: "PAN & Statutory Registration Endorsement",
        fileName: "Haritha_Statutory_Charter.pdf",
        fileSize: "1.9 MB",
        referenceId: "CHARTER-2020-HRWS",
        status: "submitted",
      },
      {
        id: "doc-3",
        name: "Official Representative Authorization",
        documentType: "Annual General Body Resolution",
        fileName: "AGM_Authorization_Rao.pdf",
        fileSize: "1.4 MB",
        referenceId: "AGM-RES-2026-09",
        status: "submitted",
      },
    ],
    timeline: [
      {
        title: "Registration Application Submitted",
        date: "2026-10-01 11:30 AM",
        actor: "Sri K. Sambasiva Rao (Applicant)",
        note: "Submitted documentation for welfare partner accreditation.",
      },
      {
        title: "Marked Under Review",
        date: "2026-10-07 03:20 PM",
        actor: "Reviewing Officer",
        note: "Field coordination and governance credentials under active audit.",
      },
    ],
  },
  {
    id: "NGO-AP-2026-003",
    name: "Rayalaseema Dryland Agriculture Network",
    organizationType: "Agricultural NGO",
    registrationRef: "DARPAN-AP-2019-07314",
    registrationAuthority: "NITI Aayog DARPAN & Charitable Trusts Registry",
    state: "Andhra Pradesh",
    district: "Kurnool",
    mandal: "Adoni",
    officeAddress: "Plot 8B, Industrial Estate Road, Adoni - 518301",
    officialWebsite: "https://rdan-agriculture.org",
    representativeName: "Dr. M. Venugopal Reddy (Demo)",
    representativeRole: "Chief Executive Trustee",
    officialEmail: "ceo.demo@rdan-agriculture.org",
    officialPhone: "+91 98492 11048",
    status: "clarification_required",
    submissionDate: "2026-09-28",
    lastUpdated: "2026-10-06",
    clarificationReason:
      "Please provide the certified audit statement for FY 2025-26 and the updated Governing Council resolution with valid notary seal.",
    focusAreas: ["Millets Cultivation", "Micro-Irrigation Adoption", "Drought Resilience"],
    documents: [
      {
        id: "doc-1",
        name: "NGO Registration Certificate",
        documentType: "Public Charitable Trust Deed",
        fileName: "RDAN_Trust_Deed_Registered.pdf",
        fileSize: "4.2 MB",
        referenceId: "TRUST-KNL-2019-338",
        status: "verified",
      },
      {
        id: "doc-2",
        name: "Organization Identity / Statutory Charter",
        documentType: "DARPAN NITI Aayog Registration",
        fileName: "RDAN_DARPAN_Unique_Cert.pdf",
        fileSize: "1.2 MB",
        referenceId: "DARPAN-AP-2019-07314",
        status: "verified",
      },
      {
        id: "doc-3",
        name: "Official Representative Authorization",
        documentType: "Board Resolution & Audit Annexure",
        fileName: "Trustee_Resolution_2026.pdf",
        fileSize: "2.1 MB",
        referenceId: "RES-RDAN-2026-04",
        status: "clarification_required",
        note: "Missing executive seal and certified audit statement.",
      },
    ],
    timeline: [
      {
        title: "Registration Application Submitted",
        date: "2026-09-28 09:45 AM",
        actor: "Dr. M. Venugopal Reddy (Applicant)",
      },
      {
        title: "Marked Under Review",
        date: "2026-10-02 02:00 PM",
        actor: "NGO Accreditation Desk",
      },
      {
        title: "Clarification Requested",
        date: "2026-10-06 04:30 PM",
        actor: "Senior Verification Officer",
        note: "Please provide the certified audit statement for FY 2025-26 and the updated Governing Council resolution with valid notary seal.",
      },
    ],
  },
  {
    id: "NGO-AP-2026-004",
    name: "Coastal Agri-Tech Outreach Trust",
    organizationType: "Agricultural Development Organization",
    registrationRef: "TRUST-PKM-2021-0551",
    registrationAuthority: "Sub-Registrar Office, Ongole",
    state: "Andhra Pradesh",
    district: "Prakasam",
    mandal: "Ongole",
    officeAddress: "Bypass Road, Santhapet, Ongole - 523001",
    officialWebsite: "https://coastalagritech.org",
    representativeName: "Sri T. Janardhan Rao (Demo)",
    representativeRole: "Managing Trustee",
    officialEmail: "trustee.demo@coastalagritech.org",
    officialPhone: "+91 94408 72314",
    status: "rejected",
    submissionDate: "2026-09-10",
    lastUpdated: "2026-09-25",
    rejectedDate: "2026-09-25",
    rejectionReason:
      "Statutory trust registration lapsed on 31 March 2026 without renewal documentation; representative authorization does not meet mandatory state criteria.",
    focusAreas: ["Soil Salinity Management", "Coastal Paddy Varieties", "Aquaponics"],
    documents: [
      {
        id: "doc-1",
        name: "NGO Registration Certificate",
        documentType: "Trust Deed",
        fileName: "Lapsed_Trust_Deed.pdf",
        fileSize: "2.8 MB",
        referenceId: "TRUST-PKM-2021-0551",
        status: "rejected",
        note: "Registration expired and renewal pending.",
      },
      {
        id: "doc-2",
        name: "Organization Identity / Statutory Charter",
        documentType: "Statutory Certificate",
        fileName: "Statutory_Charter_PKM.pdf",
        fileSize: "1.6 MB",
        referenceId: "CHARTER-2021-CAT",
        status: "rejected",
      },
      {
        id: "doc-3",
        name: "Official Representative Authorization",
        documentType: "Trustee Authorization Letter",
        fileName: "Trustee_Letter_Uncertified.pdf",
        fileSize: "1.1 MB",
        referenceId: "LTR-CAT-2026-01",
        status: "rejected",
      },
    ],
    timeline: [
      {
        title: "Registration Application Submitted",
        date: "2026-09-10 10:00 AM",
        actor: "Sri T. Janardhan Rao (Applicant)",
      },
      {
        title: "Marked Under Review",
        date: "2026-09-15 11:30 AM",
        actor: "Reviewing Officer",
      },
      {
        title: "Registration Rejected",
        date: "2026-09-25 03:15 PM",
        actor: "District Agriculture Officer (Reviewing Authority)",
        note: "Statutory trust registration lapsed on 31 March 2026 without renewal documentation; representative authorization does not meet mandatory state criteria.",
      },
    ],
  },
  {
    id: "NGO-AP-2026-005",
    name: "Andhra Organic Farmers Consortium",
    organizationType: "Farmer Welfare Organization",
    registrationRef: "DARPAN-AP-2022-09411",
    registrationAuthority: "NITI Aayog DARPAN & Societies Registration Department",
    state: "Andhra Pradesh",
    district: "West Godavari",
    mandal: "Bhimavaram",
    officeAddress: "Somavaram Village, Near Canal Bund, Bhimavaram - 534202",
    officialWebsite: "https://andhraorganic.org",
    representativeName: "Smt. G. Sarada (Demo)",
    representativeRole: "Executive Coordinator",
    officialEmail: "coordinator.demo@andhraorganic.org",
    officialPhone: "+91 98485 99411",
    status: "submitted",
    submissionDate: "2026-10-08",
    lastUpdated: "2026-10-08",
    focusAreas: ["ZBNF / Natural Farming", "Desi Seed Preservation", "Direct-to-Consumer Produce"],
    documents: [
      {
        id: "doc-1",
        name: "NGO Registration Certificate",
        documentType: "Societies Registration Act Certificate",
        fileName: "AOFC_Societies_Certificate.pdf",
        fileSize: "2.7 MB",
        referenceId: "SOC-WG-2022-9411",
        status: "submitted",
      },
      {
        id: "doc-2",
        name: "Organization Identity / Statutory Charter",
        documentType: "DARPAN NITI Aayog Portal Registration",
        fileName: "DARPAN_Certificate_AOFC.pdf",
        fileSize: "1.4 MB",
        referenceId: "DARPAN-AP-2022-09411",
        status: "submitted",
      },
      {
        id: "doc-3",
        name: "Official Representative Authorization",
        documentType: "Executive Committee Authorization",
        fileName: "Executive_Resolution_Sarada.pdf",
        fileSize: "1.9 MB",
        referenceId: "RES-AOFC-2026-11",
        status: "submitted",
      },
    ],
    timeline: [
      {
        title: "Registration Application Submitted",
        date: "2026-10-08 09:15 AM",
        actor: "Smt. G. Sarada (Applicant)",
        note: "New registration application submitted with complete credential package.",
      },
    ],
  },
  {
    id: "NGO-AP-2026-006",
    name: "Godavari Gramina Vikas Kendra",
    organizationType: "Agricultural Development Organization",
    registrationRef: "DARPAN-AP-2023-11840",
    registrationAuthority: "NITI Aayog DARPAN & Societies Registration",
    state: "Andhra Pradesh",
    district: "West Godavari",
    mandal: "Eluru Rural",
    officeAddress: "NH-16 By-Pass, Sanivarapupeta, Eluru - 534003",
    officialWebsite: "https://godavarigramina.org",
    representativeName: "Sri D. Satyanarayana (Demo)",
    representativeRole: "Managing Director",
    officialEmail: "satya.demo@godavarigramina.org",
    officialPhone: "+91 94402 11840",
    status: "draft",
    submissionDate: "2026-10-09",
    lastUpdated: "2026-10-09",
    focusAreas: ["Horticulture Support", "Soil Testing Camps", "Micro-Enterprise Incubation"],
    documents: [
      {
        id: "doc-1",
        name: "NGO Registration Certificate",
        documentType: "Societies Registration Certificate",
        fileName: "Draft_Societies_Cert.pdf",
        fileSize: "1.8 MB",
        referenceId: "DRAFT-DOC-001",
        status: "submitted",
      },
      {
        id: "doc-2",
        name: "Organization Identity / Statutory Charter",
        documentType: "Statutory Bylaws & MoA",
        fileName: "Bylaws_Memorandum.pdf",
        fileSize: "3.5 MB",
        referenceId: "DRAFT-DOC-002",
        status: "submitted",
      },
      {
        id: "doc-3",
        name: "Official Representative Authorization",
        documentType: "Representative Identification",
        fileName: "Rep_ID_Card.pdf",
        fileSize: "1.2 MB",
        referenceId: "DRAFT-DOC-003",
        status: "submitted",
      },
    ],
    timeline: [
      {
        title: "Registration Draft Created",
        date: "2026-10-09 02:40 PM",
        actor: "Sri D. Satyanarayana (Applicant)",
        note: "Draft application created; awaiting final statutory seals before submission.",
      },
    ],
  },
];

interface NgoStoreState {
  organizations: NgoOrganizationItem[];
  markUnderReview: (id: string, note?: string, actor?: string) => void;
  requestClarification: (id: string, reason: string, actor?: string) => void;
  verifyOrganization: (id: string, note?: string, actor?: string) => void;
  rejectOrganization: (id: string, reason: string, actor?: string) => void;
  resetOrganizations: () => void;
}

export const useNgoStore = create<NgoStoreState>()(
  persist(
    (set) => ({
      organizations: INITIAL_DEMO_NGOS,

      markUnderReview: (id, note, actor = "Reviewing Officer") => {
        const now = new Date();
        const timestamp =
          now.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          }) +
          " " +
          now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });

        set((state) => ({
          organizations: state.organizations.map((org) => {
            if (org.id !== id) return org;
            return {
              ...org,
              status: "under_review",
              lastUpdated: now.toISOString().split("T")[0],
              reviewerNotes: note || "Registration application marked under review by secretariat auditor.",
              timeline: [
                ...org.timeline,
                {
                  title: "Marked Under Review",
                  date: timestamp,
                  actor,
                  note: note || "Registration application marked under review.",
                },
              ],
            };
          }),
        }));
      },

      requestClarification: (id, reason, actor = "Reviewing Officer") => {
        const now = new Date();
        const timestamp =
          now.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          }) +
          " " +
          now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });

        set((state) => ({
          organizations: state.organizations.map((org) => {
            if (org.id !== id) return org;
            return {
              ...org,
              status: "clarification_required",
              clarificationReason: reason,
              lastUpdated: now.toISOString().split("T")[0],
              timeline: [
                ...org.timeline,
                {
                  title: "Clarification Requested",
                  date: timestamp,
                  actor,
                  note: reason,
                },
              ],
            };
          }),
        }));
      },

      verifyOrganization: (id, note, actor = "Reviewing Officer") => {
        const now = new Date();
        const timestamp =
          now.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          }) +
          " " +
          now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });

        set((state) => ({
          organizations: state.organizations.map((org) => {
            if (org.id !== id) return org;
            return {
              ...org,
              status: "verified",
              verifiedDate: now.toISOString().split("T")[0],
              reviewerNotes: note || "Organization credentials, statutory charter, and representative authorization verified.",
              clarificationReason: undefined,
              rejectionReason: undefined,
              lastUpdated: now.toISOString().split("T")[0],
              documents: org.documents.map((d) => ({ ...d, status: "verified" as const })),
              timeline: [
                ...org.timeline,
                {
                  title: "Organization Verified",
                  date: timestamp,
                  actor,
                  note: note || "Organization verified and approved in local demonstration registry.",
                },
              ],
            };
          }),
        }));
      },

      rejectOrganization: (id, reason, actor = "Reviewing Officer") => {
        const now = new Date();
        const timestamp =
          now.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          }) +
          " " +
          now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });

        set((state) => ({
          organizations: state.organizations.map((org) => {
            if (org.id !== id) return org;
            return {
              ...org,
              status: "rejected",
              rejectedDate: now.toISOString().split("T")[0],
              rejectionReason: reason,
              lastUpdated: now.toISOString().split("T")[0],
              documents: org.documents.map((d) => ({ ...d, status: "rejected" as const })),
              timeline: [
                ...org.timeline,
                {
                  title: "Registration Rejected",
                  date: timestamp,
                  actor,
                  note: reason,
                },
              ],
            };
          }),
        }));
      },

      resetOrganizations: () => set({ organizations: INITIAL_DEMO_NGOS }),
    }),
    {
      name: "raitusevak-govt-ngos-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
