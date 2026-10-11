"use client";

import React from 'react';
import {
  ArrowLeft,
  AlertTriangle,
  ShieldAlert,
  Clock,
  MapPin,
  CheckCircle2,
  XCircle,
  PhoneCall,
  Info,
  Building2,
} from 'lucide-react';
import { SevereWeatherAlertData } from '../../types/weather';
import { useTranslation } from '../../hooks/useTranslation';
import BackButton from '@/components/ui/BackButton';

interface SevereWeatherAlertProps {
  alerts: SevereWeatherAlertData[];
  onBackToOverview: () => void;
}

export default function SevereWeatherAlert({
  alerts,
  onBackToOverview,
}: SevereWeatherAlertProps) {
  const { t } = useTranslation();
  const alert = alerts[0];

  if (!alert) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center bg-white rounded-3xl border border-[#DCE7DD]">
        <ShieldAlert size={48} className="text-[#16803A] mb-3" />
        <h2 className="text-lg font-bold text-[#17321F]">No Active Severe Alerts</h2>
        <p className="text-sm text-[#5F6F64] mt-1 max-w-sm">
          There are currently no high-severity storm, heat, or flood warnings issued for your district.
        </p>
        <button
          type="button"
          onClick={onBackToOverview}
          className="mt-5 rounded-xl bg-[#174D25] px-4 py-2 text-xs font-bold text-white shadow-2xs hover:bg-[#1E6E30]"
        >
          {t('weather.alert.backToOverview')}
        </button>
      </div>
    );
  }

  return (
    <div id="weather-view-alerts" className="flex flex-col gap-5 w-full">
      {/* Header bar with Back button */}
      <div className="flex items-center justify-between">
        <BackButton
          onClick={onBackToOverview}
          label={t('weather.alert.backToOverview')}
        />

        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FEE2E2] px-3 py-1 text-xs font-bold text-[#B91C1C] border border-[#FECACA]">
          <AlertTriangle size={13} className="text-[#DC2626] animate-pulse" />
          <span>{t('weather.alert.critical')}</span>
        </span>
      </div>

      {/* 1. SEVERE WARNING HERO BANNER (Option A: High Contrast Light Red Danger Card) */}
      <div className="relative overflow-hidden rounded-3xl border-2 border-[#FCA5A5] bg-[#FFF1F2] p-6 sm:p-7 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="flex h-13 w-13 sm:h-14 sm:w-14 shrink-0 items-center justify-center rounded-2xl bg-[#FEE2E2] text-[#DC2626] border border-[#FECACA] shadow-2xs">
            <AlertTriangle size={30} className="animate-pulse" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
              <span className="rounded-md bg-[#FEE2E2] border border-[#FECACA] px-2.5 py-0.5 text-[11px] font-black uppercase tracking-wider text-[#B91C1C]">
                {t(alert.sourceKey)}
              </span>
            </div>

            <h1 className="mt-2 text-lg sm:text-2xl font-black text-[#991B1B] tracking-tight">
              {t(alert.titleKey)}
            </h1>

            <p className="mt-1.5 text-xs sm:text-sm font-semibold text-[#7F1D1D] leading-relaxed">
              {t(alert.headlineKey)}
            </p>
          </div>
        </div>

        {/* Validity & Affected Districts Bar */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3 border-t border-[#FCA5A5]/60 pt-4 text-xs font-medium text-[#7F1D1D]">
          <div className="flex items-center gap-2">
            <Clock size={16} className="text-[#DC2626] shrink-0" />
            <span>
              <strong className="text-[#991B1B] font-bold">{t('weather.alert.validPeriod')}:</strong> {alert.issuedAt} — {alert.expiresAt}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <MapPin size={16} className="text-[#DC2626] shrink-0" />
            <span>
              <strong className="text-[#991B1B] font-bold">{t('weather.alert.affectedAreas')}:</strong> {alert.affectedDistricts.join(', ')}
            </span>
          </div>
        </div>
      </div>

      {/* 2. OFFICIAL METEOROLOGICAL SYNOPSIS (White Card) */}
      <div className="rounded-3xl border border-[#DCE7DD] bg-white p-5 sm:p-6 shadow-2xs">
        <div className="flex items-center gap-2 text-[#17321F] font-bold text-sm sm:text-base mb-2">
          <Info size={18} className="text-[#2563EB]" />
          <h2>Official Meteorological Synopsis</h2>
        </div>
        <p className="text-xs sm:text-sm text-[#4B5F52] leading-relaxed font-normal">
          {t(alert.descriptionKey)}
        </p>
      </div>

      {/* 3. CROP VULNERABILITY ASSESSMENT (White Card with Specific Badges) */}
      <div className="rounded-3xl border border-[#DCE7DD] bg-white p-5 sm:p-6 shadow-2xs">
        <h2 className="text-sm sm:text-base font-bold text-[#17321F] mb-4 flex items-center gap-2">
          <ShieldAlert size={18} className="text-[#DC2626]" />
          <span>{t('weather.alert.cropImpactTitle')}</span>
        </h2>

        <div className="flex flex-col gap-3">
          {alert.cropImpacts.map((impact, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-[#DCE7DD] p-4 transition bg-white hover:border-[#24833A]/40"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-bold text-[#17321F]">
                  {t(impact.cropNameKey)}
                </span>
                <span
                  className={`rounded-md px-2 py-0.5 text-[11px] font-bold border ${
                    impact.riskLevel === 'high'
                      ? 'bg-[#FEE2E2] text-[#B91C1C] border-[#FECACA]'
                      : 'bg-[#FFF7E6] text-[#B45309] border-[#FDE68A]'
                  }`}
                >
                  {impact.riskLevel.toUpperCase()} RISK
                </span>
              </div>

              <p className="mt-2 text-xs font-semibold text-[#4B5F52]">
                {t(impact.impactSummaryKey)}
              </p>

              <div className="mt-2.5 rounded-xl bg-[#EAF7EE] border border-[#86EFAC] p-3 text-xs text-[#166534] font-medium leading-relaxed">
                <strong className="font-bold">Required Mitigation: </strong>
                {t(impact.advisoryKey)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. FARMER MITIGATION ACTION CHECKLIST & DON'TS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* DO's */}
        <div className="rounded-3xl border border-[#86EFAC] bg-[#EAF7EE] p-5 sm:p-6 shadow-2xs">
          <h3 className="text-sm font-bold text-[#166534] uppercase tracking-wider flex items-center gap-2 mb-3.5">
            <CheckCircle2 size={18} className="text-[#16803A]" />
            <span>{t('weather.alert.actionChecklistTitle')}</span>
          </h3>

          <ul className="flex flex-col gap-2.5">
            {alert.farmerActionSteps.map((stepKey, sIdx) => (
              <li
                key={sIdx}
                className="flex items-start gap-2.5 rounded-xl bg-white p-3 border border-[#86EFAC]/70 text-xs text-[#17321F] font-medium leading-relaxed shadow-2xs"
              >
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#16803A] text-white font-bold text-[11px]">
                  {sIdx + 1}
                </span>
                <span>{t(stepKey)}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* DON'Ts */}
        <div className="rounded-3xl border border-[#FECACA] bg-[#FFF1F2] p-5 sm:p-6 shadow-2xs">
          <h3 className="text-sm font-bold text-[#991B1B] uppercase tracking-wider flex items-center gap-2 mb-3.5">
            <XCircle size={18} className="text-[#DC2626]" />
            <span>{t('weather.alert.dontsTitle')}</span>
          </h3>

          <ul className="flex flex-col gap-2.5">
            {alert.dontsList.map((dontKey, dIdx) => (
              <li
                key={dIdx}
                className="flex items-start gap-2.5 rounded-xl bg-white p-3 border border-[#FECACA]/70 text-xs text-[#7F1D1D] font-medium leading-relaxed shadow-2xs"
              >
                <XCircle size={16} className="text-[#DC2626] shrink-0 mt-0.5" />
                <span>{t(dontKey)}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* 5. EMERGENCY CONTACTS & DISASTER SUPPORT */}
      <div className="rounded-3xl border border-[#DCE7DD] bg-white p-5 sm:p-6 shadow-2xs">
        <h3 className="text-sm sm:text-base font-bold text-[#17321F] mb-3 flex items-center gap-2">
          <Building2 size={18} className="text-[#24833A]" />
          <span>{t('weather.alert.emergencyContactsTitle')}</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {alert.emergencyContacts.map((contact, cIdx) => (
            <a
              key={cIdx}
              href={`tel:${contact.number.replace(/[^0-9]/g, '')}`}
              className="flex items-center justify-between rounded-2xl border border-[#DCE7DD] p-4 transition hover:border-[#24833A] hover:bg-[#EAF7EE]/30 active:scale-95 group"
            >
              <div>
                <span className="text-xs font-semibold text-[#5F6F64] block">
                  {t(contact.titleKey)}
                </span>
                <span className="text-sm sm:text-base font-black text-[#17321F] mt-1 block group-hover:text-[#174D25]">
                  {contact.number}
                </span>
              </div>
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#F3F6F3] text-[#174D25] group-hover:bg-[#174D25] group-hover:text-white transition">
                <PhoneCall size={16} />
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
