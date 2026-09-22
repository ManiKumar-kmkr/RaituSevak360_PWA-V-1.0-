export default function CropsPage() {
  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-900">పంటల నిర్వహణ (Crop Management)</h1>
        <button className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700">
          + కొత్త పంట నమోదు
        </button>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-800">ఖరీఫ్ 2026</span>
              <h3 className="mt-2 text-xl font-bold text-slate-900">వరి (Paddy - BPT 5204)</h3>
            </div>
            <span className="text-2xl">🌾</span>
          </div>
          <p className="mt-2 text-sm text-slate-600">విస్తీర్ణం: 3.5 ఎకరాలు | విత్తిన తేదీ: 15 జూలై 2026</p>
          <div className="mt-4 rounded-xl bg-slate-50 p-3 text-xs text-slate-600">
            ప్రస్తుత దశ: <span className="font-semibold text-emerald-700">పూత దశ (Flowering Stage)</span>
          </div>
        </div>

        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-800">ఖరీఫ్ 2026</span>
              <h3 className="mt-2 text-xl font-bold text-slate-900">పత్తి (Cotton - Bt Hybrid)</h3>
            </div>
            <span className="text-2xl">🌱</span>
          </div>
          <p className="mt-2 text-sm text-slate-600">విస్తీర్ణం: 2.0 ఎకరాలు | విత్తిన తేదీ: 02 జూలై 2026</p>
          <div className="mt-4 rounded-xl bg-slate-50 p-3 text-xs text-slate-600">
            ప్రస్తుత దశ: <span className="font-semibold text-amber-700">కాయల దశ (Boll Formation)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
