import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';

const TEXT_COLOR = '#000000';
const HERO_TEXT = '#332023';
const BG_BLUE = '#4BB3ED';
const BG_LIME = '#BDE84F';
const EASE = 'cubic-bezier(0.22, 1, 0.36, 1)';
const asset = (name: string) => `${import.meta.env.BASE_URL}assets/${name}`;
function anim(visible: boolean, delay: number, opts: { y?: number; x?: number; duration?: number } = {}) {
  const { y = 20, x = 0, duration = 1600 } = opts;
  const translateFrom = y !== 0 ? `translateY(${y}px)` : x !== 0 ? `translateX(${x}px)` : 'none';
  return { style: { opacity: visible ? 1 : 0, transform: visible ? 'translate(0,0)' : translateFrom, transition: `opacity ${duration}ms ${EASE} ${delay}ms, transform ${duration}ms ${EASE} ${delay}ms` } as React.CSSProperties };
}
type Product = { name: string; size: string; image: string; notes?: {label: string; ingredient: string}[] };
const PRODUCT: Product = { name: 'Eau So Fresh', size: '100 ml / 3.4 oz', image: asset('fresh.webp') };
const SCENT_PRODUCT = { name: 'Eau So Sweet', size: '100 ml / 3.3 oz', image: asset('sweet.webp'), notes: [ {label: 'Fruity top', ingredient: 'WHITE RASPBERRIES'}, {label: 'Floral heart', ingredient: 'DAISY TREE PETALS'}, {label: 'Feminine base', ingredient: 'SUGAR MUSKS'} ] };
const WILD_PRODUCT = { name: 'Eau So Extra', size: '100 ml / 3.3 oz', image: asset('wild.webp'), notes: [ {label: 'Top', ingredient: 'BANANA BLOSSOM ACCORD'}, {label: 'Heart', ingredient: 'CHOCOLATE DAISY ACCORD'}, {label: 'Base', ingredient: 'VETIVER OIL'} ] };
function Video({name}: {name: string}) {
  return <video autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover" style={{zIndex:0}} ref={el => { if(el) el.playbackRate=1; }}><source src={asset(name)} type="video/mp4"/></video>;
}
function HeroCard({mobile, visible, onAdd}: {mobile?:boolean; visible:boolean; onAdd:()=>void}) {
  return <div className={mobile ? 'sm:hidden flex items-center gap-3 mt-4 mr-5 mb-8 px-4 py-4 rounded-2xl' : 'hidden sm:flex absolute bottom-10 right-10 rounded-2xl items-center gap-2 px-5 py-4'} style={{...(!mobile ? {zIndex:30,minWidth:260} : {}), backgroundColor:'#ffffff',boxShadow:'0 4px 24px rgba(51,32,35,0.08), 0 1px 4px rgba(51,32,35,0.06)',...anim(visible,1300,{y:20,duration:1400}).style}}>
    <div className="flex-shrink-0 overflow-hidden" style={{width:mobile?56:60,height:mobile?70:76,borderRadius:mobile?6:8}}><img src={PRODUCT.image} alt={PRODUCT.name} style={{width:'130%',height:'130%',objectFit:'contain',display:'block',marginLeft:'-15%',marginTop:'-15%'}}/></div>
    <div className={`flex flex-col ${mobile?'flex-1':''}`}><span className="text-sm font-semibold tracking-wide leading-tight" style={{color:HERO_TEXT}}>{PRODUCT.name}</span><span className="tracking-wide" style={{fontSize:11,fontWeight:500,marginTop:3,color:HERO_TEXT}}>{PRODUCT.size}</span><button onClick={onAdd} className="text-xs font-bold tracking-widest uppercase self-start leading-tight relative overflow-hidden group" style={{marginTop:mobile?12:14,color:HERO_TEXT}}><span className="relative z-10">Add to Cart</span><span className="absolute bottom-0 left-0 h-px w-full origin-left transition-transform duration-300 ease-out scale-x-100 group-hover:scale-x-0" style={{backgroundColor:HERO_TEXT}}/>{!mobile && <span className="absolute bottom-0 left-0 h-px w-full origin-right transition-transform duration-300 ease-out delay-150 scale-x-0 group-hover:scale-x-100" style={{backgroundColor:HERO_TEXT,opacity:.4}}/>}</button></div>
  </div>;
}
function ProductPanel({bg,product,notes,visible,noteStyle='normal',onShop}: {bg:string;product:Product;notes:{label:string;ingredient:string}[];visible:boolean;noteStyle?:string;onShop:()=>void}) {
  return <div className="relative flex flex-col px-6 md:px-8 pt-6 md:pt-8 pb-8 md:pb-10" style={{backgroundColor:bg,minHeight:'100%'}}>
    <div className="flex items-start justify-between mb-auto" {...anim(visible,0,{y:12,duration:1400})}><span className="text-xs font-normal" style={{color:TEXT_COLOR}}>{noteStyle==='bold'?'Daisy wild':'Daisy love'}</span><span className="text-xs font-normal" style={{color:TEXT_COLOR}}>{noteStyle==='bold'?'Playful':'Sweet'}</span></div>
    <div className="flex flex-col items-center py-8" style={{flex:1,justifyContent:'center',...anim(visible,300,{y:40,duration:1800}).style}}><div className="overflow-hidden" style={{width:'clamp(140px,40%,220px)',aspectRatio:'220/340',backgroundColor:'#D9D9D9',borderRadius:2,flexShrink:0}}><img src={product.image} alt={product.name} style={{width:'100%',height:'100%',objectFit:'cover',display:'block'}}/></div><div className="text-center mt-4" {...anim(visible,600,{y:10,duration:1400})}><p className="text-sm font-normal" style={{color:TEXT_COLOR}}>{product.name}</p><p className="text-xs font-normal mt-1" style={{color:TEXT_COLOR}}>{product.size}</p></div></div>
    <div className="flex items-end justify-between gap-4 flex-wrap"><div className="flex flex-col gap-0.5" {...anim(visible,900,{y:16,duration:1400})}>{notes.map(note=><div key={note.ingredient}><p className="text-xs leading-snug" style={{color:TEXT_COLOR,fontWeight:noteStyle==='bold'?700:400}}>{note.label}</p><p className="text-xs font-bold tracking-widest uppercase leading-snug" style={{color:TEXT_COLOR}}>{note.ingredient}</p></div>)}</div><button onClick={onShop} className="text-xs font-bold tracking-widest uppercase border px-6 py-3 relative group shrink-0" style={{color:TEXT_COLOR,borderColor:TEXT_COLOR,backgroundColor:'transparent',...anim(visible,1150,{y:16,duration:1400}).style}}><span className="relative z-10 group-hover:text-black transition-colors duration-500">SHOP NOW</span><span className="absolute inset-0 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-out" style={{backgroundColor:'#ffffff'}}/></button></div>
  </div>;
}
function ScentSection({wild=false,onShop}: {wild?:boolean;onShop:()=>void}) {
  const ref=useRef<HTMLElement>(null); const [visible,setVisible]=useState(false);
  useEffect(()=>{const observer=new IntersectionObserver(entries=>{if(entries.some(e=>e.isIntersecting)){setVisible(true);observer.disconnect();}},{threshold:.15}); if(ref.current)observer.observe(ref.current);return()=>observer.disconnect();},[]);
  const product=wild?WILD_PRODUCT:SCENT_PRODUCT;
  const panel=<ProductPanel bg={wild?BG_LIME:BG_BLUE} product={product} notes={product.notes} visible={visible} noteStyle={wild?'bold':'normal'} onShop={onShop}/>;
  return <section ref={ref} id={wild?'wild-scent':'scent-finder'} className="relative w-full" aria-label={wild?'Daisy wild':'Daisy love'}><div className={`${wild?'flex flex-col-reverse':'flex flex-col'} md:grid md:min-h-screen`} style={{gridTemplateColumns:'1fr 1fr'}}>{!wild&&panel}<div className="hidden md:block relative overflow-hidden" style={{backgroundColor:'#111',minHeight:'100%'}}><Video name={wild?'wild.mp4':'sweet.mp4'}/></div><div className="md:hidden relative overflow-hidden" style={{height:'75vw',backgroundColor:'#111'}}><Video name={wild?'wild.mp4':'sweet.mp4'}/></div>{wild&&panel}</div></section>;
}
function App(){
  const heroRef=useRef<HTMLElement>(null); const [v,setV]=useState(false);
  const dialog=useRef<HTMLDialogElement>(null); const [cart,setCart]=useState<Product[]>([]);
  useEffect(()=>{const timeout=setTimeout(()=>setV(true),200);return()=>clearTimeout(timeout);},[]);
  const add=(product:Product)=>{setCart(items=>[...items,product]);dialog.current?.showModal();};
  return <div className="min-h-screen" style={{backgroundColor:'#fff'}}>
    <section ref={heroRef} className="relative w-full min-h-screen flex flex-col justify-end overflow-hidden" aria-label="Sweet Daisy personal scent finder">
      <Video name="hero.mp4"/>
      <header className="absolute top-0 left-0 w-full flex items-center justify-between px-5 sm:px-8 py-5 sm:py-6" style={{zIndex:40,...anim(v,100,{y:-10,duration:1400}).style}}><div className="font-black text-xs sm:text-sm tracking-widest leading-tight uppercase" style={{color:HERO_TEXT}}><div>Wild Daisy</div><div>Fragrances</div></div><nav className="flex gap-5 sm:gap-8">{['Shop Now','Cart'].map(label=><a key={label} href={label==='Cart'?'#cart':'#scent-finder'} onClick={label==='Cart'?e=>{e.preventDefault();dialog.current?.showModal();}:undefined} className="text-xs font-bold tracking-widest uppercase relative group" style={{color:HERO_TEXT}}><span>{label}</span><span className="absolute -bottom-0.5 left-0 h-px w-full origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out" style={{backgroundColor:HERO_TEXT}}/></a>)}</nav></header>
      <div className="hidden sm:block absolute right-8 md:right-10" style={{top:'50%',transform:'translateY(-50%)',zIndex:20,...anim(v,1000,{x:16,duration:1600}).style}}><span className="text-xl tracking-widest" style={{fontFamily:'Georgia, serif',fontStyle:'italic',color:HERO_TEXT}}>Scroll</span></div>
      <HeroCard visible={v} onAdd={()=>add(PRODUCT)}/>
      <div className="hidden sm:block absolute left-6 md:left-8" style={{top:'50%',transform:v?'translateY(-50%) translateX(0)':'translateY(-50%) translateX(-24px)',fontFamily:'"Playfair Display", "Didot", "Bodoni MT", "Times New Roman", serif',fontStyle:'italic',fontWeight:400,fontSize:'clamp(2.5rem,6.5vw,6rem)',lineHeight:1,letterSpacing:'-0.02em',zIndex:10,color:HERO_TEXT,opacity:v?1:0,transition:`opacity 1600ms ${EASE} 500ms, transform 1600ms ${EASE} 500ms`}}>01</div>
      <div className="relative pb-0 sm:pb-12 pl-5 sm:pl-8 pr-0 sm:pr-8" style={{zIndex:10}}><h1 className="font-medium uppercase leading-tight sm:leading-none" style={{fontSize:'clamp(2.2rem,8vw,4rem)',letterSpacing:'-0.01em'}}>{[true,false].flatMap(mobile=>['Sweet Daisy','Personal Scent','Finder'].map((line,i)=><span key={`${mobile}-${line}`} className={mobile?'block sm:hidden':'hidden sm:block'} style={{color:mobile?(i===0?'#ffffff':'rgba(255,255,255,0.8)'):(i===0?HERO_TEXT:'#B0A2A1'),...(mobile?{textShadow:i===0?'0 2px 16px rgba(0,0,0,0.4)':'0 2px 12px rgba(0,0,0,0.35)'}:{}),...anim(v,600+i*200,{y:24,duration:1600}).style}}>{line}</span>))}</h1><HeroCard mobile visible={v} onAdd={()=>add(PRODUCT)}/></div>
    </section>
    <ScentSection onShop={()=>add(SCENT_PRODUCT)}/><ScentSection wild onShop={()=>add(WILD_PRODUCT)}/>
    <dialog ref={dialog} id="cart" className="rounded-2xl p-6 w-[calc(100%-40px)] max-w-md text-[#332023]" onClick={e=>{if(e.target===dialog.current)dialog.current.close();}}><div className="flex justify-between items-center gap-8 mb-6"><h2 className="font-bold uppercase tracking-widest">Cart</h2><button className="text-xs underline" onClick={()=>dialog.current?.close()}>Close</button></div>{cart.length===0?<p className="text-sm">Your cart is empty.</p>:<ul className="space-y-4">{cart.map((item,i)=><li key={i} className="flex items-center gap-4"><img className="w-12 h-16 object-contain" src={item.image} alt=""/><div className="flex-1"><p className="text-sm font-semibold">{item.name}</p><p className="text-xs">{item.size}</p></div><button className="text-xs underline" onClick={()=>setCart(items=>items.filter((_,index)=>index!==i))}>Remove</button></li>)}</ul>}<button className="border border-current w-full py-3 mt-6 text-xs font-bold tracking-widest uppercase" onClick={()=>dialog.current?.close()}>Continue shopping</button></dialog>
  </div>;
}
createRoot(document.getElementById('root')!).render(<React.StrictMode><App/></React.StrictMode>);
