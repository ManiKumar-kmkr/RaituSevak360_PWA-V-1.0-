export type ConsultationType = 'video' | 'voice';
export type RequestPriority = 'high' | 'medium' | 'normal';
export type RequestStatus = 'pending' | 'accepted' | 'rejected';
export type ConsultationStatus = 'upcoming' | 'in_progress' | 'completed' | 'cancelled';
export type ExpertVerificationStatus = 'pending' | 'verified' | 'rejected';

export interface ExpertProfile {
  id: string;
  fullName: string;
  mobile: string;
  email: string;
  qualification: string;
  primarySpecialization: string;
  experienceYears: number;
  location: string;
  mandal: string;
  district: string;
  state: string;
  languages: string[];
  expertiseAreas: string[];
  bio: string;
  avatarUrl?: string;
  verificationStatus: ExpertVerificationStatus;
  rating: number;
  reviewCount: number;
  totalConsultations: number;
  dailyAvailability: string;
}

export interface ExpertOnboardingData {
  step: number;
  fullName: string;
  mobile: string;
  email: string;
  qualification: string;
  primarySpecialization: string;
  experienceYears: number;
  location: string;
  languages: string[];
  expertiseAreas: string[];
  idProofType: string;
  idProofNumber: string;
  certificateName: string;
  agreeToTerms: boolean;
  applicationId?: string;
  submittedAt?: string;
}

export interface FarmerConnectionRequest {
  id: string;
  farmerName: string;
  farmerPhone: string;
  village: string;
  mandal: string;
  district: string;
  farmSizeAcres: number;
  crop: string;
  cropStage: string;
  problemTitle: string;
  problemDescription: string;
  priority: RequestPriority;
  preferredType: ConsultationType;
  preferredDate: string;
  preferredTimeSlot: string;
  requestDate: string;
  status: RequestStatus;
  rejectionReason?: string;
  attachedPhotos?: string[];
}

export interface ExpertConsultation {
  id: string;
  requestId?: string;
  farmerName: string;
  farmerPhone: string;
  village: string;
  mandal: string;
  district: string;
  crop: string;
  topic: string;
  description: string;
  scheduledDate: string;
  scheduledTimeSlot: string;
  durationMinutes: number;
  type: ConsultationType;
  status: ConsultationStatus;
  notes?: string;
  attachedPhotos?: string[];
  callRecord?: {
    callDurationSeconds: number;
    startedAt: string;
    endedAt: string;
  };
  summary?: ConsultationSummary;
}

export interface ConsultationSummary {
  id: string;
  consultationId: string;
  farmerName: string;
  crop: string;
  issueDiagnosed: string;
  clinicalNotes: string;
  expertNotes?: string;
  recommendations: string[];
  followUpNeeded: boolean;
  followUpDays?: number;
  prescribedTreatments: string[];
  completedAt: string;
  rating?: number;
  durationSeconds?: number;
}
