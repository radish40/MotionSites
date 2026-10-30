import {useState,useEffect,useRef} from 'react';
import {ChevronLeft,ChevronRight,Star} from 'lucide-react';
import {asset} from '../assets';
import {Reveal} from './Reveal';
const testimonials=[
 {name:'Marcus Anderson',role:'CEO, Data.storage',quote:'With very little guidance team delivered designs that were consistently spot on...'},
 {name:'alexwu',role:'Founder, Nexgate',quote:'Viktor led the creation of our best fundraising deck to date!...'},
 {name:'James Mitchell',role:'VP Product, LaunchPad',quote:'Working with Viktor transformed our product vision...'},
 {name:'Rachel Foster',role:'Co-founder, Nexus Labs',quote:'The design quality exceeded our expectations...'},
 {name:'David Zhang',role:'Head of Design, Paradigm Labs',quote:'Incredible work from start to finish...'}
];
export default function TestimonialCarousel(){
 const [index,setIndex]=useState(5),[paused,setPaused]=useState(false),[animate,setAnimate]=useState(true),[width,setWidth]=useState(427.5);
 const viewport=useRef<HTMLDivElement>(null);
 useEffect(()=>{const resize=()=>setWidth(window.innerWidth<768?window.innerWidth-48:427.5);resize();window.addEventListener('resize',resize);return()=>window.removeEventListener('resize',resize);},[]);
 useEffect(()=>{if(paused)return;const timer=window.setInterval(()=>setIndex(i=>i+1),3000);return()=>clearInterval(timer);},[paused]);
 const reset=()=>{if(index>=10||index<5){setAnimate(false);setIndex((index%5+5)%5+5);}};
 useEffect(()=>{if(!animate){const raf=requestAnimationFrame(()=>requestAnimationFrame(()=>setAnimate(true)));return()=>cancelAnimationFrame(raf);}},[animate]);
 return <section className="py-20 overflow-hidden" aria-label="Client testimonials" onMouseEnter={()=>setPaused(true)} onMouseLeave={()=>setPaused(false)} onFocusCapture={()=>setPaused(true)} onBlurCapture={e=>{if(!e.currentTarget.contains(e.relatedTarget))setPaused(false);}}>
  <Reveal className="md:max-w-4xl md:ml-auto px-6"><div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10"><h2 className="display-heading">What <span className="font-accent">builders</span> say</h2><div><div className="flex gap-1" aria-label="5 out of 5 stars">{Array.from({length:5},(_,i)=><Star key={i} className="w-5 h-5 fill-black text-black"/>)}</div><p className="text-sm mt-2">Clutch 5/5</p></div></div></Reveal>
  <div ref={viewport} className="carousel-window px-6"><div className="flex gap-6 items-stretch" style={{transform:`translateX(-${index*(width+24)}px)`,transition:animate?'transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)':'none'}} onTransitionEnd={reset}>
  {[...testimonials,...testimonials,...testimonials].map((t,i)=><article key={i} className={`testimonial-card flex-shrink-0 rounded-[32px] md:rounded-[40px] bg-white shadow-[0_4px_16px_rgba(0,0,0,0.08)] px-6 md:pl-10 md:pr-24 py-8 flex flex-col ${i<index?'is-exiting':''}`} style={{width}} aria-hidden={i<index||i>index+2}>
  <svg width="28" height="24" viewBox="0 0 28 24" fill="currentColor" aria-hidden="true"><path d="M0 13C0 5 4 1 11 0v4c-4 1-6 4-6 7h6v13H0V13Zm16 0c0-8 4-12 11-13v4c-4 1-6 4-6 7h6v13H16V13Z"/></svg>
  <p className="text-base leading-relaxed text-heading my-7 flex-1">{t.quote}</p><div className="flex items-center gap-3"><img className="w-12 h-12 rounded-full object-cover" src={asset(`avatar-${i%5}.jpg`)} alt=""/><div><p className="text-sm font-semibold">{t.name}</p><p className="text-xs text-[#273C46] mt-1">↳ {t.role}</p></div></div></article>)}
  </div></div>
  <div className="flex justify-end gap-3 px-6 mt-8 md:max-w-4xl md:ml-auto"><button className="carousel-arrow" aria-label="Previous testimonial" onClick={()=>setIndex(i=>i-1)}><ChevronLeft className="w-5 h-5"/></button><button className="carousel-arrow" aria-label="Next testimonial" onClick={()=>setIndex(i=>i+1)}><ChevronRight className="w-5 h-5"/></button></div>
 </section>;
}
