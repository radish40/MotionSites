import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { AnimatePresence, MotionConfig, motion } from 'motion/react';
import { ArrowUpRight, Check } from 'lucide-react';
import './styles.css';

const VIDEO_URL = 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260601_110537_3a579fa0-7bbc-4d94-9d25-0e816c7840f5.mp4';
const serviceOptions = ['Brand', 'Digital', 'Campaign', 'Other'];
const navLinks = ['Labs', 'Studio', 'Openings', 'Shop'];

export function useTypewriter(text, speed = 38, startDelay = 600) {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);
  useEffect(() => {
    setDisplayed('');
    setDone(false);
    let interval;
    const delay = setTimeout(() => {
      let index = 0;
      interval = setInterval(() => {
        index += 1;
        setDisplayed(text.slice(0, index));
        if (index >= text.length) {
          setDone(true);
          clearInterval(interval);
        }
      }, speed);
    }, startDelay);
    return () => { clearTimeout(delay); clearInterval(interval); };
  }, [text, speed, startDelay]);
  return { displayed, done };
}

function BackgroundVideo() {
  const videoRef = useRef(null);
  useEffect(() => {
    const video = videoRef.current;
    let previousX = null;
    let targetTime = 0;
    const seek = () => {
      if (window.innerWidth < 1024 || video.seeking || !Number.isFinite(video.duration)) return;
      if (Math.abs(video.currentTime - targetTime) > 0.015) video.currentTime = targetTime;
    };
    const move = (event) => {
      if (window.innerWidth < 1024) return;
      if (previousX === null) { previousX = event.clientX; return; }
      const delta = event.clientX - previousX;
      previousX = event.clientX;
      if (!Number.isFinite(video.duration)) return;
      targetTime = Math.max(0, Math.min(video.duration, targetTime + (delta / window.innerWidth) * 0.8 * video.duration));
      seek();
    };
    const reset = () => { previousX = null; };
    video.addEventListener('seeked', seek);
    window.addEventListener('mousemove', move);
    document.addEventListener('mouseleave', reset);
    return () => {
      video.removeEventListener('seeked', seek);
      window.removeEventListener('mousemove', move);
      document.removeEventListener('mouseleave', reset);
    };
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    const updatePlayback = () => {
      if (window.innerWidth < 1024) {
        video.autoplay = true;
        video.play().catch(() => { /* Native media may await a user gesture. */ });
      } else {
        video.autoplay = false;
        video.pause();
      }
    };
    updatePlayback();
    window.addEventListener('resize', updatePlayback);
    video.addEventListener('loadedmetadata', updatePlayback);
    return () => {
      window.removeEventListener('resize', updatePlayback);
      video.removeEventListener('loadedmetadata', updatePlayback);
    };
  }, []);

  return <div className="order-last lg:order-none relative lg:absolute lg:inset-0 lg:z-0 overflow-hidden pointer-events-none w-full aspect-square md:aspect-video lg:aspect-auto lg:h-full bg-neutral-50 lg:bg-transparent" aria-hidden="true">
    <video ref={videoRef} muted playsInline preload="auto" loop
      src={VIDEO_URL}
      onError={(event) => {
        const fallback = new URL(`${import.meta.env.BASE_URL}assets/cybernetic.mp4`, window.location.origin).href;
        if (event.currentTarget.src !== fallback) event.currentTarget.src = fallback;
      }}
      className="w-full h-full object-cover object-right lg:object-right-bottom" />
  </div>;
}

