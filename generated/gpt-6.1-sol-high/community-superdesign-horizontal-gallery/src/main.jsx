import React, { useLayoutEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './style.css';

gsap.registerPlugin(ScrollTrigger);
const base = import.meta.env.BASE_URL;
const works = [
  { title: 'The quiet between', category: 'LANDSCAPE', location: 'THE DOLOMITES, ITALY', image: 'alpine.jpg', alt: 'A quiet alpine lake reflecting a small cabin and dramatic mountains', year: '2025' },
  { title: 'A softer geometry', category: 'ARCHITECTURE', location: 'SINGAPORE', image: 'architecture.jpg', alt: 'Sculptural white architecture curving into a blue sky', year: '2025' },
  { title: 'Nothing, and everything', category: 'EARTH', location: 'MONUMENT VALLEY, USA', image: 'desert.jpg', alt: 'Red sandstone buttes rising above the open desert in Monument Valley', year: '2024' },
  { title: 'Where we begin again', category: 'OCEAN', location: 'THE PACIFIC COAST', image: 'ocean.jpg', alt: 'Sunlight falling across blue ocean waves and a distant horizon', year: '2024' },
];

function Arrow({ diagonal = false, ...props }) {
  return <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}><path d={diagonal ? 'M5 19 19 5M5 5h14v14' : 'M4 12h16m-7-7 7 7-7 7'} stroke="currentColor" strokeWidth="1.4"/></svg>;
}

function App() {
  const section = useRef(null), track = useRef(null), tween = useRef(null), progress = useRef(null);
  const [active, setActive] = useState(0);

  useLayoutEffect(() => {
    let disposed = false, timer, context;
    // Wait for fonts, image decoding, and a paint before measuring the track.
    // The small delay also makes initialization safe under React StrictMode.
    const assets = [...track.current.querySelectorAll('img')].map(img => img.decode().catch(() => {}));
    Promise.all([document.fonts.ready, ...assets]).then(() => {
      if (disposed) return;
      timer = window.setTimeout(() => {
        if (disposed || !section.current || !track.current || track.current.scrollWidth <= 0) return;
        context = gsap.context(() => {
          const mm = gsap.matchMedia();
          mm.add('(prefers-reduced-motion: no-preference)', () => {
            const distance = () => Math.max(0, track.current.scrollWidth - section.current.clientWidth + parseFloat(getComputedStyle(track.current).paddingLeft));
            tween.current = gsap.to(track.current, {
              x: () => -distance(), ease: 'none',
              scrollTrigger: {
                trigger: section.current, start: 'top top', end: () => `+=${distance()}`,
                pin: true, scrub: 0.65, invalidateOnRefresh: true,
                onUpdate: self => {
                  setActive(Math.min(3, Math.round(self.progress * 3)));
                  if (progress.current) progress.current.style.transform = `scaleX(${self.progress})`;
                }
              }
            });
          });
        }, section);
        ScrollTrigger.refresh();
      }, 100);
    });
    return () => { disposed = true; clearTimeout(timer); context?.revert(); tween.current = null; };
  }, []);

  function goTo(index) {
    const trigger = tween.current?.scrollTrigger;
    if (trigger) window.scrollTo({ top: trigger.start + (trigger.end - trigger.start) * index / 3, behavior: 'smooth' });
    else track.current.children[index]?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
  }

  return <>
    <header className="site-header">
      <a className="wordmark" href="#" aria-label="Somewhere home">somewhere<span className="logo-dot">®</span></a>
      <span className="header-note">INDEPENDENT IN SPIRIT. CURIOUS BY NATURE.</span>
      <a className="gallery-link" href="#gallery">Explore the gallery <Arrow diagonal /></a>
    </header>
    <main>
      <section className="intro" aria-labelledby="intro-title">
        <div className="eyebrow"><span className="live-dot"/> A COLLECTION OF PERSPECTIVES</div>
        <div className="intro-grid"><h1 id="intro-title">A different<br/>point of <span className="view-word">view<svg viewBox="0 0 310 14" aria-hidden="true"><path d="M3 10Q130 -1 305 7"/></svg></span><span className="title-period">.</span></h1>
          <div className="intro-aside"><p>There's a little extraordinary<br/>in everything. You just have<br/>to look a little closer.</p><a href="#gallery" className="scroll-prompt"><span>SCROLL TO EXPLORE</span><span className="round-arrow">↓</span></a></div>
        </div>
      </section>
      <section className="gallery" id="gallery" ref={section} aria-label="Selected photographic works">
        <div className="gallery-heading"><h2>Selected perspectives <span>(01—04)</span></h2><span className="direction-hint">A LITTLE FURTHER, A LITTLE DIFFERENT <Arrow /></span></div>
        <div className="gallery-window"><div className="gallery-track" ref={track}>
          {works.map((work, index) => <article className={`work work-${index}`} key={work.title}>
            <div className="photo-wrap"><img src={`${base}images/${work.image}`} alt={work.alt} fetchPriority={index === 0 ? 'high' : 'auto'} /><div className="photo-topline"><span>{work.category}</span><span>{work.year}</span></div><span className="photo-number">0{index + 1}</span><span className="photo-corner"><Arrow diagonal /></span></div>
            <div className="work-caption"><h3>{work.title}</h3><span>{work.location}</span></div>
          </article>)}
        </div></div>
        <div className="gallery-bottom"><span className="current-count">0{active + 1}<span> / 04</span></span><div className="progress-line"><div ref={progress}/></div><div className="gallery-controls"><button onClick={() => goTo(Math.max(0, active - 1))} aria-label="Previous photograph" disabled={active === 0}><Arrow style={{transform:'rotate(180deg)'}}/></button><button onClick={() => goTo(Math.min(3, active + 1))} aria-label="Next photograph" disabled={active === 3}><Arrow/></button></div></div>
      </section>
      <footer><div className="eyebrow"><span className="live-dot"/> KEEP YOUR EYES OPEN</div><div className="footer-main"><h2>Everywhere is<br/><em>somewhere.</em></h2><p>A small collection. An endless curiosity.<br/>Thanks for coming along for the ride.</p></div><div className="footer-bottom"><a className="wordmark" href="#">somewhere®</a><span>© 2026 SOMEWHERE STUDIO</span><button onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>BACK TO TOP ↑</button></div></footer>
    </main>
  </>;
}

createRoot(document.getElementById('root')).render(<React.StrictMode><App/></React.StrictMode>);
