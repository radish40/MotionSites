import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Play, Menu, X, User, Plus } from 'lucide-react';
import './index.css';

const SCROLL_DISTANCE = 1800;
const SPOTLIGHT_R = 260;
const GRID_CELL = 48;
const asset = (name: string) => `${import.meta.env.BASE_URL}assets/${name}`;
const images = {hero: asset('hero-base.webp'), heroReveal: asset('hero-reveal.webp'), card: asset('card-base.png'), cardReveal: asset('card-reveal.png')};
type Phase = 'idle' | 'playing' | 'done';

function Logo() {
 return <div className="flex items-center gap-2.5"><svg width="24" height="24" viewBox="0 0 256 256" fill="white" aria-hidden="true"><path d="M128 192 L128 256 L64.5 256 L32 223 L0 192 L0 128 L64 128 Z M256 192 L256 256 L192.5 256 L160 223 L128 192 L128 128 L192 128 Z M128 64 L128 128 L64.5 128 L32 95 L0 64 L0 0 L64 0 Z M256 64 L256 128 L192.5 128 L160 95 L128 64 L128 0 L192 0 Z"/></svg><span className="text-sm font-medium tracking-wide uppercase text-white">Infinite</span></div>;
}

// Independent animation loops keep the reveal and grid smooth without rendering the page every frame.
function useSpotlight(active: boolean, grid = false) {
 const section = useRef<HTMLElement>(null);
 const reveal = useRef<HTMLDivElement>(null);
 const pattern = useRef<SVGPatternElement>(null);
 useEffect(() => {
  if (!active) return;
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  let raw = {x: -600, y: -600}, smooth = {...raw}, offset = {x:0,y:0}, frame = 0;
  let dirty = true;
  const resize = () => {canvas.width = window.innerWidth; canvas.height = window.innerHeight;dirty = true;};
  const move = (e: PointerEvent) => {if(e.pointerType === 'touch') return; raw = {x:e.clientX,y:e.clientY};dirty = true;};
  const leave = () => {raw = {x:-600,y:-600};dirty = true;};
  resize(); window.addEventListener('resize',resize);window.addEventListener('pointermove',move);document.addEventListener('pointerleave',leave);
  const draw = () => {
   const dx = raw.x-smooth.x, dy = raw.y-smooth.y;
   if (dirty || Math.abs(dx)+Math.abs(dy)>.15) {
    smooth.x += dx*.1;smooth.y += dy*.1;
    const rect = section.current?.getBoundingClientRect();
    const x = smooth.x-(rect?.left||0), y = smooth.y-(rect?.top||0);
    ctx.clearRect(0,0,canvas.width,canvas.height);
    const gradient = ctx.createRadialGradient(x,y,0,x,y,SPOTLIGHT_R);
    [[0,1],[.4,1],[.6,.75],[.75,.4],[.88,.12],[1,0]].forEach(([stop,alpha])=>gradient.addColorStop(stop,`rgba(255,255,255,${alpha})`));
    ctx.fillStyle=gradient;ctx.beginPath();ctx.arc(x,y,SPOTLIGHT_R,0,Math.PI*2);ctx.fill();
    if(reveal.current) {const mask=`url(${canvas.toDataURL()})`; reveal.current.style.maskImage=mask; reveal.current.style.webkitMaskImage=mask;}
    dirty=false;
   }
   if(grid && pattern.current) {
    offset.x += (((raw.x/window.innerWidth)-.5)*16-offset.x)*.06;
    offset.y += (((raw.y/window.innerHeight)-.5)*16-offset.y)*.06;
    pattern.current.setAttribute('x',String(offset.x));pattern.current.setAttribute('y',String(offset.y));
   }
   frame=requestAnimationFrame(draw);
  };
  frame=requestAnimationFrame(draw);
  return ()=>{cancelAnimationFrame(frame);window.removeEventListener('resize',resize);window.removeEventListener('pointermove',move);document.removeEventListener('pointerleave',leave);};
 },[active,grid]);
 return {section,reveal,pattern};
}
const imageStyle = (image: string) => ({backgroundImage:`url("${image}")`});
const whiteButton = 'bg-white text-gray-900 text-sm font-medium px-6 sm:px-7 py-3 sm:py-3.5 rounded-full hover:bg-white/90 transition-all';

