import React, {useEffect, useState} from 'react';
import {createRoot} from 'react-dom/client';
import {Search,ShoppingBag,CornerUpLeft,Menu,X,ArrowUpRight,FlaskConical,Leaf,Droplets,Sun} from 'lucide-react';
import './style.css';
const asset=n=>`${import.meta.env.BASE_URL}assets/${n}`;
const cards=[{icon:FlaskConical,color:'#000',text:'Experience our newly enhanced natural formula'},{icon:Leaf,color:'#065f46',text:'Pure organic ingredients sourced sustainably'},{icon:Droplets,color:'#155e75',text:'Advanced bioavailability for maximum absorption'},{icon:Sun,color:'#b45309',text:'Clinically tested for daily energy & vitality'}];
const links=['About','Products','Promotions','Contact'];
function App(){
 const [menu,setMenu]=useState(false),[active,setActive]=useState(0);
 useEffect(()=>{const t=setInterval(()=>setActive(i=>(i+1)%4),3500);return()=>clearInterval(t)},[]);
 useEffect(()=>{document.body.style.overflow=menu?'hidden':'';const key=e=>{if(e.key==='Escape')setMenu(false)};window.addEventListener('keydown',key);return()=>{document.body.style.overflow='';window.removeEventListener('keydown',key)}},[menu]);
 const go=(name)=>{setMenu(false);document.querySelector(name==='About'?'#about':name==='Contact'?'#community':name==='Promotions'?'#formula':window.innerWidth>=1024?'#formula':'#products')?.scrollIntoView({behavior:'smooth',block:'center'});if(name==='Promotions')setActive(3)};
 return <main className="landing relative flex min-h-screen flex-col overflow-hidden">
 <nav className="navbar animate-fade-in flex items-center justify-between px-5 py-4 sm:px-8 lg:px-10 lg:py-5" aria-label="Main navigation">
  <a className="brand animate-slide-left delay-200" href="#" aria-label="TerraElix home">TerraElix</a>
  <div className="desktop-links animate-fade-in delay-400 hidden md:flex">{links.map(n=><a href={n==='About'?'#about':n==='Contact'?'#community':n==='Promotions'?'#formula':'#products'} onClick={e=>{e.preventDefault();go(n)}} key={n}>{n}</a>)}</div>
  <div className="nav-tools animate-slide-right delay-300 flex items-center">
   <button aria-label="Search products" onClick={()=>go('Products')}><Search size={20} strokeWidth={1.5}/></button>
   <button aria-label="View supplements" onClick={()=>go('Products')}><ShoppingBag size={20} strokeWidth={1.5}/></button>
   <button aria-label="Return to top" onClick={()=>window.scrollTo({top:0,behavior:'smooth'})}><CornerUpLeft size={20} strokeWidth={1.5}/></button>
   <img className="avatar" src={asset('avatar.png')} alt="TerraElix community member"/>
   <button className="menu-toggle md:hidden" aria-label={menu?'Close menu':'Open menu'} aria-expanded={menu} onClick={()=>setMenu(!menu)}>{menu?<X size={22}/>:<Menu size={22}/>}</button>
  </div>
 </nav>
 {menu&&<div className="mobile-menu" role="dialog" aria-modal="true" aria-label="Navigation"><button className="menu-close" aria-label="Close menu" onClick={()=>setMenu(false)}><X/></button>{links.map(n=><a key={n} href="#" onClick={e=>{e.preventDefault();go(n)}}>{n}</a>)}</div>}
 <section className="hero relative flex flex-1 flex-col justify-center px-5 sm:px-8 lg:px-10" aria-labelledby="headline">
  <h1 id="headline"><span className="headline-line">{[['The',false,300],['Power',false,400],['of',true,500]].map(([w,dim,d])=><Word key={w} word={w} dim={dim} delay={d}/>)}</span><span className="headline-line">{[['Nature',true,600],['in',true,700],['Every',false,800]].map(([w,dim,d])=><Word key={w} word={w} dim={dim} delay={d}/>)}</span><span className="headline-line"><Word word="Capsule" delay={900}/><img className="inline-capsule animate-scale-in delay-1000 hidden sm:inline-block" src={asset('capsule.png')} alt="Natural wellness quality seal"/></span></h1>
  <div className="cta animate-fade-up delay-600 flex flex-col sm:flex-row"><a className="explore" href="#products" onClick={e=>{e.preventDefault();go('Products')}}>Explore Now<ArrowUpRight size={27} strokeWidth={1.5}/></a><p>Discover our new plant-based supplements for daily balance and clean energy.</p></div>
 </section>
 <div id="products" className="mobile-product lg:hidden"><img className="animate-scale-in delay-800" src={asset('product.png')} alt="TerraElix plant-based supplements bottle"/></div>
 <div className="panels relative z-10 grid grid-cols-1 md:grid-cols-[2fr_1fr_2fr]">
  <section id="about" className="panel assessment animate-fade-up delay-900"><img className="botanical" src={asset('botanical.png')} alt=""/><div className="assessment-content"><h2>Start your personalized path to natural balance</h2><a href="#formula" onClick={()=>setActive(1)}>Personal Assessment</a></div></section>
  <section id="formula" className="panel formula animate-fade-up delay-1000" aria-label="Formula benefits"><div className="cards">{cards.map((c,i)=>{const Icon=c.icon;return <div key={c.text} className={`card ${active===i?'active':''}`} aria-hidden={active!==i}><span className="card-icon" style={{background:c.color}}><Icon size={23} strokeWidth={1.5}/></span><p>{c.text}</p></div>})}</div><div className="dots" aria-label="Choose formula benefit">{cards.map((c,i)=><button key={i} className={active===i?'active':''} aria-label={`Show benefit ${i+1}`} aria-pressed={active===i} onClick={()=>setActive(i)}><span/></button>)}</div></section>
  <section id="community" className="panel community animate-fade-up delay-1100"><img src={asset('community.png')} alt="Members of the TerraElix community"/><div><h2>+14K</h2><p>People have already optimized their wellness</p></div></section>
 </div>
 <img className="desktop-product animate-scale-in delay-700 hidden lg:block" src={asset('product.png')} alt="TerraElix plant-based supplements bottle"/>
 </main>
}
function Word({word,dim=false,delay}){return <span className={`word animate-word-reveal ${dim?'dim':''}`}><span style={{animationDelay:`${delay}ms`}}>{word}</span></span>}
createRoot(document.getElementById('root')).render(<App/>);
