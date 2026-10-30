import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, X } from 'lucide-react';
import './style.css';

const links = ['Home', 'About Us', 'Services', 'Projects', 'Contact'];
const brands = ['Opensense', 'DKNY', 'Under Armour', 'LIU·JO', 'ATOM', 'ECCO', 'ORUM'];
const slug = (label) => label.toLowerCase().replaceAll(' ', '-');

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [progress, setProgress] = useState(false);
  const [selected, setSelected] = useState('Home');
  const menuRef = useRef(null);
  const returnFocus = useRef(null);
  const focusLink = useRef(null);
  const mainRef = useRef(null);
  useEffect(() => {
    const timeout = setTimeout(() => setProgress(true), 500);
    return () => clearTimeout(timeout);
  }, []);
  useEffect(() => {
    if (!menuOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const focusTimer = setTimeout(() => {
      (focusLink.current ? menuRef.current?.querySelector(`[data-link="${focusLink.current}"]`) : menuRef.current?.querySelector('button'))?.focus();
    }, 100);
    const keyboard = (event) => {
      if (event.key === 'Escape') setMenuOpen(false);
      if (event.key !== 'Tab') return;
      const elements = menuRef.current?.querySelectorAll('button, a[href]');
      if (!elements?.length) return;
      const first = elements[0], last = elements[elements.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    document.addEventListener('keydown', keyboard);
    return () => {
      clearTimeout(focusTimer);
      document.body.style.overflow = previous;
      document.removeEventListener('keydown', keyboard);
      returnFocus.current?.focus();
    };
  }, [menuOpen]);
  const openMenu = (event, label) => {
    returnFocus.current = event.currentTarget;
    focusLink.current = label || null;
    setMenuOpen(true);
  };
  return <>
    <div className="hero" ref={mainRef} inert={menuOpen ? true : undefined}>
      <video className="landscape" autoPlay muted loop playsInline preload="auto" aria-hidden="true">
        <source src={`${import.meta.env.BASE_URL}assets/evr-landscape.mp4`} type="video/mp4" />
      </video>
      <header className="navigation">
        <button className="pill menu-toggle" onClick={openMenu} aria-expanded={menuOpen} aria-controls="full-menu">
          <span className="hamburger" aria-hidden="true"><span /><span /></span><span>Menu</span>
        </button>
        <a className="logo" href="#home" aria-label="EVR Ventures home">EVR</a>
        <nav className="nav-actions" aria-label="Quick navigation">
          <button className="pill" onClick={event => openMenu(event, 'About Us')}>About Us</button>
          <button className="pill" onClick={event => openMenu(event, 'Services')}>Services</button>
          <button className="pill cta" onClick={event => openMenu(event, 'Contact')}>Get Started</button>
        </nav>
      </header>
      <main className="main-content" id="home">
        <div className="eyebrow"><ArrowRight size={16} strokeWidth={1.5} /><span>Evolve Responsible Ventures</span></div>
        <div className="content-row">
          <h1><span>Navigating the</span><span>route to impactful</span><span className="display">regeneration</span></h1>
          <div className="stats">
            <div className="progress" role="img" aria-label="75 percent environmental performance progress">
              <svg viewBox="0 0 120 120" aria-hidden="true">
                <circle className="progress-track" cx="60" cy="60" r="54" />
                <circle className={`progress-fill ${progress ? 'complete' : ''}`} cx="60" cy="60" r="54" />
              </svg><span>75%</span>
            </div>
            <p>Guiding organizations toward lasting environmental performance through actionable strategy and measurable outcomes</p>
          </div>
        </div>
      </main>
      <footer className="partners" aria-label="Our partners">
        <div className="partners-labels"><span>Our Partners</span><span>Backed by 30+ global brands</span></div>
        <div className="marquee"><div className="marquee-track">{[0,1].map(copy => <div className="brand-group" key={copy} aria-hidden={copy === 1 ? true : undefined}>{brands.map(brand => <span key={brand}>{brand}</span>)}</div>)}</div></div>
      </footer>
    </div>
    <AnimatePresence>
      {menuOpen && <motion.div id="full-menu" className="full-menu" ref={menuRef} role="dialog" aria-modal="true" aria-label="Main navigation"
        initial={{ clipPath: 'circle(0% at 80px 40px)' }} animate={{ clipPath: 'circle(150% at 80px 40px)' }} exit={{ clipPath: 'circle(0% at 80px 40px)' }} transition={{ duration: .7, ease: [.76, 0, .24, 1] }}>
        <div className="navigation menu-header"><button className="pill menu-toggle" onClick={() => setMenuOpen(false)} aria-label="Close menu"><X size={28} strokeWidth={1.4}/><span>Close</span></button><span className="logo">EVR</span></div>
        <nav className="menu-links" aria-label="Main navigation">{links.map((label, i) => <motion.a
          key={label} href={`#${slug(label)}`} data-link={label} aria-current={selected === label ? 'page' : undefined}
          onClick={() => { setSelected(label); setMenuOpen(false); }}
          initial={{ opacity: 0, x: -60 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: .15 + i * .08, duration: .6, ease: [.25, 1, .5, 1] }}>
          <span>{label}</span><ArrowRight strokeWidth={1} aria-hidden="true" />
        </motion.a>)}</nav>
        <div className="menu-footer"><span>Evolve Responsible Ventures</span><span>© 2026</span></div>
      </motion.div>}
    </AnimatePresence>
  </>;
}

createRoot(document.getElementById('root')).render(<App />);
