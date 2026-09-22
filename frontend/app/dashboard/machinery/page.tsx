export default function MachineryPage() {
  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold text-slate-900">వ్యవసాయ యంత్రాలు (Farm Machinery)</h1>
      <p className="mt-1 text-sm text-slate-500">ట్రాక్టర్లు, హార్వెస్టర్లు, డ్రోన్ స్ప్రేయర్లు అద్దెకు</p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <div className="flex justify-between">
            <h3 className="font-bold text-slate-800">మహీంద్రా 575 DI ట్రాక్టర్ (రొటవేటర్ తో)</h3>
            <span className="rounded bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-800">అందుబాటులో ఉంది</span>
          </div>
          <p className="mt-1 text-xs text-slate-500">యజమాని: వెంకటేష్ | దూరం: 2.5 కి.మీ</p>
          <p className="mt-2 text-sm font-semibold text-slate-800">అద్దె: ₹900 / గంటకు</p>
          <button className="mt-4 w-full rounded-xl bg-emerald-600 py-2 text-xs font-semibold text-white hover:bg-emerald-700">
            యంత్రాన్ని బుక్ చేయండి (Rent Now)
          </button>
        </div>
      </div>
    </div>
  );
}
