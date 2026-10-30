import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { ArrowRight, Menu, X } from 'lucide-react';
import Hls from 'hls.js';
import './styles.css';

const STREAM = 'https://stream.mux.com/tLkHO1qZoaaQOUeVWo8hEBeGQfySP02EPS02BmnNFyXys.m3u8';
const asset = (name) => `${import.meta.env.BASE_URL}assets/${name}`;
const pages = {
  projects: { label: 'LEARN BY BUILDING', title: 'Real skills. Real projects.', text: 'Put what you learn into practice. Build responsive websites, interactive applications, and a portfolio that shows what you can do.', items: ['Responsive web experiences', 'Interactive JavaScript applications', 'Portfolio-ready capstone projects'] },
  blog: { label: 'THE CODENEST JOURNAL', title: 'Stay curious. Keep building.', text: 'A few principles to take with you on your coding journey.', items: ['Start small. Finish one project at a time.', 'Learn by doing. Turn each concept into working code.', 'Share your work. Let your progress tell the story.'] },
  about: { label: 'MEET CODENEST', title: 'Built for your next chapter.', text: 'CodeNest connects practical coding skills with a clear path forward. Learn from industry professionals, create meaningful projects, and build the confidence to launch your career.', items: ['Career-ready curriculum', 'Practical, project-based learning', 'Taught by industry professionals'] },
  resume: { label: 'YOUR NEXT OPPORTUNITY', title: 'Let your work speak.', text: 'Turn your learning into a clear story. A strong developer resume connects your skills to the things you have built.', items: ['Showcase your strongest projects', 'Highlight the tools you use confidently', 'Connect your portfolio and project demos'] },
  start: { label: 'YOUR LEARNING PATH', title: 'It starts with your first line.', text: 'Build a strong foundation, put your skills into practice, and take your next step with confidence.', items: ['01  Foundations — HTML, CSS & JavaScript', '02  Build — Responsive, interactive projects', '03  Launch — Your portfolio & career preparation'] },
};

