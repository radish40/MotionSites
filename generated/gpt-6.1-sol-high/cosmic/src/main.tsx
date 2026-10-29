import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { ArrowUpRight, Menu, Share2, X } from 'lucide-react';
import './index.css';

const links = ['Discover', 'Story', 'Connect'];
const asset = (name: string) => `${import.meta.env.BASE_URL}assets/${name}`;

function App() {
  const [videoEnded, setVideoEnded] = useState(false);
  const [circlesVisible, setCirclesVisible] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuAnimating, setMenuAnimating] = useState(false);
  const [shareStatus, setShareStatus] = useState('');
  const closeTimer = useRef<ReturnType<typeof setTimeout>>();
  const menuButton = useRef<HTMLButtonElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const dialog = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setCirclesVisible(true), 800);
    return () => { clearTimeout(timer); clearTimeout(closeTimer.current); };
  }, []);

  const closeMenu = () => {
    setMenuAnimating(false);
    closeTimer.current = setTimeout(() => { setMenuOpen(false); menuButton.current?.focus(); }, 600);
  };
  const openMenu = () => {
    clearTimeout(closeTimer.current);
    setMenuOpen(true);
    requestAnimationFrame(() => requestAnimationFrame(() => setMenuAnimating(true)));
  };

  useEffect(() => {
    if (!menuOpen) return;
    closeButton.current?.focus();
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeMenu();
      if (event.key !== 'Tab') return;
      const items = dialog.current?.querySelectorAll<HTMLElement>('button, a[href]');
      if (!items?.length) return;
      const first = items[0], last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [menuOpen]);

  async function share() {
    try {
      if (navigator.share) await navigator.share({ title: "COSMIQ - What's Beyond", url: location.href });
      else { await navigator.clipboard.writeText(location.href); setShareStatus('Link copied'); }
    } catch (error) {
      if (!(error instanceof DOMException && error.name === 'AbortError')) setShareStatus('Unable to share');
    }
  }

  return <main className="relative w-full h-[100dvh] overflow-hidden bg-[#0a0a0a]" id="discover">
    <div className="absolute inset-0 z-0 pointer-events-none" aria-hidden="true">
      {Array.from({ length: 40 }, (_, i) => <div key={i} className="absolute rounded-full bg-white" style={{ left: `${(i * 37 + 13) % 100}%`, top: `${(i * 53 + 7) % 100}%`, width: i % 3 === 0 ? 2 : 1, height: i % 3 === 0 ? 2 : 1, animation: `starTwinkle ${2 + i % 4}s ease-in-out ${(i * .3) % 3}s infinite` }} />)}
    </div>
    <video className="absolute inset-0 z-[1] w-full h-full object-cover" src={asset('cosmiq.mp4')} muted autoPlay playsInline onLoadedMetadata={event => { event.currentTarget.playbackRate = 1.56; }} onEnded={() => setVideoEnded(true)} onError={() => setVideoEnded(true)} aria-hidden="true" />
    <div id="story" className="absolute bottom-[21vh] sm:bottom-[24vh] md:bottom-[10vh] left-0 right-0 z-[5] flex justify-center px-2 sm:px-4 md:px-8 overflow-hidden">
      <h1 className="headline" aria-label="WHAT'S BEYOND">{Array.from("WHAT'S BEYOND").map((letter, i) => <span aria-hidden="true" key={i} style={{ display: 'inline-block', width: letter === ' ' ? '.25em' : undefined, transform: videoEnded ? 'translateY(0)' : 'translateY(120%)', opacity: videoEnded ? 1 : 0, transition: `transform .8s cubic-bezier(.16,1,.3,1) ${i * 60}ms, opacity .5s ease-out ${i * 60}ms` }}>{letter === ' ' ? '\u00a0' : letter}</span>)}</h1>
    </div>
    {circlesVisible && <div aria-hidden="true"><div className="orbit orbit-inner" /><div className="orbit orbit-outer" /></div>}
    <div className="absolute inset-0 z-[8] pointer-events-none transition-opacity duration-[600ms] ease-out" style={{ opacity: videoEnded ? 1 : 0 }} aria-hidden="true"><img src={asset('rock.png')} className="w-full h-full object-cover block" alt="" /></div>
    <nav aria-label="Main navigation" className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-5 sm:px-8 md:px-12 py-4 sm:py-6 nav-enter">
      <a className="logo text-lg text-white" href="#discover" aria-label="COSMIQ home">COSMIQ.</a>
      <div className="hidden md:flex gap-10">{links.map(label => <a className="nav-link" href={`#${label.toLowerCase()}`} key={label}>{label}</a>)}</div>
      <button className="nav-link hidden md:flex items-center gap-3" onClick={share}>Share <Share2 className="w-4 h-4" /></button>
      <button ref={menuButton} aria-label="Open menu" aria-expanded={menuOpen} aria-controls="mobile-menu" className="md:hidden text-white p-2 -mr-2" onClick={openMenu}><Menu className="w-5 h-5" /></button>
    </nav>
    <span id="connect" className="absolute bottom-0" />
    <span role="status" className="absolute bottom-5 right-5 z-10 text-xs text-white/70">{shareStatus}</span>
    {menuOpen && <div ref={dialog} id="mobile-menu" role="dialog" aria-modal="true" aria-label="Navigation menu" className={`fixed inset-0 z-[100] overflow-hidden text-white mobile-menu ${menuAnimating ? 'is-open' : ''}`}>
      <div className="menu-backdrop absolute inset-0 bg-[#0a0a0a]" />
      <div className="menu-circle absolute top-4 right-5 rounded-full bg-white/[0.03] pointer-events-none" />
      <div className="menu-top absolute top-0 left-0 right-0 flex items-center justify-between px-5 sm:px-8 py-4 sm:py-6">
        <a className="logo text-lg" href="#discover" onClick={closeMenu}>COSMIQ.</a>
        <button ref={closeButton} aria-label="Close menu" className="p-2 -mr-2" onClick={closeMenu}><X className="w-5 h-5" /></button>
      </div>
      <nav aria-label="Mobile navigation" className="absolute top-1/2 left-8 right-8 -translate-y-1/2">{links.map((label, i) => <a key={label} href={`#${label.toLowerCase()}`} onClick={closeMenu} className="menu-link group flex items-center justify-between border-b border-white/[0.08] py-6" style={{ transitionDelay: menuAnimating ? `${300 + i * 100}ms` : '0ms' }}><span className="menu-label text-4xl tracking-tight group-hover:tracking-wider transition-all duration-300">{label}</span><ArrowUpRight className="w-5 h-5 text-white/30 group-hover:text-white group-hover:translate-x-px group-hover:-translate-y-px transition-all" /></a>)}</nav>
      <div className="menu-bottom absolute bottom-10 left-8 right-8 flex flex-col gap-8"><button className="nav-link flex items-center gap-3 self-start" onClick={share}>Share <Share2 className="w-4 h-4" /></button><div className="flex items-center gap-3"><span className="w-3 h-px bg-white/20" /><span className="text-[10px] tracking-[0.3em] text-white/30 uppercase">Explore the unknown</span></div><span role="status" className="text-xs text-white/70">{shareStatus}</span></div>
    </div>}
  </main>;
}

createRoot(document.getElementById('root')!).render(<React.StrictMode><App /></React.StrictMode>);
