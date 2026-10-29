import React, { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom/client';
import { AnimatePresence, motion, type Variants } from 'framer-motion';
import { ArrowRightCircle, Zap, LockKeyhole, Fingerprint, Menu, X } from 'lucide-react';
import './index.css';

const links = ['Vault', 'Plans', 'Install', 'News', 'Help'];
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.15, duration: 0.6, ease: [0.22, 1, 0.36, 1] } }),
};
function Logo() {
  return <svg width="32" height="32" viewBox="0 0 256 256" fill="#192837" role="img" aria-label="Portal"><path d="M 64 128 L 64.5 128 L 32 95 L 0 64 L 0 0 L 64 0 L 128 64 L 128 64.5 L 161 32 L 192 0 L 256 0 L 256 64 L 192 128 L 128 128 L 128 192 L 96 223 L 63.5 256 L 0 256 L 0 192 Z M 256 192 L 224 223 L 191.5 256 L 128 256 L 128 192 L 192 128 L 256 128 Z" /></svg>;
}
function App() {
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const sheetRef = useRef<HTMLElement>(null);
  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement as HTMLElement;
    document.body.style.overflow = 'hidden';
    sheetRef.current?.querySelector<HTMLButtonElement>('button')?.focus();
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
      if (event.key === 'Tab') {
        const items = sheetRef.current?.querySelectorAll<HTMLElement>('button, a');
        if (!items?.length) return;
        const first = items[0], last = items[items.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }
    };
    const desktop = window.matchMedia('(min-width: 768px)');
    const closeOnDesktop = () => { if (desktop.matches) setOpen(false); };
    desktop.addEventListener('change', closeOnDesktop);
    document.addEventListener('keydown', handleKey);
    return () => { document.body.style.overflow = ''; document.removeEventListener('keydown', handleKey); desktop.removeEventListener('change', closeOnDesktop); previous?.focus(); };
  }, [open]);

  return <div className="portal-page relative min-h-[100svh] overflow-hidden">
    <video className="absolute inset-0 z-0 w-full h-full object-cover" src={`${import.meta.env.BASE_URL}assets/portal-background.mp4`} autoPlay muted loop playsInline aria-hidden="true" />
    <div {...(open ? { inert: '' } : {})}>
      <nav aria-label="Main navigation" className="relative z-10 flex items-center justify-between max-w-[1280px] mx-auto px-5 sm:px-8 py-4 sm:py-5">
        <a href="#" aria-label="Portal home"><Logo /></a>
        <div className="hidden md:flex items-center gap-8">{links.map(link => <a key={link} href="#" className="text-sm font-medium transition-opacity hover:opacity-70">{link}</a>)}</div>
        <div className="hidden md:flex items-center gap-3"><button className="nav-cta primary">Start For Free</button><button className="nav-cta login">Sign In</button></div>
        <button ref={toggleRef} type="button" className="md:hidden p-2 -mr-2 rounded-full hover:bg-black/5" aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} aria-controls="mobile-menu" onClick={() => setOpen(!open)}>{open ? <X size={24} /> : <Menu size={24} />}</button>
      </nav>
      <main className="hero relative z-10 max-w-[1280px] mx-auto px-5 text-center">
        <div className="max-w-[660px] mx-auto flex flex-col items-center">
          <motion.h1 variants={fadeUp} initial="hidden" animate="visible" custom={0}><span className="whitespace-nowrap">Lock <Zap size={24} aria-hidden="true" /> Down Your <LockKeyhole size={24} aria-hidden="true" /> Passwords</span><br /><span>with Ironclad Security <Fingerprint className="fingerprint" size={24} aria-hidden="true" /></span></motion.h1>
          <motion.p variants={fadeUp} initial="hidden" animate="visible" custom={1}>Zero stress, total control. Unbreakable storage, one-tap access, and pro-grade tools for your non-stop world.</motion.p>
          <motion.button type="button" className="hero-cta flex items-center justify-between" variants={fadeUp} initial="hidden" animate="visible" custom={2} whileHover={{ scale: 1.04, filter: 'brightness(1.1)' }} whileTap={{ scale: 0.96 }}>Get It Free <ArrowRightCircle size={20} aria-hidden="true" /></motion.button>
        </div>
      </main>
    </div>
    <AnimatePresence>
      {open && <>
        <motion.div className="fixed inset-0 z-40" style={{ background: 'rgba(25,40,55,0.35)', backdropFilter: 'blur(4px)' }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} onClick={() => setOpen(false)} aria-hidden="true" />
        <motion.aside id="mobile-menu" ref={sheetRef} role="dialog" aria-modal="true" aria-label="Navigation menu" className="mobile-sheet fixed right-0 top-0 z-50 flex flex-col" initial={{ x: '100%' }} animate={{ x: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } }} exit={{ x: '100%', transition: { duration: 0.35, ease: [0.55, 0, 1, 0.45] } }}>
          <div className="flex items-center justify-between p-6"><Logo /><motion.button aria-label="Close menu" className="flex items-center justify-center rounded-full w-10 h-10 bg-[#192837]/10" whileTap={{ scale: 0.9 }} onClick={() => setOpen(false)}><X size={20} /></motion.button></div>
          <div className="mx-6 border-t border-[#192837]/[0.12]" />
          <nav aria-label="Mobile navigation" className="flex flex-col gap-2 px-4 py-6">{links.map((link, i) => <motion.a key={link} href="#" className="rounded-xl px-4 py-3 text-[1.1rem] font-medium hover:bg-black/10" initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.18 + i * 0.07, duration: 0.4 }} onClick={() => setOpen(false)}>{link}</motion.a>)}</nav>
          <div className="flex flex-col gap-3 px-6 pb-8 mt-auto"><button className="sheet-cta primary" onClick={() => setOpen(false)}>Start For Free</button><button className="sheet-cta login" onClick={() => setOpen(false)}>Sign In</button></div>
        </motion.aside>
      </>}
    </AnimatePresence>
  </div>;
}
ReactDOM.createRoot(document.getElementById('root')!).render(<React.StrictMode><App /></React.StrictMode>);
