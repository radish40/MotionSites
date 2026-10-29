import { useEffect, useRef, useState } from 'react';
import Logo from './Logo';
import CTA from './CTA';
const features = [
 { title:'Built for ease, not urgency', description:'Drift strips away the noise that makes organizing feel draining. Every surface is made to be soft, quiet, and intuitive so you can move forward, not get stuck decoding.', video:'ease.mp4' },
 { title:'The gentlest way to start', description:'Beginning your day should feel natural, not daunting. Drift eases you into motion with subtle cues and a quiet view of what deserves your energy right now.', video:'start.mp4' },
 { title:'Deep, undivided focus', description:'No interruptions, no clutter. Drift holds you in the present task with a stripped-back layout that softens all else until you are truly ready to shift.', video:'focus.mp4' }
];
export default function FeaturesSection({onStart}:{onStart:()=>void}) {
 const [active,setActive]=useState(0);
 const [revealed,setRevealed]=useState<number[]>([]);
 const cards=useRef<(HTMLElement|null)[]>([]);
 useEffect(()=>{
  const reveal=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){const i=Number((entry.target as HTMLElement).dataset.index);setRevealed(old=>old.includes(i)?old:[...old,i]);reveal.unobserve(entry.target)}}),{threshold:0.15});
  const observe=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting)setActive(Number((entry.target as HTMLElement).dataset.index))}),{threshold:0.6});
  cards.current.forEach(card=>{if(card){reveal.observe(card);observe.observe(card)}});
  return()=>{reveal.disconnect();observe.disconnect()};
 },[]);
 return <section id="features" className="relative isolate overflow-x-clip px-5 py-20 md:px-10 md:py-40 lg:px-16 lg:py-48" aria-label="Drift features">
 <div aria-hidden="true" className="absolute inset-0 -z-10 bg-cover bg-center bg-fixed" style={{backgroundImage:`url(${import.meta.env.BASE_URL}assets/features.webp)`}}/>
 <div className="mx-auto grid max-w-[1440px] gap-12 lg:grid-cols-[400px_1fr] lg:gap-24 xl:grid-cols-[460px_1fr] xl:gap-48">
 <div className="lg:sticky lg:top-0 lg:flex lg:h-screen lg:flex-col lg:justify-between lg:py-32"><div><h2 className="max-w-lg text-2xl font-normal leading-[1.2] text-white sm:text-3xl lg:text-[46px]">Software that flows with your mind, not over it</h2><div className="mt-10 hidden flex-col items-start gap-3 lg:flex" aria-label="Feature navigation">{features.map((feature,i)=><button key={feature.title} aria-current={active===i?'true':undefined} onClick={()=>cards.current[i]?.scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'center'})} className={`rounded-xl bg-black/20 px-5 py-3 text-left text-sm font-medium transition-colors hover:text-white ${active===i?'text-white':'text-white/40'}`}>{feature.title}</button>)}</div></div><div className="hidden lg:block"><CTA compact onStart={onStart}/></div></div>
 <div className="space-y-12 md:space-y-24 lg:space-y-48 lg:py-32">{features.map((feature,i)=><article key={feature.title} ref={el=>{cards.current[i]=el}} data-index={i} className={`rounded-3xl bg-black/20 p-6 backdrop-blur-sm transition-[transform,opacity] duration-700 ease-out md:p-10 ${revealed.includes(i)?'translate-x-0 opacity-100':'translate-x-16 opacity-0'}`}>
 <Logo fill="rgba(255,255,255,0.8)"/><h3 className="mb-6 mt-8 text-xl font-medium text-white md:text-2xl">{feature.title}</h3><div className="aspect-video overflow-hidden rounded-2xl bg-black/30"><video aria-label={`${feature.title} preview`} className="h-full w-full object-cover" src={`${import.meta.env.BASE_URL}assets/${feature.video}`} autoPlay muted loop playsInline preload="metadata"/></div><p className="mt-6 text-sm font-medium leading-relaxed text-white/60 md:text-base">{feature.description}</p></article>)}</div></div></section>;
}
