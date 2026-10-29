const {useEffect,useRef,useState}=React;
const {motion}=window.Motion;
function Icon({name,className='h-5 w-5'}) {
 const paths={image:'M5 21q-.825 0-1.412-.587T3 19V5q0-.825.588-1.412T5 3h14q.825 0 1.413.588T21 5v14q0 .825-.587 1.413T19 21H5Zm1-4h12l-3.75-5-3 4L9 13l-3 4Z',movie:'M4 6.47 5.76 10H20v8H4V6.47M22 4h-4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4c-1.1 0-1.99.89-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4Z',light:'M9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9v1Zm3-19C8.14 2 5 5.14 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.86-3.14-7-7-7Z'};
 return <svg className={className} viewBox="0 0 24 24" fill={paths[name]||name==='play'?'currentColor':'none'} stroke={paths[name]||name==='play'?'none':'currentColor'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]?<path d={paths[name]}/>:name==='arrow'?<><path d="M7 17L17 7"/><path d="M7 7h10v10"/></>:name==='play'?<polygon points="6 4 20 12 6 20 6 4"/>:name==='clock'?<><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>:<><circle cx="12" cy="12" r="9"/><ellipse cx="12" cy="12" rx="4" ry="9"/><path d="M3 12h18"/></>}</svg>
}
function FadingVideo({src,className,style}) {
 const ref=useRef(null), rafRef=useRef(null), fadingOutRef=useRef(false);
 useEffect(()=>{
  const video=ref.current;let timeout;const FADE_MS=500,FADE_OUT_LEAD=.55;
  function fadeTo(target,duration=FADE_MS){cancelAnimationFrame(rafRef.current);const start=performance.now(),from=parseFloat(video.style.opacity)||0;function tick(now){const progress=Math.min((now-start)/duration,1);video.style.opacity=String(from+(target-from)*progress);if(progress<1)rafRef.current=requestAnimationFrame(tick)}rafRef.current=requestAnimationFrame(tick)}
  const play=()=>video.play().catch(()=>{});
  function loaded(){video.style.opacity='0';play();fadeTo(1)}
  function update(){const remaining=video.duration-video.currentTime;if(!fadingOutRef.current&&remaining<=FADE_OUT_LEAD&&remaining>0){fadingOutRef.current=true;fadeTo(0)}}
  function ended(){video.style.opacity='0';timeout=setTimeout(()=>{video.currentTime=0;play();fadingOutRef.current=false;fadeTo(1)},100)}
  video.addEventListener('loadeddata',loaded);video.addEventListener('timeupdate',update);video.addEventListener('ended',ended);if(video.readyState>=2)loaded();
  return()=>{cancelAnimationFrame(rafRef.current);clearTimeout(timeout);video.removeEventListener('loadeddata',loaded);video.removeEventListener('timeupdate',update);video.removeEventListener('ended',ended)};
 },[src]);
 return <video ref={ref} src={src} autoPlay muted playsInline preload="auto" aria-hidden="true" className={className} style={{...style,opacity:0}}/>;
}
function BlurText({text,className}){
 const ref=useRef(null),[visible,setVisible]=useState(false);
 useEffect(()=>{const observer=new IntersectionObserver(([entry])=>{if(entry.isIntersecting){setVisible(true);observer.disconnect()}},{threshold:.1});observer.observe(ref.current);return()=>observer.disconnect()},[]);
 return <p ref={ref} className={className} aria-label={text} style={{display:'flex',flexWrap:'wrap',justifyContent:'center',rowGap:'.1em'}}>{text.split(' ').map((word,i)=><motion.span aria-hidden="true" key={i} initial={{filter:'blur(10px)',opacity:0,y:50}} animate={visible?{filter:['blur(10px)','blur(5px)','blur(0px)'],opacity:[0,.5,1],y:[50,-5,0]}:undefined} transition={{duration:.7,times:[0,.5,1],ease:'easeOut',delay:i*.1}} style={{display:'inline-block',marginRight:'.28em'}}>{word}</motion.span>)}</p>
}
window.Icon=Icon;window.FadingVideo=FadingVideo;window.BlurText=BlurText;
