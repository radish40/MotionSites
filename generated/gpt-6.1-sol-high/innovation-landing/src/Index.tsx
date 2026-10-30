import { useEffect, useRef, useState } from 'react';
import type { FormEvent } from 'react';
import { ArrowRight, Globe, Instagram, Twitter, X, Check } from 'lucide-react';
import AboutSection from './components/AboutSection';
import FeaturedVideoSection from './components/FeaturedVideoSection';
import PhilosophySection from './components/PhilosophySection';
import ServicesSection from './components/ServicesSection';
import { asset } from './components/shared';

function HeroVideo() {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(()=>{
    const video = ref.current!;
    let frame = 0, timer: ReturnType<typeof setTimeout> | undefined, fading = false, disposed = false;
    const fade = (to:number) => {
      cancelAnimationFrame(frame);
      const from = parseFloat(video.style.opacity || '0'), start = performance.now();
      const step = (now:number) => {
        const progress = Math.min((now-start)/500,1);
        video.style.opacity = String(from+(to-from)*progress);
        if(progress<1) frame=requestAnimationFrame(step);
      };
      frame=requestAnimationFrame(step);
    };
    const start = () => { video.play().then(()=>{ if (!disposed && !fading) fade(1); }).catch(()=>{}); };
    const update = () => { if(video.duration-video.currentTime<=.55 && !fading) { fading=true; fade(0); } };
    const ended = () => {
      cancelAnimationFrame(frame); video.style.opacity='0';
      timer=setTimeout(()=>{video.currentTime=0; fading=false; start();},100);
    };
    video.addEventListener('canplay',start); video.addEventListener('timeupdate',update); video.addEventListener('ended',ended);
    if(video.readyState>=3) start();
    return ()=>{disposed=true; cancelAnimationFrame(frame); clearTimeout(timer); video.removeEventListener('canplay',start);video.removeEventListener('timeupdate',update);video.removeEventListener('ended',ended);};
  },[]);
  return <video ref={ref} data-testid="hero-video" src={asset('hero')} className="absolute inset-0 w-full h-full object-cover object-bottom" style={{opacity:0}} muted autoPlay playsInline preload="auto" aria-hidden="true"/>;
}
export default function Index() {
  const emailRef=useRef<HTMLInputElement>(null), dialogRef=useRef<HTMLDialogElement>(null);
  const [subscribed,setSubscribed]=useState(false),[modal,setModal]=useState('');
  const open=(title:string)=>{setModal(title);dialogRef.current?.showModal();};
  const subscribe=(event:FormEvent)=>{event.preventDefault();setSubscribed(true);};
  return <>
    <main>
      <section className="hero relative overflow-hidden flex flex-col bg-black">
        <HeroVideo/>
        <nav aria-label="Main navigation" className="relative z-20 px-6 py-6">
          <div className="liquid-glass rounded-full max-w-5xl mx-auto px-5 md:px-6 py-3 flex items-center justify-between gap-3">
            <div className="flex items-center"><a href="#" aria-label="Asme home" className="flex items-center gap-2.5 text-lg font-semibold"><Globe size={24}/>Asme</a><div className="hidden md:flex gap-8 ml-8 text-white/80 text-sm font-medium"><a className="hover:text-white transition-colors" href="#services">Features</a><button className="hover:text-white transition-colors" onClick={()=>open('Pricing')}>Pricing</button><a className="hover:text-white transition-colors" href="#about">About</a></div></div>
            <div className="flex items-center gap-4 md:gap-6 text-sm font-medium"><button onClick={()=>{emailRef.current?.focus();emailRef.current?.scrollIntoView({block:'center'});}}>Sign Up</button><button onClick={()=>open('Login')} className="liquid-glass rounded-full px-5 md:px-6 py-2 hover:bg-white/5 transition-colors">Login</button></div>
          </div>
        </nav>
        <div className="hero-content relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-12 text-center">
          <h1 className="serif text-7xl md:text-8xl lg:text-9xl tracking-tight whitespace-nowrap leading-none mb-10">Know it <em className="italic">all</em>.</h1>
          <form onSubmit={subscribe} className="w-full max-w-xl">
            <div className="email-pill liquid-glass rounded-full pl-6 pr-2 py-2 flex items-center gap-3">
              <input ref={emailRef} required type="email" name="email" aria-label="Email address" autoComplete="email" placeholder="Enter your email" className="bg-transparent min-w-0 flex-1 text-white placeholder:text-white/40 text-sm py-2" onChange={()=>setSubscribed(false)}/>
              <button type="submit" className="bg-white rounded-full p-3 text-black hover:bg-white/85 transition-colors" aria-label="Subscribe to newsletter">{subscribed?<Check size={20}/>:<ArrowRight size={20}/>}</button>
            </div>
            <p role="status" className={`text-xs mt-3 ${subscribed?'text-white':'sr-only'}`}>{subscribed?'Thanks for your interest. Newsletter signup is not connected yet.':''}</p>
          </form>
          <p className="text-white text-sm leading-relaxed px-4 max-w-lg mt-6 mb-8">Stay updated with the latest news and insights. Subscribe to our newsletter today and never miss out on exciting updates.</p>
          <a href="#philosophy" className="liquid-glass rounded-full px-8 py-3 text-white text-sm font-medium hover:bg-white/5 transition-colors">Our Manifesto</a>
        </div>
        <div className="relative z-10 flex justify-center gap-4 pb-12">{[{icon:Instagram,label:'Instagram',href:'https://www.instagram.com/'},{icon:Twitter,label:'Twitter',href:'https://twitter.com/'},{icon:Globe,label:'About Asme',href:'#about'}].map(({icon:Icon,label,href})=><a key={label} aria-label={label} href={href} {...(href.startsWith('https')?{target:'_blank',rel:'noopener noreferrer'}:{})} className="liquid-glass rounded-full p-4 text-white/80 hover:text-white hover:bg-white/5 transition-all"><Icon size={20}/></a>)}</div>
      </section>
      <AboutSection/><FeaturedVideoSection/><PhilosophySection/><ServicesSection onSelect={open}/>
    </main>
    <dialog ref={dialogRef} className="modal bg-black text-white rounded-3xl p-8 max-w-md w-[calc(100%-3rem)] border border-white/20" onClick={event=>{if(event.target===dialogRef.current)dialogRef.current.close();}}>
      <button onClick={()=>dialogRef.current?.close()} aria-label="Close dialog" className="absolute top-5 right-5 rounded-full p-2 hover:bg-white/10"><X size={20}/></button>
      <h2 className="serif text-4xl mb-5 pr-8">{modal}</h2>
      <p className="text-white/60 text-sm leading-relaxed">{modal==='Login'?'Member login is not available on this preview. Explore our approach and services below.':modal==='Pricing'?'Every project starts with a question. Pricing is tailored to the scope of each project; no plans are published on this preview.':modal==='Research & Insight'?'We dig deep into data, culture, and human behavior to surface the insights that drive meaningful, lasting change.':'From concept to launch, we obsess over every detail to deliver experiences that feel effortless and look extraordinary.'}</p>
      <button onClick={()=>{dialogRef.current?.close();document.getElementById(modal==='Login'?'about':'services')?.scrollIntoView({behavior:'smooth'});}} className="liquid-glass rounded-full px-6 py-3 text-sm mt-7">Explore {modal==='Login'?'our approach':'our services'}</button>
    </dialog>
  </>;
}
