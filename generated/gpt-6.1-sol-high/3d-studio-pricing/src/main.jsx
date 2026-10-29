import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { ArrowUpRight, CheckCircle2 } from 'lucide-react';
import './index.css';

const features = [
  'Boundless iterations',
  'Cinema 8K mastergrade',
  'Bespoke 3D materials',
  'Dedicated render engineer 24/7',
];

function App() {
  const [cinematic, setCinematic] = useState(true);
  const briefUrl = `mailto:?subject=${encodeURIComponent('3D Studio — project brief')}&body=${encodeURIComponent(`Project brief\n\nProject name:\nDescription:\nDesired delivery date:\n\nCinematic fidelity: ${cinematic ? 'Yes (+$520)' : 'No'}\nStudio rate: $3,180 /deliver`)}`;

  return (
    <main>
      <section className="relative min-h-screen w-full overflow-hidden font-geist" aria-label="Studio pricing">
        <video
          className="absolute inset-0 h-full w-full object-cover object-right md:object-center"
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260702_102608_5fa1187d-9ac6-44fb-82ab-54376200abc0.mp4"
          autoPlay loop muted playsInline aria-hidden="true"
        />
        <div className="relative z-10 flex min-h-screen flex-col">
          <header className="px-5 pt-10 sm:px-8 sm:pt-16 md:px-16 md:pt-24 lg:px-24">
            <h1 className="text-[clamp(2.5rem,12vw,10rem)] font-light leading-[0.9] tracking-[-0.03em] text-white">
              Studio<br />rate
            </h1>
          </header>
          <div className="min-h-20 flex-1" />
          <div className="px-4 pb-8 sm:px-8 sm:pb-12 md:px-16 md:pb-20 lg:px-24">
            <div className="flex h-auto min-h-[280px] w-full flex-col rounded-2xl border border-white/10 bg-black/70 p-3 backdrop-blur-md sm:min-h-[310px] sm:p-4 md:h-[340px] md:min-h-0 md:p-5">
              <div className="grid min-h-0 flex-1 grid-cols-1 items-stretch gap-4 md:grid-cols-3 md:gap-5">
                <div className="flex min-h-[200px] flex-col justify-between rounded-xl border border-white/10 bg-[#11120F]/60 p-5 backdrop-blur-xl sm:p-6 md:min-h-0">
                  <div>
                    <h2 id="cinematic-label" className="mb-2 text-left text-base font-medium text-white sm:text-lg">Want cinematic fidelity?</h2>
                    <p id="cinematic-description" className="text-left text-sm leading-relaxed text-white/60">Activate photorealistic global illumination with sub-surface scattering and volumetric atmosphere depth.</p>
                  </div>
                  <div className="mt-6 flex items-center justify-between md:mt-0">
                    <span className="text-lg font-light text-white">+$520</span>
                    <button type="button" role="switch" aria-checked={cinematic} aria-labelledby="cinematic-label" aria-describedby="cinematic-description" onClick={() => setCinematic(!cinematic)} className={`relative h-7 w-14 shrink-0 rounded-full transition-colors duration-200 ${cinematic ? 'bg-[#B2D770]' : 'bg-white/20'}`}>
                      <span className={`absolute left-1 top-1 h-5 w-5 rounded-full bg-black transition-transform duration-200 ${cinematic ? 'translate-x-7' : 'translate-x-0'}`} />
                    </button>
                  </div>
                </div>
                <div className="flex flex-col justify-between gap-6 py-3 sm:py-4 md:py-5">
                  <div className="flex flex-wrap items-baseline"><span className="text-4xl font-light tracking-tight text-white sm:text-5xl md:text-5xl lg:text-7xl">$3,180</span><span className="ml-1 text-sm text-white/50 sm:text-base">/deliver</span></div>
                  <div className="flex items-center justify-between gap-2 text-sm"><span className="text-white/50">Rush-mode</span><span className="font-medium text-white/80">12-36 hours</span></div>
                </div>
                <div className="flex flex-col justify-between gap-6 py-3 sm:py-4 md:py-5">
                  <ul className="space-y-3">
                    {features.map(feature => <li key={feature} className="flex items-center gap-3 text-sm text-white/70"><CheckCircle2 className="h-4 w-4 shrink-0 text-[#B2D770] sm:h-5 sm:w-5" strokeWidth={1.7} aria-hidden="true" /><span>{feature}</span></li>)}
                  </ul>
                  <a href={briefUrl} className="group flex gap-[3px] rounded-lg text-sm font-medium text-black" aria-label="Start a brief by email">
                    <span className="flex-1 rounded-lg bg-[#B2D770] px-4 py-2.5 text-center transition-colors group-hover:bg-[#c4e694] sm:px-5">Start a brief</span>
                    <span className="flex w-10 shrink-0 items-center justify-center rounded-lg bg-[#B2D770] py-2.5 transition-colors group-hover:bg-[#c4e694]"><ArrowUpRight className="h-5 w-5" aria-hidden="true" /></span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

createRoot(document.getElementById('root')).render(<App />);
