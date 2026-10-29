import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { ArrowRight } from 'lucide-react';
import './index.css';

const VIDEO_1 = 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260625_174131_395bc785-bb21-4e65-abf6-27c56f0764b6.mp4';
const VIDEO_2 = 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260624_055914_ee2b3b56-9a58-4885-989e-5b72a68b630d.mp4';
const links = ['Story', 'Estates', 'Lifestyle', 'Views', 'Inquire'];

function Logo({ className }: { className: string }) {
  return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="none" className={className} aria-hidden="true">
    <path d="M 256 256 L 128 256 L 0 128 L 128 128 Z M 256 128 L 128 128 L 0 0 L 128 0 Z" fill="currentColor" />
  </svg>;
}

function ExploreButton({ mobile = false, onClick }: { mobile?: boolean; onClick?: () => void }) {
  return <a href="#estates" onClick={onClick} className={`${mobile ? 'flex' : 'hidden md:flex'} group items-center gap-2 bg-white/90 backdrop-blur-sm rounded-full pl-5 pr-1.5 py-1.5 hover:bg-white transition-all shadow-lg`}>
    <span className="text-gray-800 text-xs md:text-sm font-geist font-medium tracking-wider uppercase">Explore Estates</span>
    <span className={`flex items-center justify-center w-7 h-7 ${mobile ? '' : 'md:w-8 md:h-8'} rounded-full bg-rose-200/60 group-hover:bg-rose-300/70 transition-colors`}>
      <ArrowRight className="w-3.5 h-3.5 text-gray-700" />
    </span>
  </a>;
}

