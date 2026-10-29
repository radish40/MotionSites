import React, {useEffect, useRef, useState} from 'react';
import {createRoot} from 'react-dom/client';
import {ArrowDown, ArrowRight, ArrowUp, HelpCircle} from 'lucide-react';
import './index.css';
const asset=(name:string)=>`${import.meta.env.BASE_URL}assets/${name}`;
const recommendation='With a biological age of 28, your body is performing like a young, energetic you. Keep fueling it with movement, nourishing food, quality rest, and a calm mind - so you can stay strong, sharp, and unstoppable.';
function AnimatedElement({children,delay=0,direction='up',className=''}:{children:React.ReactNode,delay?:number,direction?:string,className?:string}){
 const ref=useRef<HTMLDivElement>(null); const [visible,setVisible]=useState(false);
 useEffect(()=>{const observer=new IntersectionObserver(([entry])=>{if(entry.isIntersecting){setVisible(true);observer.disconnect();}},{threshold:0.1});if(ref.current)observer.observe(ref.current);return()=>observer.disconnect()},[]);
 return <div ref={ref} className={`reveal from-${direction} ${visible?'visible':''} ${className}`} style={{transitionDelay:`${delay}ms`}}>{children}</div>
}
function AgeNumber(){
 const [age,setAge]=useState(0);
 useEffect(()=>{let step=0;let increment:ReturnType<typeof setInterval>;const count=setInterval(()=>{step++;setAge(Math.round(28*step/40));if(step===40){clearInterval(count);increment=setInterval(()=>setAge(value=>value+1),6000)}},45);return()=>{clearInterval(count);clearInterval(increment)}},[]);
 return <span className="age-number tabular-nums">{age}</span>
}
function Snapshot(){
 const [pinned,setPinned]=useState(false),[hovered,setHovered]=useState(false);const expanded=pinned||hovered;
 return <section className={`info-card snapshot ${expanded?'expanded':''}`} onMouseEnter={()=>{if(matchMedia('(hover: hover)').matches)setHovered(true)}} onMouseLeave={()=>setHovered(false)}>
 <button className="snapshot-toggle" aria-expanded={expanded} aria-controls="recommendation" onClick={()=>{setPinned(!expanded);setHovered(false)}}><span>Your Health Snapshot</span></button>
 <p id="recommendation" className="recommendation" hidden={!expanded}>{recommendation}</p>
 <div className="card-bottom"><span className="subtitle">Recommendations</span><span className="arrow-circle" aria-hidden="true">{expanded?<ArrowDown size={19}/>:<ArrowUp size={19}/>}</span></div>
 </section>
}
function App(){
 const [videoReady,setVideoReady]=useState(false),[help,setHelp]=useState(false);
 return <main className="dashboard relative min-h-screen overflow-hidden text-white">
 <video className={`background-video ${videoReady?'loaded':''}`} src={asset('background.mp4')} autoPlay loop muted playsInline onLoadedData={()=>setVideoReady(true)}/><div className="background-shade"/>
 <nav className="relative z-10 flex items-start justify-between px-5 sm:px-8 lg:px-12 pt-6 sm:pt-8" aria-label="Dashboard navigation">
 <AnimatedElement delay={100} direction="down"><img className="brand" src={asset('logo.svg')} alt="VELVION" width="160" height="40"/></AnimatedElement>
 <div className="help-position"><AnimatedElement delay={150} direction="down"><button className="help-button" aria-label="About your biological age" aria-expanded={help} onClick={()=>setHelp(!help)} onKeyDown={e=>{if(e.key==='Escape')setHelp(false)}}><HelpCircle size={18} strokeWidth={1.5}/></button></AnimatedElement>{help&&<div className="help-popover" role="status"><strong>Your biological age</strong><p>An estimate of how your body is performing. Explore your health snapshot for recommendations.</p></div>}</div>
 <AnimatedElement delay={200} direction="down" className="flex items-center gap-5"><h1 className="hidden md:block text-xl sm:text-3xl lg:text-[42px] font-bold text-right leading-tight">Benjamin Carter</h1><img className="avatar" src={asset('avatar.png')} alt="Benjamin Carter"/></AnimatedElement>
 </nav>
 <div className="content-wrapper relative z-10 flex flex-col xl:flex-row xl:items-end xl:justify-between px-5 sm:px-8 lg:px-12 pb-6 sm:pb-8 lg:pb-12">
 <div className="age-section">
 <AnimatedElement delay={300} direction="scale"><section className="age-card relative overflow-hidden flex items-center justify-center rounded-[24px] sm:rounded-[32px] lg:rounded-[40px]" aria-label="Estimated biological age"><div className="age-card-bg animate-spin-bg" style={{backgroundImage:`url(${asset('age.png')})`}}/><div className="relative z-10 text-center age-copy"><AnimatedElement delay={600}><h2 className="text-gray-200 text-base sm:text-lg md:text-[22px] font-medium leading-snug">Estimated<br/>Biological Age</h2></AnimatedElement><AnimatedElement delay={800}><AgeNumber/></AnimatedElement></div></section></AnimatedElement>
 <AnimatedElement delay={1000} className="badge-wrapper"><span className="age-badge border border-[#EFCE96]/50 bg-[#EFCE96]/20 text-white text-xs sm:text-sm font-medium tracking-wide px-4 sm:px-6 py-2 rounded-full">3 Years Younger</span></AnimatedElement>
 <div className="ruler" aria-hidden="true"><div className="ruler-track animate-ticker">{[0,1].map(set=><div className="ruler-set" key={set}>{Array.from({length:61},(_,i)=><span key={i} style={{height:i%5===0?26:18}}/>)}</div>)}</div><span className="ruler-indicator"/></div>
 </div>
 <div className="info-grid">
 <div className="info-column"><AnimatedElement delay={500} direction="right"><section className="info-card dark-card"><h2>Upcoming Activities</h2><div className="card-bottom"><span className="subtitle">4 events</span><span className="arrow-circle" aria-hidden="true"><ArrowRight size={19}/></span></div></section></AnimatedElement><AnimatedElement delay={800} direction="right"><Snapshot/></AnimatedElement></div>
 <div className="info-column"><AnimatedElement delay={650} direction="right"><section className="info-card image-card" style={{backgroundImage:`url(${asset('insights.png')})`}}><h2>Your Insights</h2><div className="card-bottom"><span className="pill">8 Risks</span><span className="arrow-circle light" aria-hidden="true"><ArrowRight size={19}/></span></div></section></AnimatedElement><AnimatedElement delay={950} direction="right"><section className="info-card image-card" style={{backgroundImage:`url(${asset('action.png')})`}}><h2>Action Plan</h2><div className="card-bottom"><span className="pill">Details</span><span className="arrow-circle light" aria-hidden="true"><ArrowRight size={19}/></span></div></section></AnimatedElement></div>
 </div>
 </div>
 </main>
}
createRoot(document.getElementById('root')!).render(<React.StrictMode><App/></React.StrictMode>);
