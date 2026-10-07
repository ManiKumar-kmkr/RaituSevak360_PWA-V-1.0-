"use client";

import React, { useState } from 'react';
import {
  ArrowLeft,
  Calendar,
  Droplets,
  Wind,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { DailyForecastItem } from '../../types/weather';
import { useTranslation } from '../../hooks/useTranslation';
import { getWeatherConditionIcon } from './WeatherOverview';
import BackButton from '@/components/ui/BackButton';

interface WeatherForecastDetailProps {
  daily: DailyForecastItem[];
  onBackToOverview: () => void;
}

export default function WeatherForecastDetail({
  daily,
  onBackToOverview,
}: WeatherForecastDetailProps) {
  const { t } = useTranslation();
  // Expanded days map (first day expanded by default)
  const [expandedDayId, setExpandedDayId] = useState<string | null>(daily[0]?.id || null);

  const toggleExpand = (id: string) => {
    setExpandedDayId((prev) => (prev === id ? null : id));
  };

  const getSprayingBadge = (suitability: DailyForecastItem['sprayingSuitability']) => {
    switch (suitability) {
      case 'favorable':
        return (
          <span className="inline-flex items-center gap-1 rounded-md bg-[#EAF7EE] border border-[#86EFAC] px-2 py-0.5 text-[11px] font-bold text-[#16803A]">
            <CheckCircle2 size={11} />
            <span>{t('weather.forecast.sprayingFavorable')}</span>
          </span>
        );
      case 'moderate':
        return (
          <span className="inline-flex items-center gap-1 rounded-md bg-[#FFF7E6] border border-[#FDE68A] px-2 py-0.5 text-[11px] font-bold text-[#B45309]">
            <AlertTriangle size={11} />
            <span>{t('weather.forecast.sprayingModerate')}</span>
          </span>
        );
      case 'unfavorable':
      default:
        return (
          <span className="inline-flex items-center gap-1 rounded-md bg-[#FFF1F2] border border-[#FECACA] px-2 py-0.5 text-[11px] font-bold text-[#B91C1C]">
            <AlertCircle size={11} />
            <span>{t('weather.forecast.sprayingUnfavorable')}</span>
          </span>
        );
    }
  };

  return (
    <div id="weather-view-forecast" className="flex flex-col gap-5 w-full">
      {/* Header bar with Back button */}
      <div className="flex items-center justify-between">
        <BackButton
          onClick={onBackToOverview}
          label={t('weather.forecast.backToOverview')}
        />

        <div className="inline-flex items-center gap-1.5 rounded-full bg-[#EAF7EE] px-3 py-1 text-xs font-bold text-[#16803A] border border-[#86EFAC]">
          <Calendar size={13} />
          <span>7-Day Cycle</span>
        </div>
      </div>

      {/* Screen Title & Subtitle — Solid High Contrast Gradient Hero */}
      <div
        className="rounded-3xl border border-[#174D25] p-6 sm:p-7 text-white shadow-sm"
        style={{ background: 'linear-gradient(135deg, #174D25 0%, #24833A 100%)' }}
      >
        <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white drop-shadow-xs">
          {t('weather.forecast.title')}
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-[#E8F5E9] font-medium leading-relaxed max-w-xl">
          {t('weather.forecast.subtitle')}
        </p>
      </div>

      {/* 7-Day Forecast Cards */}
      <div className="flex flex-col gap-3.5">
        {daily.map((item) => {
          const isExpanded = expandedDayId === item.id;
          return (
            <div
              key={item.id}
              className={`rounded-2xl border bg-white transition shadow-2xs overflow-hidden ${
                isExpanded ? 'border-[#24833A] ring-1 ring-[#24833A]/25' : 'border-[#DCE7DD] hover:border-[#24833A]/50'
              }`}
            >
              {/* Main Day Header Row */}
              <div
                onClick={() => toggleExpand(item.id)}
                className="flex items-center justify-between p-4 sm:p-5 cursor-pointer select-none gap-3"
              >
                {/* Left: Icon, Day & Condition */}
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#F7F9F6] border border-[#DCE7DD] shadow-2xs">
                    {getWeatherConditionIcon(item.condition, 26)}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm sm:text-base font-bold text-[#17321F] truncate">
                        {t(item.dayKey)}
                      </h3>
                      <span className="text-xs font-semibold text-[#5F6F64]">
                        • {item.dateFormatted}
                      </span>
                    </div>

                    <p className="text-xs font-medium text-[#5F6F64] truncate mt-0.5">
                      {t(item.conditionLabelKey)}
                    </p>
                  </div>
                </div>

                {/* Right: Temp, Spraying Badge & Toggle */}
                <div className="flex items-center gap-3 sm:gap-4 shrink-0">
                  <div className="hidden sm:block">
                    {getSprayingBadge(item.sprayingSuitability)}
                  </div>

                  <div className="text-right">
                    <div className="text-sm sm:text-base font-black text-[#17321F]">
                      {item.tempMax}° / {item.tempMin}°
                    </div>
                    <div className="flex items-center justify-end gap-1 text-[11px] font-bold text-[#2563EB] mt-0.5">
                      <Droplets size={11} />
                      <span>{item.precipitationChance}%</span>
                      {item.rainfallMm > 0 && (
                        <span className="text-[#5F6F64] font-medium ml-1">
                          ({item.rainfallMm} mm)
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="text-[#5F6F64]">
                    {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </div>
                </div>
              </div>

              {/* Mobile Spraying Badge if on small screen */}
              <div className="block sm:hidden px-4 pb-3">
                {getSprayingBadge(item.sprayingSuitability)}
              </div>

              {/* Expanded Agricultural Details & Day Parts */}
              {isExpanded && (
                <div className="border-t border-[#DCE7DD] bg-[#F7F9F6] p-4 sm:p-5">
                  {/* Agricultural Recommendation */}
                  <div className="rounded-xl border border-[#86EFAC] bg-[#EAF7EE] p-3.5">
                    <div className="flex items-start gap-2.5">
                      <CheckCircle2 size={16} className="text-[#16803A] shrink-0 mt-0.5" />
                      <div>
                        <span className="text-xs font-bold uppercase tracking-wider text-[#16803A]">
                          Farming Operation Advisory:
                        </span>
                        <p className="mt-0.5 text-xs text-[#17321F] font-medium leading-relaxed">
                          {t(item.agriRecommendationKey)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Metrics Row: Wind & Rainfall */}
                  <div className="mt-3.5 grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
                    <div className="rounded-xl border border-[#DCE7DD] bg-white p-2.5">
                      <span className="text-[11px] font-bold text-[#5F6F64] uppercase">Rainfall</span>
                      <p className="text-sm font-black text-[#17321F] mt-0.5">
                        {item.rainfallMm} mm
                      </p>
                    </div>
                    <div className="rounded-xl border border-[#DCE7DD] bg-white p-2.5">
                      <span className="text-[11px] font-bold text-[#5F6F64] uppercase">Rain Probability</span>
                      <p className="text-sm font-black text-[#2563EB] mt-0.5">
                        {item.precipitationChance}%
                      </p>
                    </div>
                    <div className="rounded-xl border border-[#DCE7DD] bg-white p-2.5">
                      <span className="text-[11px] font-bold text-[#5F6F64] uppercase">Wind Velocity</span>
                      <p className="text-sm font-black text-[#17321F] mt-0.5">
                        {item.windSpeed} km/h
                      </p>
                    </div>
                    <div className="rounded-xl border border-[#DCE7DD] bg-white p-2.5">
                      <span className="text-[11px] font-bold text-[#5F6F64] uppercase">Relative Humidity</span>
                      <p className="text-sm font-black text-[#17321F] mt-0.5">
                        {item.humidity}%
                      </p>
                    </div>
                  </div>

                  {/* Day-Part Breakdown (Morning, Afternoon, Evening, Night) */}
                  {item.dayParts && item.dayParts.length > 0 && (
                    <div className="mt-3.5">
                      <h4 className="text-xs font-bold text-[#5F6F64] uppercase tracking-wider mb-2">
                        {t('weather.forecast.dayPartBreakdown')}
                      </h4>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {item.dayParts.map((part, pIdx) => (
                          <div
                            key={pIdx}
                            className="flex flex-col items-center justify-between rounded-xl border border-[#DCE7DD] bg-white p-3 text-center"
                          >
                            <span className="text-xs font-bold text-[#17321F]">
                              {t(part.partNameKey)}
                            </span>
                            <div className="my-2">
                              {getWeatherConditionIcon(part.condition, 20)}
                            </div>
                            <span className="text-sm font-black text-[#17321F]">
                              {part.temp}°C
                            </span>
                            <span className="text-[11px] font-bold text-[#2563EB] mt-0.5">
                              {part.rainChance}% rain
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
