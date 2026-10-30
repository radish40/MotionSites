import React, { useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Menu, X } from 'lucide-react';
import './style.css';

const features = ['Smart Therapy', 'Real-time Healing', 'Insights into outcomes'];
const links = [['Story', '#story'], ['Benefits', '#benefits'], ['Connect', '#connect']];
function FeaturePills({ mobile = false }) {
  return <div id={mobile ? undefined : 'benefits'} className={mobile ? 'flex sm:hidden flex-wrap gap-2 mt-2' : 'hidden sm:flex flex-col items-end gap-2 self-end shrink-0'}>{features.map(label => <span key={label} className="bg-black/30 backdrop-blur-md text-white text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border border-white/10">{label}</span>)}</div>;
}
function App() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState('');
  const input = useRef(null);
  const join = () => { setOpen(false); input.current?.focus(); };
  return <main className="relative h-[100svh] min-h-[540px] overflow-hidden bg-[#79b8c9] font-inter">
    <video className="absolute inset-0 h-full w-full object-cover object-[80%_center] md:object-right lg:object-center" autoPlay loop muted playsInline preload="auto" aria-hidden="true" src={`${import.meta.env.BASE_URL}assets/aurai-wellness.mp4`} />
    <div className="absolute inset-0 z-10 flex flex-col px-4 sm:px-10 lg:px-12 py-4 sm:py-8">
      <nav className="flex items-center justify-between" aria-label="Main navigation">
        <div className="relative flex items-center bg-black/20 backdrop-blur-md rounded-2xl border border-white/10 px-4 py-2.5 sm:px-6 sm:py-4">
          <a href="#story" aria-label="Aurai home" className="flex items-center gap-2 text-white">
            <svg className="w-5 h-5 sm:w-7 sm:h-7" viewBox="0 0 256 256" fill="currentColor" aria-hidden="true"><path d="M 228 0 C 172.772 0 128 44.772 128 100 L 128 0 L 0 0 L 0 28 C 0 83.228 44.772 128 100 128 L 0 128 L 0 256 L 28 256 C 83.228 256 128 211.228 128 156 L 128 256 L 256 256 L 256 228 C 256 172.772 211.228 128 156 128 L 256 128 L 256 0 Z"/></svg>
            <span className="font-askan text-base sm:text-xl tracking-wide">Aurai</span>
          </a>
          <button type="button" aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} aria-controls="mobile-menu desktop-menu" onClick={() => setOpen(!open)} className="ml-4 sm:ml-32 md:ml-64 lg:ml-96 text-white p-1 rounded hover:bg-white/10 transition-colors">{open ? <X size={20}/> : <Menu size={20}/>}</button>
          {open && <div id="desktop-menu" className="hidden sm:flex absolute top-[calc(100%+12px)] left-0 right-0 flex-col gap-4 bg-black/30 backdrop-blur-xl rounded-2xl p-5 border border-white/10 text-white">{links.map(([label, href]) => <a key={label} href={href} onClick={() => setOpen(false)} className="hover:text-white/70">{label}</a>)}</div>}
        </div>
        <button onClick={join} className="hidden sm:block bg-white text-gray-900 font-medium text-sm px-6 py-3 rounded-full hover:bg-white/90 transition-colors">Join the list</button>
      </nav>
      {open && <div id="mobile-menu" className="sm:hidden absolute top-[4.5rem] left-4 right-4 bg-black/30 backdrop-blur-xl rounded-2xl p-5 border border-white/10 flex flex-col gap-4 text-white">{links.map(([label, href]) => <a key={label} href={href} onClick={() => setOpen(false)}>{label}</a>)}<button onClick={join} className="w-full bg-white text-gray-900 rounded-full py-3 text-sm font-medium">Join the list</button></div>}
      <div className="flex-1 sm:hidden"/>
      <div className="flex flex-col sm:flex-1 sm:flex-row sm:items-end sm:justify-between gap-6 pb-4 sm:pb-12 lg:pb-16 sm:mt-auto">
        <div className="w-full sm:max-w-[700px]">
          <h1 id="story" className="font-askan text-white text-[2rem] sm:text-[3.5rem] md:text-[4.5rem] lg:text-[5.5rem] leading-[1.05] tracking-tight max-w-[700px]">Your calm is<br className="hidden sm:block"/> always within.</h1>
          <p className="text-white/70 text-xs sm:text-base md:text-lg max-w-[520px] leading-relaxed mt-4 sm:mt-6">Aurai is your always-on wellness companion. Built by leading therapists, it brings you the care and clarity right when you need it.</p>
          <form id="connect" className="relative bg-black/30 backdrop-blur-md rounded-full border border-white/10 mt-5 sm:mt-6 max-w-[480px]" onSubmit={event => { event.preventDefault(); alert(`Thank you for joining the list, ${email}!`); }}>
            <label htmlFor="email" className="sr-only">Your email address</label>
            <input ref={input} id="email" type="email" required autoComplete="email" value={email} onChange={event => setEmail(event.target.value)} placeholder="Your email address" className="w-full bg-transparent text-white placeholder:text-white/50 rounded-full px-4 sm:px-6 py-3 sm:py-4 pr-28 sm:pr-40 text-sm outline-none focus:ring-2 focus:ring-white/60"/>
            <button type="submit" className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-white text-gray-900 text-xs sm:text-sm font-medium px-3 sm:px-6 py-2 sm:py-3 rounded-full hover:bg-white/90 transition-colors">Join the list</button>
          </form>
          <FeaturePills mobile/>
        </div>
        <FeaturePills/>
      </div>
    </div>
  </main>;
}
createRoot(document.getElementById('root')).render(<App/>);
