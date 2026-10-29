import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import Hls from 'hls.js';
import './index.css';

const asset = name => `${import.meta.env.BASE_URL}assets/${name}`;
const contact = subject => `mailto:hello@viralmedia.agency?subject=${encodeURIComponent(subject)}`;
const projects = [
 ['Nova Finance', 'Brand & Web Design', 'nova.gif'],
 ['Pulse Health', 'AI Web Development', 'pulse.gif'],
 ['Drift Studios', 'Website Optimization', 'drift.gif'],
 ['Arc Commerce', 'Brand & Development', 'arc.gif'],
];
const aboutText = 'We blend artificial intelligence with human creativity to craft digital experiences that captivate, convert, and scale — building ambitious brands that truly thrive and lead in the modern web.';
function Word({ children, progress, range }) {
 const opacity = useTransform(progress, range, [0.15, 1]);
 return <motion.span style={{ opacity }} className="inline-block mr-[.25em]">{children}</motion.span>;
}
function ScrollRevealText() {
 const ref = useRef(null);
 const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.9', 'start 0.3'] });
 const words = aboutText.split(' ');
 return <p ref={ref} className="text-3xl md:text-4xl lg:text-5xl font-medium tracking-[-1px] leading-relaxed" aria-label={aboutText}>{words.map((word, i) => <Word key={i} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]}>{word}</Word>)}</p>;
}
function BackgroundVideo({ src, className = '', hls = false, label }) {
 const ref = useRef(null);
 const reduced = useReducedMotion();
 useEffect(() => {
  const video = ref.current;
  if (!hls) return;
  const stream = 'https://stream.mux.com/4IMYGcL01xjs7ek5ANO17JC4VQVUTsojZlnw4fXzwSxc.m3u8';
  if (Hls.isSupported()) { const player = new Hls({ maxMaxBufferLength: 30 }); player.loadSource(stream); player.attachMedia(video); return () => player.destroy(); }
  else if (video.canPlayType('application/vnd.apple.mpegurl')) { video.src = stream; }
 }, [hls]);
 return <video ref={ref} src={hls ? undefined : src} className={`background-video ${className}`} autoPlay={!reduced} loop muted playsInline preload="auto" onError={event => { if (!hls && !event.currentTarget.src.endsWith("hero.mp4")) event.currentTarget.src = asset("hero.mp4"); }} aria-label={label} />;
}
function Subscribe() {
 const [status, setStatus] = useState('');
 function submit(event) {
  event.preventDefault();
  const email = new FormData(event.currentTarget).get('email');
  setStatus('Complete your subscription request in your email app.');
  window.location.href = `${contact('Newsletter subscription')}&body=${encodeURIComponent(`Please subscribe ${email} to VIRALMEDIA updates.`)}`;
 }
 return <div className="w-full max-w-lg mt-8"><form onSubmit={submit} className="liquid-glass rounded-full p-1.5 md:p-2 flex gap-2" aria-label="Subscribe to updates"><input name="email" type="email" required aria-label="Email address" placeholder="Enter your email" className="min-w-0 flex-1 bg-transparent pl-5 text-sm outline-none placeholder:text-white/60"/><motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }} className="rounded-full bg-foreground text-background px-6 md:px-8 py-3.5 text-xs font-semibold tracking-wide" type="submit">SUBSCRIBE</motion.button></form><p role="status" className="text-xs text-muted-foreground mt-3 min-h-4">{status}</p></div>;
}
function App() {
 const [scrolled, setScrolled] = useState(false);
 useEffect(() => { const update = () => setScrolled(window.scrollY > 40); window.addEventListener('scroll', update, { passive: true }); return () => window.removeEventListener('scroll', update); }, []);
 return <>
  <header className={`navbar fixed top-0 inset-x-0 z-50 px-8 py-6 flex items-center justify-between ${scrolled ? 'is-scrolled' : ''}`}>
   <a href="#home" className="text-xl font-semibold tracking-tight" aria-label="VIRALMEDIA home">VIRALMEDIA</a>
   <nav aria-label="Main navigation" className="hidden md:flex">{[['Work','work'],['Services','services'],['About','about'],['Blog','company'],['Contact','contact']].map(([label,id]) => <a key={id} href={`#${id}`} className="px-4 py-2 text-sm font-medium rounded-sm hover:bg-white/10 transition-colors">{label}</a>)}</nav>
   <a href="#contact" className="liquid-glass-strong rounded-full px-6 py-2.5 text-sm font-medium">Get Started</a>
  </header>
  <main>
   <section id="home" className="hero relative w-full h-screen overflow-hidden">
    <BackgroundVideo src={asset('hero.mp4')} className="hero-video" label="Surreal purple and pink landscape"/>
    <div className="absolute inset-x-0 bottom-0 h-60 bg-gradient-to-t from-background to-transparent"/>
    <div className="hero-content relative z-10 h-full flex flex-col justify-end items-center text-center px-6 pb-10 md:pb-20">
     <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.8 }} className="flex flex-col items-center w-full">
      <div className="flex items-center gap-3 mb-6"><div className="flex -space-x-2">{[1,2,3].map(i => <img key={i} src={asset(`avatar${i}.jpg`)} alt="" className="w-8 h-8 rounded-full border-2 border-background object-cover"/>)}</div><span className="text-muted-foreground text-sm">7,000+ brands already transformed</span></div>
      <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-medium tracking-[-1px] md:tracking-[-2px] leading-[1.1]">Build Stunning with <span className="font-accent italic font-normal">AI Magic</span></h1>
      <p className="text-sm md:text-lg text-muted-foreground whitespace-normal md:whitespace-nowrap mt-5">AI-powered websites crafted for beauty, speed, and lasting performance.</p>
      <Subscribe/>
     </motion.div>
    </div>
   </section>
   <section id="about" className="bg-background py-32 px-8"><div className="max-w-4xl mx-auto text-center"><ScrollRevealText/></div></section>
   <section id="work" className="work-section relative z-10 bg-background py-32 pb-16 px-8 max-w-6xl mx-auto">
    <h2 className="text-4xl md:text-5xl font-medium tracking-[-2px] text-center mb-4">Selected <em className="font-accent font-normal">Work</em></h2>
    <p className="text-muted-foreground text-lg text-center max-w-2xl mx-auto mb-16">A curated collection of projects where bold design meets intelligent technology.</p>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-12">{projects.map(([title,category,img],i) => <motion.article key={title} initial={{ opacity:0, y:40 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true, amount:0.15 }} transition={{ duration:0.65, delay:i*0.1 }} className="group"><div className="aspect-[4/3] liquid-glass rounded-2xl overflow-hidden mb-5"><img src={asset(img)} alt={`${title} website design preview`} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.035]" loading="lazy"/></div><h3 className="text-xl font-medium">{title}</h3><p className="text-sm text-muted-foreground mt-1">{category}</p></motion.article>)}</div>
   </section>
   <section className="showcase relative h-[650px] overflow-hidden -mt-[325px] z-0" aria-label="Digital design in motion"><BackgroundVideo src="https://media.cleanshot.cloud/media/21620/nKosRonaEKSufJVJ4VtouFhOPkqgJ3dPoQ8ZP52S.mp4" label="Abstract digital motion showcase"/><div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-background to-transparent z-10"/><div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background to-transparent z-10"/></section>
   <section id="contact" className="cta relative w-full h-screen overflow-hidden flex items-center justify-center z-10">
    <BackgroundVideo hls label="Atmospheric cinematic background"/>
    <div className="absolute inset-0 bg-black/30"/><div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-background to-transparent"/><div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-background to-transparent"/>
    <div className="relative z-10 text-center max-w-3xl px-6">
     <motion.h2 initial={{ opacity:0, y:30 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ duration:0.7 }} className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-[-2px] mb-6">Ready to <em className="font-accent font-normal">Transform</em><br/> Your Brand?</motion.h2>
     <motion.p initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ delay:0.1, duration:0.7 }} className="text-lg text-muted-foreground mb-10">Let's build something extraordinary together.</motion.p>
     <motion.div initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ delay:0.2, duration:0.7 }} className="flex flex-wrap justify-center gap-4"><a className="rounded-full px-10 py-4 bg-foreground text-background text-sm font-medium hover:bg-white/85 transition-colors" href={contact('Start a project')}>START A PROJECT</a><a className="liquid-glass-strong rounded-full px-10 py-4 text-sm font-medium" href={contact('Book a discovery call')}>BOOK A CALL</a></motion.div>
    </div>
   </section>
  </main>
  <footer className="bg-background border-t border-border px-8 py-16"><div className="max-w-6xl mx-auto"><div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-10">
   <div className="col-span-2 md:col-span-1"><a href="#home" className="text-xl font-semibold tracking-tight">VIRALMEDIA</a><p className="text-muted-foreground text-sm leading-relaxed mt-5 max-w-[230px]">AI-powered web design agency crafting digital experiences that convert.</p></div>
   <FooterGroup id="services" title="Services" links={['Brand Design','AI Web Design','AI Web Development','Optimization'].map(label => [label,contact(label)])}/>
   <FooterGroup id="company" title="Company" links={[[ 'About','#about'],['Work','#work'],['Blog',contact('Blog updates')],['Careers',contact('Careers')]]}/>
   <FooterGroup title="Connect" links={['Twitter','LinkedIn','Instagram','Dribbble'].map(label => [label,`https://${{Twitter:'x.com',LinkedIn:'linkedin.com',Instagram:'instagram.com',Dribbble:'dribbble.com'}[label]}/`])}/>
  </div><div className="flex flex-col md:flex-row justify-between gap-6 mt-16 pt-8 border-t border-border text-sm text-muted-foreground"><p>© 2026 VIRALMEDIA. All rights reserved.</p><div className="flex gap-6"><a href={contact('Privacy policy request')} className="hover:text-white">Privacy</a><a href={contact('Terms request')} className="hover:text-white">Terms</a></div></div></div></footer>
 </>;
}
function FooterGroup({ id, title, links }) { return <div id={id}><h3 className="text-sm font-medium mb-5">{title}</h3><ul className="space-y-3">{links.map(([label,href]) => <li key={label}><a href={href} className="text-muted-foreground text-sm hover:text-foreground transition-colors">{label}</a></li>)}</ul></div>; }

createRoot(document.getElementById('root')).render(<React.StrictMode><App/></React.StrictMode>);
