"use client";

import React from 'react';
import {
  Sun,
  CloudSun,
  Cloud,
  CloudRain,
  CloudLightning,
  Wind,
  Droplets,
  MapPin,
  RefreshCw,
  AlertTriangle,
  Compass,
  Sunrise,
  Sunset,
  Gauge,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Calendar,
} from 'lucide-react';
import { WeatherDataBundle, WeatherConditionCode } from '../../types/weather';
import { useTranslation } from '../../hooks/useTranslation';
import WeatherCard from './WeatherCard';

interface WeatherOverviewProps {
  data: WeatherDataBundle;
  onNavigateToForecast: () => void;
  onNavigateToAlerts: () => void;
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

export const getWeatherConditionIcon = (
  condition: WeatherConditionCode,
  size = 22,
  className = ''
) => {
  switch (condition) {
    case 'sunny':
      return <Sun size={size} className={`text-amber-500 ${className}`} />;
    case 'partly-cloudy':
      return <CloudSun size={size} className={`text-amber-400 ${className}`} />;
    case 'cloudy':
      return <Cloud size={size} className={`text-slate-400 ${className}`} />;
    case 'rain-light':
      return <CloudRain size={size} className={`text-blue-500 ${className}`} />;
    case 'rain-heavy':
      return <CloudRain size={size} className={`text-blue-600 ${className}`} />;
    case 'thunderstorm':
      return <CloudLightning size={size} className={`text-amber-500 ${className}`} />;
    case 'windy':
      return <Wind size={size} className={`text-teal-600 ${className}`} />;
    default:
      return <Sun size={size} className={`text-amber-500 ${className}`} />;
  }
};

export default function WeatherOverview({
  data,
  onNavigateToForecast,
  onNavigateToAlerts,
  onRefresh,
  isRefreshing = false,
}: WeatherOverviewProps) {
  const { t } = useTranslation();
  const { current, hourly, alerts, fieldwork } = data;
  const activeAlert = alerts && alerts.length > 0 ? alerts[0] : null;

  return (
    <div className="flex flex-col gap-5 w-full">
      {/* 1. SEVERE WEATHER ALERT BANNER (Amber Warning Card with Dark Amber Text) */}
      {activeAlert && (
        <div
          onClick={onNavigateToAlerts}
          className="group relative cursor-pointer overflow-hidden rounded-2xl border-2 border-[#F59E0B] bg-[#FFF7E6] p-4 sm:p-5 shadow-xs transition hover:bg-[#FEF3C7] active:scale-[0.99]"
          role="alert"
          aria-label={t(activeAlert.titleKey)}
        >
          <div className="flex items-start gap-3.5">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#F59E0B] text-white shadow-xs">
              <AlertTriangle size={24} className="animate-pulse" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-black uppercase tracking-wider bg-[#F59E0B] text-white">
                  {t('weather.alert.warning')}
                </span>
                <span className="text-xs font-bold text-[#92400E]">
                  {activeAlert.issuedAt}
                </span>
              </div>

              <h3 className="mt-1 text-sm sm:text-base font-bold text-[#78350F] truncate sm:whitespace-normal">
                {t(activeAlert.titleKey)}
              </h3>

              <p className="mt-0.5 text-xs text-[#92400E] line-clamp-2 leading-relaxed font-medium">
                {t(activeAlert.headlineKey)}
              </p>

              <div className="mt-3 flex items-center gap-1.5 text-xs font-bold text-[#78350F] group-hover:text-[#451A03]">
                <span>{t('weather.overview.viewAlertDetails')}</span>
                <ArrowRight size={14} className="transition group-hover:translate-x-1" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. HERO CARD — CURRENT WEATHER (Guaranteed High Contrast Dark Green Gradient) */}
      <div
        className="relative overflow-hidden rounded-3xl border border-[#174D25] p-6 sm:p-7 text-white shadow-md"
        style={{ background: 'linear-gradient(135deg, #174D25 0%, #24833A 60%, #1E6E30 100%)' }}
      >
        {/* Subtle decorative background rings */}
        <div className="pointer-events-none absolute -right-12 -top-12 h-56 w-56 rounded-full bg-white/5 blur-xl" />
        <div className="pointer-events-none absolute -left-12 -bottom-12 h-56 w-56 rounded-full bg-emerald-400/10 blur-xl" />

        {/* Top bar: Location & Refresh */}
        <div className="relative flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3.5 py-1.5 text-xs font-semibold backdrop-blur-md border border-white/20">
            <MapPin size={13} className="text-amber-300" />
            <span>
              {current.mandal ? `${current.mandal}, ` : ''}
              {current.district}, {current.state}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-[#E8F5E9]">
              {t('weather.overview.updated')} {current.updatedAt}
            </span>
            {onRefresh && (
              <button
                type="button"
                onClick={onRefresh}
                disabled={isRefreshing}
                className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/15 text-white transition hover:bg-white/25 active:scale-95 disabled:opacity-50"
                title={t('weather.overview.refresh')}
                aria-label={t('weather.overview.refresh')}
              >
                <RefreshCw size={14} className={isRefreshing ? 'animate-spin' : ''} />
              </button>
            )}
          </div>
        </div>

        {/* Center: Live Temperature & Condition */}
        <div className="relative mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl sm:text-6xl font-black tracking-tight drop-shadow-xs">
                {current.temperature}°
              </span>
              <span className="text-2xl font-bold text-emerald-200">C</span>
            </div>

            <div className="mt-1 flex flex-wrap items-center gap-2 text-xs sm:text-sm font-semibold text-[#E8F5E9]">
              <span>{t(current.conditionLabelKey)}</span>
              <span>•</span>
              <span>
                {t('weather.overview.feelsLike')} {current.feelsLike}°C
              </span>
              <span>•</span>
              <span>
                {t('weather.overview.todayRange')}: {current.tempMin}° / {current.tempMax}°
              </span>
            </div>

            <p className="mt-2 text-xs sm:text-sm text-emerald-100 font-medium leading-relaxed max-w-lg">
              {t(current.summaryKey)}
            </p>
          </div>

          {/* Large Weather Illustration Badge */}
          <div className="flex h-20 w-20 sm:h-24 sm:w-24 shrink-0 items-center justify-center rounded-3xl bg-amber-400 text-amber-950 shadow-lg border-2 border-amber-300/60 self-start sm:self-auto">
            {current.condition === 'sunny' ? (
              <Sun size={48} className="animate-spin-slow" />
            ) : current.condition === 'thunderstorm' ? (
              <CloudLightning size={48} />
            ) : current.condition === 'rain-heavy' ? (
              <CloudRain size={48} />
            ) : (
              <CloudSun size={48} />
            )}
          </div>
        </div>

        {/* Bottom Micro-climate summary row */}
        <div className="relative mt-7 grid grid-cols-3 gap-2 border-t border-white/20 pt-4 text-center">
          <div>
            <span className="text-[11px] text-[#E8F5E9] uppercase font-bold tracking-wider">
              {t('weather.metrics.humidity')}
            </span>
            <p className="text-sm sm:text-base font-extrabold mt-0.5">
              {current.metrics.humidity}%
            </p>
          </div>
          <div>
            <span className="text-[11px] text-[#E8F5E9] uppercase font-bold tracking-wider">
              {t('weather.metrics.wind')}
            </span>
            <p className="text-sm sm:text-base font-extrabold mt-0.5">
              {current.metrics.windSpeed} km/h {current.metrics.windDirection}
            </p>
          </div>
          <div>
            <span className="text-[11px] text-[#E8F5E9] uppercase font-bold tracking-wider">
              {t('weather.metrics.precipitation')}
            </span>
            <p className="text-sm sm:text-base font-extrabold mt-0.5">
              {current.metrics.precipitationChance}%
            </p>
          </div>
        </div>
      </div>

      {/* 3. 24-HOUR FORECAST TIMELINE (Horizontal Scroll) */}
      <div className="rounded-3xl border border-[#DCE7DD] bg-white p-5 sm:p-6 shadow-2xs">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Calendar size={18} className="text-[#24833A]" />
            <h2 className="text-sm sm:text-base font-bold text-[#17321F] tracking-tight">
              {t('weather.hourly.title')}
            </h2>
          </div>
          <span className="text-xs font-semibold text-[#5F6F64]">24 hrs</span>
        </div>

        <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-200">
          {hourly.map((item, idx) => (
            <div
              key={idx}
              className={`flex flex-col items-center justify-between min-w-[72px] sm:min-w-[80px] rounded-2xl p-3 border text-center transition ${
                idx === 0
                  ? 'border-[#24833A] bg-[#EAF7EE] shadow-xs ring-1 ring-[#24833A]/30'
                  : 'border-[#DCE7DD] bg-[#F7F9F6] hover:bg-[#F3F6F3]'
              }`}
            >
              <span className={`text-xs font-bold ${idx === 0 ? 'text-[#174D25]' : 'text-[#5F6F64]'}`}>
                {item.time.startsWith('weather.') ? t(item.time) : item.time}
              </span>

              <div className="my-2.5 flex h-9 w-9 items-center justify-center">
                {getWeatherConditionIcon(item.condition, 22)}
              </div>

              <span className="text-sm font-black text-[#17321F]">
                {item.temperature}°
              </span>

              <div className="mt-1 flex items-center gap-0.5 text-[11px] font-bold text-[#2563EB]">
                <Droplets size={10} />
                <span>{item.precipitationChance}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. EXTENDED MICRO-CLIMATE METRICS GRID */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <WeatherCard
          label={t('weather.metrics.uvIndex')}
          value={t(current.metrics.uvDescriptionKey)}
          icon={<Sun size={18} className="text-amber-500" />}
          subtext="Protection needed noon"
        />
        <WeatherCard
          label={t('weather.metrics.pressure')}
          value={`${current.metrics.pressure} hPa`}
          icon={<Gauge size={18} className="text-teal-600" />}
          subtext="Stable atmospheric baro"
        />
        <WeatherCard
          label={t('weather.metrics.dewPoint')}
          value={`${current.metrics.dewPoint}°C`}
          icon={<Droplets size={18} className="text-blue-500" />}
          subtext={`Vis: ${current.metrics.visibilityKm} km`}
        />
        <WeatherCard
          label={t('weather.metrics.sunrise')}
          value={current.metrics.sunrise}
          icon={<Sunrise size={18} className="text-amber-600" />}
          subtext={`Sunset: ${current.metrics.sunset}`}
        />
      </div>

      {/* 5. AGRICULTURAL FIELDWORK ADVISORY (Solid White Card with Green Accents) */}
      <div className="rounded-3xl border border-[#DCE7DD] bg-white p-5 sm:p-6 shadow-2xs">
        <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-[#DCE7DD]">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#EAF7EE] text-[#174D25]">
              <ShieldCheck size={18} />
            </div>
            <h2 className="text-sm sm:text-base font-bold text-[#17321F]">
              {t('weather.fieldwork.title')}
            </h2>
          </div>

          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#16803A] px-3 py-1 text-xs font-bold text-white shadow-2xs">
            <CheckCircle2 size={13} />
            <span>{t(fieldwork.statusKey)}</span>
          </span>
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3.5">
          {/* Spraying Advice */}
          <div className="rounded-2xl border border-[#DCE7DD] bg-[#F7F9F6] p-4 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#17321F]">
                {t('weather.fieldwork.spraying')}
              </span>
              <span className="rounded-md bg-[#EAF7EE] border border-[#86EFAC] px-2 py-0.5 text-[11px] font-bold text-[#16803A]">
                Optimal
              </span>
            </div>
            <p className="mt-2 text-xs font-medium text-[#4B5F52] leading-relaxed">
              {t(fieldwork.spraying.windowTextKey)}
            </p>
          </div>

          {/* Irrigation Advice */}
          <div className="rounded-2xl border border-[#DCE7DD] bg-[#F7F9F6] p-4 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#17321F]">
                {t('weather.fieldwork.irrigation')}
              </span>
              <span className="rounded-md bg-[#EFF6FF] border border-[#BFDBFE] px-2 py-0.5 text-[11px] font-bold text-[#1D4ED8]">
                Moderate
              </span>
            </div>
            <p className="mt-2 text-xs font-medium text-[#4B5F52] leading-relaxed">
              {t(fieldwork.irrigation.adviceKey)}
            </p>
          </div>

          {/* Harvesting Advice */}
          <div className="rounded-2xl border border-[#DCE7DD] bg-[#F7F9F6] p-4 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#17321F]">
                {t('weather.fieldwork.harvesting')}
              </span>
              <span className="rounded-md bg-[#FFF7E6] border border-[#FDE68A] px-2 py-0.5 text-[11px] font-bold text-[#B45309]">
                Favorable
              </span>
            </div>
            <p className="mt-2 text-xs font-medium text-[#4B5F52] leading-relaxed">
              {t(fieldwork.harvesting.adviceKey)}
            </p>
          </div>
        </div>
      </div>

      {/* 6. PRIMARY CALL-TO-ACTION: VIEW 7-DAY EXTENDED FORECAST */}
      <button
        type="button"
        onClick={onNavigateToForecast}
        className="flex w-full items-center justify-between rounded-2xl bg-[#174D25] px-5 py-4 text-white shadow-sm transition hover:bg-[#24833A] active:scale-[0.99] cursor-pointer"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15">
            <Calendar size={20} className="text-emerald-300" />
          </div>
          <div className="text-left">
            <h3 className="text-sm font-bold sm:text-base text-white">
              {t('weather.overview.viewFullForecast')}
            </h3>
            <p className="text-xs text-[#E8F5E9] font-medium">
              Daily rainfall mm, wind gusts, and day-part agricultural plan
            </p>
          </div>
        </div>
        <ArrowRight size={20} className="text-[#E8F5E9] shrink-0 ml-2" />
      </button>
    </div>
  );
}
