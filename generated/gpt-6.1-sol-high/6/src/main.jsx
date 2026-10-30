import React, {useState, useRef, useEffect} from 'react';
import {createRoot} from 'react-dom/client';
import './style.css';
const Arrow = () => <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 19 19 5M5 5h14v14" stroke="currentColor" strokeWidth="1.5"/></svg>;
const content = {
 projects:{eyebrow:'SELECTED WORK / 2023—2026', title:'Made to make an impact.',body:<div className="project-list"><div><span>01 / Brand & digital experience</span><h3>Forma Studio</h3><p>A considered digital home for an independent architecture studio.</p></div><div><span>02 / E-commerce & art direction</span><h3>Everyday Objects</h3><p>A fresh perspective on the things we live with.</p></div><div><span>03 / Product design</span><h3>Sunday Club</h3><p>A simpler way to find your people and make plans.</p></div></div>},
 blog:{eyebrow:'NOTES FROM THE STUDIO',title:'A little perspective.',body:<><h3>Good design starts with listening.</h3><p>Before the moodboards and the pixels, there’s a conversation. Understanding the people behind a brand is how I find the idea that makes it feel like itself.</p><h3>Make room for the unexpected.</h3><p>The most memorable work often starts with a small experiment. Play is part of the process.</p></>},
 about:{eyebrow:'THE PERSON BEHIND THE PIXELS',title:'Hi, I’m Olivia.',body:<><p>I’m a freelance UI/UX designer turning big ideas into bold digital experiences. I work with ambitious people and brands who want to do things a little differently.</p><p>From the first conversation to the final detail, I bring curiosity, clarity, and a hands-on approach to every project.</p><div className="skills">UI/UX DESIGN · ART DIRECTION · BRAND EXPERIENCES</div></>},
 resume:{eyebrow:'EXPERIENCE & APPROACH',title:'Curiosity. Craft. Clarity.',body:<><h3>Independent UI/UX Designer</h3><p>Brand websites, digital products, and e-commerce experiences, from concept through design handoff.</p><h3>What I bring</h3><p>User research, creative direction, interface design, prototyping, and thoughtful design systems.</p><p className="skills">AVAILABLE FOR FREELANCE COLLABORATIONS</p></>},
 contact:{eyebrow:'LET’S MAKE SOMETHING GREAT',title:'Your next era starts here.',body:<><p>Have a project in mind? Tell me what you’re building, where you want to take it, and when you’d like to get started.</p><a className="email-link" href="mailto:hello@viktoroddy.design">hello@viktoroddy.design <Arrow/></a><p className="contact-note">Open your email app to start a conversation.</p></>}
};
function App(){
 const [panel,setPanel]=useState(null); const dialog=useRef(null); const opener=useRef(null);
 useEffect(()=>{if(panel){dialog.current.showModal();} },[panel]);
 function open(e,key){e.preventDefault(); opener.current=e.currentTarget;setPanel(key);}
 function close(){dialog.current.close();setPanel(null);opener.current?.focus();}
 return <main className="portfolio relative isolate overflow-hidden text-white">
 <div className="ambient" aria-hidden="true"><span className="ghost-name">OLIVIA</span><div className="glow glow-left"/><div className="glow glow-right"/></div>
 <header className="navigation absolute inset-x-0 top-0 z-30 flex items-center justify-between">
 <a href="#" className="wordmark flex items-center" aria-label="Viktoroddy home"><span className="asterisk" aria-hidden="true">✱</span> VIKTORODDY</a>
 <nav className="hidden md:flex items-center" aria-label="Main navigation">{['projects','blog','about','resume'].map(key=><a key={key} href={'#'+key} onClick={e=>open(e,key)}>{key}</a>)}</nav>
 <a href="#contact" onClick={e=>open(e,'contact')} className="hire flex items-center"><span>// HIRE ME</span><span className="arrow-circle flex items-center justify-center"><Arrow/></span></a>
 </header>
 <section className="hero relative flex flex-col" aria-labelledby="hero-title">
 <div className="hero-meta flex items-center justify-between"><span className="availability flex items-center"><i/> AVAILABLE FOR FREELANCE</span><span className="edition">INDEPENDENT DESIGNER / VOL. 01</span></div>
 <div className="headline-scene relative">
 <h1 id="hero-title" className="relative z-10"><span>NEW</span>{' '}<span>DESIGN</span>{' '}<span>ERA</span></h1>
 <div className="portrait-wrap absolute z-20" aria-hidden="true"><img className="portrait" src={import.meta.env.BASE_URL+'assets/portrait.jpg'} alt="" fetchPriority="high"/><span className="portrait-grain"/></div>
 <span className="image-caption absolute">A LITTLE BOLD. A LOT OF SOUL.</span>
 </div>
 <div className="hero-details flex justify-between">
 <div className="intro"><p className="section-label">// A LITTLE ABOUT ME</p><p>I’m Olivia — a freelance UI/UX<br className="desktop-break"/> designer turning big ideas into<br className="desktop-break"/> bold digital experiences.</p><a href="#about" onClick={e=>open(e,'about')} className="about-link inline-flex items-center">MORE ABOUT ME <Arrow/></a></div>
 <p className="tagline">// DESIGN THAT<br/><span>SPEAKS YOUR BRAND</span><span className="little-star" aria-hidden="true">✳</span></p>
 </div>
 <div className="hero-bottom flex items-center justify-between"><span>GOOD DESIGN. GREAT CONNECTIONS.</span><span className="scroll-mark">SCROLL TO EXPLORE <span aria-hidden="true">↓</span></span><span>BASED ON EARTH. AVAILABLE WORLDWIDE.</span></div>
 </section>
 <footer className="brands relative z-10"><p className="brand-label">IN GOOD COMPANY</p><div className="brand-row flex items-center justify-between" aria-label="Brand inspiration"><span className="gucci">GUCCI</span><span className="zara">ZARA</span><span className="vogue">VOGUE</span><span className="sony">SONY</span><span className="zalora">ZALORA</span></div></footer>
 <dialog ref={dialog} className="info-dialog" onCancel={e=>{e.preventDefault();close()}} onClick={e=>{if(e.target===dialog.current)close()}}><div className="dialog-inner"><button className="close-button" onClick={close} aria-label="Close panel">×</button>{panel&&<><p className="section-label">{content[panel].eyebrow}</p><h2>{content[panel].title}</h2><div className="panel-body">{content[panel].body}</div></>}</div></dialog>
 </main>
}
createRoot(document.getElementById('root')).render(<App/>);
