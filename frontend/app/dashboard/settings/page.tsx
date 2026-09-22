export default function SettingsPage() {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-slate-900">సెట్టింగ్‌లు (Settings)</h1>
      <div className="mt-6 rounded-2xl border bg-white p-6 shadow-sm space-y-4">
        <div>
          <label className="text-sm font-semibold text-slate-700">భాష ఎంపిక (Preferred Language)</label>
          <select className="mt-1 block w-full rounded-xl border border-slate-300 p-2.5 text-sm">
            <option value="te">తెలుగు (Telugu)</option>
            <option value="en">English</option>
            <option value="hi">हिन्दी (Hindi)</option>
          </select>
        </div>
      </div>
    </div>
  );
}
