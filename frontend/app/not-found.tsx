import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-white">
      <div className="max-w-md rounded-2xl border border-slate-700 bg-slate-900 p-8 text-center shadow-xl">
        <p className="text-sm font-medium uppercase tracking-[0.3em] text-sky-400">404</p>
        <h1 className="mt-4 text-3xl font-bold">Page not found</h1>
        <p className="mt-3 text-sm text-slate-300">
          The page you are looking for does not exist or may have moved.
        </p>
        <Link href="/" className="mt-6 inline-flex rounded-md bg-sky-500 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-400">
          Return home
        </Link>
      </div>
    </main>
  );
}
