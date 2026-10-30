import React, {useEffect, useRef, useState} from 'react';
import {createRoot} from 'react-dom/client';
import {ArrowUpRight, Phone, X, Menu, Pause, Play} from 'lucide-react';
import './styles.css';

function Brand(){return <a className="brand" href="#home" aria-label="targo home"><svg viewBox="0 0 145 44" aria-hidden="true"><path fill="currentColor" transform="translate(0 3) scale(.85)" d="M14 2h24L27 13H3L14 2ZM12 16h15L15 28H0l12-12ZM19 27h14L22 38H8l11-11Z"/><text x="43" y="35" fill="currentColor" fontFamily="Rubik, sans-serif" fontSize="39" fontWeight="600" letterSpacing="-2.3">targo</text></svg></a>}
function App(){
 const [panel,setPanel]=useState(null),[menu,setMenu]=useState(false),[paused,setPaused]=useState(false);
 const video=useRef(null),dialog=useRef(null);
 useEffect(()=>{if(panel)dialog.current?.showModal();else dialog.current?.close()},[panel]);
 const open=(name)=>{setMenu(false);setPanel(name)};
 const toggleVideo=()=>{if(video.current.paused)video.current.play().then(()=>setPaused(false)).catch(()=>setPaused(true));else {video.current.pause();setPaused(true)}};
 return <main id="home" className="hero relative isolate flex min-h-svh flex-col overflow-hidden bg-black text-white">
  <video ref={video} className="hero-video absolute inset-0 -z-10 h-full w-full object-cover" src={`${import.meta.env.BASE_URL}assets/targo-motion.mp4`} autoPlay muted loop playsInline preload="auto" onPause={()=>setPaused(true)} onPlay={()=>setPaused(false)} aria-label="Red racing car speeding through a dark illuminated tunnel" />
  <header className="site-header relative flex items-center justify-between">
   <Brand/>
   <nav className="desktop-nav flex items-center" aria-label="Main navigation"><a className="nav-link active" href="#home" aria-current="page">Home</a><button className="nav-link" onClick={()=>open('about')}>About</button><button className="nav-link" onClick={()=>open('contact')}>Contact Us</button></nav>
   <button className="cut-button header-contact bg-brand" onClick={()=>open('contact')}>Contact Us <ArrowUpRight size={15}/></button>
   <button className="menu-toggle" aria-label={menu?'Close navigation':'Open navigation'} aria-expanded={menu} onClick={()=>setMenu(!menu)}>{menu?<X size={23}/>:<Menu size={23}/>}</button>
   {menu&&<nav className="mobile-nav" aria-label="Mobile navigation"><a href="#home" onClick={()=>setMenu(false)}>Home</a><button onClick={()=>open('about')}>About</button><button onClick={()=>open('contact')}>Contact Us</button></nav>}
  </header>
  <section className="hero-copy" aria-labelledby="hero-title">
   <h1 id="hero-title">Swift and Simple <br/>Transport</h1>
   <button className="cut-button start-button bg-brand" onClick={()=>open('contact')}>Get Started <ArrowUpRight size={19} strokeWidth={1.7}/></button>
  </section>
  <div className="hero-bottom flex items-end justify-between">
   <aside className="consultation-card" aria-label="Free consultation">
    <div className="card-top"><span className="status-dot"/><span>LET’S MOVE FORWARD</span><ArrowUpRight size={17} strokeWidth={1.4}/></div>
    <h2>Book a Free<br/>Consultation</h2>
    <button className="cut-button call-button" onClick={()=>open('contact')}><Phone size={16} strokeWidth={1.8}/><span>Book a Call</span><ArrowUpRight size={17} strokeWidth={1.6}/></button>
   </aside>
   <button className="video-control" onClick={toggleVideo} aria-label={paused?'Play background video':'Pause background video'}>{paused?<Play size={15} fill="currentColor"/>:<Pause size={15} fill="currentColor"/>}</button>
  </div>
  <dialog ref={dialog} className="info-dialog" onCancel={()=>setPanel(null)} onClick={e=>{if(e.target===dialog.current)setPanel(null)}} onClose={()=>setPanel(null)}>
   <button className="dialog-close" aria-label="Close dialog" onClick={()=>setPanel(null)}><X size={22}/></button>
   {panel==='about'?<><p className="eyebrow">ABOUT TARGO</p><h2>Built to move<br/>you forward.</h2><p>Swift and simple transport. Start a conversation about your logistics needs with targo.</p><button className="cut-button bg-brand" onClick={()=>setPanel('contact')}>Let’s talk <ArrowUpRight size={18}/></button></>:panel==='contact'?<><p className="eyebrow">LET’S GET MOVING</p><h2>Book a Free<br/>Consultation</h2><p>Tell us what you need to move. Prepare your enquiry below.</p><form onSubmit={e=>{e.preventDefault();setPanel('prepared')}}><label>Your name<input name="name" autoComplete="name" required placeholder="Full name"/></label><label>Email address<input type="email" name="email" autoComplete="email" required placeholder="you@company.com"/></label><label>How can we help?<textarea name="message" required placeholder="Tell us about your transport needs" rows="3"/></label><p className="form-note">Demo enquiry form. No information is sent or stored.</p><button className="cut-button bg-brand" type="submit">Prepare enquiry <ArrowUpRight size={18}/></button></form></>:null}
   {panel==='prepared'&&<div className="confirmation" role="status"><p className="eyebrow">ENQUIRY PREPARED</p><h2>You’re ready<br/>to get moving.</h2><p>This demonstration does not send enquiries. Your details have not been stored.</p><button className="cut-button bg-brand" onClick={()=>setPanel(null)}>Back to targo <ArrowUpRight size={18}/></button></div>}
  </dialog>
 </main>
}
createRoot(document.getElementById('root')).render(<App/>);
