"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  Sprout,
  ShieldCheck,
  Bell,
  User,
  LogOut,
  Globe,
  ArrowLeftRight,
  ChevronDown,
  ArrowLeft,
} from "lucide-react";
import { useAuthStore } from "@/store/auth-store";
import { useTranslation } from "@/hooks/useTranslation";
import { UserRole } from "@/types";
import authService from "@/services/auth";
import RoleSwitchModal from "./RoleSwitchModal";

interface AppHeaderProps {
  onOpenRoleSwitch?: () => void;
}

const LANGUAGES = [
  { code: "te", label: "తెలుగు" },
  { code: "en", label: "English" },
  { code: "hi", label: "हिन्दी" },
];

export default function AppHeader({}: AppHeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { t, language, setLanguage } = useTranslation();
  const user = useAuthStore((state) => state.user);
  const selectedRole = useAuthStore((state) => state.selectedRole);
  const logout = useAuthStore((state) => state.logout);

  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);

  const isSubPage = pathname !== "/dashboard";

  const activeRole = ((user?.role || selectedRole || "farmer").toLowerCase() as UserRole);
  const normalizedKey = activeRole === "government" ? "govt" : activeRole;
  const roleTranslated = t(`roles.${normalizedKey}.title`);

  const canSwitchRole = activeRole === "farmer" || activeRole === "seller";
  const switchActionLabel =
    activeRole === "farmer"
      ? t("dashboard.switchToSeller")
      : t("dashboard.switchToFarmer");

  const displayName = user?.name || `${t("dashboard.defaultUser")} ${user?.mobile?.slice(-4) || ""}`;

  const handleLogout = async () => {
    try {
      await authService.logoutUser();
    } catch {
      // Ignore network errors on logout
    }
    logout();
    router.replace("/login");
  };

  return (
    <>
      <header className="sticky top-0 z-30 w-full border-b border-gray-200/80 bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Left: Brand Logo & Title with contextual Back navigation */}
          <div className="flex items-center gap-2 sm:gap-3">
            {isSubPage && (
              <button
                type="button"
                onClick={() => router.back()}
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 bg-white text-[#174D25] shadow-2xs hover:bg-[#E4F0DD] transition active:scale-95"
                aria-label={t("common.back")}
                title={t("common.back")}
              >
                <ArrowLeft size={18} strokeWidth={2.4} />
              </button>
            )}

            <Link
              href="/dashboard"
              className="flex items-center gap-2.5 transition active:scale-95"
              aria-label="RaituSevak360 Home"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E4F0DD] text-[#24833A] shadow-xs">
                <Sprout size={22} strokeWidth={2.4} />
              </div>
              <div className="flex flex-col">
                <span className="text-base font-extrabold tracking-tight text-[#174D25] leading-tight">
                  {t("common.appName")}
                </span>
                <span className="text-[11px] font-semibold text-gray-500">
                  {roleTranslated}
                </span>
              </div>
            </Link>

            {/* Role Badge */}
            <div className="hidden sm:inline-flex items-center gap-1 rounded-full bg-[#E4F0DD] px-2.5 py-1 text-xs font-bold text-[#174D25]">
              <ShieldCheck size={13} className="text-[#24833A]" />
              <span>{roleTranslated}</span>
            </div>
          </div>

          {/* Right: Controls & Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Role Switcher Pill for Farmer <-> Seller */}
            {canSwitchRole && (
              <button
                type="button"
                onClick={() => setIsRoleModalOpen(true)}
                className="hidden sm:inline-flex items-center gap-1.5 rounded-xl border border-[#24833A]/30 bg-[#F4FBF5] px-3 py-1.5 text-xs font-semibold text-[#174D25] transition hover:bg-[#E4F0DD] active:scale-95"
                title={switchActionLabel}
              >
                <ArrowLeftRight size={13} strokeWidth={2.2} className="text-[#24833A]" />
                <span className="max-w-[120px] truncate">{switchActionLabel}</span>
              </button>
            )}

            {/* Language Switcher Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                className="flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-gray-700 shadow-2xs hover:bg-gray-50 transition active:scale-95"
                aria-label="Change Language"
                aria-expanded={isLangMenuOpen}
              >
                <Globe size={14} className="text-[#24833A]" />
                <span className="uppercase text-[11px] font-bold">{language}</span>
                <ChevronDown size={12} className="text-gray-400" />
              </button>

              {isLangMenuOpen && (
                <div
                  className="absolute right-0 mt-1.5 w-32 rounded-2xl border border-gray-200 bg-white py-1.5 shadow-lg z-50 animate-in fade-in zoom-in-95 duration-100"
                  onMouseLeave={() => setIsLangMenuOpen(false)}
                >
                  {LANGUAGES.map((lang) => (
                    <button
                      key={lang.code}
                      type="button"
                      onClick={() => {
                        setLanguage(lang.code);
                        setIsLangMenuOpen(false);
                      }}
                      className={`flex w-full items-center justify-between px-3 py-1.5 text-xs font-medium transition ${
                        language === lang.code
                          ? "bg-[#E4F0DD] font-bold text-[#174D25]"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <span>{lang.label}</span>
                      <span className="text-[10px] uppercase text-gray-400">
                        {lang.code}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Notifications Button */}
            <Link
              href="/dashboard/notifications"
              className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-600 shadow-2xs transition hover:bg-gray-50 hover:text-[#24833A] active:scale-95"
              aria-label="Notifications"
            >
              <Bell size={16} />
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-[#24833A] ring-2 ring-white" />
            </Link>

            {/* Profile Avatar / Name Link */}
            <Link
              href="/dashboard/profile"
              className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-gray-700 shadow-2xs hover:bg-gray-50 transition active:scale-95"
              aria-label="User Profile"
            >
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#E4F0DD] text-[#24833A]">
                <User size={13} strokeWidth={2.4} />
              </div>
              <span className="hidden md:inline max-w-[100px] truncate text-gray-800">
                {displayName}
              </span>
            </Link>

            {/* Logout Button */}
            <button
              type="button"
              onClick={handleLogout}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-red-200 bg-white text-red-600 shadow-2xs transition hover:bg-red-50 active:scale-95"
              title={t("common.logout")}
              aria-label="Log Out"
            >
              <LogOut size={15} />
            </button>
          </div>
        </div>
      </header>

      {/* Global Role Switch Modal for Header button */}
      <RoleSwitchModal
        isOpen={isRoleModalOpen}
        onClose={() => setIsRoleModalOpen(false)}
      />
    </>
  );
}
