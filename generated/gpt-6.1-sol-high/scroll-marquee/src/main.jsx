import React, { useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

const ROW_ONE = [
  'hero-space-voyage-preview-eECLH3Yc.gif',
  'hero-codenest-preview-Cgppc2qV.gif',
  'hero-vex-ventures-preview-BczMFIiw.gif',
  'hero-stellar-ai-v2-preview-DjvxjG3C.gif',
  'hero-asme-preview-B_nGDnTP.gif',
  'hero-transform-data-preview-Cx5OU29N.gif',
  'hero-vitara-preview-Cjz2QYyU.gif',
  'hero-terra-preview-BFjrCr7T.gif',
  'hero-skyelite-preview-DHaZIgUv.gif',
  'hero-aethera-preview-DknSlcTa.gif',
  'hero-designpro-preview-D8c5_een.gif',
];
const ROW_TWO = [
  'hero-stellar-ai-preview-D3HL6bw1.gif',
  'hero-xportfolio-preview-D4A8maiC.gif',
  'hero-orbit-web3-preview-BXt4OttD.gif',
  'hero-nexora-preview-cx5HmUgo.gif',
  'hero-evr-ventures-preview-DZxeVFEX.gif',
  'hero-planet-orbit-preview-DWAP8Z1P.gif',
  'hero-new-era-preview-CocuDUm9.gif',
  'hero-wealth-preview-B70idl_u.gif',
  'hero-luminex-preview-CxOP7ce6.gif',
  'hero-celestia-preview-0yO3jXO8.gif',
];

function ImageRow({ images, rowRef, initialOffset, name }) {
  return (
    <div className="overflow-hidden w-full">
      <div ref={rowRef} data-row={name} className="flex gap-3" style={{ transform: `translateX(${initialOffset}px)`, willChange: 'transform' }}>
        {[...images, ...images, ...images].map((file, index) => (
          <div className="w-[420px] h-[270px] shrink-0 rounded-2xl overflow-hidden" key={`${file}-${index}`}>
            <img src={`${import.meta.env.BASE_URL}assets/${file}`} alt="" loading="lazy" width="420" height="270" className="w-full h-full object-cover" />
          </div>
        ))}
      </div>
    </div>
  );
}

function ScrollMarquee() {
  const sectionRef = useRef(null);
  const firstRowRef = useRef(null);
  const secondRowRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const sectionTop = sectionRef.current.getBoundingClientRect().top + window.scrollY;
      const scrolled = window.scrollY - sectionTop + window.innerHeight;
      const offset = scrolled * 0.3;
      firstRowRef.current.style.transform = `translateX(${offset - 200}px)`;
      secondRowRef.current.style.transform = `translateX(${-(offset - 200)}px)`;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    handleScroll();
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  return (
    <section ref={sectionRef} aria-label="Scroll-driven design gallery" className="w-full overflow-hidden bg-[#0C0C0C] pt-24 sm:pt-32 md:pt-40 pb-10">
      <div className="flex flex-col gap-3">
        <ImageRow images={ROW_ONE} rowRef={firstRowRef} initialOffset={-200} name="one" />
        <ImageRow images={ROW_TWO} rowRef={secondRowRef} initialOffset={200} name="two" />
      </div>
    </section>
  );
}

function App() {
  return (
    <main>
      <section className="h-screen bg-[#0C0C0C]" aria-label="Hero">
        <h1 className="sr-only">Scroll Marquee</h1>
      </section>
      <ScrollMarquee />
    </main>
  );
}

createRoot(document.getElementById('root')).render(<React.StrictMode><App /></React.StrictMode>);
