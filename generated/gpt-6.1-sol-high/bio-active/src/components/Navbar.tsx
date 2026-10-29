import { useEffect, useState } from 'react';
import { ArrowRight, Menu, X } from 'lucide-react';
const links = ['Science', 'Treatments', 'Results', 'Testimonials', 'Connect'];
export default function Navbar({ isActive }: { isActive: boolean }) {
  const [open, setOpen] = useState(false);
  useEffect(() => { const close = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); }; window.addEventListener('keydown', close); return () => window.removeEventListener('keydown', close); }, []);
  function navigate() { setOpen(false); window.dispatchEvent(new Event('lumiderm:science')); }
  const booking = <a href="#connect" onClick={navigate} className="inline-flex items-center justify-center gap-3 rounded-full bg-[#5794E2] px-5 py-2 text-sm text-white transition-colors hover:bg-[#4a84d0]">Book Now<ArrowRight size={16} strokeWidth={1.6} /></a>;
  return <>
    <header className={`fixed left-0 right-0 top-4 z-50 px-4 transition-all duration-700 delay-300 sm:top-6 ${isActive ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0 pointer-events-none'}`}>
      <nav aria-label="Main navigation" className="mx-auto flex w-full items-center justify-between gap-2 rounded-full border border-white/15 bg-white/10 p-2 backdrop-blur-md sm:w-fit sm:gap-5">
        <a href="#" onClick={() => { setOpen(false); window.dispatchEvent(new Event('lumiderm:home')); }} aria-label="LumiDerm home" className="pl-4 pr-3 text-base tracking-tight text-white"><span className="font-bold">Lumi</span><span className="font-light">Derm</span></a>
        <div className="hidden items-center md:flex">{links.map(link => <a key={link} href={`#${link.toLowerCase()}`} onClick={navigate} className="rounded-full px-4 py-1.5 text-sm text-white/80 transition-colors hover:bg-white/10 hover:text-white">{link}</a>)}</div>
        <div className="hidden sm:flex">{booking}</div>
        <button className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white md:hidden" aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} aria-controls="mobile-menu" onClick={() => setOpen(!open)}>{open ? <X size={18}/> : <Menu size={18}/>}</button>
      </nav>
    </header>
    <div id="mobile-menu" inert={!open} className={`fixed inset-0 z-40 flex flex-col items-center justify-center gap-6 bg-black/90 backdrop-blur-lg transition-opacity duration-300 md:hidden ${open ? 'opacity-100' : 'pointer-events-none opacity-0'}`}>
      {links.map(link => <a key={link} href={`#${link.toLowerCase()}`} onClick={navigate} className="text-2xl font-light text-white/80 hover:text-white">{link}</a>)}
      <div className="mt-3">{booking}</div>
    </div>
  </>;
}
