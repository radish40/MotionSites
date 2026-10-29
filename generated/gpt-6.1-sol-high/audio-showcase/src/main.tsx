import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { ShoppingCart, Menu, X, BarChart3, Heart, ArrowUpRight } from 'lucide-react';
import BoomerangVideoBg from './BoomerangVideoBg';
import './style.css';

const sections = ['Anthology', 'Talents', 'Sound diary', 'Playback salon'];
const tracks = [
  { artist: 'Helia Marsh', title: 'Fern Light', elapsed: '0:33', remaining: '-1:21' },
  { artist: 'Alder Field', title: 'Understory', elapsed: '0:00', remaining: '-3:42' },
  { artist: 'Moss Archive', title: 'Morning Still', elapsed: '0:00', remaining: '-4:18' },
];
const descriptions: Record<string, string> = {
  Anthology: 'A small collection of drone, roots, and nature-captured sound. Every pressing has a place, every record a story.',
  Talents: 'Meet the voices behind the grooves. Helia Marsh, Alder Field, and Moss Archive explore the quieter edges of sound.',
  'Sound diary': 'Field notes from the vernal woods. Rain on leaves, a distant bird, and the space between sounds.',
  'Playback salon': 'A moment to listen closely. Select a record from the listening card and find your own quiet.',
  'Newest arrivals': 'Press 04 · Vernal woods. Our latest collection of sounds from the forest floor.',
};
function App() {
  const [menu, setMenu] = useState(false);
  const [panel, setPanel] = useState<string | null>(null);
  const [trackIndex, setTrackIndex] = useState(0);
  const [likes, setLikes] = useState<number[]>([]);
  const closeRef = useRef<HTMLButtonElement>(null);
  const previousFocus = useRef<HTMLElement | null>(null);
  const track = tracks[trackIndex];
  const liked = likes.includes(trackIndex);
  const openPanel = (name: string) => { previousFocus.current = document.activeElement as HTMLElement; setMenu(false); setPanel(name); };
  useEffect(() => {
    if (!panel) return;
    closeRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setPanel(null);
      if (event.key === 'Tab') { event.preventDefault(); closeRef.current?.focus(); }
    };
    window.addEventListener('keydown', onKey);
    return () => { window.removeEventListener('keydown', onKey); previousFocus.current?.focus(); };
  }, [panel]);
  return <main className="relative h-screen w-full overflow-hidden bg-[#243b30]">
    <BoomerangVideoBg />
    <div className="pointer-events-none absolute inset-0 z-[1] bg-black/20" />
    <header className="absolute inset-x-0 top-0 z-20 animate-fade-up">
      <div className="flex items-center justify-between px-5 py-5 sm:px-8 md:px-10 md:py-7">
        <a href="#" aria-label="quietpress home" onClick={e => { e.preventDefault(); setPanel(null); setMenu(false); }} className="flex items-center gap-2 text-base tracking-tight text-white">
          <svg width="20" height="20" viewBox="0 0 256 256" fill="currentColor" aria-hidden="true"><path d="M 256 256 L 128 256 C 198.692 256 256 198.692 256 128 C 256 57.308 198.692 0 128 0 C 57.308 0 0 57.308 0 128 C 0 198.692 57.308 256 128 256 L 0 256 L 0 0 L 256 0 Z M 128 104 C 141.255 104 152 114.745 152 128 C 152 141.255 141.255 152 128 152 C 114.745 152 104 141.255 104 128 C 104 114.745 114.745 104 128 104 Z"/></svg>
          quietpress
        </a>
        <nav aria-label="Main navigation" className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-8 md:flex">
          {sections.map(s => <button key={s} onClick={() => openPanel(s)} className="whitespace-nowrap text-sm text-white/90 hover:text-white">{s}</button>)}
        </nav>
        <div className="flex items-center gap-2">
          <button onClick={() => openPanel('Cart')} className="flex items-center gap-2 rounded-xl bg-white p-1 pr-3 text-xs text-gray-900 hover:scale-105 active:scale-95 sm:pr-4" aria-label="Open cart, 0 items"><span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-700 text-white"><ShoppingCart size={14} strokeWidth={2}/></span><span><span className="hidden sm:inline">Cart </span>(0)</span></button>
          <button className="liquid-glass flex h-9 w-9 items-center justify-center rounded-xl text-white md:hidden" aria-label={menu ? 'Close menu' : 'Open menu'} aria-expanded={menu} aria-controls="mobile-nav" onClick={() => setMenu(!menu)}>{menu ? <X size={18}/> : <Menu size={18}/>}</button>
        </div>
      </div>
      {menu && <nav id="mobile-nav" aria-label="Mobile navigation" className="liquid-glass mx-4 flex flex-col rounded-2xl p-2 md:hidden" style={{background:'rgba(18,38,31,.75)'}}>{sections.map(s => <button key={s} onClick={() => openPanel(s)} className="rounded-xl px-4 py-3 text-left text-sm text-white/90 hover:bg-white/10">{s}</button>)}</nav>}
    </header>
    <section className="relative z-10 flex flex-col items-center px-4 pt-28 text-center sm:px-6 sm:pt-36 md:pt-44">
      <div className="liquid-glass animate-fade-up delay-1 mb-5 rounded-lg px-4 py-1.5 text-xs text-white sm:mb-6 sm:text-sm" style={{background:'rgba(255,255,255,0.16)'}}>Press 04 . Vernal woods</div>
      <h1 className="animate-fade-up delay-2 max-w-3xl text-4xl leading-[1.1] text-white sm:text-5xl md:text-6xl lg:text-7xl">records cut for the<br/>calm listener.</h1>
      <p className="animate-fade-up delay-3 mt-5 max-w-md text-sm leading-relaxed text-white/90 sm:mt-6 sm:text-base md:text-lg">Drone, roots, and nature-captured sound on wax LPs. Every disc cut just once, snag it or miss.</p>
      <div className="animate-fade-up delay-4 mt-8 flex flex-col gap-3 sm:flex-row">
        <button onClick={() => openPanel('Anthology')} className="rounded-xl bg-white px-7 py-2.5 text-sm text-gray-900 hover:scale-105 active:scale-95">Browse the shelves</button>
        <button onClick={() => openPanel('Newest arrivals')} className="liquid-glass rounded-xl px-7 py-2.5 text-sm text-white hover:scale-105 active:scale-95">Newest arrivals</button>
      </div>
    </section>
    <aside aria-label="Now playing" className="animate-fade-up delay-5 absolute bottom-4 right-4 z-20 w-[270px] max-w-[calc(100%-32px)] sm:bottom-6 sm:right-6 sm:w-72 md:bottom-8 md:right-10">
      <div className="flex items-center gap-3 rounded-2xl bg-white p-2.5 pr-4 shadow-lg">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-700 text-white"><BarChart3 size={20} strokeWidth={2.5}/></div>
        <div className="min-w-0 flex-1" aria-live="polite"><p className="truncate text-sm text-gray-900">{track.artist} -- {track.title}</p><div className="mt-2 h-1 overflow-hidden rounded-full bg-gray-200"><div className="h-full rounded-full bg-blue-700" style={{width:trackIndex === 0 ? '30%' : '0%'}}/></div><div className="mt-1 flex justify-between text-[10px] text-gray-500"><span>{track.elapsed}</span><span>{track.remaining}</span></div></div>
      </div>
      <div className="mt-2 flex items-center gap-2">
        <button onClick={() => setTrackIndex((trackIndex + tracks.length - 1) % tracks.length)} className="flex-1 rounded-2xl bg-white py-2 text-sm text-gray-900 shadow-lg hover:scale-105 active:scale-95" aria-label="Previous track">Prev</button>
        <button onClick={() => setLikes(liked ? likes.filter(i => i !== trackIndex) : [...likes, trackIndex])} aria-label={liked ? 'Unlike track' : 'Like track'} aria-pressed={liked} className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-blue-700 shadow-lg hover:scale-110 active:scale-95"><Heart size={16} className={liked ? 'fill-blue-700' : ''}/></button>
        <button onClick={() => setTrackIndex((trackIndex + 1) % tracks.length)} className="flex-1 rounded-2xl bg-white py-2 text-sm text-gray-900 shadow-lg hover:scale-105 active:scale-95" aria-label="Next track">Next</button>
      </div>
    </aside>
    {panel && <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/35 p-5 backdrop-blur-sm" onClick={() => setPanel(null)}><section role="dialog" aria-modal="true" aria-labelledby="panel-title" className="relative w-full max-w-md rounded-3xl bg-[#f6f5f0] p-8 text-gray-900 shadow-2xl" onClick={e => e.stopPropagation()}><button ref={closeRef} aria-label="Close dialog" onClick={() => setPanel(null)} className="absolute right-4 top-4 rounded-full p-2 hover:bg-black/5"><X size={18}/></button><p className="mb-8 flex items-center gap-2 text-xs text-blue-700">quietpress <ArrowUpRight size={13}/></p><h2 id="panel-title" className="mb-4 text-3xl tracking-tight">{panel === 'Cart' ? 'Your cart is quiet.' : panel}</h2><p className="text-sm leading-relaxed text-gray-600">{panel === 'Cart' ? 'There are no records in your cart yet. Explore the shelves to discover your next quiet moment.' : descriptions[panel]}</p>{panel !== 'Cart' && <p className="mt-8 border-t border-gray-200 pt-4 text-xs text-gray-500">Independent sound. Pressed with care.</p>}</section></div>}
  </main>;
}
createRoot(document.getElementById('root')!).render(<React.StrictMode><App/></React.StrictMode>);
