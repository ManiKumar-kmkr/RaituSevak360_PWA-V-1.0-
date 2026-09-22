export default function FarmPage() {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-slate-900">పొలం వివరాలు (Farm Management)</h1>
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <h3 className="text-lg font-semibold text-emerald-800">పొలం 1: ఉత్తర చేను (North Field)</h3>
          <p className="mt-2 text-sm text-slate-600">విస్తీర్ణం: 3.5 ఎకరాలు | నేల: నల్ల రేగడి (Black Soil)</p>
          <p className="text-sm text-slate-600">నీటి వనరు: బోర్‌వెల్ (Borewell)</p>
        </div>
        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <h3 className="text-lg font-semibold text-emerald-800">పొలం 2: దక్షిణ చేను (South Field)</h3>
          <p className="mt-2 text-sm text-slate-600">విస్తీర్ణం: 2.0 ఎకరాలు | నేల: ఎర్ర నేల (Red Loam)</p>
          <p className="text-sm text-slate-600">నీటి వనరు: కాలువ (Canal)</p>
        </div>
      </div>
    </div>
  );
}
