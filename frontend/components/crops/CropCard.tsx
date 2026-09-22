import React from 'react';

export interface CropCardProps {
  cropName: string;
  variety?: string;
  season: string;
  areaInAcres: number;
  currentStage: string;
  healthStatus: string;
}

export const CropCard: React.FC<CropCardProps> = ({
  cropName,
  variety,
  season,
  areaInAcres,
  currentStage,
  healthStatus,
}) => {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex justify-between items-start">
        <div>
          <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-800">
            {season}
          </span>
          <h3 className="mt-2 text-lg font-bold text-slate-900">
            {cropName} {variety && <span className="text-sm font-normal text-slate-500">({variety})</span>}
          </h3>
        </div>
        <span className="text-2xl">🌱</span>
      </div>
      <p className="mt-2 text-xs text-slate-600">విస్తీర్ణం: {areaInAcres} ఎకరాలు</p>
      <div className="mt-3 flex justify-between items-center border-t pt-3 text-xs">
        <span className="text-slate-500">దశ: <strong>{currentStage}</strong></span>
        <span className="rounded-full bg-green-50 px-2 py-0.5 font-medium text-emerald-700">{healthStatus}</span>
      </div>
    </div>
  );
};
