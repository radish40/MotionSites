import React from 'react';
import ReactDOM from 'react-dom/client';
import { Button } from '@/components/ui/button';
import './index.css';

const displayFont = { fontFamily: "'Instrument Serif', serif" };
const links = [
  ['Home', 'home'], ['Studio', 'studio'], ['About', 'about'], ['Journal', 'journal'], ['Reach Us', 'reach-us'],
] as const;

function App() {
  const [active, setActive] = React.useState('Home');
  const heading = React.useRef<HTMLHeadingElement>(null);
  const [intro, setIntro] = React.useState(0);
  React.useEffect(() => {
    if (intro > 0) {
      heading.current?.focus({ preventScroll: true });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [intro]);
  function beginJourney() {
    setIntro(value => value + 1);
    setActive('Home');
    window.history.replaceState(null, '', '#journey');
  }
  return (
    <div id="home" className="relative isolate min-h-svh overflow-hidden bg-background text-foreground">
      <video className="absolute inset-0 z-0 h-full w-full object-cover" autoPlay loop muted playsInline preload="auto" aria-hidden="true">
        <source src={`${import.meta.env.BASE_URL}assets/velorah.mp4`} type="video/mp4" />
      </video>
      <header className="relative z-10">
        <nav aria-label="Main navigation" className="mx-auto flex max-w-7xl items-center justify-between px-8 py-6">
          <a href="#home" aria-label="Velorah home" className="text-3xl tracking-tight" style={displayFont} onClick={() => setActive('Home')}>Velorah<sup className="ml-0.5 text-xs">®</sup></a>
          <div className="hidden items-center gap-8 md:flex">
            {links.map(([label, target]) => <a key={label} href={`#${target}`} onClick={() => setActive(label)} aria-current={active === label ? 'page' : undefined} className={`text-sm transition-colors hover:text-foreground ${active === label ? 'text-foreground' : 'text-muted-foreground'}`}>{label}</a>)}
          </div>
          <Button onClick={beginJourney}>Begin Journey</Button>
        </nav>
      </header>
      <main id="studio" className="relative z-10">
        <section id="journey" aria-labelledby="hero-heading" className="flex flex-col items-center px-6 py-[90px] text-center sm:pb-40 sm:pt-32">
          <h1 key={`heading-${intro}`} ref={heading} id="hero-heading" tabIndex={-1} style={displayFont} className="animate-fade-rise max-w-7xl text-5xl font-normal leading-[0.95] tracking-[-2.46px] outline-none sm:text-7xl md:text-8xl">
            Where <em className="not-italic text-muted-foreground">dreams</em> rise<br className="hidden sm:block" /> <span id="journal"><em className="not-italic text-muted-foreground">through the silence.</em></span>
          </h1>
          <p key={`copy-${intro}`} id="about" className="animate-fade-rise-delay mt-8 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            We're designing tools for deep thinkers, bold creators, and quiet rebels. Amid the chaos, we build digital spaces for sharp focus and inspired work.
          </p>
          <div id="reach-us" key={`cta-${intro}`} className="animate-fade-rise-delay-2 mt-12">
            <Button size="hero" className="cursor-pointer" onClick={beginJourney}>Begin Journey</Button>
          </div>
        </section>
      </main>
    </div>
  );
}
ReactDOM.createRoot(document.getElementById('root')!).render(<React.StrictMode><App /></React.StrictMode>);
