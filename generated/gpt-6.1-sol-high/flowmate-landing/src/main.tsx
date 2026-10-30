import React, {useEffect, useRef, useState} from 'react'
import ReactDOM from 'react-dom/client'
import {AnimatePresence, motion, useInView, useReducedMotion} from 'framer-motion'
import {ArrowUp, ArrowUpRight, ChevronLeft, ChevronRight, Paperclip, Play, Pause, X, Wrench, Check, Menu} from 'lucide-react'
import './styles.css'

const asset=(name:string)=>`${import.meta.env.BASE_URL}assets/${name}`
const sections=['Home','Video','Features','Cards']
export function TextFade({children,className='',delay=0,direction='up'}:{children:React.ReactNode,className?:string,delay?:number,direction?:'up'|'down'}){
 const reduced=useReducedMotion()
 return <motion.div className={className} initial={reduced?false:'hidden'} whileInView="visible" viewport={{once:true,amount:.2}} variants={{hidden:{opacity:0,y:direction==='up'?18:-18},visible:{opacity:1,y:0,transition:{type:'spring',stiffness:90,damping:20,delay,staggerChildren:.15}}}}>{children}</motion.div>
}
const features=[
 {title:'Research this company (FlowMate)',description:'Execute investor-grade business analysis: generate detailed spreadsheets, gather web intel, compare rivals, and build team dossiers.',icons:['tool']},
 {title:"Check the dev team's progress",description:"View a quick overview of your developer squad's activity, goals, and blockers.",icons:['linear','slack']},
 {title:'Build my CV from available information',description:'Generate a shareable PDF curriculum using stored facts and web sources, excluding any private contact info.',icons:['tool']},
 {title:'Turn this into retro pixels',description:'Transform any photo into vintage pixelated graphics with custom resolution.',icons:[]},
 {title:'Track Industry Sites and Send Weekly Digest Each Monday',description:'Watch leading tech and development sources for fresh content then deliver Monday briefings with main insights and URLs.',icons:['tool']},
 {title:'Morning schedule digest',description:'Every AM, outline your agenda with important background and recommended preparation.',icons:['gmail','calendar']}
]
const cards=[
 {label:'For Everyone',text:'Unleash your creative vision',image:'card-1.webp'},
 {label:'For Teams',text:'Smart helper supporting each teammate daily',image:'card-2.webp'},
 {label:'For Enterprises',text:'Elevate your whole organization using business AI',image:'card-3.webp'},
 {label:'Platform',text:'Enhanced with FlowMate',image:'card-4.webp'},
 {label:'Security',text:'Creating trusted and helpful AI',image:'card-5.webp'}
]
export function AppIcon({name}:{name:string}){
 return <span className={`app-icon ${name}`} aria-label={name==='tool'?'FlowMate tools':name}>{name==='tool'?<Wrench size={18}/>:name==='linear'?<svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 7.5 16.5 21A10 10 0 0 1 3 7.5Zm2-3L19.5 19 18 20.2 3.8 6 5 4.5Zm2-1.3L20.8 17l.8-2.3L9.3 2.4 7 3.2ZM12 2l10 10A10 10 0 0 0 12 2Z"/></svg>:name==='slack'?<svg viewBox="0 0 24 24"><path d="M9 2v9M2 9h9" stroke="#36c5f0" strokeWidth="4" strokeLinecap="round"/><path d="M22 9h-9M15 2v9" stroke="#2eb67d" strokeWidth="4" strokeLinecap="round"/><path d="M15 22v-9M22 15h-9" stroke="#ecb22e" strokeWidth="4" strokeLinecap="round"/><path d="M2 15h9M9 22v-9" stroke="#e01e5a" strokeWidth="4" strokeLinecap="round"/></svg>:name==='gmail'?<svg viewBox="0 0 24 24" fill="none" strokeWidth="3"><path d="M3 20V5l9 7 9-7v15" stroke="#4285f4"/><path d="m3 5 9 7 9-7" stroke="#ea4335"/><path d="M21 8v12" stroke="#34a853"/><path d="M3 8v12" stroke="#fbbc04"/></svg>:<svg viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="3" fill="#4285f4"/><path d="M5 6h14v13H5z" fill="white"/><text x="12" y="16" textAnchor="middle" fontSize="10" fill="#4285f4" fontFamily="Arial">31</text><path d="M17 22h5v-5" fill="#34a853"/></svg>}</span>
}
export function App(){
 const [active,setActive]=useState('Home'), [mobileMenu,setMobileMenu]=useState(false)
 const [slide,setSlide]=useState(0),[direction,setDirection]=useState(1),[carouselPaused,setCarouselPaused]=useState(false)
 const [modal,setModal]=useState<string|null>(null),[submitted,setSubmitted]=useState(false)
 const [playing,setPlaying]=useState(true),[typed,setTyped]=useState('')
 const video=useRef<HTMLVideoElement>(null),videoSection=useRef<HTMLElement>(null),dialogRef=useRef<HTMLDialogElement>(null)
 const videoVisible=useInView(videoSection,{amount:.3,once:true}),reduced=useReducedMotion()
 const phrase='Daily check rival companies and ping me on messenger'
 useEffect(()=>{const observer=new IntersectionObserver(entries=>{for(const entry of entries)if(entry.isIntersecting)setActive(entry.target.id.charAt(0).toUpperCase()+entry.target.id.slice(1))},{rootMargin:'-18% 0px -55% 0px',threshold:0});sections.forEach(s=>{const el=document.getElementById(s.toLowerCase());if(el)observer.observe(el)});return ()=>observer.disconnect()},[])
 useEffect(()=>{if(!videoVisible)return;if(reduced){setTyped(phrase);return}let index=0;const id=setInterval(()=>{index++;setTyped(phrase.slice(0,index));if(index>=phrase.length)clearInterval(id)},50);return ()=>clearInterval(id)},[videoVisible,reduced])
 useEffect(()=>{if(carouselPaused||reduced)return;const id=setInterval(()=>{setDirection(1);setSlide(s=>(s+1)%cards.length)},4000);return ()=>clearInterval(id)},[carouselPaused,reduced])
 useEffect(()=>{if(modal){dialogRef.current?.showModal();document.body.style.overflow='hidden'}else{dialogRef.current?.close();document.body.style.overflow=''}return ()=>{document.body.style.overflow=''}},[modal])
 function go(name:string){setActive(name);setMobileMenu(false)}
 function open(name:string){setSubmitted(false);setModal(name)}
 function move(delta:number){setDirection(delta);setSlide(s=>(s+delta+cards.length)%cards.length)}
 return <>
  <aside className="sidebar hidden lg:flex">
   <a className="sidebar-logo" href="#home" onClick={()=>go('Home')} aria-label="FlowMate home"><img src={asset('logo.webp')} alt="FlowMate"/></a>
   <div className="sidebar-caption">YOUR NEXT CHAPTER</div>
   <nav aria-label="Section navigation">{sections.map((name,i)=><a key={name} href={`#${name.toLowerCase()}`} onClick={()=>go(name)} className={active===name?'active':''}><span className="nav-number">0{i+1}</span>{name}<ArrowUpRight size={15}/></a>)}</nav>
   <div className="sidebar-bottom"><span className="status-dot"/> Less busywork.<br/><span className="sidebar-bottom-line">More possibility.</span><div className="sidebar-copyright">© {new Date().getFullYear()} FlowMate</div></div>
  </aside>
  <header className="navbar fixed left-0 lg:left-[240px] top-0 right-0 z-40 bg-[#fefffc]/90 backdrop-blur-sm">
   <a href="#home" className="brand" onClick={()=>go('Home')}>FlowMate<span className="brand-mark">✳</span></a>
   <nav className="top-links" aria-label="Main navigation"><button className="text-link hidden md:block" onClick={()=>open('Pricing')}>Pricing</button><button className="text-link hidden md:block" onClick={()=>open('Community')}>Community</button><button className="pill login" onClick={()=>open('Log in')}>Log in</button><button className="pill signup" onClick={()=>open('Sign up')}>Sign up <ArrowUpRight size={14}/></button><button className="menu-button lg:hidden" aria-label="Toggle section navigation" aria-expanded={mobileMenu} onClick={()=>setMobileMenu(!mobileMenu)}>{mobileMenu?<X size={20}/>:<Menu size={20}/>}</button></nav>
   {mobileMenu&&<nav className="mobile-nav" aria-label="Mobile sections">{sections.map(name=><a key={name} href={`#${name.toLowerCase()}`} onClick={()=>go(name)}>{name}</a>)}<button onClick={()=>{setMobileMenu(false);open('Pricing')}}>Pricing</button><button onClick={()=>{setMobileMenu(false);open('Community')}}>Community</button></nav>}
  </header>
  <main className="lg:ml-[240px]">
   <section id="home" className="hero">
    <TextFade><div className="eyebrow"><span className="status-dot"/> GOOD WORK. LESS WORK.</div></TextFade>
    <TextFade delay={.15}><h1>Transform your workflow using plain English</h1></TextFade>
    <TextFade delay={.3}><p className="hero-copy">FlowMate connects to your current apps, builds smart workflows, and manages operations. Powering the platforms you already know and trust.</p></TextFade>
    <TextFade delay={.45}><a className="intro-link" href="#video" onClick={()=>go('Video')}><span className="intro-icon"><svg viewBox="0 0 24 24" fill="none"><path d="M7 5h12v12M19 5 5 19" stroke="currentColor" strokeWidth="1.7"/></svg></span>View our intro video</a></TextFade>
    <div className="hero-note"><span>From a thought to a workflow.</span><span>Just like that. <span aria-hidden="true">↘</span></span></div>
   </section>
   <section id="video" className="video-section" ref={videoSection} aria-label="FlowMate introduction">
    <motion.div className="video-wrap" initial={reduced?false:{opacity:0,y:18}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{type:'spring',stiffness:85,damping:20}}>
     <video ref={video} src={asset('intro.mp4')} autoPlay={!reduced} muted loop playsInline preload="auto" onPlay={()=>setPlaying(true)} onPause={()=>setPlaying(false)} aria-label="FlowMate atmospheric introduction video"/>
     <div className="video-tint"/>
     <div className="video-caption"><span className="tiny-cross">✳</span> YOUR WORDS. IN MOTION.</div>
     <div className="glass-card"><div className="glass-prompt">{typed}<span className="type-cursor" aria-hidden="true"/></div><div className="glass-controls"><Paperclip size={21} strokeWidth={1.5}/><button aria-label="Try this workflow" onClick={()=>open('Try this workflow')}><ArrowUp size={22}/></button></div></div>
     <div className="video-bottom"><span>Big ideas start with a simple ask.</span><button className="video-control" aria-label={playing?'Pause video':'Play video'} onClick={()=>{if(video.current?.paused)video.current.play();else video.current?.pause()}}>{playing?<Pause size={15}/>:<Play size={15}/>}</button></div>
    </motion.div>
   </section>
   <section id="features" className="features-section border-t border-[#e8e8e8]">
    <TextFade><div className="section-kicker"><span>01 / POSSIBILITIES</span><span>MADE FOR THE WAY YOU WORK</span></div><h2>Discover what FlowMate can accomplish for your team</h2></TextFade>
    <div className="features-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">{features.map((feature,i)=><TextFade key={feature.title} delay={(i%3)*.08} className="feature-card"><span className="feature-index">0{i+1}</span><h3>{feature.title}</h3><p>{feature.description}</p><div className="feature-apps">{feature.icons.map(icon=><AppIcon key={icon} name={icon}/>)}</div></TextFade>)}</div>
   </section>
   <section id="cards" className="cards-section border-t border-[#e8e8e8]">
    <TextFade><div className="section-kicker"><span>02 / A LITTLE MORE POSSIBLE</span><span>BUILT AROUND YOU</span></div><div className="carousel-heading"><h2>Your ideas.<br/>A new kind of momentum.</h2><div className="carousel-controls"><button aria-label={carouselPaused?'Resume carousel':'Pause carousel'} onClick={()=>setCarouselPaused(!carouselPaused)}>{carouselPaused?<Play size={17}/>:<Pause size={17}/>}</button><button aria-label="Previous cards" onClick={()=>move(-1)}><ChevronLeft size={21}/></button><button aria-label="Next cards" onClick={()=>move(1)}><ChevronRight size={21}/></button></div></div></TextFade>
    <div className="carousel-viewport" aria-roledescription="carousel" aria-label="Who FlowMate is for" onMouseEnter={()=>setCarouselPaused(true)} onMouseLeave={()=>setCarouselPaused(false)} onFocusCapture={()=>setCarouselPaused(true)}>
     <AnimatePresence initial={false} custom={direction} mode="popLayout"><motion.div key={slide} className="carousel-track" custom={direction} initial={{x:reduced?0:direction*70,opacity:0,scale:reduced?1:.95}} animate={{x:0,opacity:1,scale:1}} exit={{x:reduced?0:direction*-70,opacity:0,scale:reduced?1:.95}} transition={{duration:reduced?0:.7,ease:[.32,.72,0,1]}}>{[0,1,2].map(offset=>{const card=cards[(slide+offset)%cards.length];return <article className="story-card" key={card.label}><img src={asset(card.image)} alt={['Pink and coral abstract brushstrokes','A stone staircase and doorway above clouds','Colorful swirling abstract painting','A lamplit path in a blue painted forest','An expressive artwork for the FlowMate security story'][(slide+offset)%5]}/><div className="story-shade"/><span className="story-label">{card.label}</span><div className="story-copy"><h3>{card.text}</h3><button aria-label={`Explore ${card.label}`} onClick={()=>open(card.label)}><ArrowUpRight size={22}/></button></div></article>})}</motion.div></AnimatePresence>
    </div>
    <div className="carousel-foot"><span>Less friction. More flow.</span><div className="carousel-dots">{cards.map((card,i)=><button key={card.label} className={slide===i?'selected':''} aria-label={`Show ${card.label}`} aria-current={slide===i?'true':undefined} onClick={()=>{setDirection(i>slide?1:-1);setSlide(i)}}/>)}</div><span>0{slide+1} <span className="muted">/ 05</span></span></div>
   </section>
   <footer><a className="brand" href="#home" onClick={()=>go('Home')}>FlowMate<span className="brand-mark">✳</span></a><span>A little less doing. A lot more possibility.</span><a href="#home">Back to top <ArrowUp size={14}/></a></footer>
  </main>
  <dialog ref={dialogRef} className="dialog" onCancel={()=>setModal(null)} onClick={e=>{if(e.target===e.currentTarget)setModal(null)}}><button className="dialog-close" aria-label="Close dialog" onClick={()=>setModal(null)}><X size={22}/></button><span className="dialog-eyebrow">FLOWMATE</span><h2>{submitted?'You’re on the list.':modal==='Log in'?'Welcome back.':modal==='Pricing'?'A plan for your flow.':modal==='Community'?'Good work starts together.':'Let’s get things flowing.'}</h2>{submitted?<p className="success-message"><Check size={22}/> Thanks for your interest. Your demo request has been saved for this visit.</p>:<><p>{modal==='Log in'?'This preview isn’t connected to an account service. Leave your email to request access.':modal==='Pricing'?'FlowMate pricing is coming soon. Request early access to hear about plans for you and your team.':modal==='Community'?'Meet the people making room for better work. Request an invitation to the FlowMate community.':modal==='Try this workflow'?`Start with “${phrase}”. Request early access to bring your own workflow to life.`:'Make room for what matters. Request early access to FlowMate.'}</p><form onSubmit={e=>{e.preventDefault();setSubmitted(true)}}><label htmlFor="email">Your email</label><input id="email" name="email" type="email" autoComplete="email" required placeholder="you@company.com"/><button className="pill signup" type="submit">{modal==='Community'?'Request an invitation':'Request access'}<ArrowUpRight size={17}/></button><small>Interactive preview — no information is sent to a server.</small></form></>}</dialog>
 </>
}
ReactDOM.createRoot(document.getElementById('root')!).render(<React.StrictMode><App/></React.StrictMode>)
