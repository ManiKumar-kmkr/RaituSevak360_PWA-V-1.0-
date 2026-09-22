export default function NotificationsPage() {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-slate-900">నోటిఫికేషన్లు (Notifications & Alerts)</h1>
      <div className="mt-6 space-y-3">
        <div className="rounded-2xl border border-amber-200 bg-amber-50/50 p-4 shadow-sm">
          <div className="flex items-center gap-2 font-semibold text-amber-800 text-sm">
            <span>⚠️</span> వాతావరణ హెచ్చరిక (Weather Advisory)
          </div>
          <p className="mt-1 text-xs text-slate-700">రాగల 48 గంటల్లో కరీంనగర్ పరిసరాల్లో మోస్తరు నుంచి భారీ వర్షాలు కురిసే అవకాశం ఉంది. మందుల పిచికారీని వాయిదా వేయండి.</p>
        </div>
      </div>
    </div>
  );
}
