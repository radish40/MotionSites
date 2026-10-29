import React, { useEffect, useRef, useState, type CSSProperties } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';

const PORTAL_BG = 'https://res.cloudinary.com/dy5er7kv5/image/upload/q_auto/f_auto/v1781046673/image_1_ksxfzb.png';
const WORLD_BG = 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260609_231253_53c0854c-d13c-42c1-9fc0-17e87cd34091.png&w=1280&q=85';
const localWorld = `${import.meta.env.BASE_URL}assets/world.webp`;
const uiFont = "'Helvetica Now Display', sans-serif";
const scriptFont = "'Mr Dafoe Regular', cursive";
const clamp = (x: number, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const easeInOut = (t: number) => t < .5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
function useIsMobile() {
  const [mobile, setMobile] = useState(window.innerWidth < 768);
  useEffect(() => { const q = matchMedia('(max-width: 767px)'); const update = () => setMobile(q.matches); q.addEventListener('change', update); update(); return () => q.removeEventListener('change', update); }, []);
  return mobile;
}
function Brand({ mobile }: { mobile: boolean }) {
  return <span style={{ display: 'inline-flex', alignItems: 'baseline', color: 'white', letterSpacing: '-0.02em' }}><span style={{ fontFamily: scriptFont, fontSize: mobile ? 30 : 36 }}>Aura</span><span style={{ fontFamily: uiFont, fontSize: mobile ? 20 : 24, fontWeight: 500 }}>gate</span></span>;
}
function Chevron({ dir }: { dir: number }) { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d={dir === 1 ? 'm9 5 7 7-7 7' : 'm15 5-7 7 7 7'} stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>; }
const quotes = [
  'It is amazing to see and feel the worlds I am stepping into each day.',
  'I have been feeling much more alive inside these living worlds, even on the long days.',
  'My wonder has been growing so fast that it is hard to believe the difference. Auragate gave me exactly the vision I needed.',
  'The first two scenes felt alive. I tried everything we dreamed up and it worked.',
  'The wonder of it all really moved me, it even brought a tear to my eyes every time.',
  'I finally feel immersed, like the worlds were built just for me.',
  'Stepping into it was effortless and the worlds have been unlike anything I dreamt.'
];
function ArcCardCarousel({ mobile }: { mobile: boolean }) {
  const [active, setActive] = useState(Math.floor(quotes.length / 2));
  const cardW = mobile ? 230 : 300, cardH = mobile ? 320 : 420, stepX = mobile ? 170 : 295, dropY = mobile ? 34 : 52, tilt = mobile ? 7 : 8;
  const advance = (dir: number) => setActive(a => (a + dir + quotes.length) % quotes.length);
  return <div role="region" aria-label="World experiences" aria-roledescription="carousel" onKeyDown={e => { if (e.key === 'ArrowLeft') advance(-1); if (e.key === 'ArrowRight') advance(1); }} style={{ position: 'relative', width: '100%', height: mobile ? 460 : 560, marginTop: 34 }}>
    {quotes.map((quote, i) => {
      let pos = i - active; if (pos > 3) pos -= 7; if (pos < -3) pos += 7;
      const abs = Math.abs(pos), center = pos === 0;
      return <article key={quote} aria-hidden={!center} aria-roledescription="slide" aria-label={`${i + 1} of 7`} data-active={center} style={{ position: 'absolute', left: '50%', top: 0, marginLeft: -cardW / 2, width: cardW, height: cardH, padding: mobile ? 28 : 36, display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', borderRadius: mobile ? 22 : 28, transform: `translateX(${pos * stepX}px) translateY(${abs * dropY + (center ? mobile ? 22 : 30 : 0)}px) rotate(${pos * tilt}deg)`, opacity: center ? 1 : Math.max(0, .6 - (abs - 1) * .2), zIndex: 100 - abs, pointerEvents: center ? 'auto' : 'none', transition: 'transform .55s cubic-bezier(.22,1,.36,1), opacity .55s ease', background: center ? 'rgb(247,251,255)' : 'linear-gradient(135deg, rgba(255,255,255,.42) 0%, rgba(255,255,255,.24) 100%)', backdropFilter: center ? 'none' : 'blur(18px) saturate(140%)', WebkitBackdropFilter: center ? 'none' : 'blur(18px) saturate(140%)', border: `1px solid rgba(255,255,255,${center ? .6 : .28})`, boxShadow: center ? '0 8px 24px rgba(0,0,0,.08), 0 0 50px rgba(255,255,255,.55), 0 0 90px rgba(255,255,255,.35)' : 'inset 0 1px 1px rgba(255,255,255,.45)' }}><p style={{ margin: 0, fontFamily: uiFont, fontWeight: 500, fontSize: mobile ? 15 : 17, lineHeight: 1.5, letterSpacing: '-0.01em', color: center ? '#2c2420' : 'rgba(255,255,255,.85)' }}>“{quote}”</p></article>;
    })}
    <span aria-live="polite" style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clipPath: 'inset(50%)' }}>{quotes[active]}</span>
    <div style={{ position: 'absolute', bottom: -40, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 10, zIndex: 110 }}>{[-1, 1].map(dir => <button key={dir} aria-label={dir === -1 ? 'Previous testimonial' : 'Next testimonial'} onClick={() => advance(dir)} style={{ width: mobile ? 42 : 46, height: mobile ? 42 : 46, borderRadius: '50%', border: 0, display: 'grid', placeItems: 'center', color: dir === -1 ? 'white' : '#2c2420', background: dir === -1 ? 'rgba(255,255,255,.2)' : 'rgba(255,255,255,.9)', boxShadow: dir === -1 ? 'none' : '0 6px 18px rgba(0,0,0,.18)', filter: dir === -1 ? 'drop-shadow(0 0 6px rgba(255,255,255,.7)) drop-shadow(0 0 14px rgba(255,255,255,.4))' : 'none' }}><Chevron dir={dir} /></button>)}</div>
  </div>;
}
/* Authored CSS fallback: the supplied Cloudinary account is disabled. The original URL is still attempted. */
function PortalFallback({ mobile }: { mobile: boolean }) {
  return <div aria-hidden="true" style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 52% 38%, #613a42 0%, #27141c 40%, #0a0608 78%)' }}>
    <div style={{ position: 'absolute', width: mobile ? '68vw' : '32vw', height: mobile ? '56vh' : '68vh', left: '52%', top: '38%', transform: 'translate(-50%,-50%)', borderRadius: '50% 50% 4px 4px', backgroundImage: `linear-gradient(0deg,rgba(24,12,23,.1),rgba(24,12,23,.1)),url("${localWorld}")`, backgroundSize: 'auto 100vh', backgroundPosition: 'center', boxShadow: '0 0 0 2px #c3938f, 0 0 28px 4px #bd8a7b, 0 0 0 22px #38232b, 0 0 0 24px #76515a, 0 0 0 52px #24151e, 0 0 0 54px #51333e, 0 0 0 90px #1b1118, 0 0 0 92px #38222c, 0 40px 160px 80px #090609' }} />
    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(0deg,#0a0608 0%,rgba(10,6,8,.9) 10%,transparent 46%),linear-gradient(90deg,rgba(10,6,8,.3),transparent 45%,rgba(10,6,8,.25))' }} />
  </div>;
}
function App() {
  const mobile = useIsMobile();
  const introRef = useRef<HTMLElement>(null), worldRef = useRef<HTMLDivElement>(null), portalRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef(0), mouse = useRef({ x: 0, y: 0 });
  const [progress, setProgress] = useState(0), [uiVisible, setUiVisible] = useState(false), [portalFailed, setPortalFailed] = useState(false), [menuOpen, setMenuOpen] = useState(false);
  const demoRef = useRef(0);
  useEffect(() => {
    const update = () => { const p = clamp(window.scrollY / Math.max(1, (introRef.current?.offsetHeight ?? innerHeight * 1.6) - innerHeight)); progressRef.current = p; setProgress(p); };
    const move = (e: MouseEvent) => { mouse.current = { x: (e.clientX / innerWidth - .5) * 2, y: (e.clientY / innerHeight - .5) * 2 }; };
    const reset = () => { mouse.current = { x: 0, y: 0 }; };
    addEventListener('scroll', update, { passive: true }); addEventListener('resize', update); addEventListener('mousemove', move); document.addEventListener('mouseleave', reset); update();
    let frame = 0, mx = 0, my = 0;
    const animate = () => { mx = lerp(mx, mouse.current.x, .07); my = lerp(my, mouse.current.y, .07); const ep = easeInOut(progressRef.current); if (worldRef.current) worldRef.current.style.transform = `scale(${lerp(1, 1.18, ep)}) translate(${-mx * 6}px, ${-my * 6}px)`; if (portalRef.current) portalRef.current.style.transform = `scale(${lerp(1, 7.5, ep)}) translate(${-mx * 7}px, ${-my * 7}px)`; frame = requestAnimationFrame(animate); }; frame = requestAnimationFrame(animate);
    const timer = setTimeout(() => setUiVisible(true), 600);
    return () => { removeEventListener('scroll', update); removeEventListener('resize', update); removeEventListener('mousemove', move); document.removeEventListener('mouseleave', reset); cancelAnimationFrame(frame); cancelAnimationFrame(demoRef.current); clearTimeout(timer); };
  }, []);
  const sceneOpacity = clamp(1 - progress / .22);
  const demo = () => { setMenuOpen(false); cancelAnimationFrame(demoRef.current); const start = window.scrollY, end = (introRef.current?.offsetHeight ?? innerHeight * 1.6), time = performance.now(); const tick = (now: number) => { const t = clamp((now - time) / 2400); window.scrollTo(0, lerp(start, end, easeInOut(t))); if (t < 1) demoRef.current = requestAnimationFrame(tick); }; demoRef.current = requestAnimationFrame(tick); };
  const whiteButton: CSSProperties = { border: 0, background: 'white', color: '#161616', transition: 'background .25s', fontWeight: 600 };
  const hoverButton = { onMouseEnter: (e: React.MouseEvent<HTMLButtonElement>) => { e.currentTarget.style.background = '#e6e6e6'; }, onMouseLeave: (e: React.MouseEvent<HTMLButtonElement>) => { e.currentTarget.style.background = 'white'; } };
  const linkStyle: CSSProperties = { textDecoration: 'none', fontSize: 14, fontWeight: 500, color: 'white', transition: 'opacity .2s' };
  return <main style={{ position: 'relative', background: '#0a0608', color: 'white', fontFamily: uiFont }}>
    <div style={{ position: 'fixed', inset: 0, zIndex: 0, overflow: 'hidden', background: '#03b3e8' }}><div ref={worldRef} style={{ width: '100%', height: '100%', transformOrigin: '50% 50%', willChange: 'transform' }}><img src={WORLD_BG} onError={e => { if (!e.currentTarget.src.endsWith('assets/world.webp')) e.currentTarget.src = localWorld; }} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /></div></div>
    <nav aria-label="Main navigation" style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: mobile ? '18px 20px' : '26px 40px' }}>
      <a href="#home" aria-label="Auragate home" onClick={() => setMenuOpen(false)} style={{ textDecoration: 'none' }}><Brand mobile={mobile} /></a>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><button onClick={demo} {...hoverButton} style={{ ...whiteButton, borderRadius: 999, padding: mobile ? '9px 16px' : '11px 22px', fontSize: mobile ? 12 : 13 }}>Watch Demo</button><button aria-label={menuOpen ? 'Close menu' : 'Open menu'} aria-expanded={menuOpen} aria-controls="navigation-menu" onClick={() => setMenuOpen(v => !v)} {...hoverButton} style={{ ...whiteButton, width: mobile ? 38 : 42, height: mobile ? 38 : 42, borderRadius: '50%', display: 'grid', placeItems: 'center' }}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d={menuOpen ? 'M6 6 18 18M6 18 18 6' : 'M5 9h14M5 15h14'} stroke="#161616" strokeWidth="1.6" strokeLinecap="round" /></svg></button></div>
      {menuOpen && <div id="navigation-menu" onKeyDown={e => { if (e.key === 'Escape') setMenuOpen(false); }} style={{ position: 'absolute', top: mobile ? 76 : 90, right: mobile ? 20 : 40, width: 220, display: 'flex', flexDirection: 'column', gap: 22, padding: 26, borderRadius: 22, background: 'rgba(20,12,18,.94)', backdropFilter: 'blur(18px)', border: '1px solid #ffffff25' }}>{[['How it works', '#home'], ['Features', '#wonders'], ['Contact', '#footer']].map(([label, href]) => <a key={label} href={href} style={linkStyle} onClick={() => setMenuOpen(false)}>{label}</a>)}</div>}
    </nav>
    <section id="home" ref={introRef} aria-label="Step into wonder" style={{ position: 'relative', zIndex: 5, height: '160vh' }}><div style={{ position: 'sticky', top: 0, height: '100vh', overflow: 'hidden' }}>
      <div ref={portalRef} data-testid="portal" style={{ position: 'absolute', inset: 0, transformOrigin: '52% 38%', willChange: 'transform', opacity: progress <= .66 ? 1 : clamp(1 - (progress - .66) / .22) }}><PortalFallback mobile={mobile} />{!portalFailed && <img src={PORTAL_BG} onError={() => setPortalFailed(true)} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />}</div>
      <div style={{ position: 'absolute', inset: 0, opacity: sceneOpacity, pointerEvents: sceneOpacity < .05 ? 'none' : 'auto' }}><div className="absolute inset-x-0 bottom-0 flex flex-col md:flex-row md:items-end md:justify-between gap-12 md:gap-20" style={{ padding: mobile ? '0 22px 40px' : '0 44px 52px', opacity: uiVisible ? 1 : 0, transform: `translateY(${uiVisible ? 0 : 24}px)`, transition: 'opacity 1s ease, transform 1s ease', transitionDelay: '.3s' }}>
        <div style={{ maxWidth: 560 }}><h1 style={{ margin: 0, fontWeight: 500, lineHeight: 1.04, letterSpacing: '-0.02em', fontSize: mobile ? 'clamp(30px,9vw,44px)' : 'clamp(40px,4vw,58px)' }}><span style={{ fontFamily: scriptFont, color: '#9a9a9a', fontSize: '1.15em', marginRight: '.12em' }}>Discover</span> Living<br />Digital Worlds<br />Vivid, Alive, Endless</h1><p style={{ fontWeight: 400, fontSize: mobile ? 13 : 14, lineHeight: 1.6, color: 'rgba(255,255,255,.5)', maxWidth: 340, margin: '18px 0 0' }}>Experience immersive worlds with stories that blur the line between imagination, AI and living reality made for you.</p></div>
        {!mobile && <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}><span style={{ fontFamily: scriptFont, fontSize: 64, lineHeight: .8 }}>A.</span><p style={{ fontWeight: 400, fontSize: 11, color: 'rgba(255,255,255,.5)', maxWidth: 150, lineHeight: 1.5, margin: 0 }}>A studio is a trusted partner in your journey through wonderland.</p></div>}
      </div></div>
    </div></section>
    <section id="wonders" style={{ position: 'relative', zIndex: 10, paddingTop: mobile ? '12vh' : '14vh', paddingBottom: 60, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <h2 style={{ margin: 0, fontWeight: 500, fontSize: 'clamp(34px,4vw,52px)', letterSpacing: '-0.02em', lineHeight: 1.1, textShadow: '0 2px 20px rgba(0,0,0,.35)', textAlign: 'center' }}>Real wonders.<br />Real worlds.</h2>
      <p style={{ fontWeight: 500, fontSize: 17, maxWidth: mobile ? 320 : 420, lineHeight: 1.5, textAlign: 'center', textShadow: '0 2px 16px rgba(0,0,0,.3)', margin: '16px 22px 0' }}>See how Auragate helps others, and find out what it can do for you.</p>
      <ArcCardCarousel mobile={mobile} />
      <footer id="footer" style={{ position: 'relative', width: '100%', padding: mobile ? '120px 22px 40px' : '160px 44px 52px' }}><div style={{ display: 'grid', gridTemplateColumns: mobile ? '1fr 1fr' : '1.4fr 1fr 1fr 1fr', gap: mobile ? '32px 20px' : 40, maxWidth: 1280, margin: '0 auto' }}>
        <div style={{ gridColumn: mobile ? '1 / -1' : 'auto' }}><Brand mobile={mobile} /><p style={{ color: 'rgba(255,255,255,.55)', fontSize: 12, margin: '15px 0 0' }}>© 2026 Auragate</p></div>
        {([['Explore', [['How it works', '#home'], ['Features', '#wonders']]], ['Contact', [['X (Twitter)', 'https://x.com/'], ['hello@auragate.com', 'mailto:hello@auragate.com']]], ['Legal', [['Privacy Policy', '#footer'], ['Terms of Service', '#footer']]]] as [string, string[][]][]).map(([title, links]) => <div key={title}><h3 style={{ margin: '0 0 18px', color: 'rgba(255,255,255,.55)', fontSize: 13, fontWeight: 500 }}>{title}</h3><div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>{links.map(([label, href]) => <a key={label} href={href} style={linkStyle} onMouseEnter={e => { e.currentTarget.style.opacity = '.65'; }} onMouseLeave={e => { e.currentTarget.style.opacity = '1'; }}>{label}</a>)}</div></div>)}
      </div></footer>
    </section>
  </main>;
}
createRoot(document.getElementById('root')!).render(<React.StrictMode><App /></React.StrictMode>);
