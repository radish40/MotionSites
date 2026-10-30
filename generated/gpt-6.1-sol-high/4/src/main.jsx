import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Command, ChevronDown, Menu, X, ArrowUpRight, ShieldCheck, ScrollText, Server, ArrowRight } from 'lucide-react';
import './styles.css';

const STREAM = 'https://stream.mux.com/4IMYGcL01xjs7ek5ANO17JC4VQVUTsojZlnw4fXzwSxc.m3u8';
const POSTER = `${import.meta.env.BASE_URL}assets/video-poster.jpg`;

function BackgroundVideo() {
  const videoRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  useEffect(() => {
    const video = videoRef.current;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let hls, retries = 0, disposed = false;
    const play = () => video.play().catch(() => setPlaying(false));
    const start = async () => {
      if (reducedMotion.matches) return;
      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = STREAM;
        play();
      } else {
        let Hls;
        try { ({ default: Hls } = await import('hls.js/light')); } catch { return; }
        if (disposed || reducedMotion.matches || !Hls.isSupported()) return;
        hls = new Hls({ capLevelToPlayerSize: true, startLevel: 0, maxBufferLength: 20 });
        hls.loadSource(STREAM);
        hls.attachMedia(video);
        hls.on(Hls.Events.MANIFEST_PARSED, play);
        hls.on(Hls.Events.ERROR, (_, data) => {
          if (!data.fatal) return;
          setPlaying(false);
          if (retries++ < 2) {
            if (data.type === Hls.ErrorTypes.NETWORK_ERROR) hls.startLoad();
            else if (data.type === Hls.ErrorTypes.MEDIA_ERROR) hls.recoverMediaError();
            else hls.destroy();
          } else hls.destroy();
        });
      }
    };
    start();
    const onMotion = () => { if (reducedMotion.matches) { video.pause(); setPlaying(false); } else if (video.src) play(); else start(); };
    reducedMotion.addEventListener('change', onMotion);
    return () => { disposed = true; reducedMotion.removeEventListener('change', onMotion); hls?.destroy(); video.removeAttribute('src'); video.load(); };
  }, []);
  return <div className="background" aria-hidden="true">
    <video ref={videoRef} autoPlay loop muted playsInline poster={POSTER} onPlaying={() => setPlaying(true)} onError={() => setPlaying(false)} />
    <img className={`video-poster ${playing ? 'is-playing' : ''}`} src={POSTER} alt="" fetchPriority="high" />
    <div className="absolute inset-0 bg-black/60" />
    <div className="background-shade" />
  </div>;
}

const serviceItems = [
  { label: 'Access control', description: 'Give every connection a purpose.', icon: ShieldCheck },
  { label: 'Logs & insights', description: 'A clearer view of your network.', icon: ScrollText },
  { label: 'Server management', description: 'Keep your infrastructure in sync.', icon: Server }
];

