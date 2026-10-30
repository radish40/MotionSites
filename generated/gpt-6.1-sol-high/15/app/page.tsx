'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import gsap from 'gsap';
import Hls from 'hls.js';

const BASE = '/motionsites-results/15';
const VIDEO = 'https://stream.mux.com/Gs3wZfrtz6ZfqZqQ02c02Z7lugV00FGZvRpcqFTel66r3g.m3u8';
const roles = ['Creative', 'Fullstack', 'Founder', 'Scholar'];

function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);
  const [word, setWord] = useState(0);
  useEffect(() => {
    let frame: number;
    let finish: ReturnType<typeof setTimeout>;
    const start = performance.now();
    const tick = (now: number) => {
      const elapsed = now - start;
      setProgress(Math.min(100, Math.floor(elapsed / 2700 * 100)));
      setWord(Math.min(2, Math.floor(elapsed / 900)));
      if (elapsed < 2700) frame = requestAnimationFrame(tick);
      else finish = setTimeout(onComplete, 400);
    };
    frame = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(frame); clearTimeout(finish); };
  }, [onComplete]);
  return <motion.div className="loader fixed inset-0 z-[9999] bg-bg" exit={{ opacity: 0 }} transition={{ duration: 0.6 }} aria-label="Loading portfolio" role="status">
    <motion.span className="absolute top-8 left-8 md:top-12 md:left-12 text-xs md:text-sm uppercase tracking-[0.3em] text-muted" initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: .6, delay: .1 }}>Portfolio</motion.span>
    <div className="absolute inset-0 flex items-center justify-center"><AnimatePresence mode="wait"><motion.span key={word} className="text-4xl md:text-6xl lg:text-7xl font-display italic text-text/80" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -20, opacity: 0 }} transition={{ duration: .4, ease: [.4, 0, .2, 1] }}>{['Design', 'Create', 'Inspire'][word]}</motion.span></AnimatePresence></div>
    <motion.span className="absolute bottom-8 right-8 md:bottom-12 md:right-12 text-6xl md:text-8xl lg:text-9xl font-display text-text tabular-nums" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: .6 }}>{String(progress).padStart(3, '0')}</motion.span>
    <div className="progress-track"><div style={{ transform: `scaleX(${progress / 100})` }} /></div>
  </motion.div>;
}

function BackgroundVideo() {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const video = ref.current!;
    let hls: Hls | undefined;
    if (video.canPlayType('application/vnd.apple.mpegurl')) { video.src = VIDEO; }
    else if (Hls.isSupported()) { hls = new Hls({ maxMaxBufferLength: 20, capLevelToPlayerSize: true }); hls.loadSource(VIDEO); hls.attachMedia(video); }
    const play = () => { void video.play().catch(() => {}); };
    video.addEventListener('canplay', play);
    return () => { video.removeEventListener('canplay', play); hls?.destroy(); };
  }, []);
  return <div className="hero-background absolute inset-0 z-0" aria-hidden="true"><video ref={ref} autoPlay muted loop playsInline poster={`${BASE}/assets/hero-poster.avif`} className="hero-video" /><div className="absolute inset-0 bg-black/20" /><div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-bg to-transparent" /></div>;
}

