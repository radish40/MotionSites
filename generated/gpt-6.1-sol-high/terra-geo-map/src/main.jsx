import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Menu, X } from 'lucide-react';
import './styles.css';

const menus = {
  Product: [['Map builder', 'Bring your world into focus.'], ['Spatial intelligence', 'See the story behind every location.']],
  Solutions: [['For teams', 'Design and collaborate in one place.'], ['For your next project', 'Turn location data into shared insight.']],
  Resources: [['See Terra in action', 'Explore the map builder preview.'], ['Getting started', 'Your next map starts here.']],
};
function Chevron() { return <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m6 9 6 6 6-6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>; }
function Selection() {
  return <svg className="selection" viewBox="0 0 200 95" preserveAspectRatio="none" aria-hidden="true">
    <path d="M5 5 L195 5 L195 88 L5 72 Z" fill="none" stroke="#B0B0B0" strokeWidth="1.2" strokeDasharray="6 4" />
    {[[5,5],[195,5],[5,72],[195,88]].map(([cx,cy])=><circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="3.5" fill="#B0B0B0" />)}
    {[[100,5],[100,80],[5,38.5],[195,46.5]].map(([cx,cy])=><circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="3" fill="#B0B0B0" />)}
  </svg>;
}
function App() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdown, setDropdown] = useState(null);
  const [dialog, setDialog] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const dialogRef = useRef(null);
  const navRef = useRef(null);
  const videoRef = useRef(null);
  const triggerRef = useRef(null);
  useEffect(() => {
    function close(e) { if (navRef.current && !navRef.current.contains(e.target)) setDropdown(null); }
    function escape(e) { if (e.key === 'Escape') { setDropdown(null); setMobileOpen(false); } }
    document.addEventListener('pointerdown', close);
    document.addEventListener('keydown', escape);
    return () => { document.removeEventListener('pointerdown', close); document.removeEventListener('keydown', escape); };
  }, []);
  useEffect(() => { if (dialog) dialogRef.current.showModal(); }, [dialog]);
  function openDialog(type, event) { triggerRef.current = event.currentTarget; setSubmitted(false); setDialog(type); setMobileOpen(false); setDropdown(null); }
  function closeDialog() { dialogRef.current.close(); setDialog(null); triggerRef.current?.focus(); }
  function showDemo() {
    setMobileOpen(false); setDropdown(null);
    document.getElementById('map-preview').scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'center' });
    videoRef.current.controls = true;
    videoRef.current.play().catch(() => {});
  }
  function navItems() { return <>
    {Object.entries(menus).map(([name, items]) => <div className="nav-item" key={name}>
      <button className="nav-link" aria-expanded={dropdown === name} aria-controls={`menu-${name}`} onClick={() => setDropdown(dropdown === name ? null : name)}>{name}<Chevron /></button>
      {dropdown === name && <div className="nav-popover" id={`menu-${name}`}>{items.map(([title, description]) => <button key={title} onClick={showDemo}><strong>{title}</strong><span>{description}</span></button>)}</div>}
    </div>)}
    <button className="nav-link" onClick={showDemo}>Examples</button>
    <div className="nav-item"><button className="nav-link" aria-expanded={dropdown === 'Pricing'} onClick={() => setDropdown(dropdown === 'Pricing' ? null : 'Pricing')}>Pricing</button>
      {dropdown === 'Pricing' && <div className="nav-popover pricing-popover"><strong>Start with your next map.</strong><p>Explore what you can build with Terra.</p><button onClick={showDemo}>See Terra in action <span aria-hidden="true">↗</span></button></div>}
    </div>
  </>; }
  const authButtons = <><button className="button login" onClick={(e) => openDialog('login', e)}>Login</button><button className="button signup" onClick={(e) => openDialog('signup', e)}>Sign Up</button></>;
  return <div className="app">
    <header className="header" ref={navRef}>
      <a className="brand" href={import.meta.env.BASE_URL} aria-label="Terra home"><span className="brand-icon" aria-hidden="true">🌍</span><span>Terra</span></a>
      <nav className="desktop-nav" aria-label="Main navigation">{navItems()}</nav>
      <div className="desktop-actions">{authButtons}</div>
      <button className="mobile-toggle" aria-label={mobileOpen ? 'Close menu' : 'Open menu'} aria-expanded={mobileOpen} aria-controls="mobile-navigation" onClick={() => { setMobileOpen(!mobileOpen); setDropdown(null); }}>{mobileOpen ? <X size={24} /> : <Menu size={24} />}</button>
      {mobileOpen && <nav className="mobile-nav" id="mobile-navigation" aria-label="Mobile navigation">{navItems()}<div className="mobile-actions">{authButtons}</div></nav>}
    </header>
    <main className="hero">
      <div className="product-hunt"><span className="trophy" aria-hidden="true">🏆</span><div><span className="badge-label">PRODUCT HUNT</span><span className="badge-title">#1 Product of the Day</span></div></div>
      <h1 style={{ letterSpacing: '-0.2em' }}><span>The ultimate geo</span><br /><span>map <span className="builder"><span className="builder-text">builder</span><Selection /></span></span></h1>
      <p className="subtext">Terra is how teams build maps and<br className="desktop-break" /> run spatial intelligence together.<br />Design, collaborate, share — all in one place.</p>
      <button className="hero-cta" onClick={showDemo}>Get started for free</button>
      <div className="video-frame" id="map-preview"><video ref={videoRef} src={`${import.meta.env.BASE_URL}assets/terra-demo.mp4`} muted autoPlay loop playsInline preload="auto" aria-label="Terra geo map builder product demonstration" /></div>
    </main>
    {dialog && <dialog className="auth-dialog" ref={dialogRef} onCancel={() => { setDialog(null); triggerRef.current?.focus(); }} onClick={(e) => { if (e.target === e.currentTarget) closeDialog(); }}>
      <button className="dialog-close" aria-label="Close" onClick={closeDialog}><X size={22} /></button>
      <span className="brand-icon dialog-globe" aria-hidden="true">🌍</span>
      <h2>{submitted ? 'Explore your next map' : dialog === 'login' ? 'Welcome back to Terra' : 'Your world, mapped.'}</h2>
      {submitted ? <><p>This preview lets you explore Terra’s map builder. Account registration and sign-in are not connected.</p><button className="button signup dialog-submit" onClick={() => { closeDialog(); showDemo(); }}>Explore the demo</button></> : <><p>{dialog === 'login' ? 'Enter your email to continue.' : 'Bring your next idea to life with Terra.'}</p><form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }}><label htmlFor="email">Work email</label><input id="email" name="email" type="email" autoComplete="email" placeholder="you@company.com" required /><button className="button signup dialog-submit" type="submit">{dialog === 'login' ? 'Continue' : 'Get started'}</button></form></>}
    </dialog>}
  </div>;
}
createRoot(document.getElementById('root')).render(<App />);
