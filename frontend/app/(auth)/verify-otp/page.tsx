'use client';

export default function VerifyOtpPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl text-center">
        <span className="text-3xl">🔑</span>
        <h2 className="mt-2 text-2xl font-bold text-slate-900">OTP నమోదు చేయండి (Verify OTP)</h2>
        <p className="mt-1 text-sm text-slate-500">మీ మొబైల్‌కు పంపిన 6 అంకెల కోడ్‌ను నమోదు చేయండి</p>

        <form className="mt-6 space-y-4" onSubmit={(e) => e.preventDefault()}>
          <input
            type="text"
            maxLength={6}
            placeholder="123456"
            className="w-full text-center tracking-widest text-2xl font-bold rounded-lg border border-slate-300 py-3 focus:border-emerald-500 focus:outline-none"
          />
          <button
            type="submit"
            className="w-full rounded-xl bg-emerald-600 py-3 text-sm font-semibold text-white shadow-md hover:bg-emerald-700"
          >
            ధృవీకరించండి (Verify & Proceed)
          </button>
        </form>
      </div>
    </div>
  );
}
