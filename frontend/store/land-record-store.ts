import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import {
  GovernmentLandRecord,
  LandRecordStatus,
} from "@/types/land-record";

export const INITIAL_DEMO_LAND_RECORDS: GovernmentLandRecord[] = [
  {
    id: "LND-AP-2026-081",
    farmerRef: "K. Venkataramaiah (FAR-4920)",
    farmerRegistrationId: "FAR-4920",
    district: "Guntur",
    mandal: "Tenali",
    village: "Angalakuduru",
    surveyNumber: "142/2B",
    subDivision: "Sub-Plot 2",
    recordedArea: 3.8,
    areaUnit: "Acres",
    landholdingCategory: "Small (1-2 Ha)",
    primaryCrop: "Teja Chilli (G4)",
    secondaryCrop: "Black Gram (Intercrop)",
    irrigationType: "Borewell / Drip",
    cultivationType: "Owner Cultivated",
    recordSource: "Webland 1-B Import",
    recordDate: "2026-09-18",
    lastUpdated: "2026-10-08",
    status: "under_review",
    soilType: "Black Clay Loam",
    plotShape: "rectangular",
    documents: [
      {
        name: "Pattadar Passbook (e-Passbook)",
        refId: "PPB-AP-GT-884920",
        verified: true,
        type: "Pattadar Passbook",
      },
      {
        name: "Field Measurement Book (FMB Sketch)",
        refId: "FMB-TNL-142-2B",
        verified: false,
        type: "Survey Sketch (FMB)",
      },
      {
        name: "Village Adangal / Pahani 2026",
        refId: "ADG-2026-AGK-142",
        verified: true,
        type: "Adangal / Pahani",
      },
    ],
    timeline: [
      {
        title: "Land Record Imported from Webland 1-B",
        date: "2026-09-18 10:30 AM",
        actor: "System Automated Sync (MeeSeva)",
        note: "Pre-populated based on verified Pattadar passbook.",
      },
      {
        title: "Marked Under Review",
        date: "2026-10-08 11:15 AM",
        actor: "Dr. K. S. Rao (ADO)",
        note: "Physical boundary verification queued.",
      },
    ],
  },
  {
    id: "LND-AP-2026-082",
    farmerRef: "B. Sambaiah (FAR-3101)",
    farmerRegistrationId: "FAR-3101",
    district: "Krishna",
    mandal: "Gudivada",
    village: "Pedaparupudi",
    surveyNumber: "88/1A",
    subDivision: "Plot A",
    recordedArea: 5.5,
    areaUnit: "Acres",
    landholdingCategory: "Semi-Medium (2-4 Ha)",
    primaryCrop: "Paddy (BPT 5204)",
    irrigationType: "Canal / Gravity",
    cultivationType: "Owner Cultivated",
    recordSource: "Revenue Department Passbook",
    recordDate: "2026-08-12",
    lastUpdated: "2026-10-05",
    status: "verified",
    soilType: "Alluvial Clay",
    plotShape: "irregular",
    verificationNotes: "All boundaries aligned with Krishna Delta canal feeder line. Passbook and Webland verified.",
    documents: [
      {
        name: "Revenue Pattadar Title Deed",
        refId: "PPB-KRN-GDV-3101",
        verified: true,
        type: "Pattadar Passbook",
      },
      {
        name: "FMB Cadastral Sketch",
        refId: "FMB-PDP-88-1A",
        verified: true,
        type: "Survey Sketch (FMB)",
      },
      {
        name: "Kharif 2026 e-Crop Booking Receipt",
        refId: "ECROP-KRN-881A",
        verified: true,
        type: "Adangal / Pahani",
      },
    ],
    timeline: [
      {
        title: "Record Lodged",
        date: "2026-08-12 09:00 AM",
        actor: "Village Revenue Officer (VRO)",
      },
      {
        title: "Field Inspection Completed",
        date: "2026-09-14 02:00 PM",
        actor: "Smt. L. Bhavani (AEO)",
        note: "Canal irrigation command validated.",
      },
      {
        title: "Record Verified & Countersigned",
        date: "2026-10-05 04:30 PM",
        actor: "Tahsildar & Joint Director Office",
        note: "Approved for direct Rythu Bharosa input disbursement.",
      },
    ],
  },
  {
    id: "LND-AP-2026-083",
    farmerRef: "V. Thimmanna (FAR-1901)",
    farmerRegistrationId: "FAR-1901",
    district: "Anantapur",
    mandal: "Kalyandurg",
    village: "Chapadurthi",
    surveyNumber: "215/3",
    recordedArea: 7.2,
    areaUnit: "Acres",
    landholdingCategory: "Semi-Medium (2-4 Ha)",
    primaryCrop: "Groundnut (K6)",
    secondaryCrop: "Red Gram (Border Crop)",
    irrigationType: "Rainfed",
    cultivationType: "Owner Cultivated",
    recordSource: "Farmer Self-Declared",
    recordDate: "2026-09-22",
    lastUpdated: "2026-10-07",
    status: "clarification_required",
    soilType: "Red Sandy Loam",
    plotShape: "corner_plot",
    clarificationReason:
      "Survey number 215/3 northern boundary shows 0.4 acre discrepancy with Webland 1B records. Farmer requested to submit updated sub-division sketch.",
    documents: [
      {
        name: "Self-Declared Land Declaration",
        refId: "DEC-ATP-1901",
        verified: true,
        type: "Pattadar Passbook",
      },
      {
        name: "Survey Sketch (FMB)",
        refId: "FMB-CPD-215-3",
        verified: false,
        type: "Survey Sketch (FMB)",
      },
    ],
    timeline: [
      {
        title: "Self-Declared Record Submitted",
        date: "2026-09-22 11:20 AM",
        actor: "Farmer via RBK Portal",
      },
      {
        title: "Clarification Requested",
        date: "2026-10-07 03:45 PM",
        actor: "Sri C. H. Naidu (Agronomist)",
        note: "Northern boundary measurement discrepancy noted.",
      },
    ],
  },
  {
    id: "LND-AP-2026-084",
    farmerRef: "P. Lakshmi (FAR-5520)",
    farmerRegistrationId: "FAR-5520",
    district: "Kurnool",
    mandal: "Yemmiganur",
    village: "Banavasi",
    surveyNumber: "64/4C",
    recordedArea: 2.1,
    areaUnit: "Acres",
    landholdingCategory: "Small (1-2 Ha)",
    primaryCrop: "Cotton (Bt)",
    irrigationType: "Open Well / Sprinkler",
    cultivationType: "Tenant Cultivated (CCRC)",
    recordSource: "RBK Village Assistant Field Audit",
    recordDate: "2026-10-01",
    lastUpdated: "2026-10-01",
    status: "pending_review",
    soilType: "Deep Black Cotton Soil",
    plotShape: "rectangular",
    documents: [
      {
        name: "CCRC Agreement (Crop Cultivator Rights Card)",
        refId: "CCRC-KRN-5520-2026",
        verified: false,
        type: "CCRC Agreement",
      },
      {
        name: "Landowner Consent Affidavit",
        refId: "AFF-LND-BNV-64",
        verified: false,
        type: "Pattadar Passbook",
      },
    ],
    timeline: [
      {
        title: "Tenant Cultivation Record Lodged",
        date: "2026-10-01 10:00 AM",
        actor: "Village Agriculture Assistant (RBK)",
        note: "Submitted under annual CCRC lease verification.",
      },
    ],
  },
  {
    id: "LND-AP-2026-085",
    farmerRef: "S. Prabhakar (FAR-6201)",
    farmerRegistrationId: "FAR-6201",
    district: "West Godavari",
    mandal: "Eluru",
    village: "Denduluru",
    surveyNumber: "302/1",
    recordedArea: 12.4,
    areaUnit: "Acres",
    landholdingCategory: "Medium (4-10 Ha)",
    primaryCrop: "Oil Palm + Cocoa",
    irrigationType: "Borewell / Drip",
    cultivationType: "Owner Cultivated",
    recordSource: "Revenue Department Passbook",
    recordDate: "2026-08-01",
    lastUpdated: "2026-09-28",
    status: "verified",
    soilType: "Deltaic Alluvium",
    plotShape: "trapezoid",
    verificationNotes: "Horticulture mission field audit completed. Multi-tier drip irrigation operational.",
    documents: [
      {
        name: "Pattadar Passbook (Digital)",
        refId: "PPB-WG-ELR-6201",
        verified: true,
        type: "Pattadar Passbook",
      },
      {
        name: "Horticulture Mission Drip Certificate",
        refId: "APMIP-WG-302-DRIP",
        verified: true,
        type: "Survey Sketch (FMB)",
      },
    ],
    timeline: [
      {
        title: "Record Lodged",
        date: "2026-08-01 09:30 AM",
        actor: "Sri V. Ramana (Horticulture Officer)",
      },
      {
        title: "Record Verified",
        date: "2026-09-28 05:00 PM",
        actor: "District Horticulture Office",
        note: "Intercropping density verified for PMKSY subsidy allocation.",
      },
    ],
  },
  {
    id: "LND-AP-2026-086",
    farmerRef: "M. Anuradha (FAR-7410)",
    farmerRegistrationId: "FAR-7410",
    district: "Guntur",
    mandal: "Prathipadu",
    village: "Enamadala",
    surveyNumber: "119/2",
    recordedArea: 1.5,
    areaUnit: "Acres",
    landholdingCategory: "Marginal (< 1 Ha)",
    primaryCrop: "Byadgi Chilli",
    irrigationType: "Canal / Gravity",
    cultivationType: "Owner Cultivated",
    recordSource: "Farmer Self-Declared",
    recordDate: "2026-09-10",
    lastUpdated: "2026-09-29",
    status: "rejected",
    soilType: "Red Sandy Loam",
    plotShape: "irregular",
    rejectionReason:
      "Field survey confirmed that plot 119/2 falls within government drainage channel reservation (Poramboke watercourse buffer), ineligible for agricultural scheme certification.",
    documents: [
      {
        name: "Self-Reported Survey Copy",
        refId: "SELF-GNT-7410",
        verified: false,
        type: "Survey Sketch (FMB)",
      },
    ],
    timeline: [
      {
        title: "Record Lodged",
        date: "2026-09-10 11:00 AM",
        actor: "Farmer Self-Declared",
      },
      {
        title: "Field Survey & Boundary Audit",
        date: "2026-09-25 03:00 PM",
        actor: "Dr. K. S. Rao (ADO)",
        note: "Canal buffer encroachment verified on ground.",
      },
      {
        title: "Record Rejected",
        date: "2026-09-29 04:30 PM",
        actor: "Mandal Revenue Officer / ADO",
        note: "Rejected due to Poramboke watercourse reservation.",
      },
    ],
  },
];

