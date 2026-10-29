import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { motion } from 'framer-motion';
import { Share2 } from 'lucide-react';
import './styles.css';

const assetRoot = 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/';
const background = `${assetRoot}hf_20260514_135830_bb6491d1-9b66-4aec-9722-13b4dfe3fb46.mp4`;
const services = [
  { video: 'hf_20260513_220333_48163edc-995f-4513-9f44-48dbb07a7329.mp4', title: 'Process Streamlining', text: 'We automate your processes by linking together the daily tools you rely upon. Lifting throughput and improving overall output.' },
  { video: 'hf_20260513_221040_e6ba7c5a-864e-46e9-871e-341a176a7e3e.mp4', title: 'Strategic advisory', text: 'We craft intelligent assistants that are adaptive, grasp context, and are skilled enough to handle highly intricate customer requests.' },
  { video: 'hf_20260513_221104_fb538584-5b87-495f-952e-09ddd5a1792a.mp4', title: 'Assistant engineering', text: 'Through our knowledge, we explore deep into your business and advise you on how AI powered automations may transform your operations.' },
];
export function FadeUp({ children, delay = 0, duration = 0.7, y = 24, className, style, as = 'div', once = true }) {
  const Component = motion[as];
  return <Component className={className} style={style} initial={{ opacity: 0, y }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once, amount: 0.2 }} transition={{ duration, delay, ease: [0.22, 1, 0.36, 1] }}>{children}</Component>;
}
function Words({ text, delay, step, y }) {
  return text.split(' ').map((word, i) => <FadeUp key={`${word}-${i}`} as="span" delay={delay + i * step} y={y}>{word}</FadeUp>);
}
function App() {
  const [shareStatus, setShareStatus] = useState('');
  async function repost() {
    try {
      if (navigator.share) await navigator.share({ title: 'COGNITRA — AI Automation', url: window.location.href });
      else { await navigator.clipboard.writeText(window.location.href); setShareStatus('LINK COPIED'); }
    } catch (error) { if (error.name !== 'AbortError') setShareStatus('SHARING UNAVAILABLE'); }
    window.setTimeout(() => setShareStatus(''), 3000);
  }
  const email = 'mailto:?subject=Book%20a%20call%20with%20COGNITRA&body=Hi%20COGNITRA%2C%0A%0AI%27d%20like%20to%20discuss%20AI%20automation%20for%20my%20business.';
  return <div style={{ position: 'relative' }}>
    <video className="background-video" src={background} autoPlay muted loop playsInline aria-hidden="true" />
    <nav className="navbar" aria-label="Main navigation">
      <FadeUp delay={0}><a className="nav-brand" href="#main">COGNITRA</a></FadeUp>
      <div className="nav-links flex items-center">
        {[['MAIN', '#main'], ['OFFERING', '#offering'], ['CASE', '#statement'], ['RATES', '#offering']].map(([label, href], i) => <FadeUp key={label} delay={0.05 + i * 0.05}><a href={href}>{label}</a></FadeUp>)}
      </div>
      <div className="nav-links nav-links-secondary flex items-center">
        {[['CREW', '#statement'], ['CONNECT', email]].map(([label, href], i) => <FadeUp key={label} delay={0.3 + i * 0.05}><a href={href}>{label}</a></FadeUp>)}
      </div>
    </nav>
    <main>
      <section id="main" className="hero" aria-label="Introduction">
        <div className="hero-overlay">
          <div className="hero-inner">
            <div className="hero-row">
              <div className="hero-col-left">
                <FadeUp as="h1" delay={0.1}>SCALING<br />FASTER USING AI</FadeUp>
                <FadeUp className="counter" delay={0.5}>001 / 005</FadeUp>
              </div>
              <div className="hero-col-right">
                <FadeUp as="p" className="hero-description" delay={0.25}>We engineer custom automation flows and personalized AI products for ambitious modern businesses.</FadeUp>
                <FadeUp className="hero-buttons flex" delay={0.4}>
                  <a className="btn-primary" href={email}>BOOK A CALL!</a>
                  <a className="btn-secondary" href="#offering">OUR PRODUCTS</a>
                </FadeUp>
              </div>
            </div>
          </div>
        </div>
        <div className="hero-bottom-text"><FadeUp delay={0.6}>Guiding future-minded companies forward with bespoke AI products and streamlined workflows.</FadeUp></div>
      </section>
      <section id="statement" className="statement section-pad">
        <div className="statement-inner">
          <h2><Words text="WE BUILD END-TO-END AI AUTOMATION SYSTEMS." delay={0.15} step={0.08} y={32} /></h2>
          <FadeUp as="p" delay={0.9}>We provide all-in-one AI automation services in one place.</FadeUp>
        </div>
      </section>
      <section id="offering" className="services section-pad-lg">
        <FadeUp className="counter services-counter" delay={0}>003 / 005</FadeUp>
        <div className="services-head-row">
          <div className="services-head-col"><h2><Words text="EXPLORE WHAT WE OFFER" delay={0.1} step={0.1} y={28} /></h2></div>
          <div className="services-head-description"><FadeUp as="p" delay={0.25}>We provide all-in-one AI automation services in one place.</FadeUp></div>
        </div>
        <div className="cards-grid grid">
          {services.map((service, i) => <FadeUp className="service-card" delay={0.4 + i * 0.15} key={service.title}>
            <div className="card-video"><video src={`${assetRoot}${service.video}`} autoPlay muted loop playsInline aria-label={`${service.title} animation`} /></div>
            <div className="card-text"><h3>{service.title}</h3><p>{service.text}</p></div>
          </FadeUp>)}
        </div>
      </section>
    </main>
    <a href="#offering" className="scroll-indicator" aria-label="Scroll to our services"><span className="scroll-pill"><span /></span></a>
    <button className="repost" onClick={repost}><Share2 size={14} strokeWidth={2} aria-hidden="true" /><span aria-live="polite">{shareStatus || 'REPOST'}</span></button>
  </div>;
}
createRoot(document.getElementById('root')).render(<App />);
