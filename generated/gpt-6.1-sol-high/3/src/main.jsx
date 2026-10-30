import React, { memo, useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { motion, MotionConfig } from 'motion/react';
import { ArrowRight, Menu, X, Check, Layers3, ReceiptText, Globe2 } from 'lucide-react';
import Hls from 'hls.js';
import './style.css';

const base = import.meta.env.BASE_URL;
const stream = 'https://stream.mux.com/hUT6X11m1Vkw1QMxPOLgI761x2cfpi9bHFbi5cNg4014.m3u8';
const BackgroundVideo = memo(function BackgroundVideo() {
  const ref = useRef(null);
  useEffect(() => {
    const video = ref.current;
    let hls;
    let active = true;
    const play = () => { if (active) video.play().catch(() => {}); };
    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = stream;
      video.addEventListener('loadedmetadata', play);
    } else if (Hls.isSupported()) {
      hls = new Hls({ maxMaxBufferLength: 20, startLevel: 2 });
      hls.loadSource(stream);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, play);
    }
    return () => {
      active = false;
      video.removeEventListener('loadedmetadata', play);
      video.pause();
      hls?.destroy();
      video.removeAttribute('src');
      video.load();
    };
  }, []);
  return <video ref={ref} className="background-video absolute inset-0 -z-10 h-full w-full object-cover" autoPlay loop muted playsInline poster={`${base}images/video-poster.jpg`} aria-hidden="true" />;
});

const rise = { hidden: { opacity: 0, y: 22 }, show: { opacity: 1, y: 0, transition: { duration: .75, ease: [.22, 1, .36, 1] } } };
function Logo() { return <a className="brand" href={base} aria-label="ClearInvoice home"><span className="brand-symbol"><ReceiptText size={24} strokeWidth={2.3}/></span><span>ClearInvoice<span className="brand-dot">.</span></span></a>; }

