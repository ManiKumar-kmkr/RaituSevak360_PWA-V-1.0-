"use client";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-white">
      <div className="max-w-md rounded-2xl border border-red-500/30 bg-slate-900 p-8 text-center shadow-2xl">
        <p className="mb-2 text-sm font-medium uppercase tracking-[0.2em] text-red-400">
          Something went wrong
        </p>
        <h1 className="text-3xl font-bold">Unexpected error</h1>
        <p className="mt-3 text-sm text-slate-300">
          {error.message || "An unexpected issue occurred while loading this page."}
        </p>
        <button
          type="button"
          onClick={() => reset()}
          className="mt-6 inline-flex items-center justify-center rounded-md bg-red-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-400"
        >
          Try again
        </button>
      </div>
    </main>
  );
}
