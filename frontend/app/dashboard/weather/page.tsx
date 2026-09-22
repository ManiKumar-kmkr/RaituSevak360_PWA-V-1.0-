export default function WeatherPage() {
  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold text-slate-900">వాతావరణ నివేదిక (Weather Intelligence)</h1>
      <div className="mt-6 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 p-6 text-white shadow-lg">
        <p className="text-sm font-medium text-blue-100">కరీంనగర్ జిల్లా | నేటి సూచన</p>
        <div className="mt-4 flex items-center justify-between">
          <div>
            <h2 className="text-5xl font-extrabold">31°C</h2>
            <p className="mt-1 text-sm text-blue-100">పాక్షికంగా మేఘావృతం (Partly Cloudy)</p>
          </div>
          <span className="text-6xl">⛅</span>
        </div>
        <div className="mt-6 grid grid-cols-3 gap-2 border-t border-blue-400/30 pt-4 text-center text-xs">
          <div>
            <p className="text-blue-200">తేమ (Humidity)</p>
            <p className="mt-1 font-bold text-sm">68%</p>
          </div>
          <div>
            <p className="text-blue-200">గాలి వేగం (Wind)</p>
            <p className="mt-1 font-bold text-sm">14 km/h</p>
          </div>
          <div>
            <p className="text-blue-200">వర్ష సూచన (Rain Prob)</p>
            <p className="mt-1 font-bold text-sm">25%</p>
          </div>
        </div>
      </div>
    </div>
  );
}
