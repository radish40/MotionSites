import React, { memo, useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { motion, MotionConfig } from 'motion/react';
import Hls from 'hls.js';
import './styles.css';

const STREAM = 'https://stream.mux.com/9JXDljEVWYwWu01PUkAemafDugK89o01BR6zqJ3aS9u00A.m3u8';
const VideoPlayer = memo(function VideoPlayer() {
  const ref = useRef(null);
  useEffect(() => {
    const video = ref.current;
    let hls;
    const play = () => { video.play().catch(() => {}); };
    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = STREAM;
      video.addEventListener('loadedmetadata', play);
    } else if (Hls.isSupported()) {
      hls = new Hls({ capLevelToPlayerSize: true, startLevel: 1 });
      hls.loadSource(STREAM);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, play);
      hls.on(Hls.Events.ERROR, (_, data) => {
        if (data.fatal) video.dataset.streamError = data.type;
      });
    }
    return () => {
      video.removeEventListener('loadedmetadata', play);
      hls?.destroy();
      video.pause();
      video.removeAttribute('src');
      video.load();
    };
  }, []);
  return <div className="video-container" aria-hidden="true"><video ref={ref} autoPlay muted loop playsInline preload="auto" poster={`${import.meta.env.BASE_URL}assets/video-poster.jpg`} /></div>;
});

