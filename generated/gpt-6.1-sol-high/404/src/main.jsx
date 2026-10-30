import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './fonts.css';
import './styles.css';

const base = import.meta.env.BASE_URL;
const links = [['Our Team', 'team'], ['Solutions', 'solutions'], ['Showcase', 'showcase'], ['News', 'news']];
function Connect({ onClick }) {
  return <a className="connect inline-flex items-center" href={`${base}contact`} onClick={onClick}>
    <span className="connect-arrow flex items-center justify-center" aria-hidden="true"><svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="m9 5 7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg></span>
    <span>Let's Connect</span>
  </a>;
}
function Card({ title, subtitle, home }) {
  return <a className="nav-card group flex items-center justify-between" href={home ? base : `${base}showcase`}>
    <span className="flex items-center card-content">
      <span className="card-icon flex items-center justify-center" aria-hidden="true"><svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">{home ? <><path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H5a1 1 0 01-1-1V9.5z"/><path d="M9 21V12h6v9" fill="white"/></> : <><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="3.5" fill="white"/></>}</svg></span>
      <span className="card-copy"><span className="card-title block">{title}</span><span className="card-subtitle block">{subtitle}</span></span>
    </span><span className="card-chevron" aria-hidden="true">›</span>
  </a>;
}
function App() {
  const [open, setOpen] = useState(false);
  const menu = useRef(null);
  const toggle = useRef(null);
  useEffect(() => {
    if (!open) return;
    const first = menu.current.querySelector('a');
    first?.focus();
    const onKey = e => {
      if (e.key === 'Escape') { setOpen(false); toggle.current.focus(); }
      if (e.key === 'Tab') {
        const items = [toggle.current, ...menu.current.querySelectorAll('a')];
        const index = items.indexOf(document.activeElement);
        e.preventDefault(); items[(index + (e.shiftKey ? -1 : 1) + items.length) % items.length].focus();
      }
    };
    const onResize = () => { if (window.innerWidth > 768) setOpen(false); };
    document.addEventListener('keydown', onKey);
    window.addEventListener('resize', onResize);
    return () => { document.removeEventListener('keydown', onKey); window.removeEventListener('resize', onResize); };
  }, [open]);
  return <>
    <header className="navbar flex items-center justify-between">
      <a className="brand inline-flex items-center" href={base} aria-label="nexto. home"><img src={`${base}assets/logo.svg`} alt="" width="28" height="28"/><span>nexto.</span></a>
      <nav className="desktop-links flex items-center" aria-label="Main navigation">{links.map(([label, path]) => <a key={path} href={`${base}${path}`}>{label}{path === 'solutions' && <span className="dropdown" aria-hidden="true">⌄</span>}</a>)}</nav>
      <div className="desktop-cta"><Connect/></div>
      <button ref={toggle} className={`hamburger ${open ? 'active' : ''}`} type="button" aria-label={open ? 'Close navigation' : 'Open navigation'} aria-expanded={open} aria-controls="mobile-menu" onClick={() => setOpen(!open)}><span/><span/><span/></button>
    </header>
    <nav ref={menu} id="mobile-menu" className={`mobile-menu ${open ? 'is-open' : ''}`} aria-label="Mobile navigation" inert={!open} aria-hidden={!open}>{links.map(([label, path]) => <a key={path} href={`${base}${path}`} onClick={() => setOpen(false)}>{label}{path === 'solutions' && <span className="dropdown" aria-hidden="true">⌄</span>}</a>)}<Connect onClick={() => setOpen(false)}/></nav>
    <main className="main flex flex-col items-center justify-center" inert={open}>
      <section className="hero text-center" aria-labelledby="page-title">
        <p className="lost-text">Seems you've wandered off...</p>
        <div className="title-wrapper"><span className="material-symbols-rounded decoration cloud" aria-hidden="true">cloud</span><h1 id="page-title">Whoops! Nothing here yet</h1><span className="material-symbols-rounded decoration heart" aria-hidden="true">favorite</span></div>
        <p className="subtext">Grab a 30-minute <span className="highlight">chat</span> to explore your ideas, scope, and vision. We'll find common ground, sync and <span className="highlight">define</span> a clear roadmap.</p>
      </section>
      <nav className="navigation-cards flex flex-col" aria-label="Find your way"><Card title="Main Page" subtitle="Back where it all begins..." home/><Card title="Showcase" subtitle="Where we walk the walk"/></nav>
    </main>
  </>;
}
createRoot(document.getElementById('root')).render(<App/>);
