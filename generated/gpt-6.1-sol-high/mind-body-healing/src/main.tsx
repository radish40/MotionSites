import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { CircleUserRound, Menu, X } from 'lucide-react';
import './style.css';

const videoUrl = 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260715_082433_69699cf8-444b-4484-93cc-053e57896dfd.mp4';
const avatars = ['774909', '1222271', '1239291', '697509'];
const links = ['Home', 'Our Approach', 'Healing Methods'];

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { setMenuOpen(false); toggleRef.current?.focus(); }
      if (event.key === 'Tab') {
        const items = [toggleRef.current, ...Array.from(menuRef.current?.querySelectorAll<HTMLAnchorElement>('a') ?? [])].filter(Boolean) as HTMLElement[];
        const index = items.indexOf(document.activeElement as HTMLElement);
        event.preventDefault();
        items[(index + (event.shiftKey ? -1 : 1) + items.length) % items.length]?.focus();
      }
    };
    const onResize = () => { if (window.innerWidth >= 768) setMenuOpen(false); };
    window.addEventListener('keydown', onKey);
    window.addEventListener('resize', onResize);
    return () => { window.removeEventListener('keydown', onKey); window.removeEventListener('resize', onResize); };
  }, [menuOpen]);

  return <section className="hero relative isolate flex h-screen min-h-[560px] flex-col overflow-hidden bg-[#263b33] text-white">
    <video className="absolute inset-0 h-full w-full object-cover" src={videoUrl} autoPlay loop muted playsInline aria-hidden="true" />
    <div className="hero-shade pointer-events-none absolute inset-0" />
    <header className="relative z-20 flex items-center justify-between px-5 pt-6 sm:px-8 sm:pt-8 md:px-16 lg:px-20">
      <a href="#home" aria-label="Vibrant Wellness home" className="block" onClick={() => setMenuOpen(false)}>
        <svg className="h-8 w-8 md:h-9 md:w-9" viewBox="0 0 256 256" fill="currentColor" aria-hidden="true"><path d="M 128 128 C 198.692 128 256 185.308 256 256 L 151.883 256 C 149.812 220.307 120.213 192 84 192 C 47.787 192 18.188 220.307 16.117 256 L 0 256 C 0 185.308 57.308 128 128 128 Z M 104.117 0 C 106.188 35.694 135.787 64 172 64 C 208.213 64 237.812 35.694 239.883 0 L 256 0 C 256 70.692 198.692 128 128 128 C 57.308 128 0 70.692 0 0 Z" /></svg>
      </a>
      <nav aria-label="Main navigation" className="liquid-glass hidden items-center gap-8 rounded-full px-8 py-3 md:flex">
        {links.map((link, i) => <a key={link} href={`#${['home', 'approach', 'healing'][i]}`} className={`whitespace-nowrap text-sm font-medium transition-opacity hover:opacity-100 ${i ? 'text-white/70' : 'text-white'}`}>{link}</a>)}
      </nav>
      <div className="liquid-glass hidden h-10 w-10 items-center justify-center rounded-full md:flex" aria-label="Account"><CircleUserRound className="h-5 w-5 text-white/80" strokeWidth={1.5} /></div>
      <button ref={toggleRef} className="liquid-glass relative z-50 flex h-10 w-10 items-center justify-center rounded-full md:hidden" aria-label={menuOpen ? 'Close menu' : 'Open menu'} aria-expanded={menuOpen} aria-controls="mobile-menu" onClick={() => setMenuOpen(!menuOpen)}>
        <Menu strokeWidth={1.5} className={`absolute h-5 w-5 transition-all duration-300 ${menuOpen ? 'rotate-90 scale-0 opacity-0' : 'rotate-0 scale-100 opacity-100'}`} />
        <X strokeWidth={1.5} className={`absolute h-5 w-5 transition-all duration-300 ${menuOpen ? 'rotate-0 scale-100 opacity-100' : '-rotate-90 scale-0 opacity-0'}`} />
      </button>
    </header>
    <div ref={menuRef} id="mobile-menu" aria-hidden={!menuOpen} inert={!menuOpen} className={`fixed inset-0 z-10 flex items-center justify-center bg-black/80 backdrop-blur-xl transition-opacity duration-500 ease-out md:hidden ${menuOpen ? 'opacity-100' : 'pointer-events-none opacity-0'}`}>
      <nav aria-label="Mobile navigation" className={`flex flex-col items-center gap-8 transition-transform duration-500 ease-out ${menuOpen ? 'translate-y-0' : '-translate-y-8'}`}>
        {links.map((link, i) => <a key={link} href={`#${['home', 'approach', 'healing'][i]}`} onClick={() => setMenuOpen(false)} className="text-2xl font-medium">{link}</a>)}
        <div className="mt-2 flex items-center gap-3"><div className="liquid-glass flex h-10 w-10 items-center justify-center rounded-full"><CircleUserRound className="h-5 w-5 text-white/80" strokeWidth={1.5} /></div><span className="text-sm font-light text-white/60">Account</span></div>
      </nav>
    </div>
    <main id="home" inert={menuOpen} className={`relative z-[1] flex min-h-0 flex-1 flex-col justify-between px-5 pb-8 transition-opacity duration-500 sm:px-8 sm:pb-10 md:px-16 md:pb-12 lg:px-20 ${menuOpen ? 'pointer-events-none opacity-0 md:opacity-100' : 'opacity-100'}`}>
      <div id="approach" className="mt-14 max-w-2xl sm:mt-20 md:mt-28">
        <div className="liquid-glass mb-5 inline-flex items-center gap-2.5 rounded-full px-3 py-1.5 sm:mb-6 sm:gap-3 sm:px-4 sm:py-2">
          <div className="flex -space-x-2" aria-hidden="true">{avatars.map(id => <img key={id} className="liquid-glass h-5 w-5 rounded-full border-2 border-white/20 object-cover sm:h-6 sm:w-6" src={`https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=100`} alt="" />)}</div>
          <span className="text-xs font-light text-white/80 sm:text-sm">our path to natural wellness</span>
        </div>
        <h1 className="text-4xl font-normal leading-[1.05] sm:text-5xl md:text-6xl lg:text-7xl" style={{ letterSpacing: '-0.05em' }}>Heal Your Body<br />Naturally</h1>
        <p className="mt-4 text-sm font-light text-white/70 sm:mt-5 sm:text-base md:text-lg">Holistic wellness. Transformative results.</p>
        <button className="liquid-glass mt-6 rounded-full px-6 py-3 text-sm font-medium text-white transition-colors duration-300 hover:bg-white/10 sm:mt-8 sm:px-7 sm:py-3.5">Begin Your Journey</button>
      </div>
      <div id="healing" className="flex items-end gap-6 sm:gap-10 md:gap-16">
        <div><div className="relative mb-3 h-5 w-5" aria-hidden="true">{[[9,0],[6,5],[12,5],[3,10],[9,10],[15,10],[0,15],[6,15],[12,15]].map(([left,top],i) => <span key={i} className="absolute h-[2.5px] w-[2.5px] bg-white/60" style={{left,top}} />)}</div><p className="text-xl font-normal sm:text-2xl md:text-3xl">48 Hours</p><p className="mt-1 text-xs font-light text-white/60 sm:text-sm">Initial Consultation</p></div>
        <div><div className="mb-3 grid h-5 w-5 grid-cols-3 content-center gap-[2px]" aria-hidden="true">{Array.from({length:9},(_,i) => <span key={i} className={`h-1 w-1 rounded-[1px] ${i % 2 ? 'bg-white/0' : 'bg-white/60'}`} />)}</div><p className="text-xl font-normal sm:text-2xl md:text-3xl">Initial Consultation</p><p className="mt-1 text-xs font-light text-white/60 sm:text-sm">Healing Sessions</p></div>
      </div>
    </main>
  </section>;
}
createRoot(document.getElementById('root')!).render(<React.StrictMode><App /></React.StrictMode>);
