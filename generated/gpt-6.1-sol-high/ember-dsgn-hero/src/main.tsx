import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowUpRight, Menu, X } from 'lucide-react';
import Hls from 'hls.js';
import './index.css';

const stream = 'https://stream.mux.com/Q3hYHAcLU82ceOUgwDeO4HiwOc3WZn9JD02PugwzxHOI.m3u8';
const links = [
  ['WORKS', '#work'], ['SERVICES', '#services'], ['ABOUT', '#about'],
  ['TEAM', '#team'], ['CONTACTS', '#contacts'],
];

function Logo() {
  return <a href="#about" className="flex items-center gap-3" aria-label="EMBER.dsgn home">
    <span className="grid grid-cols-2 gap-0.5" aria-hidden="true">
      {[0, 1, 2, 3].map(i => <span key={i} className="h-2 w-2 bg-[#FF5C35] md:h-2.5 md:w-2.5" />)}
    </span>
    <span className="text-lg font-black tracking-tighter md:text-xl">EMBER.dsgn</span>
  </a>;
}

function Language({ language, setLanguage }: { language: string; setLanguage: (language: string) => void }) {
  return <div className="flex items-center gap-3 text-[10.5px] font-medium tracking-widest uppercase" aria-label="Language selection">
    <button onClick={() => setLanguage('EN')} aria-pressed={language === 'EN'} className={language === 'EN' ? 'text-white' : 'text-white/40 hover:text-white'}>EN</button>
    <span className="text-white/20" aria-hidden="true">|</span>
    <button onClick={() => setLanguage('RU')} aria-pressed={language === 'RU'} className={language === 'RU' ? 'text-white' : 'text-white/40 hover:text-white'}>RU</button>
  </div>;
}

