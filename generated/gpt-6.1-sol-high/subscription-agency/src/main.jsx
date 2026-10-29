import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { ChevronUp, X, ArrowUpRight } from 'lucide-react';
import './styles.css';

const services = ['Brand Identity', 'App Development', 'Visual Design', 'Creative Video', 'Iconography'];
const companies = ['Airbnb', 'Shopify', 'Notion', 'Linear', 'Webflow', 'Figma', 'Slack', 'Stripe', 'Vercel', 'Framer'];
const destinations = ['Projects', 'Plans', 'Team', 'FAQs', 'Get in Touch'];
const slug = (text) => text.toLowerCase().replaceAll(' ', '-');
const destinationCopy = {
  Projects: ['Thoughtful work. Lasting impact.', 'Our project collection will be available soon.'],
  Plans: ['A flexible design partnership.', 'Plan details will be available soon.'],
  Team: ['Premium creative, alwayzz.', 'Meet the team here soon.'],
  FAQs: ['A little more clarity.', 'Answers to common questions will be available soon.'],
  'Get in Touch': ['Chat for 15 minutes.', 'Booking availability will be added soon.'],
};

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [destination, setDestination] = useState(null);
  const menu = useRef(null);
  const menuButton = useRef(null);
  const dialog = useRef(null);
  const lastTrigger = useRef(null);

  useEffect(() => {
    document.body.style.overflow = menuOpen || destination ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen, destination]);

  useEffect(() => {
    if (!menuOpen) return;
    const first = menu.current.querySelector('a');
    const focusTimer = setTimeout(() => first.focus(), 80);
    const handleKey = (event) => {
      if (event.key === 'Escape') {
        setMenuOpen(false);
        menuButton.current.focus();
      }
      if (event.key === 'Tab') {
        const items = [menuButton.current, ...menu.current.querySelectorAll('a')];
        const current = items.indexOf(document.activeElement);
        event.preventDefault();
        items[(current + (event.shiftKey ? -1 : 1) + items.length) % items.length].focus();
      }
    };
    document.addEventListener('keydown', handleKey);
    return () => { clearTimeout(focusTimer); document.removeEventListener('keydown', handleKey); };
  }, [menuOpen]);

  useEffect(() => {
    if (destination) dialog.current.showModal();
    else if (dialog.current.open) dialog.current.close();
  }, [destination]);

  function openDestination(event, name) {
    event.preventDefault();
    lastTrigger.current = menuOpen ? menuButton.current : event.currentTarget;
    setMenuOpen(false);
    setDestination(name);
  }

  function closeDestination() {
    setDestination(null);
    lastTrigger.current?.focus();
  }

  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <header className="navbar">
        <div className="nav-inner">
          <a className="logo" href="#" aria-label="Alwayzz home" onClick={() => setMenuOpen(false)}>Alwayzz<span>®</span></a>
          <button ref={menuButton} className={`menu-button ${menuOpen ? 'is-open' : ''}`} aria-expanded={menuOpen} aria-controls="navigation" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? 'Close' : 'Menu'}<ChevronUp size={16} aria-hidden="true" />
          </button>
        </div>
      </header>
      <div id="navigation" ref={menu} className={`drawer ${menuOpen ? 'visible' : ''}`} inert={!menuOpen} aria-hidden={!menuOpen}>
        <nav aria-label="Main navigation">
          {destinations.map((name, i) => <a key={name} href={`#${slug(name)}`} onClick={(e) => openDestination(e, name)}><span className="nav-number">0{i + 1}</span>{name}<ArrowUpRight aria-hidden="true" /></a>)}
        </nav>
        <div className="drawer-footer"><span>© {new Date().getFullYear()} Alwayzz</span><span>Premium creative. On demand.</span></div>
      </div>
      <main id="main" inert={menuOpen}>
        <section className="hero" aria-labelledby="hero-title">
          <div className="curve-field curves-left" aria-hidden="true">{Array.from({length: 20}, (_, i) => <span key={i} style={{width: `${60 + i * 10}px`, animationDelay: `${i * .25}s`}} />)}</div>
          <div className="curve-field curves-right" aria-hidden="true">{Array.from({length: 20}, (_, i) => <span key={i} style={{width: `${60 + i * 10}px`, animationDelay: `${i * .25}s`}} />)}</div>
          <div className="curves-top" aria-hidden="true">{Array.from({length: 20}, (_, i) => <span key={i} style={{height: `${60 + i * 10}px`, animationDelay: `${i * .25}s`}} />)}</div>
          <div className="hero-content">
            <div className="service-marquee marquee" aria-label={services.join(', ')}>
              <div className="marquee-track" aria-hidden="true">{Array.from({length: 4}, (_, i) => <div className="service-group" key={i}>{services.map(service => <span key={service}>{service}</span>)}</div>)}</div>
            </div>
            <h1 id="hero-title">Premium creative <span className="serif">alwayzz</span><sup>®</sup> on demand.</h1>
            <p className="subtitle">A flexible design partnership for founders, brands, and agencies who want top craft delivered on their timeline.</p>
            <div className="cta-row">
              <a className="primary-button" href="#plans" onClick={(e) => openDestination(e, 'Plans')}>View Plans</a>
              <a className="book-button" href="#get-in-touch" onClick={(e) => openDestination(e, 'Get in Touch')}>
                <img src={`${import.meta.env.BASE_URL}assets/avatar.png`} alt="" width="40" height="40" />
                <span className="book-text"><span>Chat for 15 minutes</span><span className="availability"><i />Pick a slot</span></span>
              </a>
            </div>
          </div>
          <div className="progressive-blur" aria-hidden="true" />
        </section>
        <section className="trusted" aria-label="Trusted by leading companies">
          <p>Partnered with top-tier companies globally</p>
          <div className="company-marquee marquee" aria-label={companies.join(', ')}>
            <div className="marquee-track" aria-hidden="true">{Array.from({length: 4}, (_, i) => <div className="company-group" key={i}>{companies.map(company => <span className={`company company-${company.toLowerCase()}`} key={company}>{company === 'Vercel' && <b className="vercel-mark" />}{company === 'Linear' && <b className="linear-mark" />}{company}</span>)}</div>)}</div>
          </div>
        </section>
      </main>
      <dialog ref={dialog} className="destination-dialog" onCancel={(e) => { e.preventDefault(); closeDestination(); }} onClick={(e) => { if(e.target === e.currentTarget) closeDestination(); }} onClose={() => setDestination(null)} aria-labelledby="dialog-title" aria-describedby="dialog-description">
        <button className="dialog-close" aria-label="Close dialog" onClick={closeDestination}><X size={20} /></button>
        <span className="dialog-label">{destination}</span>
        <h2 id="dialog-title">{destination && destinationCopy[destination][0]}</h2>
        <p id="dialog-description">{destination && destinationCopy[destination][1]}</p>
        <button className="primary-button" onClick={closeDestination}>Back to Alwayzz</button>
      </dialog>
    </>
  );
}

createRoot(document.getElementById('root')).render(<App />);
