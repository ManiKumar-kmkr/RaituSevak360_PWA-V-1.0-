export default function NotificationsAdmin() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-white">Broadcast Alerts & Push Notifications</h1>
      <p className="mt-1 text-sm text-slate-400">Broadcast weather emergencies, pest warnings, and government subsidy updates to farmers.</p>

      <div className="mt-6 max-w-xl rounded-2xl border border-slate-800 bg-slate-950 p-6 space-y-4">
        <div>
          <label className="text-xs font-semibold uppercase text-slate-400">Target Region / District</label>
          <select className="mt-1 block w-full rounded-lg border border-slate-700 bg-slate-900 p-2.5 text-sm text-white">
            <option value="all">All Districts (Telangana / Andhra Pradesh)</option>
            <option value="karimnagar">Karimnagar</option>
            <option value="warangal">Warangal</option>
          </select>
        </div>
        <div>
          <label className="text-xs font-semibold uppercase text-slate-400">Notification Title</label>
          <input
            type="text"
            placeholder="e.g. Yellow Rust Pest Alert"
            className="mt-1 block w-full rounded-lg border border-slate-700 bg-slate-900 p-2.5 text-sm text-white"
          />
        </div>
        <div>
          <label className="text-xs font-semibold uppercase text-slate-400">Message Body</label>
          <textarea
            rows={3}
            placeholder="Detailed message to farmers..."
            className="mt-1 block w-full rounded-lg border border-slate-700 bg-slate-900 p-2.5 text-sm text-white"
          />
        </div>
        <button className="rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700">
          🚀 Send Broadcast
        </button>
      </div>
    </div>
  );
}
