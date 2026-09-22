import React from 'react';

export interface ProductCardProps {
  name: string;
  category: string;
  pricePerUnit: number;
  unit: string;
  location: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  name,
  category,
  pricePerUnit,
  unit,
  location,
}) => {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-700">
        {category}
      </span>
      <h3 className="mt-2 text-base font-bold text-slate-900">{name}</h3>
      <p className="text-xs text-slate-500 mt-1">ప్రాంతం: {location}</p>
      <div className="mt-4 flex items-center justify-between border-t pt-3">
        <span className="text-lg font-bold text-emerald-700">
          ₹{pricePerUnit} <span className="text-xs font-normal text-slate-500">/{unit}</span>
        </span>
        <button className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700">
          కొనుగోలు
        </button>
      </div>
    </div>
  );
};
