"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Bell,
  CloudRain,
  TrendingUp,
  Package,
  Landmark,
  Bot,
  CheckCheck,
  CheckCircle2,
  ArrowLeft,
  Tractor,
  AlertTriangle,
  ShieldCheck,
  ChevronRight,
  Sparkles,
  Inbox,
} from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { useAuthStore } from "@/store/auth-store";
import { useSellerStore } from "@/store/seller-store";
import {
  deriveSellerNotifications,
  getSellerUnreadCount,
} from "@/services/seller-notifications";
import { SellerNotificationCategory, UserRole } from "@/types";
import Button from "@/components/ui/Button";
import BackButton from "@/components/ui/BackButton";

interface NotificationItem {
  id: string;
  titleKey: string;
  descKey: string;
  time: string;
  category: "weather" | "mandi" | "order" | "scheme" | "advisory";
  isRead: boolean;
  roleFilter?: UserRole[];
}

export default function NotificationsPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const selectedRole = useAuthStore((state) => state.selectedRole);

  const activeRole = ((user?.role || selectedRole || "farmer").toLowerCase() as UserRole);

  // ==========================================
  // SELLER NOTIFICATIONS STATE (Role Isolated)
  // ==========================================
  const orders = useSellerStore((state) => state.orders);
  const quotations = useSellerStore((state) => state.quotations);
  const bookings = useSellerStore((state) => state.bookings);
  const products = useSellerStore((state) => state.products);
  const verificationStatus = useSellerStore((state) => state.verificationStatus);
  const lastRegistrationResult = useSellerStore((state) => state.lastRegistrationResult);
  const readNotificationIds = useSellerStore((state) => state.readNotificationIds);
  const markNotificationRead = useSellerStore((state) => state.markNotificationRead);
  const markAllNotificationsRead = useSellerStore((state) => state.markAllNotificationsRead);

  const [sellerFilter, setSellerFilter] = useState<"all" | SellerNotificationCategory>("all");

  const sellerNotifications = useMemo(() => {
    return deriveSellerNotifications({
      orders,
      quotations,
      bookings,
      products,
      verificationStatus,
      lastRegistrationResult,
      readNotificationIds,
    });
  }, [
    orders,
    quotations,
    bookings,
    products,
    verificationStatus,
    lastRegistrationResult,
    readNotificationIds,
  ]);

  const sellerUnreadCount = useMemo(() => {
    return getSellerUnreadCount(sellerNotifications);
  }, [sellerNotifications]);

  const filteredSellerNotifications = useMemo(() => {
    if (sellerFilter === "all") return sellerNotifications;
    return sellerNotifications.filter((n) => n.category === sellerFilter);
  }, [sellerNotifications, sellerFilter]);

  const handleMarkAllSellerRead = () => {
    const allIds = sellerNotifications.map((n) => n.id);
    markAllNotificationsRead(allIds);
  };

  const handleSellerNotificationClick = (id: string, link: string) => {
    markNotificationRead(id);
    if (link) {
      router.push(link);
    }
  };

  // ==========================================
  // FARMER / GENERAL NOTIFICATIONS STATE (Preserved)
  // ==========================================
  const [farmerNotifications, setFarmerNotifications] = useState<NotificationItem[]>([
    {
      id: "notif_1",
      titleKey: "notifications.sampleWeatherTitle",
      descKey: "notifications.sampleWeatherDesc",
      time: "10 mins ago",
      category: "weather",
      isRead: false,
      roleFilter: ["farmer", "expert"],
    },
    {
      id: "notif_2",
      titleKey: "notifications.sampleMandiTitle",
      descKey: "notifications.sampleMandiDesc",
      time: "1 hour ago",
      category: "mandi",
      isRead: false,
      roleFilter: ["farmer", "seller"],
    },
    {
      id: "notif_3",
      titleKey: "notifications.sampleOrderTitle",
      descKey: "notifications.sampleOrderDesc",
      time: "2 hours ago",
      category: "order",
      isRead: false,
      roleFilter: ["seller"],
    },
    {
      id: "notif_4",
      titleKey: "notifications.sampleSchemeTitle",
      descKey: "notifications.sampleSchemeDesc",
      time: "Today",
      category: "scheme",
      isRead: true,
      roleFilter: ["farmer", "student", "government", "govt"],
    },
    {
      id: "notif_5",
      titleKey: "notifications.sampleAdvisoryTitle",
      descKey: "notifications.sampleAdvisoryDesc",
      time: "Yesterday",
      category: "advisory",
      isRead: true,
      roleFilter: ["farmer", "expert", "student"],
    },
  ]);

  const handleFarmerMarkAllRead = () => {
    setFarmerNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const getFarmerCategoryIcon = (category: string) => {
    switch (category) {
      case "weather":
        return <CloudRain size={20} className="text-blue-500" />;
      case "mandi":
        return <TrendingUp size={20} className="text-emerald-600" />;
      case "order":
        return <Package size={20} className="text-amber-500" />;
      case "scheme":
        return <Landmark size={20} className="text-purple-500" />;
      case "advisory":
      default:
        return <Bot size={20} className="text-[#24833A]" />;
    }
  };

  const relevantFarmerList = farmerNotifications.filter(
    (n) => !n.roleFilter || n.roleFilter.includes(activeRole)
  );
  const farmerUnreadCount = relevantFarmerList.filter((n) => !n.isRead).length;

  // ==========================================
  // RENDER: SELLER VIEW (Role-Isolated)
  // ==========================================
  if (activeRole === "seller") {
    const getSellerCategoryIcon = (category: SellerNotificationCategory) => {
      switch (category) {
        case "order":
          return (
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-50 border border-amber-200/60 text-amber-600">
              <Package size={20} />
            </div>
          );
        case "quotation":
          return (
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 border border-blue-200/60 text-blue-600">
              <TrendingUp size={20} />
            </div>
          );
        case "equipment":
          return (
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-50 border border-purple-200/60 text-purple-600">
              <Tractor size={20} />
            </div>
          );
        case "product":
          return (
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-50 border border-rose-200/60 text-rose-600">
              <AlertTriangle size={20} />
            </div>
          );
        case "account":
        default:
          return (
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 border border-emerald-200/60 text-[#24833A]">
              <ShieldCheck size={20} />
            </div>
          );
      }
    };

    const categories: { key: "all" | SellerNotificationCategory; label: string }[] = [
      { key: "all", label: t("notifications.filterAll") || "All Alerts" },
      { key: "order", label: t("notifications.filterOrders") || "Orders" },
      { key: "quotation", label: t("notifications.filterQuotations") || "Leads & Quotes" },
      { key: "equipment", label: t("notifications.filterEquipment") || "Fleet Rentals" },
      { key: "product", label: t("notifications.filterProducts") || "Inventory" },
      { key: "account", label: t("notifications.filterAccount") || "Account & KYC" },
    ];

    return (
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-4 pb-20">
        {/* Top Breadcrumb Back Navigation */}
        <div className="flex items-center justify-between">
          <BackButton href="/dashboard" label={t("common.backToDashboard") || "Back to Dashboard"} />

          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-bold text-[#174D25] border border-emerald-200/50">
            <Sparkles size={11} className="text-amber-500" />
            Seller Notification Center
          </span>
        </div>

        {/* Notifications Header Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-3xl bg-white p-5 border border-gray-200 shadow-2xs">
          <div className="flex items-center gap-3.5">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#E4F0DD] text-[#24833A] shadow-2xs">
              <Bell size={24} strokeWidth={2.4} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold text-gray-900">
                  {t("notifications.sellerTitle") || "Seller Notifications"}
                </h1>
                {sellerUnreadCount > 0 ? (
                  <span className="rounded-full bg-emerald-100 text-[#174D25] px-2 py-0.5 text-[10px] font-bold">
                    {sellerUnreadCount} {t("notifications.unreadBadge") || "Unread"}
                  </span>
                ) : (
                  <span className="rounded-full bg-gray-100 text-gray-600 px-2 py-0.5 text-[10px] font-semibold">
                    {t("notifications.allReadBadge") || "All Caught Up"}
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-500 font-medium mt-0.5">
                {t("notifications.sellerSubtitle") ||
                  "Real-time alerts for customer orders, buy leads, fleet rentals & inventory"}
              </p>
            </div>
          </div>

          {sellerUnreadCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleMarkAllSellerRead}
              leftIcon={<CheckCheck size={14} className="text-[#24833A]" />}
              className="self-start sm:self-auto"
            >
              <span>{t("notifications.markAllRead") || "Mark All as Read"}</span>
            </Button>
          )}
        </div>

        {/* Category Filter Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => {
            const count =
              cat.key === "all"
                ? sellerNotifications.length
                : sellerNotifications.filter((n) => n.category === cat.key).length;

            const isSelected = sellerFilter === cat.key;

            return (
              <button
                key={cat.key}
                type="button"
                onClick={() => setSellerFilter(cat.key)}
                className={`inline-flex shrink-0 items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition cursor-pointer ${
                  isSelected
                    ? "bg-[#24833A] text-white shadow-2xs"
                    : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
                }`}
              >
                <span>{cat.label}</span>
                <span
                  className={`rounded-full px-1.5 py-0.2 text-[10px] ${
                    isSelected
                      ? "bg-white/20 text-white font-bold"
                      : "bg-gray-100 text-gray-500 font-semibold"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Notifications List */}
        <div className="flex flex-col gap-2.5">
          {filteredSellerNotifications.length === 0 ? (
            <div className="rounded-3xl border border-gray-200 bg-white p-8 text-center shadow-2xs">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-[#24833A]">
                <Inbox size={28} />
              </div>
              <h3 className="mt-3 text-sm font-bold text-gray-900">
                {t("notifications.emptySellerTitle") || "No Notifications in this Category"}
              </h3>
              <p className="mt-1 text-xs text-gray-500 max-w-sm mx-auto">
                {t("notifications.emptySellerDesc") ||
                  "You are completely up-to-date with your store orders, rental bookings, and inventory."}
              </p>
            </div>
          ) : (
            filteredSellerNotifications.map((item) => (
              <div
                key={item.id}
                onClick={() => handleSellerNotificationClick(item.id, item.link)}
                className={`group flex items-start gap-3.5 rounded-2xl border p-4 transition shadow-2xs cursor-pointer ${
                  item.isRead
                    ? "bg-white border-gray-200 hover:border-gray-300"
                    : "bg-[#F4FBF5] border-[#24833A]/30 hover:border-[#24833A]"
                }`}
              >
                {getSellerCategoryIcon(item.category)}

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <h3
                        className={`text-xs sm:text-sm font-bold truncate ${
                          item.isRead ? "text-gray-900" : "text-[#174D25]"
                        }`}
                      >
                        {item.title}
                      </h3>
                      {item.priority === "high" && !item.isRead && (
                        <span className="rounded-md bg-rose-50 border border-rose-200 px-1.5 py-0.2 text-[9px] font-bold text-rose-700">
                          Priority
                        </span>
                      )}
                    </div>
                    <span className="shrink-0 text-[10px] font-semibold text-gray-400">
                      {item.time}
                    </span>
                  </div>

                  <p className="mt-1 text-xs text-gray-600 leading-relaxed">
                    {item.message}
                  </p>

                  <div className="mt-2.5 flex items-center justify-between">
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#24833A] group-hover:underline">
                      <span>{item.actionLabel || t("notifications.tapToOpen") || "View Details"}</span>
                      <ChevronRight size={13} strokeWidth={2.5} />
                    </span>

                    {!item.isRead && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700">
                        <span className="h-2 w-2 rounded-full bg-[#24833A]" />
                        <span>Unread</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    );
  }

  // ==========================================
  // RENDER: FARMER / DEFAULT ROLE VIEW (Preserved)
  // ==========================================
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-4 pb-16">
      {/* Top Breadcrumb Back Navigation */}
      <div className="flex items-center justify-between">
        <BackButton href="/dashboard" label={t("common.backToDashboard") || "Back to Dashboard"} />
      </div>

      {/* Notifications Header */}
      <div className="flex items-center justify-between rounded-3xl bg-white p-5 border border-gray-200 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#E4F0DD] text-[#24833A] shadow-2xs">
            <Bell size={24} strokeWidth={2.4} />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900">
              {t("notifications.title")}
            </h1>
            <p className="text-xs text-gray-500 font-medium">
              {t("notifications.subtitle")}
            </p>
          </div>
        </div>

        {farmerUnreadCount > 0 && (
          <Button
            variant="secondary"
            size="sm"
            onClick={handleFarmerMarkAllRead}
            leftIcon={<CheckCheck size={14} className="text-[#24833A]" />}
          >
            <span className="hidden sm:inline">{t("notifications.markAllRead")}</span>
          </Button>
        )}
      </div>

      {/* Notifications List */}
      <div className="flex flex-col gap-2.5">
        {relevantFarmerList.length === 0 ? (
          <div className="rounded-3xl border border-gray-200 bg-white p-8 text-center shadow-2xs">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-[#24833A]">
              <CheckCircle2 size={28} />
            </div>
            <h3 className="mt-3 text-sm font-bold text-gray-900">
              {t("notifications.allCaughtUp")}
            </h3>
            <p className="mt-1 text-xs text-gray-500">
              {t("notifications.noNotifications")}
            </p>
          </div>
        ) : (
          relevantFarmerList.map((item) => (
            <div
              key={item.id}
              className={`flex items-start gap-3.5 rounded-2xl border p-4 transition shadow-2xs ${
                item.isRead
                  ? "bg-white border-gray-200"
                  : "bg-[#F4FBF5] border-[#24833A]/30"
              }`}
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white shadow-2xs border border-gray-100">
                {getFarmerCategoryIcon(item.category)}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-xs sm:text-sm font-bold text-gray-900 truncate">
                    {t(item.titleKey)}
                  </h3>
                  <span className="shrink-0 text-[10px] font-semibold text-gray-400">
                    {item.time}
                  </span>
                </div>
                <p className="mt-1 text-xs text-gray-600 leading-relaxed">
                  {t(item.descKey)}
                </p>
              </div>

              {!item.isRead && (
                <span className="h-2 w-2 shrink-0 rounded-full bg-[#24833A] mt-1.5" />
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
