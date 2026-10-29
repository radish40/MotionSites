import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Menu, X, ArrowUpRight, Check } from 'lucide-react';
import './index.css';

const BG_IMAGE_1 = 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260609_195923_b0ba8ace-1d1d-4f2c-9a28-1ab84b330680.png&w=1280&q=85';
const BG_IMAGE_2 = 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260609_201152_bba90a12-bf12-459f-91f0-51f237dbaf3b.png&w=1280&q=85';
const SPOTLIGHT_R = 260;
const topics = ['Course', 'Field Guides', 'Geology', 'Plans', 'Live Tour'];
const descriptions: Record<string, string> = {
  Course: 'Every layer of sediment records a chapter of our planet, from ancient seabeds to drifting ash, layered across millions of years beneath us.',
  'Field Guides': 'Look closer at the world beneath your feet. Discover the textures, colors, and fossils that help tell one stone from another.',
  Geology: 'Follow the forces that shape our planet, from the slow drift of continents to the layers left behind by ancient seas.',
  Plans: 'Begin with a little curiosity. Explore the landscape at your own pace, one layer and one discovery at a time.',
  'Live Tour': 'Take a closer look at the landscape. Move your cursor across the rock to reveal the story hidden beneath its surface.',
};

function RevealLayer({ image, cursorX, cursorY }: { image: string; cursorX: number; cursorY: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const layerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const resize = () => {
      if (canvasRef.current) {
        canvasRef.current.width = window.innerWidth;
        canvasRef.current.height = window.innerHeight;
      }
    };
    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, []);
  useEffect(() => {
    const canvas = canvasRef.current;
    const layer = layerRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !layer || !ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const gradient = ctx.createRadialGradient(cursorX, cursorY, 0, cursorX, cursorY, SPOTLIGHT_R);
    for (const [stop, alpha] of [[0, 1], [0.4, 1], [0.6, 0.75], [0.75, 0.4], [0.88, 0.12], [1, 0]]) {
      gradient.addColorStop(stop, `rgba(255,255,255,${alpha})`);
    }
    ctx.beginPath();
    ctx.arc(cursorX, cursorY, SPOTLIGHT_R, 0, Math.PI * 2);
    ctx.fillStyle = gradient;
    ctx.fill();
    const mask = `url("${canvas.toDataURL()}")`;
    layer.style.maskImage = mask;
    layer.style.webkitMaskImage = mask;
  });
  return <>
    <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" style={{ display: 'none' }} />
    <div ref={layerRef} data-testid="reveal-layer" className="absolute inset-0 bg-center bg-cover bg-no-repeat z-30 pointer-events-none" style={{ backgroundImage: `url("${image}")`, maskImage: 'linear-gradient(transparent, transparent)', WebkitMaskImage: 'linear-gradient(transparent, transparent)', maskSize: '100% 100%', WebkitMaskSize: '100% 100%' }} />
  </>;
}

