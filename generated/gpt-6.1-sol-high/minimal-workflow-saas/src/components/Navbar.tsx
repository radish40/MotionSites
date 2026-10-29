export default function Navbar() {
  return (
    <nav aria-label="Main navigation" className="relative z-50 flex items-center justify-between px-6 py-5 max-w-7xl mx-auto w-full select-none">
      <a href="#" aria-label="Script home" className="flex items-center">
        <span className="font-bold text-[21px] tracking-tight text-[#0f172a]">Script</span>
        <span aria-hidden="true" className="flex flex-col gap-[2.5px] rotate-[-15deg] ml-1.5 translate-y-[1px]">
          <span className="w-3.5 h-[1.5px] bg-[#0f172a] rounded-full" />
          <span className="w-2.5 h-[1.5px] bg-[#0f172a] rounded-full translate-x-[2px]" />
          <span className="w-3 h-[1.5px] bg-[#64748b] rounded-full translate-x-[4px]" />
        </span>
      </a>
      <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center gap-8 text-[13px] font-medium text-slate-600">
        {['Resources', 'Service', 'Support', 'Developers', 'Updates'].map(label => <a key={label} href="#" className="hover:text-slate-900 transition-colors">{label}</a>)}
      </div>
      <button type="button" className="px-4.5 py-1.5 text-xs font-medium border border-slate-200 rounded-full hover:bg-white/85 bg-white/30 backdrop-blur-sm transition-all shadow-[0_1px_2px_rgba(0,0,0,0.02)] text-slate-800">Join us</button>
    </nav>
  );
}
