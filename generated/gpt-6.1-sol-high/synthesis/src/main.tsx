import React, { useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';

const VIDEO = `${import.meta.env.BASE_URL}assets/health-capital.mp4`;
const SCRUB_END = 0.55;
const FADE_END = 0.65;
const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value));
const paragraphs = [
  'Elias is committed to a tomorrow where people enjoy more vibrant, rewarding decades beside loved ones.',
  'In pursuit of this purpose, in 2021 he co-founded the Healthspan Research Alliance, a global nonprofit backing early-stage science on prolonging the healthy human lifespan.',
  'Elias is also a managing partner and co-founder of VitalVC, a venture capital firm backing bold pioneers in biotech and lifespans.',
];

function jumpTo(event: React.MouseEvent<HTMLAnchorElement>, progress: number) {
  event.preventDefault();
  const section = document.querySelector<HTMLElement>('#health-capital');
  if (section) {
    history.replaceState(null, '', event.currentTarget.hash || location.pathname);
    window.scrollTo({ top: section.offsetTop + (section.offsetHeight - innerHeight) * progress, behavior: 'smooth' });
  }
}

function Navbar() {
  return <nav aria-label="Main navigation" className="fixed inset-x-0 top-0 z-50 flex items-center justify-between px-4 py-4 sm:px-6 sm:py-5 md:px-12 md:py-7">
    <a href="#health-capital" onClick={e => jumpTo(e, 0)} className="text-lg tracking-tight text-white sm:text-xl md:text-2xl">Elias <span className="font-instrument italic">Norden</span></a>
    <div className="flex gap-4 sm:gap-6 md:gap-10 text-[10px] font-medium uppercase tracking-[0.14em] text-white/80 sm:text-[11px] sm:tracking-[0.18em] md:text-xs">
      <a href="#articles" onClick={e => jumpTo(e, 0.3)} className="transition-colors duration-300 hover:text-white">Articles</a>
      <a href="#allocations" onClick={e => jumpTo(e, 1)} className="transition-colors duration-300 hover:text-white">Allocations</a>
      <a href="mailto:?subject=Health%20Capital%20inquiry" className="transition-colors duration-300 hover:text-white">Inquire</a>
    </div>
  </nav>;
}

