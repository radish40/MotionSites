import { useEffect, useRef, useState } from 'react';
import { Menu, X } from 'lucide-react';
import Logo from './Logo';

const links = ['Projects', 'The Team', 'Products', 'Our Story', 'Say Hello!'];
const pill = 'inline-flex items-center justify-center rounded-full bg-brand-dark text-white font-medium shadow-sm hover:bg-black transition-colors';
// Destination placeholders: the brief specifies the hero only, with no routes or contact address.
const destination = (label: string) => '#' + label.toLowerCase().replace(/[^a-z ]/g, '').replace(/ /g, '-');

export default function Hero() {
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!menuOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false);
      if (event.key === 'Tab') {
        const items = dialogRef.current?.querySelectorAll<HTMLElement>('a, button');
        if (!items?.length) return;
        const first = items[0], last = items[items.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener('keydown', onKey);
    return () => { document.body.style.overflow = previous; document.removeEventListener('keydown', onKey); toggleRef.current?.focus(); };
  }, [menuOpen]);

  return <section className="relative isolate h-screen min-h-[600px] overflow-hidden bg-white" aria-labelledby="hero-heading">
    <video className="absolute inset-0 h-full w-full object-cover" src={`${import.meta.env.BASE_URL}assets/venture.mp4`} autoPlay muted loop playsInline aria-hidden="true" />
    <header className="relative z-20 flex items-center justify-between px-6 pt-6 md:px-12 md:pt-8 lg:px-16">
      <a href="#" className="flex items-center gap-2 text-lg tracking-tight text-brand-dark md:text-xl" aria-label="Speakup home"><Logo className="h-8 w-8 md:h-9 md:w-9" /><span><span className="font-bold">SPEAK</span><span className="font-black">UP</span></span></a>
      <nav className="hidden items-center gap-8 lg:flex xl:gap-10" aria-label="Main navigation">{links.map(label => <a key={label} href={destination(label)} className="text-sm font-medium text-brand-dark transition-colors hover:text-brand-green">{label}</a>)}</nav>
      <a href="#begin-a-venture" className={`${pill} hidden px-7 py-3.5 text-sm lg:inline-flex`}>Begin a venture</a>
      <button ref={toggleRef} type="button" onClick={() => setMenuOpen(true)} className="p-2 text-brand-dark transition-colors hover:text-brand-green lg:hidden" aria-label="Open menu" aria-expanded={menuOpen} aria-controls="mobile-menu"><Menu size={28} /></button>
    </header>
    <div className="relative z-10 mt-8 max-w-7xl px-6 md:mt-16 md:px-12 lg:mt-24 lg:px-16">
      <h1 id="hero-heading" className="font-recoleta text-[56px] font-normal leading-[1.05] tracking-tight text-brand-green sm:text-7xl md:text-8xl lg:text-[128px]">Crafting the<br />improbable</h1>
      <p className="mt-6 max-w-md font-inter text-base leading-[1.5] text-brand-dark md:mt-8 md:text-lg">We bring your boldest digital visions to reality.<br className="hidden sm:block" />{' '}Because it cannot be done is where we all begin now</p>
      <a href="#begin-a-venture" className={`${pill} mt-8 px-10 py-4 text-base shadow-md md:mt-10`}>Begin a venture</a>
    </div>
    {menuOpen && <div id="mobile-menu" ref={dialogRef} role="dialog" aria-modal="true" aria-label="Navigation menu" className="fixed inset-0 z-50 flex flex-col bg-white px-6 py-6 md:px-12 md:py-8">
      <div className="flex justify-end"><button ref={closeRef} onClick={() => setMenuOpen(false)} type="button" aria-label="Close menu" className="p-2 text-brand-dark transition-colors hover:text-brand-green"><X size={28} /></button></div>
      <nav aria-label="Mobile navigation" className="flex flex-1 flex-col items-center justify-center gap-7">{links.map(label => <a key={label} href={destination(label)} onClick={() => setMenuOpen(false)} className="text-2xl font-medium text-brand-dark transition-colors hover:text-brand-green">{label}</a>)}<a href="#begin-a-venture" onClick={() => setMenuOpen(false)} className={`${pill} mt-4 px-7 py-3.5 text-sm`}>Begin a venture</a></nav>
    </div>}
  </section>;
}