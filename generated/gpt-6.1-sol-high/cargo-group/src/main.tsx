import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X } from 'lucide-react';
import './style.css';

const EXPO_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];
const asset = (name: string) => `${import.meta.env.BASE_URL}assets/${name}`;
const nav = ['Services', 'Industries', 'Company'];
const routes = [
 'M128.161 74.6764C79.9989 130.001 71.9994 46.0005 20.9815 111.737',
 'M216.999 9.99985C260.499 12.4998 222.499 71.9998 291.999 58.9998',
 'M130.102 70.9998C144.499 -32.0002 183.852 70.2739 219.999 3.99985',
 'M14.4999 16.9998C111 20.9998 -53.0003 73.4998 21.4999 107',
];
const dots = [[9.519,15.519],[289.519,59.518],[220.519,9.519],[125.518,78.519],[19.519,104.519]];
const pill = 'M316 0C329.08 0 340.435 7.38674 346.121 18.2162C348.618 22.9736 353.086 26.8535 358.459 26.8535H359.252C364.667 26.8535 369.155 22.9169 371.63 18.1007C377.159 7.34039 388.205 0.00015843 400.931 0C419.195 0 434.001 15.1191 434.001 33.7695L433.99 34.6416C433.537 52.8891 418.909 67.5391 400.931 67.5391C387.96 67.5389 376.734 59.9132 371.317 48.8128C368.923 43.9077 364.427 39.873 358.969 39.873C353.492 39.873 348.986 43.9356 346.589 48.8605C341.074 60.1913 329.449 68 316 68H34.001C15.2233 68 0 52.7777 0 34C0 15.2223 15.2233 0 34.001 0H316ZM400.931 2.44141C384.063 2.44163 370.303 16.419 370.303 33.7695C370.303 51.1201 384.063 65.0974 400.931 65.0977C417.798 65.0977 431.56 51.1202 431.56 33.7695C431.56 16.4189 417.798 2.44141 400.931 2.44141Z';