function App() {
  const [menu, setMenu] = useState(false);
  const [panel, setPanel] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const dialog = useRef(null);
  const trigger = useRef(null);
  const open = (name, event) => { trigger.current = event?.currentTarget; setPanel(name); setSubmitted(false); setMenu(false); };
  useEffect(() => {
    if (panel) dialog.current?.showModal();
    else if (dialog.current?.open) dialog.current.close();
  }, [panel]);
  const close = () => { setPanel(null); trigger.current?.focus(); };
  const nav = ['Features', 'Pricing', 'Reviews'];
  return <MotionConfig reducedMotion="user">
    <div className="page relative isolate min-h-svh overflow-hidden bg-[#101211] text-white">
      <BackgroundVideo />
      <div className="top-line h-[5px] bg-gradient-to-r from-[#ccf] via-[#e7d04c] to-[#31fb78]" />
      <header className="header">
        <Logo />
        <nav className="desktop-nav" aria-label="Main navigation">{nav.map(item => <button key={item} onClick={e => open(item, e)}>{item}</button>)}</nav>
        <div className="auth desktop-auth"><button onClick={e => open('Sign In', e)}>Sign In</button><button className="signup" onClick={e => open('Sign Up', e)}>Sign Up <ArrowRight size={15}/></button></div>
        <button className="mobile-toggle" onClick={() => setMenu(!menu)} aria-expanded={menu} aria-controls="mobile-navigation" aria-label={menu ? 'Close navigation' : 'Open navigation'}>{menu ? <X/> : <Menu/>}</button>
      </header>
      {menu && <nav id="mobile-navigation" className="mobile-nav" aria-label="Mobile navigation">{[...nav, 'Sign In', 'Sign Up'].map(item => <button key={item} onClick={e => open(item, e)}>{item}<ArrowRight size={17}/></button>)}</nav>}
      <main className="hero">
        <motion.div initial="hidden" animate="show" transition={{ staggerChildren: .16, delayChildren: .15 }} className="hero-content">
          <motion.div variants={rise} className="eyebrow"><span className="status-dot"/> Less busywork. More business.</motion.div>
          <motion.h1 variants={rise}>Manage your online<br className="desktop-break"/> store while save <span className="cost">3x<br className="desktop-break"/> operating cost</span></motion.h1>
          <motion.p variants={rise} className="subhead">ClearInvoice takes the hassle out of billing<br className="desktop-break"/> with easy-to-use tools.</motion.p>
          <motion.div variants={rise} className="hero-actions">
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: .98 }} onClick={e => open('Sign Up', e)} className="primary group"><span className="button-glow absolute -inset-1 bg-orange-600 blur-lg opacity-20 group-hover:opacity-60"/><span className="button-face bg-gradient-to-r from-[#FF3300] to-[#EE7926]"><span className="button-stroke absolute inset-0 rounded-[inherit] border-[1.5px] border-white/20"/><span className="primary-label">Get started for free</span><ArrowRight className="primary-arrow" size={18}/></span></motion.button>
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: .98 }} className="secondary bg-white/90 backdrop-blur hover:bg-white" onClick={e => open('Features', e)}><span className="absolute inset-0 rounded-[inherit] border-[1.5px] border-black/5"/>Explore features <ArrowRight size={17}/></motion.button>
          </motion.div>
          <motion.div variants={rise} className="social-proof"><div className="avatars">{['sarah','james','maya'].map((name, i) => <img key={name} src={`${base}images/${name}.jpg`} alt={['Sarah, store owner','James, store owner','Maya, store owner'][i]}/>)}</div><p>Trusted by <strong>210k+</strong> stores worldwide</p></motion.div>
        </motion.div>
      </main>
      <div className="bottom-note"><span/> A little clarity goes a long way.</div>
    </div>
    <dialog ref={dialog} onCancel={close} onClick={e => { if (e.target === dialog.current) close(); }} onClose={() => setPanel(null)}>
      <button className="dialog-close" onClick={close} aria-label="Close dialog"><X size={20}/></button>
      <span className="dialog-kicker">CLEARINVOICE</span><h2>{panel}</h2>
      {panel === 'Features' && <><p>Easy-to-use tools. More time for your store.</p><div className="feature-list"><div><ReceiptText/><span><strong>Billing, made simple</strong>Keep your invoices organized in one place.</span></div><div><Layers3/><span><strong>Less operational busywork</strong>Bring a little clarity to your everyday workflow.</span></div><div><Globe2/><span><strong>Built for online stores</strong>Focus on your business, wherever you sell.</span></div></div><button className="modal-action" onClick={() => setPanel('Sign Up')}>Get started <ArrowRight size={17}/></button></>}
      {panel === 'Pricing' && <><p>Find the right fit for your store.</p><p className="fine-print">This hero preview does not include published plans or checkout.</p><button className="modal-action" onClick={() => setPanel('Sign Up')}>Get started for free <ArrowRight size={17}/></button></>}
      {panel === 'Reviews' && <><div className="review-number">210k+</div><p>Trusted by 210k+ stores worldwide</p><p className="fine-print">ClearInvoice takes the hassle out of billing with easy-to-use tools.</p></>}
      {(panel === 'Sign In' || panel === 'Sign Up') && (submitted ? <div className="success"><Check/><h3>You're all set to preview.</h3><p>This is a design demo. No account has been created and no information has been sent.</p></div> : <form onSubmit={e => { e.preventDefault(); setSubmitted(true); }}><p>{panel === 'Sign Up' ? 'A little less admin. A lot more possibility.' : 'Welcome back to ClearInvoice.'}</p><label htmlFor="email">Work email</label><input id="email" type="email" placeholder="you@yourstore.com" required autoComplete="email"/><button className="modal-action" type="submit">{panel === 'Sign Up' ? 'Get started' : 'Continue'}<ArrowRight size={17}/></button><p className="fine-print">Design preview only. Account services are not connected.</p></form>)}
    </dialog>
  </MotionConfig>;
}
createRoot(document.getElementById('root')).render(<App/>);
