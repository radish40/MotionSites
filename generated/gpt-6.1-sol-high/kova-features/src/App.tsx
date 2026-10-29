import { useEffect, useRef, useState } from 'react';
import { Play, Sparkles, ShieldCheck, PieChart, TrendingUp, X, ChevronLeft, ChevronRight } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import FadeUp from './FadeUp';

const asset = (name: string) => `${import.meta.env.BASE_URL}assets/${name}`;
const features = [
  { label: 'Smart Budgeting', description: 'Let AI reshape how you plan your spending. Kova adapts to your...', image: 'budgeting.webp', icon: Sparkles, bg: 'bg-[#08150C]' },
  { label: 'Bank-Grade Security', description: 'Keep your money safe with end-to-end encryption, live fraud alerts, and two-factor auth...', image: 'security.webp', icon: ShieldCheck, bg: 'bg-stone-700' },
  { label: 'Spend Insights', description: 'Monthly Spend · 1 Apr – 30 May 2026', image: '', icon: PieChart, bg: '' },
  { label: 'Wealth Building', description: 'Grow your net worth with tools that help you set targets, monitor gains, and act...', image: 'wealth.webp', icon: TrendingUp, bg: 'bg-stone-700' },
];

function ImageCard({ label, description, image, icon: Icon, bg }: { label: string; description: string; image: string; icon: LucideIcon; bg: string }) {
  return <div className={`relative rounded-2xl overflow-hidden ${bg} aspect-[3/4] flex flex-col justify-between`}>
    <img src={asset(image)} alt={label} className="absolute inset-0 w-full h-full object-cover" />
    <div className="absolute inset-0 bg-gradient-to-t from-[#08150C]/80 via-[#08150C]/20 to-transparent" />
    <div className="relative z-10 p-4">
      <div className="inline-flex items-center gap-1.5 text-white text-sm font-medium px-2.5 py-1 rounded-full">
        <Icon size={16} className="text-white" />{label}
      </div>
    </div>
    <div className="relative z-10 p-4">
      <p className="text-white/80 text-sm sm:text-base leading-relaxed">{description}</p>
    </div>
  </div>;
}

function InsightsCard() {
  return <div className="relative rounded-2xl overflow-hidden aspect-[3/4] flex flex-col p-5" style={{ backgroundColor: '#EBE4DC' }}>
    <div className="inline-flex items-center gap-1.5 text-stone-700 text-sm font-medium px-2.5 py-1 rounded-full self-start mb-4">
      <PieChart size={16} />Spend Insights
    </div>
    <div className="flex flex-col items-center justify-center flex-1 gap-3 rounded-2xl p-4" style={{ backgroundColor: '#F4F1EC' }}>
      <div className="text-center mb-1">
        <p className="text-sm sm:text-base font-semibold text-stone-800">Monthly Spend</p>
        <p className="text-xs sm:text-sm text-stone-500">1 Apr – 30 May 2026</p>
      </div>
      <div className="relative w-28 h-28 sm:w-36 sm:h-36" role="img" aria-label="Monthly spending: 50% of budget. Category shares: 30%, 25%, 20%, and 25%.">
        <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90" aria-hidden="true">
          <circle cx="18" cy="18" r="14" fill="none" stroke="#F4F1EC" strokeWidth="5" />
          <circle cx="18" cy="18" r="14" fill="none" stroke="#C46B2D" strokeWidth="5" strokeDasharray="26.4 61.56" strokeDashoffset="0" />
          <circle cx="18" cy="18" r="14" fill="none" stroke="#7A8C3E" strokeWidth="5" strokeDasharray="22 65.96" strokeDashoffset="-26.4" />
          <circle cx="18" cy="18" r="14" fill="none" stroke="#A8B87A" strokeWidth="5" strokeDasharray="17.6 70.36" strokeDashoffset="-48.4" />
          <circle cx="18" cy="18" r="14" fill="none" stroke="#B8AFA4" strokeWidth="5" strokeDasharray="22 65.96" strokeDashoffset="-66" />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center" aria-hidden="true">
          <span className="text-lg sm:text-xl font-bold text-[#08150C]">50%</span>
          <span className="text-xs sm:text-sm text-stone-500">of budget</span>
        </div>
      </div>
    </div>
  </div>;
}

function Demo({ dialog }: { dialog: React.RefObject<HTMLDialogElement> }) {
  const [step, setStep] = useState(0);
  const feature = features[step];
  useEffect(() => {
    const element = dialog.current;
    const reset = () => setStep(0);
    element?.addEventListener('close', reset);
    return () => element?.removeEventListener('close', reset);
  }, [dialog]);
  return <dialog ref={dialog} className="demo-dialog" aria-labelledby="demo-title" onClick={e => { if (e.target === e.currentTarget) dialog.current?.close(); }}>
    <div className="flex items-center justify-between p-5">
      <h2 id="demo-title" className="font-cooper-medium text-xl">Kova in action</h2>
      <button aria-label="Close demo" onClick={() => dialog.current?.close()} className="rounded-xl p-2 hover:bg-[#EBE4DC]"><X size={20} /></button>
    </div>
    <div className="px-5" aria-live="polite">{step === 2 ? <InsightsCard /> : <ImageCard {...feature} />}</div>
    <div className="flex items-center justify-between p-5">
      <button aria-label="Previous feature" disabled={step === 0} onClick={() => setStep(s => s - 1)} className="rounded-xl bg-[#08150C] p-2.5 text-white disabled:opacity-30 hover:bg-[#1a2e1f]"><ChevronLeft size={18} /></button>
      <span className="text-sm text-stone-500">{step + 1} / 4</span>
      <button aria-label="Next feature" disabled={step === 3} onClick={() => setStep(s => s + 1)} className="rounded-xl bg-[#08150C] p-2.5 text-white disabled:opacity-30 hover:bg-[#1a2e1f]"><ChevronRight size={18} /></button>
    </div>
  </dialog>;
}

export default function App() {
  const dialog = useRef<HTMLDialogElement>(null);
  return <main>
    <section className="bg-[#FDF5EB] py-14 sm:py-20 px-5 sm:px-10 lg:px-20" aria-labelledby="features-title">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 sm:mb-10">
          <FadeUp delay={0}><h2 id="features-title" className="font-cooper-medium text-2xl sm:text-3xl md:text-4xl text-[#08150C] leading-snug">Designed to sharpen every decision</h2></FadeUp>
          <FadeUp delay={0.1} className="self-start sm:self-auto flex-shrink-0">
            <button onClick={() => dialog.current?.showModal()} className="self-start sm:self-auto flex-shrink-0 flex items-center gap-2 bg-[#08150C] text-white text-sm font-medium px-5 py-2.5 rounded-xl hover:bg-[#1a2e1f] transition-colors">Watch Demo<Play size={13} className="fill-white" /></button>
          </FadeUp>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <FadeUp delay={0.05}><ImageCard {...features[0]} /></FadeUp>
          <FadeUp delay={0.15}><ImageCard {...features[1]} /></FadeUp>
          <FadeUp delay={0.25}><InsightsCard /></FadeUp>
          <FadeUp delay={0.35}><ImageCard {...features[3]} /></FadeUp>
        </div>
      </div>
    </section>
    <Demo dialog={dialog} />
  </main>;
}
