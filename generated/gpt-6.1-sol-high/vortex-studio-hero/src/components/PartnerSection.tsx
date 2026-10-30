import {useEffect,useRef,useState,type MouseEvent} from 'react';
import Button from './Button';
import {asset,marqueeImages} from '../assets';
import {Reveal} from './Reveal';
type Trail={id:number;x:number;y:number;rotation:number;image:string;born:number};
export default function PartnerSection(){
 const [trails,setTrails]=useState<Trail[]>([]);const last=useRef(0),seq=useRef(0),raf=useRef(0);
 useEffect(()=>()=>cancelAnimationFrame(raf.current),[]);
 const cleanup=()=>{const now=performance.now();if(now-last.current>1000){setTrails([]);raf.current=0;return;}setTrails(t=>t.filter(x=>now-x.born<1000));raf.current=requestAnimationFrame(cleanup);};
 const move=(e:MouseEvent<HTMLDivElement>)=>{if(window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;const now=performance.now();if(now-last.current<80)return;last.current=now;const r=e.currentTarget.getBoundingClientRect();const id=seq.current++;setTrails(t=>[...t.filter(x=>now-x.born<1000),{id,x:e.clientX-r.left,y:e.clientY-r.top,rotation:Math.random()*20-10,image:marqueeImages[id%8],born:now}]);if(!raf.current)raf.current=requestAnimationFrame(cleanup);};
 return <section className="py-12 px-6"><Reveal><div onMouseMove={move} className="partner-panel relative overflow-hidden max-w-7xl mx-auto py-48 rounded-[40px] bg-white shadow-[0_4px_24px_rgba(0,0,0,0.06)] text-center">
 {trails.map(t=><img key={t.id} src={asset(t.image)} alt="" aria-hidden="true" className="cursor-thumbnail pointer-events-none absolute w-40 rounded-lg shadow-lg" style={{left:t.x,top:t.y,'--rotation':`${t.rotation}deg`} as React.CSSProperties}/>)}
 <div className="relative z-10 pointer-events-none"><h2 className="font-accent text-[48px] md:text-[64px] lg:text-[80px] text-heading mb-12 leading-none">Partner with us</h2><Button className="pointer-events-auto !pl-2 !pr-6 !py-2 gap-3"><img src={asset('avatar-3.jpg')} alt="" className="w-10 h-10 rounded-full object-cover"/>Start chat with Viktor</Button></div>
 </div></Reveal></section>;
}
