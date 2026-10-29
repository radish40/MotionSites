import { useState, useEffect, useRef } from 'react';
import { Zap } from 'lucide-react';

const LIGHT_IMG = `${import.meta.env.BASE_URL}images/hero-light.webp`;
const DARK_IMG = `${import.meta.env.BASE_URL}images/hero-dark.webp`;

export default function App() {
  const [isDark, setIsDark] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const bgFrontRef = useRef<HTMLDivElement>(null);
  const bgBackRef = useRef<HTMLDivElement>(null);
  const animatingRef = useRef(false);

  useEffect(() => {
    document.body.classList.toggle('light-theme', !isDark);
  }, [isDark]);

  useEffect(() => {
    if (bgFrontRef.current) bgFrontRef.current.style.backgroundImage = `url(${DARK_IMG})`;
    if (bgBackRef.current) bgBackRef.current.style.backgroundImage = `url(${DARK_IMG})`;
    // Preload the second local photo so the first transition is immediate.
    const photo = new Image();
    photo.src = LIGHT_IMG;
  }, []);

  function toggleTheme(toDark: boolean) {
    if (toDark === isDark || animatingRef.current) return;
    animatingRef.current = true;
    const targetImage = toDark ? DARK_IMG : LIGHT_IMG;
    if (bgBackRef.current) bgBackRef.current.style.backgroundImage = `url(${targetImage})`;
    bgFrontRef.current?.classList.add('pull-down');
    window.setTimeout(() => {
      setIsDark(toDark);
      if (bgFrontRef.current) bgFrontRef.current.style.backgroundImage = `url(${targetImage})`;
      window.setTimeout(() => {
        bgFrontRef.current?.classList.remove('pull-down');
        animatingRef.current = false;
      }, 30);
    }, 300);
  }

  return (
    <div className="hero">
      <div className="blur-overlay blur-overlay-top" />
      <div className="blur-overlay blur-overlay-bottom" />
      <div className="hero-bg-wrapper" aria-hidden="true">
        <div ref={bgBackRef} className="hero-bg bg-back" />
        <div ref={bgFrontRef} className="hero-bg bg-front" />
      </div>
      <nav className="navbar" aria-label="Main navigation">
        <div className="logo-container">
          <Zap className="logo" size={32} strokeWidth={2} />
          <span className="brand-name">reposit</span>
        </div>
        <div id="navigation-links" className={`nav-links${menuOpen ? ' active' : ''}`}>
          <a href="#">How It Works</a>
          <a href="#">Our Cases</a>
          <a href="#">About Us</a>
          <a href="#">Careers</a>
          <a href="#">Resources</a>
          <a href="#">Customers</a>
          <button className="cta-button drawer-cta">Get an Instant Quote</button>
        </div>
        <button className="cta-button nav-cta">Get an Instant Quote</button>
        <div className={`hamburger${menuOpen ? ' active' : ''}`} role="button" tabIndex={0}
          aria-label={menuOpen ? 'Close navigation' : 'Open navigation'} aria-expanded={menuOpen}
          aria-controls="navigation-links" onClick={() => setMenuOpen(!menuOpen)}
          onKeyDown={event => {
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault();
              setMenuOpen(!menuOpen);
            }
            if (event.key === 'Escape') setMenuOpen(false);
          }}>
          <span /><span /><span />
        </div>
      </nav>
      <div className="hero-content">
        <h1 className="hero-title">$0 Electricity Bills<br /><span className="title-accent">for the next</span>{' '}7 years</h1>
        <div className="theme-toggle" role="group" aria-label="Time of day">
          <div className="toggle-indicator" style={{ transform: isDark ? 'translateX(calc(100% + 4px))' : 'translateX(0)' }} />
          <button className={`toggle-btn${!isDark ? ' active' : ''}`} aria-pressed={!isDark} onClick={() => toggleTheme(false)}>
            <span className="label">Morning</span><span className="subtext">$0 for Electricity</span>
          </button>
          <button className={`toggle-btn${isDark ? ' active' : ''}`} aria-pressed={isDark} onClick={() => toggleTheme(true)}>
            <span className="label">Night</span><span className="subtext">$0 for Electricity</span>
          </button>
        </div>
        <p className="hero-footer">Forget the energy market, weather conditions and seasons; our Smart Controller guarantees you get no electricity bill for seven years.</p>
      </div>
    </div>
  );
}
