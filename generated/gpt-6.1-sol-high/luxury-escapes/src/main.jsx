import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

const fill = { position: 'absolute', inset: 0 };
const anton = { fontFamily: "'Anton', sans-serif", fontWeight: 900 };
const anim = (name, duration, delay) => ({ animation: `${name} ${duration}s cubic-bezier(0.22,1,0.36,1) ${delay}s both` });
const source = name => `${import.meta.env.BASE_URL}videos/${name}.mp4`;
const starPath = 'M87 116C260 108 408 168 512 300C616 168 764 108 937 116C945 289 885 437 753 541C885 645 945 793 937 966C764 974 616 914 512 782C408 914 260 974 87 966C79 793 139 645 271 541C139 437 79 289 87 116Z';
function FitLine({ children, duration, delay }) {
  const container = useRef(null);
  const text = useRef(null);
  const [fit, setFit] = useState(1);
  useLayoutEffect(() => {
    const measure = () => setFit(Math.min(1, container.current.clientWidth / text.current.offsetWidth));
    measure(); document.fonts.ready.then(measure);
  }, []);
  return <span ref={container} style={{ display: 'block', overflow: 'hidden' }}><span style={{ display: 'flex', justifyContent: 'center', ...anim('zeRise', duration, delay) }}><span ref={text} style={{ display: 'block', flexShrink: 0, whiteSpace: 'nowrap', transform: `scaleX(${fit})` }}>{children}</span></span></span>;
}
function Star({ size = 22, style }) { return <svg aria-hidden="true" width={size} height={size} viewBox="0 0 1024 1024" style={style}><path fill="white" d={starPath} /></svg>; }
function Arrow({ style, width = 18, height = 14 }) { return <svg aria-hidden="true" width={width} height={height} viewBox="0 0 18 14" style={style}><path d="M9 1v11M2 6l7 7 7-7" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg>; }
function Video({ name, style, duplicate = false }) {
  const ref = useRef(null);
  useEffect(() => { if (matchMedia('(prefers-reduced-motion: reduce)').matches) ref.current?.pause(); }, []);
  return <video ref={ref} aria-hidden="true" autoPlay loop muted playsInline preload="auto" tabIndex={-1} style={{ ...fill, width: '100%', height: '100%', objectFit: 'cover', ...style }}><source src={source(name)} type="video/mp4" /></video>;
}
function IOSStatusBar({ dark }) {
  return <div aria-label="11:11, full signal and battery" style={{ position: 'absolute', top: 21, left: 29, right: 25, height: 21, display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: dark ? '#fff' : '#000', zIndex: 45 }}>
    <span style={{ fontFamily: '-apple-system, "SF Pro", system-ui, sans-serif', fontWeight: 590, fontSize: 17 }}>11:11</span>
    <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
      <svg width="18" height="13" viewBox="0 0 18 13" fill="currentColor" aria-hidden="true"><rect y="9" width="3" height="4" rx=".7"/><rect x="5" y="6" width="3" height="7" rx=".7"/><rect x="10" y="3" width="3" height="10" rx=".7"/><rect x="15" width="3" height="13" rx=".7"/></svg>
      <svg width="17" height="13" viewBox="0 0 17 13" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M1 4a11 11 0 0 1 15 0M4 7a7 7 0 0 1 9 0M7 10a2 2 0 0 1 3 0"/><circle cx="8.5" cy="12" r=".7" fill="currentColor" stroke="none"/></svg>
      <svg width="27" height="13" viewBox="0 0 27 13" fill="currentColor" aria-hidden="true"><rect x=".5" y=".5" width="23" height="12" rx="3" fill="none" stroke="currentColor" opacity=".5"/><rect x="2.5" y="2.5" width="19" height="8" rx="1.3"/><path d="M25 4v5q3-2.5 0-5" opacity=".5"/></svg>
    </div>
  </div>;
}
function IOSDevice({ dark = false, children, label }) {
  return <section aria-label={label} style={{ position: 'relative', flexShrink: 0, width: 370, height: 790, borderRadius: 48, overflow: 'hidden', background: dark ? '#000' : '#F2F2F7', boxShadow: '0 40px 80px rgba(0,0,0,0.18), 0 0 0 1px rgba(0,0,0,0.12)' }}>
    {children}<IOSStatusBar dark={dark}/><div style={{ position: 'absolute', width: 126, height: 37, background: '#000', borderRadius: 24, top: 11, left: '50%', transform: 'translateX(-50%)', zIndex: 50, pointerEvents: 'none' }}/><div style={{ position: 'absolute', bottom: 8, left: '50%', transform: 'translateX(-50%)', width: 139, height: 5, borderRadius: 100, background: dark ? 'rgba(255,255,255,.7)' : 'rgba(0,0,0,.25)', zIndex: 60, pointerEvents: 'none' }}/>
  </section>;
}
function OfferTeaser({ onView, focusOnMount }) {
  return <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: '#f4f4f4', padding: '66px 14px 14px' }}>
    <h1 style={{ ...anton, fontSize: 69, lineHeight: .94, letterSpacing: .5, color: '#2c2c2c', textAlign: 'center', textTransform: 'uppercase', margin: '0 0 18px', flexShrink: 0 }}>
      {['Experience', 'Unparalleled', 'Luxury'].map((line, i) => <FitLine key={line} duration={.9} delay={.1 + i * .12}>{line}</FitLine>)}
    </h1>
    <div style={{ position: 'relative', flex: 1, borderRadius: 26, overflow: 'hidden', margin: '0 8px', background: '#5d7358', ...anim('zeCardReveal', 1.1, .45) }}>
      <Video name="offer" style={{ filter: 'saturate(.84) contrast(1.05)' }}/>
      <Video name="offer" duplicate style={{ filter: 'blur(16px) saturate(1.15)', transform: 'scale(1.08)', maskImage: 'linear-gradient(180deg, transparent 0%, transparent 48%, rgba(0,0,0,.35) 62%, rgba(0,0,0,.85) 78%, black 92%)' }}/>
      <div style={{ ...fill, background: 'rgba(122,107,82,.21)' }}/>
      <div style={{ ...fill, background: 'linear-gradient(180deg, rgba(40,70,35,0) 0%, rgba(40,70,35,0) 42%, rgba(45,80,40,.18) 60%, rgba(35,65,32,.4) 78%, rgba(28,52,26,.55) 100%)' }}/>
      <Star style={{ position: 'absolute', top: 20, left: 20, ...anim('zeBloom', .9, 1.05) }}/>
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '22px 22px 24px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 10 }}>
        <h2 style={{ margin: 0, fontSize: 34, fontWeight: 500, lineHeight: 1.12, color: '#fff', letterSpacing: -.2, ...anim('zeFadeUp', .85, .8) }}>Bali Exclusive<br/>Luxury Getaway</h2>
        <p style={{ margin: 0, fontSize: 13.5, lineHeight: 1.45, color: 'rgba(255,255,255,.88)', maxWidth: 250, ...anim('zeFadeUp', .85, .92) }}>Breathtaking locations, bespoke services, with a focus on exclusivity</p>
        <button autoFocus={focusOnMount} onClick={onView} style={{ border: 0, display: 'flex', alignItems: 'center', gap: 16, borderRadius: 999, padding: '7px 7px 7px 14px', background: 'linear-gradient(90deg, #FAD5D7 0%, #FAD5D7 38%, #fff 50%, #9CE2F9 62%, #9CE2F9 100%)', boxShadow: '0 6px 18px rgba(0,0,0,.25)', color: '#1a1a2e', ...anim('zePillPop', .75, 1.1) }}><span style={{ fontSize: 10, fontWeight: 750, letterSpacing: .6 }}>VIEW OFFER</span><span style={{ width: 24, height: 24, borderRadius: '50%', display: 'grid', placeItems: 'center', background: 'rgba(255,255,255,.45)' }}><svg aria-hidden="true" width="12.5" height="12.5" viewBox="0 0 24 24" fill="none" stroke="#1a1a2e" strokeWidth="2"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/></svg></span></button>
      </div>
    </div>
  </div>;
}
const iconButton = { border: 0, padding: 0, width: 24, height: 26, display: 'flex', justifyContent: 'center', alignItems: 'center', background: 'transparent', color: '#fff' };
function GetawayDetail({ onBack, detailRef }) {
  const [menu, setMenu] = useState(false);
  const [emphasis, setEmphasis] = useState(false);
  return <div style={{ ...fill, color: '#fff' }}>
    <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true"><filter id="grade" colorInterpolationFilters="sRGB"><feColorMatrix type="matrix" values="0.6666 -0.0742 0.0785 0 0.1499 -0.0627 0.7320 0.0649 0 0.0943 -0.0701 0.1109 0.7276 0 0.0471 0 0 0 1 0"/></filter></svg>
    <Video name="getaway" style={{ filter: 'url(#grade)', transform: 'translate(0%, -4%) scale(1.07)' }}/>
    <div style={{ ...fill, bottom: 'auto', height: '22%', background: 'linear-gradient(to bottom, rgba(8,12,16,.30), transparent)' }}/>
    {[[1,480,545],[1.5,440,505],[3,390,455],[5,320,395],[7,240,325],[9,130,235]].map(([blur, start, end]) => <div key={blur} style={{ ...fill, pointerEvents: 'none', backdropFilter: `blur(${blur}px)`, maskImage: `radial-gradient(circle at 55% 115%, black ${start}px, transparent ${end}px)` }}/>) }
    <div style={{ ...fill, pointerEvents: 'none', background: 'linear-gradient(to top, rgba(110,160,195,.30) 0%, rgba(110,160,195,.19) 7%, rgba(112,160,192,.07) 16%, transparent 34%), linear-gradient(285deg, rgba(240,225,205,.18) 0%, rgba(240,225,205,.09) 24%, transparent 48%), radial-gradient(ellipse 60% 30% at 0% 76%, rgba(5,25,75,.20), transparent 70%)' }}/>
    <div style={{ ...fill, display: 'flex', flexDirection: 'column', padding: '64px 24px 48px' }}>
      <nav aria-label="Getaway navigation" style={{ display: 'flex', justifyContent: 'space-between', position: 'relative', ...anim('zeFadeDown', .7, .25) }}>
        <button aria-label="Back to offer" onClick={onBack} style={iconButton}><Arrow style={{ transform: 'rotate(90deg)' }}/></button>
        <button aria-label="Getaway menu" aria-expanded={menu} onClick={() => setMenu(!menu)} onKeyDown={e => e.key === 'Escape' && setMenu(false)} style={{ ...iconButton, flexDirection: 'column', gap: 5 }}><span style={{ width: 18, height: 2, background: 'white' }}/><span style={{ width: 18, height: 2, background: 'white' }}/></button>
        {menu && <div style={{ position: 'absolute', right: 0, top: 36, padding: 18, background: 'rgba(20,37,43,.94)', borderRadius: 16, zIndex: 10, boxShadow: '0 12px 30px #0004' }}><button style={{ ...iconButton, width: 'auto', height: 'auto', fontSize: 13 }} onClick={() => { setMenu(false); detailRef.current?.focus(); }}>Bali Exclusive · 8 guests · 12 days</button></div>}
      </nav>
      <div style={{ textAlign: 'center', marginTop: 46 }}>
        <h2 ref={detailRef} tabIndex={-1} style={{ ...anton, fontSize: 52, lineHeight: 1, letterSpacing: .5, margin: 0, color: '#fff', textShadow: '0 2px 18px rgba(0,0,0,.35)', outline: 'none' }}>{['BALI EXCLUSIVE', 'LUXURY GETAWAY'].map((line, i) => <FitLine key={line} duration={.95} delay={.35 + i * .13}>{line}</FitLine>)}</h2>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: 6, marginTop: 10, ...anim('zeFadeUp', .8, .7) }}><span style={{ fontSize: 13, fontWeight: 'bold', color: 'rgba(255,255,255,.85)' }}>by</span><span style={{ ...anton, fontSize: 22, letterSpacing: 1 }}>ZENITH ESCAPES</span></div>
      </div>
      <div style={{ textAlign: 'center', paddingTop: 40 }}><Star size={30} style={{ filter: 'drop-shadow(0 2px 10px rgba(0,0,0,.35))', ...anim('zeBloom', 1, .95) }}/></div>
      <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>{[['Exclusive','8 GUESTS'],['Availability','12 DAYS']].map(([label, value], i) => <div key={label} style={{ marginLeft: i ? 48 : 0, ...anim('zeFadeUp', .85, .85 + i * .13) }}><div style={{ fontSize: 11, fontWeight: 'bold', color: 'rgba(255,255,255,.75)', marginBottom: 3 }}>{label}</div><div style={{ ...anton, fontSize: 33 }}>{value}</div></div>)}</div>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 16 }}><p id="getaway-description" tabIndex={-1} style={{ fontSize: 12.5, lineHeight: 1.55, color: 'rgba(255,255,255,.92)', maxWidth: 270, margin: 0, textShadow: emphasis ? '0 0 14px white' : 'none', transition: 'text-shadow .3s', ...anim('zeFadeUp', .85, 1.12) }}>Escape to an elite getaway, where every detail is meticulously designed to meet the highest expectations of luxury and serenity.</p><button aria-label="Read getaway description" onClick={() => { document.getElementById('getaway-description')?.focus(); setEmphasis(true); setTimeout(() => setEmphasis(false), 1200); }} style={{ ...iconButton, flexShrink: 0, width: 18, marginLeft: 22, ...anim('zeArrowDrop', .7, 1.35) }}><Arrow/></button></div>
      </div>
    </div>
  </div>;
}
function App() {
  const stage = useRef(null);
  const detailRef = useRef(null);
  const [scale, setScale] = useState(1);
  const [detailKey, setDetailKey] = useState(0);
  const [offerKey, setOfferKey] = useState(0);
  useLayoutEffect(() => {
    const resize = () => setScale(Math.min(1, (window.innerWidth - 40) / stage.current.offsetWidth, (window.innerHeight - 40) / stage.current.offsetHeight));
    resize(); window.addEventListener('resize', resize); return () => window.removeEventListener('resize', resize);
  }, []);
  return <main aria-label="Luxury Escapes mobile showcase" style={{ width: '100vw', height: '100vh', overflow: 'hidden', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'radial-gradient(120% 90% at 18% 8%, #FBEFDD 0%, #F3D9BE 22%, #E1A98C 42%, #9C6E8F 62%, #4B4470 80%, #23274A 100%)' }}>
    <div style={{ position: 'absolute', pointerEvents: 'none', width: 900, height: 900, borderRadius: '50%', top: -320, left: -220, filter: 'blur(10px)', background: 'radial-gradient(circle, rgba(255,225,180,.55), transparent 70%)' }}/>
    <div style={{ position: 'absolute', pointerEvents: 'none', width: 700, height: 700, borderRadius: '50%', bottom: -260, right: -180, filter: 'blur(10px)', background: 'radial-gradient(circle, rgba(60,90,150,.45), transparent 70%)' }}/>
    <div ref={stage} data-testid="stage" style={{ display: 'flex', gap: 70, flexShrink: 0, width: 'max-content', transform: `scale(${scale})`, transformOrigin: 'center center' }}>
      <IOSDevice label="Offer teaser"><OfferTeaser key={offerKey} focusOnMount={offerKey > 0} onView={() => { setDetailKey(x => x + 1); requestAnimationFrame(() => detailRef.current?.focus()); }}/></IOSDevice>
      <IOSDevice dark label="Getaway detail"><GetawayDetail key={detailKey} detailRef={detailRef} onBack={() => setOfferKey(x => x + 1)}/></IOSDevice>
    </div>
  </main>;
}
createRoot(document.getElementById('root')).render(<App/>);
