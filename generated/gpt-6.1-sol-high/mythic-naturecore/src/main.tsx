import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './style.css';
import assetReport from '../asset-report.json';

const PORTAL_BG = 'https://res.cloudinary.com/dsdhxhhqh/image/upload/v1779974947/portal_bg_mu60k9.png';
const CURTAIN_LEFT = 'https://res.cloudinary.com/dsdhxhhqh/image/upload/v1779975070/curtain_left_cdht6q.png';
const CURTAIN_RIGHT = 'https://res.cloudinary.com/dsdhxhhqh/image/upload/v1779975071/curtain_right_a9bn3i.png';
const WORLD_BG = 'https://res.cloudinary.com/dsdhxhhqh/image/upload/v1779975077/world_bg_jzzcn1.jpg';
// The cards MUST remain in this exact order (Card 3, Card 1, Card 2).
const CARD_IMAGES = [
  'https://res.cloudinary.com/dsdhxhhqh/image/upload/v1779975070/card_3_nbwm25.jpg',
  'https://res.cloudinary.com/dsdhxhhqh/image/upload/v1779975070/card_2_wr6al6.jpg', // Representing Card 1
  'https://res.cloudinary.com/dsdhxhhqh/image/upload/v1779975070/card_1_jz8otj.jpg', // Representing Card 2
];
const easeInOut = (t: number) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));
const MAG = { world: 6, portal: 7, curtainL: 14, curtainR: 14 };
const asset = (name: string) => `${import.meta.env.BASE_URL}assets/${name}`;
function useIsMobile() {
  const [mobile, setMobile] = useState(() => window.matchMedia('(max-width: 767px)').matches);
  useEffect(() => { const media = window.matchMedia('(max-width: 767px)'); const change = () => setMobile(media.matches); media.addEventListener('change', change); return () => media.removeEventListener('change', change); }, []);
  return mobile;
}
function SceneImage({ src, fallback, className = '', alt = '' }: { src: string; fallback: string; className?: string; alt?: string }) {
  return <img className={className} src={assetReport.some(record => record.url === src && record.http_status !== '200') ? asset(fallback) : src} alt={alt} draggable={false} onError={e => { const img = e.currentTarget; if (!img.dataset.fallback) { img.dataset.fallback = 'true'; img.src = asset(fallback); } }} />;
}
function Star() { return <svg width="28" height="28" viewBox="0 0 28 28" fill="currentColor" aria-hidden="true"><path d="M14 2l2.09 6.42H23l-5.45 3.96 2.08 6.42L14 14.83 8.37 18.8l2.08-6.42L5 8.42h6.91L14 2Z"/><path d="m14 19 .8 2.8 2.7.8-2.7.8L14 26l-.8-2.6-2.7-.8 2.7-.8.8-2.8Z"/></svg>; }
function App() {
  const mobile = useIsMobile();
  const [ui, setUi] = useState(false);
  const [entering, setEntering] = useState(true);
  const world = useRef<HTMLDivElement>(null), portal = useRef<HTMLDivElement>(null), left = useRef<HTMLDivElement>(null), right = useRef<HTMLDivElement>(null), hero = useRef<HTMLDivElement>(null), finale = useRef<HTMLDivElement>(null), nav = useRef<HTMLElement>(null);
  const scrollTo = (progress: number) => window.scrollTo({ top: progress * (document.documentElement.scrollHeight - innerHeight), behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
  useEffect(() => {
    let frame = 0, targetX = 0, targetY = 0, rx = 0, ry = 0, opened = false;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const move = (e: PointerEvent) => { if (e.pointerType === 'touch' || reduced) return; targetX = (e.clientX / innerWidth - .5) * 2; targetY = (e.clientY / innerHeight - .5) * 2; };
    const reset = () => { targetX = 0; targetY = 0; };
    const t1 = window.setTimeout(() => { opened = true; }, 100);
    const t2 = window.setTimeout(() => setUi(true), 600);
    const t3 = window.setTimeout(() => setEntering(false), 2200);
    const tick = () => {
      rx = lerp(rx, targetX, .07); ry = lerp(ry, targetY, .07);
      const p = clamp(scrollY / (document.documentElement.scrollHeight - innerHeight), 0, 1);
      const eased = easeInOut(p), totalShift = (opened ? 62 : 0) + eased * 150;
      if (world.current) world.current.style.transform = `scale(${lerp(1, 1.18, eased)}) translate3d(${rx * MAG.world}px,${ry * MAG.world}px,0)`;
      if (portal.current) { portal.current.style.transform = `scale(${lerp(1, 7.5, eased)}) translate3d(${rx * MAG.portal}px,${ry * MAG.portal}px,0)`; portal.current.style.opacity = `${clamp(1 - (p - .65) / .2, 0, 1)}`; }
      if (left.current) left.current.style.transform = `translateX(calc(-${totalShift}% + ${rx * MAG.curtainL}px)) translateY(${ry * MAG.curtainL * .3}px) scale(${lerp(1, 1.3, eased)}) translateZ(0)`;
      if (right.current) right.current.style.transform = `translateX(calc(${totalShift}% + ${rx * MAG.curtainR}px)) translateY(${ry * MAG.curtainR * .3}px) scale(${lerp(1, 1.3, eased)}) translateZ(0)`;
      const heroOpacity = clamp(1 - p / .22, 0, 1), finalOpacity = clamp((p - .68) / .16, 0, 1);
      if (hero.current) { hero.current.style.opacity = `${heroOpacity}`; hero.current.style.pointerEvents = heroOpacity > .1 ? 'auto' : 'none'; hero.current.inert = heroOpacity <= .1; }
      if (finale.current) { finale.current.style.opacity = `${finalOpacity}`; finale.current.style.pointerEvents = finalOpacity > 0 ? 'auto' : 'none'; finale.current.inert = finalOpacity <= 0; }
      if (nav.current) nav.current.style.setProperty('--nav-opacity', `${ui ? .9 : 0}`);
      document.documentElement.style.setProperty('--progress', `${p}`);
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick); window.addEventListener('pointermove', move, { passive: true }); document.addEventListener('pointerleave', reset); window.addEventListener('blur', reset);
    return () => { cancelAnimationFrame(frame); [t1, t2, t3].forEach(clearTimeout); window.removeEventListener('pointermove', move); document.removeEventListener('pointerleave', reset); window.removeEventListener('blur', reset); };
  }, []);
  const jump = (e: React.MouseEvent, p: number) => { e.preventDefault(); scrollTo(p); };
  const link = (label: string, p: number) => <a href={p ? '#beyond' : '#reverie'} onClick={e => jump(e, p)}>{label}</a>;
  return <main className={`journey ${entering ? 'entering' : ''} ${ui ? 'ui-visible' : ''}`} id="reverie">
    <div className="scene sticky top-0 h-screen overflow-hidden">
      <div ref={world} className="layer world"><SceneImage src={WORLD_BG} fallback="world-recovered.jpg" /></div>
      <div className="world-shade" />
      <div ref={portal} className="layer portal"><SceneImage src={PORTAL_BG} fallback="portal-recovered.png" /></div>
      <div className="scene-vignette" />
      <div ref={left} className="curtain curtain-left"><SceneImage src={CURTAIN_LEFT} fallback="curtain-left-recovered.png" /></div>
      <div ref={right} className="curtain curtain-right"><SceneImage src={CURTAIN_RIGHT} fallback="curtain-right-recovered.png" /></div>
      <nav ref={nav} className="navigation absolute flex items-center justify-between" aria-label="Main navigation">
        <div className="nav-group">{mobile ? link('Explore', .32) : <>{link('Worlds', .32)}{link('Atelier', .48)}{link('Immersions', .64)}</>}</div>
        <a className="brand" href="#reverie" aria-label="Reverie, return to entrance" onClick={e => jump(e, 0)}><Star /></a>
        <div className="nav-group">{!mobile && <>{link('Craft', .48)}{link('Codex', .64)}</>}{link('Connect', 1)}</div>
      </nav>
      <div ref={hero} className="hero absolute inset-0">
        <div className="hero-copy entrance">
          <h1><span>FALL <span className="title-arrow">›</span> INTO</span><span>REVERIE</span></h1>
          <p>Creating boundless digital worlds<br className="desktop-break"/> where the edge between AI vision and<br className="desktop-break"/> living myth dissolves.</p>
        </div>
        <div className="cards entrance flex" aria-label="Explore Reverie">
          {CARD_IMAGES.slice(0, mobile ? 1 : 3).map((src, i) => <button key={src} className={`world-card card-${i + 1} relative overflow-hidden text-left`} onClick={() => scrollTo(i === 1 ? 1 : .9)} aria-label={i === 1 ? 'Meet the world of Reverie' : `View Reel ${i === 0 ? 'one' : 'two'}`}>
            <SceneImage src={src} fallback={`card-${i + 1}-recovered.jpg`} />
            <span className="card-sheen" />
            <span className="card-label">{i === 1 ? <><span className="patron-count">32</span><span className="patron-label">World Patrons</span></> : <><span className="play"><svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor" aria-hidden="true"><path d="m3 1 6 4-6 4Z"/></svg></span><span>View Reel</span><span className="card-arrow">↗</span></>}</span>
          </button>)}
        </div>
        <div className="indicators entrance flex items-center" aria-label="Journey stages">{[0, .32, .64, 1].map((p, i) => <button key={p} onClick={() => scrollTo(p)} aria-label={`Go to journey stage ${i + 1}`} aria-current={i === 0 ? 'step' : undefined}><span /></button>)}</div>
        <button className="descend entrance flex flex-col items-center" onClick={() => scrollTo(.34)}><span>DESCEND</span><span className="descend-circle"><svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true"><path d="m2 4 4 4 4-4" stroke="currentColor"/></svg></span></button>
      </div>
      <div ref={finale} id="beyond" className="finale absolute inset-0 flex flex-col items-center justify-center text-center" style={{ opacity: 0 }}>
        <h2>FORGE BEYOND THE REAL</h2>
        <p>Singular voyages to astonishing destinations, shaped for those who seek beauty beyond the ordinary and the known.</p>
      </div>
    </div>
  </main>;
}
createRoot(document.getElementById('root')!).render(<App />);
