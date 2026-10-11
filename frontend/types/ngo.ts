export type NgoType =
  | "Agricultural NGO"
  | "Rural Development Organization"
  | "Farmer Welfare Organization"
  | "Agricultural Development Organization";

export type NgoVerificationStatus =
  | "draft"
  | "submitted"
  | "under_review"
  | "clarification_required"
  | "verified"
  | "rejected";

export interface NgoDocumentItem {
  id: string;
  name: string;
  documentType: string;
  fileName: string;
  fileSize: string;
  referenceId: string;
  status: "submitted" | "verified" | "clarification_required" | "rejected";
  note?: string;
}

export interface NgoTimelineEvent {
  title: string;
  date: string;
  actor: string;
  note?: string;
}

export interface NgoOrganizationItem {
  id: string; // e.g. "NGO-AP-2026-001"
  name: string;
  organizationType: NgoType;
  registrationRef: string; // Mock registration reference
  registrationAuthority: string;
  state: string;
  district: string;
  mandal: string;
  officeAddress: string;
  officialWebsite?: string;
  representativeName: string; // Demo / masked name
  representativeRole: string;
  officialEmail: string;
  officialPhone: string;
  status: NgoVerificationStatus;
  submissionDate: string;
  lastUpdated: string;
  verifiedDate?: string;
  rejectedDate?: string;
  reviewerNotes?: string;
  clarificationReason?: string;
  rejectionReason?: string;
  focusAreas: string[];
  documents: NgoDocumentItem[];
  timeline: NgoTimelineEvent[];
}

export interface NgoFilterState {
  searchQuery: string;
  selectedType: string;
  selectedDistrict: string;
  selectedStatus: string;
}
