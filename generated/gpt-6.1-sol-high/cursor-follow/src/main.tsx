import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Menu, X } from 'lucide-react';
import './index.css';

const SENSITIVITY = 0.8;
const navItems = ['Device', 'Real Stories', 'Science', 'Plans', 'Reach Us'];

function App() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const scrub = useRef({ targetTime: 0, isSeeking: false, prevX: null as number | null });
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const state = scrub.current;
    const seek = () => {
      if (state.isSeeking || !Number.isFinite(video.duration)) return;
      if (Math.abs(state.targetTime - video.currentTime) > 0.01) {
        state.isSeeking = true;
        video.currentTime = state.targetTime;
      }
    };
    const onSeeked = () => {
      state.isSeeking = false;
      seek();
    };
    const onLoaded = () => {
      video.pause();
      state.targetTime = 0;
      video.currentTime = 0;
    };
    const onMove = (event: MouseEvent) => {
      const x = Math.max(0, Math.min(1, event.clientX / window.innerWidth));
      const delta = state.prevX === null ? 0 : x - state.prevX;
      state.prevX = x;
      if (!Number.isFinite(video.duration)) return;
      state.targetTime = Math.max(0, Math.min(video.duration,
        state.targetTime + delta * SENSITIVITY * video.duration));
      seek();
    };
    const resetPointer = () => { state.prevX = null; };
    video.addEventListener('loadedmetadata', onLoaded);
    video.addEventListener('seeked', onSeeked);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('blur', resetPointer);
    if (video.readyState >= 1) onLoaded();
    return () => {
      video.removeEventListener('loadedmetadata', onLoaded);
      video.removeEventListener('seeked', onSeeked);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('blur', resetPointer);
    };
  }, []);

  useEffect(() => {
    const close = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false);
    };
    window.addEventListener('keydown', close);
    return () => window.removeEventListener('keydown', close);
  }, []);

  return (
    <section className="relative h-screen w-full overflow-hidden bg-background" aria-label="Orbis.Nft collection">
      <video ref={videoRef} src={`${import.meta.env.BASE_URL}assets/orbis.mp4`} muted playsInline preload="auto"
        className="absolute inset-0 h-full w-full object-cover" aria-hidden="true" />

      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-5 sm:px-8 py-4 sm:py-5" aria-label="Main navigation">
        <a href="#" aria-label="Orbis.Nft home">
          <svg width="28" height="28" viewBox="0 0 256 256" fill="#111111" aria-hidden="true">
            <path d="M 256 64 L 256 128 L 192.5 128 L 160 95 L 128 64 L 96 95 L 63.5 128 L 64 128 L 128 192 L 128 256 L 64.5 256 L 32 223 L 0 192 L 0 64 L 64 0 L 192 0 Z M 256 192 L 256 256 L 192.5 256 L 160 223 L 128 192 L 128 128 L 192 128 Z" />
          </svg>
        </a>
        <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 bg-gray-900 rounded-full px-2 py-1.5">
          {navItems.map((item, index) => (
            <button key={item} type="button" aria-current={index === 0 ? 'page' : undefined}
              className={`text-sm font-medium px-4 py-1.5 rounded-full whitespace-nowrap ${index === 0 ? 'bg-white text-gray-900' : 'text-gray-300 hover:text-white transition-colors'}`}>{item}</button>
          ))}
        </div>
        <button type="button" className="hidden md:flex items-center gap-2 bg-gray-900 text-white text-sm font-medium px-5 py-2 rounded-full hover:bg-gray-700 transition-colors">
          <span className="w-2 h-2 rounded-full bg-green-400" />Reserve Yours
        </button>
        <button type="button" className="md:hidden text-gray-900" onClick={() => setMenuOpen(!menuOpen)} aria-label={menuOpen ? 'Close menu' : 'Open menu'} aria-expanded={menuOpen} aria-controls="mobile-menu">
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {menuOpen && (
        <div id="mobile-menu" className="fixed top-0 left-0 right-0 z-40 bg-white pt-16 pb-6 px-5 shadow-lg flex flex-col gap-1 md:hidden">
          {navItems.map(item => <button key={item} type="button" onClick={() => setMenuOpen(false)} className="text-gray-800 text-base font-medium py-3 border-b border-gray-100 text-left hover:text-gray-500 transition-colors">{item}</button>)}
          <button type="button" onClick={() => setMenuOpen(false)} className="mt-4 flex items-center justify-center gap-2 bg-gray-900 text-white text-sm font-medium px-5 py-2 rounded-full hover:bg-gray-700 transition-colors"><span className="w-2 h-2 rounded-full bg-green-400" />Reserve Yours</button>
        </div>
      )}

      <div className="relative z-10 flex flex-col h-full pointer-events-none">
        <div className="flex-1 flex items-end pb-16 sm:pb-20 lg:pb-24 px-6 lg:px-12">
          <div className="relative lg:ml-12 max-w-[780px]">
            <h1 className="font-grotesk text-[40px] sm:text-[60px] md:text-[75px] lg:text-[90px] uppercase text-cream leading-[1.05] sm:leading-[1] md:leading-[1] lg:leading-[1]">
              Beyond earth<br />and {'( '}its{' )'} familiar<br />boundaries
            </h1>
            <span className="absolute -right-4 sm:right-0 md:right-4 top-0 sm:top-2 md:top-4 font-condiment text-[24px] sm:text-[32px] md:text-[40px] lg:text-[48px] text-neon -rotate-1 opacity-90" style={{ mixBlendMode: 'exclusion' }}>Nft collection</span>
          </div>
        </div>
      </div>
    </section>
  );
}

createRoot(document.getElementById('root')!).render(<React.StrictMode><App /></React.StrictMode>);
