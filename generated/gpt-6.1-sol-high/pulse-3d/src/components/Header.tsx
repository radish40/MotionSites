import {useState,useEffect} from 'react';
import {Menu,X} from 'lucide-react';
import Logo from './Logo';
import {NAVIGATION_ITEMS} from '../data';
export default function Header({activeSectionId,onNavigate}:{activeSectionId:string;onNavigate:(n:number)=>void}){
 const [open,setOpen]=useState(false);
 useEffect(()=>{const key=(e:KeyboardEvent)=>{if(e.key==='Escape')setOpen(false)};window.addEventListener('keydown',key);return()=>window.removeEventListener('keydown',key)},[]);
 const go=(n:number)=>{setOpen(false);onNavigate(n)};
 return <><header className="site-header"><button className="brand" aria-label="Inner Circle — Home" onClick={()=>go(0)}><Logo/><span>Full Workflow Automation.<br/>We Manage Everything. You<br/>Unwind.</span></button><nav className="desktop-nav" aria-label="Main navigation">{NAVIGATION_ITEMS.map(i=><button key={i.id} aria-current={activeSectionId===i.id?'page':undefined} onClick={()=>go(i.scrollRatio)}>{i.label}</button>)}</nav><button className="menu-toggle" aria-label={open?'Close menu':'Open menu'} aria-expanded={open} aria-controls="mobile-menu" onClick={()=>setOpen(!open)}>{open?<X size={20}/>:<Menu size={20}/>}</button></header>{open&&<nav id="mobile-menu" className="mobile-menu" aria-label="Mobile navigation">{NAVIGATION_ITEMS.map(i=><button key={i.id} className={activeSectionId===i.id?'active':''} onClick={()=>go(i.scrollRatio)}>{i.label}</button>)}</nav>}</>;
}
