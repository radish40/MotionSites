import { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import Hls from 'hls.js';
type Props = {src:string;initialRotation:number;hoverOffset:{x:number;y:number;rotate:number;scale:number};zIndexClass:string;className?:string;index:number;active:boolean};
export default function YogaCard({src,initialRotation,hoverOffset,zIndexClass,className='',index,active}:Props){
 const video=useRef<HTMLVideoElement>(null);
 const [isHovered,setHovered]=useState(false);
 useEffect(()=>{const el=video.current!;if(Hls.isSupported()){const hls=new Hls({enableWorker:false});hls.loadSource(src);hls.attachMedia(el);return()=>hls.destroy();}el.src=src;},[src]);
 useEffect(()=>{const el=video.current!;if(isHovered && active){void el.play().catch(()=>{});}else{el.pause();el.currentTime=0;}},[isHovered,active]);
 return <motion.div role="button" tabIndex={active?0:-1} aria-label={`Preview yoga session ${index}`} onMouseEnter={()=>setHovered(true)} onMouseLeave={()=>setHovered(false)} onFocus={()=>setHovered(true)} onBlur={()=>setHovered(false)} onClick={()=>setHovered(true)} onKeyDown={e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();setHovered(v=>!v);}}} initial={{rotate:initialRotation,x:0,y:0,scale:1}} animate={isHovered?hoverOffset:{rotate:initialRotation,x:0,y:0,scale:1}} transition={{type:'spring',stiffness:200,damping:20}} className={`yoga-card relative shrink-0 rounded-3xl overflow-hidden aspect-[9/16] w-72 sm:w-[21rem] md:w-[24rem] bg-white border-[6px] sm:border-[8px] border-white shadow-[0_15px_40px_rgba(0,0,0,0.22)] cursor-pointer origin-bottom select-none focus-visible:outline-4 focus-visible:outline-black ${zIndexClass} ${className}`} style={{zIndex:isHovered?40:undefined}}>
 <video ref={video} poster={`${import.meta.env.BASE_URL}assets/card${index}.jpg`} muted loop playsInline preload="auto" className="w-full h-full object-cover rounded-2xl pointer-events-none"/>
 <div className="absolute inset-0 rounded-2xl ring-1 ring-black/10 pointer-events-none"/>
 </motion.div>;
}
