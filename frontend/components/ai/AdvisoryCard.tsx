"use client";

import React from 'react';
import {
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  ShieldCheck,
  Sprout,
  HelpCircle,
} from 'lucide-react';
import { StructuredAdvisory } from '../../types/ai';
import { useTranslation } from '../../hooks/useTranslation';

export interface AdvisoryCardProps {
  advisory: StructuredAdvisory;
}

export default function AdvisoryCard({ advisory }: AdvisoryCardProps) {
  const { t } = useTranslation();

  const getSeverityBadge = () => {
    switch (advisory.severity) {
      case 'high':
        return (
          <span className="inline-flex items-center gap-1 rounded-md bg-[#FEE2E2] border border-[#FECACA] px-2 py-0.5 text-[11px] font-bold text-[#B91C1C]">
            <AlertTriangle size={11} />
            <span>High Severity</span>
          </span>
        );
      case 'moderate':
        return (
          <span className="inline-flex items-center gap-1 rounded-md bg-[#FFF7E6] border border-[#FDE68A] px-2 py-0.5 text-[11px] font-bold text-[#B45309]">
            <AlertTriangle size={11} />
            <span>Moderate Severity</span>
          </span>
        );
      case 'low':
      default:
        return (
          <span className="inline-flex items-center gap-1 rounded-md bg-[#EAF7EE] border border-[#86EFAC] px-2 py-0.5 text-[11px] font-bold text-[#16803A]">
            <CheckCircle2 size={11} />
            <span>Low Severity</span>
          </span>
        );
    }
  };

  return (
    <div className="mt-3 rounded-2xl border border-[#DCE7DD] bg-white p-4 sm:p-5 shadow-2xs text-[#17321F]">
      {/* Header Row: Crop, Stage, and Severity */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#DCE7DD] pb-3">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#EAF7EE] text-[#174D25]">
            <Sprout size={18} />
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#174D25]">
              {t(advisory.cropNameKey)} {advisory.cropStageKey ? `• ${t(advisory.cropStageKey)}` : ''}
            </h4>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 rounded-md bg-[#EAF7EE] border border-[#86EFAC] px-2 py-0.5 text-[11px] font-bold text-[#16803A]">
            <Sparkles size={11} />
            <span>{advisory.confidencePercent}% Confidence</span>
          </span>
          {getSeverityBadge()}
        </div>
      </div>

      {/* Advisory Title & Diagnosis */}
      <div className="mt-3">
        <h3 className="text-sm sm:text-base font-black text-[#17321F]">
          {t(advisory.titleKey)}
        </h3>
        <p className="mt-1 text-xs text-[#5F6F64] font-medium leading-relaxed">
          {t(advisory.diagnosisKey)}
        </p>
      </div>

      {/* Symptoms Identified */}
      {advisory.symptomsKeys && advisory.symptomsKeys.length > 0 && (
        <div className="mt-3.5 rounded-xl bg-[#F7F9F6] border border-[#DCE7DD] p-3">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#5F6F64] block mb-1.5">
            Symptoms Identified:
          </span>
          <ul className="flex flex-col gap-1 text-xs text-[#17321F] font-medium">
            {advisory.symptomsKeys.map((symKey, idx) => (
              <li key={idx} className="flex items-start gap-1.5">
                <span className="text-[#F59E0B] font-bold">•</span>
                <span>{t(symKey)}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Immediate Recommended Treatments */}
      {advisory.remediesKeys && advisory.remediesKeys.length > 0 && (
        <div className="mt-3.5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#16803A] block mb-2">
            Recommended Treatment & Actions:
          </span>
          <ul className="flex flex-col gap-2">
            {advisory.remediesKeys.map((remKey, idx) => (
              <li
                key={idx}
                className="flex items-start gap-2 rounded-xl bg-[#EAF7EE]/70 border border-[#86EFAC]/80 p-2.5 text-xs text-[#17321F] font-medium leading-relaxed"
              >
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#16803A] text-white font-bold text-[10px]">
                  {idx + 1}
                </span>
                <span>{t(remKey)}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Preventive Measures */}
      {advisory.preventiveTipsKeys && advisory.preventiveTipsKeys.length > 0 && (
        <div className="mt-3 pt-3 border-t border-[#DCE7DD]/60 flex items-start gap-2 text-xs text-[#5F6F64]">
          <ShieldCheck size={15} className="text-[#16803A] shrink-0 mt-0.5" />
          <p className="font-medium">
            <strong className="text-[#17321F]">Preventive Tip: </strong>
            {advisory.preventiveTipsKeys.map((pKey) => t(pKey)).join(' ')}
          </p>
        </div>
      )}
    </div>
  );
}
