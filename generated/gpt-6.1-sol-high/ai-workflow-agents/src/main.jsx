import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';

const videoUrl = 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260714_113715_c7e0daa0-8bdd-4486-a2da-040901f8f0ea.mp4';

function App() {
  const [notice, setNotice] = useState('');
  const explain = (name) => setNotice(name === 'Early access'
    ? 'Early access signup is coming soon.'
    : `${name} details are coming soon.`);

  return (
    <main className="relative h-screen w-full overflow-hidden flex flex-col bg-[#e7edf1]">
      <div className="absolute inset-0 z-0" aria-hidden="true">
        <video className="w-full h-[130%] object-cover object-top" autoPlay muted loop playsInline preload="auto">
          <source src={videoUrl} type="video/mp4" />
        </video>
      </div>

      <header className="relative z-10 flex justify-center pt-4 md:pt-6 px-5">
        <nav aria-label="Main navigation" className="flex items-center gap-8 md:gap-10 bg-white/70 backdrop-blur-md rounded-xl px-4 md:px-6 py-3 shadow-sm">
          <a href="#" aria-label="Axon home" className="rounded-sm" onClick={() => setNotice('')}>
            <svg width="24" height="24" viewBox="0 0 256 256" fill="#1B133C" aria-hidden="true">
              <path d="M 256 256 L 128 256 L 0 128 L 128 128 Z" />
              <path d="M 256 128 L 128 128 L 0 0 L 128 0 Z" />
            </svg>
          </a>
          <div className="hidden sm:flex items-center gap-6 md:gap-8">
            {['Features', 'Plans', 'Security', 'About'].map((name) => (
              <a key={name} href={`#${name.toLowerCase()}`} onClick={(event) => { event.preventDefault(); explain(name); }} className="text-sm font-medium text-[#1B133C]/80 hover:text-[#1B133C] transition-colors duration-200 rounded-sm">{name}</a>
            ))}
          </div>
        </nav>
      </header>

      <section aria-labelledby="hero-heading" className="relative z-10 mt-8 md:mt-16 flex flex-col items-center text-center px-5">
        <div className="mb-6 inline-flex items-center gap-2 rounded-xl border border-[#1B133C]/10 bg-white/70 backdrop-blur-sm px-4 py-2 text-sm font-medium">
          <span className="flex items-center justify-center bg-orange-500 rounded w-5 h-5 font-semibold text-white" aria-hidden="true">Y</span>
          <span>Funded by Y Combinator</span>
        </div>
        <h1 id="hero-heading" className="font-serif text-4xl sm:text-5xl md:text-7xl lg:text-8xl leading-[0.95] sm:leading-[0.95] md:leading-[0.95] lg:leading-[0.95] tracking-tight text-[#1B133C] max-w-4xl">
          <span className="block">Deploy digital workers</span>
          <span className="block">for mundane workflows</span>
        </h1>
        <p className="mt-5 sm:mt-6 max-w-3xl text-xs sm:text-sm md:text-base leading-relaxed text-[#1B133C]/70">
          Eliminate your tedious browser work and 10x your team's capacity. Put intelligent agents on every routine process so you grow faster and deliver more for clients — effortlessly.
        </p>
        <button type="button" onClick={() => explain('Early access')} className="mt-7 sm:mt-8 rounded-xl bg-[#FEFEFE] px-6 sm:px-8 py-3 sm:py-3.5 text-sm font-semibold text-[#1B133C] shadow-[0px_4px_12px_rgba(0,0,0,0.15)] hover:shadow-[0px_6px_16px_rgba(0,0,0,0.2)] transition-all duration-300">
          Get Early Access
        </button>
        <p role="status" aria-live="polite" className="mt-4 text-xs text-[#1B133C]/80 min-h-4">{notice}</p>
      </section>
    </main>
  );
}

createRoot(document.getElementById('root')).render(<App />);
