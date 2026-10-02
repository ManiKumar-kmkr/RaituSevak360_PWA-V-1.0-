"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Sprout,
  TrendingUp,
  CloudSun,
  Bot,
  User,
  ShieldCheck,
  ChevronRight,
  ArrowLeftRight,
  Store,
  Package,
  ShoppingBag,
  GraduationCap,
  BookOpen,
  FileText,
  Landmark,
  Bell,
  Sparkles,
  Sun,
  MapPin,
  UsersRound,
  TestTube,
  FileSpreadsheet,
  Tractor,
  Trees,
} from "lucide-react";
import { useAuthStore } from "@/store/auth-store";
import { useTranslation } from "@/hooks/useTranslation";
import { UserRole } from "@/types";
import RoleSwitchModal from "@/components/layout/RoleSwitchModal";

interface DashboardTile {
  title: string;
  desc: string;
  icon: React.ReactNode;
  badge: string;
  href?: string;
  disabled?: boolean;
}

export default function DashboardPage() {
  const { t } = useTranslation();
  const user = useAuthStore((state) => state.user);
  const selectedRole = useAuthStore((state) => state.selectedRole);

  const [isSwitchModalOpen, setIsSwitchModalOpen] = useState(false);

  const activeRole = ((user?.role || selectedRole || "farmer").toLowerCase() as UserRole);
  const normalizedKey = activeRole === "government" ? "govt" : activeRole;
  const roleTranslated = t(`roles.${normalizedKey}.title`);
  const displayName = user?.name || `${t("dashboard.defaultUser")} ${user?.mobile?.slice(-4) || ""}`;
  const displayMobile = user?.mobile ? `+91 ${user.mobile}` : "";

  // Role switching is strictly between Farmer and Seller only
  const canSwitchRole = activeRole === "farmer" || activeRole === "seller";
  const switchActionLabel =
    activeRole === "farmer"
      ? t("dashboard.switchToSeller")
      : t("dashboard.switchToFarmer");

  // Dashboard Title per saved primary role
  const getDashboardTitle = () => {
    switch (activeRole) {
      case "farmer":
        return t("dashboard.titleFarmer");
      case "seller":
        return t("dashboard.titleSeller");
      case "expert":
        return t("dashboard.titleExpert");
      case "student":
        return t("dashboard.titleStudent");
      case "government":
      case "govt":
        return t("dashboard.titleGovernment");
      default:
        return t("dashboard.title");
    }
  };

  // Role-specific navigation tiles connecting ONLY to real existing destinations
  const getRoleTiles = (): DashboardTile[] => {
    switch (activeRole) {
      case "seller":
        return [
          {
            title: t("dashboard.marketplaceTile"),
            desc: t("dashboard.marketplaceTileDesc"),
            icon: <Store size={22} className="text-[#24833A]" />,
            badge: t("dashboard.badgeLive"),
            href: "/dashboard/marketplace",
          },
          {
            title: t("dashboard.ordersTile"),
            desc: t("dashboard.ordersTileDesc"),
            icon: <ShoppingBag size={22} className="text-[#24833A]" />,
            badge: t("dashboard.badgeActive"),
            href: "/dashboard/orders",
          },
          {
            title: t("dashboard.productsTile"),
            desc: t("dashboard.productsTileDesc"),
            icon: <Package size={22} className="text-gray-400" />,
            badge: t("dashboard.badgeComingSoon"),
            disabled: true,
          },
          {
            title: t("dashboard.mandiTile"),
            desc: t("dashboard.mandiTileDesc"),
            icon: <TrendingUp size={22} className="text-gray-400" />,
            badge: t("dashboard.badgeComingSoon"),
            disabled: true,
          },
        ];
      case "expert":
        return [
          {
            title: t("dashboard.consultationsTile"),
            desc: t("dashboard.consultationsTileDesc"),
            icon: <GraduationCap size={22} className="text-[#24833A]" />,
            badge: "1-on-1 Live",
            href: "/dashboard/consultations",
          },
          {
            title: t("dashboard.cropsTile"),
            desc: t("dashboard.cropsTileDesc"),
            icon: <Sprout size={22} className="text-[#24833A]" />,
            badge: t("dashboard.badgeHealthy"),
            href: "/dashboard/crops",
          },
          {
            title: t("dashboard.soilTile"),
            desc: t("dashboard.soilTileDesc"),
            icon: <TestTube size={22} className="text-[#24833A]" />,
            badge: "Lab NPK",
            href: "/dashboard/soil",
          },
          {
            title: t("dashboard.advisorTile"),
            desc: t("dashboard.advisorTileDesc"),
            icon: <Bot size={22} className="text-[#24833A]" />,
            badge: "AI 24/7",
            href: "/dashboard/ai-advisor",
          },
        ];
      case "student":
        return [
          {
            title: t("dashboard.learningTile"),
            desc: t("dashboard.learningTileDesc"),
            icon: <BookOpen size={22} className="text-[#24833A]" />,
            badge: t("dashboard.badgeActive"),
            href: "/dashboard/learning",
          },
          {
            title: t("dashboard.studentResearchTile"),
            desc: t("dashboard.studentResearchTileDesc"),
            icon: <FileText size={22} className="text-[#24833A]" />,
            badge: t("dashboard.badgeLive"),
            href: "/dashboard/resources",
          },
          {
            title: t("dashboard.schemesTile"),
            desc: t("dashboard.schemesTileDesc"),
            icon: <Landmark size={22} className="text-[#24833A]" />,
            badge: t("dashboard.badgeVerified"),
            href: "/dashboard/schemes",
          },
          {
            title: t("dashboard.advisorTile"),
            desc: t("dashboard.advisorTileDesc"),
            icon: <Bot size={22} className="text-[#24833A]" />,
            badge: "AI 24/7",
            href: "/dashboard/ai-advisor",
          },
        ];
      case "government":
      case "govt":
        return [
          {
            title: t("dashboard.schemesTile"),
            desc: t("dashboard.schemesTileDesc"),
            icon: <Landmark size={22} className="text-[#24833A]" />,
            badge: t("dashboard.badgeActive"),
            href: "/dashboard/schemes",
          },
          {
            title: t("dashboard.announcementsTile"),
            desc: t("dashboard.announcementsTileDesc"),
            icon: <FileSpreadsheet size={22} className="text-[#24833A]" />,
            badge: t("dashboard.badgeLive"),
            href: "/dashboard/reports",
          },
          {
            title: t("dashboard.cropsTile"),
            desc: t("dashboard.cropsTileDesc"),
            icon: <Sprout size={22} className="text-[#24833A]" />,
            badge: t("dashboard.badgeHealthy"),
            href: "/dashboard/crops",
          },
          {
            title: t("dashboard.mandiTile"),
            desc: t("dashboard.mandiTileDesc"),
            icon: <TrendingUp size={22} className="text-gray-400" />,
            badge: t("dashboard.badgeComingSoon"),
            disabled: true,
          },
        ];
      case "farmer":
      default:
        // Approved Figma Farmer Quick Services:
        // Weather, AI Crop, Market Prices, Marketplace, Equipment, Labour, Land, Government Schemes
        return [
          {
            title: t("dashboard.weatherTile"),
            desc: t("dashboard.weatherTileDesc"),
            icon: <CloudSun size={22} className="text-[#24833A]" />,
            badge: "28°C",
            href: "/dashboard/weather",
          },
          {
            title: t("dashboard.aiCropTile"),
            desc: t("dashboard.aiCropTileDesc"),
            icon: <Bot size={22} className="text-[#24833A]" />,
            badge: "AI 24/7",
            href: "/dashboard/ai-advisor",
          },
          {
            title: t("dashboard.marketPricesTile"),
            desc: t("dashboard.marketPricesTileDesc"),
            icon: <TrendingUp size={22} className="text-gray-400" />,
            badge: t("dashboard.badgeComingSoon"),
            disabled: true,
          },
          {
            title: t("dashboard.marketplaceTile"),
            desc: t("dashboard.marketplaceTileDesc"),
            icon: <Store size={22} className="text-[#24833A]" />,
            badge: t("dashboard.badgeLive"),
            href: "/dashboard/marketplace",
          },
          {
            title: t("dashboard.equipmentTile"),
            desc: t("dashboard.equipmentTileDesc"),
            icon: <Tractor size={22} className="text-[#24833A]" />,
            badge: t("dashboard.badgeActive"),
            href: "/dashboard/machinery",
          },
          {
            title: t("dashboard.labourTile"),
            desc: t("dashboard.labourTileDesc"),
            icon: <UsersRound size={22} className="text-[#24833A]" />,
            badge: t("dashboard.badgeActive"),
            href: "/dashboard/labour",
          },
          {
            title: t("dashboard.landTile"),
            desc: t("dashboard.landTileDesc"),
            icon: <Trees size={22} className="text-[#24833A]" />,
            badge: t("dashboard.badgeVerified"),
            href: "/dashboard/farm",
          },
          {
            title: t("dashboard.schemesTile"),
            desc: t("dashboard.schemesTileDesc"),
            icon: <Landmark size={22} className="text-[#24833A]" />,
            badge: t("dashboard.badgeActive"),
            href: "/dashboard/schemes",
          },
        ];
    }
  };

  const tiles = getRoleTiles();

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-5">
      {/* Top Banner & Weather Pill */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-gradient-to-r from-[#174D25] via-[#24833A] to-[#2E9B45] text-white p-5 rounded-3xl shadow-sm">
        <div className="flex flex-col gap-1">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-2.5 py-0.5 text-xs font-semibold text-white/90 backdrop-blur-xs w-fit">
            <Sparkles size={12} className="text-amber-300" />
            <span>{getDashboardTitle()}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white mt-1">
            {t("dashboard.welcome")} {displayName}
          </h1>
          <p className="text-xs text-white/80 font-medium">
            RaituSevak360 Smart Agriculture Ecosystem
          </p>
        </div>

        {/* Real-time Weather / Micro-climate Summary Pill */}
        <Link
          href="/dashboard/weather"
          className="flex items-center gap-2.5 rounded-2xl bg-white/15 px-3.5 py-2 backdrop-blur-md self-start sm:self-auto border border-white/10 transition hover:bg-white/25 active:scale-95 cursor-pointer"
          title="View detailed weather forecast"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-400 text-amber-950 shadow-xs">
            <Sun size={20} className="animate-spin-slow" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold leading-tight">28°C • Sunny</span>
            <span className="inline-flex items-center gap-1 text-[10px] text-white/80 font-medium">
              <MapPin size={10} /> Amaravati, AP
            </span>
          </div>
        </Link>
      </div>

      {/* User Account & Role Card */}
      <div className="rounded-3xl border border-[#24833A]/20 bg-white p-4 sm:p-5 shadow-2xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#E4F0DD] text-[#24833A] shadow-2xs">
              <User size={24} strokeWidth={2.4} />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">
                {t("dashboard.currentRole")}
              </p>
              <h2 className="text-base sm:text-lg font-bold text-[#174D25]">
                {displayName}
              </h2>
              {displayMobile && (
                <p className="text-xs text-gray-400 font-medium">{displayMobile}</p>
              )}
            </div>
          </div>

          <div className="flex flex-col items-end gap-1.5">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#E4F0DD] px-3 py-1 text-xs font-bold text-[#174D25]">
              <ShieldCheck size={14} className="text-[#24833A]" />
              {roleTranslated}
            </span>
          </div>
        </div>

        {/* Role Switch Action (Farmer <-> Seller ONLY) */}
        {canSwitchRole && (
          <div className="mt-4 pt-3.5 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-gray-700">
                {t("dashboard.switchRole")}
              </span>
              <span className="text-[11px] text-gray-500">
                {activeRole === "farmer"
                  ? "Looking to sell agricultural produce or inputs? Switch to Seller anytime."
                  : "Looking for farm advisories, weather & labour? Switch back to Farmer anytime."}
              </span>
            </div>

            <button
              type="button"
              onClick={() => setIsSwitchModalOpen(true)}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#24833A] px-3.5 py-2 text-xs font-semibold text-white shadow-xs transition hover:bg-[#1e6e30] active:scale-95"
            >
              <ArrowLeftRight size={14} strokeWidth={2.4} />
              <span>{switchActionLabel}</span>
            </button>
          </div>
        )}
      </div>

      {/* Role-Specific Feature Tiles Grid */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-sm font-bold uppercase tracking-wider text-gray-700">
            {roleTranslated} Quick Services
          </h2>
          <span className="text-xs text-[#24833A] font-semibold">Active Hub</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          {tiles.map((tile, idx) => {
            if (tile.disabled || !tile.href) {
              return (
                <div
                  key={idx}
                  className="flex items-center justify-between rounded-2xl border border-dashed border-gray-200 bg-gray-50/70 p-4 shadow-2xs select-none"
                  title="This service is under development and will be connected in a future phase."
                  aria-disabled="true"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-gray-400">
                      {tile.icon}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-gray-600">
                          {tile.title}
                        </h3>
                        <span className="rounded-md bg-amber-50 border border-amber-200/60 px-1.5 py-0.5 text-[10px] font-semibold text-amber-700">
                          {tile.badge}
                        </span>
                      </div>
                      <p className="mt-0.5 text-xs text-gray-400 line-clamp-1">
                        {tile.desc}
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 shrink-0">
                    Phase 3
                  </span>
                </div>
              );
            }

            return (
              <Link
                key={idx}
                href={tile.href}
                className="flex items-center justify-between rounded-2xl border border-gray-200 bg-white p-4 shadow-2xs transition hover:border-[#24833A]/60 hover:shadow-xs active:scale-[0.99]"
              >
                <div className="flex items-center gap-3.5">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#F4FBF5] text-[#24833A]">
                    {tile.icon}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-gray-900">
                        {tile.title}
                      </h3>
                      <span className="rounded-md bg-emerald-50 px-1.5 py-0.5 text-[10px] font-semibold text-[#24833A]">
                        {tile.badge}
                      </span>
                    </div>
                    <p className="mt-0.5 text-xs text-gray-500 line-clamp-1">
                      {tile.desc}
                    </p>
                  </div>
                </div>
                <ChevronRight size={18} className="text-gray-400 shrink-0" />
              </Link>
            );
          })}
        </div>
      </div>

      {/* Reusable Role Switch Modal */}
      <RoleSwitchModal
        isOpen={isSwitchModalOpen}
        onClose={() => setIsSwitchModalOpen(false)}
      />
    </div>
  );
}
