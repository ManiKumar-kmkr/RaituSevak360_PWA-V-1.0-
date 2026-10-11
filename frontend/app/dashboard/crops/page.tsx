"use client";

import React, { useState } from "react";
import { Sprout, CheckCircle2, AlertTriangle, Calendar, Plus, X } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { useAuthStore } from "@/store/auth-store";
import BackButton from "@/components/ui/BackButton";
import GovtCropMonitoringView from "@/components/government/GovtCropMonitoringView";

export default function CropsPage() {
  const user = useAuthStore((state) => state.user);
  const selectedRole = useAuthStore((state) => state.selectedRole);
  const activeRole = (user?.role || selectedRole || "farmer").toLowerCase();

  // Government / NGO Representative gets administrative district-level crop monitoring
  if (activeRole === "government" || activeRole === "govt") {
    return <GovtCropMonitoringView />;
  }

  return <FarmerCropsView />;
}

function FarmerCropsView() {
  const { t } = useTranslation();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [advisoryModalCrop, setAdvisoryModalCrop] = useState<string | null>(null);
  const [newCropName, setNewCropName] = useState("");
  const [newCropAcreage, setNewCropAcreage] = useState("");
  const [advisoryNote, setAdvisoryNote] = useState("");
  const [feedbackSuccess, setFeedbackSuccess] = useState<string | null>(null);

  const [cropsList, setCropsList] = useState([
    {
      id: "CRP-1",
      name: "Paddy (BPT 5204)",
      stage: "Vegetative Growth (Day 42)",
      health: "Healthy",
      acreage: "3.5 Acres",
      statusColor: "text-emerald-700 bg-emerald-50",
      latestAdvisory: "Apply basal NPK and monitor field boundaries for yellow stem borer larvae.",
    },
    {
      id: "CRP-2",
      name: "Cotton (Bt Hybrid)",
      stage: "Flowering & Boll Formation",
      health: "Mild Pest Watch",
      acreage: "2.0 Acres",
      statusColor: "text-amber-700 bg-amber-50",
      latestAdvisory: "Install 4 pheromone traps/acre to detect adult pink bollworm emergence.",
    },
  ]);

  const handleAddCrop = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCropName.trim()) return;
    setCropsList((prev) => [
      ...prev,
      {
        id: `CRP-${prev.length + 1}`,
        name: newCropName.trim(),
        stage: "Early Vegetative",
        health: "Healthy",
        acreage: newCropAcreage.trim() ? `${newCropAcreage.trim()} Acres` : "1.0 Acre",
        statusColor: "text-emerald-700 bg-emerald-50",
        latestAdvisory: undefined,
      },
    ]);
    setNewCropName("");
    setNewCropAcreage("");
    setIsAddModalOpen(false);
    setFeedbackSuccess("Crop cycle added successfully!");
    setTimeout(() => setFeedbackSuccess(null), 3000);
  };

  const handleSaveAdvisory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!advisoryModalCrop || !advisoryNote.trim()) return;
    const targetCrop = advisoryModalCrop;
    const note = advisoryNote.trim();
    setCropsList((prev) =>
      prev.map((c) =>
        c.name === targetCrop
          ? {
              ...c,
              latestAdvisory: note,
            }
          : c
      )
    );
    setAdvisoryModalCrop(null);
    setAdvisoryNote("");
    setFeedbackSuccess(`Advisory note recorded for ${targetCrop}!`);
    setTimeout(() => setFeedbackSuccess(null), 3000);
  };

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-5 pb-20">
      {/* Top Contextual Back Navigation */}
      <div className="flex items-center justify-between">
        <BackButton
          id="btn-crops-back-dashboard"
          href="/dashboard"
          label={t("common.backToDashboard") || "Back to Dashboard"}
        />
      </div>

      {feedbackSuccess && (
        <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-3.5 text-xs font-bold text-[#174D25] flex items-center gap-2">
          <CheckCircle2 size={16} className="text-[#24833A]" />
          <span>{feedbackSuccess}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-3xl bg-white p-5 border border-gray-200 shadow-2xs">
        <div className="flex items-center gap-3.5">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#E4F0DD] text-[#24833A] shadow-xs">
            <Sprout size={26} strokeWidth={2.4} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-bold text-gray-900">
                Crop Health & Monitoring
              </h1>
              <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-[#24833A]">
                Active Cycle
              </span>
            </div>
            <p className="text-xs text-gray-500 font-medium">
              Track growth stages, irrigation schedule and pest defense
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#24833A] px-4 py-2.5 text-xs font-semibold text-white shadow-xs transition hover:bg-[#1e6e30] active:scale-95 cursor-pointer"
        >
          <Plus size={16} />
          <span>Add New Crop</span>
        </button>
      </div>

      {/* Crops List */}
      <div className="flex flex-col gap-3">
        {cropsList.map((crop) => (
          <div
            key={crop.id}
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-gray-200 bg-white p-4 shadow-2xs transition hover:border-[#24833A]/40"
          >
            <div className="flex items-start gap-3.5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#F4FBF5] text-[#24833A]">
                <Sprout size={22} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-sm font-bold text-gray-900">
                    {crop.name}
                  </h2>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${crop.statusColor}`}
                  >
                    {crop.health}
                  </span>
                </div>
                <p className="text-xs text-gray-600 mt-0.5">{crop.stage}</p>
                <span className="text-[11px] text-gray-400">Plot Size: {crop.acreage}</span>

                {crop.latestAdvisory && (
                  <div className="mt-2.5 rounded-xl bg-emerald-50/80 border border-emerald-200/70 p-2.5 text-xs text-[#174D25]">
                    <span className="font-bold text-[10px] uppercase text-[#24833A] block">
                      Active Agronomy Advisory:
                    </span>
                    <p className="mt-0.5 text-gray-800 font-medium leading-relaxed">
                      {crop.latestAdvisory}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-center">
              <button
                type="button"
                onClick={() => setAdvisoryModalCrop(crop.name)}
                className="rounded-xl border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-100 transition cursor-pointer"
              >
                Log Advisory
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add New Crop Modal */}
      {isAddModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs"
          onClick={() => setIsAddModalOpen(false)}
        >
          <div
            className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-5 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-base font-bold text-gray-900">Register New Crop Cycle</h3>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleAddCrop} className="mt-4 flex flex-col gap-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Crop Name & Variety</label>
                <input
                  type="text"
                  required
                  value={newCropName}
                  onChange={(e) => setNewCropName(e.target.value)}
                  placeholder="e.g. Chilli (Teja Variety)"
                  className="w-full h-10 rounded-xl border border-gray-200 px-3 text-xs focus:outline-none focus:border-[#24833A]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Plot Size (Acres)</label>
                <input
                  type="text"
                  value={newCropAcreage}
                  onChange={(e) => setNewCropAcreage(e.target.value)}
                  placeholder="e.g. 2.5"
                  className="w-full h-10 rounded-xl border border-gray-200 px-3 text-xs focus:outline-none focus:border-[#24833A]"
                />
              </div>
              <div className="mt-2 flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="rounded-xl border border-gray-200 px-3.5 py-2 text-xs font-bold text-gray-600 hover:bg-gray-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-[#24833A] px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-[#1e6e30] cursor-pointer"
                >
                  Save Crop
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Log Advisory Modal */}
      {advisoryModalCrop && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs"
          onClick={() => setAdvisoryModalCrop(null)}
        >
          <div
            className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-5 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-gray-900">Log Agronomy Advisory</h3>
                <p className="text-xs text-gray-500">{advisoryModalCrop}</p>
              </div>
              <button
                type="button"
                onClick={() => setAdvisoryModalCrop(null)}
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleSaveAdvisory} className="mt-4 flex flex-col gap-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Advisory Diagnosis & Spray Schedule</label>
                <textarea
                  rows={3}
                  required
                  value={advisoryNote}
                  onChange={(e) => setAdvisoryNote(e.target.value)}
                  placeholder="Record observed vegetative condition and recommended foliar spray dosage..."
                  className="w-full rounded-xl border border-gray-200 p-3 text-xs focus:outline-none focus:border-[#24833A] resize-none"
                />
              </div>
              <div className="mt-2 flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setAdvisoryModalCrop(null)}
                  className="rounded-xl border border-gray-200 px-3.5 py-2 text-xs font-bold text-gray-600 hover:bg-gray-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-[#24833A] px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-[#1e6e30] cursor-pointer"
                >
                  Record Advisory
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
