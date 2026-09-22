import Link from 'next/link';

export default function DashboardHome() {
  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      <header className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">నమస్కారం, రమేష్ గారు! 👋</h1>
          <p className="text-sm text-slate-500">కొత్తపల్లి గ్రామం, కరీంనగర్ | నేటి వాతావరణం: 31°C ఎండ</p>
        </div>
        <Link
          href="/dashboard/ai-advisor"
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md hover:opacity-95"
        >
          <span>🤖</span> AI సలహా అడగండి (Ask AI Advisor)
        </Link>
      </header>

      {/* Grid of Key Modules */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        <Link href="/dashboard/crops" className="rounded-2xl border bg-white p-5 shadow-sm transition hover:shadow-md">
          <div className="text-3xl">🌾</div>
          <h3 className="mt-3 font-semibold text-slate-800">పంటలు (Crops)</h3>
          <p className="mt-1 text-xs text-slate-500">వరి, పత్తి - 5.5 ఎకరాలు</p>
        </Link>

        <Link href="/dashboard/weather" className="rounded-2xl border bg-white p-5 shadow-sm transition hover:shadow-md">
          <div className="text-3xl">🌦️</div>
          <h3 className="mt-3 font-semibold text-slate-800">వాతావరణం (Weather)</h3>
          <p className="mt-1 text-xs text-slate-500">వర్షపాత సూచన & హెచ్చరికలు</p>
        </Link>

        <Link href="/dashboard/soil" className="rounded-2xl border bg-white p-5 shadow-sm transition hover:shadow-md">
          <div className="text-3xl">🧪</div>
          <h3 className="mt-3 font-semibold text-slate-800">నేల పరీక్ష (Soil Health)</h3>
          <p className="mt-1 text-xs text-slate-500">NPK నిష్పత్తి & ఎరువుల సిఫార్సు</p>
        </Link>

        <Link href="/dashboard/ai-advisor" className="rounded-2xl border bg-white p-5 shadow-sm transition hover:shadow-md">
          <div className="text-3xl">🧠</div>
          <h3 className="mt-3 font-semibold text-slate-800">AI సలహాదారు (AI Advisor)</h3>
          <p className="mt-1 text-xs text-slate-500">చీడపీడల గుర్తింపు & పరిష్కారాలు</p>
        </Link>

        <Link href="/dashboard/labour" className="rounded-2xl border bg-white p-5 shadow-sm transition hover:shadow-md">
          <div className="text-3xl">👥</div>
          <h3 className="mt-3 font-semibold text-slate-800">కూలీలు (Labour)</h3>
          <p className="mt-1 text-xs text-slate-500">కోత, కలుపు తీసే కూలీల బుకింగ్</p>
        </Link>

        <Link href="/dashboard/machinery" className="rounded-2xl border bg-white p-5 shadow-sm transition hover:shadow-md">
          <div className="text-3xl">🚜</div>
          <h3 className="mt-3 font-semibold text-slate-800">యంత్రాలు (Machinery)</h3>
          <p className="mt-1 text-xs text-slate-500">ట్రాక్టర్, డ్రోన్, హార్వెస్టర్ అద్దెకు</p>
        </Link>

        <Link href="/dashboard/marketplace" className="rounded-2xl border bg-white p-5 shadow-sm transition hover:shadow-md">
          <div className="text-3xl">🛍️</div>
          <h3 className="mt-3 font-semibold text-slate-800">మార్కెట్ (Marketplace)</h3>
          <p className="mt-1 text-xs text-slate-500">ధరలు, విత్తనాలు & అమ్మకాలు</p>
        </Link>

        <Link href="/dashboard/profile" className="rounded-2xl border bg-white p-5 shadow-sm transition hover:shadow-md">
          <div className="text-3xl">👤</div>
          <h3 className="mt-3 font-semibold text-slate-800">రైతు ప్రొఫైల్ (Profile)</h3>
          <p className="mt-1 text-xs text-slate-500">భూమి వివరాలు & పాస్‌బుక్</p>
        </Link>
      </div>
    </div>
  );
}
