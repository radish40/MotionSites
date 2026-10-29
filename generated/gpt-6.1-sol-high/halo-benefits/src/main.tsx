import React, { useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { ArrowRight } from 'lucide-react';
import './index.css';

function InfoSection() {
  const benefits = useRef<HTMLDivElement>(null);
  function discover() {
    benefits.current?.scrollIntoView({
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',
      block: 'start',
    });
    benefits.current?.focus({ preventScroll: true });
  }

  return (
    <section aria-labelledby="info-heading" className="bg-[#F5F5F5] px-6 py-24">
      <div className="max-w-[88rem] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16 items-start">
          <div>
            <h2 id="info-heading" className="text-black text-4xl md:text-5xl font-medium leading-tight mb-8" style={{ letterSpacing: '-0.03em' }}>
              Meet USD Halo.
            </h2>
            <button type="button" onClick={discover} aria-controls="benefits" className="inline-flex items-center gap-3 bg-black text-white text-base font-medium pl-8 pr-2 py-2 rounded-full hover:bg-gray-800 transition-colors duration-200">
              Discover it
              <span className="bg-white rounded-full p-2 flex items-center justify-center">
                <ArrowRight aria-hidden="true" className="w-5 h-5 text-black" />
              </span>
            </button>
          </div>
          <div className="flex items-center">
            <p className="text-black/70 text-2xl md:text-3xl font-normal leading-relaxed">
              USD Halo is a reward-earning dollar coin that lets your savings grow while remaining tied to the U.S. dollar.
            </p>
          </div>
        </div>

        <div ref={benefits} id="benefits" tabIndex={-1} aria-label="USD Halo benefits" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 outline-none">
          <div className="lg:col-span-2 rounded-2xl overflow-hidden relative min-h-80" style={{
            backgroundImage: `url('${import.meta.env.BASE_URL}assets/savings-bloom.webp')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}>
            <div className="relative z-10 flex flex-col justify-between h-full p-7 min-h-80">
              <p className="text-black text-2xl font-medium leading-snug" style={{ letterSpacing: '-0.02em' }}>Savings that bloom</p>
              <p className="text-black/70 text-base font-normal leading-relaxed max-w-xs">
                Gain steady returns as your dollar tokens are routed into top-performing DeFi strategies.
              </p>
            </div>
          </div>
          <div className="rounded-2xl p-7 flex flex-col justify-between min-h-80" style={{ backgroundColor: '#2B2644' }}>
            <p className="text-white text-2xl font-medium leading-snug" style={{ letterSpacing: '-0.02em' }}>Always fluid,<br />always pegged.</p>
            <p className="text-white/60 text-base font-normal leading-relaxed">
              Keep fully dollar-anchored with on-demand access to funds -- no lockups or waits.
            </p>
          </div>
          <div className="rounded-2xl p-7 flex flex-col justify-between min-h-80" style={{ backgroundColor: '#2B2644' }}>
            <p className="text-white text-2xl font-medium leading-snug" style={{ letterSpacing: '-0.02em' }}>Fully<br />automated</p>
            <p className="text-white/60 text-base font-normal leading-relaxed">
              Skip the task of tuning positions yourself. USD Halo runs in the background for you.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

const BACKER_BRANDS: { name: string; style: React.CSSProperties }[] = [
  { name: 'Fundamental Labs', style: { fontFamily: "'Times New Roman', serif", fontWeight: 400, letterSpacing: '0.02em', fontSize: '14px' } },
  { name: 'KUCOIN', style: { fontFamily: "'Arial Black', sans-serif", fontWeight: 900, letterSpacing: '0.08em', fontSize: '16px' } },
  { name: 'NGC', style: { fontFamily: "'Impact', sans-serif", fontWeight: 700, letterSpacing: '0.05em', fontSize: '18px' } },
  { name: 'NxGen', style: { fontFamily: "'Georgia', serif", fontWeight: 600, letterSpacing: '-0.02em', fontSize: '17px' } },
  { name: 'Matter Labs', style: { fontFamily: "'Helvetica', sans-serif", fontWeight: 700, letterSpacing: '-0.01em', fontSize: '15px' } },
  { name: 'DEXTools', style: { fontFamily: "'Verdana', sans-serif", fontWeight: 700, letterSpacing: '0.06em', fontSize: '14px', textTransform: 'uppercase' } },
  { name: 'NGRAVE', style: { fontFamily: "'Courier New', monospace", fontWeight: 700, letterSpacing: '0.18em', fontSize: '14px' } },
  { name: 'Polychain', style: { fontFamily: "'Palatino', serif", fontWeight: 500, letterSpacing: '0.03em', fontSize: '15px' } },
];

function BackedBySection() {
  return (
    <section aria-label="Our backers" className="bg-[#F5F5F5] px-6">
      <div className="max-w-[88rem] mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 items-center">
        <div className="md:col-span-1">
          <p className="text-black/70 text-base leading-relaxed">Funded by premier partners<br />and forward-thinking leaders.</p>
        </div>
        <div className="md:col-span-3 overflow-hidden">
          <style>{`
            @keyframes backers-marquee {
              0% { transform: translateX(0); }
              100% { transform: translateX(-50%); }
            }
            .backers-track {
              display: flex;
              width: max-content;
              animation: backers-marquee 30s linear infinite;
            }
          `}</style>
          <div className="backers-track">
            {[...BACKER_BRANDS, ...BACKER_BRANDS].map((brand, i) => (
              <span key={i} aria-hidden={i >= BACKER_BRANDS.length ? true : undefined} className="mx-10 shrink-0 text-black/50 whitespace-nowrap" style={brand.style}>{brand.name}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

createRoot(document.getElementById('root')!).render(
  <React.StrictMode><main><InfoSection /><BackedBySection /></main></React.StrictMode>,
);
