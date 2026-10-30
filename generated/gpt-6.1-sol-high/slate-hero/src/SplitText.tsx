import { useRef } from 'react';
import type { ElementType } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(useGSAP);

type Props = {
  text: string;
  tag?: ElementType;
  delay?: number;
  duration?: number;
  ease?: string;
  splitType?: 'chars' | 'words';
  from?: gsap.TweenVars;
  to?: gsap.TweenVars;
  threshold?: number;
  rootMargin?: string;
  textAlign?: 'left' | 'center' | 'right';
};

export default function SplitText({ text, tag: Tag = 'h1', delay = 60, duration = 0.8,
  ease = 'power3.out', splitType = 'chars', from = { opacity: 0, y: 40 },
  to = { opacity: 1, y: 0 }, threshold = 0.1, rootMargin = '0px', textAlign = 'center' }: Props) {
  const container = useRef<HTMLHeadingElement>(null);
  useGSAP((_context, contextSafe) => {
    const element = container.current;
    if (!element) return;
    const pieces = element.querySelectorAll('.split-piece');
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      gsap.set(pieces, { opacity: 1, y: 0 });
      return;
    }
    gsap.set(pieces, from);
    const animate = contextSafe!(() => {
      gsap.to(pieces, { ...to, duration, ease, stagger: delay / 1000 });
    });
    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) {
        animate();
        observer.disconnect();
      }
    }, { threshold, rootMargin });
    observer.observe(element);
    return () => { observer.disconnect(); };
  }, { scope: container, dependencies: [text, delay, duration, ease, splitType, threshold, rootMargin] });

  return <Tag ref={container} aria-label={text} style={{ textAlign }}>
    <span aria-hidden="true">{text.split(' ').map((word, wordIndex) => (
      <span className="split-word" key={wordIndex}>
        {wordIndex > 0 && <span className="split-space">&nbsp;</span>}
        {splitType === 'chars' ? [...word].map((char, i) => <span className="split-piece" key={i}>{char}</span>) : <span className="split-piece">{word}</span>}
      </span>
    ))}</span>
  </Tag>;
}
