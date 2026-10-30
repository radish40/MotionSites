import React, {useEffect, useRef} from 'react';
import {createRoot} from 'react-dom/client';
import {Sparkles, Zap, ArrowRight, Star} from 'lucide-react';
import './index.css';

const asset = (path: string) => `${import.meta.env.BASE_URL}${path}`;
const aiCopy = 'Automate repetitive tasks, generate content in seconds, and let intelligent tools handle the heavy lifting -- so you can focus on what truly matters.';
function Video({number, className = ''}: {number: number; className?: string}) {
 return <video className={`video ${className}`} src={asset(`media/card-${number}.mp4`)} autoPlay loop muted playsInline aria-hidden="true"/>;
}
function CardOne() {
 return <article className="card card-one p-7 flex flex-col justify-between" aria-labelledby="ai-title">
  <Video number={1}/><div className="overlay one-shade"/>
  <div className="relative z-10"><div className="flex items-center gap-1.5 mb-3 text-amber-400"><Sparkles className="w-4 h-4"/><span className="font-condiment text-sm tracking-wide">The Future Is Now</span></div><h2 id="ai-title" className="font-grotesk text-white text-[32px] leading-[1.05] uppercase tracking-tight">Simplify<br/>Your Work<br/><span className="text-amber-400">With AI</span></h2></div>
  <div className="relative z-10"><p className="font-mono text-white/60 text-[10px] leading-relaxed mb-4">{aiCopy}</p><div className="flex items-center justify-between"><div className="flex items-center gap-2"><span className="w-7 h-7 rounded-full bg-amber-400/20 flex items-center justify-center"><Zap className="w-3.5 h-3.5 text-amber-400"/></span><span className="font-mono text-white/40 text-[8px] uppercase tracking-widest">AI Powered</span></div><button type="button" className="learn-more flex items-center gap-2 bg-white/10 rounded-full px-3.5 py-1.5 backdrop-blur-sm" aria-label="Learn more about AI powered work"><span className="font-grotesk text-white text-[10px] uppercase tracking-wide">Learn More</span><ArrowRight className="w-3.5 h-3.5 text-white"/></button></div></div>
 </article>;
}
function CardTwo() {
 return <article className="card" aria-labelledby="insights-title"><Video number={2}/><div className="overlay two-shade"/><div className="relative z-10 flex flex-col h-full justify-between p-7">
 <div><div className="liquid-glass rounded-lg px-3 py-1.5 inline-flex items-center gap-2 mb-5 animate-fade-rise font-inter"><span className="bg-white text-black rounded-md text-[7px] font-medium px-1.5 py-0.5">New</span><span className="text-[7px] font-medium text-white/60">Say Hello to Corewave v3.2</span></div><h2 id="insights-title" className="font-inter font-medium text-white text-[36px] leading-[1.05] tracking-[-1.5px] animate-fade-rise-delay">Your Insights.<br/>One Clear <span className="font-instrument italic font-normal text-white/80">Overview.</span></h2><p className="font-inter text-[#d4d8e8] text-[8.5px] leading-relaxed max-w-[240px] mt-3 opacity-90 animate-fade-rise-delay-2">Neuralyn helps teams track metrics, goals, and progress with precision.</p></div>
 <div className="flex items-center gap-3 animate-fade-rise-delay-2 font-inter"><span className="text-white/30 text-[9px] font-semibold tracking-tight">Neuralyn</span><span className="h-px bg-gradient-to-r from-white/15 to-transparent flex-1"/><span className="text-white/20 text-[7px] tracking-widest uppercase">Analytics</span></div></div></article>;
}
function CardThree() {
 return <article className="card card-three bg-white font-inter" aria-labelledby="stellar-title"><Video number={3}/><div className="stellar-fade"/><div className="relative z-20 flex flex-col h-full"><div className="flex-1 flex flex-col items-center justify-start pt-10 text-center px-5"><div className="flex items-center gap-1 mb-4 animate-fade-in-up text-black" style={{animationDelay:'.1s'}}><Star className="w-3 h-3 fill-black"/><span className="text-[8px] font-medium">Stellar.ai</span></div><h2 id="stellar-title" className="text-[30px] font-normal leading-[1.08] tracking-tight mb-2.5 animate-fade-in-up" style={{animationDelay:'.2s'}}>Work Smarter.<br/>Move Faster.<br/><span className="bg-gradient-to-r from-black via-gray-500 to-gray-400 bg-clip-text text-transparent">AI Powers You Up.</span></h2><p className="text-[9px] text-gray-500 leading-relaxed max-w-[240px] animate-fade-in-up" style={{animationDelay:'.3s'}}>Intelligent automation syncs with the tools you love to streamline tasks, boost output, and save time.</p></div><div className="flex flex-col items-center gap-2 pb-4 animate-fade-in-up" style={{animationDelay:'.4s'}}><span className="rounded-full px-2.5 py-0.5 text-[7px] font-medium text-white backdrop-blur-md bg-white/15 border border-white/20">Collaborating with top aerospace pioneers globally</span><div className="flex gap-5 text-base italic text-white tracking-tight" style={{fontFamily:'Georgia, serif'}}>{['Aeon','Vela','Apex','Orbit','Zeno'].map(brand=><span key={brand}>{brand}</span>)}</div></div></div></article>;
}
function CardFour() {
 return <article className="card" aria-labelledby="focus-title"><Video number={4}/><div className="overlay four-shade"/><div className="relative z-10 flex flex-col h-full justify-end px-6 pb-7"><h2 id="focus-title" className="font-instrument text-white text-[32px] leading-[.95] tracking-tight animate-fade-rise">Focus in a<br/>Distracted World</h2><p className="font-inter text-white/70 text-[8px] leading-relaxed max-w-[220px] mt-3 animate-fade-rise-delay">Designing tools for deep thinkers, bold creators, and quiet rebels. Digital spaces for sharp focus and inspired work.</p><span className="font-instrument text-white/25 text-[10px] tracking-tight mt-4 animate-fade-rise-delay-2">Velorah<sup className="text-[5px]">®</sup></span></div></article>;
}
function FadingVideo() {
 const ref = useRef<HTMLVideoElement>(null);
 useEffect(()=>{
  const video=ref.current!; let frame=0; let timer:ReturnType<typeof setTimeout>;
  const tick=()=>{const t=video.currentTime,d=video.duration; video.style.opacity=String(Number.isFinite(d)?Math.max(0,Math.min(1,t/.5,(d-t)/.5)):0);frame=requestAnimationFrame(tick);};
  const restart=()=>{video.style.opacity='0';timer=setTimeout(()=>{video.currentTime=0;void video.play().catch(()=>{});},100);};
  frame=requestAnimationFrame(tick);video.addEventListener('ended',restart);
  return ()=>{cancelAnimationFrame(frame);clearTimeout(timer);video.removeEventListener('ended',restart);};
 },[]);
 return <div className="aethera-video"><video ref={ref} className="video" src={asset('media/card-5.mp4')} autoPlay muted playsInline style={{opacity:0}} aria-hidden="true"/></div>;
}
function CardFive() {
 return <article className="card bg-white" aria-labelledby="aethera-title"><FadingVideo/><div className="overlay five-shade"/><div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-5"><h2 id="aethera-title" className="font-instrument text-[34px] leading-[.95] tracking-[-.8px] text-black animate-fade-rise">Beyond <em className="text-[#6F6F6F]">silence,</em><br/>we build <em className="text-[#6F6F6F]">the eternal.</em></h2><p className="font-inter text-[#6F6F6F] text-[8px] leading-relaxed max-w-[230px] mt-3 animate-fade-rise-delay">Platforms for deep thinkers and fearless makers. Digital havens for focused work and pure creative flow.</p><span className="font-instrument text-[10px] text-black/30 mt-5 tracking-tight animate-fade-rise-delay-2">Aethera<sup className="text-[5px]">®</sup></span></div></article>;
}
function CardSix() {
 return <article className="card" aria-labelledby="bloom-title"><Video number={6}/><div className="overlay six-shade"/><div className="relative z-10 flex flex-col h-full justify-between p-6"><div className="flex items-center gap-2 text-white/50"><Sparkles className="w-3.5 h-3.5"/><span className="font-poppins text-[9px] font-medium uppercase tracking-[.2em]">AI-Powered Floral Design</span></div><div><h2 id="bloom-title" className="font-poppins font-medium text-white text-[38px] leading-[.95] tracking-[-.05em] animate-fade-rise">Innovating the<br/><em className="font-source-serif italic font-medium text-white/80">spirit of</em> bloom</h2><p className="font-poppins text-white/50 text-[8px] leading-relaxed max-w-[200px] mt-3 animate-fade-rise-delay">Where artificial intelligence meets nature's artistry. Sculpting living compositions beyond imagination.</p><div className="flex mt-4 gap-2 animate-fade-rise-delay-2">{['AI Generation','3D Structures'].map(label=><span key={label} className="liquid-glass rounded-full px-3 py-1 text-[7px] text-white/80 font-poppins">{label}</span>)}</div></div></div></article>;
}
function App() {
 return <main className="gallery-page" style={{backgroundImage:`url(${asset('bg.jpeg')})`}} aria-label="Social Media Posts"><div className="post-grid"><CardOne/><CardTwo/><CardThree/><CardFour/><CardFive/><CardSix/></div></main>;
}
createRoot(document.getElementById('root')!).render(<React.StrictMode><App/></React.StrictMode>);
