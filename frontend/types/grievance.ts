export type GrievanceCategory =
  | "Irrigation / Water Supply"
  | "Crop Damage"
  | "Pest or Disease"
  | "Subsidy / Scheme"
  | "Land Record Issue"
  | "Equipment / Labour"
  | "Other";

export type GrievancePriority = "Normal" | "High" | "Critical";

export type GrievanceStatus =
  | "Open"
  | "Awaiting Field Assignment"
  | "Assigned"
  | "In Progress"
  | "Awaiting Farmer Information"
  | "Resolved"
  | "Closed";

export interface GrievanceTimelineEvent {
  title: string;
  date: string;
  actor: string;
  note?: string;
}

export interface GrievanceTicket {
  id: string; // e.g., "GRV-2026-101"
  farmerName: string; // e.g., "K. Nageswara Rao (FAR-8192)"
  farmerMobile?: string; // masked, e.g. "+91 98XXX-XX120"
  category: GrievanceCategory;
  district: string;
  mandal: string;
  village: string;
  dateReported: string;
  priority: GrievancePriority;
  status: GrievanceStatus;
  assignedOfficer?: string;
  description: string;
  resolutionNotes?: string;
  infoRequestReason?: string;
  timeline: GrievanceTimelineEvent[];
  lastUpdated: string;
  createdAt: string;
}
