import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
const links = ['service', 'patient resources', 'about us', 'education center'];
export default function Navbar() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const close = (event: KeyboardEvent) => { if (event.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', close);
    return () => window.removeEventListener('keydown', close);
  }, []);
  const focusSearch = () => { setOpen(false); document.getElementById('ask')?.focus({ preventScroll: true }); document.getElementById('ask')?.scrollIntoView({ behavior: 'smooth', block: 'center' }); };
  return <header className="fixed top-0 left-0 w-full z-50 py-6 md:py-10 bg-gradient-to-b from-[#f1f1f1]/80 to-transparent backdrop-blur-[2px]">
    <nav aria-label="Main navigation" className="grid grid-cols-12 max-w-7xl mx-auto items-center px-6 md:px-12 gap-4">
      <a href="#" aria-label="Mentality home" className="col-span-7 md:col-span-3 flex items-center gap-2.5 w-fit">
        <svg aria-hidden="true" viewBox="0 0 40 40" className="w-8 h-8"><path fill="#1a1a1a" d="M20 20C-7 21 1-8 20 11C39-8 47 21 20 20C47 19 39 48 20 29C1 48-7 19 20 20Z" /></svg>
        <span className="font-display text-[28px] leading-none tracking-[-1.5px] font-medium">mėntality</span>
      </a>
      <div className="hidden md:flex col-span-6 items-center justify-center gap-7 lg:gap-9">
        {links.map(link => <a key={link} href="#ask" onClick={focusSearch} className="nav-link text-[11px] lg:text-xs whitespace-nowrap">{link}</a>)}
      </div>
      <div className="col-span-5 md:col-span-3 flex items-center justify-end gap-6">
        <a href="#ask" onClick={focusSearch} className="hidden lg:block nav-link text-xs whitespace-nowrap">find help</a>
        <button onClick={focusSearch} className="hidden md:flex items-center gap-5 bg-[#1a1a1a] text-white rounded-full px-5 py-3.5 text-xs whitespace-nowrap hover:bg-zinc-700 transition-colors">get started <span aria-hidden="true">→</span></button>
        <button className="md:hidden relative w-10 h-10 flex items-center justify-center rounded-full border border-black/15" aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} aria-controls="mobile-menu" onClick={() => setOpen(!open)}>
          <motion.span animate={{ rotate: open ? 45 : 0, y: open ? 0 : -3 }} className="absolute w-4 h-px bg-zinc-900" />
          <motion.span animate={{ rotate: open ? -45 : 0, y: open ? 0 : 3 }} className="absolute w-4 h-px bg-zinc-900" />
        </button>
      </div>
    </nav>
    <AnimatePresence>{open && <motion.div id="mobile-menu" initial={{ opacity: 0, height: 0, y: -12 }} animate={{ opacity: 1, height: 'auto', y: 0 }} exit={{ opacity: 0, height: 0, y: -12 }} transition={{ duration: .25 }} className="md:hidden overflow-hidden bg-bg-base/95 backdrop-blur-xl border-b border-black/10">
      <div className="px-8 pt-8 pb-6 flex flex-col gap-5">{[...links, 'find help'].map(link => <a key={link} onClick={focusSearch} href="#ask" className="font-display text-2xl">{link} <span className="float-right text-base">↗</span></a>)}<button onClick={focusSearch} className="bg-zinc-900 text-white rounded-full py-3 mt-2">get started →</button></div>
    </motion.div>}</AnimatePresence>
  </header>;
}
