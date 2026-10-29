import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { AnimatePresence, motion, useInView } from 'motion/react';
import { Menu, X, ArrowUp, Instagram, Linkedin, Facebook } from 'lucide-react';
import './style.css';

const EXPO_OUT = [0.16, 1, 0.3, 1] as const;
const EASE_OUT = [0.25, 0.46, 0.45, 0.94] as const;
const asset = (name: string) => `${import.meta.env.BASE_URL}assets/${name}`;
const paths = [
  'M128.161 74.6764C79.9989 130.001 71.9994 46.0005 20.9815 111.737',
  'M216.999 9.99985C260.499 12.4998 222.499 71.9998 291.999 58.9998',
  'M130.102 70.9998C144.499 -32.0002 183.852 70.2739 219.999 3.99985',
  'M14.4999 16.9998C111 20.9998 -53.0003 73.4998 21.4999 107',
];
const stops = [[9.519,15.519],[289.519,59.518],[220.519,9.519],[125.518,78.519],[19.519,104.519]];

function Reveal({children, className = '', x = 0, y = 0, delay = 0}: { children: React.ReactNode; className?: string; x?: number; y?: number; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '0px 0px -40px 0px' });
  return <motion.div ref={ref} className={className} initial={{ opacity: 0, x, y }} animate={inView ? { opacity: 1, x: 0, y: 0 } : {}} transition={{ duration: .8, delay, ease: EXPO_OUT }}>{children}</motion.div>;
}

function Phone({children, name, center = false, zoom}: { children: React.ReactNode; name: string; center?: boolean; zoom: number }) {
  return <motion.div className="phone-mockup" style={{zoom}} initial={{opacity: 0, y: 60}} animate={{opacity: 1, y: 0}} transition={{duration: .9, ease: EXPO_OUT, delay: center ? 0 : .3}}>
    <div className="iphone-frame" aria-label={`${name} screen`}><div className="dynamic-island"/><div className="phone-screen"><div className="screen-inner" data-screen={name}>{children}</div></div><div className="home-indicator"/></div>
  </motion.div>;
}

function WorldMap() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, {once: true, margin: '0px 0px -40px 0px'});
  return <div className="world-map" ref={ref}>
    <img className="map-image" src={asset('world-map.png')} alt="World map showing our connected global cargo routes"/>
    <svg className="routes" viewBox="0 0 299.037 142.509" aria-hidden="true">
      {paths.map((d,i) => <React.Fragment key={d}><motion.path d={d} fill="none" stroke="#FFDA00" strokeWidth="2.5" initial={{pathLength: 0}} animate={{pathLength: inView ? 1 : 0}} transition={{duration: 1, delay: i * .15, ease: EASE_OUT}}/><polygon points="0,-4 8,0 0,4" fill="#FFDA00"><animateMotion path={d} dur={`${3+i*.4}s`} begin={`${i*.15}s`} repeatCount="indefinite" rotate="auto"/></polygon></React.Fragment>)}
      {stops.map(([cx,cy],i) => <motion.g key={cx} style={{transformOrigin:`${cx}px ${cy}px`}} initial={{scale:0}} animate={{scale:inView ? 1 : 0}} transition={{delay:.3+i*.12}}><circle cx={cx} cy={cy} r="9.519" fill="#FFDA00"/><circle cx={cx} cy={cy} r="3.389" fill="#002A35"/></motion.g>)}
    </svg>
    {['ship','car','plane'].map((name,i) => <motion.div key={name} className={`transport ${name}`} initial={{scale:0}} animate={inView ? {scale:1} : {}} transition={{duration:.6,delay:.3+i*.2,ease:EXPO_OUT}}><motion.img src={asset(`${name}.png`)} alt={name === 'car' ? 'Road freight' : name === 'ship' ? 'Ocean freight' : 'Air freight'} animate={{y:[0,[-6,-8,-5][i],0]}} transition={{duration:[2.8,3.3,2.5][i],repeat:Infinity,ease:'easeInOut'}}/></motion.div>)}
  </div>;
}

