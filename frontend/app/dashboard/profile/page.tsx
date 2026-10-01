"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  User,
  ShieldCheck,
  Phone,
  Mail,
  Calendar,
  ArrowLeftRight,
  Globe,
  Bell,
  Settings,
  LogOut,
  CheckCircle2,
  Lock,
} from "lucide-react";
import { useAuthStore } from "@/store/auth-store";
import { useTranslation } from "@/hooks/useTranslation";
import { UserRole } from "@/types";
import authService from "@/services/auth";
import RoleSwitchModal from "@/components/layout/RoleSwitchModal";

const LANGUAGES = [
  { code: "te", label: "తెలుగు" },
  { code: "en", label: "English" },
  { code: "hi", label: "हिन्दी" },
];

export default function ProfilePage() {
  const router = useRouter();
  const { t, language, setLanguage } = useTranslation();
  const user = useAuthStore((state) => state.user);
  const selectedRole = useAuthStore((state) => state.selectedRole);
  const logout = useAuthStore((state) => state.logout);

  const [isSwitchModalOpen, setIsSwitchModalOpen] = useState(false);

  const activeRole = ((user?.role || selectedRole || "farmer").toLowerCase() as UserRole);
  const normalizedKey = activeRole === "government" ? "govt" : activeRole;
  const roleTranslated = t(`roles.${normalizedKey}.title`);

  const displayName = user?.name || `${t("dashboard.defaultUser")} ${user?.mobile?.slice(-4) || ""}`;
  const displayMobile = user?.mobile ? `+91 ${user.mobile}` : t("profile.notProvided");
  const displayEmail = user?.email || t("profile.notProvided");

  // Only Farmer <-> Seller switching is permitted
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
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-5">
      {/* Header Banner */}
      <div className="flex items-center gap-4 rounded-3xl bg-white p-5 border border-[#24833A]/20 shadow-2xs">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[#E4F0DD] text-[#24833A] shadow-xs">
          <User size={34} strokeWidth={2.2} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-gray-900 truncate">
              {displayName}
            </h1>
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-[#24833A]">
              <CheckCircle2 size={11} />
              {t("profile.verified")}
            </span>
          </div>
          <p className="text-xs font-medium text-gray-500 mt-0.5">
            {displayMobile}
          </p>
          <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-[#E4F0DD] px-3 py-0.5 text-xs font-bold text-[#174D25]">
            <ShieldCheck size={13} className="text-[#24833A]" />
            <span>{roleTranslated}</span>
          </div>
        </div>
      </div>

      {/* Account Details Section */}
      <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-2xs">
        <h2 className="text-sm font-bold uppercase tracking-wider text-gray-700 mb-4">
          {t("profile.accountDetails")}
        </h2>

        <div className="flex flex-col divide-y divide-gray-100">
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center gap-3">
              <User size={18} className="text-gray-400" />
              <span className="text-xs font-medium text-gray-500">
                {t("profile.fullName")}
              </span>
            </div>
            <span className="text-xs font-bold text-gray-900">{displayName}</span>
          </div>

          <div className="flex items-center justify-between py-3">
            <div className="flex items-center gap-3">
              <Phone size={18} className="text-gray-400" />
              <span className="text-xs font-medium text-gray-500">
                {t("profile.mobileNumber")}
              </span>
            </div>
            <span className="text-xs font-bold text-gray-900">{displayMobile}</span>
          </div>

          <div className="flex items-center justify-between py-3">
            <div className="flex items-center gap-3">
              <Mail size={18} className="text-gray-400" />
              <span className="text-xs font-medium text-gray-500">
                {t("profile.emailAddress")}
              </span>
            </div>
            <span className="text-xs font-semibold text-gray-700">{displayEmail}</span>
          </div>

          <div className="flex items-center justify-between py-3">
            <div className="flex items-center gap-3">
              <Calendar size={18} className="text-gray-400" />
              <span className="text-xs font-medium text-gray-500">
                {t("profile.accountStatus")}
              </span>
            </div>
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-bold text-emerald-700">
              <CheckCircle2 size={12} />
              {t("profile.verified")}
            </span>
          </div>
        </div>
      </div>

      {/* Role Management Card */}
      <div className="rounded-3xl border border-[#24833A]/20 bg-white p-5 shadow-2xs">
        <h2 className="text-sm font-bold uppercase tracking-wider text-gray-700 mb-2">
          {t("profile.roleManagement")}
        </h2>

        <div className="flex items-center justify-between py-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-gray-500">
                {t("profile.activeRole")}:
              </span>
              <span className="text-xs font-bold text-[#174D25]">
                {roleTranslated}
              </span>
            </div>
            <p className="text-[11px] text-gray-500 mt-1">
              {canSwitchRole
                ? t("profile.roleSwitchEligible")
                : t("profile.roleFixed")}
            </p>
          </div>

          {canSwitchRole ? (
            <button
              type="button"
              onClick={() => setIsSwitchModalOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#24833A] px-3.5 py-2 text-xs font-semibold text-white shadow-xs transition hover:bg-[#1e6e30] active:scale-95"
            >
              <ArrowLeftRight size={13} strokeWidth={2.4} />
              <span>{switchActionLabel}</span>
            </button>
          ) : (
            <div className="inline-flex items-center gap-1 rounded-xl bg-gray-100 px-3 py-1.5 text-xs font-semibold text-gray-500">
              <Lock size={12} />
              <span>Fixed Role</span>
            </div>
          )}
        </div>
      </div>

      {/* Language Preference Card */}
      <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-2xs">
        <div className="flex items-center gap-2 mb-3">
          <Globe size={18} className="text-[#24833A]" />
          <h2 className="text-sm font-bold uppercase tracking-wider text-gray-700">
            {t("profile.language")}
          </h2>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              type="button"
              onClick={() => setLanguage(lang.code)}
              className={`rounded-xl py-2.5 px-3 text-center text-xs font-semibold transition active:scale-95 ${
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

      {/* Quick Shortcuts */}
      <div className="rounded-3xl border border-gray-200 bg-white p-4 shadow-2xs flex flex-col gap-2">
        <Link
          href="/dashboard/notifications"
          className="flex items-center justify-between p-3 rounded-2xl hover:bg-gray-50 transition"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-[#24833A]">
              <Bell size={18} />
            </div>
            <div>
              <h3 className="text-xs font-bold text-gray-900">
                {t("nav.notifications")}
              </h3>
              <p className="text-[11px] text-gray-500">
                View alerts and latest announcements
              </p>
            </div>
          </div>
          <span className="text-xs font-semibold text-[#24833A]">Open</span>
        </Link>

        <Link
          href="/dashboard/settings"
          className="flex items-center justify-between p-3 rounded-2xl hover:bg-gray-50 transition"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gray-100 text-gray-600">
              <Settings size={18} />
            </div>
            <div>
              <h3 className="text-xs font-bold text-gray-900">
                {t("nav.settings")}
              </h3>
              <p className="text-[11px] text-gray-500">
                Manage preferences & privacy
              </p>
            </div>
          </div>
          <span className="text-xs font-semibold text-gray-500">Configure</span>
        </Link>
      </div>

      {/* Logout Action */}
      <button
        type="button"
        onClick={handleLogout}
        className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl border border-red-200 bg-white text-sm font-bold text-red-600 shadow-2xs transition hover:bg-red-50 active:scale-98"
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
