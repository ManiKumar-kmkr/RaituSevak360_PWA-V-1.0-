"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, RegisterFormValues } from "@/validations";
import { useAuthStore } from "@/store/auth-store";
import { useTranslation } from "@/hooks/useTranslation";
import authService from "@/services/auth";
import AuthPageLayout from "@/components/auth/AuthPageLayout";
import AuthHeader from "@/components/auth/AuthHeader";
import FormInput from "@/components/auth/FormInput";
import MobileNumberInput from "@/components/auth/MobileNumberInput";
import PasswordInput from "@/components/auth/PasswordInput";
import PrimaryButton from "@/components/auth/PrimaryButton";
import ErrorMessage from "@/components/auth/ErrorMessage";

export default function RegisterPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const setPendingMobile = useAuthStore((state) => state.setPendingMobile);
  const [apiError, setApiError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      mobile: "",
      email: "",
      password: "",
      confirmPassword: "",
      termsAccepted: false,
    },
    mode: "onBlur",
  });

  const mobileValue = watch("mobile");
  const passwordValue = watch("password");
  const confirmPasswordValue = watch("confirmPassword");
  const termsAccepted = watch("termsAccepted");

  const onSubmit = async (data: RegisterFormValues) => {
    setApiError(null);
    setIsLoading(true);

    try {
      const response = await authService.registerUser({
        name: data.name.trim(),
        mobile: data.mobile.trim(),
        email: data.email?.trim() || undefined,
        password: data.password,
        confirmPassword: data.confirmPassword,
        termsAccepted: data.termsAccepted,
      });

      setPendingMobile(data.mobile.trim(), "register");

      if (response.requiresOtp !== false) {
        router.push("/verify-otp");
      } else {
        router.push("/role-selection");
      }
    } catch (err: unknown) {
      const rawMsg = err instanceof Error ? err.message : "";
      if (rawMsg.includes("already registered")) {
        setApiError(t("register.errors.mobileInvalid"));
      } else {
        setApiError(rawMsg || t("login.errors.serverError"));
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthPageLayout>
      <div className="flex flex-1 flex-col justify-between">
        <div>
          {/* Header */}
          <AuthHeader
            title={t("register.title")}
            subtitle={t("register.subtitle")}
            showBack={true}
            backHref="/login"
          />

          <ErrorMessage message={apiError} onDismiss={() => setApiError(null)} />

          {/* Registration Form */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4 sm:gap-4.5"
            noValidate
          >
            {/* 1. Full Name */}
            <FormInput
              id="name"
              label={t("register.nameLabel")}
              placeholder={t("register.namePlaceholder")}
              autoComplete="name"
              {...register("name")}
              error={errors.name ? t("register.errors.nameRequired") : undefined}
            />

            {/* 2. Mobile Number */}
            <MobileNumberInput
              id="mobile"
              label={t("register.mobileLabel")}
              placeholder={t("register.mobilePlaceholder")}
              value={mobileValue}
              onChange={(val) => {
                setValue("mobile", val, { shouldValidate: true });
              }}
              error={errors.mobile ? t("register.errors.mobileInvalid") : undefined}
            />

            {/* 3. Email Address (Optional) */}
            <FormInput
              id="email"
              type="email"
              label={t("register.emailLabel")}
              placeholder={t("register.emailPlaceholder")}
              autoComplete="email"
              {...register("email")}
              error={errors.email ? t("register.errors.emailInvalid") : undefined}
            />

            {/* 4. Password */}
            <PasswordInput
              id="password"
              label={t("register.passwordLabel")}
              placeholder={t("register.passwordPlaceholder")}
              autoComplete="new-password"
              value={passwordValue}
              onChange={(e) => {
                setValue("password", e.target.value, { shouldValidate: true });
              }}
              error={errors.password ? t("register.errors.passwordLength") : undefined}
            />

            {/* 5. Confirm Password */}
            <PasswordInput
              id="confirmPassword"
              label={t("register.confirmPasswordLabel")}
              placeholder={t("register.confirmPasswordPlaceholder")}
              autoComplete="new-password"
              value={confirmPasswordValue}
              onChange={(e) => {
                setValue("confirmPassword", e.target.value, { shouldValidate: true });
              }}
              error={
                errors.confirmPassword
                  ? errors.confirmPassword.message === "Passwords do not match"
                    ? t("register.errors.confirmPasswordMismatch")
                    : t("register.errors.confirmPasswordRequired")
                  : undefined
              }
            />

            {/* 6. Terms & Conditions Checkbox */}
            <div className="mt-1">
              <label
                htmlFor="terms"
                className="flex items-start gap-2.5 cursor-pointer text-xs text-gray-600 select-none"
              >
                <input
                  id="terms"
                  type="checkbox"
                  checked={termsAccepted}
                  onChange={(e) => {
                    setValue("termsAccepted", e.target.checked, {
                      shouldValidate: true,
                    });
                  }}
                  className="
                    mt-0.5 h-4 w-4 rounded border-gray-300 text-[#24833A]
                    focus:ring-[#24833A] accent-[#24833A]
                  "
                />
                <span className="leading-snug">
                  {t("register.termsText")}{" "}
                  <span className="font-semibold text-[#24833A] underline">
                    {t("register.termsLink")}
                  </span>{" "}
                  {t("register.andText")}{" "}
                  <span className="font-semibold text-[#24833A] underline">
                    {t("register.privacyLink")}
                  </span>
                  .
                </span>
              </label>
              {errors.termsAccepted && (
                <p className="mt-1 text-xs text-red-600 font-medium">
                  {t("register.errors.termsRequired")}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <div className="mt-4">
              <PrimaryButton
                type="submit"
                isLoading={isLoading}
                loadingText={t("register.creating")}
              >
                {t("register.createButton")}
              </PrimaryButton>
            </div>
          </form>
        </div>

        {/* Bottom Login Link */}
        <div className="mt-8 border-t border-[#DCE7D6] pt-4 text-center">
          <p className="text-xs text-gray-600">
            {t("register.alreadyHaveAccount")}{" "}
            <Link
              href="/login"
              className="font-bold text-[#24833A] hover:underline"
            >
              {t("register.loginLink")}
            </Link>
          </p>
        </div>
      </div>
    </AuthPageLayout>
  );
}
