"use client";

import React from 'react';

export interface WeatherCardProps {
  label: string;
  value: string | number;
  subtext?: string;
  icon?: React.ReactNode;
  badge?: string;
  badgeVariant?: 'neutral' | 'success' | 'warning' | 'alert';
  className?: string;
}

export default function WeatherCard({
  label,
  value,
  subtext,
  icon,
  badge,
  badgeVariant = 'neutral',
  className = '',
}: WeatherCardProps) {
  const getBadgeClass = () => {
    switch (badgeVariant) {
      case 'success':
        return 'bg-[#EAF7EE] text-[#16803A] border-[#86EFAC]';
      case 'warning':
        return 'bg-[#FFF7E6] text-[#B45309] border-[#FDE68A]';
      case 'alert':
        return 'bg-[#FFF1F2] text-[#B91C1C] border-[#FECACA]';
      case 'neutral':
      default:
        return 'bg-[#F3F6F3] text-[#5F6F64] border-[#DCE7DD]';
    }
  };

  return (
    <div
      className={`flex flex-col justify-between rounded-2xl border border-[#DCE7DD] bg-white p-4 shadow-2xs transition hover:border-[#24833A] hover:shadow-xs ${className}`}
    >
      <div className="flex items-start justify-between gap-2">
        <span className="text-xs font-bold text-[#5F6F64] uppercase tracking-wider">
          {label}
        </span>
        {icon && (
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#F3F6F3] text-[#24833A]">
            {icon}
          </div>
        )}
      </div>

      <div className="mt-3">
        <div className="text-xl sm:text-2xl font-black text-[#17321F] tracking-tight">
          {value}
        </div>
        {subtext && (
          <p className="mt-1 text-xs text-[#5F6F64] font-medium leading-tight">
            {subtext}
          </p>
        )}
      </div>

      {badge && (
        <div className="mt-3 pt-2.5 border-t border-[#DCE7DD]/60 flex items-center">
          <span
            className={`inline-flex items-center px-2 py-0.5 text-[11px] font-bold rounded-md border ${getBadgeClass()}`}
          >
            {badge}
          </span>
        </div>
      )}
    </div>
  );
}
