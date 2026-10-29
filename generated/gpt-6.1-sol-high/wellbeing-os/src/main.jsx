import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { ChevronDown, Menu, X } from 'lucide-react';
import './styles.css';

const navigation = [
  { label: 'Product', items: ['Connections', 'Workflows', 'Insights'] },
  { label: 'Solutions', items: ['Guides', 'Use cases', 'API reference'] },
  { label: 'About', items: ['Our story', 'Open roles', 'Reach us'] },
  { label: 'Plans' },
];

function App() {
  const [openDropdown, setOpenDropdown] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navRef = useRef(null);

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        setOpenDropdown(null);
        setMobileOpen(false);
      }
    };
    const onPointerDown = (event) => {
      if (!navRef.current?.contains(event.target)) {
        setOpenDropdown(null);
        setMobileOpen(false);
      }
    };
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('pointerdown', onPointerDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('pointerdown', onPointerDown);
    };
  }, []);

  return (
    <section className="relative flex h-screen w-full flex-col overflow-hidden bg-[#2C221C]">
      <video
        className="absolute inset-0 h-full w-full object-cover"
        autoPlay loop muted playsInline preload="auto" aria-hidden="true"
        src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260703_053131_1ec3dd1c-d627-44fb-ab20-6e1fce41b0d5.mp4"
        onError={(event) => {
          const fallback = `${import.meta.env.BASE_URL}assets/flowpath.mp4`;
          if (!event.currentTarget.src.endsWith(fallback)) event.currentTarget.src = fallback;
        }}
      />
      <div className="absolute inset-0 bg-black/10" aria-hidden="true" />

      <nav ref={navRef} className="relative z-20 flex w-full items-center justify-between px-5 py-4 sm:px-6 sm:py-5 md:px-12 lg:px-16" aria-label="Main navigation">
        <a href={import.meta.env.BASE_URL} aria-label="flowpath home" className="flex items-center gap-2 text-lg font-medium tracking-tight text-white sm:text-xl">
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
            <path d="M14 1 25 12 14 23 3 12 14 1Z" fill="white" opacity=".9" />
            <path d="M14 7 25 18 14 29 3 18 14 7Z" fill="white" opacity=".5" />
          </svg>
          flowpath
        </a>

        <div className="hidden items-center gap-7 md:flex lg:gap-8">
          {navigation.map(({ label, items }) => (
            <div key={label} className="relative" onMouseEnter={() => setOpenDropdown(label)} onMouseLeave={() => setOpenDropdown(null)} onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setOpenDropdown(null); }}>
              <button type="button" className="flex items-center gap-1.5 py-2 text-sm font-medium text-white/90 transition-colors hover:text-white" aria-expanded={items ? openDropdown === label : undefined} aria-controls={items ? `dropdown-${label}` : undefined} onClick={() => items && setOpenDropdown(openDropdown === label ? null : label)}>
                {label}{items && <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${openDropdown === label ? 'rotate-180' : ''}`} />}
              </button>
              {items && openDropdown === label && (
                <div id={`dropdown-${label}`} className="liquid-glass animate-dropdown !absolute left-0 top-full min-w-[160px] rounded-xl px-2 py-3 shadow-xl">
                  {items.map((item) => <button key={item} type="button" onClick={() => setOpenDropdown(null)} className="block w-full rounded-lg px-3 py-2 text-left text-sm text-white/80 transition-colors hover:bg-white/5 hover:text-white">{item}</button>)}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="hidden items-center gap-6 md:flex">
          <button type="button" className="text-sm font-medium text-white/90 transition-colors hover:text-white">Log in</button>
          <button type="button" className="liquid-glass rounded-full px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-white/10">Try it free</button>
        </div>

        <button type="button" className="relative h-9 w-9 text-white md:hidden" aria-label={mobileOpen ? 'Close menu' : 'Open menu'} aria-expanded={mobileOpen} aria-controls="mobile-menu" onClick={() => setMobileOpen(!mobileOpen)}>
          <Menu className={`absolute left-1.5 top-1.5 h-6 w-6 transition-all duration-300 ${mobileOpen ? 'rotate-90 scale-50 opacity-0' : 'rotate-0 scale-100 opacity-100'}`} />
          <X className={`absolute left-1.5 top-1.5 h-6 w-6 transition-all duration-300 ${mobileOpen ? 'rotate-0 scale-100 opacity-100' : '-rotate-90 scale-50 opacity-0'}`} />
        </button>

        <div id="mobile-menu" inert={!mobileOpen ? true : undefined} aria-hidden={!mobileOpen} className={`mobile-menu duration-400 absolute left-5 right-5 top-full max-h-[calc(100svh-88px)] overflow-y-auto rounded-2xl bg-[#2C221C]/95 p-6 backdrop-blur-xl transition-all md:hidden ${mobileOpen ? 'translate-y-0 opacity-100' : 'pointer-events-none -translate-y-3 opacity-0'}`}>
          {navigation.map(({ label, items }) => <div key={label} className="mb-4">
            <button type="button" className="text-sm font-medium text-white" onClick={() => !items && setMobileOpen(false)}>{label}</button>
            {items && <div className="mt-2 flex flex-col items-start gap-2 pl-4">{items.map((item) => <button type="button" key={item} onClick={() => setMobileOpen(false)} className="text-sm text-white/70 hover:text-white">{item}</button>)}</div>}
          </div>)}
          <div className="mt-5 flex items-center justify-between border-t border-white/15 pt-5">
            <button type="button" className="text-sm font-medium text-white/90">Log in</button>
            <button type="button" className="liquid-glass rounded-full px-5 py-2 text-sm font-medium text-white">Try it free</button>
          </div>
        </div>
      </nav>

      <div className="relative z-10 flex flex-1 items-start justify-center px-5 pt-16 sm:pt-20 md:pt-24">
        <div className="max-w-3xl text-center">
          <h1 className="text-3xl leading-[1.05] tracking-[-0.02em] text-white sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl">
            Bridge the<br />gaps. <span className="text-white/60">Ditch the</span><br /><span className="text-white/60">grindwork.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-md text-sm leading-relaxed text-white/80 sm:mt-8 sm:text-base md:text-lg">
            Flowpath unifies your complete wellness tools, so your crew spends less energy plugging gaps and more on real progress.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3 sm:mt-8 sm:gap-4">
            <button type="button" className="rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-gray-900 transition-colors hover:bg-white/90 sm:px-6 sm:py-3">Begin your journey</button>
            <button type="button" className="liquid-glass rounded-full px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white/10 sm:px-6 sm:py-3">See it live</button>
          </div>
        </div>
      </div>
    </section>
  );
}

createRoot(document.getElementById('root')).render(<App />);
