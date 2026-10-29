import Reveal from './Reveal';
export default function SectionOne() {
  return <section id="top" aria-label="AETHER_X flight technology" className="hero flex min-h-svh flex-col justify-end px-5 pb-9 pt-24 sm:px-8 sm:pb-12 md:px-12 md:pb-14">
    <div className="grid items-end gap-9 sm:grid-cols-2 sm:gap-4">
      <h1 className="text-[clamp(2.5rem,8vw,6rem)] font-medium leading-[1.05] tracking-tight drop-shadow-lg">
        <Reveal as="span" delay={100}>Relentless.</Reveal>
        <Reveal as="span" delay={250}>Sovereign.</Reveal>
        <Reveal as="span" delay={400}>Unyielding.</Reveal>
      </h1>
      <Reveal delay={550} className="sm:pb-1"><div className="flex flex-wrap gap-7 sm:justify-end sm:gap-7 md:gap-12">
        <Stat value="360" unit="°" label="Sensor Array" />
        <Stat value="12" unit="°" label="Thermal Scan" />
        <Stat value="98" unit="%" label="Precision" />
      </div></Reveal>
    </div>
  </section>;
}
function Stat({ value, unit, label }: { value: string; unit: string; label: string }) {
  return <div><div className="text-2xl font-bold leading-none tabular-nums tracking-tight sm:text-3xl md:text-4xl">{value}<span className="ml-0.5 text-[.6em] align-top leading-tight">{unit}</span></div><div className="mt-3 text-[10px] uppercase tracking-wider text-white/50 sm:text-xs">{label}</div></div>;
}
