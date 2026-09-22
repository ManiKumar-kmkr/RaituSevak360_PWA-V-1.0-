export default function LabourPage() {
  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold text-slate-900">కూలీల సేవలు (Agricultural Labour)</h1>
      <p className="mt-1 text-sm text-slate-500">మీ ప్రాంతంలో అందుబాటులో ఉన్న నిపుణులైన కూలీ బృందాలు</p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <div className="flex justify-between">
            <h3 className="font-bold text-slate-800">మల్లయ్య బృందం (10 మంది కూలీలు)</h3>
            <span className="rounded bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-800">అందుబాటులో ఉన్నారు</span>
          </div>
          <p className="mt-1 text-xs text-slate-500">నైపుణ్యం: వరి కోత, నాట్లు, కలుపు తీత</p>
          <p className="mt-2 text-sm font-semibold text-slate-800">కూలీ: ₹600 / రోజుకు ఒకరికి</p>
          <button className="mt-4 w-full rounded-xl bg-emerald-600 py-2 text-xs font-semibold text-white hover:bg-emerald-700">
            ఇప్పుడే బుక్ చేసుకోండి (Book Labour)
          </button>
        </div>
      </div>
    </div>
  );
}
