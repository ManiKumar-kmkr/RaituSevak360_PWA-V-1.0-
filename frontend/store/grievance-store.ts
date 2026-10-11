import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import {
  GrievanceTicket,
  GrievanceStatus,
  GrievancePriority,
} from "@/types/grievance";

export const DEMO_OFFICERS_LIST = [
  "Dr. K. S. Rao (ADO - Agricultural Development Officer)",
  "Smt. L. Bhavani (AEO - Agricultural Extension Officer)",
  "Sri C. H. Naidu (District Agronomist)",
  "Sri V. Ramana (Horticulture Officer)",
  "Dr. P. Radhakrishna (Agronomy Specialist)",
];

export const INITIAL_DEMO_GRIEVANCES: GrievanceTicket[] = [
  {
    id: "GRV-2026-101",
    farmerName: "K. Nageswara Rao (FAR-8192)",
    farmerMobile: "+91 98XXX-XX120",
    category: "Irrigation / Water Supply",
    district: "Guntur",
    mandal: "Tenali",
    village: "Angalakuduru",
    dateReported: "2026-10-08",
    priority: "Critical",
    status: "Awaiting Field Assignment",
    description:
      "Breach reported in the D2 minor canal distributary bund; standing water is overflowing into 45 acres of newly transplanted paddy fields.",
    timeline: [
      {
        title: "Grievance Ticket Lodged",
        date: "2026-10-08 08:30 AM",
        actor: "Rythu Bharosa Kendra (RBK Helpdesk)",
        note: "Lodged via Village Secretariate portal.",
      },
      {
        title: "Triage & Escalation",
        date: "2026-10-08 09:15 AM",
        actor: "District Grievance Cell",
        note: "Priority elevated to Critical due to inundation risk over 45 acres.",
      },
    ],
    lastUpdated: "2026-10-08",
    createdAt: "2026-10-08",
  },
  {
    id: "GRV-2026-102",
    farmerName: "P. Venkata Subbaiah (FAR-7410)",
    farmerMobile: "+91 94XXX-XX831",
    category: "Crop Damage",
    district: "Guntur",
    mandal: "Prathipadu",
    village: "Enamadala",
    dateReported: "2026-10-07",
    priority: "High",
    status: "In Progress",
    assignedOfficer: "Dr. K. S. Rao (ADO - Agricultural Development Officer)",
    description:
      "Sudden localized hailstorm accompanied by high gale winds damaged 4 acres of commercial chilli crop during peak flowering stage.",
    timeline: [
      {
        title: "Grievance Ticket Lodged",
        date: "2026-10-07 10:00 AM",
        actor: "Farmer Self-Report (IVR/PWA)",
      },
      {
        title: "Officer Assigned",
        date: "2026-10-07 11:30 AM",
        actor: "District Grievance Cell",
        note: "Assigned to Dr. K. S. Rao for field loss estimation.",
      },
      {
        title: "Field Investigation Commenced",
        date: "2026-10-08 02:00 PM",
        actor: "Dr. K. S. Rao (ADO)",
        note: "Transect walk completed; joint damage assessment report under preparation with insurance representative.",
      },
    ],
    lastUpdated: "2026-10-08",
    createdAt: "2026-10-07",
  },
  {
    id: "GRV-2026-103",
    farmerName: "M. Anuradha (FAR-3105)",
    farmerMobile: "+91 99XXX-XX442",
    category: "Subsidy / Scheme",
    district: "Krishna",
    mandal: "Gudivada",
    village: "Pedaparupudi",
    dateReported: "2026-10-06",
    priority: "Normal",
    status: "Awaiting Farmer Information",
    assignedOfficer: "Smt. L. Bhavani (AEO - Agricultural Extension Officer)",
    description:
      "Rythu Bharosa investment support 2nd installment of ₹4,000 has not been credited. Bank shows NPCI mandate mapping inactive.",
    infoRequestReason:
      "Farmer requested to submit copy of bank passbook with NPCI Aadhaar seeding stamp or updated bank consent form.",
    timeline: [
      {
        title: "Ticket Lodged",
        date: "2026-10-06 11:00 AM",
        actor: "Village Agricultural Assistant",
      },
      {
        title: "Officer Assigned",
        date: "2026-10-06 01:00 PM",
        actor: "District Grievance Cell",
        note: "Assigned to Smt. L. Bhavani (AEO).",
      },
      {
        title: "Farmer Information Requested",
        date: "2026-10-07 09:45 AM",
        actor: "Smt. L. Bhavani (AEO)",
        note: "Requested NPCI bank seeding stamp acknowledgement.",
      },
    ],
    lastUpdated: "2026-10-07",
    createdAt: "2026-10-06",
  },
  {
    id: "GRV-2026-104",
    farmerName: "V. Thimmanna (FAR-1901)",
    farmerMobile: "+91 97XXX-XX519",
    category: "Pest or Disease",
    district: "Anantapur",
    mandal: "Kalyandurg",
    village: "Chapadurthi",
    dateReported: "2026-10-09",
    priority: "High",
    status: "Open",
    description:
      "Widespread pod borer and tikka leaf spot noticed in rainfed groundnut field; rapid spreading to neighboring plots.",
    timeline: [
      {
        title: "Grievance Ticket Lodged",
        date: "2026-10-09 09:10 AM",
        actor: "Farmer Self-Report (PWA)",
        note: "Pending review and officer dispatch.",
      },
    ],
    lastUpdated: "2026-10-09",
    createdAt: "2026-10-09",
  },
  {
    id: "GRV-2026-105",
    farmerName: "B. Sambaiah (FAR-5520)",
    farmerMobile: "+91 91XXX-XX902",
    category: "Land Record Issue",
    district: "Kurnool",
    mandal: "Yemmiganur",
    village: "Banavasi",
    dateReported: "2026-10-04",
    priority: "Normal",
    status: "Assigned",
    assignedOfficer: "Sri C. H. Naidu (District Agronomist)",
    description:
      "Survey sub-division number 142/2A shows discrepancy of 0.65 acres between physical passbook and Webland 1B online portal, hindering credit access.",
    timeline: [
      {
        title: "Ticket Lodged",
        date: "2026-10-04 10:15 AM",
        actor: "Revenue Helpdesk / MeeSeva",
      },
      {
        title: "Officer Assigned",
        date: "2026-10-05 11:00 AM",
        actor: "District Grievance Cell",
        note: "Assigned to Sri C. H. Naidu for coordination with Mandal Revenue Inspector.",
      },
    ],
    lastUpdated: "2026-10-05",
    createdAt: "2026-10-04",
  },
  {
    id: "GRV-2026-106",
    farmerName: "S. Prabhakar (FAR-6201)",
    farmerMobile: "+91 96XXX-XX117",
    category: "Equipment / Labour",
    district: "West Godavari",
    mandal: "Eluru",
    village: "Denduluru",
    dateReported: "2026-10-01",
    priority: "Normal",
    status: "Resolved",
    assignedOfficer: "Sri V. Ramana (Horticulture Officer)",
    description:
      "PMKSY subsidized drip lateral dispatch delayed by local vendor over 3 weeks past sanction order date.",
    resolutionNotes:
      "Horticulture Officer contacted designated empanelled manufacturer. Laterals delivered on 06 Oct 2026; farmer confirmed installation and operational test.",
    timeline: [
      {
        title: "Ticket Lodged",
        date: "2026-10-01 09:30 AM",
        actor: "Farmer Self-Report",
      },
      {
        title: "Officer Assigned",
        date: "2026-10-01 11:00 AM",
        actor: "District Grievance Cell",
        note: "Assigned to Sri V. Ramana (Horticulture Officer).",
      },
      {
        title: "Investigation & Vendor Follow-up",
        date: "2026-10-03 03:00 PM",
        actor: "Sri V. Ramana",
        note: "Vendor issued expedited delivery notice.",
      },
      {
        title: "Ticket Resolved",
        date: "2026-10-06 04:30 PM",
        actor: "Sri V. Ramana",
        note: "Farmer verified delivery of complete 16mm lateral consignment.",
      },
    ],
    lastUpdated: "2026-10-06",
    createdAt: "2026-10-01",
  },
];

