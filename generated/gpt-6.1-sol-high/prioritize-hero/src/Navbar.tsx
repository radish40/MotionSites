import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import Logo from './Logo';
export const links = ['Features', 'Solutions', 'Resources', 'Pricing'];
export default function Navbar({ onAction }: { onAction: (name: string) => void }) {
  const [open, setOpen] = useState(false);
  const act = (name: string) => { setOpen(false); onAction(name); };
  return <header className="relative z-50 bg-[#FDFDFD] px-6 py-6 md:px-12">
    <nav aria-label="Main navigation" className="flex items-center justify-between">
      <a href="#" aria-label="Prioritize home" className="flex items-center gap-2.5"><Logo/><span className="text-xl tracking-tight">Prioritize</span></a>
      <div className="desktop-links hidden items-center gap-9 md:flex">{links.map(link => <button key={link} onClick={() => act(link)} className="nav-link">{link}</button>)}</div>
      <div className="hidden items-center gap-7 md:flex"><button className="nav-link" onClick={() => act('Sign in')}>Sign in</button><button onClick={() => act('Try for free')} className="rounded-xl border border-black/10 bg-white px-5 py-3 text-sm hover:bg-gray-50">Try for free</button></div>
      <button className="menu-toggle p-2 md:hidden" aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} aria-controls="mobile-menu" onClick={() => setOpen(!open)}>{open ? <X/> : <Menu/>}</button>
    </nav>
    <AnimatePresence>{open && <motion.div id="mobile-menu" initial={{opacity:0,y:-8}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-8}} className="absolute left-0 top-full flex w-full flex-col gap-1 border-b border-black/10 bg-white p-6 shadow-xl md:hidden">{links.map(link => <button key={link} className="nav-link py-3 text-left" onClick={() => act(link)}>{link}</button>)}<hr className="my-3 border-black/10"/><button className="py-3 text-gray-500" onClick={() => act('Sign in')}>Sign in</button><button className="primary-button" onClick={() => act('Try for free')}>Try for free</button></motion.div>}</AnimatePresence>
  </header>;
}
