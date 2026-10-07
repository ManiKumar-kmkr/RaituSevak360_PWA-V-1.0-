export type LabourWorkType =
  | "all"
  | "harvesting"
  | "sowing"
  | "weeding"
  | "spraying"
  | "general";

export type WorkerAvailability = "available" | "busy" | "unavailable";

export type VerificationStatus =
  | "pending_verification"
  | "verified"
  | "rejected";

export interface LabourWorker {
  id: string;
  name: string;
  avatar: string;
  workTypes: LabourWorkType[];
  specialization: string;
  skills: string[];
  experienceYears: number;
  rating: number;
  reviewCount: number;
  dailyRate: number;
  hourlyRate?: number;
  location: string;
  mandal: string;
  district: string;
  distanceKm: number;
  availability: WorkerAvailability;
  languages: string[];
  verified: boolean;
  verificationStatus?: VerificationStatus;
  isActive?: boolean;
  bio: string;
  completedJobs: number;
  crewSize?: number;
  phone?: string;
  isMyProfile?: boolean;
}

export interface LabourBooking {
  id: string;
  workerId: string;
  workerName: string;
  workerAvatar: string;
  workType: string;
  startDate: string;
  durationDays: number;
  dailyRate: number;
  totalAmount: number;
  farmLocation: string;
  farmerName: string;
  farmerPhone: string;
  specialNotes?: string;
  status: "confirmed" | "in_progress" | "completed" | "cancelled";
  createdAt: string;
}
