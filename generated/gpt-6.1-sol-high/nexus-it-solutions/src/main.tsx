import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

const links = ['HOME', 'SOLUTIONS', 'OUR TEAM', 'NEWS'];

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div id="home" className="hero-frame h-screen flex flex-col relative overflow-hidden">
        <video className="absolute inset-0 w-full h-full object-fill" src={`${import.meta.env.BASE_URL}assets/nexus-background.mp4`} autoPlay muted loop playsInline aria-hidden="true" />
        <div className="relative z-10 flex flex-col flex-1 min-h-0">
          <header className="w-full">
            <nav aria-label="Main navigation" className="navigation flex items-center justify-between px-8 py-5 max-w-7xl mx-auto w-full gap-12">
              <a href="#home" aria-label="Nexus home" className="font-akshar text-xl font-medium tracking-wider text-foreground shrink-0">&lt;NEXUS&gt;</a>
              <div className="desktop-links flex items-center gap-8 ml-auto">
                {links.map(link => <a key={link} href={link === 'HOME' ? '#home' : `#${link.toLowerCase().replace(' ', '-')}`} className="nav-link font-akshar text-lg tracking-[0.05em] text-muted-foreground hover:text-foreground">{link}</a>)}
              </div>
              <a href="mailto:?subject=Nexus%20IT%20Solutions%20%E2%80%94%20Let%E2%80%99s%20connect" className="contact-link border border-foreground/10 text-muted-foreground hover:bg-muted-foreground hover:text-background uppercase tracking-[0.05em] text-xl rounded-none font-akshar px-6 py-3 whitespace-nowrap">GET IN TOUCH</a>
              <button className="menu-toggle" type="button" aria-label={menuOpen ? 'Close navigation' : 'Open navigation'} aria-expanded={menuOpen} aria-controls="mobile-navigation" onClick={() => setMenuOpen(!menuOpen)}><span className={menuOpen ? 'open' : ''} /><span className={menuOpen ? 'open' : ''} /></button>
            </nav>
            {menuOpen && <nav id="mobile-navigation" className="mobile-navigation font-akshar" aria-label="Mobile navigation">{links.map(link => <a key={link} href={link === 'HOME' ? '#home' : `#${link.toLowerCase().replace(' ', '-')}`} onClick={() => setMenuOpen(false)}>{link}</a>)}<a href="mailto:?subject=Nexus%20IT%20Solutions%20%E2%80%94%20Let%E2%80%99s%20connect">GET IN TOUCH ↗</a></nav>}
          </header>
          <main className="hero-content flex flex-1 items-center px-8 max-w-7xl mx-auto w-full">
            <div className="hero-copy">
              <h1 className="heading-gradient text-4xl md:text-5xl lg:text-6xl font-normal leading-tight max-w-3xl" style={{letterSpacing: '-0.06em'}}>We drive companies beyond their biggest obstacles</h1>
              <p id="solutions" className="mt-6 text-muted-foreground text-lg md:text-xl max-w-xl font-akshar">Accelerating Growth through IT Strategy, Digital Innovation, and Custom-Built Technology Platforms</p>
              <a href="mailto:?subject=Start%20my%20journey%20with%20Nexus%20IT%20Solutions" className="notched-button inline-flex items-center justify-center font-akshar tracking-[0.05em] text-lg mt-10 relative"><span>START YOUR JOURNEY</span>{Array.from({length:8}, (_, i) => <span key={i} className={`corner corner-${i}`} aria-hidden="true" />)}</a>
            </div>
          </main>
          <footer className="trusted-section px-8 max-w-7xl mx-auto w-full">
            <p className="trusted-label font-akshar uppercase tracking-[0.12em] text-muted-foreground">Trusted by leading innovators worldwide</p>
            <div className="brands flex items-center text-lg md:text-2xl font-bold tracking-wide opacity-40" aria-label="Trusted by FedEx, amazon, McKESSON, and pitney bowes">
              <span className="brand-fedex">FedEx</span><span className="brand-amazon">amazon<svg viewBox="0 0 75 13" aria-hidden="true"><path d="M5 2 Q33 17 66 3 M58 2 L68 2 L66 10" /></svg></span><span className="brand-mckesson">McKESSON</span><span className="brand-pitney">pitney bowes</span>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}

createRoot(document.getElementById('root')!).render(<React.StrictMode><App /></React.StrictMode>);
