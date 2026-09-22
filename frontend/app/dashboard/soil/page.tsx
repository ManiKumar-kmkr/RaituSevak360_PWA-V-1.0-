export default function SoilPage() {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-slate-900">నేల పరీక్ష నివేదికలు (Soil Health Intelligence)</h1>
      <div className="mt-6 rounded-2xl border bg-white p-6 shadow-sm">
        <h3 className="font-semibold text-slate-800">పొలం 1: నల్ల రేగడి నేల (Black Soil)</h3>
        <p className="text-xs text-slate-500 mt-1">పరీక్ష తేదీ: ఆగస్టు 2026</p>
        <div className="mt-4 grid grid-cols-4 gap-3 text-center">
          <div className="rounded-xl bg-slate-50 p-3">
            <p className="text-xs text-slate-500">pH స్థాయి</p>
            <p className="text-lg font-bold text-emerald-700">6.8</p>
          </div>
          <div className="rounded-xl bg-slate-50 p-3">
            <p className="text-xs text-slate-500">నత్రజని (N)</p>
            <p className="text-lg font-bold text-emerald-700">మధ్యస్థం</p>
          </div>
          <div className="rounded-xl bg-slate-50 p-3">
            <p className="text-xs text-slate-500">భాస్వరం (P)</p>
            <p className="text-lg font-bold text-amber-600">తక్కువ</p>
          </div>
          <div className="rounded-xl bg-slate-50 p-3">
            <p className="text-xs text-slate-500">పొటాష్ (K)</p>
            <p className="text-lg font-bold text-emerald-700">ఎక్కువ</p>
          </div>
        </div>
      </div>
    </div>
  );
}
