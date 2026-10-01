"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginFormValues } from "@/validations";
import { useAuthStore } from "@/store/auth-store";
import { useTranslation } from "@/hooks/useTranslation";
import authService from "@/services/auth";
import AuthPageLayout from "@/components/auth/AuthPageLayout";
import AuthHeader from "@/components/auth/AuthHeader";
import MobileNumberInput from "@/components/auth/MobileNumberInput";
import PasswordInput from "@/components/auth/PasswordInput";
import PrimaryButton from "@/components/auth/PrimaryButton";
import ErrorMessage from "@/components/auth/ErrorMessage";

export default function LoginPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const setAuth = useAuthStore((state) => state.setAuth);
  const setPendingMobile = useAuthStore((state) => state.setPendingMobile);
  const [apiError, setApiError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      mobile: "",
      password: "",
    },
    mode: "onBlur",
  });

  const mobileValue = watch("mobile");
  const passwordValue = watch("password");

  const onSubmit = async (data: LoginFormValues) => {
    setApiError(null);
    setIsLoading(true);

    try {
      const response = await authService.loginUser({
        mobile: data.mobile.trim(),
        password: data.password,
      });

      if (response.token && response.user) {
        setAuth(response.user, response.token);
        if (response.user.role) {
          router.push("/dashboard");
        } else {
          router.push("/role-selection");
        }
      } else if (response.requiresOtp) {
        setPendingMobile(data.mobile.trim(), "login");
        router.push("/verify-otp");
      } else {
        setPendingMobile(data.mobile.trim(), "login");
        router.push("/verify-otp");
      }
    } catch (err: unknown) {
      const rawMsg = err instanceof Error ? err.message : "";

      if (
        rawMsg.includes("not found") ||
        rawMsg.includes("register first")
      ) {
        setApiError(t("login.errors.userNotFound"));
      } else if (
        rawMsg.includes("password") ||
        rawMsg.includes("Incorrect")
      ) {
        setApiError(t("login.errors.invalidCredentials"));
      } else if (
        rawMsg.includes("10-digit") ||
        rawMsg.includes("valid")
      ) {
        setApiError(t("login.errors.mobileRequired"));
      } else if (
        rawMsg.includes("connect") ||
        rawMsg.includes("network") ||
        rawMsg.includes("timeout")
      ) {
        setApiError(t("login.errors.serverError"));
      } else {
        setApiError(rawMsg || t("login.errors.serverError"));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginWithOtp = async () => {
    if (mobileValue && mobileValue.length === 10) {
      setPendingMobile(mobileValue, "login");

      try {
        await authService.sendOtp({
          mobile: mobileValue,
          purpose: "login",
        });
      } catch {
        // Continue to verify-otp
      }
    }

    router.push("/verify-otp");
  };

  return (
    <AuthPageLayout>
      <div className="flex flex-1 flex-col justify-between">
        <div>
          {/* Header */}
          <AuthHeader
            title={t("login.title")}
            subtitle={t("login.subtitle")}
            showBack={true}
            backHref="/welcome"
            showBrand={true}
            brandText={t("common.appName")}
          />

          <ErrorMessage
            message={apiError}
            onDismiss={() => setApiError(null)}
          />

          {/* Login Form */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4 sm:gap-4.5"
            noValidate
          >
            {/* Mobile Number */}
            <MobileNumberInput
              id="mobile"
              label={t("login.mobileLabel")}
              placeholder={t("login.mobilePlaceholder")}
              value={mobileValue}
              onChange={(val) => {
                setValue("mobile", val, {
                  shouldValidate: true,
                });
              }}
              error={
                errors.mobile
                  ? t("login.errors.mobileRequired")
                  : undefined
              }
            />

            {/* Password */}
            <PasswordInput
              id="password"
              label={t("login.passwordLabel")}
              placeholder={t("login.passwordPlaceholder")}
              value={passwordValue}
              onChange={(e) => {
                setValue("password", e.target.value, {
                  shouldValidate: true,
                });
              }}
              error={
                errors.password
                  ? t("login.errors.passwordMinLength")
                  : undefined
              }
            />

            {/* OTP + Forgot Password Links */}
            <div className="flex items-center justify-between text-xs pt-1">
              <button
                type="button"
                onClick={handleLoginWithOtp}
                className="font-medium text-[#24833A] hover:underline"
              >
                {t("login.loginWithOtp")}
              </button>

              <Link
                href="/forgot-password"
                className="font-medium text-gray-500 hover:text-[#24833A] hover:underline"
              >
                {t("login.forgotPassword")}
              </Link>
            </div>

            {/* Submit Button */}
            <div className="mt-4">
              <PrimaryButton
                type="submit"
                isLoading={isLoading}
                loadingText={t("login.signingIn")}
              >
                {t("login.signInButton")}
              </PrimaryButton>
            </div>
          </form>
        </div>

        {/* Bottom Registration Link */}
        <div className="mt-8 border-t border-[#DCE7D6] pt-5 text-center">
          <p className="text-xs text-gray-500 font-medium">
            {t("login.newToRaituSevak")}
          </p>

          <Link
            href="/register"
            className="
              mt-3 flex h-11 w-full items-center justify-center
              rounded-xl border border-[#24833A] bg-transparent
              text-sm font-semibold text-[#24833A] transition
              hover:bg-[#EAF4E5] active:scale-[0.99]
            "
          >
            {t("login.createAccountButton")}
          </Link>
        </div>
      </div>
    </AuthPageLayout>
  );
}