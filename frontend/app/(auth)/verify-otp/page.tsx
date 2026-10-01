"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { RotateCcw, KeyRound } from "lucide-react";
import { useAuthStore } from "@/store/auth-store";
import { useTranslation } from "@/hooks/useTranslation";
import authService from "@/services/auth";
import AuthPageLayout from "@/components/auth/AuthPageLayout";
import AuthHeader from "@/components/auth/AuthHeader";
import OTPInput from "@/components/auth/OTPInput";
import PrimaryButton from "@/components/auth/PrimaryButton";
import ErrorMessage from "@/components/auth/ErrorMessage";

const DEMO_OTP_MAP: Record<string, string> = {
  "9999999999": "111111", // Farmer
  "8888888888": "222222", // Seller
  "7777777777": "333333", // Expert
  "6666666666": "444444", // Student
  "5555555555": "555555", // Government
};

export default function VerifyOTPPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const pendingMobile = useAuthStore((state) => state.pendingMobile);
  const pendingPurpose = useAuthStore((state) => state.pendingPurpose) || "login";
  const setAuth = useAuthStore((state) => state.setAuth);

  const [otp, setOtp] = useState("");
  const [countdown, setCountdown] = useState(50);
  const [canResend, setCanResend] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!pendingMobile) {
      router.replace("/login");
    }
  }, [pendingMobile, router]);

  // Format mobile display: +91 99999 99999
  const formattedMobile =
    pendingMobile && pendingMobile.length === 10
      ? `+91 ${pendingMobile.slice(0, 5)} ${pendingMobile.slice(5)}`
      : `+91 ${pendingMobile || ""}`;

  const demoOtpHint = pendingMobile ? (DEMO_OTP_MAP[pendingMobile] || "538123") : "538123";

  // Countdown timer effect
  useEffect(() => {
    if (countdown <= 0) {
      setCanResend(true);
      return;
    }

    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown]);

  const handleResend = useCallback(async () => {
    if (!canResend || isResending) return;

    setApiError(null);
    setInfoMessage(null);
    setIsResending(true);

    try {
      await authService.resendOtp(pendingMobile);
      setCountdown(50);
      setCanResend(false);
      setInfoMessage(t("otp.newCodeSent"));
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : t("login.errors.serverError");
      setApiError(msg);
    } finally {
      setIsResending(false);
    }
  }, [canResend, isResending, pendingMobile, t]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) {
      setApiError(t("otp.errors.length"));
      return;
    }

    setApiError(null);
    setIsLoading(true);

    try {
      const response = await authService.verifyOtp({
        mobile: pendingMobile,
        otp,
        purpose: pendingPurpose,
      });

      if (response.user && response.token) {
        setAuth(response.user, response.token);
      }

      if (response.user?.role) {
        router.push("/dashboard");
      } else {
        router.push("/role-selection");
      }
    } catch (err: unknown) {
      setApiError(t("otp.errors.invalid"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangeMobile = () => {
    router.push("/login");
  };

  const handleAutoFillDemoOtp = () => {
    setOtp(demoOtpHint);
    if (apiError) setApiError(null);
  };

  const formattedTimer = `00:${countdown.toString().padStart(2, "0")}`;

  return (
    <AuthPageLayout>
      <div className="flex flex-1 flex-col justify-between">
        <div>
          {/* Header */}
          <AuthHeader
            title={t("otp.title")}
            subtitle={t("otp.subtitle")}
            showBack={true}
            backHref={pendingPurpose === "register" ? "/register" : "/login"}
          />

          <ErrorMessage message={apiError} onDismiss={() => setApiError(null)} />

          {infoMessage && (
            <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-800 font-medium">
              {infoMessage}
            </div>
          )}

          {/* Central Instruction Text */}
          <div className="my-5 text-center">
            <p className="text-xs text-gray-500 sm:text-sm">
              {t("otp.sentText")}
            </p>
            <p className="mt-1 text-base font-bold text-gray-900 tracking-wide sm:text-lg">
              {formattedMobile}
            </p>

            {/* Development OTP quick badge */}
            <div className="mt-2.5 inline-flex items-center gap-1.5 rounded-full bg-amber-50 border border-amber-200 px-3 py-1 text-[11px] text-amber-800">
              <KeyRound size={12} className="text-amber-600" />
              <span>{t("otp.devHint")} <strong>{demoOtpHint}</strong></span>
              <button
                type="button"
                onClick={handleAutoFillDemoOtp}
                className="ml-1 text-[10px] font-bold text-[#24833A] underline hover:text-[#174D25]"
              >
                {t("otp.autoFill")}
              </button>
            </div>
          </div>

          {/* OTP Input Form */}
          <form onSubmit={handleVerify} className="mt-3">
            <OTPInput
              length={6}
              value={otp}
              onChange={(newOtp) => {
                setOtp(newOtp);
                if (apiError) setApiError(null);
              }}
              hasError={Boolean(apiError)}
            />

            {/* Resend Code Section */}
            <div className="mt-6 flex items-center justify-center gap-1.5 text-xs">
              <RotateCcw
                size={14}
                className={`transition ${canResend ? "text-[#24833A]" : "text-gray-400"}`}
              />
              {canResend ? (
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={isResending}
                  className="font-semibold text-[#24833A] hover:underline"
                >
                  {isResending ? t("otp.resending") : t("otp.resendButton")}
                </button>
              ) : (
                <span className="text-gray-400 font-medium">
                  {t("otp.resendIn")}{" "}
                  <span className="font-semibold text-red-500">
                    {formattedTimer}
                  </span>
                </span>
              )}
            </div>

            {/* Verify Button */}
            <div className="mt-8">
              <PrimaryButton
                type="submit"
                isLoading={isLoading}
                loadingText={t("otp.verifying")}
                disabled={otp.length !== 6}
              >
                {t("otp.verifyButton")}
              </PrimaryButton>
            </div>
          </form>
        </div>

        {/* Change Mobile Number Bottom Action */}
        <div className="mt-8 border-t border-[#DCE7D6] pt-4 text-center">
          <button
            type="button"
            onClick={handleChangeMobile}
            className="text-xs font-semibold text-gray-600 hover:text-[#24833A] transition"
          >
            {t("otp.changeMobile")}
          </button>
        </div>
      </div>
    </AuthPageLayout>
  );
}