function App() {
  const mouse = useRef({ x: -999, y: -999 });
  const smooth = useRef({ x: -999, y: -999 });
  const rafRef = useRef(0);
  const [cursorPos, setCursorPos] = useState({ x: -999, y: -999 });
  const [mobileOpen, setMobileOpen] = useState(false);
  const [active, setActive] = useState('Course');
  const [digging, setDigging] = useState(false);
  const [signup, setSignup] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const move = (e: MouseEvent) => { mouse.current = { x: e.clientX, y: e.clientY }; };
    const touch = (e: TouchEvent) => { if (e.touches[0]) mouse.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }; };
    const tick = () => {
      smooth.current.x += (mouse.current.x - smooth.current.x) * 0.1;
      smooth.current.y += (mouse.current.y - smooth.current.y) * 0.1;
      setCursorPos({ ...smooth.current });
      rafRef.current = requestAnimationFrame(tick);
    };
    window.addEventListener('mousemove', move);
    window.addEventListener('touchmove', touch, { passive: true });
    window.addEventListener('touchstart', touch, { passive: true });
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('touchmove', touch);
      window.removeEventListener('touchstart', touch);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);
  useEffect(() => { if (signup) dialogRef.current?.showModal(); else dialogRef.current?.close(); }, [signup]);
  const select = (topic: string) => { setActive(topic); setMobileOpen(false); };
  const startDigging = () => {
    setDigging(true);
    mouse.current = { x: window.innerWidth * 0.5, y: window.innerHeight * 0.57 };
  };
  return <div className="min-h-screen bg-white tracking-[-0.02em]" style={{ fontFamily: "'Inter', sans-serif" }}>
    <section aria-label="Explore the layers of the earth" className="relative w-full overflow-hidden h-screen bg-black" style={{ height: '100dvh' }}>
      <div data-testid="base-layer" className="absolute inset-0 bg-center bg-cover bg-no-repeat z-10 hero-zoom" style={{ backgroundImage: `url("${BG_IMAGE_1}")` }} />
      <RevealLayer image={BG_IMAGE_2} cursorX={cursorPos.x} cursorY={cursorPos.y} />
      <div className="absolute top-[14%] left-0 right-0 flex flex-col items-center text-center px-5 pointer-events-none z-50">
        <h1 className="text-white leading-[0.95]">
          <span className="block font-playfair italic font-normal text-5xl sm:text-7xl md:text-8xl hero-anim hero-reveal" style={{ letterSpacing: '-0.05em', animationDelay: '0.25s' }}>Layers hold</span>
          <span className="block font-normal text-5xl sm:text-7xl md:text-8xl -mt-1 hero-anim hero-reveal" style={{ letterSpacing: '-0.08em', animationDelay: '0.42s' }}>tales of time</span>
        </h1>
      </div>
      <div className="hidden sm:block absolute bottom-14 left-10 md:left-14 max-w-[260px] z-50 hero-anim hero-fade" style={{ animationDelay: '0.7s' }}>
        <p className="text-sm text-white/80 leading-relaxed" aria-live="polite">{descriptions[active]}</p>
      </div>
      <div className="absolute bottom-10 sm:bottom-24 left-5 right-5 sm:left-auto sm:right-10 md:right-14 max-w-full sm:max-w-[260px] flex flex-col items-start gap-4 sm:gap-5 z-50 hero-anim hero-fade" style={{ animationDelay: '0.85s' }}>
        <p className="text-xs sm:text-sm text-white/80 leading-relaxed">Our interactive maps let you peel back the crust to trace how stones, fossils, and deep time combine to shape the ground beneath your feet.</p>
        <button onClick={startDigging} className="bg-[#e8702a] hover:bg-[#d2611f] text-white text-sm font-medium px-7 py-3 rounded-full transition-all hover:scale-[1.03] active:scale-95 hover:shadow-lg hover:shadow-[#e8702a]/30">Start Digging</button>
        {digging && <p role="status" className="text-xs text-white/80">Move across the rock. Reveal what lies beneath.</p>}
      </div>
    </section>
    <nav aria-label="Main navigation" className="fixed top-0 left-0 right-0 z-[100] flex items-center justify-between p-4 sm:p-5">
      <a href="#" aria-label="Lithos home" onClick={() => { setActive('Course'); setDigging(false); }} className="flex items-center gap-2.5">
        <svg width="26" height="26" viewBox="0 0 256 256" fill="#ffffff" aria-hidden="true"><path d="M 256 256 L 128 256 L 0 128 L 128 128 Z M 256 128 L 128 128 L 0 0 L 128 0 Z" /></svg>
        <span className="text-white text-2xl font-playfair italic">Lithos</span>
      </a>
      <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 bg-white/20 backdrop-blur-md border border-white/30 rounded-full px-2 py-2 items-center gap-1">
        {topics.map(topic => <button key={topic} aria-pressed={active === topic} onClick={() => select(topic)} className={`${active === topic ? 'text-white' : 'text-white/80'} hover:bg-white/20 hover:text-white transition-colors px-4 py-1.5 rounded-full text-sm font-medium`}>{topic}</button>)}
      </div>
      <button onClick={() => setSignup(true)} className="hidden md:block bg-white text-gray-900 text-sm font-semibold px-6 py-2.5 rounded-full hover:bg-gray-100">Sign Up</button>
      <button aria-label={mobileOpen ? 'Close menu' : 'Open menu'} aria-expanded={mobileOpen} aria-controls="mobile-navigation" onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden text-white p-2 rounded-full hover:bg-white/20">{mobileOpen ? <X size={24} /> : <Menu size={24} />}</button>
      {mobileOpen && <div id="mobile-navigation" className="md:hidden absolute top-20 left-4 right-4 bg-black/80 backdrop-blur-xl border border-white/20 rounded-2xl p-3 flex flex-col gap-1">
        {topics.map(topic => <button key={topic} onClick={() => select(topic)} className={`text-left px-4 py-3 rounded-xl text-sm ${active === topic ? 'text-white bg-white/15' : 'text-white/80 hover:bg-white/10'}`}>{topic}</button>)}
        <button onClick={() => { setMobileOpen(false); setSignup(true); }} className="bg-white text-gray-900 text-sm font-semibold px-6 py-3 rounded-full mt-2">Sign Up</button>
      </div>}
    </nav>
    <dialog ref={dialogRef} onCancel={() => setSignup(false)} onClick={e => { if (e.target === e.currentTarget) setSignup(false); }} className="bg-[#171512] text-white rounded-3xl p-8 max-w-sm w-[calc(100%-32px)] border border-white/20 backdrop:bg-black/70">
      <button aria-label="Close sign up" onClick={() => setSignup(false)} className="absolute right-4 top-4 p-2 rounded-full hover:bg-white/10"><X size={20} /></button>
      {submitted ? <div className="py-6"><Check className="text-[#e8702a] mb-4" size={30} /><h2 className="font-playfair italic text-3xl mb-3">Curiosity begins here.</h2><p className="text-sm text-white/70">Your interest has been saved for this session.</p></div> : <form onSubmit={e => { e.preventDefault(); setSubmitted(true); }}>
        <h2 className="font-playfair italic text-4xl mt-5 mb-3">Dig a little deeper.</h2>
        <p className="text-sm text-white/70 mb-6">Start your journey with Lithos.</p>
        <label htmlFor="email" className="text-sm block mb-2">Email address</label>
        <input id="email" type="email" required autoComplete="email" placeholder="you@example.com" className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-sm mb-4" />
        <button className="flex w-full justify-between items-center bg-[#e8702a] rounded-full px-5 py-3 text-sm font-medium hover:bg-[#d2611f]">Sign Up <ArrowUpRight size={17} /></button>
        <p className="text-xs text-white/40 mt-4">Preview only. No email is sent or stored.</p>
      </form>}
    </dialog>
  </div>;
}

createRoot(document.getElementById('root')!).render(<React.StrictMode><App /></React.StrictMode>);
