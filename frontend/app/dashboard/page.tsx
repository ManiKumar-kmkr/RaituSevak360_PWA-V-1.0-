"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Sprout,
  TrendingUp,
  BarChart3,
  Building2,
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
  Users,
  CreditCard,
  Megaphone,
  ClipboardList,
  MessageSquare,
} from "lucide-react";

import { useAuthStore } from "@/store/auth-store";
import { useSellerStore } from "@/store/seller-store";
import { useExpertStore } from "@/store/expert-store";
import { useGrievanceStore } from "@/store/grievance-store";
import { deriveSellerNotifications, getSellerUnreadCount } from "@/services/seller-notifications";
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

  const sellerProducts = useSellerStore((state) => state.products);
  const sellerOrders = useSellerStore((state) => state.orders);
  const sellerQuotations = useSellerStore((state) => state.quotations);
  const sellerBookings = useSellerStore((state) => state.bookings);
  const sellerVerificationStatus = useSellerStore((state) => state.verificationStatus);
  const lastRegistrationResult = useSellerStore((state) => state.lastRegistrationResult);
  const sellerReadNotificationIds = useSellerStore((state) => state.readNotificationIds);
  const buyLeads = useSellerStore((state) => state.buyLeads);

  const expertProfile = useExpertStore((state) => state.profile);
  const expertRequests = useExpertStore((state) => state.requests);
  const expertConsultations = useExpertStore((state) => state.consultations);
  const setExpertAvailability = useExpertStore((state) => state.setAvailability);

  const [isSwitchModalOpen, setIsSwitchModalOpen] = useState(false);

  const activeRole = ((user?.role || selectedRole || "farmer").toLowerCase() as UserRole);

  const pendingExpertRequestsCount = expertRequests.filter((r) => r.status === "pending").length;
  const upcomingExpertConsultations = expertConsultations.filter(
    (c) => c.status === "upcoming" || c.status === "in_progress"
  );
  const nextConsultation = upcomingExpertConsultations[0];

  const sellerUnreadCount = React.useMemo(() => {
    if (activeRole !== "seller") return 0;
    const list = deriveSellerNotifications({
      orders: sellerOrders,
      quotations: sellerQuotations,
      bookings: sellerBookings,
      products: sellerProducts,
      verificationStatus: sellerVerificationStatus,
      lastRegistrationResult,
      readNotificationIds: sellerReadNotificationIds,
    });
    return getSellerUnreadCount(list);
  }, [
    activeRole,
    sellerOrders,
    sellerQuotations,
    sellerBookings,
    sellerProducts,
    sellerVerificationStatus,
    lastRegistrationResult,
    sellerReadNotificationIds,
  ]);

  const grievanceTickets = useGrievanceStore((state) => state.tickets);
  const criticalGrievancesCount = React.useMemo(() => {
    if (activeRole !== "government" && activeRole !== "govt") return 0;
    return grievanceTickets.filter(
      (t) =>
        (t.priority === "Critical" || t.priority === "High") &&
        t.status !== "Resolved" &&
        t.status !== "Closed"
    ).length;
  }, [activeRole, grievanceTickets]);

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
            title: t("seller.myProducts"),
            desc: t("seller.myProductsDesc"),
            icon: <Package size={22} className="text-[#24833A]" />,
            badge: `${sellerProducts.filter((p) => p.status === "active").length} Active`,
            href: "/dashboard/seller/products",
          },
          {
            title: t("seller.buyLeads"),
            desc: t("seller.buyLeadsDesc"),
            icon: <TrendingUp size={22} className="text-[#24833A]" />,
            badge: `${buyLeads.length} Leads`,
            href: "/dashboard/seller/leads",
          },
          {
            title: t("seller.equipmentRental"),
            desc: t("seller.equipmentRentalDesc"),
            icon: <Tractor size={22} className="text-[#24833A]" />,
            badge: "Fleet Live",
            href: "/dashboard/seller/equipment",
          },
          {
            title: t("seller.customerOrders"),
            desc: t("seller.customerOrdersDesc"),
            icon: <ShoppingBag size={22} className="text-[#24833A]" />,
            badge: "3 Pending",
            href: "/dashboard/orders",
          },
          {
            title: t("seller.payments"),
            desc: t("seller.paymentsDesc"),
            icon: <CreditCard size={22} className="text-[#24833A]" />,
            badge: "₹1.48L",
            href: "/dashboard/seller/payments",
          },
          {
            title: t("seller.customers") || "Customer Profiles",
            desc: t("seller.customersDesc") || "Farmer buyer directory & order history",
            icon: <Users size={22} className="text-[#24833A]" />,
            badge: "Buyer CRM",
            href: "/dashboard/seller/customers",
          },
          {
            title: t("notifications.sellerTitle") || t("nav.notifications") || "Seller Notifications",
            desc: t("notifications.sellerSubtitle") || "Orders, buy leads & fleet rental alerts",
            icon: <Bell size={22} className="text-[#24833A]" />,
            badge: sellerUnreadCount > 0 ? `${sellerUnreadCount} New` : "All Read",
            href: "/dashboard/notifications",
          },
          {
            title: t("seller.onboarding.title") || t("seller.onboarding"),
            desc: t("seller.onboarding.desc") || t("seller.onboardingDesc"),
            icon: <ShieldCheck size={22} className="text-[#24833A]" />,
            badge: "KYC Verified",
            href: "/dashboard/seller/onboarding",
          },
        ];
      case "expert":
        return [
          {
            title: t("expert.tabConsultations") || t("dashboard.consultationsTile"),
            desc: t("dashboard.consultationsTileDesc"),
            icon: <GraduationCap size={22} className="text-[#24833A]" />,
            badge: "Live Hub",
            href: "/dashboard/consultations",
          },
          {
            title: t("expert.tabRequests") || "Connection Requests",
            desc: t("expert.requests.subtitle") || "Farmer advisory requests and triage",
            icon: <UsersRound size={22} className="text-[#24833A]" />,
            badge: "Triage",
            href: "/dashboard/consultations?tab=requests",
          },
          {
            title: "Expert Credentials & KYC",
            desc: "Agronomy credentials, research affiliation and specialization",
            icon: <ShieldCheck size={22} className="text-[#24833A]" />,
            badge: "Verified KYC",
            href: "/dashboard/expert/onboarding",
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
            icon: <Megaphone size={22} className="text-[#24833A]" />,
            badge: t("dashboard.badgeLive"),
            href: "/dashboard/announcements",
          },
          {
            title: t("dashboard.cropsTile"),
            desc: t("dashboard.cropsTileDesc"),
            icon: <Sprout size={22} className="text-[#24833A]" />,
            badge: t("dashboard.badgeHealthy"),
            href: "/dashboard/crops",
          },
          {
            title: t("govtFarmerRegistry.farmerRegistryTitle") || "Farmer Registry",
            desc: t("govtFarmerRegistry.farmerRegistryDesc") || "Manage registered farmers and verification records",
            icon: <Users size={22} className="text-[#24833A]" />,
            badge: "Active",
            href: "/dashboard/government/farmers",
          },
          {
            title: t("govtSurveys.title") || "Digital Surveys",
            desc: t("govtSurveys.quickServiceDesc") || "Create field surveys and record agricultural assessments",
            icon: <ClipboardList size={22} className="text-[#24833A]" />,
            badge: "Active",
            href: "/dashboard/government/surveys",
          },
          {
            title: t("govtGrievances.title") || "Farmer Grievances",
            desc: t("govtGrievances.quickServiceDesc") || "Review farmer complaints and track resolution",
            icon: <MessageSquare size={22} className="text-[#24833A]" />,
            badge: "Active",
            href: "/dashboard/government/grievances",
          },
          {
            title: t("govtLandRecords.title") || "Land Records",
            desc: t("govtLandRecords.quickServiceDesc") || "Review landholding references and cultivation records",
            icon: <MapPin size={22} className="text-[#24833A]" />,
            badge: "Active",
            href: "/dashboard/government/land-records",
          },
          {
            title: t("govtWelfareReports.title") || "Welfare Impact Reports",
            desc: t("govtWelfareReports.quickServiceDesc") || "Review beneficiary coverage and welfare programme outcomes",
            icon: <BarChart3 size={22} className="text-[#24833A]" />,
            badge: "Active",
            href: "/dashboard/government/welfare-reports",
          },
          {
            title: t("govtNgos.directoryTitle") || "NGO Directory",
            desc: t("govtNgos.quickServiceDesc") || "Review partner organizations and registration records",
            icon: <Building2 size={22} className="text-[#24833A]" />,
            badge: "Active",
            href: "/dashboard/government/ngos",
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
            icon: <TrendingUp size={22} className="text-[#24833A]" />,
            badge: t("dashboard.badgeLive"),
            href: "/dashboard/market-prices",
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
          {
            title: t("dashboard.communityTile"),
            desc: t("dashboard.communityTileDesc"),
            icon: <Users size={22} className="text-[#24833A]" />,
            badge: t("dashboard.badgeLive"),
            href: "/dashboard/community",
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
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white mt-1">
            {t("dashboard.welcome")} {displayName}
          </h1>
          <p className="text-xs text-white/80 font-medium">
            {activeRole === "seller"
              ? "Agricultural Supply & Commercial Procurement Hub"
              : "RaituSevak360 Smart Agriculture Ecosystem"}
          </p>
        </div>

        {/* Dynamic Top Banner Pill: Store Active for Seller, Advisory for Expert, Micro-climate for Farmer */}
        {activeRole === "seller" ? (
          <Link
            href="/dashboard/seller/onboarding"
            className="flex items-center gap-2.5 rounded-2xl bg-white/15 px-3.5 py-2 backdrop-blur-md self-start sm:self-auto border border-white/10 transition hover:bg-white/25 active:scale-95 cursor-pointer"
            title="View business registration details"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-400 text-emerald-950 shadow-xs">
              <Store size={20} />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold leading-tight">Store Active</span>
              <span className="inline-flex items-center gap-1 text-[10px] text-white/80 font-medium">
                <MapPin size={10} /> Warangal Yard
              </span>
            </div>
          </Link>
        ) : activeRole === "expert" ? (
          <Link
            href="/dashboard/consultations"
            className="flex items-center gap-2.5 rounded-2xl bg-white/15 px-3.5 py-2 backdrop-blur-md self-start sm:self-auto border border-white/10 transition hover:bg-white/25 active:scale-95 cursor-pointer"
            title="View consultations hub"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-400 text-emerald-950 shadow-xs">
              <GraduationCap size={20} />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-bold leading-tight">Advisory Desk</span>
                <span className="inline-block h-2 w-2 rounded-full bg-emerald-300 animate-pulse" />
              </div>
              <span className="inline-flex items-center gap-1 text-[10px] text-white/80 font-medium">
                <MapPin size={10} /> {expertProfile.location || "Hyderabad Desk"}
              </span>
            </div>
          </Link>
        ) : (
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
        )}
      </div>

      {/* User Account & Role Card */}
      <div className="rounded-3xl border border-[#24833A]/20 bg-white p-4 sm:p-5 shadow-2xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#E4F0DD] text-[#24833A] shadow-2xs">
              {activeRole === "government" || activeRole === "govt" ? (
                <Landmark size={24} strokeWidth={2.4} />
              ) : activeRole === "expert" ? (
                <GraduationCap size={24} strokeWidth={2.4} />
              ) : (
                <User size={24} strokeWidth={2.4} />
              )}
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
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#24833A] px-3.5 py-2 text-xs font-semibold text-white shadow-xs transition hover:bg-[#1e6e30] active:scale-95 self-start sm:self-auto shrink-0"
            >
              <ArrowLeftRight size={14} strokeWidth={2.4} />
              <span>{switchActionLabel}</span>
            </button>
          </div>
        )}
      </div>

      {/* Agriculture Expert Command Center & Action Deck */}
      {activeRole === "expert" && (
        <div className="flex flex-col gap-3">
          {/* Availability Control & Verification Card */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl bg-[#F4FBF5] border border-[#24833A]/30 p-4 shadow-2xs">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#E4F0DD] text-[#24833A]">
                <ShieldCheck size={22} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xs font-bold text-[#174D25]">
                    Agronomist Availability Status
                  </h3>
                  <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-[#174D25]">
                    Verified
                  </span>
                </div>
                <p className="text-[11px] text-gray-500">
                  Controls whether cultivators can request urgent video and audio consultations
                </p>
              </div>
            </div>

            {/* Availability Radio Pills */}
            <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-gray-200 self-start sm:self-auto shadow-2xs">
              <button
                type="button"
                onClick={() => setExpertAvailability("available")}
                className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-bold transition cursor-pointer ${
                  expertProfile.dailyAvailability === "available"
                    ? "bg-[#24833A] text-white shadow-2xs"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" />
                <span>Available</span>
              </button>
              <button
                type="button"
                onClick={() => setExpertAvailability("busy")}
                className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-bold transition cursor-pointer ${
                  expertProfile.dailyAvailability === "busy"
                    ? "bg-amber-600 text-white shadow-2xs"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <span className="h-1.5 w-1.5 rounded-full bg-amber-200" />
                <span>Busy</span>
              </button>
              <button
                type="button"
                onClick={() => setExpertAvailability("offline")}
                className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-bold transition cursor-pointer ${
                  expertProfile.dailyAvailability === "offline"
                    ? "bg-gray-700 text-white shadow-2xs"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <span className="h-1.5 w-1.5 rounded-full bg-gray-400" />
                <span>Offline</span>
              </button>
            </div>
          </div>

          {/* Pending Triage Alert if requests > 0 */}
          {pendingExpertRequestsCount > 0 && (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl bg-amber-50 border border-amber-200 p-3.5 shadow-2xs">
              <div className="flex items-center gap-2.5">
                <span className="flex h-2.5 w-2.5 rounded-full bg-amber-500 animate-ping" />
                <div>
                  <h4 className="text-xs font-bold text-amber-900">
                    {pendingExpertRequestsCount} Farmer Request{pendingExpertRequestsCount > 1 ? "s" : ""} Awaiting Review
                  </h4>
                  <p className="text-[11px] text-amber-700">
                    Cultivators in your advisory district need pest & disease diagnostic triage
                  </p>
                </div>
              </div>
              <Link
                href="/dashboard/consultations?tab=requests"
                className="inline-flex items-center justify-center rounded-xl bg-amber-600 px-3 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-amber-700 transition self-start sm:self-auto cursor-pointer"
              >
                Review Requests
              </Link>
            </div>
          )}

          {/* Next Upcoming Consultation Banner if any */}
          {nextConsultation && (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl bg-emerald-50 border border-emerald-200 p-3.5 shadow-2xs">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#24833A] text-white font-bold text-xs">
                  {nextConsultation.farmerName.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-gray-900">
                      Next: {nextConsultation.farmerName}
                    </span>
                    <span className="rounded-full bg-emerald-100 px-2 py-0.2 text-[10px] font-bold text-emerald-800">
                      {nextConsultation.crop}
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-600">
                    {nextConsultation.scheduledDate} • {nextConsultation.scheduledTimeSlot} ({nextConsultation.type === "video" ? "Video Call" : "Voice Call"})
                  </p>
                </div>
              </div>
              <Link
                href={`/dashboard/consultations/call?id=${nextConsultation.id}`}
                className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#24833A] px-3.5 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-[#174D25] transition self-start sm:self-auto cursor-pointer"
              >
                <span>Join Session</span>
              </Link>
            </div>
          )}

          {/* 4 Expert Performance Metric Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
            <Link
              href="/dashboard/consultations?tab=requests"
              className="flex flex-col rounded-2xl border border-gray-200 bg-white p-3.5 shadow-2xs hover:border-[#24833A]/60 transition"
            >
              <span className="text-[11px] font-medium text-gray-500">Pending Requests</span>
              <span className="text-lg font-bold text-amber-700 mt-0.5">
                {pendingExpertRequestsCount}
              </span>
              <span className="text-[10px] text-amber-600 font-bold mt-1">Needs response</span>
            </Link>

            <Link
              href="/dashboard/consultations?tab=consultations"
              className="flex flex-col rounded-2xl border border-gray-200 bg-white p-3.5 shadow-2xs hover:border-[#24833A]/60 transition"
            >
              <span className="text-[11px] font-medium text-gray-500">Upcoming Today</span>
              <span className="text-lg font-bold text-[#174D25] mt-0.5">
                {upcomingExpertConsultations.length}
              </span>
              <span className="text-[10px] text-emerald-600 font-bold mt-1">Confirmed sessions</span>
            </Link>

            <div className="flex flex-col rounded-2xl border border-gray-200 bg-white p-3.5 shadow-2xs">
              <span className="text-[11px] font-medium text-gray-500">Cultivator Rating</span>
              <span className="text-lg font-bold text-gray-900 mt-0.5">
                ★ {expertProfile.rating}
              </span>
              <span className="text-[10px] text-gray-400 font-medium mt-1">
                {expertProfile.reviewCount} reviews
              </span>
            </div>

            <Link
              href="/dashboard/expert/onboarding"
              className="flex flex-col rounded-2xl border border-gray-200 bg-white p-3.5 shadow-2xs hover:border-[#24833A]/60 transition"
            >
              <span className="text-[11px] font-medium text-gray-500">Total Consulted</span>
              <span className="text-lg font-bold text-[#24833A] mt-0.5">
                {expertProfile.totalConsultations}+
              </span>
              <span className="text-[10px] text-emerald-600 font-bold mt-1">View profile & KYC</span>
            </Link>
          </div>
        </div>
      )}

      {/* Seller Business Summary & Verification Alert */}
      {activeRole === "seller" && (
        <div className="flex flex-col gap-3">
          {/* Verification Status Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 rounded-2xl bg-[#F4FBF5] border border-[#24833A]/30 p-3.5">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#E4F0DD] text-[#24833A]">
                <ShieldCheck size={20} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xs font-bold text-[#174D25]">
                    Business Application: Under Verification
                  </h3>
                  <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-mono font-bold text-[#174D25]">
                    {lastRegistrationResult?.registrationId || "RS360-VND-849201"}
                  </span>
                </div>
                <p className="text-[11px] text-gray-500">
                  Store active in preview mode • Verified badges will be awarded within 24-48h.
                </p>
              </div>
            </div>
            <Link
              href="/dashboard/seller/onboarding"
              className="inline-flex items-center justify-center rounded-xl bg-white border border-[#24833A]/30 px-3 py-1.5 text-xs font-bold text-[#174D25] shadow-2xs hover:bg-[#E4F0DD] transition self-start sm:self-auto"
            >
              Track KYC
            </Link>
          </div>

          {/* 4 Performance Metric Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
            <Link
              href="/dashboard/seller/products"
              className="flex flex-col rounded-2xl border border-gray-200 bg-white p-3.5 shadow-2xs hover:border-[#24833A]/60 transition"
            >
              <span className="text-[11px] font-medium text-gray-500">{t("seller.activeProducts")}</span>
              <span className="text-lg font-bold text-[#174D25] mt-0.5">
                {sellerProducts.filter((p) => p.status === "active").length}
              </span>
              <span className="text-[10px] text-emerald-600 font-bold mt-1">Live in store</span>
            </Link>

            <Link
              href="/dashboard/orders"
              className="flex flex-col rounded-2xl border border-gray-200 bg-white p-3.5 shadow-2xs hover:border-[#24833A]/60 transition"
            >
              <span className="text-[11px] font-medium text-gray-500">{t("seller.pendingOrders")}</span>
              <span className="text-lg font-bold text-[#174D25] mt-0.5">3</span>
              <span className="text-[10px] text-amber-600 font-bold mt-1">Ready to dispatch</span>
            </Link>

            <Link
              href="/dashboard/seller/payments"
              className="flex flex-col rounded-2xl border border-gray-200 bg-white p-3.5 shadow-2xs hover:border-[#24833A]/60 transition"
            >
              <span className="text-[11px] font-medium text-gray-500">{t("seller.totalEarnings")}</span>
              <span className="text-lg font-bold text-[#24833A] mt-0.5">₹1.48L</span>
              <span className="text-[10px] text-emerald-600 font-bold mt-1">+18.4% this month</span>
            </Link>

            <Link
              href="/dashboard/seller/leads"
              className="flex flex-col rounded-2xl border border-gray-200 bg-white p-3.5 shadow-2xs hover:border-[#24833A]/60 transition"
            >
              <span className="text-[11px] font-medium text-gray-500">{t("seller.availableLeads")}</span>
              <span className="text-lg font-bold text-[#174D25] mt-0.5">{buyLeads.length}</span>
              <span className="text-[10px] text-[#24833A] font-bold mt-1">Ready for quote</span>
            </Link>
          </div>
        </div>
      )}

      {/* Government High-Priority Grievance Alert Banner */}
      {(activeRole === "government" || activeRole === "govt") && criticalGrievancesCount > 0 && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl bg-rose-50 border border-rose-200 p-3.5 shadow-2xs">
          <div className="flex items-center gap-2.5">
            <span className="flex h-2.5 w-2.5 rounded-full bg-rose-600 animate-ping" />
            <div>
              <h4 className="text-xs font-bold text-rose-950">
                {criticalGrievancesCount} High-Priority Farmer Grievance{criticalGrievancesCount > 1 ? "s" : ""}
              </h4>
              <p className="text-[11px] text-rose-700">
                Urgent complaints pending officer assignment or emergency field remediation
              </p>
            </div>
          </div>
          <Link
            href="/dashboard/government/grievances"
            className="inline-flex items-center justify-center rounded-xl bg-rose-700 px-3.5 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-rose-800 transition self-start sm:self-auto cursor-pointer"
          >
            Review Tickets
          </Link>
        </div>
      )}

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
                        <span className="rounded-full bg-amber-50 border border-amber-200/60 px-2 py-0.5 text-[10px] font-bold text-amber-800">
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
                      <span className="rounded-full bg-emerald-50 border border-emerald-200/60 px-2 py-0.5 text-[10px] font-bold text-[#174D25]">
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
