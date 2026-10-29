import React, { useCallback, useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Menu, X } from 'lucide-react';
import './index.css';

const slides = [
  { start: 'Exploration of ', emphasis: 'neural networks', end: ' for designing and rendering digital interfaces — Algorithmic frameworks for composing and refining aesthetics.', cta: 'Browse Projects—' },
  { start: 'Development of ', emphasis: 'spatial engines', end: ' for constructing and animating immersive experiences — Procedural systems for generating and evolving visual forms.', cta: 'View Case Study—' },
  { start: 'Architecture of ', emphasis: 'generative tools', end: ' for prototyping and deploying reactive layouts — Modular pipelines for scaling and iterating design output.', cta: 'Explore Process—' },
];
const sections = ['Studios', 'Labs', 'Process', 'Connect'];
const transition = 'transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]';
const menuTransition = 'transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]';

function Logo() {
  return <span className="text-white text-lg sm:text-xl font-medium tracking-tight">Nexform<span className="text-[10px] align-super ml-0.5">o</span></span>;
}

function App() {
  const [active, setActive] = useState(0);
  const [timerKey, setTimerKey] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  const menuPanel = useRef<HTMLDivElement>(null);
  const selectSlide = useCallback((index: number) => {
    setActive(index);
    setTimerKey(key => key + 1);
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => setActive(current => (current + 1) % slides.length), 5000);
    return () => window.clearInterval(timer);
  }, [timerKey]);

  const closeMenu = useCallback(() => {
    setMenuOpen(false);
    window.requestAnimationFrame(() => menuButton.current?.focus());
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    if (!menuOpen) return;
    menuPanel.current?.querySelector<HTMLButtonElement>('button')?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeMenu();
      if (event.key !== 'Tab') return;
      const items = menuPanel.current?.querySelectorAll<HTMLElement>('a, button');
      if (!items?.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    document.addEventListener('keydown', onKey);
    return () => { document.body.style.overflow = ''; document.removeEventListener('keydown', onKey); };
  }, [menuOpen, closeMenu]);

  return (
    <section className="hero relative h-screen w-full overflow-hidden bg-black font-geist" aria-label="Nexformo innovation studio">
      <video autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover" aria-hidden="true">
        <source src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260702_135039_b04d00db-6ee2-4e2a-a7f5-b2dfd3d24fd2.mp4" type="video/mp4" />
      </video>
      <div className="relative z-10 flex flex-col h-full px-5 sm:px-8 md:px-12 lg:px-16" {...(menuOpen ? { inert: '' } : {})}>
        <nav className="flex items-center justify-between pt-6 sm:pt-8" aria-label="Main navigation">
          <a href="#studios" aria-label="Nexformo home" onClick={() => selectSlide(0)}><Logo /></a>
          <div className="hidden md:flex items-center gap-12">
            <a href="#studios" onClick={() => selectSlide(0)} className="text-white text-sm font-light tracking-wide hover:opacity-70 transition-opacity duration-300">Studios—</a>
            <a href="#labs" onClick={() => selectSlide(1)} className="text-white text-sm font-light tracking-wide hover:opacity-70 transition-opacity duration-300">Labs</a>
          </div>
          <button ref={menuButton} type="button" onClick={() => setMenuOpen(true)} aria-label="Open menu" aria-expanded={menuOpen} aria-controls="studio-menu" className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-white/30 flex items-center justify-center text-white hover:border-white/60 transition-colors duration-300"><Menu size={15} /></button>
        </nav>

        <main className="flex-1 flex items-center">
          <div className="w-full flex items-start justify-center md:justify-end md:mr-16 lg:mr-24 px-1 sm:px-0">
            <div className="hidden md:flex items-start mr-6 lg:mr-10 -mt-8 shrink-0" aria-hidden="true">
              <div className="relative w-20 h-20 md:w-24 md:h-24 lg:w-28 lg:h-28">
                <div className="absolute inset-0 rounded-full bg-white/10 backdrop-blur-md" />
                <svg className="relative w-full h-full animate-spin-slow" viewBox="0 0 200 200">
                  <defs><path id="circle-text" d="M 100,100 m -70,0 a 70,70 0 1,1 140,0 a 70,70 0 1,1 -140,0" /></defs>
                  <text className="fill-white/80" fontSize="10" fontWeight="300" letterSpacing="3"><textPath href="#circle-text" textLength="435" lengthAdjust="spacing">DESIGN • MODULES • DEVELOP • DEPLOY • ITERATE •</textPath></text>
                </svg>
              </div>
            </div>
            <div className="max-w-2xl relative">
              <div aria-roledescription="carousel" aria-label="Studio capabilities">
                {slides.map((slide, index) => (
                  <article key={slide.emphasis} id={['studios', 'labs', 'process'][index]} aria-hidden={active !== index} {...(active !== index ? { inert: '' } : {})} className={`${transition} ${active === index ? 'opacity-100 translate-y-0 relative' : 'opacity-0 translate-y-4 absolute inset-0 pointer-events-none'}`}>
                    <h1 style={{ lineHeight: 1.45 }} className="text-white text-xl sm:text-2xl md:text-3xl lg:text-[2.1rem] font-light leading-[1.45] tracking-tight">{slide.start}<em className="underline underline-offset-4 decoration-white/60">{slide.emphasis}</em>{slide.end}</h1>
                    <a href={`#${sections[index].toLowerCase()}`} onClick={(event) => { event.preventDefault(); setMenuOpen(true); }} className="inline-block mt-6 sm:mt-8 text-white text-xs sm:text-sm font-light tracking-wide hover:opacity-70 transition-opacity duration-300">{slide.cta}</a>
                  </article>
                ))}
              </div>
              <div className="flex items-center gap-2 mt-8 sm:mt-10" aria-label="Select slide">
                {slides.map((slide, index) => <button type="button" key={slide.emphasis} aria-label={`Show slide ${index + 1}: ${slide.emphasis}`} aria-pressed={active === index} onClick={() => selectSlide(index)} className={`relative after:absolute after:-inset-2 w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-all duration-500 ${active === index ? 'bg-white scale-100' : 'bg-white/40 scale-90 hover:bg-white/60'}`} />)}
              </div>
            </div>
          </div>
        </main>

        <footer className="pb-5 sm:pb-8">
          <div className="flex items-center justify-between mb-3 sm:mb-4 text-white/50 text-[10px] sm:text-xs font-light"><span>2</span><span>H</span><span>W</span></div>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 sm:gap-0 border-t border-white/10 pt-4">
            <p className="text-white/40 text-[9px] sm:text-[10px] md:text-xs font-light leading-relaxed max-w-md">Computational methods for streamlining industrial workflows and minimizing resource usage through <span className="underline underline-offset-2 decoration-white/30">algorithmic refinement</span> as an emerging approach in interface architecture.<br className="hidden sm:block" /> Applications across digital infrastructure.</p>
            <p className="sm:text-right text-white/40 text-[9px] sm:text-[10px] md:text-xs font-light uppercase tracking-wider">Design Engineer<br />Dynamic Interface Engine</p>
          </div>
        </footer>
      </div>

      <div id="studio-menu" role="dialog" aria-modal="true" aria-label="Studio menu" aria-hidden={!menuOpen} {...(!menuOpen ? { inert: '' } : {})} className={`fixed inset-0 z-50 ${menuTransition} ${menuOpen ? 'visible opacity-100' : 'invisible opacity-0 pointer-events-none'}`}>
        <div className="absolute inset-0 bg-black/90 backdrop-blur-xl" onClick={closeMenu} />
        <div ref={menuPanel} className={`relative z-10 flex flex-col h-full px-8 pt-8 pointer-events-none ${menuTransition} ${menuOpen ? 'translate-y-0' : '-translate-y-8'}`}>
          <div className="flex items-center justify-between pointer-events-auto"><Logo /><button type="button" onClick={closeMenu} aria-label="Close menu" className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center text-white hover:border-white/60 transition-colors duration-300"><X size={16} /></button></div>
          <div className="flex-1 flex flex-col justify-center items-start">
            {sections.map((item, index) => <a key={item} href={index === 3 ? 'mailto:hello@nexform.studio' : `#${item.toLowerCase()}`} onClick={() => { if (index < 3) selectSlide(index); closeMenu(); }} style={{ transitionDelay: menuOpen ? `${150 + index * 75}ms` : '0ms' }} className={`pointer-events-auto text-white text-4xl sm:text-5xl font-light tracking-tight py-3 hover:opacity-60 ${menuTransition} ${menuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-8'}`}>{item}</a>)}
          </div>
          <div style={{ transitionDelay: menuOpen ? '450ms' : '0ms' }} className={`border-t border-white/10 py-6 sm:py-8 flex flex-col sm:flex-row gap-3 sm:justify-between text-white/40 text-xs font-light ${menuTransition} ${menuOpen ? 'opacity-100' : 'opacity-0'}`}><a className="pointer-events-auto hover:text-white" href="mailto:hello@nexform.studio">hello@nexform.studio</a><a className="pointer-events-auto hover:text-white" href="tel:+14248007700">+1 (424) 800-7700</a></div>
        </div>
      </div>
    </section>
  );
}

createRoot(document.getElementById('root')!).render(<React.StrictMode><App /></React.StrictMode>);
