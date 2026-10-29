import { useRef } from 'react';
import { X, ArrowUpRight } from 'lucide-react';
import Reveal from './Reveal';
export default function SectionTwo() {
  const details = useRef<HTMLDialogElement>(null);
  return <section id="precision" aria-labelledby="precision-title" className="flex min-h-svh scroll-mt-0 flex-col justify-between px-5 pb-9 pt-28 sm:px-8 sm:pb-12 md:px-12 md:pb-14">
    <div className="w-full max-w-sm self-end">
      <Reveal delay={100}><h2 id="precision-title" className="text-3xl font-semibold leading-[1.1] tracking-tight sm:text-4xl md:text-5xl">Precision<br />built into<br />every line.</h2></Reveal>
      <Reveal delay={250} className="mt-8"><div className="grid grid-cols-[auto_1fr] items-start gap-6 border-t border-white/30 pt-5">
        <div><div className="text-3xl font-bold leading-none tracking-tight sm:text-4xl">99.7<span className="text-xl">%</span></div><div className="mt-2 text-[10px] uppercase tracking-wider text-white/50 lg:text-xs">Fleet Ready</div></div>
        <p className="text-xs leading-relaxed text-white/70 sm:text-sm">Proven in 14,000+ sorties with unmatched operational readiness and zero downtime.</p>
      </div></Reveal>
    </div>
    <div className="mt-auto grid items-end gap-10 pt-16 sm:grid-cols-[0.9fr_1.1fr] sm:gap-6 sm:pt-20">
      <Reveal delay={400}><div className="flex gap-7 sm:gap-4 lg:gap-12">
        <Stat value="240" unit="km" label="Reach" />
        <Stat value="85" unit="kg" label="Capacity" />
        <Stat value="42" unit="km/h" label="Glide Speed" />
      </div></Reveal>
      <Reveal delay={550} className="w-full sm:ml-auto sm:w-auto">
        <div className="grid grid-cols-2 items-center gap-3 sm:flex sm:gap-2 lg:gap-7">
          <div className="rounded-lg border border-white/30 px-4 py-4 sm:px-3 lg:px-4"><Stat value="160" unit="km" label="Reach" small /></div>
          <div className="px-4 py-2 sm:px-0"><Stat value="5.8" unit="hrs" label="Endurance" small /></div>
          <div className="px-4 py-2 sm:px-0"><Stat value="52" unit="km/h" label="Max Pace" small /></div>
          <div className="px-4 py-2 sm:px-0"><Stat value="18" unit="kg" label="Carry" small /></div>
        </div>
        <div className="mt-7 flex gap-3 sm:justify-end">
          <a className="pill flex-1 border border-white/60 text-center text-xs hover:border-white hover:bg-white/10 sm:flex-none sm:text-sm" href="mailto:?subject=AETHER_X%20%E2%80%94%20Schedule%20a%20Call">Schedule a Call</a>
          <button className="pill flex-1 bg-white text-xs text-black hover:scale-105 hover:bg-white/90 sm:flex-none sm:text-sm" onClick={() => details.current?.showModal()}>Full Details <ArrowUpRight size={15} aria-hidden="true" /></button>
        </div>
      </Reveal>
    </div>
    <dialog ref={details} className="spec-dialog rounded-xl border border-white/30 bg-[#111] p-7 text-white sm:p-10" onClick={event => { if (event.target === details.current) details.current.close(); }}>
      <div className="flex items-start justify-between gap-8"><div><p className="text-xs uppercase tracking-[.2em] text-white/50">AETHER_X / Specifications</p><h2 className="mt-4 text-3xl font-medium">Precision in detail.</h2></div><button autoFocus aria-label="Close details" onClick={() => details.current?.close()} className="rounded-full p-2 hover:bg-white/10"><X size={20} /></button></div>
      <dl className="mt-8 grid grid-cols-2 gap-x-8">{[['Reach', '160 km'], ['Endurance', '5.8 hrs'], ['Max Pace', '52 km/h'], ['Carry', '18 kg'], ['Sensor Array', '360°'], ['Precision', '98%']].map(([label, value]) => <div key={label} className="border-t border-white/20 py-4"><dt className="text-xs uppercase tracking-wider text-white/50">{label}</dt><dd className="mt-2 text-2xl">{value}</dd></div>)}</dl>
    </dialog>
  </section>;
}
function Stat({ value, unit, label, small = false }: { value: string; unit: string; label: string; small?: boolean }) {
  return <div className="whitespace-nowrap"><div className={`${small ? 'text-xl sm:text-lg lg:text-2xl' : 'text-2xl sm:text-xl lg:text-3xl'} font-medium leading-none tabular-nums tracking-tight`}>{value}<span className="ml-1.5 text-[.55em] font-normal text-white/70">{unit}</span></div><div className="mt-3 text-[10px] uppercase tracking-wider text-white/50 lg:text-xs">{label}</div></div>;
}
