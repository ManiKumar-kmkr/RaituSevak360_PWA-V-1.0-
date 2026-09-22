export default function MarketplacePage() {
  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold text-slate-900">రైతు మార్కెట్ (Agricultural Marketplace)</h1>
      <p className="mt-1 text-sm text-slate-500">విత్తనాలు, సేంద్రీయ ఎరువులు మరియు పంటల ప్రత్యక్ష అమ్మకం</p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <div className="h-28 rounded-xl bg-slate-100 flex items-center justify-center text-4xl">🌾</div>
          <h3 className="mt-3 font-bold text-slate-800">ప్రీమియం సోనా మసూరి వరి విత్తనాలు</h3>
          <p className="mt-1 text-xs text-slate-500">పరిమాణం: 25 kg బ్యాగ్</p>
          <p className="mt-2 text-base font-bold text-emerald-700">₹1,150</p>
          <button className="mt-3 w-full rounded-xl bg-emerald-600 py-2 text-xs font-semibold text-white hover:bg-emerald-700">
            కొనుగోలు చేయండి (Buy Now)
          </button>
        </div>
      </div>
    </div>
  );
}
