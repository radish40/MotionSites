import React, { useRef, useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';

const items = [
  { video: 'space-01.mp4', score: '8.7/10', label: 'Pink-helmet astronaut' },
  { video: 'space-02.mp4', score: '9/10', label: 'White-helmet astronaut' },
  { video: 'space-03.mp4', score: '8.2/10', label: 'Little space robot' }
];
const asset = (file) => `${import.meta.env.BASE_URL}assets/${file}`;
function App() {
  const dialog = useRef(null);
  const grid = useRef(null);
  const [selected, setSelected] = useState(null);
  const [reducedMotion, setReducedMotion] = useState(false);
  useEffect(() => {
    const media = matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReducedMotion(media.matches);
    update(); media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);
  useEffect(() => {
    document.querySelectorAll('[data-preview]').forEach(video => {
      if (reducedMotion) video.pause(); else video.play().catch(() => {});
    });
  }, [reducedMotion]);
  useEffect(() => { if (selected) dialog.current.showModal(); }, [selected]);
  return <main>
    <section className="relative py-16 sm:py-24 md:py-32" style={{ backgroundColor: '#010828' }} aria-labelledby="collection-title">
      <div className="max-w-[1831px] mx-auto px-4 sm:px-6 md:px-8">
        <div className="flex flex-col lg:flex-row items-start lg:justify-between gap-6 lg:gap-0 mb-8 sm:mb-12">
          <h2 id="collection-title" className="font-grotesk text-[32px] sm:text-[48px] md:text-[60px] font-normal uppercase leading-[1.05] sm:leading-[1] md:leading-[1]">Collection of<br /><span className="ml-12 sm:ml-24 md:ml-32 inline-block"><span className="font-condiment text-neon text-[36px] sm:text-[52px] md:text-[68px] font-normal normal-case">Space</span> objects</span></h2>
          <button className="group relative flex flex-col items-start" onClick={() => { grid.current.scrollIntoView({behavior: reducedMotion ? 'instant' : 'smooth', block: 'center'}); grid.current.querySelector('button').focus({preventScroll: true}); }} aria-label="See all creators">
            <div className="font-grotesk font-normal uppercase leading-[1.1] flex items-start gap-3"><span className="text-[32px] sm:text-[48px] md:text-[60px] text-white">SEE</span><div className="flex flex-col items-start leading-[0.9]"><span className="text-[20px] sm:text-[28px] md:text-[36px] text-white">ALL</span><span className="text-[20px] sm:text-[28px] md:text-[36px] text-white">CREATORS</span></div></div>
            <div className="w-full h-[6px] sm:h-[8px] md:h-[10px] bg-neon mt-3 sm:mt-4 transition-transform origin-left group-hover:scale-x-90" />
          </button>
        </div>
        <div ref={grid} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" aria-label="Space object collection">
          {items.map(item => <article key={item.video} className="flex flex-col gap-4 group" aria-label={item.label}>
            <div className="liquid-glass rounded-[32px] p-[18px] hover:bg-white/10 transition-all duration-300"><div className="relative rounded-[24px] overflow-hidden pb-[75%]"><video data-preview autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover" aria-label={item.label}><source src={asset(item.video)} type="video/mp4" /></video></div></div>
            <div className="liquid-glass rounded-[20px] px-5 py-4 flex items-center justify-between"><div className="flex flex-col"><span className="font-grotesk text-[14px] uppercase text-cream/70 mb-1">Rarity score:</span><span className="font-grotesk text-[20px] font-normal text-cream">{item.score}</span></div><button aria-label={`View ${item.label}`} onClick={() => setSelected(item)} className="w-[48px] h-[48px] liquid-glass rounded-full flex items-center justify-center hover:scale-110 hover:bg-white/10 transition-all flex-shrink-0"><svg className="w-[18px] h-[18px] text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg></button></div>
          </article>)}
        </div>
      </div>
    </section>
    <dialog ref={dialog} onClose={() => setSelected(null)} onClick={e => { if(e.target === dialog.current) dialog.current.close(); }} aria-label={selected?.label || 'Space object'}>
      {selected && <><div className="flex justify-between items-center gap-4 mb-4"><p className="font-grotesk text-xl uppercase">Rarity score: {selected.score}</p><button className="rounded-full px-3 py-2 hover:bg-white/10" onClick={() => dialog.current.close()} aria-label="Close preview">✕</button></div><video key={selected.video} src={asset(selected.video)} autoPlay={!reducedMotion} muted loop playsInline controls className="w-full rounded-[24px]" /></>}
    </dialog>
  </main>;
}
createRoot(document.getElementById('root')).render(<App />);
