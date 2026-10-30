import { FileText } from 'lucide-react';
import { AnimatedChart } from './AnimatedChart';
const channels = [
  { symbol: 'BLG', name: 'Blog Posts', value: '12,461', change: '+4.20%', color: '#F59E0B', positive: true },
  { symbol: 'SOC', name: 'Social Media', value: '8,932', change: '-1.05%', color: '#3B82F6', positive: false },
  { symbol: 'NWS', name: 'Newsletters', value: '5,718', change: '+2.87%', color: '#10B981', positive: true },
];
function ProgressRing({ percent, color }: { percent: number; color: string }) {
  const circ = 2 * Math.PI * 16;
  return <svg width="40" height="40" viewBox="0 0 40 40" className="hidden sm:block" aria-hidden="true"><circle cx="20" cy="20" r="16" fill="none" stroke="#E5E7EB" strokeWidth="3" /><circle className="progress-ring-fill" cx="20" cy="20" r="16" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={circ - percent / 100 * circ} transform="rotate(-90 20 20)" /></svg>;
}
export function Dashboard() {
  return <div className="dashboard-animate bg-white rounded-tl-2xl shadow-xl border border-gray-100 p-4 sm:p-6 md:p-8 w-full max-w-xl flex flex-col gap-4 sm:gap-6">
    <div className="flex flex-col sm:flex-row items-start sm:justify-between gap-3 sm:gap-0">
      <div className="flex items-center gap-3"><div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gray-100 flex items-center justify-center"><FileText className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" /></div><div><p className="text-xs sm:text-sm text-gray-400 font-medium">Total Reach</p><p className="text-xl sm:text-3xl font-bold text-gray-900 tracking-tight">498,098 <span className="text-xs font-normal text-gray-400 tracking-normal">views</span></p></div></div>
      <div className="flex flex-wrap items-center justify-end gap-2 text-[10px] text-gray-500"><span className="flex items-center gap-1"><i className="w-2 h-2 rounded-full bg-black" />Published</span><span className="flex items-center gap-1"><i className="w-2 h-2 rounded-full bg-gray-300" />In Draft</span><span className="text-xs font-medium text-gray-700 bg-gray-100 rounded-md px-2.5 py-1">Monthly</span></div>
    </div>
    <AnimatedChart />
    <div><h3 className="text-sm font-semibold text-gray-700 mb-4">Top Channels</h3><div className="flex flex-col gap-4">{channels.map(ch => <div key={ch.symbol} className="flex items-center justify-between gap-3"><div className="flex items-center gap-3"><div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-white font-bold text-sm" style={{ backgroundColor: ch.color }}>{ch.symbol[0]}</div><div className="text-xs"><span className="font-bold text-gray-800">{ch.symbol}</span><span className="hidden sm:inline text-gray-400 ml-2">{ch.name}</span></div></div><div className="flex items-center gap-3"><div className="text-right"><p className="text-sm font-semibold text-gray-800">{ch.value}</p><p className={`text-xs ${ch.positive ? 'text-emerald-500' : 'text-red-500'}`}>{ch.change}</p></div><ProgressRing percent={ch.positive ? 70 : 30} color={ch.color} /></div></div>)}</div></div>
  </div>;
}
