import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

const videos = [
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260629_030107_874273ea-684a-4e90-bb96-8fdfde48d53d.mp4',
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260629_032424_3c9c2a9d-807b-4482-80e6-dd6d9dfd4545.mp4',
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260627_094019_4214ea73-b963-46a4-8327-61489192de99.mp4',
];
const links = [['Works', '#works'], ['Services', '#services'], ['About', '#about'], ['Contact', 'mailto:Davies@gmail.com']];
const formatter = new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });

function Navbar() {
  const [open, setOpen] = useState(false);
  const [time, setTime] = useState(() => formatter.format(new Date()));
  useEffect(() => { const interval = setInterval(() => setTime(formatter.format(new Date())), 1000); return () => clearInterval(interval); }, []);
  useEffect(() => {
    const close = event => { if (event.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', close);
    const media = window.matchMedia('(min-width: 810px)');
    const resize = () => { if (media.matches) setOpen(false); };
    media.addEventListener('change', resize);
    return () => { window.removeEventListener('keydown', close); media.removeEventListener('change', resize); };
  }, []);
  return <header className={`site-header absolute inset-x-0 top-0 z-10 ${open ? 'menu-open' : ''}`}>
    <div className="navbar mx-auto flex max-w-[1340px] items-center justify-between px-[15px] py-9 md-tablet:px-[18px] md-tablet:py-[30px] mobile:px-[18px] mobile:py-6">
      <nav aria-label="Main navigation" className="desktop-nav flex gap-8 md-tablet:gap-4 mobile:hidden">
        {links.map(([label, href], i) => <a className="nav-link-underline nav-item" href={href} key={label}><span className="nav-index">0{i + 1}</span><span className="nav-label">/ &nbsp;{label}</span></a>)}
      </nav>
      <button className="menu-toggle hidden mobile:block nav-link-underline" aria-expanded={open} aria-controls="mobile-navigation" onClick={() => setOpen(!open)}>{open ? 'Close' : 'Menu'}</button>
      <div className="header-meta flex items-center gap-10 mobile:gap-5">
        <a className="nav-link-underline email" href="mailto:Davies@gmail.com">Davies@gmail.com</a>
        <time aria-label={`Local time CUP ${time}`} className="clock">CUP {time}</time>
      </div>
    </div>
    <div id="mobile-navigation" className={`mobile-panel hidden mobile:grid ${open ? 'expanded' : ''}`} inert={!open ? true : undefined}>
      <div className="min-h-0 overflow-hidden"><nav aria-label="Mobile navigation" className="mobile-links">
        {links.map(([label, href], i) => <a href={href} key={label} onClick={() => setOpen(false)}><span className="nav-index">0{i + 1}</span><span>/ &nbsp;{label}</span></a>)}
      </nav></div>
    </div>
  </header>;
}

function Hero() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [sources, setSources] = useState(videos);
  const hero = useRef(null);
  const videoRefs = useRef([]);
  useEffect(() => {
    const controller = new AbortController();
    const objectURLs = [];
    videos.forEach(async (url, index) => {
      try {
        const response = await fetch(url, { signal: controller.signal });
        if (!response.ok) throw new Error(`Video ${index + 1}: HTTP ${response.status}`);
        const blob = await response.blob();
        if (controller.signal.aborted) return;
        const objectURL = URL.createObjectURL(blob);
        objectURLs.push(objectURL);
        setSources(previous => previous.map((source, i) => i === index ? objectURL : source));
      } catch (error) { if (error.name !== 'AbortError') console.warn('Video preload failed; using original URL.', url); }
    });
    return () => { controller.abort(); objectURLs.forEach(url => URL.revokeObjectURL(url)); };
  }, []);
  useEffect(() => {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('revealed'); observer.unobserve(entry.target); }
    }), { threshold: 0.35 });
    hero.current.querySelectorAll('.reveal').forEach(element => observer.observe(element));
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    const preference = matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => videoRefs.current.forEach(video => { if (!video) return; if (preference.matches) video.pause(); else video.play().catch(() => {}); });
    update(); preference.addEventListener('change', update);
    return () => preference.removeEventListener('change', update);
  }, [sources]);
  return <main><section ref={hero} aria-label="Viktor creative portfolio" className="hero relative isolate min-h-svh overflow-hidden bg-black text-white" style={{ '--accent': activeIndex === 0 ? '#F598F2' : '#ffffff' }}>
    <div className="absolute inset-0 -z-10" aria-hidden="true">
      {sources.map((source, i) => <video ref={element => videoRefs.current[i] = element} key={i} src={source} autoPlay muted playsInline loop preload="auto" aria-hidden="true" className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-[1200ms] ease-in-out ${activeIndex === i ? 'opacity-100' : 'opacity-0'}`} />)}
    </div>
    <div className="pointer-events-none absolute inset-0 z-[1] bg-black/10" />
    <div className="hero-content relative z-[2] mx-auto flex max-w-[1340px] flex-col items-end justify-end gap-[150px] px-[15px] pt-[190px] mobile:items-start mobile:gap-[72px] mobile:px-[18px] mobile:pt-[140px]">
      <div className="top-section flex w-full mobile:flex-col mobile:gap-7">
        <div id="works" className="switcher flex flex-[4] flex-col items-start gap-3" role="group" aria-label="Background video">
          {['Water wave', 'Gridwave', 'Light tunnel'].map((name, i) => <button key={name} type="button" aria-pressed={activeIndex === i} onClick={() => setActiveIndex(i)} className={`role-link flex items-center gap-2 uppercase ${activeIndex === i ? 'opacity-100' : 'opacity-55 hover:opacity-75'}`}><span className="nav-index">0{i + 1}</span><span className="nav-label">/ &nbsp;{name}</span></button>)}
        </div>
        <div className="availability flex flex-1 items-start" role="status" aria-label="Available for work"><span className="status-dot" /><span>Available for work</span></div>
      </div>
      <div className="bottom-section flex w-full items-end pb-[60px] mobile:flex-col mobile:items-start mobile:gap-8 mobile:pb-11">
        <div id="about" className="name-column flex-[2]"><h1 className="name reveal reveal-up font-medium uppercase">Viktor<span className="accent">.</span></h1></div>
        <div id="services" className="intro flex-1 pl-[50px] mobile:w-full mobile:pl-0">
          <p className="reveal reveal-right max-w-[420px] text-base font-medium leading-6 tracking-[-0.16px]">I craft bold brands and modern websites with purpose. Turning ideas into distinctive digital experiences that connect and inspire.</p>
          <a className="project-button reveal reveal-right" href="mailto:Davies@gmail.com"><span>start a project</span></a>
        </div>
      </div>
    </div>
  </section></main>;
}

function App() { return <><Navbar /><Hero /></>; }
createRoot(document.getElementById('root')).render(<App />);
