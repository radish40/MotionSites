// Kept as a reusable component; the specified landing page does not display it.
export default function LogoCloud() {
  return <div className="w-full bg-white border-t border-slate-100 py-7 select-none relative z-20">
    <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 items-center justify-center gap-y-8 gap-x-6">
      <div className="flex flex-col items-center gap-2"><svg width="28" height="28" viewBox="0 0 32 32" fill="none" stroke="#334155" aria-hidden="true"><circle cx="16" cy="16" r="14"/><path d="M16 2v14L4 23l12-7 12 7-12-7"/></svg><span className="text-[10px] font-medium tracking-wider uppercase text-slate-700">Mercedes-Benz</span></div>
      <div className="flex items-center justify-center gap-1"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="m7 12 3 3 7-7"/></svg><span className="text-[13px] font-bold tracking-tight text-slate-800">Certainty</span></div>
      <div className="flex flex-col items-center text-slate-800"><svg width="38" height="22" viewBox="0 0 40 24" fill="none" stroke="currentColor" aria-hidden="true"><path d="m1 22 11-19 11 19M10 22 11-18 11 18M21 22 9-15 9 15"/></svg><span className="text-[7px] font-black tracking-[0.16em]">STAR MOUNTAIN</span><span className="text-[5px] font-semibold tracking-[0.25em] scale-90">CAPITAL</span></div>
      <div className="flex items-center justify-center gap-1"><svg width="23" height="23" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="11" fill="#0f172a"/><path d="M12 2v10h10" fill="none" stroke="white"/></svg><span className="text-[14px] font-bold tracking-tight text-slate-900">Paige</span></div>
      <span className="text-center text-[13px] font-light tracking-[0.3em] uppercase">ALARIS</span>
      <span className="text-center text-[15px] font-bold tracking-tighter lowercase">raft</span>
      <span className="text-center text-[14px]"><span className="font-black text-slate-900">Foo</span><span className="font-semibold text-slate-400">bar</span></span>
      <div className="flex items-center justify-center gap-1 text-slate-600"><svg width="24" height="24" viewBox="0 0 24 24" stroke="currentColor" fill="none" aria-hidden="true"><path d="m12 2 10 20H2ZM7 17h10M9 13h6M12 2v20"/></svg><span className="text-[8px] font-bold tracking-widest scale-95">Alph4</span></div>
    </div>
  </div>;
}
