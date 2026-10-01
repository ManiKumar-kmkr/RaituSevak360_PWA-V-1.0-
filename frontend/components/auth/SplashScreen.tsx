"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Sprout } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { useAuthStore } from "@/store/auth-store";

interface SplashScreenProps {
  autoRedirect?: boolean;
  redirectUrl?: string;
  delayMs?: number;
}

export default function SplashScreen({
  autoRedirect = true,
  redirectUrl = "/language-selection",
  delayMs = 2600,
}: SplashScreenProps) {
  const router = useRouter();
  const { t } = useTranslation();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const selectedRole = useAuthStore((state) => state.selectedRole);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    if (!autoRedirect) return;

    // If user is already authenticated with a role, skip directly to dashboard
    const targetUrl = isAuthenticated ? (selectedRole ? "/dashboard" : "/role-selection") : redirectUrl;

    const timer = setTimeout(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        router.push(targetUrl);
      }, 300);
    }, delayMs);

    return () => clearTimeout(timer);
  }, [autoRedirect, delayMs, redirectUrl, router, isAuthenticated, selectedRole]);

  const handleManualSkip = () => {
    setIsTransitioning(true);
    const targetUrl = isAuthenticated ? (selectedRole ? "/dashboard" : "/role-selection") : redirectUrl;
    router.push(targetUrl);
  };

  return (
    <div
      onClick={handleManualSkip}
      className={`
        relative flex min-h-screen w-full flex-col justify-between
        bg-[#174D25] px-6 py-10 text-white transition-opacity duration-300
        cursor-pointer select-none overflow-hidden
        ${isTransitioning ? "opacity-0" : "opacity-100"}
      `}
      role="button"
      tabIndex={0}
      aria-label="RaituSevak360 Splash Screen. Click to continue."
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          handleManualSkip();
        }
      }}
    >
      {/* Background Subtle Gradient Overlay */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-[#144722]/50 to-[#0e3318]" />

      {/* Top Mobile Status Header Area Spacer */}
      <div className="relative z-10 flex items-center justify-between text-xs text-emerald-200/70">
        <span className="font-semibold tracking-wider">{t("splash.brand")}</span>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            handleManualSkip();
          }}
          className="rounded-full bg-white/10 px-3 py-1 text-[11px] font-medium text-emerald-100 hover:bg-white/20 transition"
        >
          {t("splash.skip")}
        </button>
      </div>

      {/* Center Brand Identity Section */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center">
        {/* White Circular Badge */}
        <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-white shadow-2xl transition-transform hover:scale-105 duration-300">
          <Sprout
            size={48}
            strokeWidth={2.2}
            className="text-[#24833A]"
          />
        </div>

        {/* Brand Name */}
        <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
          {t("splash.brand")}
        </h1>

        {/* Tagline */}
        <p className="mt-2 text-sm font-semibold tracking-wide text-emerald-100">
          {t("splash.tagline")}
        </p>

        {/* Subtagline in selected language */}
        <p className="mt-1 text-xs font-medium text-emerald-200/80">
          {t("splash.subtagline")}
        </p>
      </div>

      {/* Bottom Area: Loader Indicator, Version, Home Bar */}
      <div className="relative z-10 flex flex-col items-center gap-6">
        {/* Segmented Circular Ring Loader Indicator */}
        <div className="flex items-center justify-center">
          <div
            className="h-8 w-8 animate-spin rounded-full border-2 border-emerald-400/25 border-t-white"
            aria-label="Loading application"
          />
        </div>

        {/* Version Information */}
        <div className="text-center">
          <p className="text-xs font-medium text-emerald-200/70">
            {t("splash.version")}
          </p>
        </div>

        {/* Mobile Safe-Area Bottom Bar */}
        <div className="h-1.5 w-32 rounded-full bg-white/30" />
      </div>
    </div>
  );
}
