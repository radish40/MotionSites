import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import Hls from 'hls.js';

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
const HLS_FALLBACK = 'https://stream.mux.com/43NlHXsaMrmyzWamMk87m01fNyxSTekAD669BBAPBNm00.m3u8';

function ScrollVideo({ src, className = '' }: { src: string; className?: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const wrapper = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    const video = videoRef.current!;
    let hls: Hls | undefined;
    let trigger: ScrollTrigger | undefined;
    let currentTarget = 0;
    let seekPending = false;
    let fallbackUsed = false;
    const buffer = () => {
      if (video.buffered.length && Number.isFinite(video.duration)) {
        setProgress(Math.min(100, Math.round(video.buffered.end(video.buffered.length - 1) / video.duration * 100)));
      }
    };
    const doSeek = () => {
      if (!Number.isFinite(video.duration)) return;
      if (video.seeking) { seekPending = true; return; }
      seekPending = false;
      if (Math.abs(video.currentTime - currentTarget) > 0.015) video.currentTime = currentTarget;
    };
    const seeked = () => { if (seekPending) doSeek(); };
    const ready = () => { setLoading(false); buffer(); };
    const metadata = () => {
      trigger?.kill();
      trigger = ScrollTrigger.create({trigger: document.documentElement, start: 'top top', end: 'bottom bottom', scrub: true,
        onUpdate: self => { currentTarget = self.progress * Math.max(0, video.duration - 0.04); doSeek(); }
      });
      currentTarget = trigger.progress * Math.max(0, video.duration - 0.04);
      doSeek();
    };
    const loadHls = () => {
      if (Hls.isSupported()) {
        hls = new Hls({ maxBufferLength: 120, maxMaxBufferLength: 600, maxBufferSize: 200 * 1024 * 1024, startPosition: 0, capLevelToPlayerSize: false, startLevel: -1, autoStartLoad: true });
        hls.on(Hls.Events.MANIFEST_PARSED, () => { const maxLevel = hls!.levels.length - 1; hls!.currentLevel = maxLevel; hls!.startLevel = maxLevel; });
        hls.on(Hls.Events.FRAG_BUFFERED, buffer);
        hls.on(Hls.Events.ERROR, (_, data) => { if (data.fatal) {setLoading(false); setFailed(true);} });
        hls.loadSource(HLS_FALLBACK); hls.attachMedia(video);
      } else { video.src = HLS_FALLBACK; }
    };
    const error = () => { if (!fallbackUsed) { fallbackUsed = true; loadHls(); } else { setLoading(false); setFailed(true); } };
    video.addEventListener('loadedmetadata', metadata);
    video.addEventListener('canplay', ready);
    video.addEventListener('progress', buffer);
    video.addEventListener('seeked', seeked);
    video.addEventListener('error', error);
    if (/\.m3u8(?:\?|$)/.test(src)) loadHls(); else { video.src = src; video.load(); }
    const move = (e: MouseEvent) => gsap.to(wrapper.current, { x: (e.clientX / innerWidth * 2 - 1) * -30, y: (e.clientY / innerHeight * 2 - 1) * -30, duration: 1.5, ease: 'power2.out' });
    window.addEventListener('mousemove', move);
    return () => {
      trigger?.kill(); hls?.destroy(); window.removeEventListener('mousemove', move);
      video.removeEventListener('loadedmetadata', metadata); video.removeEventListener('canplay', ready); video.removeEventListener('progress', buffer); video.removeEventListener('seeked', seeked); video.removeEventListener('error', error);
      gsap.killTweensOf(wrapper.current); video.removeAttribute('src'); video.load();
    };
  }, [src]);
  return <><div ref={wrapper} className={`video-wrapper fixed top-0 left-0 w-full h-full z-0 scale-[1.05] origin-center ${className}`}><video ref={videoRef} muted playsInline crossOrigin="anonymous" preload="auto" className="w-full h-full object-cover scale-[1.35]" aria-label="Nature reclaiming a city, animated as you scroll" /></div>{loading && <div className="loading-overlay fixed inset-0 z-50 flex items-center justify-center bg-black text-white text-2xl font-sans" role="status">Loading... {progress}%</div>}{failed && <p className="video-error" role="status">The film is temporarily unavailable.</p>}</>;
}

