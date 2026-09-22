'use client';

export default function AIAdvisorPage() {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-3">
        <span className="text-3xl">🤖</span>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">AI రైతు సలహాదారు (AI Crop Advisor)</h1>
          <p className="text-xs text-slate-500">మీ పంటల సమస్యలు, చీడపీడల ఫోటోలు లేదా ప్రశ్నలను అడగండి.</p>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border bg-white p-6 shadow-sm">
        <div className="space-y-4">
          <div className="rounded-xl bg-slate-100 p-4 text-sm text-slate-800">
            <p className="font-semibold text-emerald-800">🌱 AI అసిస్టెంట్:</p>
            <p className="mt-1">నమస్కారం రమేష్ గారు! మీ వరి లేదా పత్తి పంటపై ఏవైనా పురుగులు లేదా ఆకులపై మచ్చలు కనిపించాయా? ఫోటో తీసి అప్‌లోడ్ చేయండి లేదా ఇక్కడ టైప్ చేయండి.</p>
          </div>
        </div>

        <div className="mt-6 flex gap-2">
          <input
            type="text"
            placeholder="మీ ప్రశ్నను ఇక్కడ అడగండి (e.g. వరిలో ఎర్ర తెగులు నివారణ ఎలా?)..."
            className="flex-1 rounded-xl border border-slate-300 px-4 py-3 text-sm focus:border-emerald-500 focus:outline-none"
          />
          <button className="rounded-xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white hover:bg-emerald-700">
            పంపండి (Send)
          </button>
        </div>
      </div>
    </div>
  );
}
