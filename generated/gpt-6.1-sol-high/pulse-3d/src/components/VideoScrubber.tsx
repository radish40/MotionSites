import {useRef,useEffect,useState} from 'react';
import gsap from 'gsap';
export const VIDEO_SOURCES={hero:'https://pub-86dc5b5484314368ac5436a674b0d919.r2.dev/cloudinarry%20to%20cloudflare/202606021731-e_hqa6sn.mp4',drum:'https://pub-86dc5b5484314368ac5436a674b0d919.r2.dev/cloudinarry%20to%20cloudflare/2026060218225-v_kcy5rl.mp4'};
export default function VideoScrubber({scrollProgress,second=false}:{scrollProgress:number;second?:boolean}){
 const video=useRef<HTMLVideoElement>(null),container=useRef<HTMLDivElement>(null),progress=useRef(scrollProgress);
 const [loaded,setLoaded]=useState(false),[failed,setFailed]=useState(false);
 progress.current=scrollProgress;
 useEffect(()=>{let frame:number,current=0;
 const tick=()=>{const v=video.current;if(v&&v.readyState>=2){const duration=Number.isFinite(v.duration)?v.duration:4.2;const p=second?Math.max(0,Math.min(1,(progress.current-1.45)/2.05)):progress.current;current+=(Math.min(duration,Math.max(0,p*duration))-current)*0.15;if(!v.seeking&&Math.abs(v.currentTime-current)>0.01)v.currentTime=current;}frame=requestAnimationFrame(tick)};frame=requestAnimationFrame(tick);
 const move=(e:MouseEvent)=>gsap.to(container.current,{x:-(e.clientX/innerWidth-.5)*40,y:-(e.clientY/innerHeight-.5)*40,duration:1.2,ease:'power2.out',overwrite:'auto'});window.addEventListener('mousemove',move);return()=>{cancelAnimationFrame(frame);window.removeEventListener('mousemove',move);gsap.killTweensOf(container.current)}},[second]);
 return <div className={`video-layer ${second?'second-video':''}`}><div ref={container} className="video-parallax" style={{scale:'1.05'}}><video ref={video} src={`${import.meta.env.BASE_URL}assets/${second?'drum':'hero'}.mp4`} data-original-source={second?VIDEO_SOURCES.drum:VIDEO_SOURCES.hero} playsInline muted preload="auto" onLoadedData={()=>setLoaded(true)} onError={()=>setFailed(true)}/></div>{!loaded&&<div className="stream-loader"><div className="loader-rings"><i/><b/></div><span>{failed?'STREAM UNAVAILABLE':`LOADING ${second?'DRUM':'SCROLL'} STREAM...`}</span></div>}</div>
}
