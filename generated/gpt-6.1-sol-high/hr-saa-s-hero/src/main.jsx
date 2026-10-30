import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { motion, MotionConfig, useReducedMotion } from 'motion/react';
import './styles.css';

const asset = (file) => `${import.meta.env.BASE_URL}assets/${file}`;
const entrance = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } };
function Star({ small = false }) {
  return <svg aria-hidden="true" width={small ? 14 : 18} height={small ? 14 : 18} viewBox="0 0 24 24" fill="currentColor"><path d="m12 2 2.9 6.1 6.7.9-4.9 4.8 1.2 6.7-5.9-3.2-5.9 3.2 1.2-6.7L2.4 9l6.7-.9L12 2Z" /></svg>;
}
function App() {
  const reduced = useReducedMotion();
  const video = useRef(null);
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [playing, setPlaying] = useState(!reduced);
  useEffect(() => {
    if (reduced) { video.current?.pause(); setPlaying(false); }
  }, [reduced]);
  function toggleVideo() {
    if (video.current.paused) video.current.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
    else { video.current.pause(); setPlaying(false); }
  }
  function submit(event) { event.preventDefault(); if (event.currentTarget.checkValidity()) setSubmitted(true); }
  return <MotionConfig reducedMotion="user">
    <main className="hero relative isolate min-h-screen overflow-hidden bg-white">
      <div className="backdrop absolute inset-0 -z-10" aria-hidden="true">
        <video ref={video} autoPlay={!reduced} muted loop playsInline preload="auto" className="w-full h-full object-cover [transform:scaleY(-1)]" onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)}>
          <source src={asset('hero.mp4')} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-[26.416%] from-[rgba(255,255,255,0)] to-[66.943%] to-white" />
      </div>
      <motion.div className="hero-content mx-auto flex max-w-[1200px] flex-col items-center gap-8 px-6 pt-[290px] text-center" initial="hidden" animate="visible" transition={{ staggerChildren: reduced ? 0 : 0.16, delayChildren: 0.12 }}>
        <motion.h1 variants={entrance} transition={{ duration: reduced ? 0 : 0.85, ease: [0.22, 1, 0.36, 1] }} className="heading font-medium tracking-[-0.04em]">
          <span className="headline-top">Simple <em>management</em></span>
          <span className="headline-bottom">for your remote team</span>
        </motion.h1>
        <motion.p variants={entrance} transition={{ duration: reduced ? 0 : 0.75 }} className="description max-w-[554px] text-lg text-[#373a46]/80">
          Bring your people, projects, and processes together.<br className="desktop-break" /> One simple place to manage your team, wherever work happens.
        </motion.p>
        <motion.div variants={entrance} transition={{ duration: reduced ? 0 : 0.75 }} className="signup-block w-full">
          <form onSubmit={submit} className="email-bar mx-auto flex items-center rounded-[40px] border border-[#e5e5e5] bg-[#fcfcfc] p-2 shadow-[0px_10px_40px_5px_rgba(194,194,194,0.25)]">
            <label htmlFor="email" className="sr-only">Your work email</label>
            <svg className="mail-icon shrink-0" aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="5" width="18" height="14" rx="3"/><path d="m4 7 8 6 8-6"/></svg>
            <input id="email" name="email" type="email" autoComplete="email" required placeholder="Enter your work email" value={email} onChange={e => { setEmail(e.target.value); setSubmitted(false); }} className="min-w-0 flex-1 bg-transparent outline-none" />
            <motion.button type="submit" whileHover={{ scale: 1.015 }} whileTap={{ scale: 0.98 }} className="cta shrink-0 rounded-[32px] shadow-[inset_-4px_-6px_25px_0px_rgba(201,201,201,0.08),inset_4px_4px_10px_0px_rgba(29,29,29,0.24)]">Create Free Account<svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M5 12h14m-5-5 5 5-5 5"/></svg></motion.button>
          </form>
          <div role="status" className={`form-status ${submitted ? 'shown' : ''}`}>{submitted ? 'Thanks for your interest! This is a signup preview.' : ''}</div>
          <div className="social-proof flex items-center justify-center" aria-label="1,020 plus reviews, rated five stars">
            <div className="review-brands flex items-center" aria-hidden="true">
              <span className="g2">G<span>2</span></span>
              <span className="brand-divider" />
              <svg width="22" height="24" viewBox="0 0 24 24" fill="none"><path d="M3 3h18L8 21 3 3Z" fill="#343a3c"/><path d="m3 3 7 10 11-10H3Z" fill="#788386"/><path d="m10 13-2 8 13-18-11 10Z" fill="#545f62"/></svg>
              <span className="brand-divider" />
              <Star />
            </div>
            <span className="proof-divider" />
            <div className="review-copy text-left"><div className="stars flex" aria-hidden="true">{Array.from({ length: 5 }, (_, i) => <Star key={i} small />)}</div><p><strong>1,020+</strong> Reviews</p></div>
          </div>
        </motion.div>
      </motion.div>
      <button type="button" onClick={toggleVideo} className="video-toggle" aria-label={playing ? 'Pause background video' : 'Play background video'}>{playing ? <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor" aria-hidden="true"><path d="M3 2h2v8H3zm4 0h2v8H7z"/></svg> : <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor" aria-hidden="true"><path d="m4 2 6 4-6 4z"/></svg>}</button>
    </main>
  </MotionConfig>;
}
createRoot(document.getElementById('root')).render(<App />);