function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const toggleRef = useRef(null);
  const overlayRef = useRef(null);
  useEffect(() => {
    if (!isMobileMenuOpen) return;
    const before = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const keydown = (event) => {
      if (event.key === 'Escape') { setIsMobileMenuOpen(false); toggleRef.current?.focus(); }
      if (event.key === 'Tab') {
        const items = [toggleRef.current, ...overlayRef.current.querySelectorAll('a')];
        const index = items.indexOf(document.activeElement);
        if (event.shiftKey && index === 0) { event.preventDefault(); items.at(-1).focus(); }
        if (!event.shiftKey && index === items.length - 1) { event.preventDefault(); items[0].focus(); }
      }
    };
    const resize = () => { if (window.innerWidth >= 768) setIsMobileMenuOpen(false); };
    window.addEventListener('keydown', keydown);
    window.addEventListener('resize', resize);
    return () => { document.body.style.overflow = before; window.removeEventListener('keydown', keydown); window.removeEventListener('resize', resize); };
  }, [isMobileMenuOpen]);
  return <div className="relative z-20">
    <header className="fixed top-0 inset-x-0 z-10 px-5 sm:px-8 py-4 sm:py-5 flex flex-row justify-between items-center bg-transparent">
      <a href="#spade-hero" aria-label="Mainframe home" className="flex items-center gap-3">
        <span className="text-[21px] sm:text-[26px] tracking-tight text-black font-medium select-none">Mainframe®</span>
        <span className="text-[25px] sm:text-[30px] text-black select-none tracking-[-0.02em] font-medium leading-none mb-1" aria-hidden="true">✱</span>
      </a>
      <nav aria-label="Main navigation" className="hidden md:flex text-[23px] text-black">
        {navLinks.map((link, index) => <React.Fragment key={link}>
          <a href="#spade-hero" className="hover:opacity-60 transition-opacity">{link}</a>
          {index < navLinks.length - 1 && <span className="opacity-40">,&nbsp;</span>}
        </React.Fragment>)}
      </nav>
      <a href="#services" className="hidden md:block text-[23px] text-black underline underline-offset-2 hover:opacity-60 transition-opacity">Get in touch</a>
      <button ref={toggleRef} type="button" aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'} aria-expanded={isMobileMenuOpen} aria-controls="mobile-navigation" onClick={() => setIsMobileMenuOpen(open => !open)} className="md:hidden flex flex-col gap-[5px] p-2 -mr-2">
        <span className={`w-6 h-[2px] bg-black transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-[7px]' : ''}`} />
        <span className={`w-6 h-[2px] bg-black transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0' : ''}`} />
        <span className={`w-6 h-[2px] bg-black transition-all duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-[7px]' : ''}`} />
      </button>
    </header>
    <div ref={overlayRef} id="mobile-navigation" inert={!isMobileMenuOpen} className={`md:hidden fixed inset-0 z-[9] bg-white/95 backdrop-blur-sm transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
      <nav aria-label="Mobile navigation" className="h-full flex flex-col justify-center items-start px-8 gap-6 text-4xl tracking-tight">
        {[...navLinks, 'Get in touch'].map(link => <a key={link} href={link === 'Get in touch' ? '#services' : '#spade-hero'} onClick={() => setIsMobileMenuOpen(false)} className="hover:opacity-60 transition-opacity">{link}</a>)}
      </nav>
    </div>
  </div>;
}

function App() {
  const { displayed, done } = useTypewriter("we'd love to\nhear from you!");
  const [services, setServices] = useState([]);
  const toggleService = service => setServices(current => current.includes(service) ? current.filter(item => item !== service) : [...current, service]);
  return <MotionConfig reducedMotion="user">
    <div className="relative bg-white text-neutral-900 font-sans selection:bg-[#EAECE9] selection:text-[#1C2E1E] antialiased overflow-x-hidden flex flex-col lg:block lg:min-h-screen">
      <BackgroundVideo />
      <div className="relative z-10 flex flex-col order-first lg:order-none w-full bg-white lg:bg-transparent pb-8 lg:pb-0 lg:min-h-screen">
        <main id="spade-hero" className="w-full max-w-7xl mx-auto px-6 py-12 flex-1 flex flex-col justify-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <h1 aria-label="we'd love to hear from you!" className="hero-headline text-5xl md:text-6xl lg:text-[76px] font-normal tracking-tight text-black leading-[1.08] mb-8 select-none w-full whitespace-pre-wrap">
              <span aria-hidden="true">{displayed}{!done && <span className="inline-block w-[2px] h-[1.1em] bg-black align-middle ml-[2px] animate-blink" />}</span>
            </h1>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}>
            <p className="text-lg md:text-xl text-[#5A635A] leading-relaxed font-normal mb-14 max-w-2xl">Whether you have questions, feedback, <br />drop us a message and we'll get back to you as soon as possible.</p>
          </motion.div>
          <motion.section id="services" aria-labelledby="service-title" className="w-full max-w-xl scroll-mt-28" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
            <h2 id="service-title" className="text-2xl font-medium tracking-tight mb-2">What sort of service?</h2>
            <p className="opacity-85 text-[#738273] mb-8">Select all that apply</p>
            <div className="flex flex-wrap gap-3" role="group" aria-label="Select all services that apply">
              {serviceOptions.map(service => {
                const active = services.includes(service);
                return <motion.button key={service} type="button" aria-pressed={active} onClick={() => toggleService(service)} whileHover={{ y: -2 }} whileTap={{ scale: 0.96 }} layout className={`rounded-full px-6 py-3.5 text-sm flex items-center gap-2 min-h-12 transition-colors duration-200 ${active ? 'bg-[#1C2E1E] text-white shadow-md shadow-emerald-950/5 transform border border-[#1C2E1E]' : 'bg-white text-[#1C2E1E] border border-[#F1F3F1] hover:bg-[#F1F3F1]/55'}`}>
                  <AnimatePresence initial={false}>{active && <motion.span initial={{ width: 0, opacity: 0, scale: 0.5 }} animate={{ width: 16, opacity: 1, scale: 1 }} exit={{ width: 0, opacity: 0, scale: 0.5 }} transition={{ type: 'spring', stiffness: 300, damping: 20 }}><Check size={16} strokeWidth={2} aria-hidden="true" /></motion.span>}</AnimatePresence>
                  {service}
                </motion.button>;
              })}
            </div>
            <div className="mt-6 min-h-20" aria-live="polite" aria-atomic="true">
              <AnimatePresence mode="wait" initial={false}>
                {services.length === 0 ? <motion.p key="empty" initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} exit={{ opacity: 0 }} className="text-xs italic pt-1">Please click to select services above.</motion.p> :
                  <motion.div key="selected" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ type: 'spring', stiffness: 300, damping: 25 }} className="overflow-hidden">
                    <div className="bg-[#FAFBF9] border border-[#E8EDE5] rounded-2xl p-4 flex items-center justify-between gap-4">
                      <p className="text-xs leading-relaxed text-[#5A635A]">Ready to inquire about: <span className="text-[#1C2E1E] font-medium">{services.join(', ')}</span></p>
                      <a href={`mailto:?subject=${encodeURIComponent(`Mainframe inquiry — ${services.join(', ')}`)}&body=${encodeURIComponent(`Hi Mainframe,\n\nI'd love to talk about ${services.join(', ')}.\n\n`)}`} className="text-[#4D6D47] uppercase text-xs font-medium flex shrink-0 items-center gap-2 hover:opacity-60 transition-opacity">Let's Go <ArrowUpRight size={16} aria-hidden="true" /></a>
                    </div>
                  </motion.div>}
              </AnimatePresence>
            </div>
          </motion.section>
        </main>
      </div>
      <Navbar />
    </div>
  </MotionConfig>;
}

createRoot(document.getElementById('root')).render(<App />);
