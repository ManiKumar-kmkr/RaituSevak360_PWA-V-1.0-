export default function AdminOverview() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-white">Ecosystem Overview</h1>
      <p className="mt-1 text-sm text-slate-400">Live platform telemetry and activity metrics across all agricultural zones.</p>

      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5">
          <p className="text-xs font-semibold uppercase text-slate-400">Active Farmers</p>
          <h2 className="mt-2 text-3xl font-extrabold text-emerald-400">12,480</h2>
          <p className="mt-1 text-xs text-emerald-500">+14% from last month</p>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5">
          <p className="text-xs font-semibold uppercase text-slate-400">Cultivated Acres</p>
          <h2 className="mt-2 text-3xl font-extrabold text-blue-400">45,210</h2>
          <p className="mt-1 text-xs text-blue-500">Across 8 districts</p>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5">
          <p className="text-xs font-semibold uppercase text-slate-400">Total Bookings</p>
          <h2 className="mt-2 text-3xl font-extrabold text-amber-400">3,892</h2>
          <p className="mt-1 text-xs text-amber-500">Labour & Machinery</p>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5">
          <p className="text-xs font-semibold uppercase text-slate-400">AI Queries Handled</p>
          <h2 className="mt-2 text-3xl font-extrabold text-purple-400">89,450</h2>
          <p className="mt-1 text-xs text-purple-500">98.2% positive accuracy</p>
        </div>
      </div>
    </div>
  );
}
