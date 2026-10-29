import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { AnimatePresence, motion, MotionValue, useInView, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { Sparkles, Waves, Star, Zap, Orbit, Gem } from 'lucide-react';
import './styles.css';

const asset = (name: string) => `${import.meta.env.BASE_URL}assets/${name}.png`;
const links = [['Home','home'],['About','about'],['Estates','estates'],['Projects','projects'],['Inquire','inquire']];
const contact = 'mailto:?subject=Aether%20Lane%20%E2%80%94%20Residence%20inquiry';
function ContactButton({large=false}: {large?:boolean}) {
 return <motion.a href={contact} whileHover={{scale:1.05}} whileTap={{scale:.97}} className={`contact-button ${large?'mt-6 px-8 py-2.5 text-base sm:mt-7 sm:px-10 sm:py-3 sm:text-lg':'px-6 py-2 text-[15px]'}`}>Get in touch</motion.a>;
}
function Logo() { return <a href="#home" aria-label="Aether Lane home" className="flex shrink-0 items-center gap-2 text-base font-medium text-white md:text-xl"><svg aria-hidden="true" className="h-6 w-6 md:h-7 md:w-7" viewBox="0 0 256 256" fill="currentColor"><path d="M 228 0 C 172.772 0 128 44.772 128 100 L 128 0 L 0 0 L 0 28 C 0 83.228 44.772 128 100 128 L 0 128 L 0 256 L 28 256 C 83.228 256 128 211.228 128 156 L 128 256 L 256 256 L 256 228 C 256 172.772 211.228 128 156 128 L 256 128 L 256 0 Z"/></svg>Aether Lane</a>; }
function Navbar() {
 const [open,setOpen]=useState(false);
 const toggle=useRef<HTMLButtonElement>(null);
 const menu=useRef<HTMLDivElement>(null);
 useEffect(()=>{
  if(!open) return;
  const previous=document.body.style.overflow;
  document.body.style.overflow='hidden';
  const timer=window.setTimeout(()=>menu.current?.querySelector('a')?.focus(),100);
  const handle=(event:KeyboardEvent)=>{
   if(event.key==='Escape'){setOpen(false);toggle.current?.focus();}
   if(event.key==='Tab'){
    const items=[...Array.from(menu.current?.querySelectorAll<HTMLAnchorElement>('a')||[]),toggle.current!];
    const current=items.indexOf(document.activeElement as HTMLAnchorElement);
    event.preventDefault();items[(current+(event.shiftKey?-1:1)+items.length)%items.length]?.focus();
   }
  };
  window.addEventListener('keydown',handle);
  return ()=>{document.body.style.overflow=previous;window.clearTimeout(timer);window.removeEventListener('keydown',handle);};
 },[open]);
 useEffect(()=>{const media=matchMedia('(min-width: 768px)');const close=()=>{if(media.matches)setOpen(false);};media.addEventListener('change',close);return()=>media.removeEventListener('change',close);},[]);
 return <>
 <header className="pointer-events-none fixed inset-x-0 top-0 z-[60] flex justify-center px-4 pt-4 md:pt-6"><nav aria-label="Main navigation" className="pointer-events-auto flex items-center gap-4 rounded-full bg-[#312D7C]/40 px-4 py-3 backdrop-blur-[15px] md:gap-8 lg:gap-20"><Logo/><div className="hidden items-center gap-6 md:flex">{links.map(([label,id],i)=><a key={id} href={`#${id}`} className={`text-sm transition-colors hover:text-white ${i===0?'text-white':'text-[#B6B8C3]'}`}>{label}</a>)}</div><div className="hidden md:block"><ContactButton/></div><button ref={toggle} type="button" aria-expanded={open} aria-controls="mobile-menu" aria-label={open?'Close menu':'Open menu'} onClick={()=>setOpen(!open)} className="relative flex h-8 w-8 flex-col items-center justify-center gap-[5px] md:hidden">{[0,1,2].map(i=><motion.span key={i} className="block h-px w-5 bg-white" animate={{rotate:open?(i===0?45:i===2?-45:0):0,y:open?(i===0?6:i===2?-6:0):0,opacity:open&&i===1?0:1}}/>)}</button></nav></header>
 <AnimatePresence>{open&&<motion.div ref={menu} id="mobile-menu" role="dialog" aria-modal="true" aria-label="Navigation" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-6 bg-brand-dark/95 backdrop-blur-xl">{links.map(([label,id],i)=><motion.a key={id} href={`#${id}`} onClick={()=>{setOpen(false);toggle.current?.focus();}} initial={{opacity:0,y:20,filter:'blur(8px)'}} animate={{opacity:1,y:0,filter:'blur(0px)'}} transition={{delay:.08*i}} className="text-4xl font-medium text-white">{label}</motion.a>)}<ContactButton large/></motion.div>}</AnimatePresence>
 </>;
}
function Hero(){
 const ref=useRef<HTMLElement>(null);const {scrollYProgress}=useScroll({target:ref,offset:['start start','end start']});const bgY=useTransform(scrollYProgress,[0,1],['0%','8%']);const reduced=useReducedMotion();
 return <section id="home" ref={ref} aria-label="Galaxy Home" className="relative z-10 h-screen w-full overflow-hidden">
 <motion.img src={asset('sky')} alt="" fetchPriority="high" className="absolute left-0 top-0 z-0 h-[120%] w-full object-cover" style={{y:reduced?0:bgY}}/>
 <div className="relative z-10 pt-[22vh] text-center mix-blend-lighten md:pt-32 lg:pt-36"><h1 className="hero-title whitespace-nowrap bg-clip-text text-[clamp(3rem,14vw,14rem)] font-semibold leading-none text-transparent">Galaxy&nbsp;&nbsp;Home</h1></div>
 <p className="absolute left-6 top-[200px] z-20 hidden text-lg font-medium text-white/70 mix-blend-overlay md:left-12 md:top-[320px] md:block md:text-[22px] md:leading-6 lg:left-24">Elegance Above<br/>the Skyline</p>
 <p className="absolute right-6 top-[200px] z-20 hidden text-lg font-medium text-white md:right-12 md:top-[320px] md:block md:text-[22px] md:leading-6 lg:right-24">Your Dream Residence<br/>Starts Here</p>
 <motion.img src={asset('building')} alt="A luminous modern residence rising above a violet forest" className="pointer-events-none absolute left-0 top-0 z-30 h-[120%] w-full object-cover" style={{y:reduced?0:bgY}}/>
 </section>;
}
const statement='We present refined estates that merge remarkable design, prime surroundings, and relentless craftsmanship. Each residence is chosen for the experience it delivers not merely the footprint it provides.';
function Character({char,index,progress}: {char:string,index:number,progress:MotionValue<number>}){const position=index/statement.length;const opacity=useTransform(progress,[Math.max(0,position-.01),Math.min(1,position+.01)],[.25,1]);return <motion.span aria-hidden="true" style={{opacity}}>{char}</motion.span>;}
function TextFill(){const ref=useRef<HTMLDivElement>(null);const {scrollYProgress}=useScroll({target:ref,offset:['start 0.8','end 0.2']});return <div id="estates" ref={ref} className="mx-auto max-w-[820px] px-5 pb-16 pt-8 sm:px-6 sm:pb-24 sm:pt-12 md:px-12"><p aria-label={statement} className="text-center text-xl font-medium leading-snug tracking-tight text-white sm:text-2xl md:text-[40px] md:leading-[48px]">{statement.split(' ').map((word,wi)=>{const start=statement.split(' ').slice(0,wi).join(' ').length+(wi?1:0);return <React.Fragment key={wi}><span className="inline-block">{[...word].map((char,i)=><Character key={i} char={char} index={start+i} progress={scrollYProgress}/>)}</span>{' '}</React.Fragment>;})}</p></div>;}
const first=[{icon:Sparkles,name:'Prism'},{icon:Waves,name:'Cascade'},{icon:Star,name:'Pinnacle'}];const second=[{icon:Zap,name:'Impulse'},{icon:Orbit,name:'Nexus'},{icon:Gem,name:'Radiant'}];
function Marquee(){return <div aria-label="Prism, Cascade, Pinnacle, Impulse, Nexus, Radiant" className="marquee-mask mx-auto max-w-[820px] space-y-7 overflow-hidden py-4 sm:py-6">{[first,second].map((items,row)=><div key={row} aria-hidden="true" className={`flex w-max ${row?'animate-marquee-reverse':'animate-marquee'}`}>{[0,1].map(copy=><div key={copy} className="flex shrink-0 gap-8 pr-8 sm:gap-12 sm:pr-12">{[...items,...items].map(({icon:Icon,name},i)=><div key={i} className="flex items-center gap-2.5"><Icon className="h-4 w-4 text-white/80 sm:h-5 sm:w-5"/><span className="whitespace-nowrap text-sm font-medium text-white/90 sm:text-base">{name}</span></div>)}</div>)}</div>)}</div>;}
const stats=[['500','Estates Delivered'],['25','Exclusive Markets'],['12','Years in the Field'],['99%','Owner Satisfaction']];
function Stats(){const ref=useRef<HTMLElement>(null);const visible=useInView(ref,{once:true,margin:'-100px'});return <section id="projects" ref={ref} className="relative isolate flex min-h-[75vh] flex-col justify-center px-5 py-16 sm:px-6 md:py-32"><div className="pointer-events-none absolute -top-[400px] bottom-0 left-0 right-0 -z-10 bg-gradient-to-b from-transparent via-white/60 to-white"/><h2 className="mb-10 text-center text-2xl font-medium text-brand-navy sm:mb-16 md:text-[40px] md:leading-[44px]">Only the proven results here</h2><div className="mx-auto grid max-w-5xl grid-cols-2 gap-x-5 gap-y-10 md:flex md:items-center md:justify-center md:gap-0">{stats.map(([value,label],i)=><React.Fragment key={label}>{i>0&&<div aria-hidden="true" className="mx-8 hidden h-[80px] w-px shrink-0 bg-brand-navy/20 md:block lg:mx-12"/>}<motion.div initial={{opacity:0,y:30}} animate={visible?{opacity:1,y:0}:{}} transition={{duration:.6,delay:i*.15}} className="text-center"><div className="text-4xl font-semibold text-brand-navy sm:text-5xl md:text-[64px] md:leading-[76px]">{value}</div><div className="mt-1 whitespace-nowrap text-sm font-medium text-brand-navy/70 sm:text-base md:text-xl">{label}</div></motion.div></React.Fragment>)}</div></section>;}
function Landscape(){const ref=useRef<HTMLDivElement>(null);const {scrollYProgress}=useScroll({target:ref,offset:['start start','end end']});const y=useTransform(scrollYProgress,[0,1],['0%','-20%']);const reduced=useReducedMotion();return <div ref={ref} className="relative z-40 -mt-[25vh]"><div className="pointer-events-none absolute -top-[10vh] bottom-0 left-0 right-0 overflow-hidden"><motion.img src={asset('mountains')} alt="" className="h-[120%] w-full object-cover object-top" style={{y:reduced?0:y}}/></div><div className="relative pt-24 sm:pt-32 md:pt-40"><section id="about" className="flex flex-col items-center px-5 py-16 sm:px-6 md:py-32"><div id="inquire" className="flex flex-col items-center"><p className="description max-w-[600px] text-center text-sm font-medium leading-relaxed text-white/90 sm:text-base md:text-lg">Explore distinguished estates, iconic design, and meticulously curated homes across the globe's most sought-after destinations.</p><ContactButton large/></div></section><TextFill/><Marquee/><Stats/></div></div>;}
function App(){return <><Navbar/><main><Hero/><Landscape/></main></>;}
createRoot(document.getElementById('root')!).render(<React.StrictMode><App/></React.StrictMode>);
