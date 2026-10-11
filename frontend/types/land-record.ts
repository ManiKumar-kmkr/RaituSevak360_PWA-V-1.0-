export type LandRecordStatus =
  | "pending_review"
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

export type IrrigationType =
  | "Borewell / Drip"
  | "Canal / Gravity"
  | "Rainfed"
  | "Lift Irrigation"
  | "Open Well / Sprinkler";

export type CultivationType =
  | "Owner Cultivated"
  | "Tenant Cultivated (CCRC)"
  | "Joint Family Holding"
  | "Cooperative Farming";

export type RecordSource =
  | "Farmer Self-Declared"
  | "Webland 1-B Import"
  | "RBK Village Assistant Field Audit"
  | "Revenue Department Passbook";

export interface MockDocumentReference {
  name: string;
  refId: string;
  verified: boolean;
  type: "Pattadar Passbook" | "Survey Sketch (FMB)" | "Adangal / Pahani" | "CCRC Agreement";
}

export interface LandRecordTimelineEvent {
  title: string;
  date: string;
  actor: string;
  note?: string;
}

export interface GovernmentLandRecord {
  id: string; // e.g. "LND-AP-2026-081"
  farmerRef: string; // e.g. "K. Venkataramaiah (FAR-4920)"
  farmerRegistrationId: string; // "FAR-4920"
  district: string;
  mandal: string;
  village: string;
  surveyNumber: string; // e.g. "142/2B"
  subDivision?: string;
  recordedArea: number; // e.g. 3.4
  areaUnit: "Acres" | "Hectares";
  landholdingCategory: LandholdingCategory;
  primaryCrop: string;
  secondaryCrop?: string;
  irrigationType: IrrigationType;
  cultivationType: CultivationType;
  recordSource: RecordSource;
  recordDate: string;
  lastUpdated: string;
  status: LandRecordStatus;
  documents: MockDocumentReference[];
  timeline: LandRecordTimelineEvent[];
  clarificationReason?: string;
  rejectionReason?: string;
  verificationNotes?: string;
  soilType?: string;
  plotShape?: "rectangular" | "trapezoid" | "irregular" | "corner_plot";
}
