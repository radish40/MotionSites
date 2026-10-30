import { useEffect, useRef, useState } from 'react';

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [yearly, setYearly] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    let direction = 1;
    let currentTarget = 0;
    let seekPending = false;
    let lastTs = 0;
    let rafId = 0;

    const doSeek = () => {
      if (video.seeking) { seekPending = true; return; }
      seekPending = false;
      video.currentTime = currentTarget;
    };
    const step = (ts: number) => {
      if (direction !== -1) return;
      // Begin inside the last frame: seeking to the exact duration can stall a decoder.
      const dt = lastTs ? (ts - lastTs) / 1000 : 1 / 60;
      lastTs = ts;
      currentTarget -= dt;
      if (currentTarget <= 0) {
        direction = 1;
        video.currentTime = 0;
        void video.play().catch(() => {});
        return;
      }
      doSeek();
      rafId = requestAnimationFrame(step);
    };
    const onEnded = () => {
      cancelAnimationFrame(rafId);
      direction = -1;
      currentTarget = video.duration;
      seekPending = false;
      lastTs = 0;
      rafId = requestAnimationFrame(step);
    };
    const onSeeked = () => {
      if (direction === -1 && seekPending) doSeek();
    };
    video.addEventListener('ended', onEnded);
    video.addEventListener('seeked', onSeeked);
    return () => {
      cancelAnimationFrame(rafId);
      video.removeEventListener('ended', onEnded);
      video.removeEventListener('seeked', onSeeked);
    };
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    closeButtonRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMenuOpen(false);
        menuButtonRef.current?.focus();
      }
      if (event.key === 'Tab') {
        const items = Array.from(document.querySelectorAll<HTMLElement>('.c3-nav a, .c3-nav-close'));
        const first = items[0];
        const last = items[items.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [menuOpen]);

  const plans = [
    { tier: 'Free', price: 'Free', desc: 'For creators taking their first steps with Forma.', items: ['Up to 3 projects in the cloud', 'Image export up to 1080p', 'Basic editing tools', 'Free templates and icons', 'Access via web and mobile app'] },
    { tier: 'Standard', price: yearly ? '$99,99/y' : '$9,99/m', desc: 'For freelancers and small teams who need more freedom and flexibility.', items: ['Up to 50 projects in the cloud', 'Export up to 4K', 'Advanced editing toolkit', 'Team collaboration (up to 5 members)', 'Access to premium template library'] },
    { tier: 'Pro', price: yearly ? '$199,99/y' : '$19,99/m', desc: 'For studios, agencies, and professional creators working with brands.', items: ['Unlimited projects', 'Export up to 8K + animations', 'AI-powered content generation tools', 'Unlimited team members', 'Brand customization'] },
  ];

  return (
    <div className="c3-page" id="home">
      <video className="c3-video" ref={videoRef} src={`${import.meta.env.BASE_URL}assets/forma-background.mp4`} autoPlay muted playsInline preload="auto" aria-hidden="true" />
      <svg className="c3-filter" aria-hidden="true"><defs>
        <filter id="c3-noise">
          <feTurbulence type="fractalNoise" baseFrequency="0.5" numOctaves="2" result="noise" />
          <feComponentTransfer in="noise" result="faded"><feFuncA type="linear" slope="0.075" /></feComponentTransfer>
          <feComposite in="faded" in2="SourceGraphic" operator="in" result="clipped" />
          <feBlend in="SourceGraphic" in2="clipped" mode="overlay" />
        </filter>
      </defs></svg>
      <header className="c3-header">
        <a className="c3-logo" href="#home" aria-label="Forma AI home"><img src={`${import.meta.env.BASE_URL}assets/logo.svg`} alt="Forma AI" width="32" height="32" /></a>
        <nav id="c3-navigation" className={`c3-nav${menuOpen ? ' active' : ''}`} aria-label="Main navigation">
          <button ref={closeButtonRef} className="c3-nav-close" aria-label="Close menu" onClick={() => { setMenuOpen(false); menuButtonRef.current?.focus(); }}><span /><span /></button>
          {['Home', 'Pricing', 'FAQ', 'Contact'].map(item => <a key={item} href={`#${item.toLowerCase()}`} className={item === 'Pricing' ? 'c3-active-link' : undefined} aria-current={item === 'Pricing' ? 'page' : undefined} onClick={() => setMenuOpen(false)}>{item}</a>)}
          <a className="c3-nav-btn" href="#download" onClick={() => setMenuOpen(false)}>Download</a>
        </nav>
        <button ref={menuButtonRef} className="c3-hamburger" aria-label="Open menu" aria-expanded={menuOpen} aria-controls="c3-navigation" onClick={() => setMenuOpen(true)}><span /><span /><span /></button>
      </header>
      <main className="c3-main" id="pricing">
        <div className="c3-watermark-container">
          <div className="c3-watermark-top">Forma AI</div>
          <h1 className="c3-watermark-main">Pricing</h1>
        </div>
        <div className="c3-grid">
          {plans.map(plan => <article key={plan.tier} className={`c3-card${plan.tier === 'Pro' ? ' c3-card-pro' : ''}`} aria-label={`${plan.tier} plan`}>
            <h2 className="c3-tier-small">{plan.tier}</h2>
            <div className="c3-tier-large" aria-live="polite">{plan.price}</div>
            <p className="c3-desc">{plan.desc}</p>
            <ul className="c3-list">{plan.items.map(item => <li key={item}><span className="c3-check"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M20 6L9 17l-5-5" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" /></svg></span><span>{item}</span></li>)}</ul>
            <button className="c3-btn" aria-label={`Choose ${plan.tier} plan`}>Choose Plan</button>
          </article>)}
        </div>
        <div className="c3-toggle-wrap">
          <button className={`c3-toggle${yearly ? ' active' : ''}`} role="switch" aria-checked={yearly} aria-label="Yearly billing" onClick={() => setYearly(value => !value)}><span /></button>
          <span className="c3-toggle-label" onClick={() => setYearly(value => !value)}>Yearly</span>
        </div>
      </main>
    </div>
  );
}
