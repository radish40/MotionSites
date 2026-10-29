import React, { useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { ArrowUpRight, Sparkle, Figma, Framer, Palette, PenTool, Layers, Type, Aperture, Chrome, Camera, Brush, Box, Wand2, type LucideIcon } from 'lucide-react';
import './index.css';

const asset = (name: string) => `${import.meta.env.BASE_URL}assets/${name}`;

function BackgroundVideo({ name }: { name: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => { if (media.matches) ref.current?.pause(); else void ref.current?.play().catch(() => {}); };
    sync(); media.addEventListener('change', sync);
    return () => media.removeEventListener('change', sync);
  }, []);
  return <video ref={ref} className="absolute inset-0 h-full w-full object-cover" autoPlay loop muted playsInline preload="auto" aria-hidden="true"><source src={asset(name)} type="video/mp4" /></video>;
}

function Label({ children, left = false }: { children: React.ReactNode; left?: boolean }) {
  return <h2 className={`relative z-10 flex items-center gap-3 text-[11px] font-normal tracking-[0.22em] text-white/70 ${left ? 'justify-start' : 'justify-center'}`}><Sparkle size={12} strokeWidth={1.5} /><span>{children}</span><Sparkle size={12} strokeWidth={1.5} /></h2>;
}

const experience = [
  ['2023-Now', 'Freelance Creative', 'Solo Studio'],
  ['2020-2023', 'Head of Brand Design', 'Rove Studio'],
  ['2017-2020', 'Visual Stylist', 'Ember Works'],
];
const firstRow: [LucideIcon, string][] = [[Figma, 'Figma'], [Framer, 'Framer'], [Palette, 'Palette'], [PenTool, 'Pen tool'], [Layers, 'Layers'], [Type, 'Typography'], [Aperture, 'Aperture'], [Chrome, 'Chrome']];
const secondRow: [LucideIcon, string][] = [[Camera, 'Camera'], [Brush, 'Brush'], [Box, '3D'], [Wand2, 'Magic'], [Figma, 'Figma'], [Framer, 'Framer'], [Type, 'Typography'], [Layers, 'Layers']];

function Marquee({ icons, reverse = false }: { icons: [LucideIcon, string][]; reverse?: boolean }) {
  return <div className="marquee-mask overflow-hidden"><div className={`marquee-track flex w-max ${reverse ? 'animate-marquee-right' : 'animate-marquee-left'}`}>
    {[0, 1].map(copy => <div className="flex gap-3 pr-3" key={copy} aria-hidden={copy === 1 ? true : undefined}>{icons.map(([Icon, name], i) => <div key={i} title={name} className="liquid-glass flex h-14 w-14 shrink-0 items-center justify-center rounded-xl text-white/90 md:h-16 md:w-16"><Icon size={25} strokeWidth={1.5} aria-label={name} /></div>)}</div>)}
  </div></div>;
}

