import {useLayoutEffect,useRef} from 'react';
import gsap from 'gsap';
const items=['Home','Our Fleet','Membership','Regattas & Events','Academy','Contact'];
export default function StaggeredMenu({isOpen,setIsOpen,onSelect,position='right',colors=['#1a1a1a','#93c5fd'],socials=['Instagram','Facebook','Twitter']}){
 const root=useRef(null), icon=useRef(null), slot=useRef(null), button=useRef(null);
 useLayoutEffect(()=>{
  const ctx=gsap.context(()=>{gsap.set('.prelayer, .menu-panel',{x:0,xPercent:100});gsap.set('.menu-item',{yPercent:110,rotate:10});},root);
  return ()=>ctx.revert();
 },[]);
 useLayoutEffect(()=>{
  const panel=root.current.querySelector('.menu-panel'); const layers=root.current.querySelectorAll('.prelayer'); const links=root.current.querySelectorAll('.menu-item');
  const tl=gsap.timeline();
  gsap.to(icon.current,{rotation:isOpen?225:0,duration:.5,ease:'power4.out'});
  gsap.to(button.current,{color:isOpen?'#000000':'#ffffff',duration:.5});
  gsap.set(slot.current,{yPercent:0});gsap.to(slot.current,{yPercent:-(6/7*100),duration:.5,ease:'power4.out'});
  if(isOpen){tl.fromTo(layers,{x:0,xPercent:100},{x:0,xPercent:0,duration:.65,ease:'power4.out',stagger:.07}).to(panel,{x:0,xPercent:0,duration:.65,ease:'power4.out'},.14).fromTo(links,{yPercent:110,rotation:10},{yPercent:0,rotation:0,duration:.8,stagger:{each:.1},ease:'power4.out'},.35);}
  else{tl.to(panel,{xPercent:100,duration:.5,ease:'power4.in'}).to(layers,{xPercent:100,duration:.5,stagger:.05,ease:'power4.in'},.06);}
  return ()=>{tl.kill();};
 },[isOpen]);
 return <div ref={root} className={`staggered-menu ${position}`}>
 <button ref={button} className="menu-toggle" aria-expanded={isOpen} aria-controls="club-menu" onClick={()=>setIsOpen(!isOpen)} aria-label={isOpen?'Close menu':'Open menu'}><span className="slot-window"><span ref={slot} className="slot-track">{[0,1,2,3,4,5,6].map((n)=><span key={n}>{n===6?(isOpen?'CLOSE':'MENU'):n%2?(isOpen?'CLOSE':'MENU'):(isOpen?'MENU':'CLOSE')}</span>)}</span></span><span ref={icon} className="plus"><span/><span/></span></button>
 <div className={`menu-layers ${isOpen?'is-open':''}`}>
 {colors.map((color,i)=><div key={color} className="prelayer" style={{background:color,zIndex:i}}/>)}
 <nav id="club-menu" className="menu-panel" aria-label="Main navigation" inert={!isOpen}>
 <div className="menu-eyebrow">THE WORLD OF YACHT CLUB</div>
 <div className="menu-items">{items.map((item,i)=><div className="menu-item-mask" key={item}><button className="menu-item" onClick={()=>onSelect(item)}><span>{item}</span><sup>0{i+1}</sup></button></div>)}</div>
 <div className="menu-socials"><span>FOLLOW THE HORIZON</span><div>{socials.map(s=><a key={s} href={`https://${s.toLowerCase()}.com/`} target="_blank" rel="noreferrer">{s}</a>)}</div></div>
 </nav></div></div>;
}
