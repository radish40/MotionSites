import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './style.css';

const steps = [
  ['Create Your Free Account', 'Sign up in seconds using your email address or mobile number.'],
  ['Connect Your Bank Accounts', 'Securely link your bank accounts, cards, or digital wallets with.'],
  ['Set Your Financial Goals', 'Customize your savings, spending, or investment goals with easy.'],
  ['Track, Grow, and Optimize', 'Watch your money work for you in real time—get insights and tips.'],
];
function Icon({kind, ...props}) {
 const paths = {user:<><circle cx="12" cy="8" r="3"/><path d="M5 21v-2a7 7 0 0 1 14 0v2M19 7h5m-2.5-2.5v5"/></>,bank:<><path d="m3 9 9-6 9 6H3Zm2 3v6m5-6v6m5-6v6m5-6v6M3 21h18"/></>,target:<><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/></>,chart:<><path d="M4 4v16h17M8 15l4-5 4 2 5-7m-5 0h5v5"/></>,arrow:<path d="M5 12h14m-5-5 5 5-5 5"/>,chevron:<path d="m6 9 6 6 6-6"/>,close:<path d="m6 6 12 12M6 18 18 6"/>,menu:<path d="M4 7h16M4 12h16M4 17h16"/>};
 return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>{paths[kind]}</svg>;
}
function App(){
 const [menu,setMenu]=useState(false),[features,setFeatures]=useState(false),[modal,setModal]=useState(null),[submitted,setSubmitted]=useState(false);
 const dialog=useRef(null);
 useEffect(()=>{if(modal){dialog.current.showModal();document.body.style.overflow='hidden';}else{dialog.current.close();document.body.style.overflow='';}return()=>{document.body.style.overflow='';};},[modal]);
 const open=(name)=>{setMenu(false);setFeatures(false);setSubmitted(false);setModal(name);};
 return <main className="hero relative isolate min-h-screen overflow-hidden bg-black text-white">
  <div className="video-layer absolute inset-0 -z-20 overflow-hidden" aria-hidden="true"><video className="h-full w-full origin-top-left scale-150 object-cover object-left-top" src={`${import.meta.env.BASE_URL}assets/wealth-background.mp4`} autoPlay muted loop playsInline preload="auto" poster={`${import.meta.env.BASE_URL}assets/wealth-poster.jpg`}/></div>
  <div className="scrim absolute inset-0 -z-10"/>
  <header className="absolute top-0 left-0 z-20 w-full"><nav className="nav-shell flex items-center justify-between" aria-label="Main navigation">
   <a className="brand flex items-center" href="#" aria-label="Aureon home"><svg width="32" height="34" viewBox="0 0 32 34" fill="none" aria-hidden="true"><path d="M3 28 14 5h5L8 28H3ZM15 28l6-13 8 13h-6l-4-7-3 7h-1Z" fill="currentColor"/></svg><span>aureon<span className="brand-dot">.</span></span></a>
   <div className="desktop-nav flex items-center"><div className="relative"><button className="nav-link flex items-center gap-2" aria-expanded={features} onClick={()=>setFeatures(!features)}>Features<Icon kind="chevron" className={`chevron ${features?'rotate-180':''}`}/></button>{features&&<div className="feature-menu">{steps.map(([title],i)=><a key={title} href={`#step-${i}`} onClick={()=>setFeatures(false)}><span>0{i+1}</span>{title}<Icon kind="arrow"/></a>)}</div>}</div><button className="nav-link" onClick={()=>open('Company')}>Company</button><button className="nav-link" onClick={()=>open('Blogs')}>Blogs</button></div>
   <div className="nav-actions flex items-center"><button className="nav-link sign-in" onClick={()=>open('Sign in')}>Sign in</button><button className="pill nav-cta bg-white text-black" onClick={()=>open('Get Started')}>Get Started<Icon kind="arrow"/></button><button className="menu-toggle" aria-label={menu?'Close menu':'Open menu'} aria-expanded={menu} onClick={()=>setMenu(!menu)}><Icon kind={menu?'close':'menu'}/></button></div>
  </nav>{menu&&<div className="mobile-menu"><a href="#features" onClick={()=>setMenu(false)}>Features<Icon kind="chevron"/></a><button onClick={()=>open('Company')}>Company</button><button onClick={()=>open('Blogs')}>Blogs</button><button onClick={()=>open('Sign in')}>Sign in</button></div>}</header>
  <section className="hero-copy mx-auto text-center" aria-labelledby="headline">
   <div className="tag inline-flex items-center rounded-full border border-white/20 bg-white/5 backdrop-blur-xl"><span className="live-dot"/>Real-Time Budget Tracking</div>
   <h1 id="headline">Build Wealth That<br className="desktop-break"/> Lasts Generations</h1>
   <p className="subtitle mx-auto text-white/70">Transform today's earnings into tomorrow's family fortune<br className="desktop-break"/> with proven wealth-building strategies</p>
   <button className="pill hero-cta inline-flex items-center bg-white text-black hover:scale-105" onClick={()=>open('Start Building Wealth')}>Start Building Wealth<Icon kind="arrow"/></button>
  </section>
  <section className="steps-shell mx-auto" id="features" aria-label="Your path to lasting wealth"><div className="steps-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 border border-white/15 bg-black/70 backdrop-blur-xl">{steps.map(([title,description],i)=><article id={`step-${i}`} className="step" key={title}><div className="step-top flex items-center justify-between"><div className="step-icon"><Icon kind={['user','bank','target','chart'][i]}/></div><span className="step-number">0{i+1}</span></div><h2>{title}</h2><p>{description}</p></article>)}</div></section>
  <dialog ref={dialog} onCancel={()=>setModal(null)} onClick={e=>{if(e.target===dialog.current)setModal(null);}} className="dialog"><button className="dialog-close" aria-label="Close dialog" onClick={()=>setModal(null)}><Icon kind="close"/></button><span className="dialog-eyebrow">AUREON</span><h2>{modal}</h2>{['Company','Blogs'].includes(modal)?<><p>{modal==='Company'?"A lasting future starts with the choices you make today. Aureon brings your accounts, goals, and financial insights together in one place.":"Our wealth-building journal is coming soon. Explore the four steps to begin your journey today."}</p><button className="pill bg-white text-black" onClick={()=>{setModal(null);document.getElementById('features').scrollIntoView({behavior:'smooth'});}}>Explore the features<Icon kind="arrow"/></button></>:submitted?<div role="status"><p>{modal==='Sign in'?'This preview is not connected to a sign-in service.':'You’re ready to take the first step.'}</p><p className="preview-note">This is a design preview. No account has been created and no information has been sent.</p><button className="pill bg-white text-black" onClick={()=>setModal(null)}>Back to Aureon<Icon kind="arrow"/></button></div>:<form onSubmit={e=>{e.preventDefault();setSubmitted(true);}}><p>{modal==='Sign in'?'Welcome back. Enter your email to continue.':'Your journey to lasting wealth starts here.'}</p><label htmlFor="email">Email address</label><input autoComplete="email" id="email" type="email" placeholder="you@example.com" required/><button className="pill bg-white text-black" type="submit">Continue<Icon kind="arrow"/></button><p className="preview-note">Design preview · No financial accounts are connected.</p></form>}</dialog>
 </main>
}
createRoot(document.getElementById('root')).render(<App/>);
