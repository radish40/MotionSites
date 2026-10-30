import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

function FadeIn({ children, delay = 0, duration = 1000, className = '' }: { children: React.ReactNode; delay?: number; duration?: number; className?: string }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => { const timer = setTimeout(() => setVisible(true), delay); return () => clearTimeout(timer); }, [delay]);
  return <div className={`transition-opacity ${className}`} style={{ opacity: visible ? 1 : 0, transitionDuration: `${duration}ms` }}>{children}</div>;
}

function AnimatedHeading({ text }: { text: string }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => { const timer = setTimeout(() => setVisible(true), 200); return () => clearTimeout(timer); }, []);
  return <h1 id="story" aria-label={text.replace('\n', ' ')} className="mb-4 text-4xl font-normal md:text-5xl lg:text-6xl xl:text-7xl" style={{ letterSpacing: '-0.04em' }}>
    {text.split('\n').map((line, lineIndex) => <React.Fragment key={lineIndex}>
      {lineIndex > 0 && <br />}
      <span aria-hidden="true" className="heading-line">{Array.from(line).map((char, charIndex) => <span key={charIndex} className="inline-block" style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateX(0)' : 'translateX(-18px)', transitionProperty: 'opacity, transform', transitionDuration: '500ms', transitionDelay: `${lineIndex * line.length * 30 + charIndex * 30}ms` }}>{char === ' ' ? '\u00A0' : char}</span>)}</span>
    </React.Fragment>)}
  </h1>;
}

const chatLink = 'mailto:?subject=VEX%20Ventures%20Enquiry';
function App() {
  return <main className="relative isolate flex min-h-svh flex-col overflow-hidden bg-black text-white">
    <video className="absolute inset-0 -z-10 h-full w-full object-cover" src={`${import.meta.env.BASE_URL}assets/vex-background.mp4`} autoPlay loop muted playsInline aria-hidden="true" />
    <header className="px-6 pt-6 md:px-12 lg:px-16">
      <nav aria-label="Main navigation" className="liquid-glass flex items-center justify-between rounded-xl px-4 py-2">
        <a href="#" aria-label="VEX home" className="text-2xl font-semibold tracking-tight">VEX</a>
        <div className="hidden items-center gap-8 text-sm md:flex">
          <a className="transition-colors hover:text-gray-300" href="#story">Story</a>
          <a className="transition-colors hover:text-gray-300" href="#investing">Investing</a>
          <a className="transition-colors hover:text-gray-300" href="#building">Building</a>
          <a className="transition-colors hover:text-gray-300" href="#advisory">Advisory</a>
        </div>
        <a href={chatLink} className="rounded-lg bg-white px-6 py-2 text-sm font-medium text-black transition-colors hover:bg-gray-100">Start a Chat</a>
      </nav>
    </header>
    <section aria-label="VEX Ventures introduction" className="flex flex-1 flex-col justify-end px-6 pb-12 pt-16 md:px-12 lg:px-16 lg:pb-16">
      <div className="lg:grid lg:grid-cols-2 lg:items-end">
        <div>
          <AnimatedHeading text={'Shaping tomorrow\nwith vision and action.'} />
          <FadeIn delay={800}><p className="mb-5 text-base text-gray-300 md:text-lg">We back visionaries and craft ventures that define what comes next.</p></FadeIn>
          <FadeIn delay={1200} className="flex flex-wrap gap-4">
            <a href={chatLink} className="rounded-lg bg-white px-8 py-3 font-medium text-black transition-colors hover:bg-gray-100">Start a Chat</a>
            <a href="#ventures" className="liquid-glass rounded-lg border border-white/20 px-8 py-3 font-medium text-white transition-colors hover:bg-white hover:text-black">Explore Now</a>
          </FadeIn>
        </div>
        <FadeIn delay={1400} className="mt-8 flex items-end justify-start lg:mt-0 lg:justify-end">
          <div id="ventures" className="liquid-glass rounded-xl border border-white/20 px-6 py-3">
            <p className="text-lg font-light md:text-xl lg:text-2xl"><span id="investing">Investing.</span> <span id="building">Building.</span> <span id="advisory">Advisory.</span></p>
          </div>
        </FadeIn>
      </div>
    </section>
  </main>;
}

createRoot(document.getElementById('root')!).render(<React.StrictMode><App /></React.StrictMode>);
