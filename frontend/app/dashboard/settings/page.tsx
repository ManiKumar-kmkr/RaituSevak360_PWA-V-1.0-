"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Settings,
  Globe,
  Shield,
  Info,
  LogOut,
  ArrowLeftRight,
  ChevronRight,
  Smartphone,
  ExternalLink,
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

export default function SettingsPage() {
  const router = useRouter();
  const { t, language, setLanguage } = useTranslation();
  const user = useAuthStore((state) => state.user);
  const selectedRole = useAuthStore((state) => state.selectedRole);
  const logout = useAuthStore((state) => state.logout);

  const [isSwitchModalOpen, setIsSwitchModalOpen] = useState(false);

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
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-5">
      {/* Header */}
      <div className="flex items-center gap-3.5 rounded-3xl bg-white p-5 border border-gray-200 shadow-2xs">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#E4F0DD] text-[#24833A] shadow-2xs">
          <Settings size={24} strokeWidth={2.4} />
        </div>
        <div>
          <h1 className="text-lg font-bold text-gray-900">
            {t("settings.title")}
          </h1>
          <p className="text-xs text-gray-500 font-medium">
            {t("settings.subtitle")}
          </p>
        </div>
      </div>

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

      {/* Role Switching Section (Farmer <-> Seller only) */}
      {canSwitchRole && (
        <div className="rounded-3xl border border-[#24833A]/20 bg-white p-5 shadow-2xs flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-gray-900">
              {t("profile.roleManagement")}
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Current: <strong className="text-[#174D25]">{roleTranslated}</strong>
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsSwitchModalOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-xl bg-[#24833A] px-3.5 py-2 text-xs font-semibold text-white shadow-xs transition hover:bg-[#1e6e30] active:scale-95"
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
