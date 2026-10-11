"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ShieldCheck,
  Building2,
  UserCheck,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Upload,
  Eye,
  Edit3,
  X,
  ArrowRight,
  ArrowLeft,
  Clock,
  MapPin,
  Mail,
  Phone,
  Briefcase,
  AlertOctagon,
  RotateCcw,
  Sparkles,
  Check,
  Info,
  Calendar,
  Layers,
  HelpCircle,
  ExternalLink,
} from "lucide-react";
import BackButton from "@/components/ui/BackButton";
import { useTranslation } from "@/hooks/useTranslation";
import {
  useGovernmentStore,
  GovtOnboardingData,
  GovtVerificationStatus,
  GovtDocumentStatus,
  GovtOrganizationType,
  GovtDepartmentRole,
} from "@/store/government-store";

export default function GovtOnboardingWizard() {
  const router = useRouter();
  const { t } = useTranslation();

  const onboardingData = useGovernmentStore((state) => state.onboardingData);
  const updateOnboardingData = useGovernmentStore((state) => state.updateOnboardingData);
  const updateOnboardingDocument = useGovernmentStore((state) => state.updateOnboardingDocument);
  const submitOnboardingForVerification = useGovernmentStore(
    (state) => state.submitOnboardingForVerification
  );
  const setVerificationStatus = useGovernmentStore((state) => state.setVerificationStatus);
  const resetOnboarding = useGovernmentStore((state) => state.resetOnboarding);

  // Active step (1: Organization, 2: Representative, 3: Credentials, 4: Review)
  const [currentStep, setCurrentStep] = useState<number>(onboardingData.currentStep || 1);

  // Form local state initialized from store
  const [formData, setFormData] = useState<GovtOnboardingData>({ ...onboardingData });

  // Confirmation Modals
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [isProfileUpdateModalOpen, setIsProfileUpdateModalOpen] = useState(false);

  // Inline validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Toast / Feedback message
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Sync field update
  const handleFieldChange = (field: keyof GovtOnboardingData, val: any) => {
    setFormData((prev) => ({ ...prev, [field]: val }));
    updateOnboardingData({ [field]: val });
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  // Step 1 Validation
  const validateStep1 = (): boolean => {
    const errs: Record<string, string> = {};
    if (!formData.organizationName.trim()) errs.organizationName = "Organization Name is required.";
    if (!formData.departmentMinistry.trim())
      errs.departmentMinistry = "Department / Ministry is required.";
    if (!formData.state.trim()) errs.state = "State is required.";
    if (!formData.district.trim()) errs.district = "District is required.";
    if (!formData.mandal.trim()) errs.mandal = "Mandal is required.";
    if (!formData.officeAddress.trim()) errs.officeAddress = "Office address is required.";
    if (!formData.registrationRefNumber.trim())
      errs.registrationRefNumber = "Department / Registration Ref No is required.";

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Step 2 Validation
  const validateStep2 = (): boolean => {
    const errs: Record<string, string> = {};
    if (!formData.fullName.trim()) errs.fullName = "Full Name is required.";
    if (!formData.designation.trim()) errs.designation = "Designation is required.";
    if (formData.departmentRole === "Other" && !formData.customDesignation?.trim()) {
      errs.customDesignation = "Custom designation is required when 'Other' is selected.";
    }
    if (!formData.employeeOfficerId.trim())
      errs.employeeOfficerId = "Employee / Officer ID is required.";
    if (!formData.officialEmail.trim() || !formData.officialEmail.includes("@")) {
      errs.officialEmail = "A valid official email address is required.";
    }
    if (!formData.officialPhone.trim()) errs.officialPhone = "Official phone number is required.";
    if (!formData.officeLocation.trim()) errs.officeLocation = "Office location is required.";
    if (!formData.yearsOfService.trim()) errs.yearsOfService = "Years of service is required.";

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Step 3 Validation
  const validateStep3 = (): boolean => {
    const errs: Record<string, string> = {};
    const { documents, organizationType } = formData;

    if (documents.govtId.status === "not_submitted") {
      errs.govtId = "Official Government / Organization ID is required.";
    }
    if (documents.appointmentLetter.status === "not_submitted") {
      errs.appointmentLetter = "Official Appointment / Authorization Letter is required.";
    }
    if (documents.orgRegistrationProof.status === "not_submitted") {
      errs.orgRegistrationProof = "Department / Organization Registration Proof is required.";
    }
    if (organizationType === "NGO" && (!documents.ngoCertificate || documents.ngoCertificate.status === "not_submitted")) {
      errs.ngoCertificate = "NGO Registration Certificate is required for NGO representatives.";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Navigation handlers
  const handleNextStep = () => {
    if (currentStep === 1) {
      if (!validateStep1()) return;
      setCurrentStep(2);
      updateOnboardingData({ currentStep: 2 });
    } else if (currentStep === 2) {
      if (!validateStep2()) return;
      setCurrentStep(3);
      updateOnboardingData({ currentStep: 3 });
    } else if (currentStep === 3) {
      if (!validateStep3()) return;
      setCurrentStep(4);
      updateOnboardingData({ currentStep: 4 });
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      const prev = currentStep - 1;
      setCurrentStep(prev);
      updateOnboardingData({ currentStep: prev });
    }
  };

  // Save as Draft
  const handleSaveDraft = () => {
    updateOnboardingData({ ...formData, verificationStatus: "draft", currentStep });
    showToast("Onboarding progress saved as Draft.");
  };

  // Mock File Upload Simulator
  const handleMockUpload = (
    docKey: keyof GovtOnboardingData["documents"],
    sampleFileName: string,
    fileSize: string
  ) => {
    const today = new Date().toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

    updateOnboardingDocument(docKey, {
      fileName: sampleFileName,
      fileType: "application/pdf",
      fileSize,
      status: "submitted",
      uploadedAt: today,
    });

    setFormData((prev) => ({
      ...prev,
      documents: {
        ...prev.documents,
        [docKey]: {
          ...prev.documents[docKey],
          fileName: sampleFileName,
          fileType: "application/pdf",
          fileSize,
          status: "submitted",
          uploadedAt: today,
        },
      },
    }));

    if (errors[docKey]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[docKey];
        return next;
      });
    }

    showToast(`Document "${sampleFileName}" attached successfully.`);
  };

  const handleRemoveDocument = (docKey: keyof GovtOnboardingData["documents"]) => {
    updateOnboardingDocument(docKey, {
      fileName: undefined,
      fileType: undefined,
      fileSize: undefined,
      status: "not_submitted",
      uploadedAt: undefined,
    });

    setFormData((prev) => ({
      ...prev,
      documents: {
        ...prev.documents,
        [docKey]: {
          ...prev.documents[docKey],
          fileName: undefined,
          fileType: undefined,
          fileSize: undefined,
          status: "not_submitted",
          uploadedAt: undefined,
        },
      },
    }));

    showToast("Document removed.");
  };

  // Final Submit
  const handleFinalSubmit = () => {
    submitOnboardingForVerification();
    setIsSubmitModalOpen(false);
    showToast("Verification request submitted successfully.");
  };

  // Status Badge Helper
  const renderDocumentStatusBadge = (status: GovtDocumentStatus) => {
    switch (status) {
      case "verified":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700 border border-emerald-200">
            <CheckCircle2 size={12} className="text-[#24833A]" /> Verified
          </span>
        );
      case "under_review":
      case "submitted":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-[11px] font-bold text-amber-800 border border-amber-200">
            <Clock size={12} className="text-amber-600" /> Pending Review
          </span>
        );
      case "clarification_required":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-orange-50 px-2.5 py-0.5 text-[11px] font-bold text-orange-800 border border-orange-200">
            <AlertTriangle size={12} className="text-orange-600" /> Clarification Required
          </span>
        );
      case "rejected":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2.5 py-0.5 text-[11px] font-bold text-rose-800 border border-rose-200">
            <AlertOctagon size={12} className="text-rose-600" /> Rejected
          </span>
        );
      case "not_submitted":
      default:
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-0.5 text-[11px] font-semibold text-gray-600 border border-gray-200">
            Not Submitted
          </span>
        );
    }
  };

  const renderOverallStatusBadge = (status: GovtVerificationStatus) => {
    switch (status) {
      case "verified":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800 border border-emerald-300">
            <CheckCircle2 size={14} className="text-[#24833A]" /> Verified Representative
          </span>
        );
      case "under_review":
      case "submitted":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-900 border border-amber-300">
            <Clock size={14} className="text-amber-700" /> Credentials Under Review
          </span>
        );
      case "clarification_required":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-orange-100 px-3 py-1 text-xs font-bold text-orange-900 border border-orange-300">
            <AlertTriangle size={14} className="text-orange-700" /> Clarification Required
          </span>
        );
      case "rejected":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-100 px-3 py-1 text-xs font-bold text-rose-900 border border-rose-300">
            <AlertOctagon size={14} className="text-rose-700" /> Verification Rejected
          </span>
        );
      case "draft":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-900 border border-blue-300">
            <Edit3 size={14} className="text-blue-700" /> Draft Application
          </span>
        );
      case "not_started":
      default:
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1 text-xs font-bold text-gray-700 border border-gray-300">
            Not Started
          </span>
        );
    }
  };

  const isSubmittedOrReviewed =
    onboardingData.verificationStatus === "submitted" ||
    onboardingData.verificationStatus === "under_review" ||
    onboardingData.verificationStatus === "clarification_required" ||
    onboardingData.verificationStatus === "rejected" ||
    onboardingData.verificationStatus === "verified";

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-5 pb-20">
      {/* Toast Banner */}
      {toastMessage && (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/95 p-3.5 text-xs font-bold text-[#174D25] shadow-xs flex items-center justify-between animate-fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={16} className="text-[#24833A] shrink-0" />
            <span>{toastMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            className="text-emerald-700 hover:text-emerald-900 text-xs px-2 cursor-pointer font-semibold"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* SINGLE VISIBLE BACK CONTROL: Back to Dashboard */}
      <div className="flex items-center justify-between">
        <BackButton
          id="btn-onboarding-back-to-dashboard"
          href="/dashboard"
          label={t("common.backToDashboard") || "Back to Dashboard"}
        />
      </div>

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-3xl bg-white p-5 sm:p-6 border border-gray-200 shadow-2xs">
        <div className="flex items-start gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#E4F0DD] text-[#24833A] shadow-xs">
            <ShieldCheck size={28} strokeWidth={2.4} />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                Government Representative Verification
              </h1>
              {renderOverallStatusBadge(onboardingData.verificationStatus)}
            </div>
            <p className="text-xs sm:text-sm text-gray-500 font-medium mt-1">
              Complete your official profile and submit your credentials for verification.
            </p>
          </div>
        </div>

        {/* Demo State Switcher for Fast Evaluation */}
        <div className="flex flex-wrap items-center gap-1.5 self-start sm:self-auto rounded-xl bg-gray-50 p-1.5 border border-gray-200">
          <span className="text-[10px] font-bold uppercase text-gray-400 px-1">Test State:</span>
          {(
            [
              { id: "draft", label: "Draft" },
              { id: "under_review", label: "Under Review" },
              { id: "clarification_required", label: "Clarification" },
              { id: "rejected", label: "Rejected" },
              { id: "verified", label: "Verified" },
            ] as const
          ).map((st) => (
            <button
              key={st.id}
              type="button"
              onClick={() => {
                if (st.id === "clarification_required") {
                  setVerificationStatus("clarification_required", {
                    clarificationReason:
                      "Please provide a clearer, higher-resolution copy of the official appointment order showing the government gazette seal.",
                  });
                } else if (st.id === "rejected") {
                  setVerificationStatus("rejected", {
                    rejectionReason:
                      "Employee ID card image was unreadable and department seal could not be verified by the secretariat verification cell.",
                    reviewerNote:
                      "Please upload official scanned PDF documents and re-verify contact phone number.",
                  });
                } else if (st.id === "verified") {
                  setVerificationStatus("verified", {
                    verifiedDate: "09 Oct 2026",
                  });
                } else {
                  setVerificationStatus(st.id);
                }
                showToast(`Switched demo state to: ${st.label}`);
              }}
              className={`rounded-lg px-2 py-1 text-[10px] font-bold transition cursor-pointer ${
                onboardingData.verificationStatus === st.id
                  ? "bg-[#24833A] text-white shadow-2xs"
                  : "text-gray-600 hover:bg-gray-200"
              }`}
            >
              {st.label}
            </button>
          ))}
        </div>
      </div>

      {/* =========================================================
          VIEW A: POST-SUBMISSION STATUS DASHBOARD
      ========================================================= */}
      {isSubmittedOrReviewed && onboardingData.verificationStatus !== "draft" ? (
        <div className="flex flex-col gap-5 animate-fade-in">
          {/* Status Details Card */}
          <div className="rounded-3xl border border-gray-200 bg-white p-5 sm:p-6 shadow-2xs flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-gray-100 pb-4">
              <div>
                <span className="text-[10px] font-bold uppercase text-gray-400">Application Reference</span>
                <p className="font-mono text-base font-bold text-gray-900">
                  {onboardingData.referenceNumber || "GOV-VER-2026-8419"}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500 font-medium">Submitted:</span>
                <span className="text-xs font-bold text-gray-900">
                  {onboardingData.submissionDate || "08 Oct 2026"}
                </span>
              </div>
            </div>

            {/* Status-specific banners and directives */}
            {onboardingData.verificationStatus === "under_review" && (
              <div className="rounded-2xl border border-amber-200 bg-amber-50/70 p-4 text-xs text-amber-950 flex flex-col gap-1.5">
                <div className="flex items-center gap-2 font-bold text-amber-900">
                  <Clock size={16} className="text-amber-700" />
                  <span>Your credentials are currently being reviewed.</span>
                </div>
                <p className="text-gray-700 leading-relaxed font-medium pl-6">
                  The authorized state verification desk is authenticating your employee ID and departmental authorization letter. Official verification typically takes 1–2 business days.
                </p>
              </div>
            )}

            {onboardingData.verificationStatus === "clarification_required" && (
              <div className="rounded-2xl border border-orange-300 bg-orange-50/80 p-4 text-xs text-orange-950 flex flex-col gap-2.5">
                <div className="flex items-center gap-2 font-bold text-orange-900">
                  <AlertTriangle size={18} className="text-orange-700 shrink-0" />
                  <span>Verification team requested additional information.</span>
                </div>
                <div className="rounded-xl bg-white/80 p-3 border border-orange-200">
                  <span className="text-[10px] font-bold uppercase text-orange-700 block">Clarification Reason:</span>
                  <p className="font-semibold text-gray-900 mt-0.5 leading-relaxed">
                    {onboardingData.clarificationReason ||
                      "Please provide a clearer, higher-resolution copy of the official appointment order showing the government gazette seal."}
                  </p>
                </div>
                <div className="flex items-center justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setCurrentStep(3);
                      setVerificationStatus("draft");
                    }}
                    className="rounded-xl bg-orange-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-orange-700 transition cursor-pointer"
                  >
                    Update Documents
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setVerificationStatus("under_review");
                      showToast("Resubmitted credentials for verification review.");
                    }}
                    className="rounded-xl bg-[#24833A] px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-[#174D25] transition cursor-pointer"
                  >
                    Resubmit for Verification
                  </button>
                </div>
              </div>
            )}

            {onboardingData.verificationStatus === "rejected" && (
              <div className="rounded-2xl border border-rose-300 bg-rose-50/80 p-4 text-xs text-rose-950 flex flex-col gap-2.5">
                <div className="flex items-center gap-2 font-bold text-rose-900">
                  <AlertOctagon size={18} className="text-rose-700 shrink-0" />
                  <span>Verification Request Rejected</span>
                </div>
                <div className="rounded-xl bg-white/80 p-3 border border-rose-200">
                  <span className="text-[10px] font-bold uppercase text-rose-700 block">Rejection Reason:</span>
                  <p className="font-semibold text-gray-900 mt-0.5 leading-relaxed">
                    {onboardingData.rejectionReason ||
                      "Employee ID card image was unreadable and department seal could not be verified by the secretariat verification cell."}
                  </p>
                  {onboardingData.reviewerNote && (
                    <p className="text-gray-600 mt-1 text-[11px]">
                      <strong>Reviewer Note:</strong> {onboardingData.reviewerNote}
                    </p>
                  )}
                </div>
                <div className="flex items-center justify-end pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setCurrentStep(1);
                      setVerificationStatus("draft");
                      showToast("Application unlocked for updates.");
                    }}
                    className="rounded-xl bg-rose-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-rose-700 transition cursor-pointer"
                  >
                    Update & Resubmit
                  </button>
                </div>
              </div>
            )}

            {onboardingData.verificationStatus === "verified" && (
              <div className="rounded-2xl border border-emerald-300 bg-emerald-50/80 p-4 text-xs text-emerald-950 flex flex-col gap-2.5">
                <div className="flex items-center gap-2 font-bold text-emerald-900">
                  <CheckCircle2 size={18} className="text-[#24833A] shrink-0" />
                  <span>Government Representative Verified</span>
                </div>
                <p className="text-gray-700 leading-relaxed font-medium pl-6">
                  Your credentials have been successfully authenticated. You possess verified authority to administer welfare schemes, publish alerts, and manage district agricultural audits.
                </p>
                <div className="flex items-center justify-between border-t border-emerald-200 pt-2 text-[11px] text-gray-600">
                  <span>
                    Verified On: <strong>{onboardingData.verifiedDate || "09 Oct 2026"}</strong>
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsProfileUpdateModalOpen(true)}
                    className="font-bold text-[#24833A] hover:underline cursor-pointer"
                  >
                    Request Profile Update
                  </button>
                </div>
              </div>
            )}

            {/* Profile Overview Card */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4 flex flex-col gap-2">
                <span className="text-[10px] font-bold uppercase text-gray-400">Organization Details</span>
                <p className="text-sm font-bold text-gray-900">{onboardingData.organizationName}</p>
                <p className="text-xs text-gray-600">{onboardingData.departmentMinistry}</p>
                <p className="text-xs text-gray-500">
                  {onboardingData.officeAddress}, {onboardingData.mandal}, {onboardingData.district}
                </p>
                <span className="text-[11px] font-mono text-gray-400 mt-1">
                  Reg No: {onboardingData.registrationRefNumber}
                </span>
              </div>

              <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4 flex flex-col gap-2">
                <span className="text-[10px] font-bold uppercase text-gray-400">Representative Details</span>
                <p className="text-sm font-bold text-gray-900">{onboardingData.fullName}</p>
                <p className="text-xs font-semibold text-[#174D25]">{onboardingData.designation}</p>
                <p className="text-xs text-gray-600">
                  ID: <span className="font-mono">{onboardingData.employeeOfficerId}</span> • {onboardingData.yearsOfService} Service
                </p>
                <p className="text-xs text-gray-500">{onboardingData.officialEmail} • {onboardingData.officialPhone}</p>
              </div>
            </div>

            {/* Document Checklist */}
            <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4 flex flex-col gap-2.5">
              <span className="text-[10px] font-bold uppercase text-gray-400">Submitted Credential Documents</span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                {Object.entries(onboardingData.documents).map(([key, doc]) => {
                  if (!doc || doc.status === "not_submitted") return null;
                  return (
                    <div key={key} className="rounded-xl border border-gray-200 bg-white p-2.5 flex flex-col justify-between">
                      <div>
                        <span className="font-bold text-gray-800 line-clamp-1">{doc.name}</span>
                        <span className="text-[11px] text-gray-500 block truncate">{doc.fileName}</span>
                      </div>
                      <div className="mt-2 pt-1.5 border-t border-gray-100 flex items-center justify-between">
                        <span className="text-[10px] text-gray-400">{doc.fileSize}</span>
                        {renderDocumentStatusBadge(doc.status)}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center justify-between gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => {
                  setCurrentStep(1);
                  setVerificationStatus("draft");
                }}
                className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-xs font-bold text-gray-700 hover:bg-gray-50 transition cursor-pointer"
              >
                Edit Profile Information
              </button>

              <div className="flex items-center gap-2 flex-wrap">
                <button
                  type="button"
                  id="btn-goto-verification-workspace"
                  onClick={() => router.push("/dashboard/government/verification")}
                  className="rounded-xl border border-[#24833A]/30 bg-[#F4FBF5] px-4 py-2 text-xs font-bold text-[#174D25] hover:bg-[#E4F0DD] transition cursor-pointer"
                >
                  Verification Workspace →
                </button>
                <button
                  type="button"
                  onClick={() => router.push("/dashboard")}
                  className="rounded-xl bg-[#24833A] px-5 py-2 text-xs font-bold text-white shadow-xs hover:bg-[#174D25] transition cursor-pointer"
                >
                  Return to Dashboard
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* =========================================================
            VIEW B: 4-STEP ONBOARDING & VERIFICATION WIZARD
        ========================================================= */
        <div className="flex flex-col gap-5 animate-fade-in">
          {/* Progress Indicator */}
          <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-2xs">
            <div className="grid grid-cols-4 gap-2">
              {[
                { step: 1, label: "Organization", icon: <Building2 size={16} /> },
                { step: 2, label: "Representative", icon: <UserCheck size={16} /> },
                { step: 3, label: "Credentials", icon: <FileText size={16} /> },
                { step: 4, label: "Review", icon: <CheckCircle2 size={16} /> },
              ].map((item) => {
                const isCurrent = currentStep === item.step;
                const isCompleted = currentStep > item.step;

                return (
                  <button
                    key={item.step}
                    type="button"
                    onClick={() => {
                      if (item.step < currentStep) setCurrentStep(item.step);
                    }}
                    className={`flex flex-col items-center sm:flex-row sm:justify-center gap-1.5 rounded-xl p-2.5 transition text-center sm:text-left ${
                      isCurrent
                        ? "bg-[#F4FBF5] text-[#24833A] font-bold border border-[#24833A]/30"
                        : isCompleted
                        ? "text-gray-700 font-semibold hover:bg-gray-50 cursor-pointer"
                        : "text-gray-400 font-medium"
                    }`}
                  >
                    <div
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                        isCurrent
                          ? "bg-[#24833A] text-white"
                          : isCompleted
                          ? "bg-emerald-100 text-[#24833A]"
                          : "bg-gray-100 text-gray-400"
                      }`}
                    >
                      {isCompleted ? <Check size={14} strokeWidth={3} /> : item.step}
                    </div>
                    <span className="text-xs hidden sm:inline">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Form Container */}
          <div className="rounded-3xl border border-gray-200 bg-white p-5 sm:p-6 shadow-2xs">
            {/* =========================================================
                STEP 1: ORGANIZATION DETAILS
            ========================================================= */}
            {currentStep === 1 && (
              <div className="flex flex-col gap-5 animate-fade-in">
                <div className="border-b border-gray-100 pb-3">
                  <h2 className="text-base sm:text-lg font-bold text-gray-900">Step 1 — Organization Details</h2>
                  <p className="text-xs text-gray-500">Provide official department, agency or NGO registration particulars.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Organization Type <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={formData.organizationType}
                      onChange={(e) => handleFieldChange("organizationType", e.target.value as GovtOrganizationType)}
                      className="w-full h-11 rounded-xl border border-gray-200 px-3 text-xs font-medium focus:border-[#24833A] focus:outline-none"
                    >
                      <option value="Government Department">Government Department</option>
                      <option value="Government Agency">Government Agency</option>
                      <option value="Local Government Body">Local Government Body (Zilla / Mandal Parishad)</option>
                      <option value="NGO">Non-Governmental Organization (NGO)</option>
                      <option value="Agricultural Development Organization">Agricultural Development Organization</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Organization Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.organizationName}
                      onChange={(e) => handleFieldChange("organizationName", e.target.value)}
                      placeholder="e.g. Department of Agriculture & Farmers Welfare"
                      className={`w-full h-11 rounded-xl border px-3.5 text-xs focus:border-[#24833A] focus:outline-none ${
                        errors.organizationName ? "border-rose-400 bg-rose-50/30" : "border-gray-200"
                      }`}
                    />
                    {errors.organizationName && <p className="text-[11px] text-rose-600 mt-1">{errors.organizationName}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Department / Ministry <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.departmentMinistry}
                      onChange={(e) => handleFieldChange("departmentMinistry", e.target.value)}
                      placeholder="e.g. Ministry of Agriculture, Govt. of Andhra Pradesh"
                      className={`w-full h-11 rounded-xl border px-3.5 text-xs focus:border-[#24833A] focus:outline-none ${
                        errors.departmentMinistry ? "border-rose-400 bg-rose-50/30" : "border-gray-200"
                      }`}
                    />
                    {errors.departmentMinistry && <p className="text-[11px] text-rose-600 mt-1">{errors.departmentMinistry}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      State <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.state}
                      onChange={(e) => handleFieldChange("state", e.target.value)}
                      placeholder="e.g. Andhra Pradesh"
                      className={`w-full h-11 rounded-xl border px-3.5 text-xs focus:border-[#24833A] focus:outline-none ${
                        errors.state ? "border-rose-400 bg-rose-50/30" : "border-gray-200"
                      }`}
                    />
                    {errors.state && <p className="text-[11px] text-rose-600 mt-1">{errors.state}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      District <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.district}
                      onChange={(e) => handleFieldChange("district", e.target.value)}
                      placeholder="e.g. Guntur"
                      className={`w-full h-11 rounded-xl border px-3.5 text-xs focus:border-[#24833A] focus:outline-none ${
                        errors.district ? "border-rose-400 bg-rose-50/30" : "border-gray-200"
                      }`}
                    />
                    {errors.district && <p className="text-[11px] text-rose-600 mt-1">{errors.district}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Mandal / Local Administrative Area <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.mandal}
                      onChange={(e) => handleFieldChange("mandal", e.target.value)}
                      placeholder="e.g. Guntur Urban"
                      className={`w-full h-11 rounded-xl border px-3.5 text-xs focus:border-[#24833A] focus:outline-none ${
                        errors.mandal ? "border-rose-400 bg-rose-50/30" : "border-gray-200"
                      }`}
                    />
                    {errors.mandal && <p className="text-[11px] text-rose-600 mt-1">{errors.mandal}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Official Website (Optional)</label>
                    <input
                      type="url"
                      value={formData.officialWebsite || ""}
                      onChange={(e) => handleFieldChange("officialWebsite", e.target.value)}
                      placeholder="https://..."
                      className="w-full h-11 rounded-xl border border-gray-200 px-3.5 text-xs focus:border-[#24833A] focus:outline-none"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Office Address <span className="text-rose-500">*</span>
                    </label>
                    <textarea
                      rows={2}
                      value={formData.officeAddress}
                      onChange={(e) => handleFieldChange("officeAddress", e.target.value)}
                      placeholder="Collectorate Complex, Nagarampalem, Guntur - 522004"
                      className={`w-full rounded-xl border p-3 text-xs focus:border-[#24833A] focus:outline-none resize-none ${
                        errors.officeAddress ? "border-rose-400 bg-rose-50/30" : "border-gray-200"
                      }`}
                    />
                    {errors.officeAddress && <p className="text-[11px] text-rose-600 mt-1">{errors.officeAddress}</p>}
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Organization Registration / Department Reference Number <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.registrationRefNumber}
                      onChange={(e) => handleFieldChange("registrationRefNumber", e.target.value)}
                      placeholder="e.g. AP-AGRI-DEPT-2024/9182"
                      className={`w-full h-11 rounded-xl border px-3.5 text-xs font-mono focus:border-[#24833A] focus:outline-none ${
                        errors.registrationRefNumber ? "border-rose-400 bg-rose-50/30" : "border-gray-200"
                      }`}
                    />
                    {errors.registrationRefNumber && (
                      <p className="text-[11px] text-rose-600 mt-1">{errors.registrationRefNumber}</p>
                    )}
                  </div>
                </div>

                {/* Step 1 Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => router.push("/dashboard")}
                    className="rounded-xl border border-gray-200 px-4 py-2.5 text-xs font-bold text-gray-600 hover:bg-gray-50 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleSaveDraft}
                      className="rounded-xl border border-amber-300 bg-amber-50 px-4 py-2.5 text-xs font-bold text-amber-800 hover:bg-amber-100 cursor-pointer"
                    >
                      Save as Draft
                    </button>
                    <button
                      type="button"
                      onClick={handleNextStep}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-[#24833A] px-5 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-[#174D25] cursor-pointer"
                    >
                      <span>Save & Continue</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* =========================================================
                STEP 2: REPRESENTATIVE DETAILS
            ========================================================= */}
            {currentStep === 2 && (
              <div className="flex flex-col gap-5 animate-fade-in">
                <div className="border-b border-gray-100 pb-3">
                  <h2 className="text-base sm:text-lg font-bold text-gray-900">Step 2 — Representative Details</h2>
                  <p className="text-xs text-gray-500">Provide official identity credentials of the designated officer.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Full Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.fullName}
                      onChange={(e) => handleFieldChange("fullName", e.target.value)}
                      placeholder="e.g. Dr. K. V. Ramanjaneyulu"
                      className={`w-full h-11 rounded-xl border px-3.5 text-xs focus:border-[#24833A] focus:outline-none ${
                        errors.fullName ? "border-rose-400 bg-rose-50/30" : "border-gray-200"
                      }`}
                    />
                    {errors.fullName && <p className="text-[11px] text-rose-600 mt-1">{errors.fullName}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Designation <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.designation}
                      onChange={(e) => handleFieldChange("designation", e.target.value)}
                      placeholder="e.g. District Agriculture Officer (DAO)"
                      className={`w-full h-11 rounded-xl border px-3.5 text-xs focus:border-[#24833A] focus:outline-none ${
                        errors.designation ? "border-rose-400 bg-rose-50/30" : "border-gray-200"
                      }`}
                    />
                    {errors.designation && <p className="text-[11px] text-rose-600 mt-1">{errors.designation}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Department Role <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={formData.departmentRole}
                      onChange={(e) => handleFieldChange("departmentRole", e.target.value as GovtDepartmentRole)}
                      className="w-full h-11 rounded-xl border border-gray-200 px-3 text-xs font-medium focus:border-[#24833A] focus:outline-none"
                    >
                      <option value="Agriculture Officer">Agriculture Officer</option>
                      <option value="District Agriculture Officer">District Agriculture Officer</option>
                      <option value="Mandal Agriculture Officer">Mandal Agriculture Officer</option>
                      <option value="Government Program Coordinator">Government Program Coordinator</option>
                      <option value="NGO Program Manager">NGO Program Manager</option>
                      <option value="Field Coordinator">Field Coordinator</option>
                      <option value="Other">Other (Custom Designation)</option>
                    </select>
                  </div>

                  {formData.departmentRole === "Other" && (
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        Custom Role Designation <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.customDesignation || ""}
                        onChange={(e) => handleFieldChange("customDesignation", e.target.value)}
                        placeholder="e.g. Senior Agronomist Liaison"
                        className={`w-full h-11 rounded-xl border px-3.5 text-xs focus:border-[#24833A] focus:outline-none ${
                          errors.customDesignation ? "border-rose-400 bg-rose-50/30" : "border-gray-200"
                        }`}
                      />
                      {errors.customDesignation && (
                        <p className="text-[11px] text-rose-600 mt-1">{errors.customDesignation}</p>
                      )}
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Employee / Officer ID <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.employeeOfficerId}
                      onChange={(e) => handleFieldChange("employeeOfficerId", e.target.value)}
                      placeholder="e.g. AP-GOV-AGRI-8472"
                      className={`w-full h-11 rounded-xl border px-3.5 text-xs font-mono focus:border-[#24833A] focus:outline-none ${
                        errors.employeeOfficerId ? "border-rose-400 bg-rose-50/30" : "border-gray-200"
                      }`}
                    />
                    {errors.employeeOfficerId && (
                      <p className="text-[11px] text-rose-600 mt-1">{errors.employeeOfficerId}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Official Email <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="email"
                      value={formData.officialEmail}
                      onChange={(e) => handleFieldChange("officialEmail", e.target.value)}
                      placeholder="e.g. officer@ap.gov.in"
                      className={`w-full h-11 rounded-xl border px-3.5 text-xs focus:border-[#24833A] focus:outline-none ${
                        errors.officialEmail ? "border-rose-400 bg-rose-50/30" : "border-gray-200"
                      }`}
                    />
                    {errors.officialEmail && <p className="text-[11px] text-rose-600 mt-1">{errors.officialEmail}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Official Phone Number <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="tel"
                      value={formData.officialPhone}
                      onChange={(e) => handleFieldChange("officialPhone", e.target.value)}
                      placeholder="e.g. +91 94401 28472"
                      className={`w-full h-11 rounded-xl border px-3.5 text-xs focus:border-[#24833A] focus:outline-none ${
                        errors.officialPhone ? "border-rose-400 bg-rose-50/30" : "border-gray-200"
                      }`}
                    />
                    {errors.officialPhone && <p className="text-[11px] text-rose-600 mt-1">{errors.officialPhone}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Office Location <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.officeLocation}
                      onChange={(e) => handleFieldChange("officeLocation", e.target.value)}
                      placeholder="e.g. District Headquarters, Guntur"
                      className={`w-full h-11 rounded-xl border px-3.5 text-xs focus:border-[#24833A] focus:outline-none ${
                        errors.officeLocation ? "border-rose-400 bg-rose-50/30" : "border-gray-200"
                      }`}
                    />
                    {errors.officeLocation && <p className="text-[11px] text-rose-600 mt-1">{errors.officeLocation}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Years of Service <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.yearsOfService}
                      onChange={(e) => handleFieldChange("yearsOfService", e.target.value)}
                      placeholder="e.g. 14 Years"
                      className={`w-full h-11 rounded-xl border px-3.5 text-xs focus:border-[#24833A] focus:outline-none ${
                        errors.yearsOfService ? "border-rose-400 bg-rose-50/30" : "border-gray-200"
                      }`}
                    />
                    {errors.yearsOfService && <p className="text-[11px] text-rose-600 mt-1">{errors.yearsOfService}</p>}
                  </div>
                </div>

                {/* Step 2 Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={handlePrevStep}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 px-4 py-2.5 text-xs font-bold text-gray-700 hover:bg-gray-50 cursor-pointer"
                  >
                    <ArrowLeft size={14} />
                    <span>Back</span>
                  </button>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleSaveDraft}
                      className="rounded-xl border border-amber-300 bg-amber-50 px-4 py-2.5 text-xs font-bold text-amber-800 hover:bg-amber-100 cursor-pointer"
                    >
                      Save as Draft
                    </button>
                    <button
                      type="button"
                      onClick={handleNextStep}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-[#24833A] px-5 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-[#174D25] cursor-pointer"
                    >
                      <span>Save & Continue</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* =========================================================
                STEP 3: CREDENTIALS & DOCUMENTS
            ========================================================= */}
            {currentStep === 3 && (
              <div className="flex flex-col gap-5 animate-fade-in">
                <div className="border-b border-gray-100 pb-3">
                  <h2 className="text-base sm:text-lg font-bold text-gray-900">Step 3 — Credentials Verification</h2>
                  <p className="text-xs text-gray-500">
                    Upload official government identity cards, authorization letters, and organization proofs.
                  </p>
                </div>

                {/* Disclaimer Alert */}
                <div className="rounded-2xl border border-blue-200 bg-blue-50/60 p-3.5 text-xs text-blue-900 flex items-start gap-2.5">
                  <Info size={16} className="text-blue-700 shrink-0 mt-0.5" />
                  <p className="leading-relaxed font-medium">
                    Documents will be reviewed by the authorized verification team. Allowed UI formats: PDF, JPG, JPEG, PNG. All uploaded credentials are encrypted and accessed solely for administrative authorization.
                  </p>
                </div>

                {/* Documents Dropzone List */}
                <div className="flex flex-col gap-3.5">
                  {/* Doc 1: Government / Organization ID */}
                  <div
                    className={`rounded-2xl border p-4 transition ${
                      errors.govtId
                        ? "border-rose-400 bg-rose-50/20"
                        : formData.documents.govtId.status === "submitted"
                        ? "border-emerald-300 bg-emerald-50/20"
                        : "border-gray-200 bg-white"
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-gray-900">1. Government / Organization ID</span>
                          <span className="text-rose-500 font-bold">*</span>
                          {renderDocumentStatusBadge(formData.documents.govtId.status)}
                        </div>
                        <p className="text-xs text-gray-500 mt-0.5">
                          Official gazetted employee ID, departmental badge, or authorized photo credentials.
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        {formData.documents.govtId.fileName ? (
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs text-gray-700 bg-gray-100 px-2.5 py-1 rounded-lg">
                              {formData.documents.govtId.fileName} ({formData.documents.govtId.fileSize})
                            </span>
                            <button
                              type="button"
                              onClick={() => handleRemoveDocument("govtId")}
                              className="text-xs font-bold text-rose-600 hover:text-rose-800 cursor-pointer"
                            >
                              Remove
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleMockUpload("govtId", "AP_Officer_ID_Card.pdf", "1.4 MB")}
                            className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-xs font-bold text-gray-700 hover:border-[#24833A] hover:text-[#24833A] transition cursor-pointer shadow-xs"
                          >
                            <Upload size={14} />
                            <span>Select File</span>
                          </button>
                        )}
                      </div>
                    </div>
                    {errors.govtId && <p className="text-[11px] text-rose-600 mt-2">{errors.govtId}</p>}
                  </div>

                  {/* Doc 2: Official Appointment / Authorization Letter */}
                  <div
                    className={`rounded-2xl border p-4 transition ${
                      errors.appointmentLetter
                        ? "border-rose-400 bg-rose-50/20"
                        : formData.documents.appointmentLetter.status === "submitted"
                        ? "border-emerald-300 bg-emerald-50/20"
                        : "border-gray-200 bg-white"
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-gray-900">
                            2. Official Appointment / Authorization Letter
                          </span>
                          <span className="text-rose-500 font-bold">*</span>
                          {renderDocumentStatusBadge(formData.documents.appointmentLetter.status)}
                        </div>
                        <p className="text-xs text-gray-500 mt-0.5">
                          Gazette notification, appointment decree, or head of department assignment order.
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        {formData.documents.appointmentLetter.fileName ? (
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs text-gray-700 bg-gray-100 px-2.5 py-1 rounded-lg">
                              {formData.documents.appointmentLetter.fileName} ({formData.documents.appointmentLetter.fileSize})
                            </span>
                            <button
                              type="button"
                              onClick={() => handleRemoveDocument("appointmentLetter")}
                              className="text-xs font-bold text-rose-600 hover:text-rose-800 cursor-pointer"
                            >
                              Remove
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() =>
                              handleMockUpload("appointmentLetter", "Gazetted_Appointment_Order_2020.pdf", "2.1 MB")
                            }
                            className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-xs font-bold text-gray-700 hover:border-[#24833A] hover:text-[#24833A] transition cursor-pointer shadow-xs"
                          >
                            <Upload size={14} />
                            <span>Select File</span>
                          </button>
                        )}
                      </div>
                    </div>
                    {errors.appointmentLetter && (
                      <p className="text-[11px] text-rose-600 mt-2">{errors.appointmentLetter}</p>
                    )}
                  </div>

                  {/* Doc 3: Department / Organization Registration Proof */}
                  <div
                    className={`rounded-2xl border p-4 transition ${
                      errors.orgRegistrationProof
                        ? "border-rose-400 bg-rose-50/20"
                        : formData.documents.orgRegistrationProof.status === "submitted"
                        ? "border-emerald-300 bg-emerald-50/20"
                        : "border-gray-200 bg-white"
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-gray-900">
                            3. Department / Organization Registration Proof
                          </span>
                          <span className="text-rose-500 font-bold">*</span>
                          {renderDocumentStatusBadge(formData.documents.orgRegistrationProof.status)}
                        </div>
                        <p className="text-xs text-gray-500 mt-0.5">
                          Departmental notification, gazette entry, or legal statutory charter.
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        {formData.documents.orgRegistrationProof.fileName ? (
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs text-gray-700 bg-gray-100 px-2.5 py-1 rounded-lg">
                              {formData.documents.orgRegistrationProof.fileName} (
                              {formData.documents.orgRegistrationProof.fileSize})
                            </span>
                            <button
                              type="button"
                              onClick={() => handleRemoveDocument("orgRegistrationProof")}
                              className="text-xs font-bold text-rose-600 hover:text-rose-800 cursor-pointer"
                            >
                              Remove
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() =>
                              handleMockUpload(
                                "orgRegistrationProof",
                                "Departmental_Gazette_Notification.pdf",
                                "3.2 MB"
                              )
                            }
                            className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-xs font-bold text-gray-700 hover:border-[#24833A] hover:text-[#24833A] transition cursor-pointer shadow-xs"
                          >
                            <Upload size={14} />
                            <span>Select File</span>
                          </button>
                        )}
                      </div>
                    </div>
                    {errors.orgRegistrationProof && (
                      <p className="text-[11px] text-rose-600 mt-2">{errors.orgRegistrationProof}</p>
                    )}
                  </div>

                  {/* Doc 4: NGO Registration Certificate (if NGO) */}
                  {formData.organizationType === "NGO" && (
                    <div
                      className={`rounded-2xl border p-4 transition ${
                        errors.ngoCertificate
                          ? "border-rose-400 bg-rose-50/20"
                          : formData.documents.ngoCertificate?.status === "submitted"
                          ? "border-emerald-300 bg-emerald-50/20"
                          : "border-gray-200 bg-white"
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-gray-900">4. NGO Registration Certificate</span>
                            <span className="text-rose-500 font-bold">*</span>
                            {formData.documents.ngoCertificate &&
                              renderDocumentStatusBadge(formData.documents.ngoCertificate.status)}
                          </div>
                          <p className="text-xs text-gray-500 mt-0.5">
                            Societies Registration Act / DARPAN NGO portal certification.
                          </p>
                        </div>

                        <div className="flex items-center gap-2">
                          {formData.documents.ngoCertificate?.fileName ? (
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-xs text-gray-700 bg-gray-100 px-2.5 py-1 rounded-lg">
                                {formData.documents.ngoCertificate.fileName} ({formData.documents.ngoCertificate.fileSize})
                              </span>
                              <button
                                type="button"
                                onClick={() => handleRemoveDocument("ngoCertificate")}
                                className="text-xs font-bold text-rose-600 hover:text-rose-800 cursor-pointer"
                              >
                                Remove
                              </button>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() =>
                                handleMockUpload("ngoCertificate", "NGO_Darpan_Registration.pdf", "1.8 MB")
                              }
                              className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-xs font-bold text-gray-700 hover:border-[#24833A] hover:text-[#24833A] transition cursor-pointer shadow-xs"
                            >
                              <Upload size={14} />
                              <span>Select File</span>
                            </button>
                          )}
                        </div>
                      </div>
                      {errors.ngoCertificate && (
                        <p className="text-[11px] text-rose-600 mt-2">{errors.ngoCertificate}</p>
                      )}
                    </div>
                  )}
                </div>

                {/* Step 3 Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={handlePrevStep}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 px-4 py-2.5 text-xs font-bold text-gray-700 hover:bg-gray-50 cursor-pointer"
                  >
                    <ArrowLeft size={14} />
                    <span>Back</span>
                  </button>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleSaveDraft}
                      className="rounded-xl border border-amber-300 bg-amber-50 px-4 py-2.5 text-xs font-bold text-amber-800 hover:bg-amber-100 cursor-pointer"
                    >
                      Save as Draft
                    </button>
                    <button
                      type="button"
                      onClick={handleNextStep}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-[#24833A] px-5 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-[#174D25] cursor-pointer"
                    >
                      <span>Save & Continue</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* =========================================================
                STEP 4: REVIEW BEFORE SUBMISSION
            ========================================================= */}
            {currentStep === 4 && (
              <div className="flex flex-col gap-5 animate-fade-in">
                <div className="border-b border-gray-100 pb-3 flex items-center justify-between">
                  <div>
                    <h2 className="text-base sm:text-lg font-bold text-gray-900">Step 4 — Review Before Submission</h2>
                    <p className="text-xs text-gray-500">
                      Audit all representative information and attached credentials before final sign-off.
                    </p>
                  </div>

                  {/* Submission Readiness Badge */}
                  {validateStep1() && validateStep2() && validateStep3() ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800 border border-emerald-300">
                      <CheckCircle2 size={14} className="text-[#24833A]" /> Ready for Verification
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-full bg-orange-100 px-3 py-1 text-xs font-bold text-orange-900 border border-orange-300">
                      <AlertTriangle size={14} className="text-orange-700" /> Action Required
                    </span>
                  )}
                </div>

                {/* Review Section 1: Organization Details */}
                <div className="rounded-2xl border border-gray-200 bg-gray-50/70 p-4 flex flex-col gap-3">
                  <div className="flex items-center justify-between border-b border-gray-200 pb-2">
                    <div className="flex items-center gap-2">
                      <Building2 size={16} className="text-[#24833A]" />
                      <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wide">
                        1. Organization Details
                      </h3>
                    </div>
                    <button
                      type="button"
                      onClick={() => setCurrentStep(1)}
                      className="inline-flex items-center gap-1 text-xs font-bold text-[#24833A] hover:underline cursor-pointer"
                    >
                      <Edit3 size={12} />
                      <span>Edit</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-gray-400">Organization Name</span>
                      <p className="font-bold text-gray-900">{formData.organizationName}</p>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-gray-400">Department / Ministry</span>
                      <p className="font-semibold text-gray-800">{formData.departmentMinistry}</p>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-gray-400">Jurisdiction</span>
                      <p className="font-semibold text-gray-800">
                        {formData.mandal}, {formData.district}, {formData.state}
                      </p>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-gray-400">Registration Ref No</span>
                      <p className="font-mono font-bold text-gray-900">{formData.registrationRefNumber}</p>
                    </div>
                    <div className="sm:col-span-2">
                      <span className="text-[10px] uppercase font-bold text-gray-400">Office Address</span>
                      <p className="text-gray-700 font-medium">{formData.officeAddress}</p>
                    </div>
                  </div>
                </div>

                {/* Review Section 2: Representative Details */}
                <div className="rounded-2xl border border-gray-200 bg-gray-50/70 p-4 flex flex-col gap-3">
                  <div className="flex items-center justify-between border-b border-gray-200 pb-2">
                    <div className="flex items-center gap-2">
                      <UserCheck size={16} className="text-[#24833A]" />
                      <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wide">
                        2. Representative Details
                      </h3>
                    </div>
                    <button
                      type="button"
                      onClick={() => setCurrentStep(2)}
                      className="inline-flex items-center gap-1 text-xs font-bold text-[#24833A] hover:underline cursor-pointer"
                    >
                      <Edit3 size={12} />
                      <span>Edit</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-gray-400">Representative Name</span>
                      <p className="font-bold text-gray-900">{formData.fullName}</p>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-gray-400">Designation</span>
                      <p className="font-bold text-[#174D25]">{formData.designation}</p>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-gray-400">Employee / Officer ID</span>
                      <p className="font-mono font-bold text-gray-900">{formData.employeeOfficerId}</p>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-gray-400">Department Role</span>
                      <p className="font-semibold text-gray-800">
                        {formData.departmentRole === "Other"
                          ? formData.customDesignation || "Other"
                          : formData.departmentRole}
                      </p>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-gray-400">Official Email</span>
                      <p className="font-medium text-gray-800">{formData.officialEmail}</p>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-gray-400">Official Phone</span>
                      <p className="font-medium text-gray-800">{formData.officialPhone}</p>
                    </div>
                  </div>
                </div>

                {/* Review Section 3: Credential Documents */}
                <div className="rounded-2xl border border-gray-200 bg-gray-50/70 p-4 flex flex-col gap-3">
                  <div className="flex items-center justify-between border-b border-gray-200 pb-2">
                    <div className="flex items-center gap-2">
                      <FileText size={16} className="text-[#24833A]" />
                      <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wide">
                        3. Credential Documents
                      </h3>
                    </div>
                    <button
                      type="button"
                      onClick={() => setCurrentStep(3)}
                      className="inline-flex items-center gap-1 text-xs font-bold text-[#24833A] hover:underline cursor-pointer"
                    >
                      <Edit3 size={12} />
                      <span>Edit</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                    {Object.entries(formData.documents).map(([key, doc]) => {
                      if (!doc) return null;
                      return (
                        <div key={key} className="rounded-xl border border-gray-200 bg-white p-3 flex flex-col justify-between">
                          <div>
                            <span className="font-bold text-gray-900 line-clamp-1">{doc.name}</span>
                            <span className="text-[11px] text-gray-500 block truncate mt-0.5">
                              {doc.fileName || "No document attached"}
                            </span>
                          </div>
                          <div className="mt-2 pt-2 border-t border-gray-100 flex items-center justify-between">
                            <span className="text-[10px] text-gray-400">{doc.fileSize || "—"}</span>
                            {renderDocumentStatusBadge(doc.status)}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Step 4 Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={handlePrevStep}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 px-4 py-2.5 text-xs font-bold text-gray-700 hover:bg-gray-50 cursor-pointer"
                  >
                    <ArrowLeft size={14} />
                    <span>Back to Credentials</span>
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleSaveDraft}
                      className="rounded-xl border border-amber-300 bg-amber-50 px-4 py-2.5 text-xs font-bold text-amber-800 hover:bg-amber-100 cursor-pointer"
                    >
                      Save as Draft
                    </button>
                    <button
                      type="button"
                      id="btn-open-submit-modal"
                      onClick={() => setIsSubmitModalOpen(true)}
                      disabled={!(validateStep1() && validateStep2() && validateStep3())}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-[#24833A] px-5 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-[#174D25] disabled:opacity-50 cursor-pointer transition"
                    >
                      <span>Submit for Verification</span>
                      <CheckCircle2 size={15} />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* =========================================================
          CONFIRMATION MODAL: SUBMIT FOR VERIFICATION
      ========================================================= */}
      {isSubmitModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs"
          onClick={() => setIsSubmitModalOpen(false)}
        >
          <div
            className="w-full max-w-md rounded-3xl border border-gray-200 bg-white p-5 sm:p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 border-b border-gray-100 pb-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-[#24833A]">
                <ShieldCheck size={24} />
              </div>
              <div>
                <h3 className="text-base font-bold text-gray-900">Submit Verification Request?</h3>
                <span className="text-[10px] font-bold uppercase text-[#24833A]">Official State Authentication</span>
              </div>
            </div>

            <p className="my-4 text-xs text-gray-600 leading-relaxed">
              Your representative profile and submitted credentials will be sent for official review. An authorized audit officer will verify your departmental affiliation and activate full administrative privileges.
            </p>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsSubmitModalOpen(false)}
                className="rounded-xl border border-gray-200 px-4 py-2 text-xs font-bold text-gray-600 hover:bg-gray-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                id="btn-confirm-submit-verification"
                onClick={handleFinalSubmit}
                className="rounded-xl bg-[#24833A] px-5 py-2 text-xs font-bold text-white shadow-xs hover:bg-[#174D25] cursor-pointer"
              >
                Submit for Verification
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================
          PROFILE UPDATE REQUEST MODAL
      ========================================================= */}
      {isProfileUpdateModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs"
          onClick={() => setIsProfileUpdateModalOpen(false)}
        >
          <div
            className="w-full max-w-md rounded-3xl border border-gray-200 bg-white p-5 sm:p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 border-b border-gray-100 pb-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                <Edit3 size={18} />
              </div>
              <div>
                <h3 className="text-base font-bold text-gray-900">Request Profile Update</h3>
                <p className="text-xs text-gray-500">Official verified credentials change request.</p>
              </div>
            </div>

            <p className="my-4 text-xs text-gray-600 leading-relaxed">
              To update verified departmental designations, please submit an official gazetted transfer order or promotion decree to the secretariat verification cell.
            </p>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsProfileUpdateModalOpen(false)}
                className="rounded-xl border border-gray-200 px-4 py-2 text-xs font-bold text-gray-600 hover:bg-gray-50 cursor-pointer"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsProfileUpdateModalOpen(false);
                  setCurrentStep(1);
                  setVerificationStatus("draft");
                  showToast("Profile unlocked for revision.");
                }}
                className="rounded-xl bg-[#24833A] px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-[#174D25] cursor-pointer"
              >
                Unlock for Revision
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
