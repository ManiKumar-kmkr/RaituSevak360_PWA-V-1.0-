'use client';

import Link from 'next/link';

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
        <div className="text-center">
          <span className="text-3xl">🌱</span>
          <h2 className="mt-2 text-2xl font-bold text-slate-900">కొత్త రైతు నమోదు (Register)</h2>
          <p className="mt-1 text-sm text-slate-500">RaituSevak360 లో మీ ఖాతాను ప్రారంభించండి</p>
        </div>

        <form className="mt-6 space-y-4" onSubmit={(e) => e.preventDefault()}>
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase">పూర్తి పేరు (Full Name)</label>
            <input
              type="text"
              placeholder="ఉదా: రాము"
              className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-3 text-sm focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase">మొబైల్ నంబర్ (Mobile Number)</label>
            <input
              type="tel"
              placeholder="+91 98765 43210"
              className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-3 text-sm focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-xl bg-emerald-600 py-3 text-sm font-semibold text-white shadow-md hover:bg-emerald-700"
          >
            నమోదు పూర్తి చేయండి (Register)
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-slate-500">
          ఇప్పటికే ఖాతా ఉందా?{' '}
          <Link href="/login" className="font-semibold text-emerald-600 hover:underline">
            లాగిన్ అవ్వండి (Login)
          </Link>
        </p>
      </div>
    </div>
  );
}
