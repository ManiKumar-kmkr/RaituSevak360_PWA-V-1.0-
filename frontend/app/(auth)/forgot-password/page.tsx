'use client';

import Link from 'next/link';

export default function ForgotPasswordPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl text-center">
        <h2 className="text-2xl font-bold text-slate-900">ఖాతా పునరుద్ధరణ (Account Recovery)</h2>
        <p className="mt-1 text-sm text-slate-500">మీ రిజిస్టర్డ్ ఫోన్ నంబర్‌ను నమోదు చేయండి</p>
        <form className="mt-6 space-y-4" onSubmit={(e) => e.preventDefault()}>
          <input
            type="tel"
            placeholder="+91 98765 43210"
            className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm focus:border-emerald-500 focus:outline-none"
          />
          <button
            type="submit"
            className="w-full rounded-xl bg-emerald-600 py-3 text-sm font-semibold text-white shadow-md hover:bg-emerald-700"
          >
            రీసెట్ లింక్ / OTP పంపండి
          </button>
        </form>
        <Link href="/login" className="mt-4 inline-block text-xs font-semibold text-emerald-600 hover:underline">
          లాగిన్‌కి తిరిగి వెళ్లండి (Back to Login)
        </Link>
      </div>
    </div>
  );
}
