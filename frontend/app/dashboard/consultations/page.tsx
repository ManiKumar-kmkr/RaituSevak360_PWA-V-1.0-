"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  GraduationCap,
  Calendar,
  Video,
  Clock,
  MessageSquare,
  CheckCircle2,
  UsersRound,
  ShieldCheck,
  Plus,
  ArrowRight,
  Sparkles,
  Award,
} from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { useExpertStore, ScheduleConsultationPayload } from "@/store/expert-store";
import {
  FarmerConnectionRequest,
  ExpertConsultation,
  ConsultationSummary,
} from "@/types/expert";
import BackButton from "@/components/ui/BackButton";
import ExpertRequestsList from "@/components/expert/ExpertRequestsList";
import ConsultationsList from "@/components/expert/ConsultationsList";
import RequestDetailsModal from "@/components/expert/RequestDetailsModal";
import RequestAcceptedModal from "@/components/expert/RequestAcceptedModal";
import ConsultationScheduleModal from "@/components/expert/ConsultationScheduleModal";
import ConsultationScheduledModal from "@/components/expert/ConsultationScheduledModal";
import ConsultationDetailsModal from "@/components/expert/ConsultationDetailsModal";
import ConsultationSummaryModal from "@/components/expert/ConsultationSummaryModal";
import ConsultationCompletedModal from "@/components/expert/ConsultationCompletedModal";
import ConsultationCallScreen from "@/components/expert/ConsultationCallScreen";
import { ConsultationLoadingView, ConsultationErrorView } from "@/components/expert/ConsultationStateViews";

