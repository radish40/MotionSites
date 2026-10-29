import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { Globe, ArrowRight, Check, X } from 'lucide-react';
import Hls from 'hls.js';
import './index.css';

const VIDEO_URL = 'https://stream.mux.com/kimF2ha9zLrX64H00UgLGPflCzNtl1T0215MlAmeOztv8.m3u8';
function StreamVideo({ controls = false }) {
  const ref = useRef(null);
  useEffect(() => {
    const video = ref.current;
    let hls;
    if (video.canPlayType('application/vnd.apple.mpegurl')) video.src = VIDEO_URL;
    else if (Hls.isSupported()) {
      hls = new Hls();
      hls.loadSource(VIDEO_URL);
      hls.attachMedia(video);
    }
    return () => hls?.destroy();
  }, []);
  return <video ref={ref} autoPlay muted loop playsInline controls={controls} aria-label={controls ? 'Asme video demo' : undefined} aria-hidden={controls ? undefined : true} className="w-full h-full object-cover opacity-100" />;
}
function BackgroundVideo() {
  return <div className="absolute inset-0 overflow-hidden pointer-events-none"><StreamVideo /></div>;
}
function Navbar({ openForm, openInfo }) {
  return <motion.nav initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="relative z-20 px-6 py-6 w-full" aria-label="Main navigation">
    <div className="liquid-glass rounded-full px-6 py-3 flex items-center justify-between max-w-5xl mx-auto">
      <div className="flex items-center gap-8">
        <a href="#" aria-label="Asme home" className="flex items-center gap-2"><Globe className="w-6 h-6 text-white"/><span className="text-white font-semibold text-lg">Asme</span></a>
        <div className="hidden md:flex items-center gap-8 text-white/80 text-sm font-medium">
          {['Features', 'Pricing', 'About'].map(label => <a key={label} href={`#${label.toLowerCase()}`} onClick={e => { e.preventDefault(); openInfo(label); }} className="hover:text-white transition-colors duration-300">{label}</a>)}
        </div>
      </div>
      <div className="flex items-center gap-4">
        <button onClick={openForm} className="text-white hover:text-white/80 transition-colors text-sm font-medium cursor-pointer">Sign Up</button>
        <button onClick={() => openInfo('Login')} className="liquid-glass rounded-full px-6 py-2 text-sm font-medium text-white hover:opacity-90 transition-opacity cursor-pointer">Login</button>
      </div>
    </div>
  </motion.nav>;
}
function App() {
  const [formOpen, setFormOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [email, setEmail] = useState('');
  const [placeholder, setPlaceholder] = useState('');
  const [dialog, setDialog] = useState(null);
  const reducedMotion = useReducedMotion();
  const inputRef = useRef(null);
  const dialogRef = useRef(null);
  const previousFocus = useRef(null);
  const openForm = () => { setDialog(null); setFormOpen(true); setTimeout(() => inputRef.current?.focus(), 250); };
  useEffect(() => {
    if (!formOpen) return;
    const phrase = submitted ? 'You Will Receive Notifications By Email' : 'Enter Your Email Here For Early Access';
    setPlaceholder('');
    let index = 0;
    const timer = setInterval(() => { setPlaceholder(phrase.slice(0, ++index)); if (index === phrase.length) clearInterval(timer); }, reducedMotion ? 1 : 60);
    return () => clearInterval(timer);
  }, [formOpen, submitted, reducedMotion]);
  useEffect(() => {
    if (!submitted) return;
    const timer = setTimeout(() => { setFormOpen(false); setSubmitted(false); setEmail(''); }, 4000);
    return () => clearTimeout(timer);
  }, [submitted]);
  useEffect(() => {
    if (dialog) { previousFocus.current = document.activeElement; dialogRef.current?.showModal(); }
    else if (dialogRef.current?.open) { dialogRef.current.close(); previousFocus.current?.focus(); }
  }, [dialog]);
  const submit = e => { e.preventDefault(); if (email.trim()) { setSubmitted(true); setEmail(''); } };
  return <main className="relative bg-black h-screen w-screen flex flex-col overflow-hidden selection:bg-white selection:text-black shrink-0">
    <BackgroundVideo />
    <Navbar openForm={openForm} openInfo={setDialog}/>
    <section className="relative flex-1 flex flex-col items-center justify-center px-6">
      <div className="relative z-10 text-center max-w-5xl mx-auto flex flex-col items-center justify-center w-full gap-12">
        <div className="flex flex-col items-center">
          <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-white/80 text-[10px] md:text-[11px] font-medium tracking-[0.2em] uppercase mb-4">BUILD A NO-CODE AI APP IN MINUTES</motion.p>
          <motion.h1 style={{ fontFamily: "'Instrument Serif', serif" }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reducedMotion ? 0 : 1, ease: [0.16, 1, 0.3, 1] }} className="text-4xl md:text-[64px] font-medium tracking-[-0.01em] leading-[1.1] mb-6 bg-gradient-to-b from-white via-white/95 to-white/70 bg-clip-text text-transparent max-w-4xl">A new way to think and create<br className="hidden md:block"/> with computers</motion.h1>
          <motion.div id="early-access" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="min-h-[50px] mt-2 w-full flex justify-center">
            <AnimatePresence mode="wait">
              {!formOpen ? <motion.button key="button" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.2 }} onClick={openForm} className="px-10 py-3 text-[14px] font-medium border border-white/10 rounded-full hover:border-white/30 hover:bg-white/[0.02] transition-all duration-300 text-white/90 backdrop-blur-sm cursor-pointer">Get early access</motion.button>
              : <motion.form key="form" onSubmit={submit} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.2 }} className="flex items-center gap-2 pl-5 pr-1.5 py-1.5 text-[14px] font-medium border border-white/20 rounded-full bg-white/[0.02] backdrop-blur-sm w-full max-w-[320px] focus-within:border-white/40 transition-colors duration-300">
                <input ref={inputRef} autoFocus required={!submitted} type="email" aria-label={submitted ? 'Early access confirmation' : 'Email address'} value={email} onChange={e => setEmail(e.target.value)} readOnly={submitted} placeholder={placeholder} className="bg-transparent text-white placeholder-white/45 min-w-0 flex-1 w-full text-[12px]"/>
                <button type="submit" disabled={submitted} aria-label={submitted ? 'Email submitted' : 'Join waitlist'} className="rounded-full bg-white/10 hover:bg-white/20 transition-colors p-2.5 cursor-pointer disabled:cursor-default">{submitted ? <Check size={18}/> : <ArrowRight size={18}/>}</button>
              </motion.form>}
            </AnimatePresence>
            <span className="sr-only" role="status">{submitted ? 'You Will Receive Notifications By Email' : ''}</span>
          </motion.div>
        </div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}><button onClick={() => setDialog('demo')} className="text-white/80 hover:text-white/40 transition-colors duration-300 text-[13px] font-medium tracking-wide cursor-pointer">Play Video Demo</button></motion.div>
      </div>
    </section>
    <dialog aria-label={dialog === 'demo' ? 'Asme video demo' : `${dialog} information`} ref={dialogRef} onCancel={() => setDialog(null)} onClick={e => { if (e.target === e.currentTarget) setDialog(null); }} className="m-auto w-[calc(100%-32px)] max-w-2xl rounded-3xl border border-white/20 bg-black/90 text-white p-8 backdrop:bg-black/70 backdrop:backdrop-blur-md">
      <button aria-label="Close dialog" onClick={() => setDialog(null)} className="absolute right-4 top-4 rounded-full p-2 bg-black/60 z-10 cursor-pointer"><X size={20}/></button>
      {dialog === 'demo' ? <div className="aspect-video overflow-hidden rounded-xl"><StreamVideo controls/></div> : <div className="py-6"><h2 className="text-3xl mb-4" style={{fontFamily: "'Instrument Serif', serif"}}>{dialog === 'Login' ? 'Asme is coming soon' : dialog}</h2><p className="text-white/70 text-sm mb-6">{dialog === 'Features' ? 'Build a no-code AI app in minutes.' : dialog === 'About' ? 'A new way to think and create with computers.' : 'Join the waitlist for early access to Asme.'}</p><button onClick={openForm} className="rounded-full border border-white/20 px-6 py-3 text-sm cursor-pointer">Get early access</button></div>}
    </dialog>
  </main>;
}

createRoot(document.getElementById('root')).render(<App/>);
