import React from 'react';

export interface AdvisoryCardProps {
  cropName: string;
  stage: string;
  advisoryText: string;
  recommendations: string[];
}

export const AdvisoryCard: React.FC<AdvisoryCardProps> = ({
  cropName,
  stage,
  advisoryText,
  recommendations,
}) => {
  return (
    <div className="rounded-2xl border border-emerald-200 bg-emerald-50/40 p-5 shadow-sm">
      <div className="flex items-center gap-2">
        <span className="text-xl">🤖</span>
        <h4 className="font-bold text-emerald-900">{cropName} సలహా ({stage})</h4>
      </div>
      <p className="mt-2 text-xs text-slate-700">{advisoryText}</p>
      <ul className="mt-3 space-y-1 text-xs text-slate-700">
        {recommendations.map((rec, idx) => (
          <li key={idx} className="flex items-start gap-1.5">
            <span className="text-emerald-600 font-bold">•</span>
            <span>{rec}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};
