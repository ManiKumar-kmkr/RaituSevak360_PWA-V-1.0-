"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/store/auth-store";
import { useTranslation } from "@/hooks/useTranslation";
import authService from "@/services/auth";
import AuthPageLayout from "@/components/auth/AuthPageLayout";
import AuthHeader from "@/components/auth/AuthHeader";
import MobileNumberInput from "@/components/auth/MobileNumberInput";
import PrimaryButton from "@/components/auth/PrimaryButton";
import ErrorMessage from "@/components/auth/ErrorMessage";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const setPendingMobile = useAuthStore((state) => state.setPendingMobile);
  const [mobile, setMobile] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mobile.length !== 10) {
      setError(t("login.errors.mobileRequired"));
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      await authService.sendOtp({ mobile, purpose: "verify" });
      setPendingMobile(mobile, "verify");
      router.push("/verify-otp");
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : t("login.errors.serverError");
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthPageLayout>
      <div className="flex flex-1 flex-col justify-between">
        <div>
          <AuthHeader
            title={t("forgotPassword.title")}
            subtitle={t("forgotPassword.subtitle")}
            showBack={true}
            backHref="/login"
            showBrand={true}
            brandText={t("common.appName")}
          />

          <ErrorMessage message={error} onDismiss={() => setError(null)} />

          <p className="mb-6 text-xs text-gray-500 sm:text-sm">
            {t("forgotPassword.desc")}
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <MobileNumberInput
              id="mobile"
              label={t("login.mobileLabel")}
              placeholder={t("login.mobilePlaceholder")}
              value={mobile}
              onChange={(val) => {
                setMobile(val);
                if (error) setError(null);
              }}
              error={error && mobile.length !== 10 ? error : undefined}
            />

            <div className="mt-4">
              <PrimaryButton
                type="submit"
                isLoading={isLoading}
                disabled={mobile.length !== 10}
              >
                {t("forgotPassword.sendButton")}
              </PrimaryButton>
            </div>
          </form>
        </div>

        <div className="mt-8 border-t border-[#DCE7D6] pt-4 text-center">
          <p className="text-xs text-gray-600">
            {t("forgotPassword.remembered")}{" "}
            <Link
              href="/login"
              className="font-bold text-[#24833A] hover:underline"
            >
              {t("forgotPassword.signInLink")}
            </Link>
          </p>
        </div>
      </div>
    </AuthPageLayout>
  );
}
