export default function ProfilePage() {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-slate-900">రైతు ప్రొఫైల్ (Farmer Profile)</h1>
      <div className="mt-6 rounded-2xl bg-white p-6 border shadow-sm space-y-4">
        <div>
          <p className="text-xs text-slate-400 uppercase font-semibold">పేరు (Name)</p>
          <p className="text-base font-medium text-slate-800">రమేష్ పటేల్ (Ramesh Patel)</p>
        </div>
        <div>
          <p className="text-xs text-slate-400 uppercase font-semibold">మొబైల్ నంబర్ (Phone)</p>
          <p className="text-base font-medium text-slate-800">+91 98765 43210</p>
        </div>
        <div>
          <p className="text-xs text-slate-400 uppercase font-semibold">చిరునామా (Address)</p>
          <p className="text-base font-medium text-slate-800">కొత్తపల్లి గ్రామం, కరీంనగర్ రూరల్, తెలంగాణ - 505001</p>
        </div>
        <div>
          <p className="text-xs text-slate-400 uppercase font-semibold">మొత్తం వ్యవసాయ భూమి (Total Land)</p>
          <p className="text-base font-medium text-slate-800">5.5 ఎకరాలు (Acres)</p>
        </div>
      </div>
    </div>
  );
}
