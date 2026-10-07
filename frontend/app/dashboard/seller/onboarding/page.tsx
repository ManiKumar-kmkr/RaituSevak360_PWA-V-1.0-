"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle2,
  ShieldCheck,
  MapPin,
  Upload,
  FileText,
  Camera,
  Check,
  Building2,
  CreditCard,
  Sparkles,
  AlertCircle,
  X,
  Eye,
  Store,
  RefreshCw,
} from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { useSellerStore } from "@/store/seller-store";
import Button from "@/components/ui/Button";
import { BackButton } from "@/components/ui/BackButton";
import {
  BusinessCategory,
  ProductCategory,
  SellerOnboardingData,
} from "@/types/seller";

const AVAILABLE_BUSINESS_CATEGORIES: BusinessCategory[] = [
  "Seeds & Fertilizers",
  "Farm Equipment",
  "Pesticides",
  "Organic Products",
];

const AVAILABLE_CATALOG_ITEMS: { name: ProductCategory; icon: string }[] = [
  { name: "Seeds", icon: "🌱" },
  { name: "Fertilizers", icon: "🧪" },
  { name: "Pesticides", icon: "🛡️" },
  { name: "Farm Tools", icon: "🔧" },
  { name: "Tractors", icon: "🚜" },
  { name: "Harvesters", icon: "🌾" },
  { name: "Irrigation", icon: "💧" },
  { name: "Organic", icon: "🍃" },
];

