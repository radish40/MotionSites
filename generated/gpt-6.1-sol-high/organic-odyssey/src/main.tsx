import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { AnimatePresence, motion, useInView, useReducedMotion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import './styles.css';

const links = ['Wander', 'Archive', 'Story', 'Connect'];

function StaggeredFade({ text }: { text: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const reduced = useReducedMotion();
  return <span ref={ref} className="block" aria-label={text}>
    {text.split('').map((character, i) => <motion.span
      key={i} aria-hidden="true" className="inline-block whitespace-pre"
      initial="hidden" animate={inView ? 'show' : 'hidden'} custom={i}
      variants={{ hidden: { opacity: 0 }, show: (index: number) => ({ opacity: 1, y: 0, transition: { delay: reduced ? 0 : index * 0.07, duration: reduced ? 0 : 0.7 } }) }}
    >{character}</motion.span>)}
  </span>;
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [immersed, setImmersed] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const menuRef = useRef<HTMLButtonElement>(null);
  const reduced = useReducedMotion();
  useEffect(() => {
    function escape(event: KeyboardEvent) {
      if (event.key === 'Escape') { setMenuOpen(false); setImmersed(false); menuRef.current?.focus(); }
    }
    window.addEventListener('keydown', escape);
    return () => window.removeEventListener('keydown', escape);
  }, []);
  useEffect(() => {
    const media = window.matchMedia('(min-width: 768px)');
    const close = () => { if (media.matches) setMenuOpen(false); };
    media.addEventListener('change', close);
    return () => media.removeEventListener('change', close);
  }, []);
  return <main className="relative h-dvh min-h-[480px] overflow-hidden bg-[#010101] text-white">
    <video ref={videoRef} className="absolute inset-0 h-full w-full object-cover object-center" autoPlay muted loop playsInline preload="auto" aria-label="Cinematic organic forms and an iridescent sphere among moss-covered branches">
      <source src={`${import.meta.env.BASE_URL}assets/organic-realm.mp4`} type="video/mp4" />
    </video>
    <motion.nav aria-label="Main navigation" className="relative z-20 flex items-center justify-between gap-10 px-6 py-6 sm:px-8 md:justify-center md:gap-14 md:py-5" animate={{ opacity: immersed ? 0 : 1 }} style={{ pointerEvents: immersed ? 'none' : 'auto' }} inert={immersed}>
      <a href="#" className="text-[11px] font-light uppercase tracking-[0.25em] md:text-xs md:tracking-[0.3em]">Organic Visions</a>
      <div className="hidden items-center gap-8 md:flex">
        {links.map(link => <a key={link} href={`#${link.toLowerCase()}`} className="text-[10px] font-light uppercase tracking-[0.2em] text-white/80 transition-colors duration-300 hover:text-white">{link}</a>)}
      </div>
      <button ref={menuRef} type="button" aria-label={menuOpen ? 'Close menu' : 'Open menu'} aria-expanded={menuOpen} aria-controls="mobile-navigation" onClick={() => setMenuOpen(!menuOpen)} className="rounded p-1 text-white md:hidden">{menuOpen ? <X size={22} /> : <Menu size={22} />}</button>
    </motion.nav>
    <AnimatePresence>
      {menuOpen && <motion.div id="mobile-navigation" className="mobile-menu-glass fixed left-4 right-4 top-16 z-50 flex flex-col items-center gap-5 rounded-2xl py-8 md:hidden" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3, ease: 'easeOut' }}>
        {links.map((link, i) => <motion.a key={link} href={`#${link.toLowerCase()}`} onClick={() => setMenuOpen(false)} className="text-xs font-light uppercase tracking-[0.25em] text-white/90 transition-colors hover:text-white" initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 + i * 0.06 }}>{link}</motion.a>)}
      </motion.div>}
    </AnimatePresence>
    <motion.section aria-label="Witness the hidden realm" className="relative z-10 flex flex-col items-center px-5 pt-12 text-center sm:px-8 sm:pt-16 md:pt-24" animate={{ opacity: immersed ? 0 : 1, y: immersed ? -12 : 0 }} transition={{ duration: 0.8 }} style={{ pointerEvents: immersed ? 'none' : 'auto' }} inert={immersed}>
      <h1 className="font-garamond mb-6 text-4xl font-normal leading-[1.08] tracking-tight sm:mb-8 sm:text-6xl md:text-8xl lg:text-9xl"><StaggeredFade text="WITNESS THE" /><StaggeredFade text="HIDDEN REALM" /></h1>
      <motion.p className="mb-8 max-w-xs text-sm font-light leading-relaxed text-white/70 sm:mb-10 sm:max-w-md sm:text-base md:text-lg" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reduced ? 0 : 0.8, delay: reduced ? 0 : 1.6 }}>An odyssey through delicate living forms,<br className="hidden sm:block" /> revealed by lens and curiosity.</motion.p>
      <motion.button type="button" className="liquid-glass rounded-full px-7 py-3.5 text-[10px] font-light uppercase tracking-[0.18em] text-white/90 transition-colors sm:px-10 sm:py-4 sm:text-xs sm:tracking-[0.2em]" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reduced ? 0 : 0.8, delay: reduced ? 0 : 2 }} onClick={() => { setImmersed(true); setMenuOpen(false); void videoRef.current?.play(); }}>Begin the Experience</motion.button>
    </motion.section>
    <AnimatePresence>{immersed && <motion.button autoFocus type="button" aria-label="Return to introduction" className="liquid-glass absolute right-6 top-6 z-30 rounded-full p-3 text-white/90" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setImmersed(false)}><X size={22} /></motion.button>}</AnimatePresence>
  </main>;
}

createRoot(document.getElementById('root')!).render(<React.StrictMode><App /></React.StrictMode>);
