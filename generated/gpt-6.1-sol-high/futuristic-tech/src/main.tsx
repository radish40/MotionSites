import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { ArrowRight, Menu, X } from 'lucide-react';
import './styles.css';

const links = ['Platform', 'How it works', 'AI Defense', 'Connections', 'Insights'];
const anchor = (label: string) => `#${label.toLowerCase().replace(/ /g, '-')}`;

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const video = useRef<HTMLVideoElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);
  const waitlist = useRef<HTMLDialogElement>(null);
  const [playing, setPlaying] = useState(true);

  useEffect(() => {
    const escape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && menuOpen) {
        setMenuOpen(false);
        toggle.current?.focus();
      }
    };
    document.addEventListener('keydown', escape);
    return () => document.removeEventListener('keydown', escape);
  }, [menuOpen]);

  function joinWait() {
    setMenuOpen(false);
    waitlist.current?.showModal();
  }

  async function seeMotion() {
    if (!video.current) return;
    video.current.currentTime = 0;
    try { await video.current.play(); setPlaying(true); }
    catch { setPlaying(false); }
  }

  return (
    <main className="hero relative h-screen w-full overflow-hidden bg-black">
      <video ref={video} className="absolute inset-0 z-0 h-full w-full object-cover" autoPlay muted loop playsInline preload="auto" poster={`${import.meta.env.BASE_URL}assets/poster.jpg`} onPlay={() => setPlaying(true)} onError={() => setPlaying(false)}>
        <source src={`${import.meta.env.BASE_URL}assets/hero.mp4`} type="video/mp4" />
      </video>
      <div className="hero-shade pointer-events-none absolute inset-0 z-10" />

      <header className="absolute left-0 right-0 top-0 z-50 flex items-center justify-between px-5 py-4 lg:px-10 lg:py-6">
        <a href="#" aria-label="axentra home" className="text-xl font-semibold tracking-tight text-white">axentra</a>
        <nav aria-label="Main navigation" className="liquid-glass hidden items-center rounded-full p-1.5 lg:flex">
          {links.map(label => <a key={label} href={anchor(label)} className="rounded-full px-4 py-1.5 text-sm text-white/80 transition-colors hover:bg-white/10 hover:text-white">{label}</a>)}
        </nav>
        <button onClick={joinWait} className="hidden rounded-full bg-white px-5 py-2 text-sm font-medium text-black transition-opacity hover:opacity-80 lg:block">Join the wait</button>
        <button ref={toggle} onClick={() => setMenuOpen(!menuOpen)} aria-label={menuOpen ? 'Close menu' : 'Open menu'} aria-expanded={menuOpen} aria-controls="mobile-navigation" className={`menu-toggle relative flex h-9 w-9 items-center justify-center rounded-full text-white lg:hidden ${menuOpen ? 'is-open' : ''}`}>
          <Menu size={20} strokeWidth={1.5} className="menu-symbol" />
          <X size={20} strokeWidth={1.5} className="close-symbol" />
        </button>
      </header>

      <div aria-hidden="true" onClick={() => setMenuOpen(false)} className={`menu-backdrop fixed inset-0 z-30 lg:hidden ${menuOpen ? 'open' : ''}`} />
      <div id="mobile-navigation" className={`mobile-panel fixed left-0 right-0 top-0 z-40 lg:hidden ${menuOpen ? 'open' : ''}`} inert={!menuOpen ? '' : undefined} aria-hidden={!menuOpen}>
        <nav aria-label="Mobile navigation" className="px-5 pb-6 pt-20">
          {links.map((label, i) => <a key={label} href={anchor(label)} onClick={() => setMenuOpen(false)} style={{ transitionDelay: menuOpen ? `${i * 50 + 80}ms` : '0ms' }} className="mobile-link group flex items-center justify-between rounded-xl px-3 py-3 text-base text-white/70 hover:bg-white/5 hover:text-white">
            {label}<ArrowRight size={14} className="-translate-x-1 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-40" />
          </a>)}
          <div className="mt-3 border-t border-white/[0.07] pt-4"><button onClick={joinWait} className="w-full rounded-full bg-white px-5 py-2 text-sm font-medium text-black transition-opacity hover:opacity-80">Join the wait</button></div>
        </nav>
      </div>

      <section className="relative z-20 flex h-full flex-col items-start justify-end px-5 pb-16 text-left sm:px-8 md:pb-20 lg:px-10" aria-labelledby="hero-heading">
        {links.map(label => <span key={label} id={anchor(label).slice(1)} className="absolute bottom-0" />)}
        <h1 id="hero-heading" className="max-w-3xl font-normal leading-[1.12] tracking-tight text-white" style={{ fontSize: 'clamp(1.75rem, 5vw, 2.6rem)' }}>
          When strategy meets its spark<br className="hidden sm:block" />{' '}and thought reshapes what lies ahead
        </h1>
        <p className="hero-subtext mt-5 max-w-xs text-sm leading-relaxed sm:max-w-sm md:mt-6 md:max-w-md md:text-base">a fluid channel - where deep resolve<br />and neural insight dissolve as one</p>
        <button onClick={seeMotion} className="group mt-7 flex items-center gap-3 rounded-full bg-white px-5 py-2.5 text-sm font-medium text-black transition-opacity duration-300 hover:opacity-80 md:mt-8">See it in motion<ArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-0.5" /></button>
        {!playing && <p role="status" className="mt-3 text-xs text-white/60">Select “See it in motion” to play the film.</p>}
      </section>

      <dialog ref={waitlist} className="wait-dialog rounded-2xl border border-white/15 bg-[#101010] p-8 text-white" onClick={event => { if (event.target === event.currentTarget) waitlist.current?.close(); }}>
        <button aria-label="Close waitlist" onClick={() => waitlist.current?.close()} className="absolute right-4 top-4 rounded-full p-2 text-white/70 hover:bg-white/10"><X size={20} strokeWidth={1.5} /></button>
        <h2 className="pr-8 text-2xl font-normal tracking-tight">Join the wait</h2>
        <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/60">Waitlist registration is coming soon.</p>
        <button onClick={() => waitlist.current?.close()} className="mt-6 rounded-full bg-white px-5 py-2 text-sm font-medium text-black hover:opacity-80">Back to axentra</button>
      </dialog>
    </main>
  );
}

createRoot(document.getElementById('root')!).render(<React.StrictMode><App /></React.StrictMode>);