export default function SellerOnboardingPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const onboardingData = useSellerStore((state) => state.onboardingData);
  const updateOnboardingStep = useSellerStore((state) => state.updateOnboardingStep);
  const completeRegistration = useSellerStore((state) => state.completeRegistration);
  const lastRegistrationResult = useSellerStore((state) => state.lastRegistrationResult);

  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5 | 6>(1);
  const [showStatusModal, setShowStatusModal] = useState(false);

  // Form local state initialized from store
  const [formData, setFormData] = useState<SellerOnboardingData>({ ...onboardingData });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Sync to store when navigating forward
  const updateField = <K extends keyof SellerOnboardingData>(key: K, val: SellerOnboardingData[K]) => {
    const updated = { ...formData, [key]: val };
    setFormData(updated);
    updateOnboardingStep({ [key]: val });
    if (errors[key as string]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[key as string];
        return next;
      });
    }
  };

  // Step 1 Validation
  const validateStep1 = () => {
    const errs: Record<string, string> = {};
    if (!formData.businessName.trim()) {
      errs.businessName = "Business name is required";
    }
    if (!formData.ownerName.trim()) {
      errs.ownerName = "Owner name is required";
    }
    if (!formData.mobile.trim() || formData.mobile.length < 10) {
      errs.mobile = "Valid 10-digit mobile number is required";
    }
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errs.email = "Please enter a valid email address";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Step 2 Validation
  const validateStep2 = () => {
    const errs: Record<string, string> = {};
    if (!formData.pinCode.trim() || formData.pinCode.length < 6) {
      errs.pinCode = "Valid 6-digit PIN code is required";
    }
    if (!formData.storeAddress.trim()) {
      errs.storeAddress = "Store address is required";
    }
    if (formData.businessCategories.length === 0) {
      errs.businessCategories = "Select at least one business category";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Step 3 Validation
  const validateStep3 = () => {
    const errs: Record<string, string> = {};
    if (formData.productCategories.length === 0) {
      errs.productCategories = "Select at least one product you sell";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Step 4 Validation
  const validateStep4 = () => {
    const errs: Record<string, string> = {};
    if (!formData.kycDocuments.aadhaarUploaded) {
      errs.aadhaar = "Aadhaar Card document is required";
    }
    if (!formData.kycDocuments.gstUploaded) {
      errs.gst = "GST Certificate / Trade License is required";
    }
    if (!formData.kycDocuments.shopPhotoUploaded) {
      errs.shopPhoto = "Shop front photo is required";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Step 5 Validation
  const validateStep5 = () => {
    const errs: Record<string, string> = {};
    if (!formData.bankDetails.accountNumber.trim()) {
      errs.accountNumber = "Bank account number is required";
    }
    if (!formData.bankDetails.ifscCode.trim()) {
      errs.ifscCode = "IFSC code is required";
    }
    if (!formData.bankDetails.accountHolderName.trim()) {
      errs.accountHolderName = "Account holder name is required";
    }
    if (!formData.termsAccepted) {
      errs.terms = "You must accept the terms and conditions to proceed";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else if (step === 2 && validateStep2()) {
      setStep(3);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else if (step === 3 && validateStep3()) {
      setStep(4);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else if (step === 4 && validateStep4()) {
      setStep(5);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else if (step === 5 && validateStep5()) {
      completeRegistration();
      setStep(6);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleBack = () => {
    if (step === 1) {
      router.push("/dashboard");
    } else if (step <= 5) {
      setStep((prev) => (prev - 1) as any);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      router.push("/dashboard");
    }
  };

  const toggleBusinessCategory = (cat: BusinessCategory) => {
    const exists = formData.businessCategories.includes(cat);
    const updated = exists
      ? formData.businessCategories.filter((c) => c !== cat)
      : [...formData.businessCategories, cat];
    updateField("businessCategories", updated);
  };

  const toggleProductCategory = (cat: ProductCategory) => {
    const exists = formData.productCategories.includes(cat);
    const updated = exists
      ? formData.productCategories.filter((c) => c !== cat)
      : [...formData.productCategories, cat];
    updateField("productCategories", updated);
  };

  const handleMockDocUpload = (docKey: "aadhaar" | "gst" | "shopPhoto") => {
    const fileNames: Record<string, string> = {
      aadhaar: "aadhaar_front_back_verified.pdf",
      gst: "gst_reg_certificate_36AA.pdf",
      shopPhoto: "shop_front_signboard.jpg",
    };
    const keyMap = {
      aadhaar: { uploaded: "aadhaarUploaded", name: "aadhaarFileName" },
      gst: { uploaded: "gstUploaded", name: "gstFileName" },
      shopPhoto: { uploaded: "shopPhotoUploaded", name: "shopPhotoFileName" },
    };
    const nextKyc = {
      ...formData.kycDocuments,
      [keyMap[docKey].uploaded]: true,
      [keyMap[docKey].name]: fileNames[docKey],
    };
    updateField("kycDocuments", nextKyc);
  };

  const handleRemoveDoc = (docKey: "aadhaar" | "gst" | "shopPhoto") => {
    const keyMap = {
      aadhaar: { uploaded: "aadhaarUploaded", name: "aadhaarFileName" },
      gst: { uploaded: "gstUploaded", name: "gstFileName" },
      shopPhoto: { uploaded: "shopPhotoUploaded", name: "shopPhotoFileName" },
    };
    const nextKyc = {
      ...formData.kycDocuments,
      [keyMap[docKey].uploaded]: false,
      [keyMap[docKey].name]: undefined,
    };
    updateField("kycDocuments", nextKyc);
  };

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col gap-5 pb-16">
      {/* Top Navigation Bar */}
      <div className="flex items-center justify-between">
        <BackButton onClick={handleBack} label={t("common.back") || "Back"} />
        <div className="flex flex-col items-center">
          <h1 className="text-base font-bold text-[#174D25]">
            {step === 6 ? "Registration Successful" : "Seller Onboarding"}
          </h1>
          {step <= 5 && (
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#24833A]">
              Step {step} of 5
            </span>
          )}
        </div>
        <Link
          href="/dashboard"
          className="text-xs font-semibold text-gray-500 hover:text-[#24833A] transition"
        >
          Exit
        </Link>
      </div>

      {/* Visual Step Progress Bar */}
      {step <= 5 && (
        <div className="flex flex-col gap-1.5">
          <div className="grid grid-cols-5 gap-2">
            {[1, 2, 3, 4, 5].map((s) => (
              <div
                key={s}
                className={`h-2 rounded-full transition-all duration-300 ${
                  s <= step ? "bg-[#24833A]" : "bg-gray-200"
                }`}
              />
            ))}
          </div>
          <div className="flex justify-between text-[11px] font-medium text-gray-500 px-0.5">
            <span>Business</span>
            <span>Location</span>
            <span>Catalog</span>
            <span>KYC</span>
            <span>Payment</span>
          </div>
        </div>
      )}

      {/* ================= STEP 1: REGISTER YOUR BUSINESS ================= */}
      {step === 1 && (
        <div className="flex flex-col gap-5 rounded-3xl border border-[#24833A]/20 bg-white p-5 sm:p-6 shadow-2xs">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-[#E4F0DD] px-3 py-1 text-xs font-bold text-[#174D25] mb-2">
              <Store size={14} className="text-[#24833A]" />
              <span>STEP 1 OF 5</span>
            </div>
            <h2 className="text-xl font-bold text-[#174D25]">Register Your Business</h2>
            <p className="text-xs text-gray-500 mt-1">
              Provide basic information about your agricultural trade or equipment store.
            </p>
          </div>

          <div className="flex flex-col gap-4">
            {/* Business Name */}
            <div>
              <label htmlFor="businessName" className="block text-xs font-bold text-gray-700 mb-1">
                Business / Store Name <span className="text-red-500">*</span>
              </label>
              <input
                id="businessName"
                type="text"
                value={formData.businessName}
                onChange={(e) => updateField("businessName", e.target.value)}
                placeholder="e.g. Sri Lakshmi Venkateswara Agro Traders"
                className={`w-full rounded-xl border px-3.5 py-2.5 text-sm font-medium text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#24833A]/20 transition ${
                  errors.businessName ? "border-red-500 bg-red-50/30" : "border-gray-200 focus:border-[#24833A]"
                }`}
              />
              {errors.businessName && (
                <p className="mt-1 text-xs text-red-600 font-medium">{errors.businessName}</p>
              )}
            </div>

            {/* Owner Name */}
            <div>
              <label htmlFor="ownerName" className="block text-xs font-bold text-gray-700 mb-1">
                Owner / Proprietor Name <span className="text-red-500">*</span>
              </label>
              <input
                id="ownerName"
                type="text"
                value={formData.ownerName}
                onChange={(e) => updateField("ownerName", e.target.value)}
                placeholder="e.g. Mani Kumar Reddy"
                className={`w-full rounded-xl border px-3.5 py-2.5 text-sm font-medium text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#24833A]/20 transition ${
                  errors.ownerName ? "border-red-500 bg-red-50/30" : "border-gray-200 focus:border-[#24833A]"
                }`}
              />
              {errors.ownerName && (
                <p className="mt-1 text-xs text-red-600 font-medium">{errors.ownerName}</p>
              )}
            </div>

            {/* Mobile Number with Verified Status */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label htmlFor="mobile" className="block text-xs font-bold text-gray-700">
                  Mobile Number <span className="text-red-500">*</span>
                </label>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-[#24833A]">
                  <CheckCircle2 size={11} /> OTP Verified
                </span>
              </div>
              <div className="relative flex items-center">
                <span className="absolute left-3 text-xs font-bold text-gray-500">+91</span>
                <input
                  id="mobile"
                  type="tel"
                  maxLength={10}
                  value={formData.mobile}
                  onChange={(e) => updateField("mobile", e.target.value.replace(/\D/g, ""))}
                  placeholder="9849012345"
                  className={`w-full rounded-xl border pl-11 pr-3.5 py-2.5 text-sm font-medium text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#24833A]/20 transition ${
                    errors.mobile ? "border-red-500 bg-red-50/30" : "border-gray-200 focus:border-[#24833A]"
                  }`}
                />
              </div>
              {errors.mobile && (
                <p className="mt-1 text-xs text-red-600 font-medium">{errors.mobile}</p>
              )}
            </div>

            {/* Email ID (Optional) */}
            <div>
              <label htmlFor="email" className="block text-xs font-bold text-gray-700 mb-1">
                Email ID <span className="text-gray-400 font-normal">(Optional)</span>
              </label>
              <input
                id="email"
                type="email"
                value={formData.email || ""}
                onChange={(e) => updateField("email", e.target.value)}
                placeholder="e.g. info@lakshmiagro.in"
                className={`w-full rounded-xl border px-3.5 py-2.5 text-sm font-medium text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#24833A]/20 transition ${
                  errors.email ? "border-red-500 bg-red-50/30" : "border-gray-200 focus:border-[#24833A]"
                }`}
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red-600 font-medium">{errors.email}</p>
              )}
            </div>
          </div>

          <Button
            variant="primary"
            size="lg"
            fullWidth
            onClick={handleNext}
            className="mt-2"
          >
            {t("seller.onboarding.continue")}
          </Button>
        </div>
      )}

      {/* ================= STEP 2: BUSINESS LOCATION & TYPE ================= */}
      {step === 2 && (
        <div className="flex flex-col gap-5 rounded-3xl border border-[#24833A]/20 bg-white p-5 sm:p-6 shadow-2xs">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-[#E4F0DD] px-3 py-1 text-xs font-bold text-[#174D25] mb-2">
              <MapPin size={14} className="text-[#24833A]" />
              <span>STEP 2 OF 5</span>
            </div>
            <h2 className="text-xl font-bold text-[#174D25]">Business Location & Type</h2>
            <p className="text-xs text-gray-500 mt-1">
              Specify your physical storefront location and business trade categories.
            </p>
          </div>

          {/* GPS Verified Badge */}
          <div className="flex items-center justify-between rounded-2xl bg-[#F4FBF5] border border-[#24833A]/30 p-3.5">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#E4F0DD] text-[#24833A]">
                <MapPin size={18} />
              </div>
              <div>
                <p className="text-xs font-bold text-[#174D25]">
                  {formData.gpsLocationName || "Warangal, Telangana (GPS Verified)"}
                </p>
                <p className="text-[11px] text-gray-500">Auto-detected hub location</p>
              </div>
            </div>
            <span className="inline-flex items-center gap-1 rounded-full bg-[#24833A] px-2.5 py-0.5 text-[10px] font-bold text-white">
              <ShieldCheck size={11} /> Verified
            </span>
          </div>

          <div className="flex flex-col gap-4">
            {/* PIN Code */}
            <div>
              <label htmlFor="pinCode" className="block text-xs font-bold text-gray-700 mb-1">
                PIN Code <span className="text-red-500">*</span>
              </label>
              <input
                id="pinCode"
                type="text"
                maxLength={6}
                value={formData.pinCode}
                onChange={(e) => updateField("pinCode", e.target.value.replace(/\D/g, ""))}
                placeholder="506002"
                className={`w-full rounded-xl border px-3.5 py-2.5 text-sm font-medium text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#24833A]/20 transition ${
                  errors.pinCode ? "border-red-500 bg-red-50/30" : "border-gray-200 focus:border-[#24833A]"
                }`}
              />
              {errors.pinCode && (
                <p className="mt-1 text-xs text-red-600 font-medium">{errors.pinCode}</p>
              )}
            </div>

            {/* Store Address */}
            <div>
              <label htmlFor="storeAddress" className="block text-xs font-bold text-gray-700 mb-1">
                Store / Warehouse Address <span className="text-red-500">*</span>
              </label>
              <textarea
                id="storeAddress"
                rows={3}
                value={formData.storeAddress}
                onChange={(e) => updateField("storeAddress", e.target.value)}
                placeholder="Shop number, market yard, road, landmark..."
                className={`w-full rounded-xl border px-3.5 py-2.5 text-sm font-medium text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#24833A]/20 transition ${
                  errors.storeAddress ? "border-red-500 bg-red-50/30" : "border-gray-200 focus:border-[#24833A]"
                }`}
              />
              {errors.storeAddress && (
                <p className="mt-1 text-xs text-red-600 font-medium">{errors.storeAddress}</p>
              )}
            </div>

            {/* Categories — Multiple selection */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-2">
                Business Categories <span className="text-red-500">*</span>{" "}
                <span className="text-gray-400 font-normal">(Select multiple)</span>
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                {AVAILABLE_BUSINESS_CATEGORIES.map((cat) => {
                  const isSelected = formData.businessCategories.includes(cat);
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => toggleBusinessCategory(cat)}
                      className={`flex items-center justify-between rounded-xl border p-3 text-left transition active:scale-[0.98] cursor-pointer ${
                        isSelected
                          ? "border-[#24833A] bg-[#E4F0DD]/60 text-[#174D25] font-bold shadow-2xs"
                          : "border-gray-200 bg-white text-gray-700 font-medium hover:border-gray-300"
                      }`}
                    >
                      <span className="text-xs">{cat}</span>
                      <div
                        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition ${
                          isSelected
                            ? "border-[#24833A] bg-[#24833A] text-white"
                            : "border-gray-300 bg-white"
                        }`}
                      >
                        {isSelected && <Check size={12} strokeWidth={3} />}
                      </div>
                    </button>
                  );
                })}
              </div>
              {errors.businessCategories && (
                <p className="mt-1.5 text-xs text-red-600 font-medium">
                  {errors.businessCategories}
                </p>
              )}
            </div>
          </div>

          <div className="mt-2 flex items-center gap-3">
            <Button
              variant="secondary"
              size="md"
              className="flex-1"
              onClick={handleBack}
            >
              {t("common.back")}
            </Button>
            <Button
              variant="primary"
              size="md"
              className="flex-2"
              onClick={handleNext}
            >
              {t("seller.onboarding.continue")}
            </Button>
          </div>
        </div>
      )}

      {/* ================= STEP 3: WHAT DO YOU SELL? ================= */}
      {step === 3 && (
        <div className="flex flex-col gap-5 rounded-3xl border border-[#24833A]/20 bg-white p-5 sm:p-6 shadow-2xs">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-[#E4F0DD] px-3 py-1 text-xs font-bold text-[#174D25] mb-2">
              <Sparkles size={14} className="text-[#24833A]" />
              <span>STEP 3 OF 5</span>
            </div>
            <h2 className="text-xl font-bold text-[#174D25]">What do you sell?</h2>
            <p className="text-xs text-gray-500 mt-1">
              Select product groups you intend to supply or rent out to farmers.
            </p>
          </div>

          {/* Product Catalog Cards Grid */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-2">
              Product Catalog Items <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {AVAILABLE_CATALOG_ITEMS.map((item) => {
                const isSelected = formData.productCategories.includes(item.name);
                return (
                  <button
                    key={item.name}
                    type="button"
                    onClick={() => toggleProductCategory(item.name)}
                    className={`flex flex-col items-center justify-center gap-1.5 rounded-2xl border p-3.5 transition active:scale-95 cursor-pointer text-center ${
                      isSelected
                        ? "border-[#24833A] bg-[#E4F0DD]/60 shadow-2xs ring-1 ring-[#24833A]"
                        : "border-gray-200 bg-white hover:border-gray-300"
                    }`}
                  >
                    <span className="text-2xl">{item.icon}</span>
                    <span
                      className={`text-xs ${
                        isSelected ? "font-bold text-[#174D25]" : "font-medium text-gray-700"
                      }`}
                    >
                      {item.name}
                    </span>
                    {isSelected && (
                      <span className="inline-flex items-center gap-0.5 text-[9px] font-bold text-[#24833A]">
                        <Check size={10} strokeWidth={3} /> Selected
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
            {errors.productCategories && (
              <p className="mt-1.5 text-xs text-red-600 font-medium">
                {errors.productCategories}
              </p>
            )}
          </div>

          {/* Equipment Rental Toggle */}
          <div className="flex items-center justify-between rounded-2xl border border-gray-200 bg-gray-50/70 p-4">
            <div className="flex flex-col">
              <span className="text-xs font-bold text-gray-800">
                Do you rent equipment?
              </span>
              <span className="text-[11px] text-gray-500">
                Offer tractors, drones, or harvesters on hourly or daily booking.
              </span>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={formData.rentEquipment}
              onClick={() => updateField("rentEquipment", !formData.rentEquipment)}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                formData.rentEquipment ? "bg-[#24833A]" : "bg-gray-300"
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                  formData.rentEquipment ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          <div className="mt-2 flex items-center gap-3">
            <Button
              variant="secondary"
              size="md"
              className="flex-1"
              onClick={handleBack}
            >
              {t("common.back")}
            </Button>
            <Button
              variant="primary"
              size="md"
              className="flex-2"
              onClick={handleNext}
            >
              {t("seller.onboarding.continue")}
            </Button>
          </div>
        </div>
      )}

      {/* ================= STEP 4: VERIFY YOUR BUSINESS ================= */}
      {step === 4 && (
        <div className="flex flex-col gap-5 rounded-3xl border border-[#24833A]/20 bg-white p-5 sm:p-6 shadow-2xs">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-[#E4F0DD] px-3 py-1 text-xs font-bold text-[#174D25] mb-2">
              <ShieldCheck size={14} className="text-[#24833A]" />
              <span>STEP 4 OF 5</span>
            </div>
            <h2 className="text-xl font-bold text-[#174D25]">Verify Your Business</h2>
            <p className="text-xs text-gray-500 mt-1">
              Upload verification documents to receive the verified seller badge.
            </p>
          </div>

          <div className="flex flex-col gap-3.5">
            {/* Aadhaar Card */}
            <div className="rounded-2xl border border-gray-200 p-3.5 bg-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-[#24833A]">
                    <FileText size={18} />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-gray-800">Aadhaar Card</h3>
                    <p className="text-[11px] text-gray-500">Identity & address proof</p>
                  </div>
                </div>
                {formData.kycDocuments.aadhaarUploaded ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-[#24833A]">
                    <CheckCircle2 size={11} /> Uploaded
                  </span>
                ) : (
                  <span className="text-[10px] font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                    Required
                  </span>
                )}
              </div>

              {formData.kycDocuments.aadhaarUploaded ? (
                <div className="mt-3 flex items-center justify-between rounded-xl bg-gray-50 px-3 py-2 text-xs">
                  <span className="text-gray-700 font-medium truncate max-w-[200px]">
                    {formData.kycDocuments.aadhaarFileName || "aadhaar_verified.pdf"}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveDoc("aadhaar")}
                    className="text-red-500 hover:text-red-700 text-[11px] font-bold"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => handleMockDocUpload("aadhaar")}
                  className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-[#24833A] bg-[#F4FBF5] py-2.5 text-xs font-bold text-[#24833A] hover:bg-[#E4F0DD] active:scale-95 transition"
                >
                  <Upload size={14} /> Upload Aadhaar Card
                </button>
              )}
              {errors.aadhaar && (
                <p className="mt-1 text-xs text-red-600 font-medium">{errors.aadhaar}</p>
              )}
            </div>

            {/* GST Certificate / License */}
            <div className="rounded-2xl border border-gray-200 p-3.5 bg-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-[#24833A]">
                    <Building2 size={18} />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-gray-800">GST Certificate / Trade License</h3>
                    <p className="text-[11px] text-gray-500">Business registration license</p>
                  </div>
                </div>
                {formData.kycDocuments.gstUploaded ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-[#24833A]">
                    <CheckCircle2 size={11} /> Uploaded
                  </span>
                ) : (
                  <span className="text-[10px] font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                    Required
                  </span>
                )}
              </div>

              {formData.kycDocuments.gstUploaded ? (
                <div className="mt-3 flex items-center justify-between rounded-xl bg-gray-50 px-3 py-2 text-xs">
                  <span className="text-gray-700 font-medium truncate max-w-[200px]">
                    {formData.kycDocuments.gstFileName || "gst_certificate.pdf"}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveDoc("gst")}
                    className="text-red-500 hover:text-red-700 text-[11px] font-bold"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => handleMockDocUpload("gst")}
                  className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-[#24833A] bg-[#F4FBF5] py-2.5 text-xs font-bold text-[#24833A] hover:bg-[#E4F0DD] active:scale-95 transition"
                >
                  <Upload size={14} /> Upload GST / License
                </button>
              )}
              {errors.gst && (
                <p className="mt-1 text-xs text-red-600 font-medium">{errors.gst}</p>
              )}
            </div>

            {/* Shop Front Photo */}
            <div className="rounded-2xl border border-gray-200 p-3.5 bg-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-[#24833A]">
                    <Camera size={18} />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-gray-800">Shop Front Photo</h3>
                    <p className="text-[11px] text-gray-500">Signboard and storefront</p>
                  </div>
                </div>
                {formData.kycDocuments.shopPhotoUploaded ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-[#24833A]">
                    <CheckCircle2 size={11} /> Uploaded
                  </span>
                ) : (
                  <span className="text-[10px] font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                    Required
                  </span>
                )}
              </div>

              {formData.kycDocuments.shopPhotoUploaded ? (
                <div className="mt-3 flex items-center justify-between rounded-xl bg-gray-50 px-3 py-2 text-xs">
                  <span className="text-gray-700 font-medium truncate max-w-[200px]">
                    {formData.kycDocuments.shopPhotoFileName || "shop_signboard.jpg"}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveDoc("shopPhoto")}
                    className="text-red-500 hover:text-red-700 text-[11px] font-bold"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => handleMockDocUpload("shopPhoto")}
                  className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-[#24833A] bg-[#F4FBF5] py-2.5 text-xs font-bold text-[#24833A] hover:bg-[#E4F0DD] active:scale-95 transition"
                >
                  <Camera size={14} /> Capture / Upload Store Photo
                </button>
              )}
              {errors.shopPhoto && (
                <p className="mt-1 text-xs text-red-600 font-medium">{errors.shopPhoto}</p>
              )}
            </div>
          </div>

          <div className="mt-2 flex items-center gap-3">
            <Button
              variant="secondary"
              size="md"
              className="flex-1"
              onClick={handleBack}
            >
              {t("common.back")}
            </Button>
            <Button
              variant="primary"
              size="md"
              className="flex-2"
              onClick={handleNext}
            >
              {t("seller.onboarding.submitVerification")}
            </Button>
          </div>
        </div>
      )}

      {/* ================= STEP 5: PAYMENT SETUP ================= */}
      {step === 5 && (
        <div className="flex flex-col gap-5 rounded-3xl border border-[#24833A]/20 bg-white p-5 sm:p-6 shadow-2xs">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-[#E4F0DD] px-3 py-1 text-xs font-bold text-[#174D25] mb-2">
              <CreditCard size={14} className="text-[#24833A]" />
              <span>STEP 5 OF 5</span>
            </div>
            <h2 className="text-xl font-bold text-[#174D25]">Payment Setup</h2>
            <p className="text-xs text-gray-500 mt-1">
              Provide bank details for automated customer settlements and payouts.
            </p>
          </div>

          <div className="flex flex-col gap-4">
            {/* Account Holder Name */}
            <div>
              <label htmlFor="accountHolderName" className="block text-xs font-bold text-gray-700 mb-1">
                Account Holder Name <span className="text-red-500">*</span>
              </label>
              <input
                id="accountHolderName"
                type="text"
                value={formData.bankDetails.accountHolderName}
                onChange={(e) =>
                  updateField("bankDetails", {
                    ...formData.bankDetails,
                    accountHolderName: e.target.value,
                  })
                }
                placeholder="e.g. Sri Lakshmi Venkateswara Agro"
                className={`w-full rounded-xl border px-3.5 py-2.5 text-sm font-medium text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#24833A]/20 transition ${
                  errors.accountHolderName ? "border-red-500 bg-red-50/30" : "border-gray-200 focus:border-[#24833A]"
                }`}
              />
              {errors.accountHolderName && (
                <p className="mt-1 text-xs text-red-600 font-medium">{errors.accountHolderName}</p>
              )}
            </div>

            {/* Account Number */}
            <div>
              <label htmlFor="accountNumber" className="block text-xs font-bold text-gray-700 mb-1">
                Bank Account Number <span className="text-red-500">*</span>
              </label>
              <input
                id="accountNumber"
                type="text"
                value={formData.bankDetails.accountNumber}
                onChange={(e) =>
                  updateField("bankDetails", {
                    ...formData.bankDetails,
                    accountNumber: e.target.value.replace(/\D/g, ""),
                  })
                }
                placeholder="50200012345678"
                className={`w-full rounded-xl border px-3.5 py-2.5 text-sm font-medium text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#24833A]/20 transition ${
                  errors.accountNumber ? "border-red-500 bg-red-50/30" : "border-gray-200 focus:border-[#24833A]"
                }`}
              />
              {errors.accountNumber && (
                <p className="mt-1 text-xs text-red-600 font-medium">{errors.accountNumber}</p>
              )}
            </div>

            {/* IFSC Code */}
            <div>
              <label htmlFor="ifscCode" className="block text-xs font-bold text-gray-700 mb-1">
                IFSC Code <span className="text-red-500">*</span>
              </label>
              <input
                id="ifscCode"
                type="text"
                maxLength={11}
                value={formData.bankDetails.ifscCode}
                onChange={(e) =>
                  updateField("bankDetails", {
                    ...formData.bankDetails,
                    ifscCode: e.target.value.toUpperCase(),
                  })
                }
                placeholder="HDFC0000421"
                className={`w-full rounded-xl border px-3.5 py-2.5 text-sm font-medium text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#24833A]/20 transition ${
                  errors.ifscCode ? "border-red-500 bg-red-50/30" : "border-gray-200 focus:border-[#24833A]"
                }`}
              />
              {errors.ifscCode && (
                <p className="mt-1 text-xs text-red-600 font-medium">{errors.ifscCode}</p>
              )}
            </div>

            {/* UPI ID (Optional) */}
            <div>
              <label htmlFor="upiId" className="block text-xs font-bold text-gray-700 mb-1">
                UPI ID <span className="text-gray-400 font-normal">(Optional)</span>
              </label>
              <input
                id="upiId"
                type="text"
                value={formData.bankDetails.upiId || ""}
                onChange={(e) =>
                  updateField("bankDetails", {
                    ...formData.bankDetails,
                    upiId: e.target.value,
                  })
                }
                placeholder="lakshmiagro@okhdfcbank"
                className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm font-medium text-gray-800 placeholder-gray-400 focus:border-[#24833A] focus:outline-none focus:ring-2 focus:ring-[#24833A]/20 transition"
              />
            </div>

            {/* Accept COD Toggle */}
            <div className="flex items-center justify-between rounded-2xl border border-gray-200 bg-gray-50/70 p-3.5">
              <div className="flex flex-col">
                <span className="text-xs font-bold text-gray-800">
                  Accept Cash on Delivery (COD)
                </span>
                <span className="text-[11px] text-gray-500">
                  Allow nearby farmers to pay upon delivery or collection.
                </span>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={formData.acceptCod}
                onClick={() => updateField("acceptCod", !formData.acceptCod)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  formData.acceptCod ? "bg-[#24833A]" : "bg-gray-300"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                    formData.acceptCod ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            {/* Terms and Conditions Checkbox */}
            <div>
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.termsAccepted}
                  onChange={(e) => updateField("termsAccepted", e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded border-gray-300 text-[#24833A] focus:ring-[#24833A]"
                />
                <span className="text-xs text-gray-600 leading-relaxed">
                  I agree to the RaituSevak360 Seller Terms of Service, Fair Pricing Policy, and Agricultural Quality Guarantee.
                </span>
              </label>
              {errors.terms && (
                <p className="mt-1 text-xs text-red-600 font-medium">{errors.terms}</p>
              )}
            </div>
          </div>

          <div className="mt-2 flex items-center gap-3">
            <Button
              variant="secondary"
              size="md"
              className="flex-1"
              onClick={handleBack}
            >
              {t("common.back")}
            </Button>
            <Button
              variant="primary"
              size="md"
              className="flex-2"
              onClick={handleNext}
            >
              {t("seller.onboarding.completeRegistration")}
            </Button>
          </div>
        </div>
      )}

      {/* ================= STEP 6: REGISTRATION SUCCESS ================= */}
      {step === 6 && (
        <div className="flex flex-col items-center gap-5 rounded-3xl border border-[#24833A]/20 bg-white p-6 sm:p-8 text-center shadow-md animate-in fade-in zoom-in-95 duration-200">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#E4F0DD] text-[#24833A] shadow-inner">
            <CheckCircle2 size={48} strokeWidth={2.4} />
          </div>

          <div className="flex flex-col gap-1.5">
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-[#24833A] self-center">
              <ShieldCheck size={14} /> Verification Underway
            </span>
            <h2 className="text-2xl font-black text-[#174D25] tracking-tight">
              Registration Successful!
            </h2>
            <p className="text-xs text-gray-600 max-w-sm mx-auto leading-relaxed">
              Your business application has been received and is currently under verification by our agro-audit team.
            </p>
          </div>

          {/* Registration Summary Card */}
          <div className="w-full rounded-2xl border border-[#24833A]/30 bg-[#F4FBF5] p-4 text-left">
            <div className="flex items-center justify-between border-b border-[#24833A]/10 pb-2.5 mb-2.5">
              <span className="text-xs text-gray-500 font-medium">Registration ID</span>
              <span className="text-xs font-mono font-bold text-[#174D25]">
                {lastRegistrationResult?.registrationId || "RS360-VND-849201"}
              </span>
            </div>
            <div className="flex items-center justify-between border-b border-[#24833A]/10 pb-2.5 mb-2.5">
              <span className="text-xs text-gray-500 font-medium">Business Name</span>
              <span className="text-xs font-bold text-gray-800 truncate max-w-[180px]">
                {formData.businessName || "Sri Lakshmi Venkateswara Agro"}
              </span>
            </div>
            <div className="flex items-center justify-between border-b border-[#24833A]/10 pb-2.5 mb-2.5">
              <span className="text-xs text-gray-500 font-medium">Submitted On</span>
              <span className="text-xs font-semibold text-gray-700">
                {lastRegistrationResult?.submittedAt || "03 Oct 2026"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500 font-medium">Estimated Time</span>
              <span className="text-xs font-bold text-[#24833A]">
                {lastRegistrationResult?.estimatedVerificationDays || "24-48 business hours"}
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-2.5 w-full mt-2">
            <Button
              variant="primary"
              size="lg"
              fullWidth
              onClick={() => router.push("/dashboard")}
            >
              Go to Dashboard
            </Button>
            <Button
              variant="outline"
              size="md"
              fullWidth
              onClick={() => setShowStatusModal(true)}
              leftIcon={<Eye size={14} />}
            >
              Track Verification Status
            </Button>
          </div>
        </div>
      )}

      {/* Verification Status Modal */}
      {showStatusModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs animate-in fade-in duration-150"
        >
          <div className="relative w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl border border-[#24833A]/20">
            <button
              type="button"
              onClick={() => setShowStatusModal(false)}
              className="absolute right-4 top-4 rounded-full p-1.5 text-gray-400 hover:bg-gray-100 transition"
              aria-label="Close"
            >
              <X size={18} />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#E4F0DD] text-[#24833A]">
                <ShieldCheck size={24} />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#174D25]">Verification Status</h3>
                <p className="text-[11px] text-gray-500 font-mono">
                  {lastRegistrationResult?.registrationId || "RS360-VND-849201"}
                </p>
              </div>
            </div>

            <div className="space-y-3 py-2">
              <div className="flex items-start gap-3">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-[#24833A] mt-0.5">
                  <Check size={14} strokeWidth={3} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-800">Application Submitted</h4>
                  <p className="text-[11px] text-gray-500">Business details & documents received</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-700 mt-0.5">
                  <RefreshCw size={12} className="animate-spin" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-800">Document Verification</h4>
                  <p className="text-[11px] text-gray-500">Aadhaar, GST & Storefront check in progress</p>
                </div>
              </div>

              <div className="flex items-start gap-3 opacity-60">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-400 mt-0.5">
                  <ShieldCheck size={14} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-600">Verified Seller Badge</h4>
                  <p className="text-[11px] text-gray-400">Store will go live across RaituSevak360</p>
                </div>
              </div>
            </div>

            <Button
              variant="primary"
              size="md"
              fullWidth
              className="mt-5"
              onClick={() => setShowStatusModal(false)}
            >
              Got it
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