interface GrievanceState {
  tickets: GrievanceTicket[];
  assignOfficer: (
    ticketId: string,
    officer: string,
    note?: string,
    actor?: string
  ) => void;
  startInvestigation: (
    ticketId: string,
    note?: string,
    actor?: string
  ) => void;
  requestFarmerInfo: (
    ticketId: string,
    reason: string,
    actor?: string
  ) => void;
  resolveTicket: (
    ticketId: string,
    resolutionSummary: string,
    actor?: string
  ) => void;
  closeTicket: (ticketId: string, note?: string, actor?: string) => void;
  reopenTicket: (ticketId: string, reason: string, actor?: string) => void;
  changePriority: (
    ticketId: string,
    newPriority: GrievancePriority,
    note?: string,
    actor?: string
  ) => void;
  resetGrievances: () => void;
}

export const useGrievanceStore = create<GrievanceState>()(
  persist(
    (set) => ({
      tickets: INITIAL_DEMO_GRIEVANCES,

      assignOfficer: (ticketId, officer, note, actor = "District Grievance Cell") => {
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
          tickets: state.tickets.map((t) => {
            if (t.id !== ticketId) return t;
            return {
              ...t,
              assignedOfficer: officer,
              status: t.status === "Open" || t.status === "Awaiting Field Assignment" ? "Assigned" : t.status,
              lastUpdated: now.toISOString().split("T")[0],
              timeline: [
                ...t.timeline,
                {
                  title: "Officer Assigned",
                  date: timestamp,
                  actor,
                  note: note ? `${officer} — ${note}` : `Assigned to ${officer}`,
                },
              ],
            };
          }),
        }));
      },

      startInvestigation: (ticketId, note, actor = "Assigned Officer") => {
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
          tickets: state.tickets.map((t) => {
            if (t.id !== ticketId) return t;
            return {
              ...t,
              status: "In Progress",
              lastUpdated: now.toISOString().split("T")[0],
              timeline: [
                ...t.timeline,
                {
                  title: "Investigation Started",
                  date: timestamp,
                  actor,
                  note: note || "Field investigation and evidence gathering initiated.",
                },
              ],
            };
          }),
        }));
      },

      requestFarmerInfo: (ticketId, reason, actor = "Assigned Officer") => {
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
          tickets: state.tickets.map((t) => {
            if (t.id !== ticketId) return t;
            return {
              ...t,
              status: "Awaiting Farmer Information",
              infoRequestReason: reason,
              lastUpdated: now.toISOString().split("T")[0],
              timeline: [
                ...t.timeline,
                {
                  title: "Farmer Information Requested",
                  date: timestamp,
                  actor,
                  note: reason,
                },
              ],
            };
          }),
        }));
      },

      resolveTicket: (ticketId, resolutionSummary, actor = "Assigned Officer") => {
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
          tickets: state.tickets.map((t) => {
            if (t.id !== ticketId) return t;
            return {
              ...t,
              status: "Resolved",
              resolutionNotes: resolutionSummary,
              lastUpdated: now.toISOString().split("T")[0],
              timeline: [
                ...t.timeline,
                {
                  title: "Ticket Resolved",
                  date: timestamp,
                  actor,
                  note: resolutionSummary,
                },
              ],
            };
          }),
        }));
      },

      closeTicket: (ticketId, note, actor = "Reviewing Authority") => {
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
          tickets: state.tickets.map((t) => {
            if (t.id !== ticketId) return t;
            return {
              ...t,
              status: "Closed",
              lastUpdated: now.toISOString().split("T")[0],
              timeline: [
                ...t.timeline,
                {
                  title: "Ticket Closed",
                  date: timestamp,
                  actor,
                  note: note || "Case closed with final administrative sign-off.",
                },
              ],
            };
          }),
        }));
      },

      reopenTicket: (ticketId, reason, actor = "Grievance Officer") => {
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
          tickets: state.tickets.map((t) => {
            if (t.id !== ticketId) return t;
            return {
              ...t,
              status: "In Progress",
              lastUpdated: now.toISOString().split("T")[0],
              timeline: [
                ...t.timeline,
                {
                  title: "Ticket Reopened",
                  date: timestamp,
                  actor,
                  note: reason,
                },
              ],
            };
          }),
        }));
      },

      changePriority: (ticketId, newPriority, note, actor = "Government Officer") => {
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
          tickets: state.tickets.map((t) => {
            if (t.id !== ticketId) return t;
            return {
              ...t,
              priority: newPriority,
              lastUpdated: now.toISOString().split("T")[0],
              timeline: [
                ...t.timeline,
                {
                  title: `Priority Changed to ${newPriority}`,
                  date: timestamp,
                  actor,
                  note: note || `Priority updated from ${t.priority} to ${newPriority}.`,
                },
              ],
            };
          }),
        }));
      },

      resetGrievances: () => set({ tickets: INITIAL_DEMO_GRIEVANCES }),
    }),
    {
      name: "raitusevak-govt-grievances-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
