"use client";

import React from "react";
import { ArrowLeftRight, X } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { useAuthStore } from "@/store/auth-store";
import authService from "@/services/auth";
import { UserRole } from "@/types";

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
      <div className="relative w-full max-w-[380px] rounded-3xl bg-white p-6 shadow-2xl transition-all border border-[#24833A]/20">
        <button
          type="button"
          onClick={onClose}
          disabled={isSwitching}
          className="absolute right-4 top-4 rounded-full p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition"
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
          <button
            type="button"
            onClick={onClose}
            disabled={isSwitching}
            className="flex-1 rounded-xl border border-gray-300 bg-white py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
          >
            {t("dashboard.cancel")}
          </button>

          <button
            type="button"
            onClick={handleConfirmSwitch}
            disabled={isSwitching}
            className="flex-1 rounded-xl bg-[#24833A] py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#1e6e30] disabled:opacity-50 active:scale-95"
          >
            {isSwitching ? t("dashboard.switching") : t("dashboard.confirm")}
          </button>
        </div>
      </div>
    </div>
  );
}
