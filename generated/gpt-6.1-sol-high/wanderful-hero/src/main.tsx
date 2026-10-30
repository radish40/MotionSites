import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { gsap } from 'gsap';
import { Lock } from 'lucide-react';
import './index.css';

const VIDEO_URL = 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260510_060007_60275ce7-030c-4668-a160-8f364ec537d3.mp4';

function App() {
  const videoBg = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const entrance = requestAnimationFrame(() => setMounted(true));
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let targetX = 0, targetY = 0, currentX = 0, currentY = 0;
    let animation = 0;
    const move = (event: MouseEvent) => {
      const cx = window.innerWidth / 2, cy = window.innerHeight / 2;
      targetX = ((event.clientX - cx) / cx) * 20;
      targetY = ((event.clientY - cy) / cy) * 20;
    };
    const reset = () => { targetX = 0; targetY = 0; };
    const tick = () => {
      currentX += (targetX - currentX) * 0.06;
      currentY += (targetY - currentY) * 0.06;
      gsap.set(videoBg.current, { x: currentX, y: currentY });
      animation = requestAnimationFrame(tick);
    };
    if (!reducedMotion) {
      window.addEventListener('mousemove', move);
      document.addEventListener('mouseleave', reset);
      animation = requestAnimationFrame(tick);
    }
    return () => {
      cancelAnimationFrame(entrance);
      cancelAnimationFrame(animation);
      window.removeEventListener('mousemove', move);
      document.removeEventListener('mouseleave', reset);
    };
  }, []);

  return (
    <main className="min-h-screen bg-black text-white overflow-x-hidden" style={{ fontFamily: "'Inter', sans-serif" }}>
      <div ref={videoBg} className="fixed inset-0 z-0 scale-[1.08] origin-center pointer-events-none" aria-hidden="true">
        <video className="h-full w-full object-cover" src={VIDEO_URL} autoPlay muted loop playsInline onLoadedMetadata={(event) => { event.currentTarget.playbackRate = 1.25; }} />
      </div>
      <header className="site-header fixed inset-x-0 top-0 z-50 px-10 py-8 flex justify-between items-center">
        <a href="#journey" aria-label="Wanderful home" className="wordmark text-[17px] font-semibold tracking-tight">Wanderful<sup className="text-[8px] align-super ml-0.5">TM</sup></a>
        <nav aria-label="Main navigation" className="main-nav liquid-glass rounded-full px-2 py-2 flex items-center gap-1">
          {[['JOURNEY', 'journey'], ['BENEFITS', 'benefits'], ['JOURNAL', 'journal'], ['GUIDEBOOK', 'guidebook']].map(([label, target]) => (
            <a key={target} href={`#${target}`} className="text-[11px] font-medium tracking-[0.12em] text-white/90 hover:text-white px-4 py-1.5 rounded-full transition-colors duration-200">{label}</a>
          ))}
        </nav>
        <a href="#escape" className="roaming liquid-glass rounded-full px-5 py-2.5 text-[11px] font-medium tracking-[0.12em] text-white/90 hover:text-white">GET ROAMING</a>
      </header>
      <section id="journey" aria-label="Your next journey" className={`hero-headline fixed inset-x-0 top-[120px] z-20 text-center px-5 transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
        <h1 className="font-normal text-[clamp(40px,5.4vw,72px)] leading-[1.1] tracking-[-0.02em]">
          <span className="block">Venture without edges.</span>
          <span id="journal" className="block text-white/55">Uncover with keen instinct.</span>
        </h1>
      </section>
      <section aria-label="Plan your escape" className={`bottom-block fixed inset-x-0 bottom-14 z-20 flex flex-col items-center gap-6 px-6 text-center transition-all duration-1000 delay-300 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
        <p id="benefits" className="max-w-[620px] text-[15px] leading-relaxed">Our smart itineraries shape around you — your rhythm, your vibe, your hunger for adventure.<span className="text-white/55"> Each getaway is tailored, seamless, and wholly yours.</span></p>
        <button id="escape" type="button" className="escape-button bg-white text-black text-[15px] font-medium rounded-full px-8 py-3.5 transition-all duration-200 hover:scale-[1.03] hover:shadow-[0_0_32px_4px_rgba(255,255,255,0.2)] active:scale-[0.97]">Plan my escape today</button>
        <p id="guidebook" className="security flex items-center justify-center gap-2 text-[11px] font-medium tracking-[0.14em] text-white/70"><Lock size={13} strokeWidth={1.5} aria-hidden="true" />SECURE BY DESIGN. ZERO DATA LEAKS.</p>
      </section>
    </main>
  );
}

createRoot(document.getElementById('root')!).render(<React.StrictMode><App /></React.StrictMode>);
