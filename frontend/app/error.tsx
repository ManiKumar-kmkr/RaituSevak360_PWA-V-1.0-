'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 p-6 text-center">
      <h2 className="text-2xl font-bold text-slate-800">ఏదో తప్పు జరిగింది (Something went wrong)</h2>
      <p className="mt-2 text-sm text-slate-600">దయచేసి మళ్లీ ప్రయత్నించండి లేదా హోమ్‌పేజీకి వెళ్లండి.</p>
      <button
        onClick={() => reset()}
        className="mt-4 rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow hover:bg-emerald-700"
      >
        మళ్లీ ప్రయత్నించండి (Try Again)
      </button>
    </div>
  );
}