function Tagline() {
 return <h2 className="tagline">{['Logistics','shaped by scale','powered by precision'].map((line,i)=><span key={line} className="tagline-line" style={{marginLeft:i===1?'1.5em':0}}>{line.split(' ').map((word,j)=><span className="word-clip" key={word}><motion.span initial={{y:'100%',rotateX:45}} animate={{y:0,rotateX:0}} transition={{delay:0.3+i*0.2+j*0.08,duration:0.6,ease:EXPO_OUT}}>{word}</motion.span></span>)}</span>)}</h2>;
}
function RouteMap() {
 return <div className="route-map" aria-label="Global logistics network by sea, road and air">
  <img className="map-image" src={asset('map.png')} alt="World map"/>
  <svg className="route-lines" viewBox="0 0 299.037 142.509" aria-hidden="true">
   {routes.map((d,i)=><React.Fragment key={d}><motion.path d={d} fill="none" stroke="#FFDA00" strokeWidth="2.5" initial={{pathLength:0}} animate={{pathLength:1}} transition={{duration:1.1,delay:0.55+i*0.12,ease:EXPO_OUT}}/><polygon points="0,-4 8,0 0,4" fill="#ffda00"><animateMotion path={d} rotate="auto" dur={`${2.5+i*0.3}s`} begin={`${0.55+i*0.12}s`} repeatCount="indefinite"/></polygon></React.Fragment>)}
   {dots.map(([cx,cy],i)=><motion.g key={i} initial={{scale:0}} animate={{scale:1}} transition={{type:'spring',stiffness:420,damping:14,delay:0.8+i*0.1}} style={{transformOrigin:`${cx}px ${cy}px`}}><circle cx={cx} cy={cy} r="9.519" fill="#ffda00"/><circle cx={cx} cy={cy} r="3.389" fill="#002a35"/></motion.g>)}
  </svg>
  {[{name:'ship',left:'26%',top:'28.9%',rotate:0},{name:'car',left:'70.8%',top:'15.6%',rotate:9.73},{name:'plane',left:'55.2%',top:'52.1%',rotate:180}].map((icon,i)=><motion.div className="transport-icon" key={icon.name} style={{left:icon.left,top:icon.top}} initial={{scale:0,opacity:0}} animate={{scale:1,opacity:1}} transition={{type:'spring',stiffness:220,damping:16,delay:2.1+i*0.1}} whileHover={{scale:1.12,y:-4,boxShadow:'0 8px 20px rgba(0,0,0,0.25)',transition:{delay:0,type:'spring',stiffness:220,damping:16}}}><img src={asset(`${icon.name}.png`)} alt={icon.name==='car'?'Road freight':icon.name==='ship'?'Sea freight':'Air freight'} style={{transform:`rotate(${icon.rotate}deg) ${icon.name==='plane'?'scaleY(-1)':''}`}}/></motion.div>)}
  <motion.p className="map-description hidden sm:block" initial={{opacity:0}} animate={{opacity:1}} transition={{delay:2.4,duration:0.6}}>We ensure full transparency at every stage to build trust and drive results.</motion.p>
 </div>;
}
function App() {
 const [videoReady,setVideoReady]=useState(false);
 const [menuOpen,setMenuOpen]=useState(false);
 useEffect(()=>{const close=(e:KeyboardEvent)=>{if(e.key==='Escape')setMenuOpen(false)};window.addEventListener('keydown',close);return()=>window.removeEventListener('keydown',close)},[]);
 return <div className="hero relative flex flex-col overflow-hidden" style={{backgroundColor:'#1a1a2e'}}>
  <video className="absolute inset-0 w-full h-full object-cover z-0" autoPlay muted loop playsInline onCanPlay={()=>setVideoReady(true)} src={asset('background.mp4')} aria-hidden="true"/>
  <AnimatePresence>{videoReady&&<motion.div key="content" className="content flex flex-col flex-1 w-full" initial={{opacity:0}} animate={{opacity:1}} transition={{duration:0.3}}>
   <header className="header relative z-50 flex justify-between items-start">
    <motion.a href={import.meta.env.BASE_URL} aria-label="CARGOX GROUP home" className="logo" initial={{opacity:0,y:-20}} animate={{opacity:1,y:0}} transition={{duration:0.6,ease:EXPO_OUT}}>CARGOX<span>GROUP</span></motion.a>
    <nav className="desktop-nav hidden md:flex" aria-label="Main navigation">{nav.map((name,i)=><motion.button type="button" key={name} initial={{opacity:0,y:-10}} animate={{opacity:1,y:0}} transition={{delay:0.15+i*0.1,duration:0.6,ease:EXPO_OUT}} whileHover={{color:'#ffda00',x:2,transition:{delay:0,duration:0.2}}}>{name}<svg width="12" height="8" viewBox="0 0 12 8" fill="none" aria-hidden="true"><path d="m1 1 5 5 5-5" stroke="currentColor" strokeWidth="1.5"/></svg></motion.button>)}</nav>
    <button type="button" className="menu-toggle md:hidden" aria-label={menuOpen?'Close menu':'Open menu'} aria-expanded={menuOpen} aria-controls="mobile-menu" onClick={()=>setMenuOpen(!menuOpen)}>{menuOpen?<X size={28}/>:<Menu size={28}/>}</button>
   </header>
   <AnimatePresence>{menuOpen&&<motion.nav id="mobile-menu" aria-label="Mobile navigation" className="mobile-menu absolute inset-0 z-40 flex flex-col items-center justify-center md:hidden" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={{duration:0.25}}>{nav.map((name,i)=><motion.button key={name} initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:0.1+i*0.1,duration:0.4}} onClick={()=>setMenuOpen(false)}>{name}</motion.button>)}</motion.nav>}</AnimatePresence>
   <main className="main relative z-10 flex-1 grid grid-cols-1 lg:grid-cols-[2.17fr_1fr]">
    <h1 className="headline">{['BEYOND','BORDERS','AND LIMITS'].map((line,i)=><motion.span key={line} style={{marginLeft:i===1?'0.524em':0,color:i===1?'#002a35':'#fff'}} initial={{x:i===1?900:-900}} animate={{x:0}} transition={{duration:0.85,delay:i*0.13,ease:EXPO_OUT}}>{line}</motion.span>)}</h1>
    <div className="right-column flex flex-col"><Tagline/><RouteMap/></div>
   </main>
   <footer className="footer relative z-10 flex flex-col sm:flex-row justify-between">
    <motion.div className="stat flex items-center" initial={{opacity:0,y:24}} animate={{opacity:1,y:0}} transition={{delay:0.45,duration:0.65,ease:EXPO_OUT}}><div><div className="stat-number">3M+</div><div className="stat-copy">tons of cargo<br/>successfully delivered<br/>without delays</div></div><img className="cargo-icon" src={asset('cargo.png')} alt="Cargo container"/></motion.div>
    <motion.button type="button" className="cta" aria-label="Get in touch" initial={{opacity:0,x:60}} animate={{opacity:1,x:0}} transition={{delay:0.5,duration:0.65,ease:EXPO_OUT}} whileHover={{scale:1.08,y:-2,transition:{delay:0,duration:0.3}}} whileTap={{scale:0.97}}><svg className="pill" viewBox="0 0 434.001 68" preserveAspectRatio="none" aria-hidden="true"><path d={pill} fill="#ffda00" fillRule="evenodd"/></svg><span>Get in touch</span><svg className="cta-arrow" viewBox="0 0 16.89 20.37" fill="none" aria-hidden="true"><path d="M8.445 19.27V1.1M1.1 8.445 8.445 1.1l7.345 7.345" stroke="white" strokeWidth="2.2"/></svg></motion.button>
   </footer>
  </motion.div>}</AnimatePresence>
 </div>;
}
ReactDOM.createRoot(document.getElementById('root')!).render(<React.StrictMode><App/></React.StrictMode>);
