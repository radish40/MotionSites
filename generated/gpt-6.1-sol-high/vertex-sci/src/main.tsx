import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';

const navigation = ['Projects', 'Facilities', 'Discoveries', 'Team'];
const outline = 'border border-white/30 text-white font-light hover:border-white/60';
const solid = 'bg-white text-black font-medium hover:bg-white/90';

function Actions({ mobile = false, onNavigate }: { mobile?: boolean; onNavigate?: () => void }) {
  const common = `text-xs uppercase tracking-[0.15em] transition-all duration-200 text-center ${mobile ? 'w-full py-4' : 'px-5 py-2.5'}`;
  return <div className={mobile ? 'flex flex-col gap-3' : 'flex gap-3'}>
    <a href="mailto:inquire@vertexsci.example" onClick={onNavigate} className={`${common} ${outline}`}>Inquire</a>
    <a href="mailto:study@vertexsci.example?subject=Join%20Study" onClick={onNavigate} className={`${common} ${solid}`}>Join Study</a>
  </div>;
}

function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);
  const menu = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const frame = requestAnimationFrame(() => menu.current?.querySelector('a')?.focus());
    const close = () => { setOpen(false); toggle.current?.focus(); };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close();
      if (event.key === 'Tab') {
        const links = [...(menu.current?.querySelectorAll<HTMLElement>('a') ?? []), toggle.current!];
        const first = links[0], last = links[links.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }
    };
    const breakpoint = window.matchMedia('(min-width: 1024px)');
    const onResize = () => { if (breakpoint.matches) setOpen(false); };
    breakpoint.addEventListener('change', onResize);
    document.addEventListener('keydown', onKey);
    return () => {
      cancelAnimationFrame(frame);
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', onKey);
      breakpoint.removeEventListener('change', onResize);
    };
  }, [open]);

  return <>
    <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-black/60 backdrop-blur-md' : ''}`}>
      <nav aria-label="Main navigation" className="h-16 md:h-20 px-6 sm:px-10 md:px-16 lg:px-20 flex items-center justify-between">
        <a href="#projects" aria-label="Vertex Sci. home" onClick={() => setOpen(false)}>
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 256 256" fill="none" aria-hidden="true">
            <path d="M 256 64 L 256 128 L 192.5 128 L 160 95 L 128 64 L 96 95 L 63.5 128 L 64 128 L 128 192 L 128 256 L 64.5 256 L 32 223 L 0 192 L 0 64 L 64 0 L 192 0 Z M 256 192 L 256 256 L 192.5 256 L 160 223 L 128 192 L 128 128 L 192 128 Z" fill="white" />
          </svg>
        </a>
        <div className="hidden lg:flex gap-8">
          {navigation.map(label => <a key={label} href={`#${label.toLowerCase()}`} className="text-white/70 text-xs uppercase tracking-[0.2em] font-light hover:text-white transition-colors duration-200">{label}</a>)}
        </div>
        <div className="hidden lg:block"><Actions /></div>
        <button ref={toggle} type="button" aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} aria-controls="mobile-menu" onClick={() => setOpen(!open)} className="lg:hidden flex flex-col gap-1.5 justify-center items-center w-11 h-11 -mr-2">
          <span className={`w-6 h-[1.5px] bg-white transition-transform duration-300 ease-out ${open ? 'translate-y-[7.5px] rotate-45' : ''}`} />
          <span className={`w-6 h-[1.5px] bg-white transition-all duration-300 ease-out ${open ? 'opacity-0 scale-x-0' : ''}`} />
          <span className={`w-6 h-[1.5px] bg-white transition-transform duration-300 ease-out ${open ? '-translate-y-[7.5px] -rotate-45' : ''}`} />
        </button>
      </nav>
    </header>
    <div ref={menu} id="mobile-menu" role="dialog" aria-label="Navigation menu" aria-modal={open ? true : undefined} inert={!open} className={`mobile-menu fixed inset-0 z-40 bg-black lg:hidden px-6 sm:px-10 md:px-16 pt-28 pb-10 flex flex-col justify-between transition-opacity duration-500 ${open ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
      <div>{navigation.map((label, index) => <a key={label} href={`#${label.toLowerCase()}`} onClick={() => setOpen(false)} style={{ transitionDelay: open ? `${index * 60 + 150}ms` : '0ms' }} className={`flex items-center justify-between py-5 border-b border-white/10 text-white text-2xl sm:text-3xl font-light tracking-tight uppercase transition-all duration-500 ${open ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
        {label}<span className="text-white/30 text-xs">0{index + 1}</span>
      </a>)}</div>
      <div style={{ transitionDelay: open ? '400ms' : '0ms' }} className={`mt-8 transition-all duration-500 ${open ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}><Actions mobile onNavigate={() => setOpen(false)} /></div>
    </div>
  </>;
}

function App() {
  return <>
    <Navbar />
    <main>
      <section id="projects" aria-labelledby="hero-title" className="hero relative w-full h-screen overflow-hidden bg-black">
        <video autoPlay muted loop playsInline aria-hidden="true" className="animate-hero-video absolute inset-0 w-full h-full object-cover grayscale">
          <source src={`${import.meta.env.BASE_URL}assets/fracture.mp4`} type="video/mp4" />
        </video>
        <div className="absolute inset-x-0 bottom-0 h-[60%] z-[5] bg-gradient-to-t from-black/80 via-black/30 to-transparent pointer-events-none" />
        <div className="relative z-10 h-full flex flex-col justify-end px-6 sm:px-10 md:px-16 lg:px-20 pb-12 md:pb-16 lg:pb-20">
          <p id="team" className="animate-hero-label text-white/50 text-[10px] sm:text-xs tracking-[0.3em] uppercase font-light mb-8 md:mb-12">Deep-Structure Lab. By Vertex Sci.</p>
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-10 lg:gap-20">
            <div className="flex-shrink-0">
              <h1 id="hero-title" className="animate-hero-title text-white font-bold text-[clamp(2.5rem,8vw,5rem)] leading-[0.9] tracking-[-0.06em] uppercase">Fracture<br />Pattern<br />Dynamics</h1>
              <div className="animate-hero-meta mt-6 flex items-center gap-6 text-white/40 text-[10px] sm:text-xs tracking-wider uppercase font-light">
                <span>Batch: KX-071243</span><span aria-hidden="true" className="animate-hero-divider w-8 h-[1px] bg-white/20 inline-block" /><span>Phase: Sigma</span>
              </div>
            </div>
            <div className="flex flex-col gap-8 lg:max-w-md">
              <p id="discoveries" className="animate-hero-description text-white/60 text-xs sm:text-sm leading-relaxed font-light">Advancing sub-atomic fracture mapping across the crystalline stress interface. Photon array diagnostics revealing the most intricate deformation cycles in deep material forensics.</p>
              <div id="facilities" className="flex items-end gap-8 sm:gap-12">
                {[['7.91', 'Ref. Index'], ['ULTRA', 'Clarity'], ['x500°', 'Resolution']].map(([value, label], index) => <div key={label} className={`animate-hero-stat-${index + 1} flex flex-col gap-1`}>
                  <span className="text-white text-2xl sm:text-3xl font-bold tracking-tight">{value}</span>
                  <span className="text-white/40 text-[10px] sm:text-xs uppercase tracking-wider font-light">{label}</span>
                </div>)}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  </>;
}

createRoot(document.getElementById('root')!).render(<React.StrictMode><App /></React.StrictMode>);
