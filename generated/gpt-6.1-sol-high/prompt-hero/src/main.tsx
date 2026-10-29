import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { motion, useReducedMotion } from 'motion/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import './index.css';
gsap.registerPlugin(ScrollTrigger, useGSAP);
const asset = (name: string) => `${import.meta.env.BASE_URL}assets/${name}`;
const ease = [0.25, 0.1, 0.25, 1] as const;
export function buildLayout(count: number, cols: number) {
  const cells: number[] = []; let index = 0;
  for (let r = 0; index < count; r++) {
    const row = Array(cols).fill(-1); const a = (r * 2 + (r % 2)) % cols;
    row[a] = index++;
    if (r % 3 === 0 && index < count) { let b = (a + 2) % cols; if (b === a) b = (a + 1) % cols; row[b] = index++; }
    cells.push(...row);
  }
  return cells;
}
function Wordmark() {
  return <svg viewBox="0 0 355 110" role="img" aria-label="prmpt"><g fill="white" fillRule="evenodd">
    <path d="M0 23h19v8c7-8 14-11 23-11 19 0 31 14 31 35S61 90 42 90c-10 0-17-4-22-10v30H0V23Zm20 32c0 13 6 20 16 20s16-7 16-20-6-20-16-20-16 7-16 20Z"/>
    <path d="M80 23h20v13c5-11 13-15 25-14v20c-17-2-24 5-24 20v26H80V23Z"/>
    <path d="M130 23h20v9c5-8 12-12 22-12s17 4 21 13c6-9 14-13 25-13 16 0 25 10 25 28v40h-21V51c0-11-3-15-10-15-8 0-13 6-13 17v35h-21V51c0-11-3-15-10-15-8 0-13 6-13 17v35h-25V23Z"/>
    <path d="M251 23h19v8c7-8 14-11 23-11 19 0 31 14 31 35s-12 35-31 35c-10 0-17-4-22-10v30h-20V23Zm20 32c0 13 6 20 16 20s16-7 16-20-6-20-16-20-16 7-16 20Z"/>
    <path d="M331 6h20v17h4v16h-4v27c0 6 1 8 4 8v16c-17 1-24-5-24-22V39h-7V23h7V6Z"/>
    </g><g transform="translate(310 0)" fill="none" stroke="white" strokeWidth="1.5"><circle cx="8" cy="8" r="7"/><path d="M5 12V4h3c4 0 4 4 0 4H5m3 0 3 4"/></g></svg>;
}
function App() {
  const root = useRef<HTMLDivElement>(null), panel = useRef<HTMLDivElement>(null), wrap = useRef<HTMLDivElement>(null);
  const left = useRef<HTMLVideoElement>(null), right = useRef<HTMLVideoElement>(null), cursor = useRef<HTMLDivElement>(null);
  const overlay = useRef<HTMLDivElement>(null), info = useRef<HTMLDivElement>(null), buy = useRef<HTMLDivElement>(null), footer = useRef<HTMLElement>(null);
  const symbol = useRef<HTMLSpanElement>(null), canvas = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const [cols, setCols] = useState(() => innerWidth < 640 ? 2 : innerWidth < 1024 ? 3 : 4);
  const [loaded, setLoaded] = useState(0);
  const lastSide = useRef<'left' | 'right'>('right');
  const mouseX = useRef(innerWidth / 2);
  useEffect(() => {
    const resize = () => setCols(innerWidth < 640 ? 2 : innerWidth < 1024 ? 3 : 4);
    const move = (e: MouseEvent) => { mouseX.current = e.clientX; if(cursor.current) { cursor.current.style.left = `${e.clientX}px`; cursor.current.style.top = `${e.clientY}px`; cursor.current.style.opacity = '1'; } };
    window.addEventListener('resize', resize); window.addEventListener('mousemove', move);
    return () => { window.removeEventListener('resize', resize); window.removeEventListener('mousemove', move); };
  }, []);
  useEffect(() => {
    const a = left.current!, b = right.current!;
    const touch = matchMedia('(pointer: coarse)').matches || innerWidth < 1024;
    if (!touch || loaded < 2 || reduced) return;
    a.style.display = 'block'; b.style.display = 'none'; lastSide.current = 'left';
    const play = (v: HTMLVideoElement, other: HTMLVideoElement) => { other.pause(); other.style.display = 'none'; v.style.display = 'block'; v.currentTime = 0; if (scrollY < innerHeight) void v.play().catch(() => {}); };
    const endA = () => play(b, a), endB = () => play(a, b);
    a.addEventListener('ended', endA); b.addEventListener('ended', endB); void a.play().catch(() => {});
    return () => { a.pause(); b.pause(); a.removeEventListener('ended', endA); b.removeEventListener('ended', endB); };
  }, [loaded, reduced]);
  useGSAP(() => {
    const p = panel.current!, w = wrap.current!, spacer = root.current!;
    let vh = innerHeight, maxScroll = 0, frame = 0, previousY = -1, lastSymbol = 0;
    let cards: { el: HTMLElement; top: number; height: number }[] = [];
    const measure = () => {
      vh = innerHeight; maxScroll = Math.max(0, w.scrollHeight - vh);
      spacer.style.height = `${vh + maxScroll + 2 * vh}px`;
      cards = Array.from(w.querySelectorAll<HTMLElement>('.bp-card')).map(el => ({ el, top: el.parentElement!.getBoundingClientRect().top - w.getBoundingClientRect().top, height: el.parentElement!.offsetHeight }));
    };
    measure();
    const slide = gsap.fromTo(p, { y: () => innerHeight }, { y: 0, ease: 'none', scrollTrigger: { trigger: spacer, start: 'top top', end: () => `+=${innerHeight}`, scrub: true, invalidateOnRefresh: true }, });
    const resize = () => { measure(); slide.vars.startAt = { y: vh }; ScrollTrigger.refresh(); };
    window.addEventListener('resize', resize);
    const tick = (time: number) => {
      const y = window.scrollY;
      if (y !== previousY) {
        const innerOffset = Math.max(0, y - vh);
        w.style.transform = `translateY(${-innerOffset}px)`;
        const panelOffset = Math.max(0, vh - y);
        for (const c of cards) {
          const top = c.top + panelOffset - innerOffset, bottom = top + c.height;
          const scale = top >= vh || bottom <= 0 ? 0 : Math.max(0, Math.min(1, (vh - top) / (vh * .6), bottom / (vh * .4)));
          c.el.style.transform = `scale(${reduced && scale > 0 ? 1 : scale})`;
        }
        const progress = Math.max(0, Math.min(1, (y - vh - maxScroll) / Math.max(1, vh - 100)));
        overlay.current!.style.opacity = String(progress);
        info.current!.style.transform = `translateY(${-progress * (innerWidth < 640 ? 132 : 166)}px)`;
        buy.current!.style.transform = `scale(${progress})`;
        footer.current!.style.opacity = String(progress);
        canvas.current!.style.visibility = y >= vh ? 'hidden' : 'visible';
        if (y >= vh) { left.current?.pause(); right.current?.pause(); }
        else if (previousY >= vh && !reduced && (matchMedia('(pointer: coarse)').matches || innerWidth < 1024)) { const active = left.current!.style.display === 'block' ? left.current! : right.current!; void active.play().catch(() => {}); }
        if (previousY >= 0 && time - lastSymbol > 80) { symbol.current!.textContent = ['8', '$', '^^', '%', '/'][Math.floor(Math.random() * 5)]; lastSymbol = time; }
        previousY = y;
      }
      if (!reduced && !matchMedia('(pointer: coarse)').matches && innerWidth >= 1024 && y < vh) {
        const width = innerWidth, dead = Math.max(30, width * .05), x = mouseX.current;
        let progress = 0;
        if (x < width/2 - dead) { lastSide.current = 'right'; progress = (width/2-dead-x)/(width/2-dead); }
        else if (x > width/2 + dead) { lastSide.current = 'left'; progress = (x-width/2-dead)/(width/2-dead); }
        const active = lastSide.current === 'left' ? left.current! : right.current!;
        const other = lastSide.current === 'left' ? right.current! : left.current!;
        active.style.display = 'block'; other.style.display = 'none';
        if (Number.isFinite(active.duration) && !active.seeking) {
          const target = Math.min(Math.max(0, progress), 1) * Math.max(0, active.duration - .04);
          if (Math.abs(active.currentTime-target) > .025) active.currentTime = target;
        }
        if (progress === 0 && !other.seeking && other.currentTime !== 0) other.currentTime = 0;
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(frame); window.removeEventListener('resize', resize); };
  }, { scope: root, dependencies: [cols, reduced], revertOnUpdate: true });
  const enter = (delay: number) => ({ initial: { opacity: 0, y: reduced ? 0 : 12 }, animate: { opacity: 1, y: 0 }, transition: { duration: reduced ? 0 : .6, ease, delay: reduced ? 0 : delay } });
  return <div ref={root} id="scroll-spacer">
    <div ref={canvas} id="main-canvas" style={{ opacity: loaded >= 2 ? 1 : 0 }}>
      <video ref={left} className="video-left" src={asset('left.mp4')} muted playsInline preload="auto" onLoadedData={() => setLoaded(n => n + 1)} aria-label="Archive collection, first moving study"/>
      <video ref={right} src={asset('right.mp4')} muted playsInline preload="auto" onLoadedData={() => setLoaded(n => n + 1)} aria-label="Archive collection, second moving study"/>
    </div>
    <div ref={panel} className="black-panel"><div ref={wrap} className="gallery-wrap"><div className="gallery-grid" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}>
      {buildLayout(10, cols).map((i, cell) => <div key={cell} className="gallery-cell">{i >= 0 && <div className="bp-card" style={{ transformOrigin: cell % cols < cols/2 ? 'right bottom' : 'left bottom' }}><img src={asset(`gallery-${String(i+1).padStart(2, '0')}.webp`)} alt={`PROMPT archive fashion study ${String(i+1).padStart(2,'0')}`} draggable="false"/></div>}</div>)}
    </div></div></div>
    <div ref={overlay} id="outro-overlay"/>
    <motion.div className="logo blend" {...enter(0)}><Wordmark/></motion.div>
    <motion.p className="caption blend" {...enter(.3)}>When switching between videos near the center, do not reset currentTime to 0 abruptly. Add a small dead zone: if cursor is within +/-50px of center, keep both videos at currentTime = 0 and show whichever was last active.</motion.p>
    <motion.header className="navigation blend" {...enter(.15)}><span className="about">ABOUT</span><div className="nav-group"><svg viewBox="0 0 40 40" aria-label="Menu"><path d="M0 14H40M0 26H40" stroke="white" strokeWidth="2.5"/></svg><span>[ CART ]</span></div></motion.header>
    <div ref={info} id="outro-info" className="blend" data-outro-offset={cols === 2 ? 132 : 166}><motion.div className="info-content" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: .6, delay: reduced ? 0 : .45 }}><div className="collection-top"><div className="circle-icon"><svg viewBox="0 0 40 40"><circle cx="20" cy="20" r="18.75" fill="none" stroke="white" strokeWidth="2.5"/></svg><span ref={symbol} id="circle-symbol">8</span></div><h1>ARCHIVE COLLECTION<br/>"PROMPT"</h1></div><div className="price">$97,33</div></motion.div></div>
    <div ref={buy} id="outro-buy" className="blend"><span>view</span></div>
    <footer ref={footer} id="outro-footer" className="blend"><span>PRMPT (R) 2026</span><span>PRIVACY POLICY</span></footer>
    <div ref={cursor} className="custom-cursor"><svg width="48" height="48" viewBox="0 0 48 48" fill="white"><circle cx="24" cy="24" r="22.75" fill="none" stroke="white" strokeWidth="2.5"/><path d="M14 15h20v3H14zm3 6h14v3H17zm-4 7h22v3H13zm9-17h4v26h-4zm-7 23 7-9 3 2-7 9zm12-9 7 9-3 2-7-9z"/></svg></div>
  </div>;
}
createRoot(document.getElementById('root')!).render(<React.StrictMode><App/></React.StrictMode>);
