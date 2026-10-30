import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { ShoppingBag, ArrowUpRight, X, ChevronRight, Check } from 'lucide-react';
import './styles.css';

const BG_IMAGE_1 = `${import.meta.env.BASE_URL}assets/base.webp`;
const BG_IMAGE_2 = `${import.meta.env.BASE_URL}assets/reveal.webp`;
const garments = [
 { title: 'CYBER-TEX OVERCOAT', price: 850, tag: 'LIMITED EDITION' },
 { title: 'GEO-MESH TECH HOODIE', price: 320, tag: 'NEW DROP' },
 { title: 'ORBITAL TAPERED TROUSERS', price: 290, tag: 'IN STOCK' },
 { title: 'MODULAR ALL-WEATHER VEST', price: 410, tag: 'PRE-ORDER' },
];
const collections = [
 ['SERIES 01', 'SYNTHETIC HORIZONS', 'Ultra-durable weather-sealed fabrics with minimalist silhouette architecture.'],
 ['SERIES 02', 'KINETIC FORM', 'Ergonomic streetwear designed for maximum mobility and temperature equilibrium.'],
 ['SERIES 03', 'MONOCHROME ZERO', 'Pure black and white structural tailoring crafted from 100% recycled polymers.'],
];
const journal = [
 ['AUG 2026', 'THE ARCHITECTURE OF NEXT-GEN TEXTILES', '4 MIN READ'],
 ['JUL 2026', 'CIRCULAR DESIGN IN HIGH-END APPAREL', '6 MIN READ'],
 ['JUN 2026', 'MINIMALISM AS A FUNCTIONAL STATEMENT', '3 MIN READ'],
];
type Panel = 'shop' | 'collections' | 'journal' | 'cart' | null;
function Corner({ position = 'tl' }: { position?: string }) {
 const paths: Record<string,string> = {tl:'M0 11.5V0.5H11.5',tr:'M0.5 0.5H11.5V11.5',bl:'M0 0.5V11.5H11.5',br:'M0.5 11.5H11.5V0.5'};
 return <svg className={`corner corner-${position}`} viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d={paths[position]}/></svg>;
}
function Checker() { return <svg className="checker" viewBox="0 0 36 18" aria-hidden="true">{Array.from({length:4},(_,row)=>Array.from({length:8},(_,col)=><rect key={`${row}-${col}`} x={col*4.5+(row%2?2.25:0)} y={row*4.5} width="3.8" height="3.8"/>))}</svg> }
function Globe() { return <svg className="globe" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true"><circle cx="32" cy="32" r="28"/><path d="M4 32h56M32 4v56"/><ellipse cx="32" cy="22" rx="26" ry="10"/><ellipse cx="32" cy="42" rx="26" ry="10"/><ellipse cx="32" cy="32" rx="19" ry="28"/><ellipse cx="32" cy="32" rx="9" ry="28"/></svg> }
function ImageRevealBackground() {
 const revealRef = useRef<HTMLDivElement>(null);
 const patternRef = useRef<SVGPatternElement>(null);
 const [cell, setCell] = useState(40);
 useEffect(()=>{
  const media = window.matchMedia('(min-width: 1024px)');
  let frame = 0, width=innerWidth, height=innerHeight;
  const mouse={x:-1000,y:-1000}, smooth={...mouse}, offset={x:0,y:0};
  const canvas=document.createElement('canvas'); const ctx=canvas.getContext('2d')!;
  const resize=()=>{width=innerWidth;height=innerHeight;canvas.width=width;canvas.height=height;setCell(Math.round(Math.min(64,Math.max(36,width*0.028))))};
  const move=(e:MouseEvent)=>{mouse.x=e.clientX;mouse.y=e.clientY};
  const animate=()=>{
   if(media.matches){
    smooth.x+=(mouse.x-smooth.x)*0.1;smooth.y+=(mouse.y-smooth.y)*0.1;
    const radius=Math.round(Math.min(420,Math.max(160,width*0.16)));
    ctx.clearRect(0,0,width,height);
    const gradient=ctx.createRadialGradient(smooth.x,smooth.y,0,smooth.x,smooth.y,radius);
    [[0,1],[0.4,1],[0.6,0.75],[0.75,0.4],[0.88,0.12],[1,0]].forEach(([stop,alpha])=>gradient.addColorStop(stop,`rgba(255,255,255,${alpha})`));
    ctx.fillStyle=gradient;ctx.fillRect(0,0,width,height);
    const url=`url(${canvas.toDataURL()})`;
    if(revealRef.current){revealRef.current.style.maskImage=url;revealRef.current.style.webkitMaskImage=url;}
    const cx=smooth.x/width-0.5,cy=smooth.y/height-0.5;
    offset.x+=(cx*16-offset.x)*0.06;offset.y+=(cy*16-offset.y)*0.06;
    patternRef.current?.setAttribute('x',String(offset.x));patternRef.current?.setAttribute('y',String(offset.y));
   }
   frame=requestAnimationFrame(animate);
  };
  resize();window.addEventListener('resize',resize);window.addEventListener('mousemove',move);frame=requestAnimationFrame(animate);
  return ()=>{cancelAnimationFrame(frame);window.removeEventListener('resize',resize);window.removeEventListener('mousemove',move)};
 },[]);
 return <div className="image-background" aria-hidden="true"><div className="image-layer" style={{backgroundImage:`url(${BG_IMAGE_1})`}}/><div ref={revealRef} className="image-layer reveal-layer" style={{backgroundImage:`url(${BG_IMAGE_2})`}}/><svg className="grid-overlay" width="100%" height="100%"><defs><pattern ref={patternRef} id="grid" width={cell} height={cell} patternUnits="userSpaceOnUse"><path d={`M ${cell} 0 L 0 0 0 ${cell}`} fill="none" stroke="#64748b" strokeWidth="0.6"/></pattern></defs><rect width="100%" height="100%" fill="url(#grid)"/></svg></div>;
}
function App(){
 const [panel,setPanel]=useState<Panel>(null);
 const [cart,setCart]=useState<number[]>([]);
 const [toast,setToast]=useState('');
 const toastTimer=useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
 const drawerRef=useRef<HTMLElement>(null);
 const notify=(message:string)=>{setToast(message);clearTimeout(toastTimer.current);toastTimer.current=setTimeout(()=>setToast(''),3000)};
 useEffect(()=>()=>clearTimeout(toastTimer.current),[]);
 useEffect(()=>{
  if(!panel)return;
  const previous=document.activeElement as HTMLElement;
  document.body.style.overflow='hidden';drawerRef.current?.querySelector<HTMLButtonElement>('button')?.focus();
  const keys=(e:KeyboardEvent)=>{
   if(e.key==='Escape')setPanel(null);
   if(e.key==='Tab'){
    const focusables=drawerRef.current?.querySelectorAll<HTMLElement>('button');
    if(!focusables?.length)return;
    const first=focusables[0],last=focusables[focusables.length-1];
    if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}
    else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}
   }
  };
  window.addEventListener('keydown',keys);
  return()=>{document.body.style.overflow='';window.removeEventListener('keydown',keys);previous?.focus()};
 },[panel]);
 const titles={shop:'Catalog',collections:'Archive 2026',journal:'Editorial',cart:'Shopping Bag'};
 return <div className="site-shell"><ImageRevealBackground/>
  <header className="site-header"><button className="logo font-orbitron" aria-label="LGPSM home" onClick={()=>setPanel(null)}>LGPSM<span>˚</span></button><nav aria-label="Main navigation">{(['shop','collections','journal'] as const).map(p=><button key={p} onClick={()=>setPanel(p)}>{p.toUpperCase()}</button>)}<span className="nav-divider" aria-hidden="true">|</span><button className="cart-button" aria-label={`Shopping bag, ${cart.length} items`} onClick={()=>setPanel('cart')}><ShoppingBag strokeWidth={1.5}/>{cart.length>0&&<span className="cart-count">{cart.length}</span>}</button></nav></header>
  <main className="hero"><div className="hero-left"><Corner/><h1 className="font-orbitron"><span>FUTURE</span><span>FORWARD</span><span className="fashion-line">FASHION<Checker/></span></h1><Corner position="bl"/><button className="shop-cta" onClick={()=>setPanel('shop')}>SHOP NOW<ArrowUpRight strokeWidth={1.5}/></button></div><div className="feature">{['tl','tr','bl','br'].map(p=><Corner key={p} position={p}/>)}<Globe/><p>BEYOND TRENDS.<br/>BUILT FOR TOMORROW.</p></div></main>
  <section className="mobile-media" aria-label="Future forward fashion campaign"><img src={BG_IMAGE_1} alt="Futuristic fashion portrait in sculptural white technical apparel"/></section>
  {panel&&<div className="drawer-layer"><div className="backdrop" onClick={()=>setPanel(null)}/><aside ref={drawerRef} className="drawer" role="dialog" aria-modal="true" aria-labelledby="drawer-title"><div className="drawer-header"><h2 id="drawer-title" className="font-orbitron">{titles[panel]}</h2><button className="close-button" aria-label="Close drawer" onClick={()=>setPanel(null)}><X strokeWidth={1.5}/></button></div><div className="drawer-body">
   {panel==='shop'&&<><p className="drawer-subtitle">Featured Garments</p>{garments.map((g,i)=><article className="product-row" key={g.title}><p className="micro">{g.tag}</p><h3>{g.title}</h3><div className="product-bottom"><span>${g.price}</span><button className="add-button" onClick={()=>{setCart([...cart,i]);notify(`Added "${g.title}" to your shopping bag.`)}}>ADD</button></div></article>)}</>}
   {panel==='collections'&&<><p className="drawer-subtitle">Season Lineup</p>{collections.map(([series,title,desc])=><article className="collection-row" key={series}><p className="micro">{series}</p><h3 className="font-orbitron">{title}</h3><p>{desc}</p></article>)}</>}
   {panel==='journal'&&<><p className="drawer-subtitle">Latest Dispatches</p>{journal.map(([date,title,time])=><article className="journal-row" key={date}><p className="micro">{date}</p><h3>{title}</h3><p className="micro">{time}</p></article>)}</>}
   {panel==='cart'&&(cart.length===0?<div className="empty-cart"><ShoppingBag strokeWidth={1}/><p>Your shopping bag is empty.</p></div>:cart.map((id,index)=><article className="cart-row" key={`${id}-${index}`}><h3>{garments[id].title}</h3><div className="product-bottom"><span>${garments[id].price}</span><button className="remove-button" onClick={()=>setCart(cart.filter((_,i)=>i!==index))}>Remove</button></div></article>))}
  </div><footer className="drawer-footer">{panel==='cart'?(cart.length>0&&<button className="checkout-button" onClick={()=>{notify('Order submitted successfully!');setCart([]);setPanel(null)}}>CHECKOUT NOW<ChevronRight/></button>):<p>LGPSM © 2026 — FUTURE FORWARD FASHION</p>}</footer></aside></div>}
  {toast&&<div className="toast" role="status"><Check/><p>{toast}</p></div>}
 </div>
}
createRoot(document.getElementById('root')!).render(<React.StrictMode><App/></React.StrictMode>);
