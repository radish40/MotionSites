import { useRef, useState } from 'react';
import { ArrowRight, ArrowUpRight, X } from 'lucide-react';
import SplitText from './SplitText';

const videoUrl = `${import.meta.env.BASE_URL}assets/slate-landscape.mp4`;
const navigation = ['Our Approach', 'Products', 'Story', 'Resources', 'Billing'];
const information: Record<string, string> = {
  'Our Approach': 'Build a thriving hub where your smartest ideas grow smoothly, and your dreams arrive sooner than ever.',
  Products: 'Meet Slate 2.4. A home for your team and your next big idea.',
  Story: 'Grow Your Team Thriving. Welcome to Slate.',
  Resources: 'Welcome to Slate 2.4! Read the guide to getting started.',
  Billing: 'Billing is available in your Slate workspace. This preview is not connected to a workspace.',
  'Read Guide': 'Welcome to Slate 2.4! Start by bringing your team together, making room for your ideas, and growing from there.',
};

export default function App() {
  const dialog = useRef<HTMLDialogElement>(null);
  const demo = useRef<HTMLVideoElement>(null);
  const [panel, setPanel] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const openPanel = (name: string) => {
    setPanel(name);
    setSubmitted(false);
    dialog.current?.showModal();
  };
  const closePanel = () => {
    demo.current?.pause();
    dialog.current?.close();
  };

  return (
    <div className="relative min-h-screen overflow-x-clip bg-[#344638] text-white">
      <video className="absolute inset-0 h-full w-full object-cover" src={videoUrl} autoPlay muted loop playsInline aria-hidden="true" />
      <div className="relative z-10 flex min-h-screen flex-col lg:h-screen lg:overflow-hidden">
        <header className="flex items-center justify-between px-4 py-4 sm:px-6 lg:px-10 lg:py-5">
          <a href="#home" aria-label="Slate home" className="flex items-center gap-2.5">
            <svg width="22" height="22" viewBox="0 0 256 256" fill="currentColor" aria-hidden="true"><path d="M 256 256 L 128 256 L 0 128 L 128 128 Z M 256 128 L 128 128 L 0 0 L 128 0 Z" /></svg>
            <span className="text-lg font-light tracking-tight text-white">Slate</span>
          </a>
          <nav aria-label="Main navigation" className="hidden items-center gap-8 lg:flex">
            {navigation.map(label => <button key={label} onClick={() => openPanel(label)} className="text-sm text-white/70 transition-colors hover:text-white">{label}</button>)}
          </nav>
          <button onClick={() => openPanel('Start today')} className="liquid-glass rounded-xl px-4 py-2 text-xs font-light text-white/90 transition-colors hover:brightness-110 sm:px-5 sm:text-sm" style={{ background: 'rgba(255,255,255,0.22)' }}>Start today</button>
        </header>
        <main id="home" className="flex flex-col items-center px-4 pt-8 pb-8 text-center sm:px-6 sm:pt-12 sm:pb-10 lg:pt-16 lg:pb-12">
          <div className="liquid-glass mb-4 flex items-center gap-2.5 rounded-full px-3 py-1.5 sm:px-4">
            <span className="text-xs text-white/80 sm:text-sm">Welcome to Slate 2.4!</span>
            <span className="text-xs text-white/50" aria-hidden="true">|</span>
            <button onClick={() => openPanel('Read Guide')} className="flex items-center gap-1.5 text-xs text-white/70 transition-colors hover:text-white sm:text-sm">Read Guide <ArrowRight size={13} /></button>
          </div>
          <div className="hero-heading mb-5 flex flex-col" style={{ fontSize: 'clamp(36px, 8vw, 76px)', letterSpacing: '-1.5px', lineHeight: 1.1, fontWeight: 200, textShadow: '0 2px 20px rgba(0,0,0,0.3)' }}>
            <SplitText text="Grow Your Team" tag="h1" delay={60} duration={0.8} ease="power3.out" splitType="chars" from={{ opacity: 0, y: 40 }} to={{ opacity: 1, y: 0 }} threshold={0.1} rootMargin="0px" textAlign="center" />
            <div style={{ marginTop: '-0.15em' }}><SplitText text="Thriving" tag="h1" delay={60} duration={0.8} ease="power3.out" splitType="chars" from={{ opacity: 0, y: 40 }} to={{ opacity: 1, y: 0 }} threshold={0.1} rootMargin="0px" textAlign="center" /></div>
          </div>
          <p className="hero-fade-up mb-6 max-w-md px-2 leading-relaxed text-white/65" style={{ fontSize: 'clamp(13px, 1.5vw, 17px)', lineHeight: 1.6, animationDelay: '0.6s' }}>
            Build a thriving hub where your smartest ideas grow<br className="hidden sm:block" /> smoothly, and your dreams arrive sooner than ever.
          </p>
          <div className="flex w-full max-w-xs flex-col items-stretch gap-3 sm:w-auto sm:max-w-none sm:flex-row sm:items-center sm:gap-4">
            <button onClick={() => openPanel('Start today')} className="liquid-glass hero-fade-up group flex items-center justify-center gap-2.5 rounded-xl px-6 py-2.5 font-light text-white transition-all duration-200 sm:px-7" style={{ background: 'rgba(255,255,255,0.22)', animationDelay: '0.85s' }}><span style={{ fontSize: 15 }}>Start today</span><ArrowUpRight size={18} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" /></button>
            <button onClick={() => openPanel('Watch demo')} className="liquid-glass hero-fade-up flex items-center justify-center gap-2.5 rounded-xl px-6 py-2.5 font-light text-white transition-all duration-200 hover:bg-white/8 sm:px-7" style={{ animationDelay: '1.0s' }}><span style={{ fontSize: 15 }}>Watch demo</span></button>
          </div>
        </main>
      </div>
      <dialog ref={dialog} className="slate-dialog" aria-labelledby="dialog-title" onClick={event => { if (event.target === event.currentTarget) closePanel(); }} onCancel={event => { event.preventDefault(); closePanel(); }} onClose={() => demo.current?.pause()}>
        <div className="dialog-content">
          <button className="dialog-close" onClick={closePanel} aria-label="Close dialog"><X size={20} /></button>
          <h2 id="dialog-title" className="mb-4 text-3xl">{panel}</h2>
          {panel === 'Watch demo' ? <><p className="mb-5 text-sm text-white/70">A moment in Slate’s world.</p><video ref={demo} src={videoUrl} controls autoPlay playsInline className="w-full rounded-xl" /></> : panel === 'Start today' ? submitted ? <p role="status" className="leading-relaxed text-white/80">You’re ready to get started. This is a design preview; your email has not been sent or stored.</p> : <form onSubmit={event => { event.preventDefault(); setSubmitted(true); }}>
            <p className="mb-6 text-sm text-white/70">A little space for your next big idea.</p>
            <label htmlFor="email" className="mb-2 block text-sm">Work email</label>
            <input id="email" type="email" autoComplete="email" required placeholder="you@company.com" className="mb-4 w-full rounded-xl border border-white/30 bg-white/5 px-4 py-3 text-white outline-offset-4" />
            <button type="submit" className="liquid-glass w-full rounded-xl bg-white/20 px-5 py-3">Continue <ArrowRight size={16} className="ml-2 inline" /></button>
            <p className="mt-4 text-xs leading-relaxed text-white/60">Design preview only. No account will be created.</p>
          </form> : <p className="leading-relaxed text-white/80">{information[panel]}</p>}
        </div>
      </dialog>
    </div>
  );
}
