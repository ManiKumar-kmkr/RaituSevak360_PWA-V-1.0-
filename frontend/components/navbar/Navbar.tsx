'use client';

import Link from 'next/link';

export function Navbar() {
  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b bg-white px-4 sm:px-6">
      <Link href="/dashboard" className="flex items-center gap-2 font-bold text-emerald-700 text-lg">
        <span>🌾</span>
        <span>RaituSevak360</span>
      </Link>
      <div className="flex items-center gap-3">
        <Link href="/dashboard/notifications" className="rounded-full bg-slate-100 p-2 text-slate-600 hover:bg-slate-200">
          🔔
        </Link>
        <Link href="/dashboard/profile" className="flex items-center gap-2 rounded-full border border-slate-200 p-1 pr-3 text-xs font-semibold">
          <span className="h-7 w-7 rounded-full bg-emerald-600 text-white flex items-center justify-center">ర</span>
          <span>రమేష్</span>
        </Link>
      </div>
    </header>
  );
}
