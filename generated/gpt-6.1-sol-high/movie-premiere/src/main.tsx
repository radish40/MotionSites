import React, { useEffect, useRef, useState, type CSSProperties, type PointerEvent } from 'react';
import { createRoot } from 'react-dom/client';
import { Bookmark, ChevronRight, Clock, Film, LayoutGrid, Popcorn, User } from 'lucide-react';
import './styles.css';

const posters = ['The Last Letter', 'Movie poster 2', 'Movie poster 3', 'Movie poster 4', 'Movie poster 5', 'Movie poster 6'].map((title, i) => ({title, src: `${import.meta.env.BASE_URL}assets/poster-${i+1}.webp`}));
const navItems = [{label:'Explore',Icon:LayoutGrid},{label:'Flicks',Icon:Film},{label:'Queue',Icon:Bookmark},{label:'Account',Icon:User}];
const SWIPE_THRESHOLD = 80;
function App() {
 const [order,setOrder] = useState<number[]>([0,1,2,3,4,5]);
 const [activeTab,setActiveTab] = useState('In Theaters');
 const [activeNav,setActiveNav] = useState(1);
 const [dragY,setDragY] = useState(0);
 const [dragging,setDragging] = useState(false);
 const [dropping,setDropping] = useState(false);
 const startY = useRef(0);
 const timer = useRef<ReturnType<typeof setTimeout>>();
 useEffect(()=>()=>clearTimeout(timer.current),[]);
 const dismiss = () => {
  if (dropping) return;
  setDropping(true); setDragging(false);
  timer.current=setTimeout(()=>{setOrder(items=>[...items.slice(1),items[0]]);setDragY(0);setDropping(false);},480);
 };
 const pointerDown = (e:PointerEvent<HTMLDivElement>) => {
  if(dropping || (e.pointerType==='mouse' && e.button!==0))return;
  startY.current=e.clientY;setDragging(true);e.currentTarget.setPointerCapture(e.pointerId);
 };
 const pointerMove = (e:PointerEvent<HTMLDivElement>) => {if(dragging)setDragY(Math.max(0,e.clientY-startY.current));};
 const pointerUp = () => {if(!dragging)return;setDragging(false);if(dragY>SWIPE_THRESHOLD)dismiss();else setDragY(0);};
 return <main className="h-screen w-screen bg-white flex items-center justify-center" aria-label="Cineva Mobile UI">
  <div className="phone-stage"><section className="phone-frame relative h-[780px] w-[375px] overflow-hidden bg-black text-white" aria-label="Cineva movie app">
   <div className="phone-background absolute inset-0" aria-hidden="true"><img src={posters[order[0]].src} alt="" className="h-full w-full object-cover scale-110 blur-[40px] brightness-50"/><div className="absolute inset-0 bg-black/30"/></div>
   <div className="dynamic-island absolute top-3 left-1/2 -translate-x-1/2 w-[126px] h-[34px] bg-black rounded-full" aria-hidden="true"/>
   <div className="folder-tabs animate-stagger-1 flex items-end absolute w-full">
    <button className={`premieres px-5 py-2.5 text-[11px] font-medium ${activeTab==='Premieres'?'text-white':'text-white/40'}`} onClick={()=>setActiveTab('Premieres')} aria-pressed={activeTab==='Premieres'}>Premieres</button>
    <div className="main-tabs relative flex items-center flex-1 rounded-tl-[28px] rounded-tr-[28px] bg-black py-4 px-1">
     <div className="tab-connector absolute -left-7 bottom-0 w-7 h-7"/>
     <button className={`px-5 text-xs font-medium ${activeTab==='In Theaters'?'text-white':'text-white/40'}`} onClick={()=>setActiveTab('In Theaters')} aria-pressed={activeTab==='In Theaters'}>In Theaters</button>
     <button className={`ml-auto flex items-center gap-2 pr-4 text-xs font-medium ${activeTab==='Upcoming'?'text-white':'text-white/40'}`} onClick={()=>setActiveTab('Upcoming')} aria-pressed={activeTab==='Upcoming'}>Upcoming<ChevronRight size={12}/></button>
    </div>
   </div>
   <div className="content-area absolute inset-x-0 bottom-0 bg-black rounded-tl-[28px]">
    <h1 className="date animate-stagger-2 text-center text-[58px] font-extrabold leading-none tracking-tight">05 <span className="text-white/80 font-bold">JUL</span></h1>
    <div className="card-stack animate-stagger-3" aria-label="Movie posters. Swipe down to see the next movie.">
     {order.slice(0,4).map((id,position)=>{
      const front=position===0;
      const style = {zIndex:4-position,transform:front?`translateY(${dragY}px) rotate(${dragY*.015}deg)`:`translateY(${-24*position}px) scale(${1-.05*position})`,opacity:front?Math.max(.2,1-dragY/600):[1,.85,.6,.4][position],transition:front&&(dragging||dropping)?'none':undefined,'--drop-start-y':`${dragY}px`,'--drop-start-rot':`${dragY*.015}deg`,'--drop-start-opacity':Math.max(.2,1-dragY/600)} as CSSProperties;
      return <div key={id} className={`stack-card absolute inset-0 overflow-hidden rounded-[20px] ${front?'front-card':''} ${front&&dropping?'dropping':''}`} style={style} onPointerDown={front?pointerDown:undefined} onPointerMove={front?pointerMove:undefined} onPointerUp={front?pointerUp:undefined} onPointerCancel={front?()=>{setDragging(false);setDragY(0);}:undefined} onKeyDown={front?e=>{if(e.key==='ArrowDown'||e.key==='Enter'||e.key===' '){e.preventDefault();dismiss();}}:undefined} tabIndex={front?0:-1} role={front?'button':undefined} aria-label={front?`${posters[id].title}. Swipe down or press Enter for next poster.`:undefined} aria-hidden={!front} data-poster={id}>
       <img src={posters[id].src} alt={posters[id].title} draggable={false} className="h-full w-full object-cover"/>
       <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"/>
       {front&&<div className="absolute left-4 top-4 flex flex-col items-start gap-2 pointer-events-none"><span className="badge"><Clock size={12}/>2h 15m</span><span className="badge"><Popcorn size={12}/>Sci-Fi</span></div>}
      </div>;
     })}
    </div>
   </div>
   <nav className="bottom-nav liquid-glass animate-stagger-4 absolute bottom-6 left-1/2 flex items-center rounded-full p-1.5" aria-label="Main navigation">
    {navItems.map(({label,Icon},i)=><button key={label} className={`nav-button flex items-center justify-center gap-2 rounded-full transition-all duration-300 ${activeNav===i?'active text-white':'text-white/40'}`} aria-label={label} aria-pressed={activeNav===i} onClick={()=>setActiveNav(i)}><Icon size={20} strokeWidth={1.7}/>{activeNav===i&&<span className="text-xs font-medium">{label}</span>}</button>)}
   </nav>
  </section></div>
 </main>;
}
createRoot(document.getElementById('root')!).render(<React.StrictMode><App/></React.StrictMode>);
