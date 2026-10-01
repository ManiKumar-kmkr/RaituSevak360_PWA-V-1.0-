"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Sprout, Sparkles, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useTranslation } from "@/hooks/useTranslation";
import AuthPageLayout from "@/components/auth/AuthPageLayout";
import PrimaryButton from "@/components/auth/PrimaryButton";

export default function WelcomePage() {
  const router = useRouter();
  const { t } = useTranslation();

  return (
    <AuthPageLayout>
      <div className="flex flex-1 flex-col justify-between py-1 sm:py-2">
        {/* Top Bar with Back to Language Selection and Brand Pill */}
        <div className="flex items-center justify-between">
          <Link
            href="/language-selection"
            className="flex h-10 w-10 items-center justify-center rounded-full text-[#174D25] transition hover:bg-[#E4F0DD] active:scale-95"
            aria-label="Go back to language selection"
          >
            <ArrowLeft size={22} strokeWidth={2.2} />
          </Link>

          <div className="flex items-center gap-2 rounded-full bg-[#E4F0DD] px-3.5 py-1.5 shadow-xs">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#24833A] text-white">
              <Sprout size={14} strokeWidth={2.4} />
            </div>
            <span className="text-xs font-bold tracking-tight text-[#174D25]">
              {t("common.appName")}
            </span>
          </div>

          {/* Spacer to balance top bar layout */}
          <div className="h-10 w-10" />
        </div>

        {/* Central Content Area: Heading, Subtitle, and Agriculture Visual */}
        <div className="my-auto flex flex-col items-center px-2 py-4 text-center">
          {/* Welcome Heading */}
          <h1 className="text-2xl font-extrabold tracking-tight text-[#174D25] sm:text-3xl">
            {t("welcome.title")}
          </h1>

          {/* Short Meaningful Subtitle */}
          <p className="mt-2 text-xs font-medium leading-relaxed text-gray-600 sm:text-sm max-w-[340px]">
            {t("welcome.subtitle")}
          </p>

          {/* Central Agriculture Visual */}
          <div className="relative my-7 flex items-center justify-center">
            {/* Soft Ambient Radial Glow */}
            <div className="absolute h-64 w-64 rounded-full bg-[#24833A]/10 blur-2xl pointer-events-none" />

            {/* Main Agriculture Hero Illustration Card */}
            <div className="relative flex h-56 w-56 sm:h-64 sm:w-64 items-center justify-center rounded-3xl border border-[#24833A]/20 bg-gradient-to-b from-[#F4FBF5] via-[#E8F5E5] to-[#D7EED2] p-4 shadow-lg shadow-[#24833A]/10 overflow-hidden">
              {/* Background Terraced Farm Hills SVG */}
              <svg
                viewBox="0 0 200 200"
                className="absolute inset-0 h-full w-full opacity-80"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Sun and Sky rays */}
                <circle cx="100" cy="70" r="32" fill="#FEF3C7" />
                <circle cx="100" cy="70" r="22" fill="#FDE68A" />

                {/* Distant Rolling Hills */}
                <path
                  d="M0 145 C40 120, 80 140, 120 125 C160 110, 180 130, 200 120 L200 200 L0 200 Z"
                  fill="#86EFAC"
                  fillOpacity="0.45"
                />

                {/* Middle Crop Terraces */}
                <path
                  d="M0 160 C50 140, 100 165, 150 145 C175 135, 190 145, 200 140 L200 200 L0 200 Z"
                  fill="#4ADE80"
                  fillOpacity="0.55"
                />

                {/* Foreground Fertile Soil Layer */}
                <path
                  d="M0 178 C60 165, 130 182, 200 168 L200 200 L0 200 Z"
                  fill="#174D25"
                  fillOpacity="0.85"
                />

                {/* Furrow lines */}
                <line x1="15" y1="185" x2="185" y2="185" stroke="#24833A" strokeWidth="1.5" strokeDasharray="4 4" strokeOpacity="0.6" />
                <line x1="30" y1="192" x2="170" y2="192" stroke="#24833A" strokeWidth="1.5" strokeDasharray="4 4" strokeOpacity="0.6" />
              </svg>

              {/* Center Growing Sprout Badge */}
              <div className="relative z-10 flex flex-col items-center">
                <div className="flex h-20 w-20 sm:h-22 sm:w-22 items-center justify-center rounded-2xl bg-white shadow-xl ring-4 ring-[#24833A]/20 transition-transform duration-300 hover:scale-105">
                  <Sprout size={46} strokeWidth={2.4} className="text-[#24833A]" />
                </div>
              </div>

              {/* Top-Left Smart Farming Micro-Badge */}
              <div className="absolute left-3 top-3 z-10 inline-flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-bold text-[#174D25] shadow-xs backdrop-blur-sm">
                <Sparkles size={11} className="text-amber-500" />
                <span>{t("welcome.smartFarmingBadge")}</span>
              </div>

              {/* Bottom-Right Ecosystem Micro-Badge */}
              <div className="absolute bottom-3 right-3 z-10 inline-flex items-center gap-1 rounded-full bg-[#174D25] px-2.5 py-1 text-[10px] font-bold text-white shadow-xs backdrop-blur-sm">
                <ShieldCheck size={11} className="text-emerald-300" />
                <span>{t("welcome.supportBadge")}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Actions: Log In & Create New Account */}
        <div className="mt-4 flex flex-col gap-3 pb-2">
          {/* Primary Solid Button: Log In */}
          <PrimaryButton
            type="button"
            onClick={() => router.push("/login")}
          >
            {t("welcome.loginButton")}
          </PrimaryButton>

          {/* Secondary Outlined Button: Create New Account */}
          <button
            type="button"
            onClick={() => router.push("/register")}
            className="
              flex h-12 w-full items-center justify-center
              rounded-xl border-2 border-[#24833A] bg-transparent
              text-sm font-semibold text-[#24833A] transition
              hover:bg-[#EAF4E5] active:scale-[0.99]
            "
          >
            {t("welcome.createAccountButton")}
          </button>
        </div>
      </div>
    </AuthPageLayout>
  );
}