import { useEffect, useRef, useState, type ReactNode } from 'react';

const asset = (name: string) => `${import.meta.env.BASE_URL}assets/${name}`;
const links = ['About', 'Services', 'Journal', 'Contact'];

function Button({ children, onClick, className = '' }: { children: ReactNode; onClick?: () => void; className?: string }) {
  return <a href="#about" onClick={onClick} className={`inline-flex items-center justify-center bg-white text-black px-8 py-3.5 rounded-full font-medium text-sm tracking-wide hover:bg-white/90 transition-all duration-300 button-glow ${className}`}>{children}</a>;
}

function Navbar() {
  const [open, setOpen] = useState(false);
  const menu = useRef<HTMLDivElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const close = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { setOpen(false); toggle.current?.focus(); }
      if (event.key === 'Tab') {
        const items = [toggle.current, ...(menu.current?.querySelectorAll<HTMLAnchorElement>('a') ?? [])].filter(Boolean) as HTMLElement[];
        const first = items[0], last = items[items.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }
    };
    const resize = () => { if (window.innerWidth >= 768) setOpen(false); };
    window.addEventListener('keydown', close);
    window.addEventListener('resize', resize);
    return () => { document.body.style.overflow = originalOverflow; window.removeEventListener('keydown', close); window.removeEventListener('resize', resize); };
  }, [open]);

  return <>
    <nav aria-label="Main navigation" className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 py-5 text-white">
      <a href="#home" aria-label="Serene home" className="brand text-2xl md:text-3xl">Serene</a>
      <div className="absolute left-1/2 -translate-x-1/2 hidden md:flex gap-12">
        {links.map(link => <a key={link} href="#about" className="text-white/80 hover:text-white text-sm tracking-wide transition-colors">{link}</a>)}
      </div>
      <Button className="hidden md:inline-flex">Book a consultation</Button>
      <button ref={toggle} aria-expanded={open} aria-controls="mobile-menu" aria-label={open ? 'Close menu' : 'Open menu'} onClick={() => setOpen(!open)} className={`menu-toggle md:hidden ${open ? 'is-open' : ''}`}>
        <span /><span /><span />
      </button>
    </nav>
    <button tabIndex={-1} aria-label="Close navigation" onClick={() => setOpen(false)} className={`fixed inset-0 z-40 bg-black/30 transition-opacity duration-500 md:hidden ${open ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} />
    <div id="mobile-menu" ref={menu} inert={!open} className={`mobile-menu fixed top-0 right-0 bottom-0 z-40 w-[85%] max-w-[340px] bg-[#0a0608]/95 backdrop-blur-xl border-l border-white/10 px-9 pt-32 pb-12 flex flex-col md:hidden ${open ? 'is-open' : ''}`}>
      <div className="flex flex-col gap-8">
        {links.map((link, index) => <a key={link} href="#about" onClick={() => setOpen(false)} style={{ transitionDelay: open ? `${150 + index * 75}ms` : '0ms' }} className="menu-item text-white/80 hover:text-white text-xl tracking-wide">{link}</a>)}
      </div>
      <div className="menu-item mt-auto" style={{ transitionDelay: open ? '450ms' : '0ms' }}><Button onClick={() => setOpen(false)} className="w-full px-5">Book a consultation</Button></div>
    </div>
  </>;
}

function Hero() {
  const video = useRef<HTMLVideoElement>(null);
  const [sound, setSound] = useState(false);
  return <section id="home" aria-label="Begin your renewal" className="relative h-screen overflow-hidden">
    <video ref={video} autoPlay muted loop playsInline preload="auto" className="absolute inset-0 w-full h-full object-cover" src={asset('serene-hero.mp4')} />
    <div className="absolute inset-0 bg-black/20" />
    <Navbar />
    <div className="absolute inset-0 flex flex-col items-center justify-center px-6 -mt-[120px]">
      <h1 className="font-instrument text-white text-[36px] md:text-7xl lg:text-[110px] leading-[0.9] tracking-tight text-center text-glow">Gentle touch. Radiant presence.</h1>
      <p className="text-white/70 text-sm md:text-base text-center mt-5 md:mt-7 max-w-xl">Expert beauty and holistic wellness, delivered with warmth and intention.</p>
      <Button className="mt-6 md:mt-9">Begin your renewal</Button>
    </div>
    <button onClick={() => { const next = !sound; if (video.current) video.current.muted = !next; setSound(next); }} aria-label={sound ? 'Mute background video' : 'Unmute background video'} aria-pressed={sound} className="absolute bottom-8 left-8 hidden md:flex items-center gap-3 text-white/60 text-xs text-left hover:text-white transition-colors">
      <span className="flex w-10 h-10 items-center justify-center rounded-full border border-white/20"><span className={sound ? 'sound-bars playing' : 'sound-bars'}><i /><i /><i /></span></span>
      <span>Experience<br />{sound ? 'sound on' : 'with sound'}</span>
    </button>
  </section>;
}

function QuoteSection() {
  const section = useRef<HTMLElement>(null);
  const rainbow = useRef<HTMLImageElement>(null);
  const left = useRef<HTMLImageElement>(null);
  const right = useRef<HTMLImageElement>(null);
  useEffect(() => {
    let frame = 0;
    let rainbowY = 120, cloudX = -200, cloudY = 0;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const lerp = (current: number, target: number, factor: number) => current + (target - current) * factor;
    const animate = () => {
      const rect = section.current!.getBoundingClientRect();
      const progress = Math.max(0, Math.min(1, (window.innerHeight - rect.top) / (window.innerHeight + rect.height)));
      const visible = progress > 0.12 && progress < 0.92;
      rainbowY = lerp(rainbowY, 120 - progress * 280, 0.06);
      cloudX = lerp(cloudX, visible ? 0 : -200, 0.04);
      cloudY = lerp(cloudY, progress * -50, 0.04);
      if (rainbow.current) rainbow.current.style.transform = `translate3d(0, ${reducedMotion.matches ? -20 : rainbowY}px, 0)`;
      [left.current, right.current].forEach((cloud, index) => {
        if (!cloud) return;
        cloud.style.transform = `translate3d(${reducedMotion.matches ? 0 : index === 0 ? cloudX : -cloudX}px, ${reducedMotion.matches ? -25 : cloudY}px, 0)${index === 1 ? ' scaleX(-1)' : ''}`;
        cloud.style.opacity = String(reducedMotion.matches ? 1 : 1 - Math.abs(cloudX) / 200);
      });
      frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, []);
  return <section ref={section} id="about" aria-label="Our philosophy" className="quote-section relative h-screen overflow-hidden flex items-center justify-center px-6 md:px-12">
    <img ref={rainbow} src={asset('rainbow.png')} alt="" className="pointer-events-none absolute inset-x-0 top-0 z-30 w-full will-change-transform" style={{ transform: 'translate3d(0,120px,0)' }} />
    <div className="pointer-events-none absolute left-0 bottom-[10%] z-10 hidden sm:block w-[500px] md:w-[650px]">
      <img ref={left} src={asset('cloud.png')} alt="" className="cloud w-full max-w-none will-change-transform" style={{ marginLeft: '-50%', opacity: 0, transform: 'translate3d(-200px,0,0)' }} />
    </div>
    <div className="pointer-events-none absolute right-0 bottom-[15%] z-10 hidden sm:flex justify-end w-[500px] md:w-[650px]">
      <img ref={right} src={asset('cloud.png')} alt="" className="cloud w-full shrink-0 max-w-none will-change-transform" style={{ marginRight: '-75%', opacity: 0, transform: 'translate3d(200px,0,0) scaleX(-1)' }} />
    </div>
    <figure className="relative z-20 max-w-4xl text-center">
      <blockquote className="font-instrument text-white text-xl sm:text-2xl md:text-4xl lg:text-[42px] leading-[1.45] md:leading-[1.5]">“Serene was founded on a belief in beauty that honors your nature. We pursue refined outcomes, considered approaches, and lasting vitality. We spend time learning what matters to you before deciding what serves you best. No rushing, no excess -- just support that lets you feel radiant.”</blockquote>
      <figcaption className="mt-6 md:mt-8 text-white/80 text-sm md:text-base tracking-wide">Dr. Mia Callahan -- Founder</figcaption>
    </figure>
  </section>;
}

export default function App() { return <main className="bg-[#0a0608]"><Hero /><QuoteSection /></main>; }