function Arrow({ diagonal = false }) {
  return <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d={diagonal ? 'M6 18 18 6M6 6h12v12' : 'M4 12h15m-6-6 6 6-6 6'} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>;
}
function IntegrationIcon({ name }) {
  if (name === 'Vercel') return <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="m12 4 11 18H1Z"/></svg>;
  if (name === 'GitHub') return <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.86c-2.78.6-3.37-1.18-3.37-1.18-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.89 1.52 2.34 1.08 2.91.83.09-.64.35-1.08.64-1.33-2.22-.25-4.56-1.11-4.56-4.95 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.03A9.6 9.6 0 0 1 12 6.83c.85 0 1.71.12 2.51.34 1.91-1.3 2.75-1.03 2.75-1.03.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.85-2.34 4.69-4.57 4.94.36.31.68.92.68 1.85v2.75c0 .27.18.58.69.48A10 10 0 0 0 12 2Z"/></svg>;
  return <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m12 2 9 5v10l-9 5-9-5V7Z" stroke="currentColor" strokeWidth="1.5"/><path d="m3 7 9 5 9-5M12 12v10M7.5 4.5l9 5v5l-9-5v-5Z" stroke="currentColor" strokeWidth="1.5"/></svg>;
}
function Logos() {
  return <div className="logo-row" aria-label="Our community: Layers, Sisyphus, Circooles, Catalog, Quotient">
    <span className="partner"><svg viewBox="0 0 32 32"><path d="m16 3 14 8-14 8L2 11Zm-14 14 14 8 14-8M2 23l14 8 14-8"/></svg>Layers</span>
    <span className="partner"><svg viewBox="0 0 32 32"><path d="m6 25 10-20 10 20ZM6 25l10-8 10 8"/></svg>Sisyphus</span>
    <span className="partner"><svg viewBox="0 0 32 32"><circle cx="12" cy="16" r="10"/><circle cx="20" cy="16" r="10"/></svg>Circooles</span>
    <span className="partner"><svg viewBox="0 0 32 32"><circle cx="16" cy="16" r="13"/><path d="M7 25 25 7M3 18 18 3M14 29l15-15"/></svg>Catalog</span>
    <span className="partner"><svg viewBox="0 0 32 32"><circle cx="15" cy="14" r="11"/><path d="m17 18 12 12" strokeWidth="5"/></svg>Quotient</span>
  </div>;
}
const content = {
  Features: { eyebrow: 'FROM FIRST TEST TO FINAL DEPLOY', title: 'Built for your next big idea.', text: 'Bring testing and deployment into one seamless workflow. Validate with confidence, ship with clarity, and keep moving forward.', items: ['Test with confidence', 'Deploy without friction', 'Build together'] },
  Insights: { eyebrow: 'THE SYNAPSE PERSPECTIVE', title: 'Make every iteration count.', text: 'Great products take shape through small, thoughtful improvements. Test early, learn from each release, and give your best ideas room to grow.', items: ['Shorter feedback loops', 'Thoughtful experimentation', 'Continuous improvement'] },
  About: { eyebrow: 'MEET SYNAPSE', title: 'Good ideas deserve to go further.', text: 'Synapse is where innovation meets execution. We believe the path from an ambitious idea to a polished product should feel seamless.', items: ['Built for curious minds', 'Designed for collaboration', 'Focused on what comes next'] },
};
function App() {
  const [menu, setMenu] = useState(false);
  const [panel, setPanel] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const dialog = useRef(null);
  const previousFocus = useRef(null);
  function openPanel(name) { previousFocus.current = document.activeElement; setMenu(false); setSubmitted(false); setPanel(name); }
  useEffect(() => {
    if (panel) { dialog.current.showModal(); document.body.style.overflow = 'hidden'; }
    return () => { document.body.style.overflow = ''; };
  }, [panel]);
  function closePanel() { dialog.current.close(); setPanel(null); previousFocus.current?.focus(); }
  const fade = { hidden: { opacity: 0, y: 22 }, show: { opacity: 1, y: 0, transition: { duration: .85, ease: [.2, .7, .2, 1] } } };
  const navItems = <>{['Features', 'Insights', 'About', 'Case Studies', 'Contact'].map(name => <button key={name} className={`nav-link ${name === 'Features' ? 'active' : ''} ${name === 'Case Studies' ? 'coming-soon' : ''}`} disabled={name === 'Case Studies'} title={name === 'Case Studies' ? 'Case studies — coming soon' : undefined} onClick={() => openPanel(name)}>{name}</button>)}</>;
  return <MotionConfig reducedMotion="user"><main className="min-h-svh bg-black text-white relative isolate">
    <header className="navbar fixed z-30 flex items-center justify-between">
      <a className="brand" href={import.meta.env.BASE_URL} aria-label="Synapse home">Synapse<span className="brand-dot">®</span></a>
      <nav className="desktop-nav flex items-center" aria-label="Main navigation">{navItems}</nav>
      <button className="nav-cta transition-all" onClick={() => openPanel('Get Started')}>Get Started for Free <Arrow diagonal/></button>
      <button className="menu-toggle" aria-label={menu ? 'Close menu' : 'Open menu'} aria-expanded={menu} aria-controls="mobile-navigation" onClick={() => setMenu(!menu)}><span/><span className={menu ? 'cross' : ''}/></button>
      {menu && <nav className="mobile-nav" id="mobile-navigation" aria-label="Mobile navigation">{navItems}<button className="nav-cta" onClick={() => openPanel('Get Started')}>Get Started for Free <Arrow diagonal/></button></nav>}
    </header>
    <section className="hero relative flex flex-col items-center" aria-labelledby="hero-title">
      <VideoPlayer/>
      <motion.div className="hero-content relative z-10 text-center" variants={{ hidden: {}, show: { transition: { staggerChildren: .14, delayChildren: .15 } } }} initial="hidden" animate="show">
        <motion.div className="badges flex items-center justify-center" variants={fade}>{['Vercel', 'GitHub', 'CodeSandbox'].map(name => <div className="integration-badge" key={name}><span>Integrated with</span><span className="badge-separator"/><span className="integration-icon" aria-label={name}><IntegrationIcon name={name}/></span></div>)}</motion.div>
        <motion.h1 id="hero-title" variants={fade}>Where Innovation<br/>Meets Execution</motion.h1>
        <motion.p className="hero-description" variants={fade}>Streamline your testing and deployment workflow.<br className="desktop-break"/> Build with confidence. Deploy with ease.</motion.p>
        <motion.div className="hero-actions flex items-center justify-center" variants={fade}>
          <button className="button button-primary" onClick={() => openPanel('Get Started')}>Get Started for Free <Arrow diagonal/></button>
          <button className="button button-glass" onClick={() => openPanel('Contact')}>Let's Get Connected <Arrow/></button>
        </motion.div>
      </motion.div>
      <motion.div className="community relative z-10" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .95, duration: 1 }}>
        <p>Great ideas. Extraordinary companies.</p><Logos/>
      </motion.div>
      <div className="hero-footnote"><span className="status-dot"/> Built for the way you build.</div>
    </section>
    <dialog ref={dialog} className="info-dialog" onCancel={closePanel} onClick={event => { if (event.target === dialog.current) closePanel(); }} aria-labelledby="dialog-title">
      {panel && <><button className="close-dialog" aria-label="Close dialog" onClick={closePanel}>×</button>
        {content[panel] ? <><p className="eyebrow">{content[panel].eyebrow}</p><h2 id="dialog-title">{content[panel].title}</h2><p className="dialog-copy">{content[panel].text}</p><ul>{content[panel].items.map(item => <li key={item}><span>↗</span>{item}</li>)}</ul><button className="button button-primary" onClick={() => { setPanel('Get Started'); setSubmitted(false); }}>Get Started for Free <Arrow diagonal/></button></> : <><p className="eyebrow">{panel === 'Contact' ? 'LET’S CONNECT' : 'YOUR NEXT CHAPTER'}</p><h2 id="dialog-title">{submitted ? 'Thanks for exploring Synapse.' : panel === 'Contact' ? 'Great things start with a conversation.' : 'Bring your next idea to life.'}</h2>{submitted ? <><p className="dialog-copy">You’ve reached the end of this interactive preview. No information has been sent or stored.</p><button className="button button-primary" onClick={closePanel}>Back to Synapse <Arrow/></button></> : <form onSubmit={e => { e.preventDefault(); setSubmitted(true); }}><p className="dialog-copy">{panel === 'Contact' ? 'Tell us a little about what you’re building.' : 'A better workflow starts with a single step.'}</p><label htmlFor="email">Work email</label><input id="email" type="email" placeholder="you@company.com" required autoComplete="email"/>{panel === 'Contact' && <><label htmlFor="message">What’s on your mind?</label><textarea id="message" placeholder="Tell us about your next big idea…" rows="3" required/></>}<button className="button button-primary" type="submit">{panel === 'Contact' ? 'Let’s connect' : 'Get started'} <Arrow diagonal/></button><p className="preview-note">Interactive preview. No information is sent or stored.</p></form>}</>}
      </>}
    </dialog>
  </main></MotionConfig>;
}

createRoot(document.getElementById('root')).render(<App/>);
