"use client";

import React, { useState } from "react";
import {
  X,
  User,
  FileText,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  HelpCircle,
  Clock,
  ShieldCheck,
  Building2,
  Calendar,
  MapPin,
  Phone,
  Landmark,
  ArrowRight,
  Send,
} from "lucide-react";
import { GovtApplicationItem, useGovernmentStore } from "@/store/government-store";

interface GovtApplicationDetailModalProps {
  application: GovtApplicationItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function GovtApplicationDetailModal({
  application,
  isOpen,
  onClose,
}: GovtApplicationDetailModalProps) {
  const { approveApplication, rejectApplication, requestClarification, markForVerification } =
    useGovernmentStore();

  const [confirmApproveOpen, setConfirmApproveOpen] = useState(false);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [rejectError, setRejectError] = useState("");

  const [clarificationModalOpen, setClarificationModalOpen] = useState(false);
  const [clarificationText, setClarificationText] = useState("");
  const [clarificationError, setClarificationError] = useState("");

  if (!isOpen || !application) return null;

  const getStatusBadge = (status: GovtApplicationItem["status"]) => {
    switch (status) {
      case "approved":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-[#174D25] border border-emerald-200">
            <CheckCircle2 size={12} /> Approved
          </span>
        );
      case "disbursed":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-bold text-blue-800 border border-blue-200">
            <CheckCircle2 size={12} /> Disbursed
          </span>
        );
      case "under_verification":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-purple-50 px-2.5 py-0.5 text-xs font-bold text-purple-800 border border-purple-200">
            <Clock size={12} /> Under Verification
          </span>
        );
      case "rejected":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2.5 py-0.5 text-xs font-bold text-red-800 border border-red-200">
            <XCircle size={12} /> Rejected
          </span>
        );
      case "pending":
      default:
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-bold text-amber-800 border border-amber-200">
            <Clock size={12} /> Pending Verification
          </span>
        );
    }
  };

  const handleApproveConfirm = () => {
    approveApplication(application.id);
    setConfirmApproveOpen(false);
  };

  const handleRejectSubmit = () => {
    if (!rejectionReason.trim()) {
      setRejectError("Please provide a specific rejection reason for the cultivator record.");
      return;
    }
    rejectApplication(application.id, rejectionReason.trim());
    setRejectModalOpen(false);
    setRejectionReason("");
    setRejectError("");
  };

  const handleClarificationSubmit = () => {
    if (!clarificationText.trim()) {
      setClarificationError("Please specify what additional documents or clarification are required.");
      return;
    }
    requestClarification(application.id, clarificationText.trim());
    setClarificationModalOpen(false);
    setClarificationText("");
    setClarificationError("");
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-xs overflow-y-auto"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-2xl rounded-3xl bg-white shadow-2xl border border-gray-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-gray-100 bg-[#F4FBF5] p-4 sm:p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#E4F0DD] text-[#24833A]">
              <FileText size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-[#174D25]">
                  {application.id}
                </span>
                {getStatusBadge(application.status)}
              </div>
              <h2 className="text-base sm:text-lg font-bold text-gray-900 mt-0.5">
                {application.farmerName}
              </h2>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-xl text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition cursor-pointer"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="overflow-y-auto p-4 sm:p-6 flex flex-col gap-5 text-xs text-gray-700">
          {/* Rejection / Clarification Notice if applicable */}
          {application.status === "rejected" && application.rejectionReason && (
            <div className="rounded-2xl border border-red-200 bg-red-50/70 p-4">
              <div className="flex items-center gap-2 text-red-800 font-bold mb-1">
                <XCircle size={16} /> Official Rejection Reason
              </div>
              <p className="text-red-700 leading-relaxed">{application.rejectionReason}</p>
            </div>
          )}

          {application.clarificationRequirements && (
            <div className="rounded-2xl border border-purple-200 bg-purple-50/70 p-4">
              <div className="flex items-center gap-2 text-purple-900 font-bold mb-1">
                <HelpCircle size={16} /> Clarification Requested from Cultivator
              </div>
              <p className="text-purple-800 leading-relaxed">
                {application.clarificationRequirements}
              </p>
            </div>
          )}

          {/* Scheme & Benefit Summary */}
          <div className="rounded-2xl border border-gray-200 bg-[#FAFBF9] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                Applied Scheme
              </span>
              <h3 className="text-sm font-bold text-gray-900 mt-0.5">
                {application.schemeName}
              </h3>
              <p className="text-[11px] text-gray-500 mt-0.5">
                Submitted on {application.submittedDate}
              </p>
            </div>
            <div className="flex flex-col sm:items-end">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                Sanctioned Benefit
              </span>
              <span className="text-base font-extrabold text-[#174D25] mt-0.5">
                {application.benefitAmount}
              </span>
            </div>
          </div>

          {/* Farmer & Landholding Profile */}
          <div className="rounded-2xl border border-gray-200 p-4 flex flex-col gap-3">
            <h4 className="font-bold uppercase tracking-wider text-gray-800 text-[11px]">
              Cultivator Demographics & Land Details
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="flex items-center gap-2">
                <User size={15} className="text-[#24833A]" />
                <span className="text-gray-500">Aadhaar (UIDAI):</span>
                <span className="font-mono font-bold text-gray-800">
                  •••• •••• {application.farmerAadhaarLast4}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={15} className="text-[#24833A]" />
                <span className="text-gray-500">Contact Number:</span>
                <span className="font-semibold text-gray-800">+91 {application.farmerMobile}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin size={15} className="text-[#24833A]" />
                <span className="text-gray-500">Location:</span>
                <span className="font-semibold text-gray-800">
                  {application.village}, {application.mandal}, {application.district}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck size={15} className="text-[#24833A]" />
                <span className="text-gray-500">Total Landholding:</span>
                <span className="font-bold text-emerald-800">{application.farmerLandholding}</span>
              </div>
            </div>
          </div>

          {/* Submitted Documents & Verification Check */}
          <div className="rounded-2xl border border-gray-200 p-4 flex flex-col gap-3">
            <h4 className="font-bold uppercase tracking-wider text-gray-800 text-[11px]">
              Submitted Verification Documents
            </h4>
            <div className="flex flex-col divide-y divide-gray-100">
              {application.documentsSubmitted.map((doc, idx) => (
                <div key={idx} className="flex items-center justify-between py-2.5">
                  <div className="flex items-center gap-2.5">
                    <FileText size={16} className="text-gray-400" />
                    <span className="font-medium text-gray-800">{doc.name}</span>
                  </div>
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                      doc.verified
                        ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                        : "bg-amber-50 text-amber-800 border border-amber-200"
                    }`}
                  >
                    {doc.verified ? (
                      <>
                        <CheckCircle2 size={11} /> Verified
                      </>
                    ) : (
                      <>
                        <Clock size={11} /> Pending Review
                      </>
                    )}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Audit Trail & History Timeline */}
          <div className="rounded-2xl border border-gray-200 p-4 flex flex-col gap-3">
            <h4 className="font-bold uppercase tracking-wider text-gray-800 text-[11px]">
              Application Lifecycle Timeline
            </h4>
            <div className="flex flex-col gap-3 pl-2 border-l-2 border-[#24833A]/30">
              {application.timeline.map((event, idx) => (
                <div key={idx} className="flex flex-col gap-0.5 relative pl-3">
                  <span className="absolute -left-[19px] top-1.5 h-2 w-2 rounded-full bg-[#24833A]" />
                  <span className="font-bold text-gray-900 text-xs">{event.title}</span>
                  <div className="flex items-center gap-2 text-[10px] text-gray-400">
                    <span>{event.date}</span>
                    <span>•</span>
                    <span className="text-gray-600 font-medium">{event.actor}</span>
                  </div>
                  {event.note && (
                    <p className="mt-1 text-[11px] text-gray-600 bg-gray-50 p-2 rounded-lg">
                      {event.note}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Actions Footer */}
        <div className="border-t border-gray-100 bg-gray-50 p-4 flex flex-wrap items-center justify-between gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-xs font-bold text-gray-700 hover:bg-gray-100 transition cursor-pointer"
          >
            Close
          </button>

          <div className="flex flex-wrap items-center gap-2">
            {application.status === "pending" && (
              <button
                type="button"
                onClick={() => markForVerification(application.id)}
                className="rounded-xl bg-purple-700 px-3.5 py-2 text-xs font-bold text-white hover:bg-purple-800 transition cursor-pointer"
              >
                Mark for Field Verification
              </button>
            )}

            {application.status !== "rejected" && application.status !== "disbursed" && (
              <>
                <button
                  type="button"
                  onClick={() => setClarificationModalOpen(true)}
                  className="rounded-xl border border-purple-200 bg-purple-50 px-3.5 py-2 text-xs font-bold text-purple-800 hover:bg-purple-100 transition cursor-pointer"
                >
                  Request Clarification
                </button>

                <button
                  type="button"
                  onClick={() => setRejectModalOpen(true)}
                  className="rounded-xl border border-red-200 bg-red-50 px-3.5 py-2 text-xs font-bold text-red-700 hover:bg-red-100 transition cursor-pointer"
                >
                  Reject
                </button>
              </>
            )}

            {application.status !== "approved" && application.status !== "disbursed" && (
              <button
                type="button"
                onClick={() => setConfirmApproveOpen(true)}
                className="rounded-xl bg-[#24833A] px-4 py-2 text-xs font-bold text-white hover:bg-[#174D25] transition cursor-pointer shadow-xs"
              >
                Approve Application
              </button>
            )}
          </div>
        </div>

        {/* Confirmation Modal: Approve */}
        {confirmApproveOpen && (
          <div className="absolute inset-0 z-60 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <div className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-2xl border border-gray-100 flex flex-col gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-[#24833A]">
                <CheckCircle2 size={24} />
              </div>
              <h3 className="text-base font-bold text-gray-900">Confirm Application Approval</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Are you sure you want to approve welfare benefit for{" "}
                <strong>{application.farmerName}</strong> ({application.benefitAmount})? This will
                generate an official approval certificate in the audit log.
              </p>
              <div className="mt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setConfirmApproveOpen(false)}
                  className="rounded-xl border border-gray-200 px-3.5 py-1.5 text-xs font-bold text-gray-600 hover:bg-gray-50 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleApproveConfirm}
                  className="rounded-xl bg-[#24833A] px-4 py-1.5 text-xs font-bold text-white hover:bg-[#174D25] transition cursor-pointer"
                >
                  Yes, Approve
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Reason Modal: Reject */}
        {rejectModalOpen && (
          <div className="absolute inset-0 z-60 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <div className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-2xl border border-gray-100 flex flex-col gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-600">
                <AlertTriangle size={24} />
              </div>
              <h3 className="text-base font-bold text-gray-900">Reject Application</h3>
              <p className="text-xs text-gray-600">
                Please enter a mandatory administrative justification for rejecting application{" "}
                <strong>{application.id}</strong>:
              </p>
              <textarea
                value={rejectionReason}
                onChange={(e) => {
                  setRejectionReason(e.target.value);
                  if (rejectError) setRejectError("");
                }}
                rows={3}
                placeholder="e.g. Mismatch in survey records, invalid Aadhaar documentation..."
                className="w-full rounded-xl border border-gray-200 p-2.5 text-xs text-gray-800 placeholder-gray-400 focus:border-red-500 focus:outline-hidden"
              />
              {rejectError && <p className="text-[11px] text-red-600 font-semibold">{rejectError}</p>}
              <div className="mt-1 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setRejectModalOpen(false);
                    setRejectError("");
                  }}
                  className="rounded-xl border border-gray-200 px-3.5 py-1.5 text-xs font-bold text-gray-600 hover:bg-gray-50 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleRejectSubmit}
                  className="rounded-xl bg-red-600 px-4 py-1.5 text-xs font-bold text-white hover:bg-red-700 transition cursor-pointer"
                >
                  Confirm Rejection
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal: Request Clarification */}
        {clarificationModalOpen && (
          <div className="absolute inset-0 z-60 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <div className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-2xl border border-gray-100 flex flex-col gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-700">
                <HelpCircle size={24} />
              </div>
              <h3 className="text-base font-bold text-gray-900">Request Cultivator Clarification</h3>
              <p className="text-xs text-gray-600">
                Specify what additional proof or documentation the farmer must submit through their
                local RBK or self-service portal:
              </p>
              <textarea
                value={clarificationText}
                onChange={(e) => {
                  setClarificationText(e.target.value);
                  if (clarificationError) setClarificationError("");
                }}
                rows={3}
                placeholder="e.g. Submit updated CCRC tenant lease endorsement signed by VRO..."
                className="w-full rounded-xl border border-gray-200 p-2.5 text-xs text-gray-800 placeholder-gray-400 focus:border-purple-600 focus:outline-hidden"
              />
              {clarificationError && (
                <p className="text-[11px] text-red-600 font-semibold">{clarificationError}</p>
              )}
              <div className="mt-1 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setClarificationModalOpen(false);
                    setClarificationError("");
                  }}
                  className="rounded-xl border border-gray-200 px-3.5 py-1.5 text-xs font-bold text-gray-600 hover:bg-gray-50 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleClarificationSubmit}
                  className="rounded-xl bg-purple-700 px-4 py-1.5 text-xs font-bold text-white hover:bg-purple-800 transition cursor-pointer"
                >
                  Send Request
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
