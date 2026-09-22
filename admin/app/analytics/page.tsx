import { AnalyticsChart } from '../charts/AnalyticsChart';

export default function AnalyticsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-white">Advanced Agricultural Analytics</h1>
      <p className="mt-1 text-sm text-slate-400">Crop yields, advisory engagement, and district-level economic growth.</p>
      <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-950 p-6">
        <h3 className="font-semibold text-slate-200">Monthly Farmer Activity & Advisory Inquiries</h3>
        <div className="mt-4 h-80">
          <AnalyticsChart />
        </div>
      </div>
    </div>
  );
}
