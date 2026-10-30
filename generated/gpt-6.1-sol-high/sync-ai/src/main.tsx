import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import { ChevronDown, Menu, Star, X } from 'lucide-react';
import './index.css';

const entrance = (delay: number) => ({ animationDelay: `${delay}s`, opacity: 0 });

function App() {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false);
    };
    const closeOnResize = () => {
      if (window.innerWidth >= 640) setMenuOpen(false);
    };
    window.addEventListener('keydown', closeOnEscape);
    window.addEventListener('resize', closeOnResize);
    return () => {
      window.removeEventListener('keydown', closeOnEscape);
      window.removeEventListener('resize', closeOnResize);
    };
  }, []);

  const navigation = (
    <>
      <button type="button" className="nav-button">Solutions <ChevronDown className="h-4 w-4" /></button>
      <button type="button" className="nav-button">For Teams <ChevronDown className="h-4 w-4" /></button>
      <button type="button" className="nav-button">About Us</button>
      <button type="button" className="nav-button">Learn Hub</button>
    </>
  );

  return (
    <main className="relative h-screen w-full overflow-hidden bg-white">
      <video
        className="pointer-events-none absolute inset-0 h-full w-full object-cover pt-[120px] md:pt-[200px]"
        autoPlay loop muted playsInline preload="auto" aria-hidden="true"
        src={`${import.meta.env.BASE_URL}assets/stellar-background.mp4`}
      />
      <div className="pointer-events-none absolute inset-x-0 top-[120px] z-10 h-[200px] bg-gradient-to-b from-white to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 top-[200px] z-10 hidden h-[300px] bg-gradient-to-b from-white to-transparent md:block" />
      <div className="pointer-events-none absolute inset-x-0 top-[120px] z-10 h-[200px] bg-gradient-to-b from-white to-transparent md:hidden" />

      <header className="relative z-20">
        <nav aria-label="Main navigation" className="animate-fade-in-up mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6" style={entrance(0.1)}>
          <a href={import.meta.env.BASE_URL} aria-label="Stellar.ai home" className="flex items-center gap-2 text-lg font-semibold">
            <Star className="h-5 w-5 fill-black" aria-hidden="true" />
            Stellar.ai
          </a>
          <div className="hidden items-center gap-8 md:flex">{navigation}</div>
          <div className="hidden items-center gap-4 sm:flex">
            <button type="button" className="nav-button">Login</button>
            <button type="button" className="rounded-full bg-black px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-gray-800">Get started free</button>
          </div>
          <button type="button" className="sm:hidden" aria-label={menuOpen ? 'Close menu' : 'Open menu'} aria-expanded={menuOpen} aria-controls="mobile-menu" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </nav>
      </header>

      {menuOpen && (
        <nav id="mobile-menu" aria-label="Mobile navigation" className="animate-fade-in-overlay absolute inset-x-0 top-[60px] z-30 flex flex-col gap-4 border-b border-gray-200 bg-white/95 px-6 py-4 backdrop-blur-md sm:hidden">
          {navigation}
          <div className="flex flex-col items-start gap-4 border-t border-gray-200 pt-4">
            <button type="button" className="nav-button">Login</button>
            <button type="button" className="w-full rounded-full bg-black px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-gray-800">Get started free</button>
          </div>
        </nav>
      )}

      <section aria-labelledby="hero-heading" className="relative z-20 mx-auto max-w-7xl px-4 pb-16 pt-6 text-center sm:px-6 sm:pb-32 sm:pt-12">
        <div className="animate-fade-in-up mb-5 inline-flex items-center gap-2 sm:mb-8" style={entrance(0.2)}>
          <span className="flex h-6 w-6 items-center justify-center rounded border border-gray-300"><Star className="h-4 w-4 fill-black" aria-hidden="true" /></span>
          <span className="text-xs font-medium text-black sm:text-sm">4.9 rating from 18.3K+ users</span>
        </div>
        <h1 id="hero-heading" className="animate-fade-in-up mb-4 text-[38px] font-normal leading-[1.1] tracking-tight sm:mb-5 sm:text-6xl md:text-7xl lg:text-[80px]" style={entrance(0.3)}>
          <span className="sm:hidden">Work Smarter.<br />Move Faster.<br /></span>
          <span className="hidden sm:inline">Work Smarter. Move Faster.<br /></span>
          <span className="bg-gradient-to-r from-black via-gray-500 to-gray-400 bg-clip-text text-transparent">AI Powers You Up.</span>
        </h1>
        <p className="animate-fade-in-up mx-auto mb-6 max-w-2xl px-2 text-base text-gray-600 sm:mb-8 sm:text-lg md:text-xl" style={entrance(0.4)}>
          Intelligent automation syncs with the tools you love to streamline tasks, boost output, and save time.
        </p>
        <button type="button" className="animate-fade-in-up rounded-full bg-black px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-gray-800 sm:px-8 sm:text-base" style={entrance(0.5)}>Begin Free Trial</button>
      </section>

      <footer className="animate-fade-in-up absolute inset-x-0 bottom-0 z-20 flex flex-col items-center gap-3 px-4 pb-4 sm:gap-4 sm:pb-8" style={entrance(0.6)}>
        <p className="rounded-full border border-white/20 bg-white/15 px-3 py-1 text-[10px] font-medium text-white backdrop-blur-md sm:px-3.5 sm:text-xs">Collaborating with top aerospace pioneers globally</p>
        <div aria-label="Our partners" className="flex flex-wrap justify-center gap-5 sm:gap-12 md:gap-16">
          {['Aeon', 'Vela', 'Apex', 'Orbit', 'Zeno'].map(name => <span key={name} className="text-lg italic tracking-tight text-white sm:text-2xl md:text-3xl" style={{ fontFamily: 'Georgia, serif' }}>{name}</span>)}
        </div>
      </footer>
    </main>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(<React.StrictMode><App /></React.StrictMode>);
