"use client";

import React from "react";
import { ArrowLeftRight, X } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { useAuthStore } from "@/store/auth-store";
import authService from "@/services/auth";
import { UserRole } from "@/types";
import Button from "@/components/ui/Button";

interface RoleSwitchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function RoleSwitchModal({ isOpen, onClose, onSuccess }: RoleSwitchModalProps) {
  const { t } = useTranslation();
  const user = useAuthStore((state) => state.user);
  const selectedRole = useAuthStore((state) => state.selectedRole);
  const setRole = useAuthStore((state) => state.setRole);

  const [isSwitching, setIsSwitching] = React.useState(false);
  const [switchError, setSwitchError] = React.useState<string | null>(null);

  if (!isOpen) return null;

  const activeRole = ((user?.role || selectedRole || "farmer").toLowerCase() as UserRole);
  const targetRole: "farmer" | "seller" | null =
    activeRole === "farmer" ? "seller" : activeRole === "seller" ? "farmer" : null;

  if (!targetRole) {
    return null;
  }

  const switchPrompt =
    activeRole === "farmer"
      ? t("dashboard.switchConfirmToSeller")
      : t("dashboard.switchConfirmToFarmer");

  const handleConfirmSwitch = async () => {
    setIsSwitching(true);
    setSwitchError(null);

    try {
      const response = await authService.switchRole(targetRole);
      setRole(targetRole);
      if (response && response.data) {
        useAuthStore.getState().updateUser(response.data);
      } else {
        useAuthStore.getState().updateUser({ role: targetRole });
      }
      setIsSwitching(false);
      onClose();
      if (onSuccess) onSuccess();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : t("dashboard.switchError");
      setSwitchError(msg);
      setIsSwitching(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs animate-in fade-in duration-150"
    >
      <div className="relative w-full max-w-[380px] rounded-2xl bg-white p-6 shadow-2xl transition-all border border-[#24833A]/20">
        <button
          type="button"
          onClick={onClose}
          disabled={isSwitching}
          className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-xl text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition cursor-pointer"
          aria-label="Close"
        >
          <X size={18} />
        </button>

        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#E4F0DD] text-[#24833A]">
          <ArrowLeftRight size={26} strokeWidth={2.4} />
        </div>

        <h3 className="mt-4 text-center text-lg font-bold text-[#174D25]">
          {t("dashboard.switchConfirmTitle")}
        </h3>

        <p className="mt-2 text-center text-sm text-gray-600 leading-relaxed">
          {switchPrompt}
        </p>

        {switchError && (
          <div className="mt-3 rounded-xl bg-red-50 p-3 text-center text-xs font-medium text-red-600 border border-red-200">
            {switchError}
          </div>
        )}

        <div className="mt-6 flex items-center gap-3">
          <Button
            variant="secondary"
            size="md"
            fullWidth
            onClick={onClose}
            disabled={isSwitching}
          >
            {t("dashboard.cancel")}
          </Button>

          <Button
            variant="primary"
            size="md"
            fullWidth
            onClick={handleConfirmSwitch}
            disabled={isSwitching}
            isLoading={isSwitching}
          >
            {isSwitching ? t("dashboard.switching") : t("dashboard.confirm")}
          </Button>
        </div>
      </div>
    </div>
  );
}
