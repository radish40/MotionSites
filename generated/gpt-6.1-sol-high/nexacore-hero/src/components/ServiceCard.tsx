import { useState, type ReactNode } from 'react';
import { asset } from '../assets';
type Props = {label:string;icon:ReactNode;title:string;bullets:string[]};
export default function ServiceCard({label,icon,title,bullets}:Props) {
 const [hover,setHover]=useState(false);
 return <article className={`service-card ${hover?'active':''}`} onMouseEnter={()=>setHover(true)} onMouseLeave={()=>setHover(false)} onFocus={()=>setHover(true)} onBlur={e=>{if(!e.currentTarget.contains(e.relatedTarget))setHover(false);}} tabIndex={0}>
 <img className="card-image" src={asset('card.png')} alt=""/><div className="card-overlay"/><div className="card-content"><span className="service-badge">{icon}{label}</span><div className="card-spacer"/><h3>{title}</h3><ul>{bullets.map(b=><li key={b}>{b}</li>)}</ul><a className="learn-more" href="#our-method" tabIndex={hover?0:-1}>Learn more</a></div></article>;
}