function Navbar() {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (menuRef.current) menuRef.current.inert = !open;
    const previous = document.body.style.overflow;
    if (open) document.body.style.overflow = 'hidden';
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { setOpen(false); toggleRef.current?.focus(); }
      if (open && event.key === 'Tab') {
        const targets = [toggleRef.current, ...Array.from(menuRef.current?.querySelectorAll<HTMLAnchorElement>('a') ?? [])].filter(Boolean) as HTMLElement[];
        const first = targets[0]; const last = targets[targets.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
      }
    };
    const onResize = () => { if (window.innerWidth >= 768) setOpen(false); };
    window.addEventListener('keydown', onKey);
    window.addEventListener('resize', onResize);
    return () => { document.body.style.overflow = previous; window.removeEventListener('keydown', onKey); window.removeEventListener('resize', onResize); };
  }, [open]);
  return <>
    <nav aria-label="Main navigation" className="fixed top-0 left-0 right-0 z-50 px-5 md:px-12 py-4 md:py-5 flex items-center justify-between">
      <a href="#story" aria-label="Horizon Estates home" onClick={() => setOpen(false)}><Logo className="w-7 h-7 md:w-10 md:h-10 text-white relative z-50" /></a>
      <div className="hidden md:flex items-center gap-8 text-white/90 text-sm font-geist font-light tracking-wide">
        {links.map(link => <a key={link} href={`#${link.toLowerCase()}`} className="hover:text-white transition-colors">{link}</a>)}
      </div>
      <ExploreButton />
      <button ref={toggleRef} type="button" aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} aria-controls="mobile-menu" onClick={() => setOpen(!open)} className="relative z-50 md:hidden flex flex-col items-center justify-center w-10 h-10">
        <span className={`block w-5 h-[1.5px] bg-white rounded-full transition-all duration-300 ease-[cubic-bezier(0.77,0,0.18,1)] ${open ? 'rotate-45 translate-y-[3px]' : '-translate-y-[3px]'}`} />
        <span className={`block w-5 h-[1.5px] bg-white rounded-full transition-all duration-300 ease-[cubic-bezier(0.77,0,0.18,1)] ${open ? '-rotate-45 -translate-y-[0px]' : 'translate-y-[3px]'}`} />
      </button>
    </nav>
    <div ref={menuRef} id="mobile-menu" aria-hidden={!open} className={`fixed inset-0 z-40 md:hidden transition-all duration-500 ease-[cubic-bezier(0.77,0,0.18,1)] ${open ? 'visible' : 'invisible pointer-events-none'}`}>
      <div className={`absolute inset-0 bg-black/95 backdrop-blur-xl transition-opacity duration-500 ${open ? 'opacity-100' : 'opacity-0'}`} />
      <div className="relative h-full flex flex-col items-center justify-center px-8">
        <div className="flex flex-col items-center gap-6">
          {links.map((link, i) => <a key={link} href={`#${link.toLowerCase()}`} onClick={() => setOpen(false)} style={{ transitionDelay: open ? `${100 + i * 60}ms` : '0ms' }} className={`text-white text-2xl font-heading tracking-wider uppercase hover:text-white/70 transition-all duration-500 ${open ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>{link}</a>)}
        </div>
        <div className={`mt-10 transition-all duration-500 ${open ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`} style={{ transitionDelay: open ? '420ms' : '0ms' }}><ExploreButton mobile onClick={() => setOpen(false)} /></div>
      </div>
    </div>
  </>;
}

function Hero() {
  const [visible, setVisible] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const video2Ref = useRef<HTMLVideoElement>(null);
  const wasScrolled = useRef(false);
  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 200);
    return () => clearTimeout(timer);
  }, []);
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 0;
      setScrolled(isScrolled);
      const v = video2Ref.current;
      if (!v) return;
      if (isScrolled && !wasScrolled.current) { v.currentTime = 0; v.play().catch(() => {}); }
      else if (!isScrolled && wasScrolled.current) { v.pause(); }
      wasScrolled.current = isScrolled;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  const reveal = visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8';
  return <div id="story" className="relative h-[200dvh]">
    <section aria-label="Horizon Estates seaside residences" className="sticky top-0 w-full h-[100dvh] overflow-hidden">
      <video id="estates" aria-label="Seaside estate view" ref={video2Ref} muted playsInline preload="auto" src={VIDEO_2} className="absolute inset-0 w-full h-full object-cover" />
      <video aria-label="Horizon Estates coastal film" autoPlay muted loop playsInline className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${scrolled ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        <source src={VIDEO_1} type="video/mp4" />
      </video>
      <div id="lifestyle" className="absolute inset-0 flex items-center justify-center pb-[25vh] sm:pb-[30vh]">
        <div className="relative flex items-center justify-center w-[45vw] h-[45vw] max-w-[320px] max-h-[320px] md:w-[30vw] md:h-[30vw] md:max-w-[400px] md:max-h-[400px]">
          <div className={`absolute inset-0 rounded-full border border-white/35 transition-all duration-[1200ms] ease-out ${visible ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}`} style={{ transitionDelay: '0ms' }} />
          <div className={`absolute inset-[12%] rounded-full border border-white/25 transition-all duration-[1200ms] ease-out ${visible ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}`} style={{ transitionDelay: '150ms' }} />
          <div className={`transition-all duration-[1000ms] ease-out ${visible ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`} style={{ transitionDelay: '350ms' }}><Logo className="w-12 h-12 sm:w-16 sm:h-16 md:w-24 md:h-24 text-white" /></div>
        </div>
      </div>
      <div id="views" className="absolute bottom-0 left-0 right-0 pb-10 sm:pb-12 md:pb-16 px-5 sm:px-6 md:px-12 text-center">
        <h1 className={`font-heading text-white text-2xl sm:text-3xl md:text-5xl lg:text-6xl leading-[1.1] tracking-wide uppercase transition-all duration-[1000ms] ease-out ${reveal}`} style={{ transitionDelay: '600ms' }}>Where the horizon meets<br />timeless elegance</h1>
        <p id="inquire" className={`mt-3 sm:mt-4 md:mt-6 text-white/80 font-geist font-light text-xs sm:text-sm md:text-base max-w-xs sm:max-w-md mx-auto leading-relaxed transition-all duration-[1000ms] ease-out ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`} style={{ transitionDelay: '850ms' }}>Indulge in unparalleled seaside living where sophistication meets the endless shore.</p>
      </div>
    </section>
  </div>;
}

function App() { return <div className="bg-black"><Navbar /><Hero /></div>; }

createRoot(document.getElementById('root')!).render(<React.StrictMode><App /></React.StrictMode>);
