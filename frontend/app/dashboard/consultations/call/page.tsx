"use client";

import React, { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useExpertStore } from "@/store/expert-store";
import ConsultationCallScreen from "@/components/expert/ConsultationCallScreen";
import ConsultationSummaryModal from "@/components/expert/ConsultationSummaryModal";
import ConsultationCompletedModal from "@/components/expert/ConsultationCompletedModal";
import { ConsultationSummary, ExpertConsultation } from "@/types/expert";
import BackButton from "@/components/ui/BackButton";

function ConsultationCallContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const consultationId = searchParams.get("id");
  const consultations = useExpertStore((state) => state.consultations);
  const saveConsultationSummary = useExpertStore((state) => state.saveConsultationSummary);

  const consultation =
    consultations.find((c) => c.id === consultationId) || consultations[0];

  const [callDuration, setCallDuration] = useState<number>(120);
  const [showSummary, setShowSummary] = useState(false);
  const [completedSummary, setCompletedSummary] = useState<ConsultationSummary | null>(null);
  const [liveNotes, setLiveNotes] = useState<string>("");
  if (!consultation) {
    return (
      <div className="min-h-screen bg-[#F4F8EE] flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-xl font-bold text-gray-900 mb-2">No Consultation Selected</h2>
        <p className="text-sm text-gray-600 mb-6">
          Please select a consultation from your schedule to start the session.
        </p>
        <button
          onClick={() => router.push("/dashboard/consultations")}
          className="h-11 px-6 rounded-xl bg-[#24833A] text-white font-semibold hover:bg-[#174D25] transition-colors"
        >
          Go to Consultations
        </button>
      </div>
    );
  }


  const handleEndCall = (durationSec: number, notes?: string) => {
    setCallDuration(durationSec);
    if (notes) setLiveNotes(notes);
    setShowSummary(true);
  };

  const handleSaveSummary = (summary: ConsultationSummary) => {
    saveConsultationSummary(summary);
    setShowSummary(false);
    setCompletedSummary(summary);
  };

  return (
    <>
      <ConsultationCallScreen
        consultation={consultation}
        onEndCall={handleEndCall}
        onClose={() => router.push("/dashboard/consultations")}
      />

      {showSummary && (
        <ConsultationSummaryModal
          consultation={consultation}
          callDurationSeconds={callDuration}
          initialNotes={liveNotes}
          isOpen={true}
          onClose={() => router.push("/dashboard/consultations")}
          onSubmitSummary={handleSaveSummary}
        />
      )}

      {completedSummary && (
        <ConsultationCompletedModal
          isOpen={true}
          summary={completedSummary}
          onClose={() => router.push("/dashboard/consultations")}
          onViewConsultations={() => router.push("/dashboard/consultations")}
        />
      )}
    </>
  );
}

export default function ConsultationCallPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">
          <p className="text-sm font-medium">Connecting call session...</p>
        </div>
      }
    >
      <ConsultationCallContent />
    </Suspense>
  );
}
