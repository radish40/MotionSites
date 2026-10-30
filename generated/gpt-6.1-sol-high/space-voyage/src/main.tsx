import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { motion, useReducedMotion } from 'motion/react';
import { ArrowUpRight, Play, X, Menu } from 'lucide-react';
import BlurText from './BlurText';
import './index.css';

const base = import.meta.env.BASE_URL;
const videoUrl = 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260306_115329_5e00c9c5-4d69-49b7-94c3-9c31c60bb644.mp4';
const details: Record<string, { title: string; text: string }> = {
  Voyages: { title: 'Your next horizon', text: 'Maiden Crewed Voyage to Mars Arrives 2026. Discover a new perspective on the universe aboard our pioneering vessels.' },
  Worlds: { title: 'A universe to discover', text: 'From our home planet to Mars and the worlds beyond, venture past our sky and imagine where your journey could lead.' },
  Innovation: { title: 'Extraordinary by engineering', text: 'Our pioneering vessels and breakthrough engineering bring deep-space exploration within reach—secure and extraordinary.' },
  'Plan Launch': { title: 'Your voyage starts here', text: 'Our maiden crewed voyage to Mars arrives in 2026. Launch dates, availability, and reservations have not yet been announced. View Liftoff for a glimpse of the journey.' },
};
function App() {
  const [panel, setPanel] = useState<string | null>(null);
  const [menu, setMenu] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const reduced = useReducedMotion();
  useEffect(() => {
    if (panel) dialog.current?.showModal();
    else dialog.current?.close();
  }, [panel]);
  const open = (name: string) => { setMenu(false); if (name === 'Home') { setPanel(null); window.scrollTo({ top: 0, behavior: 'smooth' }); } else setPanel(name); };
  const reveal = (delay: number) => ({ initial: reduced ? false as const : { filter: 'blur(10px)', opacity: 0, y: 20 }, animate: { filter: 'blur(0px)', opacity: 1, y: 0 }, transition: { duration: .6, delay: reduced ? 0 : delay } });
  return <main className="relative min-h-svh overflow-hidden bg-background text-foreground font-body">
    <video className="absolute inset-0 h-full w-full object-cover z-0" autoPlay loop muted playsInline preload="auto" poster={`${base}images/hero_bg.jpeg`} onError={e => { if (!e.currentTarget.src.endsWith('/media/voyage.mp4')) { e.currentTarget.src = `${base}media/voyage.mp4`; void e.currentTarget.play().catch(() => {}); } }} src={videoUrl} />
    <div className="absolute inset-0 bg-black/5 z-0" />
    <div className="relative z-10 flex min-h-svh flex-col">
      <header className="fixed top-4 left-0 right-0 z-50 px-8 lg:px-16 flex items-center">
        <a href="#home" aria-label="Space Voyage home" onClick={() => open('Home')}><img className="h-12 w-12" src={`${base}images/logo.svg`} alt="Space Voyage" /></a>
        <nav aria-label="Main navigation" className="desktop-nav liquid-glass rounded-full p-1.5 hidden md:flex items-center absolute left-1/2 -translate-x-1/2 whitespace-nowrap">
          {['Home', 'Voyages', 'Worlds', 'Innovation', 'Plan Launch'].map(item => <button key={item} onClick={() => open(item)} className="nav-link px-3 py-2 text-sm font-medium text-foreground/90">{item}</button>)}
          <button onClick={() => open('Plan Launch')} className="white-button bg-white text-black rounded-full px-3.5 py-1.5 text-sm font-medium inline-flex items-center gap-2">Claim a Spot <ArrowUpRight className="h-4 w-4" /></button>
        </nav>
        <button className="md:hidden ml-auto liquid-glass rounded-full p-3" onClick={() => setMenu(!menu)} aria-expanded={menu} aria-label={menu ? 'Close menu' : 'Open menu'}>{menu ? <X size={20} /> : <Menu size={20} />}</button>
        {menu && <nav aria-label="Mobile navigation" className="mobile-menu absolute top-16 left-8 right-8 rounded-3xl p-3 flex flex-col">{['Home', 'Voyages', 'Worlds', 'Innovation', 'Plan Launch'].map(item => <button className="p-3 text-left rounded-full hover:bg-white/10" onClick={() => open(item)} key={item}>{item}</button>)}<button className="white-button rounded-full bg-white text-black p-3" onClick={() => open('Plan Launch')}>Claim a Spot ↗</button></nav>}
      </header>
      <section id="home" className="hero flex-1 flex flex-col items-center justify-center text-center px-4 pt-24">
        <div className="announcement liquid-glass rounded-full px-1 py-1 flex items-center gap-2 mb-2">
          <span className="bg-white text-black rounded-full px-3 py-1 text-xs font-semibold">New</span>
          <span className="text-sm text-foreground/90 pr-3">Maiden Crewed Voyage to Mars Arrives 2026</span>
        </div>
        <BlurText text="Venture Past Our Sky Across the Universe" className="text-6xl md:text-7xl lg:text-[5.5rem] font-heading italic text-foreground leading-[0.8] max-w-2xl justify-center tracking-[-4px]" delay={100} animateBy="words" direction="bottom" />
        <motion.p {...reveal(.8)} className="mt-1 text-sm md:text-base text-white max-w-2xl font-light leading-tight">Discover the universe in ways once unimaginable. Our pioneering vessels and breakthrough engineering bring deep-space exploration within reach—secure and extraordinary.</motion.p>
        <motion.div {...reveal(1.1)} className="flex items-center gap-6 mt-4">
          <button className="liquid-glass-strong rounded-full px-5 py-2.5 text-sm font-medium inline-flex items-center gap-2" onClick={() => open('Plan Launch')}>Start Your Voyage <ArrowUpRight className="h-5 w-5" /></button>
          <button className="text-sm font-medium inline-flex items-center gap-2 hover:opacity-75 transition-opacity" onClick={() => open('Liftoff')}>View Liftoff <Play className="h-4 w-4 fill-current" /></button>
        </motion.div>
      </section>
      <footer className="flex flex-col items-center gap-4 pb-8 px-4 partners">
        <span className="liquid-glass rounded-full px-3.5 py-1 text-xs font-medium text-white">Collaborating with top aerospace pioneers globally</span>
        <div className="flex items-center gap-12 md:gap-16">{['Aeon', 'Vela', 'Apex', 'Orbit', 'Zeno'].map(name => <span key={name} className="text-2xl md:text-3xl font-heading italic text-white tracking-tight">{name}</span>)}</div>
      </footer>
    </div>
    <dialog ref={dialog} onCancel={() => setPanel(null)} onClose={() => setPanel(null)} onClick={e => { if (e.target === e.currentTarget) setPanel(null); }} className="voyage-dialog text-white rounded-3xl p-0">
      <div className="p-7 md:p-10 relative">
        <button autoFocus aria-label="Close dialog" onClick={() => setPanel(null)} className="absolute right-4 top-4 rounded-full p-2 hover:bg-white/10"><X size={20} /></button>
        {panel === 'Liftoff' ? <><h2 className="font-heading italic text-4xl mb-5">View Liftoff</h2><video className="w-full rounded-xl" controls autoPlay playsInline src={`${base}media/voyage.mp4`} poster={`${base}images/hero_bg.jpeg`} /></> : panel && details[panel] ? <><p className="uppercase tracking-[.2em] text-xs mb-5 text-white/60">Space Voyage / {panel}</p><h2 className="font-heading italic text-5xl mb-4">{details[panel].title}</h2><p className="font-light leading-relaxed text-white/90 max-w-md">{details[panel].text}</p><button className="liquid-glass-strong rounded-full mt-6 px-5 py-3 flex items-center gap-2 text-sm" onClick={() => setPanel('Liftoff')}>View Liftoff <Play size={15} className="fill-current" /></button></> : null}
      </div>
    </dialog>
  </main>;
}
createRoot(document.getElementById('root')!).render(<React.StrictMode><App /></React.StrictMode>);
