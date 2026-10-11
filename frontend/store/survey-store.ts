import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { SurveyItem, FieldEntry, SurveyStatus } from "@/types/survey";

interface SurveyState {
  surveys: SurveyItem[];
  addSurvey: (
    newSurvey: Omit<
      SurveyItem,
      "id" | "fieldEntries" | "timeline" | "createdAt" | "updatedAt"
    >
  ) => SurveyItem;
  updateSurvey: (id: string, updates: Partial<SurveyItem>) => void;
  addFieldEntry: (
    surveyId: string,
    entry: Omit<FieldEntry, "id">,
    actor?: string
  ) => void;
  transitionStatus: (
    surveyId: string,
    status: SurveyStatus,
    note?: string,
    actor?: string
  ) => void;
  requestCorrection: (
    surveyId: string,
    reason: string,
    actor?: string
  ) => void;
  markReviewed: (
    surveyId: string,
    reviewerNotes?: string,
    actor?: string
  ) => void;
  resetSurveys: () => void;
}

export const INITIAL_DEMO_SURVEYS: SurveyItem[] = [
  {
    id: "SRV-2026-081",
    title: "Guntur Chilli Thrips & Wilt Field Inspection",
    type: "Pest and Disease Inspection",
    district: "Guntur",
    mandal: "Tenali",
    village: "Angalakuduru",
    surveyDate: "2026-10-08",
    assignedOfficer: "Dr. K. S. Rao (ADO)",
    description:
      "Comprehensive field inspection to evaluate black thrips incidence and fungal root rot across commercial chilli plots.",
    targetFarms: 10,
    priority: "Urgent",
    status: "in_progress",
    fieldEntries: [
      {
        id: "FENT-01",
        farmerName: "B. Sambaiah (ID: FAR-4920)",
        farmerId: "FAR-4920",
        village: "Angalakuduru",
        crop: "Teja Chilli (G4)",
        observedCondition: "Stressed",
        irrigationStatus: "Borewell / Drip",
        pestObservations: "Severe upward leaf curling, flower drop due to black thrips (Thrips parvispinus).",
        recommendedFollowUp: "Recommended Spinetoram 11.7 SC spray and sticky traps installation.",
        visitDate: "2026-10-08",
        notes: "Field located near irrigation canal; humidity elevated.",
      },
      {
        id: "FENT-02",
        farmerName: "M. Anuradha (ID: FAR-4921)",
        farmerId: "FAR-4921",
        village: "Angalakuduru",
        crop: "Byadgi Chilli",
        observedCondition: "Moderate",
        irrigationStatus: "Canal / Flood",
        pestObservations: "Minor sucking pest infestation; early stage powdery mildew patches.",
        recommendedFollowUp: "Apply Azoxystrobin + Difenoconazole; improve drainage.",
        visitDate: "2026-10-08",
        notes: "Soil moisture adequate. Farmer aware of IPM protocols.",
      },
      {
        id: "FENT-03",
        farmerName: "T. Venkataramaiah (ID: FAR-4924)",
        farmerId: "FAR-4924",
        village: "Angalakuduru",
        crop: "Chilli Armoor Variety",
        observedCondition: "Good",
        irrigationStatus: "Borewell / Drip",
        pestObservations: "Minimal pest activity. Prophylactic neem oil application visible.",
        recommendedFollowUp: "Maintain schedule; record second flush fruit set.",
        visitDate: "2026-10-08",
        notes: "Healthy canopy and good vegetative vigor.",
      },
    ],
    timeline: [
      {
        title: "Survey Initiated",
        date: "2026-10-08 09:30 AM",
        actor: "Dr. K. S. Rao (ADO)",
        note: "Survey marked In Progress upon officer field dispatch.",
      },
      {
        title: "Field Visit Recorded (3 Farms)",
        date: "2026-10-08 02:45 PM",
        actor: "Dr. K. S. Rao (ADO)",
        note: "Completed initial transect walk across 3 commercial chilli plots.",
      },
    ],
    createdAt: "2026-10-08",
    updatedAt: "2026-10-08",
  },
  {
    id: "SRV-2026-082",
    title: "Krishna Delta Paddy Flood Assessment & Drainage Verification",
    type: "Crop Health Assessment",
    district: "Krishna",
    mandal: "Gudivada",
    village: "Pedaparupudi",
    surveyDate: "2026-10-05",
    assignedOfficer: "Smt. L. Bhavani (AEO)",
    description:
      "Rapid post-rain assessment to quantify waterlogging duration, lodging extent, and seedling mortality in low-lying delta paddy fields.",
    targetFarms: 5,
    priority: "High",
    status: "submitted",
    fieldEntries: [
      {
        id: "FENT-11",
        farmerName: "K. Ranga Rao (ID: FAR-3101)",
        farmerId: "FAR-3101",
        village: "Pedaparupudi",
        crop: "BPT 5204 (Samba Mahsuri)",
        observedCondition: "Stressed",
        irrigationStatus: "Canal / Flood",
        pestObservations: "Water stagnation for 48 hours; mild sheath blight noticed on lower stems.",
        recommendedFollowUp: "Drain excess standing water immediately; foliar potassium spray.",
        visitDate: "2026-10-05",
      },
      {
        id: "FENT-12",
        farmerName: "P. Lakshmi (ID: FAR-3105)",
        farmerId: "FAR-3105",
        village: "Pedaparupudi",
        crop: "MTU 1010",
        observedCondition: "Moderate",
        irrigationStatus: "Canal / Flood",
        pestObservations: "Lodging in 10% area due to gusty winds; grain filling active.",
        recommendedFollowUp: "Erect bund supports; schedule early harvest where mature.",
        visitDate: "2026-10-05",
      },
      {
        id: "FENT-13",
        farmerName: "G. Venkateswarlu (ID: FAR-3112)",
        farmerId: "FAR-3112",
        village: "Pedaparupudi",
        crop: "RNR 15048 (Telangana Sona)",
        observedCondition: "Good",
        irrigationStatus: "Canal / Flood",
        pestObservations: "No pest incidence. Good panicle initiation.",
        recommendedFollowUp: "Routine monitoring till harvest.",
        visitDate: "2026-10-05",
      },
      {
        id: "FENT-14",
        farmerName: "D. Srinivas (ID: FAR-3118)",
        farmerId: "FAR-3118",
        village: "Pedaparupudi",
        crop: "BPT 5204",
        observedCondition: "Stressed",
        irrigationStatus: "Canal / Flood",
        pestObservations: "Submergence in field depressions; leaf yellowing.",
        recommendedFollowUp: "Apply 2% urea spray post-drainage to boost recovery.",
        visitDate: "2026-10-05",
      },
      {
        id: "FENT-15",
        farmerName: "N. Subba Rao (ID: FAR-3120)",
        farmerId: "FAR-3120",
        village: "Pedaparupudi",
        crop: "MTU 1061",
        observedCondition: "Good",
        irrigationStatus: "Canal / Flood",
        pestObservations: "Submergence tolerant variety; minimal leaf damage.",
        recommendedFollowUp: "Normal agronomic practices.",
        visitDate: "2026-10-05",
      },
    ],
    timeline: [
      {
        title: "Survey Created",
        date: "2026-10-04 11:00 AM",
        actor: "Smt. L. Bhavani (AEO)",
        note: "Scheduled in response to heavy precipitation alerts.",
      },
      {
        title: "Field Entries Completed (5/5 Farms)",
        date: "2026-10-05 04:30 PM",
        actor: "Smt. L. Bhavani (AEO)",
        note: "All 5 target delta farm plots surveyed and logged.",
      },
      {
        title: "Survey Submitted for Verification",
        date: "2026-10-06 10:15 AM",
        actor: "Smt. L. Bhavani (AEO)",
        note: "Final assessment report submitted to Joint Director office.",
      },
    ],
    createdAt: "2026-10-04",
    updatedAt: "2026-10-06",
  },
  {
    id: "SRV-2026-083",
    title: "Anantapur Rainfed Groundnut Drought & Pod Development Audit",
    type: "Soil and Irrigation Assessment",
    district: "Anantapur",
    mandal: "Kalyandurg",
    village: "Chapadurthi",
    surveyDate: "2026-10-02",
    assignedOfficer: "Sri C. H. Naidu (Agronomist)",
    description:
      "Assessing dry spell impact on peg penetration and pod development under rainfed red sandy loam conditions.",
    targetFarms: 6,
    priority: "High",
    status: "needs_review",
    fieldEntries: [
      {
        id: "FENT-21",
        farmerName: "V. Thimmanna (ID: FAR-1901)",
        farmerId: "FAR-1901",
        village: "Chapadurthi",
        crop: "Groundnut (K6)",
        observedCondition: "Stressed",
        irrigationStatus: "Rainfed",
        pestObservations: "Severe moisture stress; wilting leaves during afternoon hours.",
        recommendedFollowUp: "Arrange life-saving protective irrigation via community sprinkler tankers.",
        visitDate: "2026-10-02",
      },
      {
        id: "FENT-22",
        farmerName: "K. Obulamma (ID: FAR-1905)",
        farmerId: "FAR-1905",
        village: "Chapadurthi",
        crop: "Groundnut (Dharani)",
        observedCondition: "Moderate",
        irrigationStatus: "Dry / Critical",
        pestObservations: "Early leaf spot (Tikka disease) in 15% crop area.",
        recommendedFollowUp: "Spray Mancozeb 75% WP @ 2g/L.",
        visitDate: "2026-10-02",
      },
      {
        id: "FENT-23",
        farmerName: "Y. Gangadhar (ID: FAR-1910)",
        farmerId: "FAR-1910",
        village: "Chapadurthi",
        crop: "Groundnut (K6)",
        observedCondition: "Damaged",
        irrigationStatus: "Dry / Critical",
        pestObservations: "Severe pod abortion due to high soil temperature and hardened topsoil.",
        recommendedFollowUp: "Include in crop loss compensation claim roster.",
        visitDate: "2026-10-02",
      },
    ],
    timeline: [
      {
        title: "Survey Created",
        date: "2026-10-01 02:00 PM",
        actor: "Sri C. H. Naidu (Agronomist)",
      },
      {
        title: "Survey Submitted",
        date: "2026-10-03 09:00 AM",
        actor: "Sri C. H. Naidu (Agronomist)",
      },
      {
        title: "Marked Needs Review",
        date: "2026-10-04 11:30 AM",
        actor: "Reviewer Cell (District Collectorate)",
        note: "3 out of 6 target farms lack geotagged soil moisture sample data.",
      },
    ],
    reviewerNotes:
      "Initial 3 entries verified, but 3 remaining plots require soil moisture depth records and GPS coordinates before final sign-off.",
    missingInformation:
      "Soil moisture reading (0-15cm depth) for plots FAR-1901 and FAR-1910; farmer signature acknowledgment.",
    createdAt: "2026-10-01",
    updatedAt: "2026-10-04",
  },
  {
    id: "SRV-2026-084",
    title: "Kurnool Cotton Drip Subsidy Beneficiary Physical Verification",
    type: "Scheme Beneficiary Field Visit",
    district: "Kurnool",
    mandal: "Yemmiganur",
    village: "Banavasi",
    surveyDate: "2026-10-10",
    assignedOfficer: "Dr. K. S. Rao (ADO)",
    description:
      "Physical verification of installed micro-irrigation drip laterals and inline drippers under PMKSY subsidy allocation.",
    targetFarms: 8,
    priority: "Normal",
    status: "draft",
    fieldEntries: [],
    timeline: [
      {
        title: "Survey Draft Saved",
        date: "2026-10-07 03:20 PM",
        actor: "Dr. K. S. Rao (ADO)",
        note: "Survey framework established; pending beneficiary roster assignment.",
      },
    ],
    createdAt: "2026-10-07",
    updatedAt: "2026-10-07",
  },
  {
    id: "SRV-2026-080",
    title: "West Godavari Oil Palm Intercropping & Soil NPK Survey",
    type: "General Agricultural Survey",
    district: "West Godavari",
    mandal: "Eluru",
    village: "Denduluru",
    surveyDate: "2026-09-28",
    assignedOfficer: "Sri V. Ramana (Horticulture Officer)",
    description:
      "Assessment of cocoa and pepper intercropping density and soil organic carbon in mature oil palm plantations.",
    targetFarms: 4,
    priority: "Normal",
    status: "reviewed",
    fieldEntries: [
      {
        id: "FENT-41",
        farmerName: "S. Prabhakar (ID: FAR-5501)",
        farmerId: "FAR-5501",
        village: "Denduluru",
        crop: "Oil Palm + Cocoa",
        observedCondition: "Good",
        irrigationStatus: "Borewell / Drip",
        pestObservations: "No pest incidence. Good canopy cover.",
        recommendedFollowUp: "Continue compost application.",
        visitDate: "2026-09-28",
      },
      {
        id: "FENT-42",
        farmerName: "T. Krishna (ID: FAR-5504)",
        farmerId: "FAR-5504",
        village: "Denduluru",
        crop: "Oil Palm + Pepper",
        observedCondition: "Good",
        irrigationStatus: "Borewell / Drip",
        pestObservations: "Good fruit bunches; pepper vine healthy.",
        recommendedFollowUp: "Routine agronomy.",
        visitDate: "2026-09-28",
      },
    ],
    timeline: [
      {
        title: "Survey Completed",
        date: "2026-09-28 05:00 PM",
        actor: "Sri V. Ramana",
      },
      {
        title: "Reviewed and Approved",
        date: "2026-09-30 11:00 AM",
        actor: "District Horticulture Officer",
        note: "All observations validated. Sent to State Horticultural Mission.",
      },
    ],
    reviewerNotes: "Exemplary demonstration of multi-tier intercropping with high water use efficiency.",
    createdAt: "2026-09-27",
    updatedAt: "2026-09-30",
  },
];

