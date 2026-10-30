import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { Snowflake, Maximize, Zap, ArrowLeft, ArrowRight } from 'lucide-react';
import './style.css';
const asset = name => `${import.meta.env.BASE_URL}assets/${name}`;
const enter={hidden:{opacity:0,y:24},visible:{opacity:1,y:0}};
function Reveal({children,className='',delay=0}){return <motion.div className={className} variants={enter} initial="hidden" animate="visible" transition={{duration:.85,delay,ease:[.22,1,.36,1]}}>{children}</motion.div>}
function Background({project,reduced}){return <div className={`background ${project?'project-background':''}`} aria-hidden="true"><video autoPlay={!reduced} muted playsInline loop preload="auto" src={asset(project?'project.mp4':'hero.mp4')}/><div className="vignette"/><div className="grain"/></div>}
function App(){
 const [page,setPage]=useState(location.hash==='#project'?'project':'home');
 const [expanded,setExpanded]=useState(false);
 const reduced=useReducedMotion();
 useEffect(()=>{const sync=()=>{setPage(location.hash==='#project'?'project':'home');setExpanded(false);window.scrollTo(0,0)};window.addEventListener('hashchange',sync);return()=>window.removeEventListener('hashchange',sync)},[]);
 function navigate(next){location.hash=next==='project'?'project':'home';}
 return <AnimatePresence mode="wait"><motion.main key={page} className={`page ${page}`} initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={{duration:reduced?0:.45}}>
 <Background project={page==='project'} reduced={reduced}/>
 {page==='home'?<>
 <header className="topbar"><a href="#home" className="brand" aria-label="Viktor-O home"><Snowflake size={27} strokeWidth={1.2}/><span>VIKTOR—O<span className="brand-sub">INDEPENDENT DIGITAL ARCHITECT</span></span></a><nav className="topnav" aria-label="Project navigation"><span className="counter">1<span>/01</span></span><span className="progress"><i/></span><button onClick={()=>navigate('project')} className="text-button">Next Project <ArrowRight size={16}/></button></nav></header>
 <div className="hero-content">
 <Reveal className="hero-copy" delay={.2}><p className="eyebrow"><span className="status-dot"/> ENGINEERING THE NEXT EXPERIENCE</p><h1>Viktor-O<span className="title-slash">//</span><span className="title-small">MODERN<br/>ARCHITECT</span></h1><p className="intro">I build digital systems that feel as good as they perform. Precise by design. Limitless by nature.</p><div className="signature-line"><span>DEVELOPMENT</span><span className="tiny-cross">+</span><span>DESIGN</span><span className="tiny-cross">+</span><span>DIRECTION</span></div></Reveal>
 <Reveal className="specs" delay={.55}><p className="eyebrow specs-heading"><Maximize size={13}/> SYSTEM SPECIFICATIONS</p>{[['Stack','React / TypeScript'],['Logic','Clean & modular'],['Uptime','99.9%'],['Scale','Infinite possibilities']].map(([label,value],i)=><div className="spec" key={label}><span><small>0{i+1}</small>{label}</span><strong>{value}</strong></div>)}<p className="spec-foot"><span className="status-dot"/> ALL SYSTEMS OPERATIONAL</p></Reveal>
 </div>
 <footer className="hero-bottom"><Reveal delay={.7}><button className="project-card" onClick={()=>navigate('project')}><span className="thumb"><img src={asset('tech.jpg')} alt="React Engine project texture"/><Maximize size={17}/></span><span className="card-copy"><span className="eyebrow">SELECTED WORK / 001</span><strong>VK-01: React Engine</strong><span className="view-link">View Project <ArrowRight size={14}/></span></span><ArrowRight className="card-arrow" size={23} strokeWidth={1}/></button></Reveal><Reveal className="bottom-right" delay={.8}><p className="bottom-caption">BUILT WITH INTENT. MADE TO EVOLVE.</p><div className="tags">{['TS/JS','V1','Full-Stack','Cloud-Ready'].map(t=><span key={t}>{t==='Cloud-Ready'&&<Zap size={11}/>} {t}</span>)}</div></Reveal></footer>
 <div className="edge-label">PORTFOLIO — VOL. 01 / 2026</div>
 </>:<>
 <header className="topbar"><button onClick={()=>navigate('home')} className="text-button back"><ArrowLeft size={17}/> Back Home</button><span className="project-index">SELECTED PROJECT <span>01 / 01</span></span><Snowflake className="project-mark" size={27} strokeWidth={1.2}/></header>
 <div className="project-main"><Reveal delay={.15}><p className="eyebrow project-kicker">VK—01 / DIGITAL SYSTEMS</p><h1 className="project-title">PROJECTY<br/><span>ENGINE</span><span className="title-star">✳</span></h1></Reveal><Reveal className="project-description" delay={.4}><span className="eyebrow">A SYSTEM WITHOUT LIMITS</span><p>A flagship React engine.<br/>Engineered for speed.<br/>Designed for what comes next.</p><p className="project-summary">Where modular architecture meets an uncompromising attention to detail. A foundation for exceptional digital experiences.</p><button className="read-more" aria-expanded={expanded} aria-controls="project-more" onClick={()=>setExpanded(!expanded)}>{expanded?'Read Less':'Read More'}<span>{expanded?'−':'+'}</span></button><AnimatePresence>{expanded&&<motion.p id="project-more" className="expanded-copy" initial={{height:0,opacity:0}} animate={{height:'auto',opacity:1}} exit={{height:0,opacity:0}}>Reusable TypeScript components, purposeful motion, and a responsive interface form one cohesive system. Built to grow from the first interaction to the next big idea.</motion.p>}</AnimatePresence></Reveal></div>
 <footer className="project-bottom"><Reveal className="info-block" delay={.6}><h2>01 // CORE ARCHITECTURE</h2><p>REACT / TYPESCRIPT<br/>MODULAR BY DESIGN</p><span><Maximize size={14}/> STRUCTURE MEETS POSSIBILITY</span></Reveal><Reveal className="info-block" delay={.7}><h2>02 // PERFORMANCE METRICS</h2><p>OPTIMIZED AT EVERY LAYER<br/>BUILT FOR REAL-WORLD SCALE</p><span><Zap size={14}/> EVERY MILLISECOND MATTERS</span></Reveal><Reveal className="project-meta" delay={.8}><div className="arrows"><button aria-label="Previous page: home" onClick={()=>navigate('home')}><ArrowLeft size={22}/></button><button aria-label="Next page: home" onClick={()=>navigate('home')}><ArrowRight size={22}/></button></div><div className="meta-row"><span>DATE <b>2026</b></span><span>PROJECT <b>VK—01</b></span></div><p>A study in precision & possibility.</p></Reveal></footer>
 </>}
 </motion.main></AnimatePresence>
}

createRoot(document.getElementById('root')).render(<React.StrictMode><App/></React.StrictMode>);