function HeroSection({faded,onFeatures,onHow}:{faded:boolean;onFeatures:()=>void;onHow:()=>void}) {
 const {section,reveal,pattern}=useSpotlight(!faded,true);
 return <section ref={section} aria-label="Infinite premium credit card" className="font-helvetica-neue sticky top-0 hero-height w-full overflow-clip z-[3]">
  <div className={`absolute inset-0 transition-opacity duration-500 ${faded?'opacity-0 pointer-events-none':'opacity-100'}`} aria-hidden={faded} inert={faded ? '' : undefined}>
   <svg className="absolute inset-0 h-full w-full opacity-[.08]" aria-hidden="true"><defs><pattern ref={pattern} id="hero-grid" width={GRID_CELL} height={GRID_CELL} patternUnits="userSpaceOnUse"><path d="M48 0 L0 0 0 48" stroke="#94a3b8" strokeWidth="0.5" fill="none"/></pattern></defs><rect width="100%" height="100%" fill="url(#hero-grid)"/></svg>
   <div className="absolute inset-0 bg-center bg-cover bg-no-repeat z-10 anim-fade" style={{...imageStyle(images.hero),animationDelay:'.1s'}}/>
   <div ref={reveal} className="absolute inset-0 bg-center bg-cover bg-no-repeat z-30 pointer-events-none" style={{...imageStyle(images.heroReveal),maskImage:'linear-gradient(transparent,transparent)'}}/>
   <div className="absolute bottom-0 left-0 right-0 h-72 z-40 pointer-events-none bg-gradient-to-t from-[#0A0B11] via-[#0A0B11]/60 to-transparent"/>
   <div className="absolute bottom-0 left-0 right-0 z-50 px-6 sm:px-10 md:px-14 pb-12 sm:pb-16 md:pb-20">
    <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-end">
     <div className="md:col-span-7 lg:col-span-8">
      <div className="flex items-center gap-2.5 mb-5 sm:mb-6 anim-stagger" style={{animationDelay:'.3s'}}><span className="w-2.5 h-2.5 rounded-full bg-white/80"/><span className="text-sm sm:text-[15px] text-white/80 font-normal tracking-wide">Best digital banking card 2026</span></div>
      <h1 className="text-[clamp(2.2rem,6.5vw,5rem)] font-light text-white leading-[0.95] tracking-[-0.03em] mb-8 sm:mb-10 anim-stagger" style={{animationDelay:'.5s'}}>One Card, Zero<br/>Limits. Worldwide.</h1>
      <div className="flex flex-wrap gap-3 anim-stagger" style={{animationDelay:'.7s'}}><button onClick={onFeatures} className={whiteButton}>See Features</button><button onClick={onHow} className="flex items-center gap-2.5 bg-white/5 backdrop-blur-sm border border-white/10 text-white/90 text-sm font-medium px-6 sm:px-7 py-3 sm:py-3.5 rounded-full hover:bg-white/15 transition-all"><Play size={13} className="fill-white/90"/>How It Works</button></div>
     </div>
     <p className="md:col-span-5 lg:col-span-4 text-[15px] sm:text-base text-white/75 leading-relaxed font-normal anim-stagger" style={{animationDelay:'.85s'}}>Infinite is a premium metal credit card built for those who move fast and spend globally. Tap anywhere, earn instantly, skip foreign fees entirely, and travel already rewarded.</p>
    </div>
   </div>
  </div>
 </section>;
}

function CardSection({imagesVisible,onMore,onApply}:{imagesVisible:boolean;onMore:()=>void;onApply:()=>void}) {
 const {section,reveal}=useSpotlight(imagesVisible);
 return <section ref={section} aria-label="Instant activation" aria-hidden={!imagesVisible} inert={!imagesVisible ? '' : undefined} className={`fixed inset-0 w-full h-full z-[4] transition-opacity duration-1000 ease-out ${imagesVisible?'opacity-100':'opacity-0 pointer-events-none'}`}>
  <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden"><span className="font-medium tracking-[-0.05em] text-white/[0.04] whitespace-nowrap uppercase" style={{fontSize:'26vw'}}>Infinite</span></div>
  <div className="absolute inset-0 z-[1] bg-center bg-cover bg-no-repeat" style={imageStyle(images.card)}/>
  <div ref={reveal} className="absolute inset-0 z-[3] bg-center bg-cover bg-no-repeat pointer-events-none" style={{...imageStyle(images.cardReveal),maskImage:'linear-gradient(transparent,transparent)'}}/>
  <div className="relative z-[5] pt-20 sm:pt-28 md:pt-32 px-5 sm:px-10 md:px-14"><h2 className="text-[clamp(2rem,7vw,5.5rem)] font-light text-white leading-[0.95] tracking-[-0.03em]">Instantly Active</h2></div>
  <button onClick={onMore} className="absolute z-10 top-32 sm:top-28 md:top-32 right-5 sm:right-10 md:right-14 flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/15 text-white/80 text-sm font-medium px-4 sm:px-5 py-2 sm:py-2.5 rounded-full hover:bg-white/15 transition-all"><Plus size={15}/>More</button>
  <h2 className="absolute z-[5] bottom-44 sm:bottom-40 md:bottom-44 right-5 sm:right-10 md:right-14 text-[clamp(2rem,7vw,5.5rem)] font-light text-white leading-[0.95] tracking-[-0.03em] text-right">Before You Swipe</h2>
  <div className="absolute z-[5] bottom-6 sm:bottom-14 md:bottom-16 left-5 sm:left-10 md:left-14 right-5 sm:right-auto"><div className="max-w-md"><p className="text-sm sm:text-[15px] md:text-base text-white/65 leading-relaxed mb-5 sm:mb-6">Get approved in seconds, receive your virtual card instantly, and arrive with cashback, travel perks, and spending insights already active.</p><button onClick={onApply} className="bg-white text-gray-900 text-sm font-medium px-5 sm:px-6 py-2.5 sm:py-3 rounded-full hover:bg-white/90 transition-all">Apply now for free</button></div></div>
 </section>;
}

