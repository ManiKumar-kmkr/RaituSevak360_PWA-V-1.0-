"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  User,
  ShieldCheck,
  ArrowLeftRight,
  Settings,
  LogOut,
  Globe,
  ChevronDown,
} from "lucide-react";
import { useAuthStore } from "@/store/auth-store";
import { useTranslation } from "@/hooks/useTranslation";
import { getNavigationForRole } from "@/config/navigation";
import { UserRole } from "@/types";
import authService from "@/services/auth";
import RoleSwitchModal from "./RoleSwitchModal";

const LANGUAGES = [
  { code: "te", label: "తెలుగు" },
  { code: "en", label: "English" },
  { code: "hi", label: "हिन्दी" },
];

export default function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { t, language, setLanguage } = useTranslation();
  const user = useAuthStore((state) => state.user);
  const selectedRole = useAuthStore((state) => state.selectedRole);
  const logout = useAuthStore((state) => state.logout);

  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);

  const activeRole = ((user?.role || selectedRole || "farmer").toLowerCase() as UserRole);
  const normalizedKey = activeRole === "government" ? "govt" : activeRole;
  const roleTranslated = t(`roles.${normalizedKey}.title`);
  const navItems = getNavigationForRole(activeRole);

  const canSwitchRole = activeRole === "farmer" || activeRole === "seller";
  const switchActionLabel =
    activeRole === "farmer"
      ? t("dashboard.switchToSeller")
      : t("dashboard.switchToFarmer");

  const displayName = user?.name || `${t("dashboard.defaultUser")} ${user?.mobile?.slice(-4) || ""}`;
  const displayMobile = user?.mobile ? `+91 ${user.mobile}` : "";

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
    <>
      <aside
        aria-label="Desktop Navigation Sidebar"
        style={{ zIndex: 45 }}
        className="hidden md:flex flex-col w-64 shrink-0 border-r border-gray-200 bg-white sticky top-16 h-[calc(100vh-4rem)] p-4 justify-between overflow-y-auto z-[45]"
      >
        <div>
          {/* User Account Card */}
          <div className="rounded-2xl border border-[#24833A]/20 bg-[#F4FBF5] p-3.5 shadow-2xs mb-5">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#E4F0DD] text-[#24833A]">
                <User size={22} strokeWidth={2.2} />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-sm font-bold text-gray-900 truncate">
                  {displayName}
                </h3>
                {displayMobile && (
                  <p className="text-[11px] font-medium text-gray-500 truncate">
                    {displayMobile}
                  </p>
                )}
                <div className="mt-1 inline-flex items-center gap-1 rounded-full bg-[#E4F0DD] px-2 py-0.5 text-[10px] font-bold text-[#174D25]">
                  <ShieldCheck size={11} className="text-[#24833A]" />
                  <span className="truncate max-w-[120px]">{roleTranslated}</span>
                </div>
              </div>
            </div>

            {/* Role Switch Action inside Sidebar */}
            {canSwitchRole && (
              <button
                id="sidebar-btn-role-switch"
                type="button"
                onClick={() => setIsRoleModalOpen(true)}
                className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-xl bg-white border border-[#24833A]/30 py-1.5 text-xs font-semibold text-[#174D25] shadow-2xs transition hover:bg-[#E4F0DD] active:scale-95 cursor-pointer"
              >
                <ArrowLeftRight size={13} strokeWidth={2.4} className="text-[#24833A]" />
                <span className="truncate">{switchActionLabel}</span>
              </button>
            )}
          </div>

          {/* Navigation Links for Active Role */}
          <nav className="flex flex-col gap-1.5">
            <div className="px-3 pb-1 text-[11px] font-bold uppercase tracking-wider text-gray-400">
              {roleTranslated}
            </div>

            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = item.exact
                ? pathname === item.href
                : pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));

              const label = t(item.labelKey);

              return (
                <Link
                  key={item.id}
                  id={`sidebar-nav-${item.id}`}
                  href={item.href}
                  className={`
                    flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition cursor-pointer
                    ${
                      isActive
                        ? "bg-[#E4F0DD] font-bold text-[#174D25] shadow-2xs"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }
                  `}
                  aria-current={isActive ? "page" : undefined}
                >
                  <Icon
                    size={19}
                    strokeWidth={isActive ? 2.4 : 2}
                    className={isActive ? "text-[#24833A]" : "text-gray-500"}
                  />
                  <span className="flex-1 truncate">{label}</span>
                </Link>
              );
            })}

            {/* Settings Link */}
            <div className="pt-3 mt-3 border-t border-gray-100">
              <Link
                id="sidebar-nav-settings"
                href="/dashboard/settings"
                className={`
                  flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition cursor-pointer
                  ${
                    pathname.startsWith("/dashboard/settings")
                      ? "bg-[#E4F0DD] font-bold text-[#174D25] shadow-2xs"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }
                `}
              >
                <Settings
                  size={19}
                  className={pathname.startsWith("/dashboard/settings") ? "text-[#24833A]" : "text-gray-500"}
                />
                <span className="flex-1 truncate">{t("nav.settings")}</span>
              </Link>
            </div>
          </nav>
        </div>

        {/* Bottom Preferences & Logout */}
        <div className="border-t border-gray-100 pt-4 flex flex-col gap-2">
          {/* Language Switcher Button in Sidebar */}
          <div className="relative">
            <button
              id="sidebar-btn-language"
              type="button"
              onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
              className="flex w-full items-center justify-between rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-700 shadow-2xs hover:bg-gray-50 transition cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Globe size={15} className="text-[#24833A]" />
                <span>{t("settings.appLanguage")}</span>
              </div>
              <div className="flex items-center gap-1 text-gray-500">
                <span className="uppercase text-[11px] font-bold">{language}</span>
                <ChevronDown size={13} />
              </div>
            </button>

            {isLangMenuOpen && (
              <div
                className="absolute bottom-full mb-1.5 left-0 right-0 rounded-2xl border border-gray-200 bg-white py-1.5 shadow-lg z-50 animate-in fade-in zoom-in-95 duration-100"
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
                    className={`flex w-full items-center justify-between px-3 py-2 text-xs font-medium transition cursor-pointer ${
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

          {/* Logout Button */}
          <button
            id="sidebar-btn-logout"
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 bg-white py-2 text-xs font-semibold text-red-600 shadow-2xs hover:bg-red-50 transition active:scale-95 cursor-pointer"
          >
            <LogOut size={15} />
            <span>{t("common.logout")}</span>
          </button>
        </div>
      </aside>

      <RoleSwitchModal
        isOpen={isRoleModalOpen}
        onClose={() => setIsRoleModalOpen(false)}
      />
    </>
  );
}
