import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 p-6 text-center">
      <h1 className="text-4xl font-extrabold text-emerald-800">404</h1>
      <h2 className="mt-2 text-xl font-semibold text-slate-800">పేజీ కనుగొనబడలేదు (Page Not Found)</h2>
      <p className="mt-1 text-sm text-slate-600">మీరు వెతుకుతున్న పేజీ అందుబాటులో లేదు.</p>
      <Link
        href="/"
        className="mt-5 inline-block rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white shadow hover:bg-emerald-700"
      >
        హోమ్‌కి వెళ్లండి (Go Home)
      </Link>
    </div>
  );
}
