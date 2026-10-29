import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { AnimatePresence, motion, useInView } from 'motion/react';
import { Menu, X } from 'lucide-react';
import './styles.css';

const EXPO_OUT = [0.16, 1, 0.3, 1] as const;
const EASE_OUT = [0.25, 0.46, 0.45, 0.94] as const;
const asset = (name: string) => `${import.meta.env.BASE_URL}assets/${name}`;

function Reveal({ children, className = '', x = 0, delay = 0 }: { children: React.ReactNode; className?: string; x?: number; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const visible = useInView(ref, { once: true, margin: '0px 0px -40px 0px' });
  return <motion.div ref={ref} className={className} initial={{ opacity: 0, x, y: x ? 0 : 28 }} animate={visible ? { opacity: 1, x: 0, y: 0 } : {}} transition={{ duration: .8, ease: EXPO_OUT, delay }}>{children}</motion.div>;
}

function ContactArrow({ className = '' }: { className?: string }) {
  return <svg className={className} viewBox="0 0 32 32" fill="none" aria-hidden="true"><path d="M16 26V6M7 15l9-9 9 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>;
}

const routes = [
  'M128.161 74.6764C79.9989 130.001 71.9994 46.0005 20.9815 111.737',
  'M216.999 9.99985C260.499 12.4998 222.499 71.9998 291.999 58.9998',
  'M130.102 70.9998C144.499 -32.0002 183.852 70.2739 219.999 3.99985',
  'M14.4999 16.9998C111 20.9998 -53.0003 73.4998 21.4999 107',
];
function WorldMap() {
  const ref = useRef<HTMLDivElement>(null);
  const visible = useInView(ref, { once: true, margin: '0px 0px -60px 0px' });
  return <div className="world-map" ref={ref}>
    <img className="map-image" src={asset('world-map.png')} alt="World map showing our global logistics network"/>
    <svg className="routes" viewBox="0 0 299.037 142.509" fill="none" aria-hidden="true">
      {routes.map((path, i) => <React.Fragment key={path}>
        <motion.path d={path} stroke="#FFDA00" strokeWidth="2.5" initial={{ pathLength: 0 }} animate={visible ? { pathLength: 1 } : {}} transition={{ duration: 1.8, delay: i * .2, ease: EASE_OUT }}/>
        {visible && <polygon points="0,-4 8,0 0,4" fill="#FFDA00"><animateMotion dur={`${4 + i * .6}s`} begin={`${i * .3}s`} repeatCount="indefinite" path={path} rotate="auto"/></polygon>}
      </React.Fragment>)}
      {[[9.519,15.519],[289.519,59.518],[220.519,9.519],[125.518,78.519],[19.519,104.519]].map(([cx,cy],i) => <motion.g key={i} style={{ transformOrigin: `${cx}px ${cy}px` }} initial={{ scale: 0 }} animate={visible ? { scale: 1 } : {}} transition={{ delay: .5 + i * .12, type: 'spring', stiffness: 200 }}><circle cx={cx} cy={cy} r="9.519" fill="#FFDA00"/><circle cx={cx} cy={cy} r="3.389" fill="#002A35"/></motion.g>)}
    </svg>
    {['ship','car','plane'].map((type,i) => <motion.div key={type} className={`transport transport-${type}`} initial={{ scale: .5, opacity: 0 }} animate={visible ? { scale: 1, opacity: 1 } : {}} transition={{ delay: .5 + i * .2, duration: .7, ease: EXPO_OUT }}><motion.div animate={visible ? { y: [0,-8,0] } : {}} transition={{ duration: 2.5 + i * .4, repeat: Infinity, ease: 'easeInOut' }}><img src={asset(`${type}.png`)} alt={type === 'car' ? 'Road freight' : type === 'ship' ? 'Ocean freight' : 'Air freight'}/></motion.div></motion.div>)}
  </div>;
}

function SocialIcon({ type }: { type: string }) {
  return <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">{type === 'Instagram' ? <><rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" strokeWidth="2"/><circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="2"/><circle cx="17.5" cy="6.5" r="1.2"/></> : type === 'LinkedIn' ? <><path d="M5 8H2v14h3V8Zm-.2-6.2a2 2 0 1 0 0 4 2 2 0 0 0 0-4ZM9 8v14h4v-8c0-4 5-4 5 0v8h4v-9c0-6-7-7-9-3V8H9Z"/></> : <path d="M14 22v-9h3l.5-4H14V7c0-1.2.3-2 2-2h2V1.5a25 25 0 0 0-3-.2c-3 0-5 1.8-5 5V9H7v4h3v9h4Z"/>}</svg>;
}

