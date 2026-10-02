"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  CloudSun,
  Calendar,
  AlertTriangle,
} from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { WeatherDataBundle } from "@/types/weather";
import weatherService from "@/services/weather";
import WeatherOverview from "@/components/weather/WeatherOverview";
import WeatherForecastDetail from "@/components/weather/WeatherForecastDetail";
import SevereWeatherAlert from "@/components/weather/SevereWeatherAlert";

type WeatherView = "overview" | "forecast" | "alerts";

export default function WeatherPage() {
  const { t } = useTranslation();
  const searchParams = useSearchParams();

  // Active view state (defaults to 'overview', respects query param if provided)
  const initialView = (searchParams.get("view") as WeatherView) || "overview";
  const [activeView, setActiveView] = useState<WeatherView>(initialView);

  // Weather bundle state
  const [weatherData, setWeatherData] = useState<WeatherDataBundle | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Load weather data on mount
  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      try {
        setIsLoading(true);
        setError(null);
        const data = await weatherService.getWeatherDataBundle();
        if (isMounted) {
          setWeatherData(data);
        }
      } catch (err) {
        if (isMounted) {
          setError("Failed to load weather data. Please try again.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadData();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleRefresh = async () => {
    try {
      setIsRefreshing(true);
      const data = await weatherService.getWeatherDataBundle();
      setWeatherData(data);
    } catch (err) {
      // Keep existing data on refresh fail
    } finally {
      setIsRefreshing(false);
    }
  };

  // Loading Skeleton State
  if (isLoading || !weatherData) {
    return (
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-5 animate-pulse">
        {/* Top bar skeleton */}
        <div className="flex items-center justify-between">
          <div className="h-9 w-36 rounded-xl bg-slate-200" />
          <div className="h-9 w-64 rounded-xl bg-slate-200" />
        </div>

        {/* Hero skeleton */}
        <div className="h-64 w-full rounded-3xl bg-slate-200" />

        {/* Hourly timeline skeleton */}
        <div className="h-36 w-full rounded-3xl bg-slate-200" />

        {/* Metric cards skeleton */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="h-28 rounded-2xl bg-slate-200" />
          <div className="h-28 rounded-2xl bg-slate-200" />
          <div className="h-28 rounded-2xl bg-slate-200" />
          <div className="h-28 rounded-2xl bg-slate-200" />
        </div>
      </div>
    );
  }

  const alertCount = weatherData.alerts?.length || 0;

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-5 pb-8">
      {/* 1. TOP BREADCRUMB & SUB-NAVIGATION TABS */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        {/* Back to Farmer Dashboard link */}
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-xs font-bold text-[#5F6F64] transition hover:text-[#174D25] self-start"
        >
          <ArrowLeft size={16} />
          <span>{t("weather.overview.backToDashboard")}</span>
        </Link>

        {/* Three Figma Screen Tabs (Overview, 7-Day Forecast, Severe Alerts) */}
        <div className="inline-flex items-center rounded-2xl bg-[#F3F6F3] p-1.5 border border-[#DCE7DD] shadow-2xs self-start sm:self-auto w-full sm:w-auto">
          {/* Tab 1: Overview */}
          <button
            type="button"
            onClick={() => setActiveView("overview")}
            className={`flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold transition ${
              activeView === "overview"
                ? "bg-white text-[#174D25] shadow-xs"
                : "text-[#5F6F64] hover:text-[#17321F]"
            }`}
          >
            <CloudSun size={15} />
            <span>{t("weather.tabs.overview")}</span>
          </button>

          {/* Tab 2: 7-Day Forecast */}
          <button
            type="button"
            onClick={() => setActiveView("forecast")}
            className={`flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold transition ${
              activeView === "forecast"
                ? "bg-white text-[#174D25] shadow-xs"
                : "text-[#5F6F64] hover:text-[#17321F]"
            }`}
          >
            <Calendar size={15} />
            <span>{t("weather.tabs.forecast")}</span>
          </button>

          {/* Tab 3: Severe Alerts */}
          <button
            type="button"
            onClick={() => setActiveView("alerts")}
            className={`flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold transition ${
              activeView === "alerts"
                ? "bg-white text-[#991B1B] shadow-xs"
                : "text-[#5F6F64] hover:text-[#991B1B]"
            }`}
          >
            <AlertTriangle size={15} className={alertCount > 0 ? "text-[#DC2626]" : "text-[#5F6F64]"} />
            <span>{t("weather.tabs.alerts")}</span>
            {alertCount > 0 && (
              <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-[#DC2626] px-1 text-[10px] font-black text-white ml-0.5">
                {alertCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* 2. RENDER ACTIVE FIGMA SCREEN */}
      {activeView === "overview" && (
        <WeatherOverview
          data={weatherData}
          onNavigateToForecast={() => setActiveView("forecast")}
          onNavigateToAlerts={() => setActiveView("alerts")}
          onRefresh={handleRefresh}
          isRefreshing={isRefreshing}
        />
      )}

      {activeView === "forecast" && (
        <WeatherForecastDetail
          daily={weatherData.daily}
          onBackToOverview={() => setActiveView("overview")}
        />
      )}

      {activeView === "alerts" && (
        <SevereWeatherAlert
          alerts={weatherData.alerts}
          onBackToOverview={() => setActiveView("overview")}
        />
      )}
    </div>
  );
}
