import React, { useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import './styles.css';

const headline = 'Focus in a Constantly Distracted World';

function BlurText() {
  const reduced = useReducedMotion();
  return <h1 aria-label={headline} className="max-w-3xl font-heading text-6xl md:text-7xl lg:text-[5.5rem] text-heading leading-[0.85] tracking-[-4px]">
    {headline.split(' ').map((word, index) => <React.Fragment key={word}>
      {index > 0 && ' '}
      <motion.span aria-hidden="true" className="inline-block" initial={reduced ? false : { filter: 'blur(10px)', opacity: 0, y: 50 }} animate={{ filter: 'blur(0px)', opacity: 1, y: 0 }} transition={{ duration: .35, delay: index * .1 }}>{word}</motion.span>
    </React.Fragment>)}
  </h1>;
}

function App() {
  const input = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState('');
  const [active, setActive] = useState(window.location.hash.slice(1) || 'home');
  const reduced = useReducedMotion();
  const reveal = (delay: number) => ({ initial: reduced ? false as const : { filter: 'blur(10px)', opacity: 0, y: 20 }, animate: { filter: 'blur(0px)', opacity: 1, y: 0 }, transition: { duration: .6, delay } });

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      localStorage.setItem('railroad-waitlist-email', input.current!.value.trim());
      setMessage('Email saved on this device. Online signup coming soon.');
    } catch {
      setMessage('Your browser could not save your email. Please try again.');
    }
  }

  return <main id="home" className="relative isolate flex min-h-svh flex-col overflow-hidden bg-background font-body text-foreground">
    <video className="absolute inset-0 -z-20 h-full w-full object-cover" autoPlay loop muted playsInline preload="auto" src={`${import.meta.env.BASE_URL}assets/railroad-background.mp4`} aria-hidden="true" />
    <div className="pointer-events-none absolute inset-0 -z-10 bg-black/5" />
    <header className="fixed top-[30px] z-50 flex w-full items-center justify-between px-8 lg:px-16">
      <a href="#home" onClick={() => setActive('home')} aria-label="Railroad.ai home" className="font-heading text-2xl tracking-tight">Railroad.ai</a>
      <nav aria-label="Main navigation" className="liquid-glass hidden items-center gap-1 rounded-full p-1.5 md:flex">
        {['Home', 'Voyages', 'Worlds', 'Innovation'].map(label => <a key={label} href={`#${label.toLowerCase()}`} onClick={() => setActive(label.toLowerCase())} aria-current={active === label.toLowerCase() ? 'page' : undefined} className="rounded-full px-5 py-2.5 text-sm font-medium text-foreground/90 transition-colors hover:bg-white/15">{label}</a>)}
      </nav>
      <button onClick={() => input.current?.focus()} className="flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-transform hover:scale-[1.03] active:scale-[.98]">Get Started <ArrowUpRight size={16} strokeWidth={1.8} /></button>
    </header>
    <section aria-label="Reclaim your attention" className="hero-content flex flex-1 flex-col items-center justify-center px-4 pb-[200px] pt-24 text-center">
      <span id="voyages" className="nav-anchor" /><span id="worlds" className="nav-anchor" /><span id="innovation" className="nav-anchor" />
      <div className="liquid-glass mb-7 rounded-full bg-black/10 px-3 py-2 text-sm text-foreground/90" style={{ backgroundColor: 'rgba(0,0,0,.1)' }}>10K+ already subscribed</div>
      <BlurText />
      <motion.p {...reveal(.8)} className="mt-7 max-w-2xl text-[calc(1rem+3px)] leading-tight tracking-[-0.05em] text-description md:text-[calc(1.125rem+3px)]">Cut through the noise of notifications, endless feeds, and constant interruptions. Learn how to reclaim your attention and do meaningful work that truly matters.</motion.p>
      <motion.div {...reveal(1.1)} className="relative mt-8 w-full max-w-[460px]">
        <form onSubmit={submit} className="liquid-glass flex items-center gap-2 rounded-full p-1.5 pl-6" style={{ backdropFilter: 'blur(100px)', background: 'rgba(0,0,0,.25)' }}>
          <label className="sr-only" htmlFor="email">Email address</label>
          <input ref={input} id="email" type="email" name="email" autoComplete="email" required placeholder="Enter your email" onChange={() => setMessage('')} className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-white/75" />
          <button className="flex shrink-0 items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-white/90">Join Waitlist <ArrowUpRight size={16} strokeWidth={1.8} /></button>
        </form>
        <p role="status" className="absolute left-0 right-0 mt-3 text-xs text-heading">{message}</p>
      </motion.div>
    </section>
  </main>;
}

createRoot(document.getElementById('root')!).render(<React.StrictMode><App /></React.StrictMode>);