const details:Record<string,{title:string;body:string}>={
 Rewards:{title:'Already rewarded.',body:'Tap anywhere, earn instantly. Arrive with cashback and spending insights already active.'},
 Travel:{title:'Limits. Worldwide.',body:'Move fast and spend globally. Skip foreign fees entirely, with travel perks already active.'},
 Plans:{title:'One Card, Zero Limits.',body:'Infinite is a premium metal credit card built for those who move fast and spend globally.'},
 Support:{title:'Support',body:'This preview demonstrates the Infinite card experience. Live customer support is not connected.'},
 Account:{title:'Your Infinite account',body:'Account access is not connected in this preview.'},
 More:{title:'Ready before you are.',body:'Get approved in seconds, receive your virtual card instantly, and arrive with cashback, travel perks, and spending insights already active.'},
 Apply:{title:'Your next move. Infinite.',body:'Applications are not connected in this preview. Explore the card to see what comes with Infinite.'}
};
function App() {
 const [phase,setPhase]=useState<Phase>('idle');const phaseRef=useRef<Phase>('idle');const video=useRef<HTMLVideoElement>(null);
 const [menuOpen,setMenuOpen]=useState(false);const [detail,setDetail]=useState<string|null>(null);const dialog=useRef<HTMLDialogElement>(null);
 const scrollTo=(y:number)=>{setMenuOpen(false);window.scrollTo({top:y,behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});};
 const show=(key:string)=>{setMenuOpen(false);setDetail(key);};
 useEffect(()=>{let frame=0; const tick=()=>{const progress=Math.min(window.scrollY/SCROLL_DISTANCE,1);const next:Phase=window.scrollY===0?'idle':progress>=.99?'done':'playing';if(next!==phaseRef.current){phaseRef.current=next;setPhase(next);}const el=video.current;if(el&&Number.isFinite(el.duration)&&!el.seeking){const target=progress*el.duration;if(Math.abs(el.currentTime-target)>.025)el.currentTime=target;}frame=requestAnimationFrame(tick);};frame=requestAnimationFrame(tick);return()=>cancelAnimationFrame(frame);},[]);
 useEffect(()=>{if(detail)dialog.current?.showModal();else dialog.current?.close();},[detail]);
 useEffect(()=>{const onKey=(e:KeyboardEvent)=>{if(e.key==='Escape')setMenuOpen(false);};window.addEventListener('keydown',onKey);return()=>window.removeEventListener('keydown',onKey);},[]);
 const navAction=(name:string)=>name==='Card'?scrollTo(0):show(name);
 const account=<button onClick={()=>show('Account')} className="flex items-center gap-2 bg-white/10 backdrop-blur-md text-white/80 text-sm font-medium pl-1.5 pr-4 py-1.5 rounded-full hover:text-white hover:bg-white/15 transition-colors"><span className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center"><User size={14} strokeWidth={1.8}/></span>Account</button>;
 const start=<button onClick={()=>scrollTo(SCROLL_DISTANCE)} className="bg-white text-gray-900 text-sm font-medium px-5 py-2 rounded-full hover:bg-white/90 transition-colors">Get Started</button>;
 return <div className="min-h-screen bg-[#0A0B11]">
  <div className={`fixed inset-0 z-[2] transition-opacity duration-500 pointer-events-none ${phase==='idle'?'opacity-0':'opacity-100'}`}><video ref={video} src={asset('card-motion.mp4')} muted playsInline preload="auto" className="w-full h-full object-cover"/><div className="absolute bottom-0 left-0 right-0 h-72 bg-gradient-to-t from-[#0A0B11] via-[#0A0B11]/60 to-transparent"/></div>
  <nav aria-label="Main navigation" className="fixed top-0 left-0 right-0 z-[60] flex items-center justify-between px-5 sm:px-8 md:px-10 py-4 sm:py-5"><button aria-label="Infinite home" onClick={()=>scrollTo(0)}><Logo/></button><div className="hidden md:flex absolute left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur-md rounded-full px-1.5 py-1.5 items-center gap-0.5">{['Card','Rewards','Travel','Plans','Support'].map(name=><button key={name} onClick={()=>navAction(name)} className={`text-sm font-medium px-4 py-1.5 rounded-full transition-colors ${name==='Card'?'bg-white text-gray-900':'text-white/70 hover:text-white'}`}>{name}</button>)}</div><div className="hidden md:flex items-center gap-3">{account}{start}</div><button aria-label={menuOpen?'Close menu':'Open menu'} aria-expanded={menuOpen} aria-controls="mobile-menu" onClick={()=>setMenuOpen(!menuOpen)} className="md:hidden text-white p-2 relative w-8 h-8 flex items-center justify-center"><span className={`absolute transition-all duration-300 ${menuOpen?'opacity-0 rotate-90':'opacity-100 rotate-0'}`}><Menu size={22}/></span><span className={`absolute transition-all duration-300 ${menuOpen?'opacity-100 rotate-0':'opacity-0 -rotate-90'}`}><X size={22}/></span></button></nav>
  <div onClick={()=>setMenuOpen(false)} className={`fixed inset-0 z-[54] bg-black/60 backdrop-blur-sm md:hidden transition-opacity duration-300 ${menuOpen?'opacity-100':'opacity-0 pointer-events-none'}`}/>
  <div id="mobile-menu" aria-hidden={!menuOpen} inert={!menuOpen?'':undefined} className={`fixed z-[55] top-0 left-0 right-0 bg-[#0A0B11]/[.98] backdrop-blur-xl pt-20 pb-8 px-6 border-b border-white/10 flex flex-col gap-0 md:hidden transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] origin-top ${menuOpen?'translate-y-0 opacity-100 scale-y-100':'-translate-y-4 opacity-0 scale-y-95 pointer-events-none'}`}>{['Card','Rewards','Travel','Plans','Support'].map((name,i)=><button key={name} onClick={()=>navAction(name)} style={{transitionDelay:menuOpen?`${80+i*40}ms`:'0ms'}} className={`text-white/80 text-[17px] font-medium py-4 border-b border-white/[0.06] text-left hover:text-white transition-all duration-300 ${menuOpen?'translate-y-0 opacity-100':'-translate-y-2 opacity-0'}`}>{name}</button>)}<div className="flex items-center gap-3 pt-6 transition-all duration-300" style={{transitionDelay:menuOpen?'300ms':'0ms'}}>{account}{start}</div></div>
  <HeroSection faded={phase!=='idle'} onFeatures={()=>scrollTo(SCROLL_DISTANCE)} onHow={()=>scrollTo(SCROLL_DISTANCE*.45)}/>
  <div style={{height:SCROLL_DISTANCE,position:'relative',zIndex:0}} aria-hidden="true"/>
  <CardSection imagesVisible={phase==='done'} onMore={()=>show('More')} onApply={()=>show('Apply')}/>
  <dialog ref={dialog} onCancel={()=>setDetail(null)} onClick={e=>{if(e.target===e.currentTarget)setDetail(null);}} className="bg-[#12141e] text-white border border-white/15 rounded-3xl p-8 sm:p-10 w-[calc(100%-40px)] max-w-lg backdrop:bg-black/70 backdrop:backdrop-blur-md"><button autoFocus aria-label="Close details" onClick={()=>setDetail(null)} className="absolute right-5 top-5 p-2 text-white/70 hover:text-white"><X size={20}/></button>{detail&&<><p className="text-xs tracking-[.2em] uppercase text-white/50 mb-6">Infinite</p><h2 className="text-3xl font-light tracking-tight mb-4">{details[detail].title}</h2><p className="text-white/65 leading-relaxed mb-8">{details[detail].body}</p><button className={whiteButton} onClick={()=>{setDetail(null);scrollTo(SCROLL_DISTANCE);}}>Explore the card</button></>}</dialog>
 </div>;
}
createRoot(document.getElementById('root')!).render(<React.StrictMode><App/></React.StrictMode>);
