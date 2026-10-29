import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

const asset = name => `${import.meta.env.BASE_URL}assets/${name}`;
const heading = 'Unlock Top Marketing Talent You Thought Was Out of Reach -- Now Just One Click Away!';
const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function TypewriterHeading({ text, speed = 35, onComplete }) {
  const [length, setLength] = useState(() => reducedMotion() ? text.length : 0);
  useEffect(() => {
    if (reducedMotion()) { onComplete(); return; }
    let interval;
    const delay = setTimeout(() => {
      let count = 0;
      interval = setInterval(() => {
        count += 1; setLength(count);
        if (count >= text.length) { clearInterval(interval); onComplete(); }
      }, speed);
    }, 400);
    return () => { clearTimeout(delay); clearInterval(interval); };
  }, [text, speed, onComplete]);
  return <h1 aria-label={text}>
    <span className="heading-space" aria-hidden="true">{text}</span>
    <span className="typed-heading" aria-hidden="true"><span className="dark-copy">{text.slice(0, Math.min(length, 67))}</span><span className="light-copy">{text.slice(67, length)}</span>{length < text.length && <span className="typing-cursor" />}</span>
  </h1>;
}

function useCountUp(target = 20, duration = 2000, delay = 1200) {
  const [count, setCount] = useState(() => reducedMotion() ? target : 0);
  const frame = useRef(0);
  useEffect(() => {
    if (reducedMotion()) return;
    const timer = setTimeout(() => {
      let start;
      const tick = time => {
        start ??= time;
        const progress = Math.min((time - start) / duration, 1);
        setCount(Math.round(target * (1 - Math.pow(1 - progress, 3))));
        if (progress < 1) frame.current = requestAnimationFrame(tick);
      };
      frame.current = requestAnimationFrame(tick);
    }, delay);
    return () => { clearTimeout(timer); cancelAnimationFrame(frame.current); };
  }, [target, duration, delay]);
  return count;
}
const people = [
  { file:'aa51718fb3af3637e6d666b6543fc27a175fada6.png', orbit:1, angle:270, radius:177, square:20, glow:'#A068FF', delay:.6 },
  { file:'ca755f7f93c1126fb8bdbf99ab364a33aa9ab272.png', orbit:2, angle:60, radius:251, glow:'#ffce67', delay:.8 },
  { file:'dc01064c7093dcc32674876ee3cf5e41c4a485c6.png', orbit:2, angle:180, radius:251, size:78, glow:'#f8a1df', delay:1 },
  { file:'d5470a58b02388336141575048720f19a50de832.png', orbit:2, angle:300, radius:251, square:20, glow:'#89caff', delay:1.2 },
  { file:'018736aa5d0275c4ce56cfebaf2ae3007d81ca1e.png', orbit:3, angle:130, radius:325, size:88, glow:'#f8a1df', delay:1.4 },
  { file:'c76d8a0b99676de31c014344bfaf75bad090758d.png', orbit:4, angle:30, radius:399, glow:'#A068FF', delay:1.6 },
  { file:'7b1b5f039de7b54cc9913e96c1923c3b15a157fa.png', orbit:4, angle:95, radius:399, size:88, square:24, glow:'#ffb77c', delay:1.8 },
  { file:'9ae171d8895199349755c43fbff00e122221a027.png', orbit:4, angle:220, radius:399, size:88, square:24, glow:'#f8a1df', delay:2 },
  { file:'926c9eb7b4bc1df846fa0e39f0b0dc3fefd80671.png', orbit:4, angle:320, radius:399, glow:'#A068FF', delay:2.3 },
];
const logos = ['1e7b0e6fcc016cd28aec5c68990118b8c54c35a5.svg','3eac03c183db2ae080d910159211c14843398b61.svg','17705a4c0023a0e5a99154dfb10582adbbf4260b.svg','0e5f442b09dc5c248e3e60d40a65505fb1887228.svg','63f99030ceb459e3c9ab9e429cfa2353491d3816.svg'];
function PillButton({ children, project = false }) {
  return <div className={`btn-border-wrap ${project ? 'project-wrap' : ''}`}><a className={`pill-button ${project ? 'project-button' : ''}`} href="#" onClick={event => event.preventDefault()}>{children}{project && <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true"><path d="m7 4 5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>}</a></div>;
}
function Network() {
  const count = useCountUp();
  return <div className="network-stage" id="specialists" role="img" aria-label="A network of 20 thousand plus marketing specialists"><div className="network-scale"><div className="network-entrance"><div className="network">
    {[1,2,3,4].map(orbit => <div key={orbit} className={`orbit orbit-${orbit}`}>
      {orbit === 1 && <div className="counter-rotation count"><span className="count-value">{count}k+</span><span className="count-label">Specialists</span></div>}
      {people.filter(person => person.orbit === orbit).map(person => <div key={person.file} className="avatar-position" style={{'--angle':`${person.angle}deg`,'--radius':`${person.radius}px`,'--size':`${person.size || 58}px`,'--round':`${person.square || 100}px`,'--glow':person.glow,'--delay':`${person.delay}s`}}><div className="counter-rotation"><img className="avatar" src={asset(person.file)} alt="" /></div></div>)}
    </div>)}
  </div></div></div></div>;
}
const completeTyping = () => document.documentElement.classList.add('typing-complete');
function App() {
  return <div className="app">
    <header className="header">
      <div className="header-left"><a className="brand" href="#" aria-label="Marketeam home"><img src={asset('17ae538989a509947a8de3892c644664895e69b1.png')} alt="Marketeam" height="32" /></a>
      <nav aria-label="Main navigation">{['Your Team','Solutions','Blog','Pricing'].map(label => <a className="nav-link" href="#" onClick={event => event.preventDefault()} key={label}>{label}</a>)}</nav></div>
      <div className="header-right"><a className="login nav-link" href="#" onClick={event => event.preventDefault()}>Log In</a><PillButton>Join Now</PillButton></div>
    </header>
    <main className="hero"><section className="hero-left" aria-label="Find your marketing team">
      <TypewriterHeading text={heading} onComplete={completeTyping} />
      <div className="project-entrance"><PillButton project>Start Project</PillButton></div>
      <div className="david-cursor" aria-hidden="true"><svg width="30" height="34" viewBox="0 0 30 34"><path d="M2 2 26 19l-12 2-5 11Z" fill="#A068FF" stroke="#c8a4ff" strokeWidth="1" /></svg><span>David</span></div>
    </section><Network /></main>
    <footer className="partners" aria-label="Our partners"><div className="ticker">{Array.from({length:4},(_,i) => <div className="ticker-group" key={i} aria-hidden={i > 0 ? 'true' : undefined}>{logos.map((logo,j) => <img key={logo} src={asset(logo)} alt={i === 0 ? `Partner ${j+1}` : ''} width="137" height="40" />)}</div>)}</div></footer>
  </div>;
}

createRoot(document.getElementById('root')).render(<App />);