function App() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [language, setLanguage] = useState('EN');

  useEffect(() => {
    const video = videoRef.current!;
    const play = () => { video.playbackRate = 0.7; void video.play().catch(() => {}); };
    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(stream);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, play);
      return () => hls.destroy();
    }
    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = stream;
      video.addEventListener('loadedmetadata', play);
      return () => video.removeEventListener('loadedmetadata', play);
    }
  }, []);

  useEffect(() => {
    if (!isMenuOpen) return;
    const previousFocus = document.activeElement as HTMLElement | null;
    menuRef.current?.querySelector<HTMLButtonElement>('button')?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsMenuOpen(false);
      if (event.key !== 'Tab') return;
      const items = menuRef.current?.querySelectorAll<HTMLElement>('a, button');
      if (!items?.length) return;
      const first = items[0], last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    const onResize = () => { if (window.innerWidth >= 1024) setIsMenuOpen(false); };
    document.addEventListener('keydown', onKeyDown);
    window.addEventListener('resize', onResize);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('resize', onResize);
      previousFocus?.focus();
    };
  }, [isMenuOpen]);

  return <main className="relative h-screen w-full overflow-hidden bg-black font-sans text-white selection:bg-white/20">
    <video ref={videoRef} muted loop playsInline autoPlay aria-hidden="true" className="absolute inset-0 h-full w-full scale-x-[-1] object-cover" />

    <div className="panels scrollbar-hide pointer-events-none absolute inset-0 z-10 flex flex-col overflow-y-auto lg:flex-row lg:overflow-hidden" inert={isMenuOpen}>
      <section id="about" aria-label="About EMBER design studio" className="left-panel pointer-events-auto relative flex min-h-screen w-full flex-col overflow-hidden border-b border-white/5 lg:h-full lg:w-1/2 lg:border-r lg:border-b-0">
        <svg className="absolute h-0 w-0" aria-hidden="true">
          <defs>
            <mask id="emberMaskDesktop" maskUnits="objectBoundingBox" maskContentUnits="objectBoundingBox" x="0" y="0" width="1" height="1" style={{ maskType: 'luminance' }}>
              <rect width="1" height="1" fill="white" />
              <svg x="0.066667" y="0.08" width="0.866666" height="0.25" viewBox="0 0 600 150" preserveAspectRatio="none">
                <text x="0" y="115" textLength="100%" lengthAdjust="spacingAndGlyphs" className="font-[900] tracking-tighter" style={{ fontSize: 130 }} fill="black">EMBER</text>
              </svg>
            </mask>
            <mask id="emberMaskMobile" maskUnits="objectBoundingBox" maskContentUnits="objectBoundingBox" x="0" y="0" width="1" height="1" style={{ maskType: 'luminance' }}>
              <rect width="1" height="1" fill="white" />
              <svg x="0.061538" y="0.12" width="0.876924" height="0.20" viewBox="0 0 600 150" preserveAspectRatio="none">
                <text x="0" y="115" textLength="100%" lengthAdjust="spacingAndGlyphs" className="font-[900] tracking-tighter" style={{ fontSize: 130 }} fill="black">EMBER</text>
              </svg>
            </mask>
          </defs>
        </svg>
        <div className="ember-glass absolute inset-0" style={{ backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' }} />
        <h1 className="sr-only">EMBER.dsgn — Digital Design Studio</h1>
        <div className="relative z-20 flex min-h-screen flex-1 flex-col px-6 pt-[12vh] md:px-12 lg:pt-[8vh]">
          <div className="h-[20vh] shrink-0 lg:h-[25vh]" aria-hidden="true" />
          <div className="flex min-h-[100px] grow flex-col pt-4" aria-hidden="true"><div className="w-px flex-1 bg-white/20" /></div>
          <div id="team" className="flex flex-col gap-6 pt-4 pb-12">
            <span className="text-[10px] font-bold tracking-[0.3em] text-white/40 uppercase">ABOUT</span>
            <h2 className="max-w-[550px] text-xl leading-[1.3] font-normal text-white/90 md:text-2xl">We shape striking digital identities through bold contrasts and meaningful motion.</h2>
            <p id="services" className="max-w-[450px] text-xl leading-[1.3] font-normal text-white/90 md:text-2xl">Our design process transforms the primal into the powerful.</p>
            <div className="flex w-full flex-col items-start justify-between gap-8 border-t border-white/10 pt-8 sm:flex-row sm:items-end">
              <div className="flex shrink-0 flex-col gap-2">
                <span className="text-[9px] font-bold tracking-widest text-white/40 uppercase">Double Click and</span>
                <a href="#work" onDoubleClick={() => document.getElementById('work')?.scrollIntoView({ behavior: 'smooth' })} className="small-label group flex items-center gap-3">Explore Our Work <ArrowUpRight size={14} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" /></a>
              </div>
              <div className="small-label flex flex-col gap-2">
                <a href="https://www.instagram.com/" target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-white/70"><span className="dot" />Instagram</a>
                <a href="https://t.me/" target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-white/70"><span className="dot" />Telegram</a>
              </div>
              <address id="contacts" className="small-label hidden flex-col gap-2 not-italic sm:flex"><span>23 Industrial Lane, Unit 5</span><span>London, UK, E2 8AA</span></address>
            </div>
          </div>
        </div>
      </section>

      <section id="work" aria-label="Studio" className="pointer-events-auto relative flex min-h-[50vh] w-full flex-col justify-end overflow-hidden pb-8 lg:h-full lg:w-1/2 lg:pb-2">
        <div className="pointer-events-none absolute inset-0 z-0 flex justify-center" aria-hidden="true">
          <div className="relative flex aspect-square h-full flex-col items-center">
            <div className="absolute top-[-10vh] h-[40vh] w-[40vh] rounded-full border border-white/20 lg:top-[-25vh] lg:h-[60vh] lg:w-[60vh] lg:border-white/35" />
            <div className="absolute top-[30vh] h-[40vh] w-[40vh] rounded-full border border-white/20 lg:top-[18vh] lg:h-[60vh] lg:w-[60vh] lg:border-white/35" />
          </div>
        </div>
        <div className="relative z-10 mb-1 w-full px-6 md:px-[5%]">
          <svg viewBox="0 0 600 150" className="block w-full overflow-visible" aria-label="STUDIO" role="img">
            <text x="0" y="130" textLength="100%" lengthAdjust="spacingAndGlyphs" className="font-[900] tracking-tighter" style={{ fontSize: 130 }} fill="white">STUDIO</text>
          </svg>
        </div>
      </section>
    </div>

    <nav aria-label="Main navigation" inert={isMenuOpen} className="pointer-events-none fixed top-0 left-0 z-50 flex w-full items-center justify-between px-6 py-6 md:px-12 lg:py-8">
      <div className="pointer-events-auto flex items-center gap-10 xl:gap-14">
        <Logo />
        <div className="hidden items-center gap-6 text-[10.5px] font-medium tracking-[0.2em] text-white/70 uppercase lg:flex">
          {links.slice(0, 4).map(([label, href]) => <a key={label} href={href} className="flex items-center gap-2 transition-colors hover:text-white"><span className="dot" />{label}</a>)}
        </div>
      </div>
      <div className="pointer-events-auto flex items-center gap-4">
        <div className="hidden rounded-full border border-white/20 bg-white/5 px-4 py-1.5 backdrop-blur-sm sm:flex"><Language language={language} setLanguage={setLanguage} /></div>
        <button ref={menuButtonRef} className="p-2 lg:hidden" aria-label="Open menu" aria-expanded={isMenuOpen} aria-controls="mobile-menu" onClick={() => setIsMenuOpen(true)}><Menu size={23} strokeWidth={1.5} /></button>
        <a href="#contacts" className="hidden rounded-full border border-white/20 bg-white/5 px-6 py-2 text-[10.5px] font-medium tracking-widest uppercase backdrop-blur-sm transition-all hover:bg-white hover:text-black sm:block"><span className="flex items-center gap-2"><span className="dot" />CONTACTS</span></a>
      </div>
    </nav>

    <AnimatePresence>
      {isMenuOpen && <motion.div ref={menuRef} id="mobile-menu" role="dialog" aria-modal="true" aria-label="Navigation menu" initial={{ opacity: 0, x: '100%' }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }} className="pointer-events-auto fixed inset-0 z-[100] flex flex-col bg-black lg:hidden">
        <div className="flex items-center justify-between px-6 py-6 md:px-12"><Logo /><button aria-label="Close menu" onClick={() => setIsMenuOpen(false)} className="p-2"><X size={23} strokeWidth={1.5} /></button></div>
        <div className="flex grow flex-col justify-center gap-8 px-12">
          {links.map(([label, href], i) => <motion.a key={label} href={href} onClick={() => setIsMenuOpen(false)} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.05 }} className="text-4xl font-bold tracking-tighter transition-colors hover:text-[#FF5C35]">{label}</motion.a>)}
        </div>
        <div className="flex items-center justify-between border-t border-white/10 p-12"><Language language={language} setLanguage={setLanguage} /><span className="text-[9px] font-bold tracking-widest text-white/40">UKRAINE / LONDON</span></div>
      </motion.div>}
    </AnimatePresence>
  </main>;
}

createRoot(document.getElementById('root')!).render(<React.StrictMode><App /></React.StrictMode>);