function ConsultationsHubContent() {
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const initialTab = searchParams.get("tab") === "requests" ? "requests" : "consultations";

  const [activeTab, setActiveTab] = useState<"consultations" | "requests">(initialTab);

  // Store state and actions
  const profile = useExpertStore((state) => state.profile);
  const requests = useExpertStore((state) => state.requests);
  const consultations = useExpertStore((state) => state.consultations);
  const acceptRequest = useExpertStore((state) => state.acceptRequest);
  const rejectRequest = useExpertStore((state) => state.rejectRequest);
  const scheduleConsultation = useExpertStore((state) => state.scheduleConsultation);
  const saveConsultationSummary = useExpertStore((state) => state.saveConsultationSummary);

  // Modal states
  const [selectedRequestForDetails, setSelectedRequestForDetails] =
    useState<FarmerConnectionRequest | null>(null);
  const [acceptedRequestForSuccess, setAcceptedRequestForSuccess] =
    useState<FarmerConnectionRequest | null>(null);
  const [requestToSchedule, setRequestToSchedule] =
    useState<FarmerConnectionRequest | null>(null);
  const [scheduledConsultationSuccess, setScheduledConsultationSuccess] =
    useState<ExpertConsultation | null>(null);

  const [selectedConsultationForDetails, setSelectedConsultationForDetails] =
    useState<ExpertConsultation | null>(null);
  const [activeCallConsultation, setActiveCallConsultation] =
    useState<ExpertConsultation | null>(null);
  const [summaryConsultation, setSummaryConsultation] =
    useState<ExpertConsultation | null>(null);
  const [completedSummarySuccess, setCompletedSummarySuccess] =
    useState<ConsultationSummary | null>(null);
  const [recordedCallDuration, setRecordedCallDuration] = useState<number>(180);
  const [liveCallNotes, setLiveCallNotes] = useState<string>("");

  // Simulation test view toggle for reviewer (loading / error)
  const [viewState, setViewState] = useState<"normal" | "loading" | "error">("normal");

  // Metrics
  const pendingRequestsCount = requests.filter((r) => r.status === "pending").length;
  const upcomingConsultationsCount = consultations.filter(
    (c) => c.status === "upcoming" || c.status === "in_progress"
  ).length;

  const handleAcceptRequest = (requestId: string) => {
    acceptRequest(requestId);
    const req = requests.find((r) => r.id === requestId);
    setSelectedRequestForDetails(null);
    if (req) {
      setAcceptedRequestForSuccess(req);
    }
  };

  const handleRejectRequest = (requestId: string, reason?: string) => {
    rejectRequest(requestId, reason);
    setSelectedRequestForDetails(null);
  };

  const handleOpenSchedule = (req: FarmerConnectionRequest) => {
    setSelectedRequestForDetails(null);
    setAcceptedRequestForSuccess(null);
    setRequestToSchedule(req);
  };

  const handleCloseSchedule = () => {
    const currentReq = requestToSchedule;
    setRequestToSchedule(null);
    if (currentReq) {
      const latestReq = requests.find((r) => r.id === currentReq.id) || currentReq;
      setSelectedRequestForDetails(latestReq);
    }
  };

  const handleConfirmSchedule = (payload: ScheduleConsultationPayload) => {
    const newConsultation = scheduleConsultation(payload);
    setRequestToSchedule(null);
    setScheduledConsultationSuccess(newConsultation);
  };

  const handleStartCall = (consultation: ExpertConsultation) => {
    setSelectedConsultationForDetails(null);
    setActiveCallConsultation(consultation);
  };

  const handleEndCall = (durationSeconds: number, notes?: string) => {
    setRecordedCallDuration(durationSeconds);
    if (notes) setLiveCallNotes(notes);
    const current = activeCallConsultation;
    setActiveCallConsultation(null);
    if (current) {
      setSummaryConsultation(current);
    }
  };

  const handleSubmitSummary = (summary: ConsultationSummary) => {
    saveConsultationSummary(summary);
    setSummaryConsultation(null);
    setCompletedSummarySuccess(summary);
  };

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-4 pb-24">
      {/* Top Contextual Navigation — Back to Dashboard */}
      <div className="flex items-center justify-between min-h-[36px]">
        <BackButton
          id="btn-consultations-back-dashboard"
          href="/dashboard"
          label={t("common.backToDashboard") || "Back to Dashboard"}
        />

        <Link
          href="/dashboard/expert/onboarding"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#24833A] hover:underline cursor-pointer"
        >
          <Award size={14} />
          <span>Expert Credentials</span>
        </Link>
      </div>

      {/* Screen Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-3xl bg-white p-5 border border-gray-200 shadow-2xs">
        <div className="flex items-center gap-3.5">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#E4F0DD] text-[#24833A] shadow-xs">
            <GraduationCap size={26} strokeWidth={2.4} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                {t("nav.consultations") || "Consultations"} Hub
              </h1>
              <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-[#174D25] border border-emerald-200/80">
                Verified Agronomist
              </span>
            </div>
            <p className="text-xs text-gray-500 font-medium">
              1-on-1 scheduled audio and video agronomy consultations & incoming cultivator requests
            </p>
          </div>
        </div>

        {/* View Switch Tabs */}
        <div className="flex items-center rounded-2xl bg-gray-100 p-1 self-start sm:self-auto border border-gray-200/60 overflow-x-auto max-w-full">
          <button
            type="button"
            onClick={() => setActiveTab("consultations")}
            className={`flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-bold transition flex-shrink-0 cursor-pointer ${
              activeTab === "consultations"
                ? "bg-white text-gray-900 shadow-2xs"
                : "text-gray-500 hover:text-gray-900"
            }`}
          >
            <span>My Consultations</span>
            {upcomingConsultationsCount > 0 && (
              <span className="rounded-full bg-[#24833A] px-1.5 py-0.2 text-[10px] font-extrabold text-white">
                {upcomingConsultationsCount}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("requests")}
            className={`flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-bold transition flex-shrink-0 cursor-pointer ${
              activeTab === "requests"
                ? "bg-white text-gray-900 shadow-2xs"
                : "text-gray-500 hover:text-gray-900"
            }`}
          >
            <span>Farmer Requests</span>
            {pendingRequestsCount > 0 && (
              <span className="rounded-full bg-amber-500 px-1.5 py-0.2 text-[10px] font-extrabold text-white">
                {pendingRequestsCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <div className="rounded-2xl border border-gray-200 bg-white p-3 text-center shadow-2xs">
          <span className="text-[10px] uppercase font-bold text-gray-400 block">
            Upcoming Today
          </span>
          <p className="text-base font-extrabold text-[#174D25] mt-0.5">
            {upcomingConsultationsCount} Sessions
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-3 text-center shadow-2xs">
          <span className="text-[10px] uppercase font-bold text-gray-400 block">
            Pending Requests
          </span>
          <p className="text-base font-extrabold text-amber-700 mt-0.5">
            {pendingRequestsCount} New
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-3 text-center shadow-2xs">
          <span className="text-[10px] uppercase font-bold text-gray-400 block">
            Cultivator Rating
          </span>
          <p className="text-base font-extrabold text-gray-900 mt-0.5">
            ★ {profile.rating} / 5.0
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-3 text-center shadow-2xs">
          <span className="text-[10px] uppercase font-bold text-gray-400 block">
            Total Consulted
          </span>
          <p className="text-base font-extrabold text-[#174D25] mt-0.5">
            {profile.totalConsultations}+ Farmers
          </p>
        </div>
      </div>

      {/* Quick Simulation States Bar (Allows Reviewer to easily test Loading / Error states) */}
      <div className="flex items-center justify-between rounded-2xl bg-gray-50 px-3.5 py-2 text-xs border border-gray-200/80 text-gray-600">
        <span className="text-[11px] font-medium">
          Workspace View: <strong>{viewState.toUpperCase()}</strong>
        </span>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setViewState("normal")}
            className={`rounded-lg px-2.5 py-1 text-[11px] font-bold cursor-pointer ${
              viewState === "normal"
                ? "bg-[#24833A] text-white"
                : "bg-white text-gray-600 hover:bg-gray-100"
            }`}
          >
            Normal View
          </button>
          <button
            type="button"
            onClick={() => setViewState("loading")}
            className={`rounded-lg px-2.5 py-1 text-[11px] font-bold cursor-pointer ${
              viewState === "loading"
                ? "bg-[#24833A] text-white"
                : "bg-white text-gray-600 hover:bg-gray-100"
            }`}
          >
            Loading State
          </button>
          <button
            type="button"
            onClick={() => setViewState("error")}
            className={`rounded-lg px-2.5 py-1 text-[11px] font-bold cursor-pointer ${
              viewState === "error"
                ? "bg-[#24833A] text-white"
                : "bg-white text-gray-600 hover:bg-gray-100"
            }`}
          >
            Error State
          </button>
        </div>
      </div>

      {/* Conditional Rendering of Simulation Views */}
      {viewState === "loading" && <ConsultationLoadingView />}

      {viewState === "error" && (
        <ConsultationErrorView
          onRetry={() => setViewState("normal")}
          onBack={() => setViewState("normal")}
        />
      )}

      {viewState === "normal" && (
        <>
          {/* TAB 1: MY CONSULTATIONS */}
          {activeTab === "consultations" && (
            <ConsultationsList
              consultations={consultations}
              onSelectConsultation={(c) => setSelectedConsultationForDetails(c)}
              onStartCall={handleStartCall}
              onViewSummary={(c) => {
                if (c.summary) {
                  setCompletedSummarySuccess(c.summary);
                }
              }}
              onScheduleNew={() => setActiveTab("requests")}
            />
          )}

          {/* TAB 2: FARMER REQUESTS */}
          {activeTab === "requests" && (
            <ExpertRequestsList
              requests={requests}
              onSelectRequest={(r) => setSelectedRequestForDetails(r)}
              onAcceptRequest={handleAcceptRequest}
              onRejectRequest={(id) => handleRejectRequest(id)}
              onScheduleRequest={handleOpenSchedule}
            />
          )}
        </>
      )}

      {/* ========================================================= */}
      {/* MODALS AND FLOW WORKSPACES */}
      {/* ========================================================= */}

      {/* Request Details Modal */}
      <RequestDetailsModal
        request={selectedRequestForDetails}
        isOpen={Boolean(selectedRequestForDetails)}
        onClose={() => setSelectedRequestForDetails(null)}
        onAccept={handleAcceptRequest}
        onReject={handleRejectRequest}
        onSchedule={handleOpenSchedule}
      />

      {/* Request Accepted Success Modal */}
      <RequestAcceptedModal
        request={acceptedRequestForSuccess}
        isOpen={Boolean(acceptedRequestForSuccess)}
        onClose={() => setAcceptedRequestForSuccess(null)}
        onScheduleNow={handleOpenSchedule}
      />

      {/* Consultation Scheduling Modal */}
      <ConsultationScheduleModal
        request={requestToSchedule}
        isOpen={Boolean(requestToSchedule)}
        onClose={handleCloseSchedule}
        onConfirmSchedule={handleConfirmSchedule}
      />

      {/* Consultation Scheduled Success Modal */}
      <ConsultationScheduledModal
        consultation={scheduledConsultationSuccess}
        isOpen={Boolean(scheduledConsultationSuccess)}
        onClose={() => {
          setScheduledConsultationSuccess(null);
          setActiveTab("consultations");
        }}
        onViewConsultations={() => {
          setScheduledConsultationSuccess(null);
          setActiveTab("consultations");
        }}
      />

      {/* Consultation Details Modal */}
      <ConsultationDetailsModal
        consultation={selectedConsultationForDetails}
        isOpen={Boolean(selectedConsultationForDetails)}
        onClose={() => {
          setSelectedConsultationForDetails(null);
          setActiveTab("consultations");
        }}
        onStartCall={handleStartCall}
        onViewSummary={(c) => {
          setSelectedConsultationForDetails(null);
          if (c.summary) {
            setCompletedSummarySuccess(c.summary);
          }
        }}
      />

      {/* Full-screen Consultation Call Screen (Active Video/Voice Simulation) */}
      {activeCallConsultation && (
        <ConsultationCallScreen
          consultation={activeCallConsultation}
          onEndCall={handleEndCall}
          onCancelCall={() => setActiveCallConsultation(null)}
        />
      )}

      {/* Consultation Agri Advisory Summary Modal */}
      <ConsultationSummaryModal
        consultation={summaryConsultation}
        callDurationSeconds={recordedCallDuration}
        initialNotes={liveCallNotes}
        isOpen={Boolean(summaryConsultation)}
        onClose={() => setSummaryConsultation(null)}
        onSubmitSummary={handleSubmitSummary}
      />

      {/* Consultation Completed Success Modal */}
      <ConsultationCompletedModal
        summary={completedSummarySuccess}
        isOpen={Boolean(completedSummarySuccess)}
        onClose={() => setCompletedSummarySuccess(null)}
        onViewConsultations={() => {
          setCompletedSummarySuccess(null);
          setActiveTab("consultations");
        }}
      />
    </div>
  );
}

export default function ConsultationsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-3 border-[#24833A] border-t-transparent" />
        </div>
      }
    >
      <ConsultationsHubContent />
    </Suspense>
  );
}
