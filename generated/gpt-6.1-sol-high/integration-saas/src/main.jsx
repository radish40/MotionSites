import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Menu, X } from 'lucide-react';
import './index.css';

const links = ['Platform', 'Pricing', 'Solutions', 'Connectors'];
const videoUrl = 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260702_151414_1020688d-fcb3-4b2a-9bc2-cd1dae8853dd.mp4';
const linkFor = (name) => `#${name.toLowerCase().replaceAll(' ', '-')}`;

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const trigger = useRef(null);
  const panel = useRef(null);
  const closeButton = useRef(null);
  const closeMenu = () => { setMenuOpen(false); trigger.current?.focus(); };

  useEffect(() => {
    if (!menuOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeButton.current?.focus();
    function onKeyDown(event) {
      if (event.key === 'Escape') closeMenu();
      if (event.key === 'Tab') {
        const items = panel.current.querySelectorAll('a, button');
        const first = items[0], last = items[items.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }
    }
    function onResize() { if (window.innerWidth >= 768) closeMenu(); }
    document.addEventListener('keydown', onKeyDown);
    window.addEventListener('resize', onResize);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('resize', onResize);
    };
  }, [menuOpen]);

  return (
    <main className="hero relative isolate flex h-screen flex-col overflow-hidden font-geist">
      <video className="absolute inset-0 h-full w-full object-cover object-[70%_center] md:object-center" src={videoUrl} autoPlay muted loop playsInline aria-hidden="true" />
      <div className="mobile-gradient pointer-events-none absolute inset-0 z-[1] md:hidden" />
      <div className="desktop-gradient pointer-events-none absolute inset-0 z-[1] hidden md:block" />

      <header className="relative z-10 flex items-center justify-between px-5 py-4 sm:px-6 md:px-12 md:py-5 lg:px-16">
        <div className="flex items-center gap-12 lg:gap-16">
          <a href="#" aria-label="DataVio home" className="text-lg font-semibold tracking-tight text-white sm:text-xl md:text-2xl">DataVio</a>
          <nav aria-label="Main navigation" className="hidden items-center gap-6 md:flex lg:gap-8">
            {links.map(name => <a key={name} href={linkFor(name)} className="text-sm font-medium text-white/80 transition-colors duration-200 hover:text-white">{name}</a>)}
          </nav>
        </div>
        <a href="#sign-in" className="hidden text-sm font-medium text-white/80 transition-colors duration-200 hover:text-white md:block">Sign In</a>
        <button ref={trigger} className="text-white md:hidden" aria-label="Open menu" aria-expanded={menuOpen} aria-controls="mobile-menu" onClick={() => setMenuOpen(true)}><Menu size={24} /></button>
      </header>

      <section aria-labelledby="hero-heading" className="relative z-10 flex flex-1 flex-col justify-between px-5 py-4 sm:px-6 sm:py-6 md:px-12 md:py-10 lg:px-16">
        <div className="max-w-3xl pt-2 sm:pt-4 md:pt-8">
          <h1 id="hero-heading" className="text-3xl font-normal leading-[1.1] tracking-tight text-white sm:text-4xl md:text-6xl lg:text-7xl">One Central Hub<br />for Every Source</h1>
        </div>
        <div className="max-w-3xl pb-2 sm:pb-4 md:pb-6">
          <p className="max-w-xl text-sm leading-relaxed text-white/75 sm:text-base md:text-lg"><strong className="font-semibold text-white">End fragmented pipelines.</strong> Bring all your data together in one place, built for <strong className="font-semibold text-white">transparency, governance, and scalable systems</strong> that grow with you.</p>
          <div className="mt-5 flex flex-wrap items-center gap-3 sm:mt-6 sm:gap-4 md:mt-8">
            <a href="#start-integration" className="rounded-lg bg-white px-5 py-2.5 text-sm font-medium text-gray-900 transition-colors duration-200 hover:bg-white/90 sm:px-6 sm:py-3">Start Integration</a>
            <a href="#schedule-call" className="px-2 py-2.5 text-sm font-medium text-white/80 transition-colors duration-200 hover:text-white sm:py-3">Schedule Call</a>
          </div>
          <div className="mt-6 inline-flex items-center gap-3 rounded-xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur-md sm:mt-8 sm:gap-4 sm:px-5 sm:py-3.5 md:mt-10">
            <div className="flex shrink-0 -space-x-2.5" aria-hidden="true">
              {['774909', '1222271', '91227'].map(id => <img key={id} src={`https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=100`} alt="" className="h-7 w-7 rounded-full border-2 border-white/30 object-cover sm:h-8 sm:w-8" />)}
            </div>
            <p className="max-w-[220px] text-xs leading-snug text-white/80 sm:max-w-xs sm:text-sm"><strong className="font-semibold text-white">Adopted by 2,000+ companies and dev teams</strong> who ship quicker, iterate safely, and keep full ownership of their pipelines.</p>
          </div>
        </div>
      </section>

      <div onClick={closeMenu} className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300 md:hidden ${menuOpen ? 'opacity-100' : 'pointer-events-none opacity-0'}`} aria-hidden="true" />
      <aside ref={panel} id="mobile-menu" role="dialog" aria-modal={menuOpen ? 'true' : undefined} aria-label="Navigation menu" aria-hidden={!menuOpen} inert={!menuOpen ? true : undefined} className={`fixed right-0 top-0 z-50 flex h-full w-[280px] flex-col bg-white p-6 shadow-2xl transition-transform duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] sm:w-[320px] md:hidden ${menuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <button ref={closeButton} onClick={closeMenu} aria-label="Close menu" className="self-end text-gray-800"><X size={24} /></button>
        <nav aria-label="Mobile navigation" className="mt-10 flex flex-col">
          {links.map((name, i) => <a key={name} href={linkFor(name)} onClick={closeMenu} style={{ transitionDelay: menuOpen ? `${(i + 1) * 60}ms` : '0ms' }} className={`border-b border-gray-100 py-3 text-lg font-medium text-gray-800 transition-all duration-300 ${menuOpen ? 'translate-x-0 opacity-100' : 'translate-x-4 opacity-0'}`}>{name}</a>)}
        </nav>
        <a href="#sign-in" onClick={closeMenu} style={{ transitionDelay: menuOpen ? '320ms' : '0ms' }} className={`mt-auto rounded-lg bg-gray-900 px-6 py-3 text-center font-medium text-white transition-all duration-300 ${menuOpen ? 'translate-x-0 opacity-100' : 'translate-x-4 opacity-0'}`}>Sign In</a>
      </aside>
    </main>
  );
}

createRoot(document.getElementById('root')).render(<App />);
