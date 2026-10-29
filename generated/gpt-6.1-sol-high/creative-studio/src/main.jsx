import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { AnimatePresence, motion, MotionConfig } from 'framer-motion';
import { ArrowUpRight, X } from 'lucide-react';
import './styles.css';

const ease = [0.22, 1, 0.36, 1];
const fadeDown = { initial: { opacity: 0, y: -20 }, animate: i => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5, ease } }) };
const fadeUp = { initial: { opacity: 0, y: 32 }, animate: i => ({ opacity: 1, y: 0, transition: { delay: i * 0.12, duration: 0.6, ease } }) };
const links = ['Story', 'Expertise', 'Studios', 'Feedback'];
const padding = 'px-5 sm:px-8 md:px-12';

function Logo() {
  return <a href="#story" aria-label="Creative Studio home" className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-accent"><span className="h-2.5 w-2.5 rounded-full bg-accent" /></a>;
}

function Contact({ className = '', onClick }) {
  return <a href="mailto:" onClick={onClick} className={`contact inline-flex items-center gap-2 whitespace-nowrap text-accent ${className}`}>Work With Us<ArrowUpRight aria-hidden="true" className="h-[18px] w-[18px] sm:h-[22px] sm:w-[22px]" /></a>;
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleRef = useRef(null);
  const menuRef = useRef(null);
  useEffect(() => {
    if (!menuOpen) return;
    const previous = document.activeElement;
    document.body.style.overflow = 'hidden';
    menuRef.current?.querySelector('button')?.focus();
    function onKey(event) {
      if (event.key === 'Escape') setMenuOpen(false);
      if (event.key !== 'Tab') return;
      const elements = menuRef.current.querySelectorAll('a, button');
      const first = elements[0], last = elements[elements.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }
    document.addEventListener('keydown', onKey);
    return () => { document.body.style.overflow = ''; document.removeEventListener('keydown', onKey); previous?.focus(); };
  }, [menuOpen]);

  return <MotionConfig reducedMotion="user">
    <main className="hero relative isolate flex min-h-screen flex-col overflow-hidden bg-[#e9e9e7] font-semibold uppercase text-black">
      <video className="absolute inset-0 -z-10 h-full w-full object-cover" autoPlay loop muted playsInline aria-hidden="true" src={`${import.meta.env.BASE_URL}assets/studio-background.mp4`} />
      <header className={`flex shrink-0 items-center justify-between pt-5 md:pt-6 ${padding}`}>
        <motion.div variants={fadeDown} custom={0} initial="initial" animate="animate"><Logo /></motion.div>
        <nav aria-label="Main navigation" className="hidden items-center gap-8 md:flex lg:gap-12">
          {links.map((link, i) => <motion.a key={link} href={`#${link.toLowerCase()}`} variants={fadeDown} custom={i + 1} initial="initial" animate="animate" className="nav-link text-sm tracking-widest">{link}</motion.a>)}
        </nav>
        <motion.button ref={toggleRef} variants={fadeDown} custom={5} initial="initial" animate="animate" type="button" onClick={() => setMenuOpen(true)} aria-label="Open menu" aria-expanded={menuOpen} aria-controls="studio-menu" className="flex h-9 w-9 flex-col items-center justify-center gap-1 rounded-full bg-black">
          {[0, 1, 2].map(i => <span key={i} className="h-0.5 w-4 bg-white" />)}
        </motion.button>
      </header>

      <section id="expertise" aria-label="Our impact" className={`flex flex-1 items-center justify-end py-8 md:py-0 ${padding}`}>
        <div className="flex gap-5 sm:gap-8 md:gap-10">
          {[[300, 'Crafted\nBrands'], [200, 'Digital\nProducts'], [100, 'Ventures\nFunded']].map(([number, label], i) => <motion.div key={number} variants={fadeUp} custom={i + 2} initial="initial" animate="animate" className="text-right">
            <div className="stat-number leading-tight"><span className="align-baseline text-[0.5em] text-accent">+</span>{number}</div>
            <p className="mt-1 whitespace-pre-line text-[10px] leading-tight tracking-widest sm:text-xs md:text-sm">{label}</p>
          </motion.div>)}
        </div>
      </section>

      <section className={`flex shrink-0 flex-col gap-6 pb-8 md:gap-12 md:pb-12 ${padding}`} aria-label="Creative Studio">
        <div className="flex items-center justify-between gap-4">
          <motion.p id="story" variants={fadeUp} custom={5} initial="initial" animate="animate" className="max-w-[130px] text-[10px] tracking-widest sm:max-w-[160px] sm:text-xs md:max-w-xs md:text-sm">Shaping Bold<br />Visions Into Power<br />For Your Tribe</motion.p>
          <motion.div id="feedback" variants={fadeUp} custom={6} initial="initial" animate="animate"><Contact className="text-base tracking-wide sm:text-xl md:text-2xl" /></motion.div>
        </div>
        <div className="flex items-end justify-between gap-3 sm:gap-4">
          <motion.p id="studios" variants={fadeUp} custom={7} initial="initial" animate="animate" className="w-[120px] shrink-0 text-left text-[9px] tracking-widest sm:w-[180px] sm:text-xs md:w-[280px] md:text-right md:text-sm">Creative Studios Built Around Elevating Your Vision Into Striking Reality</motion.p>
          <h1 className="hero-heading text-right tracking-wide" aria-label="Fearless Vision Delivered">
            {['Fearless', 'Vision', 'Delivered'].map((word, i) => <span key={word} className="block overflow-hidden"><motion.span aria-hidden="true" className="block" initial={{ y: '110%' }} animate={{ y: 0 }} transition={{ delay: 0.4 + i * 0.14, duration: 0.7, ease }}>{word}</motion.span></span>)}
          </h1>
        </div>
      </section>
    </main>

    <AnimatePresence>{menuOpen && <motion.div ref={menuRef} id="studio-menu" role="dialog" aria-modal="true" aria-label="Navigation" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className={`fixed inset-0 z-50 flex flex-col bg-white pb-8 pt-5 font-semibold uppercase md:pb-12 md:pt-6 ${padding}`}>
      <div className="flex items-center justify-between"><div onClick={() => setMenuOpen(false)}><Logo /></div><button type="button" aria-label="Close menu" onClick={() => setMenuOpen(false)} className="flex h-9 w-9 items-center justify-center rounded-full bg-black text-white"><X size={20} /></button></div>
      <nav aria-label="Menu navigation" className="mt-16 flex flex-col items-start gap-8">{links.map(link => <a key={link} href={`#${link.toLowerCase()}`} onClick={() => setMenuOpen(false)} className="nav-link text-3xl tracking-widest">{link}</a>)}</nav>
      <Contact className="mt-auto self-start text-xl tracking-wide" onClick={() => setMenuOpen(false)} />
    </motion.div>}</AnimatePresence>
  </MotionConfig>;
}

createRoot(document.getElementById('root')).render(<App />);
