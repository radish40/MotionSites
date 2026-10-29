import React, { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom/client';
import { Grid3X3, Menu, X } from 'lucide-react';
import './index.css';

function Logo({ className }: { className?: string }) {
  return <svg aria-hidden="true" className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor"><path d="M 156 0 C 211.228 0 256 44.772 256 100 L 256 256 L 100 256 C 44.772 256 0 211.228 0 156 L 0 0 Z M 80 80 C 80 133.019 122.981 176 176 176 C 176 122.981 133.019 80 80 80 Z" /></svg>;
}

const links = [
  { label: 'Work', href: '#work' },
  { label: 'Studio', href: '#studio' },
  { label: 'Connect', href: '#connect' },
  { label: 'Enter', href: '#studio' },
];
const asset = (name: string) => `${import.meta.env.BASE_URL}assets/${name}`;

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const dialog = useRef<HTMLDivElement>(null);
  const projects = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    closeButton.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { setMenuOpen(false); menuButton.current?.focus(); }
      if (event.key === 'Tab') {
        const nodes = dialog.current?.querySelectorAll<HTMLElement>('button, a');
        if (!nodes?.length) return;
        const first = nodes[0], last = nodes[nodes.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [menuOpen]);

  const closeMenu = () => { setMenuOpen(false); menuButton.current?.focus(); };

  return <div className="relative flex h-screen w-full flex-col overflow-hidden bg-black font-vilsuve text-white">
    <video aria-label="Atmospheric sculptural architecture" className="absolute inset-0 h-full w-full object-cover" src={asset('architecture.mp4')} autoPlay muted loop playsInline />
    <div className="relative z-10 flex min-h-0 flex-1 flex-col" inert={menuOpen ? '' : undefined}>
      <header className="relative z-10 flex items-center justify-between px-5 py-5 sm:px-6 md:px-12 md:py-6">
        <div className="flex items-center gap-12">
          <a href="#studio" aria-label="Obsidian studio home" className="rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-8"><Logo className="h-6 w-6 text-white" /></a>
          <nav aria-label="Main navigation" className="hidden items-center gap-8 text-sm md:flex">
            {links.slice(0, 3).map(({ label, href }, i) => <a key={label} href={href} className={`transition-colors hover:text-white ${i === 0 ? 'text-white' : 'text-white/70'}`}>{label}</a>)}
          </nav>
        </div>
        <div className="flex items-center gap-7">
          <a href="#studio" className="hidden text-sm text-white/70 transition-colors hover:text-white md:block">Enter</a>
          <button ref={menuButton} type="button" aria-label="Open menu" aria-expanded={menuOpen} aria-controls="navigation-menu" onClick={() => setMenuOpen(true)} className="-m-2 rounded p-2 text-white/80 transition-colors hover:text-white"><Menu size={22} strokeWidth={1.5} /></button>
        </div>
      </header>
      <main className="relative min-h-0 flex-1 px-5 sm:px-6 md:px-12">
        <div id="studio" className="max-w-lg pt-4 sm:pt-8 md:pt-16">
          <h1 className="text-3xl font-normal leading-[0.95] tracking-tight text-white sm:text-4xl sm:leading-[0.95] md:text-6xl md:leading-[0.95] lg:text-7xl lg:leading-[0.95]">Shape your<br />bold spaces</h1>
          <p id="connect" className="mt-6 max-w-xs text-xs leading-relaxed text-white/60 sm:mt-8 sm:text-sm md:text-base">Designing bold forms, sculpting purposeful structures, and building a timeless legacy for all.</p>
          <button type="button" onClick={() => projects.current?.focus()} className="mt-6 inline-flex items-center gap-3 rounded-full border border-white/30 px-5 py-2.5 text-xs transition-colors hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 sm:mt-8 sm:px-6 sm:py-3 sm:text-sm"><Grid3X3 className="h-4 w-4" strokeWidth={1.5} />Our Projects</button>
        </div>
        <div ref={projects} tabIndex={-1} id="work" aria-label="Selected projects" className="absolute bottom-6 right-5 grid grid-cols-2 gap-3 rounded-2xl focus:outline-none focus-visible:ring-1 focus-visible:ring-white/60 focus-visible:ring-offset-8 focus-visible:ring-offset-transparent sm:bottom-8 sm:right-6 sm:gap-4 md:bottom-12 md:right-12 md:gap-5">
          <article className="relative col-start-1 row-start-1 aspect-square w-36 self-end overflow-hidden rounded-xl sm:w-44 sm:rounded-2xl md:w-52 lg:w-60">
            <img className="absolute inset-0 h-full w-full object-cover" src={asset('craft.webp')} alt="Textured dark architectural form suspended in a sculptural landscape" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
            <div className="relative flex h-full flex-col justify-end p-4 sm:p-5"><p className="mb-2 text-[10px] text-white/60 sm:text-xs">CRAFT</p><h2 className="pr-1 text-sm font-semibold leading-snug sm:text-base md:text-lg">Spaces shaped with intention.</h2><Grid3X3 aria-hidden="true" className="mt-3 h-4 w-4 self-end text-white/70 sm:mt-4" strokeWidth={1.5} /></div>
          </article>
          <article className="relative col-start-2 row-start-2 aspect-square w-36 overflow-hidden rounded-xl sm:w-44 sm:rounded-2xl md:w-52 lg:w-60">
            <img className="absolute inset-0 h-full w-full object-cover" src={asset('arcvault.webp')} alt="Layered stone forms rising from a dark terrain" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
            <div className="relative flex h-full flex-col justify-end p-4 sm:p-5"><p className="mb-2 text-[10px] text-white/60 sm:text-xs">ARCVAULT</p><h2 className="text-base font-semibold leading-snug sm:text-xl md:text-2xl">Form in Stone</h2><Grid3X3 aria-hidden="true" className="mt-3 h-4 w-4 self-end text-white/70 sm:mt-4" strokeWidth={1.5} /></div>
          </article>
        </div>
        <div className="absolute right-[30%] top-[25%] hidden items-center gap-2 lg:flex"><span className="h-1 w-1 rounded-full bg-white" /><div className="text-xs">Concrete Atrium<span className="block text-[10px] text-white/50">282 M</span></div></div>
        <div className="absolute right-[15%] top-[45%] hidden items-center gap-2 lg:flex"><span className="h-1 w-1 rounded-full bg-white" /><div className="text-xs">Brutalist Arc<span className="block text-[10px] text-white/50">67%</span></div></div>
        <span className="absolute bottom-8 left-1/2 hidden rotate-180 text-[10px] uppercase tracking-[0.3em] text-white/40 md:flex" style={{ writingMode: 'vertical-rl' }}>Scroll</span>
      </main>
    </div>
    <div ref={dialog} id="navigation-menu" role="dialog" aria-modal={menuOpen ? true : undefined} aria-label="Navigation menu" aria-hidden={!menuOpen} inert={!menuOpen ? '' : undefined} className={`fixed inset-0 z-50 bg-black/90 backdrop-blur-xl transition-opacity duration-500 ${menuOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'}`}>
      <div className={`flex h-full flex-col px-5 sm:px-6 md:px-12 transition-transform duration-500 ease-out ${menuOpen ? 'translate-y-0' : '-translate-y-8'}`}>
        <div className="flex items-center justify-between py-5 md:py-6"><Logo className="h-6 w-6 text-white" /><button ref={closeButton} type="button" aria-label="Close menu" onClick={closeMenu} className="-m-2 rounded p-2 text-white/80 transition-colors hover:text-white"><X size={24} strokeWidth={1.5} /></button></div>
        <nav aria-label="Overlay navigation" className="mx-auto flex w-full max-w-xl flex-1 flex-col justify-center">
          {links.map(({ label, href }, i) => <a key={label} href={href} onClick={closeMenu} style={{ transitionDelay: menuOpen ? `${150 + i * 75}ms` : '0ms' }} className={`border-b border-white/10 py-5 text-4xl font-light transition-all duration-500 ease-out hover:text-white/60 ${menuOpen ? 'translate-y-0 opacity-100' : '-translate-y-8 opacity-0'}`}>{label}</a>)}
        </nav>
        <p style={{ transitionDelay: menuOpen ? '450ms' : '0ms' }} className={`py-8 text-xs text-white/40 transition-opacity duration-500 ${menuOpen ? 'opacity-100' : 'opacity-0'}`}>Crafting bold spaces for an intentional world.</p>
      </div>
    </div>
  </div>;
}

ReactDOM.createRoot(document.getElementById('root')!).render(<React.StrictMode><App /></React.StrictMode>);
