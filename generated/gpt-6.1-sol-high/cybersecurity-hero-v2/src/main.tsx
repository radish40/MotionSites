import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Layers, ShieldCheck, X, ArrowUpRight } from 'lucide-react';
import { Shader, SolidColor, SineWave, WaveDistortion, FilmGrain } from 'shaders/react';
import './styles.css';

function XeroMark() {
  return <svg viewBox="0 0 48 48" fill="currentColor" aria-hidden="true"><path d="M24 5c7 0 12 4 14 10-5-2-10-1-14 3V5Zm19 19c0 7-4 12-10 14 2-5 1-10-3-14h13ZM24 43c-7 0-12-4-14-10 5 2 10 1 14-3v13ZM5 24c0-7 4-12 10-14-2 5-1 10 3 14H5Z"/><path d="m24 14 10 10-10 10-10-10Z"/></svg>;
}

function Pipeline() {
  const row = useRef<HTMLDivElement>(null);
  const left = useRef<HTMLDivElement>(null);
  const center = useRef<HTMLDivElement>(null);
  const right = useRef<HTMLDivElement>(null);
  const gradient = useRef<SVGLinearGradientElement>(null);
  const glow = useRef<SVGPathElement>(null);
  const crisp = useRef<SVGPathElement>(null);
  const splash = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let frame: number, start = performance.now(), previous = '';
    let points = [0, 0, 0, 0];
    const measure = () => {
      const r = row.current!.getBoundingClientRect();
      const a = left.current!.getBoundingClientRect(), b = center.current!.getBoundingClientRect(), c = right.current!.getBoundingClientRect();
      points = [a.right - r.left, b.left + b.width / 2 - r.left, c.left - r.left, a.top + a.height / 2 - r.top];
      const d = `M ${points[0]} ${points[3]} L ${points[2]} ${points[3]}`;
      glow.current!.setAttribute('d', d); crisp.current!.setAttribute('d', d);
    };
    const observer = new ResizeObserver(measure); observer.observe(row.current!); measure();
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const animate = (now: number) => {
      const t = (now - start) % 3400;
      const state = t < 800 ? 'p1' : t < 1600 ? 'splash' : t < 2400 ? 'p2' : 'idle';
      const visible = state === 'p1' || state === 'p2';
      const p = state === 'p1' ? t / 800 : (t - 1600) / 800;
      const x = state === 'p1' ? points[0] + (points[1] - points[0]) * p : points[1] + (points[2] - points[1]) * p;
      gradient.current!.setAttribute('x1', `${x - 48}`); gradient.current!.setAttribute('x2', `${x + 48}`);
      glow.current!.style.opacity = visible ? '0.6' : '0'; crisp.current!.style.opacity = visible ? '1' : '0';
      left.current!.classList.toggle('active', state === 'p1' && p < .4);
      right.current!.classList.toggle('active', state === 'p2' && p > .6);
      if (state !== previous) { splash.current!.classList.toggle('playing', state === 'splash'); previous = state; }
      frame = requestAnimationFrame(animate);
    };
    if (!reduced) frame = requestAnimationFrame(animate);
    return () => { cancelAnimationFrame(frame); observer.disconnect(); };
  }, []);
  return <div className="pipeline" ref={row} role="img" aria-label="Your data flows through Xero into secure, encrypted storage">
    <svg className="beam" aria-hidden="true"><defs><linearGradient id="beam-gradient" ref={gradient} gradientUnits="userSpaceOnUse"><stop offset="0" stopColor="#ff4dc8" stopOpacity="0"/><stop offset=".25" stopColor="#ff4dc8"/><stop offset=".5" stopColor="white"/><stop offset=".75" stopColor="#c864ff"/><stop offset="1" stopColor="#c864ff" stopOpacity="0"/></linearGradient><filter id="beam-blur"><feGaussianBlur stdDeviation="3"/></filter></defs><path ref={glow} stroke="url(#beam-gradient)" strokeWidth="2" filter="url(#beam-blur)"/><path ref={crisp} stroke="url(#beam-gradient)" strokeWidth=".8"/></svg>
    <div ref={left} className="node node-small node-light-right"><Layers size={21} strokeWidth={1.4}/></div>
    <div className="connection"/>
    <div className="center-wrap"><div className="splash" ref={splash}/><div className="node node-center" ref={center}><XeroMark/></div></div>
    <div className="connection connection-right"/>
    <div ref={right} className="node node-small node-light-left"><ShieldCheck size={21} strokeWidth={1.4}/></div>
  </div>;
}

