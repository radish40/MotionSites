import {useState} from 'react';
const labels=['Private Discord & Networking','Weekly Market Alpha Drops','Exclusive Web3 Tooling Access'];
export default function SoapTiles({scrollProgress}:{scrollProgress:number}){
 const [hover,setHover]=useState(-1);const p=Math.max(0,Math.min(1,(scrollProgress-.75)/.22));const desktop=matchMedia('(min-width:768px)').matches;
 return <div className="soap-tiles" style={{opacity:scrollProgress>.75?1:0,pointerEvents:scrollProgress>.75?'auto':'none'}}>{labels.map((s,i)=><div className="soap-tile font-michroma" key={s} onMouseEnter={()=>setHover(i)} onMouseLeave={()=>setHover(-1)} style={{opacity:p,filter:`blur(${(1-p)*12}px)`,transform:`translateX(${(p-1)*[120,180,240][i]*(desktop?1:.25)}px) translateY(${desktop&&hover>=0&&hover!==i?(i<hover?-13.8:13.8):0}px) scale(${desktop&&hover===i?1.2:1})`,transitionDelay:`${i*100}ms`}}>{s}</div>)}</div>
}
