import React from 'react';

export interface MachineryCardProps {
  modelName: string;
  machineryType: string;
  hourlyRate: number;
  location: string;
  isAvailable: boolean;
}

export const MachineryCard: React.FC<MachineryCardProps> = ({
  modelName,
  machineryType,
  hourlyRate,
  location,
  isAvailable,
}) => {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex justify-between items-start">
        <div>
          <span className="text-xs font-semibold text-emerald-700 uppercase">{machineryType}</span>
          <h3 className="mt-1 font-bold text-slate-900">{modelName}</h3>
          <p className="text-xs text-slate-500">{location}</p>
        </div>
        <span className="text-2xl">🚜</span>
      </div>
      <div className="mt-4 flex items-center justify-between border-t pt-3">
        <span className="text-sm font-bold text-slate-900">₹{hourlyRate} / గంటకు</span>
        <button className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700">
          అద్దెకు తీసుకోండి
        </button>
      </div>
    </div>
  );
};
