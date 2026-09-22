'use client';

import Link from 'next/link';

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
        <div className="text-center">
          <span className="text-3xl">🌾</span>
          <h2 className="mt-2 text-2xl font-bold text-slate-900">రైతు లాగిన్ (Farmer Login)</h2>
          <p className="mt-1 text-sm text-slate-500">మీ మొబైల్ నంబర్ ద్వారా లాగిన్ అవ్వండి</p>
        </div>

        <form className="mt-6 space-y-4" onSubmit={(e) => e.preventDefault()}>
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase">ఫోన్ నంబర్ (Phone Number)</label>
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
            OTP పొందండి (Get OTP)
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-slate-500">
          ఖాతా లేదా?{' '}
          <Link href="/register" className="font-semibold text-emerald-600 hover:underline">
            ఇక్కడ నమోదు చేసుకోండి (Register)
          </Link>
        </p>
      </div>
    </div>
  );
}
