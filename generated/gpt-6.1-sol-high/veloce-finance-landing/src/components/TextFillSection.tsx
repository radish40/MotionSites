import { useEffect, useRef, useState } from 'react';
const text = 'Handle payments fast & sleek! Track expenses, reach targets, unlock insights to make sharper decisions, all in one app';
export default function TextFillSection() {
  const section = useRef<HTMLElement>(null);
  const [fillPercentage, setFillPercentage] = useState(0);
  useEffect(() => {
    const update = () => {
      if (!section.current) return;
      const elementTop = section.current.getBoundingClientRect().top;
      const startFill = window.innerHeight * 0.8;
      const endFill = window.innerHeight * 0.2;
      setFillPercentage(Math.min(100, Math.max(0, ((startFill - elementTop) / (startFill - endFill)) * 100)));
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => { window.removeEventListener('scroll', update); window.removeEventListener('resize', update); };
  }, []);
  return <section ref={section} id="details" aria-label="About veloce" className="mb-[30vh] flex items-center justify-center bg-white px-6 py-24 md:px-16 md:py-32"><div className="relative w-full max-w-2xl text-center"><h2 className="relative font-helvetica-neue text-4xl font-medium leading-tight tracking-[-0.03em] md:text-5xl lg:text-6xl"><span className="block text-[#B8B7BA]">{text}</span><span aria-hidden="true" data-fill={Math.round(fillPercentage)} className="absolute inset-0 bg-gradient-to-r from-[#B56939] via-[#5C3779] to-[#454BBB] bg-clip-text text-transparent" style={{ clipPath: `inset(0 ${100 - fillPercentage}% 0 0)`, transition: 'clip-path 0.1s linear' }}>{text}</span></h2></div></section>;
}
