import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { Plus } from 'lucide-react';
import './style.css';

const ease = [0.16, 1, 0.3, 1];
const videoUrl = 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260508_215831_c6a8989c-d716-4d8d-8745-e972a2eec711.mp4';
const details = {
  features: { title: 'One card. More possibilities.', kicker: 'SEE FEATURES', text: 'Advanced Bionics. Cognitive AI. Adaptive Systems.', tags: ['Neuromorphic', 'AGI', 'Cybernetics'] },
  how: { title: 'Designed to adapt.', kicker: 'HOW IT WORKS', text: 'Explore the intersection of advanced bionics and cognitive AI. One connected vision, without limits.', tags: ['Advanced Bionics', 'Cognitive AI'] },
  systems: { title: 'Adaptive Systems', kicker: 'NEURALKINETICS', text: 'Neuromorphic thinking. Cognitive intelligence. A connected future.', tags: ['Neuromorphic', 'AGI', 'Cybernetics'] }
};
function Logo() { return <svg className="logo-icon" viewBox="0 0 40 40" aria-hidden="true"><g transform="rotate(-35 20 20)"><rect x="7" y="5" width="11" height="29" rx="5.5"/><rect x="22" y="6" width="11" height="29" rx="5.5"/></g></svg>; }
function GridIcon() { return <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor" aria-hidden="true"><circle cx="4" cy="4" r="1.6"/><circle cx="10" cy="4" r="1.6"/><circle cx="4" cy="10" r="1.6"/><circle cx="10" cy="10" r="1.6"/></svg>; }
function App() {
  const [menu, setMenu] = useState(false);
  const [panel, setPanel] = useState(null);
  const dialog = useRef(null);
  const reduced = useReducedMotion();
  const enter = (y, delay = 0, duration = .8) => ({ initial: { opacity: 0, y: reduced ? 0 : y }, animate: { opacity: 1, y: 0 }, transition: { duration: reduced ? 0 : duration, delay: reduced ? 0 : delay, ease } });
  const show = key => { setMenu(false); setPanel(key); };
  useEffect(() => { if (panel) dialog.current?.showModal(); else dialog.current?.close(); }, [panel]);
  useEffect(() => {
    const close = e => { if (e.key === 'Escape') setMenu(false); };
    document.addEventListener('keydown', close);
    return () => document.removeEventListener('keydown', close);
  }, []);
  return <main className="hero">
    <motion.div className="video-wrap" initial={{ opacity: 0, scale: reduced ? 1 : 1.05 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: reduced ? 0 : 1.8, ease }}>
      <video autoPlay muted playsInline loop preload="auto" aria-hidden="true" onError={e => { const local = `${import.meta.env.BASE_URL}assets/neural-kinetics.mp4`; if (!e.currentTarget.src.endsWith(local)) e.currentTarget.src = local; }} src={videoUrl} />
    </motion.div>
    <motion.nav className="navbar" aria-label="Main navigation" {...enter(-16)}>
      <div className="nav-left">
        <a className="brand" href={import.meta.env.BASE_URL} aria-label="NeuralKinetics home"><Logo/><span>NeuralKinetics</span></a>
        <div className="menu-wrap">
          <button className="menu-button" aria-expanded={menu} aria-controls="main-menu" onClick={() => setMenu(!menu)}><span className={`circle white ${menu ? 'is-open' : ''}`}><Plus size={12} strokeWidth={3}/></span><span>Menu</span></button>
          <AnimatePresence>{menu && <motion.div className="menu-popover" id="main-menu" initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: .2 }}><button onClick={() => show('features')}>See Features <span>↗</span></button><button onClick={() => show('how')}>How It Works <span>↗</span></button><button onClick={() => show('systems')}>Adaptive Systems <span>↗</span></button></motion.div>}</AnimatePresence>
        </div>
        <div className="nav-tags"><span>Advanced Bionics</span><span>Cognitive AI</span></div>
      </div>
      <button className="systems-button" onClick={() => show('systems')} aria-label="Explore Adaptive Systems"><span className="circle black"><GridIcon/></span><span className="systems-label">Adaptive Systems</span></button>
    </motion.nav>
    <motion.footer className="footer" {...enter(20, .5, 1)}>
      <div className="footer-left">
        <motion.p className="subtitle" {...enter(16, .6)}><span className="dot"/>Best digital banking card 2026</motion.p>
        <motion.h1 {...enter(20, .8)}>One Card, Zero<br/>Limits. Worldwide.</motion.h1>
        <motion.div className="actions" {...enter(16, 1)}><button className="cta primary" onClick={() => show('features')}>See Features</button><button className="cta secondary" onClick={() => show('how')}>How It Works</button></motion.div>
      </div>
      <div className="topic-tags" aria-label="Technologies"><span>Neuromorphic</span><span>AGI</span><span>Cybernetics</span></div>
    </motion.footer>
    <dialog ref={dialog} onCancel={() => setPanel(null)} onClick={e => { if (e.target === e.currentTarget) setPanel(null); }} aria-labelledby="detail-title">
      {panel && <div className="detail"><button className="close-button" aria-label="Close details" onClick={() => setPanel(null)}><Plus size={18}/></button><p className="eyebrow">{details[panel].kicker}</p><h2 id="detail-title">{details[panel].title}</h2><p className="detail-text">{details[panel].text}</p><div className="topic-tags">{details[panel].tags.map(tag => <span key={tag}>{tag}</span>)}</div></div>}
    </dialog>
  </main>;
}

createRoot(document.getElementById('root')).render(<App/>);
