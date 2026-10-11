"use client";

import React, { useState } from "react";
import {
  FileText,
  CheckCircle2,
  Calendar,
  Clock,
  Plus,
  Trash2,
  Sprout,
  X,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { ExpertConsultation, ConsultationSummary } from "@/types/expert";

interface ConsultationSummaryModalProps {
  consultation: ExpertConsultation | null;
  callDurationSeconds?: number;
  initialNotes?: string;
  isOpen: boolean;
  onClose: () => void;
  onSubmitSummary: (summary: ConsultationSummary) => void;
}

export default function ConsultationSummaryModal({
  consultation,
  callDurationSeconds = 180,
  initialNotes,
  isOpen,
  onClose,
  onSubmitSummary,
}: ConsultationSummaryModalProps) {
  const [issueDiagnosed, setIssueDiagnosed] = useState(
    consultation?.topic || "Chilli Leaf Curl & Micro-nutrient Deficiency"
  );
  const [clinicalNotes, setClinicalNotes] = useState(
    initialNotes ||
      consultation?.notes ||
      "Visual examination confirmed characteristic upward curling caused by thrips vectors. Early stage infestation; foliage retains vigorous root health."
  );

  React.useEffect(() => {
    if (initialNotes && initialNotes.trim()) {
      setClinicalNotes(initialNotes.trim());
    }
  }, [initialNotes]);

  const [recommendations, setRecommendations] = useState<string[]>([
    "Spray Acetamiprid 20% SP @ 0.2g/L or Fipronil 5% SC @ 2ml/L during morning hours.",
    "Apply Micronutrient Foliar Mixture (Zinc + Boron + Iron) @ 2.5g/L to support shoot recovery.",
    "Ensure soil moisture is maintained before chemical application; avoid water stress.",
  ]);
  const [newRecommendation, setNewRecommendation] = useState("");
  const [followUpNeeded, setFollowUpNeeded] = useState(true);
  const [followUpDays, setFollowUpDays] = useState(7);

  if (!isOpen || !consultation) return null;

  const handleAddRec = () => {
    if (!newRecommendation.trim()) return;
    setRecommendations([...recommendations, newRecommendation.trim()]);
    setNewRecommendation("");
  };

  const handleRemoveRec = (idx: number) => {
    setRecommendations(recommendations.filter((_, i) => i !== idx));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const summary: ConsultationSummary = {
      id: `SUM-${Math.floor(100 + Math.random() * 900)}`,
      consultationId: consultation.id,
      farmerName: consultation.farmerName,
      crop: consultation.crop,
      issueDiagnosed: issueDiagnosed.trim(),
      clinicalNotes: clinicalNotes.trim(),
      recommendations,
      followUpNeeded,
      followUpDays: followUpNeeded ? followUpDays : undefined,
      prescribedTreatments: recommendations.slice(0, 2),
      completedAt: "Today, Just now",
      rating: 5,
    };

    onSubmitSummary(summary);
  };

  const minutes = Math.ceil(callDurationSeconds / 60);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs animate-in fade-in duration-150 overflow-y-auto"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="summary-modal-title"
    >
      <div
        className="w-full max-w-lg rounded-2xl border border-gray-200 bg-white p-5 sm:p-6 shadow-2xl animate-in zoom-in-95 duration-150 my-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 pb-3.5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E4F0DD] text-[#24833A]">
              <FileText size={20} />
            </div>
            <div>
              <h2
                id="summary-modal-title"
                className="text-base sm:text-lg font-bold text-gray-900"
              >
                Agri Consultation Summary
              </h2>
              <p className="text-xs text-gray-500">
                Record crop diagnostic findings, agronomic advice, and follow-up
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-xl text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition cursor-pointer"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Call Metadata Banner */}
        <div className="mt-4 rounded-2xl border border-gray-100 bg-[#F7F9F6] p-3 text-xs flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-gray-900">{consultation.farmerName}</span>
            <span className="text-gray-300">•</span>
            <span className="text-gray-600">{consultation.crop}</span>
          </div>

          <div className="flex items-center gap-1.5 font-bold text-[#174D25] bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
            <Clock size={12} />
            <span>Duration: {minutes} mins</span>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-4 text-xs text-gray-700 max-h-[65vh] overflow-y-auto pr-1">
          {/* Issue Diagnosed */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Identified Crop Issue / Field Assessment *
            </label>
            <input
              type="text"
              required
              value={issueDiagnosed}
              onChange={(e) => setIssueDiagnosed(e.target.value)}
              placeholder="e.g. Chilli Leaf Curl Virus / Stem Borer Infestation"
              className="h-10 w-full rounded-xl border border-gray-200 bg-white px-3 text-xs text-gray-900 focus:outline-none focus:border-[#24833A] focus:ring-2 focus:ring-[#24833A]/20 transition"
            />
          </div>

          {/* Observations / Notes */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Field Observations & Agronomy Notes *
            </label>
            <textarea
              rows={3}
              required
              value={clinicalNotes}
              onChange={(e) => setClinicalNotes(e.target.value)}
              placeholder="Symptoms observed, leaf curl/pest count, soil moisture, severity level..."
              className="w-full rounded-xl border border-gray-200 bg-white p-3 text-xs text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-[#24833A] focus:ring-2 focus:ring-[#24833A]/20 transition resize-none"
            />
          </div>

          {/* Recommended Treatments */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Treatment & Agronomic Recommendations
            </label>
            <div className="flex flex-col gap-2 mb-2">
              {recommendations.map((rec, i) => (
                <div
                  key={i}
                  className="flex items-start justify-between gap-2 rounded-xl bg-gray-50 p-2.5 border border-gray-100"
                >
                  <span className="text-gray-800 leading-relaxed font-medium">
                    {i + 1}. {rec}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveRec(i)}
                    className="text-gray-400 hover:text-rose-600 p-0.5 shrink-0"
                    title="Remove item"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              ))}
            </div>

            {/* Add Recommendation Row */}
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={newRecommendation}
                onChange={(e) => setNewRecommendation(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddRec();
                  }
                }}
                placeholder="Add chemical/bio dosage, spray timing, or fertilizer instruction..."
                className="h-9 flex-1 rounded-xl border border-gray-200 bg-white px-3 text-xs text-gray-800 focus:outline-none focus:border-[#24833A]"
              />
              <button
                type="button"
                onClick={handleAddRec}
                className="inline-flex items-center gap-1 rounded-xl bg-gray-100 px-3 py-2 text-xs font-bold text-gray-700 hover:bg-gray-200 cursor-pointer"
              >
                <Plus size={13} />
                <span>Add</span>
              </button>
            </div>
          </div>

          {/* Follow-up Section */}
          <div className="rounded-2xl border border-gray-200 p-3.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-900">
                Recommend Follow-up Session?
              </span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={followUpNeeded}
                  onChange={(e) => setFollowUpNeeded(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#24833A]" />
              </label>
            </div>

            {followUpNeeded && (
              <div className="mt-2.5 pt-2 border-t border-gray-100 flex items-center justify-between">
                <span className="text-[11px] text-gray-500">Suggested Timeline:</span>
                <div className="flex items-center gap-1.5">
                  {[5, 7, 14].map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setFollowUpDays(d)}
                      className={`rounded-lg px-2.5 py-1 text-xs font-semibold cursor-pointer ${
                        followUpDays === d
                          ? "bg-[#24833A] text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      In {d} Days
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Action Row */}
          <div className="mt-2 flex items-center justify-end gap-2.5 pt-3 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-gray-200 px-4 py-2.5 text-xs font-bold text-gray-700 hover:bg-gray-50 active:scale-95 cursor-pointer"
            >
              Save Draft
            </button>

            <button
              type="submit"
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#24833A] px-5 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-[#1e6e30] active:scale-95 cursor-pointer"
            >
              <CheckCircle2 size={14} />
              <span>Submit & Complete</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
