"use client";

import React, { useState, useEffect } from "react";
import { X, Building2, Landmark, Calendar, FileText, CheckCircle2, AlertCircle } from "lucide-react";
import { GovtSchemeItem, GovtSchemeStatus, useGovernmentStore } from "@/store/government-store";

interface GovtSchemeFormModalProps {
  schemeToEdit?: GovtSchemeItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function GovtSchemeFormModal({
  schemeToEdit,
  isOpen,
  onClose,
}: GovtSchemeFormModalProps) {
  const { addScheme, updateScheme } = useGovernmentStore();

  const [name, setName] = useState("");
  const [department, setDepartment] = useState("");
  const [category, setCategory] = useState("Direct Income Support");
  const [status, setStatus] = useState<GovtSchemeStatus>("active");
  const [benefitAmount, setBenefitAmount] = useState("");
  const [deadline, setDeadline] = useState("");
  const [description, setDescription] = useState("");
  const [targetBeneficiaries, setTargetBeneficiaries] = useState("");
  const [landRequirement, setLandRequirement] = useState("");
  const [documentsStr, setDocumentsStr] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (schemeToEdit) {
      setName(schemeToEdit.name);
      setDepartment(schemeToEdit.department);
      setCategory(schemeToEdit.category);
      setStatus(schemeToEdit.status);
      setBenefitAmount(schemeToEdit.benefitAmount);
      setDeadline(schemeToEdit.deadline);
      setDescription(schemeToEdit.description);
      setTargetBeneficiaries(schemeToEdit.targetBeneficiaries);
      setLandRequirement(schemeToEdit.landRequirement);
      setDocumentsStr(schemeToEdit.requiredDocuments.join(", "));
      setStartDate(schemeToEdit.startDate);
      setEndDate(schemeToEdit.endDate);
    } else {
      setName("");
      setDepartment("Dept. of Agriculture & Farmers Welfare, AP");
      setCategory("Direct Income Support");
      setStatus("active");
      setBenefitAmount("");
      setDeadline("31 Dec 2026");
      setDescription("");
      setTargetBeneficiaries("All resident small and marginal cultivators");
      setLandRequirement("Up to 5.0 Acres");
      setDocumentsStr("Pattadar Passbook, Aadhaar Card, Bank Account Details");
      setStartDate("01 Jun 2026");
      setEndDate("31 Dec 2026");
    }
    setErrors({});
  }, [schemeToEdit, isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const errs: { [key: string]: string } = {};
    if (!name.trim()) errs.name = "Scheme Name is required.";
    if (!department.trim()) errs.department = "Department / Authority is required.";
    if (!benefitAmount.trim()) errs.benefitAmount = "Benefit Amount / Scale is required.";
    if (!description.trim()) errs.description = "Scheme description is required.";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const parsedDocs = documentsStr
      .split(",")
      .map((d) => d.trim())
      .filter((d) => d.length > 0);

    if (schemeToEdit) {
      updateScheme(schemeToEdit.id, {
        name: name.trim(),
        department: department.trim(),
        category,
        status,
        benefitAmount: benefitAmount.trim(),
        deadline: deadline.trim() || "Ongoing",
        description: description.trim(),
        targetBeneficiaries: targetBeneficiaries.trim(),
        landRequirement: landRequirement.trim(),
        requiredDocuments: parsedDocs.length > 0 ? parsedDocs : ["Aadhaar Card", "Pattadar Passbook"],
        startDate: startDate.trim(),
        endDate: endDate.trim(),
      });
    } else {
      addScheme({
        name: name.trim(),
        department: department.trim(),
        category,
        status,
        benefitAmount: benefitAmount.trim(),
        deadline: deadline.trim() || "Ongoing",
        description: description.trim(),
        targetBeneficiaries: targetBeneficiaries.trim(),
        landRequirement: landRequirement.trim(),
        requiredDocuments: parsedDocs.length > 0 ? parsedDocs : ["Aadhaar Card", "Pattadar Passbook"],
        startDate: startDate.trim() || "01 Jun 2026",
        endDate: endDate.trim() || "31 Dec 2026",
      });
    }

    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-xs overflow-y-auto"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-2xl rounded-3xl bg-white shadow-2xl border border-gray-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 bg-[#F4FBF5] p-4 sm:p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#E4F0DD] text-[#24833A]">
              <Landmark size={22} />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-gray-900">
                {schemeToEdit ? "Edit Government Scheme" : "Register New Government Scheme"}
              </h2>
              <p className="text-xs text-gray-500">
                Official registry form for welfare subsidies and agricultural programs
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-xl text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition cursor-pointer"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-4 sm:p-6 flex flex-col gap-4 text-xs">
          {/* Section 1: Basic Information */}
          <div className="rounded-2xl border border-gray-200 bg-white p-4 flex flex-col gap-3">
            <h3 className="font-bold uppercase tracking-wider text-gray-800 text-[11px]">
              1. Basic Scheme Information
            </h3>

            <div>
              <label className="block font-medium text-gray-700 mb-1">
                Scheme Title / Name *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (errors.name) setErrors({ ...errors, name: "" });
                }}
                placeholder="e.g. Rythu Bharosa Investment Support"
                className={`w-full rounded-xl border p-2.5 text-xs text-gray-800 focus:outline-hidden ${
                  errors.name ? "border-red-400 focus:border-red-500" : "border-gray-200 focus:border-[#24833A]"
                }`}
              />
              {errors.name && <p className="text-[11px] text-red-600 mt-0.5">{errors.name}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-medium text-gray-700 mb-1">
                  Department / Authority *
                </label>
                <input
                  type="text"
                  value={department}
                  onChange={(e) => {
                    setDepartment(e.target.value);
                    if (errors.department) setErrors({ ...errors, department: "" });
                  }}
                  placeholder="e.g. Dept. of Agriculture & Farmers Welfare, AP"
                  className={`w-full rounded-xl border p-2.5 text-xs text-gray-800 focus:outline-hidden ${
                    errors.department ? "border-red-400 focus:border-red-500" : "border-gray-200 focus:border-[#24833A]"
                  }`}
                />
                {errors.department && (
                  <p className="text-[11px] text-red-600 mt-0.5">{errors.department}</p>
                )}
              </div>

              <div>
                <label className="block font-medium text-gray-700 mb-1">
                  Welfare Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 p-2.5 text-xs text-gray-800 focus:border-[#24833A] focus:outline-hidden"
                >
                  <option value="Direct Income Support">Direct Income Support</option>
                  <option value="Central Income Support">Central Income Support</option>
                  <option value="Crop Insurance & Relief">Crop Insurance & Relief</option>
                  <option value="Irrigation Assistance">Irrigation Assistance</option>
                  <option value="Farm Mechanization Support">Farm Mechanization Support</option>
                  <option value="Organic & Sustainable Inputs">Organic & Sustainable Inputs</option>
                  <option value="Emergency Relief">Emergency Relief</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-medium text-gray-700 mb-1">
                Publication Status
              </label>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="radio"
                    name="status"
                    checked={status === "active"}
                    onChange={() => setStatus("active")}
                    className="accent-[#24833A]"
                  />
                  <span className="font-semibold text-emerald-800">Active (Open for Farmers)</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="radio"
                    name="status"
                    checked={status === "draft"}
                    onChange={() => setStatus("draft")}
                    className="accent-[#24833A]"
                  />
                  <span className="font-semibold text-gray-600">Draft (Review Only)</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="radio"
                    name="status"
                    checked={status === "closed"}
                    onChange={() => setStatus("closed")}
                    className="accent-[#24833A]"
                  />
                  <span className="font-semibold text-red-700">Closed (Applications Ended)</span>
                </label>
              </div>
            </div>
          </div>

          {/* Section 2: Details & Benefits */}
          <div className="rounded-2xl border border-gray-200 bg-white p-4 flex flex-col gap-3">
            <h3 className="font-bold uppercase tracking-wider text-gray-800 text-[11px]">
              2. Benefits & Eligibility Criteria
            </h3>

            <div>
              <label className="block font-medium text-gray-700 mb-1">
                Scheme Description *
              </label>
              <textarea
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                  if (errors.description) setErrors({ ...errors, description: "" });
                }}
                rows={2}
                placeholder="Briefly summarize the objective and disbursement mechanism..."
                className={`w-full rounded-xl border p-2.5 text-xs text-gray-800 focus:outline-hidden ${
                  errors.description ? "border-red-400 focus:border-red-500" : "border-gray-200 focus:border-[#24833A]"
                }`}
              />
              {errors.description && (
                <p className="text-[11px] text-red-600 mt-0.5">{errors.description}</p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-medium text-gray-700 mb-1">
                  Sanctioned Benefit Amount / Scale *
                </label>
                <input
                  type="text"
                  value={benefitAmount}
                  onChange={(e) => {
                    setBenefitAmount(e.target.value);
                    if (errors.benefitAmount) setErrors({ ...errors, benefitAmount: "" });
                  }}
                  placeholder="e.g. ₹13,500 / year or 90% Subsidy"
                  className={`w-full rounded-xl border p-2.5 text-xs text-gray-800 focus:outline-hidden ${
                    errors.benefitAmount
                      ? "border-red-400 focus:border-red-500"
                      : "border-gray-200 focus:border-[#24833A]"
                  }`}
                />
                {errors.benefitAmount && (
                  <p className="text-[11px] text-red-600 mt-0.5">{errors.benefitAmount}</p>
                )}
              </div>

              <div>
                <label className="block font-medium text-gray-700 mb-1">
                  Landholding Requirement
                </label>
                <input
                  type="text"
                  value={landRequirement}
                  onChange={(e) => setLandRequirement(e.target.value)}
                  placeholder="e.g. Up to 5 Acres (Small & Marginal cultivators)"
                  className="w-full rounded-xl border border-gray-200 p-2.5 text-xs text-gray-800 focus:border-[#24833A] focus:outline-hidden"
                />
              </div>
            </div>

            <div>
              <label className="block font-medium text-gray-700 mb-1">
                Target Beneficiaries Description
              </label>
              <input
                type="text"
                value={targetBeneficiaries}
                onChange={(e) => setTargetBeneficiaries(e.target.value)}
                placeholder="e.g. Resident landowning farmers and verified tenant cultivators"
                className="w-full rounded-xl border border-gray-200 p-2.5 text-xs text-gray-800 focus:border-[#24833A] focus:outline-hidden"
              />
            </div>
          </div>

          {/* Section 3: Timeline & Documents */}
          <div className="rounded-2xl border border-gray-200 bg-white p-4 flex flex-col gap-3">
            <h3 className="font-bold uppercase tracking-wider text-gray-800 text-[11px]">
              3. Operational Dates & Mandatory Documents
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-medium text-gray-700 mb-1">
                  Application Deadline
                </label>
                <input
                  type="text"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  placeholder="e.g. 31 Dec 2026 or Ongoing"
                  className="w-full rounded-xl border border-gray-200 p-2.5 text-xs text-gray-800 focus:border-[#24833A] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-medium text-gray-700 mb-1">
                  Required Documents (Comma Separated)
                </label>
                <input
                  type="text"
                  value={documentsStr}
                  onChange={(e) => setDocumentsStr(e.target.value)}
                  placeholder="e.g. Pattadar Passbook, Aadhaar Card, Bank Passbook"
                  className="w-full rounded-xl border border-gray-200 p-2.5 text-xs text-gray-800 focus:border-[#24833A] focus:outline-hidden"
                />
              </div>
            </div>
          </div>

          {/* Footer Submit */}
          <div className="border-t border-gray-100 pt-3 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-gray-200 px-4 py-2 text-xs font-bold text-gray-700 hover:bg-gray-100 transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-xl bg-[#24833A] px-5 py-2 text-xs font-bold text-white hover:bg-[#174D25] transition cursor-pointer shadow-xs"
            >
              {schemeToEdit ? "Save Scheme Changes" : "Register Scheme"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
