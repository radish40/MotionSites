import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { ArrowRight, Menu, X, Facebook, Twitter, Dribbble, Youtube, Linkedin, Instagram } from 'lucide-react';
import './styles.css';

const navigation = ['Domain', 'Servers', 'Cloud', 'Managed', 'Email', 'Privacy'];
const columns = [
  ['SERVERS', ['Web Servers', 'VPS Servers', 'Cloud Servers', 'Managed Instances', 'Bare Metal']],
  ['DOMAINS', ['Find Domain', 'Move Domains', 'DNS Manager', 'Domain Costs']],
  ['HELP US', ['Open a Ticket', 'FAQs', 'Docs', 'Tutorials', 'Forum']],
  ['ABOUT', ['Our Story', 'Leadership Team', 'Press Room', 'We Hire', 'Alliance', 'Blog']],
];
const social = [[Facebook, 'Facebook', 'https://facebook.com/'], [Twitter, 'Twitter', 'https://twitter.com/'], [Dribbble, 'Dribbble', 'https://dribbble.com/'], [Youtube, 'Youtube', 'https://youtube.com/'], [Linkedin, 'Linkedin', 'https://linkedin.com/'], [Instagram, 'Instagram', 'https://instagram.com/']];
const route = label => '/' + label.toLowerCase().replaceAll(' ', '-');
const gradient = 'bg-gradient-to-r from-emerald-400 to-cyan-500 text-white text-sm font-semibold px-6 py-2.5 rounded-full inline-flex items-center justify-center gap-3 transition-all duration-200 hover:brightness-110';
const titleStyle = 'text-white text-[10px] sm:text-xs font-bold tracking-[0.15em] mb-3 sm:mb-4';

function Logo() {
  return <a href="/" aria-label="NEXOVA home" className="inline-flex items-center gap-3 text-white text-xl font-bold tracking-wider">
    <svg viewBox="0 0 480 480" className="w-8 h-8" fill="currentColor" aria-hidden="true"><path d="M480 240a240 240 0 0 0-240 240 240 240 0 0 0 240-240Z M240 0A240 240 0 0 0 0 240 240 240 0 0 0 240 0Z M480 240A240 240 0 0 0 240 0a240 240 0 0 0 240 240Z M240 480A240 240 0 0 0 0 240a240 240 0 0 0 240 240Z" /></svg>
    NEXOVA
  </a>;
}
function Login({ style, tabIndex }) { return <a href="/login" className={gradient} style={style} tabIndex={tabIndex}>LOG IN <ArrowRight className="w-4 h-4" aria-hidden="true" /></a>; }

