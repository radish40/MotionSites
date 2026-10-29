import { useEffect, useState } from 'react';
const clamp = (v: number) => Math.max(0, Math.min(1, v));
const phase = (p: number, start: number, end: number) => clamp((p - start) / (end - start));
export default function ScrollGallery() {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    let frame = 0;
    const update = () => { cancelAnimationFrame(frame); frame = requestAnimationFrame(() => setProgress(clamp(window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)))); };
    update(); window.addEventListener('scroll', update, { passive: true }); window.addEventListener('resize', update);
    return () => { cancelAnimationFrame(frame); window.removeEventListener('scroll', update); window.removeEventListener('resize', update); };
  }, []);
  const expand = phase(progress, .06, .16);
  const eased = expand < .5 ? 4 * expand ** 3 : 1 - Math.pow(-2 * expand + 2, 3) / 2;
  const width = progress <= .06 ? `${phase(progress, 0, .06) * 50}px` : `calc(50px + (100vw - 50px) * ${eased})`;
  const morph = phase(progress, .78, .9);
  const shade = Math.round(morph * 255);
  const textScale = phase(progress, .64, .78);
  return <div aria-label="Real estate gallery" data-progress={progress.toFixed(3)} className="fixed inset-0 z-10 pointer-events-none" style={{ visibility: progress > 0 ? 'visible' : 'hidden' }}>
    <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 bg-black" style={{ width }} />
    {[[.16, .34], [.34, .50], [.50, .64]].map(([start, end], i) => {
      const p = phase(progress, start, end);
      return <div key={i} className="absolute inset-0 flex items-center justify-center" style={{ visibility: progress > start ? 'visible' : 'hidden' }}>
        <img src={`${import.meta.env.BASE_URL}assets/gallery-${i + 1}.webp`} alt={['An exceptional contemporary coastal residence', 'A private luxury residence surrounded by nature', 'Refined architectural spaces for extraordinary living'][i]} className="w-[85vw] h-auto max-w-[900px] aspect-[16/10] rounded-lg sm:w-full sm:h-full sm:max-w-none sm:aspect-auto sm:rounded-none object-cover" style={{ transform: `scale(${.2 + p * .8})`, opacity: Math.min(1, p * 4) }} />
      </div>;
    })}
    <div className="absolute inset-0 flex items-center justify-center" style={{ backgroundColor: `rgb(${shade}, ${shade}, ${shade})`, transform: `scale(${.2 + textScale * .8})`, opacity: Math.min(1, textScale * 4), visibility: progress > .64 ? 'visible' : 'hidden' }}>
      <p className="font-geist font-light text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-center leading-[1.3] max-w-3xl px-6 text-white" style={{ opacity: 1 - morph }}>Access exceptional real estate opportunities <span className="text-amber-500">worldwide.</span></p>
      <p className="absolute font-geist font-light text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-center leading-[1.3] max-w-3xl px-6 text-neutral-800" style={{ opacity: phase(progress, .9, 1) }}>Built on trust and <span className="text-amber-500">expertise.</span></p>
    </div>
  </div>;
}
