import { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { ArrowRight, Menu, X } from 'lucide-react';
import { Shader, StudioBackground, Spherize, Swirl, LensFlare, FloatingParticles, CursorRipples, FilmGrain } from 'shaders/react';
import './styles.css';

const links = ['Platform', 'How it works', 'AI Defense', 'Connections', 'Insights'];

function Background() {
  return <Shader className="absolute inset-0 z-0 h-full w-full" disableTelemetry>
    <StudioBackground id="studio" ambientIntensity={32} ambientSpeed={0.3} backColor="#1a0f2e" backIntensity={34} backSoftness={61} brightness={5} center={{ x: 0.49, y: 0.95 }} color="#17171c" fillAngle={84} fillColor="#ffffff" fillIntensity={55} fillSoftness={100} keyColor="#ffffff" keyIntensity={15} keySoftness={70} lightTarget={64} seed={42} vignette={25} wallCurvature={42} />
    <Spherize id="sphere" depth={1.1} lightColor="#a9cbe8" lightIntensity={0.3} lightPosition={{ x: 0.62, y: 0.01 }} lightSoftness={0.2} radius={0.9}>
      <Swirl id="swirl" colorA="#0a0a0d" colorB="#0f0f1a" colorSpace="oklab" detail={1.2} speed={0.5} />
      <LensFlare id="flare" ghostChroma={0} ghostIntensity={0.35} ghostSpread={0.78} glareIntensity={0.15} glareSize={0.15} haloChroma={2} haloIntensity={0.27} haloRadius={0.38} haloSoftness={1.1} lightPosition={{ x: 0.57, y: 0.25 }} speed={0.9} starburstIntensity={0.05} starburstPoints={4} streakIntensity={0} streakLength={0.21} />
      <FloatingParticles id="particles" angle={188} angleVariance={77} opacity={0.49} particleColor="#c5b7ed" particleSize={0.6} randomness={0.3} speed={0.1} speedVariance={0.6} twinkle={1} />
      <CursorRipples id="cursor" chromaticSplit={3} decay={4} />
    </Spherize>
    <FilmGrain id="grain" strength={0.05} visible={true} />
  </Shader>;
}

function App() {
  const [open, setOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const close = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && open) {
        setOpen(false);
        menuButton.current?.focus();
      }
    };
    const media = window.matchMedia('(min-width: 1024px)');
    const resize = () => { if (media.matches) setOpen(false); };
    window.addEventListener('keydown', close);
    media.addEventListener('change', resize);
    return () => { window.removeEventListener('keydown', close); media.removeEventListener('change', resize); };
  }, [open]);

  return <main id="hero" className="relative h-screen w-full overflow-hidden bg-black text-white" style={{ fontFamily: 'Inter, sans-serif' }}>
    <Background />
    <header className="absolute top-0 right-0 left-0 z-50 flex items-center justify-between px-5 py-4 lg:px-10 lg:py-6">
      <a href="#hero" aria-label="axentra home" className="text-xl font-semibold tracking-tight">axentra</a>
      <nav aria-label="Main navigation" className="liquid-glass absolute left-1/2 hidden -translate-x-1/2 items-center rounded-full p-1.5 lg:flex">
        {links.map(link => <a key={link} href="#hero" className="rounded-full px-4 py-2 text-sm whitespace-nowrap text-white/80 transition-colors hover:bg-white/10 hover:text-white">{link}</a>)}
      </nav>
      <button className="hidden rounded-full bg-white px-5 py-2 text-sm font-medium text-black transition-opacity hover:opacity-80 lg:block" type="button">Join the wait</button>
      <button ref={menuButton} type="button" className="menu-toggle relative flex h-9 w-9 items-center justify-center lg:hidden" aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} aria-controls="mobile-menu" onClick={() => setOpen(!open)}>
        <Menu size={22} className={`absolute transition-all duration-300 ${open ? 'rotate-90 scale-50 opacity-0' : 'rotate-0 scale-100 opacity-100'}`} />
        <X size={22} className={`absolute transition-all duration-300 ${open ? 'rotate-0 scale-100 opacity-100' : '-rotate-90 scale-50 opacity-0'}`} />
      </button>
      <nav id="mobile-menu" aria-label="Mobile navigation" aria-hidden={!open} inert={!open} className={`mobile-menu absolute top-full right-0 left-0 px-5 pb-6 pt-3 backdrop-blur-xl lg:hidden ${open ? 'is-open' : ''}`}>
        {links.map((link, index) => <a href="#hero" key={link} style={{ transitionDelay: open ? `${index * 50}ms` : '0ms' }} className="menu-item block rounded-xl px-3 py-3.5 text-sm text-white/70 transition-colors hover:bg-white/10 hover:text-white" onClick={() => setOpen(false)}>{link}</a>)}
        <button type="button" style={{ transitionDelay: open ? '250ms' : '0ms' }} className="menu-item mt-4 w-full rounded-full bg-white px-5 py-3 text-sm font-medium text-black transition-opacity hover:opacity-80">Join the wait</button>
      </nav>
    </header>
    <div className="pointer-events-none relative z-20 flex h-full flex-col items-center justify-center px-5 text-center sm:px-8 lg:px-10">
      <h1 className="max-w-3xl text-[clamp(1.75rem,5vw,2.6rem)] leading-[1.12] font-normal tracking-tight">When strategy meets its spark<br className="hidden sm:block" /><span className="sm:hidden"> </span>and thought reshapes what lies ahead</h1>
      <p className="mt-5 max-w-xs text-sm leading-relaxed tracking-[0.01em] text-white/60 sm:max-w-sm md:mt-6 md:max-w-md md:text-base" style={{ fontFamily: '"Courier New", monospace' }}>a fluid channel - where deep resolve<br />and neural insight dissolve as one</p>
      <button type="button" className="group pointer-events-auto mt-7 flex items-center gap-2.5 rounded-full bg-white px-5 py-2.5 text-sm font-medium text-black transition-opacity hover:opacity-80 md:mt-8">See it in motion<ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" /></button>
    </div>
  </main>;
}

createRoot(document.getElementById('root')!).render(<App />);
