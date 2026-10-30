import { useEffect, useRef, useState, type ReactNode } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import ScrollReveal from './components/ScrollReveal';

// Original source; the identical file is served locally for reliable seeking.
export const VIDEO_URL = 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260521_064421_279656fd-e76f-40a0-8fed-7456d4f7715a.mp4';
const LOCAL_VIDEO_URL = `${import.meta.env.BASE_URL}assets/wisa-scroll.mp4`;

function Logo({ className = '' }: { className?: string }) {
  return <svg viewBox="0 0 157 25" fill="none" className={className} role="img" aria-label="WISA"><path d="M1 1.5 12 23 23 1.5 34 23 45 1.5" stroke="white" strokeWidth="2" strokeLinejoin="round"/><path d="M61 1.5V23" stroke="white" strokeWidth="2"/><path d="M106 2H86a6 6 0 0 0 0 11h13a5 5 0 0 1 0 10H79" stroke="white" strokeWidth="2" strokeLinecap="round"/><path d="m123 23 15-21 17 21" stroke="white" strokeWidth="2" strokeLinejoin="round"/></svg>;
}
function Globe() {
  return <svg width="71" height="43" viewBox="0 0 71 43" fill="none" stroke="white" strokeWidth="0.7" aria-hidden="true"><ellipse cx="35.5" cy="21.5" rx="34.5" ry="20.5"/><ellipse cx="35.5" cy="21.5" rx="24" ry="20.5"/><ellipse cx="35.5" cy="21.5" rx="12" ry="20.5"/><path d="M35.5 1v41M1 21.5h69M5 12h61M5 31h61"/></svg>;
}
function Reveal({ children, delay = 0, className = '' }: { children: ReactNode; delay?: number; className?: string }) {
  return <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-50px' }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay }} className={className}>{children}</motion.div>;
}
function NavItem({ children, href }: { children: ReactNode; href: string }) {
  const [cycle, setCycle] = useState(0);
  return <a href={href} onMouseEnter={() => setCycle(c => c + 1)} onMouseLeave={() => setCycle(c => c + 1)} className="relative overflow-hidden group flex items-center justify-center py-1">
    {cycle === 0 ? <span className="text-white/64 group-hover:text-white transition-colors duration-300">{children}</span> : <span key={cycle} className="relative"><span className="block animate-fly-out-up text-white/64">{children}</span><span className="absolute inset-0 animate-fly-in-up text-white/90">{children}</span></span>}
  </a>;
}
function Arrow({ cycle }: { cycle: number }) {
  return <span className="relative block w-5 h-5 overflow-hidden" aria-hidden="true">{cycle === 0 ? <ArrowRight className="w-5 h-5" strokeWidth={1.5}/> : <span key={cycle}><ArrowRight className="absolute inset-0 w-5 h-5 animate-fly-out" strokeWidth={1.5}/><ArrowRight className="absolute inset-0 w-5 h-5 animate-fly-in" strokeWidth={1.5}/></span>}</span>;
}
function SeasonButton() {
  const [cycle, setCycle] = useState(0);
  return <a href="mailto:hello@wisa.football?subject=Start%20your%20seasons" className="season-button group flex items-stretch gap-1" onMouseEnter={() => setCycle(c => c + 1)} onMouseLeave={() => setCycle(c => c + 1)}><span className="bg-white text-black px-8 py-5 font-mono text-xs font-bold tracking-[-0.01em] group-hover:bg-gray-200 transition-colors">START YOUR SEASONS</span><span className="bg-white text-black px-6 flex items-center group-hover:bg-gray-200 transition-colors"><Arrow cycle={cycle}/></span></a>;
}
const footerGroups = [
  { title: 'COMPANY', links: [['About', '#about'], ['Rosters', '#programs'], ['Press', 'mailto:press@wisa.football'], ['Contact', 'mailto:hello@wisa.football']] },
  { title: 'SERVICES', links: [['Coaching', '#programs'], ['Training Camp', '#facilities'], ['Fitness', '#programs'], ['Tryout', 'mailto:hello@wisa.football?subject=Tryout%20enquiry']] },
  { title: 'CONNECT', links: [['LinkedIn', 'https://www.linkedin.com/'], ['X / Twitter', 'https://x.com/'], ['YouTube', 'https://www.youtube.com/'], ['Newsletter', 'mailto:hello@wisa.football?subject=Newsletter%20subscription']] },
];
export default function App() {
  const [arrowCycle, setArrowCycle] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const screen3Ref = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const headerY = useTransform(scrollY, [0, 500, 800], [0, 0, -150]);
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const handleCanPlay = () => setIsLoaded(true);
    video.addEventListener('canplaythrough', handleCanPlay);
    video.load();
    return () => video.removeEventListener('canplaythrough', handleCanPlay);
  }, []);
  useEffect(() => {
    if (!isLoaded) return;
    const video = videoRef.current;
    if (!video || !video.duration) return;
    const handleScroll = () => {
      if (!screen3Ref.current || video.seeking) return;
      const rect = screen3Ref.current.getBoundingClientRect();
      const absoluteTop = window.scrollY + rect.top;
      const stopScroll = Math.max(1, absoluteTop - (window.innerHeight * 0.2));
      const scrollFraction = Math.max(0, Math.min(1, window.scrollY / stopScroll));
      // Avoid the blank frame some decoders expose at the exact end of an MP4.
      const target = Math.min(scrollFraction * video.duration, Math.max(0, video.duration - 0.04));
      if (Math.abs(video.currentTime - target) > 0.015) video.currentTime = target;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    // Catch the final scroll position if it arrived while a frame was decoding.
    video.addEventListener('seeked', handleScroll);
    window.addEventListener('resize', handleScroll);
    handleScroll();
    return () => { window.removeEventListener('scroll', handleScroll); video.removeEventListener('seeked', handleScroll); window.removeEventListener('resize', handleScroll); };
  }, [isLoaded]);
  return <>
    {!isLoaded && !videoError && <div className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center" role="status"><span className="text-[10px] font-mono tracking-widest mb-4 text-white/50">LOADING</span><div className="w-64 h-[1px] bg-white/10 mt-8 overflow-hidden"><div className="h-full bg-white w-1/3 animate-pulse"/></div></div>}
    <div ref={videoContainerRef} className="fixed inset-0 z-0 bg-black overflow-hidden" aria-hidden="true"><video ref={videoRef} src={LOCAL_VIDEO_URL} muted playsInline preload="auto" className="cinematic-video" onError={() => setVideoError(true)}/></div>
    <motion.header style={{ y: headerY }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }} className="fixed top-0 left-1/2 -translate-x-1/2 z-20 w-[90%] flex items-center justify-between pointer-events-auto py-4 md:py-6 lg:py-8">
      <a href="#home" aria-label="WISA home"><Logo className="w-[157px] h-[25px]"/></a>
      <nav aria-label="Main navigation" className="hidden lg:flex items-stretch bg-[#1A1A1A]/40 backdrop-blur-[80px]"><div className="flex items-center justify-between px-6 font-mono text-xs tracking-[-0.01em] w-[480px]"><NavItem href="#programs">LEAGUES</NavItem><NavItem href="#facilities">STADIUMS</NavItem><NavItem href="#programs">TRAINING</NavItem><NavItem href="#experiences">COMPETITIONS</NavItem><NavItem href="#contact">TICKETS</NavItem></div><a href="mailto:tickets@wisa.football?subject=Match%20pass%20enquiry" className="bg-white text-black px-6 py-5 font-mono text-xs leading-4 font-bold tracking-[-0.01em] hover:bg-gray-200 transition-colors w-[148px] text-center">BUY MATCH PASS</a></nav>
    </motion.header>
    <main className="relative z-10 pointer-events-none">
      <section id="home" className="hero w-[90%] mx-auto h-screen flex flex-col py-8 md:py-12 lg:py-16 pb-12">
        <div className="hero-grid flex-1 w-full pointer-events-auto flex flex-col md:grid md:grid-cols-12 md:grid-rows-[1fr_auto] gap-y-8 md:gap-y-0 md:gap-x-8">
          <Reveal delay={0.2} className="hero-heading md:row-start-2 md:col-start-1 md:col-span-8 flex items-end"><h1 className="text-[clamp(2.5rem,6vw,5rem)] leading-[1.05] font-medium tracking-tight text-white whitespace-nowrap">Championing<br/>The Pitch Of Legends</h1></Reveal>
          <Reveal delay={0.3} className="hero-description md:row-start-1 md:col-start-8 md:col-span-5 flex flex-col justify-center items-start md:items-end text-left md:text-right"><p className="text-[clamp(1rem,1.6vw,1.375rem)] text-white/64 leading-[1.3] font-normal max-w-[460px] relative -top-[90px]">Advanced preparation and training of world-class football teams for leagues, tournaments, and trophies. <strong className="font-semibold text-white">We bring the trophy closer to your cabinet.</strong></p></Reveal>
          <Reveal delay={0.4} className="hero-cta md:row-start-2 md:col-start-8 md:col-span-5 flex items-end justify-start md:justify-end"><a href="#facilities" className="flex items-stretch gap-1 group cursor-pointer" onMouseEnter={() => setArrowCycle(c => c + 1)} onMouseLeave={() => setArrowCycle(c => c + 1)}><span className="px-8 py-5 bg-white/8 backdrop-blur-[80px] group-hover:bg-white transition-colors text-white/90 group-hover:text-black font-mono text-[12px] tracking-[-0.01em]">EXPLORE OUR STADIUMS</span><span className="px-6 bg-white/8 backdrop-blur-[80px] group-hover:bg-white group-hover:text-black transition-colors flex items-center"><Arrow cycle={arrowCycle}/></span></a></Reveal>
        </div>
      </section>
      <div className="h-[200px] w-full"/>
      <section id="about" className="w-[90%] mx-auto min-h-screen flex flex-col justify-center py-8 md:py-12 lg:py-16 pointer-events-auto">
        <div id="programs" className="max-w-[1200px] w-full">
          <ScrollReveal baseOpacity={0.1} enableBlur={true} baseRotation={3} blurStrength={4} textClassName="text-[clamp(2rem,4.5vw,4rem)] leading-[1.1] font-medium tracking-tight text-white w-full">Complete Football Programs For Professional Player Development. We Build The Foundations For Next-Generation Strikers, Midfielders, And Star Defenders.</ScrollReveal>
          <div className="mt-24 grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8">
            <Reveal delay={0.1} className="md:col-span-4"><div className="flex items-center gap-4 mb-6"><Globe/><Logo className="h-[18px] w-auto"/></div><p className="text-[11px] font-mono tracking-widest text-white/60 uppercase leading-relaxed">Winning the future on pitch</p></Reveal>
            <Reveal delay={0.2} className="md:col-span-4"><div id="facilities"><h3 className="text-xl font-medium text-white">Performance Analytics / Facilities</h3><p className="mt-4 text-[15px] text-white/80 leading-relaxed">World-class training grounds and performance insights. Give your team the space, tools, and expertise to turn preparation into winning performances.</p></div></Reveal>
            <Reveal delay={0.3} className="md:col-span-4"><div id="experiences"><h3 className="text-xl font-medium text-white">Matchday Premium / Fan Experiences!</h3><p className="mt-4 text-[15px] text-white/80 leading-relaxed">Closer to the action. From premium matchday hospitality to unforgettable moments in the stands, experience the game at its very best.</p></div></Reveal>
          </div>
        </div>
      </section>
      <div className="h-[200px] w-full"/>
      <div ref={screen3Ref} className="pointer-events-auto" id="contact"><footer style={{ width: '90%', margin: '0 auto', paddingBottom: 64 }}>
        <div style={{ backgroundColor: 'rgba(26, 26, 26, 0.6)', backdropFilter: 'blur(80px)', WebkitBackdropFilter: 'blur(80px)', border: '1px solid rgba(255, 255, 255, 0.1)', padding: 'clamp(32px, 4vw, 64px)' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'space-between', gap: 40, borderBottom: '1px solid rgba(255, 255, 255, 0.1)', paddingBottom: 'clamp(48px, 4vw, 80px)' }}><h2 style={{ fontSize: 'clamp(2rem, 4.5vw, 3.5rem)', fontWeight: 500, letterSpacing: '-0.02em', lineHeight: 1.05 }}>Ready To Score<br/>Your Winning Season?</h2><SeasonButton/></div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 'clamp(32px, 3vw, 48px)', paddingTop: 'clamp(48px, 4vw, 64px)' }}>
            <div><Logo className="h-[14px] w-auto"/><p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', maxWidth: 220, marginTop: 24, lineHeight: 1.7 }}>Winning the future on pitch.</p></div>
            {footerGroups.map(group => <div key={group.title}><h3 className="font-mono text-[10px] tracking-[0.1em] text-white/30 mb-6">{group.title}</h3><ul className="flex flex-col gap-3">{group.links.map(([label, href]) => <li key={label}><a href={href} className="text-sm text-white/60 hover:text-white transition-colors" {...(href.startsWith('https') ? { target: '_blank', rel: 'noreferrer' } : {})}>{label}</a></li>)}</ul></div>)}
          </div>
          <div className="flex flex-wrap justify-between gap-6 font-mono text-[11px] text-white/25 tracking-[0.1em]" style={{ marginTop: 56, paddingTop: 32, borderTop: '1px solid rgba(255,255,255,0.1)' }}><p>2026 WISA. ALL RIGHTS RESERVED.</p><div className="flex gap-6"><a href="mailto:hello@wisa.football?subject=Privacy%20enquiry" className="hover:text-white">PRIVACY</a><a href="mailto:hello@wisa.football?subject=Terms%20enquiry" className="hover:text-white">TERMS</a></div></div>
        </div>
      </footer></div>
    </main>
  </>;
}
