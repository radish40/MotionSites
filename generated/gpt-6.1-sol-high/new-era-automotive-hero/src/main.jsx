import React from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

const asset = (file) => `${import.meta.env.BASE_URL}assets/${file}`;

function Logo() {
  return <svg width="28" height="28" viewBox="0 0 28 28" fill="currentColor" aria-hidden="true">
    {Array.from({length: 6}, (_, i) => <path key={i} d="M14 14V1.5C20.4 1.5 23.2 7.2 19 11.3L14 14Z" transform={`rotate(${i * 60} 14 14)`} />)}
  </svg>;
}

function Arrow() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true"><path d="M4 12h16M13 5l7 7-7 7" /></svg>;
}

function Cart() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M2.5 3h3l2.2 12h11.1l2.1-8.5H6.2M8 18.5h10"/><circle cx="9" cy="21" r=".7"/><circle cx="18" cy="21" r=".7"/></svg>;
}

function App() {
  return <main>
    <section id="home" className="hero relative isolate overflow-hidden bg-[#010101] text-white" aria-label="New Era automotive">
      <video className="absolute inset-0 -z-30 h-full w-full object-cover" autoPlay muted loop playsInline poster={asset('automotive-poster.webp')} aria-hidden="true">
        <source src={asset('automotive.mp4')} type="video/mp4" />
      </video>
      <div className="top-shade pointer-events-none absolute inset-x-0 top-0 -z-20 h-[260px] bg-gradient-to-b from-black/30 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 -z-20 h-[260px] bg-gradient-to-t from-black/30 to-transparent" />
      <div className="era pointer-events-none absolute left-1/2 -z-10 -translate-x-1/2 whitespace-nowrap" aria-hidden="true">NEW ERA</div>

      <header className="nav-shell absolute inset-x-0 top-0 flex items-center justify-between">
        <a className="brand inline-flex items-center gap-2.5" href="#home" aria-label="Logoipsum home">
          <Logo /><span className="hidden text-2xl font-semibold tracking-[-1px] sm:inline">Logoipsum</span>
        </a>
        <nav aria-label="Main navigation" className="main-nav hidden items-center gap-8 lg:flex">
          {['Home', 'Shop', 'Blog', 'About Us', 'Contact Us'].map(label => <a key={label} href={`#${label.toLowerCase().replaceAll(' ', '-')}`} className="nav-link text-base tracking-[-0.32px] text-[#eeeff2]">{label}</a>)}
        </nav>
        <div className="flex items-center gap-8">
          <a href="#sign-in" className="nav-link hidden text-base text-[#fbfbfd] sm:block">Sign In</a>
          <a href="#cart" className="action inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-white px-5 text-base font-medium text-[#272835] shadow-sm"><Cart />Cart</a>
        </div>
      </header>

      <div className="cta-shell absolute inset-x-0 bottom-0 flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
        <div className="intro flex flex-col items-start gap-6 sm:flex-row sm:items-end sm:gap-8">
          <p className="max-w-[414px] text-xl leading-[30px]">Choose from thousands of certified cars you can trust, transparently priced, because buying a car should feel exciting.</p>
          <a href="#shop" className="action inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-lg border border-[#eeeff2] bg-white px-5 text-base font-medium text-[#272835] shadow-sm">Shop Now<Arrow /></a>
        </div>
        <h1 className="tagline max-w-[466px] font-normal uppercase">Find the perfect car that fits our journey</h1>
      </div>
    </section>
  </main>;
}

createRoot(document.getElementById('root')).render(<App />);
