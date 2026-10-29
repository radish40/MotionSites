import { useState } from 'react';
import Navbar from './components/Navbar';
import AboutSection from './components/AboutSection';
import FeaturesSection from './components/FeaturesSection';
import CTA from './components/CTA';
import InfoDialog, { type DialogType } from './components/InfoDialog';
export default function App(){
 const [dialog,setDialog]=useState<DialogType|null>(null);
 return <><main><section id="home" aria-label="Welcome to Drift" className="relative -mb-[25px] h-screen min-h-[560px] overflow-hidden"><video aria-label="Drift introduction" autoPlay muted loop playsInline preload="auto" className="absolute inset-0 h-full w-full object-cover" src={`${import.meta.env.BASE_URL}assets/hero.mp4`}/><div className="absolute inset-0 bg-black/20"/><Navbar onFAQ={()=>setDialog('faq')}/><div className="relative flex h-full flex-col items-center justify-end px-5 pb-12 md:pb-16"><h1 className="text-center text-5xl font-normal leading-[1.1] tracking-tight text-white sm:text-7xl md:text-8xl lg:text-[96px]">Own your time<br/>without <em className="not-italic" style={{fontFamily:"'Instrument Serif', serif",fontStyle:'italic'}}>the stress</em></h1><p className="mt-6 max-w-[420px] text-center text-sm font-medium text-white/80 md:text-base">Drift is a calm, ADHD-friendly planner that turns scattered ideas into a clear path</p><div className="mt-8 max-w-full"><CTA onStart={()=>setDialog('start')}/></div></div></section><AboutSection onAction={setDialog}/><FeaturesSection onStart={()=>setDialog('start')}/></main><InfoDialog type={dialog} onClose={()=>setDialog(null)}/></>;
}
