import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { ArrowUpRight, Menu, X } from 'lucide-react';
import './styles.css';

const links = [ ['Home', '#home'], ['Features', '#features'], ['Pricing', '#pricing'], ['About', '#about'] ];

function BackgroundVideo() {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    let frame: number;
    const update = () => {
      const { currentTime: time, duration } = video;
      let opacity = 1;
      if (Number.isFinite(duration)) {
        if (time < 1) opacity = time;
        else if (time > duration - 1.5) opacity = Math.max(0, (duration - time - 0.3) / 1.2);
      }
      video.style.opacity = String(opacity);
      frame = requestAnimationFrame(update);
    };
    frame = requestAnimationFrame(update);
    return () => cancelAnimationFrame(frame);
  }, []);
  return <video ref={ref} className="absolute inset-0 h-full w-full object-cover" autoPlay loop muted playsInline preload="auto" aria-hidden="true">
    <source src={`${import.meta.env.BASE_URL}assets/hero.mp4`} type="video/mp4" />
  </video>;
}

function App() {
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const close = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && open) { setOpen(false); toggleRef.current?.focus(); }
    };
    const resize = () => { if (window.innerWidth >= 768) setOpen(false); };
    document.addEventListener('keydown', close);
    window.addEventListener('resize', resize);
    return () => { document.removeEventListener('keydown', close); window.removeEventListener('resize', resize); };
  }, [open]);
  return <>
    <header className="fixed inset-x-0 top-0 z-20">
      <nav aria-label="Main navigation" className="navbar relative mx-auto flex items-center justify-between">
        <a href="#home" aria-label="Weblex home" className="brand font-semibold tracking-tight">Weblex<span className="text-primary">.</span></a>
        <div className="desktop-links absolute left-1/2 hidden -translate-x-1/2 items-center gap-9 md:flex">
          {links.map(([label, href]) => <a key={label} className="nav-link text-sm text-muted-foreground transition-colors hover:text-foreground" href={href}>{label}</a>)}
        </div>
        <a className="nav-cta hidden rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition hover:brightness-110 md:inline-flex" href="#get-started">Get Started</a>
        <button ref={toggleRef} type="button" aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} aria-controls="mobile-menu" onClick={() => setOpen(!open)} className="rounded-full p-2 text-foreground md:hidden">
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
        {open && <div id="mobile-menu" className="mobile-menu absolute left-5 right-5 top-full flex flex-col gap-1 rounded-2xl border border-border bg-background p-3 md:hidden">
          {links.map(([label, href]) => <a key={label} href={href} onClick={() => setOpen(false)} className="rounded-lg px-4 py-3 text-sm text-muted-foreground hover:bg-muted hover:text-foreground">{label}</a>)}
          <a href="#get-started" onClick={() => setOpen(false)} className="mt-2 rounded-full bg-primary px-4 py-3 text-center text-sm font-medium text-primary-foreground">Get Started</a>
        </div>}
      </nav>
    </header>
    <main>
      <section id="home" aria-labelledby="hero-title" className="hero relative flex h-screen items-end justify-center overflow-hidden bg-background">
        <BackgroundVideo />
        <div className="hero-content relative z-10 mx-auto flex w-full max-w-[603px] flex-col items-center text-center">
          <span id="features" className="badge rounded-full border border-border px-4 py-2 text-xs text-muted-foreground">Introducing Smart Website Builder</span>
          <h1 id="hero-title" className="hero-title font-medium tracking-[-0.04em]">Turn your big idea into a stunning website</h1>
          <p id="about" className="hero-description max-w-[520px] text-muted-foreground">Fintech is its potential to promote financial inclusion. In many parts of the world, millions of people lack access to traditional banking services.</p>
          <div id="get-started" className="hero-actions flex items-center justify-center gap-3">
            <a href="#features" className="hero-button inline-flex items-center justify-center gap-2 rounded-full bg-primary font-medium text-primary-foreground transition hover:brightness-110"><ArrowUpRight size={22} strokeWidth={1.8} aria-hidden="true" />Get Started Now</a>
            <a id="pricing" href="#pricing" className="hero-button inline-flex items-center justify-center rounded-full bg-secondary font-medium text-secondary-foreground transition hover:brightness-90">See Pricing</a>
          </div>
        </div>
      </section>
    </main>
  </>;
}

createRoot(document.getElementById('root')!).render(<React.StrictMode><App /></React.StrictMode>);
