import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { cva } from 'class-variance-authority';
import '@fontsource/geist-sans/400.css';
import '@fontsource/geist-sans/500.css';
import '@fontsource/geist-sans/600.css';
import '@fontsource/geist-sans/700.css';
import './style.css';

const button = cva('button', { variants: { variant: { hero: 'button-primary', heroSecondary: 'liquid-glass button-secondary' } }, defaultVariants: { variant: 'hero' } });
const Chevron = ({right=false}) => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true"><path d={right?'m9 6 6 6-6 6':'m6 9 6 6 6-6'}/></svg>;
const Crosshair = () => <svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><circle cx="12" cy="12" r="6"/><path d="M12 2v6m0 8v6M2 12h6m8 0h6"/></svg>;
const content = {
 Features: { title:'A smarter way to grow.', intro:'Everything you need to move your funnel forward.', items:[['Clever workflows','Keep your pipeline moving with connected workflows.'],['Analytics','See the signals that drive your revenue.'],['Lead management','Bring your leads and next steps together.']] },
 Solutions: { title:'Built for your next stage.', intro:'Connect your team around a clearer path to growth.', items:[['Sales teams','Focus on the opportunities that matter.'],['Marketing teams','Turn interest into meaningful conversations.']] },
 Plans: { title:'Find your path to growth.', intro:'Start with APEX and discover the right fit for your team.', items:[['Get started','Explore workflows, analytics, and lead management.'],['Grow together','Talk with us about your team’s needs.']] },
 Learning: { title:'Make your next move.', intro:'Explore the ideas behind a more connected funnel.', items:[['Workflow essentials','Create a clear journey from lead to opportunity.'],['Understanding your funnel','Connect your activity with revenue insights.']] },
 Nova: { title:'Meet Nova+', intro:'A new chapter in revenue growth.', items:[['Your funnel, connected','Discover clever workflows, clear analytics, and seamless lead management in APEX.']] }
};
function App(){
 const [menu,setMenu]=useState(null), [mobile,setMobile]=useState(false), [modal,setModal]=useState(null), [done,setDone]=useState(false);
 const dialog=useRef(null), menuRef=useRef(null);
 const open=(name)=>{setModal(name);setDone(false);setMenu(null);setMobile(false)};
 useEffect(()=>{ if(modal){dialog.current.showModal();} },[modal]);
 useEffect(()=>{const outside=e=>{if(menuRef.current&&!menuRef.current.contains(e.target))setMenu(null)}; const key=e=>{if(e.key==='Escape'){setMenu(null);setMobile(false)}};document.addEventListener('pointerdown',outside);document.addEventListener('keydown',key);return()=>{document.removeEventListener('pointerdown',outside);document.removeEventListener('keydown',key)}},[]);
 return <main className="hero">
  <video className="background-video" autoPlay loop muted playsInline preload="auto" aria-hidden="true"><source src={`${import.meta.env.BASE_URL}assets/orbit.mp4`} type="video/mp4"/></video>
  <div className="video-shade"/>
  <header className="nav-wrap" ref={menuRef}>
   <nav className="navbar liquid-glass" aria-label="Main navigation">
    <a className="brand" href={import.meta.env.BASE_URL} aria-label="APEX home"><span className="brand-icon"><Crosshair/></span><span>APEX</span></a>
    <div className="nav-links">{['Features','Solutions','Plans','Learning'].map(name=><button key={name} className="nav-link" onClick={()=>['Features','Learning'].includes(name)?setMenu(menu===name?null:name):open(name)} aria-expanded={['Features','Learning'].includes(name)?menu===name:undefined}>{name}{['Features','Learning'].includes(name)&&<Chevron/>}</button>)}</div>
    <button className="signup" onClick={()=>open('Sign Up')}>Sign Up</button>
    <button className="mobile-toggle" aria-label={mobile?'Close menu':'Open menu'} aria-expanded={mobile} onClick={()=>setMobile(!mobile)}><span/><span/></button>
   </nav>
   {menu&&<div className="dropdown liquid-glass">{content[menu].items.map(([title,description])=><button key={title} onClick={()=>open(menu)}><strong>{title}</strong><span>{description}</span></button>)}</div>}
   {mobile&&<div className="mobile-menu liquid-glass">{['Features','Solutions','Plans','Learning'].map(name=><button key={name} onClick={()=>open(name)}>{name}<Chevron right/></button>)}</div>}
  </header>
  <section className="hero-content" aria-labelledby="hero-heading">
   <button className="announcement liquid-glass" onClick={()=>open('Nova')}><span>Nova+ Launched!</span><span className="explore">Explore<Chevron right/></span></button>
   <h1 id="hero-heading">Accelerate Your<br/>Revenue Growth Now</h1>
   <p className="subtitle">Drive your funnel forward with clever workflows, analytics, and seamless lead management.</p>
   <div className="hero-actions"><button className={button()} onClick={()=>open('Start Free Right Now')}>Start Free Right Now</button><button className={button({variant:'heroSecondary'})} onClick={()=>open('Schedule a Consult')}>Schedule a Consult</button></div>
  </section>
  <section className="social-proof" aria-label="Trusted brands"><p>Relied on by brands<br className="desktop-break"/> across the globe</p><div className="marquee"><div className="marquee-track">{[0,1].map(copy=><div className="brand-group" key={copy} aria-hidden={copy===1}>{['Vortex','Nimbus','Prysma','Cirrus','Kynder','Halcyn'].map(brand=><div className="customer" key={brand}><span className="customer-icon liquid-glass">{brand[0]}</span><span>{brand}</span></div>)}</div>)}</div></div></section>
  {modal&&<dialog ref={dialog} onCancel={()=>setModal(null)} onClick={e=>{if(e.target===e.currentTarget){dialog.current.close();setModal(null)}}}><button className="close" aria-label="Close dialog" onClick={()=>{dialog.current.close();setModal(null)}}>×</button>{content[modal]?<><span className="eyebrow">{modal==='Nova'?'NOVA+ · NOW LAUNCHED':`EXPLORE APEX · ${modal.toUpperCase()}`}</span><h2>{content[modal].title}</h2><p>{content[modal].intro}</p><div className="details">{content[modal].items.map(([title,description])=><article key={title}><h3>{title}</h3><p>{description}</p></article>)}</div><button className={button()} onClick={()=>open('Start Free Right Now')}>Start Free Right Now</button></>:done?<div role="status"><span className="success-mark">✓</span><h2>{modal==='Schedule a Consult'?'Your details are ready.':'You’re on the list.'}</h2><p>This is a preview. Your information has been validated locally; no request has been sent.</p></div>:<><span className="eyebrow">YOUR NEXT CHAPTER</span><h2>{modal==='Schedule a Consult'?'Let’s talk growth.':'Start growing with APEX.'}</h2><p>{modal==='Schedule a Consult'?'Tell us a little about your team.':'Take the first step toward a more connected funnel.'}</p><form onSubmit={e=>{e.preventDefault();setDone(true)}}><label>Your name<input name="name" autoComplete="name" required placeholder="Alex Morgan"/></label><label>Work email<input name="email" type="email" autoComplete="email" required placeholder="alex@company.com"/></label>{modal==='Schedule a Consult'&&<label>Company<input name="company" autoComplete="organization" required placeholder="Company name"/></label>}<button className={button()} type="submit">{modal==='Schedule a Consult'?'Request a Consult':'Create your account'}</button><small>Interactive preview · no information is sent.</small></form></>}</dialog>}
 </main>
}
createRoot(document.getElementById('root')).render(<App/>);
