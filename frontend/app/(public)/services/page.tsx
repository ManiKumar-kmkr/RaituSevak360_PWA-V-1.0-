export default function ServicesPage() {
  return (
    <div className="mx-auto max-w-5xl py-12 px-4 sm:px-6">
      <h1 className="text-3xl font-bold text-slate-900">మా సేవలు (Our Agricultural Services)</h1>
      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="rounded-xl border p-6 bg-white shadow-sm">
          <h2 className="text-xl font-semibold text-emerald-800">1. AI పంట సంరక్షణ & సలహాలు</h2>
          <p className="mt-2 text-sm text-slate-600">రియల్-టైమ్ సస్యరక్షణ మార్గదర్శకాలు మరియు రోగ నిర్ధారణ.</p>
        </div>
        <div className="rounded-xl border p-6 bg-white shadow-sm">
          <h2 className="text-xl font-semibold text-emerald-800">2. యంత్రాలు & కూలీల బుకింగ్స్</h2>
          <p className="mt-2 text-sm text-slate-600">సమీపంలో ఉన్న వ్యవసాయ యంత్రాలు మరియు కూలీల సులభతర బుకింగ్.</p>
        </div>
      </div>
    </div>
  );
}
