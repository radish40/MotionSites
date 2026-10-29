import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { motion, useScroll, useTransform, type MotionValue } from 'framer-motion';
import { Linkedin, Phone, Mail } from 'lucide-react';
import './style.css';

const asset = (name: string) => `${import.meta.env.BASE_URL}assets/${name}`;
const clamp = (n: number) => Math.min(1, Math.max(0, n));

function Reveal({ children, delay = 0, className = '', as = 'div' }: { children: React.ReactNode; delay?: number; className?: string; as?: 'div' | 'span' }) {
  const ref = useRef<HTMLDivElement & HTMLSpanElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setVisible(true); observer.disconnect(); }
    }, { threshold: 0.15 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  const Tag = as;
  return <Tag ref={ref} style={{ transitionDelay: `${delay}ms` }} className={`${className} transition-all duration-700 ease-out will-change-transform ${visible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>{children}</Tag>;
}

function Navbar() {
  return <nav aria-label="Main navigation" className="fixed right-4 top-4 z-50 sm:right-8 sm:top-7 md:right-12"><Reveal><a className="flex items-center gap-2 text-[#E2DBC8] transition-opacity hover:opacity-80" href="#top" aria-label="Terova home">
    <svg width="24" height="24" viewBox="0 0 256 256" fill="#E2DBC8" aria-hidden="true"><path fillRule="evenodd" d="M 156 0 C 211.228 0 256 44.772 256 100 L 256 256 L 100 256 C 44.772 256 0 211.228 0 156 L 0 0 Z M 80 80 C 80 133.019 122.981 176 176 176 C 176 122.981 133.019 80 80 80 Z" /></svg>
    <span className="text-lg font-semibold tracking-tight">terova</span>
  </a></Reveal></nav>;
}

function Hero() {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const update = () => { if (ref.current) ref.current.style.opacity = String(Math.max(0, 1 - window.scrollY / (window.innerHeight * 0.6))); };
    update(); window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => { window.removeEventListener('scroll', update); window.removeEventListener('resize', update); };
  }, []);
  return <><header ref={ref} className="hero fixed inset-0 z-0 flex flex-col bg-[#464340] p-3 sm:p-4 md:p-5">
    <div className="relative flex flex-1 flex-col rounded-2xl">
      <div className="absolute inset-0 overflow-hidden rounded-2xl bg-[#343c30]"><video className="h-full w-full object-cover" src={asset('hero.mp4')} autoPlay muted loop playsInline preload="auto" /><div className="absolute inset-0 bg-black/10" /></div>
      <div className="relative z-10 flex flex-1 flex-col justify-between px-5 pb-20 pt-20 sm:px-8 sm:pb-16 sm:pt-14 md:px-10 md:pb-16 md:pt-12">
        <Reveal delay={200}><h1 className="text-[2.5rem] font-normal leading-[1.05] tracking-tighter text-[#E2DBC8]/80 sm:text-6xl md:text-7xl lg:text-8xl">Circular systems<br />for a cleaner<br />planet</h1></Reveal>
        <div className="flex flex-col items-center gap-6 text-center"><Reveal delay={400}><p className="max-w-xs text-sm text-[#E2DBC8]/80 sm:text-base">Next-Generation Portable Waste<br />Reclamation Technology</p></Reveal><Reveal delay={500}><a href="#about" className="text-xs uppercase tracking-[0.2em] text-[#E2DBC8]/50 transition-colors hover:text-[#E2DBC8]">Start Here</a></Reveal></div>
      </div>
      <div className="social-notch absolute bottom-0 left-0 z-20"><div className="flex items-center gap-4 rounded-tr-[20px] bg-[#464340] px-5 py-3 text-[#E2DBC8]/60">
        <a href="https://www.linkedin.com/" target="_blank" rel="noreferrer" aria-label="LinkedIn" className="transition-colors hover:text-[#E2DBC8]"><Linkedin size={18} strokeWidth={1.5} /></a>
        <a href="tel:" aria-label="Phone" className="transition-colors hover:text-[#E2DBC8]"><Phone size={18} strokeWidth={1.5} /></a>
        <a href="mailto:" aria-label="Email" className="transition-colors hover:text-[#E2DBC8]"><Mail size={18} strokeWidth={1.5} /></a>
      </div></div>
    </div>
  </header><div className="h-[170vh]" aria-hidden="true" /></>;
}

const aboutText = "Our planet's ecological balance is shifting at an unprecedented pace. Resource recovery obstacles and contamination crises have surpassed critical limits, and the pursuit of transformative green solutions has never carried more weight.";
function Character({ char, index, total, progress }: { char: string; index: number; total: number; progress: MotionValue<number> }) {
  const opacity = useTransform(progress, [index / total, index / total + 0.005], [0.3, 1]);
  return <span className="relative"><span className="invisible">{char}</span><motion.span className="absolute left-0 top-0" style={{ opacity }}>{char}</motion.span></span>;
}
function About() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.8', 'end 0.2'] });
  let index = 0;
  return <section id="about" ref={ref} className="relative z-10 flex min-h-screen items-end bg-[#1C261E] px-5 pb-10 sm:px-8 sm:pb-14 md:px-12 md:pb-16" aria-label="Our planet's ecological balance">
    <p aria-label={aboutText} className="max-w-[1350px] text-2xl font-normal leading-snug tracking-tight text-[#E2DBC8] sm:text-3xl md:text-5xl lg:text-6xl lg:leading-[1.15]">
      <span aria-hidden="true">{aboutText.split(' ').map((word, wordIndex) => <React.Fragment key={wordIndex}><span className="inline-block whitespace-nowrap">{[...word].map(char => { const i = index++; return <Character key={i} char={char} index={i} total={aboutText.length} progress={scrollYProgress} />; })}</span>{wordIndex < aboutText.split(' ').length - 1 && <Character char=" " index={index++} total={aboutText.length} progress={scrollYProgress} />}</React.Fragment>)}</span>
    </p>
  </section>;
}

function ScrollVideo({ parent }: { parent: React.RefObject<HTMLDivElement> }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fallbackRef = useRef<HTMLVideoElement>(null);
  const [ready, setReady] = useState(false);
  const [frameCount, setFrameCount] = useState(0);
  useEffect(() => {
    let disposed = false, raf = 0, smoothed = 0, target = 0, lastFrame = -1;
    let frames: ImageBitmap[] = [];
    const canvas = canvasRef.current!;
    const context = canvas.getContext('2d');
    const source = document.createElement('video');
    source.muted = true; source.playsInline = true; source.preload = 'auto'; source.src = asset('reclamation.mp4');
    const update = () => {
      const el = parent.current;
      if (el) target = clamp(-el.getBoundingClientRect().top / (el.offsetHeight - window.innerHeight));
    };
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(window.innerWidth * dpr); canvas.height = Math.round(window.innerHeight * dpr);
      lastFrame = -1; update();
    };
    const render = () => {
      smoothed += (target - smoothed) * 0.1;
      if (frames.length && context) {
        const i = Math.min(frames.length - 1, Math.round(smoothed * (frames.length - 1)));
        if (i !== lastFrame) {
          const frame = frames[i];
          const scale = Math.max(canvas.width / frame.width, canvas.height / frame.height);
          const w = frame.width * scale, h = frame.height * scale;
          context.drawImage(frame, (canvas.width - w) / 2, (canvas.height - h) / 2, w, h);
          lastFrame = i;
        }
      } else {
        const video = fallbackRef.current;
        if (video && Number.isFinite(video.duration) && !video.seeking) {
          const time = smoothed * Math.max(0, video.duration - 0.05);
          if (Math.abs(video.currentTime - time) > 0.035) video.currentTime = time;
        }
      }
      raf = requestAnimationFrame(render);
    };
    const waitFor = (event: 'loadeddata' | 'seeked', action: () => void) => new Promise<void>((resolve, reject) => {
      const finish = () => { cleanup(); resolve(); };
      const fail = () => { cleanup(); reject(new Error(`Video ${event} failed`)); };
      const timer = window.setTimeout(fail, 12000);
      const cleanup = () => { clearTimeout(timer); source.removeEventListener(event, finish); source.removeEventListener('error', fail); };
      source.addEventListener(event, finish, { once: true }); source.addEventListener('error', fail, { once: true }); action();
    });
    const extract = async () => {
      const extracted: ImageBitmap[] = [];
      try {
        await waitFor('loadeddata', () => source.load());
        if (!window.createImageBitmap || !Number.isFinite(source.duration)) throw new Error('Frame extraction unavailable');
        const count = Math.min(120, Math.max(2, Math.ceil(source.duration * 24)));
        const width = Math.min(1280, source.videoWidth), height = Math.round(source.videoHeight * width / source.videoWidth);
        for (let i = 0; i < count; i++) {
          if (disposed) break;
          const time = (i / (count - 1)) * Math.max(0, source.duration - 0.05);
          if (Math.abs(source.currentTime - time) > 0.001) await waitFor('seeked', () => { source.currentTime = time; });
          const frame = await createImageBitmap(source, { resizeWidth: width, resizeHeight: height, resizeQuality: 'low' });
          extracted.push(frame);
          canvas.dataset.extracted = String(extracted.length);
        }
        if (disposed) { extracted.forEach(frame => frame.close()); return; }
        frames = extracted; setFrameCount(frames.length); setReady(true);
      } catch (error) {
        extracted.forEach(frame => frame.close());
        if (!disposed) console.warn('Using seek-based video fallback:', error);
      } finally { source.removeAttribute('src'); source.load(); }
    };
    const timer = window.setTimeout(extract, 600);
    resize(); render(); window.addEventListener('scroll', update, { passive: true }); window.addEventListener('resize', resize);
    return () => { disposed = true; clearTimeout(timer); cancelAnimationFrame(raf); window.removeEventListener('scroll', update); window.removeEventListener('resize', resize); frames.forEach(frame => frame.close()); };
  }, [parent]);
  return <div className="absolute inset-0 -z-10 bg-[#0a0a0a]" data-frames={frameCount}>
    <video ref={fallbackRef} className={`absolute h-full w-full object-cover ${ready ? 'invisible' : ''}`} src={asset('reclamation.mp4')} muted playsInline preload="auto" />
    <canvas ref={canvasRef} className={`absolute h-full w-full ${ready ? '' : 'invisible'}`} aria-label="Scroll-driven waste reclamation film" />
    <div className="absolute inset-0 bg-black/20" /><div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[#1C261E] to-transparent sm:h-56 md:h-72" />
  </div>;
}

function Statistics() {
  const ref = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    let raf = 0;
    const update = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(() => { const el = ref.current; if (el) setProgress(clamp(-el.getBoundingClientRect().top / (el.offsetHeight - innerHeight))); }); };
    update(); window.addEventListener('scroll', update, { passive: true }); window.addEventListener('resize', update);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('scroll', update); window.removeEventListener('resize', update); };
  }, []);
  const first = Math.min(clamp(progress / 0.2), clamp((0.55 - progress) / 0.1));
  const second = Math.min(clamp((progress - 0.5) / 0.1), clamp((1 - progress) / 0.15));
  const slide = (opacity: number, delay = 0) => ({ opacity, transform: `translateY(${opacity > 0.1 ? 0 : 2}rem)`, transitionDelay: `${delay}ms` });
  return <div ref={ref} className="relative z-10 h-[400vh]" id="impact">
    <div className="sticky top-0 isolate h-screen w-full">
      <ScrollVideo parent={ref} />
      <div className="pointer-events-none absolute inset-0 z-10">
        <section aria-label="Annual refuse" className="absolute inset-0 flex flex-col justify-end gap-5 px-5 pb-20 sm:px-8 sm:pb-20 md:px-12 md:pb-24" style={{ visibility: first === 0 ? 'hidden' : 'visible' }}>
          <h2 style={slide(first)} className="stat-heading transition-all duration-700 ease-out will-change-transform">2.01 billion</h2>
          <p style={slide(first, 100)} className="max-w-lg text-sm leading-relaxed text-[#E2DBC8]/70 transition-all duration-700 ease-out will-change-transform sm:text-base">Tons of household and commercial refuse produced every single year. Lined up in hauling vehicles, this debris would circle the globe <span className="inline-flex items-center rounded bg-[#4caf50] px-2 py-0.5 text-xs font-semibold text-[#E2DBC8] sm:text-sm">24 times</span></p>
        </section>
        <section aria-label="Refuse reclaimed" className="absolute inset-0 flex flex-col justify-end gap-5 px-5 pb-20 sm:px-8 sm:pb-20 md:px-12 md:pb-24" style={{ visibility: second === 0 ? 'hidden' : 'visible' }}>
          <h2 style={slide(second)} className="stat-heading transition-all duration-700 ease-out will-change-transform">under a fifth</h2>
          <p style={slide(second, 100)} className="text-sm text-[#E2DBC8]/70 transition-all duration-700 ease-out will-change-transform sm:text-base">Of all refuse is reclaimed each year</p>
        </section>
      </div>
    </div>
  </div>;
}

function App() {
  return <><div id="top" /><Navbar /><main><Hero /><About /><Statistics /></main><div aria-hidden="true" className="fixed bottom-4 right-4 z-50 grid h-10 w-10 grid-cols-3 grid-rows-3 place-items-center rounded-md bg-[#E2DBC8] p-2 sm:bottom-6 sm:right-6 sm:h-11 sm:w-11 md:h-12 md:w-12">{Array.from({ length: 9 }, (_, i) => <span key={i} className={`h-[7px] w-[7px] rounded-full ${[0, 2, 4, 6, 8].includes(i) ? 'bg-[#1C261E]' : ''}`} />)}</div></>;
}
createRoot(document.getElementById('root')!).render(<App />);
