import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, Menu, X } from 'lucide-react';

const items = ['About Us', 'Programs', 'Reviews', 'FAQ', 'Contacts'];
const videoUrl = 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260713_234424_b1332b69-2e69-4302-8dbc-40f86846afbd.mp4';

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scaleY, setScaleY] = useState(1);
  const textRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const resize = () => {
      if (textRef.current?.offsetHeight) setScaleY(window.innerHeight / textRef.current.offsetHeight);
    };
    resize();
    document.fonts.ready.then(resize);
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    // Let the sliding panel enter the viewport before moving keyboard focus.
    const focusTimer = window.setTimeout(() => closeRef.current?.focus(), 510);
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false);
      if (event.key === 'Tab') {
        const links = panelRef.current?.querySelectorAll<HTMLElement>('a, button');
        if (!links?.length) return;
        const first = links[0];
        const last = links[links.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.clearTimeout(focusTimer);
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
      menuButtonRef.current?.focus();
    };
  }, [menuOpen]);

  const logo = <><span className="grid grid-cols-2 gap-0.5" aria-hidden="true">{[0, 1, 2, 3].map(i => <span key={i} className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-white rounded-full" />)}</span><span className="ml-1 text-white font-bold text-lg sm:text-xl">TinyTrails</span></>;

  return (
    <div className="relative w-full h-screen overflow-hidden flex flex-col" style={{ background: 'linear-gradient(to bottom, #FF8233, #FDAC55)' }}>
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-80" style={{ maskImage: 'linear-gradient(to bottom, black 40%, transparent 95%)', WebkitMaskImage: 'linear-gradient(to bottom, black 40%, transparent 95%)' }}>
        <div ref={textRef} className="text-white font-black leading-none tracking-tighter whitespace-nowrap" style={{ fontSize: 'clamp(200px, 48vw, 800px)', transform: `scale(1.15, ${scaleY * 1.4})` }}>404</div>
        <div className="absolute bg-white rounded-full h-[22vh] sm:h-[26vh] md:h-[50vh]" style={{ width: 'clamp(120px, 20vw, 400px)', transform: `scaleY(${scaleY})`, transformOrigin: 'center' }} />
      </div>

      <header className="relative z-20 flex items-center justify-between px-4 sm:px-6 md:px-12 py-4 sm:py-5">
        <a href="/" aria-label="TinyTrails home" className="inline-flex items-center gap-1">{logo}</a>
        <nav aria-label="Main navigation" className="hidden md:flex gap-1">
          {items.map(item => <a key={item} href={`/#${item.toLowerCase().replaceAll(' ', '-')}`} className="px-4 py-1.5 text-sm font-medium rounded-full bg-white text-[#F16524] hover:opacity-90 transition-colors">{item}</a>)}
        </nav>
        <button ref={menuButtonRef} aria-label="Open menu" aria-expanded={menuOpen} aria-controls="mobile-menu" onClick={() => setMenuOpen(true)} className="inline-flex items-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 rounded-full text-white bg-[#F16524] hover:opacity-90 transition-colors">
          <Menu className="w-4 h-4" /><span className="text-sm font-medium hidden sm:inline">Menu</span>
        </button>
      </header>

      <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ marginTop: 'calc(-6vh - 40px)' }}>
        <div className="w-[120vw] h-[85vh] sm:w-[70vw] sm:h-[70vh] md:w-[62vw] md:h-[78vh] shrink-0">
          <video aria-label="Playful TinyTrails 404 animation" autoPlay loop muted playsInline className="w-full h-full object-contain pointer-events-none mix-blend-darken" onError={event => {
            const fallback = new URL(`${import.meta.env.BASE_URL}assets/tinytrails-404.mp4`, window.location.origin).href;
            if (event.currentTarget.src !== fallback) event.currentTarget.src = fallback;
          }} src={videoUrl} />
        </div>
      </div>

      <main className="relative z-30 mt-auto pb-8 sm:pb-16 flex flex-col items-center text-center px-4">
        <h1 className="text-white text-lg sm:text-xl md:text-2xl font-medium mb-3 sm:mb-4">Oops, something went wrong!</h1>
        <a href="/" className="inline-flex items-center gap-2 px-6 py-3 sm:px-8 sm:py-4 rounded-full text-white font-semibold text-sm sm:text-base bg-[#F16524] hover:scale-105 hover:shadow-lg transition-all"><ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />Back to Home</a>
      </main>

      <div id="mobile-menu" aria-hidden={!menuOpen} inert={!menuOpen} className={`fixed inset-0 z-50 transition-[visibility] duration-500 ${menuOpen ? 'visible' : 'invisible'}`}>
        <div onClick={() => setMenuOpen(false)} className={`absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-500 ${menuOpen ? 'opacity-100' : 'opacity-0'}`} />
        <div ref={panelRef} role="dialog" aria-modal="true" aria-label="Navigation menu" className={`absolute top-0 right-0 h-full w-full sm:w-[380px] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${menuOpen ? 'translate-x-0' : 'translate-x-full'}`} style={{ background: 'linear-gradient(135deg, #FF6B1A 0%, #FF9642 100%)' }}>
          <div className="flex items-center justify-between p-6"><a href="/" className="inline-flex items-center gap-1" aria-label="TinyTrails home">{logo}</a><button ref={closeRef} onClick={() => setMenuOpen(false)} aria-label="Close menu" className="w-10 h-10 rounded-full bg-white/20 text-white hover:bg-white/30 flex items-center justify-center"><X className="w-5 h-5" /></button></div>
          <nav aria-label="Menu navigation" className="flex flex-col gap-3 px-6 mt-4">
            {items.map((item, i) => <a key={item} href={`/#${item.toLowerCase().replaceAll(' ', '-')}`} onClick={() => setMenuOpen(false)} className={`px-6 py-4 text-lg font-semibold text-white rounded-2xl bg-white/10 hover:bg-white/20 transition-all duration-300 ${menuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`} style={{ transitionDelay: menuOpen ? `${150 + i * 60}ms` : '0ms' }}>{item}</a>)}
          </nav>
          <div className={`absolute bottom-0 left-0 right-0 p-6 transition-opacity duration-300 ${menuOpen ? 'opacity-100' : 'opacity-0'}`} style={{ transitionDelay: menuOpen ? '450ms' : '0ms' }}><a href="/" className="flex justify-center items-center gap-2 w-full py-4 rounded-full bg-white font-semibold text-base text-[#F16524] hover:scale-[1.02] transition-transform"><ArrowLeft className="w-5 h-5" />Back to Home</a></div>
        </div>
      </div>
    </div>
  );
}