interface LandRecordState {
  records: GovernmentLandRecord[];
  markUnderReview: (id: string, note?: string, actor?: string) => void;
  verifyRecord: (id: string, note?: string, actor?: string) => void;
  requestClarification: (id: string, reason: string, actor?: string) => void;
  rejectRecord: (id: string, reason: string, actor?: string) => void;
  resetRecords: () => void;
}

export const useLandRecordStore = create<LandRecordState>()(
  persist(
    (set) => ({
      records: INITIAL_DEMO_LAND_RECORDS,

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
          records: state.records.map((r) => {
            if (r.id !== id) return r;
            return {
              ...r,
              status: "under_review",
              lastUpdated: now.toISOString().split("T")[0],
              timeline: [
                ...r.timeline,
                {
                  title: "Review Started",
                  date: timestamp,
                  actor,
                  note: note || "Land record marked Under Review for boundary and cadastral verification.",
                },
              ],
            };
          }),
        }));
      },

      verifyRecord: (id, note, actor = "Reviewing Officer") => {
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
          records: state.records.map((r) => {
            if (r.id !== id) return r;
            return {
              ...r,
              status: "verified",
              verificationNotes: note || "Official boundaries and survey numbers confirmed against revenue records.",
              clarificationReason: undefined,
              rejectionReason: undefined,
              lastUpdated: now.toISOString().split("T")[0],
              timeline: [
                ...r.timeline,
                {
                  title: "Record Verified",
                  date: timestamp,
                  actor,
                  note: note || "Land record verified and countersigned.",
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
          records: state.records.map((r) => {
            if (r.id !== id) return r;
            return {
              ...r,
              status: "clarification_required",
              clarificationReason: reason,
              lastUpdated: now.toISOString().split("T")[0],
              timeline: [
                ...r.timeline,
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

      rejectRecord: (id, reason, actor = "Reviewing Officer") => {
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
          records: state.records.map((r) => {
            if (r.id !== id) return r;
            return {
              ...r,
              status: "rejected",
              rejectionReason: reason,
              lastUpdated: now.toISOString().split("T")[0],
              timeline: [
                ...r.timeline,
                {
                  title: "Record Rejected",
                  date: timestamp,
                  actor,
                  note: reason,
                },
              ],
            };
          }),
        }));
      },

      resetRecords: () => set({ records: INITIAL_DEMO_LAND_RECORDS }),
    }),
    {
      name: "raitusevak-govt-land-records-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
