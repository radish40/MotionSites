import { useEffect, useRef, useState } from 'react';
import { Facebook, Twitter, Linkedin, BarChart3, Aperture, X } from 'lucide-react';
import { useScrollReveal } from './useScrollReveal';
const asset = (name: string) => `${import.meta.env.BASE_URL}assets/${name}`;
const logo = 'M 64 128 L 64.5 128 L 32 95 L 0 64 L 0 0 L 64 0 L 128 64 L 128 64.5 L 161 32 L 192 0 L 256 0 L 256 64 L 192 128 L 128 128 L 128 192 L 96 223 L 63.5 256 L 0 256 L 0 192 Z M 256 192 L 224 223 L 191.5 256 L 128 256 L 128 192 L 192 128 L 256 128 Z';
function Navbar() {
 const style = 'text-[10px] sm:text-xs uppercase font-medium tracking-[0.15em] sm:tracking-[0.2em] text-white/85 hover:text-white transition-colors';
 return <nav aria-label="Main navigation" className="liquid-glass fixed left-1/2 -translate-x-1/2 top-4 sm:top-6 z-50 rounded-full px-4 py-2.5 sm:px-10 sm:py-3 flex items-center gap-4 sm:gap-12 whitespace-nowrap">
  <a href="#gallery" className={style}>Gallery</a><a href="#talents" className={style}>Talents</a>
  <a href="#home" aria-label="Digital Archive home"><svg viewBox="0 0 256 256" fill="white" className="h-5 w-5 sm:h-7 sm:w-7 hover:scale-110 transition-transform"><path d={logo}/></svg></a>
  <a href="#journal" className={style}>Journal</a><a href="#story" className={style}>Story</a>
 </nav>;
}
function Hero() {
 return <section id="home" className="relative h-screen w-full overflow-hidden text-white">
  <video className="absolute inset-0 h-full w-full object-cover" autoPlay muted loop playsInline poster={asset('hero-poster.jpg')} aria-hidden="true"><source src={asset('hero.mp4')} type="video/mp4" /></video>
  <div className="absolute inset-0 bg-black/10" />
  <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6 pb-16 sm:pb-20">
   <div className="hero-fade-up mb-7 sm:mb-8" style={{animationDelay:'0.1s'}}><p className="text-xs sm:text-sm font-medium uppercase tracking-[0.35em] text-white/90">Studioworks</p><p className="mt-2 text-[10px] sm:text-xs font-light uppercase tracking-[0.4em] text-white/70">Exhibits</p></div>
   <h1 className="hero-fade-up leading-[1.05] drop-shadow-[0_2px_24px_rgba(0,0,0,0.25)]" style={{animationDelay:'0.25s'}}><span className="block font-arsenica text-5xl sm:text-7xl md:text-8xl lg:text-[7rem] tracking-wide">DIGITAL</span><span className="block font-inter font-semibold text-5xl sm:text-7xl md:text-8xl lg:text-[7rem] tracking-tight">ARCHIVE</span></h1>
   <p className="hero-fade-up font-arsenica text-sm sm:text-lg lg:text-xl max-w-xl text-white/90 mt-6 sm:mt-7 leading-relaxed" style={{animationDelay:'0.4s'}}>A showcase honoring the makers, visionaries and creators who turned a hard season into something rare.</p>
   <a href="#gallery" className="hero-fade-up liquid-glass rounded-[50%] px-10 py-5 sm:px-12 sm:py-6 text-[10px] sm:text-xs uppercase tracking-[0.25em] mt-8 sm:mt-10 hover:scale-[1.03] hover:shadow-[0_0_30px_rgba(255,255,255,0.15)] active:scale-[0.98] transition-all" style={{animationDelay:'0.55s'}}>Enter Gallery</a>
  </div>
 </section>;
}
function Showcase() {
 const ref = useScrollReveal<HTMLElement>();
 return <div className="relative -mt-40 sm:-mt-48 md:-mt-56 lg:-mt-64">
  <section id="gallery" ref={ref} className="relative min-h-screen overflow-hidden text-white flex items-center justify-center">
   <img src={asset('showcase.webp')} alt="Sculptural clouds against a deep burnt-maroon sky" className="showcase-image absolute inset-0 w-full h-full object-cover" />
   <div className="relative z-10 text-center px-6 py-32">
    <h2 id="talents" className="reveal font-arsenica text-4xl sm:text-5xl md:text-6xl lg:text-7xl tracking-wide drop-shadow-[0_2px_20px_rgba(0,0,0,0.3)]">Still Frame</h2>
    <p className="reveal mt-7 font-arsenica text-xl sm:text-2xl md:text-3xl lg:text-4xl tracking-wide text-white/90 leading-snug drop-shadow-[0_2px_16px_rgba(0,0,0,0.25)]" style={{animationDelay:'0.15s'}}>gave the world beauty<br/>born from the silence<br/>of empty studios.</p>
    <a href="#journal" className="reveal inline-block mt-10 rounded-[50%] border border-white/50 px-10 py-4 sm:px-12 sm:py-5 font-inter text-[10px] sm:text-xs uppercase tracking-[0.25em] hover:border-white hover:bg-white/10 hover:scale-[1.03] hover:shadow-[0_0_30px_rgba(255,255,255,0.1)] transition-all" style={{animationDelay:'0.3s'}}>View Their Archive</a>
   </div>
   <div className="absolute bottom-0 h-48 w-full bg-gradient-to-b from-transparent to-[#410C01]"/>
  </section>
  {/* Supplied dove is unavailable (Cloudinary account disabled); omit rather than substitute unrelated artwork. */}
 </div>;
}
const questions = [
 ["Welcome Maren. So how did Still Frame begin its journey?", "Less than a year into launching the gallery, everything shut down. I had to close our doors, cancel every exhibit, and rethink it all. But I never stopped curating because I was so determined not to let the artists' momentum die. We hit the ground running to build a digital space, and we've been evolving since."],
 ["How did you know where to begin?", "I didn't wait until we had the perfect platform. I saw artists struggling, isolated, uninspired, overwhelmed, and set to the task of creating ways to share their work with the world as quickly as possible."],
 ["So what was the first exhibit?", "We were one of the first galleries to launch a virtual exhibition after the shutdown. I think our artists were really grateful for that, they saw how hard we worked to honor their craft, and they trusted us while we continued to refine the digital experience."],
 ["What was the initial reaction?", "We had so many people writing and reaching out that the online exhibits and archived works saved them in isolation. The atmosphere was so intimate, and it was really powerful to have people connecting through art, even though we were all in our own rooms, in different cities."],
 ["Where did you evolve from there?", "The in-person pop-ups have been really special too, recently, now that enough people feel comfortable to gather. We had our first open-air exhibit in the courtyard last month, and I was basically in tears it was so beautiful."],
 ["Do you find there's a new appreciation for art?", "There's a feeling of urgency like -- this is our one life, our one chance, we don't have time to be indifferent anymore. We're gonna create like there's no tomorrow, we're gonna create for a better world, we're gonna create to reclaim our voice in this life, and we're gonna create because we deserve to feel beauty and wonder."]
];
function useParallax(mode: 'cloud' | 'bottom') {
 const section = useRef<HTMLElement>(null);
 const image = useRef<HTMLImageElement>(null);
 useEffect(() => {
  let frame = 0;
  const update = () => { if (section.current && image.current) {const rect=section.current.getBoundingClientRect(); const progress=1-rect.bottom/(innerHeight+rect.height); image.current.style.transform=mode==='cloud'?`translateY(${60-progress*30}%)`:`translateY(${-progress*80}px)`;} frame=0; };
  const scroll = () => { if (!frame) frame=requestAnimationFrame(update); };
  update(); window.addEventListener('scroll',scroll,{passive:true}); window.addEventListener('resize',scroll);
  return () => {cancelAnimationFrame(frame); window.removeEventListener('scroll',scroll); window.removeEventListener('resize',scroll);};
 },[mode]);
 return {section,image};
}
function QAndA() {
 const ref = useScrollReveal<HTMLDivElement>(); const {section,image} = useParallax('cloud');
 return <section id="journal" ref={section} className="relative bg-[#410C01] text-white px-4 sm:px-12 md:px-20 lg:px-28 pt-20 sm:pt-24 lg:pt-32" style={{paddingBottom:'50vh'}}>
  <div ref={ref} className="relative z-20 max-w-6xl mx-auto">
   <h2 className="reveal font-arsenica text-4xl sm:text-5xl lg:text-7xl flex items-baseline justify-center gap-1 mb-14 sm:mb-20"><span>Q</span><span className="italic text-xl sm:text-3xl lg:text-4xl text-white/80">&amp;</span><span>A</span></h2>
   <div className="grid md:grid-cols-2 gap-10 lg:gap-20">{[0,1].map(column=><div key={column} className={`space-y-10 lg:space-y-14 ${column?'md:mt-24':''}`}>{questions.slice(column*3,column*3+3).map(([q,a],i)=><article key={q} className="reveal" style={{animationDelay:`${(column*3+i+1)*0.12}s`}}><h3 className="font-arsenica text-xs sm:text-sm lg:text-base uppercase tracking-wide leading-relaxed mb-4">{q}</h3><p className="font-inter text-[11px] sm:text-xs lg:text-sm leading-relaxed text-white/60">{a}</p></article>)}</div>)}</div>
  </div>
  <img ref={image} src={asset('cloud.png')} alt="" className="pointer-events-none absolute bottom-0 left-0 w-full z-10"/>
 </section>;
}
function QuoteBanner() {
 const ref=useScrollReveal<HTMLDivElement>(); const {section,image}=useParallax('bottom');
 return <section id="story" ref={section} className="relative h-screen flex items-center lg:items-start justify-center lg:pt-[25vh] bg-cover bg-center text-white" style={{backgroundImage:`url("${asset('quote.webp')}")`}}>
  <div ref={ref} className="relative z-20 px-6 text-center"><blockquote className="reveal-scale font-arsenica text-xl sm:text-3xl md:text-4xl lg:text-5xl leading-snug lg:leading-tight max-w-xs sm:max-w-lg lg:max-w-2xl">“Art, resilience and vision <span className="font-light italic">are more important than ever.</span>”</blockquote></div>
  <img ref={image} src={asset('bottom.png')} alt="" className="pointer-events-none absolute -bottom-16 left-0 w-full z-10"/>
 </section>;
}
function Footer() {
 const [policy,setPolicy]=useState<string|null>(null); const close=useRef<HTMLButtonElement>(null); const trigger=useRef<HTMLElement|null>(null);
 useEffect(()=>{if(!policy)return; trigger.current=document.activeElement as HTMLElement; close.current?.focus(); const onKey=(event:KeyboardEvent)=>{if(event.key==='Escape')setPolicy(null); if(event.key==='Tab'){event.preventDefault();close.current?.focus();}};document.addEventListener('keydown',onKey);return()=>{document.removeEventListener('keydown',onKey);trigger.current?.focus();};},[policy]);
 const iconStyle='text-white/80 hover:text-white transition-colors'; const textStyle='text-[9px] sm:text-[10px] uppercase font-medium tracking-[0.15em] sm:tracking-[0.25em] text-white/80 hover:text-white hidden sm:block';
 return <><footer className="fixed bottom-0 left-0 right-0 z-40 bg-gradient-to-t from-black/40 to-transparent flex justify-between px-3 py-2.5 sm:px-10 sm:py-4"><div className="flex items-center gap-4 sm:gap-6">
  <a href="https://www.facebook.com/" aria-label="Facebook" className={iconStyle}><Facebook className="h-3.5 w-3.5 sm:h-4 sm:w-4"/></a><a href="https://twitter.com/" aria-label="Twitter" className={iconStyle}><Twitter className="h-3.5 w-3.5 sm:h-4 sm:w-4"/></a><a href="https://www.linkedin.com/" aria-label="LinkedIn" className={iconStyle}><Linkedin className="h-3.5 w-3.5 sm:h-4 sm:w-4"/></a><button onClick={()=>setPolicy('Privacy Notice')} className={textStyle}>Privacy Notice</button>
  </div><div className="flex items-center gap-4 sm:gap-6"><button onClick={()=>setPolicy('Terms & Policies')} className={textStyle}>Terms &amp; Policies</button><a href="#journal" aria-label="Read the gallery journal" className={iconStyle}><BarChart3 className="h-3.5 w-3.5 sm:h-4 sm:w-4"/></a><a href="#gallery" aria-label="Explore the gallery" className={iconStyle}><Aperture className="h-3.5 w-3.5 sm:h-4 sm:w-4"/></a></div></footer>
  {policy&&<div className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-md flex items-center justify-center p-6" onClick={()=>setPolicy(null)}><div role="dialog" aria-modal="true" aria-labelledby="policy-title" className="relative max-w-lg p-10 bg-[#410C01] text-white border border-white/20" onClick={e=>e.stopPropagation()}><button ref={close} onClick={()=>setPolicy(null)} aria-label="Close notice" className="absolute top-4 right-4"><X size={18}/></button><h2 id="policy-title" className="font-arsenica text-3xl mb-5">{policy}</h2><p className="text-sm text-white/70 leading-relaxed">{policy==='Privacy Notice'?'This showcase does not use analytics, accounts, or forms. Font stylesheets are requested from onlinewebfonts.com and Google Fonts. Social links take you to external websites, which have their own privacy policies.':'This digital showcase is presented for viewing and inspiration. Artwork and typography remain the property of their respective creators. External destinations are governed by their own terms.'}</p></div></div>}
 </>;
}
export default function App(){return <><Navbar/><main><Hero/><div className="relative z-20 -mt-64 sm:-mt-72 md:-mt-80 lg:-mt-96 pointer-events-none"><img src={asset('cloud.png')} className="pointer-events-none w-full" alt=""/></div><Showcase/><QAndA/><QuoteBanner/></main><Footer/></>;}
