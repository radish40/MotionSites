import React, { useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { motion, useInView } from 'framer-motion';
import './index.css';

const ease = [0.22, 1, 0.36, 1] as const;
const glitches = [[2,-3,22,22],[12,-5,14,10],[28,-2,10,10],[82,22,8,8],[-4,75,16,12],[8,82,10,10],[-2,88,18,16],[56,82,12,14],[70,90,10,10],[42,94,8,6]];
const services = [{label:'websites',angle:215},{label:'brands',angle:335},{label:'ui/ux design',angle:110}];
const point = (radius:number, angle:number) => ({x:50+radius*Math.cos(angle*Math.PI/180),y:50+radius*Math.sin(angle*Math.PI/180)});

export function BrandingApproach() {
  const ref = useRef<HTMLElement>(null);
  const visible = useInView(ref, {once:true, margin:'-60px'});
  const [active, setActive] = useState<string|null>(null);
  const [replay, setReplay] = useState(0);
  const enter = (delay=0, y=20, duration=.7) => ({initial:{opacity:0,y}, animate:visible?{opacity:1,y:0}:{opacity:0,y},transition:{duration,delay,ease}});
  return <section ref={ref} aria-labelledby="approach-heading" className="min-h-screen overflow-x-hidden bg-[#0f0f0f] text-white" style={{fontFamily:"'DM Sans', sans-serif"}}>
    <div key={replay} className="mx-auto max-w-7xl px-6 py-24 sm:px-10 lg:px-16 lg:py-32">
      <header className="mb-20 flex items-start gap-4">
        <h1 id="approach-heading" className="font-light leading-[1.18] tracking-[-0.01em]" style={{fontSize:'clamp(2rem, 3.4vw, 2.6rem)'}}>
          <motion.span {...enter()} className="block text-[#6e6e6e]">Our Comprehensive</motion.span>
          <motion.span {...enter(.1)} className="block">Branding Approach</motion.span>
        </h1>
        <motion.button aria-label="Replay entrance animation" title="Replay entrance animation" onClick={()=>{setReplay(n=>n+1);setActive(null)}} className="flex h-7 w-7 shrink-0 items-center justify-center border border-white/20 text-white/70 transition-colors hover:bg-white/10 hover:text-white" initial={{opacity:0,scale:.8}} animate={visible?{opacity:1,scale:1}:{opacity:0,scale:.8}} transition={{duration:.7,delay:.25,ease}}>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden="true"><path d="M6 1v10M1 6h10"/></svg>
        </motion.button>
      </header>
      <div className="flex flex-col gap-12 lg:flex-row lg:items-start lg:gap-10">
        <div className="flex min-w-0 flex-1 flex-col gap-8 sm:flex-row sm:items-start sm:gap-10">
          <motion.div {...enter(.2,24,.8)} className="relative shrink-0" style={{width:250,height:310}}>
            <img src={`${import.meta.env.BASE_URL}assets/portrait.jpeg`} alt="Studio founder Alex West" width="250" height="310" className="h-full w-full object-cover"/>
            {glitches.map(([x,y,w,h],i)=><motion.span key={i} aria-hidden="true" className="absolute bg-white" style={{left:`${x}%`,top:`${y}%`,width:w,height:h}} initial={{scale:0,opacity:0}} animate={visible?{scale:1,opacity:[0,1,.9]}:{scale:0,opacity:0}} transition={{delay:.5+i*.05,duration:.35,ease}}/>)}
          </motion.div>
          <div className="min-w-0 max-w-[420px]">
            <motion.div {...enter(.3,14)} aria-hidden="true" className="text-[#555]" style={{fontFamily:"Georgia, 'Times New Roman', serif",fontSize:'3.2rem',lineHeight:.7}}>“</motion.div>
            <motion.p {...enter(.4)} className="font-normal leading-[1.58] text-white/90" style={{fontSize:'clamp(1.05rem, 1.5vw, 1.28rem)'}}>We kept seeing the same pattern &mdash; brands with potential lost between messy processes, scattered visuals, and forgettable websites. This studio exists to align it all into one clear, consistent story.</motion.p>
            <motion.div {...enter(.55,14)} className="mt-10">
              <p className="text-[1.15rem] font-medium tracking-[0.01em] text-white">Alex West</p>
              <p className="mt-1 text-[0.85rem] tracking-wide text-[#6e6e6e]">Founder &amp; Creative Director</p>
            </motion.div>
          </div>
        </div>
        <div className="flex w-full max-w-[360px] shrink-0 items-center justify-center self-center sm:max-w-[400px] lg:max-w-[440px]">
          <motion.div className="relative aspect-square w-full" initial={{opacity:0}} animate={{opacity:visible?1:0}} transition={{delay:.4,duration:.8,ease}}>
            <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full" fill="none" aria-hidden="true">
              <circle cx="50" cy="50" r="30" stroke="white" strokeWidth=".18" opacity=".45"/>
              {services.map(({label,angle})=>{const p=point(36,angle);return <motion.line key={label} data-service={label} x1="50" y1="50" x2={p.x} y2={p.y} stroke="white" animate={{strokeWidth:active===label?.6:.18,opacity:active===label?1:.45}} transition={{duration:.3,ease}}/>})}
            </svg>
            {services.map(({label,angle},i)=>{const p=point(46,angle);return <div key={label} className="absolute" style={{left:`${p.x}%`,top:`${p.y}%`,transform:'translate(-50%, -50%)'}}><motion.button {...enter(.6+i*.15,16)} className="diagram-label whitespace-nowrap tracking-[-0.01em] text-white" style={{fontSize:'clamp(1.25rem, 2.8vw, 2.4rem)'}} data-active={active===label} onMouseEnter={()=>setActive(label)} onMouseLeave={()=>setActive(null)} onFocus={()=>setActive(label)} onBlur={()=>setActive(null)} onClick={()=>setActive(label)} aria-pressed={active===label}>{label}</motion.button></div>})}
          </motion.div>
        </div>
      </div>
    </div>
  </section>
}
createRoot(document.getElementById('root')!).render(<React.StrictMode><BrandingApproach/></React.StrictMode>);
