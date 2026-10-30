import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { X } from 'lucide-react';
import './styles.css';

const navigation = ['Story', 'Jobs', 'Message'];
const socials = ['Instagram', 'TikTok', 'YouTube'];
const background = 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260729_022513_486985a2-ac8c-4278-91a8-071dcd9fcaff.png&w=1280&q=85';
const portrait = 'https://stone-expand-60400629.figma.site/_assets/v11/8da570354e86aa0d44ac3e4aa335a72c8e750d68.png';
const delay = (milliseconds: number) => ({ animationDelay: `${milliseconds}ms` });
function imageFallback(event: React.SyntheticEvent<HTMLImageElement>, file: string) {
  const img = event.currentTarget;
  if (!img.dataset.fallback) {
    img.dataset.fallback = 'true';
    img.src = `${import.meta.env.BASE_URL}assets/${file}`;
  }
}

function App() {
  const [open, setOpen] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLElement>(null);
  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const focusTimer = window.setTimeout(() => panel.current?.querySelector<HTMLAnchorElement>('a')?.focus(), 600);
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { setOpen(false); toggle.current?.focus(); }
      if (event.key === 'Tab') {
        const items = [toggle.current, ...Array.from(panel.current?.querySelectorAll<HTMLAnchorElement>('a') ?? [])].filter(Boolean) as HTMLElement[];
        const index = items.indexOf(document.activeElement as HTMLElement);
        event.preventDefault();
        items[(index + (event.shiftKey ? -1 : 1) + items.length) % items.length]?.focus();
      }
    };
    const onResize = () => { if (window.innerWidth >= 640) setOpen(false); };
    window.addEventListener('keydown', onKey);
    window.addEventListener('resize', onResize);
    return () => {
      document.body.style.overflow = previousOverflow;
      clearTimeout(focusTimer);
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('resize', onResize);
    };
  }, [open]);
  const close = () => { setOpen(false); toggle.current?.focus(); };
  const reveal = (ms: number) => ({ transitionDelay: open ? `${ms}ms` : '0ms' });
  return (
    <main>
      <section className="relative h-[100dvh] w-full overflow-hidden bg-[#141414] font-hn text-cream" aria-label="Marcus Bennet portfolio">
        <img src={background} alt="" onError={e => imageFallback(e, 'background.webp')} className="anim-fade-in absolute inset-0 h-full w-full object-cover" />
        <header className="absolute inset-x-0 top-0 z-30 flex items-start justify-between px-6 pt-6 sm:px-10 sm:pt-8">
          <a href="#" className="anim-fade-up font-hn text-lg tracking-wide" style={delay(800)}>Marcus</a>
          <div className="hidden items-start gap-16 sm:flex lg:gap-24">
            <span className="anim-fade-up text-sm" style={delay(900)}>2025</span>
            <nav aria-label="Site index" className="flex flex-col gap-0.5 text-sm">
              {navigation.map((label, i) => <span key={label} className="anim-fade-up" style={delay(1000 + i * 80)}><a href="#" className="transition-opacity duration-300 hover:opacity-60">{label}</a></span>)}
            </nav>
            <nav aria-label="Social links" className="flex flex-col gap-0.5 text-sm">
              {socials.map((label, i) => <span key={label} className="anim-fade-up" style={delay(1150 + i * 80)}><a href="#" className="transition-opacity duration-300 hover:opacity-60">{label}</a></span>)}
            </nav>
          </div>
        </header>
        <div className="anim-fade-up absolute inset-x-0 top-[16vh] z-10 overflow-hidden sm:top-[14vh]" style={delay(500)} aria-label="Marcus — Bennet">
          <div className="marquee flex w-max whitespace-nowrap font-hn text-[16vh] leading-none text-cream sm:text-[26vh]" aria-hidden="true">
            <span className="pr-[6vw]">Marcus &mdash; Bennet&nbsp;</span>
            <span className="pr-[6vw]">Marcus &mdash; Bennet&nbsp;</span>
          </div>
        </div>
        <div className="anim-line absolute inset-x-6 bottom-[5.5rem] z-10 h-0.5 bg-cream sm:inset-x-10 sm:bottom-28" style={delay(1200)} />
        <footer className="absolute inset-x-0 bottom-0 z-30 flex items-end justify-between px-6 pb-5 font-hn text-xs leading-relaxed sm:z-10 sm:px-10 sm:pb-8 sm:text-sm">
          <p className="anim-fade-up" style={delay(1400)}>Visuals Composer<br />Digital Crafter<br />Obsessed by The Office</p>
          <p className="anim-fade-up text-right" style={delay(1550)}>A homage to<br />Marcus Holloway</p>
        </footer>
        <img src={portrait} alt="Portrait" onError={e => imageFallback(e, 'portrait.png')} className="anim-rise-in pointer-events-none absolute inset-0 z-20 h-full w-full object-cover" style={delay(300)} />
        <div className={`fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity duration-500 sm:hidden ${open ? 'opacity-100' : 'pointer-events-none opacity-0'}`} onClick={close} aria-hidden="true" />
        <aside ref={panel} id="mobile-menu" role="dialog" aria-modal={open || undefined} aria-label="Site menu" aria-hidden={!open} inert={!open} className={`drawer fixed inset-y-0 right-0 z-40 w-[80%] max-w-sm bg-[#141414] px-8 py-10 sm:hidden ${open ? 'translate-x-0' : 'translate-x-full'}`}>
          <nav className="mt-20" aria-label="Mobile site index">
            <p className={`drawer-reveal mb-7 text-xs uppercase tracking-[0.2em] text-cream/50 ${open ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`} style={reveal(250)}>Site Index</p>
            <div className="flex flex-col gap-5">
              {navigation.map((label, i) => <a key={label} href="#" onClick={close} className={`drawer-reveal text-4xl ${open ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'}`} style={reveal(300 + i * 80)}>{label}</a>)}
            </div>
          </nav>
          <nav className="mt-16" aria-label="Mobile social links">
            <p className={`drawer-reveal mb-6 text-xs uppercase tracking-[0.2em] text-cream/50 ${open ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`} style={reveal(500)}>Find Me</p>
            <div className="flex flex-wrap gap-5">
              {socials.map((label, i) => <a key={label} href="#" onClick={close} className={`drawer-reveal text-sm ${open ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`} style={reveal(550 + i * 60)}>{label}</a>)}
            </div>
          </nav>
        </aside>
        <div className="anim-fade-up absolute right-6 top-6 z-50 sm:hidden" style={delay(900)}>
          <button ref={toggle} type="button" className="relative flex h-10 w-10 items-center justify-center" aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} aria-controls="mobile-menu" onClick={() => setOpen(value => !value)}>
            <span className={`relative block h-4 w-6 transition-opacity duration-300 ${open ? 'opacity-0' : 'opacity-100'}`} aria-hidden="true">
              <span className={`hamburger-bar absolute left-0 top-0 h-px w-6 bg-cream ${open ? 'translate-y-[7.5px] rotate-45' : ''}`} />
              <span className={`absolute left-0 top-1/2 h-px w-6 bg-cream transition-opacity duration-300 ${open ? 'opacity-0' : 'opacity-100'}`} />
              <span className={`hamburger-bar absolute bottom-0 left-0 h-px w-6 bg-cream ${open ? '-translate-y-[7.5px] -rotate-45' : ''}`} />
            </span>
            <X size={26} strokeWidth={1.5} aria-hidden="true" className={`absolute transition-all duration-500 ${open ? 'rotate-0 opacity-100 delay-300' : 'rotate-90 opacity-0'}`} />
          </button>
        </div>
      </section>
    </main>
  );
}

createRoot(document.getElementById('root')!).render(<React.StrictMode><App /></React.StrictMode>);
