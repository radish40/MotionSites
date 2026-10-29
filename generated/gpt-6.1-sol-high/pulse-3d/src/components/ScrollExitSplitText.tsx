import {useRef,useLayoutEffect,useEffect} from 'react';
import gsap from 'gsap';
export default function ScrollExitSplitText({scrollProgress}:{scrollProgress:number}){
 const el=useRef<HTMLHeadingElement>(null),tl=useRef<gsap.core.Timeline|null>(null);
 useLayoutEffect(()=>{const ctx=gsap.context(()=>{tl.current=gsap.timeline({paused:true}).fromTo('.char',{opacity:1,yPercent:0,y:0,scaleY:1,scaleX:1,transformOrigin:'50% 0%'},{opacity:0,yPercent:300,y:'25vh',scaleY:1.2,scaleX:.9,stagger:.03,ease:'power2.inOut'})},el);return()=>ctx.revert()},[]);
 useEffect(()=>{if(tl.current)gsap.to(tl.current,{progress:scrollProgress,duration:.6,ease:'power1.out',overwrite:'auto'})},[scrollProgress]);
 return <h1 ref={el} className="hero-title font-michroma" aria-label="INNER CIRCLE">{'INNER CIRCLE'.split(' ').map((w,i)=><span className="word" key={w} aria-hidden="true">{i>0&&<span>&nbsp;</span>}{[...w].map((c,j)=><span className="char" key={j}>{c}</span>)}</span>)}</h1>
}