function App() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const menuButton = useRef<HTMLButtonElement>(null);
  const firstLink = useRef<HTMLAnchorElement>(null);
  const [ready, setReady] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.style.overflowY = menuOpen ? 'hidden' : 'auto';
    if (menuOpen) firstLink.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && menuOpen) { setMenuOpen(false); menuButton.current?.focus(); }
      if (event.key === 'Tab' && menuOpen) {
        const items = [menuButton.current, ...Array.from(document.querySelectorAll<HTMLAnchorElement>('.menu-overlay a'))].filter(Boolean) as HTMLElement[];
        const current = items.indexOf(document.activeElement as HTMLElement);
        event.preventDefault(); items[(current + (event.shiftKey ? items.length - 1 : 1)) % items.length]?.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [menuOpen]);
  const goTo = (id: string) => {
    setMenuOpen(false);
    requestAnimationFrame(() => { const target = document.getElementById(id); scrollRef.current?.scrollTo({ top: target?.offsetTop || 0, behavior: 'smooth' }); });
  };
  return <main className="min-h-screen flex items-center justify-center bg-[#111111]">
    <div className="phone-shell" aria-label="CARGOX GROUP mobile website">
      <div className="phone-highlight"/>
      <div className="dynamic-island" aria-hidden="true"/>
      <div className="phone-screen" ref={scrollRef}>
        <section id="home" className="hero relative overflow-hidden">
          <video className="hero-video" autoPlay muted loop playsInline preload="auto" onCanPlay={() => setReady(true)} onError={() => setVideoError(true)} aria-label="Cargo transportation across the world"><source src={asset('hero.mp4')} type="video/mp4"/></video>
          <div className="hero-shade absolute inset-0"/>
          <nav className="navbar flex items-center justify-between" aria-label="Main navigation">
            <motion.a href="#home" onClick={e => { e.preventDefault(); goTo('home'); }} className="brand" initial={{ x: -70, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: .6, ease: EXPO_OUT }} aria-label="Cargox Group home">CARGOX<span>GROUP</span></motion.a>
            <motion.button ref={menuButton} className="menu-button" aria-label={menuOpen ? 'Close menu' : 'Open menu'} aria-expanded={menuOpen} aria-controls="mobile-menu" onClick={() => setMenuOpen(!menuOpen)} initial={{ x: 70, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: .6, ease: EXPO_OUT }}>{menuOpen ? <X size={28}/> : <Menu size={28}/>}</motion.button>
          </nav>
          <AnimatePresence>{ready && <motion.div className="hero-content" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <h1>{['BEYOND','BORDERS','AND LIMITS'].map((line,i) => <motion.span key={line} className={i === 1 ? 'yellow text-right' : ''} initial={{ x: i === 1 ? 400 : -400 }} animate={{ x: 0 }} transition={{ duration: .85, delay: i * .13, ease: EXPO_OUT }}>{line}</motion.span>)}</h1>
            <motion.button className="contact-cta" onClick={() => goTo('contact')} initial="rest" animate="rest" whileHover="hover" whileTap={{ scale: .97 }} variants={{ hover: { scale: 1.08, y: -2 } }}>
              <svg className="cta-shape" viewBox="0 0 288 64" preserveAspectRatio="none" aria-hidden="true"><path d="M32 0H202C213 0 218 9 224 9C232 9 236 0 256 0A32 32 0 0 1 256 64C236 64 232 55 224 55C218 55 213 64 202 64H32A32 32 0 0 1 32 0Z" fill="#ffda00"/></svg>
              <span>Get in touch</span><motion.span className="cta-arrow" variants={{ rest: { rotate: -135 }, hover: { rotate: -90 } }} transition={{ duration: .35 }}><ContactArrow/></motion.span>
            </motion.button>
          </motion.div>}</AnimatePresence>
          {videoError && <p className="video-error" role="status">The background video is unavailable. Please explore our logistics network below.</p>}
      <AnimatePresence>{menuOpen && <motion.div id="mobile-menu" className="menu-overlay" initial={{ opacity: 0, scale: .96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: .96 }} transition={{ duration: .3, ease: EXPO_OUT }}><nav aria-label="Sections">{[['Services','services'],['Industries','services'],['Company','company']].map(([label,id],i) => <motion.a key={label} ref={i === 0 ? firstLink : undefined} href={`#${id}`} onClick={e => { e.preventDefault(); goTo(id); }} initial={{ opacity: 0, y: 25 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .1 + i * .1, ease: EXPO_OUT }}>{label}</motion.a>)}</nav></motion.div>}</AnimatePresence>
        </section>
        <section id="services" className="info-section overflow-hidden">
          <Reveal x={-70}><h2>LOGISTICS</h2><p className="tagline">shaped by scale<br/>powered by precision</p></Reveal>
          <WorldMap/>
          <div id="company" className="stats">
            <Reveal x={-70} className="stat flex items-center"><strong>3M+</strong><p>tons of cargo<br/>delivered<br/>without delays</p></Reveal>
            <Reveal x={70} className="stat stat-indented flex items-center"><strong>13+</strong><p>years of trusted<br/>and reliable<br/>operations</p></Reveal>
          </div>
        </section>
        <section id="contact" className="contact-section">
          <Reveal><h2>CONTACT <span className="yellow">US</span></h2><p className="contact-subtitle">Complete the form and our team will contact you soon.</p></Reveal>
          <form onSubmit={event => { event.preventDefault(); setSubmitted(true); }}>
            {[['First Name','given-name','text'],['Last Name','family-name','text'],['E-mail','email','email']].map(([label,autoComplete,type],i) => <Reveal delay={i * .1} key={label}><label className="sr-only" htmlFor={autoComplete}>{label}</label><motion.input id={autoComplete} name={autoComplete} type={type} autoComplete={autoComplete} placeholder={label} required whileFocus={{ scale: 1.01 }}/></Reveal>)}
            <Reveal delay={.3}><motion.button type="submit" className="send-button" whileHover={{ scale: 1.03, y: -2, backgroundColor: '#ffe84d' }} whileTap={{ scale: .97 }}>Send</motion.button></Reveal>
            {submitted && <p className="form-status" role="status">Thank you for your interest. To send your request, please email info@cargox-group.com. This preview does not send form data.</p>}
          </form>
          <Reveal><address className="footer-contacts flex flex-col items-start"><motion.a href="mailto:info@cargox-group.com" whileHover={{ x: 4, color: '#fff' }}>info@cargox-group.com</motion.a><motion.a href="tel:+380442347890" whileHover={{ x: 4, color: '#fff' }}>+380 44 234-7890</motion.a></address>
            <div className="footer-actions flex justify-between items-center"><div className="flex gap-3">{['Instagram','LinkedIn','Facebook'].map(type => <motion.a key={type} href={type === 'Instagram' ? 'https://www.instagram.com/' : type === 'LinkedIn' ? 'https://www.linkedin.com/' : 'https://www.facebook.com/'} target="_blank" rel="noreferrer" aria-label={type} className="circle-button" whileHover={{ scale: 1.15, y: -3 }} whileTap={{ scale: .97 }}><SocialIcon type={type}/></motion.a>)}</div><motion.button className="circle-button" aria-label="Scroll to top" onClick={() => goTo('home')} whileHover={{ scale: 1.15, y: -3 }} whileTap={{ scale: .97 }}><ContactArrow/></motion.button></div>
            <p className="copyright">(c) 2025. All rights reserved.</p>
          </Reveal>
        </section>
      </div>

      <div className="home-indicator" aria-hidden="true"/>
    </div>
  </main>;
}

createRoot(document.getElementById('root')!).render(<React.StrictMode><App/></React.StrictMode>);