function App() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [dialog, setDialog] = useState(null);
  const dialogRef = useRef(null);
  const menuRef = useRef(null);
  const mobileRef = useRef(null);
  const menuButtonRef = useRef(null);

  const openDialog = (name) => { setDialog(name); setServicesOpen(false); setMobileOpen(false); };
  useEffect(() => {
    if (dialog) dialogRef.current.showModal();
  }, [dialog]);
  useEffect(() => {
    if (!mobileOpen) return;
    const previous = document.activeElement;
    document.body.style.overflow = 'hidden';
    mobileRef.current.querySelector('button').focus();
    const keyboard = (event) => {
      if (event.key === 'Escape') setMobileOpen(false);
      if (event.key === 'Tab') {
        const items = mobileRef.current.querySelectorAll('button, a');
        const first = items[0], last = items[items.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener('keydown', keyboard);
    return () => { document.body.style.overflow = ''; document.removeEventListener('keydown', keyboard); previous?.focus(); };
  }, [mobileOpen]);
  useEffect(() => {
    const close = (event) => { if (!menuRef.current?.contains(event.target)) setServicesOpen(false); };
    const key = (event) => { if (event.key === 'Escape') setServicesOpen(false); };
    document.addEventListener('pointerdown', close);
    document.addEventListener('keydown', key);
    return () => { document.removeEventListener('pointerdown', close); document.removeEventListener('keydown', key); };
  }, []);
  useEffect(() => {
    const desktop = window.matchMedia('(min-width: 768px)');
    const close = () => { if (desktop.matches) setMobileOpen(false); };
    desktop.addEventListener('change', close);
    return () => desktop.removeEventListener('change', close);
  }, []);

  return <div className="site-shell" id="home">
    <BackgroundVideo />
    <a href="#main" className="skip-link">Skip to content</a>
    <header className="site-header relative z-20 flex items-center justify-between">
      <a className="brand flex items-center gap-3" href="#home" aria-label="Datacore home"><span className="logo-mark"><Command size={25} strokeWidth={2.1} /></span><span>datacore</span></a>
      <nav aria-label="Main navigation" className="desktop-nav hidden md:flex items-center">
        <a className="nav-link active" href="#home" aria-current="page">Home</a>
        <div className="services-wrap" ref={menuRef}>
          <button className="nav-link flex items-center gap-1.5" aria-expanded={servicesOpen} aria-controls="services-menu" onClick={() => setServicesOpen(!servicesOpen)}>Services <ChevronDown size={13} className={servicesOpen ? 'rotate-180' : ''} /></button>
          {servicesOpen && <div id="services-menu" className="services-menu">{serviceItems.map(({ label, description, icon: Icon }) => <button key={label} onClick={() => openDialog(label)}><Icon size={19}/><span><strong>{label}</strong><small>{description}</small></span><ArrowUpRight size={14}/></button>)}</div>}
        </div>
        <button className="nav-link" onClick={() => openDialog('Reviews')}>Reviews</button>
        <button className="nav-link" onClick={() => openDialog('Contact us')}>Contact us</button>
      </nav>
      <div className="hidden md:flex items-center gap-3"><button className="button glass-button" onClick={() => openDialog('Sign In')}>Sign In</button><button className="button primary-button" onClick={() => openDialog('Get Started')}>Get Started</button></div>
      <button ref={menuButtonRef} className="mobile-toggle md:hidden" aria-label="Open menu" aria-expanded={mobileOpen} aria-controls="mobile-menu" onClick={() => setMobileOpen(true)}><Menu size={25}/></button>
    </header>

    <main id="main" className="hero relative z-10 flex flex-col items-center text-center">
      <div className="announcement inline-flex items-center"><span className="new-tag">New</span><span>Say Hello to Datacore v3.2</span><ArrowUpRight size={14} className="announcement-arrow"/></div>
      <h1>Your Networks.<br/>One Rapid <em>Interface</em>.</h1>
      <p className="hero-description">Platform helps admins control access, logs, and<br className="desktop-break"/> servers with purpose.</p>
      <div className="hero-actions flex items-center justify-center gap-3"><button className="button primary-button" onClick={() => openDialog('Book a Free Demo')}>Book a Free Demo</button><button className="button secondary-button" onClick={() => openDialog('Get Started')}>Get Started Now</button></div>
    </main>

    {mobileOpen && <div ref={mobileRef} id="mobile-menu" className="mobile-menu" role="dialog" aria-modal="true" aria-label="Navigation"><div className="mobile-menu-header"><span className="brand flex items-center gap-3"><span className="logo-mark"><Command size={25}/></span>datacore</span><button className="mobile-toggle" aria-label="Close menu" onClick={() => setMobileOpen(false)}><X size={25}/></button></div><nav aria-label="Mobile navigation"><a href="#home" onClick={() => setMobileOpen(false)}>Home</a><button onClick={() => openDialog('Services')}>Services <ArrowUpRight/></button><button onClick={() => openDialog('Reviews')}>Reviews</button><button onClick={() => openDialog('Contact us')}>Contact us</button></nav><div className="mobile-menu-actions"><button className="button glass-button" onClick={() => openDialog('Sign In')}>Sign In</button><button className="button primary-button" onClick={() => openDialog('Get Started')}>Get Started</button></div></div>}

    <dialog ref={dialogRef} className="action-dialog" onClose={() => setDialog(null)} onClick={event => { if (event.target === event.currentTarget) dialogRef.current.close(); }} aria-labelledby="dialog-title">
      <button className="dialog-close" aria-label="Close dialog" onClick={() => dialogRef.current.close()}><X size={21}/></button>
      <span className="dialog-symbol"><Command size={25}/></span>
      <h2 id="dialog-title">{dialog}</h2>
      {['Services', ...serviceItems.map(item => item.label)].includes(dialog) ? <div className="dialog-services">{serviceItems.filter(item => dialog === 'Services' || item.label === dialog).map(({ label, description, icon: Icon }) => <div key={label}><Icon size={22}/><span><strong>{label}</strong><p>{description}</p></span></div>)}</div> : <><p>{dialog === 'Reviews' ? 'Customer reviews will be available when Datacore launches.' : dialog === 'Sign In' ? 'Your network workspace, in one place.' : dialog === 'Contact us' ? 'Let’s find the right setup for your network.' : 'Take the next step toward a clearer, connected network.'}</p><div className="preview-note">This is a Datacore design preview. {dialog === 'Sign In' ? 'Account sign-in is not connected.' : dialog === 'Reviews' ? 'No customer testimonials have been provided.' : 'Demo booking, onboarding, and contact services are not connected.'}</div></>}
      <button className="button primary-button dialog-done" onClick={() => dialogRef.current.close()}>Back to Datacore <ArrowRight size={16}/></button>
    </dialog>
  </div>;
}

createRoot(document.getElementById('root')).render(<App />);
