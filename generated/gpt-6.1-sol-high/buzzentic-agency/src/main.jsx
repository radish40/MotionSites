import React, { useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

const Arrow = ({ diagonal = false }) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d={diagonal ? 'M6 18 18 6M6 6h12v12' : 'M4 12h15m-6-6 6 6-6 6'} stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" /></svg>;

function App() {
  const [panel, setPanel] = useState(null);
  const [menu, setMenu] = useState(false);
  const [saved, setSaved] = useState(false);
  const dialog = useRef(null);
  function openPanel(name) { setPanel(name); setMenu(false); setSaved(false); dialog.current.showModal(); }
  function saveBrief(event) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const brief = `Buzzentic Agency — Project brief\n\nName: ${data.get('name')}\nEmail: ${data.get('email')}\n\nThe idea\n${data.get('idea')}\n`;
    const url = URL.createObjectURL(new Blob([brief], {type: 'text/plain'}));
    const a = document.createElement('a'); a.href = url; a.download = 'buzzentic-project-brief.txt'; a.click(); URL.revokeObjectURL(url); setSaved(true);
  }
  return <main id="home" className="relative min-h-svh text-white">
    <video className="hero-video" src={`${import.meta.env.BASE_URL}assets/hero.mp4`} autoPlay loop muted playsInline aria-hidden="true" />
    <div className="page-shell relative z-10">
      <header className="flex items-center justify-between">
        <a href="#home" className="brand" aria-label="Buzzentic home">buzzentic<span className="brand-star" aria-hidden="true">✳</span><span className="brand-dot">®</span></a>
        <nav className="desktop-nav flex items-center gap-2" aria-label="Main navigation">
          <button className="nav-link" onClick={() => openPanel('About us')}>About us</button>
          <button className="nav-link" onClick={() => openPanel('What we do')}>What we do</button>
          <button className="nav-link" onClick={() => openPanel('Our approach')}>Our approach</button>
        </nav>
        <button className="button nav-cta" onClick={() => openPanel('Let’s talk')}>Let’s talk <Arrow diagonal /></button>
        <button className="menu-toggle nav-link" aria-label={menu ? 'Close navigation' : 'Open navigation'} aria-expanded={menu} onClick={() => setMenu(!menu)}><span /> <span /></button>
        {menu && <nav className="mobile-menu" aria-label="Mobile navigation">{['About us','What we do','Our approach','Let’s talk'].map(name => <button key={name} onClick={() => openPanel(name)}>{name}<Arrow diagonal /></button>)}</nav>}
      </header>
      <section className="hero" aria-labelledby="hero-title">
        <div className="hero-content relative text-center">
          {['tl','tr','bl','br'].map(corner => <span key={corner} className={`corner ${corner}`} aria-hidden="true" />)}
          <button className="featured group" onClick={() => openPanel('Featured in Fortune')} aria-label="About the Featured in Fortune badge">
            <span className="featured-inner"><span className="badge-spark" aria-hidden="true">✧</span><span>Featured in <strong>FORTUNE</strong></span><Arrow diagonal /></span>
          </button>
          <h1 id="hero-title"><span>Agency that makes your</span><em>videos &amp; reels viral</em></h1>
          <p className="hero-description">We turn your brand’s story into scroll-stopping content.<br className="desktop-break" /> From the first idea to the final cut, we make every frame count.</p>
          <button className="button hero-cta" onClick={() => openPanel('Let’s talk')}>Let’s create a buzz <Arrow diagonal /></button>
          <div className="availability"><span /> Big ideas. Real impact.</div>
        </div>
      </section>
      <footer className="flex items-end justify-between"><span>Independent minds.<br /><span className="text-white/75">Unforgettable content.</span></span><span className="footer-right">Built for the scroll.<br /><span className="text-white/75">Made to stay with you.</span></span></footer>
    </div>
    <dialog ref={dialog} className="info-dialog" aria-labelledby="dialog-title" onClick={event => {if (event.target === dialog.current) dialog.current.close();}}>
      <button className="dialog-close" aria-label="Close dialog" onClick={() => dialog.current.close()}>×</button>
      <span className="dialog-eyebrow">BUZZENTIC AGENCY</span><h2 id="dialog-title">{panel}</h2>
      {panel === 'About us' && <p>We’re an independent creative agency with a simple obsession: making content people feel. We bring ideas, storytelling, and editing together to help brands find their voice on screen.</p>}
      {panel === 'What we do' && <div className="service-list"><p><b>Creative strategy</b><span>A clear story, built around your brand and audience.</span></p><p><b>Video production</b><span>Bold ideas brought to life, from concept to final cut.</span></p><p><b>Reels & social content</b><span>Short-form storytelling that makes people stop and watch.</span></p></div>}
      {panel === 'Our approach' && <p>Find the story. Make it matter. Create the buzz. We start with what makes your brand different, shape it into a compelling idea, and craft every frame for the people you want to reach.</p>}
      {panel === 'Featured in Fortune' && <p>Stories travel when they give people something to talk about. We bring that same ambition to every brand, every reel, and every frame.</p>}
      {panel === 'Let’s talk' && <form onSubmit={saveBrief}><p>Great content starts with a conversation. Put your idea into a project brief.</p><label>Your name<input name="name" autoComplete="name" placeholder="Alex Morgan" required /></label><label>Email address<input type="email" name="email" autoComplete="email" placeholder="alex@yourbrand.com" required /></label><label>What are you dreaming up?<textarea name="idea" placeholder="A little about your brand and your next big idea…" required rows="3" /></label><button className="button" type="submit">Save project brief <Arrow /></button><small role="status">{saved ? 'Your project brief is saved. No information has been sent.' : 'Download your brief to share with your team. This form does not send information.'}</small></form>}
    </dialog>
  </main>;
}

createRoot(document.getElementById('root')).render(<App />);
