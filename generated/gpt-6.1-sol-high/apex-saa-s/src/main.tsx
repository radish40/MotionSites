import React, { useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { ChevronRight, ChevronDown, Clock, DollarSign, ShieldCheck, X, Menu, ArrowRight, Check } from 'lucide-react';
import './index.css';

const information: Record<string, { title: string; text: string; items: string[] }> = {
 Features: {title:'Keep your funnel moving.',text:'Bring your revenue workflow into focus.',items:['Clever workflows','Actionable analytics','Seamless lead management']},
 Solutions:{title:'Built for your next stage.',text:'Connect your team around a clearer path to growth.',items:['Manage your leads','Understand your funnel','Move opportunities forward']},
 Plans:{title:'Clarity from the start.',text:'Find the right fit for your revenue goals.',items:['3-5 week turnround','Upfront cost clarity','Full refund assurance']},
 Learning:{title:'Make room for growth.',text:'Explore the foundations of a stronger revenue process.',items:['Workflow essentials','Understanding your analytics','Lead management fundamentals']},
 'Nova+':{title:'Meet Nova+.',text:'A fresh way to drive your funnel forward.',items:['Clever workflows','Connected analytics','Seamless lead management']}
};
function App(){
 const dialog = useRef<HTMLDialogElement>(null);
 const [active,setActive] = useState('');
 const [mobileMenu,setMobileMenu] = useState(false);
 const [submitted,setSubmitted] = useState(false);
 const open=(name:string)=>{setActive(name);setSubmitted(false);setMobileMenu(false);dialog.current?.showModal()};
 const details=information[active];
 return <main>
  <section className="relative overflow-hidden bg-background">
   <header className="relative z-20 mx-auto flex justify-center px-4 py-5">
    <nav aria-label="Main navigation" className="liquid-glass flex w-full max-w-[850px] items-center justify-between gap-6 rounded-3xl p-2">
     <a href="#" aria-label="APEX home" className="ml-2 flex items-center gap-2.5">
      <span className="flex h-7 w-7 items-center justify-center rounded-lg border border-border bg-gradient-to-b from-secondary to-muted"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.4" aria-hidden="true"><circle cx="12" cy="12" r="5"/><path d="M12 2v5m0 10v5M2 12h5m10 0h5"/></svg></span>
      <span className="text-xl font-semibold tracking-tight text-foreground">APEX</span>
     </a>
     <div className="hidden items-center md:flex">{['Features','Solutions','Plans','Learning'].map(name=><button key={name} onClick={()=>open(name)} className="flex items-center gap-1 px-3 py-2 text-base text-foreground/90 transition-colors hover:text-foreground">{name}{['Features','Learning'].includes(name)&&<ChevronDown size={14}/>}</button>)}</div>
     <div className="flex items-center gap-1"><button className="rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground" onClick={()=>open('Sign Up')}>Sign Up</button><button onClick={()=>setMobileMenu(!mobileMenu)} className="rounded-xl p-2 md:hidden" aria-label={mobileMenu?'Close menu':'Open menu'} aria-expanded={mobileMenu}>{mobileMenu?<X size={20}/>:<Menu size={20}/>}</button></div>
    </nav>
    {mobileMenu&&<div className="absolute left-4 right-4 top-[84px] rounded-2xl border border-border bg-card p-3 shadow-2xl md:hidden">{['Features','Solutions','Plans','Learning'].map(name=><button key={name} className="flex w-full items-center justify-between rounded-lg p-3 text-left hover:bg-white/5" onClick={()=>open(name)}>{name}<ChevronRight size={16}/></button>)}</div>}
   </header>
   <div className="flex flex-col items-center px-4 pb-3 pt-20">
    <button onClick={()=>open('Nova+')} className="liquid-glass mb-8 flex items-center gap-2 rounded-full py-1 pl-3 pr-1"><span className="text-xs text-foreground">Nova+ Launched!</span><span className="flex items-center gap-1 rounded-full bg-white/5 px-3 py-0.5 text-xs">Explore<ChevronRight className="h-3 w-3"/></span></button>
    <h1 className="max-w-5xl text-center text-4xl font-semibold leading-[1.05] tracking-tight text-hero-heading sm:text-6xl lg:text-7xl">Accelerate Your<br/>Revenue Growth Now</h1>
    <p className="mt-4 max-w-md text-center text-lg leading-8 text-hero-sub opacity-80">Drive your funnel forward with clever workflows, analytics, and seamless lead management.</p>
    <div className="mt-8 flex items-center gap-4 max-[420px]:gap-3"><button onClick={()=>open('Start Free Right Now')} className="rounded-full bg-primary px-6 py-3 text-base font-medium text-primary-foreground max-[420px]:px-4 max-[420px]:text-sm">Start Free Right Now</button><button onClick={()=>open('Schedule a Consult')} className="liquid-glass rounded-full px-6 py-3 text-base font-normal text-foreground hover:bg-white/5 max-[420px]:px-4 max-[420px]:text-sm">Schedule a Consult</button></div>
   </div>
  </section>
  <section aria-label="Trusted by growing teams" className="relative w-full overflow-hidden">
   <video autoPlay muted playsInline loop aria-hidden="true" className="video-background absolute inset-0 h-full w-full object-cover" style={{opacity:0}} onCanPlay={e=>{e.currentTarget.style.opacity='1'}}><source src={`${import.meta.env.BASE_URL}assets/apex-background.mp4`} type="video/mp4"/></video>
   <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background"/>
   <div className="relative z-10 flex flex-col items-center gap-20 px-4 pb-24 pt-16">
    <div className="flex flex-wrap items-center justify-center gap-8 max-sm:gap-x-5 max-sm:gap-y-4">{[[Clock,'3-5 week turnround'],[DollarSign,'Upfront cost clarity'],[ShieldCheck,'Full refund assurance']].map(([Icon,label])=>{const I=Icon as typeof Clock;return <div key={String(label)} className="flex items-center gap-3 text-sm text-foreground/80"><span className="liquid-glass flex h-8 w-8 items-center justify-center rounded-lg"><I className="h-4 w-4 text-foreground/70"/></span><span className="font-medium">{String(label)}</span></div>})}</div>
    <div className="h-20 sm:h-28" aria-hidden="true"/>
    <div className="flex w-full max-w-5xl items-center gap-12 max-sm:flex-col max-sm:gap-6">
     <p className="shrink-0 whitespace-nowrap text-sm leading-5 text-foreground/50 max-sm:text-center">Relied on by brands<br/>across the globe</p>
     <div className="marquee-mask relative min-w-0 flex-1 overflow-hidden max-sm:w-full max-sm:flex-auto"><div className="flex w-max animate-marquee items-center" aria-label="Vortex, Nimbus, Prysma, Cirrus, Kynder, Halcyn">{[0,1].map(copy=><div key={copy} className="flex shrink-0 items-center gap-16 pr-16" aria-hidden={copy===1}>{['Vortex','Nimbus','Prysma','Cirrus','Kynder','Halcyn'].map(name=><div key={name} className="flex shrink-0 items-center gap-2"><span className="liquid-glass flex h-6 w-6 items-center justify-center rounded-lg text-xs font-bold text-foreground/70">{name[0]}</span><span className="whitespace-nowrap text-base font-semibold text-foreground">{name}</span></div>)}</div>)}</div></div>
    </div>
   </div>
  </section>
  <dialog ref={dialog} onClick={e=>{if(e.target===e.currentTarget)dialog.current?.close()}} aria-labelledby="dialog-title">
   <button autoFocus onClick={()=>dialog.current?.close()} className="absolute right-4 top-4 rounded-full p-2 hover:bg-white/5" aria-label="Close dialog"><X size={18}/></button>
   <p className="mb-5 text-xs font-semibold uppercase tracking-[.2em] text-purple-400">APEX {details?' / '+active:''}</p>
   <h2 id="dialog-title" className="pr-4 text-3xl font-semibold tracking-tight">{details?.title || (active==='Schedule a Consult'?'Let’s talk growth.':'Your next chapter starts here.')}</h2>
   {details?<><p className="mt-4 leading-relaxed text-hero-sub">{details.text}</p><ul className="my-6 space-y-4">{details.items.map(item=><li key={item} className="flex items-center gap-3 text-sm"><Check size={16} className="text-purple-400"/>{item}</li>)}</ul><button onClick={()=>open('Schedule a Consult')} className="flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm">Schedule a Consult<ArrowRight size={16}/></button></>:submitted?<p role="status" className="mt-6 leading-relaxed text-hero-sub">This preview doesn’t submit requests. Please contact your Apex representative to {active==='Schedule a Consult'?'arrange a consultation':'create your account'}.</p>:<form onSubmit={e=>{e.preventDefault();setSubmitted(true)}} className="mt-6 space-y-4"><p className="text-sm leading-6 text-muted-foreground">{active==='Schedule a Consult'?'Share your details to discuss your revenue goals.':'Take the first step toward a stronger funnel.'}</p><label className="block text-sm">Your name<input required name="name" autoComplete="name" className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3" placeholder="Alex Morgan"/></label><label className="block text-sm">Work email<input required type="email" name="email" autoComplete="email" className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3" placeholder="alex@company.com"/></label><p className="text-xs text-muted-foreground">Interactive preview — no information is sent or stored.</p><button className="w-full rounded-full bg-primary py-3 text-sm font-medium">{active==='Schedule a Consult'?'Request a Consultation':'Get Started'}</button></form>}
  </dialog>
 </main>
}
createRoot(document.getElementById('root')!).render(<React.StrictMode><App/></React.StrictMode>);
