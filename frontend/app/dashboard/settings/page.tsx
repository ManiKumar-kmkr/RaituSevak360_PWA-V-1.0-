"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Settings,
  Globe,
  Info,
  LogOut,
  ArrowLeftRight,
  ArrowLeft,
  Store,
  CreditCard,
  Package,
  ShieldCheck,
  CheckCircle2,
  Bell,
  Clock,
  GraduationCap,
  Video,
  Mic,
  Landmark,
} from "lucide-react";
import { useAuthStore } from "@/store/auth-store";
import { useSellerStore } from "@/store/seller-store";
import { useExpertStore } from "@/store/expert-store";
import { useTranslation } from "@/hooks/useTranslation";
import { UserRole } from "@/types";
import authService from "@/services/auth";
import RoleSwitchModal from "@/components/layout/RoleSwitchModal";
import BackButton from "@/components/ui/BackButton";

const LANGUAGES = [
  { code: "te", label: "తెలుగు" },
  { code: "en", label: "English" },
  { code: "hi", label: "हिन्दी" },
];

export default function SettingsPage() {
  const router = useRouter();
  const { t, language, setLanguage } = useTranslation();
  const user = useAuthStore((state) => state.user);
  const selectedRole = useAuthStore((state) => state.selectedRole);
  const logout = useAuthStore((state) => state.logout);

  // Seller store data for seller-specific settings
  const onboardingData = useSellerStore((state) => state.onboardingData);
  const verificationStatus = useSellerStore((state) => state.verificationStatus);
  const products = useSellerStore((state) => state.products);

  // Expert store data for expert-specific settings
  const expertProfile = useExpertStore((state) => state.profile);
  const setExpertAvailability = useExpertStore((state) => state.setAvailability);

  const [isSwitchModalOpen, setIsSwitchModalOpen] = useState(false);
  const [orderAlerts, setOrderAlerts] = useState(true);
  const [leadAlerts, setLeadAlerts] = useState(true);
  const [payoutAlerts, setPayoutAlerts] = useState(true);

  // Expert alert states
  const [farmerAlerts, setFarmerAlerts] = useState(true);
  const [reminderAlerts, setReminderAlerts] = useState(true);
  const [digestAlerts, setDigestAlerts] = useState(true);

  // Government / NGO alert states
  const [schemeAlerts, setSchemeAlerts] = useState(true);
  const [disasterAlerts, setDisasterAlerts] = useState(true);
  const [censusDigestAlerts, setCensusDigestAlerts] = useState(true);

  const activeRole = ((user?.role || selectedRole || "farmer").toLowerCase() as UserRole);
  const normalizedKey = activeRole === "government" ? "govt" : activeRole;
  const roleTranslated = t(`roles.${normalizedKey}.title`);

  const canSwitchRole = activeRole === "farmer" || activeRole === "seller";
  const switchActionLabel =
    activeRole === "farmer"
      ? t("dashboard.switchToSeller")
      : t("dashboard.switchToFarmer");

  const handleLogout = async () => {
    try {
      await authService.logoutUser();
    } catch {
      // Ignore
    }
    logout();
    router.replace("/login");
  };

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-5 pb-16">
      {/* Top Breadcrumb Back Navigation (Omitted for expert since AppHeader already provides predictable back arrow) */}
      {activeRole !== "expert" && (
        <div className="flex items-center justify-between">
          <BackButton
            id="settings-back-link"
            href="/dashboard"
            label={t("common.backToDashboard") || "Back to Dashboard"}
          />
        </div>
      )}

      {/* Header — Role specific */}
      <div className="flex items-center gap-3.5 rounded-3xl bg-white p-5 border border-gray-200 shadow-2xs">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#E4F0DD] text-[#24833A] shadow-2xs">
          {activeRole === "seller" ? (
            <Store size={24} strokeWidth={2.4} />
          ) : activeRole === "expert" ? (
            <GraduationCap size={24} strokeWidth={2.4} />
          ) : activeRole === "government" || activeRole === "govt" ? (
            <Landmark size={24} strokeWidth={2.4} />
          ) : (
            <Settings size={24} strokeWidth={2.4} />
          )}
        </div>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
            {activeRole === "seller"
              ? t("seller.settings.title")
              : activeRole === "expert"
              ? "Agriculture Expert Settings"
              : activeRole === "government" || activeRole === "govt"
              ? "Government / NGO Representative Settings"
              : t("settings.title")}
          </h1>
          <p className="text-xs text-gray-500 font-medium">
            {activeRole === "seller"
              ? t("seller.settings.subtitle")
              : activeRole === "expert"
              ? "Consultation availability, alert preferences, and advisory settings"
              : activeRole === "government" || activeRole === "govt"
              ? "Administrative notices, welfare program alerts and jurisdiction settings"
              : t("settings.subtitle")}
          </p>
        </div>
      </div>

      {/* ================= SELLER-SPECIFIC SETTINGS SECTIONS ================= */}
      {activeRole === "seller" && (
        <>
          {/* Business Store & KYC Preferences */}
          <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-2xs flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Store size={18} className="text-[#24833A]" />
                <h2 className="text-sm font-bold text-gray-900">
                  {t("seller.settings.businessStore")}
                </h2>
              </div>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-[#24833A]">
                <ShieldCheck size={12} />
                {verificationStatus === "verified"
                  ? t("seller.settings.statusVerified")
                  : t("seller.settings.statusPending")}
              </span>
            </div>
            <p className="text-xs text-gray-500">
              {t("seller.settings.businessStoreDesc")}
            </p>

            <div className="rounded-2xl bg-gray-50 p-3.5 flex flex-col gap-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-gray-500 font-medium">Store Name:</span>
                <span className="font-bold text-gray-800">
                  {onboardingData.businessName || "Kisan Agro Supplies & Seeds"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500 font-medium">Trade Category:</span>
                <span className="font-semibold text-gray-700">
                  {onboardingData.businessCategories.length > 0
                    ? onboardingData.businessCategories.join(", ")
                    : "Seeds & Fertilizers, Equipment"}
                </span>
              </div>
            </div>

            <Link
              id="settings-link-manage-store"
              href="/dashboard/seller/onboarding"
              className="inline-flex items-center justify-center rounded-xl border border-[#24833A]/30 bg-[#F4FBF5] py-2.5 text-xs font-bold text-[#174D25] hover:bg-[#E4F0DD] transition active:scale-98"
            >
              {t("seller.settings.manageStore")} →
            </Link>
          </div>

          {/* Payments & Bank Settlements Preferences */}
          <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-2xs flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CreditCard size={18} className="text-[#24833A]" />
                <h2 className="text-sm font-bold text-gray-900">
                  {t("seller.settings.settlements")}
                </h2>
              </div>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700">
                <CheckCircle2 size={12} /> Active
              </span>
            </div>
            <p className="text-xs text-gray-500">
              {t("seller.settings.settlementsDesc")}
            </p>

            <div className="rounded-2xl bg-gray-50 p-3.5 flex flex-col gap-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-gray-500 font-medium">Primary Settlement:</span>
                <span className="font-mono font-bold text-gray-800">
                  {onboardingData.bankDetails?.accountNumber
                    ? `••••${onboardingData.bankDetails.accountNumber.slice(-4)} (${onboardingData.bankDetails.ifscCode})`
                    : "HDFC Bank ••••4829 (HDFC0001024)"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500 font-medium">Payout Cycle:</span>
                <span className="inline-flex items-center gap-1 font-semibold text-gray-700">
                  <Clock size={12} className="text-gray-400" /> Daily Auto-Settlement (T+1)
                </span>
              </div>
            </div>

            <Link
              id="settings-link-view-settlements"
              href="/dashboard/seller/payments"
              className="inline-flex items-center justify-center rounded-xl border border-[#24833A]/30 bg-[#F4FBF5] py-2.5 text-xs font-bold text-[#174D25] hover:bg-[#E4F0DD] transition active:scale-98"
            >
              {t("seller.settings.viewSettlements")} →
            </Link>
          </div>

          {/* Product Catalog Preferences */}
          <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-2xs flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Package size={18} className="text-[#24833A]" />
                <h2 className="text-sm font-bold text-gray-900">
                  {t("seller.settings.catalogPrefs")}
                </h2>
              </div>
              <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-[#174D25]">
                {products.length} Active Listings
              </span>
            </div>
            <p className="text-xs text-gray-500">
              {t("seller.settings.catalogPrefsDesc")}
            </p>

            <Link
              id="settings-link-manage-catalog"
              href="/dashboard/seller/products"
              className="inline-flex items-center justify-center rounded-xl border border-[#24833A]/30 bg-[#F4FBF5] py-2.5 text-xs font-bold text-[#174D25] hover:bg-[#E4F0DD] transition active:scale-98"
            >
              {t("seller.settings.manageCatalog")} →
            </Link>
          </div>

          {/* Seller Order & Lead Notifications */}
          <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-2xs flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <Bell size={18} className="text-[#24833A]" />
              <h2 className="text-sm font-bold text-gray-900">
                {t("seller.settings.sellerNotifications")}
              </h2>
            </div>
            <p className="text-xs text-gray-500">
              {t("seller.settings.sellerNotificationsDesc")}
            </p>

            <div className="flex flex-col divide-y divide-gray-100 text-xs">
              <div className="flex items-center justify-between py-2.5">
                <div>
                  <p className="font-bold text-gray-800">Farmer Buy Leads & Quotes</p>
                  <p className="text-[11px] text-gray-500">Instant SMS & alert on new harvest inquiries</p>
                </div>
                <input
                  type="checkbox"
                  checked={leadAlerts}
                  onChange={(e) => setLeadAlerts(e.target.checked)}
                  className="h-4 w-4 rounded accent-[#24833A] cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between py-2.5">
                <div>
                  <p className="font-bold text-gray-800">Customer Purchases & Orders</p>
                  <p className="text-[11px] text-gray-500">Dispatch alerts and buyer confirmations</p>
                </div>
                <input
                  type="checkbox"
                  checked={orderAlerts}
                  onChange={(e) => setOrderAlerts(e.target.checked)}
                  className="h-4 w-4 rounded accent-[#24833A] cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between py-2.5">
                <div>
                  <p className="font-bold text-gray-800">Payout & Settlement Confirmation</p>
                  <p className="text-[11px] text-gray-500">Bank credit alerts when funds transfer</p>
                </div>
                <input
                  type="checkbox"
                  checked={payoutAlerts}
                  onChange={(e) => setPayoutAlerts(e.target.checked)}
                  className="h-4 w-4 rounded accent-[#24833A] cursor-pointer"
                />
              </div>
            </div>
          </div>
        </>
      )}

      {/* ================= EXPERT-SPECIFIC SETTINGS SECTIONS ================= */}
      {activeRole === "expert" && (
        <>
          {/* Availability & Working Hours Card */}
          <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-2xs flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock size={18} className="text-[#24833A]" />
                <h2 className="text-sm font-bold text-gray-900">
                  Advisory Availability & Schedule
                </h2>
              </div>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-[#174D25] border border-emerald-200">
                <ShieldCheck size={12} />
                Verified Agronomist
              </span>
            </div>
            <p className="text-xs text-gray-500">
              Set your current tele-consultation desk status for incoming farmer requests.
            </p>

            {/* Daily Availability Status Selector */}
            <div className="rounded-2xl bg-gray-50 p-3.5 flex flex-col gap-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-gray-500 font-medium">Current Status:</span>
                <span className="font-bold text-[#174D25] capitalize">
                  {expertProfile.dailyAvailability || "Available"}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {(["available", "busy", "offline"] as const).map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setExpertAvailability(mode)}
                    className={`rounded-xl py-2 px-2 text-center text-xs font-bold transition active:scale-95 cursor-pointer capitalize ${
                      (expertProfile.dailyAvailability?.toLowerCase() || "available") === mode
                        ? mode === "available"
                          ? "bg-[#24833A] text-white shadow-xs"
                          : mode === "busy"
                          ? "bg-amber-600 text-white shadow-xs"
                          : "bg-gray-700 text-white shadow-xs"
                        : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                    }`}
                  >
                    ● {mode}
                  </button>
                ))}
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-gray-200/60">
                <span className="text-gray-500 font-medium">Standard Hours:</span>
                <span className="font-semibold text-gray-800">
                  09:00 AM - 06:00 PM (Mon - Sat)
                </span>
              </div>
            </div>
          </div>

          {/* Consultation Modes & Channels Card */}
          <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-2xs flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <Video size={18} className="text-[#24833A]" />
              <h2 className="text-sm font-bold text-gray-900">
                Consultation Channels
              </h2>
            </div>
            <p className="text-xs text-gray-500">
              Communication channels enabled for cultivator advisory sessions.
            </p>

            <div className="flex flex-col divide-y divide-gray-100 text-xs">
              <div className="flex items-center justify-between py-2.5">
                <div className="flex items-center gap-2.5">
                  <Video size={16} className="text-[#24833A]" />
                  <div>
                    <p className="font-bold text-gray-800">Video Consultations</p>
                    <p className="text-[11px] text-gray-500">High-definition foliage diagnosis</p>
                  </div>
                </div>
                <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-[#174D25]">
                  Active
                </span>
              </div>

              <div className="flex items-center justify-between py-2.5">
                <div className="flex items-center gap-2.5">
                  <Mic size={16} className="text-[#24833A]" />
                  <div>
                    <p className="font-bold text-gray-800">Voice Audio Calls</p>
                    <p className="text-[11px] text-gray-500">Low-bandwidth remote mandal advisory</p>
                  </div>
                </div>
                <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-[#174D25]">
                  Active
                </span>
              </div>
            </div>
          </div>

          {/* Expert Alert & Notification Preferences */}
          <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-2xs flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <Bell size={18} className="text-[#24833A]" />
              <h2 className="text-sm font-bold text-gray-900">
                Advisory Alert Preferences
              </h2>
            </div>
            <p className="text-xs text-gray-500">
              Manage instant alerts for cultivator inquiries and schedule milestones.
            </p>

            <div className="flex flex-col divide-y divide-gray-100 text-xs">
              <div className="flex items-center justify-between py-2.5">
                <div>
                  <p className="font-bold text-gray-800">Incoming Farmer Requests</p>
                  <p className="text-[11px] text-gray-500">Instant app alert when farmers request guidance</p>
                </div>
                <input
                  type="checkbox"
                  checked={farmerAlerts}
                  onChange={(e) => setFarmerAlerts(e.target.checked)}
                  className="h-4 w-4 rounded accent-[#24833A] cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between py-2.5">
                <div>
                  <p className="font-bold text-gray-800">Session Reminders</p>
                  <p className="text-[11px] text-gray-500">Push notification 15 minutes prior to appointment</p>
                </div>
                <input
                  type="checkbox"
                  checked={reminderAlerts}
                  onChange={(e) => setReminderAlerts(e.target.checked)}
                  className="h-4 w-4 rounded accent-[#24833A] cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between py-2.5">
                <div>
                  <p className="font-bold text-gray-800">Weekly Advisory Digest</p>
                  <p className="text-[11px] text-gray-500">Case summary and farmer satisfaction score</p>
                </div>
                <input
                  type="checkbox"
                  checked={digestAlerts}
                  onChange={(e) => setDigestAlerts(e.target.checked)}
                  className="h-4 w-4 rounded accent-[#24833A] cursor-pointer"
                />
              </div>
            </div>
          </div>
        </>
      )}

      {/* ================= GOVERNMENT / NGO SPECIFIC SETTINGS ================= */}
      {(activeRole === "government" || activeRole === "govt") && (
        <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-2xs flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <Bell size={18} className="text-[#24833A]" />
            <h2 className="text-sm font-bold text-gray-900">
              Administrative & Program Alert Preferences
            </h2>
          </div>
          <p className="text-xs text-gray-500">
            Configure broadcast alerts and automated notifications for your district jurisdiction.
          </p>

          <div className="flex flex-col divide-y divide-gray-100 text-xs">
            <div className="flex items-center justify-between py-2.5">
              <div>
                <p className="font-bold text-gray-800">Scheme Applications & Verifications</p>
                <p className="text-[11px] text-gray-500">
                  Instant alert when cultivators submit welfare or subsidy applications
                </p>
              </div>
              <input
                type="checkbox"
                checked={schemeAlerts}
                onChange={(e) => setSchemeAlerts(e.target.checked)}
                className="h-4 w-4 rounded accent-[#24833A] cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between py-2.5">
              <div>
                <p className="font-bold text-gray-800">Disaster & Weather Emergency Warnings</p>
                <p className="text-[11px] text-gray-500">
                  Urgent broadcast trigger when IMD or APSDMA issues red/orange alerts
                </p>
              </div>
              <input
                type="checkbox"
                checked={disasterAlerts}
                onChange={(e) => setDisasterAlerts(e.target.checked)}
                className="h-4 w-4 rounded accent-[#24833A] cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between py-2.5">
              <div>
                <p className="font-bold text-gray-800">Weekly Mandal Sowing & Audit Digest</p>
                <p className="text-[11px] text-gray-500">
                  Weekly summary report of acreage coverage and crop disease alerts
                </p>
              </div>
              <input
                type="checkbox"
                checked={censusDigestAlerts}
                onChange={(e) => setCensusDigestAlerts(e.target.checked)}
                className="h-4 w-4 rounded accent-[#24833A] cursor-pointer"
              />
            </div>
          </div>
        </div>
      )}

      {/* ================= SHARED ACCOUNT SETTINGS ================= */}
      {/* Language Selector Section */}
      <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-2xs">
        <div className="flex items-center gap-2 mb-1.5">
          <Globe size={18} className="text-[#24833A]" />
          <h2 className="text-sm font-bold text-gray-900">
            {t("settings.appLanguage")}
          </h2>
        </div>
        <p className="text-xs text-gray-500 mb-3.5">
          {t("settings.languageDesc")}
        </p>

        <div className="grid grid-cols-3 gap-2.5">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              id={`settings-lang-${lang.code}`}
              type="button"
              onClick={() => setLanguage(lang.code)}
              className={`rounded-xl py-2.5 px-3 text-center text-xs font-semibold transition active:scale-95 cursor-pointer ${
                language === lang.code
                  ? "bg-[#24833A] text-white shadow-xs"
                  : "bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200"
              }`}
            >
              {lang.label}
            </button>
          ))}
        </div>
      </div>

      {/* Role Switching Section (Farmer <-> Seller only) */}
      {canSwitchRole && (
        <div className="rounded-3xl border border-[#24833A]/20 bg-white p-5 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-gray-900">
              {t("profile.roleManagement")}
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Current: <strong className="text-[#174D25]">{roleTranslated}</strong>
            </p>
          </div>

          <button
            id="settings-btn-role-switch"
            type="button"
            onClick={() => setIsSwitchModalOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-xl bg-[#24833A] px-3.5 py-2 text-xs font-semibold text-white shadow-xs transition hover:bg-[#1e6e30] active:scale-95 cursor-pointer self-start sm:self-auto shrink-0"
          >
            <ArrowLeftRight size={13} strokeWidth={2.4} />
            <span>{switchActionLabel}</span>
          </button>
        </div>
      )}

      {/* About Application Card */}
      <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-2xs flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <Info size={18} className="text-[#24833A]" />
          <h2 className="text-sm font-bold text-gray-900">
            {t("settings.aboutApp")}
          </h2>
        </div>

        <div className="flex flex-col divide-y divide-gray-100 text-xs">
          <div className="flex items-center justify-between py-2.5">
            <span className="text-gray-500 font-medium">Platform</span>
            <span className="font-semibold text-gray-800">
              RaituSevak360 Progressive Web App
            </span>
          </div>
          <div className="flex items-center justify-between py-2.5">
            <span className="text-gray-500 font-medium">Version</span>
            <span className="font-semibold text-gray-800">
              {t("settings.version")}
            </span>
          </div>
          <div className="flex items-center justify-between py-2.5">
            <span className="text-gray-500 font-medium">Architecture</span>
            <span className="font-semibold text-emerald-700">
              Offline-Ready Vernacular PWA
            </span>
          </div>
        </div>
      </div>

      {/* Logout Action */}
      <button
        id="settings-btn-logout"
        type="button"
        onClick={handleLogout}
        className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl border border-red-200 bg-white text-sm font-bold text-red-600 shadow-2xs transition hover:bg-red-50 active:scale-98 cursor-pointer"
      >
        <LogOut size={16} />
        <span>{t("common.logout")}</span>
      </button>

      {/* Role Switch Modal */}
      <RoleSwitchModal
        isOpen={isSwitchModalOpen}
        onClose={() => setIsSwitchModalOpen(false)}
      />
    </div>
  );
}
