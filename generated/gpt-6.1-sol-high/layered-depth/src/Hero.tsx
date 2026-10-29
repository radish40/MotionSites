import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { assets, localAsset } from './assets';
import { Arrow, Chevron, Envelope } from './Icons';

type BirdState = 'enter' | 'idle1' | 'idle2' | 'leave' | 'hidden';
type Clip = Exclude<BirdState, 'hidden'>;
const clips: Clip[] = ['enter', 'idle1', 'idle2', 'leave'];
const navItems = ['Projects', 'Studio', 'Responsibility', 'Archive'];
const buttonBase: CSSProperties = { border: 0, cursor: 'pointer', fontFamily: 'inherit', color: '#241f21' };

export default function Hero() {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);
  const [heroScroll, setHeroScroll] = useState(window.scrollY);
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState('Projects');
  const [languageOpen, setLanguageOpen] = useState(false);
  const [birdState, setBirdState] = useState<BirdState>('enter');
  const birdStateRef = useRef<BirdState>('enter');
  const videos = useRef<Partial<Record<Clip, HTMLVideoElement>>>({});
  const navRef = useRef<HTMLElement>(null);
  const playRequest = useRef(0);
  const playVideo = (next: BirdState) => {
    birdStateRef.current = next;
    setBirdState(next);
    const request = ++playRequest.current;
    clips.forEach(clip => { const video = videos.current[clip]; if (video) { video.pause(); video.currentTime = 0; } });
    if (next === 'hidden') return;
    const video = videos.current[next];
    if (!video) return;
    const play = () => { if (playRequest.current === request && birdStateRef.current === next) void video.play().catch(() => {}); };
    if (video.readyState >= 2) play();
    else video.addEventListener('canplay', play, { once: true });
  };
  useEffect(() => {
    clips.forEach(clip => videos.current[clip]?.load());
    playVideo(window.scrollY > 10 ? 'hidden' : 'enter');
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const scroll = window.scrollY;
        setHeroScroll(Math.min(scroll, window.innerHeight));
        if (scroll > 10 && !['leave', 'hidden'].includes(birdStateRef.current)) playVideo('leave');
        else if (scroll <= 10 && ['leave', 'hidden'].includes(birdStateRef.current)) playVideo('enter');
      });
    };
    const onResize = () => { setIsMobile(window.innerWidth < 768); };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);
    return () => { window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onResize); cancelAnimationFrame(frame); ++playRequest.current; clips.forEach(clip => videos.current[clip]?.pause()); };
  }, []);
  useEffect(() => {
    const key = (event: KeyboardEvent) => { if (event.key === 'Escape') { setMenuOpen(false); setLanguageOpen(false); } };
    const outside = (event: PointerEvent) => { if (!navRef.current?.contains(event.target as Node)) { setMenuOpen(false); setLanguageOpen(false); } };
    window.addEventListener('keydown', key); window.addEventListener('pointerdown', outside);
    return () => { window.removeEventListener('keydown', key); window.removeEventListener('pointerdown', outside); };
  }, []);
  const selectNav = (item: string) => { setActive(item); setMenuOpen(false); };
  const bottom = (isMobile ? 24 : 36) + heroScroll * 0.5;
  const tagline = <>
    <p style={{ fontSize: isMobile ? 17 : 'clamp(17px, 2vw, 24px)', lineHeight: 1.28, color: '#282425', letterSpacing: '-0.01em', whiteSpace: isMobile ? 'normal' : 'pre-line' }}>{isMobile ? "Designing places beyond what's expected" : "Designing places\nbeyond\nwhat's expected"}</p>
    <a href="#approach" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 18, color: '#282425', borderTop: '1px solid rgba(40,36,37,0.2)', paddingTop: 14, marginTop: 18, textDecoration: 'none', fontSize: 11, letterSpacing: '0.1em' }}>EXPLORE OUR APPROACH<Arrow /></a>
  </>;
  const cta = <>
    <img src={localAsset('cta.jpg')} alt="A collaborative conversation around a studio table" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(16,14,12,0.55) 0%, transparent 60%)' }} />
    <div style={{ position: 'relative', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: isMobile ? '13px 16px' : '18px 20px' }}>
      <p style={{ color: '#fff', fontSize: isMobile ? 12 : 13, lineHeight: 1.35 }}>Every lasting space begins<br />with a quiet dialogue.</p>
      <a href="mailto:hello@qelora.studio" aria-label="Start a project with Qelora by email" style={{ display: 'flex', alignItems: 'center', gap: 6, textDecoration: 'none', color: '#241f21', alignSelf: 'flex-start' }}>
        <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 36, height: 36, borderRadius: 12, background: '#fff' }}><Envelope /></span>
        <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff', padding: '0 15px', borderRadius: 12, height: 36, fontSize: 11, letterSpacing: '0.07em', fontWeight: 700 }}>START A PROJECT</span>
      </a>
    </div>
  </>;
  return <section id="hero" aria-label="Qelora architecture studio" style={{ position: 'relative', width: '100%', minHeight: '100vh', overflow: 'visible', fontFamily: "'Zimula Trial Med', sans-serif", background: '#d9dedb' }}>
    <div aria-hidden="true" style={{ position: 'absolute', inset: 0, height: '100vh', backgroundImage: `url(${localAsset('hero-fallback.svg')})`, backgroundPosition: 'center', backgroundSize: 'cover' }} />
    <video autoPlay muted loop playsInline src={assets.hero} aria-hidden="true" style={{ position: 'absolute', inset: 0, width: '100%', height: '100vh', objectFit: 'cover', zIndex: 0 }} />
    <div style={{ position: 'absolute', inset: 0, height: '100vh', background: 'rgba(235, 230, 218, 0.12)', zIndex: 1, pointerEvents: 'none' }} />
    <div aria-hidden="true" data-bird-state={birdState} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100vh', zIndex: 8, pointerEvents: 'none' }}>
      {clips.map(clip => <video key={clip} ref={el => { if (el) videos.current[clip] = el; }} src={assets[clip]} muted playsInline preload="auto" onEnded={() => { if (birdStateRef.current === clip) playVideo(clip === 'enter' ? 'idle1' : clip === 'idle1' ? 'idle2' : clip === 'idle2' ? 'idle1' : 'hidden'); }} style={{ position: 'absolute', ...(isMobile ? { top: '50%', left: 0, transform: 'translateY(-50%)', width: '100%', height: 'auto' } : { inset: 0, width: '100%', height: '100%', objectFit: 'cover' }), display: birdState === clip ? 'block' : 'none' }} />)}
    </div>
    <div style={{ position: 'absolute', inset: 0, height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none', zIndex: 5 }}><h1 style={{ fontFamily: "'Zimula Trial Bd', sans-serif", fontSize: isMobile ? '26vw' : '22vw', letterSpacing: '-0.05em', color: '#241f21', lineHeight: 1, marginBottom: isMobile ? '8vh' : '12vh', fontWeight: 400 }}>Qelora</h1></div>
    <div style={{ position: 'absolute', inset: 0, overflow: 'clip', pointerEvents: 'none', zIndex: 5 }}><img src={assets.slab} onError={event => { const img = event.currentTarget; if (!img.dataset.fallback) { img.dataset.fallback = 'true'; img.src = localAsset('slab-fallback.svg'); } }} alt="" style={{ position: 'absolute', top: '50%', left: '50%', transform: `translateX(-50%) translateY(${-heroScroll * 0.3}px)`, width: isMobile ? '220vw' : '160vw', maxWidth: 'none', height: 'auto', pointerEvents: 'none', willChange: 'transform' }} /></div>
    <nav ref={navRef} aria-label="Main navigation" style={{ position: 'fixed', top: 0, left: 0, width: '100%', padding: isMobile ? '16px 20px' : '20px 36px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', zIndex: 100 }}>
      <a href="#hero" aria-label="Qelora home" style={{ color: '#241f21', textDecoration: 'none', fontFamily: "'Zimula Trial Bd', sans-serif", fontSize: isMobile ? 20 : 24, letterSpacing: '-0.03em' }}>Qelora<sup style={{ fontSize: '0.4em', verticalAlign: 'super', marginLeft: 2 }}>®</sup></a>
      {isMobile ? <button aria-label={menuOpen ? 'Close menu' : 'Open menu'} aria-expanded={menuOpen} aria-controls="mobile-menu" onClick={() => setMenuOpen(!menuOpen)} style={{ ...buttonBase, width: 42, height: 42, borderRadius: 100, background: 'rgba(248,245,240,0.88)', backdropFilter: 'blur(12px)', boxShadow: '0 2px 20px rgba(0,0,0,0.1)', display: 'grid', placeItems: 'center' }}><svg width="19" height="19" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d={menuOpen ? 'm4 4 12 12M4 16 16 4' : 'M2 5h16M2 10h16M2 15h16'} stroke="currentColor" strokeWidth="1.3" /></svg></button> : <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>{navItems.map(item => <button key={item} aria-label={item} onClick={() => selectNav(item)} aria-pressed={active === item} style={{ ...buttonBase, position: 'relative', background: 'rgba(248,245,240,0.92)', borderRadius: 12, padding: '13px 22px 8px', height: 40, fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.07em', fontWeight: active === item ? 700 : 500 }}>{item}{active === item && <span style={{ position: 'absolute', bottom: 3, left: '50%', width: 3, height: 3, borderRadius: '50%', background: '#241f21' }} />}</button>)}<div style={{ position: 'relative', marginLeft: 10 }}><button onClick={() => setLanguageOpen(!languageOpen)} aria-expanded={languageOpen} aria-label="Language: English" style={{ ...buttonBase, borderRadius: 100, padding: '8px 14px', height: 40, background: 'rgba(248,245,240,0.88)', backdropFilter: 'blur(12px)', boxShadow: '0 2px 20px rgba(0,0,0,0.1)', display: 'flex', gap: 9, alignItems: 'center', fontSize: 12 }}>EN<Chevron /></button>{languageOpen && <button onClick={() => setLanguageOpen(false)} style={{ ...buttonBase, position: 'absolute', top: 48, right: 0, padding: '14px 20px', borderRadius: 12, background: 'rgba(248,245,240,0.96)', fontSize: 13 }}>English ✓</button>}</div></div>}
      {isMobile && menuOpen && <div id="mobile-menu" style={{ position: 'fixed', top: 70, left: 16, right: 16, zIndex: 99, background: 'rgba(248,245,240,0.96)', backdropFilter: 'blur(16px)', borderRadius: 18, padding: 8, boxShadow: '0 8px 40px rgba(0,0,0,0.14)' }}>{navItems.map(item => <button key={item} aria-label={item} onClick={() => selectNav(item)} aria-pressed={active === item} style={{ ...buttonBase, display: 'block', width: '100%', padding: '14px 20px', fontSize: 13, textAlign: 'left', textTransform: 'uppercase', letterSpacing: '0.07em', borderBottom: '1px solid rgba(40,36,37,0.08)', background: 'transparent', fontWeight: active === item ? 700 : 500 }}>{item}{active === item ? ' ·' : ''}</button>)}<button onClick={() => setMenuOpen(false)} aria-label="English selected" style={{ ...buttonBase, display: 'flex', alignItems: 'center', gap: 12, padding: '14px 20px', background: 'transparent', fontSize: 13 }}>EN<Chevron /></button></div>}
    </nav>
    {isMobile ? <div style={{ position: 'absolute', zIndex: 20, bottom, left: 20, right: 20, display: 'flex', flexDirection: 'column', gap: 12 }}><div style={{ background: 'rgba(248,245,240,0.72)', backdropFilter: 'blur(8px)', borderRadius: 16, padding: '18px 20px' }}>{tagline}</div><div style={{ position: 'relative', borderRadius: 16, height: 120, overflow: 'hidden', background: '#807c6d' }}>{cta}</div></div> : <><div style={{ position: 'absolute', zIndex: 20, bottom, left: 36, borderRadius: 18, padding: '22px 28px', maxWidth: 270, background: 'rgba(248,245,240,0.72)', backdropFilter: 'blur(8px)' }}>{tagline}</div><div style={{ position: 'absolute', zIndex: 20, bottom, right: 36, borderRadius: 18, width: 'clamp(210px, 21vw, 290px)', height: 180, overflow: 'hidden', background: '#807c6d' }}>{cta}</div></>}
  </section>;
}
