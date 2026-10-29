import React, { useEffect, useRef, useState, type CSSProperties } from 'react';
import { createRoot } from 'react-dom/client';
import Hls from 'hls.js';
import './index.css';

const asset = (name:string) => `${import.meta.env.BASE_URL}assets/${name}`;
const stickers = ['sticker-2.png','sticker-3.png','sticker-4.png','sticker-5.png'].map(asset);
const trails = ['trail-6.png','trail-7.png','trail-8.png','trail-9.png','trail-10.png'].map(asset);
const videos = ['https://stream.mux.com/W2NRcV6MrewS7QyWWqAWZvJR9jrnPU5rxymlPg01gRzk.m3u8','https://stream.mux.com/aypDi1exkKgYKEbWme9Csi47zxIim0101hw3ghmSzQIyw.m3u8'];
const manifesto = `LIMITLESS INPUTS OR
STANDARD LAYOUT
TEMPLATE
CONSUMERS. THIS IS
A HIGHLY SELECTIVE
ENVIRONMENT
ENGINEERED FOR
HYPER-PRODUCTIVE
CREATORS, UI/UX
VISIONARIES, AND
AI PROMPT
ARCHITECTS WHO
OPERATE AT THE
ABSOLUTE LIMITS OF
DIGITAL PRODUCT
CREATION. OUR
FRAMEWORK IS

---

WHY CHOOSE US?
1. ZERO MOCKUPS,
ONLY REAL CODE.
2. SPEED RUNS -
ZERO WASTED TIME.
3. DIGITAL EDGE -
AESTHETIC
DOMINANCE.
4. SYSTEM STATE -
INTELLIGENT
INTERACTION.

---

WE REJECT
THE BORING.
WE REJECT
THE STANDARD.

CHOOSE ABSOLUTE
CREATIVE EDGE.

THE FUTURE IS
NOW SECURED.`;