function Hero({ ready }: { ready: boolean }) {
  const root = useRef<HTMLElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const [panel, setPanel] = useState<'Work' | 'Resume'>('Work');
  const [role, setRole] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => { const scroll = () => setScrolled(window.scrollY > 100); window.addEventListener('scroll', scroll, { passive: true }); return () => window.removeEventListener('scroll', scroll); }, []);
  useEffect(() => {
    if (root.current) root.current.inert = !ready;
    if (!ready) return;
    const timer = setInterval(() => setRole(n => (n + 1) % roles.length), 2000);
    const ctx = gsap.context(() => {
      const timeline = gsap.timeline({ defaults: { ease: 'power3.out' } });
      timeline.fromTo('.name-reveal', { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 1.2 }, .1);
      timeline.fromTo('.blur-in', { opacity: 0, filter: 'blur(10px)', y: 20 }, { opacity: 1, filter: 'blur(0px)', y: 0, duration: 1, stagger: .1 }, .3);
    }, root);
    return () => { clearInterval(timer); ctx.revert(); };
  }, [ready]);
  const openPanel = (name: 'Work' | 'Resume') => { setPanel(name); dialog.current?.showModal(); };
  return <main ref={root} id="home" className="hero relative min-h-screen flex flex-col items-center justify-center bg-bg">
    <BackgroundVideo />
    <header className="fixed top-0 left-0 right-0 z-50 flex justify-center nav-position"><nav aria-label="Main navigation" className={`nav-pill inline-flex items-center rounded-full border border-white/10 bg-surface px-2 py-2 backdrop-blur-md ${scrolled ? 'shadow-md shadow-black/10' : ''}`}>
      <a href="#home" className="logo-ring" aria-label="Michael Smith home"><span className="font-display italic">JA</span></a>
      <span className="nav-divider hidden sm:block" />
      <a href="#home" className="nav-link active" aria-current="page">Home</a>
      <button className="nav-link" onClick={() => openPanel('Work')}>Work</button>
      <button className="nav-link" onClick={() => openPanel('Resume')}>Resume</button>
      <span className="nav-divider hidden sm:block" />
      <a className="nav-link say-hi gradient-hover" href="mailto:?subject=Hello%20Michael">Say hi <span aria-hidden="true">↗</span></a>
      <span className="nav-divider hidden sm:block" />
    </nav></header>
    <div className="hero-content relative z-10 text-center flex flex-col items-center px-6">
      <p className="blur-in text-xs text-muted uppercase tracking-[0.3em] mb-8">Collection &apos;26</p>
      <h1 className="name-reveal text-6xl md:text-8xl lg:text-9xl font-display italic leading-[0.9] tracking-tight text-text mb-6">Michael Smith</h1>
      <p className="blur-in role-line text-lg md:text-xl lg:text-2xl text-muted mb-10">A <span className="role-slot"><span key={role} className="role-word font-display italic text-text">{roles[role]}</span></span> lives in Chicago.</p>
      <p className="blur-in bio text-sm md:text-base text-muted leading-relaxed max-w-md mb-12">Designing seamless digital interactions by focusing on the unique nuances which bring systems to life.</p>
      <div className="blur-in flex items-center justify-center gap-4"><button className="cta primary gradient-hover" onClick={() => openPanel('Work')}>See Works</button><a className="cta secondary gradient-hover" href="mailto:?subject=Hello%20Michael">Reach out...</a></div>
    </div>
    <a href="#home" aria-label="Back to home" className="scroll-indicator absolute bottom-8 z-10 flex flex-col items-center gap-3"><span className="text-xs text-muted uppercase tracking-[0.2em]">Scroll</span><span className="scroll-track"><span /></span></a>
    <dialog ref={dialog} className="portfolio-dialog" onClick={event => { if (event.target === event.currentTarget) dialog.current?.close(); }}><button className="dialog-close" aria-label="Close" onClick={() => dialog.current?.close()}>×</button><p className="text-xs uppercase tracking-[0.3em] text-muted mb-6">{panel === 'Work' ? "Collection '26" : 'Resume'}</p><h2 className="font-display italic text-5xl mb-6">{panel === 'Work' ? 'Selected work' : 'Michael Smith'}</h2><p className="text-muted leading-relaxed mb-6">{panel === 'Work' ? 'Designing seamless digital interactions by focusing on the unique nuances which bring systems to life.' : 'Creative · Fullstack · Founder · Scholar. Based in Chicago.'}</p><p className="text-sm text-muted mb-8">{panel === 'Work' ? 'Project details have not been provided for this collection.' : 'A downloadable resume has not been provided.'}</p><a className="cta primary gradient-hover inline-block" href="mailto:?subject=Hello%20Michael">Reach out...</a></dialog>
  </main>;
}

export default function AppWrapper() {
  const [isLoading, setIsLoading] = useState(true);
  const complete = useCallback(() => setIsLoading(false), []);
  return <><AnimatePresence>{isLoading && <LoadingScreen onComplete={complete} />}</AnimatePresence><motion.div initial={{ opacity: 0 }} animate={{ opacity: isLoading ? 0 : 1 }} transition={{ duration: .5, ease: 'easeOut' }} aria-hidden={isLoading}><Hero ready={!isLoading} /></motion.div></>;
}