function App() {
  return <main className="portfolio flex min-h-screen flex-col bg-[#0a0a0a] px-4 py-6 text-white antialiased sm:px-6 sm:py-8 md:px-10 md:py-10 lg:h-screen lg:px-14">
    <header className="mb-8 flex flex-col items-start justify-between gap-6 md:mb-10 md:flex-row md:gap-10">
      <div className="max-w-3xl">
        <h1 className="text-[28px] font-normal leading-[1.15] tracking-tight sm:text-3xl md:text-4xl lg:text-[44px]">Hi, I'm Max Reed!</h1>
        <p className="mt-4 max-w-3xl text-sm leading-[1.6] text-white/60 md:text-[15px]">A London-based independent creator shaping sharp visual systems, web-ready products, and story-first campaigns. With a decade of craft behind me, I help ideas move with focus and intention.</p>
      </div>
      <a href="mailto:hi@maxreed.com" className="liquid-glass team-up inline-flex shrink-0 items-center justify-center rounded-full px-5 py-2.5 text-[13px] sm:px-6 sm:py-3 md:mt-1">Let's Team Up Today</a>
    </header>

    <div className="portfolio-grid grid min-h-0 flex-1 grid-cols-1 gap-4 md:grid-cols-2 md:gap-5 lg:grid-cols-3">
      <section className="background-card card relative flex min-h-[540px] flex-col justify-between overflow-hidden rounded-2xl bg-black p-5 md:p-6 lg:min-h-0">
        <BackgroundVideo name="background.mp4" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/85" />
        <Label>BACKGROUND</Label>
        <div className="timeline relative z-10 grid grid-cols-[auto_auto_1fr_auto] items-center gap-x-2.5 gap-y-5 text-[10px] xl:text-[11px] 2xl:text-xs">
          {experience.map(([year, role, studio]) => <React.Fragment key={year}><span className="text-white/65">{year}</span><Sparkle size={12} strokeWidth={1.5} className="text-white/60" /><span>{role}</span><span className="text-right text-white/65">{studio}</span></React.Fragment>)}
        </div>
      </section>

      <div className="middle-column grid min-h-0 gap-4 md:grid-rows-[auto_1fr] md:gap-5">
        <section className="card noise-overlay relative overflow-hidden rounded-2xl bg-[#324444] p-5 md:p-6">
          <Label left>CLIENT VOICE</Label>
          <blockquote className="relative z-10 mb-7 mt-7 text-[13px] leading-[1.6] text-white/85 sm:text-[13.5px]">“Max reshaped our image with a degree of finesse and vision that surpassed what we'd hoped for. The process felt graceful, and the outcomes speak for themselves.”</blockquote>
          <div className="relative z-10 text-xs leading-relaxed"><p className="font-semibold">Elena Brooks</p><p className="mt-1 text-[11px] text-white/60">Creative Director — Halcyon</p></div>
        </section>
        <section className="impact-card card relative flex min-h-[300px] items-center justify-center overflow-hidden rounded-2xl bg-black lg:min-h-0" aria-label="10 million plus raised for startups">
          <BackgroundVideo name="impact.mp4" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/5 to-transparent" />
          <p className="relative z-10 text-5xl font-light tracking-tight drop-shadow-lg sm:text-6xl md:text-7xl lg:text-[88px]">10M+</p>
          <p className="absolute bottom-6 z-10 text-[13px] text-white/85">Raised for startups</p>
        </section>
      </div>

      <div className="right-column grid min-h-0 gap-4 md:gap-5 lg:grid-rows-[1fr_auto]">
        <section className="software-card card relative flex min-h-[350px] flex-col justify-between overflow-hidden rounded-2xl bg-black py-6 lg:min-h-0">
          <BackgroundVideo name="software.mp4" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/40" />
          <Label>DAILY SOFTWARE</Label>
          <div className="relative z-10 mt-12 space-y-3"><Marquee icons={firstRow} /><Marquee icons={secondRow} reverse /></div>
        </section>
        <section id="reach-me" className="reach-card card noise-overlay relative flex min-h-[210px] flex-col justify-between overflow-hidden rounded-2xl bg-[#324444] p-5 md:p-6">
          <Label left>REACH ME</Label>
          <a className="contact-arrow liquid-glass absolute right-5 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full md:right-6 md:top-5" href="mailto:hi@maxreed.com" aria-label="Email Max Reed"><ArrowUpRight size={19} strokeWidth={1.5} /></a>
          <address className="relative z-10 mt-8 flex flex-col items-start gap-2 text-[15px] not-italic"><a href="mailto:hi@maxreed.com">hi@maxreed.com</a><a className="text-white/60" href="tel:+442078163">+44 207 81 63</a></address>
        </section>
      </div>
    </div>
  </main>;
}

createRoot(document.getElementById('root')!).render(<React.StrictMode><App /></React.StrictMode>);
