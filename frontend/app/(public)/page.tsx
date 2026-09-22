import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center sm:px-6 lg:px-8">
      <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">
        ✨ AI-Powered Smart Agriculture Ecosystem
      </div>
      <h1 className="mt-6 max-w-4xl text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
        రైతుల సంక్షేమం కోసం <span className="text-emerald-600">AI ఆధునిక వ్యవసాయం</span>
      </h1>
      <p className="mt-4 max-w-2xl text-lg text-slate-600">
        AI ఆధారిత పంట సలహాలు, చీడపీడల గుర్తింపు, నేల పరీక్ష ఫలితాలు, కూలీలు & యంత్రాల బుకింగ్స్ ఒకే వేదికపై.
      </p>

      <div className="mt-8 flex flex-wrap justify-center gap-4">
        <Link
          href="/register"
          className="rounded-xl bg-emerald-600 px-6 py-3 text-base font-medium text-white shadow-lg shadow-emerald-600/30 hover:bg-emerald-700"
        >
          రైతు నమోదు (Get Started)
        </Link>
        <Link
          href="/dashboard"
          className="rounded-xl border border-slate-300 bg-white px-6 py-3 text-base font-medium text-slate-700 shadow-sm hover:bg-slate-50"
        >
          డ్యాష్‌బోర్డ్ (Dashboard)
        </Link>
      </div>

      <div className="mt-16 grid max-w-5xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 text-left">
        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <div className="text-2xl">🌱</div>
          <h3 className="mt-3 font-semibold text-slate-900">AI పంట సలహాదారు</h3>
          <p className="mt-1 text-xs text-slate-500">వ్యవసాయ దశల వారీగా ఖచ్చితమైన ఎరువులు మరియు రక్షణ సలహాలు.</p>
        </div>
        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <div className="text-2xl">🌤️</div>
          <h3 className="mt-3 font-semibold text-slate-900">వాతావరణ సూచనలు</h3>
          <p className="mt-1 text-xs text-slate-500">గ్రామ స్థాయి వర్ష సూచనలు మరియు ముందస్తు హెచ్చరికలు.</p>
        </div>
        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <div className="text-2xl">🚜</div>
          <h3 className="mt-3 font-semibold text-slate-900">కూలీలు & యంత్రాలు</h3>
          <p className="mt-1 text-xs text-slate-500">ట్రాక్టర్లు, హార్వెస్టర్లు మరియు నిపుణులైన కూలీల బుకింగ్స్.</p>
        </div>
        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <div className="text-2xl">🛒</div>
          <h3 className="mt-3 font-semibold text-slate-900">రైతు మార్కెట్</h3>
          <p className="mt-1 text-xs text-slate-500">పంటలు, విత్తనాలు మరియు ఉపకరణాలను నేరుగా కొనుగోలు, అమ్మకాలు.</p>
        </div>
      </div>
    </div>
  );
}
