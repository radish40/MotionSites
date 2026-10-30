import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import './styles/fonts.css';
import './styles/main.css';

const ease = [.22, 1, .36, 1];
const fadeUp = delay => ({initial: {opacity: 0, y: 28}, animate: {opacity: 1, y: 0}, transition: {duration: .7, ease, delay}});
const fadeDown = delay => ({initial: {opacity: 0, y: -20}, animate: {opacity: 1, y: 0}, transition: {duration: .6, ease, delay}});
const fadeRight = delay => ({initial: {opacity: 0, x: 40}, animate: {opacity: 1, x: 0}, transition: {duration: .8, ease, delay}});
const press = {whileHover: {scale: 1.03, backgroundColor: '#f0f0f0'}, whileTap: {scale: .97}, transition: {duration: .18, ease: 'easeOut'}};
function Icon({name, ...props}) {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>{name === 'calendar' ? <><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 11h18"/></> : name === 'edit' ? <><path d="m14 5 5 5M4 20l5-1L20 8a3.54 3.54 0 0 0-5-5L4 14z"/><path d="m4 14 5 5"/></> : name === 'chevron' ? <path d="m6 9 6 6 6-6"/> : name === 'close' ? <path d="m6 6 12 12M6 18 18 6"/> : <path d="M4 7h16M4 12h16M4 17h16"/>}</svg>;
}
function Logo(){return <svg width="142" height="50" viewBox="0 0 142 50" role="img" aria-label="WoodNest"><defs><linearGradient id="mark" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#FFB33F"/><stop offset="1" stopColor="#FFB33F" stopOpacity=".6"/></linearGradient></defs><g fill="url(#mark)" transform="translate(0 9)"><path opacity=".6" d="m0 16 15-9v18z"/><path opacity=".6" d="m8 7 15-7v32L8 25z"/><path d="m17 0 10 5v24l-10 3z"/><path opacity=".6" d="m27 7 10 9-10 9z"/></g><text x="45" y="31" fill="white" fontFamily="PP Mori, sans-serif" fontSize="19.5" letterSpacing="-.5">WoodNest</text></svg>}
function DatePicker({type, day, setDay, open, setOpen}) {
 const isOpen = open === type;
 const feb = type === 'arrival';
 const month = feb ? 'February' : 'March';
 return <div className="date-picker">
  <motion.button type="button" className={`date-pill ${isOpen ? 'is-open' : ''}`} aria-expanded={isOpen} aria-controls={`${type}-calendar`} aria-label={`${feb ? 'Check-in' : 'Check-out'} date: ${month} ${day}`} onClick={() => setOpen(isOpen ? null : type)} whileHover={{backgroundColor:'rgba(0,0,0,.5)', scale:1.02}} whileTap={{scale:.97}} transition={{duration:.18, ease:'easeOut'}}><Icon name="calendar"/><span>{feb ? 'Feb' : 'Mar'} {day}</span><motion.span animate={{rotate: isOpen ? 180 : 0}} transition={{duration:.2}}><Icon name="chevron" width="16" height="16"/></motion.span></motion.button>
  <AnimatePresence>{isOpen && <motion.div id={`${type}-calendar`} className="calendar" initial={{opacity:0,y:-5}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-5}} transition={{duration:.15}} role="group" aria-label={`${month} 2025`}>
   <div className="month">{month} 2025</div><div className="calendar-grid">{['S','M','T','W','T','F','S'].map((d,i)=><span className="weekday" key={`week-${i}`}>{d}</span>)}{Array.from({length:6},(_,i)=><span key={`blank-${i}`}/>)}{Array.from({length:feb?28:31},(_,i)=>i+1).map(d=><button key={d} type="button" className={d===day?'selected':''} aria-label={`${month} ${d}, 2025`} aria-pressed={d===day} onClick={()=>{setDay(d);setOpen(null)}}>{d}</button>)}</div>
  </motion.div>}</AnimatePresence>
 </div>;
}
function App(){
 const [menu,setMenu]=useState(false), [open,setOpen]=useState(null), [arrival,setArrival]=useState(11), [departure,setDeparture]=useState(25), [editing,setEditing]=useState(false);
 const card=useRef(null),title=useRef(null), video=useRef(null);
 const reduced=useReducedMotion();
 useEffect(()=>{const onPointer=e=>{if(card.current&&!card.current.contains(e.target))setOpen(null)}; const onKey=e=>{if(e.key==='Escape'){setOpen(null);setMenu(false);setEditing(false)}};document.addEventListener('pointerdown',onPointer);document.addEventListener('keydown',onKey);return()=>{document.removeEventListener('pointerdown',onPointer);document.removeEventListener('keydown',onKey)}},[]);
 useEffect(()=>{if(editing){title.current.focus(); const range=document.createRange();range.selectNodeContents(title.current);const selection=window.getSelection();selection.removeAllRanges();selection.addRange(range)}},[editing]);
 useEffect(()=>{if(reduced)video.current?.pause()},[reduced]);
 const book=()=>{setMenu(false);card.current.scrollIntoView({behavior:reduced?'instant':'smooth',block:'center'});setOpen('arrival')};
 const links=[['Locations','#hideaways'],['Rooms','#reserve'],['Experiences','#experience'],['Contact','#reserve']];
 return <div className="hero relative min-h-screen w-full overflow-hidden font-sans font-normal">
  <video ref={video} className="background-video absolute inset-0 h-full w-full object-cover" autoPlay muted playsInline preload="auto" aria-hidden="true"><source src={`${import.meta.env.BASE_URL}assets/evergreen.mp4`} type="video/mp4"/></video>
  <motion.header {...fadeDown(.1)} className="header relative z-20 flex items-center justify-between">
   <a href="#hideaways" aria-label="WoodNest home"><Logo/></a>
   <nav aria-label="Main navigation" className="hidden md:flex items-center nav">{links.map(([label,href])=><motion.a key={label} href={href} whileHover={{opacity:.6}} whileTap={{scale:.96}} transition={{duration:.15}}>{label}</motion.a>)}<motion.button className="book-button" onClick={book} {...press} whileHover={{scale:1.04,backgroundColor:'#f0f0f0'}}>Book Now</motion.button></nav>
   <button className="menu-toggle md:hidden" aria-label={menu?'Close menu':'Open menu'} aria-expanded={menu} aria-controls="mobile-menu" onClick={()=>setMenu(!menu)}><Icon name={menu?'close':'menu'} width="24" height="24"/></button>
   <AnimatePresence>{menu&&<motion.nav id="mobile-menu" aria-label="Mobile navigation" className="mobile-menu md:hidden" initial={{opacity:0,y:-8}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-8}}>{links.map(([label,href])=><a key={label} href={href} onClick={()=>setMenu(false)}>{label}</a>)}<motion.button className="book-button" {...press} onClick={book}>Book Now</motion.button></motion.nav>}</AnimatePresence>
  </motion.header>
  <main className="main relative z-10 flex flex-col">
   <div className="inner flex flex-1 flex-col lg:flex-row lg:items-stretch">
    <div className="left-content flex flex-1 flex-col justify-between">
     <h1 id="hideaways">{["Nature's",'Perfect','Hideaways'].map((line,i)=><motion.span className="block" key={line} {...fadeUp(.2+i*.15)} style={{color:i===1?'rgba(255,255,255,.5)':'white'}}>{line}</motion.span>)}</h1>
     <div className="bottom-row flex flex-col sm:flex-row items-start">
      <motion.p id="experience" {...fadeUp(.65)}>Discover handpicked luxury cabins in breathtaking locations. Unplug, unwind, and reconnect with what matters most.</motion.p>
      <motion.div className="rating flex flex-col" {...fadeUp(.75)}><div className="flex items-center gap-1"><svg width="28" height="28" viewBox="0 0 24 24" fill="#FFB33F" aria-hidden="true"><path d="m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z"/></svg><span className="rating-number">4.7</span></div><span className="rating-caption"> from 1,800+ stays</span></motion.div>
     </div>
    </div>
    <motion.div className="reserve-wrapper flex lg:flex-col lg:justify-end" {...fadeRight(.4)}>
     <form id="reserve" ref={card} className={`reserve-card ${open?'calendar-open':''}`} onSubmit={e=>{e.preventDefault();setOpen('arrival')}}>
      <div className="blur-layer"/><div className="tint-layer"/>
      <div className="card-title-row relative flex items-start justify-between gap-4"><h2 ref={title} contentEditable={editing} suppressContentEditableWarning spellCheck="false" onBlur={()=>{setEditing(false);window.getSelection()?.removeAllRanges()}} onKeyDown={e=>{if(e.key==='Enter'){e.preventDefault();e.currentTarget.blur()}}}>Evergreen<br/>Pine Family Lodge</h2><button type="button" className="edit-button" aria-label="Edit cabin name" aria-pressed={editing} onClick={()=>setEditing(!editing)}><Icon name="edit"/></button></div>
      <div className="date-row relative flex"><DatePicker type="arrival" day={arrival} setDay={setArrival} open={open} setOpen={setOpen}/><DatePicker type="departure" day={departure} setDay={setDeparture} open={open} setOpen={setOpen}/></div>
      <div className="time-box relative"><div className="time-left"><span>Check-in</span><p>After 2:00 PM</p></div><div className="divider"/><div className="time-right"><span>Check-out</span><p>Until 12:00 PM</p></div></div>
      <div className="price-row relative flex flex-col"><div className="flex items-end justify-between"><p className="price">$359<span>/night</span></p><span className="guests">2-5 guests</span></div><motion.button type="submit" className="reserve-button" {...press}>Reserve</motion.button></div>
     </form>
    </motion.div>
   </div>
  </main>
 </div>;
}
createRoot(document.getElementById('root')).render(<App/>);