function Hero() {
  const section = useRef<HTMLElement>(null);
  const hero = useRef<HTMLDivElement>(null);
  const reveal = useRef<HTMLDivElement>(null);
  const fallback = useRef<HTMLVideoElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const textRefs = useRef<(HTMLParagraphElement | null)[]>([]);

  useEffect(() => {
    const host = section.current!;
    const video = fallback.current!;
    const surface = canvas.current!;
    const context = surface.getContext('2d', { alpha: false });
    const controller = new AbortController();
    let cancelled = false;
    let objectUrl = '';
    let decoder: HTMLVideoElement | null = null;
    let frames: ImageBitmap[] = [];
    let ready = false;
    let seeking = false;
    let animation = 0;
    let smoothed = 0;
    let drawn = -1;
    let visibleCount = -1;
    let resize = true;
    const onSeeked = () => { seeking = false; };
    const onResize = () => { resize = true; };
    video.addEventListener('seeked', onSeeked);
    window.addEventListener('resize', onResize);

    function waitFor(element: HTMLVideoElement, name: string) {
      return new Promise<void>((resolve, reject) => {
        const clean = () => {
          element.removeEventListener(name, success);
          element.removeEventListener('error', fail);
          controller.signal.removeEventListener('abort', fail);
        };
        const success = () => { clean(); resolve(); };
        const fail = () => { clean(); reject(new Error(cancelled ? 'Cancelled' : 'Video decode failed')); };
        element.addEventListener(name, success, { once: true });
        element.addEventListener('error', fail, { once: true });
        controller.signal.addEventListener('abort', fail, { once: true });
      });
    }

    async function extract() {
      const extracted: ImageBitmap[] = [];
      try {
        const response = await fetch(VIDEO, { signal: controller.signal });
        if (!response.ok) throw new Error(`Video HTTP ${response.status}`);
        const blob = await response.blob();
        if (cancelled) return;
        objectUrl = URL.createObjectURL(blob);
        decoder = document.createElement('video');
        decoder.muted = true;
        decoder.playsInline = true;
        decoder.preload = 'auto';
        const loaded = waitFor(decoder, 'loadeddata');
        decoder.src = objectUrl;
        decoder.load();
        await loaded;
        const count = clamp(Math.round(decoder.duration * 24), 30, 110);
        const width = Math.min(1280, decoder.videoWidth);
        const height = Math.round(width * decoder.videoHeight / decoder.videoWidth);
        for (let i = 0; i < count; i++) {
          if (cancelled) return;
          const time = i / (count - 1) * Math.max(0, decoder.duration - 0.04);
          if (Math.abs(decoder.currentTime - time) > 0.001) {
            const seek = waitFor(decoder, 'seeked');
            decoder.currentTime = time;
            await seek;
          }
          const bitmap = await createImageBitmap(decoder, { resizeWidth: width, resizeHeight: height });
          if (cancelled) { bitmap.close(); return; }
          extracted.push(bitmap);
          host.dataset.extracted = String(extracted.length);
        }
        frames = extracted;
        ready = true;
        host.dataset.frames = String(frames.length);
        host.dataset.renderer = 'canvas';
        surface.style.opacity = '1';
        video.style.opacity = '0';
      } catch (error) {
        if (!cancelled) {
          host.dataset.renderer = 'video-fallback';
          console.warn('Frame extraction unavailable; using seeked video.', error);
        }
      } finally {
        if (!ready) extracted.forEach(frame => frame.close());
        if (decoder) { decoder.removeAttribute('src'); decoder.load(); }
      }
    }
    void extract();

    function tick() {
      if (cancelled) return;
      const target = clamp(-host.getBoundingClientRect().top / (host.offsetHeight - innerHeight));
      smoothed += (target - smoothed) * 0.1;
      const scrub = clamp(smoothed / SCRUB_END);
      const fade = clamp((smoothed - SCRUB_END) / (FADE_END - SCRUB_END));
      hero.current!.style.opacity = String(1 - fade);
      reveal.current!.style.opacity = String(fade);
      reveal.current!.style.pointerEvents = fade > 0.5 ? 'auto' : 'none';
      hero.current!.inert = fade > 0.5;
      reveal.current!.setAttribute('aria-hidden', String(fade <= 0.5));
      const nextCount = smoothed >= FADE_END ? Math.min(3, Math.floor((smoothed - FADE_END) / ((1 - FADE_END) / 3)) + 1) : 0;
      if (nextCount !== visibleCount) {
        visibleCount = nextCount;
        textRefs.current.forEach((paragraph, i) => {
          if (paragraph) {
            paragraph.style.opacity = i < visibleCount ? '1' : '0';
            paragraph.style.transform = i < visibleCount ? 'translateY(0)' : 'translateY(2rem)';
          }
        });
        host.dataset.visibleParagraphs = String(visibleCount);
      }
      if (ready && context) {
        const index = Math.round(scrub * (frames.length - 1));
        if (drawn !== index || resize) {
          if (resize) {
            const dpr = Math.min(devicePixelRatio || 1, 2);
            surface.width = Math.round(surface.clientWidth * dpr);
            surface.height = Math.round(surface.clientHeight * dpr);
            resize = false;
          }
          const frame = frames[index];
          const scale = Math.max(surface.width / frame.width, surface.height / frame.height);
          const w = frame.width * scale;
          const h = frame.height * scale;
          context.drawImage(frame, (surface.width - w) / 2, (surface.height - h) / 2, w, h);
          drawn = index;
          host.dataset.frame = String(index);
        }
      } else if (video.readyState >= 2 && Number.isFinite(video.duration) && !seeking) {
        const time = scrub * Math.max(0, video.duration - 0.04);
        if (Math.abs(video.currentTime - time) > 0.035) { seeking = true; video.currentTime = time; }
      }
      animation = requestAnimationFrame(tick);
    }
    animation = requestAnimationFrame(tick);
    return () => {
      cancelled = true;
      controller.abort();
      cancelAnimationFrame(animation);
      video.removeEventListener('seeked', onSeeked);
      window.removeEventListener('resize', onResize);
      frames.forEach(frame => frame.close());
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, []);

  return <section ref={section} id="health-capital" className="relative h-[700vh]" aria-label="Health Capital introduction">
    <div className="sticky top-0 h-screen overflow-hidden bg-navy-950 supports-[height:100svh]:h-[100svh]">
      <div ref={hero} className="absolute inset-0">
        <video ref={fallback} src={VIDEO} muted playsInline preload="auto" aria-hidden="true" className="absolute inset-0 h-full w-full object-cover" />
        <canvas ref={canvas} aria-hidden="true" className="absolute inset-0 h-full w-full opacity-0" />
        <div className="absolute inset-0 bg-black/35" />
        <div className="absolute inset-0 flex items-center justify-center px-5 pb-[14vh] sm:px-6">
          <h1 className="max-w-5xl text-center text-[2rem] leading-[1.15] tracking-tight text-white sm:text-5xl sm:leading-[1.1] md:text-6xl lg:text-7xl">Merging science, defi and <br className="hidden sm:block" />lifespans into <span className="font-instrument italic">true wellness.</span></h1>
        </div>
        <div id="articles" className="absolute inset-x-0 bottom-0 px-5 pb-10 sm:px-6 sm:pb-16 md:px-12 md:pb-24">
          <p className="mb-4 text-right text-xs text-white/70 sm:text-sm">In the news:</p>
          <div className="flex flex-wrap items-center justify-end gap-x-5 gap-y-3 text-sm text-white/90 sm:gap-x-8 sm:gap-y-4 sm:text-lg md:gap-x-12 md:text-xl">
            <span className="font-instrument font-bold tracking-wide transition-opacity duration-300 hover:opacity-60">Praxis</span>
            <span className="font-sans font-bold tracking-tight transition-opacity duration-300 hover:opacity-60">VENTURE BULLETIN</span>
            <span className="font-sans font-semibold italic transition-opacity duration-300 hover:opacity-60">Blockdispatch</span>
            <span className="font-mono font-medium tracking-tighter transition-opacity duration-300 hover:opacity-60">Healthspan.Quarterly</span>
            <span className="font-instrument italic tracking-wide transition-opacity duration-300 hover:opacity-60">Vetted / TJ</span>
            <span className="font-sans font-light tracking-widest transition-opacity duration-300 hover:opacity-60">biofuture.io</span>
          </div>
        </div>
      </div>
      <div ref={reveal} aria-hidden="true" className="pointer-events-none absolute inset-0 flex items-center justify-center bg-[#000308] px-5 py-24 opacity-0 sm:px-8">
        <div className="max-w-4xl space-y-6 text-center sm:space-y-10">
          {paragraphs.map((paragraph, i) => <p key={paragraph} id={i === 2 ? 'allocations' : undefined} ref={el => { textRefs.current[i] = el; }} className="translate-y-8 text-lg leading-relaxed text-white opacity-0 transition-all duration-700 ease-out sm:text-2xl md:text-3xl md:leading-snug">{paragraph}</p>)}
        </div>
      </div>
    </div>
  </section>;
}

function App() { return <div className="bg-navy-950"><Navbar /><Hero /></div>; }
createRoot(document.getElementById('root')!).render(<App />);
