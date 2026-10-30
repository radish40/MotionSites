import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/theme.css';

const journeyLink = 'mailto:?subject=Begin%20Journey%20with%20Aethera';
const menuItems = [['Home', '#home'], ['Studio', '#studio'], ['About', '#about'], ['Journal', '#journal'], ['Reach Us', '#reach-us']];

function Landscape() {
  const videoRef = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let frame = 0;
    let restart: ReturnType<typeof setTimeout>;
    let disposed = false;
    const play = () => { void video.play().catch(() => { video.style.opacity = '1'; }); };
    const monitor = () => {
      const { currentTime, duration } = video;
      if (Number.isFinite(duration) && duration > 0) {
        video.style.opacity = String(Math.max(0, Math.min(1, currentTime / .5, (duration - currentTime) / .5)));
      }
      frame = requestAnimationFrame(monitor);
    };
    const ended = () => {
      video.style.opacity = '0';
      restart = setTimeout(() => {
        if (disposed) return;
        video.currentTime = 0;
        play();
      }, 100);
    };
    const showStill = () => { video.currentTime = Math.min(1, video.duration || 1); video.style.opacity = '1'; };
    if (reducedMotion) {
      video.pause();
      if (video.readyState >= 1) showStill();
      else video.addEventListener('loadedmetadata', showStill, { once: true });
    } else {
      video.addEventListener('ended', ended);
      frame = requestAnimationFrame(monitor);
      play();
    }
    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      clearTimeout(restart);
      video.removeEventListener('ended', ended);
      video.removeEventListener('loadedmetadata', showStill);
      video.pause();
    };
  }, []);
  return <div id="journal" className="landscape pointer-events-none absolute inset-x-0 bottom-0 z-0" aria-hidden="true">
    <video ref={videoRef} src={`${import.meta.env.BASE_URL}assets/aethera-landscape.mp4`} muted playsInline preload="auto" className="h-full w-full object-cover object-center" style={{ opacity: 0 }} />
    <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background" />
  </div>;
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  return <div id="home" className="relative min-h-screen w-full overflow-hidden bg-background">
    <Landscape />
    <header className="relative z-20 mx-auto flex max-w-7xl items-center justify-between px-8 py-6">
      <a href="#home" aria-label="Aethera home" className="font-display text-3xl tracking-tight text-black">Aethera<sup className="ml-0.5 text-[11px] align-super">®</sup></a>
      <nav aria-label="Main navigation" className="hidden items-center gap-8 md:flex">
        {menuItems.map(([label, href], i) => <a key={label} href={href} className={`text-sm transition-colors hover:text-black ${i === 0 ? 'text-black' : 'text-muted'}`}>{label}</a>)}
      </nav>
      <a href={journeyLink} className="hidden rounded-full bg-black px-6 py-2.5 text-sm text-white transition-transform hover:scale-[1.03] sm:inline-flex">Begin Journey</a>
      <button type="button" aria-label={menuOpen ? 'Close menu' : 'Open menu'} aria-expanded={menuOpen} aria-controls="mobile-navigation" onClick={() => setMenuOpen(!menuOpen)} className="flex h-10 w-10 flex-col items-center justify-center gap-[5px] rounded-full border border-black/10 bg-white/60 md:hidden">
        <span className={`h-px w-4 bg-black transition-transform ${menuOpen ? 'translate-y-[3px] rotate-45' : ''}`} />
        <span className={`h-px w-4 bg-black transition-transform ${menuOpen ? '-translate-y-[3px] -rotate-45' : ''}`} />
      </button>
      {menuOpen && <nav id="mobile-navigation" aria-label="Mobile navigation" className="absolute left-6 right-6 top-20 flex flex-col gap-1 rounded-2xl border border-black/5 bg-white/95 p-4 shadow-lg backdrop-blur-xl md:hidden">
        {menuItems.map(([label, href]) => <a key={label} href={href} onClick={() => setMenuOpen(false)} className="rounded-lg px-3 py-2 text-sm text-muted hover:bg-black/5 hover:text-black">{label}</a>)}
        <a href={journeyLink} className="mt-2 rounded-full bg-black px-6 py-3 text-center text-sm text-white">Begin Journey</a>
      </nav>}
    </header>
    <main id="studio" className="relative z-10 flex flex-col items-center justify-center px-6 pb-40 text-center" style={{ paddingTop: 'calc(8rem - 75px)' }}>
      <h1 className="hero-heading animate-fade-rise max-w-7xl font-display text-5xl font-normal leading-[.95] tracking-[-2.46px] text-black sm:text-7xl md:text-8xl">
        Beyond <em className="text-muted">silence,</em> we build<br className="hidden sm:block" /> <span className="sm:hidden"> </span><em className="text-muted">the eternal.</em>
      </h1>
      <p id="about" className="animate-fade-rise-delay mt-8 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">Building platforms for brilliant minds, fearless makers, and thoughtful souls. Through the noise, we craft digital havens for deep work and pure flows.</p>
      <div className="animate-fade-rise-delay-2 mt-12"><a id="reach-us" href={journeyLink} className="inline-flex rounded-full bg-black px-14 py-5 text-base text-white transition-transform hover:scale-[1.03]">Begin Journey</a></div>
    </main>
  </div>;
}

createRoot(document.getElementById('root')!).render(<React.StrictMode><App /></React.StrictMode>);
