import { useEffect, useRef, type CSSProperties } from 'react';
import Hls from 'hls.js';
export default function HlsVideo({src,className='',style}:{src:string;className?:string;style?:CSSProperties}) {
 const ref=useRef<HTMLVideoElement>(null);
 useEffect(()=>{const video=ref.current!; if(src.endsWith('.m3u8')&&Hls.isSupported()){const hls=new Hls();hls.loadSource(src);hls.attachMedia(video);return()=>hls.destroy();}video.src=src;},[src]);
 return <video ref={ref} className={className} style={style} autoPlay loop muted playsInline aria-hidden="true"/>;
}
