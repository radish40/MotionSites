import React, { useEffect, useRef, useState, type CSSProperties } from 'react';
import { createRoot } from 'react-dom/client';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import './index.css';

const IMAGES = [
  { src: 'https://fifth-gentle-45902158.figma.site/_components/v2/4de492f6d9cf8244ad5293233e5c6f52407d42fc/1.02464a56.png', bg: '#F4845F', panel: '#F79B7F' },
  { src: 'https://fifth-gentle-45902158.figma.site/_components/v2/4de492f6d9cf8244ad5293233e5c6f52407d42fc/2.b977faab.png', bg: '#6BBF7A', panel: '#85CC92' },
  { src: 'https://fifth-gentle-45902158.figma.site/_components/v2/4de492f6d9cf8244ad5293233e5c6f52407d42fc/3.4df853b4.png', bg: '#E882B4', panel: '#ED9DC4' },
  { src: 'https://fifth-gentle-45902158.figma.site/_components/v2/4de492f6d9cf8244ad5293233e5c6f52407d42fc/4.4457fbce.png', bg: '#6EB5FF', panel: '#8DC4FF' },
];
const easing = '650ms cubic-bezier(0.4,0,0.2,1)';
const grain = `data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><filter id="noise"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" stitchTiles="stitch"/></filter><rect width="100%" height="100%" opacity="0.08" filter="url(#noise)"/></svg>')}`;

function App() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);
  const animationLock = useRef(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    IMAGES.forEach(({ src }) => { const image = new Image(); image.src = src; });
    const resize = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener('resize', resize);
    return () => { window.removeEventListener('resize', resize); clearTimeout(timer.current); };
  }, []);

  function navigate(direction: 'next' | 'prev') {
    if (isAnimating || animationLock.current) return;
    animationLock.current = true;
    setIsAnimating(true);
    setActiveIndex(previous => (previous + (direction === 'next' ? 1 : 3)) % 4);
    timer.current = setTimeout(() => {
      animationLock.current = false;
      setIsAnimating(false);
    }, 650);
  }

  function roleStyle(index: number): CSSProperties {
    const center = index === activeIndex;
    const left = index === (activeIndex + 3) % 4;
    const right = index === (activeIndex + 1) % 4;
    const back = !center && !left && !right;
    return {
      position: 'absolute', aspectRatio: '0.6 / 1',
      transform: `translateX(-50%) scale(${center ? (isMobile ? 1.25 : 1.68) : 1})`,
      filter: `blur(${center ? 0 : back ? 4 : 2}px)`,
      opacity: center || back ? 1 : 0.85,
      zIndex: center ? 20 : back ? 5 : 10,
      left: center || back ? '50%' : left ? (isMobile ? '20%' : '30%') : (isMobile ? '80%' : '70%'),
      height: center ? (isMobile ? '60%' : '92%') : back ? (isMobile ? '13%' : '22%') : (isMobile ? '16%' : '28%'),
      bottom: center ? (isMobile ? '22%' : 0) : (isMobile ? '32%' : '12%'),
      transition: `transform ${easing}, filter ${easing}, opacity ${easing}, left ${easing}`,
      willChange: 'transform, filter, opacity',
    };
  }

  return (
    <main className="relative w-full overflow-hidden" style={{ backgroundColor: IMAGES[activeIndex].bg, transition: `background-color ${easing}`, fontFamily: 'Inter, sans-serif' }}>
      <div className="relative w-full overflow-hidden" style={{ height: '100vh' }}>
        <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 50, backgroundImage: `url("${grain}")`, opacity: 0.4, backgroundSize: '200px 200px', backgroundRepeat: 'repeat' }} />
        <h1 className="absolute inset-x-0 flex items-center justify-center pointer-events-none select-none uppercase" style={{ zIndex: 2, top: '18%', margin: 0, fontFamily: 'Anton, sans-serif', fontSize: 'clamp(90px, 28vw, 380px)', fontWeight: 900, color: 'white', opacity: 1, lineHeight: 1, letterSpacing: '-0.02em', whiteSpace: 'nowrap' }}>3D SHAPE</h1>
        <div className="absolute top-6 left-4 sm:left-8 text-xs font-semibold uppercase text-white opacity-90" style={{ zIndex: 60, letterSpacing: '0.18em' }}>TOONHUB</div>
        <div className="absolute inset-0" style={{ zIndex: 3 }} aria-label="Figurine carousel" aria-roledescription="carousel" data-active-index={activeIndex} data-animating={isAnimating}>
          {IMAGES.map((item, index) => (
            <div key={item.src} style={roleStyle(index)} data-role={index === activeIndex ? 'center' : index === (activeIndex + 3) % 4 ? 'left' : index === (activeIndex + 1) % 4 ? 'right' : 'back'}>
              <img src={item.src} alt={`TOONHUB collectible figurine ${index + 1}`} draggable={false} className="w-full h-full object-contain select-none" style={{ objectPosition: 'bottom center' }} />
            </div>
          ))}
        </div>
        <div className="absolute bottom-6 left-4 sm:bottom-20 sm:left-24 text-white" style={{ zIndex: 60, maxWidth: 320 }}>
          <p className="font-bold uppercase tracking-widest mb-2 sm:mb-3 text-base sm:text-[22px]" style={{ opacity: 0.95, letterSpacing: '0.02em' }}>TOONHUB FIGURINES</p>
          <p className="hidden sm:block text-xs sm:text-sm mb-4 sm:mb-5" style={{ opacity: 0.85, lineHeight: 1.6 }}>The artwork is stunning, shipped fully prepared. The finish is a vision, the 3D craft is flawless. Many thanks! Wishing you the win. Order now.</p>
          <div className="flex gap-3">
            <button type="button" onClick={() => navigate('prev')} aria-label="Previous figurine" className="carousel-arrow w-12 h-12 sm:w-16 sm:h-16 rounded-full border-2 border-white flex items-center justify-center bg-transparent text-white"><ArrowLeft size={26} strokeWidth={2.25} /></button>
            <button type="button" onClick={() => navigate('next')} aria-label="Next figurine" className="carousel-arrow w-12 h-12 sm:w-16 sm:h-16 rounded-full border-2 border-white flex items-center justify-center bg-transparent text-white"><ArrowRight size={26} strokeWidth={2.25} /></button>
          </div>
        </div>
        <a href={IMAGES[activeIndex].src} target="_blank" rel="noreferrer" className="discover absolute bottom-6 right-4 sm:bottom-20 sm:right-10 flex items-center gap-2 uppercase text-white no-underline" style={{ zIndex: 60, fontFamily: 'Anton, sans-serif', fontSize: 'clamp(20px, 4vw, 56px)', fontWeight: 400, letterSpacing: '-0.02em', lineHeight: 1 }}>
          DISCOVER IT <ArrowRight className="w-5 h-5 sm:w-8 sm:h-8" strokeWidth={2.25} />
        </a>
      </div>
    </main>
  );
}

createRoot(document.getElementById('root')!).render(<React.StrictMode><App /></React.StrictMode>);