function InfoSection() {
  return <section className="info-section flex flex-col">
    <div className="tagline"><Reveal x={-50}><h1>LOGISTICS</h1></Reveal><Reveal x={-30} delay={.12}><p>shaped by scale<br/>powered by precision</p></Reveal></div>
    <WorldMap/>
    <div className="stats flex flex-col"><Reveal className="stat flex items-center" x={-60}><strong>3M+</strong><p>tons of cargo<br/>delivered<br/>without delays</p></Reveal><Reveal className="stat second-stat flex items-center" x={60}><strong>13+</strong><p>years of trusted<br/>and reliable<br/>operations</p></Reveal></div>
  </section>;
}

function ContactCTA({onClick}: {onClick: () => void}) {
  const [hover,setHover] = useState(false);
  return <motion.button className="contact-cta" onClick={onClick} onHoverStart={()=>setHover(true)} onHoverEnd={()=>setHover(false)} whileHover={{scale:1.08,y:-2}} whileTap={{scale:.97}} initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:.7,delay:.5,ease:EXPO_OUT}}>
    <svg viewBox="0 0 434.001 68" preserveAspectRatio="none" aria-hidden="true"><path fill="#ffda00" d="M34 0H354C372 0 378 12 378 21C378 26 374 29 374 34C374 39 378 42 378 47C378 56 372 68 354 68H34C15.22 68 0 52.78 0 34S15.22 0 34 0Z"/><circle cx="400" cy="34" r="34" fill="#ffda00"/></svg>
    <span>Get in touch</span><motion.svg className="cta-arrow" viewBox="0 0 24 24" animate={{rotate:hover ? -90 : -135}} transition={{duration:.35}} aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/></motion.svg>
  </motion.button>;
}

function HeroSection({goTo}: {goTo:(target:string)=>void}) {
  const [menu,setMenu] = useState(false);
  const [ready,setReady] = useState(false);
  return <section className="hero-section">
    <nav className="navbar flex items-start justify-between"><motion.a href="#hero" className="logo" aria-label="CARGOX GROUP home" initial={{x:-24,opacity:0}} animate={{x:0,opacity:1}} transition={{duration:.8,ease:EXPO_OUT}}>CARGOX<br/><span>GROUP</span></motion.a><motion.button aria-label={menu ? 'Close menu' : 'Open menu'} aria-expanded={menu} aria-controls="mobile-menu" className="menu-button" onClick={()=>setMenu(!menu)} initial={{x:24,opacity:0}} animate={{x:0,opacity:1}} transition={{duration:.8,ease:EXPO_OUT}}>{menu ? <X size={28}/> : <Menu size={28}/>}</motion.button></nav>
    <AnimatePresence>{menu && <motion.div id="mobile-menu" className="mobile-menu flex flex-col justify-center" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onKeyDown={e=>{if(e.key==='Escape')setMenu(false)}}>{['Services','Industries','Company'].map((item,i)=><motion.button key={item} initial={{y:20,opacity:0}} animate={{y:0,opacity:1}} transition={{delay:i*.05}} onClick={()=>{setMenu(false);goTo('Info')}}>{item}</motion.button>)}</motion.div>}</AnimatePresence>
    <div className="hero-layout flex flex-col"><div className="video-area"><video src={asset('hero.mp4')} autoPlay muted loop playsInline onCanPlay={()=>setReady(true)} aria-label="Cargo logistics in motion"/><div className="video-gradient"/></div>
      <AnimatePresence>{ready && <div className="hero-content flex flex-col justify-end"><h1>{['BEYOND','BORDERS','AND LIMITS'].map((line,i)=><span className={`hero-line line-${i}`} key={line}><motion.span initial={{x:i===1 ? 400 : -400}} animate={{x:0}} transition={{duration:.85,delay:i*.13,ease:EXPO_OUT}}>{line}</motion.span></span>)}</h1><ContactCTA onClick={()=>goTo('Contact')}/></div>}</AnimatePresence>
    </div>
  </section>;
}

