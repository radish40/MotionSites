import React, { useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import { Globe, Leaf, Play, Pause, ArrowRight, MapPin, RefreshCw, Square, PlusCircle, Grid2X2, Sparkles } from 'lucide-react';
import clsx, { type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import './styles.css';

const cn = (...values: ClassValue[]) => twMerge(clsx(values));
const asset = (file: string) => `${import.meta.env.BASE_URL}assets/${file}`;

function StaggeredFade({ text, className }: { text: string; className?: string }) {
  const ref = useRef<HTMLHeadingElement>(null);
  const visible = useInView(ref, { once: true });
  const reduced = useReducedMotion();
  let index = 0;
  return <h1 ref={ref} aria-label={text} className={className}>{text.split(' ').map((word, w) => <React.Fragment key={w}><span className="inline-block" aria-hidden="true">{Array.from(word).map(letter => {
    const i = index++;
    return <motion.span key={i} initial={{ opacity: 0 }} animate={{ opacity: visible ? 1 : 0 }} transition={{ duration: reduced ? 0 : 0.3, delay: reduced ? 0 : i * 0.03 }} className="inline-block">{letter}</motion.span>;
  })}</span>{w < text.split(' ').length - 1 && ' '}</React.Fragment>)}</h1>;
}
function FadeDown({ children, delay, className }: { children: React.ReactNode; delay: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const visible = useInView(ref, { once: true });
  const reduced = useReducedMotion();
  return <motion.div ref={ref} initial={{ opacity: 0, y: -20 }} animate={visible ? { opacity: 1, y: 0 } : {}} transition={{ duration: reduced ? 0 : 0.6, delay: reduced ? 0 : delay }} className={className}>{children}</motion.div>;
}
const companies = ['Retool', 'remote', 'ARC', 'Raycast', 'runway', 'ramp', 'HEX', 'Vercel', 'descript'];
function App() {
  const video = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(true);
  const toggleVideo = async () => {
    if (!video.current) return;
    if (video.current.paused) { try { await video.current.play(); setPlaying(true); } catch { setPlaying(false); } }
    else { video.current.pause(); setPlaying(false); }
  };
  return <main className="relative flex h-screen min-h-0 flex-col overflow-hidden bg-[#F5F3EE] font-sans text-gray-900">
    <video ref={video} className="fixed inset-0 z-0 h-full w-full object-cover" src={asset('energy.mp4')} autoPlay muted loop playsInline onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} aria-label="Renewable energy landscape" />
    <nav aria-label="Main navigation" className="relative z-10 flex items-center justify-between px-4 py-4 md:px-8 md:py-6">
      <div className="flex items-center gap-5 md:gap-8"><a href="#" className="text-lg font-semibold tracking-[-0.04em] md:text-xl">EcoVolta</a><button type="button" aria-label="Language: English" className="flex items-center gap-1.5 text-xs md:text-sm"><Globe size={16}/><span>En</span></button></div>
      <div className="hidden items-center gap-8 lg:flex">{['Renewables', 'Strategies', 'Photovoltaic', 'Wind Systems', 'Packages'].map(item => <a key={item} href="#" className="text-sm text-gray-700 transition-colors hover:text-gray-900">{item}</a>)}</div>
      <div className="flex items-center gap-2 md:gap-3"><a href="#" className="hidden rounded-full border border-black/20 px-4 py-2 text-sm transition-colors hover:bg-white/40 sm:block md:px-6 md:py-2.5">Sign In</a><button className="rounded-full bg-black px-4 py-2 text-xs text-white transition-colors hover:bg-[#31463B] md:px-6 md:py-2.5 md:text-sm">Clean Energy</button></div>
    </nav>
    <section className="relative z-10 flex flex-1 flex-col items-center px-4 pt-4 md:px-8 md:pt-8" aria-label="Renewable power">
      <div className="mb-5 flex items-center gap-2 rounded-full border border-black/20 px-3 py-2 text-xs md:mb-6 md:gap-2.5 md:px-4 md:text-sm"><span className="emoji">☀️</span><span className="text-black/50">→</span><span className="emoji">🌍</span><span className="sm:hidden">Power innovate</span><span className="hidden sm:inline">Delivering power innovate</span><span className="text-black/50">→</span><span className="emoji">🌱</span></div>
      <StaggeredFade text="Renewable Power For Tomorrow, Infinite Clean Solutions" className="mb-3 max-w-5xl text-center text-3xl font-normal leading-tight tracking-[-0.045em] text-[#31463B] sm:text-4xl md:mb-4 md:text-5xl lg:text-6xl"/>
      <FadeDown delay={0.5} className="mb-4 max-w-3xl md:mb-5"><p className="text-center text-sm leading-relaxed text-gray-600 md:text-base lg:text-lg">Sustainable Energy Platform. Engineering, deploying, and servicing solar arrays for homes, businesses, and large-scale operations worldwide.</p></FadeDown>
      <FadeDown delay={0.7} className="flex flex-col items-center gap-3 sm:flex-row"><button className="group flex items-center gap-3 rounded-full bg-gradient-to-r from-[#3C684D] to-[#4A7144] py-2 pl-5 pr-2 text-sm text-white shadow-sm transition-transform hover:scale-[1.03] md:py-2.5 md:pl-6"><Leaf size={16}/><span>Explore Options</span><span className="ml-3 flex h-7 w-7 items-center justify-center rounded-full bg-[linear-gradient(59deg,#567A5E_0%,#78A873_100%)] md:h-8 md:w-8"><Play size={13} fill="currentColor"/></span></button><button className="group flex items-center gap-7 rounded-full bg-white py-2 pl-6 pr-2 text-sm text-gray-700 shadow-sm transition-transform hover:scale-[1.03] md:py-2.5"><span>Start Network</span><span className="flex h-7 w-7 items-center justify-center rounded-full bg-[linear-gradient(59deg,#EEEEEE_0%,#CBCBCB_100%)] text-black md:h-8 md:w-8"><ArrowRight size={17}/></span></button></FadeDown>
    </section>
    <aside className="absolute bottom-24 left-8 z-10 hidden md:block" aria-label="Location"><div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-white"><MapPin size={20} className="text-[#4A7C5A]"/></div><p className="text-sm font-medium">4521 Sunvalley,</p><p className="mt-1 text-sm text-gray-600">Rd7, USA</p></aside>
    <div className="absolute bottom-20 left-1/2 z-10 flex -translate-x-1/2 items-center gap-2.5 whitespace-nowrap md:bottom-24"><button onClick={toggleVideo} className="liquid-glass flex h-9 w-9 items-center justify-center rounded-full text-white md:h-10 md:w-10" aria-label={playing ? 'Pause background video' : 'Play background video'}>{playing ? <Play size={14} fill="currentColor"/> : <Pause size={14} fill="currentColor"/>}</button><span className="text-xs font-medium text-white md:text-sm">Clean Power System</span></div>
    <aside className="absolute bottom-48 right-8 z-10 hidden flex-col items-center lg:flex" aria-label="37 thousand deployments"><div className="relative mb-3 h-16 w-28"><img src={asset('avatar-left.webp')} alt="EcoVolta team member" className="absolute left-0 top-3 z-0 h-10 w-10 rounded-full object-cover"/><img src={asset('avatar-right.webp')} alt="EcoVolta team member" className="absolute right-0 top-3 z-0 h-10 w-10 rounded-full object-cover"/><img src={asset('avatar-center.webp')} alt="EcoVolta team member" className="absolute left-1/2 z-10 h-16 w-16 -translate-x-1/2 rounded-full border-4 border-white object-cover"/></div><p className="mb-4 text-sm font-medium">+ 37k Deployments</p><div className="flex items-center gap-3" aria-hidden="true">{[RefreshCw, Square, PlusCircle, Grid2X2, Sparkles].map((Icon, i) => <Icon size={20} key={i}/>)}</div></aside>
    <footer className="relative z-10 overflow-hidden pb-6 md:pb-8" aria-label="Our partners"><div className="marquee flex w-max">{[0, 1].map(copy => <div key={copy} aria-hidden={copy === 1} className="flex shrink-0 items-center gap-8 pr-8 md:gap-16 md:pr-16">{companies.map(name => <span key={name} className={cn('whitespace-nowrap text-base font-medium tracking-[-0.04em] text-gray-400 md:text-xl', name === 'ARC' && 'tracking-[0.06em]')}>{name}</span>)}</div>)}</div><div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-[#F5F3EE] to-transparent md:w-32"/><div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-[#F5F3EE] to-transparent md:w-32"/></footer>
  </main>;
}
createRoot(document.getElementById('root')!).render(<React.StrictMode><App/></React.StrictMode>);
