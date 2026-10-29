import {useEffect, useRef} from 'react';
interface SpotlightRevealProps {imageSrc:string; videoSrc:string; isPlaying?:boolean; baseRadius?:number;}
export default function SpotlightReveal({imageSrc,videoSrc,isPlaying=true,baseRadius=420}:SpotlightRevealProps){
 const videoRef=useRef<HTMLVideoElement>(null);
 const circles=useRef<(SVGCircleElement|null)[]>([]);
 const points=useRef(Array.from({length:6},()=>({x:-1000,y:-1000})));
 useEffect(()=>{const video=videoRef.current;if(!video)return;if(isPlaying)video.play().catch(()=>{});else video.pause();},[isPlaying]);
 useEffect(()=>{
  let targetX=innerWidth/2,targetY=innerHeight/2,frame=0;
  const mouse=(e:PointerEvent)=>{targetX=e.clientX;targetY=e.clientY;};
  const touch=(e:TouchEvent)=>{if(e.touches[0]){targetX=e.touches[0].clientX;targetY=e.touches[0].clientY;}};
  const animate=()=>{points.current.forEach((p,i)=>{const target=i?points.current[i-1]:{x:targetX,y:targetY};const lerp=i?.35:.2;p.x+=(target.x-p.x)*lerp;p.y+=(target.y-p.y)*lerp;circles.current[i]?.setAttribute('cx',String(p.x));circles.current[i]?.setAttribute('cy',String(p.y));});frame=requestAnimationFrame(animate);};
  window.addEventListener('pointermove',mouse);window.addEventListener('touchstart',touch,{passive:true});window.addEventListener('touchmove',touch,{passive:true});animate();
  return()=>{window.removeEventListener('pointermove',mouse);window.removeEventListener('touchstart',touch);window.removeEventListener('touchmove',touch);cancelAnimationFrame(frame);};
 },[]);
 return <div className="spotlight absolute inset-0 z-0 h-full w-full overflow-hidden bg-black pointer-events-none" aria-hidden="true">
  <video ref={videoRef} src={videoSrc} poster={imageSrc} className="absolute inset-0 h-full w-full object-cover" muted loop playsInline preload="auto"/>
  <svg className="absolute inset-0 h-full w-full" xmlns="http://www.w3.org/2000/svg">
   <defs><radialGradient id="holeGradient"><stop offset="0%" stopColor="black" stopOpacity="1"/><stop offset="60%" stopColor="black" stopOpacity="0.8"/><stop offset="100%" stopColor="black" stopOpacity="0"/></radialGradient>
    <mask id="spotlight-mask" maskContentUnits="userSpaceOnUse" x="0" y="0" width="100%" height="100%"><rect width="100%" height="100%" fill="white"/>{Array.from({length:6},(_,n)=>5-n).map(i=><circle key={i} ref={el=>{circles.current[i]=el;}} id={`trail-${i}`} cx="-1000" cy="-1000" r={baseRadius-i*35} fill="url(#holeGradient)" opacity={1-i*.15}/>)}</mask>
   </defs>
   <image href={imageSrc} width="100%" height="100%" preserveAspectRatio="xMidYMid slice" mask="url(#spotlight-mask)"/>
  </svg>
 </div>;
}
