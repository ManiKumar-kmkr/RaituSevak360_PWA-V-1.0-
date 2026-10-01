"use client";

import React from "react";
import { CloudSun, Sun, Droplets, Wind, MapPin, Compass } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";

export default function WeatherPage() {
  const { t } = useTranslation();

  const forecast = [
    { day: "Today", temp: "28°C / 22°C", desc: "Clear Sunlight", icon: Sun, color: "text-amber-500" },
    { day: "Tomorrow", temp: "27°C / 21°C", desc: "Partly Cloudy", icon: CloudSun, color: "text-blue-500" },
    { day: "Saturday", temp: "26°C / 20°C", desc: "Scattered Showers", icon: Droplets, color: "text-blue-600" },
  ];

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-5">
      {/* Current Weather Card */}
      <div className="rounded-3xl bg-gradient-to-br from-[#174D25] via-[#24833A] to-[#1E6E30] p-6 text-white shadow-sm">
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold backdrop-blur-xs">
            <MapPin size={12} />
            <span>Amaravati, Andhra Pradesh</span>
          </div>
          <span className="text-xs text-white/80">Updated 10m ago</span>
        </div>

        <div className="mt-5 flex items-center justify-between">
          <div>
            <div className="text-4xl sm:text-5xl font-extrabold tracking-tight">
              28°C
            </div>
            <p className="mt-1 text-sm font-semibold text-emerald-100">
              Clear Sunlight • Ideal for Foliar Spraying
            </p>
          </div>
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-400 text-amber-950 shadow-md">
            <Sun size={38} />
          </div>
        </div>

        <div className="mt-6 grid grid-cols-3 gap-2 border-t border-white/20 pt-4 text-center">
          <div>
            <span className="text-[10px] text-white/70 uppercase font-semibold">Humidity</span>
            <p className="text-xs sm:text-sm font-bold mt-0.5">62%</p>
          </div>
          <div>
            <span className="text-[10px] text-white/70 uppercase font-semibold">Wind</span>
            <p className="text-xs sm:text-sm font-bold mt-0.5">14 km/h SE</p>
          </div>
          <div>
            <span className="text-[10px] text-white/70 uppercase font-semibold">Precipitation</span>
            <p className="text-xs sm:text-sm font-bold mt-0.5">10%</p>
          </div>
        </div>
      </div>

      {/* 3-Day Forecast */}
      <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-2xs">
        <h2 className="text-sm font-bold uppercase tracking-wider text-gray-700 mb-3">
          3-Day Agricultural Forecast
        </h2>

        <div className="flex flex-col divide-y divide-gray-100">
          {forecast.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gray-50 text-gray-700">
                    <Icon size={20} className={item.color} />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-gray-900">{item.day}</h3>
                    <p className="text-[11px] text-gray-500">{item.desc}</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-gray-800">{item.temp}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
