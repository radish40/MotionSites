import {useState,useRef,useEffect} from 'react';
import Header from './components/Header';
import VideoScrubber from './components/VideoScrubber';
import SecondVideoScrubber from './components/SecondVideoScrubber';
import ScrollExitSplitText from './components/ScrollExitSplitText';
import SoapTiles from './components/SoapTiles';
import CylindricalTextDrum from './components/CylindricalTextDrum';
import Marquee from './components/Marquee';
const clamp=(n:number)=>Math.max(0,Math.min(3.5,n));
export default function App(){
 const [scrollProgress,setScrollProgress]=useState(0),[lerpedScrollProgress,setLerped]=useState(0),[activeSectionId,setActive]=useState('hero');
 const target=useRef(0),navFrame=useRef(0);
 const update=(p:number)=>{target.current=clamp(p);setScrollProgress(target.current);setActive(p<.18?'hero':p<.45?'projects':p<.68?'expertise':p<1.15?'about':'contact')};
 useEffect(()=>{document.body.style.overflow='hidden';document.documentElement.style.overflow='hidden';let y=0,frame=0,current=0;
 const stop=()=>cancelAnimationFrame(navFrame.current);
 const wheel=(e:WheelEvent)=>{e.preventDefault();stop();update(target.current+e.deltaY*.0006)};
 const start=(e:TouchEvent)=>{stop();y=e.touches[0].clientY};
 const move=(e:TouchEvent)=>{e.preventDefault();stop();const next=e.touches[0].clientY;update(target.current+(y-next)*.0015);y=next};
 const tick=()=>{if(Math.abs(target.current-current)>.0001){current+=(target.current-current)*.08;setLerped(current)}frame=requestAnimationFrame(tick)};frame=requestAnimationFrame(tick);
 window.addEventListener('wheel',wheel,{passive:false});window.addEventListener('touchstart',start,{passive:true});window.addEventListener('touchmove',move,{passive:false});return()=>{stop();cancelAnimationFrame(frame);window.removeEventListener('wheel',wheel);window.removeEventListener('touchstart',start);window.removeEventListener('touchmove',move)}},[]);
 const navigate=(to:number)=>{cancelAnimationFrame(navFrame.current);const from=target.current,start=performance.now();const tick=(now:number)=>{const p=Math.min(1,(now-start)/1200),ease=p<.5?4*p**3:1-(-2*p+2)**3/2;update(from+(to-from)*ease);if(p<1)navFrame.current=requestAnimationFrame(tick)};navFrame.current=requestAnimationFrame(tick)};
 const second=Math.max(0,Math.min(1,(lerpedScrollProgress-1.15)/.5)),rise=1-(1-second)**3;
 return <main data-progress={scrollProgress.toFixed(4)} data-lerped={lerpedScrollProgress.toFixed(4)} data-active={activeSectionId}><div className="first-screen" style={{visibility:second>=1?'hidden':'visible',filter:second>0?`blur(${Math.sin(second*Math.PI/2)*64}px)`:'none'}}><VideoScrubber scrollProgress={Math.min(1,lerpedScrollProgress)}/><div className="title-strip"><ScrollExitSplitText scrollProgress={Math.min(1,lerpedScrollProgress)}/></div><SoapTiles scrollProgress={lerpedScrollProgress}/></div><Header activeSectionId={activeSectionId} onNavigate={navigate}/><section className="second-screen" aria-label="Manifesto" style={{transform:`translateY(${(1-rise)*100}%)`,visibility:second>0?'visible':'hidden'}}><div className="grab-handle"/><SecondVideoScrubber scrollProgress={lerpedScrollProgress}/><CylindricalTextDrum scrollProgress={lerpedScrollProgress}/><Marquee/></section></main>
}
