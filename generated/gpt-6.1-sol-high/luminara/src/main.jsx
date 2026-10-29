import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';

function App() {
  return (
    <main id="showcase" className="hero relative h-screen w-full overflow-hidden">
      <video
        className="absolute inset-0 h-full w-full object-cover"
        src={`${import.meta.env.BASE_URL}assets/luminara.mp4`}
        autoPlay muted loop playsInline preload="auto" aria-hidden="true"
      />

      <nav aria-label="Main navigation" className="absolute inset-x-0 top-0 z-10 flex items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-8 rounded-full border border-white/10 bg-black/40 px-5 py-2.5 backdrop-blur-xl">
          <a href="#showcase" aria-label="Luminara home" className="flex shrink-0 items-center text-white">
            <svg width="20" height="20" viewBox="0 0 256 256" fill="currentColor" aria-hidden="true">
              <path d="M 256 192 C 256 227.346 227.346 256 192 256 L 0 256 L 0 64 C 0 28.654 28.654 0 64 0 L 256 0 Z M 128 192 L 192 192 L 192 128 L 128 128 L 128 64 L 64 64 L 64 128 L 128 128 Z" />
            </svg>
          </a>
          <div className="hidden items-center gap-6 sm:flex">
            {['Work', 'Gallery', 'Plans', 'Story'].map(label => (
              <a key={label} href="#showcase" className="text-sm font-medium text-white transition hover:text-white/80">{label}</a>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-1 rounded-full border border-white/10 bg-black/40 px-2 py-1.5 backdrop-blur-xl">
          <button type="button" className="rounded-full px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10">Get Free</button>
          <button type="button" className="rounded-full bg-white px-5 py-2 text-sm font-medium text-black transition hover:bg-white/90">Get a quote</button>
        </div>
      </nav>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[5] h-[60%] bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

      <div className="absolute inset-x-0 bottom-0 z-10 flex flex-col gap-6 px-4 pb-8 sm:px-6 sm:pb-12 lg:flex-row lg:items-end lg:justify-between lg:gap-12 lg:px-8 lg:pb-16">
        <div className="max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/40 px-3 py-1 text-xs font-medium text-white backdrop-blur-xl">
            <span>Luminara</span><span className="text-white/60">*</span><span>Creative Showcase</span>
          </div>
          <h1 className="text-2xl font-medium leading-[1.05] tracking-tight text-white sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl">
            Make ordinary ideas into captivating <span className="font-serif-italic font-normal">narratives.</span>
          </h1>
        </div>
        <p className="text-sm leading-relaxed text-white/80 sm:text-base lg:max-w-sm lg:text-right">
          Design your ideal online presence, grow your client base while crafting pieces with love and soul.
        </p>
      </div>
    </main>
  );
}

createRoot(document.getElementById('root')).render(<App />);
