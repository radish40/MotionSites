import React, { useState, useRef, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { Sparkles, Download, Wand2, BookOpen, ArrowRight, Twitter, Linkedin, Instagram, Menu, Plus, X, ArrowUpRight, Check } from 'lucide-react';
import './style.css';
const base=import.meta.env.BASE_URL;
const categories=['Artistic Gallery','AI Generation','3D Structures'];
const details={
 'Artistic Gallery':{label:'A STUDY IN NATURE',title:'Where imagination takes root.',body:'Discover expressive botanical forms, unexpected silhouettes, and a new perspective on the natural world.'},
 'AI Generation':{label:'FROM THOUGHT TO FORM',title:'Let your ideas bloom.',body:'Explore the possibilities of AI-powered floral design. Shape an idea into an expressive botanical composition.'},
 '3D Structures':{label:'NATURE, REIMAGINED',title:'A new dimension of growth.',body:'Explore sculptural plant forms and intricate structures inspired by the quiet intelligence of nature.'},
 'Processing':{label:'THE CREATIVE PROCESS',title:'An idea, unfolding.',body:'From a spark of inspiration to an intricate botanical form. Discover the process behind Bloom’s generative designs.'},
 'Growth Archive':{label:'COLLECTED INSPIRATION',title:'Every bloom tells a story.',body:'A growing collection of botanical explorations, sculptural studies, and moments of creative discovery.'},
 'Advanced Plant Sculpting':{label:'FORM MEETS POSSIBILITY',title:'Sculpt something extraordinary.',body:'Explore organic shapes, layered petals, and imaginative plant structures. A new way to think about floral design.'},
 'Enter our ecosystem':{label:'GROW TOGETHER',title:'Creativity is a living thing.',body:'Enter a world of shared inspiration. Explore the gallery, discover new ideas, and find your own creative direction.'}
};
function App(){
 const [menu,setMenu]=useState(false),[active,setActive]=useState(null),[email,setEmail]=useState(''),[submitted,setSubmitted]=useState(false);
 const dialog=useRef(null),menuBox=useRef(null),video=useRef(null);
 useEffect(()=>{if(active)dialog.current?.showModal();else dialog.current?.close();},[active]);
 useEffect(()=>{const outside=e=>{if(menuBox.current&&!menuBox.current.contains(e.target))setMenu(false)};const key=e=>{if(e.key==='Escape')setMenu(false)};document.addEventListener('pointerdown',outside);document.addEventListener('keydown',key);return()=>{document.removeEventListener('pointerdown',outside);document.removeEventListener('keydown',key)}},[]);
 useEffect(()=>{const media=matchMedia('(prefers-reduced-motion: reduce)');if(media.matches)video.current?.pause()},[]);
 const open=name=>{setMenu(false);setActive(name)};
 return <>
 <video ref={video} className="background-video" autoPlay loop muted playsInline poster={`${base}assets/poster.png`} aria-hidden="true"><source src={`${base}assets/bloom-background.mp4`} type="video/mp4"/></video>
 <div className="background-shade"/>
 <main className="layout">
  <section className="left-panel" aria-label="Welcome to Bloom">
   <div className="panel-surface liquid-glass-strong"/>
   <nav className="navigation" aria-label="Main navigation">
    <a className="brand" href={base} aria-label="Bloom home"><img src={`${base}logo.png`} width="32" height="32" alt=""/><span>bloom</span></a>
    <div className="menu-wrap" ref={menuBox}>
     <button className="menu-button liquid-glass" onClick={()=>setMenu(!menu)} aria-expanded={menu} aria-controls="main-menu">Menu {menu?<X size={16}/>:<Menu size={16}/>}</button>
     {menu&&<div id="main-menu" className="menu-dropdown liquid-glass-strong">{categories.map(name=><button key={name} onClick={()=>open(name)}>{name}<ArrowUpRight size={15}/></button>)}</div>}
    </div>
   </nav>
   <div className="hero">
    <img className="hero-logo" src={`${base}logo.png`} width="80" height="80" alt=""/>
    <h1>Innovating the<br/><em>spirit of bloom AI</em></h1>
    <button className="explore liquid-glass-strong" onClick={()=>open('Artistic Gallery')}>Explore Now<span className="download-circle"><Download size={16}/></span></button>
    <div className="categories" aria-label="Explore Bloom">{categories.map(name=><button className="category liquid-glass" onClick={()=>open(name)} key={name}>{name}</button>)}</div>
   </div>
   <footer className="quote">
    <p className="eyebrow">VISIONARY DESIGN</p>
    <p className="quote-text">We imagined a realm<br/><em>with no ending.</em></p>
    <p className="author"><span/>MARCUS AURELIO<span/></p>
   </footer>
  </section>
  <section className="right-panel" aria-label="Discover Bloom">
   <div className="topbar">
    <div className="socials liquid-glass">
     <a href="https://twitter.com/" target="_blank" rel="noreferrer" aria-label="Twitter"><Twitter size={17}/></a>
     <a href="https://linkedin.com/" target="_blank" rel="noreferrer" aria-label="LinkedIn"><Linkedin size={17}/></a>
     <a href="https://instagram.com/" target="_blank" rel="noreferrer" aria-label="Instagram"><Instagram size={17}/></a>
     <span className="social-divider"/><ArrowRight size={17} className="social-arrow"/>
    </div>
    <div className="account-actions"><button className="account liquid-glass" onClick={()=>{setSubmitted(false);open('Account')}}>Account</button><button className="sparkles liquid-glass" aria-label="Discover AI generation" onClick={()=>open('AI Generation')}><Sparkles size={18}/></button></div>
   </div>
   <button className="community liquid-glass" onClick={()=>open('Enter our ecosystem')}>
    <span className="community-top"><span className="community-symbol">✳</span><ArrowUpRight size={15}/></span>
    <span className="community-title">Enter our ecosystem</span>
    <span className="community-description">A space for ideas to take root.<br/>Create, connect, and grow.</span>
    <span className="community-bottom"><span className="mini-avatars"><i>M</i><i>A</i><i>J</i></span><span>A growing community</span></span>
   </button>
   <div className="features liquid-glass">
    <div className="feature-grid">
     <button className="feature liquid-glass" onClick={()=>open('Processing')}><span className="feature-top"><span className="icon-circle"><Wand2 size={17}/></span><ArrowUpRight size={15}/></span><span className="feature-title">Processing</span><span className="feature-description">From a spark to something<br/>extraordinary.</span></button>
     <button className="feature liquid-glass" onClick={()=>open('Growth Archive')}><span className="feature-top"><span className="icon-circle"><BookOpen size={17}/></span><ArrowUpRight size={15}/></span><span className="feature-title">Growth Archive</span><span className="feature-description">An ever-evolving collection<br/>of natural possibilities.</span></button>
    </div>
    <button className="sculpting liquid-glass" onClick={()=>open('Advanced Plant Sculpting')}><img src={`${base}assets/hero-flowers.png`} width="96" height="64" alt="Sculptural white flower with layered petals"/><span className="sculpting-text"><span>Advanced Plant Sculpting</span><small>Where nature meets imagination.</small></span><span className="plus"><Plus size={19}/></span></button>
   </div>
  </section>
 </main>
 <dialog ref={dialog} className="detail-dialog liquid-glass-strong" onCancel={()=>setActive(null)} onClick={e=>{if(e.target===dialog.current){const r=dialog.current.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)setActive(null)}}}>
  <button className="close-dialog liquid-glass" aria-label="Close dialog" onClick={()=>setActive(null)}><X size={20}/></button>
  {active==='Account'?<div className="account-content"><img src={`${base}logo.png`} alt="" width="48" height="48"/><p className="eyebrow">YOUR CREATIVE SPACE</p><h2>A place to <em>grow.</em></h2>{submitted?<div role="status"><Check size={28}/><p>You’re on the list.</p><p className="dialog-description">Your interest has been saved for this visit. Bloom accounts are coming soon.</p></div>:<form onSubmit={e=>{e.preventDefault();setSubmitted(true)}}><label htmlFor="email">Email address</label><input id="email" type="email" autoComplete="email" placeholder="you@example.com" value={email} onChange={e=>setEmail(e.target.value)} required/><button className="dialog-action liquid-glass" type="submit">Join the waitlist<ArrowRight size={17}/></button><p className="form-note">Preview only. Your email stays in this browser and is not sent.</p></form>}</div>:active&&<><img className="detail-flower" src={`${base}assets/hero-flowers.png`} alt="Layered botanical sculpture"/><p className="eyebrow">{details[active]?.label}</p><h2>{details[active]?.title}</h2><p className="dialog-description">{details[active]?.body}</p><div className="dialog-tabs">{categories.map(name=><button className={`liquid-glass ${name===active?'selected':''}`} onClick={()=>open(name)} key={name}>{name}</button>)}</div></>}
 </dialog>
 </>;
}

createRoot(document.getElementById('root')).render(<App/>);