function ScrollFloat({ children }: { children: string }) {
  const ref = useRef<HTMLHeadingElement>(null);
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.char', {opacity: 1, yPercent: 0, scaleY: 1, scaleX: 1, transformOrigin: '50% 0%'}, {opacity: 0, yPercent: 250, scaleY: 1.2, scaleX: 0.9, stagger: 0.05, ease: 'power2.inOut', duration: 1, scrollTrigger: {trigger: document.body, start: 'top top', end: '+=1000', scrub: 1.5}});
    }, ref);
    return () => ctx.revert();
  }, []);
  return <div className="hero-copy fixed inset-0 flex flex-col justify-end p-4 md:p-8 pointer-events-none z-10"><h1 ref={ref} className="scroll-float-text font-dirtyline" aria-label={children}>{children.split('\n').map((line, i) => <span key={i} style={{display:'block'}} aria-hidden="true">{line.split(' ').map((word, j) => <span key={j}>{j > 0 && '\u00a0'}<span style={{display:'inline-block',whiteSpace:'nowrap'}}>{Array.from(word).map((char, k) => <span className="char" key={k}>{char}</span>)}</span></span>)}</span>)}</h1></div>;
}

function GlassPanel() {
  const section = useRef<HTMLElement>(null);
  const wrapper = useRef<HTMLDivElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const ctx = gsap.context(() => { gsap.fromTo(wrapper.current, {y: '100%'}, {y: '0%', ease: 'none', scrollTrigger: {trigger: section.current, start: 'top bottom', end: 'bottom bottom', scrub: 1.5}}); });
    return () => ctx.revert();
  }, []);
  const move = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const moveX = (e.clientX - rect.left) / rect.width * 2 - 1;
    const moveY = (e.clientY - rect.top) / rect.height * 2 - 1;
    gsap.to(panel.current, {x: moveX * 20, y: moveY * 20, rotationY: moveX * 4, rotationX: -moveY * 4, ease: 'power3.out', duration: 1});
  };
  return <section ref={section} id="about" className="about-section absolute bottom-0 left-0 w-full h-screen flex items-center justify-center px-4 md:px-8 z-20" aria-labelledby="about-heading">
    <div ref={wrapper} className="w-full max-w-[1250px] h-[900px] max-h-[85vh] pointer-events-auto" style={{perspective:1000}} onMouseMove={move} onMouseLeave={() => gsap.to(panel.current, {x:0,y:0,rotationX:0,rotationY:0,duration:1,ease:'power3.out'})}>
      <div ref={panel} className="glass-panel w-full h-full flex flex-col justify-between rounded-3xl relative overflow-hidden" style={{backgroundColor:'rgba(0, 0, 0, 0.16)',backdropFilter:'blur(160px)',WebkitBackdropFilter:'blur(160px)',border:'1px solid rgba(255,255,255,0.1)',transformStyle:'preserve-3d',willChange:'transform'}}>
        <div className="about-content flex-1 flex flex-col items-center justify-center px-6 md:px-12 text-center"><p className="font-serif italic text-white/70 text-base md:text-lg mb-4 md:mb-6">About Us</p><h2 id="about-heading" className="font-serif text-white text-4xl md:text-6xl lg:text-[96px] leading-[1.1] lg:leading-[92.6px] tracking-tight w-full max-w-[1000px] mx-auto">We transform sterile concrete into thriving <span className="italic">urban</span> jungles. Our innovative designs bring wild <span className="italic">nature</span> back to modern cities. Experience the <span className="italic">bloom</span></h2></div>
        <div className="border-t border-white/10 py-6 overflow-hidden" aria-label="Our partners"><div className="marquee-track flex w-max animate-marquee">{Array.from({length:4}, (_, group) => <div key={group} className="marquee-group" aria-hidden={group > 0 ? true : undefined}>{['VOICEFLOW','ZENDESK','PENDO','GLIDE','CANVA'].map(brand => <span key={brand} className="text-white opacity-40 hover:opacity-100 transition-opacity duration-300 uppercase font-sans font-semibold text-sm tracking-widest">{brand}</span>)}</div>)}</div></div>
      </div>
    </div>
  </section>;
}

