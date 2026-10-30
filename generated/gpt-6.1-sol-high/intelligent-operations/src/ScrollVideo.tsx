import {useEffect,useRef,useState} from 'react';
export const VIDEO='https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260729_102822_0e6c87e8-c141-4744-bf32-ad30db296371.mp4';
const local=import.meta.env.BASE_URL;
export default function ScrollVideo(){
 const videoRef=useRef<HTMLVideoElement>(null),canvasRef=useRef<HTMLCanvasElement>(null);
 const [decoded,setDecoded]=useState(false),[cached,setCached]=useState(false);
 useEffect(()=>{
  const video=videoRef.current!,canvas=canvasRef.current!,ctx=canvas.getContext('2d')!;
  let alive=true,raf=0,smoothed=0,frames:ImageBitmap[]=[],extracting=false,lastIndex=-1,resizeNeeded=true,blobUrl='';
  const cacheVideo=document.createElement('video');cacheVideo.crossOrigin='anonymous';cacheVideo.muted=true;cacheVideo.playsInline=true;cacheVideo.preload='auto';
  const resize=()=>{resizeNeeded=true};window.addEventListener('resize',resize);
  const waitEvent=(element:HTMLVideoElement,event:string)=>new Promise<void>((resolve,reject)=>{const timer=window.setTimeout(()=>{cleanup();reject(new Error('Frame extraction timed out'));},15000);const done=()=>{cleanup();resolve()};const fail=()=>{cleanup();reject(new Error('Frame unavailable'));};const cleanup=()=>{clearTimeout(timer);element.removeEventListener(event,done);element.removeEventListener('error',fail)};element.addEventListener(event,done,{once:true});element.addEventListener('error',fail,{once:true});});
  async function extract(){
   if(extracting)return;extracting=true;
   await new Promise(r=>setTimeout(r,300));if(!alive)return;
   try{
    const response=await fetch(video.currentSrc||VIDEO);if(!response.ok)throw new Error('Video download unavailable');const blob=await response.blob();if(!alive)return;blobUrl=URL.createObjectURL(blob);const loaded=waitEvent(cacheVideo,'loadeddata');cacheVideo.src=blobUrl;cacheVideo.load();await loaded;
    const count=Math.min(90,Math.max(24,Math.floor(cacheVideo.duration*12)));
    const buffer=document.createElement('canvas');buffer.width=Math.min(960,cacheVideo.videoWidth);buffer.height=Math.round(buffer.width*cacheVideo.videoHeight/cacheVideo.videoWidth);const context=buffer.getContext('2d')!;
    for(let i=0;i<count&&alive;i++){
     const time=Math.max(.001,i/(count-1)*(cacheVideo.duration-.05));
     if(Math.abs(cacheVideo.currentTime-time)>.001){const seek=waitEvent(cacheVideo,'seeked');cacheVideo.currentTime=time;await seek;}
     context.drawImage(cacheVideo,0,0,buffer.width,buffer.height);const frame=await createImageBitmap(buffer);if(!alive){frame.close();break;}frames.push(frame);canvas.dataset.extracted=String(frames.length);
    }
    if(alive&&frames.length===count){canvas.dataset.frameCount=String(count);setCached(true);canvas.dataset.ready='true';}
   }catch{frames.forEach(f=>f.close());frames=[];canvas.dataset.fallback='video-seek';}
  }
  const loaded=()=>{if(!alive)return;setDecoded(true);void extract();};video.addEventListener('loadeddata',loaded);if(video.readyState>=2)loaded();
  function tick(){if(!alive)return;const max=document.documentElement.scrollHeight-innerHeight;const target=Math.max(0,Math.min(1,max>0?scrollY/max:0));smoothed+=(target-smoothed)*.12;
   if(canvas.dataset.ready==='true'&&frames.length){const index=Math.round(smoothed*(frames.length-1));if(resizeNeeded||index!==lastIndex){if(resizeNeeded){const dpr=Math.min(devicePixelRatio||1,2);canvas.width=Math.round(innerWidth*dpr);canvas.height=Math.round(innerHeight*dpr);resizeNeeded=false;}const f=frames[index];const scale=Math.max(canvas.width/f.width,canvas.height/f.height);ctx.drawImage(f,(canvas.width-f.width*scale)/2,(canvas.height-f.height*scale)/2,f.width*scale,f.height*scale);lastIndex=index;canvas.dataset.frame=String(index);}}
   else if(video.readyState>=2&&Number.isFinite(video.duration)&&!video.seeking){const t=smoothed*(video.duration-.05);if(Math.abs(video.currentTime-t)>.04)video.currentTime=t;}
   raf=requestAnimationFrame(tick);
  }raf=requestAnimationFrame(tick);
  return()=>{alive=false;cancelAnimationFrame(raf);window.removeEventListener('resize',resize);video.removeEventListener('loadeddata',loaded);cacheVideo.removeAttribute('src');cacheVideo.load();if(blobUrl)URL.revokeObjectURL(blobUrl);frames.forEach(f=>f.close());};
 },[]);
 return <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-[#0a0a0a]" aria-hidden="true"><img src={`${local}hero-poster.jpg`} alt="" className={`video-layer ${decoded||cached?'opacity-0':'opacity-100'}`}/><video ref={videoRef} src={VIDEO} crossOrigin="anonymous" muted playsInline preload="auto" onError={e=>{const v=e.currentTarget;if(!v.src.endsWith('/hero.mp4'))v.src=`${local}hero.mp4`;}} className={`video-layer ${decoded&&!cached?'opacity-100':'opacity-0'}`}/><canvas ref={canvasRef} className={`video-layer ${cached?'opacity-100':'opacity-0'}`}/></div>;
}