export const useSurveyStore = create<SurveyState>()(
  persist(
    (set, get) => ({
      surveys: INITIAL_DEMO_SURVEYS,

      addSurvey: (newSurveyData) => {
        const idNumber = Math.floor(100 + Math.random() * 900);
        const newId = `SRV-2026-${idNumber}`;
        const now = new Date();
        const timestamp = now.toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }) + " " + now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });

        const dateStr = now.toISOString().split("T")[0];

        const createdItem: SurveyItem = {
          ...newSurveyData,
          id: newId,
          fieldEntries: [],
          timeline: [
            {
              title: newSurveyData.status === "draft" ? "Survey Draft Saved" : "Survey Initiated",
              date: timestamp,
              actor: newSurveyData.assignedOfficer || "Government Officer",
              note:
                newSurveyData.status === "draft"
                  ? "Saved as draft in local state."
                  : "Survey created and marked In Progress.",
            },
          ],
          createdAt: dateStr,
          updatedAt: dateStr,
        };

        set((state) => ({
          surveys: [createdItem, ...state.surveys],
        }));

        return createdItem;
      },

      updateSurvey: (id, updates) => {
        set((state) => ({
          surveys: state.surveys.map((s) =>
            s.id === id ? { ...s, ...updates, updatedAt: new Date().toISOString().split("T")[0] } : s
          ),
        }));
      },

      addFieldEntry: (surveyId, entry, actor = "Assigned Officer") => {
        const entryId = `FENT-${Date.now().toString().slice(-4)}`;
        const now = new Date();
        const timestamp = now.toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }) + " " + now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });

        set((state) => {
          const target = state.surveys.find((s) => s.id === surveyId);
          if (!target) return state;

          const updatedEntries = [...target.fieldEntries, { ...entry, id: entryId }];
          const updatedTimeline = [
            ...target.timeline,
            {
              title: `Field Visit Recorded (${entry.farmerName})`,
              date: timestamp,
              actor,
              note: `Crop: ${entry.crop} | Condition: ${entry.observedCondition}`,
            },
          ];

          return {
            surveys: state.surveys.map((s) =>
              s.id === surveyId
                ? {
                    ...s,
                    fieldEntries: updatedEntries,
                    timeline: updatedTimeline,
                    updatedAt: now.toISOString().split("T")[0],
                  }
                : s
            ),
          };
        });
      },

      transitionStatus: (surveyId, newStatus, note, actor = "Assigned Officer") => {
        const now = new Date();
        const timestamp = now.toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }) + " " + now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });

        const statusTitles: Record<SurveyStatus, string> = {
          draft: "Survey Saved as Draft",
          in_progress: "Survey Marked In Progress",
          submitted: "Survey Submitted for Review",
          needs_review: "Survey Marked Needs Review",
          reviewed: "Survey Verified & Completed",
        };

        set((state) => ({
          surveys: state.surveys.map((s) => {
            if (s.id !== surveyId) return s;
            return {
              ...s,
              status: newStatus,
              timeline: [
                ...s.timeline,
                {
                  title: statusTitles[newStatus] || `Status updated to ${newStatus}`,
                  date: timestamp,
                  actor,
                  note: note || `Survey transitioned to ${newStatus}.`,
                },
              ],
              updatedAt: now.toISOString().split("T")[0],
            };
          }),
        }));
      },

      requestCorrection: (surveyId, reason, actor = "Reviewing Officer") => {
        const now = new Date();
        const timestamp = now.toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }) + " " + now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });

        set((state) => ({
          surveys: state.surveys.map((s) => {
            if (s.id !== surveyId) return s;
            return {
              ...s,
              status: "needs_review",
              correctionReason: reason,
              timeline: [
                ...s.timeline,
                {
                  title: "Correction Requested",
                  date: timestamp,
                  actor,
                  note: `Reason: ${reason}`,
                },
              ],
              updatedAt: now.toISOString().split("T")[0],
            };
          }),
        }));
      },

      markReviewed: (surveyId, reviewerNotes, actor = "Reviewing Officer") => {
        const now = new Date();
        const timestamp = now.toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }) + " " + now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });

        set((state) => ({
          surveys: state.surveys.map((s) => {
            if (s.id !== surveyId) return s;
            return {
              ...s,
              status: "reviewed",
              reviewerNotes: reviewerNotes || "Survey observations verified and approved.",
              correctionReason: undefined,
              timeline: [
                ...s.timeline,
                {
                  title: "Survey Marked Reviewed",
                  date: timestamp,
                  actor,
                  note: reviewerNotes || "All records confirmed.",
                },
              ],
              updatedAt: now.toISOString().split("T")[0],
            };
          }),
        }));
      },

      resetSurveys: () => set({ surveys: INITIAL_DEMO_SURVEYS }),
    }),
    {
      name: "raitusevak-govt-surveys-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
