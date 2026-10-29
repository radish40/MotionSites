import { useEffect, useRef, useState } from 'react';
import { ArrowRight } from 'lucide-react';
const assets = import.meta.env.BASE_URL + 'assets/';
const stats = [['8M+', 'Skin Transformed'], ['96.4%', 'Visible Renewal'], ['37', 'Patents Granted']];
export default function HeroSection({ isActive }: { isActive: boolean }) {
  const [progress, setProgress] = useState(0);
  const current = useRef(0);
  const video1 = useRef<HTMLVideoElement>(null);
  const video2 = useRef<HTMLVideoElement>(null);
  const scene = progress < 0.5 ? 0 : 1;
  useEffect(() => {
    if (!isActive) return;
    const active = scene === 0 ? video1.current : video2.current;
    const other = scene === 0 ? video2.current : video1.current;
    other?.pause();
    if (active) { active.currentTime = 0; active.play().catch(() => {}); }
  }, [isActive, scene]);
  useEffect(() => {
    if (!isActive) return;
    const update = (value: number) => { current.current = Math.min(1, Math.max(0, value)); setProgress(current.current); };
    const wheel = (e: WheelEvent) => { if ((e.target as HTMLElement).closest('#mobile-menu')) return; e.preventDefault(); update(current.current + e.deltaY / 800); };
    let touchY = 0;
    const start = (e: TouchEvent) => { touchY = e.touches[0].clientY; };
    const move = (e: TouchEvent) => { if ((e.target as HTMLElement).closest('#mobile-menu')) return; e.preventDefault(); const y = e.touches[0].clientY; update(current.current + (touchY - y) / 400); touchY = y; };
    const key = (e: KeyboardEvent) => { if ((e.target as HTMLElement).closest('a,button')) return; if (['ArrowDown', 'PageDown', 'ArrowUp', 'PageUp', 'Home', 'End'].includes(e.key)) { e.preventDefault(); update(e.key === 'Home' ? 0 : e.key === 'End' ? 1 : current.current + (['ArrowDown', 'PageDown'].includes(e.key) ? 0.2 : -0.2)); } };
    const science = () => update(1);
    const home = () => update(0);
    window.addEventListener('wheel', wheel, { passive: false });
    window.addEventListener('touchstart', start, { passive: true });
    window.addEventListener('touchmove', move, { passive: false });
    window.addEventListener('keydown', key);
    window.addEventListener('lumiderm:science', science);
    window.addEventListener('lumiderm:home', home);
    return () => { window.removeEventListener('wheel', wheel); window.removeEventListener('touchstart', start); window.removeEventListener('touchmove', move); window.removeEventListener('keydown', key); window.removeEventListener('lumiderm:science', science); window.removeEventListener('lumiderm:home', home); };
  }, [isActive]);
  const opacity1 = Math.max(0, 1 - progress * 2.5);
  const opacity2 = Math.min(1, Math.max(0, (progress - 0.4) * 2.5));
  const state1 = { opacity: isActive ? opacity1 : 0, transform: `translateY(${progress * 30 + (isActive ? 0 : 20)}px)`, pointerEvents: opacity1 > 0.1 ? 'auto' as const : 'none' as const };
  const translate2 = Math.max(0, (1 - progress) * 30);
  return <main className="fixed inset-0 overflow-hidden bg-black text-white" aria-label="LumiDerm skin science" data-scene={scene + 1} data-progress={progress}>
    <video ref={video1} src={`${assets}hero-regeneration.mp4`} muted playsInline preload="auto" className="absolute inset-0 h-full w-full object-cover" style={{ opacity: 1 - progress }} aria-label="LumiDerm bioactive skin regeneration film" />
    <video ref={video2} src={`${assets}hero-science.mp4`} muted playsInline preload="auto" className="absolute inset-0 h-full w-full object-cover" style={{ opacity: progress }} aria-label="LumiDerm cellular science film" />
    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/65 via-black/5 to-black/15" />
    <section className="hero-copy absolute bottom-12 left-6 right-6 max-w-2xl transition-opacity duration-700 sm:bottom-8 sm:left-8 sm:right-auto md:bottom-16 md:left-12" style={state1} aria-hidden={opacity1 === 0}>
      <h1 className="mb-4 text-3xl font-light leading-[1.05] tracking-tight sm:text-4xl md:mb-6 md:text-6xl lg:text-7xl">The Future of<br/>Skin Regeneration</h1>
      <p className="mb-6 max-w-md text-xs leading-relaxed text-white/70 sm:text-sm md:mb-8 md:text-base">Heal with science, not guesswork. LumiDerm merges cellular research and bioactive formulations to unlock your skin's true radiant potential.</p>
      <button tabIndex={opacity1 === 0 ? -1 : 0} onClick={() => { current.current = 1; setProgress(1); }} className="rounded-full bg-[#5794E2] px-6 py-3 text-xs transition-colors hover:bg-[#4a84d0] sm:px-8 sm:py-3.5 sm:text-sm">Explore Now</button>
    </section>
    <aside className="product-card absolute bottom-8 right-8 hidden max-w-[380px] items-center gap-4 rounded-2xl bg-white p-4 text-[#010101] shadow-2xl transition-opacity duration-700 sm:flex md:bottom-16 md:right-12 md:max-w-[460px] md:gap-5 md:p-5" style={state1} aria-hidden={opacity1 === 0}>
      <img src={`${assets}bioactive.webp`} alt="LumiDerm BioActive CellBoost 3.0" className="h-20 w-20 rounded-xl object-cover md:h-24 md:w-24"/>
      <div className="min-w-[120px]"><div className="text-sm font-medium">LumiDerm<br/>BioActive</div><p className="mt-2 text-xs text-[#666]">CellBoost™ 3.0</p></div>
      <button tabIndex={opacity1 === 0 ? -1 : 0} onClick={() => { current.current = 1; setProgress(1); }} aria-label="Explore LumiDerm BioActive" className="flex h-9 w-9 items-center justify-center self-start rounded-full bg-[#3b82f6] text-white transition-colors hover:bg-blue-600"><ArrowRight size={18}/></button>
    </aside>
    <section className="absolute bottom-12 left-0 right-0 px-6 text-center transition-opacity duration-500 md:bottom-20" style={{ opacity: isActive ? opacity2 : 0, transform: `translateY(${translate2}px)`, pointerEvents: 'none' }} aria-hidden={opacity2 === 0}>
      <h2 className="mb-4 text-2xl font-light leading-[1.1] tracking-tight sm:text-3xl md:mb-5 md:text-5xl lg:text-6xl">Clinically Advanced<br/>Skin Science</h2>
      <p className="mx-auto max-w-lg text-xs leading-relaxed text-white/70 sm:text-sm md:text-base">Our patented peptide complex penetrates at the cellular level, stimulating natural collagen and restoring youthful elasticity.</p>
      <div className="mt-6 flex items-center justify-center gap-6 sm:hidden">{stats.map(([number,label], i) => <div key={label} className="contents">{i > 0 && <div className="h-8 w-px bg-[#5794E2]/40"/>}<div><div className="text-xl font-light">{number}</div><div className="mt-1 text-[10px] text-white/50">{label}</div></div></div>)}</div>
    </section>
    <aside className="absolute right-8 top-1/2 hidden flex-col gap-8 transition-opacity duration-500 sm:flex md:right-12" style={{ opacity: isActive ? opacity2 : 0, transform: `translateY(calc(-50% + ${translate2}px))` }} aria-label="Clinical results" aria-hidden={opacity2 === 0}>{stats.map(([number,label],i) => <div key={label}><div className="text-3xl font-light md:text-4xl">{number}</div><div className="mt-1 text-xs text-white/50 md:text-sm">{label}</div>{i < 2 && <div className="mt-4 h-px w-12 bg-[#5794E2]/60"/>}</div>)}</aside>
  </main>;
}
