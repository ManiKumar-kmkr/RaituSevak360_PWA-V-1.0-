"use client";

import React, { useState } from "react";
import {
  Bell,
  CloudRain,
  TrendingUp,
  Package,
  Landmark,
  Bot,
  CheckCheck,
  CheckCircle2,
} from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { useAuthStore } from "@/store/auth-store";
import { UserRole } from "@/types";

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
  const user = useAuthStore((state) => state.user);
  const selectedRole = useAuthStore((state) => state.selectedRole);

  const activeRole = ((user?.role || selectedRole || "farmer").toLowerCase() as UserRole);

  const [notifications, setNotifications] = useState<NotificationItem[]>([
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

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const getCategoryIcon = (category: string) => {
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

  // Filter relevant notifications for current active role
  const relevantList = notifications.filter(
    (n) => !n.roleFilter || n.roleFilter.includes(activeRole)
  );

  const unreadCount = relevantList.filter((n) => !n.isRead).length;

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-4">
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

        {unreadCount > 0 && (
          <button
            type="button"
            onClick={handleMarkAllRead}
            className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs font-semibold text-gray-700 transition hover:bg-gray-100 active:scale-95"
          >
            <CheckCheck size={14} className="text-[#24833A]" />
            <span className="hidden sm:inline">{t("notifications.markAllRead")}</span>
          </button>
        )}
      </div>

      {/* Notifications List */}
      <div className="flex flex-col gap-2.5">
        {relevantList.length === 0 ? (
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
          relevantList.map((item) => (
            <div
              key={item.id}
              className={`flex items-start gap-3.5 rounded-2xl border p-4 transition shadow-2xs ${
                item.isRead
                  ? "bg-white border-gray-200"
                  : "bg-[#F4FBF5] border-[#24833A]/30"
              }`}
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white shadow-2xs border border-gray-100">
                {getCategoryIcon(item.category)}
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
