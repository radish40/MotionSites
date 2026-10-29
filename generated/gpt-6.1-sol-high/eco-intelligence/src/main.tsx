import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { ArrowRight, Menu, X } from 'lucide-react';
import './index.css';

const waveform = 'M0 30 C10 30 12 45 18 45 C24 45 26 10 34 10 C42 10 44 40 52 40 C60 40 62 5 70 5 C78 5 80 42 88 42 C96 42 98 15 106 15 C114 15 116 38 124 38 C132 38 134 20 142 20 C150 20 152 35 160 35 C168 35 170 22 178 22 C186 22 188 32 196 32 C204 32 210 28 220 28';
const links = [ ['About', '#about'], ['Research', '#findings'], ['Projects', '#canopy'], ['Journal', '#watershed'], ['Contact', 'mailto:hello@terranova.earth'] ];

function BorderLine({ side }: { side: string }) {
  return <div aria-hidden="true" className={`absolute ${side} top-0 bottom-0 hidden md:flex flex-col items-center text-xs text-black/40`}><div className="w-px h-[15%] bg-black/20"/><span className="py-2">+</span><div className="w-px flex-1 bg-black/20"/><span className="py-2">+</span><div className="w-px h-[15%] bg-black/20"/></div>;
}

function App() {
  const [open, setOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const focusTimer = window.setTimeout(() => panel.current?.querySelector('button')?.focus(), 50);
    const keyboard = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
      if (event.key === 'Tab') {
        const items = panel.current?.querySelectorAll<HTMLElement>('button, a');
        if (!items?.length) return;
        const first = items[0], last = items[items.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener('keydown', keyboard);
    return () => { clearTimeout(focusTimer); document.body.style.overflow = previous; document.removeEventListener('keydown', keyboard); menuButton.current?.focus(); };
  }, [open]);
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) video.current?.pause();
  }, []);

  return <>
    <div className="hero relative isolate flex flex-col overflow-hidden bg-[#f5f4f0]">
      <video ref={video} className="absolute inset-0 h-full w-full object-cover" autoPlay muted loop playsInline preload="auto" aria-hidden="true"><source src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260622_204426_c2ec12c0-3159-4601-8f8f-484c9a687833.mp4" type="video/mp4" /><source src={`${import.meta.env.BASE_URL}assets/terra-nova.mp4`} type="video/mp4" /></video>
      <header className="relative z-10 flex items-center justify-between px-5 py-5 text-black sm:px-6 md:px-12 md:py-6">
        <button ref={menuButton} onClick={() => setOpen(true)} aria-expanded={open} aria-controls="navigation-panel" className="flex items-center gap-3 text-sm tracking-wide transition-opacity duration-300 hover:opacity-60"><Menu size={20} strokeWidth={1.5}/><span className="hidden sm:inline">Menu</span><span className="sr-only sm:hidden">Open menu</span></button>
        <a href="mailto:hello@terranova.earth?subject=Book%20a%20call" className="flex items-center gap-3 text-sm tracking-wide transition-opacity duration-300 hover:opacity-60"><span className="h-2 w-2 rounded-full bg-black"/>Book a call</a>
      </header>
      <main className="hero-content relative z-10 mx-5 flex flex-1 flex-col sm:mx-6 md:mx-12">
        <BorderLine side="left-0"/><BorderLine side="right-0"/>
        <div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-1/2 hidden h-[330px] w-[220px] -translate-x-1/2 -translate-y-1/2 grid-cols-2 grid-rows-3 md:grid"><div className="glass-square col-start-1 row-start-1 border border-white/40 bg-white/10"/><div className="glass-square col-start-1 row-start-2 border border-white/40 bg-white/10"/><div className="glass-square col-start-2 row-start-3 border border-white/40 bg-white/10"/></div>
        <div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-[2%] w-screen -translate-x-1/2 select-none overflow-hidden text-center"><div className="ghost-title whitespace-nowrap font-['Bebas_Neue'] text-[18vw] leading-[0.85] tracking-tighter sm:text-[22vw] md:text-[30vw]">TERRA NOVA</div></div>
        <div className="relative mt-auto flex flex-col items-start justify-between gap-6 px-2 pb-6 pt-40 sm:gap-6 sm:px-4 sm:pb-8 md:flex-row md:items-end md:gap-12 md:px-8 md:pb-12">
          <section id="about" className="max-w-sm text-white sm:text-black">
            <h1 className="text-xl font-light leading-tight tracking-tight sm:text-2xl md:text-3xl lg:text-4xl">Signals from<br/>the Deep Green</h1>
            <p className="mt-3 max-w-[280px] text-xs text-white/70 sm:text-sm sm:text-black/60 md:mt-4">An open research collective mapping, decoding, and archiving the silent vibrations that bind our planet's ecological networks.</p>
            <a href="#findings" className="relative mt-6 flex h-[44px] w-[220px] items-center justify-between px-5 text-xs tracking-wide text-black transition-opacity duration-300 hover:opacity-70 sm:h-[48px] sm:w-[260px] sm:px-6 sm:text-sm md:mt-8">
              <span aria-hidden="true" className="chamfer absolute inset-0 border border-black/20 bg-white/60 backdrop-blur-md sm:border-transparent sm:bg-transparent sm:backdrop-blur-none"/>
              <svg aria-hidden="true" className="pointer-events-none absolute inset-0 hidden h-full w-full sm:block" viewBox="0 0 260 48"><polygon points="14,0.75 259.25,0.75 259.25,34 246,47.25 0.75,47.25 0.75,14" stroke="currentColor" strokeWidth="1.5" fill="transparent" vectorEffect="non-scaling-stroke"/></svg>
              <svg aria-hidden="true" className="pointer-events-none absolute inset-0 h-full w-full sm:hidden" viewBox="0 0 220 44"><polygon points="14,0.75 219.25,0.75 219.25,30 206,43.25 0.75,43.25 0.75,14" stroke="currentColor" strokeWidth="1.5" fill="transparent"/></svg><span className="relative">Start listening</span><ArrowRight className="relative" size={16}/>
            </a>
          </section>
          <section id="findings" aria-labelledby="findings-title" tabIndex={-1} className="findings w-full max-w-xs rounded-sm border border-white/80 bg-white/60 p-5 text-black backdrop-blur-md sm:p-6 md:max-w-[320px] md:p-8">
            <div className="flex items-center justify-between border-b border-black/10 pb-3 md:pb-4"><h2 id="findings-title" className="text-base font-medium tracking-tight sm:text-lg md:text-xl">Latest findings</h2><span className="text-xs text-black/40">//02</span></div>
            <div className="mt-4 space-y-4 md:mt-5 md:space-y-5">
              <article id="canopy"><h3 className="text-sm font-semibold tracking-tight md:text-base">Canopy Pulse Analysis 09.17</h3><p className="mt-1 text-xs leading-relaxed text-black/50 md:mt-1.5 md:text-sm">Identified harmonic oscillation links between root mycelia networks and surrounding atmospheric moisture.</p></article>
              <article id="watershed"><h3 className="text-sm font-semibold tracking-tight md:text-base">Watershed Harmonic Index 11.06</h3><p className="mt-1 text-xs leading-relaxed text-black/50 md:mt-1.5 md:text-sm">Forecasting framework for ecosystem regeneration spanning six continents using over 2,400 sensor arrays.</p></article>
            </div>
            <svg aria-hidden="true" viewBox="0 0 220 50" className="mx-auto mt-5 w-full md:mt-6"><path d={waveform} stroke="black" strokeWidth="1.8" fill="none" strokeLinecap="round"/></svg>
          </section>
        </div>
      </main>
    </div>
    <div aria-hidden="true" onClick={() => setOpen(false)} className={`fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity duration-500 ${open ? 'opacity-100' : 'pointer-events-none opacity-0'}`}/>
    <aside id="navigation-panel" ref={panel} role="dialog" aria-modal={open ? true : undefined} aria-label="Main navigation" aria-hidden={!open} {...(!open ? { inert: '' } : {})} className={`fixed inset-y-0 left-0 z-50 w-full bg-[#f5f4f0] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] sm:w-[380px] ${open ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className="flex h-full flex-col overflow-y-auto px-8 py-6 sm:px-10">
        <button onClick={() => setOpen(false)} className="mb-12 flex w-fit items-center gap-3 text-sm transition-opacity duration-300 hover:opacity-60"><X size={20} strokeWidth={1.5}/>Close</button>
        <nav>{links.map(([label, href], index) => <a key={label} href={href} onClick={() => setOpen(false)} style={{ transitionDelay: open ? `${150 + index * 75}ms` : '0ms' }} className={`group flex items-center justify-between border-b border-black/10 py-4 transition-[opacity,transform] duration-500 ${open ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}><span className="text-2xl font-light tracking-tight transition-transform duration-300 group-hover:translate-x-2 sm:text-3xl">{label}</span><ArrowRight size={16} className="-translate-x-2 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100"/></a>)}</nav>
        <div style={{ transitionDelay: open ? '600ms' : '0ms' }} className={`mt-auto pb-8 pt-10 transition-[opacity,transform] duration-500 ${open ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}><div className="border-t border-black/10 pt-6"><p className="mb-3 text-xs uppercase tracking-wide text-black/40">Get in touch</p><a href="mailto:hello@terranova.earth" className="text-sm text-black/70 hover:text-black">hello@terranova.earth</a></div></div>
      </div>
    </aside>
  </>;
}
createRoot(document.getElementById('root')!).render(<React.StrictMode><App/></React.StrictMode>);
