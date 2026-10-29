import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './style.css';

function Pipeline() {
  const pipeline = useRef<HTMLDivElement>(null);
  const nodeStack = useRef<HTMLButtonElement>(null);
  const nodeX = useRef<HTMLButtonElement>(null);
  const nodeShield = useRef<HTMLButtonElement>(null);
  const glowPath = useRef<SVGPathElement>(null);
  const corePath = useRef<SVGPathElement>(null);
  const gradient = useRef<SVGLinearGradientElement>(null);
  const splash = useRef<HTMLDivElement>(null);
  const restart = useRef(false);

  useEffect(() => {
    const stack = nodeStack.current!, x = nodeX.current!, shield = nodeShield.current!;
    const paths = [glowPath.current!, corePath.current!];
    const grad = gradient.current!, flash = splash.current!;
    const measure = () => {
      const parent = pipeline.current!.getBoundingClientRect();
      const centers = [stack, x, shield].map(node => {
        const rect = node.getBoundingClientRect();
        return `${rect.left + rect.width / 2 - parent.left},${rect.top + rect.height / 2 - parent.top}`;
      });
      paths.forEach(path => path.setAttribute('d', `M ${centers[0]} L ${centers[1]} L ${centers[2]}`));
    };
    measure();
    window.addEventListener('resize', measure);
    let state: 'p1' | 'splash' | 'p2' | 'idle' = 'p1';
    let lastStateChange = performance.now(), frame = 0;
    const visibility = (visible: boolean) => paths.forEach(path => { path.style.opacity = visible ? '1' : '0'; });
    const animate = (now: number) => {
      if (restart.current) {
        state = 'p1'; lastStateChange = now; restart.current = false;
        flash.classList.remove('animate'); shield.classList.remove('active'); visibility(true);
      }
      const elapsed = now - lastStateChange;
      const p = Math.min(elapsed / 800, 1);
      let percentage: number | undefined;
      if (state === 'p1') {
        percentage = p * 0.5;
        stack.classList.toggle('active', p < 0.4);
        if (elapsed >= 800) { state = 'splash'; lastStateChange = now; visibility(false); flash.classList.add('animate'); }
      } else if (state === 'splash') {
        if (elapsed >= 800) { state = 'p2'; lastStateChange = now; flash.classList.remove('animate'); visibility(true); }
      } else if (state === 'p2') {
        percentage = 0.5 + p * 0.5;
        shield.classList.toggle('active', p > 0.6);
        if (elapsed >= 800) { shield.classList.remove('active'); state = 'idle'; lastStateChange = now; }
      } else if (elapsed >= 1000) { state = 'p1'; lastStateChange = now; }
      if (percentage !== undefined) {
        const center = percentage * 100;
        grad.setAttribute('x1', `${center - 5}%`); grad.setAttribute('x2', `${center + 5}%`);
      }
      pipeline.current!.dataset.phase = state;
      frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => { cancelAnimationFrame(frame); window.removeEventListener('resize', measure); };
  }, []);

  return <div className="icon-pipeline" ref={pipeline} aria-label="Data passes through Xero encryption to secure protection">
    <svg className="beam-svg" aria-hidden="true">
      <defs>
        <filter id="glow"><feGaussianBlur stdDeviation="2" result="blur" /><feComposite in="SourceGraphic" in2="blur" operator="over" /></filter>
        <linearGradient id="beam-gradient" ref={gradient} gradientUnits="userSpaceOnUse" x1="-5%" x2="5%" y1="0%" y2="0%">
          <stop offset="0%" stopColor="#b04090" stopOpacity="0"/><stop offset="20%" stopColor="#b04090" stopOpacity="0.8"/>
          <stop offset="50%" stopColor="#fff" stopOpacity="1"/><stop offset="80%" stopColor="#c8a0e0" stopOpacity="0.8"/><stop offset="100%" stopColor="#c8a0e0" stopOpacity="0"/>
        </linearGradient>
      </defs>
      <path ref={glowPath} stroke="url(#beam-gradient)" strokeWidth="2" filter="url(#glow)" opacity="0.6" fill="none"/>
      <path ref={corePath} stroke="url(#beam-gradient)" strokeWidth="0.8" fill="none"/>
    </svg>
    <button className="icon-node node-light-right" id="node-stack" ref={nodeStack} aria-label="Replay data encryption" onClick={() => { restart.current = true; }}>
      <svg viewBox="0 0 24 24" aria-hidden="true"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>
    </button>
    <div className="pipeline-line"/>
    <div className="center-wrapper">
      <div className="splash" ref={splash}/>
      <button className="icon-node-center" id="node-x" ref={nodeX} aria-label="Replay Xero encryption" onClick={() => { restart.current = true; }}>
        <svg viewBox="0 0 40 40" aria-hidden="true"><path d="M4 4h10l6 9 6-9h10L25 20l11 16H26l-6-9-6 9H4l11-16L4 4Zm7 0h4l10 16-10 16h-4l10-16L11 4Zm14 0h4L19 20l10 16h-4L15 20 25 4Z" fillRule="evenodd"/></svg>
      </button>
    </div>
    <div className="pipeline-line right"/>
    <button className="icon-node node-light-left" id="node-shield" ref={nodeShield} aria-label="Replay secure protection" onClick={() => { restart.current = true; }}>
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/></svg>
    </button>
  </div>;
}

function Brands() {
  return <div className="brands" aria-label="Trusted by teams at">
    <div className="brand-item"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="10" fill="currentColor"/><path fill="var(--bg)" d="M8 9h8v2H8zm0 4h6v2H8z"/></svg>Expedia</div>
    <div className="brand-item"><svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><circle cx="12" cy="7" r="4"/><circle cx="5" cy="16" r="3.5"/><circle cx="19" cy="16" r="3.5"/></svg>asana</div>
    <div className="brand-item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><polyline points="4 8 20 8"/><polyline points="8 12 16 12"/><polyline points="4 16 20 16"/></svg>zenefits</div>
    <div className="brand-item"><svg viewBox="0 0 24 24" stroke="currentColor" fill="none" strokeWidth="1.5" aria-hidden="true"><circle cx="15.5" cy="8.5" r="2.5" fill="currentColor"/><circle cx="8.5" cy="8.5" r="2"/><path d="m10.5 8.5 2.5 0M15.5 11v6m0-3-6 5m6-8 5 5"/><circle cx="8" cy="20" r="1.5" fill="currentColor"/></svg><span>HubSp<span className="hubspot-dot"/>t</span></div>
    <div className="brand-item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 3v18M3 12h18M5.6 5.6l12.8 12.8M5.6 18.4 18.4 5.6"/></svg>loom</div>
  </div>;
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    const onKey = (event: KeyboardEvent) => { if (event.key === 'Escape') setMenuOpen(false); };
    const onResize = () => { if (window.innerWidth > 768) setMenuOpen(false); };
    window.addEventListener('keydown', onKey); window.addEventListener('resize', onResize);
    return () => { document.body.style.overflow = ''; window.removeEventListener('keydown', onKey); window.removeEventListener('resize', onResize); };
  }, [menuOpen]);
  return <>
    <nav aria-label="Main navigation">
      <span className="nav-logo">Xero</span>
      <button className={`menu-toggle${menuOpen ? ' active' : ''}`} aria-label={menuOpen ? 'Close menu' : 'Open menu'} aria-expanded={menuOpen} aria-controls="nav-menu" onClick={() => setMenuOpen(!menuOpen)}><span/><span/></button>
      <div className={`nav-menu${menuOpen ? ' active' : ''}`} id="nav-menu">
        <ul className="nav-links">{['Method', 'Pricing', 'Docs'].map(text => <li key={text}><a href="#" onClick={() => setMenuOpen(false)}>{text}</a></li>)}</ul>
        <div className="nav-actions"><a className="btn-login" href="#" onClick={() => setMenuOpen(false)}>Log in</a><a className="btn-signup" href="#" onClick={() => setMenuOpen(false)}>Sign up</a></div>
      </div>
    </nav>
    <section className="hero-card" aria-labelledby="hero-heading">
      <div className="hero-grid" aria-hidden="true"/>
      <Pipeline/>
      <div className="hero-content">
        <h1 className="hero-heading" id="hero-heading">The simple way<strong>encryption your data</strong></h1>
        <p className="hero-sub">Fully managed data encrypting service and annotation<br/>platform for teams of all industries.</p>
        <a href="#" className="btn-cta">Get Started</a>
      </div>
    </section>
    <Brands/>
  </>;
}

createRoot(document.getElementById('root')!).render(<React.StrictMode><App/></React.StrictMode>);
