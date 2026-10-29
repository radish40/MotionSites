import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { ArrowRight, Menu, X } from 'lucide-react';
import './index.css';

const navigation = ['Home', 'Projects', 'Studio', 'Reach Us'];
const videoUrl = 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260622_204221_5339e40b-e73d-4ab0-9c65-79c18c66fd50.mp4';

function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const toggleRef = useRef(null);
  const menuRef = useRef(null);

  useEffect(() => {
    const media = window.matchMedia('(min-width: 768px)');
    const closeOnDesktop = () => { if (media.matches) setMobileMenuOpen(false); };
    media.addEventListener('change', closeOnDesktop);
    return () => media.removeEventListener('change', closeOnDesktop);
  }, []);

  useEffect(() => {
    if (!mobileMenuOpen) return;
    const handleKey = (event) => {
      if (event.key === 'Escape') {
        setMobileMenuOpen(false);
        toggleRef.current?.focus();
      }
      if (event.key === 'Tab') {
        const links = [...menuRef.current.querySelectorAll('a')];
        const first = toggleRef.current;
        const last = links[links.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault(); last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault(); first.focus();
        }
      }
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [mobileMenuOpen]);

  return (
    <div className="ocean-page relative h-screen w-full overflow-hidden bg-black font-geist">
      <video className="absolute h-full w-full object-cover object-[70%_center]" autoPlay muted loop playsInline aria-hidden="true" src={videoUrl} />

      <header className="relative z-30 flex items-center justify-between px-6 py-5 md:px-12 lg:px-16">
        <div className="flex items-center gap-12">
          <a href="#" className="text-lg font-semibold tracking-tight text-white sm:text-xl" aria-label="Foldcraft home">Foldcraft</a>
          <nav aria-label="Main navigation" className="hidden items-center gap-8 md:flex">
            {navigation.map((label) => <a key={label} href="#" className="text-sm text-white/80 transition-colors hover:text-white">{label}</a>)}
          </nav>
        </div>
        <a href="#" className="hidden rounded-lg bg-white px-5 py-2 text-sm font-medium text-black transition-transform hover:scale-105 md:inline-flex">Let's Talk</a>
        <button ref={toggleRef} type="button" aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'} aria-expanded={mobileMenuOpen} aria-controls="mobile-menu" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="relative z-50 flex h-10 w-10 items-center justify-center text-white transition-transform active:scale-90 md:hidden">
          <Menu aria-hidden="true" size={24} className={`absolute transition-all duration-300 ${mobileMenuOpen ? 'rotate-90 scale-50 opacity-0' : 'rotate-0 scale-100 opacity-100'}`} />
          <X aria-hidden="true" size={24} className={`absolute transition-all duration-300 ${mobileMenuOpen ? 'rotate-0 scale-100 opacity-100' : '-rotate-90 scale-50 opacity-0'}`} />
        </button>
      </header>

      <nav id="mobile-menu" ref={menuRef} aria-label="Mobile navigation" aria-hidden={!mobileMenuOpen} inert={!mobileMenuOpen ? true : undefined} data-open={mobileMenuOpen} className={`mobile-menu absolute inset-x-0 top-0 z-20 overflow-hidden bg-black/[0.98] backdrop-blur-xl transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] md:hidden ${mobileMenuOpen ? 'h-screen opacity-100' : 'pointer-events-none h-0 opacity-0'}`}>
        <div className={`flex h-full flex-col items-start justify-center gap-6 px-8 transition-all duration-500 ${mobileMenuOpen ? 'translate-y-0 opacity-100 delay-100' : 'translate-y-8 opacity-0'}`}>
          {navigation.map((label) => <a key={label} href="#" onClick={() => setMobileMenuOpen(false)} className="text-3xl font-medium text-white/90 transition-colors hover:text-white">{label}</a>)}
          <a href="#" onClick={() => setMobileMenuOpen(false)} className="mt-6 rounded-full bg-white px-8 py-3.5 text-base font-medium text-black transition-transform hover:scale-105">Let's Talk</a>
        </div>
      </nav>

      <main inert={mobileMenuOpen ? true : undefined} className="hero-content relative z-10 flex h-[calc(100vh-80px)] flex-col justify-between px-6 pb-10 pt-12 sm:pb-12 sm:pt-16 md:px-12 md:pb-16 md:pt-20 lg:px-16">
        <div className="max-w-3xl">
          <p className="mb-4 animate-[fadeSlideUp_0.8s_ease_0.2s_both] text-xs text-white/90 sm:mb-6 sm:text-sm">Brand &amp; Visual Storytelling</p>
          <h1 className="animate-[fadeSlideUp_0.8s_ease_0.4s_both] text-3xl font-medium leading-[1.1] tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">Shaping visual<br />narratives,<br />one pixel at a time.</h1>
        </div>
        <div>
          <p className="mb-5 max-w-sm animate-[fadeSlideUp_0.8s_ease_0.7s_both] text-sm leading-relaxed text-white/60 sm:mb-6 sm:max-w-lg sm:text-base md:text-lg">Turning vision into reality through craft, motion, and an endless pursuit of beauty.</p>
          <a href="#" className="inline-flex animate-[fadeSlideUp_0.8s_ease_0.9s_both] items-center gap-2 rounded-lg bg-white px-5 py-2.5 text-sm font-medium text-black transition-transform hover:scale-105 sm:px-6 sm:py-3">Explore Work <ArrowRight size={16} aria-hidden="true" /></a>
        </div>
      </main>
    </div>
  );
}

createRoot(document.getElementById('root')).render(<App />);
