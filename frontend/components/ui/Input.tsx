import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({ label, error, className = '', ...props }) => {
  return (
    <div className="w-full">
      {label && <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">{label}</label>}
      <input
        className={`w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm transition focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 ${
          error ? 'border-red-500' : ''
        } ${className}`}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
};
