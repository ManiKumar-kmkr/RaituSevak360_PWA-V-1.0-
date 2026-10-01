"use client";

import React from "react";
import { BookOpen, Award, PlayCircle, Clock } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";

export default function LearningPage() {
  const { t } = useTranslation();

  const courses = [
    {
      id: "CRS-1",
      title: "Precision Farming & Drip Irrigation Micro-Management",
      modules: "6 Lessons",
      duration: "45 mins",
      level: "Intermediate",
      badge: "Certificate",
    },
    {
      id: "CRS-2",
      title: "Soil Chemistry & NPK Diagnostic Interpretation",
      modules: "8 Lessons",
      duration: "1.2 hours",
      level: "Advanced",
      badge: "Field Guide",
    },
    {
      id: "CRS-3",
      title: "Integrated Pest Management (IPM) in Cotton & Paddy",
      modules: "5 Lessons",
      duration: "30 mins",
      level: "Beginner",
      badge: "Practicum",
    },
  ];

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-3xl bg-white p-5 border border-gray-200 shadow-2xs">
        <div className="flex items-center gap-3.5">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#E4F0DD] text-[#24833A] shadow-xs">
            <BookOpen size={26} strokeWidth={2.4} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-bold text-gray-900">
                {t("nav.learning")} Modules
              </h1>
              <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-[#24833A]">
                Agri Scholar
              </span>
            </div>
            <p className="text-xs text-gray-500 font-medium">
              Interactive agronomy courses, field protocols, and practical guides
            </p>
          </div>
        </div>
      </div>

      {/* Course List */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        {courses.map((course) => (
          <div
            key={course.id}
            className="flex flex-col justify-between rounded-2xl border border-gray-200 bg-white p-4 shadow-2xs transition hover:border-[#24833A]/40"
          >
            <div>
              <div className="flex items-center justify-between text-[10px] font-bold">
                <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-[#24833A]">
                  {course.badge}
                </span>
                <span className="text-gray-400">{course.level}</span>
              </div>
              <h2 className="mt-2.5 text-xs font-bold text-gray-900 leading-snug">
                {course.title}
              </h2>
            </div>

            <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
              <span className="inline-flex items-center gap-1 text-[11px] text-gray-500">
                <Clock size={12} /> {course.duration}
              </span>
              <button
                type="button"
                className="inline-flex items-center gap-1 rounded-lg bg-[#24833A] px-2.5 py-1 text-[11px] font-semibold text-white hover:bg-[#1e6e30] transition"
              >
                <PlayCircle size={12} />
                <span>Start</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
