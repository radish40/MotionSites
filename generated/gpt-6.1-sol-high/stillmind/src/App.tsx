import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from 'react';
import { Menu, X, Check } from 'lucide-react';

const scenes = [
  { label: 'Golden Hour', file: 'golden-hour.mp4' },
  { label: 'Still Water', file: 'still-water.mp4' },
  { label: 'Deep Woods', file: 'deep-woods.mp4' },
  { label: 'Quiet Dawn', file: 'quiet-dawn.mp4' },
];
const links = [
  { label: 'How It Works', target: 'how-it-works' },
  { label: 'Features', target: 'features' },
  { label: 'Pricing', target: 'early-access' },
  { label: 'Community', target: 'community' },
];
const sans = { fontFamily: 'system-ui, sans-serif' };
const asset = (file: string) => `${import.meta.env.BASE_URL}assets/${file}`;

export default function App() {
  const [activeVideo, setActiveVideo] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const cooldown = useRef<ReturnType<typeof setTimeout> | null>(null);
  const locked = useRef(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const menuButton = useRef<HTMLButtonElement>(null);
  const menuPanel = useRef<HTMLDivElement>(null);
  const sceneButtons = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => () => { if (cooldown.current) clearTimeout(cooldown.current); }, []);
  useEffect(() => {
    if (!menuOpen) return;
    const entrance = setTimeout(() => {
      if (document.activeElement === menuButton.current) menuPanel.current?.querySelector<HTMLAnchorElement>('a')?.focus();
    }, 520);
    return () => clearTimeout(entrance);
  }, [menuOpen]);

  useEffect(() => {
    const desktop = window.matchMedia('(min-width: 768px)');
    const onResize = () => { if (desktop.matches) setMenuOpen(false); };
    desktop.addEventListener('change', onResize);
    return () => desktop.removeEventListener('change', onResize);
  }, []);

  function switchScene(index: number) {
    if (index === activeVideo || locked.current) return;
    locked.current = true;
    setIsTransitioning(true);
    setActiveVideo(index);
    cooldown.current = setTimeout(() => { locked.current = false; setIsTransitioning(false); }, 1000);
  }
  function closeMenu() { setMenuOpen(false); menuButton.current?.focus(); }
  function focusAccess() { setMenuOpen(false); requestAnimationFrame(() => inputRef.current?.focus()); }
  function navigate(target: string) {
    setMenuOpen(false);
    requestAnimationFrame(() => {
      if (target === 'early-access') inputRef.current?.focus();
      else document.getElementById(target)?.focus({ preventScroll: true });
    });
  }
  function menuKeys(event: KeyboardEvent) {
    if (event.key === 'Escape') { event.preventDefault(); closeMenu(); }
    if (event.key === 'Tab') {
      const items = [menuButton.current, ...Array.from(menuPanel.current?.querySelectorAll<HTMLElement>('a, button') || [])].filter(Boolean) as HTMLElement[];
      const index = items.indexOf(document.activeElement as HTMLElement);
      const next = event.shiftKey ? (index - 1 + items.length) % items.length : (index + 1) % items.length;
      event.preventDefault(); items[next]?.focus();
    }
  }
  function submit(event: FormEvent) {
    event.preventDefault();
    if (!email.trim()) return;
    // A local confirmation only: no signup service is part of this static design.
    setSubmitted(true);
  }

  return (
    <section className="scene relative w-full h-screen overflow-hidden bg-black" aria-label="Lumora — find your clarity" onKeyDown={menuOpen ? menuKeys : undefined}>
      <div className="absolute inset-0" aria-hidden="true">
        {scenes.map((scene, index) => (
          <video key={scene.file} className={`scene-video absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ease-in-out ${index === activeVideo ? 'opacity-100' : 'opacity-0'}`} src={asset(scene.file)} autoPlay muted loop playsInline preload="auto" />
        ))}
      </div>
      <img className="train-overlay absolute inset-0 z-[1] h-full w-full object-cover pointer-events-none" src={asset('window-overlay.png')} alt="" aria-hidden="true" />

      <div className="content-layer relative z-[2] flex h-full flex-col" inert={menuOpen ? true : undefined}>
        <header className="navigation flex items-center justify-between">
          <a href="#" className="brand text-xl sm:text-2xl italic text-white" aria-label="Lumora home" onClick={(event) => { event.preventDefault(); switchScene(0); }}>Lumora</a>
          <nav className="desktop-nav liquid-glass hidden md:flex items-center rounded-full" aria-label="Main navigation" style={sans}>
            {links.map(link => <a key={link.label} href={`#${link.target}`} onClick={event => { event.preventDefault(); navigate(link.target); }} className="nav-link text-sm text-white/90 hover:text-white">{link.label}</a>)}
            <button className="white-button nav-cta rounded-full" onClick={focusAccess}>Get Started</button>
          </nav>
        </header>

        <main className={`hero flex flex-1 flex-col items-center justify-center text-center ${activeVideo === 2 ? 'dark-ink' : ''}`}>
          <div id="community" tabIndex={-1} className="community-badge liquid-glass rounded-full" style={sans}>Over 10,000 minds already finding their clarity</div>
          <h1 className="hero-heading text-4xl sm:text-5xl md:text-7xl lg:text-[5.5rem] leading-[1.1] max-w-4xl">Clarity in an Endlessly<br />Noisy Universe</h1>
          <p id="how-it-works" tabIndex={-1} className="hero-subtext max-w-xl leading-relaxed" style={sans}>Rise above the chaos of pings, infinite scrolling, and relentless demands. Discover how to protect your presence and create with intention.</p>
          <form id="early-access" onSubmit={submit} className={`email-form liquid-glass flex items-center rounded-full w-full max-w-[320px] sm:max-w-sm ${submitted ? 'is-submitted' : ''}`} style={sans}>
            {submitted ? <p className="confirmation" role="status"><Check size={17} aria-hidden="true" /> Thanks for your interest in Lumora.</p> : <>
              <label className="sr-only" htmlFor="email">Your Best Email</label>
              <input ref={inputRef} id="email" name="email" type="email" autoComplete="email" placeholder="Your Best Email" required value={email} onChange={event => setEmail(event.target.value)} />
              <button type="submit" className="white-button rounded-full">Get Early Access</button>
            </>}
          </form>
          <div id="features" tabIndex={-1} className="video-switcher flex items-center justify-center" role="group" aria-label="Choose your atmosphere" aria-busy={isTransitioning} style={sans}>
            {scenes.map((scene, index) => <button key={scene.label} ref={element => { sceneButtons.current[index] = element; }} className={`scene-button ${index === activeVideo ? 'is-active' : ''}`} aria-pressed={index === activeVideo} onClick={() => switchScene(index)} onKeyDown={event => {
              if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
                event.preventDefault(); const next = (index + (event.key === 'ArrowRight' ? 1 : -1) + 4) % 4;
                switchScene(next); sceneButtons.current[next]?.focus();
              }
            }}>{scene.label}</button>)}
          </div>
        </main>

        <footer className="stats flex flex-wrap items-center justify-center text-white/70 text-xs sm:text-sm" style={sans}>
          {['60+ Deep Sessions', '12,000+ Creators', '4.8 User Satisfaction', 'Intentional-First Design'].map((stat, index) => <span className="stat-item" key={stat}>{index > 0 && <span className="stat-divider hidden sm:inline" aria-hidden="true">|</span>}{stat}</span>)}
        </footer>
      </div>

      <button ref={menuButton} className={`mobile-menu-button liquid-glass md:hidden rounded-full ${menuOpen ? 'is-open' : ''}`} style={sans} aria-label={menuOpen ? 'Close menu' : 'Open menu'} aria-expanded={menuOpen} aria-controls="mobile-menu" onClick={() => setMenuOpen(!menuOpen)}>
        <Menu className="menu-icon" size={21} /><X className="close-icon" size={21} />
      </button>
      <div ref={menuPanel} id="mobile-menu" role="dialog" aria-modal={menuOpen ? true : undefined} aria-label="Navigation" aria-hidden={!menuOpen} inert={!menuOpen ? true : undefined} className={`mobile-menu fixed inset-0 z-50 bg-black/60 backdrop-blur-sm ${menuOpen ? 'is-open' : ''}`} onClick={event => { if (event.target === event.currentTarget) closeMenu(); }}>
        <nav aria-label="Mobile navigation" className="flex flex-col items-center">
          {links.map((link, index) => <a key={link.label} style={{ transitionDelay: menuOpen ? `${100 + index * 50}ms` : '0ms' }} className="mobile-link text-white text-3xl" href={`#${link.target}`} onClick={event => { event.preventDefault(); navigate(link.target); }}>{link.label}</a>)}
          <button className="mobile-link white-button mobile-cta rounded-full" style={{ ...sans, transitionDelay: menuOpen ? '300ms' : '0ms' }} onClick={focusAccess}>Get Started</button>
        </nav>
      </div>
    </section>
  );
}
