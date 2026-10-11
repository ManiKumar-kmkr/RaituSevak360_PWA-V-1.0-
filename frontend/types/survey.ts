export type SurveyStatus =
  | "draft"
  | "in_progress"
  | "submitted"
  | "needs_review"
  | "reviewed";

export type SurveyType =
  | "Crop Health Assessment"
  | "Soil and Irrigation Assessment"
  | "Pest and Disease Inspection"
  | "Scheme Beneficiary Field Visit"
  | "General Agricultural Survey";

export type SurveyPriority = "Normal" | "High" | "Urgent";

export interface FieldEntry {
  id: string;
  farmerName: string;
  farmerId: string;
  village: string;
  crop: string;
  observedCondition: "Good" | "Moderate" | "Stressed" | "Damaged";
  irrigationStatus: "Borewell / Drip" | "Canal / Flood" | "Rainfed" | "Dry / Critical";
  pestObservations: string;
  recommendedFollowUp: string;
  visitDate: string;
  notes?: string;
}

export interface SurveyTimelineEvent {
  title: string;
  date: string;
  actor: string;
  note?: string;
}

export interface SurveyItem {
  id: string; // e.g. "SRV-2026-001"
  title: string;
  type: SurveyType;
  district: string;
  mandal: string;
  village: string;
  surveyDate: string;
  assignedOfficer: string;
  description: string;
  targetFarms: number;
  priority: SurveyPriority;
  status: SurveyStatus;
  fieldEntries: FieldEntry[];
  timeline: SurveyTimelineEvent[];
  reviewerNotes?: string;
  missingInformation?: string;
  correctionReason?: string;
  createdAt: string;
  updatedAt: string;
}
