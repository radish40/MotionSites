'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Menu, X } from 'lucide-react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
const goldEase = [0.76, 0, 0.24, 1] as const;
const desktopLinks = [{label:'About',href:'/'},{label:'Destinations',href:'/destinations'},{label:'Booking',href:'/booking'},{label:'FAQ',href:'/faq'},{label:'Account',href:'/account'}];
const mobileLinks = desktopLinks.slice(0,4);
export default function Navbar(){
 const [open,setOpen]=useState(false);
 const pathname=usePathname().replace(/\/$/,'') || '/';
 const isHome=pathname==='/', isTourDetail=pathname.startsWith('/destinations/');
 return <>
 <Link href="/" aria-label="Travel home" onClick={()=>setOpen(false)} className={`fixed top-[30px] left-[30px] z-[1001] ${open?'text-black':isTourDetail?'text-white':isHome?'max-[850px]:text-white min-[851px]:text-black':'text-black'}`}><Star size={30} fill="currentColor" strokeWidth={0}/></Link>
 <button aria-label="Open menu" aria-expanded={open} onClick={()=>setOpen(true)} className={`fixed top-7.5 right-7.5 z-[300] hover:scale-110 transition-transform duration-300 ease-out cursor-pointer ${isHome||isTourDetail?'text-white':'text-black'}`}><Menu size={32}/></button>
 <AnimatePresence>{open&&<motion.div initial={{y:'-100%'}} animate={{y:0}} exit={{y:'-100%'}} transition={{duration:0.75,ease:goldEase}} className="fixed inset-0 bg-white z-[1000] flex items-center justify-center" role="dialog" aria-modal="true" aria-label="Navigation" onKeyDown={e=>{if(e.key==='Escape')setOpen(false)}}>
 <button autoFocus aria-label="Close menu" onClick={()=>setOpen(false)} className="absolute top-7.5 right-7.5 hover:rotate-90 transition-transform cursor-pointer"><X size={32}/></button>
 <nav className="flex flex-col gap-5 items-center">{mobileLinks.map((l,i)=><motion.div key={l.href} initial={{opacity:0,y:28}} animate={{opacity:1,y:0}} transition={{delay:0.3+i*0.07,duration:0.55,ease:goldEase}}><Link href={l.href} onClick={()=>setOpen(false)} className="text-5xl md:text-7xl font-light tracking-tighter hover:italic">{pathname===l.href&&<span className="mr-1">/</span>}{l.label}</Link></motion.div>)}</nav>
 </motion.div>}</AnimatePresence>
 {!isTourDetail&&<nav aria-label="Main navigation" className="fixed bottom-10 left-10 z-[100] hidden min-[851px]:flex flex-col gap-1">{desktopLinks.map((l,i)=><motion.div key={l.href} initial={{y:20,opacity:0}} animate={{y:0,opacity:1}} transition={{delay:0.4+i*0.08,duration:0.6,ease:goldEase}}><Link href={l.href} className="footerLink text-[13px] tracking-widest font-medium transition-all">{pathname===l.href&&<span className="mr-0.5">/</span>}{l.label}</Link></motion.div>)}</nav>}
 </>;
}
