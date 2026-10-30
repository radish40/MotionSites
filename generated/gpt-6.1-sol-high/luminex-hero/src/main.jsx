import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import Hls from 'hls.js/light';
import './style.css';

const base = import.meta.env.BASE_URL;
function Arrow({diagonal=false}) {return <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d={diagonal?'M6 18 18 6M6 6h12v12':'M4 12h15m-6-6 6 6-6 6'} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
function Mark(){return <svg className="brand-mark" viewBox="0 0 40 40" fill="none" aria-hidden="true"><path d="M20 2v36M2 20h36M7.3 7.3l25.4 25.4M7.3 32.7 32.7 7.3" stroke="currentColor" strokeWidth="1.6"/><circle cx="20" cy="20" r="10" stroke="currentColor" strokeWidth="1.6"/></svg>}
function App(){
 const video=useRef(null), dialog=useRef(null), lastFocus=useRef(null);
 const [playing,setPlaying]=useState(false),[menu,setMenu]=useState(false),[panel,setPanel]=useState(null),[progress,setProgress]=useState(0),[failed,setFailed]=useState(false);
 useEffect(()=>{
  const el=video.current; const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  let hls;
  const start=()=>{if(!reduced)el.play().catch(()=>setPlaying(false));};
  if(el.canPlayType('application/vnd.apple.mpegurl')){el.src=base+'media/hls/coast.m3u8';el.addEventListener('loadedmetadata',start,{once:true});}
  else if(Hls.isSupported()) {hls=new Hls({maxBufferLength:12});hls.loadSource(base+'media/hls/coast.m3u8');hls.attachMedia(el);hls.on(Hls.Events.MANIFEST_PARSED,start);hls.on(Hls.Events.ERROR,(_,data)=>{if(data.fatal){hls.destroy();el.src=base+'media/coast-source.mp4';start();}});}
  else {el.src=base+'media/coast-source.mp4';start();}
  return ()=>{hls?.destroy();el.removeEventListener('loadedmetadata',start);};
 },[]);
 useEffect(()=>{if(panel){lastFocus.current=document.activeElement;dialog.current.showModal();}else if(dialog.current.open){dialog.current.close();lastFocus.current?.focus();}},[panel]);
 const open=(name)=>{setMenu(false);setPanel(name);};
 const toggle=()=>{const el=video.current;if(el.paused)el.play().catch(()=>setFailed(true));else el.pause();};
 return <main className="landing">
  <video ref={video} className="background-video" poster={base+'media/poster.jpg'} muted loop playsInline preload="auto" aria-label="Sunlit waves flowing around a rocky coastline" onPlay={()=>setPlaying(true)} onPause={()=>setPlaying(false)} onError={()=>setFailed(true)} onTimeUpdate={()=>setProgress(video.current.duration?video.current.currentTime/video.current.duration*100:0)}/>
  <div className="shade"/>
  <header className="header">
   <a className="brand" href={base} aria-label="Luminex home"><Mark/><span>luminex<span className="brand-dot">®</span></span></a>
   <nav className="desktop-nav" aria-label="Main navigation"><a className="active" href={base}>Home<span/></a><button onClick={()=>open('work')}>Our work</button><button onClick={()=>open('studio')}>The studio</button></nav>
   <button className="contact" onClick={()=>open('contact')}>Let’s talk <Arrow diagonal/></button>
   <button className="menu-toggle" aria-label={menu?'Close navigation':'Open navigation'} aria-expanded={menu} onClick={()=>setMenu(!menu)}><span/><span/></button>
  </header>
  {menu&&<nav className="mobile-nav" aria-label="Mobile navigation"><a href={base}>Home</a><button onClick={()=>open('work')}>Our work <Arrow diagonal/></button><button onClick={()=>open('studio')}>The studio <Arrow diagonal/></button><button onClick={()=>open('contact')}>Let’s talk <Arrow diagonal/></button></nav>}
  <div className="topline"><span>Independent minds. Extraordinary possibilities.</span><span className="availability"><i/> Available for select projects</span></div>
  <section className="hero" aria-labelledby="hero-title">
   <div className="eyebrow"><span/> A CREATIVE STUDIO WITHOUT LIMITS</div>
   <h1 id="hero-title">A different<br/>point of <em>view.</em></h1>
   <div className="hero-bottom"><p>We turn bold perspectives into brands,<br className="desktop-break"/> films, and digital experiences that move you.</p><button className="explore" onClick={()=>open('work')}>Explore our work <span><Arrow diagonal/></span></button></div>
  </section>
  <aside className="film-note"><span className="coordinate">01 / PERSPECTIVE SERIES</span><span>A little perspective changes everything.</span></aside>
  <footer className="footer"><span className="footer-left">IDEAS IN MOTION. ALWAYS.</span><div className="film-controls"><span className="film-label">THE WORLD, THROUGH OUR LENS</span><div className="track" aria-hidden="true"><span style={{width:progress+'%'}}/></div><button className="playback" onClick={toggle} aria-label={playing?'Pause background video':'Play background video'}>{playing?<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M7 5v10m6-10v10" stroke="currentColor" strokeWidth="2"/></svg>:<svg viewBox="0 0 20 20" aria-hidden="true"><path d="m7 4 9 6-9 6z" fill="currentColor"/></svg>}</button></div><span className="footer-right">© LUMINEX 2026</span></footer>
  {failed&&<div className="video-status" role="status">A still moment. Video is currently unavailable.</div>}
  <dialog ref={dialog} className="detail-dialog" onCancel={()=>setPanel(null)} onClick={e=>{if(e.target===dialog.current)setPanel(null);}}>
   <button className="close-dialog" aria-label="Close details" onClick={()=>setPanel(null)}>×</button>
   {panel==='work'&&<><div className="eyebrow dark">PERSPECTIVE, PUT INTO PRACTICE</div><h2>Made to move you.</h2><p>From the first spark to the final frame, we bring a fresh perspective to every project.</p><div className="disciplines"><article><span>01 /</span><h3>Brand worlds</h3><p>Strategy, identity, and a distinct point of view.</p></article><article><span>02 /</span><h3>Film & motion</h3><p>Stories that make you feel something.</p></article><article><span>03 /</span><h3>Digital experiences</h3><p>Thoughtful design that invites exploration.</p></article></div><button className="dialog-cta" onClick={()=>setPanel('contact')}>Let’s make something together <Arrow diagonal/></button></>}
   {panel==='studio'&&<><div className="eyebrow dark">INDEPENDENT BY NATURE</div><h2>Curious minds.<br/>Shared vision.</h2><p>We’re Luminex, an independent creative studio working at the intersection of strategy, design, and storytelling.</p><p>We look a little closer, ask a little more, and find the unexpected in the everyday. Because a different point of view can change everything.</p><button className="dialog-cta" onClick={()=>setPanel('contact')}>Meet your next creative partner <Arrow diagonal/></button></>}
   {panel==='contact'&&<><div className="eyebrow dark">GOOD THINGS START WITH A CONVERSATION</div><h2>What’s on<br/>your horizon?</h2><p>Have a bold idea, a new challenge, or a different perspective? We’d love to hear it.</p><a className="email-link" href="mailto:hello@luminex.studio">hello@luminex.studio <Arrow diagonal/></a><div className="contact-note"><i/> Open to new collaborations</div></>}
  </dialog>
 </main>
}

createRoot(document.getElementById('root')).render(<App/>);
