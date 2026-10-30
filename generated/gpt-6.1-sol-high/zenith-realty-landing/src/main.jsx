import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { ChevronDown, Home, Menu, X, Square, Layers, Bed, Bath, ArrowUpRight, ArrowRight, Check } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar } from 'recharts';
import './index.css';

const asset = name => `${import.meta.env.BASE_URL}assets/${name}`;
const properties = [
  { title: 'Aether Heights', price: '$345,000', location: 'USA/California/Malibu', stats: ['300 m²', '1 floor', '6 beds', '2 baths'], image: 'aether.webp' },
  { title: 'Azure Sanctuary', price: '$225,000', location: 'Caribbean/Bahamas/Bimini', stats: ['250 m²', '1 floor', '4 beds', '1 bath'], image: 'azure.webp' },
  { title: 'Summit Pavilion', price: '$510,000', location: 'USA/Colorado/Vail', stats: ['400 m²', '3 floors', '6 beds', '3 baths'], image: 'summit.webp' },
];
const services = [
  {title:'Market Analysis', description:'Understand the market with considered local insight, property comparisons, and a clear view of your opportunities.'},
  {title:'Exclusive collection', description:'Consultants curate custom lists of vetted homes. Featuring media, VR walk-ins, and private physical tours.'},
  {title:'Policy Support', description:'Move forward with clarity. Our consultants guide you through property requirements, documentation, and every detail along the way.'},
  {title:'Closing Deal', description:'From your final offer to the keys in your hand, our team coordinates the details for a smooth, confident closing.'},
];
const metrics = [
  {title:'Annual growth',value:'19%',data:[35,60,45,40,55,75,60,80,55,30]},
  {title:'Aggregate yield profit',value:'$820,000',data:[8,12,18,28,32,38,55,70,85]},
  {title:'Median returns',value:'14%',data:[10,75,20,35,30,65,55,25,40]},
];
const statIcons = [Square,Layers,Bed,Bath];
function SectionHeader({title,children}) {return <div className="section-heading"><h2>{title}</h2><div className="section-intro">{children}</div></div>}
function App(){
 const [menu,setMenu]=useState(false),[dropdown,setDropdown]=useState(null),[service,setService]=useState(1),[dialog,setDialog]=useState(null),[submitted,setSubmitted]=useState(false);
 const reduced=useReducedMotion();
 const closeRef=useRef(null), triggerRef=useRef(null);
 const openDialog=(type)=>{triggerRef.current=document.activeElement;setMenu(false);setDropdown(null);setSubmitted(false);setDialog(type)};
 const closeDialog=()=>{setDialog(null);triggerRef.current?.focus()};
 useEffect(()=>{if(!dialog&&!menu)return;const previous=document.activeElement;document.body.style.overflow='hidden';const onKey=e=>{if(e.key==='Escape'){setDialog(null);setMenu(false);previous?.focus()}if(e.key==='Tab'){const panel=document.querySelector('[aria-modal="true"]');const els=panel?.querySelectorAll('button,a,input,select,textarea');if(!els?.length)return;const first=els[0],last=els[els.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}}};document.addEventListener('keydown',onKey);requestAnimationFrame(()=>document.querySelector('[aria-modal="true"] button')?.focus());return()=>{document.body.style.overflow='';document.removeEventListener('keydown',onKey)}},[dialog,menu]);
 const reveal={initial:{opacity:0,y:reduced?0:30},whileInView:{opacity:1,y:0},viewport:{once:true,amount:0.12},transition:{duration:0.7}};
 const link=(href)=>{setMenu(false);setDropdown(null);document.querySelector(href)?.scrollIntoView({behavior:reduced?'instant':'smooth'})};
 return <main className="font-lato bg-[#F8F8F8] text-[#141414]">
  <section className="hero h-screen relative overflow-hidden" id="home">
   <video src={asset('hero.mp4')} autoPlay muted loop playsInline className="hero-video absolute top-0 left-0 w-full h-full object-cover z-0" aria-hidden="true" />
   <div className="hero-overlay relative z-10 bg-white/10">
    <header className="navbar page-width">
     <a className="logo" href="#home" aria-label="Zenith Realty home"><span>ZENITH</span><span>REALTY</span></a>
     <nav className="desktop-nav" aria-label="Main navigation">
      <div className="nav-dropdown"><button aria-expanded={dropdown==='properties'} onClick={()=>setDropdown(dropdown==='properties'?null:'properties')}>Properties <ChevronDown size={12}/></button><AnimatePresence>{dropdown==='properties'&&<motion.div initial={{opacity:0,y:-5}} animate={{opacity:1,y:0}} exit={{opacity:0}} className="dropdown"><a href="#properties" onClick={()=>setDropdown(null)}>Explore properties <ArrowUpRight size={14}/></a><button onClick={()=>openDialog('Book a call')}>Find your next home <ArrowUpRight size={14}/></button></motion.div>}</AnimatePresence></div>
      <a href="#investment">Mortgage <span className="new-badge">New</span></a>
      <a href="#services">Company</a>
      <div className="nav-dropdown"><button aria-expanded={dropdown==='careers'} onClick={()=>setDropdown(dropdown==='careers'?null:'careers')}>Careers <ChevronDown size={12}/></button><AnimatePresence>{dropdown==='careers'&&<motion.div initial={{opacity:0,y:-5}} animate={{opacity:1,y:0}} exit={{opacity:0}} className="dropdown"><button onClick={()=>openDialog('Join our team')}>Connect with our team <ArrowUpRight size={14}/></button></motion.div>}</AnimatePresence></div>
      <a href="#investment">Blog</a>
     </nav>
     <button className="post-button" onClick={()=>openDialog('Post a property')}><Home size={14} strokeWidth={1.5}/>Post a property</button>
     <button className="menu-toggle" aria-label="Open menu" aria-expanded={menu} onClick={()=>setMenu(true)}><Menu size={24}/></button>
    </header>
    <div className="hero-content page-width">
     <div className="hero-main"><motion.h1 initial={{opacity:0,y:reduced?0:30}} animate={{opacity:1,y:0}} transition={{duration:0.9}}>Discover space<br/>you truly belong in</motion.h1><motion.button className="dark-button hero-cta" initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.6}} onClick={()=>openDialog('Book a call')}>Book a call</motion.button></div>
     <motion.p className="hero-description" initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.4,duration:0.8}}>Experience more than a house; find a sanctuary where your journey unfolds, rich with comfort and endless opportunities.</motion.p>
    </div>
   </div>
  </section>
  <section id="properties" className="section page-width">
   <motion.div {...reveal}><SectionHeader title={<>Guiding you toward the<br className="desktop-break"/> residence of your dreams</>}><p>Our vision bridges balance, design, and attention so that every client resides in a space reflecting their values.</p></SectionHeader></motion.div>
   <div className="property-grid">{properties.map((p,i)=><motion.article key={p.title} className="property-card group bg-white" {...reveal} transition={{duration:0.7,delay:i*0.12}}><div className="property-image"><img src={asset(p.image)} alt={`${p.title}, a luxury residence in ${p.location.split('/').pop()}`} loading="lazy" className="group-hover:scale-105 duration-700"/></div><div className="property-details"><div className="property-title-row"><h3>{p.title}</h3><span>{p.price}</span></div><p className="location">{p.location}</p><div className="property-stats">{p.stats.map((stat,j)=>{const Icon=statIcons[j];return <span key={stat}><Icon size={13} strokeWidth={2.5}/>{stat}</span>})}</div></div></motion.article>)}</div>
  </section>
  <section id="services" className="section page-width">
   <motion.div {...reveal}><SectionHeader title={<>Explore our service<br/>and the process</>}><p>Digital walk-throughs, select portfolios, and professional insight — all the tools to search and secure with ease.</p></SectionHeader></motion.div>
   <motion.div className="service-layout" {...reveal}>
    <div className="service-panel"><AnimatePresence mode="wait"><motion.div key={service} initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-8}} transition={{duration:0.18}} className="service-copy"><h3>{services[service].title}</h3><p>{services[service].description}</p><button className="outline-button" onClick={()=>openDialog('Free consult')}>Free consult</button></motion.div></AnimatePresence>
     <div className="service-tabs" role="tablist" aria-label="Our process" aria-orientation="vertical">{services.map((s,i)=><button id={`service-tab-${i}`} role="tab" aria-selected={service===i} aria-controls="service-image" tabIndex={service===i?0:-1} onKeyDown={e=>{if(['ArrowDown','ArrowUp','Home','End'].includes(e.key)){e.preventDefault();const next=e.key==='Home'?0:e.key==='End'?3:(i+(e.key==='ArrowDown'?1:3))%4;setService(next);document.getElementById(`service-tab-${next}`)?.focus()}}} className={service===i?'active':''} onClick={()=>setService(i)} key={s.title}>{s.title}{service===i&&<ArrowUpRight size={14}/>}</button>)}</div>
    </div>
    <div id="service-image" role="tabpanel" aria-labelledby={`service-tab-${service}`} className="service-image"><img src={asset('collection.webp')} alt="Sculptural contemporary home surrounded by lush tropical gardens" loading="lazy"/></div>
   </motion.div>
  </section>
  <section id="investment" className="section investment page-width">
   <motion.div {...reveal}><SectionHeader title={<>Trusted frameworks<br/>for secure growth</>}><p>Our holdings go beyond floor plans; they represent a vehicle for your wealth to thrive consistently.</p><p>We meticulously vet the premier market offerings for our valued partners.</p></SectionHeader></motion.div>
   <div className="metrics-grid">{metrics.map((metric,i)=><motion.article className="metric-card" key={metric.title} {...reveal} transition={{duration:0.7,delay:i*0.1}}><div><h3>{metric.title}</h3><p className="metric-value">{metric.value}</p></div><div className="chart" role="img" aria-label={`${metric.title}: ${metric.value}. Bar values: ${metric.data.join(', ')}`}><ResponsiveContainer width="100%" height="100%" minWidth={0}><BarChart data={metric.data.map(value=>({value}))} margin={{top:3,right:0,bottom:0,left:0}} barCategoryGap="12%"><Bar dataKey="value" isAnimationActive={!reduced} animationDuration={1100} shape={({x,y,width,height})=><g><rect x={x} y={y} width={width} height={height} fill="#141414" fillOpacity={0.05}/><rect x={x} y={y} width={width} height={2} fill="#141414"/></g>}/></BarChart></ResponsiveContainer></div></motion.article>)}</div>
  </section>
  <AnimatePresence>{menu&&<><motion.div className="menu-backdrop" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={()=>setMenu(false)}/><motion.div className="mobile-menu" role="dialog" aria-modal="true" aria-label="Navigation" initial={{x:'100%'}} animate={{x:0}} exit={{x:'100%'}} transition={{type:'tween',duration:0.35}}><div className="mobile-menu-header"><span className="logo"><span>ZENITH</span><span>REALTY</span></span><button aria-label="Close menu" onClick={()=>setMenu(false)}><X/></button></div><nav aria-label="Mobile navigation">{[['Properties','#properties'],['Mortgage','#investment'],['Company','#services'],['Careers','careers'],['Blog','#investment']].map(([name,href])=><button key={name} onClick={()=>href==='careers'?openDialog('Join our team'):link(href)}>{name}{name==='Mortgage'?<span className="new-badge">New</span>:<ArrowUpRight size={19}/>}</button>)}</nav><button className="dark-button mobile-post" onClick={()=>openDialog('Post a property')}><Home size={16}/>Post a property</button></motion.div></>}</AnimatePresence>
  <AnimatePresence>{dialog&&<motion.div className="dialog-backdrop" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={closeDialog}><motion.div role="dialog" aria-modal="true" aria-labelledby="dialog-title" className="contact-dialog" initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} exit={{opacity:0,y:20}} onClick={e=>e.stopPropagation()}><button ref={closeRef} className="dialog-close" aria-label="Close dialog" onClick={closeDialog}><X size={21}/></button>{submitted?<div className="success-message"><Check size={28}/><h2 id="dialog-title">Your details are ready.</h2><p>This is a preview. Your information has been checked locally, but has not been sent to Zenith Realty.</p><button className="dark-button" onClick={closeDialog}>Back to exploring</button></div>:<><span className="eyebrow">ZENITH REALTY</span><h2 id="dialog-title">{dialog}</h2><p className="dialog-description">{dialog==='Post a property'?'Tell us about your property. Let’s find where it belongs.':dialog==='Join our team'?'Make space for your next chapter. Introduce yourself below.':'A considered next step starts with a conversation.'}</p><form onSubmit={e=>{e.preventDefault();setSubmitted(true)}}><label>Your name<input name="name" autoComplete="name" placeholder="Full name" required/></label><label>Email address<input type="email" name="email" autoComplete="email" placeholder="you@example.com" required/></label>{dialog==='Post a property'?<label>Property location<input name="location" placeholder="City, region" required/></label>:<label>{dialog==='Join our team'?'Your area of expertise':'What are you looking for?'}<textarea name="message" rows={2} placeholder={dialog==='Join our team'?'Tell us a little about yourself':'Your ideal home, location, or questions'} required/></label>}<p className="preview-notice">Preview form — no information is sent or stored.</p><button className="dark-button submit-button" type="submit">Review details <ArrowRight size={15}/></button></form></>}</motion.div></motion.div>}</AnimatePresence>
 </main>
}

createRoot(document.getElementById('root')).render(<React.StrictMode><App/></React.StrictMode>);
