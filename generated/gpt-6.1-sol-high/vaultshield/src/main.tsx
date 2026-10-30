import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { AnimatePresence, motion, type Variants } from 'framer-motion';
import { ArrowRightCircle, Zap, LockKeyhole, Fingerprint, Menu, X } from 'lucide-react';
import './styles.css';

const links = ['Vault', 'Plans', 'Install', 'News', 'Help'];
const ease = [0.22, 1, 0.36, 1] as const;
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.15, duration: 0.6, ease } }),
};
function Logo() {
  return <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="none" overflow="visible" viewBox="0 0 256 256" aria-label="VaultShield" role="img"><path d="M 64 128 L 64.5 128 L 32 95 L 0 64 L 0 0 L 64 0 L 128 64 L 128 64.5 L 161 32 L 192 0 L 256 0 L 256 64 L 192 128 L 128 128 L 128 192 L 96 223 L 63.5 256 L 0 256 L 0 192 Z M 256 192 L 224 223 L 191.5 256 L 128 256 L 128 192 L 192 128 L 256 128 Z" fill="#192837"/></svg>;
}
function Actions() {
  return <><button type="button" className="nav-button primary">Start For Free</button><button type="button" className="nav-button login">Sign In</button></>;
}
function App() {
  const [open, setOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  const sheet = useRef<HTMLElement>(null);
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const timer = window.setTimeout(() => sheet.current?.querySelector<HTMLButtonElement>('button')?.focus(), 80);
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
      if (event.key === 'Tab') {
        const items = sheet.current?.querySelectorAll<HTMLElement>('button, a');
        if (!items?.length) return;
        const first = items[0], last = items[items.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }
    };
    const onResize = () => { if (window.innerWidth >= 768) setOpen(false); };
    window.addEventListener('keydown', onKey);
    window.addEventListener('resize', onResize);
    return () => {
      clearTimeout(timer);
      document.body.style.overflow = previous;
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('resize', onResize);
      menuButton.current?.focus();
    };
  }, [open]);
  return <main className="relative w-full min-h-screen hero" id="vault">
    <video className="absolute inset-0 w-full h-full object-cover" src={`${import.meta.env.BASE_URL}assets/vaultshield.mp4`} autoPlay muted loop playsInline aria-hidden="true" />
    <header className="relative z-10 mx-auto max-w-[1280px] px-5 sm:px-8 py-4 sm:py-5 flex items-center justify-between">
      <a href="#vault" aria-label="VaultShield home"><Logo /></a>
      <nav aria-label="Main navigation" className="hidden md:flex items-center gap-8 text-sm font-medium desktop-links">{links.map(link => <a key={link} href={`#${link.toLowerCase()}`}>{link}</a>)}</nav>
      <div className="hidden md:flex gap-3"><Actions /></div>
      <button ref={menuButton} className="md:hidden icon-button" aria-label="Open menu" aria-expanded={open} aria-controls="mobile-menu" onClick={() => setOpen(true)}><Menu size={26}/></button>
    </header>
    <section className="relative z-[1] mx-auto max-w-[1280px] px-5 sm:px-8 hero-content" aria-label="Password protection">
      <div className="max-w-[560px]">
        <motion.h1 initial="hidden" animate="visible" custom={0} variants={fadeUp}><Zap aria-hidden="true"/> Lock Down Your Passwords <LockKeyhole aria-hidden="true"/> with Ironclad Security <Fingerprint aria-hidden="true"/></motion.h1>
        <motion.p initial="hidden" animate="visible" custom={1} variants={fadeUp}>Zero stress, total control. VaultShield keeps you covered with unbreakable storage, one-tap access, and pro-grade tools for your non-stop world.</motion.p>
        <motion.div initial="hidden" animate="visible" custom={2} variants={fadeUp} className="mt-10"><motion.button type="button" className="hero-cta" whileHover={{ scale: 1.04, filter: 'brightness(1.1)' }} whileTap={{ scale: 0.96 }}>Get It Free <ArrowRightCircle size={20} aria-hidden="true"/></motion.button></motion.div>
      </div>
    </section>
    <AnimatePresence>{open && <>
      <motion.div className="menu-backdrop" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={() => setOpen(false)} aria-hidden="true"/>
      <motion.aside ref={sheet} id="mobile-menu" role="dialog" aria-modal="true" aria-label="Navigation menu" className="menu-sheet" initial={{x:'100%'}} animate={{x:0}} exit={{x:'100%'}} transition={{duration:0.45,ease}}>
        <div className="flex items-center justify-between pb-6 border-b border-[#192837]/20"><Logo/><button className="icon-button" aria-label="Close menu" onClick={() => setOpen(false)}><X size={26}/></button></div>
        <nav className="sheet-links" aria-label="Mobile navigation">{links.map((link,i) => <motion.a key={link} href={`#${link.toLowerCase()}`} initial={{opacity:0,x:20}} animate={{opacity:1,x:0}} transition={{delay:0.18+i*0.07,duration:0.4,ease}} onClick={() => setOpen(false)}>{link}</motion.a>)}</nav>
        <div className="sheet-actions"><Actions/></div>
      </motion.aside>
    </>}</AnimatePresence>
  </main>;
}
createRoot(document.getElementById('root')!).render(<React.StrictMode><App /></React.StrictMode>);
