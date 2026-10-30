import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import Hls from 'hls.js';
import './styles.css';

const streams = [
  'https://stream.mux.com/1RdbcBtpEUK6501pc6yaIvwo9UfSnOg02k1uHxat00xR3w.m3u8',
  'https://stream.mux.com/t1TbTB8M1VYHkhxBuap4A8Vm1x015HTHyuQxqchDBago.m3u8',
  'https://stream.mux.com/6yvj9SR5bjmXq9N3ak7gy427RwUs8R2ZoH4ndA7Q1018.m3u8',
];
const asset = name => `${import.meta.env.BASE_URL}assets/${name}.jpg`;
function Arrow() { return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M6 18 18 6M6 6h12v12" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round" /></svg>; }
function Play() { return <svg width="15" height="15" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path d="M5 3.8c0-.6.7-1 1.2-.7l10 6.2a.8.8 0 0 1 0 1.4l-10 6.2c-.5.3-1.2-.1-1.2-.7V3.8Z" /></svg>; }
const information = {
  About: ['Built around your breakthrough.', 'We bring scientific expertise and business perspective together to help biotech leaders turn ambitious ideas into thriving bioventures.'],
  Offerings: ['From discovery to what’s next.', 'Work with experienced consultants on venture strategy, scientific development, and building the partnerships that move your biotech forward.'],
  Pricing: ['Expertise that fits your venture.', 'Every bioventure has different needs. Request a call to discuss your goals, scope, and a tailored consulting engagement.'],
  Blog: ['Ideas for the next breakthrough.', 'Our perspectives on science, entrepreneurship, and building a bioventure are coming soon.'],
  locations: ['United bio-entrepreneurs', 'A connected community of biotech entrepreneurs, bringing expertise and ideas together across borders.'],
  contact: ['Let’s build what’s next.', 'Tell us about your bioventure and the expertise you’re looking for.'],
  login: ['Welcome back.', 'Client access is arranged directly with your Bionova consulting team. Contact your consultant to request access.'],
  work: ['Science. Strategy. Progress.', 'We get to know your science, assemble the right expertise, and work alongside your team to move your bioventure forward.'],
};
function App() {
  const first = useRef(null), second = useRef(null), third = useRef(null);
  const dialog = useRef(null);
  const [panel, setPanel] = useState(null);
  useEffect(() => {
    const controllers = [];
    [first, second, third].forEach((ref, i) => {
      const video = ref.current;
      if (video.canPlayType('application/vnd.apple.mpegurl')) video.src = streams[i];
      else if (Hls.isSupported()) {
        const hls = new Hls({ capLevelToPlayerSize: true, maxBufferLength: 20 });
        hls.loadSource(streams[i]);
        hls.attachMedia(video);
        hls.on(Hls.Events.MANIFEST_PARSED, () => { video.play().catch(() => {}); });
        controllers.push(hls);
      }
    });
    return () => controllers.forEach(hls => hls.destroy());
  }, []);
  useEffect(() => {
    if (panel) dialog.current.showModal();
    else if (dialog.current.open) dialog.current.close();
  }, [panel]);
  const open = name => setPanel(name);
  return <>
    <section className="hero" aria-label="Bionova biotech consulting">
      <header className="navigation">
        <a className="brand" href={import.meta.env.BASE_URL} aria-label="Bionova home">BIONOVA</a>
        <nav aria-label="Main navigation">{['About', 'Offerings', 'Pricing', 'Blog'].map(item => <a key={item} href={`#${item.toLowerCase()}`} onClick={e => { e.preventDefault(); open(item); }}>{item}</a>)}</nav>
        <div className="nav-actions"><button className="login" onClick={() => open('login')}>Log in</button><button className="blue pill" onClick={() => open('contact')}>Request a call</button></div>
      </header>
      <main className="content">
        <div className="left fade-up">
          <div className="intro">
            <h1><span className="headline-line first-line"><span className="image-pill" role="img" aria-label="An abstract biological cell" />World-class</span><span className="headline-line">consultants that</span><span className="headline-line empower-line">empower <button className="work-button" onClick={() => open('work')}><Play />How do we work</button></span><span className="headline-line">biotech leaders</span></h1>
            <div className="cta-row"><button className="blue pill contact" onClick={() => open('contact')}>Contact us <Arrow /></button><button className="text-link" onClick={() => open('contact')}>Request a call</button></div>
          </div>
          <div className="trusted">
            <p>We bring together world-class consultants to help biotech leaders build, grow, and scale their ventures.</p>
            <div className="logos" aria-label="Trusted by Headway, brightline, hazel, and G&STC"><span className="headway">Headway</span><span className="brightline">brightline</span><span className="hazel">hazel</span><span className="gstc">G&STC</span></div>
          </div>
        </div>
        <div className="cards fade-up">
          <article className="card venture-card">
            <video ref={first} autoPlay muted loop playsInline preload="auto" poster={asset('bioventure')} aria-hidden="true" />
            <div className="card-content venture-content"><h2>If you're ready to build your bioventure, let's get in touch.</h2><div className="venture-bottom"><p>Partner with us to turn your vision<br className="desktop-break" /> into a thriving biotech venture.</p><button className="circle" aria-label="Get in touch" onClick={() => open('contact')}><Arrow /></button></div></div>
          </article>
          <div className="small-cards">
            <article className="card location-card">
              <video ref={second} autoPlay muted loop playsInline preload="auto" poster={asset('locations')} aria-hidden="true" />
              <div className="card-content small-content"><div className="card-top"><span className="badge">locations</span><button className="circle" aria-label="Explore our locations" onClick={() => open('locations')}><Arrow /></button></div><div><h2>United bio-entrepreneurs</h2><p>Connecting biotech leaders<br className="desktop-break" /> across the globe.</p></div></div>
            </article>
            <article className="card scientist-card">
              <video ref={third} autoPlay muted loop playsInline preload="auto" poster={asset('scientists')} aria-hidden="true" />
              <div className="card-content small-content"><div className="card-top"><span className="badge">scientists</span></div><div><p className="number">34</p><p>World-class scientists.<br />One shared ambition.</p></div></div>
            </article>
          </div>
        </div>
      </main>
    </section>
    <dialog ref={dialog} onCancel={() => setPanel(null)} onClick={e => { if (e.target === dialog.current) setPanel(null); }} aria-labelledby="dialog-title">
      <button className="close" onClick={() => setPanel(null)} aria-label="Close dialog">×</button>
      <span className="dialog-brand">BIONOVA</span>
      <h2 id="dialog-title">{information[panel]?.[0]}</h2><p>{information[panel]?.[1]}</p>
      {panel === 'contact' ? <a className="blue pill email" href="mailto:hello@bionova.example">Contact the team <Arrow /></a> : panel !== 'Blog' && <button className="blue pill" onClick={() => open('contact')}>Request a call <Arrow /></button>}
      {panel === 'contact' && <small>This concept has no live booking service. Contact details are illustrative.</small>}
    </dialog>
  </>;
}
createRoot(document.getElementById('root')).render(<App />);
