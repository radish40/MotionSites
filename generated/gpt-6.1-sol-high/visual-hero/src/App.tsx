import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { Menu, X } from 'lucide-react';

const NAV_LINKS = ['Gallery', 'Styles', 'API', 'Pricing', 'Blog'];
// Original source preserved; its exact bytes are served locally for reliable playback.
export const VIDEO_SRC = 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260511_080827_a9e5ad52-b6ee-4e79-b393-d936f179cfd7.mp4';
const LOCAL_VIDEO_SRC = `${import.meta.env.BASE_URL}assets/hero.mp4`;

function LogoMark() {
  return <svg width="44" height="26" viewBox="0 0 44 26" fill="white" aria-hidden="true"><rect x="0" y="3" width="14" height="20" rx="3" /><rect x="16" y="3" width="12" height="20" rx="3" /><rect x="30" y="3" width="14" height="20" rx="3" /></svg>;
}

export default function App() {
  const [mounted, setMounted] = useState(false);
  const [framesReady, setFramesReady] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoBgRef = useRef<HTMLDivElement>(null);
  const displayCanvasRef = useRef<HTMLCanvasElement>(null);
  const framesRef = useRef<HTMLCanvasElement[]>([]);
  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    let capturing = true;
    let started = false;
    let lastTime = -1;
    let raf = 0;
    let videoCallback = 0;
    const MAX_WIDTH = 960;
    const frames: HTMLCanvasElement[] = [];
    const captureFrame = () => {
      if (!capturing || video.readyState < 2 || video.currentTime === lastTime) return;
      lastTime = video.currentTime;
      const scale = Math.min(1, MAX_WIDTH / video.videoWidth);
      const frame = document.createElement('canvas');
      frame.width = Math.round(video.videoWidth * scale);
      frame.height = Math.round(video.videoHeight * scale);
      const ctx = frame.getContext('2d');
      if (ctx) { ctx.drawImage(video, 0, 0, frame.width, frame.height); frames.push(frame); }
    };
    const captureLoop = () => {
      if (!capturing) return;
      captureFrame();
      if ('requestVideoFrameCallback' in video) videoCallback = video.requestVideoFrameCallback(captureLoop);
      else raf = requestAnimationFrame(captureLoop);
    };
    const onLoaded = () => {
      if (started) return;
      started = true;
      video.play().catch(() => {});
      captureLoop();
    };
    const onEnded = () => {
      capturing = false;
      framesRef.current = frames;
      if (frames.length) setFramesReady(true);
    };
    video.addEventListener('loadedmetadata', onLoaded);
    video.addEventListener('ended', onEnded);
    if (video.readyState >= 1) onLoaded();
    return () => {
      capturing = false;
      cancelAnimationFrame(raf);
      if (videoCallback) video.cancelVideoFrameCallback(videoCallback);
      video.removeEventListener('loadedmetadata', onLoaded);
      video.removeEventListener('ended', onEnded);
    };
  }, []);

  useEffect(() => {
    const canvas = displayCanvasRef.current;
    const frames = framesRef.current;
    if (!framesReady || !canvas || !frames.length) return;
    canvas.width = frames[0].width;
    canvas.height = frames[0].height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let index = 0;
    let direction = 1;
    let last = performance.now();
    const interval = 1000 / 30;
    let raf = 0;
    ctx.drawImage(frames[0], 0, 0);
    canvas.dataset.frameCount = String(frames.length);
    const render = (now: number) => {
      if (now - last >= interval) {
        last = now;
        ctx.drawImage(frames[index], 0, 0);
        canvas.dataset.frame = String(index);
        canvas.dataset.direction = String(direction);
        if (frames.length > 1) {
          index += direction;
          if (index >= frames.length - 1) { index = frames.length - 1; direction = -1; }
          if (index <= 0) { index = 0; direction = 1; }
        }
      }
      raf = requestAnimationFrame(render);
    };
    raf = requestAnimationFrame(render);
    return () => cancelAnimationFrame(raf);
  }, [framesReady]);

  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let targetX = 0, targetY = 0, currentX = 0, currentY = 0;
    let raf = 0;
    const strength = 20;
    const onMove = (event: MouseEvent) => {
      const cx = innerWidth / 2, cy = innerHeight / 2;
      targetX = ((event.clientX - cx) / cx) * strength;
      targetY = ((event.clientY - cy) / cy) * strength;
    };
    const reset = () => { targetX = 0; targetY = 0; };
    const render = () => {
      currentX += (targetX - currentX) * 0.06;
      currentY += (targetY - currentY) * 0.06;
      gsap.set(videoBgRef.current, { x: currentX, y: currentY });
      raf = requestAnimationFrame(render);
    };
    window.addEventListener('mousemove', onMove);
    document.addEventListener('mouseleave', reset);
    raf = requestAnimationFrame(render);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('mousemove', onMove); document.removeEventListener('mouseleave', reset); };
  }, []);

  useEffect(() => {
    const close = (event: KeyboardEvent) => { if (event.key === 'Escape') setMenuOpen(false); };
    window.addEventListener('keydown', close);
    return () => window.removeEventListener('keydown', close);
  }, []);

  const linkClass = 'text-sm font-body font-light text-white/70 hover:text-white transition-colors duration-200';
  return <main className="min-h-screen bg-black text-white font-body overflow-x-hidden" data-playback={framesReady ? 'boomerang' : 'video'}>
    <div ref={videoBgRef} className="fixed top-0 left-0 w-full h-full z-0 scale-[1.08] origin-center" aria-hidden="true">
      <video ref={videoRef} src={LOCAL_VIDEO_SRC} muted playsInline preload="auto" crossOrigin="anonymous" className="w-full h-full object-cover" style={{ display: framesReady ? 'none' : 'block' }} />
      <canvas ref={displayCanvasRef} className="w-full h-full object-cover" style={{ display: framesReady ? 'block' : 'none' }} />
    </div>
    <div className={`hero-heading fixed left-0 right-0 z-20 w-full px-4 transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`} style={{ top: '126px' }}>
      <h1 className="hero-title select-none">MicroVisuals</h1>
    </div>
    <nav className="hero-nav fixed top-5 left-1/2 -translate-x-1/2 z-50 whitespace-nowrap" aria-label="Main navigation">
      <div className="liquid-glass flex items-center gap-6 rounded px-4 py-2.5 nav-pill">
        <a href="#" aria-label="MicroVisuals home"><LogoMark /></a>
        <div className="desktop-links flex items-center gap-5">{NAV_LINKS.map(link => <a key={link} href={`#${link.toLowerCase()}`} className={linkClass}>{link}</a>)}</div>
        <div className="flex items-center gap-3 ml-4 nav-account">
          <a href="#sign-in" className={`${linkClass} sign-in`}>Sign in</a>
          <a href="#start-generating" className="liquid-glass-strong text-sm font-body font-medium text-white rounded px-4 py-1.5 transition-all duration-200 hover:scale-[1.04] hover:shadow-[0_0_16px_2px_rgba(255,255,255,0.12)] active:scale-[0.97]">Try it free</a>
          <button className="menu-toggle" type="button" aria-label={menuOpen ? 'Close navigation' : 'Open navigation'} aria-expanded={menuOpen} aria-controls="mobile-links" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X size={20} /> : <Menu size={20} />}</button>
        </div>
      </div>
      {menuOpen && <div id="mobile-links" className="mobile-links liquid-glass-strong" onClick={() => setMenuOpen(false)}>{[...NAV_LINKS, 'Sign in'].map(link => <a key={link} href={`#${link.toLowerCase().replace(' ', '-')}`} className={linkClass}>{link}</a>)}</div>}
    </nav>
    <div className={`bottom-row fixed bottom-12 left-0 right-0 px-10 flex items-end justify-between z-20 transition-all duration-1000 delay-300 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
      <p className="left-copy text-sm font-body font-light text-white/75 max-w-[220px] leading-relaxed">Forma's AI understands context, composition, and style like a creative director would.</p>
      <div className="hero-actions absolute left-1/2 -translate-x-1/2 bottom-0 flex items-center gap-3">
        <button type="button" className="group relative bg-white text-black text-sm font-body font-medium rounded px-6 py-3 overflow-hidden active:scale-[0.97] transition-all duration-200 shadow-[0_0_0_0_rgba(255,255,255,0)] hover:shadow-[0_0_24px_4px_rgba(255,255,255,0.25)] hover:scale-[1.03]"><span className="relative z-10">Start generating</span><span className="absolute inset-0 bg-gradient-to-b from-white to-white/85 opacity-0 group-hover:opacity-100 transition-opacity duration-200" /></button>
        <button type="button" className="liquid-glass group text-white text-sm font-body font-medium rounded px-6 py-3 active:scale-[0.97] transition-all duration-200 hover:scale-[1.03] hover:shadow-[inset_0_1px_1px_rgba(255,255,255,0.2),0_0_20px_2px_rgba(255,255,255,0.07)]">See templates</button>
      </div>
      <p className="right-copy text-sm font-body font-light text-white/75 max-w-[220px] leading-relaxed text-right">Describe what you see in your head — get images that actually match.</p>
    </div>
  </main>;
}
