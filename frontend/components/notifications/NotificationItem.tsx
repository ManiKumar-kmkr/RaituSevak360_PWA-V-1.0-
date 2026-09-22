import React from 'react';

export interface NotificationItemProps {
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
}

export const NotificationItem: React.FC<NotificationItemProps> = ({
  title,
  message,
  type,
  isRead,
  createdAt,
}) => {
  return (
    <div
      className={`rounded-2xl border p-4 shadow-sm transition ${
        isRead ? 'border-slate-200 bg-white' : 'border-emerald-200 bg-emerald-50/40'
      }`}
    >
      <div className="flex items-center justify-between">
        <h4 className="font-semibold text-sm text-slate-900">{title}</h4>
        <span className="text-[11px] text-slate-400">{createdAt}</span>
      </div>
      <p className="mt-1 text-xs text-slate-600 leading-relaxed">{message}</p>
    </div>
  );
};
