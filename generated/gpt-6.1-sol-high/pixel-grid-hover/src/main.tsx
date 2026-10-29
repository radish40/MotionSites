import React, { useRef, useState, useCallback } from 'react';
import { createRoot } from 'react-dom/client';
import { motion, useScroll, useTransform, useSpring, useMotionValue, useInView, type MotionValue } from 'framer-motion';
import './index.css';

const ease = [0.22, 1, 0.36, 1] as const;
type Square = readonly [number, number, number];
const floating: Square[] = [[6,20,12],[12,32,8],[8,44,6],[88,18,10],[92,30,14],[85,42,7],[90,52,5],[14,56,5]];
const studies = [
  {id:'heartx', title:'HeartX', category:'Brand Strategy & Product Design', year:'2026', squares:[[5,30,16],[10,42,10],[3,52,7],[80,70,14],[85,82,9],[78,60,6]]},
  {id:'swave', title:'Swave®', category:'Web Design & Identity', year:'2025', squares:[[82,55,16],[88,68,10],[78,72,7],[85,42,6],[90,80,8]]},
  {id:'eduspark', title:'EduSpark', category:'Brand Strategy & Web Design', year:'2023', squares:[[4,24,16],[10,36,10],[2,44,7],[78,78,14],[84,88,8]]},
  {id:'greenergy', title:'Greenergy', category:'Brand Strategy & Web Design', year:'2022', squares:[[82,26,14],[88,38,10],[78,44,7],[84,54,5],[90,60,8]]},
];
function FloatingSquare({square:[x,y,size], index, progress}:{square:Square;index:number;progress:MotionValue<number>}) {
  const offset=useTransform(progress,[0,1],[0,-(80+index*30)]);
  const spring=useSpring(offset,{stiffness:40,damping:20});
  return <motion.div className="absolute" style={{left:`${x}%`,top:`${y}%`,y:spring}}><motion.div className="bg-black" style={{width:size,height:size}} animate={{y:[0,-10,0]}} transition={{duration:3+index*.4,ease:'easeInOut',repeat:Infinity,delay:index*.3}}/></motion.div>;
}
function MagneticSquare({square:[x,y,size],pointerX,pointerY}:{square:Square;pointerX:MotionValue<number>;pointerY:MotionValue<number>}) {
  const dx=useTransform(pointerX,v=>(v-.5)*40);
  const dy=useTransform(pointerY,v=>(v-.5)*40);
  const sx=useSpring(dx,{stiffness:80,damping:18,mass:.6});
  const sy=useSpring(dy,{stiffness:80,damping:18,mass:.6});
  return <motion.span className="pointer-events-none absolute bg-black" style={{left:`${x}%`,top:`${y}%`,width:size,height:size,x:sx,y:sy}}/>;
}
function CaseStudyCard({study,index}:{study:typeof studies[number];index:number}) {
  const ref=useRef<HTMLElement>(null);
  const visible=useInView(ref,{once:true,margin:'-40px'});
  const [hovered,setHovered]=useState(false);
  const pointerX=useMotionValue(.5),pointerY=useMotionValue(.5);
  const move=useCallback((event:React.PointerEvent<HTMLElement>)=>{
    if(event.pointerType==='touch') return;
    const bounds=event.currentTarget.getBoundingClientRect();
    pointerX.set((event.clientX-bounds.left)/bounds.width);pointerY.set((event.clientY-bounds.top)/bounds.height);
  },[pointerX,pointerY]);
  const leave=useCallback(()=>{setHovered(false);pointerX.set(.5);pointerY.set(.5)},[pointerX,pointerY]);
  return <motion.article ref={ref} tabIndex={0} aria-label={`${study.title}, ${study.category}, ${study.year}`} className="group relative aspect-[4/3] overflow-hidden" initial={{opacity:0,y:30}} animate={visible?{opacity:1,y:0}:{}} transition={{duration:.7,delay:index*.1,ease}} onPointerEnter={e=>{if(e.pointerType!=='touch')setHovered(true)}} onPointerMove={move} onPointerLeave={leave} onFocus={()=>setHovered(true)} onBlur={leave} data-card={study.id}>
    <img className="absolute h-full w-full object-cover" src={`${import.meta.env.BASE_URL}assets/${study.id}.jpeg`} alt={({heartx:'A person carrying a black umbrella on a city street',swave:'Sunlit coastal mountain ridges above the ocean',eduspark:'Students raising their hands in a classroom',greenergy:'Aerial view of solar panels arranged across a green field'})[study.id]} />
    <div className="pointer-events-none absolute inset-0" aria-hidden="true" data-pixels>
      {Array.from({length:96},(_,i)=>{const row=Math.floor(i/12),col=i%12;return <motion.span key={i} className="absolute bg-black/80" style={{left:`${col*100/12}%`,top:`${row*100/8}%`,width:`${100/12}%`,height:`${100/8}%`}} initial={false} animate={{scale:hovered?1:0,opacity:hovered?1:0}} transition={{duration:.25,delay:hovered?(row+col)*.018:((8-row)+(12-col))*.012,ease}}/>})}
    </div>
    <div aria-hidden="true">{study.squares.map((square,i)=><MagneticSquare key={i} square={square as unknown as Square} pointerX={pointerX} pointerY={pointerY}/>)}</div>
    <span aria-hidden="true" className="absolute right-4 top-4 z-10 flex h-7 w-7 items-center justify-center border border-white/30 text-xs text-white">+</span>
    <div className="absolute bottom-0 left-0 z-20 bg-white px-4 pb-3 pt-2.5" style={{maxWidth:'70%'}}>
      <h2 className="text-[clamp(1.4rem,2.2vw,2rem)] font-normal leading-tight text-black">{study.title}</h2>
      <div className="mt-1.5 flex gap-4"><span className="text-[12px] text-black/60">{study.category}</span><span className="text-[12px] font-medium text-black">{study.year}</span></div>
    </div>
  </motion.article>;
}
const logos = [['Codecraft_','code'],['ennLabs','dots'],['GlobalBank','circle-ring'],['45 Degrees°','arrow'],['AlphaWave','wave-circle'],['Biosynthesis','lines'],['Boltshift','bolt'],['Clandestine','plus']];
function LogoIcon({type}:{type:string}) {
 switch(type) {
 case 'code':return <svg width="22" height="18" viewBox="0 0 22 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="6,4 1,9 6,14"/><polyline points="16,4 21,9 16,14"/><path d="M13 2 9 16"/></svg>;
 case 'dots':return <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">{[3,10,17].flatMap(x=>[3,10,17].map(y=><circle key={`${x}-${y}`} cx={x} cy={y} r="2.2"/>))}</svg>;
 case 'circle-ring':return <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="9"/><circle cx="11" cy="11" r="4"/></svg>;
 case 'arrow':return <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M2 16 16 2"/><polyline points="7,2 16,2 16,11"/></svg>;
 case 'wave-circle':return <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="11" cy="11" r="9"/><path d="M5 11Q8 7 11 11Q14 15 17 11"/></svg>;
 case 'lines':return <svg width="24" height="18" viewBox="0 0 24 18" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M0 3H24M6 9H24M0 15H18"/></svg>;
 case 'bolt':return <svg width="14" height="20" viewBox="0 0 14 20" fill="currentColor"><polygon points="8,0 0,11 6,11 6,20 14,9 8,9"/></svg>;
 default:return <svg width="18" height="18" viewBox="0 0 18 18" fill="currentColor"><rect x="7.5" width="3" height="18"/><rect y="7.5" width="18" height="3"/></svg>;
 }
}
function ProjectsSection() {
 const sectionRef=useRef<HTMLElement>(null),headerRef=useRef<HTMLDivElement>(null);
 const {scrollYProgress}=useScroll({target:sectionRef,offset:['start end','end start']});
 const headerVisible=useInView(headerRef,{once:true,margin:'-60px'});
 return <section ref={sectionRef} className="relative bg-white text-black" style={{fontFamily:"'DM Sans', sans-serif"}}>
  <style>{`@keyframes marqueeProjects {from {transform:translateX(0);}to {transform:translateX(-50%);}} .marquee-projects {animation:marqueeProjects 28s linear infinite;} .marquee-projects:hover {animation-play-state:paused;}`}</style>
  <div className="relative px-6 pb-10 pt-32 sm:px-10 lg:px-16 lg:pt-40">
   <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">{floating.map((square,index)=><FloatingSquare key={index} square={square} index={index} progress={scrollYProgress}/>)}</div>
   <motion.div ref={headerRef} className="relative mx-auto max-w-7xl text-center" initial={{opacity:0,y:24}} animate={headerVisible?{opacity:1,y:0}:{}} transition={{duration:.7,ease}}>
    <span className="mb-5 inline-block bg-black px-4 py-1.5 text-[13px] font-medium tracking-wide text-white">Projects</span>
    <h1 className="text-[clamp(1.8rem,3.2vw,2.8rem)] font-light leading-[1.25] tracking-tight"><span className="text-black">Insights from </span><span className="text-black/40">Our<br/>Case Studies</span></h1>
   </motion.div>
  </div>
  <div className="mx-auto max-w-7xl px-6 pb-16 sm:px-10 lg:px-16"><div className="grid gap-4 md:grid-cols-2">{studies.map((study,index)=><CaseStudyCard key={study.id} study={study} index={index}/>)}</div></div>
  <div className="mx-auto flex max-w-7xl flex-col gap-8 px-6 pb-6 sm:px-10 md:flex-row md:items-end md:justify-between md:gap-0 lg:px-16">
   <div className="max-w-md">
    <span aria-hidden="true" className="mb-4 flex h-7 w-7 items-center justify-center border border-black/20 text-xs text-black">+</span>
    <p className="text-[14px] leading-[1.7] text-black/60">We partner with ambitious brands that are ready to move beyond fragmented visuals and shallow quick fixes -- turning their identity, website, and messaging into one focused engine for growth.</p>
    <button type="button" className="group mt-6 flex items-end">
     <span className="inline-flex items-center gap-[10px] border border-black/20 bg-black px-3 py-2 text-base font-medium text-white group-hover:bg-black/85">Let's work together</span>
     <span className="mb-6 flex h-6 w-6 items-center justify-center bg-black transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:mb-9"><svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M18.75 6V15.75C18.75 15.949 18.671 16.14 18.53 16.28C18.39 16.421 18.199 16.5 18 16.5C17.801 16.5 17.61 16.421 17.47 16.28C17.329 16.14 17.25 15.949 17.25 15.75V7.81L6.53 18.53C6.39 18.671 6.199 18.75 6 18.75C5.801 18.75 5.61 18.671 5.47 18.53C5.329 18.39 5.25 18.199 5.25 18C5.25 17.801 5.329 17.61 5.47 17.47L16.19 6.75H8.25C8.051 6.75 7.86 6.671 7.72 6.53C7.579 6.39 7.5 6.199 7.5 6C7.5 5.801 7.579 5.61 7.72 5.47C7.86 5.329 8.051 5.25 8.25 5.25H18C18.199 5.25 18.39 5.329 18.53 5.47C18.671 5.61 18.75 5.801 18.75 6Z"/></svg></span>
    </button>
   </div>
   <div className="min-w-0 flex-1 overflow-hidden border-t border-black/10 md:ml-12 md:border-0"><div className="overflow-hidden py-5"><div className="marquee-projects flex w-max">{[...logos,...logos].map(([name,type],i)=><div key={i} aria-hidden={i>=8?true:undefined} className="flex shrink-0 items-center gap-2.5 px-8"><LogoIcon type={type}/><span className="whitespace-nowrap text-sm font-medium tracking-wide text-black/80">{name}</span></div>)}</div></div></div>
  </div>
  <div className="h-12"/>
 </section>;
}

createRoot(document.getElementById('root')!).render(<React.StrictMode><ProjectsSection/></React.StrictMode>);