function Pill({ label, onClick, active }: {label: string; onClick: () => void; active: boolean}) {
  const ref = useRef<HTMLAnchorElement>(null);
  const timeline = useRef<gsap.core.Timeline | null>(null);
  useLayoutEffect(() => {
    const element = ref.current!;
    const ctx = gsap.context(() => {
      const w = element.offsetWidth, h = element.offsetHeight;
      const R = (w*w/4 + h*h)/(2*h), D = 2*R+2;
      const delta = R - Math.sqrt(R*R-w*w/4)+1;
      gsap.set('.hover-circle', {width:D,height:D,left:(w-D)/2,bottom:-delta,transformOrigin:`50% ${D-delta}px`,scale:0});
      gsap.set('.pill-label-hover', {yPercent:110});
      timeline.current = gsap.timeline({paused:true}).to('.hover-circle',{scale:3,duration:0.3,ease:'power2.out'},0).to('.pill-label',{yPercent:-110,duration:0.3},0).to('.pill-label-hover',{yPercent:0,duration:0.3},0);
    }, element);
    return () => ctx.revert();
  }, []);
  return <a ref={ref} href={label === 'HOME' ? '#home' : '#about'} className={`pill ${active ? 'is-active' : ''}`} onClick={e => {e.preventDefault(); onClick();}} onMouseEnter={() => timeline.current?.tweenTo(0.3,{duration:0.3})} onMouseLeave={() => timeline.current?.tweenTo(0,{duration:0.2})} onFocus={() => timeline.current?.play()} onBlur={() => timeline.current?.reverse()}><span className="hover-circle"/><span className="label-stack"><span className="pill-label">{label}</span><span className="pill-label-hover" aria-hidden="true">{label}</span></span></a>;
}

function PillNav() {
  const ref = useRef<HTMLElement>(null);
  const menu = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState('HOME');
  const labels = ['HOME','ABOUT','SERVICES','CONTACT'];
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.pill-logo',{scale:0,duration:0.6,ease:'back.out(1.7)'});
      gsap.from('.pill-nav-items',{width:0,opacity:0,duration:0.6,clearProps:'width,opacity',ease:'power2.out'});
    }, ref);
    return () => ctx.revert();
  }, []);
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to('.hamburger-line:first-child',{rotation:open ? 45 : 0,y:open ? 3 : 0,duration:0.25});
      gsap.to('.hamburger-line:last-child',{rotation:open ? -45 : 0,y:open ? -3 : 0,duration:0.25});
      gsap.to(menu.current,{autoAlpha:open ? 1 : 0,y:open ? 0 : -10,duration:0.25});
    }, ref);
    return () => ctx.revert();
  }, [open]);
  useEffect(() => {
    const close = (e: KeyboardEvent) => {if (e.key === 'Escape') setOpen(false);};
    document.addEventListener('keydown',close); return () => document.removeEventListener('keydown',close);
  }, []);
  const navigate = (label: string) => {setActive(label);setOpen(false);gsap.to(window,{duration:3,scrollTo:label === 'HOME' ? 0 : document.body.scrollHeight,ease:'power3.inOut'});};
  return <nav ref={ref} className="pill-nav-container" aria-label="Main navigation"><div className="pill-nav"><a href="#home" className="pill-logo" aria-label="Urban Jungle home" onClick={e => {e.preventDefault();navigate('HOME');}} onMouseEnter={e => gsap.to(e.currentTarget.firstElementChild,{rotation:'+=360',duration:0.2})}><span className="logo-svg-container"><svg width="24" height="24" viewBox="0 0 100 100" fill="white" aria-hidden="true"><path d="m50,50c0,18.2,14.77,32.98,32.97,32.98,0-18.2-14.77-32.98-32.97-32.98Z"/><path d="m17.02,82.98c18.2,0,32.98-14.77,32.98-32.98-18.2,0-32.98,14.77-32.98,32.98Z"/><path d="m82.98,17.02c-18.2,0-32.97,14.77-32.97,32.97,18.2,0,32.97-14.77,32.97-32.97Z"/><path d="m17.02,17.02c0,18.2,14.77,32.97,32.98,32.97,0-18.2-14.77-32.97-32.98-32.97Z"/></svg></span></a><div className="pill-nav-items desktop-only"><ul className="pill-list">{labels.map(label => <li key={label}><Pill label={label} active={active === label} onClick={() => navigate(label)}/></li>)}</ul></div><button className="mobile-menu-button mobile-only" aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} aria-controls="mobile-navigation" onClick={() => setOpen(!open)}><span className="hamburger-line"/><span className="hamburger-line"/></button></div><div ref={menu} id="mobile-navigation" className="mobile-menu-popover mobile-only" inert={!open}><ul className="mobile-menu-list">{labels.map(label => <li key={label}><a href={label === 'HOME' ? '#home' : '#about'} className="mobile-menu-link" onClick={e => {e.preventDefault();navigate(label);}}>{label}</a></li>)}</ul></div></nav>;
}

export default function App() {
  return <><ScrollVideo src={`${import.meta.env.BASE_URL}urban-jungle.mp4`}/><PillNav/><main id="home" style={{position:'relative',height:'500vh'}}><ScrollFloat>{`Unleash The\nFull Power`}</ScrollFloat><GlassPanel/></main></>;
}
