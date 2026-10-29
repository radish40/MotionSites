import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';

const EMAIL = 'hello@mainframe.co';
const links = ['Labs', 'Studio', 'Openings', 'Shop'];
const destination = (label: string) => `https://mainframe.co/${label.toLowerCase()}`;

function useTypewriter(text: string, speed = 38, startDelay = 600) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    setCount(0);
    let interval: ReturnType<typeof setInterval>;
    const timeout = setTimeout(() => {
      interval = setInterval(() => setCount(previous => {
        if (previous + 1 >= text.length) clearInterval(interval);
        return Math.min(previous + 1, text.length);
      }), speed);
    }, startDelay);
    return () => { clearTimeout(timeout); clearInterval(interval); };
  }, [text, speed, startDelay]);
  return { displayed: text.slice(0, count), done: count === text.length };
}

function Background() {
  const videoRef = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const video = videoRef.current!;
    let prevX: number | null = null;
    let targetTime = 0;
    let seeking = false;
    const seek = () => {
      if (seeking || !Number.isFinite(video.duration)) return;
      if (Math.abs(video.currentTime - targetTime) > 0.015) {
        seeking = true;
        video.currentTime = targetTime;
      }
    };
    const onSeeked = () => { seeking = false; seek(); };
    const onMove = (event: MouseEvent) => {
      if (prevX !== null && Number.isFinite(video.duration)) {
        const delta = event.clientX - prevX;
        targetTime = Math.max(0, Math.min(video.duration, targetTime + (delta / window.innerWidth) * 0.8 * video.duration));
        seek();
      }
      prevX = event.clientX;
    };
    const resetPointer = () => { prevX = null; };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('blur', resetPointer);
    video.addEventListener('seeked', onSeeked);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('blur', resetPointer);
      video.removeEventListener('seeked', onSeeked);
    };
  }, []);
  return <video ref={videoRef} className="fixed inset-0 z-0 h-full w-full object-cover" style={{ objectPosition: '70% center' }} src={`${import.meta.env.BASE_URL}assets/mainframe.mp4`} muted playsInline preload="auto" aria-hidden="true" />;
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [actionsVisible, setActionsVisible] = useState(false);
  const [copyStatus, setCopyStatus] = useState('');
  const menuButton = useRef<HTMLButtonElement>(null);
  const mobileMenu = useRef<HTMLElement>(null);
  const { displayed, done } = useTypewriter('Glad you stopped in. Good taste tends to find us. Now, what are we building?');
  useEffect(() => {
    const timer = setTimeout(() => setActionsVisible(true), 400);
    const desktop = window.matchMedia('(min-width: 768px)');
    const closeOnDesktop = () => { if (desktop.matches) setMenuOpen(false); };
    desktop.addEventListener('change', closeOnDesktop);
    return () => { clearTimeout(timer); desktop.removeEventListener('change', closeOnDesktop); };
  }, []);
  useEffect(() => {
    if (!menuOpen) return;
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { setMenuOpen(false); menuButton.current?.focus(); }
      if (event.key === 'Tab') {
        const items = [menuButton.current!, ...Array.from(mobileMenu.current!.querySelectorAll<HTMLAnchorElement>('a'))];
        const index = items.indexOf(document.activeElement as HTMLButtonElement);
        if (event.shiftKey && index === 0) { event.preventDefault(); items[items.length - 1].focus(); }
        else if (!event.shiftKey && index === items.length - 1) { event.preventDefault(); items[0].focus(); }
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [menuOpen]);
  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopyStatus('Email copied');
      setTimeout(() => setCopyStatus(''), 2500);
    } catch { setCopyStatus('Copy unavailable. Email hello@mainframe.co'); }
  }
  const pill = 'inline-flex items-center justify-center rounded-full border text-[13px] sm:text-[15px] px-4 sm:px-5 py-[0.3em] mx-[0.2em] mb-[0.4em] whitespace-nowrap transition-colors duration-200';
  return <>
    <Background />
    <header className="fixed inset-x-0 top-0 z-10 flex items-center justify-between px-5 py-4 sm:px-8 sm:py-5">
      <a href={import.meta.env.BASE_URL} aria-label="Mainframe home" className="flex items-center gap-3 text-black">
        <span className="text-[21px] tracking-tight sm:text-[26px]" style={{ fontFamily: 'var(--font-heading)' }}>Mainframe®</span>
        <span className="select-none text-[25px] tracking-[-0.02em] sm:text-[30px]" aria-hidden="true">✳︎</span>
      </a>
      <nav aria-label="Main navigation" className="hidden text-[23px] text-black md:flex">
        {links.map((label, i) => <React.Fragment key={label}><a className="transition-opacity hover:opacity-60" href={destination(label)}>{label}</a>{i < links.length - 1 && <span className="whitespace-pre">, </span>}</React.Fragment>)}
      </nav>
      <a href={`mailto:${EMAIL}`} className="hidden text-[23px] text-black underline underline-offset-2 transition-opacity hover:opacity-60 md:block">Get in touch</a>
      <button ref={menuButton} type="button" aria-label={menuOpen ? 'Close menu' : 'Open menu'} aria-expanded={menuOpen} aria-controls="mobile-menu" className="flex flex-col gap-[5px] py-2 md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
        <span className={`h-[2px] w-6 bg-black transition-all duration-300 ${menuOpen ? 'translate-y-[7px] rotate-45' : ''}`} />
        <span className={`h-[2px] w-6 bg-black transition-opacity duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
        <span className={`h-[2px] w-6 bg-black transition-all duration-300 ${menuOpen ? '-translate-y-[7px] -rotate-45' : ''}`} />
      </button>
    </header>
    <nav ref={mobileMenu} id="mobile-menu" aria-label="Mobile navigation" inert={!menuOpen} aria-hidden={!menuOpen} className={`fixed inset-0 z-9 flex flex-col items-start justify-center gap-8 bg-white/95 px-8 text-[32px] font-medium backdrop-blur-sm transition-opacity duration-300 md:hidden ${menuOpen ? 'opacity-100' : 'pointer-events-none opacity-0'}`}>
      {links.map(label => <a key={label} href={destination(label)} onClick={() => setMenuOpen(false)} className="transition-opacity hover:opacity-60">{label}</a>)}
      <a href={`mailto:${EMAIL}`} onClick={() => setMenuOpen(false)} className="underline underline-offset-2">Get in touch</a>
    </nav>
    <main className="hero relative z-1 flex flex-col justify-end overflow-hidden px-5 pb-12 sm:px-8 md:justify-center md:px-10 md:pb-0" inert={menuOpen}>
      <div className="relative z-10 max-w-xl">
        <div className="hero-copy pointer-events-none mb-5 select-none whitespace-pre-line text-black sm:mb-6" style={{ lineHeight: 1.3, filter: 'blur(4px)' }}>{"Hey there, meet A.R.I.A,\nMainframe's Adaptive Response Interface Agent"}</div>
        <p className="hero-copy mb-5 min-h-[54px] text-black sm:mb-6" style={{ lineHeight: 1.35 }} aria-label="Glad you stopped in. Good taste tends to find us. Now, what are we building?">
          <span aria-hidden="true">{displayed}{!done && <span className="cursor ml-[2px] inline-block h-[1.1em] w-[2px] bg-black align-middle" />}</span>
        </p>
        <div style={{ transition: 'opacity 0.4s ease, transform 0.4s ease' }} className={`flex flex-wrap gap-y-1 ${actionsVisible ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'}`}>
          <a href={`mailto:${EMAIL}?subject=Pitch%20an%20idea`} className={`${pill} border-black/10 bg-white text-black hover:bg-black hover:text-white`}>Pitch us an idea</a>
          <a href={destination('Openings')} className={`${pill} border-black/10 bg-white text-black hover:bg-black hover:text-white`}>Come work here</a>
          <a href={`mailto:${EMAIL}?subject=A%20brief%20hello`} className={`${pill} border-black/10 bg-white text-black hover:bg-black hover:text-white`}>Send a brief hello</a>
          <a href={destination('Studio')} className={`${pill} border-black/10 bg-white text-black hover:bg-black hover:text-white`}>See how we operate</a>
          <button onClick={copyEmail} className={`${pill} gap-2 border-white bg-transparent text-white hover:bg-white hover:text-black sm:gap-3`} aria-label="Copy email hello@mainframe.co">
            <span>Reach us: <span className="underline underline-offset-1">{EMAIL}</span></span>
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true"><rect x="6" y="6" width="8" height="8" rx="1" /><path d="M10 6V2H2v8h4" /></svg>
          </button>
        </div>
        <span role="status" className="absolute mt-1 text-[13px] text-white">{copyStatus}</span>
      </div>
    </main>
  </>;
}

createRoot(document.getElementById('root')!).render(<React.StrictMode><App /></React.StrictMode>);
