export default function Loading() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
      <div className="flex items-center gap-3">
        <span className="h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-sky-500" />
        <span className="text-sm font-medium uppercase tracking-[0.2em] text-slate-300">Loading...</span>
      </div>
    </main>
  );
}