function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [signedUp, setSignedUp] = useState(false);
  const closeTimer = useRef();
  const toggleRef = useRef();
  const panelRef = useRef();
  const closeMenu = () => {
    setMenuVisible(false);
    clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setMobileMenuOpen(false), 500);
  };
  useEffect(() => {
    if (!mobileMenuOpen) return;
    const frame = requestAnimationFrame(() => setMenuVisible(true));
    const escape = event => {
      if (event.key === 'Escape') { closeMenu(); toggleRef.current?.focus(); }
      if (event.key === 'Tab') {
        const focusable = [toggleRef.current, ...panelRef.current.querySelectorAll('a')];
        const first = focusable[0], last = focusable.at(-1);
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }
    };
    const resize = () => { if (window.innerWidth >= 1024) closeMenu(); };
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', escape);
    window.addEventListener('resize', resize);
    return () => { cancelAnimationFrame(frame); document.body.style.overflow = previous; document.removeEventListener('keydown', escape); window.removeEventListener('resize', resize); };
  }, [mobileMenuOpen]);
  useEffect(() => () => clearTimeout(closeTimer.current), []);
  const stagger = index => ({ transitionDelay: menuVisible ? `${350 + index * 50}ms` : '0ms', opacity: menuVisible ? 1 : 0, transform: `translateY(${menuVisible ? 0 : 12}px)` });

  return <div className="relative min-h-screen flex flex-col bg-[#030b19]" style={{ fontFamily: '"Helvetica Now Var", Helvetica, Arial, sans-serif' }}>
    <video className="absolute inset-0 w-full h-full object-cover" autoPlay muted loop playsInline aria-hidden="true" poster={`${import.meta.env.BASE_URL}assets/earth-poster.jpg`}>
      <source src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260613_180732_a54afbf6-b30d-470e-861f-669871f09f67.mp4" type="video/mp4" />
      <source src={`${import.meta.env.BASE_URL}assets/earth.mp4`} type="video/mp4" />
    </video>
    <div className="relative z-10 flex flex-col min-h-screen">
      <header className="flex items-center justify-between px-6 md:px-12 lg:px-16 py-5">
        <Logo />
        <nav aria-label="Main navigation" className="hidden lg:flex gap-8">
          {navigation.map(label => <a key={label} href={route(label)} className="text-white/80 hover:text-white text-sm tracking-wide transition-colors duration-200">{label}</a>)}
        </nav>
        <div className="hidden lg:block"><Login /></div>
        <button ref={toggleRef} type="button" className="lg:hidden relative z-[60] w-8 h-8 text-white" aria-label={menuVisible ? 'Close menu' : 'Open menu'} aria-expanded={menuVisible} aria-controls="mobile-menu" onClick={() => { if (menuVisible) closeMenu(); else { clearTimeout(closeTimer.current); if (mobileMenuOpen) setMenuVisible(true); else setMobileMenuOpen(true); } }}>
          <Menu className={`absolute inset-1 w-6 h-6 transition-all duration-300 ${menuVisible ? 'opacity-0 rotate-90 scale-75' : 'opacity-100 rotate-0 scale-100'}`} />
          <X className={`absolute inset-1 w-6 h-6 transition-all duration-300 ${menuVisible ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-75'}`} />
        </button>
      </header>
      {mobileMenuOpen && <>
        <div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-md transition-opacity duration-[400ms] lg:hidden" style={{ opacity: menuVisible ? 1 : 0 }} onClick={closeMenu} aria-hidden="true" />
        <nav ref={panelRef} id="mobile-menu" aria-label="Mobile navigation" className="absolute left-0 right-0 top-[68px] z-50 lg:hidden">
          <div className="absolute inset-0 backdrop-blur-xl rounded-b-2xl" />
          <div className="relative z-10 flex flex-col items-center gap-5 pt-8 pb-10">
            {navigation.map((label, index) => <a key={label} href={route(label)} tabIndex={menuVisible ? 0 : -1} className="text-lg sm:text-xl font-light tracking-[0.08em] text-white/80 hover:text-white transition-all duration-[400ms] ease-out" style={stagger(index)}>{label}</a>)}
            <div className="mt-2 transition-all duration-[400ms] ease-out" style={stagger(navigation.length)}><Login tabIndex={menuVisible ? 0 : -1} /></div>
          </div>
        </nav>
      </>}
      <main inert={mobileMenuOpen ? true : undefined} className="flex-1 flex flex-col items-center justify-center text-center px-4 sm:px-6 py-12 sm:py-16 md:py-0">
        <h1 className="text-white/80 text-lg xs:text-2xl sm:text-3xl md:text-5xl font-light leading-snug tracking-tight mb-1 sm:mb-2">This page seems to have</h1>
        <h1 className="text-white/80 text-lg xs:text-2xl sm:text-3xl md:text-5xl font-light leading-snug tracking-tight mb-8 sm:mb-12">slipped beyond our reach :/</h1>
        <div className="relative mb-8 sm:mb-12 w-full flex justify-center overflow-visible"><span className="four-oh-four text-[80px] xs:text-[100px] sm:text-[140px] md:text-[200px] lg:text-[260px] font-black text-white leading-none tracking-tighter select-none">404</span></div>
        <a href="/" className="liquid-glass text-white text-[10px] xs:text-xs sm:text-sm tracking-[0.15em] sm:tracking-[0.2em] font-medium px-6 sm:px-8 py-3 sm:py-3.5 rounded-full uppercase transition-colors hover:bg-white/10">Return to Main Page</a>
      </main>
      <footer inert={mobileMenuOpen ? true : undefined} className="relative z-10 px-4 sm:px-6 md:px-12 lg:px-16 pb-8 sm:pb-10 pt-10 sm:pt-16">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 sm:gap-8 lg:gap-6">
          {columns.map(([title, links]) => <div key={title}><h2 className={titleStyle}>{title}</h2><ul className="space-y-2 sm:space-y-2.5">{links.map(label => <li key={label} className="text-[10px] sm:text-xs"><a href={route(label)} className="text-white/50 hover:text-white/80 transition-colors duration-200">{label}</a></li>)}</ul></div>)}
          <div className="col-span-2 lg:col-span-2">
            <h2 className={titleStyle}>JOIN FOR EXCLUSIVE DEALS</h2>
            <form className="flex max-w-sm" onSubmit={event => { event.preventDefault(); setSignedUp(true); }}>
              <label htmlFor="newsletter-email" className="sr-only">Email address</label>
              <input id="newsletter-email" name="email" type="email" required placeholder="Type your email to sign up" className="min-w-0 flex-1 bg-white rounded-l-md px-3 sm:px-4 py-3 text-[10px] sm:text-xs text-slate-900 placeholder:text-gray-500" onChange={() => setSignedUp(false)} />
              <button type="submit" className="bg-gradient-to-r from-emerald-400 to-cyan-500 text-white rounded-r-md font-bold tracking-wider text-[10px] sm:text-xs px-4 sm:px-5 hover:brightness-110 transition-all whitespace-nowrap">SEND IT</button>
            </form>
            <p role="status" className="text-xs text-white/80">{signedUp ? 'Newsletter signup is currently unavailable. Please try again later.' : ''}</p>
            <h2 className={`${titleStyle} mt-5 sm:mt-6 !mb-3`}>CONNECT</h2>
            <div className="flex gap-3">{social.map(([Icon, name, href]) => <a key={name} href={href} aria-label={name} className="text-white/50 hover:text-white transition-colors duration-200"><Icon className="w-4 h-4" strokeWidth={1.8} /></a>)}</div>
          </div>
        </div>
      </footer>
    </div>
  </div>;
}
createRoot(document.getElementById('root')).render(<App />);
