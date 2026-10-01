"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/store/auth-store";
import { useTranslation } from "@/hooks/useTranslation";
import { getNavigationForRole } from "@/config/navigation";

export default function MobileBottomNav() {
  const pathname = usePathname();
  const { t } = useTranslation();
  const user = useAuthStore((state) => state.user);
  const selectedRole = useAuthStore((state) => state.selectedRole);

  const activeRole = user?.role || selectedRole || "farmer";
  const navItems = getNavigationForRole(activeRole);

  return (
    <nav
      aria-label="Mobile Navigation"
      className="
        fixed bottom-0 left-0 right-0 z-40
        border-t border-gray-200/90 bg-white/95 backdrop-blur-lg
        shadow-[0_-4px_16px_rgba(0,0,0,0.06)]
        md:hidden
      "
      style={{
        paddingBottom: "max(0.5rem, env(safe-area-inset-bottom))",
      }}
    >
      <div className="mx-auto flex h-16 max-w-md items-center justify-around px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.exact
            ? pathname === item.href
            : pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));

          const label = t(item.labelKey);

          return (
            <Link
              key={item.id}
              href={item.href}
              className={`
                relative flex flex-1 flex-col items-center justify-center py-1 transition-all duration-150 min-h-[48px]
                ${isActive ? "text-[#24833A]" : "text-gray-500 hover:text-gray-800 active:scale-95"}
              `}
              aria-current={isActive ? "page" : undefined}
            >
              {/* Active Top Glow/Indicator Pill */}
              {isActive && (
                <span className="absolute -top-1 h-1 w-6 rounded-full bg-[#24833A]" />
              )}

              {/* Icon Container with subtle active background */}
              <div
                className={`
                  flex h-8 w-8 items-center justify-center rounded-xl transition-colors
                  ${isActive ? "bg-[#E4F0DD] text-[#24833A]" : "text-gray-500"}
                `}
              >
                <Icon size={20} strokeWidth={isActive ? 2.4 : 2} />
              </div>

              {/* Navigation Label */}
              <span
                className={`
                  mt-0.5 text-[10px] tracking-tight truncate max-w-[64px]
                  ${isActive ? "font-bold text-[#174D25]" : "font-medium text-gray-500"}
                `}
              >
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
