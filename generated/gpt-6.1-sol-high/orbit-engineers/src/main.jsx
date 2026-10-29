import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ChevronDown, ArrowRight } from 'lucide-react';
import './styles.css';

const asset = (name) => `${import.meta.env.BASE_URL}assets/${name}`;
const videos = ['orbit-landing.mp4', 'orbit-mission.mp4', 'orbit-service.mp4'];
const ease = [0.22, 1, 0.36, 1];
function Mark({ className = '' }) { return <img src={asset('orbit-mark.svg')} alt="" className={`h-8 w-8 ${className}`} />; }
function Lines({ service = false }) { return <div className="pointer-events-none absolute inset-0" aria-hidden="true">{['left-10', 'right-10'].map((side) => <img key={side} src={asset('vertical-line.svg')} alt="" className={`edge-line absolute top-6 w-3 ${side} ${service ? 'h-[calc(100%-1rem)]' : 'h-[calc(100%-3rem)]'}`} />)}</div>; }
function App() {
  const [section, setSection] = useState(0);
  const reduced = useReducedMotion();
  const handleNext = () => setSection((current) => Math.min(current + 1, 2));
  const handlePrev = () => setSection((current) => Math.max(current - 1, 0));
  const reveal = (from, delay) => ({ initial: reduced ? false : { opacity: 0, ...from }, animate: { opacity: 1, x: 0, y: 0 }, transition: { duration: 0.8, delay: reduced ? 0 : delay, ease } });
  return <main className="relative isolate min-h-screen overflow-hidden bg-background font-sans text-foreground" data-section={section}>
    <div className="fixed inset-0 -z-10 bg-background" aria-hidden="true">
      {videos.map((video, index) => <video key={video} autoPlay loop muted playsInline preload="auto" className={`fixed inset-0 h-full w-full object-cover transition-opacity duration-700 ${index === section ? 'opacity-100' : 'opacity-0'}`} src={asset(video)} />)}
      <div className="absolute inset-0 bg-black/20" />
      <div className="video-shade absolute inset-0" />
    </div>
    <header className="absolute inset-x-0 top-0 z-20 flex items-start justify-between px-10 pt-8">
      <button onClick={() => setSection(0)} aria-label="Orbit Engineers home" className="brand flex items-start gap-3 text-left transition-opacity hover:opacity-80"><Mark className="mt-0.5"/><span className="text-xl font-bold leading-none tracking-tight">WE ARE<br/>ORBIT<br/>ENGINEERS</span></button>
      <nav aria-label="Main navigation" className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-12 pt-2 md:flex">
        <button onClick={() => setSection(1)} className="nav-link">Industries</button><button onClick={() => setSection(2)} className="nav-link">Projects</button><button onClick={() => setSection(1)} className="nav-link">Insights</button>
      </nav>
      <div className="coordinates pt-1 text-right font-mono text-xs uppercase leading-relaxed tracking-widest">51.50732 N<br/>-0.12765 W</div>
    </header>
    <AnimatePresence mode="wait" initial={true}>
      <motion.section key={section} aria-label={['Introduction', 'Our mission', 'Operational feasibility'][section]} className="hero-section absolute inset-0 flex flex-col"
        initial={reduced ? { opacity: 0 } : section === 0 ? { opacity: 0, scale: 1.05, filter: 'blur(10px)' } : { opacity: 0, y: 80, scale: 1.08, filter: 'blur(14px)' }}
        animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
        exit={reduced ? { opacity: 0 } : section === 0 ? { opacity: 0, scale: .92, filter: 'blur(12px)', y: -60 } : { opacity: 0, y: -80, scale: .95, filter: 'blur(10px)' }}
        transition={{ duration: reduced ? .15 : section === 0 ? .8 : .9, ease }}>
        {section === 0 && <>
          <Lines/>
          <div className="flex flex-1 items-center justify-center px-16 pb-4"><h1 className="landing-heading max-w-4xl text-center text-2xl font-normal sm:text-3xl md:text-4xl lg:text-5xl">Unlock Tactical<br/>Excellence through Space<br/>Engineering</h1></div>
          <footer className="bottom-bar"><button className="text-link" onClick={handleNext}>Scroll to explore <ChevronDown size={17} className="animate-bounce"/></button><Mark className="opacity-60"/></footer>
        </>}
        {section === 1 && <>
          <div className="mission-content flex flex-1 flex-col items-center justify-center gap-10 px-20 md:flex-row md:items-center md:justify-between md:gap-16">
            <motion.h1 {...reveal({ x: -60 }, .3)} className="mission-heading text-center text-4xl font-light leading-[0.95] sm:text-5xl md:text-left md:text-5xl lg:text-6xl">Spatial Vision<br/>at Your Command</motion.h1>
            <motion.button {...reveal({ y: 30 }, .4)} whileHover={{ scale: 1.05 }} whileTap={{ scale: .98 }} onClick={handleNext} className="pill-button shrink-0">Begin Your Mission <ArrowRight size={18}/></motion.button>
            <motion.div {...reveal({ x: 60 }, .45)} className="why flex items-center gap-6"><span className="text-xs uppercase tracking-[0.3em]">Why We Are</span><div className="flex flex-col" aria-hidden="true">{[0,1,2,3].map(i => <img key={i} src={asset(i === 0 ? 'dot-filled.svg' : 'dot-outline.svg')} className="h-5 w-5" alt=""/>)}</div></motion.div>
          </div>
          <footer className="bottom-bar mission-bottom"><button className="text-link" onClick={() => setSection(0)}><ChevronDown size={17} className="rotate-180"/>Back to top</button><motion.p {...reveal({ y: 30 }, .5)} className="tagline text-center text-xs uppercase leading-relaxed tracking-[0.25em]">Orbital Solutions is a key strategic<br/>consulting firm in space engineering</motion.p><button className="text-link" onClick={handleNext}>Next<ChevronDown size={17} className="animate-bounce"/></button></footer>
        </>}
        {section === 2 && <>
          <Lines service/>
          <div className="service-content flex flex-1 flex-col items-center justify-center gap-6 px-16 text-center">
            <motion.span {...reveal({ y: 20 }, .3)} className="font-mono text-sm uppercase tracking-[0.3em] text-foreground/60">01</motion.span>
            <motion.h1 {...reveal({ y: 40 }, .4)} className="service-heading text-3xl font-light leading-[1.05] sm:text-4xl md:text-5xl lg:text-6xl">Operational Feasibility<br/>Evaluation</motion.h1>
            <motion.p {...reveal({ y: 30 }, .55)} className="service-description max-w-md font-mono text-sm leading-relaxed tracking-[0.15em] text-foreground/70">We analyze engineering proposals against<br className="hidden sm:block"/> strategic benchmarks to uncover growth paths<br className="hidden sm:block"/> and highlight untapped market potential.</motion.p>
          </div>
          <footer className="bottom-bar"><button className="text-link w-20" onClick={handlePrev}><ChevronDown size={17} className="rotate-90"/>Back</button><motion.a whileHover={{ scale: 1.05 }} whileTap={{ scale: .98 }} href="mailto:hello@orbit.engineers" className="pill-button">Reach Out <span aria-hidden="true" className="text-xl font-light">+</span></motion.a><div className="w-20"/></footer>
        </>}
      </motion.section>
    </AnimatePresence>
  </main>;
}
createRoot(document.getElementById('root')).render(<App/>);
