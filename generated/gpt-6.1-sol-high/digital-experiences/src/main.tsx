import React, { useEffect, useRef, useState, type CSSProperties } from 'react';
import { createRoot } from 'react-dom/client';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import './index.css';

const HERO_VIDEO = 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260619_191346_9d19d66e-86a4-47f7-8dc6-712c1788c3b2.mp4';
const CAPABILITIES_VIDEO = 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260622_093722_ccfc7ebf-182f-419f-8a62-2dc02db7dd9d.mp4';

function FadingVideo({ src, className, style, fallback }: { src: string | string[]; className?: string; style?: CSSProperties; fallback?: string }) {
  const sources = Array.isArray(src) ? src : [src];
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(false);
  const [local, setLocal] = useState(false);
  const video = useRef<HTMLVideoElement>(null);
  const frame = useRef(0);
  const reveal = () => { cancelAnimationFrame(frame.current); frame.current = requestAnimationFrame(() => setVisible(true)); };
  useEffect(() => () => cancelAnimationFrame(frame.current), []);
  return <video ref={video} src={local ? fallback : sources[index]} className={className} aria-hidden="true" tabIndex={-1}
    style={{ ...style, opacity: visible ? 1 : 0, transition: `opacity ${visible ? 500 : 550}ms ease` }}
    autoPlay muted playsInline preload="auto" onLoadedData={reveal}
    onError={() => { if (fallback && !local) setLocal(true); }}
    onTimeUpdate={e => { const v = e.currentTarget; if (v.duration - v.currentTime <= .55) setVisible(false); }}
    onEnded={() => { if (sources.length > 1) { setVisible(false); setIndex(i => (i + 1) % sources.length); } else if (video.current) { video.current.currentTime = 0; void video.current.play().then(reveal).catch(() => {}); } }} />;
}

function BlurText({ text, className }: { text: string; className?: string }) {
  const ref = useRef<HTMLHeadingElement>(null);
  const visible = useInView(ref, { amount: .1, once: true });
  const reduced = useReducedMotion();
  return <h1 ref={ref} className={`blur-text ${className ?? ''}`} aria-label={text}>
    {text.split(' ').map((word, i) => <motion.span key={i} aria-hidden="true" style={{ display: 'inline-block', marginRight: '.28em' }}
      initial={reduced ? false : { filter: 'blur(10px)', opacity: 0, y: 50 }}
      animate={visible ? { filter: 'blur(0px)', opacity: 1, y: 0 } : {}}
      transition={{ duration: reduced ? 0 : .7, delay: reduced ? 0 : i * .1, ease: 'easeOut' }}>{word}</motion.span>)}
  </h1>;
}

