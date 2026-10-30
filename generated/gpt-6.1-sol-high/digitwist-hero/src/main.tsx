import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { motion, MotionConfig } from 'motion/react';
import Hls from 'hls.js';
import { ArrowRight, ChevronDown, X, Sparkles, LayoutTemplate, Globe } from 'lucide-react';
import './style.css';

const videoSrc = 'https://stream.mux.com/T6oQJQ02cQ6N01TR6iHwZkKFkbepS34dkkIc9iukgy400g.m3u8';
const poster = `${import.meta.env.BASE_URL}assets/poster.jpg`;
type Panel = 'start' | 'examples' | 'stories' | 'resources' | 'pricing' | 'demo';
function Sunburst() {
  return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true"><g stroke="currentColor" strokeWidth="1.7">{Array.from({length:12},(_,i)=><path key={i} d="M12 1v22" transform={`rotate(${i*15} 12 12)`}/>)}</g></svg>;
}
function Background() {
  const videoRef = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const video = videoRef.current;
    if (!video || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const play = () => { video.play().catch(() => { /* The poster remains visible if autoplay is blocked. */ }); };
    if (Hls.isSupported()) {
      const hls = new Hls({maxMaxBufferLength:30});
      hls.loadSource(videoSrc);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, play);
      hls.on(Hls.Events.ERROR, (_, data) => { if (data.fatal) { hls.destroy(); video.removeAttribute('src'); video.load(); } });
      return () => hls.destroy();
    }
    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = videoSrc;
      video.addEventListener('loadedmetadata', play);
      return () => {video.removeEventListener('loadedmetadata', play); video.removeAttribute('src'); video.load();};
    }
  }, []);
  return <div className="background" aria-hidden="true"><video ref={videoRef} muted loop playsInline poster={poster} tabIndex={-1}/><div className="video-overlay"/><div className="glow glow-blue"/><div className="glow glow-indigo"/></div>;
}
const info = {
  stories: {eyebrow:'CUSTOMER STORIES', title:'Every idea has a beginning.', text:'Discover what’s possible with AI-assisted website creation. Explore a few website concepts to find your starting point.'},
  resources: {eyebrow:'RESOURCES', title:'From first thought to first draft.', text:'Start with a clear description of your website. Include who it’s for, what it should do, and how you want it to feel.'},
  pricing: {eyebrow:'PRICING', title:'Start building free.', text:'Explore your first website concept for free. Paid plans and publishing are not connected in this preview.'},
  demo: {eyebrow:'BOOK A DEMO', title:'See your idea take shape.', text:'Try the interactive concept preview to explore how a simple brief becomes a starting point for your website. Live demo booking is not connected in this preview.'},
};
function PanelDialog({panel, close, open}:{panel:Panel|null;close:()=>void;open:(panel:Panel)=>void}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [brief, setBrief] = useState('');
  const [created, setCreated] = useState(false);
  useEffect(() => {
    if (panel) { setCreated(false); dialog.current?.showModal(); } else dialog.current?.close();
  }, [panel]);
  return <dialog ref={dialog} className="dialog" onCancel={close} onClick={e=>{if(e.target===e.currentTarget)close();}} aria-labelledby="dialog-title">
    <button className="close" aria-label="Close dialog" onClick={close}><X size={20}/></button>
    {panel === 'start' ? <><span className="eyebrow"><Sparkles size={14}/> YOUR NEXT BIG IDEA</span><h2 id="dialog-title">What will you build?</h2><p>Describe your website to create a local concept preview.</p><form onSubmit={e=>{e.preventDefault();setCreated(true);}}><label htmlFor="brief">Your website idea</label><textarea id="brief" value={brief} onChange={e=>{setBrief(e.target.value);setCreated(false);}} placeholder="A minimalist portfolio for a creative studio…" required maxLength={300}/><button className="form-button" type="submit">Create concept <ArrowRight size={18}/></button></form>{created && <div className="concept" role="status"><span>CONCEPT PREVIEW</span><h3>{brief}</h3><p>A focused headline, a clear call to action, and room for your story.</p><small>Local preview only. AI generation and publishing are not connected.</small></div>}</> : panel === 'examples' ? <><span className="eyebrow">A LITTLE INSPIRATION</span><h2 id="dialog-title">Ideas, made tangible.</h2><p>Choose a starting point and make it yours.</p><div className="examples">{[['Creative studio','An expressive portfolio for a creative studio'],['Independent business','A welcoming website for an independent business'],['Product launch','A bold landing page for a new product']].map(([name, brief],i)=><button className={`example example-${i}`} key={name} onClick={()=>{setBrief(brief);open('start');}}><LayoutTemplate size={26}/><span>{name}<ArrowRight size={17}/></span></button>)}</div></> : panel ? <><span className="eyebrow">{info[panel].eyebrow}</span><h2 id="dialog-title">{info[panel].title}</h2><p>{info[panel].text}</p><button className="form-button" onClick={()=>open(panel === 'stories' ? 'examples' : 'start')}>{panel === 'stories' ? 'Explore examples' : 'Try the builder'}<ArrowRight size={18}/></button></> : null}
  </dialog>;
}
function App() {
  const [products, setProducts] = useState(false);
  const [panel, setPanel] = useState<Panel|null>(null);
  const productRef = useRef<HTMLDivElement>(null);
  useEffect(()=>{
    const click=(e:PointerEvent)=>{if(!productRef.current?.contains(e.target as Node))setProducts(false);};
    const key=(e:KeyboardEvent)=>{if(e.key==='Escape')setProducts(false);};
    document.addEventListener('pointerdown',click); document.addEventListener('keydown',key);
    return ()=>{document.removeEventListener('pointerdown',click);document.removeEventListener('keydown',key);};
  },[]);
  const open=(next:Panel)=>{setProducts(false);setPanel(next);};
  return <MotionConfig reducedMotion="user"><main className="hero"><Background/><nav className="navbar" aria-label="Main navigation"><a className="brand" href={import.meta.env.BASE_URL} aria-label="Digitwist home"><Sunburst/></a><div className="nav-center"><div className="products" ref={productRef}><button className="nav-link products-button" aria-expanded={products} aria-controls="products-menu" onClick={()=>setProducts(!products)}>Products <ChevronDown size={14} className={products?'rotated':''}/></button>{products&&<div className="products-menu" id="products-menu"><button onClick={()=>open('start')}><Sparkles size={19}/><span>AI Website Builder<small>Turn your idea into a website</small></span><ArrowRight size={16}/></button><button onClick={()=>open('examples')}><Globe size={19}/><span>Website examples<small>Find your next starting point</small></span><ArrowRight size={16}/></button></div>}</div><button className="nav-link" onClick={()=>open('stories')}>Customer Stories</button><button className="nav-link" onClick={()=>open('resources')}>Resources</button><button className="nav-link" onClick={()=>open('pricing')}>Pricing</button></div><div className="nav-right"><button className="nav-link demo-link" onClick={()=>open('demo')}>Book A Demo</button><button className="get-started" onClick={()=>open('start')}>Get Started</button></div></nav><section className="hero-content" aria-labelledby="hero-title"><motion.p className="pre-headline" initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:.6}}>Design at the speed of thought</motion.p><motion.h1 id="hero-title" initial={{opacity:0,scale:.9}} animate={{opacity:1,scale:1}} transition={{delay:.2,duration:.6}}>Build Faster</motion.h1><motion.p className="subheadline" initial={{opacity:0}} animate={{opacity:.7}} transition={{delay:.4,duration:.6}}>Create fully functional, SEO-optimized websites in seconds with our advanced AI engine.</motion.p><motion.div className="cta-group" initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:.6,duration:.5}}><button className="primary-cta" onClick={()=>open('start')}>Start Building Free<span className="arrow-circle"><ArrowRight size={20}/></span></button><button className="secondary-cta" onClick={()=>open('examples')}>See Examples<ArrowRight size={18}/></button></motion.div></section></main><PanelDialog panel={panel} close={()=>setPanel(null)} open={open}/></MotionConfig>;
}
createRoot(document.getElementById('root')!).render(<App/>);
