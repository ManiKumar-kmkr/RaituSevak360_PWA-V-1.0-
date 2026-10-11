import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import {
  ExpertProfile,
  ExpertOnboardingData,
  FarmerConnectionRequest,
  ExpertConsultation,
  ConsultationSummary,
  ConsultationType,
} from "../types/expert";
import {
  INITIAL_EXPERT_PROFILE,
  INITIAL_ONBOARDING_DATA,
  INITIAL_CONNECTION_REQUESTS,
  INITIAL_CONSULTATIONS,
} from "../services/expert";

export interface ScheduleConsultationPayload {
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
  notes?: string;
}

interface CallSessionState {
  consultationId: string | null;
  farmerName: string;
  crop: string;
  topic: string;
  type: ConsultationType;
  status: "idle" | "connecting" | "connected" | "error" | "ended";
  isMuted: boolean;
  isCameraOff: boolean;
  durationSeconds: number;
}

interface ExpertState {
  profile: ExpertProfile;
  onboarding: ExpertOnboardingData;
  isOnboarded: boolean;
  requests: FarmerConnectionRequest[];
  consultations: ExpertConsultation[];
  selectedRequest: FarmerConnectionRequest | null;
  selectedConsultation: ExpertConsultation | null;
  callSession: CallSessionState;

  // Profile & Availability Actions
  setAvailability: (availability: "available" | "busy" | "offline") => void;
  updateProfile: (partial: Partial<ExpertProfile>) => void;

  // Onboarding Actions
  setOnboardingStep: (step: number) => void;
  updateOnboardingData: (partial: Partial<ExpertOnboardingData>) => void;
  submitOnboarding: () => void;
  resetOnboarding: () => void;

  // Request Actions
  setSelectedRequest: (request: FarmerConnectionRequest | null) => void;
  acceptRequest: (requestId: string) => void;
  rejectRequest: (requestId: string, reason?: string) => void;

  // Consultation Actions
  setSelectedConsultation: (consultation: ExpertConsultation | null) => void;
  scheduleConsultation: (payload: ScheduleConsultationPayload) => ExpertConsultation;
  updateConsultationStatus: (
    consultationId: string,
    status: ExpertConsultation["status"]
  ) => void;
  saveConsultationSummary: (summary: ConsultationSummary) => void;

  // Call Actions
  initiateCall: (consultation: ExpertConsultation) => void;
  setCallConnected: () => void;
  incrementCallDuration: () => void;
  toggleMute: () => void;
  toggleCamera: () => void;
  setCallError: () => void;
  endCall: () => void;
  resetCallSession: () => void;
}

const INITIAL_CALL_STATE: CallSessionState = {
  consultationId: null,
  farmerName: "",
  crop: "",
  topic: "",
  type: "video",
  status: "idle",
  isMuted: false,
  isCameraOff: false,
  durationSeconds: 0,
};