function Background() {
  const ref = useRef(null);
  useEffect(() => {
    const video = ref.current;
    let hls;
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (motion.matches) return;
    if (Hls.isSupported()) {
      hls = new Hls({ enableWorker: false, maxMaxBufferLength: 30, capLevelToPlayerSize: true });
      hls.loadSource(STREAM);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => video.play().catch(() => {}));
      hls.on(Hls.Events.ERROR, (_, data) => {
        if (data.fatal) { video.dataset.status = 'poster-fallback'; hls.destroy(); }
      });
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = STREAM;
      video.play().catch(() => {});
    }
    return () => hls?.destroy();
  }, []);
  return <div className="scene" aria-hidden="true">
    <video ref={ref} className="background-video" autoPlay muted loop playsInline poster={asset('video-poster.jpg')} />
    <div className="shade-left" /><div className="shade-bottom" />
    <svg className="ambient-glow" viewBox="0 0 1200 600" preserveAspectRatio="none"><defs><filter id="glow" x="-50%" y="-150%" width="200%" height="400%"><feGaussianBlur stdDeviation="25" /></filter></defs><ellipse cx="600" cy="235" rx="390" ry="70" fill="#114d40" opacity=".28" filter="url(#glow)" /></svg>
    <div className="grid-lines"><span /><span /><span /></div>
  </div>;
}
function Logo() {
  return <a className="brand" href={import.meta.env.BASE_URL} aria-label="CodeNest home"><svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true"><path d="m11 7-8 9 8 9M21 7l8 9-8 9M19 4l-6 24" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" /></svg><span>CodeNest<span className="brand-dot">.</span></span></a>;
}
function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [page, setPage] = useState(null);
  const dialog = useRef(null);
  const menuRef = useRef(null);
  const menuButton = useRef(null);
  const lastFocus = useRef(null);
  useEffect(() => {
    document.body.style.overflow = menuOpen || page ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen, page]);
  useEffect(() => {
    if (page) dialog.current?.showModal();
    else if (dialog.current?.open) dialog.current.close();
  }, [page]);
  useEffect(() => {
    if (!menuOpen) return;
    menuRef.current?.querySelector('button')?.focus();
    const key = (e) => {
      if (e.key === 'Escape') { setMenuOpen(false); menuButton.current?.focus(); }
      if (e.key === 'Tab') {
        const buttons = [...menuRef.current.querySelectorAll('button')];
        const i = buttons.indexOf(document.activeElement);
        if (e.shiftKey && i === 0) { e.preventDefault(); buttons.at(-1).focus(); }
        else if (!e.shiftKey && i === buttons.length - 1) { e.preventDefault(); buttons[0].focus(); }
      }
    };
    document.addEventListener('keydown', key);
    return () => document.removeEventListener('keydown', key);
  }, [menuOpen]);
  function openPage(id, e) {
    lastFocus.current = menuOpen ? menuButton.current : e.currentTarget;
    setMenuOpen(false); setPage(id);
  }
  function closePage() { setPage(null); requestAnimationFrame(() => lastFocus.current?.focus()); }
  const links = Object.keys(pages).filter((key) => key !== 'start');
  return <div className="site-shell relative isolate min-h-svh overflow-hidden bg-[#070b0a] text-white">
    <Background />
    <header className="header flex items-center justify-between">
      <Logo />
      <nav className="desktop-nav hidden md:flex items-center" aria-label="Main navigation">{links.map(id => <a key={id} href={`#${id}`} onClick={e => { e.preventDefault(); openPage(id, e); }} className="transition-colors hover:text-[#5ed29c]">{id.toUpperCase()}</a>)}</nav>
      <button ref={menuButton} className="menu-button md:hidden" aria-label="Open menu" aria-expanded={menuOpen} aria-controls="mobile-navigation" onClick={() => setMenuOpen(true)}><Menu size={25} /></button>
    </header>
    <main className="hero relative z-10 flex flex-col items-center text-center">
      <div className="card-space">
        <div className="glass-card translate-y-[-50px]">
          <div className="card-tag">[ 2025 ]</div>
          <div className="card-spark" aria-hidden="true"><span /><span /><span /><span /></div>
          <h2>Taught by<br /><em>Industry</em> Professionals</h2>
          <p>Real-world experience.<br />Your unfair advantage.</p>
        </div>
      </div>
      <div className="hero-copy">
        <p className="eyebrow"><span />Career-Ready Curriculum</p>
        <h1>LAUNCH YOUR<br />CODING CAREER<span className="text-[#5ed29c]">.</span></h1>
        <p className="description">Master in-demand coding skills with hands-on projects and expert guidance. Your next chapter starts with a single line of code.</p>
        <button className="primary-cta group inline-flex items-center justify-center rounded-full bg-[#5ed29c] font-bold text-[#070b0a] transition-all hover:bg-[#7ee5b5]" onClick={e => openPage('start', e)}>GET STARTED<ArrowRight size={18} className="transition-transform group-hover:translate-x-1" /></button>
      </div>
    </main>
    <footer className="footer relative z-10 flex items-center justify-between"><span>A NEW CHAPTER STARTS HERE</span><span className="footer-right"><i /> BUILT FOR WHAT’S NEXT</span></footer>
    {menuOpen && <div ref={menuRef} className="mobile-overlay" id="mobile-navigation" role="dialog" aria-modal="true" aria-label="Navigation"><div className="overlay-header"><span className="overlay-brand">CodeNest.</span><button className="menu-button" aria-label="Close menu" onClick={() => { setMenuOpen(false); menuButton.current?.focus(); }}><X size={25} /></button></div><nav aria-label="Mobile navigation">{links.map((id, index) => <button key={id} onClick={e => openPage(id, e)}><span className="nav-index">0{index + 1}</span>{id.toUpperCase()}<ArrowRight size={24} /></button>)}</nav><p>YOUR NEXT CHAPTER STARTS HERE.</p></div>}
    <dialog ref={dialog} className="content-dialog" aria-labelledby="dialog-title" onCancel={e => { e.preventDefault(); closePage(); }} onClick={e => { if (e.target === dialog.current) closePage(); }} onClose={() => { if (page) closePage(); }}>
      {page && <article><button className="dialog-close" aria-label="Close details" onClick={closePage}><X size={23} /></button><p className="eyebrow">{pages[page].label}</p><h2 id="dialog-title">{pages[page].title}</h2><p className="dialog-description">{pages[page].text}</p><ul>{pages[page].items.map(item => <li key={item}><ArrowRight size={17} />{item}</li>)}</ul><button className="dialog-back" onClick={closePage}>BACK TO CODENEST <ArrowRight size={17} /></button></article>}
    </dialog>
  </div>;
}
createRoot(document.getElementById('root')).render(<App />);
