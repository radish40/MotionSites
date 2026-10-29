import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { Menu, X } from 'lucide-react';

const links = ['Module', 'Case Records', 'Biotech', 'Tiers', 'Live Demo'];
const mark = 'M 256 64 L 256 128 L 192.5 128 L 160 95 L 128 64 L 96 95 L 63.5 128 L 64 128 L 128 192 L 128 256 L 64.5 256 L 32 223 L 0 192 L 0 64 L 64 0 L 192 0 Z M 256 192 L 256 256 L 192.5 256 L 160 223 L 128 192 L 128 128 L 192 128 Z';
function Logo() { return <svg width="22" height="22" viewBox="0 0 256 256" fill="white" aria-label="Cyberpunk Reveal"><path d={mark}/></svg>; }
const polar = (r: number, angle: number) => ({ x: -110 + r * Math.cos(angle * Math.PI / 180), y: 300 + r * Math.sin(angle * Math.PI / 180) });
function Stats() {
  return <div className="absolute inset-y-0 right-0 z-50 hidden pointer-events-none sm:block" aria-label="10+ years real, 40+ use forms, 95% repeat members"><svg viewBox="0 0 380 700" preserveAspectRatio="xMaxYMid meet" className="h-full w-auto" aria-hidden="true">
    {[{ r:330, start:-92, end:16, dot:-46, number:'10', suffix:'+', label:'YEARS REAL' }, { r:395, start:-56, end:60, dot:2, number:'40', suffix:'+', label:'USE FORMS' }, { r:460, start:-14, end:72, dot:44, number:'95', suffix:'%', label:'REPEAT MEMBERS' }].map((a,i) => {
      const start=polar(a.r,a.start), end=polar(a.r,a.end), dot=polar(a.r,a.dot), delay=.4+i*.22, markDelay=delay+.9;
      return <g key={a.r}>
        <defs><linearGradient id={`arc-${i}`} gradientUnits="userSpaceOnUse" x1={start.x} y1={start.y} x2={end.x} y2={end.y}>{[[0,0],[22,.5],[55,.5],[85,.1],[100,0]].map(([offset,opacity])=><stop key={offset} offset={`${offset}%`} stopColor="white" stopOpacity={opacity}/>)}</linearGradient></defs>
        <path d={`M ${start.x} ${start.y} A ${a.r} ${a.r} 0 0 1 ${end.x} ${end.y}`} fill="none" stroke={`url(#arc-${i})`} strokeWidth="1.1" className="arc-line" style={{'--len':a.r*(a.end-a.start)*Math.PI/180, animationDelay:`${delay}s`} as CSSProperties}/>
        <circle cx={dot.x} cy={dot.y} r="7" fill="none" stroke="white" strokeOpacity=".35" className="arc-ring" style={{animationDelay:`${markDelay+.3}s`}}/>
        <circle cx={dot.x} cy={dot.y} r="3.4" fill="white" className="arc-dot" style={{animationDelay:`${markDelay}s`}}/>
        <text x={dot.x+16} y={dot.y+4} fill="white" fontSize="32" letterSpacing="-1" className="arc-text" style={{animationDelay:`${markDelay+.15}s`}}>{a.number}<tspan fontSize="19" dy="-10">{a.suffix}</tspan></text>
        <text x={dot.x+18} y={dot.y+22} fill="white" fillOpacity=".8" fontSize="8.5" fontWeight="600" letterSpacing="2" className="arc-text" style={{animationDelay:`${markDelay+.3}s`}}>{a.label}</text>
      </g>;
    })}
  </svg></div>;
}
export default function App() {
  const [menuOpen,setMenuOpen]=useState(false);
  const reveal=useRef<HTMLDivElement>(null), grid=useRef<SVGPatternElement>(null);
  useEffect(()=>{
    const canvas=document.createElement('canvas'), context=canvas.getContext('2d')!;
    const mouse={x:-999,y:-999}, smooth={...mouse}, target={x:0,y:0}, offset={x:0,y:0};
    const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
    let frame=0;
    const resize=()=>{canvas.width=window.innerWidth;canvas.height=window.innerHeight;};
    const move=(e:MouseEvent)=>{mouse.x=e.clientX;mouse.y=e.clientY;target.x=(e.clientX/innerWidth-.5)*16;target.y=(e.clientY/innerHeight-.5)*16;};
    const leave=()=>{mouse.x=-999;mouse.y=-999;target.x=0;target.y=0;};
    const tick=()=>{
      smooth.x+=(mouse.x-smooth.x)*(reduced.matches?1:.1); smooth.y+=(mouse.y-smooth.y)*(reduced.matches?1:.1);
      offset.x+=(target.x-offset.x)*.06;offset.y+=(target.y-offset.y)*.06;
      if(grid.current&&!reduced.matches){grid.current.setAttribute('x',`${offset.x}`);grid.current.setAttribute('y',`${offset.y}`);}
      context.clearRect(0,0,canvas.width,canvas.height);
      const gradient=context.createRadialGradient(smooth.x,smooth.y,0,smooth.x,smooth.y,260);
      [[0,1],[.4,1],[.6,.75],[.75,.4],[.88,.12],[1,0]].forEach(([stop,alpha])=>gradient.addColorStop(stop,`rgba(255,255,255,${alpha})`));
      context.fillStyle=gradient;context.beginPath();context.arc(smooth.x,smooth.y,260,0,Math.PI*2);context.fill();
      if(reveal.current){const mask=`url(${canvas.toDataURL()})`;reveal.current.style.maskImage=mask;reveal.current.style.webkitMaskImage=mask;}
      frame=requestAnimationFrame(tick);
    };
    resize();frame=requestAnimationFrame(tick);
    window.addEventListener('resize',resize);window.addEventListener('mousemove',move);document.addEventListener('mouseleave',leave);
    return ()=>{cancelAnimationFrame(frame);window.removeEventListener('resize',resize);window.removeEventListener('mousemove',move);document.removeEventListener('mouseleave',leave);};
  },[]);
  useEffect(()=>{const escape=(event:KeyboardEvent)=>{if(event.key==='Escape')setMenuOpen(false);};window.addEventListener('keydown',escape);return()=>window.removeEventListener('keydown',escape);},[]);
  return <div className="min-h-screen bg-white tracking-[-0.02em]" style={{fontFamily:"'JetBrains Mono', monospace"}}>
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between md:justify-center p-4 sm:p-5" aria-label="Main navigation">
      <div className="nav-drop hidden md:flex bg-black/60 backdrop-blur-md rounded-full pl-3 pr-2 py-2 items-center gap-1">
        <a href="#module" aria-label="Cyberpunk Reveal home" className="mr-2"><Logo/></a>
        {links.map((link,i)=><a key={link} href="#module" className={`${i===0?'text-white':'text-gray-300'} text-sm font-medium px-3 py-1.5 rounded-full hover:bg-white/10 hover:text-white transition-colors`}>{link}</a>)}
        <button className="bg-white text-gray-900 text-sm font-semibold px-5 py-1.5 rounded-full hover:bg-gray-100 ml-1">Connect</button>
      </div>
      <a href="#module" aria-label="Cyberpunk Reveal home" className="nav-drop md:hidden bg-black/60 backdrop-blur-md rounded-full p-3"><Logo/></a>
      <button className="nav-drop md:hidden bg-black/60 backdrop-blur-md rounded-full p-3 text-white" aria-label={menuOpen?'Close menu':'Open menu'} aria-expanded={menuOpen} aria-controls="mobile-menu" onClick={()=>setMenuOpen(!menuOpen)}>{menuOpen?<X size={22}/>:<Menu size={22}/>}</button>
    </nav>
    {menuOpen&&<div id="mobile-menu" className="fixed top-0 left-0 right-0 z-40 pt-16 pb-6 px-5 bg-white shadow-lg md:hidden">{links.map(link=><a href="#module" key={link} onClick={()=>setMenuOpen(false)} className="block text-gray-800 py-3 border-b border-gray-100 text-sm">{link}</a>)}<button onClick={()=>setMenuOpen(false)} className="mt-5 rounded-full bg-gray-900 px-6 py-3 text-sm text-white">Connect</button></div>}
    <main id="module" className="relative h-[100dvh] overflow-hidden">
      <svg className="absolute inset-0 z-0 h-full w-full opacity-10" aria-hidden="true"><defs><pattern ref={grid} id="grid" width="48" height="48" patternUnits="userSpaceOnUse"><path d="M 48 0 L 0 0 0 48" fill="none" stroke="#64748b" strokeWidth=".6"/></pattern></defs><rect width="100%" height="100%" fill="url(#grid)"/></svg>
      <div className="base-image absolute inset-0 z-10 bg-center bg-cover" style={{backgroundImage:`url('${import.meta.env.BASE_URL}images/base.webp')`}}/>
      <div ref={reveal} className="reveal-image absolute inset-0 z-30 bg-center bg-cover pointer-events-none" style={{backgroundImage:`url('${import.meta.env.BASE_URL}images/reveal.webp')`}}/>
      <Stats/>
      <div className="absolute bottom-12 sm:bottom-16 md:bottom-24 left-5 sm:left-8 md:left-12 z-50 max-w-[300px] sm:max-w-md text-white">
        <p className="hero-rise text-[11px] sm:text-xs font-semibold tracking-[0.12em] text-white/90 mb-5" style={{animationDelay:'.15s'}}>Gateway to your <span className="italic">augmented self</span></p>
        <h1 className="hero-rise text-4xl sm:text-5xl md:text-6xl leading-[1.05] tracking-[-0.08em] font-normal mb-5" style={{animationDelay:'.3s'}}>A window<br/>of coming<br/>enhancements</h1>
        <p className="hero-rise text-sm sm:text-base text-white/90 leading-relaxed mb-7" style={{animationDelay:'.5s'}}>A future where carbon fiber, titanium, and human instinct align. Not machine. Not human. Something wonderfully poised between.</p>
        <div className="hero-rise" style={{animationDelay:'.7s'}}><button className="group relative overflow-hidden bg-white text-gray-900 text-sm font-semibold px-7 sm:px-8 py-3 sm:py-3.5 rounded-full shadow-lg shadow-black/20 transition-transform hover:scale-[1.04] active:scale-95"><span className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"/><span className="relative">Reserve Now</span></button></div>
      </div>
    </main>
  </div>;
}
