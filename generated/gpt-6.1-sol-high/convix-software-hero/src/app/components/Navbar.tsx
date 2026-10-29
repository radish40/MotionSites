import { useState } from 'react';
import { ChevronDown, ChevronRight, ShoppingCart, Menu, X } from 'lucide-react';
const links = ['Home', 'Features', 'About', 'Pages'];
export default function Navbar() {
  const [open, setOpen] = useState(false);
  return <header className="navbar-wrapper"><nav className="navbar" aria-label="Main navigation">
    <a className="logo" href="#home" aria-label="Convix Software home"><svg viewBox="0 0 32 32" fill="#ef4d23" aria-hidden="true">{Array.from({length:8},(_,i)=><circle key={i} cx={16+10*Math.cos(i*Math.PI/4)} cy={16+10*Math.sin(i*Math.PI/4)} r="3.5"/>)}<circle cx="16" cy="16" r="3.5"/></svg></a>
    <div className="desktop-links">{links.map(label=><a key={label} href={label==='Home'?'#home':'#dashboard'} className={label==='Pages'?'pages':''}>{label==='Home'&&<span className="home-dot"/>}{label}{label==='Pages'&&<ChevronDown size={14}/>}</a>)}</div>
    <div className="nav-actions"><a className="cart" href="#dashboard" aria-label="View software dashboard"><ShoppingCart size={19} strokeWidth={1.7}/></a><a className="early-access" href="#dashboard"><span className="desktop-access">Get early access</span><span className="mobile-access">Early access</span><span className="arrow-circle"><ChevronRight size={16}/></span></a><button className="menu-button" aria-label={open?'Close menu':'Open menu'} aria-expanded={open} aria-controls="mobile-navigation" onClick={()=>setOpen(!open)}>{open?<X size={21}/>:<Menu size={21}/>}</button></div>
    {open&&<div className="mobile-menu" id="mobile-navigation">{links.map(label=><a key={label} href={label==='Home'?'#home':'#dashboard'} onClick={()=>setOpen(false)} className={label==='Pages'?'pages':''}>{label}{label==='Pages'&&<ChevronDown size={14}/>}</a>)}</div>}
  </nav></header>;
}
