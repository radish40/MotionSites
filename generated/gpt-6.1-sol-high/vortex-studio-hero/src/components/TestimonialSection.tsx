import {useEffect, useRef} from 'react';
import {Quote} from 'lucide-react';
import {asset} from '../assets';
import {Reveal} from './Reveal';
export default function TestimonialSection() {
 const picture = useRef<HTMLImageElement>(null);
 const frame = useRef<HTMLDivElement>(null);
 useEffect(() => {
  let visible = false, raf = 0;
  const update = () => {raf=0; if (!visible || !frame.current || !picture.current) return; const r=frame.current.getBoundingClientRect(); const offset=Math.max(-200,Math.min(200,(window.innerHeight/2-r.top-r.height/2)*0.16)); picture.current.style.transform=`translateY(${offset}px)`;};
  const scroll=()=>{if(visible && !raf) raf=requestAnimationFrame(update);};
  const observer=new IntersectionObserver(([e])=>{visible=e.isIntersecting;scroll();});
  if(frame.current) observer.observe(frame.current);
  window.addEventListener('scroll',scroll,{passive:true});
  return()=>{observer.disconnect();window.removeEventListener('scroll',scroll);cancelAnimationFrame(raf);};
 },[]);
 return <section id="about" className="py-12 px-6 max-w-2xl mx-auto">
  <Reveal delay={0.1}><Quote className="w-6 h-6 text-slate-900 mb-6"/></Reveal>
  <Reveal delay={0.2}><h2 className="display-heading">I left <span className="font-accent">Apple</span> to build the studio I always wanted to work with</h2></Reveal>
  <Reveal delay={0.3}><p className="italic text-sm text-[#273C46] mt-6">Viktor Oddy</p></Reveal>
  <Reveal delay={0.4}><div className="flex items-center gap-5 md:gap-12 mt-10 mb-14 font-medium text-2xl text-slate-900" aria-label="Experience at Apple, IDEO, and Polygon"><span className="w-20">Apple</span><span className="w-[83px]">IDEO</span><span className="w-[110px]">Polygon</span></div></Reveal>
  <Reveal delay={0.5}><div ref={frame} className="portrait-frame w-full max-w-xs mx-auto rounded-2xl shadow-lg overflow-hidden"><img ref={picture} src={asset('portrait.webp')} alt="Chris Halaska" className="w-full h-full object-cover"/></div></Reveal>
 </section>;
}
