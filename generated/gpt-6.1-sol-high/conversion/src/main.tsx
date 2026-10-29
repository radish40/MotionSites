import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { ChevronDown, Download, Menu, X } from 'lucide-react';
import './index.css';

const videoUrl = 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260613_235144_2f72690f-ad2d-4b1d-9dc1-96fc97d01ca5.mp4';
const qrUrl = 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260614_015530_9919c38f-0eff-4385-b433-4f14fbf00c73.png&w=1280&q=85';
const links = [['Overview', '#overview'], ['Docs', '#docs'], ['Our Team', '#team'], ['Upgrade', '#upgrade']];
const linkClass = 'text-sm font-medium text-gray-800 hover:text-gray-600 transition-colors';
const ctaClass = 'inline-flex items-center justify-center gap-2 bg-[#4CAF50] hover:bg-[#43A047] text-white text-sm font-semibold px-5 py-2.5 rounded-full transition-colors';
function Language() {
  return <div className="flex items-center gap-2 text-sm text-gray-900" aria-label="Languages: German, English"><span className="flex items-center justify-center w-5 h-4 rounded-sm bg-black text-white text-[10px]">DE</span><span className="font-medium">EN</span></div>;
}
function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  const handleCloseMenu = () => setMenuOpen(false);
  useEffect(() => { if (menuOpen) setMenuVisible(true); }, [menuOpen]);
  useEffect(() => {
    const escape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && menuOpen) { handleCloseMenu(); menuButton.current?.focus(); }
    };
    window.addEventListener('keydown', escape);
    return () => window.removeEventListener('keydown', escape);
  }, [menuOpen]);
  return (
    <section className="relative w-full h-screen overflow-hidden font-inter bg-gray-100" aria-label="Zipwire.Dev">
      <video className="absolute inset-0 w-full h-full object-cover" autoPlay muted loop playsInline aria-hidden="true" onError={event => { const video = event.currentTarget; if (!video.src.includes('/assets/background.mp4')) { video.src = `${import.meta.env.BASE_URL}assets/background.mp4`; video.load(); } }} src={videoUrl} />
      <div className="relative z-10 flex flex-col h-full">
        <header className="flex items-center justify-between px-5 sm:px-6 md:px-12 lg:px-16 py-4 md:py-5 animate-nav">
          <a href="#overview" aria-label="Zipwire.Dev home" className="text-xl sm:text-2xl font-bold text-gray-900 whitespace-nowrap"><span className="font-qanelas italic">Zipwire.</span><span className="font-inter font-normal text-gray-600">Dev</span></a>
          <nav className="hidden md:flex items-center gap-8" aria-label="Main navigation">{links.map(([label, href]) => <a key={href} href={href} className={linkClass}>{label}</a>)}</nav>
          <div className="hidden md:flex items-center gap-5"><Language /><a href="#try-now" className={ctaClass}><Download className="w-4 h-4" />Get It Today</a></div>
          <button ref={menuButton} type="button" className="md:hidden text-gray-900" onClick={() => setMenuOpen(open => !open)} aria-label={menuOpen ? 'Close menu' : 'Open menu'} aria-expanded={menuOpen} aria-controls="mobile-menu">
            <span className="relative block w-6 h-6"><Menu className={`absolute inset-0 w-6 h-6 transition-all duration-300 ${menuOpen ? 'opacity-0 rotate-90' : 'opacity-100 rotate-0'}`} /><X className={`absolute inset-0 w-6 h-6 transition-all duration-300 ${menuOpen ? 'opacity-100 rotate-0' : 'opacity-0 -rotate-90'}`} /></span>
          </button>
        </header>
        {menuVisible && <nav id="mobile-menu" aria-label="Mobile navigation" className={`md:hidden absolute top-[60px] left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-lg ${menuOpen ? 'mobile-menu-enter' : 'mobile-menu-exit'}`} onAnimationEnd={event => { if (event.target === event.currentTarget && !menuOpen) setMenuVisible(false); }}>
          <div className="flex flex-col px-5 py-5 gap-5">{links.map(([label, href]) => <a key={href} href={href} onClick={handleCloseMenu} className={linkClass}>{label}</a>)}<div className="flex items-center justify-between pt-5 border-t border-gray-200"><Language /><a href="#try-now" onClick={handleCloseMenu} className={ctaClass}><Download className="w-4 h-4" />Get It Today</a></div></div>
        </nav>}
        <main id="overview" className="flex-1 flex flex-col items-center justify-start pt-20 sm:pt-24 md:pt-24 px-4 sm:px-6">
          <h1 className="font-qanelas uppercase text-center tracking-tight text-gray-900 text-[2.5rem] leading-[0.95] sm:text-5xl md:text-7xl lg:text-8xl xl:text-[110px] animate-hero-1">Push.Route.Deploy</h1>
          <p className="mt-4 sm:mt-5 md:mt-7 text-center text-gray-700 font-medium leading-relaxed max-w-2xl px-2 text-sm sm:text-base md:text-lg lg:text-xl animate-hero-2">Get Full Mesh Data Streams, Automatic UDP Hole Punching, Granular Controls, And Many More Cool Tricks!</p>
          <div id="try-now" className="mt-6 sm:mt-8 md:mt-10 flex flex-col items-center animate-hero-3">
            <div className="rounded-xl p-1.5 inline-flex flex-col items-center bg-[#4CAF50]"><img src={qrUrl} alt="Scan the QR code to try Zipwire" className="rounded-lg object-cover w-28 h-28 sm:w-36 sm:h-36 md:w-40 md:h-40" onError={event => { const img = event.currentTarget; if (!img.src.includes('/assets/qr.webp')) img.src = `${import.meta.env.BASE_URL}assets/qr.webp`; }} /><span className="text-white text-[11px] sm:text-xs font-semibold mt-1.5 sm:mt-2 mb-0.5 tracking-wide">Try Now</span></div>
          </div>
        </main>
        <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 animate-bounce" aria-hidden="true"><ChevronDown className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" /></div>
      </div>
    </section>
  );
}
createRoot(document.getElementById('root')!).render(<React.StrictMode><App /></React.StrictMode>);
