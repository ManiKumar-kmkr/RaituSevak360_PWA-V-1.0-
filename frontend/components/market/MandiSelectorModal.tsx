"use client";

import React, { useEffect } from "react";
import { X, MapPin, Check, Building2 } from "lucide-react";
import { Mandi } from "@/types/market";
import { useTranslation } from "@/hooks/useTranslation";

interface MandiSelectorModalProps {
  mandis: Mandi[];
  currentMandiId: string;
  isOpen: boolean;
  onClose: () => void;
  onSelectMandi: (mandi: Mandi) => void;
}

export default function MandiSelectorModal({
  mandis,
  currentMandiId,
  isOpen,
  onClose,
  onSelectMandi,
}: MandiSelectorModalProps) {
  const { t } = useTranslation();

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      id="modal-mandi-selector"
      style={{ zIndex: 35 }}
      className="fixed inset-0 z-30 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="mandi-modal-title"
    >
      <div
        className="w-full max-w-lg rounded-3xl border border-[#DCE7DD] bg-white p-5 sm:p-6 shadow-xl animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-[#DCE7DD] pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#EAF7EE] text-[#174D25]">
              <MapPin size={22} className="text-[#24833A]" />
            </div>
            <div>
              <h3
                id="mandi-modal-title"
                className="text-base sm:text-lg font-bold text-[#17321F]"
              >
                {t("marketPrices.selectMandiTitle")}
              </h3>
              <p className="text-xs text-[#5F6F64] font-medium">
                {t("marketPrices.selectMandiDesc")}
              </p>
            </div>
          </div>
          <button
            id="btn-close-mandi-modal"
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-xl text-[#5F6F64] hover:bg-[#F7F9F6] hover:text-[#17321F] transition cursor-pointer"
            aria-label={t("marketPrices.close")}
          >
            <X size={18} />
          </button>
        </div>

        {/* Mandi List */}
        <div className="mt-4 flex max-h-[60vh] flex-col gap-2.5 overflow-y-auto pr-1">
          {mandis.map((mandi) => {
            const isSelected = mandi.id === currentMandiId;
            return (
              <button
                key={mandi.id}
                id={`btn-select-mandi-${mandi.id}`}
                type="button"
                onClick={() => {
                  onSelectMandi(mandi);
                  onClose();
                }}
                className={`
                  flex w-full items-center justify-between rounded-2xl border p-3.5 sm:p-4 text-left transition cursor-pointer
                  ${
                    isSelected
                      ? "border-[#24833A] bg-[#EAF7EE]/60 shadow-2xs"
                      : "border-[#DCE7DD] bg-white hover:border-[#24833A]/60 hover:bg-[#F7F9F6]"
                  }
                `}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`
                      flex h-10 w-10 shrink-0 items-center justify-center rounded-xl
                      ${isSelected ? "bg-[#24833A] text-white" : "bg-[#F4F8EE] text-[#5F6F64]"}
                    `}
                  >
                    <Building2 size={18} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs sm:text-sm text-[#17321F] truncate">
                        {mandi.name}
                      </span>
                      {mandi.isPrimary && (
                        <span className="shrink-0 rounded-full bg-[#E4F0DD] px-2 py-0.5 text-[10px] font-black text-[#174D25]">
                          {t("marketPrices.currentMandiBadge")}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-[#5F6F64] mt-0.5">
                      <span>{mandi.district}, {mandi.state}</span>
                      <span>•</span>
                      <span className="font-semibold text-[#174D25]">{mandi.distanceKm} km {t("marketPrices.away")}</span>
                    </div>
                  </div>
                </div>

                <div className="ml-3 shrink-0">
                  {isSelected ? (
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#24833A] text-white">
                      <Check size={14} strokeWidth={3} />
                    </div>
                  ) : (
                    <div className="h-5 w-5 rounded-full border border-gray-300" />
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div className="mt-5 border-t border-[#DCE7DD] pt-4 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-[#DCE7DD] bg-[#F7F9F6] px-4 py-2 text-xs font-bold text-[#17321F] hover:bg-[#EAF7EE] transition cursor-pointer"
          >
            {t("marketPrices.close")}
          </button>
        </div>
      </div>
    </div>
  );
}