export const useExpertStore = create<ExpertState>()(
  persist(
    (set, get) => ({
      profile: INITIAL_EXPERT_PROFILE,
      onboarding: INITIAL_ONBOARDING_DATA,
      isOnboarded: true,
      requests: INITIAL_CONNECTION_REQUESTS,
      consultations: INITIAL_CONSULTATIONS,
      selectedRequest: null,
      selectedConsultation: null,
      callSession: INITIAL_CALL_STATE,

      setAvailability: (availability) =>
        set((state) => ({
          profile: { ...state.profile, dailyAvailability: availability },
        })),

      updateProfile: (partial) =>
        set((state) => ({
          profile: { ...state.profile, ...partial },
        })),

      setOnboardingStep: (step) =>
        set((state) => ({
          onboarding: { ...state.onboarding, step },
        })),

      updateOnboardingData: (partial) =>
        set((state) => ({
          onboarding: { ...state.onboarding, ...partial },
        })),

      submitOnboarding: () => {
        const id = `RS360-EXP-${Math.floor(100000 + Math.random() * 900000)}`;
        set((state) => ({
          isOnboarded: true,
          onboarding: {
            ...state.onboarding,
            step: 5,
            applicationId: id,
            submittedAt: new Date().toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
              year: "numeric",
            }),
          },
          profile: {
            ...state.profile,
            fullName: state.onboarding.fullName || state.profile.fullName,
            mobile: state.onboarding.mobile || state.profile.mobile,
            qualification: state.onboarding.qualification || state.profile.qualification,
            primarySpecialization:
              state.onboarding.primarySpecialization || state.profile.primarySpecialization,
            expertiseAreas:
              state.onboarding.expertiseAreas.length > 0
                ? state.onboarding.expertiseAreas
                : state.profile.expertiseAreas,
          },
        }));
      },

      resetOnboarding: () =>
        set({
          onboarding: {
            ...INITIAL_ONBOARDING_DATA,
            step: 1,
            applicationId: undefined,
            submittedAt: undefined,
          },
        }),

      setSelectedRequest: (request) => set({ selectedRequest: request }),

      acceptRequest: (requestId) =>
        set((state) => {
          const updatedRequests = state.requests.map((req) =>
            req.id === requestId ? { ...req, status: "accepted" as const } : req
          );
          const acceptedReq = updatedRequests.find((r) => r.id === requestId);
          return {
            requests: updatedRequests,
            selectedRequest: acceptedReq || state.selectedRequest,
          };
        }),

      rejectRequest: (requestId, reason) =>
        set((state) => {
          const updatedRequests = state.requests.map((req) =>
            req.id === requestId
              ? {
                  ...req,
                  status: "rejected" as const,
                  rejectionReason: reason || "Consultation slot unavailable at requested time.",
                }
              : req
          );
          const rejectedReq = updatedRequests.find((r) => r.id === requestId);
          return {
            requests: updatedRequests,
            selectedRequest: rejectedReq || state.selectedRequest,
          };
        }),

      setSelectedConsultation: (consultation) =>
        set({ selectedConsultation: consultation }),

      scheduleConsultation: (payload) => {
        const newId = `CON-${Math.floor(200 + Math.random() * 800)}`;
        const newConsultation: ExpertConsultation = {
          id: newId,
          requestId: payload.requestId,
          farmerName: payload.farmerName,
          farmerPhone: payload.farmerPhone,
          village: payload.village,
          mandal: payload.mandal,
          district: payload.district,
          crop: payload.crop,
          topic: payload.topic,
          description: payload.description,
          scheduledDate: payload.scheduledDate,
          scheduledTimeSlot: payload.scheduledTimeSlot,
          durationMinutes: payload.durationMinutes,
          type: payload.type,
          status: "upcoming",
          notes: payload.notes,
        };

        set((state) => {
          // If linked to a request, make sure it is marked accepted
          const updatedRequests = payload.requestId
            ? state.requests.map((r) =>
                r.id === payload.requestId ? { ...r, status: "accepted" as const } : r
              )
            : state.requests;

          return {
            requests: updatedRequests,
            consultations: [newConsultation, ...state.consultations],
            selectedConsultation: newConsultation,
          };
        });

        return newConsultation;
      },

      updateConsultationStatus: (consultationId, status) =>
        set((state) => ({
          consultations: state.consultations.map((c) =>
            c.id === consultationId ? { ...c, status } : c
          ),
          selectedConsultation:
            state.selectedConsultation?.id === consultationId
              ? { ...state.selectedConsultation, status }
              : state.selectedConsultation,
        })),

      saveConsultationSummary: (summary) =>
        set((state) => ({
          consultations: state.consultations.map((c) =>
            c.id === summary.consultationId
              ? { ...c, status: "completed" as const, summary }
              : c
          ),
          selectedConsultation:
            state.selectedConsultation?.id === summary.consultationId
              ? { ...state.selectedConsultation, status: "completed" as const, summary }
              : state.selectedConsultation,
        })),

      initiateCall: (consultation) =>
        set({
          callSession: {
            consultationId: consultation.id,
            farmerName: consultation.farmerName,
            crop: consultation.crop,
            topic: consultation.topic,
            type: consultation.type,
            status: "connecting",
            isMuted: false,
            isCameraOff: false,
            durationSeconds: 0,
          },
        }),

      setCallConnected: () =>
        set((state) => ({
          callSession: { ...state.callSession, status: "connected" },
        })),

      incrementCallDuration: () =>
        set((state) => ({
          callSession: {
            ...state.callSession,
            durationSeconds: state.callSession.durationSeconds + 1,
          },
        })),

      toggleMute: () =>
        set((state) => ({
          callSession: {
            ...state.callSession,
            isMuted: !state.callSession.isMuted,
          },
        })),

      toggleCamera: () =>
        set((state) => ({
          callSession: {
            ...state.callSession,
            isCameraOff: !state.callSession.isCameraOff,
          },
        })),

      setCallError: () =>
        set((state) => ({
          callSession: { ...state.callSession, status: "error" },
        })),

      endCall: () =>
        set((state) => ({
          callSession: { ...state.callSession, status: "ended" },
        })),

      resetCallSession: () => set({ callSession: INITIAL_CALL_STATE }),
    }),
    {
      name: "raitusevak-expert-store",
      storage: createJSONStorage(() =>
        typeof window !== "undefined"
          ? localStorage
          : {
              getItem: () => null,
              setItem: () => {},
              removeItem: () => {},
            }
      ),
      partialize: (state) => ({
        profile: state.profile,
        onboarding: state.onboarding,
        isOnboarded: state.isOnboarded,
        requests: state.requests,
        consultations: state.consultations,
      }),
    }
  )
);
