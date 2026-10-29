import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Atom } from 'lucide-react';
import './index.css';

const navigation = [
  { label: 'our studio', href: '#studio' },
  { label: 'expertise', href: '#expertise' },
  { label: 'projects', href: '#partners' },
  { label: 'get in touch', href: '#contact' },
];

function App() {
  const [activeVideo, setActiveVideo] = useState<1 | 2>(1);
  const [menuOpen, setMenuOpen] = useState(false);
  const heroVideo = useRef<HTMLVideoElement>(null);
  const studioVideo = useRef<HTMLVideoElement>(null);
  const studioSection = useRef<HTMLElement>(null);
  const menuButton = useRef<HTMLButtonElement>(null);
  const menu = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setActiveVideo(2);
        if (studioVideo.current) {
          studioVideo.current.currentTime = 0;
          void studioVideo.current.play().catch(() => {});
        }
      } else {
        setActiveVideo(1);
        void heroVideo.current?.play().catch(() => {});
      }
    }, { threshold: 0.15 });
    if (studioSection.current) observer.observe(studioSection.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const closeOnDesktop = () => { if (window.innerWidth >= 768) setMenuOpen(false); };
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMenuOpen(false);
        menuButton.current?.focus();
      }
      if (event.key === 'Tab') {
        const targets = [menuButton.current, ...Array.from(menu.current?.querySelectorAll('a') ?? [])].filter(Boolean) as HTMLElement[];
        const index = targets.indexOf(document.activeElement as HTMLElement);
        if (event.shiftKey && index <= 0) {
          event.preventDefault(); targets[targets.length - 1]?.focus();
        } else if (!event.shiftKey && index === targets.length - 1) {
          event.preventDefault(); targets[0]?.focus();
        }
      }
    };
    window.addEventListener('keydown', handleKey);
    window.addEventListener('resize', closeOnDesktop);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener('keydown', handleKey);
      window.removeEventListener('resize', closeOnDesktop);
    };
  }, [menuOpen]);

  return (
    <>
      <div className="fixed inset-0 z-0 bg-black" aria-hidden="true">
        <video ref={heroVideo} muted playsInline autoPlay loop preload="auto" className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-in-out" style={{ opacity: activeVideo === 1 ? 1 : 0 }} src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260703_152235_56f10620-8704-4c63-8ddd-f146a7085404.mp4" />
        <video ref={studioVideo} muted playsInline loop preload="auto" className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-in-out" style={{ opacity: activeVideo === 2 ? 1 : 0 }} src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260703_075205_41edc37d-b74b-4c8c-a1e2-2b7879cb4386.mp4" />
      </div>

      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-5 md:px-10 lg:px-14">
        <a href="#home" aria-label="KineticForge home" className="flex items-center gap-2" onClick={() => setMenuOpen(false)}>
          <Atom className="w-6 h-6 text-white" strokeWidth={1.5} />
          <span className="text-white text-base font-medium tracking-tight">KineticForge</span>
        </a>
        <nav aria-label="Main navigation" className="hidden md:flex items-center gap-8 text-white/80 text-sm font-light">
          {navigation.map(item => <a key={item.label} href={item.href} className="hover:text-white transition-colors cursor-pointer">{item.label}</a>)}
        </nav>
        <button ref={menuButton} aria-label={menuOpen ? 'Close menu' : 'Open menu'} aria-expanded={menuOpen} aria-controls="mobile-menu" onClick={() => setMenuOpen(!menuOpen)} className="md:hidden text-white relative w-6 h-6 flex items-center justify-center z-50">
          <span className={`absolute w-5 h-[1.5px] bg-white transition-all duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)] ${menuOpen ? 'rotate-45 translate-y-0' : '-translate-y-[5px]'}`} />
          <span className={`absolute w-5 h-[1.5px] bg-white transition-all duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)] ${menuOpen ? '-rotate-45 translate-y-0' : 'translate-y-[5px]'}`} />
        </button>
      </header>

      <div ref={menu} id="mobile-menu" aria-hidden={!menuOpen} className={`fixed inset-0 z-40 bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center gap-8 md:hidden transition-all duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] ${menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        {navigation.map((item, i) => <a key={item.label} href={item.href} tabIndex={menuOpen ? 0 : -1} onClick={() => setMenuOpen(false)} className={`text-white text-2xl font-light tracking-wide cursor-pointer hover:text-white/70 transition-all duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] ${menuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`} style={{ transitionDelay: menuOpen ? `${100 + i * 75}ms` : '0ms' }}>{item.label}</a>)}
      </div>

      <main className="relative z-10">
        <section id="home" className="h-screen w-full flex flex-col items-center justify-center px-6 text-center">
          <h1 className="text-white text-4xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-normal leading-[1.1] tracking-[-0.06em] max-w-5xl">Transforming the<br />online interaction<br />since 2001</h1>
          <p className="mt-6 sm:mt-8 text-white/70 text-sm sm:text-lg font-light max-w-lg leading-relaxed">A Vancouver digital studio Specializing<br className="hidden sm:block" />{' '}in Web Products and Interface Design</p>
        </section>

        <section ref={studioSection} id="studio" className="min-h-screen w-full">
          <div className="flex flex-col lg:flex-row min-h-screen">
            <div className="flex-1 flex flex-col justify-between px-6 pt-24 pb-12 md:px-10 lg:px-14 lg:pt-28 lg:pb-20">
              <h2 id="expertise" className="text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-normal leading-[1.1] tracking-[-0.06em] max-w-lg">We craft award<br />winning platforms<br />and tools</h2>
              <div className="mt-10 lg:mt-0">
                <div className="max-w-sm space-y-5">
                  <p className="text-white/60 text-xs sm:text-sm leading-relaxed font-light">With studios in Vancouver, Montreal and Berlin, we design and develop full-scale digital products that generate real outcomes, cut costs, boost engagement and grow revenue.</p>
                  <p id="contact" className="text-white/60 text-xs sm:text-sm leading-relaxed font-light">For over 23 years, Kinetic Forge has partnered with organizations large and small with a roster that features some of the most recognized names worldwide. We're always eager to arrange a meeting to explore your next venture so don't hesitate to reach out for a free consultation or quote!</p>
                </div>
                <a href="#contact" className="inline-block mt-6 sm:mt-8 border border-white/30 text-white text-xs sm:text-sm font-light px-5 sm:px-6 py-2.5 sm:py-3 rounded-sm hover:bg-white/10 transition-colors">Learn more here</a>
              </div>
            </div>
            <div id="partners" className="flex-1 flex flex-col justify-end px-6 pb-12 md:px-10 lg:px-14 lg:pb-20">
              <p className="text-white/60 text-xs sm:text-sm font-light mb-6 sm:mb-8">Partners we're proud to work with</p>
              <div className="grid grid-cols-2 gap-x-8 sm:gap-x-12 gap-y-8 sm:gap-y-10 max-w-md text-white">
                <div className="flex items-center justify-start"><span className="text-white text-xl sm:text-3xl font-bold tracking-widest">NASA</span></div>
                <div className="flex items-center justify-start"><span className="text-white text-xl sm:text-3xl font-medium tracking-tight">Google</span></div>
                <div className="flex items-center gap-2 sm:gap-3">
                  <svg viewBox="0 0 24 24" aria-hidden="true" className="w-6 h-6 sm:w-8 sm:h-8 shrink-0" fill="currentColor"><path d="M18.6,6.62C17.16,6.62 15.8,7.18 14.83,8.15L7.8,14.39C7.16,15.03 6.31,15.38 5.4,15.38C3.53,15.38 2,13.87 2,12C2,10.13 3.53,8.62 5.4,8.62C6.31,8.62 7.16,8.97 7.84,9.65L8.97,10.65L10.5,9.31L9.22,8.2C8.2,7.18 6.84,6.62 5.4,6.62C2.42,6.62 0,9.04 0,12C0,14.96 2.42,17.38 5.4,17.38C6.84,17.38 8.2,16.82 9.17,15.85L16.2,9.61C16.84,8.97 17.69,8.62 18.6,8.62C20.47,8.62 22,10.13 22,12C22,13.87 20.47,15.38 18.6,15.38C17.69,15.38 16.84,15.03 16.16,14.35L15.03,13.34L13.5,14.68L14.78,15.8C15.8,16.82 17.16,17.38 18.6,17.38C21.58,17.38 24,14.96 24,12C24,9.04 21.58,6.62 18.6,6.62Z" /></svg>
                  <span className="text-[10px] sm:text-xs font-light">Canadian<br />Digital Service</span>
                </div>
                <div className="flex items-center gap-2 sm:gap-3">
                  <svg viewBox="0 0 24 24" aria-hidden="true" className="w-8 h-8 sm:w-10 sm:h-10 shrink-0" stroke="currentColor" strokeWidth="0.8" fill="none"><circle cx="12" cy="12" r="10" /><ellipse cx="12" cy="12" rx="4" ry="10" /><path d="M4 7H20M2 12H22M4 17H20" /></svg>
                  <span className="text-[10px] sm:text-xs font-light">United Nations</span>
                </div>
                <div className="flex items-center gap-2 sm:gap-3">
                  <svg viewBox="0 0 24 24" aria-hidden="true" className="w-5 h-5 sm:w-7 sm:h-7 shrink-0" fill="currentColor"><path d="M12 2L9.5 8.5H2L8 12.5L5.5 19L12 15L18.5 19L16 12.5L22 8.5H14.5L12 2Z" /></svg>
                  <span className="text-xs sm:text-sm font-light">Canada</span>
                </div>
                <div className="flex items-center gap-2 sm:gap-3"><span className="text-base sm:text-lg font-bold">mn</span><span className="text-[10px] sm:text-xs font-light">Department of<br />Administration</span></div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

createRoot(document.getElementById('root')!).render(<React.StrictMode><App /></React.StrictMode>);
