import { useEffect, useMemo, useRef, type RefObject } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './ScrollReveal.css';

gsap.registerPlugin(ScrollTrigger);
interface Props {
  children: string;
  scrollContainerRef?: RefObject<HTMLElement | null>;
  enableBlur?: boolean;
  baseOpacity?: number;
  baseRotation?: number;
  blurStrength?: number;
  containerClassName?: string;
  textClassName?: string;
  rotationEnd?: string;
  wordAnimationEnd?: string;
}
export default function ScrollReveal({ children, scrollContainerRef, enableBlur = true, baseOpacity = 0.1, baseRotation = 3, blurStrength = 4, containerClassName = '', textClassName = '', rotationEnd = 'bottom bottom', wordAnimationEnd = 'bottom bottom' }: Props) {
  const containerRef = useRef<HTMLHeadingElement>(null);
  const splitText = useMemo(() => children.split(/(\s+)/).map((word, i) => <span className="word" key={i}>{word}</span>), [children]);
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      const scroller = scrollContainerRef?.current || undefined;
      gsap.fromTo(el, { rotation: baseRotation }, { rotation: 0, transformOrigin: '0% 50%', ease: 'none', scrollTrigger: { trigger: el, scroller, start: 'top bottom', end: rotationEnd, scrub: true } });
      const words = el.querySelectorAll('.word');
      const trigger = { trigger: el, scroller, start: 'top bottom-=20%', end: wordAnimationEnd, scrub: true };
      gsap.fromTo(words, { opacity: baseOpacity }, { opacity: 1, stagger: 0.05, ease: 'none', scrollTrigger: trigger });
      if (enableBlur) gsap.fromTo(words, { filter: `blur(${blurStrength}px)` }, { filter: 'blur(0px)', stagger: 0.05, ease: 'none', scrollTrigger: { ...trigger } });
    }, el);
    return () => ctx.revert();
  }, [scrollContainerRef, enableBlur, baseOpacity, baseRotation, blurStrength, rotationEnd, wordAnimationEnd]);
  return <h2 ref={containerRef} className={`scroll-reveal ${containerClassName}`}><p className={`scroll-reveal-text ${textClassName}`}>{splitText}</p></h2>;
}
