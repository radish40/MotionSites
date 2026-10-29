import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { ArrowRight, Play } from 'lucide-react';
import './index.css';

const links = ['Projects', 'Expertise', 'Studio', 'Insights'];
const destination = (label) => `#${label.toLowerCase().replaceAll(' ', '-')}`;
const pill = 'rounded-full bg-white text-black text-sm font-medium transition-colors duration-200 hover:bg-white/90';

function MenuIcon({ open }) {
  return <span className="relative block h-6 w-6" aria-hidden="true">
    <span className={`menu-ease absolute left-0 top-[4px] h-0.5 w-6 rounded-full bg-white transition-all duration-500 ${open ? 'translate-y-[7px] rotate-45' : ''}`} />
    <span className={`menu-ease absolute left-0 top-[11px] h-0.5 w-4 rounded-full bg-white transition-all duration-500 ${open ? 'opacity-0' : ''}`} />
    <span className={`menu-ease absolute left-0 top-[18px] h-0.5 w-6 rounded-full bg-white transition-all duration-500 ${open ? '-translate-y-[7px] -rotate-45' : ''}`} />
  </span>;
}

function App() {
  const [open, setOpen] = useState(false);
  const trigger = useRef(null);
  const menu = useRef(null);
  const video = useRef(null);
  const close = () => { setOpen(false); trigger.current?.focus(); };

  useEffect(() => {
    if (!open) return;
    const prior = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    menu.current?.querySelector('button')?.focus({ preventScroll: true });
    const keyboard = (event) => {
      if (event.key === 'Escape') close();
      if (event.key === 'Tab') {
        const items = [...menu.current.querySelectorAll('a, button')];
        const first = items[0], last = items[items.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }
    };
    const resize = () => { if (window.innerWidth >= 768) setOpen(false); };
    document.addEventListener('keydown', keyboard);
    window.addEventListener('resize', resize);
    return () => {
      document.body.style.overflow = prior;
      document.removeEventListener('keydown', keyboard);
      window.removeEventListener('resize', resize);
    };
  }, [open]);

  const watchReel = async () => {
    const element = video.current;
    element.controls = true;
    try {
      if (element.requestFullscreen) await element.requestFullscreen();
      else if (element.webkitEnterFullscreen) element.webkitEnterFullscreen();
      await element.play();
    } catch { element.controls = true; }
  };
  useEffect(() => {
    const onFullscreen = () => { if (!document.fullscreenElement) video.current.controls = false; };
    document.addEventListener('fullscreenchange', onFullscreen);
    return () => document.removeEventListener('fullscreenchange', onFullscreen);
  }, []);

  return <main className="hero relative w-full overflow-hidden font-sans">
    <video ref={video} className="absolute inset-0 h-full w-full object-cover" autoPlay loop muted playsInline preload="auto" aria-label="Atelier design reel" src={`${import.meta.env.BASE_URL}assets/atelier-hero.mp4`} />
    <div className="relative z-10 flex h-full flex-col">
      <header className="flex items-center justify-between px-6 py-5 md:px-12 md:py-6 lg:px-16">
        <div className="flex items-center gap-12">
          <a href="#" aria-label="Atelier home" className="font-sans text-lg font-semibold tracking-tight text-white">Atelier</a>
          <nav aria-label="Main navigation" className="hidden items-center gap-7 md:flex">
            {links.map(label => <a key={label} href={destination(label)} className="text-sm font-light text-white/80 transition-colors duration-200 hover:text-white">{label}</a>)}
          </nav>
        </div>
        <div className="flex items-center gap-7">
          <a href="#reach-out" className="hidden text-sm font-light text-white/80 transition-colors duration-200 hover:text-white md:block">Reach Out</a>
          <a href="#reach-out" className={`${pill} hidden px-5 py-2 md:block`}>Let's Talk</a>
          <button ref={trigger} type="button" className="-m-2 p-2 md:hidden" onClick={() => setOpen(true)} aria-label="Open menu" aria-expanded={open} aria-controls="mobile-menu"><MenuIcon open={open} /></button>
        </div>
      </header>
      <section aria-label="Introduction" className="flex flex-1 flex-col items-center justify-start px-6 pt-4 text-center sm:pt-6 md:pt-8 lg:pt-10">
        <h1 className="max-w-5xl font-instrument-serif text-3xl leading-[1.1] text-white sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl">
          UX <span className="font-instrument-serif italic">and</span> APP<br />
          DESIGN <span className="font-instrument-serif italic">for</span> BOLD<br />
          VENTURES
        </h1>
        <p className="mt-4 max-w-md text-sm font-light leading-relaxed text-white/70 md:mt-5 md:text-base">
          We shape digital products that define brands<br className="hidden sm:block" /> and unlock exponential growth.
        </p>
        <div className="mt-5 flex flex-col items-center gap-4 sm:flex-row md:mt-6">
          <a href="#projects" className={`${pill} group inline-flex items-center gap-3 px-7 py-3`}>See Cases<ArrowRight size={16} className="transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden="true" /></a>
          <button onClick={watchReel} className="inline-flex items-center gap-3 rounded-full border border-white/40 px-7 py-3 text-sm font-medium text-white transition-colors duration-200 hover:border-white/60 hover:bg-white/10"><Play size={15} aria-hidden="true" />Watch Reel</button>
        </div>
      </section>
    </div>
    <div ref={menu} id="mobile-menu" role="dialog" aria-label="Navigation menu" aria-modal={open ? true : undefined} aria-hidden={!open} inert={!open ? true : undefined} className={`menu-ease fixed inset-0 z-50 flex flex-col bg-black/90 backdrop-blur-xl transition-opacity duration-700 md:hidden ${open ? 'opacity-100' : 'pointer-events-none opacity-0'}`}>
      <div className="flex items-center justify-between px-6 py-5">
        <a href="#" onClick={close} className="font-sans text-lg font-semibold tracking-tight text-white">Atelier</a>
        <button onClick={close} className="-m-2 p-2" aria-label="Close menu"><MenuIcon open={open} /></button>
      </div>
      <nav aria-label="Mobile navigation" className="flex flex-1 flex-col justify-center px-6">
        {[...links, 'Reach Out'].map((label, index) => <a key={label} href={destination(label)} onClick={close} style={{ transitionDelay: open ? `${150 + index * 80}ms` : '0ms' }} className={`menu-ease border-b border-white/10 py-4 text-center font-instrument-serif text-4xl text-white transition-all duration-700 hover:pl-4 sm:text-5xl ${open ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>{label}</a>)}
      </nav>
      <div style={{ transitionDelay: open ? '550ms' : '0ms' }} className={`menu-ease px-6 pb-8 pt-6 transition-opacity duration-700 ${open ? 'opacity-100' : 'opacity-0'}`}>
        <a href="#reach-out" onClick={close} className={`${pill} block w-full py-4 text-center`}>Let's Talk</a>
      </div>
    </div>
  </main>;
}

createRoot(document.getElementById('root')).render(<App />);
