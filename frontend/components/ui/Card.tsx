import React from 'react';

export const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => {
  return (
    <div className={`rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm ${className}`}>
      {children}
    </div>
  );
};
