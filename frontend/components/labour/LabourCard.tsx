import React from 'react';

export interface LabourCardProps {
  fullName: string;
  skills: string[];
  dailyWageRate: number;
  location: string;
  isAvailable: boolean;
}

export const LabourCard: React.FC<LabourCardProps> = ({
  fullName,
  skills,
  dailyWageRate,
  location,
  isAvailable,
}) => {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-bold text-slate-900">{fullName}</h3>
          <p className="text-xs text-slate-500">{location}</p>
        </div>
        <span
          className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
            isAvailable ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
          }`}
        >
          {isAvailable ? 'అందుబాటులో ఉంది' : 'బుక్ అయింది'}
        </span>
      </div>
      <div className="mt-3 flex flex-wrap gap-1">
        {skills.map((s, i) => (
          <span key={i} className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] text-slate-600">
            {s}
          </span>
        ))}
      </div>
      <div className="mt-4 flex items-center justify-between border-t pt-3">
        <span className="text-sm font-bold text-slate-900">₹{dailyWageRate} / రోజుకు</span>
        <button className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700">
          బుక్ చేయండి
        </button>
      </div>
    </div>
  );
};
