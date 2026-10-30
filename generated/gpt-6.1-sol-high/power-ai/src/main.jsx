import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { ChevronDown, Menu, X, ArrowUpRight } from 'lucide-react';
import '@fontsource/geist-sans/400.css';
import '@fontsource/geist-sans/500.css';
import '@fontsource/geist-sans/600.css';
import logo from './assets/logo.png';
import './index.css';

const brands = ['Vortex', 'Nimbus', 'Prysma', 'Cirrus', 'Kynder', 'Halcyn'];
const information = {
  Features: { title: 'Intelligence at every step.', text: 'Explore the power of AI in talent acquisition.', items: ['Discover talent', 'Understand potential', 'Connect with confidence'] },
  Solutions: { title: 'Built around your talent.', text: 'Power AI brings intelligence to your talent acquisition journey.', items: ['Talent acquisition teams', 'Recruiting leaders', 'Growing organizations'] },
  Plans: { title: 'Find your fit.', text: 'Talk with us about a plan for your team.', items: ['Schedule a Consult'] },
  Learning: { title: 'A new perspective on talent.', text: 'Explore what AI can bring to talent acquisition.', items: ['AI in recruiting', 'The future of talent', 'Getting started'] },
};

function BackgroundVideo() {
  const ref = useRef(null);
  useEffect(() => {
    const video = ref.current;
    let frame, timer, disposed = false;
    const animate = () => {
      if (Number.isFinite(video.duration) && video.duration > 0) {
        video.style.opacity = String(Math.max(0, Math.min(1, video.currentTime / 0.5, (video.duration - video.currentTime) / 0.5)));
      }
      frame = requestAnimationFrame(animate);
    };
    const restart = () => {
      video.style.opacity = '0';
      timer = setTimeout(() => { if (!disposed) { video.currentTime = 0; video.play().catch(() => {}); } }, 100);
    };
    video.addEventListener('ended', restart);
    frame = requestAnimationFrame(animate);
    video.play().catch(() => {});
    return () => { disposed = true; cancelAnimationFrame(frame); clearTimeout(timer); video.removeEventListener('ended', restart); };
  }, []);
  return <video ref={ref} className="background-video" autoPlay muted playsInline preload="auto" aria-hidden="true"><source src={`${import.meta.env.BASE_URL}assets/power-ai.mp4`} type="video/mp4" /></video>;
}

function App() {
  const [active, setActive] = useState(null);
  const [mobile, setMobile] = useState(false);
  const [modal, setModal] = useState(null);
  const navRef = useRef(null);
  const dialogRef = useRef(null);
  useEffect(() => {
    const close = e => { if (!navRef.current?.contains(e.target)) { setActive(null); setMobile(false); } };
    const key = e => { if (e.key === 'Escape') { setActive(null); setMobile(false); } };
    document.addEventListener('pointerdown', close); document.addEventListener('keydown', key);
    return () => { document.removeEventListener('pointerdown', close); document.removeEventListener('keydown', key); };
  }, []);
  useEffect(() => { if (modal) dialogRef.current?.showModal(); }, [modal]);
  const openModal = type => { setActive(null); setMobile(false); setModal(type); };
  return <div className="page-shell">
    <BackgroundVideo />
    <section className="hero" aria-label="Power AI">
      <div className="hero-blur" aria-hidden="true" />
      <header className="header" ref={navRef}>
        <nav className="navbar" aria-label="Main navigation">
          <a href={import.meta.env.BASE_URL} className="brand" aria-label="Power AI home"><img src={logo} alt="Power AI" height="32" width="124" /></a>
          <div className={`nav-links ${mobile ? 'is-open' : ''}`}>
            {Object.keys(information).map(item => <button key={item} className={`nav-item ${active === item ? 'active' : ''}`} aria-expanded={active === item} aria-controls="nav-panel" onClick={() => setActive(active === item ? null : item)}>{item}{['Features', 'Learning'].includes(item) && <ChevronDown size={14} strokeWidth={1.5} />}</button>)}
          </div>
          <div className="nav-actions"><button className="hero-secondary signup" onClick={() => openModal('signup')}>Sign Up</button><button className="menu-toggle" aria-label={mobile ? 'Close menu' : 'Open menu'} aria-expanded={mobile} onClick={() => { setMobile(!mobile); setActive(null); }}>{mobile ? <X size={22} /> : <Menu size={22} />}</button></div>
        </nav>
        <div className="header-divider" />
        {active && <div className="nav-panel liquid-glass" id="nav-panel"><div><p className="eyebrow">{active}</p><h2>{information[active].title}</h2><p>{information[active].text}</p></div><ul>{information[active].items.map(item => <li key={item}>{item === 'Schedule a Consult' ? <button onClick={() => openModal('consult')}>{item}<ArrowUpRight size={16} /></button> : item}</li>)}</ul></div>}
      </header>
      <main className="hero-main">
        <div className="hero-copy">
          <h1>Power <span>AI</span></h1>
          <p className="subtitle">The most powerful AI ever deployed<br className="desktop-break" /> in talent acquisition</p>
          <button className="hero-secondary consult" onClick={() => openModal('consult')}>Schedule a Consult</button>
        </div>
      </main>
      <footer className="brands">
        <p className="brands-label">Relied on by brands<br /> across the globe</p>
        <div className="marquee" aria-label="Trusted by Vortex, Nimbus, Prysma, Cirrus, Kynder and Halcyn">
          <div className="marquee-track">{[0, 1].map(copy => <div className="marquee-group" aria-hidden={copy === 1 ? true : undefined} key={copy}>{brands.map(name => <div className="client-logo" key={name}><span className="client-icon liquid-glass">{name[0]}</span><span>{name}</span></div>)}</div>)}</div>
        </div>
      </footer>
    </section>
    <dialog ref={dialogRef} className="action-dialog" onClose={() => setModal(null)} onClick={e => { if (e.target === dialogRef.current) dialogRef.current.close(); }}>
      <button className="dialog-close" aria-label="Close dialog" onClick={() => dialogRef.current.close()}><X size={20} /></button>
      <p className="eyebrow">Power AI</p>
      <h2>{modal === 'consult' ? 'Let’s talk talent.' : 'Your next chapter starts here.'}</h2>
      <p>{modal === 'consult' ? 'Discover what Power AI can do for your team. Consultation scheduling will be available soon.' : 'Meet the future of talent acquisition. Sign up will be available soon.'}</p>
      <button className="hero-secondary" onClick={() => dialogRef.current.close()}>Back to Power AI</button>
    </dialog>
  </div>;
}

createRoot(document.getElementById('root')).render(<App />);