function ContactSection() {
  const [sent,setSent] = useState(false);
  return <section className="contact-section flex flex-col">
    <Reveal y={30}><h1>CONTACT <span>US</span></h1></Reveal>
    <Reveal y={20} delay={.1}><p className="subtitle">Complete the form and our team will contact you soon.</p></Reveal>
    <form className="contact-form flex flex-col" onSubmit={e=>{e.preventDefault();setSent(true)}}>
      {[['First Name','given-name','text'],['Last Name','family-name','text'],['E-mail','email','email']].map(([label,auto,type],i)=><Reveal key={label} y={20} delay={.15+i*.1}><motion.input aria-label={label} placeholder={label} name={auto} autoComplete={auto} type={type} required whileFocus={{scale:1.01}} onChange={()=>setSent(false)}/></Reveal>)}
      <motion.button className="send-button" type="submit" whileHover={{scale:1.03,y:-2,backgroundColor:'#ffe84d'}} whileTap={{scale:.97}}>Send</motion.button>
      {sent && <p className="form-feedback" role="status">Thank you. This preview does not send messages.</p>}
    </form>
    <div className="contact-info flex flex-col">{[['info@cargox-group.com','mailto:info@cargox-group.com'],['+380 44 234-7890','tel:+380442347890']].map(([label,href])=><motion.a key={href} href={href} whileHover={{x:4,color:'#fff'}}>{label}</motion.a>)}</div>
    <div className="footer-row flex items-center justify-between"><div className="socials flex">{[[Instagram,'Instagram','https://www.instagram.com/'],[Linkedin,'LinkedIn','https://www.linkedin.com/'],[Facebook,'Facebook','https://www.facebook.com/']].map(([Icon,label,url])=>{const SocialIcon=Icon as typeof Instagram;return <motion.a className="circle-button" key={label as string} aria-label={label as string} href={url as string} target="_blank" rel="noreferrer" whileHover={{scale:1.15,y:-3}}><SocialIcon size={22} strokeWidth={1.8}/></motion.a>})}</div><motion.button className="circle-button" aria-label="Scroll to top" whileHover={{scale:1.15,y:-3}} onClick={e=>e.currentTarget.closest('.screen-inner')?.scrollTo({top:0,behavior:'smooth'})}><ArrowUp size={23} strokeWidth={2.5}/></motion.button></div>
    <p className="copyright">(c) 2025. All rights reserved.</p>
  </section>;
}

function App() {
  const [zoom,setZoom] = useState(()=>window.innerWidth<=900 ? Math.min(1,(window.innerWidth-40)/393) : 1);
  useEffect(()=>{const resize=()=>setZoom(window.innerWidth<=900 ? Math.min(1,(window.innerWidth-40)/393) : 1);window.addEventListener('resize',resize);return()=>window.removeEventListener('resize',resize)},[]);
  const goTo=(target:string)=>{const screen=document.querySelector<HTMLElement>(`[data-screen="${target}"]`);screen?.closest('.phone-mockup')?.scrollIntoView({behavior:'smooth',block:'center'});screen?.scrollTo({top:0,behavior:'smooth'});if(target==='Contact')window.setTimeout(()=>screen?.querySelector<HTMLInputElement>('input')?.focus({preventScroll:true}),650)};
  return <main className="showcase-wrapper"><Phone name="Info" zoom={zoom}><InfoSection/></Phone><Phone name="Hero" zoom={zoom} center><HeroSection goTo={goTo}/></Phone><Phone name="Contact" zoom={zoom}><ContactSection/></Phone></main>;
}

createRoot(document.getElementById('root')!).render(<React.StrictMode><App/></React.StrictMode>);
