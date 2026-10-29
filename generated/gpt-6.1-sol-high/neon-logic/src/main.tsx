import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { AnimatePresence, motion, useMotionTemplate, useScroll, useSpring, useTransform } from 'framer-motion';
import './index.css';

const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+~|}{[]:;?><';
const randomChar = () => chars[Math.floor(Math.random() * chars.length)];
const prefix = 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/';
const videos = ['hf_20260622_083515_290e5a10-0b95-41af-a5e2-32b6389baa4d.mp4', 'hf_20260622_092455_089c54f8-3b03-4966-9df1-e9746063d0ef.mp4', 'hf_20260622_095810_ecea3dd2-fc5e-4e41-8696-4219290b6589.mp4', 'hf_20260622_095750_32a52ce0-2005-45c9-9093-41f03fde9530.mp4', 'hf_20260622_080203_fd7f4f85-3a86-4837-8192-85e7bfe68e75.mp4'].map(v => prefix + v);

function ScrambleIn({ text, delay, triggered }: { text: string; delay: number; triggered: boolean }) {
  const [display, setDisplay] = useState('\u00a0');
  useEffect(() => {
    if (!triggered) { setDisplay('\u00a0'); return; }
    let interval: ReturnType<typeof setInterval>;
    const timeout = setTimeout(() => {
      let cursor = 0;
      interval = setInterval(() => {
        cursor += .5;
        setDisplay(text.split('').map((c, i) => c === ' ' ? ' ' : i < Math.floor(cursor) ? c : i < cursor + 3 ? randomChar() : '').join(''));
        if (cursor >= text.length) { clearInterval(interval); setDisplay(text); }
      }, 25);
    }, delay);
    return () => { clearTimeout(timeout); clearInterval(interval); };
  }, [text, delay, triggered]);
  return <span className="scramble-line" aria-label={text}><span aria-hidden="true">{display}</span></span>;
}
function ScrambleText({ text, isHovered, className }: { text: string; isHovered: boolean; className?: string }) {
  const [display, setDisplay] = useState(text);
  useEffect(() => {
    if (!isHovered) { setDisplay(text); return; }
    let frame = 0;
    setDisplay(text.replace(/\S/g, randomChar));
    const interval = setInterval(() => {
      frame++;
      setDisplay(text.split('').map((c, i) => c === ' ' || i < Math.floor(frame / 4) ? c : randomChar()).join(''));
      if (frame >= text.length * 4) clearInterval(interval);
    }, 25);
    return () => clearInterval(interval);
  }, [text, isHovered]);
  return <span className={className} aria-label={text}><span aria-hidden="true">{display}</span></span>;
}
function SynapseXLogo({ className = 'w-[18px] h-[18px]' }: { className?: string }) {
  return <svg className={className} viewBox="-50 -50 100 100" fill="currentColor" aria-hidden="true">{[0,90,180,270].map(r => <path key={r} transform={`rotate(${r})`} d="M 1.5,23 L 1.5,33 C 1.5,38.5 6,43 11.5,43 L 16.5,43 C 22,43 26.5,38.5 26.5,33 Q 28,28 33,26.5 C 38.5,26.5 43,22 43,16.5 L 43,11.5 C 43,6 38.5,1.5 33,1.5 L 23,1.5 Q 12,12 1.5,23 Z" />)}</svg>;
}
function SquashHamburger({ open }: { open: boolean }) {
  return <span className="menu-hamburger">{[0,1,2].map(i => <motion.span key={i} style={{ top: `${i * 50}%` }} animate={{ rotate: open ? (i === 0 ? 45 : i === 2 ? -45 : 0) : 0, top: open ? '50%' : `${i * 50}%`, opacity: open && i === 1 ? 0 : 1, scaleX: open && i === 1 ? 0 : 1 }} transition={{ type:'spring', stiffness:300, damping:20 }} />)}</span>;
}
function NavLink({ text, section, close }: { text: string; section: number; close: () => void }) {
  const [hover, setHover] = useState(false);
  return <a href={section === 1 ? '#about' : '#metrics'} onClick={e => { e.preventDefault(); window.scrollTo({ top: window.innerHeight * section, behavior:'smooth' }); close(); }} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} className="text-[13px] sm:text-base text-white/85 hover:text-white"><ScrambleText text={text} isHovered={hover}/></a>;
}
function Navbar({ entered, download }: { entered: boolean; download: () => void }) {
  const [open, setOpen] = useState(false);
  const [mobile, setMobile] = useState(window.innerWidth < 640);
  const [hover, setHover] = useState(false);
  useEffect(() => { const media = window.matchMedia('(max-width: 639px)'); const update = () => setMobile(media.matches); media.addEventListener('change', update); return () => media.removeEventListener('change', update); }, []);
  useEffect(() => { const close = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); }; window.addEventListener('keydown', close); return () => window.removeEventListener('keydown', close); }, []);
  return <motion.nav aria-label="Main navigation" className="fixed top-0 z-50 h-20 w-full flex items-center justify-between px-4 sm:px-6 md:px-8 gap-2" initial={{ opacity:0 }} animate={{ opacity:entered ? 1 : 0 }} transition={{ duration:.8 }}>
    <div className="flex items-center gap-2 min-w-0">
      <motion.a href="#" aria-label="SynapseX home" onClick={e => { e.preventDefault(); window.scrollTo({top:0,behavior:'smooth'}); setOpen(false); }} animate={mobile ? { width: open ? 0 : 124, opacity: open ? 0 : 1, paddingLeft: open ? 0 : 12, paddingRight: open ? 0 : 12, marginRight: open ? -8 : 0 } : { width:'auto', opacity:1, paddingLeft:20, paddingRight:20, marginRight:0 }} transition={{type:'spring',stiffness:350,damping:28}} tabIndex={mobile && open ? -1 : 0} className={`${open && !mobile ? 'hidden md:flex' : 'flex'} shrink-0 overflow-hidden whitespace-nowrap h-9 sm:h-12 gap-2 items-center bg-white/15 backdrop-blur-md rounded-[10px] sm:rounded-[14px]`} whileHover={{ scale:1.02, backgroundColor:'rgba(255,255,255,.22)' }} whileTap={{scale:.98}}><SynapseXLogo/><span className="text-[13px] sm:text-base font-medium tracking-tight">SynapseX</span></motion.a>
      <motion.div layout animate={{ width:open ?  (mobile ? 238 : 290) : (mobile ? 36 : 48) }} transition={{type:'spring',stiffness:350,damping:28}} className="h-9 sm:h-12 flex items-center shrink-0 bg-white/15 backdrop-blur-md rounded-[10px] sm:rounded-[14px] overflow-hidden">
        <motion.button aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} aria-controls="nav-links" onClick={() => setOpen(!open)} className={`shrink-0 flex items-center justify-center ${open ? 'w-7 h-7 sm:w-9 sm:h-9 ml-1 sm:ml-1.5 rounded-[8px] sm:rounded-[11px] bg-white/10 hover:bg-white/20' : 'w-9 h-9 sm:w-12 sm:h-12'}`}><SquashHamburger open={open}/></motion.button>
        <AnimatePresence>{open && <motion.div id="nav-links" initial={{opacity:0,x:15}} animate={{opacity:1,x:0}} exit={{opacity:0}} className="flex items-center justify-evenly flex-1 gap-4 px-4"><NavLink text="About" section={1} close={() => setOpen(false)}/><NavLink text="Metrics" section={2} close={() => setOpen(false)}/></motion.div>}</AnimatePresence>
      </motion.div>
    </div>
    <motion.button onClick={download} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} whileHover={{scale:1.03,backgroundColor:'#e2e2e6'}} whileTap={{scale:.97}} className="shrink-0 flex gap-2 items-center h-9 sm:h-12 px-3.5 sm:px-6 bg-white text-black rounded-full text-[13px] sm:text-base"><i className="bi bi-apple" aria-hidden="true"/><ScrambleText text="Download" isHovered={hover}/></motion.button>
  </motion.nav>;
}
function BackgroundVideo({ index }: { index: number }) { return <video className="video-background" src={videos[index]} autoPlay muted loop playsInline preload="auto" aria-hidden="true"/>; }
function Hero({ entered }: { entered: boolean }) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const video = ref.current!;
    let target = 0, previous: number | null = null;
    const seek = () => { if (Number.isFinite(video.duration) && !video.seeking && Math.abs(video.currentTime-target) > .02) video.currentTime = target; };
    const move = (e: MouseEvent) => { if (previous === null) { previous = e.clientX; return; } const delta = e.clientX - previous; previous = e.clientX; if (Number.isFinite(video.duration)) { target = Math.max(0, Math.min(video.duration-.05, target + delta / window.innerWidth * video.duration * .8)); seek(); } };
    const reset = () => { previous = null; };
    video.pause(); video.addEventListener('seeked', seek); window.addEventListener('mousemove', move); document.addEventListener('mouseleave', reset);
    return () => { video.removeEventListener('seeked',seek); window.removeEventListener('mousemove',move); document.removeEventListener('mouseleave',reset); };
  }, []);
  return <section aria-label="SynapseX introduction" className="relative h-screen h-[100dvh] overflow-hidden">
    <video ref={ref} src={videos[0]} className="video-background" muted playsInline preload="auto" aria-hidden="true"/>
    <div className="absolute inset-0 pointer-events-none opacity-[.05]" style={{backgroundImage:'radial-gradient(#ffffff 1px, transparent 1px)',backgroundSize:'24px 24px'}}/>
    <div className="watermark" aria-hidden="true">TRANSCENDENCE</div>
    <motion.div initial={{opacity:0}} animate={{opacity:entered ? 1 : 0}} transition={{duration:1}} className="relative z-10 h-full flex flex-col px-4 sm:px-6 md:px-8 pt-20 sm:pt-24 pb-8 sm:pb-12">
      <div className="flex-1"/>
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div className="flex flex-col gap-4"><h1 className="hero-heading"><ScrambleIn text="Brain" delay={200} triggered={entered}/><br/><ScrambleIn text="And Body" delay={500} triggered={entered}/></h1>
          <motion.p initial={{y:25,opacity:0}} animate={entered ? {y:0,opacity:1} : {}} transition={{duration:.9,ease:[.215,.610,.355,1],delay:.2}} className="max-w-sm text-[13px] sm:text-[15px] text-white/60 leading-relaxed">Built at the intersection of neuroscience and artificial intelligence. SynapseX continuously maps neural pathways, cognitive load, and physiological states into a single adaptive intelligence layer.</motion.p></div>
        <h2 className="hero-heading text-left md:text-right"><ScrambleIn text="One" delay={700} triggered={entered}/><br/><ScrambleIn text="Network" delay={1000} triggered={entered}/></h2>
      </div>
    </motion.div>
  </section>;
}
function Cinematic() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target:ref, offset:['start end','end start'] });
  const progress = useSpring(scrollYProgress,{stiffness:15,damping:32,mass:1.8});
  const y = useTransform(progress,[0,1],[60,-120]);
  const opacity = useTransform(progress,[.3,.5],[0,1]);
  const transform = useMotionTemplate`rotateX(24deg) translateY(${y}px) translateZ(15px)`;
  return <section id="about" ref={ref} className="relative h-screen h-[100dvh] flex items-center justify-center overflow-hidden"><BackgroundVideo index={1}/><div className="absolute top-0 inset-x-0 h-[180px] z-10 bg-gradient-to-b from-[#010103] to-transparent"/><div className="relative z-20 max-w-5xl" style={{perspective:'400px'}}><motion.p style={{transform,opacity}} className="font-sans font-normal text-[22px] sm:text-[30px] md:text-[36px] lg:text-[42px] text-white leading-[1.35] tracking-[-.02em] select-none px-6 sm:px-12 text-center">A neural-AI interface built on the architecture of the human nervous system. SynapseX translates synaptic activity into computational intelligence. Every signal becomes measurable, structured, and visible. It continuously reconstructs internal state as a dynamic neural map. Biological noise is filtered into actionable cognitive patterns.</motion.p></div></section>;
}
const reveal = {hidden:{opacity:0,y:30},visible:{opacity:1,y:0}};
function Metrics() { return <section id="metrics" className="relative min-h-screen flex items-center justify-center overflow-hidden py-32 px-6"><BackgroundVideo index={2}/><div className="relative w-full max-w-6xl text-center"><motion.h2 initial={{opacity:0}} whileInView={{opacity:1}} viewport={{once:true,amount:.3}} transition={{duration:1.2}} className="text-white/40 text-[13px] sm:text-[14px] tracking-[.2em] uppercase mb-20">Performance Metrics</motion.h2><div className="grid md:grid-cols-3 gap-16 md:gap-8">{[['2.4ms','Synaptic Latency'],['99.7%','Signal Accuracy'],['140B','Neural Parameters']].map(([value,label],i) => <motion.div key={value} variants={reveal} initial="hidden" whileInView="visible" viewport={{once:true,amount:.3}} transition={{duration:.8,delay:i*.15}}><p className="text-white text-[clamp(48px,10vw,96px)] font-light tracking-[-.04em] leading-none">{value}</p><p className="text-white/40 text-[13px] sm:text-[15px] mt-4 tracking-wide">{label}</p></motion.div>)}</div></div></section>; }
const features = [['Cortical Mapping','Real-time spatial reconstruction of active neural regions.'],['Signal Isolation','Separates cognitive intent from biological noise.'],['State Prediction','Anticipates cognitive transitions before they occur.'],['Loop Feedback','Closed-loop adjustment based on outcome correlation.']];
function Technology() { return <section className="relative h-screen h-[100dvh] min-h-[700px] overflow-hidden flex flex-col px-8 sm:px-12 md:px-16 py-12 sm:py-16"><BackgroundVideo index={3}/><div className="relative flex flex-col md:flex-row md:justify-between md:items-start gap-6"><motion.h2 initial={{opacity:0,y:40}} whileInView={{opacity:1,y:0}} viewport={{once:true,amount:.3}} transition={{duration:1}} className="text-white font-light text-[clamp(36px,8vw,72px)] leading-[.95] tracking-[-.03em]">Adaptive<br/>Intelligence</motion.h2><motion.p initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:1,delay:.2}} className="text-white/50 text-[13px] sm:text-[15px] leading-relaxed max-w-xs md:text-right md:pt-2">The system learns your neural baseline within 72 hours. From there, every cognitive state is mapped, predicted, and optimized in real time.</motion.p></div><div className="flex-1"/><motion.div initial={{opacity:0}} whileInView={{opacity:1}} viewport={{once:true}} transition={{duration:1,delay:.3}} className="relative grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-6">{features.map(([title,desc],i) => <motion.div key={title} initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:.7,delay:i*.1}}><h3 className="text-white text-[14px] sm:text-[16px] font-normal mb-2">{title}</h3><p className="text-white/40 text-[12px] sm:text-[14px] leading-relaxed">{desc}</p></motion.div>)}</motion.div></section>; }
function Architecture() { return <section className="min-h-screen bg-black flex items-center justify-center px-6 py-32"><div className="w-full max-w-3xl text-center"><motion.div variants={reveal} initial="hidden" whileInView="visible" viewport={{once:true,amount:.4}} transition={{duration:1}}><p className="text-white/40 text-[13px] sm:text-[14px] tracking-[.2em] uppercase mb-8">Architecture</p><h2 className="text-white font-light text-[clamp(28px,6vw,56px)] leading-[1.15] tracking-[-.02em] mb-10">Three layers. Zero friction.</h2><p className="text-white/45 text-[15px] sm:text-[17px] leading-relaxed max-w-xl mx-auto">Sensor layer captures raw bioelectric signals. Processing layer isolates intent. Interface layer delivers structured output to any connected system.</p></motion.div><motion.div initial={{opacity:0}} whileInView={{opacity:1}} viewport={{once:true,amount:.4}} transition={{duration:1.2,delay:.4}} className="mt-20 flex flex-col items-center gap-4">{['Capture','Process','Interface'].map((label,i) => <div key={label} className="w-full max-w-md h-[72px] border border-white/10 rounded-lg flex items-center justify-between px-6"><span className="text-white/30 text-[12px] tracking-[.15em] uppercase">Layer {i+1}</span><span className="text-white text-[16px] sm:text-[18px] font-light">{label}</span></div>)}</motion.div></div></section>; }
function Footer() { return <footer className="bg-black overflow-hidden flex flex-col md:flex-row min-h-[400px]"><div className="relative md:w-1/2 h-[300px] md:h-auto"><BackgroundVideo index={4}/></div><div className="md:w-1/2 flex flex-col justify-between p-10 sm:p-16"><div><div className="flex items-center gap-2 text-white/70 mb-8"><SynapseXLogo/><span className="text-[15px] font-medium tracking-tight">SynapseX</span></div><p className="text-white/40 text-[14px] sm:text-[15px] leading-relaxed max-w-sm">The next evolution of human-machine interaction. Built for those who refuse to be limited by biology alone.</p></div><p className="text-white/25 text-[12px] mt-12">(c) 2026 SynapseX Labs. All rights reserved.</p></div></footer>; }
function App() {
  const [entered,setEntered] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => { const timer = setTimeout(() => setEntered(true),800); return () => clearTimeout(timer); },[]);
  return <div style={{fontFamily:'"Space Mono", monospace'}}><Navbar entered={entered} download={() => dialog.current?.showModal()}/><main><Hero entered={entered}/><Cinematic/><Metrics/><Technology/><Architecture/></main><Footer/><dialog ref={dialog} onClick={e => { if (e.target === dialog.current) dialog.current.close(); }} className="m-auto w-[calc(100%-32px)] max-w-md rounded-2xl border border-white/20 bg-black p-8 text-white backdrop:bg-black/80"><h2 className="text-xl mb-4">SynapseX for macOS</h2><p className="text-sm text-white/60 leading-relaxed">The download is not available in this preview.</p><form method="dialog"><button autoFocus className="mt-8 rounded-full bg-white text-black px-6 py-2 text-sm">Close</button></form></dialog></div>;
}
createRoot(document.getElementById('root')!).render(<React.StrictMode><App/></React.StrictMode>);