type Trail = {id:number;x:number;y:number;type:number;rotation:number};
function App(){
 const v1=useRef<HTMLVideoElement>(null),v2=useRef<HTMLVideoElement>(null),credits=useRef<HTMLDivElement>(null);
 const [visibleCount,setVisibleCount]=useState(22),[formVisible,setFormVisible]=useState(false),[dismissed,setDismissed]=useState(false),[success,setSuccess]=useState(false),[trail,setTrail]=useState<Trail[]>([]);
 const dismissedRef=useRef(false);
 useEffect(()=>{dismissedRef.current=dismissed;},[dismissed]);
 useEffect(()=>{
  const controllers:Hls[]=[]; const cleanups:(()=>void)[]=[];
  [v1.current,v2.current].forEach((video,index)=>{
   if(!video)return;
   const warm=()=>{video.play().then(()=>video.pause()).catch(()=>{});};
   if(Hls.isSupported()){
    const hls=new Hls({maxBufferLength:60});controllers.push(hls);
    hls.loadSource(videos[index]);hls.attachMedia(video);hls.on(Hls.Events.MANIFEST_PARSED,warm);
   }else if(video.canPlayType('application/vnd.apple.mpegurl')){
    video.src=videos[index];video.addEventListener('loadedmetadata',warm);cleanups.push(()=>video.removeEventListener('loadedmetadata',warm));
   }
  });
  let frame=0; const times=[0,0];
  const tick=()=>{
   const max=Math.max(1,document.documentElement.scrollHeight-window.innerHeight);
   const progress=Math.max(0,Math.min(1,window.scrollY/max));
   const count=Math.round((1-Math.min(progress,.25)/.25)*22);
   setVisibleCount(prev=>prev!==count?count:prev);
   const visible=progress>=.95&&!dismissedRef.current;
   setFormVisible(prev=>prev!==visible?visible:prev);
   if(progress<.95&&dismissedRef.current){dismissedRef.current=false;setDismissed(false);}
   [v1.current,v2.current].forEach((video,index)=>{
    if(!video)return;
    video.style.opacity=String(index===0?(progress<.5?1:0):(progress<=.45?0:Math.min(1,(progress-.45)/.05)));
    if(!Number.isFinite(video.duration)||!video.duration)return;
    const fraction=index===0?Math.min(progress*2,1):Math.max(0,(progress-.5)*2);
    const target=fraction*Math.max(0,video.duration-.04);
    times[index]+=(target-times[index])*.3;
    if((index===0&&window.scrollY<=10)||(index===1&&window.scrollY>=max-10)) times[index]=target;
    if(!video.seeking&&Math.abs(video.currentTime-times[index])>.015)video.currentTime=times[index];
   });
   if(credits.current){
    const start=.25+200/max; const alpha=Math.max(0,Math.min(1,(progress-start)/(1-start)));
    credits.current.style.opacity=String(Math.min(1,alpha/.05));
    credits.current.style.transform=`translateY(${100-alpha*450}vh)`;
   }
   frame=requestAnimationFrame(tick);
  };
  frame=requestAnimationFrame(tick);
  return()=>{cancelAnimationFrame(frame);controllers.forEach(hls=>hls.destroy());cleanups.forEach(fn=>fn());};
 },[]);
 useEffect(()=>{
  let last={x:0,y:0},counter=0;const timers=new Set<ReturnType<typeof setTimeout>>();
  const move=(event:MouseEvent)=>{
   if(Math.hypot(event.clientX-last.x,event.clientY-last.y)<=150)return;
   last={x:event.clientX,y:event.clientY};
   const item:Trail={id:counter++,x:last.x,y:last.y,type:(counter-1)%5,rotation:Math.random()*40-20};
   setTrail(prev=>[...prev.slice(-3),item]);
   const timer=setTimeout(()=>{setTrail(prev=>prev.filter(t=>t.id!==item.id));timers.delete(timer);},2200);timers.add(timer);
  };
  window.addEventListener('mousemove',move,{passive:true});
  return()=>{window.removeEventListener('mousemove',move);timers.forEach(clearTimeout);};
 },[]);
 const cursor=<span aria-hidden="true" className="inline-block w-[0.14em] h-[0.8em] bg-[#85D743] ml-1 select-none animate-pulse align-middle"/>;
 const letters=(word:string,start:number)=>word.split('').map((char,i)=>visibleCount>=start+i?<span key={i} className="inline-block relative">{char}{visibleCount===start+i&&cursor}</span>:null);
 const scrollTo=(progress:number)=>window.scrollTo({top:(document.documentElement.scrollHeight-window.innerHeight)*progress,behavior:'smooth'});
 const inputClass='font-mono text-xs text-white bg-slate-900 border-2 border-slate-700 focus:border-[#85D743] hover:border-slate-500 focus:outline-none p-2.5 w-full transition-all placeholder-slate-600';
 return <main className="relative w-full bg-slate-950 min-h-[1200vh] select-none">
  <div className="fixed inset-0 w-full h-full overflow-hidden" aria-hidden="true">
   {[v1,v2].map((ref,i)=><video key={i} ref={ref} muted playsInline autoPlay={false} preload="auto" crossOrigin="anonymous" className="absolute inset-0 w-full h-full object-cover pointer-events-none transition-opacity duration-300" style={{opacity:i===0?1:0}}/>)}
  </div>
  <div className="fixed top-14 left-[-170px] w-[650px] -rotate-[30deg] z-50 bg-[#0033FF] py-[18px] overflow-hidden select-none pointer-events-none shadow-2xl" aria-hidden="true"><div className="animate-marquee flex whitespace-nowrap">{[0,1].map(i=><span key={i} className="font-press-start text-[16px] text-[#85D743] tracking-widest px-4">WARNING! WARNING! WARNING! WARNING! WARNING! WARNING! WARNING! WARNING!&nbsp;</span>)}</div></div>
  <div className="fixed z-40 select-none pointer-events-none transition-transform duration-300" style={{top:232,left:120,transform:'rotate(32deg)'}}><img src={stickers[0]} alt="" referrerPolicy="no-referrer" className="w-[100px] h-auto object-contain"/></div>
  <div className="fixed bottom-8 right-8 z-40 select-none pointer-events-none transition-transform duration-300"><img src={stickers[1]} alt="" referrerPolicy="no-referrer" className="w-[110px] sm:w-[150px] h-auto object-contain"/></div>
  <nav aria-label="Main navigation" className="fixed top-10 right-8 md:right-16 z-50 flex gap-6 md:gap-10 font-press-start text-[10px] sm:text-xs md:text-sm text-white select-auto">{[['Projects',.28],['Expertise',.48],['About',.7],['Contact',1]].map(([label,progress])=><a key={label} href={`#${String(label).toLowerCase()}`} onClick={e=>{e.preventDefault();scrollTo(Number(progress));}} className="hover:text-[#85D743] transition-colors duration-200">{label}</a>)}</nav>
  <div className="fixed top-0 left-0 w-full h-screen z-30 pointer-events-none flex flex-col justify-end p-8 md:p-16 pb-16 sm:pb-24">
   <h1 aria-label="Problem with creative?" className="font-press-start text-[#85D743] text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl leading-[1.2] tracking-tight uppercase select-none max-w-5xl">
    <div>{visibleCount===0&&cursor}{letters('PROBLEM',1)}</div>
    {visibleCount>=8&&<div className="inline-flex items-center gap-3 sm:gap-5 md:gap-7 align-middle"><span className="inline-flex items-center gap-[0.06em] sm:gap-[0.08em] md:gap-[0.1em]">{letters('WITH',8)}</span>{[12,13].map((n,i)=>visibleCount>=n&&<span key={n} className="inline-flex items-center"><img src={stickers[i===0?3:2]} alt="" referrerPolicy="no-referrer" className="h-[0.85em] w-auto object-contain" style={{transform:`rotate(${i===0?-8:6}deg)`}}/>{visibleCount===n&&cursor}</span>)}</div>}
    {visibleCount>=14&&<div>{letters('CREATIVE?',14)}</div>}
   </h1>
  </div>
  <div ref={credits} className="fixed top-0 left-0 w-full md:w-[70%] h-screen z-25 pointer-events-none flex flex-col justify-start p-8 md:p-16 pt-[12vh] pb-16 select-none" style={{opacity:0,transform:'translateY(100vh)'}}><div className="font-press-start text-[#85D743] text-[20px] sm:text-[26px] md:text-[32px] leading-[1.35] tracking-tight uppercase text-left whitespace-pre-line select-none">{manifesto}</div></div>
  <div className="fixed inset-0 pointer-events-none z-[60] overflow-hidden" aria-hidden="true">{trail.map(item=><div key={item.id} data-trail-type={item.type} className="absolute select-none pointer-events-none flex items-center justify-center -translate-x-1/2 -translate-y-1/2" style={{left:item.x,top:item.y,transform:`translate(-50%, -50%) rotate(${item.rotation}deg)`,'--rot':`${item.rotation}deg`,animation:'sticker-fade-out 2.2s forwards cubic-bezier(0.16, 1, 0.3, 1)'} as CSSProperties}><img src={trails[item.type]} alt="" referrerPolicy="no-referrer" className="w-[110px] sm:w-[150px] md:w-[180px] h-auto object-contain"/></div>)}</div>
  <section role="dialog" aria-label="Feedback system" aria-hidden={!formVisible} inert={!formVisible} className="fixed left-1/2 z-[55] w-[92%] max-w-[460px] p-6 sm:p-8 bg-slate-950/95 border-4 border-[#0033FF] shadow-[10px_10px_0px_#85D743] select-auto transition-all duration-[900ms] pointer-events-auto" style={{bottom:'50%',transform:formVisible?'translate(-50%, 50%) rotate(0deg)':'translate(-50%, 150vh) rotate(15deg)',transitionTimingFunction:'cubic-bezier(0.16, 1, 0.3, 1)'}}>
   <button aria-label="Close feedback" onClick={()=>{dismissedRef.current=true;setDismissed(true);setFormVisible(false);}} className="absolute top-4 right-4 font-press-start text-[14px] text-slate-500 hover:text-red-500 hover:scale-110 active:scale-95 transition-all cursor-pointer select-none border-none bg-transparent">[X]</button>
   {success?<div className="text-center flex flex-col items-center py-6" role="status"><div className="font-press-start text-[32px] text-[#85D743] mb-4 animate-bounce">✦</div><h2 className="font-press-start text-xs sm:text-sm text-[#85D743] mb-3 tracking-widest uppercase">TRANSMISSION SUCCESS</h2><p className="font-mono text-[10px] sm:text-xs text-slate-400 max-w-sm mb-6 uppercase leading-relaxed">Your feedback is secured in our neural network database.</p><button onClick={()=>setSuccess(false)} className="font-press-start text-[8px] sm:text-[10px] text-black bg-[#85D743] hover:bg-[#9eff5c] border-2 border-black py-2.5 px-5 font-bold uppercase tracking-wider shadow-[3px_3px_0px_#0033FF] active:translate-y-0.5 active:shadow-none transition-all cursor-pointer">[ NEW TRANSMISSION ]</button></div>:<form className="flex flex-col gap-4 sm:gap-5" onSubmit={e=>{e.preventDefault();setSuccess(true);}}><h2 className="font-press-start text-xs sm:text-sm text-[#85D743] tracking-widest uppercase text-center mb-1 mt-6">FEEDBACK SYSTEM</h2><input aria-label="Your name" name="name" type="text" required placeholder="YOUR NAME" className={`${inputClass} uppercase`}/><input aria-label="Email" name="email" type="email" required placeholder="NAME@DOMAIN.COM" className={inputClass}/><textarea aria-label="Feedback or architecture ideas" name="feedback" required rows={3} placeholder="FEEDBACK / ARCHITECTURE IDEAS..." className={`${inputClass} resize-none`}/><button type="submit" className="font-press-start text-[8px] sm:text-[9px] text-black bg-[#85D743] hover:bg-[#9bfb4e] active:translate-y-0.5 active:shadow-none border-2 border-black py-3 px-6 shadow-[4px_4px_0px_#0033FF] w-full font-bold uppercase tracking-widest cursor-pointer select-none transition-all mt-1">LAUNCH TRANSMISSION</button></form>}
  </section>
 </main>;
}
createRoot(document.getElementById('root')!).render(<React.StrictMode><App/></React.StrictMode>);