function Icon({ name, className = '' }: { name: 'arrow' | 'play' | 'clock' | 'globe' | 'image' | 'movie' | 'bulb' | 'close'; className?: string }) {
  const stroke = ['arrow', 'clock', 'globe', 'close'].includes(name);
  return <svg className={`icon ${className}`} width="24" height="24" viewBox="0 0 24 24" fill={stroke ? 'none' : 'currentColor'} stroke={stroke ? 'currentColor' : 'none'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {name === 'arrow' && <><path d="M7 17L17 7"/><path d="M7 7h10v10"/></>}
    {name === 'play' && <polygon points="6 4 20 12 6 20 6 4"/>}
    {name === 'clock' && <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>}
    {name === 'globe' && <><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a18 18 0 0 1 0 18M12 3a18 18 0 0 0 0 18"/></>}
    {name === 'image' && <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2ZM8.5 6A1.5 1.5 0 1 1 8.5 9a1.5 1.5 0 0 1 0-3ZM5 18l4-5 3 3 4-6 3 8H5Z"/>}
    {name === 'movie' && <path d="m18 4 2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4a2 2 0 0 0-2 2v14c0 1.1.9 2 2 2h16a2 2 0 0 0 2-2V4h-4ZM4 10h16v10H4V10Z"/>}
    {name === 'bulb' && <path d="M9 21h6v-1H9v1Zm3-20a7 7 0 0 0-4 12.74V17a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-3.26A7 7 0 0 0 12 1Zm2.85 11.1-.85.6V16h-4v-3.3l-.85-.6A5 5 0 1 1 14.85 12.1Z"/>}
    {name === 'close' && <path d="m6 6 12 12M6 18 18 6"/>}
  </svg>;
}

const entrance = { initial: { filter: 'blur(10px)', opacity: 0, y: 20 }, animate: { filter: 'blur(0px)', opacity: 1, y: 0 } };
const services = [
  { title: 'Design', id: 'design', icon: 'image' as const, tags: ['Brand Systems', 'Art Direction', 'Visual Identity', 'Motion'], body: 'We shape identities and interfaces that feel unmistakably yours — typographic systems, component libraries, and art-directed pages that scale without losing soul.' },
  { title: 'Engineering', id: 'engineering', icon: 'movie' as const, tags: ['React', 'Next.js', 'Headless CMS', 'Edge-Ready'], body: 'Production-grade front-ends built on modern stacks. Performant, accessible, and instrumented — with code your team will enjoy extending long after launch.' },
  { title: 'Growth', id: 'growth', icon: 'bulb' as const, tags: ['SEO', 'Analytics', 'A/B Testing', 'Retention'], body: 'Launch is the starting line. We partner with your team on conversion, content, and iteration loops that turn a beautiful site into a compounding asset.' },
];

function App() {
  const [modal, setModal] = useState<'project' | 'reel' | null>(null);
  const [copied, setCopied] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const reduced = useReducedMotion();
  const reveal = (delay: number) => ({ ...(reduced ? {} : entrance), transition: { duration: .8, delay: reduced ? 0 : delay, ease: 'easeOut' as const } });
  useEffect(() => {
    if (modal) { dialog.current?.showModal(); document.body.style.overflow = 'hidden'; }
    else { dialog.current?.close(); document.body.style.overflow = ''; }
    return () => { document.body.style.overflow = ''; };
  }, [modal]);
  const project = () => { setCopied(false); setModal('project'); };
  return <>
    <a className="skip-link" href="#capabilities">Skip to capabilities</a>
    <nav className="fixed top-4 left-0 right-0 z-50 flex items-center justify-between px-8 lg:px-16" aria-label="Main navigation">
      <a href="#home" aria-label="Digital Experiences home" className="liquid-glass logo flex h-12 w-12 items-center justify-center rounded-full font-heading text-2xl italic">a</a>
      <div className="liquid-glass nav-pill hidden items-center rounded-full px-1.5 py-1.5 md:flex">
        {[['Work', '#design'], ['Studio', '#capabilities'], ['Services', '#capabilities'], ['Journal', '#growth']].map(([title, href]) => <a key={title} href={href} className="nav-link px-3 py-2 font-body text-sm font-medium text-white/90">{title}</a>)}
        <button onClick={project} className="nav-link px-3 py-2 font-body text-sm font-medium text-white/90">Contact</button>
        <button onClick={project} className="nav-cta ml-3 flex items-center gap-3 rounded-full bg-white px-4 py-2 text-sm font-medium text-black">Start a Project <Icon name="arrow" className="!h-4 !w-4"/></button>
      </div>
      <div className="h-12 w-12" aria-hidden="true"/>
    </nav>
    <main>
      <section id="home" className="hero relative h-screen overflow-hidden bg-black">
        <FadingVideo src={HERO_VIDEO} fallback={`${import.meta.env.BASE_URL}assets/hero.mp4`} className="absolute left-1/2 top-0 z-0 -translate-x-1/2 object-cover object-top" style={{ width: '120%', height: '120%' }}/>
        <div className="hero-content relative z-10 flex h-full flex-col">
          <div className="hero-main flex flex-1 flex-col items-center justify-center px-4 pt-24 text-center">
            <motion.div {...reveal(.4)} className="liquid-glass booking-badge flex items-center gap-3 rounded-full py-1.5 pl-1.5 pr-4 text-xs font-normal md:text-sm"><span className="rounded-full bg-white px-2.5 py-1 text-xs font-medium text-black">New</span><span>Booking Q3 2026 engagements — limited capacity</span></motion.div>
            <BlurText text="Crafted Digital Experiences Built to Outlast Trends" className="mt-6 max-w-3xl font-heading text-6xl italic leading-[0.8] tracking-[-4px] text-white md:text-7xl lg:text-[5.5rem]"/>
            <motion.p {...reveal(.8)} className="hero-description mt-4 max-w-2xl font-body text-sm font-light leading-tight text-white md:text-base">We are a small studio of designers and engineers shaping brand-defining websites for ambitious companies. Precise typography, cinematic motion, and code you can be proud of.</motion.p>
            <motion.div {...reveal(1.1)} className="mt-6 flex items-center gap-6 text-sm">
              <button onClick={project} className="liquid-glass-strong action-button flex items-center gap-3 rounded-full px-5 py-2.5">Start a Project <Icon name="arrow" className="!h-4 !w-4"/></button>
              <button onClick={() => setModal('reel')} className="showreel-button flex items-center gap-2 py-2.5">Watch Showreel <Icon name="play" className="!h-3 !w-3"/></button>
            </motion.div>
            <motion.div {...reveal(1.3)} className="stats mt-8 flex gap-4 text-left">
              <div className="liquid-glass stat-card w-[220px] rounded-[1.25rem] p-5"><Icon name="clock"/><p className="mt-4 font-heading text-4xl italic leading-none tracking-[-1px]">6 Weeks</p><p className="mt-2 text-xs font-light text-white/90">Average End-to-End Launch Time</p></div>
              <div className="liquid-glass stat-card w-[220px] rounded-[1.25rem] p-5"><Icon name="globe"/><p className="mt-4 font-heading text-4xl italic leading-none tracking-[-1px]">140+</p><p className="mt-2 text-xs font-light text-white/90">Brands Shipped Across Four Continents</p></div>
            </motion.div>
          </div>
          <motion.div {...reveal(1.4)} className="trust-bar flex flex-col items-center gap-4 px-4 pb-8">
            <p className="liquid-glass rounded-full px-4 py-2 text-xs font-light">Trusted by founders, operators, and creative directors worldwide</p>
            <div className="brand-row flex items-center gap-12 md:gap-16" aria-label="Trusted brands">{['Aeon', 'Vela', 'Apex', 'Orbit', 'Zeno'].map(brand => <span key={brand} className="font-heading text-2xl italic tracking-tight md:text-3xl">{brand}</span>)}</div>
          </motion.div>
        </div>
      </section>
      <section id="capabilities" className="relative min-h-screen overflow-hidden bg-black">
        <FadingVideo src={CAPABILITIES_VIDEO} fallback={`${import.meta.env.BASE_URL}assets/capabilities.mp4`} className="absolute inset-0 z-0 h-full w-full object-cover"/>
        <div className="capabilities-content relative z-10 flex min-h-screen flex-col px-8 pb-10 pt-24 md:px-16 lg:px-20">
          <header className="mb-auto"><p className="mb-6 font-body text-sm text-white/80">// Capabilities</p><motion.h2 initial={reduced ? false : { opacity: 0, y: 25, filter: 'blur(10px)' }} whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }} viewport={{ once: true, amount: .1 }} transition={{ duration: .8 }} className="font-heading text-6xl italic leading-[0.9] tracking-[-3px] md:text-7xl lg:text-[6rem]">Studio craft,<br/>end to end</motion.h2></header>
          <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-3">
            {services.map((service, index) => <motion.article id={service.id} key={service.title} initial={reduced ? false : { opacity: 0, y: 25, filter: 'blur(10px)' }} whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }} viewport={{ once: true, amount: .1 }} transition={{ duration: .8, delay: index * .12 }} className="liquid-glass capability-card flex min-h-[360px] scroll-mt-24 flex-col rounded-[1.25rem] p-6">
              <div className="flex items-start justify-between gap-4"><div className="liquid-glass flex h-11 w-11 shrink-0 items-center justify-center rounded-[0.75rem]"><Icon name={service.icon}/></div><div className="flex flex-wrap justify-end gap-1.5">{service.tags.map(tag => <span key={tag} className="liquid-glass whitespace-nowrap rounded-full px-3 py-1 font-body text-[11px] text-white/90">{tag}</span>)}</div></div>
              <div className="flex-1"/>
              <h3 className="mb-3 font-heading text-3xl italic leading-none tracking-[-1px] md:text-4xl">{service.title}</h3>
              <p className="max-w-[32ch] font-body text-sm font-light leading-snug text-white/90">{service.body}</p>
            </motion.article>)}
          </div>
        </div>
      </section>
    </main>
    <dialog ref={dialog} className={`studio-dialog ${modal === 'reel' ? 'reel-dialog' : ''}`} onCancel={() => setModal(null)} onClick={e => { if (e.target === e.currentTarget) setModal(null); }} aria-labelledby="dialog-title">
      <button className="dialog-close liquid-glass" onClick={() => setModal(null)} aria-label="Close dialog"><Icon name="close"/></button>
      {modal === 'reel' ? <><h2 id="dialog-title" className="mb-5 font-heading text-4xl italic">A glimpse of the studio</h2><video controls autoPlay playsInline src={HERO_VIDEO} className="w-full rounded-xl" /></> : <><p className="mb-5 text-sm text-white/80">// Start a Project</p><h2 id="dialog-title" className="mb-5 font-heading text-5xl italic tracking-tight">What are you imagining?</h2><p className="mb-6 text-sm font-light text-white/80">Put your ideas into a brief, ready to share with your team.</p><form onSubmit={async e => { e.preventDefault(); const data = new FormData(e.currentTarget); const brief = `Project brief\n\nName: ${data.get('name')}\nEmail: ${data.get('email')}\n\n${data.get('brief')}`; try { await navigator.clipboard.writeText(brief); setCopied(true); } catch { setCopied(false); } }}><label>Your name<input name="name" autoComplete="name" required placeholder="Alex Morgan"/></label><label>Email address<input name="email" type="email" autoComplete="email" required placeholder="alex@company.com"/></label><label>A little about your project<textarea name="brief" required rows={3} placeholder="The ambition, the challenge, the timeline…"/></label><button className="mt-2 flex w-full items-center justify-center gap-3 rounded-full bg-white px-5 py-3 text-sm font-medium text-black" type="submit">{copied ? 'Project brief copied' : 'Copy project brief'}<Icon name="arrow"/></button><p className="mt-3 text-xs text-white/60" role="status">{copied ? 'Ready to paste and share. Your details have not been submitted.' : 'Your brief stays in your browser. No details are submitted.'}</p></form></>}
    </dialog>
  </>;
}

createRoot(document.getElementById('root')!).render(<React.StrictMode><App/></React.StrictMode>);
