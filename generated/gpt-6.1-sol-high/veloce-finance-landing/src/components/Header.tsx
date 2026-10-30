import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
const links = [{ label: 'Home', href: '#home' }, { label: 'About us', href: '#insights' }, { label: 'Faq', href: '#details' }];
export default function Header() {
  const [open, setOpen] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const close = (e: KeyboardEvent) => { if (e.key === 'Escape') { setOpen(false); toggle.current?.focus(); } };
    window.addEventListener('keydown', close);
    return () => window.removeEventListener('keydown', close);
  }, []);
  return <header className="sticky top-0 z-30 flex items-center justify-between px-6 py-6 md:px-12 lg:px-15">
    <div className="flex items-center gap-16">
      <a href="#home" aria-label="veloce home" className="font-manrope text-2xl font-semibold tracking-[-0.05em] text-sintra-dark md:text-3xl">veloce</a>
      <nav aria-label="Main navigation" className="hidden items-center gap-10 lg:flex">{links.map(link => <a key={link.label} href={link.href} className="font-helvetica text-base text-sintra-dark transition-opacity hover:opacity-70">{link.label}</a>)}</nav>
    </div>
    <div className="hidden items-center gap-8 font-inter text-base font-medium lg:flex"><a href="#get-app" className="text-sintra-dark transition-opacity hover:opacity-70">Log in</a><a href="#get-app" className="rounded-[40px] bg-sintra-dark px-6 py-2.5 text-sintra-light transition-opacity hover:opacity-90">Sign up</a></div>
    <button ref={toggle} onClick={() => setOpen(!open)} aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} aria-controls="mobile-navigation" className="flex h-10 w-10 items-center justify-center text-sintra-dark lg:hidden"><AnimatePresence mode="wait" initial={false}><motion.div key={open ? 'close' : 'menu'} initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>{open ? <X /> : <Menu />}</motion.div></AnimatePresence></button>
    <AnimatePresence>{open && <motion.nav id="mobile-navigation" aria-label="Mobile navigation" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut', staggerChildren: 0.1 } }} exit={{ opacity: 0, y: -20 }} className="absolute left-0 right-0 top-24 z-50 mx-4 rounded-lg bg-white px-6 py-8 shadow-lg lg:hidden">
      <div className="flex flex-col gap-6">{links.map(link => <motion.a key={link.label} variants={{ hidden: { x: -20, opacity: 0 }, visible: { x: 0, opacity: 1 } }} initial="hidden" animate="visible" transition={{ delay: links.indexOf(link) * 0.1 }} href={link.href} onClick={() => setOpen(false)} className="font-helvetica text-lg">{link.label}</motion.a>)}</div>
      <div className="mt-8 flex items-center gap-8 border-t border-gray-200 pt-6 font-inter font-medium"><a href="#get-app" onClick={() => setOpen(false)}>Log in</a><a href="#get-app" onClick={() => setOpen(false)} className="rounded-[40px] bg-sintra-dark px-6 py-2.5 text-sintra-light">Sign up</a></div>
    </motion.nav>}</AnimatePresence>
  </header>;
}
