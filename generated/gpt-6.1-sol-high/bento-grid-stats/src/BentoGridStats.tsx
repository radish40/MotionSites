import { useRef, type CSSProperties, type ReactNode } from 'react';
import { motion, useInView } from 'framer-motion';

const ease = [0.22, 1, 0.36, 1] as const;

function CardMotion({ children, delay, className, style, name }: {
  children: ReactNode; delay: number; className: string;
  style?: CSSProperties; name: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  return <motion.div ref={ref} data-card={name} className={className} style={style}
    initial={{ opacity: 0, scale: 0.95 }}
    animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
    transition={{ duration: 0.65, delay, ease }}>{children}</motion.div>;
}

function PlusBtn({ dark = false }: { dark?: boolean }) {
  return <span aria-hidden="true" className={`inline-flex h-7 w-7 shrink-0 items-center justify-center border text-xs font-light ${dark ? 'border-black/20 text-black' : 'border-white/30 text-white'}`}>+</span>;
}

function DotChart() {
  return <div className="mt-auto pt-8">
    <div className="dot-chart flex gap-[2px]" role="img" aria-label="Income growth from 2016 to 2026">
      {Array.from({ length: 26 }, (_, c) => {
        const base = Math.floor(c * 0.55);
        const active = [base, ...(c % 2 ? [base + 1] : []), ...(c > 4 ? [base - 1] : [])].filter(r => r >= 0);
        return <div key={c} className="flex flex-col-reverse gap-[2px]">
          {Array.from({ length: 15 }, (_, r) => <span key={r} className={`dot h-[5px] w-[5px] sm:h-[7px] sm:w-[7px] ${active.includes(r) ? 'bg-black' : ''}`} />)}
        </div>;
      })}
    </div>
    <div className="mt-3 flex justify-between pr-2 text-[10px] tracking-wide text-[#aaa]">
      {['2016', '2018', '2022', '2024', '2026'].map(year => <span key={year}>{year}</span>)}
    </div>
  </div>;
}

function SpeedDiagram() {
  return <svg viewBox="0 0 200 180" className="h-auto w-full max-w-[240px]" role="img" aria-label="Connected tools accelerating delivery">
    {[75, 50, 25].map((r, i) => <circle key={r} cx="110" cy="80" r={r} fill="none" stroke="#222" strokeWidth="0.8" opacity={0.2 + i * 0.1} />)}
    <rect x="68" y="42" width="16" height="16" fill="black" />
    <text x="76" y="54" textAnchor="middle" fill="white" fontSize="11" fontWeight="300">+</text>
    <rect x="102" y="36" width="20" height="20" fill="black" />
    <text x="112" y="51" textAnchor="middle" fill="white" fontSize="13">⚡</text>
    <rect x="82" y="128" width="14" height="14" fill="black" />
    <text x="89" y="139" textAnchor="middle" fill="white" fontSize="11" fontWeight="300">−</text>
    <rect x="138" y="128" width="14" height="14" fill="black" />
    <rect x="142" y="132" width="6" height="6" fill="white" />
  </svg>;
}

const squares = [[55, 2, 30], [80, 0, 24], [70, 28, 16], [92, 18, 14], [58, 22, 10], [88, 36, 10], [46, 14, 8]];

function Cards({ desktop = false }: { desktop?: boolean }) {
  const place = (column: string, row: string): CSSProperties | undefined => desktop ? { gridColumn: column, gridRow: row } : undefined;
  return <>
    <CardMotion name="header" delay={0} style={place('1 / 3', '1 / 5')} className="flex h-full flex-col justify-end pb-4 pr-4">
      <span className="mb-4 inline-block text-sm tracking-[0.15em] text-white/70">why us?</span>
      <h1 className="text-[clamp(1.6rem,2.6vw,2.4rem)] font-light leading-[1.2] tracking-tight">
        <span className="text-white">Seamless</span><br />
        <span className="text-[#666]">Brand, Identity,</span><br />
        <span className="text-[#666]">and Web</span>
      </h1>
    </CardMotion>
    <CardMotion name="income" delay={0.08} style={place('1 / 3', '5 / 11')} className="flex h-full flex-col bg-white p-7">
      <div className="flex items-start justify-between gap-3">
        <div><p className="text-[clamp(1.8rem,3.5vw,2.8rem)] font-light leading-none tracking-tight text-black">32M +</p>
          <p className="mt-2 text-[13px] leading-snug text-[#777]">Income produced for our customers.</p></div>
        <PlusBtn dark />
      </div>
      <DotChart />
    </CardMotion>
    <CardMotion name="speed" delay={0.12} style={place('3 / 5', '1 / 6')} className="flex h-full flex-col bg-white p-7">
      <div className="flex flex-1 items-start justify-center pt-2"><SpeedDiagram /></div>
      <div className="mt-2"><p className="text-center text-[clamp(2rem,3.5vw,3rem)] font-light tracking-tight text-black">5x</p>
        <p className="mt-1 text-center text-[13px] text-[#777]">Quicker than competing firms.</p></div>
    </CardMotion>
    <CardMotion name="text" delay={0.18} style={place('5 / 7', '1 / 5')} className="flex h-full flex-col bg-[#1a1a1a] p-7">
      <div className="flex justify-end"><PlusBtn /></div>
      <div className="mt-auto space-y-5 pb-1">
        <p className="text-[13px] leading-[1.7] text-white/60">We partner with ambitious brands to craft unified digital identities that merge strategy, design, and code into one seamless experience.</p>
        <p className="text-[13px] leading-[1.7] text-white/60">We accelerate the journey from concept to launch, eliminating the friction of scattered teams and misaligned visions.</p>
      </div>
    </CardMotion>
    <CardMotion name="projects" delay={0.22} style={place('5 / 7', '5 / 11')} className="relative flex h-full flex-col bg-white p-7">
      <div className="relative h-24 w-full" aria-hidden="true">{squares.map(([left, top, size], i) =>
        <span key={i} className="absolute bg-black" style={{ left: `${left}%`, top: `${top}%`, width: size, height: size }} />)}</div>
      <p className="mt-4 text-[clamp(1.8rem,3.5vw,2.8rem)] font-light leading-none tracking-tight text-black">200 +</p>
      <p className="mt-3 max-w-[210px] text-[13px] leading-[1.7] text-[#777]">Delivering projects globally, assisting our clients in reaching their objectives.</p>
    </CardMotion>
    <CardMotion name="photo" delay={0.28} style={place('3 / 5', '6 / 11')} className="relative h-full overflow-hidden bg-black">
      <img src={`${import.meta.env.BASE_URL}assets/team.jpeg`} alt="Creative team collaborating around a table" className="absolute inset-0 h-full w-full object-cover opacity-55" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />
      <div className="relative flex h-full min-h-[380px] flex-col justify-between p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-[3px]" aria-label="N">
            <span className="text-[1.6rem] font-bold leading-none text-white">N</span>
            <span className="h-[10px] w-[10px] bg-white" />
            <span className="flex flex-col gap-[3px]"><span className="h-[7px] w-[7px] bg-white" /><span className="h-[7px] w-[7px] bg-white opacity-50" /></span>
          </div>
          <div><p className="text-base font-light leading-none text-white">4.9 / 5</p>
            <div className="mt-2 flex gap-0.5" aria-label="5 stars">{Array.from({ length: 5 }, (_, i) => <svg key={i} width="11" height="11" viewBox="0 0 12 12" fill="white" aria-hidden="true"><path d="M6 0l1.8 3.6L12 4.2 8.9 7.1l.7 4.2L6 9.3 2.4 11.3l.7-4.2L0 4.2l4.2-.6z" /></svg>)}</div>
          </div>
        </div>
        <div className="flex items-start gap-2" aria-hidden="true"><span className="h-[18px] w-[18px] bg-white/70" /><span className="h-[26px] w-[18px] bg-white/40" /></div>
        <div className="flex items-end justify-between gap-2"><div>
          <p className="text-[clamp(1.8rem,3.5vw,2.8rem)] font-light leading-none text-white">100 +</p>
          <p className="mt-2 text-[13px] text-white/60">Joyful clients and growing.</p>
        </div><span className="h-12 w-12 shrink-0 bg-white" aria-hidden="true" /></div>
      </div>
    </CardMotion>
  </>;
}

export function BentoGridStats() {
  return <section className="bg-[#0f0f0f] px-6 py-24 sm:px-10 lg:px-16 lg:py-32" style={{ fontFamily: "'DM Sans', sans-serif" }} aria-label="Why us?">
    <div className="mx-auto max-w-7xl">
      <div className="flex flex-col gap-4 md:hidden"><Cards /></div>
      <div className="desktop-grid hidden md:grid md:grid-cols-6 md:gap-4"><Cards desktop /></div>
    </div>
  </section>;
}