function BrandIcon({kind}:{kind:number}) {
  return <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden="true">
    {kind === 0 && <><circle cx="12" cy="12" r="11" fill="none" stroke="currentColor" strokeWidth="1.5"/><path d="m5 11 6 1 6-7 2 1-4 8 3 3-1 1-5-3-5 2-1-1 4-3-5-1Z"/></>}
    {kind === 1 && <><circle cx="12" cy="6" r="4"/><circle cx="6" cy="17" r="4"/><circle cx="18" cy="17" r="4"/></>}
    {kind === 2 && <><path d="M2 5h8v4H2zm0 5h6v4H2zm0 5h4v4H2zm11-10h9v4h-9zm0 5h7v4h-7zm0 5h5v4h-5Z"/></>}
    {kind === 3 && <><path d="M10 4h2v8l7-4 1 2-7 4 6 6-2 1-6-6-6 5-1-2 6-5Z"/><circle cx="11" cy="3" r="3"/><circle cx="20" cy="8" r="3"/><circle cx="4" cy="20" r="3"/><circle cx="19" cy="21" r="2"/></>}
    {kind === 4 && Array.from({length:12},(_,i)=><rect key={i} x="10.8" y="1" width="2.4" height="7" rx="1" transform={`rotate(${i*30} 12 12)`}/>)}
  </svg>;
}

const descriptions:Record<string,{title:string,text:string}> = {
  Method:{title:'Encryption, made simple.',text:'Your data enters Xero, is encrypted, and moves into protected storage. One fully managed workflow for your team.'},
  Pricing:{title:'Built for your team.',text:'Pricing information is not available in this preview. Get started to explore the Xero experience.'},
  Docs:{title:'The Xero workflow.',text:'Connect your data, let Xero manage encryption, and keep your team’s information protected. Full documentation will be available with the service.'},
};
function App() {
  const [menu,setMenu] = useState(false);
  const [panel,setPanel] = useState<string|null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const menuButton = useRef<HTMLButtonElement>(null);
  const open = (name:string) => { setMenu(false); setPanel(name); dialog.current?.showModal(); };
  useEffect(()=>{ document.body.style.overflow = menu ? 'hidden' : ''; const close = (event:KeyboardEvent)=>{if(event.key==='Escape') {setMenu(false); menuButton.current?.focus();}}; window.addEventListener('keydown',close); return ()=>window.removeEventListener('keydown',close); },[menu]);
  const links = <>{['Method','Pricing','Docs'].map(label=><button key={label} className="nav-link" onClick={()=>open(label)}>{label}</button>)}</>;
  const actions = <><button className="pill login" onClick={()=>open('Login')}>Login</button><button className="pill signup" onClick={()=>open('Sign Up')}>Sign Up</button></>;
  return <main className="flex flex-col items-center">
    <header className="navbar"><a href="#" className="wordmark" aria-label="Xero home">Xero</a><nav className="desktop-links" aria-label="Main navigation">{links}</nav><div className="desktop-actions">{actions}</div><button ref={menuButton} className={`menu-toggle ${menu?'is-open':''}`} aria-label={menu?'Close menu':'Open menu'} aria-expanded={menu} aria-controls="mobile-menu" onClick={()=>setMenu(!menu)}><span/><span/></button></header>
    <div id="mobile-menu" className={`mobile-menu ${menu?'is-open':''}`} {...(!menu ? { inert: '' } : {})} aria-hidden={!menu}><nav aria-label="Mobile navigation">{links}</nav><div className="mobile-actions">{actions}</div></div>
    <section className="hero" aria-labelledby="hero-heading">
      <div className="shader-bg" aria-hidden="true"><Shader><SolidColor color="#08071a"/><SineWave amplitude={0.36} blendMode="normal-oklch" color="#0582e8" frequency={0.2} position={{x:0.65,y:0.67}} softness={0.55} speed={0.3} thickness={0.72}/><SineWave amplitude={0.17} blendMode="normal-oklch" color="#f00e94" frequency={0.2} position={{x:0.6,y:0.51}} softness={0.54} speed={0.5} thickness={0.35}/><WaveDistortion angle={299} frequency={0.3} speed={0.2} strength={1}/><FilmGrain strength={0.07}/></Shader></div>
      <div className="grid-overlay" aria-hidden="true"/>
      <Pipeline/>
      <div className="hero-content"><h1 id="hero-heading">The simple way<strong>encryption your data</strong></h1><p>Fully managed data encrypting service and annotation<br/> platform for teams of all industries.</p><button className="cta" onClick={()=>open('Get Started')}>Get Started</button></div>
    </section>
    <section className="brands" aria-label="Trusted by teams at">{['Expedia','asana','zenefits','HubSpot','loom'].map((name,i)=><div className={`brand brand-${i}`} key={name}><BrandIcon kind={i}/><span>{i===3?<>HubSp<sup>●</sup>t</>:name}</span></div>)}</section>
    <dialog ref={dialog} onClose={()=>setPanel(null)} onClick={e=>{if(e.target===dialog.current)dialog.current.close();}}><button className="dialog-close" aria-label="Close dialog" onClick={()=>dialog.current?.close()}><X size={20}/></button><span className="dialog-brand">Xero <ArrowUpRight size={16}/></span><h2>{panel && descriptions[panel] ? descriptions[panel].title : panel === 'Login' ? 'Welcome back.' : 'Your data. Protected.'}</h2><p>{panel && descriptions[panel] ? descriptions[panel].text : 'This is a design preview. Account creation and sign-in are not connected to a live service.'}</p><button className="cta" onClick={()=>dialog.current?.close()}>Back to Xero</button></dialog>
  </main>;
}

createRoot(document.getElementById('root')!).render(<React.StrictMode><App/></React.StrictMode>);
