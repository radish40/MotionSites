import { useCallback, useEffect, useRef, useState } from 'react';
import { Home } from 'lucide-react';
import SplashScreen from './SplashScreen';
import ScrollGallery from './ScrollGallery';

const destinations = [{ label: 'About', progress: .78 }, { label: 'Properties', progress: .34 }, { label: 'Work', progress: .64 }, { label: 'Partnership', progress: 1 }, { label: 'Contact', progress: null }];
export default function App() {
  const [splash, setSplash] = useState(true);
  const [menu, setMenu] = useState(false);
  const [closing, setClosing] = useState(false);
  const closeTimer = useRef<number>();
  const toggle = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const email = useRef<HTMLAnchorElement>(null);
  const finishSplash = useCallback(() => setSplash(false), []);
  const closeMenu = useCallback(() => {
    setClosing(true);
    closeTimer.current = window.setTimeout(() => { setMenu(false); setClosing(false); toggle.current?.focus(); }, 300);
  }, []);
  useEffect(() => () => window.clearTimeout(closeTimer.current), []);
  useEffect(() => {
    if (!menu) return;
    panel.current?.querySelector<HTMLButtonElement>('button')?.focus();
    const keydown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeMenu();
      if (event.key === 'Tab') {
        const items = [...(panel.current?.querySelectorAll<HTMLElement>('button, a[href]') ?? []), toggle.current!];
        const first = items[0], last = items[items.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener('keydown', keydown);
    return () => document.removeEventListener('keydown', keydown);
  }, [menu, closeMenu]);
  const navigate = (progress: number | null) => {
    if (progress === null) { email.current?.focus(); return; }
    closeMenu();
    window.scrollTo({ top: progress * (document.documentElement.scrollHeight - window.innerHeight), behavior: 'smooth' });
  };
  return <main className="bg-black h-[900vh]">
    {splash && <SplashScreen onComplete={finishSplash} />}
    <section aria-label="VELORA premium real estate" className="fixed inset-0 h-screen w-full overflow-hidden z-0 flex flex-col">
      <video aria-label="Luxury real estate film" className="absolute inset-0 w-full h-full object-cover" src={`${import.meta.env.BASE_URL}assets/hero.mp4`} autoPlay muted loop playsInline />
      <header className="relative z-10 flex items-center justify-between px-4 sm:px-6 md:px-12 pt-4 sm:pt-6 md:pt-8">
        <div className="w-8 sm:w-32 md:w-40" />
        <a href="#" onClick={e => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }} aria-label="VELORA home" className="font-haboro text-white text-lg sm:text-xl md:text-2xl tracking-[0.2em] uppercase">VELORA</a>
        <div className="w-8 sm:w-32 md:w-40"><button onClick={() => setMenu(true)} className="hidden sm:block bg-white text-black px-4 md:px-6 py-2 md:py-2.5 text-xs md:text-sm font-geist font-medium tracking-wide hover:bg-white/90 transition-colors duration-200 whitespace-nowrap">GET IN TOUCH</button></div>
      </header>
      <div className="relative z-10 flex-1 flex items-center justify-center px-4 sm:px-6">
        <h1 className="font-haboro text-white text-center text-2xl sm:text-3xl md:text-5xl lg:text-6xl xl:text-7xl leading-[1.1] tracking-wide uppercase max-w-5xl">PREMIUM REAL ESTATE FOR<br />INVESTORS BEYOND OWNERSHIP</h1>
      </div>
      <div className="relative flex justify-center pb-4 sm:pb-6 md:pb-10 h-[72px] sm:h-[80px] md:h-[96px]" />
    </section>
    <div className={`fixed ${menu ? 'z-40' : 'z-[5]'} left-1/2 -translate-x-1/2 bottom-4 sm:bottom-6 md:bottom-10`}>
      <div className="relative h-14 bg-black transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] max-w-[85vw]" style={{ width: menu && !closing ? 56 : 280 }}>
        <button aria-label="Back to home" tabIndex={menu ? -1 : 0} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className={`absolute left-6 top-1/2 -translate-y-1/2 transition-opacity duration-200 ${menu && !closing ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}><Home className="w-5 h-5 text-amber-500" /></button>
        <span className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 font-geist text-white text-sm tracking-[0.15em] uppercase font-medium transition-opacity duration-200 ${menu && !closing ? 'opacity-0' : 'opacity-100'}`}>HOME</span>
        <button ref={toggle} aria-label={menu && !closing ? 'Close menu' : 'Open menu'} aria-expanded={menu && !closing} aria-controls="main-menu" onClick={() => menu ? closeMenu() : setMenu(true)} className="absolute right-0 top-0 w-14 h-14 flex items-center justify-center">
          <span className={`absolute h-[1.5px] bg-white transition-all duration-500 ${menu && !closing ? 'w-5 rotate-45' : 'w-6 -translate-y-[3.5px]'}`} />
          <span className={`absolute h-[1.5px] bg-white transition-all duration-500 ${menu && !closing ? 'w-5 -rotate-45' : 'w-6 translate-y-[3.5px]'}`} />
        </button>
      </div>
    </div>
    {menu && <>
      <div onClick={closeMenu} className={`fixed inset-0 z-20 ${closing ? 'menu-overlay-close' : 'menu-overlay-open'}`} />
      <div ref={panel} id="main-menu" role="dialog" aria-modal="true" aria-labelledby="menu-label" className={`fixed z-30 left-1/2 bottom-[80px] sm:bottom-[100px] md:bottom-[120px] w-[92vw] max-w-[480px] bg-black rounded-lg p-6 sm:p-8 md:p-10 max-h-[calc(100dvh-110px)] overflow-y-auto ${closing ? 'menu-close' : 'menu-open'}`}>
        <p id="menu-label" className="font-geist text-neutral-400 text-xs tracking-[0.2em] uppercase mb-6">MENU</p>
        <nav aria-label="Main navigation"><ul className="space-y-1">{destinations.map(({ label, progress }, i) => <li key={label} className="menu-item-enter opacity-0" style={{ animationDelay: `${i * 60 + 100}ms` }}><button onClick={() => navigate(progress)} className="font-haboro text-white text-2xl md:text-3xl lg:text-4xl hover:text-neutral-300 transition-colors duration-200 block py-1">{label}</button></li>)}</ul></nav>
        <div className="mt-8 pt-6 border-t border-neutral-700/50 space-y-3">
          <div className="flex justify-between gap-4 font-geist text-sm"><span className="text-neutral-400">Private line</span><a className="text-white" href="tel:+442081567290">+44 020 8156 7290</a></div>
          <div className="flex justify-between gap-4 font-geist text-sm"><span className="text-neutral-400">Email</span><a ref={email} className="text-white" href="mailto:hello@velora.com">hello@velora.com</a></div>
        </div>
        <a href="mailto:hello@velora.com" className="block text-center w-full mt-6 bg-white text-black py-3 font-geist text-sm font-medium tracking-wide hover:bg-neutral-100 transition-colors duration-200">GET IN TOUCH</a>
      </div>
    </>}
    <ScrollGallery />
  </main>;
}
