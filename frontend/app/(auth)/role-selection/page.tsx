"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Sprout,
  Store,
  GraduationCap,
  BookOpen,
  Landmark,
} from "lucide-react";
import { useAuthStore } from "@/store/auth-store";
import { useTranslation } from "@/hooks/useTranslation";
import { UserRole } from "@/types";
import authService from "@/services/auth";
import AuthPageLayout from "@/components/auth/AuthPageLayout";
import AuthHeader from "@/components/auth/AuthHeader";
import RoleCard from "@/components/auth/RoleCard";
import PrimaryButton from "@/components/auth/PrimaryButton";
import ErrorMessage from "@/components/auth/ErrorMessage";

export default function RoleSelectionPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const currentRole = useAuthStore((state) => state.selectedRole);
  const setRole = useAuthStore((state) => state.setRole);

  const [selectedRole, setSelectedRole] = useState<UserRole>(user?.role || currentRole || "farmer");
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  // Section 14 & 15: Direct URL Protection
  // If user already has a role, redirect to /dashboard.
  // If user is not authenticated, redirect to /login.
  React.useEffect(() => {
    if (!token && !isAuthenticated) {
      router.replace("/login");
      return;
    }
    if (user?.role) {
      router.replace("/dashboard");
    }
  }, [user, token, isAuthenticated, router]);

  // If user already has a role, show loading spinner while redirecting
  if (user?.role) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F4F8EE]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#24833A] border-t-transparent" />
      </div>
    );
  }

  const rolesConfig: { id: UserRole; icon: React.ReactNode; titleKey: string; descKey: string }[] = [
    {
      id: "farmer",
      icon: <Sprout size={24} strokeWidth={2.2} className="text-[#24833A]" />,
      titleKey: "roles.farmer.title",
      descKey: "roles.farmer.description",
    },
    {
      id: "seller",
      icon: <Store size={24} strokeWidth={2.2} className="text-[#24833A]" />,
      titleKey: "roles.seller.title",
      descKey: "roles.seller.description",
    },
    {
      id: "expert",
      icon: <GraduationCap size={24} strokeWidth={2.2} className="text-[#24833A]" />,
      titleKey: "roles.expert.title",
      descKey: "roles.expert.description",
    },
    {
      id: "student",
      icon: <BookOpen size={24} strokeWidth={2.2} className="text-[#24833A]" />,
      titleKey: "roles.student.title",
      descKey: "roles.student.description",
    },
    {
      id: "government",
      icon: <Landmark size={24} strokeWidth={2.2} className="text-[#24833A]" />,
      titleKey: "roles.government.title",
      descKey: "roles.government.description",
    },
  ];

  const handleSelectRole = (role: UserRole) => {
    setSelectedRole(role);
  };

  const handleContinue = async () => {
    setIsLoading(true);
    setApiError(null);

    try {
      const res = await authService.updateUserRole(selectedRole);
      setRole(selectedRole);
      if (res && res.data) {
        useAuthStore.getState().updateUser(res.data);
      } else {
        useAuthStore.getState().updateUser({ role: selectedRole });
      }

      router.replace("/dashboard");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : t("login.errors.serverError");
      setApiError(msg);
      setIsLoading(false);
    }
  };

  return (
    <AuthPageLayout>
      <div className="flex flex-1 flex-col justify-between">
        <div>
          {/* Header */}
          <AuthHeader
            title={t("roles.title")}
            subtitle={t("roles.subtitle")}
            showBack={true}
            backHref="/login"
          />

          <ErrorMessage message={apiError} onDismiss={() => setApiError(null)} />

          {/* 5 Roles List */}
          <div className="flex flex-col gap-3 sm:gap-3.5">
            {rolesConfig.map((role) => (
              <RoleCard
                key={role.id}
                id={role.id}
                title={t(role.titleKey)}
                nativeTitle={t(role.titleKey)}
                description={t(role.descKey)}
                icon={role.icon}
                isSelected={selectedRole === role.id}
                onSelect={handleSelectRole}
              />
            ))}
          </div>
        </div>

        {/* Continue Button */}
        <div className="mt-8 pb-2">
          <PrimaryButton
            type="button"
            onClick={handleContinue}
            isLoading={isLoading}
            loadingText={t("roles.updating")}
          >
            {t("roles.continueButton")}
          </PrimaryButton>
        </div>
      </div>
    </AuthPageLayout>
  );
}
